import { Page, Locator } from '@playwright/test';

export class ChampionPage {
  readonly page: Page;
  // Locators will go here, for example:
  readonly homeIcon: Locator;
  // readonly otherLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    // Assign your locators here, for example:
    this.homeIcon = page.getByRole('img', { name: 'DPMLOL' });
    // this.otherLocator = page.locator('');
  }

  async goto() {
    await this.page.goto('/');
  }

  // Methods will go here, for example:
  async returnToHome() {
    await this.homeIcon.click();
  }
}
