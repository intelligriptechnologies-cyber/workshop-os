import assert from "node:assert/strict";
import test from "node:test";
import { dashboardFacts } from "../src/dashboard-metrics";
import type { JobView } from "../src/types";

function job(overrides: Record<string, unknown> = {}) {
  const { invoice, payments = [], ...rest } = overrides as { invoice?: Record<string, unknown>; payments?: Record<string, unknown>[] };
  return {
    job: { main_status: "IN_PROGRESS" }, visit: { received_at: "2026-02-01T08:00:00" }, customer: { id: 1 }, vehicle: { id: 1 },
    material_requests: [], payments,
    ...(invoice ? { invoice: { id: 1, total: 100, status: "Cleared", ...invoice } } : {}),
    ...rest,
  } as JobView;
}

test("dashboard collections include only current-month payments linked to non-voided cleared invoices", () => {
  const facts = dashboardFacts([
    job({ invoice: { id: 1, total: 125, created_at: "2026-02-03" }, payments: [{ id: 1, invoice_id: 1, created_at: "2026-02-03" }] }),
    job({ invoice: { id: 2, total: 200, status: "Pending", created_at: "2026-02-03" }, payments: [{ id: 2, invoice_id: 2, created_at: "2026-02-03" }] }),
    job({ invoice: { id: 3, total: 300, voided_at: "2026-02-04", created_at: "2026-02-03" }, payments: [{ id: 3, invoice_id: 3, created_at: "2026-02-03" }] }),
    job({ invoice: { id: 4, total: 400, created_at: "2026-02-03" }, payments: [{ id: 4, invoice_id: 4, created_at: "2026-01-31" }] }),
    job({ invoice: { id: 5, total: 500, created_at: "2026-02-03" }, payments: [{ id: 5, invoice_id: 5, voided_at: "2026-02-04", created_at: "2026-02-03" }] }),
  ], [], "2026-02-10");

  assert.equal(facts.invoicesGenerated, 4);
  assert.equal(facts.paymentsReceived, 1);
  assert.equal(facts.totalCollections, 125);
});

test("dashboard projection follows the current calendar month's elapsed days and length", () => {
  const jobs = [job({ invoice: { id: 1, total: 280, created_at: "2026-02-10" }, payments: [{ id: 1, invoice_id: 1, created_at: "2026-02-10" }] })];
  const leapFebruary = dashboardFacts(jobs, [], "2026-02-10");
  const thirtyOneDayMonth = dashboardFacts(jobs.map((view) => ({ ...view, invoice: { ...view.invoice!, created_at: "2026-03-10" }, payments: [{ ...view.payments[0], created_at: "2026-03-10" }] })), [], "2026-03-10");

  assert.equal(leapFebruary.daysInMonth, 28);
  assert.equal(leapFebruary.projectedMonthlyCollection, 784);
  assert.equal(thirtyOneDayMonth.daysInMonth, 31);
  assert.equal(thirtyOneDayMonth.projectedMonthlyCollection, 868);
  assert.equal(dashboardFacts([], [], "2026-04-01").projectedMonthlyCollection, 0);
});

test("dashboard cashflow can report a completed historical month without changing operational periods", () => {
  const facts = dashboardFacts([
    job({ invoice: { id: 1, total: 125, created_at: "2026-01-28" }, payments: [{ id: 1, invoice_id: 1, created_at: "2026-01-30" }] }),
    job({ invoice: { id: 2, total: 200, created_at: "2026-02-03" }, payments: [{ id: 2, invoice_id: 2, created_at: "2026-02-03" }] }),
    job({ invoice: { id: 3, total: 300, created_at: "2026-01-20" }, payments: [{ id: 3, invoice_id: 3, voided_at: "2026-01-21", created_at: "2026-01-21" }] }),
  ], [], "2026-02-10", "2026-01");

  assert.equal(facts.currentMonth, "2026-02");
  assert.equal(facts.cashflowMonth, "2026-01");
  assert.equal(facts.cashflowMonthComplete, true);
  assert.equal(facts.daysElapsed, 31);
  assert.equal(facts.daysInMonth, 31);
  assert.equal(facts.totalCollections, 125);
  assert.equal(facts.paymentsReceived, 1);
  assert.equal(facts.invoicesGenerated, 2);
  assert.equal(facts.projectedMonthlyCollection, 125);
});
