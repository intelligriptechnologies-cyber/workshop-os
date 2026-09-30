import { authenticatedFetch, type CognitoConfig } from "./auth";
import type { Customer, Vehicle } from "./types";

export class IntakeApiError extends Error {
  constructor(readonly code: string) { super(code); }
}

export type RemoteVisit = {
  id: number;
  branchId: string;
  customerId: number;
  vehicleId: number;
  advisorId: string | null;
  receivedAt: string;
  fuel: string;
  odoReading: number;
  fuelLevelValue: string;
  fuelLevelUnit: string;
  keys: string;
  accessories: string;
  requestedWork: string;
  photosNote: string;
  archivedAt: string | null;
};

export type RemoteCustomer = Customer & { branchId: string; archivedAt: string | null };
export type RemoteVehicle = Vehicle & { branchId: string; archivedAt: string | null };
export type CustomerInput = Pick<Customer, "name" | "mobile" | "type" | "address">;
export type VehicleInput = Omit<Vehicle, "id">;
export type VisitInput = Pick<RemoteVisit, "customerId" | "vehicleId" | "advisorId" | "fuel" | "odoReading" | "fuelLevelValue" | "fuelLevelUnit" | "keys" | "accessories" | "requestedWork" | "photosNote">;

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  const body = await response.json() as T & { code?: string };
  if (!response.ok) throw new IntakeApiError(body.code ?? "API_FAILED");
  return body;
}

const json = (body: unknown): RequestInit => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export const intakeApi = {
  customers: {
    list: (config: CognitoConfig, options: { q?: string; archived?: boolean } = {}) => request<RemoteCustomer[]>(config, `/api/v1/customers?${new URLSearchParams({ q: options.q ?? "", archived: String(options.archived ?? false) })}`),
    save: (config: CognitoConfig, input: CustomerInput & { id?: number }) => input.id
      ? request<RemoteCustomer>(config, `/api/v1/customers/${input.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(input) })
      : request<RemoteCustomer>(config, "/api/v1/customers", json(input)),
    archive: (config: CognitoConfig, id: number, reason: string) => request<RemoteCustomer>(config, `/api/v1/customers/${id}/archive`, json({ reason })),
  },
  vehicles: {
    list: (config: CognitoConfig, options: { q?: string; archived?: boolean } = {}) => request<RemoteVehicle[]>(config, `/api/v1/vehicles?${new URLSearchParams({ q: options.q ?? "", archived: String(options.archived ?? false) })}`),
    save: (config: CognitoConfig, input: VehicleInput & { id?: number }) => input.id
      ? request<RemoteVehicle>(config, `/api/v1/vehicles/${input.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(input) })
      : request<RemoteVehicle>(config, "/api/v1/vehicles", json(input)),
    archive: (config: CognitoConfig, id: number, reason: string) => request<RemoteVehicle>(config, `/api/v1/vehicles/${id}/archive`, json({ reason })),
  },
  visits: {
    list: (config: CognitoConfig, options: { q?: string; archived?: boolean } = {}) => request<RemoteVisit[]>(config, `/api/v1/visits?${new URLSearchParams({ q: options.q ?? "", archived: String(options.archived ?? false) })}`),
    create: (config: CognitoConfig, input: VisitInput) => request<RemoteVisit>(config, "/api/v1/visits", json(input)),
    update: (config: CognitoConfig, id: number, input: Omit<VisitInput, "customerId" | "vehicleId">) => request<RemoteVisit>(config, `/api/v1/visits/${id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }),
    archive: (config: CognitoConfig, id: number, reason: string) => request<RemoteVisit>(config, `/api/v1/visits/${id}/archive`, json({ reason })),
  },
};
