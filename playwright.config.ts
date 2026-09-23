import { defineConfig } from "@playwright/test";

// The real-Frappe auth test (tests/frappe-auth.spec.ts) needs the app served from a CORS/cookie
// origin the Task 1 bench actually allows (http://localhost:5173 — see site_config.json's
// `allow_cors`), so it runs the Vite dev server instead of the built preview bundle the rest of
// the suite uses. Run it with: FRAPPE_TEST=1 npx playwright test tests/frappe-auth.spec.ts
const isFrappeAuthRun = process.env.FRAPPE_TEST === "1";
const port = process.env.UI_TEST_PORT ?? (isFrappeAuthRun ? "5173" : "4173");
const host = isFrappeAuthRun ? "localhost" : "127.0.0.1";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: `http://${host}:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    // The mocked suite (tests/workshopos.spec.ts, tests/global-users.spec.ts) needs the local
    // demo-login mode baked into the built bundle — VITE_AUTH_MODE is read at build time, so
    // `vite preview` alone (serving a stale dist/) won't pick up an env var set only for it.
    // Rebuild first so the preview bundle actually has local mode. Frappe's own auth test needs
    // no such flag: it uses the real Frappe backend directly via the (unbuilt) dev server.
    command: isFrappeAuthRun
      ? `npm run dev -- --port ${port} --strictPort`
      : `npm run build && npm run preview -- --port ${port}`,
    url: `http://${host}:${port}`,
    reuseExistingServer: true,
    env: isFrappeAuthRun ? {} : { VITE_AUTH_MODE: "local" },
  },
});
