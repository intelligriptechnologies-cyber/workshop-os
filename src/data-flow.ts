import { normalizeSearch } from "./list-utils";
import type { ChecklistItem, JobView, User } from "./types";

export interface DataFlowFilters {
  query: string;
  month: string;
  date: string;
}

export const visitDate = (view: JobView) => view.visit.received_at.slice(0, 10);
export const visitMonth = (view: JobView) => visitDate(view).slice(0, 7);

export function dataFlowMonths(jobs: JobView[]) {
  return Array.from(new Set(jobs.map(visitMonth).filter(Boolean))).sort().reverse();
}

export function dataFlowDates(jobs: JobView[], month: string) {
  return Array.from(new Set(jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter(Boolean))).sort().reverse();
}

export function dataFlowSearchText(view: JobView) {
  return `${view.job.job_no} ${view.vehicle.number} ${view.vehicle.make} ${view.vehicle.model} ${view.customer.name} ${view.customer.mobile}`;
}

export function filterDataFlowJobs(jobs: JobView[], filters: DataFlowFilters) {
  const needle = normalizeSearch(filters.query);
  return jobs.filter((view) =>
    (!filters.month || visitMonth(view) === filters.month)
    && (!filters.date || visitDate(view) === filters.date)
    && (!needle || normalizeSearch(dataFlowSearchText(view)).includes(needle))
  );
}

export type DataFlowEventKind = "visit" | "checklist" | "status" | "estimate" | "invoice" | "payment" | "document" | "media";

export interface DataFlowEvent {
  id: string;
  kind: DataFlowEventKind;
  timestamp: string;
  title: string;
  detail: string;
  actor?: string;
  state?: "current" | "historical" | "voided" | "archived";
}

export interface LifecycleSummary {
  stage: string;
  cycle: number | null;
  activeStep: string;
  remainingSteps: string[];
  completed: boolean;
}

const actorName = (actorId: number | null | undefined, users: User[]) => actorId === 0 ? "System" : users.find((user) => user.id === actorId)?.name ?? (actorId ? `User ${actorId}` : undefined);
const hasTime = (timestamp: string | null | undefined): timestamp is string => Boolean(timestamp?.trim());
const sameTime = (left?: string | null, right?: string | null) => Boolean(left && right && left === right);

export function summarizeJobLifecycle(view: JobView): LifecycleSummary {
  if (view.job.main_status === "CANCELLED") return { stage: "CANCELLED", cycle: null, activeStep: "Cancelled", remainingSteps: [], completed: true };
  const cycle = [...view.checklist_cycles].sort((left, right) => right.id - left.id)[0];
  if (!cycle) return { stage: view.job.main_status, cycle: null, activeStep: view.job.sub_status, remainingSteps: [], completed: false };
  const items = view.checklist_items.filter((item) => item.checklist_cycle_id === cycle.id).sort((left, right) => left.sort_order - right.sort_order);
  const remainingSteps = items.filter((item) => !item.checked_at).map((item) => item.label);
  return {
    stage: cycle.stage,
    cycle: cycle.cycle_number,
    activeStep: remainingSteps[0] ?? (cycle.completed_at ? "Stage complete" : view.job.sub_status),
    remainingSteps,
    completed: Boolean(cycle.completed_at) || (items.length > 0 && remainingSteps.length === 0),
  };
}

function checklistEvents(item: ChecklistItem, users: User[]): DataFlowEvent[] {
  const actor = actorName(item.checked_by, users);
  const cycle = `${item.stage} cycle ${item.cycle_number}`;
  const events: DataFlowEvent[] = [];
  if (hasTime(item.started_at)) events.push({ id: `checklist-start-${item.id}`, kind: "checklist", timestamp: item.started_at, title: `${item.label} started`, detail: cycle, actor });
  if (hasTime(item.completed_at ?? item.checked_at)) events.push({ id: `checklist-complete-${item.id}`, kind: "checklist", timestamp: (item.completed_at ?? item.checked_at)!, title: `${item.label} completed`, detail: cycle, actor });
  return events;
}

