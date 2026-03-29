import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Inventory Page', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('should display inventory items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('should add item to cart and view it', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await inventoryPage.addFirstItemToCart();
    const badgeCount = await inventoryPage.getCartBadgeCount();
    await expect(badgeCount).toBe('1');
    
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart/);
    
    const cartPage = new CartPage(page);
    const itemCount = await cartPage.getCartItemCount();
    await expect(itemCount).toBe(1);
  });

});
