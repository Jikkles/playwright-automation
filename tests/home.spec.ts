import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ChampionPage } from '../pages/ChampionPage';

const CHAMPION_NAME = 'Zoe';

test.describe('Home Page', () => {

  test('should load the home page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    // assertions will go here
  });

  test('should search for Zoe, navigate to champion page, and return home', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(page).toHaveURL('/');

    await homePage.searchAndSelectZoe();
    await expect(page).toHaveURL(`/champions/${CHAMPION_NAME}/build`);

    const championPage = new ChampionPage(page);
    await championPage.returnToHome();
    await expect(page).toHaveURL('/');
  });

});