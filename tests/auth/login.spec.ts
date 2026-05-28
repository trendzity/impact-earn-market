import { test } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

import { testUser } from '../utils/testData';

test('Valid login', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(
    testUser.validEmail,
    testUser.validPassword
  );

  await loginPage.verifyLoginSuccess();

});

test('Invalid login', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(
    testUser.invalidEmail,
    testUser.invalidPassword
  );

  await loginPage.verifyLoginFailure();

});