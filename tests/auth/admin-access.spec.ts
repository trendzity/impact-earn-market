import { test, expect } from "@playwright/test";

test("Non-admin cannot access admin panel", async ({ page }) => {
  // Login as normal user
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

  // Try opening admin route manually
  await page.goto("/admin");

  // Verify non-admin is blocked
  await expect(page).not.toHaveURL(/admin/);
});

test("Admin user can access admin panel", async ({ page }) => {
  // Login as admin
  await page.goto("/login");

  await page
    .getByRole("textbox", {
      name: "Email",
    })
    .fill("admintrendzity@gmail.com");

  await page
    .getByRole("textbox", {
      name: "Password",
    })
    .fill("admin@123");

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click();

  // Verify admin redirect
  await expect(page).toHaveURL(/admin/);
});