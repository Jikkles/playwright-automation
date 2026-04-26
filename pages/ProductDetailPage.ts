import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseCurrency } from '../data/utils';

export class ProductDetailPage extends BasePage {
  // kept public to allow Playwright toBeVisible assertions in tests
  public readonly container: Locator;
  private readonly itemName: Locator;
  private readonly itemDescription: Locator;
  private readonly itemPrice: Locator;
  // kept public to allow Playwright toBeVisible assertions in tests
  public readonly itemImage: Locator;
  // kept public to allow Playwright toBeVisible/toBeHidden assertions in tests;
  // attribute value includes the item slug (e.g. add-to-cart-sauce-labs-backpack), so prefix match is required.
  public readonly addToCartButton: Locator;
  // kept public to allow Playwright toBeVisible assertions in tests;
  // attribute value includes the item slug with a dash separator (e.g. remove-sauce-labs-backpack).
  public readonly removeButton: Locator;
  private readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    // SauceDemo provides no data-test attributes on detail page elements;
    // CSS class selectors are the only stable option for this entire page object.
    this.container = page.locator('.inventory_details_container');
    this.itemName = page.locator('.inventory_details_name');
    this.itemDescription = page.locator('.inventory_details_desc');
    this.itemPrice = page.locator('.inventory_details_price');
    this.itemImage = page.locator('.inventory_details_img');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove-"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }

  async getItemName(): Promise<string> {
    const text = await this.itemName.textContent();
    if (text === null) throw new Error('Item name element returned null textContent');
    return text.trim();
  }

  async getItemPrice(): Promise<number> {
    const text = (await this.itemPrice.textContent()) ?? '';
    return parseCurrency(text);
  }

  async getItemDescription(): Promise<string> {
    return ((await this.itemDescription.textContent()) ?? '').trim();
  }
}
