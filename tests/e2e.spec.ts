import { test, expect } from '../fixtures';
import { customer } from '../data/checkout';

test.describe('End-to-end: complete purchase flow', () => {

  test('user can browse, add items, and complete checkout @smoke', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await page.goto('/inventory.html');
    await expect(inventoryPage.inventoryContainer).toBeVisible();

    // Sort by price low to high and pick the first two items
    await inventoryPage.sortBy('lohi');
    const itemNames = await inventoryPage.getItemNames();
    const itemPrices = await inventoryPage.getItemPrices();

    const expectedItem1 = itemNames[0];
    const expectedItem2 = itemNames[1];
    const expectedSubtotal = parseFloat((itemPrices[0] + itemPrices[1]).toFixed(2));

    // --- Add two items to cart ---
    await inventoryPage.addItemToCartByName(expectedItem1);
    await inventoryPage.addItemToCartByName(expectedItem2);
    expect(await inventoryPage.getCartBadgeCount()).toBe('2');

    // --- Review cart ---
    await inventoryPage.goToCart();
    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    expect(await cartPage.getCartItemCount()).toBe(2);

    const cartNames = await cartPage.getCartItemNames();
    expect(cartNames).toContain(expectedItem1);
    expect(cartNames).toContain(expectedItem2);

    // --- Checkout step 1: customer information ---
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Your Information');
    await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continue();

    // --- Checkout step 2: order overview ---
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

    // --- Complete order ---
    await checkoutPage.finish();
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');

    // --- Return to products ---
    await checkoutPage.backToProducts();
    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

});
