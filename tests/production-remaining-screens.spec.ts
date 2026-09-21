import { expect, test } from "@playwright/test";

const branchId = "00000000-0000-4000-8000-000000000011";
const permissions = [
  "follow-ups.page",
  "follow-up.read",
  "follow-up.manage",
  "follow-ups.export",
];

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes("real PostgreSQL stack")) return;
  await page.route("**/api/v1/auth/config", (route) =>
    route.fulfill({ json: { mode: "local", allowDemo: true } }),
  );
  await page.route("**/api/v1/session", (route) =>
    route.fulfill({
      json: {
        membership: {
          displayName: "Admin",
          branches: [{ id: branchId, name: "Delhi" }],
          permissions,
        },
      },
    }),
  );
  await page.route("**/api/v1/list-preferences/follow-ups", (route) =>
    route.fulfill({
      json: {
        preference: {
          viewMode:
            route.request().method() === "PUT"
              ? route.request().postDataJSON().viewMode
              : "table",
          version: 1,
        },
      },
    }),
  );
});

test("remaining screen uses URL list state, accessible dialogs, persisted presentation, and a reasoned command", async ({
  page,
}) => {
  let status = "OPEN";
  let command: any;
  await page.route("**/api/v1/operations/follow-ups**", async (route) => {
    if (route.request().method() === "POST") {
      command = route.request().postDataJSON();
      status = "COMPLETED";
      return route.fulfill({ status: 201, json: { row: {} } });
    }
    return route.fulfill({
      json: {
        rows: [
          {
            id: "follow-1",
            branchId,
            title: "Call Asha",
            subtitle: "Job 1 · due today",
            status,
            updatedAt: "2026-09-16T10:00:00.000Z",
            version: status === "OPEN" ? 1 : 2,
          },
        ],
        page: { page: 1, pageSize: 25, totalCount: 1, pageCount: 1 },
        query: {},
      },
    });
  });

  await page.goto("/production/follow-ups");
  await expect(
    page.getByRole("heading", { name: "Follow-ups", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Search").fill("Asha");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page).toHaveURL(/search=Asha/);
  await page.getByLabel("Rows").selectOption("50");
  await expect(page).toHaveURL(/pageSize=50/);
  await page.getByRole("button", { name: "Grid" }).click();

  await page.getByRole("button", { name: "View Call Asha" }).click();
  await expect(page.getByRole("dialog", { name: "Call Asha" })).toContainText(
    "follow-1",
  );
  await page.getByRole("button", { name: "Close" }).click();

  await page
    .getByRole("button", { name: "Complete Call Asha" })
    .click();
  await page.getByLabel("Reason").fill("Customer reached and follow-up resolved");
  await page.getByRole("button", { name: "Complete", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("reason was recorded");
  expect(command).toEqual({
    version: 1,
    reason: "Customer reached and follow-up resolved",
  });
});

test("production root is authoritative and the legacy demo is not linked", async ({
  page,
}) => {
  await page.unroute("**/api/v1/session");
  await page.route("**/api/v1/session", (route) =>
    route.fulfill({
      json: {
        membership: {
          displayName: "Admin",
          branches: [{ id: branchId, name: "Delhi" }],
          permissions: ["follow-ups.page"],
        },
      },
    }),
  );
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "WorkshopOS" })).toBeVisible();
  await expect(page.getByText("PostgreSQL is authoritative")).toBeVisible();
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "Follow-ups" }),
  ).toBeVisible();
  await expect(page.locator('a[href="/demo"]')).toHaveCount(0);
});

test("remaining masters persist through the real PostgreSQL stack", async ({
  page,
}) => {
  test.skip(
    !process.env.PRODUCTION_E2E_BASE_URL,
    "requires the production Docker stack",
  );
  await page.goto("/production/masters");
  await expect(page.getByText("MAIN").first()).toBeVisible();
  await page.getByRole("button", { name: "Grid" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Grid" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
