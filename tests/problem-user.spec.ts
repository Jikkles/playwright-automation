import { test, expect } from '../fixtures';
import { customer } from '../data/checkout';

test.describe('Problem User - Degraded UX', () => {
  // These tests log in as non-standard users — clear stored auth so each test controls its own session.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsProblemUser();
  });

  test('should log in successfully', async ({ page }) => {
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should display inventory with 6 items', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('sort Z to A does not reorder items (known bug)', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    const expectedZA = [...names].sort((a, b) => b.localeCompare(a));
    // Invert this assertion if the upstream sort bug is ever fixed
    expect(names).not.toEqual(expectedZA);
  });

  test('sort by price low to high does not reorder items (known bug)', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    const isSorted = prices.every((p, i) => i === 0 || p >= prices[i - 1]);
    // Invert this assertion if the upstream sort bug is ever fixed
    expect(isSorted).toBe(false);
  });

  // problem_user's last name field silently ignores input — fillCustomerInfo succeeds
  // but the form cannot advance to step 2, causing this test to fail as expected.
  test('filling customer info fails silently — known bug', async ({ page, inventoryPage, cartPage, checkoutPage }) => {
    test.fail(true, 'problem_user last name field silently drops input — remove once upstream bug is fixed');

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continue();
    await expect(page).toHaveURL('/checkout-step-two.html');
  });

});

test.describe('Performance Glitch User', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsPerformanceGlitchUser();
    await expect(page).toHaveURL('/inventory.html', { timeout: 15000 });
  });

  test('should log in successfully despite artificial delay', async ({ page }) => {
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should display a working inventory after slow login', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

});
