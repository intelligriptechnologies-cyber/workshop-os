import { test } from "@playwright/test";

// Preserve and execute the historical user-owned demo suite without editing
// it. Its root navigations are redirected to the explicitly isolated demo
// boundary now that `/` is the PostgreSQL-authoritative production workspace.
test.beforeEach(async ({ page }) => {
  const navigate = page.goto.bind(page);
  page.goto = ((url, options) =>
    navigate(url === "/" ? "/demo" : url, options)) as typeof page.goto;
});

await import("./workshopos.spec");
