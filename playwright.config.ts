import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  timeout: 30000,

  retries: 1,

  use: {
    baseURL: "http://localhost:5173",

    headless: true,

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    trace: "retain-on-failure",
  },

  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: true,
    env: process.env.VITE_API_URL
      ? { VITE_API_URL: process.env.VITE_API_URL }
      : undefined,
  },

  reporter: [
    ["html"],
    ["list"],
  ],
});