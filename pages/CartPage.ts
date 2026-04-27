import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseCurrency } from '../data/utils';

export class CartPage extends BasePage {
  // kept public to allow Playwright toHaveCount assertions in tests;
  // no data-test attribute exists on the cart row wrapper
  public readonly cartItems: Locator;
  private readonly cartItemNames: Locator;
  private readonly cartItemPrices: Locator;
  private readonly cartItemQuantities: Locator;
  private readonly removeButtons: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.cartItemQuantities = page.locator('[data-test="item-quantity"]');
    this.removeButtons = page.locator('button[data-test*="remove"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  public async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  public async getCartItemNames(): Promise<string[]> {
    return (await this.cartItemNames.allTextContents()).map((s) => s.trim());
  }

  public async getCartItemPrices(): Promise<number[]> {
    const priceTexts = await this.cartItemPrices.allTextContents();
    return priceTexts.map((p) => parseCurrency(p));
  }

  public async getCartItemQuantities(): Promise<number[]> {
    const quantityTexts = await this.cartItemQuantities.allTextContents();
    return quantityTexts.map((q) => {
      const n = parseInt(q.trim(), 10);
      if (isNaN(n)) throw new Error(`Could not parse cart item quantity from: "${q}"`);
      return n;
    });
  }

  public async removeFirstItem(): Promise<void> {
    await this.removeButtons.first().click();
  }

  public async removeItemByName(name: string): Promise<void> {
    // filter on the name sub-element with an exact-match regex to avoid substring collisions
    const nameLocator = this.page.locator('[data-test="inventory-item-name"]').filter({
      hasText: new RegExp(`^${name}$`),
    });
    const row = this.cartItems.filter({ has: nameLocator });
    await row.locator('button[data-test*="remove"]').click();
  }

  public async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  public async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
