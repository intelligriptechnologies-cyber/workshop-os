import { expect, test } from "@playwright/test";

const branchId = "00000000-0000-4000-8000-000000000011";
const job = { id: "00000000-0000-4000-8000-000000000905", branchId, jobNumber: "JOB-00000000", visitId: "visit", visitDate: "2026-09-15", checkedInAt: "2026-09-15T04:00:00.000Z", customerName: "Asha Rao", registration: "DL01AB1234", vehicleDescription: "Honda City", customerRequest: "Annual service", promisedHandoffAt: "2026-09-15T12:00:00.000Z", stage: "ACTIVE", statusLabel: "In Progress", version: 1, updatedAt: "2026-09-15T04:00:00.000Z", settingsSnapshotCaptured: true, documents: [{ id: "doc-1", type: "RECEIPT", label: "RCPT-001" }] };

async function mock(page: import("@playwright/test").Page, permissions = ["jobs.page", "job.read", "job.document.download", "job.export"]) {
  await page.route("**/api/v1/auth/config", route => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/session", route => route.fulfill({ json: { membership: { branches: [{ id: branchId, name: "Delhi" }], permissions } } }));
  await page.route("**/api/v1/list-preferences/jobs", route => route.fulfill({ json: { preference: { viewMode: "table", version: 1 } } }));
  await page.route("**/api/v1/jobs**", route => { const url = new URL(route.request().url()); return url.pathname === `/api/v1/jobs/${job.id}` ? route.fulfill({ json: { job } }) : route.fulfill({ json: { jobs: [job], page: { page: 1, pageSize: 25, totalCount: 1, pageCount: 1 }, query: { search: "", branchId: "", visitDate: "2026-09-15", stage: "", sort: "visitDate.desc", page: 1, pageSize: 25 }, timezone: "Asia/Kolkata" } }); });
}

test("Job List defaults by Visit date and keeps In Progress orange in table, grid, and details", async ({ page }) => {
  await mock(page); await page.goto("/production/jobs");
  await expect(page.getByLabel("Visit/check-in date")).toHaveValue("2026-09-15");
  await expect(page.locator(".job-status-in-progress").first()).toHaveText("In Progress");
  await page.getByRole("button", { name: "Grid" }).click(); await expect(page.locator(".job-status-in-progress").first()).toHaveText("In Progress");
  await page.getByRole("button", { name: "View details" }).click(); await expect(page.locator("#job-detail").locator("..").locator(".job-status-in-progress")).toHaveText("In Progress");
  await expect(page.getByRole("button", { name: /Download receipt RCPT-001/ }).first()).toBeVisible();
  await page.getByLabel("Status").selectOption("ACTIVE"); await expect(page).toHaveURL(/stage=ACTIVE/);
  await page.getByRole("button", { name: "Clear" }).click(); await expect(page).not.toHaveURL(/stage=/); await expect(page.getByLabel("Visit/check-in date")).toHaveValue("2026-09-15");
});

test("Job document controls are hidden without the exact action permission", async ({ page }) => {
  await mock(page, ["jobs.page", "job.read"]); await page.goto("/production/jobs");
  await expect(page.getByRole("button", { name: /Download/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View details" })).toBeVisible();
});

test("Job List and Job Card load through the production HTTP/PostgreSQL runtime", async ({ page }) => {
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL, "requires the production Docker stack");
  await page.goto("/production/jobs");
  await expect(page.getByText("Asha Rao", { exact: true })).toBeVisible();
  const response = await page.request.get(`/api/v1/jobs/${job.id}/job-card`, { headers: { "x-workshopos-identity": "north-admin" } });
  expect(response.ok()).toBeTruthy(); expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
});
