import type { JobView } from "./types";

export type DashboardFacts = {
  currentMonth: string;
  monthLabel: string;
  cashflowMonth: string;
  cashflowMonthLabel: string;
  cashflowMonthComplete: boolean;
  daysElapsed: number;
  daysInMonth: number;
  activeToday: number;
  totalVisits: number;
  inProgress: number;
  closed: number;
  onHold: number;
  customersServed: number;
  vehiclesServed: number;
  invoicesGenerated: number;
  paymentsReceived: number;
  totalCollections: number;
  projectedMonthlyCollection: number;
  lowStock: number;
  pendingApprovals: number;
  materialRequests: number;
  materialsIssued: number;
};

const inMonth = (value: string | undefined, month: string) => Boolean(value && value.slice(0, 7) === month);

export type CashflowFacts = {
  month: string;
  monthLabel: string;
  monthComplete: boolean;
  daysElapsed: number;
  daysInMonth: number;
  invoicesGenerated: number;
  paymentsReceived: number;
  totalCollections: number;
  projectedMonthlyCollection: number;
};

/** Calculates a collection period independently of the dashboard's operational month. */
export function cashflowFacts(jobs: JobView[], today: string, month = today.slice(0, 7)): CashflowFacts {
  const currentMonth = today.slice(0, 7);
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = Number.isFinite(year) && Number.isFinite(monthNumber) ? new Date(year, monthNumber, 0).getDate() : 0;
  const parsedDay = Number(today.slice(8, 10));
  const daysElapsed = month === currentMonth ? Math.min(Math.max(Number.isFinite(parsedDay) ? parsedDay : 0, 0), daysInMonth) : daysInMonth;
  const clearedInvoiceById = new Map<number, NonNullable<JobView["invoice"]>>();
  let paymentsReceived = 0;
  for (const view of jobs) {
    const invoice = view.invoice;
    if (!invoice || invoice.voided_at || invoice.status !== "Cleared") continue;
    for (const payment of view.payments) {
      if (!payment.voided_at && payment.invoice_id === invoice.id && inMonth(payment.created_at, month)) {
        paymentsReceived += 1;
        clearedInvoiceById.set(invoice.id, invoice);
      }
    }
  }
  const totalCollections = [...clearedInvoiceById.values()].reduce((total, invoice) => total + invoice.total, 0);
  return {
    month,
    monthLabel: new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    monthComplete: month !== currentMonth,
    daysElapsed,
    daysInMonth,
    invoicesGenerated: jobs.filter((view) => !view.invoice?.voided_at && inMonth(view.invoice?.created_at, month)).length,
    paymentsReceived,
    totalCollections,
    projectedMonthlyCollection: daysElapsed > 0 ? totalCollections / daysElapsed * daysInMonth : 0,
  };
}

/**
 * Builds the live dashboard from the current job-card snapshots. `today` is a
 * local YYYY-MM-DD calendar date, which keeps reporting boundaries deterministic.
 */
export function dashboardFacts(jobs: JobView[], inventory: { stock_qty: number; low_stock_qty: number }[], today: string, cashflowMonth = today.slice(0, 7)): DashboardFacts {
  const currentMonth = today.slice(0, 7);
  const monthLabel = new Date(`${currentMonth}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const activeJobs = jobs.filter((view) => !["CLOSED", "CANCELLED"].includes(view.job.main_status));
  const monthlyRequests = jobs.flatMap((view) => view.material_requests).filter((request) => inMonth(request.created_at, currentMonth));
  const cashflow = cashflowFacts(jobs, today, cashflowMonth);

  return {
    currentMonth,
    monthLabel,
    cashflowMonth: cashflow.month,
    cashflowMonthLabel: cashflow.monthLabel,
    cashflowMonthComplete: cashflow.monthComplete,
    daysElapsed: cashflow.daysElapsed,
    daysInMonth: cashflow.daysInMonth,
    activeToday: activeJobs.length,
    totalVisits: jobs.length,
    inProgress: jobs.filter((view) => view.job.main_status === "IN_PROGRESS").length,
    closed: jobs.filter((view) => view.job.main_status === "CLOSED").length,
    onHold: jobs.filter((view) => view.job.main_status === "HOLD").length,
    customersServed: new Set(jobs.map((view) => view.customer.id)).size,
    vehiclesServed: new Set(jobs.map((view) => view.vehicle.id)).size,
    invoicesGenerated: cashflow.invoicesGenerated,
    paymentsReceived: cashflow.paymentsReceived,
    totalCollections: cashflow.totalCollections,
    projectedMonthlyCollection: cashflow.projectedMonthlyCollection,
    lowStock: inventory.filter((item) => item.stock_qty < item.low_stock_qty).length,
    pendingApprovals: jobs.filter((view) => view.material_approval?.status === "Pending" && inMonth(view.material_approval.submitted_at, currentMonth)).length,
    materialRequests: monthlyRequests.length,
    materialsIssued: monthlyRequests.filter((request) => request.issued_qty > 0 || request.status === "Issued").length,
  };
}
