import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Inventory Page', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('should display inventory items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    const itemCount = await inventoryPage.getInventoryItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should display 6 products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const itemCount = await inventoryPage.getInventoryItemCount();
    expect(itemCount).toBe(6);
  });

  test('should add item to cart and view it', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('1');

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart/);

    const cartPage = new CartPage(page);
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('should add multiple items to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCartButtons.nth(0).click();
    await inventoryPage.addToCartButtons.nth(1).click();
    await inventoryPage.addToCartButtons.nth(2).click();

    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('3');
  });

  test('should remove an item from cart via inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');

    await inventoryPage.removeFirstItemFromCart();
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should sort items by name Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const namesBefore = await inventoryPage.getItemNames();
    await inventoryPage.sortBy('za');
    const namesAfter = await inventoryPage.getItemNames();

    expect(namesAfter).not.toEqual(namesBefore);
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

  test('should remove item from cart page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    expect(await cartPage.getCartItemCount()).toBe(1);

    await cartPage.removeFirstItem();
    expect(await cartPage.getCartItemCount()).toBe(0);
  });

  test('should navigate to cart via cart icon', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart/);

    const cartPage = new CartPage(page);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
  });

});
