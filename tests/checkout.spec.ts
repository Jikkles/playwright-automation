import { test, expect } from '../fixtures';
import { customer } from '../data/checkout';

test.describe('Checkout', () => {

  test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
  });

  test.describe('Step 1 - Customer Information', () => {

    test('should show error when first name is missing', async ({ checkoutPage }) => {
      await checkoutPage.fillCustomerInfo('', customer.lastName, customer.postalCode);
      await checkoutPage.continue();
      await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });

    test('should show error when last name is missing', async ({ checkoutPage }) => {
      await checkoutPage.fillCustomerInfo(customer.firstName, '', customer.postalCode);
      await checkoutPage.continue();
      await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
    });

    test('should show error when postal code is missing', async ({ checkoutPage }) => {
      await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, '');
      await checkoutPage.continue();
      await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    });

    test('should advance to step 2 with valid info @smoke', async ({ page, checkoutPage }) => {
      await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
      await checkoutPage.continue();
      await expect(page).toHaveURL('/checkout-step-two.html');
    });

    test('should cancel and return to cart', async ({ page, checkoutPage }) => {
      await checkoutPage.cancel();
      await expect(page).toHaveURL('/cart.html');
    });

  });

  test.describe('Step 2 - Overview', () => {

    test.beforeEach(async ({ page, checkoutPage }) => {
      await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
      await checkoutPage.continue();
      await expect(page).toHaveURL('/checkout-step-two.html');
    });

    test('should cancel and return to inventory', async ({ page, checkoutPage }) => {
      await checkoutPage.cancel();
      await expect(page).toHaveURL('/inventory.html');
    });

    test('should display subtotal, tax, and correct total', async ({ checkoutPage }) => {
      const subtotal = await checkoutPage.getSubtotal();
      const tax = await checkoutPage.getTax();
      const total = await checkoutPage.getTotal();
      expect(total).toBe(parseFloat((subtotal + tax).toFixed(2)));
    });

    test('should display overview page title', async ({ checkoutPage }) => {
      await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');
    });

  });

});
