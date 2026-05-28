import { test, expect } from "@playwright/test";

test("Valid login", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByRole("textbox", { name: "Email" })
    .fill("qa@trendzity.com");

  await page
    .getByRole("textbox", { name: "Password" })
    .fill("Password@123");

  await page
    .getByRole("button", { name: /sign in/i })
    .click();

  await expect(page).toHaveURL(/dashboard|admin|business|influencer|reseller/);
});