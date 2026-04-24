import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Navigation - Burger Menu', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('should logout and redirect to login page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
    const loginPage = new LoginPage(page);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should not allow access to inventory after logout', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.logout();
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
  });

  test('should reset cart state via burger menu', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.resetAppState();
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should navigate back to inventory via All Items link', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL('/cart.html');

    await inventoryPage.navigateToAllItems();
    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('should close burger menu without navigating', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.openBurgerMenu();
    await expect(inventoryPage.burgerMenuLogout).toBeVisible();

    await inventoryPage.closeBurgerMenu();
    await expect(inventoryPage.burgerMenuLogout).not.toBeVisible();
    await expect(page).toHaveURL('/inventory.html');
  });

});
