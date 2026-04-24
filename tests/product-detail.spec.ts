import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('Product Detail Page', () => {

  // Shared variables are assigned in beforeEach before every test — intentional pattern
  // until Playwright fixtures are introduced to replace this describe-scope state.
  let firstItemName: string;
  let firstItemPrice: number;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();

    const inventoryPage = new InventoryPage(page);
    const names = await inventoryPage.getItemNames();
    firstItemName = names[0];
    const prices = await inventoryPage.getItemPrices();
    firstItemPrice = prices[0];
    await inventoryPage.clickItemByName(firstItemName);
  });

  test('should navigate to detail page by clicking item name', async ({ page }) => {
    await expect(page).toHaveURL(/inventory-item/);
    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.container).toBeVisible();
  });

  test('should display the same name as shown on inventory', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const detailName = await detailPage.getItemName();
    expect(detailName).toBe(firstItemName);
  });

  test('should display the same price as shown on inventory', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const detailPrice = await detailPage.getItemPrice();
    expect(detailPrice).toBe(firstItemPrice);
  });

  test('should display a non-empty description', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const desc = await detailPage.getItemDescription();
    expect(desc.trim()).not.toBe('');
  });

  test('should display the item image', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.itemImage).toBeVisible();
  });

  test('should add item to cart from detail page', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.addToCart();

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should switch to Remove button after adding to cart', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.addToCart();

    await expect(detailPage.removeButton).toBeVisible();
    await expect(detailPage.addToCartButton).not.toBeVisible();
  });

  test('should remove item from cart on detail page', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.addToCart();
    await detailPage.removeFromCart();

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
    await expect(detailPage.addToCartButton).toBeVisible();
  });

  test('should return to inventory via back button', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goBack();

    await expect(page).toHaveURL('/inventory.html');
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('should preserve cart badge count on return to inventory', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.addToCart();
    await detailPage.goBack();

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

});
