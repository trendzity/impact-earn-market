import { Page, expect } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login', {
      waitUntil: 'domcontentloaded',
    });

    await expect(
      this.page.getByRole('heading', {
        name: /welcome back/i
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
      name: /sign in/i
    }).click();
  }

  async verifyLoginSuccess() {
    await expect(this.page).toHaveURL(
      /\/(dashboard|admin|business|influencer|reseller|select-role|onboarding)/,
      { timeout: 15000 }
    );
  }

  async verifyLoginFailure() {
    await expect(
      this.page.locator('text=Invalid')
    ).toBeVisible({
      timeout: 10000
    });
  }
}
