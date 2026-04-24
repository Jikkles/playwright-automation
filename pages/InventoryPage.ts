import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly inventoryItemDescriptions: Locator;
  readonly addToCartButtons: Locator;
  readonly removeFromCartButtons: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.addToCartButtons = page.locator('button[data-test*="add-to-cart"]');
    this.removeFromCartButtons = page.locator('button[data-test*="remove"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async clickItemByName(name: string): Promise<void> {
    await this.inventoryItemNames.filter({ hasText: name }).click();
  }

  async addFirstItemToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }

  async addItemsToCart(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addToCartButtons.nth(i).click();
    }
  }

  async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator('button[data-test*="add-to-cart"]').click();
  }

  async removeFirstItemFromCart(): Promise<void> {
    await this.removeFromCartButtons.first().click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.inventoryItemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrices.allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace('$', '')));
  }

  async getItemDescriptions(): Promise<string[]> {
    return this.inventoryItemDescriptions.allTextContents();
  }
}
