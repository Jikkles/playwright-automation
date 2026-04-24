import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item'); // no data-test on the cart row wrapper
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.cartItemQuantities = page.locator('[data-test="item-quantity"]');
    this.removeButtons = page.locator('button[data-test*="remove"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async getCartItemPrices(): Promise<number[]> {
    const priceTexts = await this.cartItemPrices.allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async getCartItemQuantities(): Promise<string[]> {
    return this.cartItemQuantities.allTextContents();
  }

  async removeItemByName(name: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: name });
    await item.locator('button[data-test*="remove"]').click();
  }

  async removeFirstItem(): Promise<void> {
    await this.removeButtons.first().click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
