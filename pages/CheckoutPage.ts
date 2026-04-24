import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Step 1 — Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step 2 — Overview
  readonly overviewItemNames: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Complete
  readonly confirmationHeader: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.overviewItemNames = page.locator('[data-test="inventory-item-name"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
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

  private async parseCurrencyLabel(locator: Locator): Promise<number> {
    const text = (await locator.textContent()) ?? '';
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : NaN;
  }

  async getSubtotal(): Promise<number> {
    return this.parseCurrencyLabel(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.parseCurrencyLabel(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.parseCurrencyLabel(this.totalLabel);
  }
}
