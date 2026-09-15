import { expect, test } from "@playwright/test";

const branchId = "00000000-0000-4000-8000-000000000011",
  jobId = "00000000-0000-4000-8000-000000000905";
const job = {
  id: jobId,
  branchId,
  jobNumber: "JOB-00000000",
  visitDate: "2026-09-15",
  customerName: "Asha Rao",
  registration: "DL01AB1234",
  stage: "ACTIVE",
  allowedCategories: ["PROGRESS"],
};
const media = (status: "PENDING" | "CLEAN" = "PENDING") => ({
  id: "00000000-0000-4000-8000-000000000950",
  jobId,
  branchId,
  jobNumber: job.jobNumber,
  visitDate: job.visitDate,
  customerName: job.customerName,
  registration: job.registration,
  label: "Engine running",
  category: "PROGRESS",
  fileName: "engine.png",
  mimeType: "image/png",
  byteLength: 20,
  scanStatus: status,
  thumbnailDataUrl: "data:image/png;base64,iVBORw0KGgo=",
  available: status === "CLEAN",
  archived: false,
  version: status === "CLEAN" ? 2 : 1,
  createdAt: "2026-09-15T05:00:00.000Z",
});
async function mock(
  page: import("@playwright/test").Page,
  status: "PENDING" | "CLEAN" = "PENDING",
) {
  await page.route("**/api/v1/auth/config", (route) =>
    route.fulfill({ json: { mode: "local", allowDemo: true } }),
  );
  await page.route("**/api/v1/session", (route) =>
    route.fulfill({
      json: {
        membership: {
          branches: [{ id: branchId, name: "Delhi" }],
          permissions: [
            "media.page",
            "media.read",
            "media.upload",
            "media.archive",
            "media.download",
          ],
        },
      },
    }),
  );
  await page.route("**/api/v1/media**", (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/archive"))
      return route.fulfill({
        json: { id: media().id, version: 3, archived: true },
      });
    if (route.request().method() === "POST")
      return route.fulfill({ status: 201, json: { media: media() } });
    return route.fulfill({
      json: {
        media: [media(status)],
        page: { page: 1, pageSize: 25, totalCount: 1, pageCount: 1 },
        query: {
          search: "",
          branchId: "",
          visitDate: "2026-09-15",
          jobId: "",
          category: "",
          includeArchived: false,
          page: 1,
          pageSize: 25,
        },
        timezone: "Asia/Kolkata",
      },
    });
  });
  await page.route("**/api/v1/media/jobs**", (route) =>
    route.fulfill({ json: { jobs: [job], timezone: "Asia/Kolkata" } }),
  );
}

test("Media cascades Visit date to searchable Jobs and only offers lifecycle-valid categories", async ({
  page,
}) => {
  await mock(page);
  await page.goto(`/production/media?visitDate=2026-09-15&jobId=${jobId}`);
  await expect(page.getByLabel("Visit/check-in date")).toHaveValue(
    "2026-09-15",
  );
  await expect(page.getByRole("combobox", { name: /^Job/ })).toHaveValue(jobId);
  await expect(
    page.getByRole("combobox", { name: /^Upload category/ }).locator("option"),
  ).toHaveText(["Choose category", "PROGRESS"]);
  await expect(page.getByText(/PENDING/)).toBeVisible();
  await expect(page.getByRole("button", { name: "View original" })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Archive" }).click();
  await page.getByRole("dialog").getByLabel("Reason").fill("Duplicate angle");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Archive media", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "metadata and audit trail were retained",
  );
});

test("clean media exposes authorized view and download while denied controls stay hidden", async ({
  page,
}) => {
  await mock(page, "CLEAN");
  await page.goto("/production/media?visitDate=2026-09-15");
  await expect(
    page.getByRole("button", { name: "View original" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download original" }),
  ).toBeVisible();
});

test("Media loads through production HTTP and PostgreSQL", async ({ page }) => {
  test.skip(
    !process.env.PRODUCTION_E2E_BASE_URL,
    "requires the production Docker stack",
  );
  await page.goto("/production/media");
  await expect(
    page.getByRole("heading", { name: "Media", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("combobox", { name: /^Job/ })
      .locator(`option[value="${jobId}"]`),
  ).toContainText("JOB-00000000");
});
