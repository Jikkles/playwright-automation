import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly container: Locator;
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly itemImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

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
    this.removeButton = page.locator('[data-test^="remove"]');
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
    return (await this.itemName.textContent()) ?? '';
  }

  async getItemPrice(): Promise<number> {
    const text = (await this.itemPrice.textContent()) ?? '';
    return parseFloat(text.replace('$', ''));
  }

  async getItemDescription(): Promise<string> {
    return (await this.itemDescription.textContent()) ?? '';
  }
}
