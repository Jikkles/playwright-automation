import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Login Page', () => {

  test('should load the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL('/');
  });

  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL('/inventory.html');
    
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

});
