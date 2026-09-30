import type { Database } from "sql.js";
import { archiveCustomer, createCustomer, openWorkshopDb, persist, readState, updateCustomer } from "./db";
import type { Customer, Vehicle, WorkshopState } from "./types";

/** The persistence-neutral contract for the first migratable feature area. */
export type CustomerInput = Pick<Customer, "name" | "mobile" | "type" | "address">;
export type CustomerQuery = { type: "customers.list"; archived?: boolean };
export type CustomerCommand =
  | { type: "customers.save"; customer: CustomerInput & { id?: number } }
  | { type: "customers.archive"; customerId: number; reason: string };

export interface CustomerDataPort {
  query(query: CustomerQuery): Promise<Customer[]>;
  command(command: CustomerCommand): Promise<Customer>;
}

export type DataAccessReachability = "online" | "offline";
export type DataAccessErrorCode = "NOT_READY" | "READ_FAILED" | "COMMAND_FAILED";

export class WorkshopDataAccessError extends Error {
  constructor(readonly code: DataAccessErrorCode, message: string, readonly cause?: unknown) {
    super(message);
    this.name = "WorkshopDataAccessError";
  }
}

/** Transitional callback accepted only by the existing demo UI. */
export type LegacyLocalMutation = (database: Database) => void;

export interface WorkshopDataAccess {
  /** Dynamic reachability for loading/error UI and the later app-shell indicator. */
  getReachability(): DataAccessReachability;
  load(): Promise<WorkshopState>;
  read(): WorkshopState;
  /** Compatibility bridge for UI areas not migrated to a typed feature port yet. */
  runLegacyMutation(action: LegacyLocalMutation): WorkshopState;
  /** First persistence-neutral feature port, ready to move to FastAPI independently. */
  readonly customers: CustomerDataPort;
}

type LocalDataAccessDependencies = {
  open: () => Promise<Database>;
  persist: (database: Database) => void;
  read: (database: Database) => WorkshopState;
  createCustomer: (database: Database, input: CustomerInput) => number;
  updateCustomer: (database: Database, id: number, input: CustomerInput) => void;
  archiveCustomer: (database: Database, id: number, reason: string) => void;
};

