import { authenticatedFetch, type CognitoConfig } from "./auth";
import { workItemListSearch, type WorkItemListQuery as InventoryListQuery, type ListPreference, type WorkItemExport } from "./work-items-api";

export type InventoryAuth = { mode: "cognito"; config: CognitoConfig } | { mode: "local"; identity: string };
export type InventoryPosition = { id: string; branchId: string; warehouseId: string; warehouseName: string; sku: string; baseUom: string; quantity: string; valueMinor: string; reorderPoint: string; reorder: boolean; lastMovementAt?: string; ageDays?: number };
export type InventoryImport = { id: string; branchId: string; filename: string; status: "STAGED" | "COMMITTED"; version: number; summary: { totalRows: number; validRows: number; invalidRows: number; quantity: string; valueMinor: string }; reconciliation?: { ledgerBatches: number; quantity: string; valueMinor: string } };
export type InventoryImportRow = { sku: string; warehouseCode: string; quantity: string; valueMinor: string };
export type { InventoryListQuery };
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
const messages: Record<string,string> = { IMPORT_VALIDATION_FAILED: "Resolve every rejected row before committing this import.", IMPORT_REFERENCE_CHANGED: "Inventory references changed after validation. Stage the import again.", VERSION_CONFLICT: "This import changed. Refresh before committing.", PERMISSION_DENIED: "You do not have permission for this inventory action.", REASON_REQUIRED: "Enter a reason for this stock operation.", QUANTITY_INVALID: "Enter a positive quantity with no more than six decimal places.", VALUE_MINOR_INVALID: "Enter a non-negative whole value in the supported range.", INVENTORY_POSITION_NOT_FOUND: "That inventory position is no longer available. Refresh and try again." };
export class InventoryApiError extends Error { constructor(readonly code: string, readonly traceId: string) { super(messages[code] ?? "WorkshopOS could not complete the inventory request."); } }

export function createInventoryApi(auth: InventoryAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string, init: RequestInit = {}) => { const headers = new Headers(init.headers); headers.set("accept", "application/json"); const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, path, { ...init, headers }) : await fetcher(path, { ...init, headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } }); const value = response.headers.get("content-type")?.includes("json") ? await response.json() as any : {}; if (!response.ok) throw new InventoryApiError(value.code ?? "INTERNAL_ERROR", value.traceId ?? response.headers.get("x-trace-id") ?? "unavailable"); return value as T; };
  const write = <T>(path: string, value: unknown, key: string = crypto.randomUUID()) => request<T>(path, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(value) });
  const download = async (path: string, fallback: string) => { const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, path) : await fetcher(path, { headers: { "x-workshopos-identity": auth.identity } }); if (!response.ok) throw new InventoryApiError("DOWNLOAD_FAILED", response.headers.get("x-trace-id") ?? "unavailable"); return { blob: await response.blob(), filename: response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] ?? fallback }; };
  return {
    session: () => request<any>("/api/v1/session"),
    list: (query: InventoryListQuery) => request<{ inventory: InventoryPosition[]; analytics: { skuCount: number; totalQuantity: string; totalValueMinor: string; reorderCount: number }; page: any }>(`/api/v1/inventory?${workItemListSearch(query)}`.replace(/\?$/, "")),
    getPreference: async () => (await request<{ preference: ListPreference }>("/api/v1/list-preferences/inventory")).preference,
    savePreference: async (viewMode: ListPreference["viewMode"]) => (await request<{ preference: ListPreference }>("/api/v1/list-preferences/inventory", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ viewMode }) })).preference,
    receive: (value: { branchId: string; warehouseId: string; itemId: string; quantity: string; valueMinor: string; reason: string }, key?: string) => write<{ receipt: unknown }>("/api/v1/inventory/receipts", value, key),
    stageImport: async (value: { branchId: string; filename: string; rows: InventoryImportRow[] }, key?: string) => (await write<{ import: InventoryImport }>("/api/v1/inventory/imports", value, key)).import,
    getImport: async (id: string) => (await request<{ import: InventoryImport }>(`/api/v1/inventory/imports/${id}`)).import,
    commitImport: (value: Pick<InventoryImport, "id" | "version">, key?: string) => write<{ import: InventoryImport; reconciliation: InventoryImport["reconciliation"] }>(`/api/v1/inventory/imports/${value.id}/commit`, { version: value.version }, key),
    downloadManifest: (id: string) => download(`/api/v1/inventory/imports/${id}/error-manifest`, "inventory-import-errors.csv"),
    requestExport: async (format: WorkItemExport["format"], query: InventoryListQuery, key?: string) => (await write<{ export: WorkItemExport }>("/api/v1/inventory-exports", { format, query }, key)).export,
    getExport: async (id: string) => (await request<{ export: WorkItemExport }>(`/api/v1/inventory-exports/${id}`)).export,
    downloadExport: (id: string) => download(`/api/v1/inventory-exports/${id}/download`, "inventory-export"),
  };
}
