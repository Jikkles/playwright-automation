import { test, expect } from '../fixtures';

test.describe('Network resilience', () => {
  test('should display item names and prices when product images fail to load', async ({
    page,
    inventoryPage,
  }) => {
    await page.route('**/*.jpg', (route) => route.abort());
    await page.goto('/inventory.html');
    const names = await inventoryPage.getItemNames();
    const prices = await inventoryPage.getItemPrices();
    expect(names.length).toBeGreaterThan(0);
    expect(prices.length).toBeGreaterThan(0);
  });

  test('should complete cart operations when non-critical resources are blocked', async ({
    page,
    inventoryPage,
  }) => {
    await page.route('**/*.svg', (route) => route.abort());
    await page.route('**/*.woff2', (route) => route.abort());
    await page.goto('/inventory.html');
    await inventoryPage.addFirstItemToCart();
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('should track image requests and confirm they are made on inventory load', async ({
    page,
    inventoryPage,
  }) => {
    let imageRequestCount = 0;
    await page.route('**/*.jpg', async (route) => {
      imageRequestCount++;
      await route.continue();
    });
    await page.goto('/inventory.html');
    const names = await inventoryPage.getItemNames();
    expect(names.length).toBeGreaterThan(0);
    expect(imageRequestCount).toBeGreaterThan(0);
  });

  test('should still navigate to cart when images are aborted mid-session', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addFirstItemToCart();
    await page.route('**/*.jpg', (route) => route.abort());
    await inventoryPage.goToCart();
    await expect(page).toHaveURL('/cart.html');
    expect(await cartPage.getCartItemCount()).toBe(1);
  });
});
