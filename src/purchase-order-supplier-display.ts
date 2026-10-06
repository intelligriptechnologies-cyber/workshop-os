import type { Supplier } from "./types";

/**
 * Purchase orders may retain IDs serialized as strings by an older session or
 * an API payload. Resolve by their display value so the register and editor
 * agree on the assigned supplier.
 */
export function supplierNameForPurchaseOrder(
  suppliers: readonly Pick<Supplier, "id" | "name">[],
  supplierId: number | string | null | undefined,
) {
  const supplier = suppliers.find((candidate) => String(candidate.id) === String(supplierId));
  if (supplier) return supplier.name;
  return Number(supplierId) > 0 ? "Unknown supplier" : "Supplier pending";
}
