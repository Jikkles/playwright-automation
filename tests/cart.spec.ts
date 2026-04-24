import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Add to Cart', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('should add a single item to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();

    await expect(inventoryPage.cartBadge).toBeVisible();
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  });

  test('should add all items to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const itemNames = await inventoryPage.getItemNames();

    for (const name of itemNames) {
      await inventoryPage.addItemToCartByName(name);
    }

    expect(await inventoryPage.getCartBadgeCount()).toBe(String(itemNames.length));
  });

  test('should update cart badge count as items are added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const itemNames = await inventoryPage.getItemNames();

    await inventoryPage.addItemToCartByName(itemNames[0]);
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');

    await inventoryPage.addItemToCartByName(itemNames[1]);
    expect(await inventoryPage.getCartBadgeCount()).toBe('2');

    await inventoryPage.addItemToCartByName(itemNames[2]);
    expect(await inventoryPage.getCartBadgeCount()).toBe('3');
  });

  test('should change button text to Remove after adding item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();

    await expect(inventoryPage.removeFromCartButtons.first()).toBeVisible();
    await expect(inventoryPage.addToCartButtons).toHaveCount(5);
  });

  test('added items should appear in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const itemNames = await inventoryPage.getItemNames();
    await inventoryPage.addItemToCartByName(itemNames[0]);
    await inventoryPage.addItemToCartByName(itemNames[1]);

    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    expect(await cartPage.getCartItemCount()).toBe(2);

    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).toContain(itemNames[0]);
    expect(cartItemNames).toContain(itemNames[1]);
  });

  test('should not show cart badge when no items added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should display correct item price in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    // Prices are fetched before adding to cart; index 0 corresponds to the first item added
    const inventoryPrices = await inventoryPage.getItemPrices();
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    const cartPrices = await cartPage.getCartItemPrices();
    expect(cartPrices[0]).toBe(inventoryPrices[0]);
  });

  test('should display quantity of 1 for each item in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const itemNames = await inventoryPage.getItemNames();
    await inventoryPage.addItemToCartByName(itemNames[0]);
    await inventoryPage.addItemToCartByName(itemNames[1]);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    const quantities = await cartPage.getCartItemQuantities();
    expect(quantities.length).toBe(2);
    quantities.forEach(qty => expect(qty).toBe('1'));
  });

  test('should persist cart contents after navigating back from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.continueShopping();

    await expect(page).toHaveURL('/inventory.html');
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  });

});
