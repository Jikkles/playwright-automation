import { test, expect } from '../fixtures';
import { customer } from '../data/checkout';

test.describe('End-to-end: complete purchase flow', () => {
  test(
    'user can browse, add items, and complete checkout',
    { tag: '@smoke' },
    async ({ page, inventoryPage, cartPage, checkoutPage }) => {
      const { expectedItem1, expectedItem2, expectedSubtotal } =
        await test.step('Browse inventory and select two cheapest items', async () => {
          await page.goto('/inventory.html');
          await expect(inventoryPage.inventoryContainer).toBeVisible();
          await inventoryPage.sortBy('lohi');
          const itemNames = await inventoryPage.getItemNames();
          const itemPrices = await inventoryPage.getItemPrices();
          return {
            expectedItem1: itemNames[0],
            expectedItem2: itemNames[1],
            expectedSubtotal: parseFloat((itemPrices[0] + itemPrices[1]).toFixed(2)),
          };
        });

      await test.step('Add items to cart and verify badge', async () => {
        await inventoryPage.addItemToCartByName(expectedItem1);
        await inventoryPage.addItemToCartByName(expectedItem2);
        expect(await inventoryPage.getCartBadgeCount()).toBe(2);
      });

      await test.step('Review cart contents', async () => {
        await inventoryPage.goToCart();
        await expect(page).toHaveURL('/cart.html');
        await expect(cartPage.pageTitle).toHaveText('Your Cart');
        expect(await cartPage.getCartItemCount()).toBe(2);
        const cartNames = await cartPage.getCartItemNames();
        expect(cartNames).toContain(expectedItem1);
        expect(cartNames).toContain(expectedItem2);
      });

      await test.step('Enter customer information', async () => {
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL('/checkout-step-one.html');
        await expect(checkoutPage.pageTitle).toHaveText('Checkout: Your Information');
        await checkoutPage.fillCustomerInfo(
          customer.firstName,
          customer.lastName,
          customer.postalCode
        );
        await checkoutPage.continue();
      });

      await test.step('Verify order overview and financial totals', async () => {
        await expect(page).toHaveURL('/checkout-step-two.html');
        await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');
        const overviewNames = await checkoutPage.getOverviewItemNames();
        expect(overviewNames).toContain(expectedItem1);
        expect(overviewNames).toContain(expectedItem2);
        const subtotal = await checkoutPage.getSubtotal();
        expect(subtotal).toBe(expectedSubtotal);
        const tax = await checkoutPage.getTax();
        const total = await checkoutPage.getTotal();
        expect(total).toBe(parseFloat((subtotal + tax).toFixed(2)));
      });

      await test.step('Complete order and return to products', async () => {
        await checkoutPage.finish();
        await expect(page).toHaveURL('/checkout-complete.html');
        await expect(checkoutPage.pageTitle).toHaveText('Checkout: Complete!');
        await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
        await checkoutPage.backToProducts();
        await expect(page).toHaveURL('/inventory.html');
        await expect(inventoryPage.inventoryContainer).toBeVisible();
      });
    }
  );
});
