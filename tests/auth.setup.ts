import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import path from 'path';

setup('authenticate', async ({ page, browserName }) => {
  const authFile = path.join(__dirname, `../.auth/${browserName}.json`);
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await page.context().storageState({ path: authFile });
});
