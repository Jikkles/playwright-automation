import { test, expect } from '../fixtures';

const EXPECTED_ITEM_COUNT = 6;
const KNOWN_CART_ITEM = 'Sauce Labs Bolt T-Shirt';

test.describe('Inventory Page', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.resetAppState();
    await inventoryPage.closeBurgerMenu(); // resetAppState leaves the burger menu open
  });

  test('should display inventory items', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('should display 6 products', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(EXPECTED_ITEM_COUNT);
  });

  test('should show cart badge count of 1 after adding item', async ({ inventoryPage }) => {
    await inventoryPage.addFirstItemToCart();
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('should navigate to cart and display added item', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart/);
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('should add multiple items to cart', async ({ inventoryPage }) => {
    await inventoryPage.addFirstNItemsToCart(3);
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test('should remove an item from cart via inventory page', async ({ inventoryPage }) => {
    await inventoryPage.addFirstItemToCart();
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    await inventoryPage.removeFirstItemFromCart();
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('should sort items by name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const namesAfter = await inventoryPage.getItemNames();
    expect(namesAfter).toEqual([...namesAfter].sort((a, b) => b.localeCompare(a)));
  });

  test('should sort items by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('should sort items by price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('should sort items by name A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('should display correct page title', async ({ inventoryPage }) => {
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('should display descriptions for all items', async ({ inventoryPage }) => {
    const descriptions = await inventoryPage.getItemDescriptions();
    expect(descriptions).toHaveLength(EXPECTED_ITEM_COUNT);
    for (const desc of descriptions) {
      expect(desc.trim()).not.toBe('');
    }
  });

  test('should display the burger menu button', async ({ inventoryPage }) => {
    await expect(inventoryPage.burgerMenuButton).toBeVisible();
  });

  test('should not show cart badge on initial page load', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('should add all 6 items to cart', async ({ inventoryPage }) => {
    await inventoryPage.addFirstNItemsToCart(EXPECTED_ITEM_COUNT);
    expect(await inventoryPage.getCartBadgeCount()).toBe(EXPECTED_ITEM_COUNT);
  });

  test('should toggle button from Add to Remove after adding item', async ({ inventoryPage }) => {
    await expect(inventoryPage.addToCartButtons).toHaveCount(EXPECTED_ITEM_COUNT);
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.addToCartButtons).toHaveCount(EXPECTED_ITEM_COUNT - 1);
    await expect(inventoryPage.removeFromCartButtons).toHaveCount(1);
  });

  test('should hide cart badge after removing all added items', async ({ inventoryPage }) => {
    await inventoryPage.addFirstNItemsToCart(3);

    await test.step('remove first item — badge shows 2', async () => {
      await inventoryPage.removeFirstItemFromCart();
      expect(await inventoryPage.getCartBadgeCount()).toBe(2);
    });

    await test.step('remove second item — badge shows 1', async () => {
      await inventoryPage.removeFirstItemFromCart();
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

    await test.step('remove third item — badge disappears', async () => {
      await inventoryPage.removeFirstItemFromCart();
      await expect(inventoryPage.cartBadge).toBeHidden();
    });
  });

  test('should navigate to product detail page when item name is clicked', async ({
    page,
    inventoryPage,
  }) => {
    const names = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(names[0]);
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('should have positive prices for all items', async ({ inventoryPage }) => {
    const prices = await inventoryPage.getItemPrices();
    for (const price of prices) {
      expect(price).toBeGreaterThan(0);
    }
  });

  test('should have non-empty names for all items', async ({ inventoryPage }) => {
    const names = await inventoryPage.getItemNames();
    expect(names).toHaveLength(EXPECTED_ITEM_COUNT);
    for (const name of names) {
      expect(name.trim()).not.toBe('');
    }
  });

  test('should default to A to Z sort order on page load', async ({ inventoryPage }) => {
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('should preserve item count after changing sort order', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    await expect(inventoryPage.inventoryItems).toHaveCount(EXPECTED_ITEM_COUNT);
    await inventoryPage.sortBy('za');
    await expect(inventoryPage.inventoryItems).toHaveCount(EXPECTED_ITEM_COUNT);
  });

  test('should add the correct named item to cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCartByName(KNOWN_CART_ITEM);
    await inventoryPage.goToCart();
    const cartNames = await cartPage.getCartItemNames();
    expect(cartNames).toContain(KNOWN_CART_ITEM);
  });
});
