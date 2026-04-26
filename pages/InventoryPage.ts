import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseCurrency } from '../data/utils';

const ADD_TO_CART_SELECTOR = 'button[data-test*="add-to-cart"]';

export class InventoryPage extends BasePage {
  public readonly inventoryContainer: Locator;
  public readonly inventoryItems: Locator;
  private readonly inventoryItemNames: Locator;
  private readonly inventoryItemPrices: Locator;
  private readonly inventoryItemDescriptions: Locator;
  public readonly addToCartButtons: Locator;
  public readonly removeFromCartButtons: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.addToCartButtons = page.locator(ADD_TO_CART_SELECTOR);
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
    // Always clicks nth(0): each click removes that button from the DOM, shrinking the list
    for (let i = 0; i < count; i++) {
      await this.addToCartButtons.nth(0).click();
    }
  }

  async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator(ADD_TO_CART_SELECTOR).click();
  }

  async removeFirstItemFromCart(): Promise<void> {
    await this.removeFromCartButtons.first().click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return (await this.inventoryItemNames.allTextContents()).map((s) => s.trim());
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrices.allTextContents();
    return priceTexts.map((p) => parseCurrency(p));
  }

  async getItemDescriptions(): Promise<string[]> {
    return this.inventoryItemDescriptions.allTextContents();
  }
}
