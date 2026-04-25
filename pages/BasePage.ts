import { Page, Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export abstract class BasePage {
  readonly page: Page;
  // Burger menu uses stable element IDs; no data-test attributes exist on these elements
  readonly burgerMenuButton: Locator;
  readonly burgerMenuClose: Locator;
  readonly burgerMenuAllItems: Locator;
  readonly burgerMenuLogout: Locator;
  readonly burgerMenuReset: Locator;
  // Cart chrome and page title are present on every authenticated page
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly pageTitle: Locator;

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
    if (!(await this.cartBadge.isVisible())) return 0;
    const text = (await this.cartBadge.textContent()) ?? '0';
    return parseInt(text, 10);
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
