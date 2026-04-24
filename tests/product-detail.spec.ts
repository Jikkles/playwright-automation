import { test, expect } from '../fixtures';

test.describe('Product Detail Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('should navigate to detail page by clicking item name', async ({ page, inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(firstName);
    await expect(page).toHaveURL(/inventory-item/);
    await expect(productDetailPage.container).toBeVisible();
  });

  test('should display the same name and price as shown on inventory', async ({ inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    const [firstPrice] = await inventoryPage.getItemPrices();
    await inventoryPage.clickItemByName(firstName);
    expect(await productDetailPage.getItemName()).toBe(firstName);
    expect(await productDetailPage.getItemPrice()).toBe(firstPrice);
  });

  test('should display a non-empty description', async ({ inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(firstName);
    expect((await productDetailPage.getItemDescription()).trim()).not.toBe('');
  });

  test('should display the item image', async ({ inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(firstName);
    await expect(productDetailPage.itemImage).toBeVisible();
  });

  test('should add item to cart from detail page', async ({ inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(firstName);
    await productDetailPage.addToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should switch to Remove button after adding to cart', async ({ inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(firstName);
    await productDetailPage.addToCart();
    await expect(productDetailPage.removeButton).toBeVisible();
    await expect(productDetailPage.addToCartButton).toBeHidden();
  });

  test('should remove item from cart on detail page', async ({ inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(firstName);
    await productDetailPage.addToCart();
    await productDetailPage.removeFromCart();
    await expect(inventoryPage.cartBadge).toBeHidden();
    await expect(productDetailPage.addToCartButton).toBeVisible();
  });

  test('should return to inventory via back button', async ({ page, inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(firstName);
    await productDetailPage.goBack();
    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('should preserve cart badge count on return to inventory', async ({ inventoryPage, productDetailPage }) => {
    const [firstName] = await inventoryPage.getItemNames();
    await inventoryPage.clickItemByName(firstName);
    await productDetailPage.addToCart();
    await productDetailPage.goBack();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

});
