import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseCurrency } from '../data/utils';

export class CheckoutPage extends BasePage {
  // Step 1 — Your Information
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  public readonly errorMessage: Locator;

  // Step 2 — Overview
  private readonly overviewItemNames: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;

  // Complete
  public readonly confirmationHeader: Locator;
  private readonly backToProductsButton: Locator;

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

  /** Fills customer info fields. Does not submit — call submitCustomerInfo() separately. */
  public async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /** Submits the customer information form filled by fillCustomerInfo(). */
  public async submitCustomerInfo(): Promise<void> {
    await this.continueButton.click();
  }

  public async finish(): Promise<void> {
    await this.finishButton.click();
  }

  public async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  public async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  public async getOverviewItemNames(): Promise<string[]> {
    return await this.overviewItemNames.allTextContents();
  }

  public async getSubtotal(): Promise<number> {
    return parseCurrency(await this.readText(this.subtotalLabel, 'Subtotal'));
  }

  public async getTax(): Promise<number> {
    return parseCurrency(await this.readText(this.taxLabel, 'Tax'));
  }

  public async getTotal(): Promise<number> {
    return parseCurrency(await this.readText(this.totalLabel, 'Total'));
  }
}
