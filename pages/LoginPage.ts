import { Page, Locator } from '@playwright/test';
import { credentials } from '../data/credentials';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;
  readonly loginLogo: Locator;
  readonly loginContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
    this.loginLogo = page.locator('.login_logo');
    this.loginContainer = page.locator('.login_container');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsStandardUser() {
    await this.login(credentials.standardUser.username, credentials.standardUser.password);
  }

  async loginAsLockedOutUser() {
    await this.login(credentials.lockedOutUser.username, credentials.lockedOutUser.password);
  }

  async loginAsProblemUser() {
    await this.login(credentials.problemUser.username, credentials.problemUser.password);
  }

  async loginAsPerformanceGlitchUser() {
    await this.login(credentials.performanceGlitchUser.username, credentials.performanceGlitchUser.password);
  }

  async getErrorMessageText(): Promise<string | null> {
    return this.errorMessage.textContent();
  }

  async dismissError() {
    await this.errorCloseButton.click();
  }
}
