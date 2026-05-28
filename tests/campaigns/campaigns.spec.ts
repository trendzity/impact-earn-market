import { test, expect } from "@playwright/test";

test("Campaign page loads successfully", async ({ page }) => {
  // Open campaigns page
  await page.goto("/business/campaigns");

  // Verify route
  await expect(page).toHaveURL(
    /campaigns/
  );

  // Verify page heading
  await expect(
    page.getByRole("heading", {
      name: /campaign/i,
    })
  ).toBeVisible();
});