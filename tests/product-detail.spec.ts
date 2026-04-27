import { test, expect } from '../fixtures';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    // explicit navigation — fixtures provide page objects but do not auto-navigate
    await page.goto('/inventory.html');
    // explicit render-wait — ensures items are in the DOM before scraping
    await expect(inventoryPage.inventoryItems).not.toHaveCount(0);
    const [firstName] = await inventoryPage.getItemNames();
    const [firstPrice] = await inventoryPage.getItemPrices();
    expect(firstName, { message: 'getItemNames() returned empty array' }).toBeTruthy();
    expect(firstPrice, { message: 'getItemPrices() returned empty or zero' }).toBeGreaterThan(0);
    await inventoryPage.clickItemByName(firstName);
    // wait for detail page navigation to settle before tests begin
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
  });

  test(
    'should navigate to the product detail page',
    { tag: '@smoke' },
    async ({ productDetailPage }) => {
      // URL already verified by beforeEach; this confirms the page rendered its primary content
      await expect(productDetailPage.itemImage).toBeVisible();
    }
  );

  test(
    'should display the same name as shown on the inventory listing',
    { tag: '@smoke' },
    async ({ inventoryPage, productDetailPage }) => {
      const detailName = await productDetailPage.getItemName();
      await productDetailPage.goBack();
      const inventoryNames = await inventoryPage.getItemNames();
      expect(
        inventoryNames,
        'Item name on detail page was not found in the inventory listing'
      ).toContain(detailName);
    }
  );

  test(
    'should display the same price as shown on the inventory listing',
    { tag: '@smoke' },
    async ({ inventoryPage, productDetailPage }) => {
      const detailPrice = await productDetailPage.getItemPrice();
      await productDetailPage.goBack();
      const inventoryPrices = await inventoryPage.getItemPrices();
      expect(
        inventoryPrices,
        'Item price on detail page was not found in the inventory listing'
      ).toContain(detailPrice);
    }
  );

  test(
    'should display a non-empty description',
    { tag: '@smoke' },
    async ({ productDetailPage }) => {
      const description = await productDetailPage.getItemDescription();
      // > 10 chars after trimming is a pragmatic minimum; the shortest SauceDemo description is ~30 chars
      expect(description.trim().length, {
        message: `Description was: "${description}"`,
      }).toBeGreaterThanOrEqual(10);
    }
  );

  test(
    'should display a description distinct from the item name',
    { tag: '@smoke' },
    async ({ productDetailPage }) => {
      const name = await productDetailPage.getItemName();
      const description = await productDetailPage.getItemDescription();
      expect(description, {
        message: `Description "${description}" must not equal item name "${name}"`,
      }).not.toBe(name);
    }
  );

  test('should display the item image', { tag: '@smoke' }, async ({ productDetailPage }) => {
    // stronger than toBeVisible — confirms a real src is present, not just that the element exists
    await expect(productDetailPage.itemImage).toHaveAttribute('src', /\S+/);
  });

  test(
    'should add item to cart from detail page',
    { tag: '@smoke' },
    async ({ productDetailPage }) => {
      // cart state does not leak to subsequent tests: the page fixture is test-scoped,
      // so each test gets a fresh browser page with an empty session storage
      await productDetailPage.addToCart();
      await expect(productDetailPage.cartBadge).toHaveText('1');
    }
  );

  test(
    'should show Remove button and hide Add to Cart button after adding to cart',
    { tag: '@smoke' },
    async ({ productDetailPage }) => {
      await productDetailPage.addToCart();
      // both assertions together confirm the mutually exclusive button-state toggle
      await expect(
        productDetailPage.removeButton,
        'Remove button should be visible after item is added'
      ).toBeVisible();
      await expect(
        productDetailPage.addToCartButton,
        'Add to Cart button should be hidden after item is added'
      ).toBeHidden();
    }
  );

  test(
    'should remove item from cart on detail page',
    { tag: '@smoke' },
    async ({ productDetailPage }) => {
      // self-contained: adds the item first so this test does not depend on prior test state
      await productDetailPage.addToCart();
      await productDetailPage.removeFromCart();
      // three assertions confirm the full reset: empty cart, Add to Cart restored, Remove hidden
      await expect(
        productDetailPage.cartBadge,
        'Cart badge should be absent after removing the item'
      ).toBeHidden();
      await expect(
        productDetailPage.addToCartButton,
        'Add to Cart button should be visible after removing the item'
      ).toBeVisible();
      await expect(
        productDetailPage.removeButton,
        'Remove button should be hidden after item is removed'
      ).toBeHidden();
    }
  );

  test(
    'should return to inventory via back button',
    { tag: '@smoke' },
    async ({ page, inventoryPage, productDetailPage }) => {
      await productDetailPage.goBack();
      // both assertions confirm a full page load: correct URL and visible content
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.inventoryContainer).toBeVisible();
    }
  );

  test(
    'should preserve cart badge count on return to inventory',
    { tag: '@smoke' },
    async ({ inventoryPage, productDetailPage }) => {
      // self-contained: addToCart() called here so this test does not depend on prior test state
      await expect(
        productDetailPage.cartBadge,
        'Cart badge should be absent before adding to cart'
      ).toBeHidden(); // assert clean precondition
      await productDetailPage.addToCart();
      // confirm badge set on detail page before navigating
      await expect(productDetailPage.cartBadge).toHaveText('1');
      await productDetailPage.goBack();
      await expect(inventoryPage.cartBadge).toHaveText('1');
    }
  );
});
