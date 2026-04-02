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
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.cart_item .inventory_item_name');
    this.cartItemPrices = page.locator('.cart_item .inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_item .cart_quantity');
    this.removeButtons = page.locator('button[data-test*="remove"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.pageTitle = page.locator('.title');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async removeItemByName(name: string) {
    await this.page.locator(`[data-test="remove-${name.toLowerCase().replace(/ /g, '-')}"]`).click();
  }

  async removeFirstItem() {
    await this.removeButtons.first().click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
