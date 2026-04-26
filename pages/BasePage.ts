import { Page, Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export abstract class BasePage {
  protected readonly page: Page;
  // Burger menu uses stable element IDs; no data-test attributes exist on these elements.
  // openBurgerMenu/closeBurgerMenu remain public so navigation tests can exercise them directly.
  // burgerMenuClose is internal-only; all other burger locators are public for visibility assertions.
  public readonly burgerMenuButton: Locator;
  protected readonly burgerMenuClose: Locator;
  public readonly burgerMenuAllItems: Locator;
  public readonly burgerMenuLogout: Locator;
  public readonly burgerMenuReset: Locator;
  // cartBadge and pageTitle remain public so tests can use Playwright's auto-retrying locator assertions
  // (e.g. toHaveText, toBeHidden) — getCartBadgeCount() returns a number and cannot replace these.
  public readonly cartIcon: Locator;
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

  async openBurgerMenu(): Promise<void> {
    await this.burgerMenuButton.click();
  }

  async closeBurgerMenu(): Promise<void> {
    await this.burgerMenuClose.click();
  }

  async logout(): Promise<void> {
    await this.openBurgerMenu();
    await this.burgerMenuLogout.click();
  }

  async resetAppState(): Promise<void> {
    await this.openBurgerMenu();
    await this.burgerMenuReset.click();
  }

  async navigateToAllItems(): Promise<void> {
    await this.openBurgerMenu();
    await this.burgerMenuAllItems.click();
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async getCartBadgeCount(): Promise<number> {
    // badge element is absent when cart is empty
    if (!(await this.cartBadge.isVisible())) return 0;
    const text = (await this.cartBadge.textContent()) ?? '0';
    const count = parseInt(text, 10);
    if (isNaN(count)) throw new Error(`Could not parse cart badge count from: "${text}"`);
    return count;
  }

  async checkAccessibility(): Promise<void> {
    const results = await new AxeBuilder({ page: this.page }).analyze();
    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}`)
        .join('\n');
      throw new Error(`Accessibility violations found:\n${summary}`);
    }
  }
}
