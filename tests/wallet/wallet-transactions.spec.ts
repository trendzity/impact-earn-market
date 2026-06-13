import { test, expect } from "@playwright/test";

test("Transaction history loads", async ({ page }) => {
  await page.goto("/dashboard/wallet");

  await expect(
    page.getByText("Transaction History")
  ).toBeVisible();

  await expect(
    page.locator("table")
  ).toBeVisible();
});