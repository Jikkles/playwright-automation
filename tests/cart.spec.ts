import { test, expect } from '../fixtures';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('should add a single item to cart', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should add all items to cart', async ({ inventoryPage }) => {
    const itemNames = await inventoryPage.getItemNames();
    for (const name of itemNames) {
      await inventoryPage.addItemToCartByName(name);
    }
    await expect(inventoryPage.cartBadge).toHaveText(String(itemNames.length));
  });

  test('should update cart badge count as items are added', async ({ inventoryPage }) => {
    const itemNames = await inventoryPage.getItemNames();

    for (let i = 0; i < Math.min(3, itemNames.length); i++) {
      await test.step(`add item ${i + 1} — badge shows ${i + 1}`, async () => {
        await inventoryPage.addItemToCartByName(itemNames[i]);
        await expect(inventoryPage.cartBadge).toHaveText(String(i + 1));
      });
    }
  });

  test('should change button text to Remove after adding item', async ({ inventoryPage }) => {
    const itemNames = await inventoryPage.getItemNames();
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.removeFromCartButtons.first()).toBeVisible();
    await expect(inventoryPage.addToCartButtons).toHaveCount(itemNames.length - 1);
  });

  test('added items should appear in cart', async ({ inventoryPage, cartPage }) => {
    const itemNames = await inventoryPage.getItemNames();
    expect(itemNames.length).toBeGreaterThanOrEqual(2);
    await inventoryPage.addItemToCartByName(itemNames[0]);
    await inventoryPage.addItemToCartByName(itemNames[1]);
    await inventoryPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(2);
    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).toEqual(expect.arrayContaining([itemNames[0], itemNames[1]]));
  });

  test('should not show cart badge when no items added', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('should display correct item price in cart', async ({ inventoryPage, cartPage }) => {
    const itemNames = await inventoryPage.getItemNames();
    const itemPrices = await inventoryPage.getItemPrices();
    const firstItemName = itemNames[0];
    const expectedPrice = itemPrices[0];

    await inventoryPage.addItemToCartByName(firstItemName);
    await inventoryPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(1);
    const cartPrices = await cartPage.getCartItemPrices();
    expect(cartPrices[0]).toBeCloseTo(expectedPrice, 2);
  });

  test('should display quantity of 1 for each item in cart', async ({
    inventoryPage,
    cartPage,
  }) => {
    const itemNames = await inventoryPage.getItemNames();
    expect(itemNames.length).toBeGreaterThanOrEqual(2);
    await inventoryPage.addItemToCartByName(itemNames[0]);
    await inventoryPage.addItemToCartByName(itemNames[1]);
    await inventoryPage.goToCart();

    const quantities = await cartPage.getCartItemQuantities();
    expect(quantities).toEqual([1, 1]);
  });

  test('should persist cart contents after navigating back from cart', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test(
    'should navigate to cart page via cart icon',
    { tag: '@smoke' },
    async ({ page, inventoryPage, cartPage }) => {
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(cartPage.pageTitle).toHaveText('Your Cart');
    }
  );

  test(
    'should remove item from cart page',
    { tag: '@smoke' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addFirstItemToCart();
      await inventoryPage.goToCart();
      await expect(cartPage.cartItems).toHaveCount(1); // precondition: confirm item is in cart
      await cartPage.removeFirstItem();
      await expect(cartPage.cartItems).toHaveCount(0);
    }
  );

  test('should hide cart badge after removing last item from cart page', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.removeFirstItem();
    // assert cart is empty first so the badge absence check does not race against item removal
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.cartBadge).toBeHidden();
  });

  test('should remove a specific item by name from the cart', async ({
    inventoryPage,
    cartPage,
  }) => {
    const itemNames = await inventoryPage.getItemNames();
    await inventoryPage.addItemToCartByName(itemNames[0]);
    await inventoryPage.addItemToCartByName(itemNames[1]);
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(2);
    await cartPage.removeItemByName(itemNames[0]);
    await expect(cartPage.cartItems).toHaveCount(1);
    const remaining = await cartPage.getCartItemNames();
    expect(remaining).not.toContain(itemNames[0]);
    expect(remaining).toContain(itemNames[1]);
  });
});
