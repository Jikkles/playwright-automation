import { test, expect } from '../fixtures';

test.describe('Navigation - Burger Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('should logout and redirect to login page', async ({ page, inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should not allow access to inventory after logout', async ({ page, inventoryPage }) => {
    await inventoryPage.logout();
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
  });

  test('should reset cart state via burger menu', async ({ inventoryPage }) => {
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.resetAppState();
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('should navigate back to inventory via All Items link', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.goToCart();
    await expect(page).toHaveURL('/cart.html');
    await cartPage.navigateToAllItems();
    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('should close burger menu without navigating', async ({ page, inventoryPage }) => {
    await inventoryPage.openBurgerMenu();
    await expect(inventoryPage.burgerMenuLogout).toBeVisible();
    await inventoryPage.closeBurgerMenu();
    await expect(inventoryPage.burgerMenuLogout).toBeHidden();
    await expect(page).toHaveURL('/inventory.html');
  });

  test(
    'should display all menu options when burger menu is opened',
    { tag: '@smoke' },
    async ({ inventoryPage }) => {
      // Menu items are rendered but hidden via CSS until the burger is opened
      await expect(inventoryPage.burgerMenuAllItems).toBeHidden();
      await expect(inventoryPage.burgerMenuReset).toBeHidden();
      await expect(inventoryPage.burgerMenuLogout).toBeHidden();
      await inventoryPage.openBurgerMenu();
      await expect(inventoryPage.burgerMenuAllItems).toBeVisible();
      await expect(inventoryPage.burgerMenuReset).toBeVisible();
      await expect(inventoryPage.burgerMenuLogout).toBeVisible();
      // Note: the About link is intentionally excluded — no locator exists in BasePage for it
    }
  );
});
