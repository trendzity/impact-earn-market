import { Page, expect } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async goto() {

    await this.page.goto(
      'https://impact-earn-market-l7bd.vercel.app/login',
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await expect(
      this.page.getByRole('heading', {
        name: 'Welcome Back'
      })
    ).toBeVisible();

  }

  async login(email: string, password: string) {

    await this.page.getByRole('textbox', {
      name: 'Email'
    }).fill(email);

    await this.page.getByRole('textbox', {
      name: 'Password'
    }).fill(password);

    await this.page.getByRole('button', {
      name: 'Sign In'
    }).click();

  }

  async verifyLoginSuccess() {

    await this.page.waitForURL('**/dashboard', {
      timeout: 15000
    });

    await expect(this.page).toHaveURL(/dashboard/);

  }

  async verifyLoginFailure() {

    await expect(
      this.page.locator('text=Invalid')
    ).toBeVisible({
      timeout: 10000
    });

  }
}