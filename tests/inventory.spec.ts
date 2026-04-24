import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

const EXPECTED_ITEM_COUNT = 6;

test.describe('Inventory Page', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('should display inventory items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.inventoryItems).not.toHaveCount(0);
  });

  test('should display 6 products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryItems).toHaveCount(EXPECTED_ITEM_COUNT);
  });

  test('should show cart badge count of 1 after adding item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should navigate to cart and display added item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart/);

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('should add multiple items to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addItemsToCart(3);

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('should remove an item from cart via inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFirstItemFromCart();
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should sort items by name Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('za');
    const namesAfter = await inventoryPage.getItemNames();

    expect(namesAfter).toEqual([...namesAfter].sort((a, b) => b.localeCompare(a)));
  });

  test('should sort items by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();

    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('should sort items by price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();

    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('should sort items by name A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getItemNames();

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('should remove item from cart page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.removeFirstItem();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('should navigate to cart via cart icon', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart/);

    const cartPage = new CartPage(page);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
  });

  test('should display correct page title', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('should display descriptions for all items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const descriptions = await inventoryPage.getItemDescriptions();
    expect(descriptions.length).toBe(EXPECTED_ITEM_COUNT);
    for (const desc of descriptions) {
      expect(desc.trim()).not.toBe('');
    }
  });

  test('should display the burger menu button', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.burgerMenuButton).toBeVisible();
  });

});
