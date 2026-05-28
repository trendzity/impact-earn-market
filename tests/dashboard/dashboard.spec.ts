import { test, expect } from "@playwright/test";

test("Dashboard loads successfully after login", async ({ page }) => {
  // Open login page
  await page.goto("/login");

  // Login
  await page
    .getByRole("textbox", {
      name: "Email",
    })
    .fill("qa@trendzity.com");

  await page
    .getByRole("textbox", {
      name: "Password",
    })
    .fill("Password@123");

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click();

  // Verify dashboard route
  await expect(page).toHaveURL(
    /dashboard|business|influencer|reseller/
  );

  // Verify dashboard content visible
  await expect(
    page.getByText(/dashboard/i)
  ).toBeVisible();
});