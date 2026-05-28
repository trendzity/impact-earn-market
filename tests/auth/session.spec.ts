import { test, expect } from "@playwright/test";

test("User session persists after refresh", async ({ page }) => {
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

  // Verify login success
  await expect(page).toHaveURL(
    /dashboard|business|influencer|reseller|admin/
  );

  // Refresh browser
  await page.reload();

  // Verify session still active
  await expect(page).not.toHaveURL(/login/);
});

test("User logout redirects to login", async ({ page }) => {
  // Login first
  await page.goto("/login");

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

  // Wait for dashboard
  await expect(page).toHaveURL(
    /dashboard|business|influencer|reseller|admin/
  );

  // Click logout button
  await page
    .getByRole("button", {
      name: /logout|sign out/i,
    })
    .click();

  // Verify redirected to login
  await expect(page).toHaveURL(/login/);
});