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
    { key: "jobs.page", label: "Jobs", description: "Open the production Job List.", actions: [
      { key: "job.read", label: "View Jobs", description: "Read Jobs in permitted branches." },
      { key: "job.lifecycle.manage", label: "Manage Job lifecycle", description: "Run authorized, versioned lifecycle commands and record acceptance facts." },
      { key: "job.estimate-approval.record", label: "Record Estimate Approved", description: "Record attributed estimate-approval evidence." },
      { key: "job.work-acceptance.record", label: "Record Work Accepted", description: "Record attributed customer work-acceptance evidence." },
      { key: "job.payment-clearance.record", label: "Record Payment Cleared", description: "Record attributed financial-clearance evidence." },
      { key: "job.document.download", label: "Download Job documents", description: "Download authorized Job Cards and immutable linked documents." },
      { key: "job.export", label: "Export Jobs", description: "Create and download complete private Job exports." },
    ] },
    { key: "media.page", label: "Media", description: "Open Job-linked production Media.", actions: [
      { key: "media.read", label: "View Media", description: "Read Job-linked media metadata and thumbnails in permitted branches." },
      { key: "media.upload", label: "Upload Media", description: "Upload lifecycle-valid media to a selected Job." },
      { key: "media.archive", label: "Archive Media", description: "Archive media with a reason without deleting evidence." },
      { key: "media.download", label: "View and download Media", description: "Access clean, non-archived private originals." },
    ] },
    { key: "estimates.page", label: "Estimates", description: "Open immutable production Estimate versions.", actions: [
      { key: "estimate.read", label: "View Estimates", description: "Read Estimate versions and approval evidence." },
      { key: "estimate.manage", label: "Version Estimates", description: "Create Estimates and revisions without rewriting history." },
      { key: "estimate.submit", label: "Submit Estimates", description: "Freeze and submit a current Estimate version." },
      { key: "estimate.approve", label: "Approve Estimates", description: "Record attributed approval evidence and canonical lifecycle fact." },
      { key: "estimate.document.download", label: "Download Estimates", description: "Download the selected immutable Estimate version." },
    ] },
    { key: "tasks.page", label: "Tasks", description: "Open production technician Tasks.", actions: [
      { key: "task.read", label: "View Tasks", description: "Read dependency and execution state." },
      { key: "task.assign", label: "Assign Tasks", description: "Assign an effective branch technician." },
      { key: "task.execute", label: "Execute Tasks", description: "Run dependency-aware task transitions." },
      { key: "task.evidence.write", label: "Add Task evidence", description: "Add clean private checklist evidence." },
    ] },
    { key: "qc.page", label: "Quality control", description: "Open independent QC and blocking rework.", actions: [
      { key: "qc.read", label: "View QC", description: "Read QC checklists, decisions, and rework." },
      { key: "qc.inspect", label: "Inspect Tasks", description: "Record independent checklist decisions." },
      { key: "rework.assign", label: "Assign rework", description: "Assign failed-item rework." },
      { key: "rework.execute", label: "Execute rework", description: "Complete evidence-backed rework for reinspection." },
    ] },
    { key: "billing.page", label: "Billing and delivery", description: "Open final finance, payment, custody, and closure operations.", actions: [
      { key: "billing.read", label: "View billing", description: "Read authorized Job finance and custody status." },
      { key: "invoice.finalize", label: "Finalize invoices", description: "Create immutable final invoices from approved scope." },
      { key: "invoice.correction.request", label: "Request invoice correction", description: "Request a compensating credit/debit adjustment." },
      { key: "invoice.correction.approve", label: "Approve invoice correction", description: "Independently approve a compensating invoice adjustment." },
      { key: "payment.record", label: "Record payments", description: "Append attributed payment events and receipts." },
      { key: "payment.correction.request", label: "Request payment correction", description: "Request a compensating payment event." },
      { key: "payment.correction.approve", label: "Approve payment correction", description: "Independently approve a compensating payment event." },
      { key: "delivery.record", label: "Record delivery acknowledgement", description: "Capture immutable delivery acknowledgement before release." },
      { key: "gate-pass.issue", label: "Issue gate passes", description: "Issue protected pre-release gate passes after all blockers clear." },
      { key: "gate-pass.verify", label: "Verify vehicle release", description: "Independently verify the vehicle and record release." },
      { key: "job.close", label: "Close delivered Jobs", description: "Close only after an immutable vehicle release exists." },
    ] },
    { key: "data-flow.page", label: "Data Flow", description: "Open the record-specific production Job Data Flow.", actions: [
      { key: "job.data-flow.read", label: "View Job Data Flow", description: "Explain Visit, work, finance, custody, artifacts, and history for permitted Jobs." },
    ] },
    { key: "inventory.page", label: "Inventory", description: "Open production stock analytics and operations.", actions: [
      { key: "inventory.read", label: "View inventory", description: "Read stock position, movement, ageing, and reorder indicators." },
      { key: "inventory.operate", label: "Operate inventory", description: "Post authorized stock operations without rewriting ledger history." },
      { key: "inventory.export", label: "Export inventory", description: "Create and download complete private inventory exports." },
      { key: "inventory.import", label: "Import inventory", description: "Stage, validate, dry-run, and explicitly commit inventory imports." },
    ] },
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
