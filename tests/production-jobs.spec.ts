import { expect, test } from "@playwright/test";

const branchId = "00000000-0000-4000-8000-000000000011";
const job = {
  id: "00000000-0000-4000-8000-000000000905",
  branchId,
  jobNumber: "JOB-00000000",
  visitId: "visit",
  visitDate: "2026-09-15",
  checkedInAt: "2026-09-15T04:00:00.000Z",
  customerName: "Asha Rao",
  registration: "DL01AB1234",
  vehicleDescription: "Honda City",
  customerRequest: "Annual service",
  promisedHandoffAt: "2026-09-15T12:00:00.000Z",
  stage: "ACTIVE",
  statusLabel: "In Progress",
  version: 1,
  updatedAt: "2026-09-15T04:00:00.000Z",
  settingsSnapshotCaptured: true,
  documents: [{ id: "doc-1", type: "RECEIPT", label: "RCPT-001" }],
};

const lifecycle = {
  canonicalStage: "ACTIVE",
  canonicalStageLabel: "In Progress",
  displayStage: "In Progress",
  held: false,
  archived: false,
  version: 1,
  branchId,
  facts: { estimateApproved: true, workAccepted: false, paymentCleared: false },
  validActions: [
    {
      command: "ADVANCE",
      label: "Advance to Quality Control",
      targetStage: "QC",
      reasonRequired: false,
      blockers: [],
    },
    {
      command: "HOLD",
      label: "Place on Hold",
      targetStage: "ACTIVE",
      reasonRequired: true,
      blockers: [],
    },
    {
      command: "CANCEL",
      label: "Cancel Job",
      targetStage: "CANCELLED",
      reasonRequired: true,
      blockers: [],
    },
  ],
  history: [
    {
      kind: "STAGE",
      label: "APPROVED → ACTIVE",
      at: "2026-09-15T04:00:00.000Z",
      actor: "Local Admin",
      auditReference: "audit-1",
    },
  ],
};

async function mock(
  page: import("@playwright/test").Page,
  permissions = [
    "jobs.page",
    "job.read",
    "job.lifecycle.manage",
    "job.document.download",
    "job.export",
    "media.upload",
    "data-flow.page",
    "job.data-flow.read",
  ],
) {
  await page.route("**/api/v1/auth/config", (route) =>
    route.fulfill({ json: { mode: "local", allowDemo: true } }),
  );
  await page.route("**/api/v1/session", (route) =>
    route.fulfill({
      json: {
        membership: {
          branches: [{ id: branchId, name: "Delhi" }],
          permissions,
        },
      },
    }),
  );
  await page.route("**/api/v1/list-preferences/jobs", (route) =>
    route.fulfill({ json: { preference: { viewMode: "table", version: 1 } } }),
  );
  await page.route("**/api/v1/job-data-flow/jobs**", (route) =>
    route.fulfill({
      json: {
        jobs: [
          {
            id: job.id,
            jobNumber: job.jobNumber,
            checkedInAt: "2025-03-01T04:00:00.000Z",
            customerName: job.customerName,
            registration: job.registration,
          },
        ],
        search: "",
      },
    }),
  );
  await page.route("**/api/v1/jobs**", (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === `/api/v1/jobs/${job.id}/lifecycle`)
      return route.fulfill({
        json:
          route.request().method() === "POST"
            ? {
                lifecycle: {
                  ...lifecycle,
                  held: true,
                  displayStage: "On Hold — In Progress",
                  version: 2,
                  validActions: [
                    {
                      command: "RESUME",
                      label: "Resume In Progress",
                      targetStage: "ACTIVE",
                      reasonRequired: true,
                      blockers: [],
                    },
                  ],
                },
                auditReference: "audit-hold",
              }
            : { lifecycle },
      });
    if (url.pathname === `/api/v1/jobs/${job.id}/data-flow`)
      return route.fulfill({
        json: {
          dataFlow: {
            selectedJob: {
              id: job.id,
              jobNumber: job.jobNumber,
              visitId: job.visitId,
              customerName: job.customerName,
              registration: job.registration,
            },
            lifecycle,
            sections: [
              {
                key: "visit",
                label: "Visit / check-in",
                summary: "Checked in for Asha Rao.",
                recordCount: 1,
                relevance: "The Visit establishes custody.",
              },
              {
                key: "payment",
                label: "Payment",
                summary: "Payment Cleared: not recorded.",
                recordCount: 1,
                relevance: "Payment and clearance are distinct.",
              },
            ],
          },
        },
      });
    return url.pathname === `/api/v1/jobs/${job.id}`
      ? route.fulfill({ json: { job } })
      : route.fulfill({
          json: {
            jobs: [job],
            page: { page: 1, pageSize: 25, totalCount: 1, pageCount: 1 },
            query: {
              search: "",
              branchId: "",
              visitDate: "2026-09-15",
              stage: "",
              sort: "visitDate.desc",
              page: 1,
              pageSize: 25,
            },
            timezone: "Asia/Kolkata",
          },
        });
  });
}

