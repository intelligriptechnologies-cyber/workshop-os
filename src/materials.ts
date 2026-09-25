import type { InventoryItem, MainStatus, MaterialRequest, User } from "./types";

export type MaterialRowStatus = "Draft" | "Requested" | "Re-requested" | "Issued" | "Cancelled";

export const MATERIALS_CHECKLIST_LABELS = ["Material Requested", "Material Issued"] as const;

export type MaterialRowAction = "request" | "edit" | "re-request" | "cancel" | "delete";

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
