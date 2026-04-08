import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly inventoryItemDescriptions: Locator;
  readonly addToCartButtons: Locator;
  readonly removeFromCartButtons: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly pageTitle: Locator;
  readonly burgerMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryContainer = page.locator('.inventory_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
    this.inventoryItemDescriptions = page.locator('.inventory_item_desc');
    this.addToCartButtons = page.locator('button[data-test*="add-to-cart"]');
    this.removeFromCartButtons = page.locator('button[data-test*="remove"]');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.pageTitle = page.locator('.title');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
  }

  async addFirstItemToCart() {
    await this.addToCartButtons.first().click();
  }

  async addItemToCartByName(name: string) {
    await this.page.locator(`[data-test="add-to-cart-${name.toLowerCase().replace(/ /g, '-')}"]`).click();
  }

  async removeFirstItemFromCart() {
    await this.removeFromCartButtons.first().click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.textContent() ?? '0';
  }

  async getInventoryItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.inventoryItemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrices.allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async getItemDescriptions(): Promise<string[]> {
    return this.inventoryItemDescriptions.allTextContents();
  }
}
