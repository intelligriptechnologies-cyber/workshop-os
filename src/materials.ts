import type { InventoryItem, MainStatus, MaterialRequest, User } from "./types";

export type MaterialRowStatus = "Draft" | "Requested" | "Re-requested" | "Issued" | "Cancelled";

export const MATERIALS_CHECKLIST_LABELS = ["Material Requested", "Material Issued"] as const;

export type MaterialRowAction = "request" | "edit" | "re-request" | "cancel" | "delete" | "release" | "edit-issued";

/** Owner (admin) and the job's linked Service Advisor manage rows; everyone else reads. */
export function canManageMaterialRows(actor: Pick<User, "id" | "role">, job: { advisor_id: number; main_status: MainStatus; materialApprovalStatus?: "Pending" | "Approved" | "Rejected" }) {
  const linkedAdvisor = actor.role === "service" && actor.id === job.advisor_id;
  return (actor.role === "admin" || linkedAdvisor) && (job.main_status === "IN_PROGRESS" || (linkedAdvisor && job.main_status === "HOLD" && job.materialApprovalStatus === "Rejected"));
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

/** The Store-facing outcome for an existing-SKU material demand. */
export type MaterialDemandTriage = "issuable" | "procurement";

export type MaterialDemand = Pick<
  MaterialRequest,
  "id" | "item_id" | "requested_qty" | "issued_qty"
>;

export interface MaterialDemandAllocation {
  outcome: MaterialDemandTriage;
  procurementQty: number;
}

/**
 * Material demand is issuable only when the outstanding quantity is already
 * on hand. Any shortfall begins a controlled Purchase Request instead of a
 * direct Stock Inward.
 */
export function triageMaterialDemand(
  row: Pick<MaterialRequest, "requested_qty" | "issued_qty">,
  item: Pick<InventoryItem, "stock_qty"> | undefined,
  alreadyAllocated = 0,
): MaterialDemandTriage {
  const outstanding = Math.max(0, row.requested_qty - row.issued_qty);
  return Math.max(0, stockOnHand(item) - alreadyAllocated) >= outstanding
    ? "issuable"
    : "procurement";
}

/**
 * Allocates projected available stock across outstanding Material Requests in
 * their displayed order. This prevents several requests for the same SKU from
 * each being labelled issuable against the same on-hand quantity.
 */
export function triageMaterialDemands(
  demands: readonly MaterialDemand[],
  inventory: readonly Pick<InventoryItem, "id" | "stock_qty">[],
) {
  return allocateMaterialDemands(demands, inventory).map(({ outcome }) => outcome);
}

/**
 * Allocates on-hand stock across displayed demand and exposes exactly the
 * remaining quantity that procurement needs to cover for each request.
 */
export function allocateMaterialDemands(
  demands: readonly MaterialDemand[],
  inventory: readonly Pick<InventoryItem, "id" | "stock_qty">[],
): MaterialDemandAllocation[] {
  const allocatedByItem = new Map<number, number>();
  const inventoryById = new Map(inventory.map((item) => [item.id, item]));
  return demands.map((demand) => {
    const allocated = allocatedByItem.get(demand.item_id) ?? 0;
    const outstanding = Math.max(0, demand.requested_qty - demand.issued_qty);
    const available = Math.max(
      0,
      stockOnHand(inventoryById.get(demand.item_id)) - allocated,
    );
    const procurementQty = Math.max(0, outstanding - available);
    allocatedByItem.set(demand.item_id, allocated + Math.min(outstanding, available));
    return { outcome: procurementQty ? "procurement" : "issuable", procurementQty };
  });
}

export function filterInventory(items: readonly InventoryItem[], query: string) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => !needle || `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(needle));
}

export function pickerLabel(item: Pick<InventoryItem, "name" | "stock_qty" | "unit">) {
  return `${item.name} · in stock: ${item.stock_qty}`;
}

type Actor = Pick<User, "id" | "role">;
type JobRef = { advisor_id: number; main_status: MainStatus; materialApprovalStatus?: "Pending" | "Approved" | "Rejected" };

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
