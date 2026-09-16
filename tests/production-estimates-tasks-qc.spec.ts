import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/auth/config", (route) =>
    route.fulfill({ json: { mode: "local", allowDemo: true } }),
  );
  await page.route("**/api/v1/session", (route) =>
    route.fulfill({
      json: {
        membership: {
          branches: [{ id: "branch-1", name: "Delhi" }],
          permissions: [
            "estimates.page",
            "estimate.read",
            "estimate.manage",
            "estimate.submit",
            "estimate.approve",
            "estimate.document.download",
            "tasks.page",
            "task.read",
            "task.assign",
            "task.execute",
            "task.evidence.write",
            "qc.page",
            "qc.read",
            "qc.inspect",
            "rework.assign",
            "rework.execute",
          ],
        },
      },
    }),
  );
  await page.route("**/api/v1/estimates?*", (route) =>
    route.fulfill({ json: { estimates: [], totalCount: 0 } }),
  );
  await page.route("**/api/v1/tasks", (route) =>
    route.fulfill({ json: { tasks: [] } }),
  );
  await page.route("**/api/v1/qc", (route) =>
    route.fulfill({ json: { qc: [] } }),
  );
});

test("production Estimates expose versioned actions and accessible dialog", async ({
  page,
}) => {
  await page.goto("/production/estimates");
  await expect(
    page.getByRole("heading", { name: "Estimates", level: 1 }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create Estimate" }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Create Estimate version" }),
  ).toBeVisible();
  await expect(dialog.getByLabel("Job identifier")).toBeFocused();
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await dialog.getByRole("button", { name: "Discard changes" }).click();
  await expect(dialog).not.toBeVisible();
});

test("production Tasks and QC are HTTP-backed navigable screens", async ({
  page,
}) => {
  await page.goto("/production/tasks");
  await expect(
    page.getByRole("heading", { name: "Technician Tasks" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
  await page.goto("/production/qc");
  await expect(
    page.getByRole("heading", { name: "Quality control" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Production navigation" })
      .getByRole("link", { name: "Estimates" }),
  ).toBeVisible();
});

test("draft Estimate editing and Task evidence send versioned verified identifiers", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/config", (route) =>
    route.fulfill({ json: { mode: "local", allowDemo: true } }),
  );
  await page.route("**/api/v1/session", (route) =>
    route.fulfill({
      json: {
        membership: {
          branches: [{ id: "branch-1", name: "Delhi" }],
          permissions: [
            "estimates.page",
            "estimate.read",
            "estimate.manage",
            "tasks.page",
            "task.read",
            "task.evidence.write",
          ],
        },
      },
    }),
  );
  const estimate = {
    id: "estimate-1",
    jobId: "job-1",
    branchId: "branch-1",
    jobNumber: "JOB-1",
    revision: 1,
    status: "DRAFT",
    notes: "Initial",
    totalMinor: "1000",
    version: 4,
  };
  await page.route("**/api/v1/estimates?*", (route) =>
    route.fulfill({ json: { estimates: [estimate], totalCount: 1 } }),
  );
  let editBody: any;
  await page.route("**/api/v1/estimates/estimate-1/draft", async (route) => {
    editBody = route.request().postDataJSON();
    await route.fulfill({ json: { estimate: { ...estimate, ...editBody } } });
  });
  await page.goto("/production/estimates");
  await page.getByRole("button", { name: "Edit draft" }).click();
  await page.getByLabel("Total (minor units)").fill("1250");
  await page.getByRole("dialog").getByRole("button", { name: "Save" }).click();
  await expect
    .poll(() => editBody)
    .toMatchObject({
      version: 4,
      totalMinor: "1250",
    });

  const task = {
    id: "task-1",
    jobId: "job-1",
    branchId: "branch-1",
    jobNumber: "JOB-1",
    title: "Finish work",
    status: "IN_PROGRESS",
    priority: "NORMAL",
    version: 7,
    blockedBy: [],
  };
  await page.route("**/api/v1/tasks", (route) =>
    route.fulfill({ json: { tasks: [task] } }),
  );
  let evidenceBody: any;
  await page.route("**/api/v1/tasks/task-1/evidence", async (route) => {
    evidenceBody = route.request().postDataJSON();
    await route.fulfill({ json: { task: { ...task, version: 8 } } });
  });
  await page.goto("/production/tasks");
  await page
    .getByRole("button", { name: "Add evidence for Finish work" })
    .click();
  await page.getByLabel("Clean Job Media identifier").fill("media-clean-1");
  await page.getByRole("dialog").getByRole("button", { name: "Save" }).click();
  await expect
    .poll(() => evidenceBody)
    .toMatchObject({
      version: 7,
      checklistKey: "workmanship",
      evidenceId: "media-clean-1",
    });
  expect(evidenceBody).not.toHaveProperty("checksum");
  expect(evidenceBody).not.toHaveProperty("privateObjectRef");
});

test("failed QC rework completion requires a verified Media identifier", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/config", (route) =>
    route.fulfill({ json: { mode: "local", allowDemo: true } }),
  );
  await page.route("**/api/v1/session", (route) =>
    route.fulfill({
      json: {
        membership: {
          branches: [{ id: "branch-1", name: "Delhi" }],
          permissions: [
            "qc.page",
            "qc.read",
            "qc.inspect",
            "rework.assign",
            "rework.execute",
          ],
        },
      },
    }),
  );
  const qc = {
    taskId: "task-1",
    jobId: "job-1",
    branchId: "branch-1",
    jobNumber: "JOB-1",
    title: "Finish work",
    status: "FAILED",
    version: 2,
    rework: {
      id: "rework-1",
      status: "ASSIGNED",
      reason: "Finish defect",
      failedChecklistKeys: ["finish"],
      version: 3,
    },
  };
  await page.route("**/api/v1/qc", (route) =>
    route.fulfill({ json: { qc: [qc] } }),
  );
  let completionBody: any;
  await page.route("**/api/v1/reworks/rework-1/completion", async (route) => {
    completionBody = route.request().postDataJSON();
    await route.fulfill({
      json: {
        rework: {
          id: "rework-1",
          status: "READY_FOR_REINSPECTION",
          version: 4,
        },
      },
    });
  });
  await page.goto("/production/qc");
  await expect(page.getByRole("button", { name: "Inspect" })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Complete rework for Finish work" })
    .click();
  await page.getByLabel("Clean Job Media identifier").fill("media-clean-2");
  await page.getByRole("dialog").getByRole("button", { name: "Save" }).click();
  await expect
    .poll(() => completionBody)
    .toMatchObject({
      version: 3,
      evidenceId: "media-clean-2",
    });
});
