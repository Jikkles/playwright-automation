import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  // Locators will go here, for example:
  readonly searchBar: Locator;
  readonly zoeChampion: Locator;
  // readonly navBar: Locator;

  constructor(page: Page) {
    this.page = page;
    // Assign your locators here, for example:
    this.searchBar = page.getByText('Search Summoner, Champion,');
    this.zoeChampion = page.getByText('Zoe', { exact: true });
    // this.navBar = page.locator('');
  }

  async goto() {
    await this.page.goto('/');
  }

  // Methods will go here, for example:
  async searchAndSelectZoe() {
    await this.searchBar.click();
    await this.searchBar.fill('Zoe');
    await this.zoeChampion.click();
  }
}