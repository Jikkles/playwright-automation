import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseCurrency } from '../data/utils';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item'); // no data-test on the cart row wrapper
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.cartItemQuantities = page.locator('[data-test="item-quantity"]');
    this.removeButtons = page.locator('button[data-test*="remove"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async getCartItemPrices(): Promise<number[]> {
    const priceTexts = await this.cartItemPrices.allTextContents();
    return priceTexts.map((p) => parseCurrency(p));
  }

  async getCartItemQuantities(): Promise<string[]> {
    return this.cartItemQuantities.allTextContents();
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
