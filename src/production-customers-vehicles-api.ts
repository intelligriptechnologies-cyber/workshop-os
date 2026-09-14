import { authenticatedFetch, type CognitoConfig } from "./auth";
import { workItemListSearch, type WorkItemListQuery as EntityListQuery, type ListPreference, type WorkItemExport as EntityExport } from "./work-items-api";

export type IdentityAuth = { mode: "cognito"; config: CognitoConfig } | { mode: "local"; identity: string };
export type Customer = { id: string; tenantId: string; branchId: string; displayName: string; mobile: string; email: string; status: "ACTIVE" | "MERGED"; version: number; updatedAt: string };
export type Vehicle = { id: string; tenantId: string; branchId: string; registration: string; vin: string; make: string; model: string; ownerCustomerId: string; ownerName: string; status: "ACTIVE" | "MERGED"; version: number; updatedAt: string };
export type { EntityListQuery, ListPreference, EntityExport };
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
const messages: Record<string, string> = { DUPLICATE_MOBILE: "That mobile number already belongs to another customer. Open the existing record or use a different number.", DUPLICATE_REGISTRATION: "That registration already belongs to another vehicle. Open the existing record instead.", DUPLICATE_VIN: "That VIN already belongs to another vehicle.", OWNER_ASSOCIATION_INVALID: "Choose an active customer from the same branch.", OWNERSHIP_DATE_CONFLICT: "This vehicle already has an ownership change for today. Review its ownership history before trying again.", VERSION_CONFLICT: "This record changed since you opened it. Refresh and try again.", BRANCH_FORBIDDEN: "You do not have access to that branch.", PERMISSION_DENIED: "You do not have permission to perform this action.", CUSTOMER_NAME_REQUIRED: "Enter a customer name.", MOBILE_INVALID: "Enter a valid 10-digit mobile number.", VEHICLE_IDENTITY_REQUIRED: "Enter a registration or VIN.", VIN_INVALID: "Enter a valid 17-character VIN." };
export class IdentityApiError extends Error { constructor(readonly code: string, readonly traceId: string) { super(messages[code] ?? "WorkshopOS could not complete the request."); } }

export function createCustomersVehiclesApi(auth: IdentityAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string, init: RequestInit = {}) => { const headers = new Headers(init.headers); headers.set("accept", "application/json"); const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, path, { ...init, headers }) : await fetcher(path, { ...init, headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } }); const value = response.headers.get("content-type")?.includes("json") ? await response.json() as any : {}; if (!response.ok) throw new IdentityApiError(value.code ?? "INTERNAL_ERROR", value.traceId ?? response.headers.get("x-trace-id") ?? "unavailable"); return value as T; };
  const write = <T>(path: string, method: "POST" | "PATCH" | "PUT", value: unknown, key?: string) => request<T>(path, { method, headers: { "content-type": "application/json", ...(key ? { "idempotency-key": key } : {}) }, body: JSON.stringify(value) });
  const list = async <K extends "customers" | "vehicles", T>(kind: K, query: EntityListQuery) => request<{ page: any; query: EntityListQuery } & Record<K, T[]>>(`/api/v1/${kind}?${workItemListSearch(query)}`.replace(/\?$/, ""));
  return {
    session: () => request<any>("/api/v1/session"),
    listCustomers: (query: EntityListQuery) => list<"customers", Customer>("customers", query),
    listVehicles: (query: EntityListQuery) => list<"vehicles", Vehicle>("vehicles", query),
    getCustomer: async (id: string) => (await request<{ customer: Customer }>(`/api/v1/customers/${id}`)).customer,
    getVehicle: async (id: string) => (await request<{ vehicle: Vehicle }>(`/api/v1/vehicles/${id}`)).vehicle,
    createCustomer: async (value: Omit<Customer, "id" | "tenantId" | "status" | "version" | "updatedAt">, key = crypto.randomUUID()) => (await write<{ customer: Customer }>("/api/v1/customers", "POST", value, key)).customer,
    updateCustomer: async (value: Pick<Customer, "id" | "displayName" | "mobile" | "email" | "version">) => (await write<{ customer: Customer }>(`/api/v1/customers/${value.id}`, "PATCH", value)).customer,
    createVehicle: async (value: Omit<Vehicle, "id" | "tenantId" | "ownerName" | "status" | "version" | "updatedAt">, key = crypto.randomUUID()) => (await write<{ vehicle: Vehicle }>("/api/v1/vehicles", "POST", value, key)).vehicle,
    updateVehicle: async (value: Pick<Vehicle, "id" | "registration" | "vin" | "make" | "model" | "ownerCustomerId" | "version">) => (await write<{ vehicle: Vehicle }>(`/api/v1/vehicles/${value.id}`, "PATCH", value)).vehicle,
    getPreference: async (screen: "customers" | "vehicles") => (await request<{ preference: ListPreference }>(`/api/v1/list-preferences/${screen}`)).preference,
    savePreference: async (screen: "customers" | "vehicles", viewMode: ListPreference["viewMode"]) => (await write<{ preference: ListPreference }>(`/api/v1/list-preferences/${screen}`, "PUT", { viewMode })).preference,
    requestExport: async (screen: "customers" | "vehicles", format: EntityExport["format"], query: EntityListQuery, key = crypto.randomUUID()) => (await write<{ export: EntityExport }>("/api/v1/customer-vehicle-exports", "POST", { screen, format, query }, key)).export,
    getExport: async (id: string) => (await request<{ export: EntityExport }>(`/api/v1/customer-vehicle-exports/${id}`)).export,
    async downloadExport(id: string) { const headers = new Headers({ accept: "application/octet-stream" }); const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, `/api/v1/customer-vehicle-exports/${id}/download`, { headers }) : await fetcher(`/api/v1/customer-vehicle-exports/${id}/download`, { headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } }); if (!response.ok) throw new IdentityApiError("EXPORT_NOT_READY", response.headers.get("x-trace-id") ?? "unavailable"); return { blob: await response.blob(), filename: response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "identity-export" }; },
  };
}