const localDependencies: LocalDataAccessDependencies = {
  open: openWorkshopDb,
  persist,
  read: readState,
  createCustomer,
  updateCustomer,
  archiveCustomer,
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function asDataAccessError(code: DataAccessErrorCode, error: unknown, fallback: string) {
  return error instanceof WorkshopDataAccessError ? error : new WorkshopDataAccessError(code, errorMessage(error, fallback), error);
}

function customerFromState(state: WorkshopState, id: number) {
  const customer = [...state.customers, ...state.archived_customers].find((item) => item.id === id);
  if (!customer) throw new WorkshopDataAccessError("COMMAND_FAILED", "The saved customer could not be read.");
  return customer;
}

/** Browser-SQLite adapter; customer mapping is the reference for FastAPI. */
export function createLocalWorkshopDataAccess(overrides: Partial<LocalDataAccessDependencies> = {}): WorkshopDataAccess {
  const dependencies = { ...localDependencies, ...overrides };
  let database: Database | undefined;

  const requireDatabase = () => {
    if (!database) throw new WorkshopDataAccessError("NOT_READY", "Workshop data is still loading.");
    return database;
  };
  const read = () => {
    try {
      return dependencies.read(requireDatabase());
    } catch (error) {
      throw asDataAccessError("READ_FAILED", error, "Workshop data could not be read.");
    }
  };
  const saveAndRead = () => {
    dependencies.persist(requireDatabase());
    return read();
  };
  const customers: CustomerDataPort = {
    async query(query) {
      const state = read();
      return query.archived ? state.archived_customers : state.customers;
    },
    async command(command) {
      const activeDatabase = requireDatabase();
      try {
        const id = command.type === "customers.save"
          ? command.customer.id
            ? (dependencies.updateCustomer(activeDatabase, command.customer.id, command.customer), command.customer.id)
            : dependencies.createCustomer(activeDatabase, command.customer)
          : (dependencies.archiveCustomer(activeDatabase, command.customerId, command.reason), command.customerId);
        return customerFromState(saveAndRead(), id);
      } catch (error) {
        throw asDataAccessError("COMMAND_FAILED", error, "Customer action failed.");
      }
    },
  };

  return {
    getReachability: () => "online",
    async load() {
      try {
        database ??= await dependencies.open();
        return read();
      } catch (error) {
        throw asDataAccessError("READ_FAILED", error, "Workshop data could not be loaded.");
      }
    },
    read,
    runLegacyMutation(action) {
      const activeDatabase = requireDatabase();
      try {
        action(activeDatabase);
        return saveAndRead();
      } catch (error) {
        throw asDataAccessError("COMMAND_FAILED", error, "Workshop action failed.");
      }
    },
    customers,
  };
}

export type CustomerApiRequest = <T>(request: {
  method: "GET" | "POST" | "PUT";
  path: string;
  body?: unknown;
}) => Promise<T>;

export type VehicleInput = Omit<Vehicle, "id">;
export type VehicleQuery = { type: "vehicles.list"; archived?: boolean; q?: string };
export type VehicleCommand =
  | { type: "vehicles.save"; vehicle: VehicleInput & { id?: number } }
  | { type: "vehicles.archive"; vehicleId: number; reason: string };
export type ApiVisit = { id: number; customerId: number; vehicleId: number; fuel: string; odoReading: number; requestedWork: string; archivedAt: string | null };
export type VisitInput = Omit<ApiVisit, "id" | "archivedAt"> & { advisorId?: string | null; fuelLevelValue?: string; fuelLevelUnit?: string; keys?: string; accessories?: string; photosNote?: string };
export type VisitQuery = { type: "visits.list"; archived?: boolean; q?: string };
export type VisitCommand =
  | { type: "visits.create"; visit: VisitInput }
  | { type: "visits.update"; visitId: number; visit: Omit<VisitInput, "customerId" | "vehicleId"> }
  | { type: "visits.archive"; visitId: number; reason: string };

export interface VehicleDataPort { query(query: VehicleQuery): Promise<Vehicle[]>; command(command: VehicleCommand): Promise<Vehicle>; }
export interface VisitDataPort { query(query: VisitQuery): Promise<ApiVisit[]>; command(command: VisitCommand): Promise<ApiVisit>; }
export interface IntakeDataPort { customers: CustomerDataPort; vehicles: VehicleDataPort; visits: VisitDataPort; }

/** FastAPI-shaped port, with transport injection for feature tests. */
export function createApiCustomerDataAccess(request: CustomerApiRequest): CustomerDataPort {
  const run = async <T>(kind: "READ_FAILED" | "COMMAND_FAILED", work: () => Promise<T>) => {
    try { return await work(); }
    catch (error) { throw asDataAccessError(kind, error, kind === "READ_FAILED" ? "Customers could not be loaded." : "Customer action failed."); }
  };
  return {
    query: (query) => run("READ_FAILED", () => request<Customer[]>({ method: "GET", path: `/customers?archived=${query.archived ? "true" : "false"}` })),
    command: (command) => command.type === "customers.save"
      ? run("COMMAND_FAILED", () => request<Customer>({ method: command.customer.id ? "PUT" : "POST", path: command.customer.id ? `/customers/${command.customer.id}` : "/customers", body: command.customer }))
      : run("COMMAND_FAILED", () => request<Customer>({ method: "POST", path: `/customers/${command.customerId}/archive`, body: { reason: command.reason } })),
  };
}

/** API-shaped intake boundary used by Cognito-mode Customer, Vehicle, and Visit UI. */
export function createApiIntakeDataAccess(request: CustomerApiRequest): IntakeDataPort {
  const run = async <T>(kind: "READ_FAILED" | "COMMAND_FAILED", work: () => Promise<T>) => {
    try { return await work(); }
    catch (error) { throw asDataAccessError(kind, error, kind === "READ_FAILED" ? "Intake records could not be loaded." : "Intake action failed."); }
  };
  return {
    customers: createApiCustomerDataAccess(request),
    vehicles: {
      query: (query) => run("READ_FAILED", () => request<Vehicle[]>({ method: "GET", path: `/vehicles?archived=${query.archived ? "true" : "false"}&q=${encodeURIComponent(query.q ?? "")}` })),
      command: (command) => command.type === "vehicles.save"
        ? run("COMMAND_FAILED", () => request<Vehicle>({ method: command.vehicle.id ? "PUT" : "POST", path: command.vehicle.id ? `/vehicles/${command.vehicle.id}` : "/vehicles", body: command.vehicle }))
        : run("COMMAND_FAILED", () => request<Vehicle>({ method: "POST", path: `/vehicles/${command.vehicleId}/archive`, body: { reason: command.reason } })),
    },
    visits: {
      query: (query) => run("READ_FAILED", () => request<ApiVisit[]>({ method: "GET", path: `/visits?archived=${query.archived ? "true" : "false"}&q=${encodeURIComponent(query.q ?? "")}` })),
      command: (command) => command.type === "visits.create"
        ? run("COMMAND_FAILED", () => request<ApiVisit>({ method: "POST", path: "/visits", body: command.visit }))
        : command.type === "visits.update"
          ? run("COMMAND_FAILED", () => request<ApiVisit>({ method: "PUT", path: `/visits/${command.visitId}`, body: command.visit }))
          : run("COMMAND_FAILED", () => request<ApiVisit>({ method: "POST", path: `/visits/${command.visitId}/archive`, body: { reason: command.reason } })),
    },
  };
}

/** A minimal whole-app test double; feature-specific ports remain injectable. */
export function createWorkshopDataAccessTestDouble(initialState: WorkshopState, options: {
  reachability?: DataAccessReachability;
  customers?: CustomerDataPort;
} = {}): WorkshopDataAccess {
  const unsupported = () => { throw new WorkshopDataAccessError("COMMAND_FAILED", "The test data-access adapter does not execute legacy SQLite mutations."); };
  const customers = options.customers ?? {
    async query(query: CustomerQuery) { return query.archived ? initialState.archived_customers : initialState.customers; },
    async command() { throw new WorkshopDataAccessError("COMMAND_FAILED", "The test customer port has no command handler."); },
  };
  return {
    getReachability: () => options.reachability ?? "online",
    async load() { return initialState; },
    read() { return initialState; },
    runLegacyMutation: unsupported,
    customers,
  };
}
