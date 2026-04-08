import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Step 1 — Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step 2 — Overview
  readonly overviewItems: Locator;
  readonly overviewItemNames: Locator;
  readonly overviewItemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Complete
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backToProductsButton: Locator;

  // Shared
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.overviewItems = page.locator('.cart_item');
    this.overviewItemNames = page.locator('.cart_item .inventory_item_name');
    this.overviewItemPrices = page.locator('.cart_item .inventory_item_price');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText = page.locator('.complete-text');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');

    this.pageTitle = page.locator('.title');
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async getOverviewItemNames(): Promise<string[]> {
    return this.overviewItemNames.allTextContents();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent() ?? '';
    return parseFloat(text.replace('$', '').split(':').pop()?.trim() ?? '');
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent() ?? '';
    return parseFloat(text.replace('$', '').split(':').pop()?.trim() ?? '');
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent() ?? '';
    return parseFloat(text.replace('$', '').split(':').pop()?.trim() ?? '');
  }
}
