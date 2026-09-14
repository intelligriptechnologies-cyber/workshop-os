import { ApiError, type AuthenticatedMembership } from "./admin-users.js";

export type PermissionAction = { key: string; label: string; description: string };
export type PermissionPage = { key: string; label: string; description: string; actions: PermissionAction[] };
export type PermissionGroup = { key: string; label: string; pages: PermissionPage[] };

export const DEFAULT_PERMISSION_CATALOG: PermissionGroup[] = [
  { key: "administration", label: "Administration", pages: [
    { key: "admin.users.page", label: "Tenant users", description: "Open Tenant User Management.", actions: [
      { key: "membership.manage", label: "Manage tenant users", description: "Invite, edit, suspend, activate, archive, and export tenant users." },
    ] },
    { key: "admin.roles.page", label: "Roles and permissions", description: "Open Roles and Permissions.", actions: [
      { key: "role.manage", label: "Manage custom roles", description: "Create, revise, and archive custom roles." },
    ] },
    { key: "business-settings.page", label: "Business Settings", description: "Open versioned tenant and branch settings.", actions: [
      { key: "business-settings.manage", label: "Manage Business Settings", description: "Save, reset, and publish tenant defaults and branch overrides." },
    ] },
  ] },
  { key: "operations", label: "Workshop operations", pages: [
    { key: "customers.page", label: "Customers", description: "Open production customer records.", actions: [
      { key: "customer.read", label: "View customers", description: "Read customers in permitted branches." },
      { key: "customer.manage", label: "Manage customers", description: "Create and edit customer records." },
      { key: "customer.export", label: "Export customers", description: "Create and download complete private customer exports." },
    ] },
    { key: "vehicles.page", label: "Vehicles", description: "Open production vehicle records.", actions: [
      { key: "vehicle.read", label: "View vehicles", description: "Read vehicles and current ownership in permitted branches." },
      { key: "vehicle.manage", label: "Manage vehicles", description: "Create and edit vehicles and owner associations." },
      { key: "vehicle.export", label: "Export vehicles", description: "Create and download complete private vehicle exports." },
    ] },
    { key: "work-items.page", label: "Production work items", description: "Open the production work-item list.", actions: [
      { key: "work-item.read", label: "View work items", description: "Read work items in permitted branches." },
      { key: "work-item.manage", label: "Manage work items", description: "Create, edit, and archive work items." },
      { key: "work-item.export", label: "Export work items", description: "Create and download complete private work-item exports." },
    ] },
  ] },
  { key: "discovery", label: "Discovery", pages: [
    { key: "global-search.page", label: "Global record search", description: "Open permission-filtered global record search.", actions: [
      { key: "global-search.use", label: "Search permitted records", description: "Search records without revealing denied identifiers, snippets, or counts." },
    ] },
  ] },
];

export const permissionKeys = (catalog: PermissionGroup[] = DEFAULT_PERMISSION_CATALOG) =>
  catalog.flatMap((group) => group.pages.flatMap((page) => [page.key, ...page.actions.map((action) => action.key)]));

export function filterPermissionCatalog(query: string, catalog: PermissionGroup[] = DEFAULT_PERMISSION_CATALOG): PermissionGroup[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return catalog;
  const includes = (...values: string[]) => values.some((value) => value.toLocaleLowerCase().includes(needle));
  return catalog.flatMap((group) => {
    const groupMatch = includes(group.key, group.label);
    const pages = group.pages.flatMap((page) => {
      const pageMatch = groupMatch || includes(page.key, page.label, page.description);
      const actions = pageMatch ? page.actions : page.actions.filter((action) => includes(action.key, action.label, action.description));
      return pageMatch || actions.length ? [{ ...page, actions }] : [];
    });
    return pages.length ? [{ ...group, pages }] : [];
  });
}

export type ManagedRole = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  protected: boolean;
  active: boolean;
  version: number;
  updatedAt: string;
};
export type RoleDirectory = { roles: ManagedRole[]; catalog: PermissionGroup[] };
export type RoleInput = { name: string; description: string; permissions: string[] };

export interface RolePermissionRepository {
  roleDirectory(actor: AuthenticatedMembership): Promise<RoleDirectory>;
  createRole(actor: AuthenticatedMembership, input: RoleInput, idempotencyKey: string): Promise<{ role: ManagedRole; replay: boolean }>;
  updateRole(actor: AuthenticatedMembership, id: string, input: RoleInput & { version: number }): Promise<ManagedRole>;
  archiveRole(actor: AuthenticatedMembership, id: string, input: { version: number; reason: string }, idempotencyKey: string): Promise<{ role: ManagedRole; replay: boolean }>;
}

function requireRoleManager(actor: AuthenticatedMembership) {
  if (!actor.permissions.includes("role.manage")) throw new ApiError(403, "PERMISSION_DENIED");
}

function validatedInput(raw: Record<string, unknown>): RoleInput {
  const name = String(raw.name ?? "").trim();
  const description = String(raw.description ?? "").trim();
  const permissions = Array.isArray(raw.permissions)
    ? [...new Set(raw.permissions.filter((item): item is string => typeof item === "string" && item.length > 0))].sort()
    : [];
  if (!name) throw new ApiError(400, "ROLE_NAME_REQUIRED");
  if (name.length > 100) throw new ApiError(400, "ROLE_NAME_TOO_LONG");
  if (description.length > 500) throw new ApiError(400, "ROLE_DESCRIPTION_TOO_LONG");
  const known = new Set(permissionKeys());
  if (!permissions.length || permissions.some((permission) => !known.has(permission))) throw new ApiError(400, "PERMISSION_INVALID");
  for (const group of DEFAULT_PERMISSION_CATALOG) for (const page of group.pages) {
    if (page.actions.some((action) => permissions.includes(action.key)) && !permissions.includes(page.key)) {
      throw new ApiError(400, "PAGE_PERMISSION_REQUIRED");
    }
  }
  return { name, description, permissions };
}

export class RolePermissionService {
  constructor(private readonly repository: RolePermissionRepository) {}

  async list(actor: AuthenticatedMembership, search = "") {
    requireRoleManager(actor);
    const result = await this.repository.roleDirectory(actor);
    return { ...result, catalog: filterPermissionCatalog(search, result.catalog) };
  }

  async create(actor: AuthenticatedMembership, raw: Record<string, unknown>, idempotencyKey: string) {
    requireRoleManager(actor);
    if (!idempotencyKey.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    return this.repository.createRole(actor, validatedInput(raw), idempotencyKey);
  }

  async update(actor: AuthenticatedMembership, id: string, raw: Record<string, unknown>) {
    requireRoleManager(actor);
    const version = Number(raw.version);
    if (!Number.isSafeInteger(version) || version < 1) throw new ApiError(400, "VERSION_REQUIRED");
    return this.repository.updateRole(actor, id, { ...validatedInput(raw), version });
  }

  async archive(actor: AuthenticatedMembership, id: string, raw: Record<string, unknown>, idempotencyKey: string) {
    requireRoleManager(actor);
    if (!idempotencyKey.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    const version = Number(raw.version);
    const reason = String(raw.reason ?? "").trim();
    if (!Number.isSafeInteger(version) || version < 1) throw new ApiError(400, "VERSION_REQUIRED");
    if (!reason) throw new ApiError(400, "ARCHIVE_REASON_REQUIRED");
    return this.repository.archiveRole(actor, id, { version, reason }, idempotencyKey);
  }
}
