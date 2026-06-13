import { test as setup } from "@playwright/test";

setup("authenticate", async ({ page }) => {
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

  await page.waitForURL(
    /dashboard|business|influencer|reseller|admin/
  );

  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});