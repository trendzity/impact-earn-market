import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

import { testUser } from '../utils/testData';

test('Logout user', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(
    testUser.validEmail,
    testUser.validPassword
  );

  await page.click('[data-testid="profile-menu"]');

  await page.click('[data-testid="logout-btn"]');

  await expect(page).toHaveURL(/login/);

});