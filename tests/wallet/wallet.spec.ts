import { test, expect } from "@playwright/test";

test("Wallet page loads successfully", async ({ page }) => {
  // Open login page
  await page.goto("/login");

  // Fill login form
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

  // Click login
  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click();

  // WAIT for successful authenticated redirect
  await expect(page).toHaveURL(
    /dashboard|business|influencer|reseller|admin/,
    {
      timeout: 15000,
    }
  );

  // Open wallet page
  await page.goto("/dashboard/wallet");

  // Verify wallet route
  await expect(page).toHaveURL(
    /dashboard\/wallet/
  );

  // Verify wallet heading
  await expect(
    page.getByRole("heading", {
      name: "My Wallet",
    })
  ).toBeVisible();

  // Verify transaction section
  await expect(
    page.getByText("Transaction History")
  ).toBeVisible();

  // Verify balance section
  await expect(
    page.getByText("Total Balance")
  ).toBeVisible();
});