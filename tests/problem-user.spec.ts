import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { customer } from '../data/checkout';

test.describe('Problem User - Degraded UX', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsProblemUser();
  });

  test('should log in successfully', async ({ page }) => {
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should display inventory with 6 items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('sort Z to A does not reorder items (known bug)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    const expectedZA = [...names].sort((a, b) => b.localeCompare(a));
    // Invert this assertion if the upstream sort bug is ever fixed
    expect(names).not.toEqual(expectedZA);
  });

  test('sort by price low to high does not reorder items (known bug)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    const isSorted = prices.every((p, i) => i === 0 || p >= prices[i - 1]);
    // Invert this assertion if the upstream sort bug is ever fixed
    expect(isSorted).toBe(false);
  });

  // problem_user's last name field silently ignores input — fillCustomerInfo succeeds
  // but the form cannot advance to step 2, causing this test to fail as expected.
  test('filling customer info fails silently — known bug', async ({ page }) => {
    test.fail(true, 'problem_user last name field silently drops input — remove once upstream bug is fixed');

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continue();
    await expect(page).toHaveURL('/checkout-step-two.html');
  });

});

test.describe('Performance Glitch User', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsPerformanceGlitchUser();
    await expect(page).toHaveURL('/inventory.html', { timeout: 15000 });
  });

  test('should log in successfully despite artificial delay', async ({ page }) => {
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should display a working inventory after slow login', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

});
