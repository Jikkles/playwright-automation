import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Add to Cart', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('should add a single item to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();

    await expect(inventoryPage.cartBadge).toBeVisible();
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  });

  test('should add all items to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const totalItems = await inventoryPage.getInventoryItemCount();

    for (let i = 0; i < totalItems; i++) {
      await inventoryPage.addToCartButtons.first().click();
    }

    expect(await inventoryPage.getCartBadgeCount()).toBe(String(totalItems));
  });

  test('should update cart badge count as items are added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCartButtons.first().click();
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');

    await inventoryPage.addToCartButtons.first().click();
    expect(await inventoryPage.getCartBadgeCount()).toBe('2');

    await inventoryPage.addToCartButtons.first().click();
    expect(await inventoryPage.getCartBadgeCount()).toBe('3');
  });

  test('should change button text to Remove after adding item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();

    await expect(inventoryPage.removeFromCartButtons.first()).toBeVisible();
    await expect(inventoryPage.addToCartButtons).toHaveCount(5);
  });

  test('added items should appear in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const itemNames = await inventoryPage.getItemNames();
    await inventoryPage.addToCartButtons.first().click();
    await inventoryPage.addToCartButtons.first().click();

    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    expect(await cartPage.getCartItemCount()).toBe(2);

    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).toContain(itemNames[0]);
    expect(cartItemNames).toContain(itemNames[1]);
  });

  test('should not show cart badge when no items added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should persist cart contents after navigating back from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.continueShopping();

    await expect(page).toHaveURL('/inventory.html');
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  });

});
