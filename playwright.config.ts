import { defineConfig } from "@playwright/test";

const port = process.env.UI_TEST_PORT ?? "4173";

export default defineConfig({
  testDir: "./tests",
  // The user's historical demo suite is loaded unchanged by a wrapper that
  // redirects only its test Page navigations to the isolated /demo boundary.
  testIgnore: ["**/workshopos.spec.ts"],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run preview -- --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
  },
});
