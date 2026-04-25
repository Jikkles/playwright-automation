import { test, expect } from '../fixtures';
import AxeBuilder from '@axe-core/playwright';

// SauceDemo has known structural WCAG violations on every page:
//   [moderate] landmark-one-main  — no <main> landmark element
//   [moderate] page-has-heading-one — no <h1> heading
//   [moderate] region             — content not wrapped in landmark regions
// The inventory page has an additional [critical] select-name violation (unlabelled sort dropdown).
// All tests are marked fixme per project convention for known upstream defects.
// Re-enable if SauceDemo is replaced with an accessible AUT.

test.describe('Accessibility - Login page', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should have no accessibility violations', async ({ page, loginPage }) => {
    test.fixme(true, 'SauceDemo upstream: missing <main> landmark, no <h1> heading, content outside landmark regions');
    await loginPage.goto();
    const results = await new AxeBuilder({ page }).analyze();
    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}`)
        .join('\n');
      throw new Error(`Accessibility violations found:\n${summary}`);
    }
  });
});

test.describe('Accessibility - Authenticated pages', () => {
  test('inventory page should have no accessibility violations', async ({ page, inventoryPage }) => {
    test.fixme(true, 'SauceDemo upstream: missing landmarks, no <h1>, unlabelled sort dropdown (select-name critical)');
    await page.goto('/inventory.html');
    await inventoryPage.checkAccessibility();
  });

  test('cart page should have no accessibility violations', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    test.fixme(true, 'SauceDemo upstream: missing <main> landmark, no <h1> heading, content outside landmark regions');
    await page.goto('/inventory.html');
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.checkAccessibility();
  });

  test('checkout step 1 should have no accessibility violations', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    test.fixme(true, 'SauceDemo upstream: missing <main> landmark, no <h1> heading, content outside landmark regions');
    await page.goto('/inventory.html');
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkoutPage.checkAccessibility();
  });

  test('checkout step 2 should have no accessibility violations', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    test.fixme(true, 'SauceDemo upstream: missing <main> landmark, no <h1> heading, content outside landmark regions');
    await page.goto('/inventory.html');
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo('John', 'Smith', 'SW1A 1AA');
    await checkoutPage.continue();
    await expect(page).toHaveURL('/checkout-step-two.html');
    await checkoutPage.checkAccessibility();
  });
});
