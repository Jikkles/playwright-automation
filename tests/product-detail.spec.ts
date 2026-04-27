import { test, expect } from '../fixtures';

test.describe('Product Detail Page', () => {
  test.describe.configure({ mode: 'serial' });
  // shared across serial tests — assigned in beforeEach, read in test bodies
  let firstName!: string;
  let firstPrice!: number;

  test.beforeEach(async ({ page, inventoryPage }) => {
    // explicit navigation — fixtures provide page objects but do not auto-navigate
    await page.goto('/inventory.html');
    // explicit render-wait — ensures items are in the DOM before scraping
    await expect(inventoryPage.inventoryItems).not.toHaveCount(0);
    [firstName] = await inventoryPage.getItemNames();
    [firstPrice] = await inventoryPage.getItemPrices();

    await test.step('validate scraped inventory data', async () => {
      expect(firstName, { message: 'getItemNames() returned empty array' }).toBeTruthy();
      expect(firstPrice, { message: 'getItemPrices() returned empty or zero' }).toBeGreaterThan(0);
    });

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
    async ({ productDetailPage }) => {
      // compared against firstName captured from inventory listing in beforeEach
      const name = await productDetailPage.getItemName();
      expect(name, { message: 'Item name on detail page did not match inventory listing' }).toBe(
        firstName
      );
    }
  );

  test(
    'should display the same price as shown on the inventory listing',
    { tag: '@smoke' },
    async ({ productDetailPage }) => {
      // compared against firstPrice captured from inventory listing in beforeEach
      const price = await productDetailPage.getItemPrice();
      expect(price, { message: 'Item price on detail page did not match inventory listing' }).toBe(
        firstPrice
      );
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
      // compared against firstName captured from inventory listing in beforeEach
      const description = await productDetailPage.getItemDescription();
      expect(description, {
        message: `Description "${description}" must not equal item name "${firstName}"`,
      }).not.toBe(firstName);
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
      await expect(productDetailPage.cartBadge).toHaveText('1'); // confirm badge set on detail page before navigating
      await productDetailPage.goBack();
      await expect(inventoryPage.cartBadge).toHaveText('1');
    }
  );
});
