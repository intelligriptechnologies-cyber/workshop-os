import type { InventoryItem, MainStatus, MaterialRequest, User } from "./types";

export type MaterialRowStatus = "Draft" | "Requested" | "Re-requested" | "Issued" | "Cancelled";

export const MATERIALS_CHECKLIST_LABELS = ["Material Requested", "Material Issued"] as const;

export type MaterialRowAction = "request" | "edit" | "re-request" | "cancel" | "delete" | "release" | "edit-issued";

/** Owner (admin) and the job's linked Service Advisor manage rows; everyone else reads. */
export function canManageMaterialRows(actor: Pick<User, "id" | "role">, job: { advisor_id: number; main_status: MainStatus }) {
  return (actor.role === "admin" || (actor.role === "service" && actor.id === job.advisor_id)) && job.main_status === "IN_PROGRESS";
}

export function materialRowStatus(row: Pick<MaterialRequest, "status">): MaterialRowStatus {
  return (row.status ?? "Requested") as MaterialRowStatus;
}

/** Actions a manager may take on a row in its current state. Invoiced rows are read-only. */
export function materialRowActions(row: Pick<MaterialRequest, "status" | "invoiced_in">): MaterialRowAction[] {
  if (row.invoiced_in) return [];
  switch (materialRowStatus(row)) {
    case "Draft": return ["edit", "request", "delete"];
    case "Requested":
    case "Re-requested": return ["re-request", "cancel"];
    default: return [];
  }
}

export function stockOnHand(item: Pick<InventoryItem, "stock_qty"> | undefined) {
  return item ? item.stock_qty : 0;
}

/** Warning text when a requested quantity exceeds the stock on hand; undefined when fine. */
export function overStockWarning(qty: number, onHand: number): string | undefined {
  return qty > onHand ? `Requested ${qty} is more than the ${onHand} in stock.` : undefined;
}

export function filterInventory(items: readonly InventoryItem[], query: string) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => !needle || `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(needle));
}

export function pickerLabel(item: Pick<InventoryItem, "name" | "stock_qty" | "unit">) {
  return `${item.name} · in stock: ${item.stock_qty}`;
}

type Actor = Pick<User, "id" | "role">;
type JobRef = { advisor_id: number; main_status: MainStatus };

/** Store and Owner release requested rows, on IN_PROGRESS or HOLD. */
export function canReleaseMaterialRows(actor: Actor, job: JobRef) {
  return (actor.role === "admin" || actor.role === "store") && (job.main_status === "IN_PROGRESS" || job.main_status === "HOLD");
}

/** Store, Owner and the linked Advisor may edit an Issued row (ADR 0001) until the job is finished. */
export function canEditIssuedMaterialRows(actor: Actor, job: JobRef) {
  const who = actor.role === "admin" || actor.role === "store" || (actor.role === "service" && actor.id === job.advisor_id);
  return who && (job.main_status === "IN_PROGRESS" || job.main_status === "HOLD" || job.main_status === "COMPLETED");
}

/** Every action this actor may take on this row right now. */
export function materialRowActionsFor(actor: Actor, job: JobRef, row: Pick<MaterialRequest, "status" | "invoiced_in">): MaterialRowAction[] {
  if (row.invoiced_in) return [];
  const status = materialRowStatus(row);
  const actions: MaterialRowAction[] = canManageMaterialRows(actor, job) ? materialRowActions(row) : [];
  if ((status === "Requested" || status === "Re-requested") && canReleaseMaterialRows(actor, job)) actions.push("release");
  if (status === "Issued" && canEditIssuedMaterialRows(actor, job)) actions.push("edit-issued");
  return actions;
}