export function buildDataFlowTimeline(view: JobView, users: User[] = []): DataFlowEvent[] {
  const events: DataFlowEvent[] = [{ id: `visit-${view.visit.id}`, kind: "visit", timestamp: view.visit.received_at, title: "Vehicle visit received", detail: `${view.vehicle.number} · ${view.visit.requested_work}`, actor: actorName(view.visit.received_by, users) }];
  for (const cycle of view.checklist_cycles) {
    if (hasTime(cycle.started_at)) events.push({ id: `cycle-start-${cycle.id}`, kind: "checklist", timestamp: cycle.started_at, title: `${cycle.stage} checklist started`, detail: `Cycle ${cycle.cycle_number}`, actor: "System" });
    if (hasTime(cycle.completed_at)) events.push({ id: `cycle-complete-${cycle.id}`, kind: "checklist", timestamp: cycle.completed_at, title: `${cycle.stage} checklist completed`, detail: `Cycle ${cycle.cycle_number}`, actor: "System" });
  }
  view.checklist_items.forEach((item) => events.push(...checklistEvents(item, users)));
  view.status_history.forEach((item) => events.push({ id: `status-${item.id}`, kind: "status", timestamp: item.created_at, title: `Status changed to ${item.main_status}`, detail: `${item.sub_status} · ${item.note}` }));

  for (const estimate of view.estimate_history ?? (view.estimate ? [view.estimate] : [])) {
    if (hasTime(estimate.created_at)) events.push({ id: `estimate-create-${estimate.id}`, kind: "estimate", timestamp: estimate.created_at, title: "Estimate created", detail: `${estimate.status} · GST ${estimate.gst_rate}%`, state: estimate.archived_at ? "historical" : "current" });
    if (hasTime(estimate.updated_at) && !sameTime(estimate.updated_at, estimate.created_at) && !sameTime(estimate.updated_at, estimate.archived_at)) events.push({ id: `estimate-update-${estimate.id}`, kind: "estimate", timestamp: estimate.updated_at, title: "Estimate updated", detail: estimate.approval_note || estimate.status, state: estimate.archived_at ? "historical" : "current" });
    if (hasTime(estimate.archived_at)) events.push({ id: `estimate-archive-${estimate.id}`, kind: "document", timestamp: estimate.archived_at, title: "Estimate document archived", detail: estimate.archived_reason || "Superseded", state: "archived" });
  }

  for (const invoice of view.invoice_history ?? (view.invoice ? [view.invoice] : [])) {
    const current = invoice.id === view.invoice?.id && !invoice.voided_at;
    if (hasTime(invoice.created_at)) {
      events.push({ id: `invoice-create-${invoice.id}`, kind: "invoice", timestamp: invoice.created_at, title: "Invoice created", detail: `${invoice.invoice_no} · ${invoice.status}`, state: current ? "current" : "historical" });
    }
    if (hasTime(invoice.document_generated_at)) events.push({ id: `invoice-document-${invoice.id}`, kind: "document", timestamp: invoice.document_generated_at, title: "Invoice PDF generated", detail: invoice.invoice_no, state: current && invoice.document_available ? "current" : "historical" });
    if (hasTime(invoice.updated_at) && !sameTime(invoice.updated_at, invoice.created_at) && !sameTime(invoice.updated_at, invoice.voided_at)) events.push({ id: `invoice-update-${invoice.id}`, kind: "invoice", timestamp: invoice.updated_at, title: "Invoice updated", detail: `${invoice.invoice_no} · ${invoice.status}`, state: current ? "current" : "historical" });
    if (hasTime(invoice.voided_at)) {
      events.push({ id: `invoice-void-${invoice.id}`, kind: "invoice", timestamp: invoice.voided_at, title: "Invoice voided", detail: `${invoice.invoice_no} · ${invoice.void_reason || "No reason recorded"}`, state: "voided" });
      if (invoice.document_generated_at) events.push({ id: `invoice-document-void-${invoice.id}`, kind: "document", timestamp: invoice.voided_at, title: "Invoice PDF voided", detail: invoice.void_reason || invoice.invoice_no, state: "voided" });
    }
  }

  for (const payment of view.payment_history ?? view.payments) {
    const current = !payment.voided_at && payment.invoice_id === view.invoice?.id;
    if (hasTime(payment.created_at)) events.push({ id: `payment-create-${payment.id}`, kind: "payment", timestamp: payment.created_at, title: "Payment recorded", detail: `${payment.mode}${payment.reference ? ` · ${payment.reference}` : ""} · ₹${payment.amount.toFixed(2)}`, state: current ? "current" : "historical" });
    if (hasTime(payment.updated_at) && !sameTime(payment.updated_at, payment.created_at) && !sameTime(payment.updated_at, payment.voided_at)) events.push({ id: `payment-update-${payment.id}`, kind: "payment", timestamp: payment.updated_at, title: "Payment updated", detail: `${payment.mode} · ₹${payment.amount.toFixed(2)}`, state: current ? "current" : "historical" });
    if (hasTime(payment.voided_at)) events.push({ id: `payment-void-${payment.id}`, kind: "payment", timestamp: payment.voided_at, title: "Payment voided", detail: payment.void_reason || `₹${payment.amount.toFixed(2)}`, state: "voided" });
  }

  for (const receipt of view.receipt_history ?? (view.receipt ? [view.receipt] : [])) {
    const current = receipt.id === view.receipt?.id && receipt.invoice_id === view.invoice?.id && !receipt.voided_at;
    if (hasTime(receipt.created_at)) events.push({ id: `receipt-create-${receipt.id}`, kind: "document", timestamp: receipt.created_at, title: "Payment Receipt PDF generated", detail: receipt.receipt_no, state: current ? "current" : "historical" });
    if (hasTime(receipt.voided_at)) events.push({ id: `receipt-void-${receipt.id}`, kind: "document", timestamp: receipt.voided_at, title: "Payment Receipt PDF voided", detail: receipt.void_reason || receipt.receipt_no, state: "voided" });
  }
  for (const pass of view.gate_pass_history ?? (view.gate_pass ? [view.gate_pass] : [])) {
    const current = pass.id === view.gate_pass?.id && pass.invoice_id === view.invoice?.id && !pass.voided_at;
    if (hasTime(pass.created_at)) events.push({ id: `gate-pass-create-${pass.id}`, kind: "document", timestamp: pass.created_at, title: "Gate Pass PDF generated", detail: pass.gate_pass_no, state: current ? "current" : "historical" });
    if (hasTime(pass.voided_at)) events.push({ id: `gate-pass-void-${pass.id}`, kind: "document", timestamp: pass.voided_at, title: "Gate Pass PDF voided", detail: pass.void_reason || pass.gate_pass_no, state: "voided" });
  }

  for (const photo of view.photo_history ?? view.photos) {
    const category = photo.category || "Job";
    if (hasTime(photo.created_at)) events.push({ id: `media-upload-${photo.id}`, kind: "media", timestamp: photo.created_at, title: "Media uploaded", detail: `${category} · ${photo.label}`, state: photo.archived_at ? "historical" : "current" });
    if (hasTime(photo.updated_at) && !sameTime(photo.updated_at, photo.created_at) && !sameTime(photo.updated_at, photo.archived_at)) events.push({ id: `media-edit-${photo.id}`, kind: "media", timestamp: photo.updated_at, title: "Media details edited", detail: `${category} · ${photo.label}`, state: photo.archived_at ? "historical" : "current" });
    if (hasTime(photo.archived_at)) events.push({ id: `media-archive-${photo.id}`, kind: "media", timestamp: photo.archived_at, title: "Media archived", detail: `${photo.label} · ${photo.archived_reason || "No reason recorded"}`, state: "archived" });
  }

  return events.filter((event) => hasTime(event.timestamp)).sort((left, right) => {
    const byTime = new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime();
    return (Number.isNaN(byTime) ? left.timestamp.localeCompare(right.timestamp) : byTime) || left.id.localeCompare(right.id);
  });
}
