import { Page, Locator } from '@playwright/test';
import { credentials } from '../data/credentials';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  public readonly errorMessage: Locator;
  // SauceDemo's error dismiss button has no dedicated data-test attribute;
  // the compound descendant selector is the only stable option.
  private readonly errorCloseButton: Locator;
  // SauceDemo provides no data-test attributes on these login page wrapper elements.
  public readonly loginLogo: Locator;
  public readonly loginContainer: Locator;

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

  getUsernameInput(): Locator {
    return this.usernameInput;
  }

  getPasswordInput(): Locator {
    return this.passwordInput;
  }

  getLoginButton(): Locator {
    return this.loginButton;
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** @remarks Requires goto() to have been called first. */
  async loginAsStandardUser(): Promise<void> {
    await this.login(credentials.standardUser.username, credentials.standardUser.password);
  }

  /** @remarks Requires goto() to have been called first. */
  async loginAsLockedOutUser(): Promise<void> {
    await this.login(credentials.lockedOutUser.username, credentials.lockedOutUser.password);
  }

  /** @remarks Requires goto() to have been called first. */
  async loginAsProblemUser(): Promise<void> {
    await this.login(credentials.problemUser.username, credentials.problemUser.password);
  }

  /** @remarks Requires goto() to have been called first. */
  async loginAsPerformanceGlitchUser(): Promise<void> {
    await this.login(
      credentials.performanceGlitchUser.username,
      credentials.performanceGlitchUser.password
    );
  }

  /** @remarks Requires goto() to have been called first. */
  async loginAsErrorUser(): Promise<void> {
    await this.login(credentials.errorUser.username, credentials.errorUser.password);
  }

  async dismissError(): Promise<void> {
    await this.errorCloseButton.click();
  }
}
