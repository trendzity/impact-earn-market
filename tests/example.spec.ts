import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('https://impact-earn-market-l7bd.vercel.app/');

  await expect(page).toHaveTitle(/Trendzity/i);
});