import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseCurrency } from '../data/utils';

export class ProductDetailPage extends BasePage {
  // kept public to allow Playwright toBeVisible assertions in tests
  public readonly itemImage: Locator;
  // kept public to allow Playwright toBeVisible/toBeHidden assertions in tests;
  // on the detail page the button has no item slug — data-test is exactly "add-to-cart".
  public readonly addToCartButton: Locator;
  // kept public to allow Playwright toBeVisible/toBeHidden assertions in tests;
  // on the detail page the button has no item slug — data-test is exactly "remove".
  public readonly removeButton: Locator;
  // getItemName/Price/Description return async values — no locator getter needed;
  // no test ever needs to make a locator assertion (e.g. toBeVisible) on these elements.
  private readonly itemName: Locator;
  private readonly itemDescription: Locator;
  private readonly itemPrice: Locator;
  // backButton is intentionally private — no test asserts on its visibility.
  private readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    // SauceDemo provides no data-test attributes on the detail page's content elements;
    // CSS class selectors are the only stable option for name, description, price, and image.
    // no data-test on detail image; element type anchors the selector
    this.itemImage = page.locator('img.inventory_details_img');
    this.itemName = page.locator('.inventory_details_name');
    this.itemDescription = page.locator('.inventory_details_desc');
    this.itemPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  public async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  public async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  public async goBack(): Promise<void> {
    await this.backButton.click();
  }

  public async getItemName(): Promise<string> {
    return this.readText(this.itemName, 'Item name');
  }

  public async getItemPrice(): Promise<number> {
    const raw = await this.readText(this.itemPrice, 'Item price');
    return parseCurrency(raw);
  }

  public async getItemDescription(): Promise<string> {
    return this.readText(this.itemDescription, 'Item description');
  }
}
