import { expect, test } from "@playwright/test";

const jobId = "93000000-0000-4000-8000-000000000204";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: { tenant: { id: "tenant", name: "Workshop" }, membership: { permissions: ["billing.page", "billing.read", "invoice.finalize", "job.work-acceptance.record", "payment.record", "delivery.record", "gate-pass.issue", "gate-pass.verify", "job.close"], branches: [{ id: "branch", name: "Delhi" }] } } }));
});

test("production Billing exposes ordered finance and custody state", async ({ page }) => {
  await page.route(`**/api/v1/billing/jobs/${jobId}`, (route) => route.fulfill({ json: { billing: { id: jobId, branchId: "branch", jobNumber: "JOB-93000000", stage: "BILLING", version: 7, customerName: "Asha", registration: "DL1AB1234", invoice: { id: "invoice", number: "INV/2026/1", originalPayableMinor: "10500", creditMinor: "500", payableMinor: "10000", version: 2 }, paidMinor: "10000", balanceMinor: "0", workAccepted: true, paymentCleared: true, deliveryRecorded: true, gatePass: { id: "pass", number: "GP/2026/1", status: "ISSUED", version: 1, validUntil: "2026-09-16T12:00:00.000Z" }, released: false, closed: false, payments: [{ id: "payment", kind: "PAYMENT_RECEIPT", amountMinor: "10000", mode: "UPI", reference: "PAY-1", occurredAt: "2026-09-16T10:00:00.000Z" }], corrections: [], invoiceCorrections: [] } } }));
  await page.goto("/production/billing");
  await expect(page.getByRole("heading", { name: "Billing, delivery and closure" })).toBeVisible();
  await page.getByLabel("Job ID").fill(jobId);
  await page.getByRole("button", { name: "Open Job" }).click();
  await expect(page.getByText("Payment Cleared")).toBeVisible();
  await expect(page.getByText("GP/2026/1 · ISSUED")).toBeVisible();
  await expect(page.getByText("10500 original - 500 credits = 10000 due")).toBeVisible();
  await expect(page.getByRole("table", { name: "Immutable payment history" })).toContainText("PAY-1");
  await expect(page.getByRole("button", { name: "Verify and release vehicle" })).toHaveCount(0);
});

test("Billing sends versioned idempotent finalization commands", async ({ page }) => {
  let post: any;
  let finalized = false;
  await page.route(`**/api/v1/billing/jobs/${jobId}`, (route) => route.fulfill({ json: { billing: { id: jobId, branchId: "branch", jobNumber: "JOB-93000000", stage: "BILLING", version: finalized ? 2 : 1, customerName: "Asha", registration: "DL1AB1234", invoice: finalized ? { id: "invoice", number: "INV/1", originalPayableMinor: "10000", creditMinor: "0", payableMinor: "10000", version: 2 } : undefined, paidMinor: "0", balanceMinor: finalized ? "10000" : "0", workAccepted: false, paymentCleared: false, deliveryRecorded: false, released: false, closed: false, payments: [], corrections: [], invoiceCorrections: [] } } }));
  await page.route(`**/api/v1/billing/jobs/${jobId}/invoice/finalize`, async (route) => { post = { headers: route.request().headers(), body: route.request().postDataJSON() }; finalized = true; await route.fulfill({ status: 201, json: { invoiceId: "invoice", resourceVersion: 2 } }); });
  await page.goto("/production/billing");
  await page.getByLabel("Job ID").fill(jobId);
  await page.getByRole("button", { name: "Open Job" }).click();
  await page.getByRole("button", { name: "Finalize invoice" }).click();
  await expect(page.getByRole("status")).toContainText("Final invoice created");
  expect(post.body).toEqual({ version: 1 });
  expect(post.headers["idempotency-key"]).toBeTruthy();
});

test("invoice corrections use an accessible reasoned dialog and exact permission", async ({ page }) => {
  let correction: any;
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: { tenant: { id: "tenant", name: "Workshop" }, membership: { permissions: ["billing.page", "billing.read", "invoice.correction.request"], branches: [{ id: "branch", name: "Delhi" }] } } }));
  await page.route(`**/api/v1/billing/jobs/${jobId}`, (route) => route.fulfill({ json: { billing: { id: jobId, branchId: "branch", jobNumber: "JOB-93000000", stage: "BILLING", version: 2, customerName: "Asha", registration: "DL1AB1234", invoice: { id: "invoice", number: "INV/1", originalPayableMinor: "10000", creditMinor: "0", payableMinor: "10000", version: 2 }, paidMinor: "0", balanceMinor: "10000", workAccepted: false, paymentCleared: false, deliveryRecorded: false, released: false, closed: false, payments: [], corrections: [], invoiceCorrections: [] } } }));
  await page.route("**/api/v1/billing/invoices/invoice/corrections", async (route) => { correction = { headers: route.request().headers(), body: route.request().postDataJSON() }; await route.fulfill({ status: 201, json: { adjustmentId: "adjustment" } }); });
  await page.goto("/production/billing");
  await page.getByLabel("Job ID").fill(jobId);
  await page.getByRole("button", { name: "Open Job" }).click();
  await page.getByRole("button", { name: "Request invoice correction" }).click();
  const dialog = page.getByRole("dialog", { name: "Request invoice correction" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Amount (minor units)").fill("500");
  await dialog.getByLabel("Reason").fill("Approved goodwill adjustment");
  await dialog.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("status")).toContainText("sent for independent approval");
  expect(correction.body).toEqual({ amountMinor: "500", reason: "Approved goodwill adjustment" });
  expect(correction.headers["idempotency-key"]).toBeTruthy();
});
