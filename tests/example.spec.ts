import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('https://trendzity.xyz');

  await expect(page).toHaveTitle(/Trendzity/i);
});