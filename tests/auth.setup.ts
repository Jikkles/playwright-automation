import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();
  await page.waitForURL('**/inventory.html');
  await page.context().storageState({ path: authFile });
});
