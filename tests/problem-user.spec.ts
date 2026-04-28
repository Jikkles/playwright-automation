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
    const namesBefore = await inventoryPage.getItemNames();
    await inventoryPage.sortBy('za');
    const namesAfter = await inventoryPage.getItemNames();
    // expectedZA derived from the pre-sort snapshot so a silently-fixed sort would be detected
    const expectedZA = [...namesBefore].sort((a, b) => b.localeCompare(a));
    // Invert this assertion if the upstream sort bug is ever fixed
    expect(namesAfter).not.toEqual(expectedZA);
  });

  test('sort by price low to high does not reorder items (known bug)', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    const isSorted = prices.every((p, i) => i === 0 || p >= prices[i - 1]);
    // Invert this assertion if the upstream sort bug is ever fixed
    expect(isSorted).toBe(false);
  });

  // problem_user's last name field silently ignores input — fillCustomerInfo succeeds
  // but the form cannot advance to step 2, causing this test to fail as expected.
  test('filling customer info fails silently — known bug', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    test.fixme(
      true,
      'problem_user last name field silently drops input — remove once upstream bug is fixed'
    );

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.submitCustomerInfo();
    await expect(page).toHaveURL('/checkout-step-two.html');
  });

  test(
    'last name field silently drops input — known bug',
    { tag: '@regression' },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.addFirstItemToCart();
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo(
        customer.firstName,
        customer.lastName,
        customer.postalCode
      );
      // Inverted: last name field drops input so submission triggers a required-field error
      await checkoutPage.submitCustomerInfo();
      await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
    }
  );

  test(
    'all product images should be identical (known bug)',
    { tag: '@regression' },
    async ({ inventoryPage }) => {
      const srcs = await inventoryPage.getItemImageSrcs();
      expect(srcs).toHaveLength(6);
      // Inverted: problem_user shows the same broken image for every product
      const unique = new Set(srcs);
      expect(unique.size).toBe(1);
    }
  );
});

const GLITCH_USER_LOGIN_TIMEOUT_MS = 15_000;

test.describe('Performance Glitch User', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsPerformanceGlitchUser();
    await expect(page).toHaveURL('/inventory.html', { timeout: GLITCH_USER_LOGIN_TIMEOUT_MS });
  });

  test('should log in successfully despite artificial delay', async ({ page }) => {
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should display a working inventory after slow login', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test(
    'should complete a full purchase despite slow login',
    { tag: '@regression' },
    async ({ page, inventoryPage, cartPage, checkoutPage }) => {
      await test.step('Add item and proceed to cart', async () => {
        await inventoryPage.addFirstItemToCart();
        await inventoryPage.goToCart();
        await expect(cartPage.cartItems).toHaveCount(1);
      });

      await test.step('Complete checkout', async () => {
        await cartPage.proceedToCheckout();
        await checkoutPage.fillCustomerInfo(
          customer.firstName,
          customer.lastName,
          customer.postalCode
        );
        await checkoutPage.submitCustomerInfo();
        await expect(page).toHaveURL('/checkout-step-two.html');
        await checkoutPage.finish();
      });

      await test.step('Confirm order complete', async () => {
        await expect(page).toHaveURL('/checkout-complete.html');
        await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
      });
    }
  );
});
