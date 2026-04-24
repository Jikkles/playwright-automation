import { test, expect } from '../fixtures';

test.describe('Error User - Degraded UX', () => {
  // These tests log in as a non-standard user — clear stored auth so each test controls its own session.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsErrorUser();
  });

  test('should log in successfully', async ({ page }) => {
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should display inventory with 6 items', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('adding item to cart does not update badge (known bug)', async ({ inventoryPage }) => {
    test.fixme(
      true,
      'error_user add-to-cart silently fails for some items — badge does not increment. Remove fixme once upstream is fixed.'
    );
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('sort Z to A does not reorder items (known bug)', async ({ inventoryPage }) => {
    test.fixme(
      true,
      'error_user sort is broken — items remain in default order. Remove fixme once upstream is fixed.'
    );
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    const expectedZA = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(expectedZA);
  });
});
