import { test, expect } from '@playwright/test';

import { RegisterPage } from '../pages/RegisterPage';

import { LoginPage } from '../pages/LoginPage';

test('Complete auth flow', async ({ page }) => {

  const registerPage = new RegisterPage(page);

  const loginPage = new LoginPage(page);

  const email = `qa${Date.now()}@gmail.com`;

  const password = 'Password@123';

  // REGISTER

  await registerPage.goto();

  await registerPage.register(
    'QA Tester',
    email,
    password
  );

  // LOGIN

  await loginPage.goto();

  await loginPage.login(
    email,
    password
  );

  // VERIFY DASHBOARD

  await expect(page).toHaveURL(
    /\/(dashboard|admin|business|influencer|reseller|select-role|onboarding)/
  );

});