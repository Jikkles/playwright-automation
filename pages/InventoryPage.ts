import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseCurrency, SortOption } from '../data/utils';

export class InventoryPage extends BasePage {
  // Attribute value includes the item slug (e.g. add-to-cart-sauce-labs-backpack), so partial match is required.
  private static readonly ADD_TO_CART_SELECTOR = 'button[data-test*="add-to-cart"]';

  // kept public to allow Playwright toBeVisible / toHaveCount assertions in tests
  public readonly inventoryContainer: Locator;
  // kept public to allow Playwright toHaveCount assertions in tests
  public readonly inventoryItems: Locator;
  private readonly inventoryItemNames: Locator;
  private readonly inventoryItemPrices: Locator;
  private readonly inventoryItemDescriptions: Locator;
  // kept public to allow Playwright toHaveCount / toBeVisible assertions in tests
  public readonly addToCartButtons: Locator;
  // kept public to allow Playwright toHaveCount / toBeVisible assertions in tests
  public readonly removeFromCartButtons: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.addToCartButtons = page.locator(InventoryPage.ADD_TO_CART_SELECTOR);
    this.removeFromCartButtons = page.locator('button[data-test*="remove"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  public async clickItemByName(name: string): Promise<void> {
    // exact-match regex prevents substring collisions between similar item names
    await this.inventoryItemNames.filter({ hasText: new RegExp(`^${name}$`) }).click();
  }

  public async addFirstItemToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }

  public async addFirstNItemsToCart(count: number): Promise<void> {
    const available = await this.addToCartButtons.count();
    if (count > available) {
      throw new Error(`Cannot add ${count} items: only ${available} add-to-cart buttons available`);
    }
    // Always clicks nth(0): each click removes that button from the DOM, shrinking the list
    for (let i = 0; i < count; i++) {
      await this.addToCartButtons.nth(0).click();
    }
  }

  public async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator(InventoryPage.ADD_TO_CART_SELECTOR).click();
  }

  public async removeFirstItemFromCart(): Promise<void> {
    await this.removeFromCartButtons.first().click();
  }

  public async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  public async getItemNames(): Promise<string[]> {
    return (await this.inventoryItemNames.allTextContents()).map((s) => s.trim());
  }

  public async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrices.allTextContents();
    return priceTexts.map((p) => parseCurrency(p));
  }

  public async getItemDescriptions(): Promise<string[]> {
    return (await this.inventoryItemDescriptions.allTextContents()).map((s) => s.trim());
  }
}
