import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly inventoryItemDescriptions: Locator;
  readonly addToCartButtons: Locator;
  readonly removeFromCartButtons: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly pageTitle: Locator;
  readonly burgerMenuButton: Locator;
  readonly burgerMenuClose: Locator;
  readonly burgerMenuAllItems: Locator;
  readonly burgerMenuLogout: Locator;
  readonly burgerMenuReset: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.addToCartButtons = page.locator('button[data-test*="add-to-cart"]');
    this.removeFromCartButtons = page.locator('button[data-test*="remove"]');
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.pageTitle = page.locator('[data-test="title"]');
    // Burger menu uses stable element IDs; no data-test attributes exist on these elements
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.burgerMenuClose = page.locator('#react-burger-cross-btn');
    this.burgerMenuAllItems = page.locator('#inventory_sidebar_link');
    this.burgerMenuLogout = page.locator('#logout_sidebar_link');
    this.burgerMenuReset = page.locator('#reset_sidebar_link');
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

  async clickItemByName(name: string): Promise<void> {
    await this.inventoryItemNames.filter({ hasText: name }).click();
  }

  async addFirstItemToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }

  async addItemsToCart(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addToCartButtons.nth(i).click();
    }
  }

  async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator('button[data-test*="add-to-cart"]').click();
  }

  async removeFirstItemFromCart(): Promise<void> {
    await this.removeFromCartButtons.first().click();
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.textContent() ?? '0';
  }

  async getInventoryItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.inventoryItemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrices.allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async getItemDescriptions(): Promise<string[]> {
    return this.inventoryItemDescriptions.allTextContents();
  }
}