test("Job List defaults by Visit date and keeps In Progress orange in table, grid, and details", async ({
  page,
}) => {
  await mock(page);
  await page.goto("/production/jobs");
  await expect(page.getByLabel("Visit/check-in date")).toHaveValue(
    "2026-09-15",
  );
  await expect(page.locator(".job-status-in-progress").first()).toHaveText(
    "In Progress",
  );
  await page.getByRole("button", { name: "Grid" }).click();
  await expect(page.locator(".job-status-in-progress").first()).toHaveText(
    "In Progress",
  );
  await page.getByRole("button", { name: "View details" }).click();
  await expect(page.getByRole("link", { name: "Upload media for this Job" })).toHaveAttribute("href", /\/production\/media\?visitDate=2026-09-15&jobId=/);
  await expect(
    page
      .locator("#job-detail")
      .locator("..")
      .locator(".job-status-in-progress"),
  ).toHaveText("In Progress");
  await expect(
    page.getByRole("button", { name: /Download receipt RCPT-001/ }).first(),
  ).toBeVisible();
  await page.getByLabel("Status").selectOption("ACTIVE");
  await expect(page).toHaveURL(/stage=ACTIVE/);
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page).not.toHaveURL(/stage=/);
  await expect(page.getByLabel("Visit/check-in date")).toHaveValue(
    "2026-09-15",
  );
});

test("Job document controls are hidden without the exact action permission", async ({
  page,
}) => {
  await mock(page, ["jobs.page", "job.read"]);
  await page.goto("/production/jobs");
  await expect(page.getByRole("button", { name: /Download/ })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "View details" }),
  ).toBeVisible();
});

test("Job details project valid actions, capture Hold reason, and show attributed immutable history", async ({
  page,
}) => {
  await mock(page);
  await page.goto("/production/jobs");
  await page.getByRole("button", { name: "View details" }).click();
  await expect(page.getByText("Canonical stage:")).toContainText("In Progress");
  await expect(page.getByText("APPROVED → ACTIVE")).toBeVisible();
  await page.getByRole("button", { name: "Place on Hold" }).click();
  await page.getByLabel("Reason").fill("Awaiting customer authorization");
  const request = page.waitForRequest(
    (request) =>
      request.url().endsWith(`/api/v1/jobs/${job.id}/lifecycle`) &&
      request.method() === "POST",
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Place on Hold", exact: true })
    .click();
  expect((await request).postDataJSON()).toMatchObject({
    command: "HOLD",
    version: 1,
    reason: "Awaiting customer authorization",
  });
  await expect(
    page.getByText("On Hold", { exact: false }).first(),
  ).toBeVisible();
});

test("production Data Flow identifies one Job and explains record-specific sections", async ({
  page,
}) => {
  await mock(page);
  await page.goto("/production/data-flow");
  await expect(page.getByText(/Select a Job above/)).toBeVisible();
  await page.getByLabel("Job", { exact: true }).selectOption(job.id);
  await expect(
    page.getByRole("heading", { name: /JOB-00000000: Asha Rao/ }),
  ).toBeVisible();
  await expect(
    page.getByText(`Selected Job ID: ${job.id}`, { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Payment" })).toBeVisible();
  await expect(
    page.getByText(/Payment and clearance are distinct/),
  ).toBeVisible();
});

test("Data Flow selector uses its exact permission and includes historical Jobs without Job List access", async ({
  page,
}) => {
  const requested: string[] = [];
  page.on("request", (request) =>
    requested.push(new URL(request.url()).pathname),
  );
  await mock(page, ["data-flow.page", "job.data-flow.read"]);
  await page.goto("/production/data-flow");
  await expect(
    page.getByLabel("Job", { exact: true }).locator("option"),
  ).toContainText([
    "Choose a permitted historical or current Job",
    "JOB-00000000",
  ]);
  expect(requested).toContain("/api/v1/job-data-flow/jobs");
  expect(requested).not.toContain("/api/v1/jobs");
});

test("Data Flow fails closed without its exact action permission", async ({
  page,
}) => {
  await mock(page, ["data-flow.page"]);
  await page.goto("/production/data-flow");
  await expect(page.getByRole("alert")).toHaveText(
    "You do not have permission to view Job Data Flow.",
  );
  await expect(page.getByLabel("Job", { exact: true })).toHaveCount(0);
});

test("Job List and Job Card load through the production HTTP/PostgreSQL runtime", async ({
  page,
}) => {
  test.skip(
    !process.env.PRODUCTION_E2E_BASE_URL,
    "requires the production Docker stack",
  );
  await page.goto("/production/jobs");
  await expect(page.getByText("Asha Rao", { exact: true })).toBeVisible();
  const response = await page.request.get(`/api/v1/jobs/${job.id}/job-card`, {
    headers: { "x-workshopos-identity": "north-admin" },
  });
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
  await page.goto("/production/data-flow");
  await page.getByLabel("Job", { exact: true }).selectOption(job.id);
  await expect(
    page.getByRole("heading", { name: /JOB-00000000: Asha Rao/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Status history" }),
  ).toBeVisible();
});
