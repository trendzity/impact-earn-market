import { test } from '@playwright/test';

import { RegisterPage } from '../pages/RegisterPage';

test('New user registration', async ({ page }) => {

  const registerPage = new RegisterPage(page);

  const email = `qa${Date.now()}@gmail.com`;

  const password = 'Password@123';

  await registerPage.goto();

  await registerPage.register(
    'QA Tester',
    email,
    password
  );

  await registerPage.verifyRegisterSuccess();

});