import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { credentials } from '../data/credentials';

test.describe('Login Page', () => {

  test('should load the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginLogo).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should display the login container', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.loginContainer).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL('/inventory.html');

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessageText();
    expect(errorText).toContain('Username and password do not match');
  });

  test('should show error for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginAsLockedOutUser();
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessageText();
    expect(errorText).toContain('Sorry, this user has been locked out');
  });

  test('should show error when username is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('', credentials.standardUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessageText();
    expect(errorText).toContain('Username is required');
  });

  test('should show error when password is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(credentials.standardUser.username, '');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessageText();
    expect(errorText).toContain('Password is required');
  });

  test('should dismiss error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await loginPage.dismissError();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

});
