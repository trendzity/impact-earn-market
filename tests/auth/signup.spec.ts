import { test, expect } from "@playwright/test";

test("Valid signup", async ({ page }) => {
  // Open signup page
  await page.goto("/signup?mode=signup");

  // Fill full name
  await page
    .locator('input[id="name"]')
    .fill("QA Automation");

  // Fill email
  await page
    .getByRole("textbox", {
      name: "Email",
    })
    .fill(`qa${Date.now()}@trendzity.com`);

  // Fill password
  await page
    .getByRole("textbox", {
      name: "Password",
    })
    .fill("Password@123");

  // Click signup button
  await page
    .getByRole("button", {
      name: /sign up/i,
    })
    .click();

  // Expected redirect
  await expect(page).toHaveURL(
    /select-role|dashboard|onboarding/
  );
});