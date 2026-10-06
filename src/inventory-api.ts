import { authenticatedFetch, type CognitoConfig } from "./auth";

export type RemoteCatalogueItem = { id: number; branchId: string; sku: string; category: string; name: string; unit: string; lowStockQty: number; sellingPrice: number; onHand: number; archivedAt: string | null };
export type RemoteSupplier = { id: number; branchId: string; name: string; mobile: string; email: string; address: string; archivedAt: string | null };
export type RemotePurchaseLine = { id: number; itemId: number; lineNo: number; orderedQty: number; unitCost: number; discount: number; gstRate: number; receivedQty: number };
export type RemotePurchaseOrder = { id: number; branchId: string; supplierId: number; poNumber: string; orderDate: string; status: string; notes: string; lines: RemotePurchaseLine[] };
export type RemoteStockInward = { id: number; branchId: string; itemId: number; purchaseOrderId: number | null; purchaseOrderLineId: number | null; qty: number; unitCost: number; note: string; receivedAt: string };
export type RemotePurchaseRequestLine = { id: number; itemId: number | null; newItemName: string | null; unit: string; orderedQty: number; lineNo: number };
export type RemotePurchaseRequest = { id: number; requestNumber: string; sourceReference: string; notes: string; status: "REQUESTED" | "APPROVED" | "ISSUED" | "CANCELLED"; lines: RemotePurchaseRequestLine[]; purchaseOrders: RemotePurchaseOrder[]; events: Array<{ command: string; at: string }> };

export class InventoryApiError extends Error { constructor(readonly code: string) { super(code); } }

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  const body = await response.json().catch(() => ({})) as T & { code?: string; detail?: { code?: string } };
  if (!response.ok) throw new InventoryApiError(body.code ?? body.detail?.code ?? "INVENTORY_API_FAILED");
  return body;
}
const json = (body: unknown): RequestInit => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const put = (body: unknown): RequestInit => ({ method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export const inventoryApi = {
  catalogue: {
    list: (config: CognitoConfig, q = "") => request<RemoteCatalogueItem[]>(config, `/api/v1/catalogue-items?q=${encodeURIComponent(q)}`),
    save: (config: CognitoConfig, input: Omit<RemoteCatalogueItem, "id" | "branchId" | "onHand" | "archivedAt"> & { id?: number }) => input.id ? request<RemoteCatalogueItem>(config, `/api/v1/catalogue-items/${input.id}`, put(input)) : request<RemoteCatalogueItem>(config, "/api/v1/catalogue-items", json(input)),
    archive: (config: CognitoConfig, id: number, reason: string) => request<RemoteCatalogueItem>(config, `/api/v1/catalogue-items/${id}/archive`, json({ reason })),
  },
  suppliers: {
    list: (config: CognitoConfig) => request<RemoteSupplier[]>(config, "/api/v1/suppliers"),
    save: (config: CognitoConfig, input: Omit<RemoteSupplier, "id" | "branchId" | "archivedAt"> & { id?: number }) => input.id ? request<RemoteSupplier>(config, `/api/v1/suppliers/${input.id}`, put(input)) : request<RemoteSupplier>(config, "/api/v1/suppliers", json(input)),
  },
  purchaseOrders: {
    list: (config: CognitoConfig) => request<RemotePurchaseOrder[]>(config, "/api/v1/purchase-orders"),
    create: (config: CognitoConfig, input: { supplierId: number; poNumber: string; orderDate: string; notes?: string; lines: Array<{ itemId: number; orderedQty: number; unitCost: number; discount?: number; gstRate?: number }> }) => request<RemotePurchaseOrder>(config, "/api/v1/purchase-orders", json(input)),
    command: (config: CognitoConfig, id: number, command: "send" | "cancel" | "close", reason = "") => request<RemotePurchaseOrder>(config, `/api/v1/purchase-orders/${id}/commands/${command}`, json({ reason })),
  },
  purchaseRequests: {
    list: (config: CognitoConfig) => request<RemotePurchaseRequest[]>(config, "/api/v1/purchase-requests"),
    create: (config: CognitoConfig, input: { requestNumber: string; sourceReference?: string; notes?: string; lines: Array<{ itemId?: number; newItemName?: string; unit?: string; orderedQty: number }> }) => request<RemotePurchaseRequest>(config, "/api/v1/purchase-requests", json(input)),
    quote: (config: CognitoConfig, id: number, input: { lineId: number; supplierId: number; unitCost: number; note?: string }) => request<unknown>(config, `/api/v1/purchase-requests/${id}/supplier-quotes`, json(input)),
    approve: (config: CognitoConfig, id: number, lines: Array<{ lineId: number; supplierId: number; unitCost: number }>) => request<RemotePurchaseRequest>(config, `/api/v1/purchase-requests/${id}/approve`, json({ lines })),
    issue: (config: CognitoConfig, id: number) => request<RemotePurchaseRequest>(config, `/api/v1/purchase-requests/${id}/commands/issue`, json({})),
  },
  stock: {
    inwards: (config: CognitoConfig) => request<RemoteStockInward[]>(config, "/api/v1/stock-inwards"),
    receive: (config: CognitoConfig, input: { itemId: number; qty: number; unitCost?: number; note?: string; purchaseOrderLineId?: number }) => request<RemoteStockInward>(config, "/api/v1/stock-inwards", json(input)),
    adjust: (config: CognitoConfig, input: { itemId: number; quantity: number; reason: string }) => request<unknown>(config, "/api/v1/stock-adjustments", json(input)),
  },
};
