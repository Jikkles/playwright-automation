import { Page, Locator } from '@playwright/test';
import { credentials } from '../data/credentials';

export class LoginPage {
  private readonly page: Page;
  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;
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

  public async goto(): Promise<void> {
    await this.page.goto('/');
  }

  public async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  public async loginAsStandardUser(): Promise<void> {
    await this.goto();
    await this.login(credentials.standardUser.username, credentials.standardUser.password);
  }

  public async loginAsLockedOutUser(): Promise<void> {
    await this.goto();
    await this.login(credentials.lockedOutUser.username, credentials.lockedOutUser.password);
  }

  public async loginAsProblemUser(): Promise<void> {
    await this.goto();
    await this.login(credentials.problemUser.username, credentials.problemUser.password);
  }

  public async loginAsPerformanceGlitchUser(): Promise<void> {
    await this.goto();
    await this.login(
      credentials.performanceGlitchUser.username,
      credentials.performanceGlitchUser.password
    );
  }

  public async loginAsErrorUser(): Promise<void> {
    await this.goto();
    await this.login(credentials.errorUser.username, credentials.errorUser.password);
  }

  public async dismissError(): Promise<void> {
    await this.errorCloseButton.click();
  }
}
