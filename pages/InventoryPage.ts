import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryContainer: Locator;
  readonly addToCartButtons: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryContainer = page.locator('.inventory_container');
    this.addToCartButtons = page.locator('button[data-test*="add-to-cart"]');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addFirstItemToCart() {
    const firstButton = this.page.locator('button[data-test*="add-to-cart"]').first();
    await firstButton.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getCartBadgeCount(): Promise<string | null> {
    return await this.cartBadge.textContent();
  }
}
