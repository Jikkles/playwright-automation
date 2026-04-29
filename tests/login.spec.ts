import { test, expect } from '../fixtures';
import { credentials } from '../data/credentials';

test.describe('Login Page', () => {
  // This suite tests the login flow itself — clear stored auth so tests start unauthenticated.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should load the login page', { tag: '@smoke' }, async ({ page, loginPage }) => {
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginLogo).toBeVisible();
    await expect(loginPage.loginContainer).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test(
    'should login with valid credentials',
    { tag: '@smoke' },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.loginAsStandardUser();
      await expect(page).toHaveURL('/inventory.html');
      await expect(inventoryPage.inventoryContainer).toBeVisible();
    }
  );

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.loginAsLockedOutUser();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('should show error when username is missing', async ({ loginPage }) => {
    await loginPage.login('', credentials.standardUser.password);
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('should show error when password is missing', async ({ loginPage }) => {
    await loginPage.login(credentials.standardUser.username, '');
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('should dismiss error message', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await loginPage.dismissError();
    await expect(loginPage.errorMessage).toBeHidden();
  });

  test(
    'should show error for valid username with wrong password',
    { tag: '@regression' },
    async ({ loginPage }) => {
      await loginPage.login(credentials.standardUser.username, 'wrong_password');
      await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    }
  );

  test(
    'should show error for whitespace-only username',
    { tag: '@regression' },
    async ({ loginPage }) => {
      // SauceDemo does not trim whitespace — '   ' is treated as a username that does not match any user
      await loginPage.login('   ', credentials.standardUser.password);
      await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    }
  );

  test(
    'should show error for whitespace-only password',
    { tag: '@regression' },
    async ({ loginPage }) => {
      await loginPage.login(credentials.standardUser.username, '   ');
      await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    }
  );

  test(
    'should handle extremely long credentials without crashing',
    { tag: '@regression' },
    async ({ page, loginPage }) => {
      const longString = 'a'.repeat(500);
      await loginPage.login(longString, longString);
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(page).toHaveURL('/');
    }
  );

  test(
    'error message should be hidden on initial page load',
    { tag: '@regression' },
    async ({ loginPage }) => {
      await expect(loginPage.errorMessage).toBeHidden();
    }
  );
});
