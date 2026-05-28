import { Page, expect } from '@playwright/test';

export class RegisterPage {

  constructor(private page: Page) {}

  async goto() {

    await this.page.goto(
      'https://impact-earn-market-l7bd.vercel.app/register',
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await expect(
      this.page.getByRole('heading')
    ).toBeVisible();

  }

  async register(
    name: string,
    email: string,
    password: string
  ) {

    await this.page.getByRole('textbox', {
      name: /name/i
    }).fill(name);

    await this.page.getByRole('textbox', {
      name: /email/i
    }).fill(email);

    await this.page.getByRole('textbox', {
      name: /password/i
    }).fill(password);

    await this.page.getByRole('button', {
      name: /sign up|register/i
    }).click();

  }

  async verifyRegisterSuccess() {

    await this.page.waitForLoadState('networkidle');

    await expect(this.page).not.toHaveURL(/register/);

  }
}