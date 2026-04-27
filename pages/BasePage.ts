import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  // SauceDemo provides no data-test attributes on burger menu elements; stable element IDs are used instead.
  public readonly burgerMenuButton: Locator;
  // protected rather than public — no test ever needs a locator assertion on the close button
  protected readonly burgerMenuClose: Locator;
  public readonly burgerMenuAllItems: Locator;
  public readonly burgerMenuLogout: Locator;
  public readonly burgerMenuReset: Locator;
  private readonly cartIcon: Locator;
  // cartBadge and pageTitle remain public so tests can use Playwright's auto-retrying locator assertions
  // (e.g. toHaveText, toBeHidden) — getCartBadgeCount() returns a number and cannot replace these.
  public readonly cartBadge: Locator;
  public readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.burgerMenuClose = page.locator('#react-burger-cross-btn');
    this.burgerMenuAllItems = page.locator('#inventory_sidebar_link');
    this.burgerMenuLogout = page.locator('#logout_sidebar_link');
    this.burgerMenuReset = page.locator('#reset_sidebar_link');
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  public async openBurgerMenu(): Promise<void> {
    await this.burgerMenuButton.click();
  }

  public async closeBurgerMenu(): Promise<void> {
    await this.burgerMenuClose.click();
  }

  public async logout(): Promise<void> {
    await this.openBurgerMenu();
    await this.burgerMenuLogout.click();
  }

  public async resetAppState(): Promise<void> {
    await this.openBurgerMenu();
    await this.burgerMenuReset.click();
  }

  public async navigateToAllItems(): Promise<void> {
    await this.openBurgerMenu();
    await this.burgerMenuAllItems.click();
  }

  public async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  // point-in-time snapshot — do not use as a synchronisation point; prefer expect(cartBadge).toHaveText() for retrying assertions
  public async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    // null means the badge element is absent from the DOM — cart is empty
    if (!text) return 0;
    const count = parseInt(text, 10);
    if (isNaN(count)) throw new Error(`Could not parse cart badge count from: "${text}"`);
    return count;
  }

  // innerText() waits for the element to be visible and stable (uses Playwright's action timeout)
  protected async readText(locator: Locator, field: string): Promise<string> {
    const raw = await locator.innerText();
    if (!raw.trim()) throw new Error(`${field} element returned empty text`);
    return raw.trim();
  }
}
