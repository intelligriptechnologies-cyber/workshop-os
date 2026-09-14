import { randomUUID } from "node:crypto";
import { createHash } from "node:crypto";

import { Pool, type PoolClient } from "pg";
import {
  ApiError,
  type AdminUserRepository,
  type AuthenticatedMembership,
  type BranchOption,
  type CreateMembership,
  type ManagedUser,
  type RoleOption,
  type UpdateMembership,
  type UserDirectory,
} from "../src/admin-users.js";
import type { ServerListQuery } from "../src/server-list-contract.js";
import { DEFAULT_USER_LIST_QUERY, type UserListQuery } from "../src/user-list-contract.js";
import {
  DEFAULT_PERMISSION_CATALOG,
  type ManagedRole,
  type RoleDirectory,
  type RoleInput,
  type RolePermissionRepository,
} from "../src/role-permissions.js";
import type {
  BusinessSettings, BusinessSettingsOverrides, BusinessSettingsRepository, SettingsSnapshot, SettingsWorkspace,
} from "../src/business-settings.js";
import { buildInventoryErrorManifest, formatInventoryQuantity, inventoryQuantityUnits, isValidInventoryQuantity, isValidInventoryValueMinor, normalizeInventoryImportRows, type NormalizedInventoryImportRow } from "../src/inventory-operations.js";

export type Membership = {
  id?: string;
  subject?: string;
  identitySubject?: string;
  tenantId: string;
  branchIds: string[];
  permissions?: string[];
  warehouseIds?: string[];
};

export type WorkItem = {
  id: string;
  tenantId: string;
  branchId: string;
  summary: string;
  version: number;
  updatedAt: string;
};

export type WorkItemListResult = {
  workItems: WorkItem[];
  page: { page: number; pageSize: number; totalCount: number; pageCount: number };
  query: ServerListQuery;
};

export type CustomerRecord = { id: string; tenantId: string; branchId: string; displayName: string; mobile: string; email: string; status: "ACTIVE" | "MERGED"; version: number; updatedAt: string };
export type VehicleRecord = { id: string; tenantId: string; branchId: string; registration: string; vin: string; make: string; model: string; ownerCustomerId: string; ownerName: string; status: "ACTIVE" | "MERGED"; version: number; updatedAt: string };
export type EntityListResult<T, K extends string> = { page: { page: number; pageSize: number; totalCount: number; pageCount: number }; query: ServerListQuery } & Record<K, T[]>;
export type InventoryPosition = { id: string; branchId: string; warehouseId: string; warehouseName: string; sku: string; baseUom: string; quantity: string; valueMinor: string; reorderPoint: string; reorder: boolean; lastMovementAt?: string; ageDays?: number };
export type InventoryImportRecord = { id: string; branchId: string; filename: string; status: "STAGED" | "COMMITTED"; version: number; summary: { totalRows: number; validRows: number; invalidRows: number; quantity: string; valueMinor: string }; stagedAt: string; committedAt?: string; reconciliation?: { ledgerBatches: number; quantity: string; valueMinor: string } };

export type ListExportJob = {
  id: string; screenKey: string; format: "PDF" | "XLSX"; status: "PENDING" | "READY" | "FAILED";
  rowCount?: number; filename?: string; mimeType?: string; createdAt: string; completedAt?: string;
};

export const memberships: Record<string, Membership> = {
  "north-reception": {
    subject: "00000000-0000-4000-8000-000000000101",
    tenantId: "00000000-0000-4000-8000-000000000001",
    branchIds: ["00000000-0000-4000-8000-000000000011"],
    permissions: ["work-item.read", "work-item.manage", "work-item.export"],
  },
  "north-jaipur-manager": {
    subject: "00000000-0000-4000-8000-000000000102",
    tenantId: "00000000-0000-4000-8000-000000000001",
    branchIds: ["00000000-0000-4000-8000-000000000012"],
    permissions: ["work-item.read", "work-item.manage", "work-item.export"],
  },
  "south-reception": {
    subject: "00000000-0000-4000-8000-000000000201",
    tenantId: "00000000-0000-4000-8000-000000000002",
    branchIds: ["00000000-0000-4000-8000-000000000021"],
    permissions: ["work-item.read"],
  },
};

type StoredResponse = {
  workItem: WorkItem;
  resourceVersion: number;
  auditReference: string;
};

export class PostgresVertical implements AdminUserRepository, RolePermissionRepository, BusinessSettingsRepository {
  readonly pool: Pool;

  constructor(connectionString = process.env.DATABASE_URL) {
    if (!connectionString) throw new Error("DATABASE_URL is required");
    this.pool = new Pool({ connectionString, max: 10 });
  }

  async health(): Promise<{ database: string; migrations: number }> {
    const result = await this.pool.query<{ database: string; migrations: string }>(
      "SELECT current_database() AS database, (SELECT count(*)::text FROM public.schema_migrations) AS migrations",
    );
    return { database: result.rows[0].database, migrations: Number(result.rows[0].migrations) };
  }

  async createWorkItem(membership: Membership, input: { branchId: string; summary: string }, idempotencyKey: string) {
    if (!membership.branchIds.includes(input.branchId)) {
      throw new ApiError(403, "BRANCH_FORBIDDEN");
    }
    if (!idempotencyKey.trim()) {
      throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    }
    if (!input.summary.trim()) {
      throw new ApiError(400, "SUMMARY_REQUIRED");
    }

    return this.inScope(membership, async (client) => {
      const requestHash = createHash("sha256").update(JSON.stringify({
        branchId: input.branchId,
        summary: input.summary.trim(),
      })).digest("hex");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
        `${membership.tenantId}:${idempotencyKey}`,
      ]);
      const replay = await client.query<{ request_hash: string | null; response: StoredResponse }>(
        "SELECT request_hash, response FROM workshopos.idempotency_result WHERE tenant_id = $1 AND idempotency_key = $2 FOR UPDATE",
        [membership.tenantId, idempotencyKey],
      );
      if (replay.rowCount) {
        if (replay.rows[0].request_hash && replay.rows[0].request_hash !== requestHash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
        return { status: 200, body: replay.rows[0].response } as const;
      }

      const id = randomUUID();
      const auditReference = randomUUID();
      const outboxId = randomUUID();
      const workItem: WorkItem = {
        id,
        tenantId: membership.tenantId,
        branchId: input.branchId,
        summary: input.summary.trim(),
        version: 1,
        updatedAt: new Date().toISOString(),
      };
      const body: StoredResponse = { workItem, resourceVersion: 1, auditReference };

      await client.query(
        "INSERT INTO workshopos.work_item (id, tenant_id, branch_id, summary) VALUES ($1, $2, $3, $4)",
        [id, membership.tenantId, input.branchId, workItem.summary],
      );
      await client.query(
        "INSERT INTO workshopos.audit_entry (id, tenant_id, branch_id, subject_id, action) VALUES ($1, $2, $3, $4, 'work-item.created')",
        [auditReference, membership.tenantId, input.branchId, membership.subject ?? membership.identitySubject],
      );
      await client.query(
        "INSERT INTO workshopos.outbox_event (id, tenant_id, branch_id, aggregate_id, audit_reference, kind, payload) VALUES ($1, $2, $3, $4, $5, 'work-item.created', $6::jsonb)",
        [outboxId, membership.tenantId, input.branchId, id, auditReference, JSON.stringify({ workItemId: id })],
      );
      await client.query(
        "INSERT INTO workshopos.idempotency_result (tenant_id, idempotency_key, request_hash, response) VALUES ($1, $2, $3, $4::jsonb)",
        [membership.tenantId, idempotencyKey, requestHash, JSON.stringify(body)],
      );
      return { status: 201, body } as const;
    });
  }

  async listWorkItems(membership: Membership): Promise<WorkItem[]> {
    return this.inScope(membership, async (client) => {
      const result = await client.query<{
        id: string; tenant_id: string; branch_id: string; summary: string; version: string; updated_at: Date;
      }>("SELECT id, tenant_id, branch_id, summary, version::text, updated_at FROM workshopos.work_item WHERE archived_at IS NULL ORDER BY created_at, id");
      return result.rows.map((row) => ({
        id: row.id,
        tenantId: row.tenant_id,
        branchId: row.branch_id,
        summary: row.summary,
        version: Number(row.version),
        updatedAt: row.updated_at.toISOString(),
      }));
    });
  }

  async queryWorkItems(membership: Membership, query: ServerListQuery, all = false): Promise<WorkItemListResult> {
    if (query.branchId && !membership.branchIds.includes(query.branchId)) throw new ApiError(403, "BRANCH_FORBIDDEN");
    return this.inScope(membership, async (client) => {
      const values: unknown[] = [];
      const where = ["archived_at IS NULL"];
      if (query.search) { values.push(`%${query.search}%`); where.push(`summary ILIKE $${values.length}`); }
      if (query.branchId) { values.push(query.branchId); where.push(`branch_id = $${values.length}`); }
      const condition = where.join(" AND ");
      const totalCount = Number((await client.query<{ count: string }>(`SELECT count(*)::text AS count FROM workshopos.work_item WHERE ${condition}`, values)).rows[0].count);
      const pageCount = Math.max(1, Math.ceil(totalCount / query.pageSize));
      const page = all ? 1 : Math.min(query.page, pageCount);
      const orderBy: Record<ServerListQuery["sort"], string> = {
        "updatedAt.desc": "updated_at DESC, id ASC", "updatedAt.asc": "updated_at ASC, id ASC",
        "summary.asc": "lower(summary) ASC, id ASC", "summary.desc": "lower(summary) DESC, id ASC",
      };
      const paging = all ? "" : ` LIMIT ${query.pageSize} OFFSET ${(page - 1) * query.pageSize}`;
      const result = await client.query<{
        id: string; tenant_id: string; branch_id: string; summary: string; version: string; updated_at: Date;
      }>(`SELECT id, tenant_id, branch_id, summary, version::text, updated_at FROM workshopos.work_item WHERE ${condition} ORDER BY ${orderBy[query.sort]}${paging}`, values);
      return {
        workItems: result.rows.map((row) => ({ id: row.id, tenantId: row.tenant_id, branchId: row.branch_id, summary: row.summary, version: Number(row.version), updatedAt: row.updated_at.toISOString() })),
        page: { page, pageSize: query.pageSize, totalCount, pageCount }, query: { ...query, page },
      };
    });
  }

  async getListPreference(membership: Membership, screenKey: string): Promise<{ viewMode: "grid" | "table"; version: number }> {
    return this.inScope(membership, async (client) => {
      const result = await client.query<{ view_mode: "grid" | "table"; version: string }>(
        "SELECT view_mode, version::text FROM workshopos.list_presentation_preference WHERE screen_key=$1", [screenKey],
      );
      return result.rowCount ? { viewMode: result.rows[0].view_mode, version: Number(result.rows[0].version) } : { viewMode: "table", version: 0 };
    });
  }

  async saveListPreference(membership: Membership, screenKey: string, viewMode: "grid" | "table") {
    const actor = this.actorId(membership);
    return this.inScope(membership, async (client) => {
      const result = await client.query<{ view_mode: "grid" | "table"; version: string }>(`
        INSERT INTO workshopos.list_presentation_preference(tenant_id,actor_id,screen_key,view_mode)
        VALUES($1,$2,$3,$4)
        ON CONFLICT (tenant_id,actor_id,screen_key) DO UPDATE SET view_mode=EXCLUDED.view_mode,version=workshopos.list_presentation_preference.version+1,updated_at=transaction_timestamp()
        RETURNING view_mode,version::text`, [membership.tenantId, actor, screenKey, viewMode]);
      return { viewMode: result.rows[0].view_mode, version: Number(result.rows[0].version) };
    });
  }

  async createListExport(membership: Membership, screenKey: string, format: "PDF" | "XLSX", query: ServerListQuery | UserListQuery, idempotencyKey: string): Promise<{ job: ListExportJob; replay: boolean }> {
    if (!idempotencyKey.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    const id = randomUUID(); const actor = this.actorId(membership);
    return this.inScope(membership, async (client) => {
      const requestHash = createHash("sha256").update(JSON.stringify({ screenKey, format, query })).digest("hex");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${membership.tenantId}:${actor}:${idempotencyKey}`]);
      const prior = await client.query<any>("SELECT * FROM workshopos.list_export_job WHERE idempotency_key=$1", [idempotencyKey]);
      if (prior.rowCount) {
        if (prior.rows[0].request_hash !== requestHash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
        return { job: this.mapExportJob(prior.rows[0]), replay: true };
      }
      const result = await client.query<any>(`INSERT INTO workshopos.list_export_job(id,tenant_id,actor_id,screen_key,format,idempotency_key,request_hash,query,status)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb,'PENDING') RETURNING *`, [id, membership.tenantId, actor, screenKey, format, idempotencyKey, requestHash, JSON.stringify(query)]);
      return { job: this.mapExportJob(result.rows[0]), replay: false };
    });
  }

  async completeListExport(membership: Membership, id: string, artifact: { content: Buffer; rowCount: number; filename: string; mimeType: string }) {
    return this.inScope(membership, async (client) => {
      const result = await client.query<any>(`UPDATE workshopos.list_export_job SET status='READY',content=$1,row_count=$2,filename=$3,mime_type=$4,completed_at=transaction_timestamp()
        WHERE id=$5 AND status='PENDING' RETURNING *`, [artifact.content, artifact.rowCount, artifact.filename, artifact.mimeType, id]);
      if (!result.rowCount) throw new ApiError(404, "EXPORT_NOT_FOUND");
      return this.mapExportJob(result.rows[0]);
    });
  }

  async failListExport(membership: Membership, id: string, code = "EXPORT_GENERATION_FAILED") {
    return this.inScope(membership, async (client) => { await client.query("UPDATE workshopos.list_export_job SET status='FAILED',failure_code=$1,completed_at=transaction_timestamp() WHERE id=$2 AND status='PENDING'", [code, id]); });
  }

  async getListExport(membership: Membership, id: string): Promise<ListExportJob> {
    return this.inScope(membership, async (client) => {
      const result = await client.query<any>("SELECT * FROM workshopos.list_export_job WHERE id=$1", [id]);
      if (!result.rowCount) throw new ApiError(404, "EXPORT_NOT_FOUND");
      return this.mapExportJob(result.rows[0]);
    });
  }

  async downloadListExport(membership: Membership, id: string): Promise<{ content: Buffer; filename: string; mimeType: string }> {
    return this.inScope(membership, async (client) => {
      const result = await client.query<any>("SELECT content,filename,mime_type,status FROM workshopos.list_export_job WHERE id=$1", [id]);
      if (!result.rowCount) throw new ApiError(404, "EXPORT_NOT_FOUND");
      if (result.rows[0].status !== "READY") throw new ApiError(409, "EXPORT_NOT_READY");
      return { content: result.rows[0].content, filename: result.rows[0].filename, mimeType: result.rows[0].mime_type };
    });
  }

  async queryCustomers(membership: Membership, query: ServerListQuery, all = false): Promise<EntityListResult<CustomerRecord, "customers">> {
    if (query.branchId && !membership.branchIds.includes(query.branchId)) throw new ApiError(403, "BRANCH_FORBIDDEN");
    return this.inScope(membership, async (client) => {
      const values: unknown[] = []; const where = ["c.status='ACTIVE'"];
      if (query.search) { values.push(`%${query.search}%`); where.push(`(c.display_name ILIKE $${values.length} OR EXISTS (SELECT 1 FROM workshopos.customer_contact sc WHERE sc.customer_id=c.id AND sc.contact_value ILIKE $${values.length}))`); }
      if (query.branchId) { values.push(query.branchId); where.push(`c.branch_id=$${values.length}`); }
      const condition = where.join(" AND ");
      const totalCount = Number((await client.query<{ count: string }>(`SELECT count(*)::text count FROM workshopos.customer c WHERE ${condition}`, values)).rows[0].count);
      const pageCount = Math.max(1, Math.ceil(totalCount / query.pageSize)); const page = all ? 1 : Math.min(query.page, pageCount);
      const order = query.sort === "updatedAt.asc" ? "c.updated_at ASC,c.id" : query.sort === "summary.asc" ? "lower(c.display_name) ASC,c.id" : query.sort === "summary.desc" ? "lower(c.display_name) DESC,c.id" : "c.updated_at DESC,c.id";
      const paging = all ? "" : ` LIMIT ${query.pageSize} OFFSET ${(page - 1) * query.pageSize}`;
      const rows = await client.query<any>(`SELECT c.id,c.tenant_id,c.branch_id,c.display_name,c.status,c.resource_version,c.updated_at,
        coalesce(max(cc.contact_value) FILTER (WHERE cc.contact_type='MOBILE'),'') mobile,coalesce(max(cc.contact_value) FILTER (WHERE cc.contact_type='EMAIL'),'') email
        FROM workshopos.customer c LEFT JOIN workshopos.customer_contact cc ON cc.customer_id=c.id AND cc.tenant_id=c.tenant_id AND cc.branch_id=c.branch_id
        WHERE ${condition} GROUP BY c.id,c.tenant_id,c.branch_id ORDER BY ${order}${paging}`, values);
      return { customers: rows.rows.map((row) => this.mapCustomer(row)), page: { page, pageSize: query.pageSize, totalCount, pageCount }, query: { ...query, page } };
    });
  }

  async createCustomer(membership: Membership, input: { branchId: string; displayName: string; mobile: string; email: string }, idempotencyKey: string) {
    this.validateBranchAndKey(membership, input.branchId, idempotencyKey);
    const displayName = input.displayName.trim(); const mobile = this.normalizeMobile(input.mobile); const email = input.email.trim().toLowerCase();
    if (!displayName) throw new ApiError(400, "CUSTOMER_NAME_REQUIRED");
    if (mobile.length !== 10) throw new ApiError(400, "MOBILE_INVALID");
    return this.inScope(membership, async (client) => {
      const requestHash = this.commandHash({ action: "create-customer", ...input, displayName, mobile, email });
      const replay = await this.customerVehicleReplay(client, membership.tenantId, idempotencyKey, requestHash); if (replay) return replay;
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${membership.tenantId}:${input.branchId}:mobile:${mobile}`]);
      if ((await client.query("SELECT 1 FROM workshopos.customer_contact WHERE contact_type='MOBILE' AND normalized_value=$1", [mobile])).rowCount) throw new ApiError(409, "DUPLICATE_MOBILE");
      const id = randomUUID();
      await client.query("INSERT INTO workshopos.customer(id,tenant_id,branch_id,display_name) VALUES($1,$2,$3,$4)", [id, membership.tenantId, input.branchId, displayName]);
      await client.query(`INSERT INTO workshopos.customer_contact(id,tenant_id,branch_id,customer_id,contact_name,contact_type,contact_value,normalized_value,consent_status,preferred) VALUES($1,$2,$3,$4,$5,'MOBILE',$6,$7,'UNKNOWN',true)`, [randomUUID(), membership.tenantId, input.branchId, id, displayName, input.mobile.trim(), mobile]);
      if (email) await client.query(`INSERT INTO workshopos.customer_contact(id,tenant_id,branch_id,customer_id,contact_name,contact_type,contact_value,normalized_value,consent_status,preferred) VALUES($1,$2,$3,$4,$5,'EMAIL',$6,$6,'UNKNOWN',false)`, [randomUUID(), membership.tenantId, input.branchId, id, displayName, email]);
      const customer: CustomerRecord = { id, tenantId: membership.tenantId, branchId: input.branchId, displayName, mobile: input.mobile.trim(), email, status: "ACTIVE", version: 1, updatedAt: new Date().toISOString() };
      const response = { customer, resourceVersion: 1, auditReference: await this.identityAudit(client, membership, input.branchId, "customer.created", id) };
      await this.storeCustomerVehicleReplay(client, membership.tenantId, idempotencyKey, requestHash, 201, response); return response;
    });
  }

  async getCustomer(membership: Membership, id: string): Promise<CustomerRecord> { return this.inScope(membership, async (client) => { const result = await client.query<any>(`SELECT c.id,c.tenant_id,c.branch_id,c.display_name,c.status,c.resource_version,c.updated_at,coalesce(max(cc.contact_value) FILTER (WHERE cc.contact_type='MOBILE'),'') mobile,coalesce(max(cc.contact_value) FILTER (WHERE cc.contact_type='EMAIL'),'') email FROM workshopos.customer c LEFT JOIN workshopos.customer_contact cc ON cc.customer_id=c.id AND cc.tenant_id=c.tenant_id AND cc.branch_id=c.branch_id WHERE c.id=$1 GROUP BY c.id,c.tenant_id,c.branch_id`, [id]); if (!result.rowCount) throw new ApiError(404,"CUSTOMER_NOT_FOUND"); return this.mapCustomer(result.rows[0]); }); }

  async updateCustomer(membership: Membership, id: string, input: { displayName: string; mobile: string; email: string; version: number }): Promise<CustomerRecord> {
    const displayName = input.displayName.trim(); const mobile = this.normalizeMobile(input.mobile); const email = input.email.trim().toLowerCase();
    if (!displayName) throw new ApiError(400, "CUSTOMER_NAME_REQUIRED"); if (mobile.length !== 10) throw new ApiError(400, "MOBILE_INVALID");
    return this.inScope(membership, async (client) => {
      const current = await client.query<any>("SELECT branch_id,resource_version::text FROM workshopos.customer WHERE id=$1 AND status='ACTIVE'", [id]);
      if (!current.rowCount) throw new ApiError(404, "CUSTOMER_NOT_FOUND"); if (Number(current.rows[0].resource_version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${membership.tenantId}:${current.rows[0].branch_id}:mobile:${mobile}`]);
      if ((await client.query("SELECT 1 FROM workshopos.customer_contact WHERE contact_type='MOBILE' AND normalized_value=$1 AND customer_id<>$2", [mobile, id])).rowCount) throw new ApiError(409, "DUPLICATE_MOBILE");
      const updated = await client.query<any>("UPDATE workshopos.customer SET display_name=$1,resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$2 AND resource_version=$3 RETURNING tenant_id,branch_id,status,resource_version::text,updated_at", [displayName, id, input.version]);
      if (!updated.rowCount) throw new ApiError(409, "VERSION_CONFLICT");
      await client.query("UPDATE workshopos.customer_contact SET contact_name=$1,contact_value=$2,normalized_value=$3,resource_version=resource_version+1 WHERE customer_id=$4 AND contact_type='MOBILE'", [displayName, input.mobile.trim(), mobile, id]);
      await client.query("DELETE FROM workshopos.customer_contact WHERE customer_id=$1 AND contact_type='EMAIL'", [id]);
      if (email) await client.query(`INSERT INTO workshopos.customer_contact(id,tenant_id,branch_id,customer_id,contact_name,contact_type,contact_value,normalized_value,consent_status,preferred) VALUES($1,$2,$3,$4,$5,'EMAIL',$6,$6,'UNKNOWN',false)`, [randomUUID(), membership.tenantId, current.rows[0].branch_id, id, displayName, email]);
      await this.identityAudit(client, membership, current.rows[0].branch_id, "customer.updated", id);
      return { id, tenantId: membership.tenantId, branchId: current.rows[0].branch_id, displayName, mobile: input.mobile.trim(), email, status: updated.rows[0].status, version: Number(updated.rows[0].resource_version), updatedAt: updated.rows[0].updated_at.toISOString() };
    });
  }

  async queryVehicles(membership: Membership, query: ServerListQuery, all = false): Promise<EntityListResult<VehicleRecord, "vehicles">> {
    if (query.branchId && !membership.branchIds.includes(query.branchId)) throw new ApiError(403, "BRANCH_FORBIDDEN");
    return this.inScope(membership, async (client) => {
      const values: unknown[] = []; const where = ["v.status='ACTIVE'"];
      if (query.search) { values.push(`%${query.search.replace(/[^a-zA-Z0-9]/g, "")}%`); where.push(`(v.normalized_registration ILIKE $${values.length} OR v.vin ILIKE $${values.length} OR v.attributes->>'make' ILIKE $${values.length} OR v.attributes->>'model' ILIKE $${values.length})`); }
      if (query.branchId) { values.push(query.branchId); where.push(`v.branch_id=$${values.length}`); }
      const condition = where.join(" AND "); const totalCount = Number((await client.query<{ count: string }>(`SELECT count(*)::text count FROM workshopos.vehicle v WHERE ${condition}`, values)).rows[0].count);
      const pageCount = Math.max(1, Math.ceil(totalCount / query.pageSize)); const page = all ? 1 : Math.min(query.page, pageCount);
      const order = query.sort === "updatedAt.asc" ? "v.updated_at ASC,v.id" : query.sort === "summary.asc" ? "v.normalized_registration ASC,v.id" : query.sort === "summary.desc" ? "v.normalized_registration DESC,v.id" : "v.updated_at DESC,v.id";
      const paging = all ? "" : ` LIMIT ${query.pageSize} OFFSET ${(page - 1) * query.pageSize}`;
      const rows = await client.query<any>(`SELECT v.id,v.tenant_id,v.branch_id,v.normalized_registration registration,coalesce(v.vin::text,'') vin,v.attributes,v.status,v.resource_version,v.updated_at,coalesce(o.customer_id::text,'') owner_customer_id,coalesce(c.display_name,'') owner_name
        FROM workshopos.vehicle v LEFT JOIN LATERAL (SELECT customer_id FROM workshopos.vehicle_ownership_history WHERE vehicle_id=v.id ORDER BY effective_from DESC,recorded_at DESC LIMIT 1) o ON true LEFT JOIN workshopos.customer c ON c.id=o.customer_id AND c.tenant_id=v.tenant_id AND c.branch_id=v.branch_id
        WHERE ${condition} ORDER BY ${order}${paging}`, values);
      return { vehicles: rows.rows.map((row) => this.mapVehicle(row)), page: { page, pageSize: query.pageSize, totalCount, pageCount }, query: { ...query, page } };
    });
  }

  async createVehicle(membership: Membership, input: { branchId: string; registration: string; vin: string; make: string; model: string; ownerCustomerId: string }, idempotencyKey: string) {
    this.validateBranchAndKey(membership, input.branchId, idempotencyKey); const registration = this.normalizeRegistration(input.registration); const vin = input.vin.trim().toUpperCase();
    if (!registration && !vin) throw new ApiError(400, "VEHICLE_IDENTITY_REQUIRED"); if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) throw new ApiError(400, "VIN_INVALID");
    return this.inScope(membership, async (client) => {
      const requestHash = this.commandHash({ action: "create-vehicle", ...input, registration, vin }); const replay = await this.customerVehicleReplay(client, membership.tenantId, idempotencyKey, requestHash); if (replay) return replay;
      for (const identity of [registration && `registration:${registration}`, vin && `vin:${vin}`].filter(Boolean)) await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${membership.tenantId}:${input.branchId}:${identity}`]);
      const owner = await client.query<{ display_name: string }>("SELECT display_name FROM workshopos.customer WHERE id=$1 AND branch_id=$2 AND status='ACTIVE'", [input.ownerCustomerId, input.branchId]); if (!owner.rowCount) throw new ApiError(409, "OWNER_ASSOCIATION_INVALID");
      if (registration && (await client.query("SELECT 1 FROM workshopos.vehicle WHERE normalized_registration=$1 AND status='ACTIVE'", [registration])).rowCount) throw new ApiError(409, "DUPLICATE_REGISTRATION");
      if (vin && (await client.query("SELECT 1 FROM workshopos.vehicle WHERE vin=$1 AND status='ACTIVE'", [vin])).rowCount) throw new ApiError(409, "DUPLICATE_VIN");
      const id = randomUUID(); const auditReference = randomUUID();
      await client.query("INSERT INTO workshopos.vehicle(id,tenant_id,branch_id,registration,normalized_registration,vin,attributes) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb)", [id, membership.tenantId, input.branchId, registration || null, registration || null, vin || null, JSON.stringify({ make: input.make.trim(), model: input.model.trim() })]);
      await client.query("INSERT INTO workshopos.vehicle_ownership_history(id,tenant_id,branch_id,vehicle_id,customer_id,effective_from,reason,evidence,audit_reference) VALUES($1,$2,$3,$4,$5,current_date,'Initial owner','[]',$6)", [randomUUID(), membership.tenantId, input.branchId, id, input.ownerCustomerId, auditReference]);
      await this.identityAudit(client, membership, input.branchId, "vehicle.created", id, auditReference);
      const vehicle: VehicleRecord = { id, tenantId: membership.tenantId, branchId: input.branchId, registration, vin, make: input.make.trim(), model: input.model.trim(), ownerCustomerId: input.ownerCustomerId, ownerName: owner.rows[0].display_name, status: "ACTIVE", version: 1, updatedAt: new Date().toISOString() };
      const response = { vehicle, resourceVersion: 1, auditReference }; await this.storeCustomerVehicleReplay(client, membership.tenantId, idempotencyKey, requestHash, 201, response); return response;
    });
  }

  async getVehicle(membership: Membership, id: string): Promise<VehicleRecord> { return this.inScope(membership, async (client) => { const result = await client.query<any>(`SELECT v.id,v.tenant_id,v.branch_id,v.normalized_registration registration,coalesce(v.vin::text,'') vin,v.attributes,v.status,v.resource_version,v.updated_at,coalesce(o.customer_id::text,'') owner_customer_id,coalesce(c.display_name,'') owner_name FROM workshopos.vehicle v LEFT JOIN LATERAL (SELECT customer_id FROM workshopos.vehicle_ownership_history WHERE vehicle_id=v.id ORDER BY effective_from DESC,recorded_at DESC LIMIT 1) o ON true LEFT JOIN workshopos.customer c ON c.id=o.customer_id AND c.tenant_id=v.tenant_id AND c.branch_id=v.branch_id WHERE v.id=$1`, [id]); if (!result.rowCount) throw new ApiError(404,"VEHICLE_NOT_FOUND"); return this.mapVehicle(result.rows[0]); }); }

  async updateVehicle(membership: Membership, id: string, input: { registration: string; vin: string; make: string; model: string; ownerCustomerId: string; version: number }): Promise<VehicleRecord> {
    const registration = this.normalizeRegistration(input.registration); const vin = input.vin.trim().toUpperCase(); if (!registration && !vin) throw new ApiError(400, "VEHICLE_IDENTITY_REQUIRED");
    return this.inScope(membership, async (client) => {
      const current = await client.query<any>("SELECT branch_id,resource_version::text FROM workshopos.vehicle WHERE id=$1 AND status='ACTIVE' FOR UPDATE", [id]); if (!current.rowCount) throw new ApiError(404, "VEHICLE_NOT_FOUND"); if (Number(current.rows[0].resource_version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      const owner = await client.query<{ display_name: string }>("SELECT display_name FROM workshopos.customer WHERE id=$1 AND branch_id=$2 AND status='ACTIVE'", [input.ownerCustomerId, current.rows[0].branch_id]); if (!owner.rowCount) throw new ApiError(409, "OWNER_ASSOCIATION_INVALID");
      for (const identity of [registration && `registration:${registration}`, vin && `vin:${vin}`].filter(Boolean)) await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${membership.tenantId}:${current.rows[0].branch_id}:${identity}`]);
      if (registration && (await client.query("SELECT 1 FROM workshopos.vehicle WHERE normalized_registration=$1 AND id<>$2 AND status='ACTIVE'", [registration, id])).rowCount) throw new ApiError(409, "DUPLICATE_REGISTRATION");
      if (vin && (await client.query("SELECT 1 FROM workshopos.vehicle WHERE vin=$1 AND id<>$2 AND status='ACTIVE'", [vin, id])).rowCount) throw new ApiError(409, "DUPLICATE_VIN");
      const present = await client.query<{ customer_id: string }>("SELECT customer_id FROM workshopos.vehicle_ownership_history WHERE vehicle_id=$1 ORDER BY effective_from DESC,recorded_at DESC LIMIT 1", [id]);
      if (present.rows[0]?.customer_id !== input.ownerCustomerId && (await client.query("SELECT 1 FROM workshopos.vehicle_ownership_history WHERE vehicle_id=$1 AND effective_from=current_date", [id])).rowCount) throw new ApiError(409, "OWNERSHIP_DATE_CONFLICT");
      const updated = await client.query<any>("UPDATE workshopos.vehicle SET registration=$1,normalized_registration=$1,vin=$2,attributes=$3::jsonb,resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$4 AND resource_version=$5 RETURNING tenant_id,branch_id,status,resource_version::text,updated_at", [registration || null, vin || null, JSON.stringify({ make: input.make.trim(), model: input.model.trim() }), id, input.version]); if (!updated.rowCount) throw new ApiError(409, "VERSION_CONFLICT");
      if (present.rows[0]?.customer_id !== input.ownerCustomerId) await client.query("INSERT INTO workshopos.vehicle_ownership_history(id,tenant_id,branch_id,vehicle_id,customer_id,effective_from,reason,evidence,audit_reference) VALUES($1,$2,$3,$4,$5,current_date,'Owner changed through vehicle edit','[]',$6)", [randomUUID(), membership.tenantId, current.rows[0].branch_id, id, input.ownerCustomerId, randomUUID()]);
      await this.identityAudit(client, membership, current.rows[0].branch_id, "vehicle.updated", id);
      return { id, tenantId: membership.tenantId, branchId: current.rows[0].branch_id, registration, vin, make: input.make.trim(), model: input.model.trim(), ownerCustomerId: input.ownerCustomerId, ownerName: owner.rows[0].display_name, status: updated.rows[0].status, version: Number(updated.rows[0].resource_version), updatedAt: updated.rows[0].updated_at.toISOString() };
    });
  }

  async queryInventory(membership: Membership, query: ServerListQuery, all = false) {
    if (query.branchId && !membership.branchIds.includes(query.branchId)) throw new ApiError(403, "BRANCH_FORBIDDEN");
    return this.inScope(membership, async (client) => {
      const values: unknown[] = []; const where = ["i.active"];
      if (query.search) { values.push(`%${query.search}%`); where.push(`(i.sku ILIKE $${values.length} OR w.name ILIKE $${values.length})`); }
      if (query.branchId) { values.push(query.branchId); where.push(`i.branch_id=$${values.length}`); }
      const condition = where.join(" AND ");
      const from = `FROM workshopos.inventory_item i JOIN workshopos.inventory_warehouse w ON w.tenant_id=i.tenant_id AND w.branch_id=i.branch_id AND w.active LEFT JOIN workshopos.inventory_balance b ON b.tenant_id=i.tenant_id AND b.branch_id=i.branch_id AND b.item_id=i.id AND b.warehouse_id=w.id LEFT JOIN LATERAL (SELECT max(e.occurred_at) last_movement_at FROM workshopos.inventory_ledger_entry e WHERE e.tenant_id=i.tenant_id AND e.branch_id=i.branch_id AND e.item_id=i.id AND e.warehouse_id=w.id) movement ON true WHERE ${condition} GROUP BY i.tenant_id,i.branch_id,i.id,w.tenant_id,w.branch_id,w.id,movement.last_movement_at`;
      const projection = `SELECT i.id,i.branch_id,w.id warehouse_id,w.name warehouse_name,i.sku,i.base_uom,i.reorder_point::text,coalesce(sum(b.quantity_base),0)::text quantity,coalesce(sum(b.value_minor),0)::text value_minor,movement.last_movement_at ${from}`;
      const aggregate = (await client.query<{ count: string; quantity: string; value_minor: string; reorder_count: string }>(`SELECT count(*)::text count,coalesce(sum(quantity::numeric),0)::text quantity,coalesce(sum(value_minor::bigint),0)::text value_minor,count(*) FILTER (WHERE quantity::numeric <= reorder_point::numeric)::text reorder_count FROM (${projection}) inventory_rows`, values)).rows[0];
      const totalCount = Number(aggregate.count);
      const pageCount = Math.max(1, Math.ceil(totalCount / query.pageSize)); const page = all ? 1 : Math.min(query.page, pageCount);
      const order = query.sort === "updatedAt.asc" ? "movement.last_movement_at ASC NULLS FIRST,i.id,w.id" : query.sort === "summary.asc" ? "lower(i.sku) ASC,i.id,w.id" : query.sort === "summary.desc" ? "lower(i.sku) DESC,i.id,w.id" : "movement.last_movement_at DESC NULLS LAST,i.id,w.id";
      const paging = all ? "" : ` LIMIT ${query.pageSize} OFFSET ${(page - 1) * query.pageSize}`;
      const result = await client.query<any>(`${projection} ORDER BY ${order}${paging}`, values);
      const now = Date.now();
      const inventory: InventoryPosition[] = result.rows.map((row) => ({ id: row.id, branchId: row.branch_id, warehouseId: row.warehouse_id, warehouseName: row.warehouse_name, sku: row.sku, baseUom: row.base_uom, quantity: row.quantity, valueMinor: row.value_minor, reorderPoint: row.reorder_point, reorder: Number(row.quantity) <= Number(row.reorder_point), ...(row.last_movement_at ? { lastMovementAt: row.last_movement_at.toISOString(), ageDays: Math.max(0, Math.floor((now - row.last_movement_at.getTime()) / 86400000)) } : {}) }));
      return { inventory, analytics: { skuCount: totalCount, totalQuantity: aggregate.quantity, totalValueMinor: aggregate.value_minor, reorderCount: Number(aggregate.reorder_count) }, page: { page, pageSize: query.pageSize, totalCount, pageCount }, query: { ...query, page } };
    });
  }

  async stageInventoryImport(membership: Membership, input: { branchId: string; filename: string; rows: unknown }, idempotencyKey: string) {
    this.validateBranchAndKey(membership, input.branchId, idempotencyKey);
    const filename = input.filename.trim(); if (!filename) throw new ApiError(400, "IMPORT_FILENAME_REQUIRED");
    const normalized = normalizeInventoryImportRows(input.rows); if (!normalized.length || normalized.length > 1000) throw new ApiError(400, "IMPORT_ROWS_INVALID");
    return this.inScope(membership, async (client) => {
      const hash = this.commandHash({ action: "stage-inventory-import", branchId: input.branchId, filename, rows: normalized });
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${membership.tenantId}:inventory-stage:${idempotencyKey}`]);
      const prior = await client.query<any>("SELECT * FROM workshopos.inventory_import WHERE idempotency_key=$1", [idempotencyKey]);
      if (prior.rowCount) { if (prior.rows[0].request_hash !== hash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED"); return { import: this.mapInventoryImport(prior.rows[0]), replay: true }; }
      const skus = [...new Set(normalized.map((row) => row.sku).filter(Boolean))]; const warehouseCodes = [...new Set(normalized.map((row) => row.warehouseCode).filter(Boolean))];
      const items = await client.query<{ sku: string }>("SELECT sku FROM workshopos.inventory_item WHERE branch_id=$1 AND sku=ANY($2::text[]) AND active", [input.branchId, skus]);
      const warehouses = await client.query<{ name: string }>("SELECT name FROM workshopos.inventory_warehouse WHERE branch_id=$1 AND upper(name)=ANY($2::text[]) AND active", [input.branchId, warehouseCodes]);
      const knownSkus = new Set(items.rows.map((row) => row.sku.toUpperCase())); const knownWarehouses = new Set(warehouses.rows.map((row) => row.name.toUpperCase()));
      const rows: NormalizedInventoryImportRow[] = normalized.map((row) => ({ ...row, errors: [...row.errors, ...(!row.sku || knownSkus.has(row.sku) ? [] : ["SKU_NOT_FOUND"]), ...(!row.warehouseCode || knownWarehouses.has(row.warehouseCode) ? [] : ["WAREHOUSE_NOT_FOUND"])] }));
      const valid = rows.filter((row) => !row.errors.length); const manifest = buildInventoryErrorManifest(rows);
      const summary = { totalRows: rows.length, validRows: valid.length, invalidRows: rows.length - valid.length, quantity: formatInventoryQuantity(valid.reduce((sum, row) => sum + inventoryQuantityUnits(row.quantity), 0n)), valueMinor: valid.reduce((sum, row) => sum + BigInt(row.valueMinor), 0n).toString() };
      const result = await client.query<any>(`INSERT INTO workshopos.inventory_import(id,tenant_id,branch_id,filename,idempotency_key,request_hash,status,rows,summary,error_manifest,staged_by_membership_id) VALUES($1,$2,$3,$4,$5,$6,'STAGED',$7::jsonb,$8::jsonb,$9,$10) RETURNING *`, [randomUUID(), membership.tenantId, input.branchId, filename, idempotencyKey, hash, JSON.stringify(rows), JSON.stringify(summary), manifest.rowCount ? manifest.content : null, this.membershipId(membership)]);
      return { import: this.mapInventoryImport(result.rows[0]), replay: false };
    });
  }

  async getInventoryImport(membership: Membership, id: string) { return this.inScope(membership, async (client) => { const result = await client.query<any>("SELECT * FROM workshopos.inventory_import WHERE id=$1", [id]); if (!result.rowCount) throw new ApiError(404, "INVENTORY_IMPORT_NOT_FOUND"); return this.mapInventoryImport(result.rows[0]); }); }

  async receiveInventory(membership: Membership, input: { branchId: string; warehouseId: string; itemId: string; quantity: string; valueMinor: string; reason: string }, idempotencyKey: string) {
    this.validateBranchAndKey(membership, input.branchId, idempotencyKey); if (!input.reason.trim()) throw new ApiError(400, "REASON_REQUIRED");
    if (!isValidInventoryQuantity(input.quantity)) throw new ApiError(400, "QUANTITY_INVALID"); if (!isValidInventoryValueMinor(input.valueMinor)) throw new ApiError(400, "VALUE_MINOR_INVALID");
    return this.inScope(membership, async (client) => {
      const hash = this.commandHash({ action: "inventory-receipt", ...input, reason: input.reason.trim() }); await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${membership.tenantId}:inventory-receipt:${idempotencyKey}`]);
      const prior = await client.query<any>("SELECT command_fingerprint,response_body FROM workshopos.inventory_command_receipt WHERE idempotency_key=$1", [idempotencyKey]); if (prior.rowCount) { if (prior.rows[0].command_fingerprint !== hash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED"); return { ...prior.rows[0].response_body, replay: true }; }
      const valid = await client.query("SELECT 1 FROM workshopos.inventory_item i JOIN workshopos.inventory_warehouse w ON w.tenant_id=i.tenant_id AND w.branch_id=i.branch_id WHERE i.id=$1 AND w.id=$2 AND i.branch_id=$3 AND i.active AND w.active", [input.itemId, input.warehouseId, input.branchId]); if (!valid.rowCount) throw new ApiError(404, "INVENTORY_POSITION_NOT_FOUND");
      const batchId = await this.postInventoryReceipt(client, membership, { ...input, sourceType: "AUTHORIZED_RECEIPT", sourceId: idempotencyKey, reason: input.reason.trim() }); const response = { ledgerBatchId: batchId, quantity: input.quantity, valueMinor: input.valueMinor };
      await client.query("INSERT INTO workshopos.inventory_command_receipt(tenant_id,branch_id,idempotency_key,command_fingerprint,response_status,response_body) VALUES($1,$2,$3,$4,201,$5::jsonb)", [membership.tenantId, input.branchId, idempotencyKey, hash, JSON.stringify(response)]); return { ...response, replay: false };
    });
  }

  async downloadInventoryImportErrors(membership: Membership, id: string) { return this.inScope(membership, async (client) => { const result = await client.query<{ error_manifest: Buffer | null }>("SELECT error_manifest FROM workshopos.inventory_import WHERE id=$1", [id]); if (!result.rowCount) throw new ApiError(404, "INVENTORY_IMPORT_NOT_FOUND"); if (!result.rows[0].error_manifest) throw new ApiError(409, "IMPORT_HAS_NO_ERRORS"); return { content: result.rows[0].error_manifest, filename: `inventory-import-${id}-errors.csv`, mimeType: "text/csv; charset=utf-8" }; }); }

  async commitInventoryImport(membership: Membership, id: string, input: { version: number }, idempotencyKey: string) {
    if (!idempotencyKey.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    return this.inScope(membership, async (client) => {
      const hash = this.commandHash({ action: "commit-inventory-import", id, version: input.version });
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${membership.tenantId}:inventory-commit:${id}`]);
      const prior = await client.query<{ request_hash: string; response: any }>("SELECT request_hash,response FROM workshopos.inventory_import_commit WHERE idempotency_key=$1", [idempotencyKey]);
      if (prior.rowCount) { if (prior.rows[0].request_hash !== hash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED"); return { ...prior.rows[0].response, replay: true }; }
      const found = await client.query<any>("SELECT * FROM workshopos.inventory_import WHERE id=$1 FOR UPDATE", [id]); if (!found.rowCount) throw new ApiError(404, "INVENTORY_IMPORT_NOT_FOUND"); const staged = found.rows[0];
      if (staged.status !== "STAGED" || Number(staged.resource_version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT"); if (Number(staged.summary.invalidRows) > 0) throw new ApiError(409, "IMPORT_VALIDATION_FAILED");
      const batchIds: string[] = [];
      for (const row of staged.rows as NormalizedInventoryImportRow[]) {
        const item = await client.query<any>("SELECT id FROM workshopos.inventory_item WHERE branch_id=$1 AND sku=$2 AND active", [staged.branch_id, row.sku]); const warehouse = await client.query<any>("SELECT id FROM workshopos.inventory_warehouse WHERE branch_id=$1 AND upper(name)=$2 AND active", [staged.branch_id, row.warehouseCode]);
        if (!item.rowCount || !warehouse.rowCount) throw new ApiError(409, "IMPORT_REFERENCE_CHANGED");
        batchIds.push(await this.postInventoryReceipt(client, membership, { branchId: staged.branch_id, warehouseId: warehouse.rows[0].id, itemId: item.rows[0].id, quantity: row.quantity, valueMinor: row.valueMinor, sourceType: "INVENTORY_IMPORT", sourceId: `${id}:${row.rowNumber}`, reason: `Inventory import ${staged.filename}` }));
      }
      const effects = await client.query<{ batches: string; quantity: string; value_minor: string }>("SELECT count(DISTINCT batch_id)::text batches,coalesce(sum(quantity_base),0)::text quantity,coalesce(sum(value_minor),0)::text value_minor FROM workshopos.inventory_ledger_entry WHERE batch_id=ANY($1::uuid[]) AND account='LOCATION_STOCK'", [batchIds]);
      const reconciliation = { ledgerBatches: Number(effects.rows[0].batches), quantity: effects.rows[0].quantity, valueMinor: effects.rows[0].value_minor };
      if (reconciliation.ledgerBatches !== staged.rows.length || inventoryQuantityUnits(reconciliation.quantity) !== inventoryQuantityUnits(staged.summary.quantity) || BigInt(reconciliation.valueMinor) !== BigInt(staged.summary.valueMinor)) throw new ApiError(500, "IMPORT_RECONCILIATION_FAILED");
      const updated = await client.query<any>("UPDATE workshopos.inventory_import SET status='COMMITTED',committed_by_membership_id=$1,committed_at=transaction_timestamp(),resource_version=resource_version+1,summary=summary || $2::jsonb WHERE id=$3 RETURNING *", [this.membershipId(membership), JSON.stringify({ reconciliation }), id]);
      const response = { import: this.mapInventoryImport(updated.rows[0]), reconciliation }; await client.query("INSERT INTO workshopos.inventory_import_commit(tenant_id,import_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4,$5::jsonb)", [membership.tenantId, id, idempotencyKey, hash, JSON.stringify(response)]); return { ...response, replay: false };
    });
  }

  private async postInventoryReceipt(client: PoolClient, membership: Membership, input: { branchId: string; warehouseId: string; itemId: string; quantity: string; valueMinor: string; sourceType: string; sourceId: string; reason: string }) {
    const batchId = randomUUID(); const audit = randomUUID(); const actor = this.membershipId(membership);
    await client.query("INSERT INTO workshopos.inventory_ledger_batch(tenant_id,branch_id,id,source_type,source_id,actor_membership_id,reason,audit_reference,occurred_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,transaction_timestamp())", [membership.tenantId, input.branchId, batchId, input.sourceType, input.sourceId, actor, input.reason, audit]);
    await client.query(`INSERT INTO workshopos.inventory_ledger_entry(tenant_id,branch_id,batch_id,sequence,account,warehouse_id,item_id,quantity_base,value_minor,source_type,source_id,actor_membership_id,reason,audit_reference,occurred_at) VALUES($1,$2,$3,1,'LOCATION_STOCK',$4,$5,$6,$7,$8,$9,$10,$11,$12,transaction_timestamp()),($1,$2,$3,2,'INVENTORY_CONTROL',NULL,$5,-$6,-$7,$8,$9,$10,$11,$12,transaction_timestamp())`, [membership.tenantId, input.branchId, batchId, input.warehouseId, input.itemId, input.quantity, input.valueMinor, input.sourceType, input.sourceId, actor, input.reason, audit]);
    await client.query(`INSERT INTO workshopos.inventory_balance(tenant_id,branch_id,id,warehouse_id,item_id,quantity_base,value_minor) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (tenant_id,branch_id,warehouse_id,bin_id,item_id,lot_id,remnant_id) DO UPDATE SET quantity_base=workshopos.inventory_balance.quantity_base+EXCLUDED.quantity_base,value_minor=workshopos.inventory_balance.value_minor+EXCLUDED.value_minor,resource_version=workshopos.inventory_balance.resource_version+1`, [membership.tenantId, input.branchId, randomUUID(), input.warehouseId, input.itemId, input.quantity, input.valueMinor]); return batchId;
  }

  private mapInventoryImport(row: any): InventoryImportRecord { return { id: row.id, branchId: row.branch_id, filename: row.filename, status: row.status, version: Number(row.resource_version), summary: row.summary, stagedAt: row.staged_at.toISOString(), ...(row.committed_at ? { committedAt: row.committed_at.toISOString() } : {}), ...(row.summary?.reconciliation ? { reconciliation: row.summary.reconciliation } : {}) }; }

  private normalizeMobile(value: string) { return value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""); }
  private normalizeRegistration(value: string) { return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, ""); }
  private commandHash(value: unknown) { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
  private validateBranchAndKey(membership: Membership, branchId: string, key: string) { if (!membership.branchIds.includes(branchId)) throw new ApiError(403, "BRANCH_FORBIDDEN"); if (!key.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED"); }
  private async customerVehicleReplay(client: PoolClient, tenantId: string, key: string, hash: string): Promise<any | undefined> { await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${tenantId}:identity:${key}`]); const result = await client.query<any>("SELECT command_fingerprint,response_body FROM workshopos.customer_vehicle_idempotency WHERE idempotency_key=$1", [key]); if (!result.rowCount) return undefined; if (result.rows[0].command_fingerprint !== hash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED"); return result.rows[0].response_body; }
  private async storeCustomerVehicleReplay(client: PoolClient, tenantId: string, key: string, hash: string, status: number, response: unknown) { await client.query("INSERT INTO workshopos.customer_vehicle_idempotency(tenant_id,idempotency_key,command_fingerprint,response_status,response_body) VALUES($1,$2,$3,$4,$5::jsonb)", [tenantId, key, hash, status, JSON.stringify(response)]); }
  private async identityAudit(client: PoolClient, membership: Membership, branchId: string, action: string, id: string, reference = randomUUID()) { await client.query("INSERT INTO workshopos.audit_entry(id,tenant_id,branch_id,subject_id,action,detail) VALUES($1,$2,$3,$4,$5,$6::jsonb)", [reference, membership.tenantId, branchId, this.actorId(membership), action, JSON.stringify({ resourceId: id })]); return reference; }
  private mapCustomer(row: any): CustomerRecord { return { id: row.id, tenantId: row.tenant_id, branchId: row.branch_id, displayName: row.display_name, mobile: row.mobile, email: row.email, status: row.status, version: Number(row.resource_version), updatedAt: row.updated_at.toISOString() }; }
  private mapVehicle(row: any): VehicleRecord { return { id: row.id, tenantId: row.tenant_id, branchId: row.branch_id, registration: row.registration ?? "", vin: row.vin ?? "", make: row.attributes?.make ?? "", model: row.attributes?.model ?? "", ownerCustomerId: row.owner_customer_id, ownerName: row.owner_name, status: row.status, version: Number(row.resource_version), updatedAt: row.updated_at.toISOString() }; }

  private actorId(membership: Membership): string {
    const actor = membership.subject ?? membership.identitySubject;
    if (!actor) throw new ApiError(401, "AUTHENTICATION_REQUIRED");
    return actor;
  }

  private membershipId(membership: Membership): string { return membership.id ?? this.actorId(membership); }

  private mapExportJob(row: any): ListExportJob {
    return { id: row.id, screenKey: row.screen_key, format: row.format, status: row.status, ...(row.row_count === null ? {} : { rowCount: row.row_count }),
      ...(row.filename ? { filename: row.filename } : {}), ...(row.mime_type ? { mimeType: row.mime_type } : {}), createdAt: row.created_at.toISOString(),
      ...(row.completed_at ? { completedAt: row.completed_at.toISOString() } : {}) };
  }

  async updateWorkItem(membership: Membership, id: string, input: { summary: string; version: number }): Promise<WorkItem> {
    const summary = input.summary.trim();
    if (!summary) throw new ApiError(400, "SUMMARY_REQUIRED");
    if (!Number.isSafeInteger(input.version) || input.version < 1) throw new ApiError(400, "VERSION_REQUIRED");
    return this.inScope(membership, async (client) => {
      const visible = await client.query<{ version: string }>(
        "SELECT version::text FROM workshopos.work_item WHERE id = $1",
        [id],
      );
      if (!visible.rowCount) throw new ApiError(404, "WORK_ITEM_NOT_FOUND");
      if (Number(visible.rows[0].version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      const result = await client.query<{
        id: string; tenant_id: string; branch_id: string; summary: string; version: string;
      }>(
        "UPDATE workshopos.work_item SET summary = $1, version = version + 1, updated_at = transaction_timestamp() WHERE id = $2 AND version = $3 RETURNING id, tenant_id, branch_id, summary, version::text",
        [summary, id, input.version],
      );
      if (!result.rowCount) throw new ApiError(409, "VERSION_CONFLICT");
      const row = result.rows[0];
      return { id: row.id, tenantId: row.tenant_id, branchId: row.branch_id, summary: row.summary, version: Number(row.version), updatedAt: new Date().toISOString() };
    });
  }

  async archiveWorkItem(
    membership: Membership,
    id: string,
    input: { reason: string; version: number },
    idempotencyKey: string,
  ) {
    const reason = input.reason.trim();
    if (!reason) throw new ApiError(400, "REASON_REQUIRED");
    if (!idempotencyKey.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    if (!Number.isSafeInteger(input.version) || input.version < 1) throw new ApiError(400, "VERSION_REQUIRED");
    return this.inScope(membership, async (client) => {
      const requestHash = createHash("sha256").update(JSON.stringify({ action: "archive", id, reason, version: input.version })).digest("hex");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
        `${membership.tenantId}:${idempotencyKey}`,
      ]);
      const target = await client.query<{ version: string; archived_at: Date | null; branch_id: string }>(
        "SELECT version::text, archived_at, branch_id::text FROM workshopos.work_item WHERE id = $1 FOR UPDATE",
        [id],
      );
      if (!target.rowCount) throw new ApiError(404, "WORK_ITEM_NOT_FOUND");
      const replay = await client.query<{ request_hash: string | null; response: StoredResponse }>(
        "SELECT request_hash, response FROM workshopos.idempotency_result WHERE tenant_id = $1 AND idempotency_key = $2 FOR UPDATE",
        [membership.tenantId, idempotencyKey],
      );
      if (replay.rowCount) {
        if (replay.rows[0].request_hash && replay.rows[0].request_hash !== requestHash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
        return { status: 200, body: replay.rows[0].response } as const;
      }
      if (target.rows[0].archived_at) throw new ApiError(404, "WORK_ITEM_NOT_FOUND");
      if (Number(target.rows[0].version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      const auditReference = randomUUID();
      const actor = membership.subject ?? membership.identitySubject ?? "";
      const updated = await client.query<{
        id: string; tenant_id: string; branch_id: string; summary: string; version: string;
      }>(
        "UPDATE workshopos.work_item SET archived_at=transaction_timestamp(), archived_reason=$1, archived_by=$2, version=version+1, updated_at=transaction_timestamp() WHERE id=$3 AND version=$4 RETURNING id, tenant_id, branch_id, summary, version::text",
        [reason, actor, id, input.version],
      );
      if (!updated.rowCount) throw new ApiError(409, "VERSION_CONFLICT");
      const row = updated.rows[0];
      const workItem: WorkItem = { id: row.id, tenantId: row.tenant_id, branchId: row.branch_id, summary: row.summary, version: Number(row.version), updatedAt: new Date().toISOString() };
      const response: StoredResponse = { workItem, resourceVersion: workItem.version, auditReference };
      await client.query(
        "INSERT INTO workshopos.audit_entry(id,tenant_id,branch_id,subject_id,action,detail) VALUES($1,$2,$3,$4,'work-item.archived',$5::jsonb)",
        [auditReference, membership.tenantId, target.rows[0].branch_id, actor, JSON.stringify({ workItemId: id, reason })],
      );
      await client.query(
        "INSERT INTO workshopos.idempotency_result(tenant_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4::jsonb)",
        [membership.tenantId, idempotencyKey, requestHash, JSON.stringify(response)],
      );
      return { status: 200, body: response } as const;
    });
  }

  async resolveMembership(identitySubject: string): Promise<AuthenticatedMembership | undefined> {
    const tenant = await this.pool.query<{ tenant_id: string | null }>(
      "SELECT workshopos.resolve_membership_tenant($1)::text AS tenant_id",
      [identitySubject],
    );
    const tenantId = tenant.rows[0]?.tenant_id;
    if (!tenantId) return undefined;
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT set_config('app.tenant_id', $1, true), set_config('app.branch_ids', '', true)", [tenantId]);
      const membershipResult = await client.query<{
        id: string; identity_subject: string; display_name: string; email: string; status: "INVITED" | "ACTIVE" | "SUSPENDED" | "ARCHIVED"; version: string;
      }>("SELECT id, identity_subject, display_name, email, status, version::text FROM workshopos.membership WHERE identity_subject = $1 AND active AND status IN ('INVITED', 'ACTIVE')", [identitySubject]);
      if (!membershipResult.rowCount) { await client.query("ROLLBACK"); return undefined; }
      const membership = membershipResult.rows[0];
      if (membership.status === "INVITED") {
        await client.query("UPDATE workshopos.membership SET status='ACTIVE', updated_at=transaction_timestamp(), version=version+1 WHERE id=$1", [membership.id]);
        membership.status = "ACTIVE";
        membership.version = String(Number(membership.version) + 1);
      }
      const roleResult = await client.query<{ id: string; name: string; permissions: string[] }>(
        "SELECT r.id, r.name, r.permissions FROM workshopos.membership_role mr JOIN workshopos.role_template r ON r.tenant_id=mr.tenant_id AND r.id=mr.role_id WHERE mr.membership_id=$1 AND r.active ORDER BY r.name",
        [membership.id],
      );
      const branchIds = (await client.query<{ branch_id: string }>(
        "SELECT branch_id FROM workshopos.membership_branch WHERE membership_id=$1 ORDER BY branch_id", [membership.id],
      )).rows.map((row) => row.branch_id);
      await client.query("SELECT set_config('app.branch_ids', $1, true)", [branchIds.join(",")]);
      const branches = branchIds.length ? (await client.query<BranchOption>(
        "SELECT id, name FROM workshopos.branch WHERE id = ANY($1::uuid[]) ORDER BY name", [branchIds],
      )).rows : [];
      const warehouseIds = (await client.query<{ warehouse_id: string }>("SELECT warehouse_id FROM workshopos.membership_inventory_warehouse WHERE membership_id=$1 ORDER BY warehouse_id", [membership.id])).rows.map((row) => row.warehouse_id);
      const overrides = await client.query<{ permission: string; effect: "ALLOW" | "DENY" }>(
        "SELECT permission, effect FROM workshopos.membership_permission WHERE membership_id=$1", [membership.id],
      );
      await client.query("COMMIT");
      const rolePermissions = roleResult.rows.flatMap((role) => Array.isArray(role.permissions) ? role.permissions : []);
      const denied = new Set(overrides.rows.filter((item) => item.effect === "DENY").map((item) => item.permission));
      const allowed = overrides.rows.filter((item) => item.effect === "ALLOW").map((item) => item.permission);
      return {
        id: membership.id, identitySubject: membership.identity_subject, tenantId,
        displayName: membership.display_name, email: membership.email, status: membership.status,
        roleIds: roleResult.rows.map((role) => role.id), roles: roleResult.rows,
        branchIds, branches,
        warehouseIds,
        permissions: [...new Set([...rolePermissions, ...allowed])].filter((permission) => !denied.has(permission)),
        version: Number(membership.version),
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
  }

  async tenantSummary(actor: AuthenticatedMembership) {
    return this.inScope(actor, async (client) => {
      const result = await client.query<{ id: string; name: string }>("SELECT tenant_id AS id, legal_name AS name FROM workshopos.tenant");
      return result.rows[0];
    });
  }

  async globalSearch(actor: Membership, rawQuery: string): Promise<{ records: Array<{ kind: "work-item" | "tenant-user"; id: string; label: string }> }> {
    const query = rawQuery.trim();
    if (query.length < 2) return { records: [] };
    return this.inScope(actor, async (client) => {
      const records: Array<{ kind: "work-item" | "tenant-user"; id: string; label: string }> = [];
      if (actor.permissions?.includes("work-item.read")) {
        const workItems = await client.query<{ id: string; summary: string }>(
          "SELECT id,summary FROM workshopos.work_item WHERE archived_at IS NULL AND summary ILIKE $1 ORDER BY updated_at DESC,id LIMIT 10",
          [`%${query}%`],
        );
        records.push(...workItems.rows.map((row) => ({ kind: "work-item" as const, id: row.id, label: row.summary })));
      }
      if (actor.permissions?.includes("membership.manage") && "identitySubject" in actor) {
        const users = await client.query<{ id: string; display_name: string }>(
          "SELECT m.id,m.display_name FROM workshopos.membership m WHERE m.active AND m.status<>'ARCHIVED' AND (m.display_name ILIKE $1 OR m.email ILIKE $1) AND EXISTS (SELECT 1 FROM workshopos.membership_branch mb WHERE mb.membership_id=m.id AND mb.branch_id=ANY(workshopos.authorized_branch_ids())) ORDER BY lower(m.display_name),m.id LIMIT 10",
          [`%${query}%`],
        );
        records.push(...users.rows.map((row) => ({ kind: "tenant-user" as const, id: row.id, label: row.display_name })));
      }
      return { records };
    });
  }

  async roleDirectory(actor: AuthenticatedMembership): Promise<RoleDirectory> {
    return this.inScope(actor, async (client) => ({
      roles: (await client.query<{
        id: string; name: string; description: string; permissions: string[]; system_template: boolean;
        active: boolean; version: string; updated_at: Date;
      }>("SELECT id,name,description,permissions,system_template,active,version::text,updated_at FROM workshopos.role_template WHERE active ORDER BY system_template DESC,lower(name),id")).rows.map((row) => this.mapManagedRole(row)),
      catalog: DEFAULT_PERMISSION_CATALOG,
    }));
  }

  async createRole(actor: AuthenticatedMembership, input: RoleInput, idempotencyKey: string) {
    return this.inScope(actor, async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${actor.tenantId}:role:${idempotencyKey}`]);
      const requestHash = this.roleRequestHash("CREATE", undefined, input);
      const replay = await this.replayRoleCommand(client, idempotencyKey, requestHash);
      if (replay) return { role: replay, replay: true };
      const duplicate = await client.query("SELECT 1 FROM workshopos.role_template WHERE lower(name)=lower($1)", [input.name]);
      if (duplicate.rowCount) throw new ApiError(409, "ROLE_NAME_EXISTS");
      const id = randomUUID();
      const row = (await client.query<{
        id: string; name: string; description: string; permissions: string[]; system_template: boolean;
        active: boolean; version: string; updated_at: Date;
      }>("INSERT INTO workshopos.role_template(id,tenant_id,name,description,permissions,system_template) VALUES($1,$2,$3,$4,$5::jsonb,false) RETURNING id,name,description,permissions,system_template,active,version::text,updated_at", [
        id, actor.tenantId, input.name, input.description, JSON.stringify(input.permissions),
      ])).rows[0];
      const role = this.mapManagedRole(row);
      await this.insertRoleVersion(client, actor, role, "Role created");
      await this.storeRoleCommand(client, actor.tenantId, idempotencyKey, requestHash, role);
      return { role, replay: false };
    });
  }

  async updateRole(actor: AuthenticatedMembership, id: string, input: RoleInput & { version: number }) {
    return this.inScope(actor, async (client) => {
      await this.lockAdminInvariant(client, actor.tenantId);
      const current = await this.lockRole(client, id);
      if (current.system_template) throw new ApiError(409, "PROTECTED_ROLE");
      if (!current.active) throw new ApiError(404, "ROLE_NOT_FOUND");
      if (Number(current.version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      if (current.permissions.includes("membership.manage") && !input.permissions.includes("membership.manage")) {
        await this.protectFinalAdminAfterRoleChange(client, id);
      }
      const duplicate = await client.query("SELECT 1 FROM workshopos.role_template WHERE id<>$1 AND lower(name)=lower($2)", [id, input.name]);
      if (duplicate.rowCount) throw new ApiError(409, "ROLE_NAME_EXISTS");
      const row = (await client.query<{
        id: string; name: string; description: string; permissions: string[]; system_template: boolean;
        active: boolean; version: string; updated_at: Date;
      }>("UPDATE workshopos.role_template SET name=$1,description=$2,permissions=$3::jsonb,version=version+1 WHERE id=$4 AND version=$5 RETURNING id,name,description,permissions,system_template,active,version::text,updated_at", [
        input.name, input.description, JSON.stringify(input.permissions), id, input.version,
      ])).rows[0];
      if (!row) throw new ApiError(409, "VERSION_CONFLICT");
      const role = this.mapManagedRole(row);
      await this.insertRoleVersion(client, actor, role, "Role revised");
      return role;
    });
  }

  async archiveRole(actor: AuthenticatedMembership, id: string, input: { version: number; reason: string }, idempotencyKey: string) {
    return this.inScope(actor, async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${actor.tenantId}:role:${idempotencyKey}`]);
      const requestHash = this.roleRequestHash("ARCHIVE", id, input);
      const replay = await this.replayRoleCommand(client, idempotencyKey, requestHash);
      if (replay) return { role: replay, replay: true };
      const current = await this.lockRole(client, id);
      if (current.system_template) throw new ApiError(409, "PROTECTED_ROLE");
      if (!current.active) throw new ApiError(404, "ROLE_NOT_FOUND");
      if (Number(current.version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      if ((await client.query("SELECT 1 FROM workshopos.membership_role WHERE role_id=$1 LIMIT 1", [id])).rowCount) {
        throw new ApiError(409, "ROLE_IN_USE");
      }
      const row = (await client.query<{
        id: string; name: string; description: string; permissions: string[]; system_template: boolean;
        active: boolean; version: string; updated_at: Date;
      }>("UPDATE workshopos.role_template SET active=false,version=version+1 WHERE id=$1 AND version=$2 RETURNING id,name,description,permissions,system_template,active,version::text,updated_at", [id, input.version])).rows[0];
      if (!row) throw new ApiError(409, "VERSION_CONFLICT");
      const role = this.mapManagedRole(row);
      await this.insertRoleVersion(client, actor, role, input.reason);
      await this.storeRoleCommand(client, actor.tenantId, idempotencyKey, requestHash, role);
      return { role, replay: false };
    });
  }

  async directory(actor: AuthenticatedMembership, query: UserListQuery = DEFAULT_USER_LIST_QUERY, all = false): Promise<UserDirectory> {
    if (query.branchId && !actor.branchIds.includes(query.branchId)) throw new ApiError(403, "BRANCH_FORBIDDEN");
    return this.inScope(actor, async (client) => {
      const roles = (await client.query<RoleOption>("SELECT id, name, permissions FROM workshopos.role_template WHERE active ORDER BY name")).rows;
      const branches = (await client.query<BranchOption>("SELECT id, name FROM workshopos.branch ORDER BY name")).rows;
      const values: unknown[] = [];
      const where = ["m.status <> 'ARCHIVED'"];
      if (query.search) { values.push(`%${query.search}%`); where.push(`(m.display_name ILIKE $${values.length} OR m.email ILIKE $${values.length})`); }
      if (query.status) { values.push(query.status); where.push(`m.status = $${values.length}`); }
      if (query.roleId) { values.push(query.roleId); where.push(`EXISTS (SELECT 1 FROM workshopos.membership_role fmr WHERE fmr.membership_id=m.id AND fmr.role_id=$${values.length})`); }
      if (query.branchId) { values.push(query.branchId); where.push(`EXISTS (SELECT 1 FROM workshopos.membership_branch fmb WHERE fmb.membership_id=m.id AND fmb.branch_id=$${values.length})`); }
      const condition = where.join(" AND ");
      const totalCount = Number((await client.query<{ count: string }>(`SELECT count(*)::text AS count FROM workshopos.membership m WHERE ${condition}`, values)).rows[0].count);
      const pageCount = Math.max(1, Math.ceil(totalCount / query.pageSize));
      const page = all ? 1 : Math.min(query.page, pageCount);
      const orderBy: Record<UserListQuery["sort"], string> = {
        "updatedAt.desc": "m.updated_at DESC, m.id ASC", "updatedAt.asc": "m.updated_at ASC, m.id ASC",
        "name.asc": "lower(m.display_name) ASC, m.id ASC", "name.desc": "lower(m.display_name) DESC, m.id ASC",
        "email.asc": "lower(m.email) ASC, m.id ASC", "email.desc": "lower(m.email) DESC, m.id ASC",
      };
      const paging = all ? "" : ` LIMIT ${query.pageSize} OFFSET ${(page - 1) * query.pageSize}`;
      const rows = await client.query<{
        id: string; display_name: string; email: string; status: ManagedUser["status"]; version: string;
        invited_at: Date | null; last_invited_at: Date | null; created_at: Date; updated_at: Date;
      }>(`SELECT m.id, m.display_name, m.email, m.status, m.version::text, m.invited_at, m.last_invited_at, m.created_at, m.updated_at FROM workshopos.membership m WHERE ${condition} ORDER BY ${orderBy[query.sort]}${paging}`, values);
      const users: ManagedUser[] = [];
      for (const row of rows.rows) users.push(await this.hydrateManagedUser(client, row, roles, branches));
      return { users, roles, branches, page: { page, pageSize: query.pageSize, totalCount, pageCount }, query: { ...query, page } };
    });
  }

  async create(actor: AuthenticatedMembership, input: CreateMembership, idempotencyKey: string) {
    return this.inScope(actor, async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [`${actor.tenantId}:membership:${idempotencyKey}`]);
      const requestHash = createHash("sha256").update(JSON.stringify({
        name: input.name, email: input.email, roleIds: input.roleIds, branchIds: input.branchIds,
        identitySubject: input.identitySubject, cognitoUsername: input.cognitoUsername,
      })).digest("hex");
      const replay = await client.query<{ request_hash: string; response: { user: ManagedUser } }>(
        "SELECT request_hash, response FROM workshopos.membership_command WHERE idempotency_key=$1", [idempotencyKey],
      );
      if (replay.rowCount) {
        if (replay.rows[0].request_hash !== requestHash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
        return { user: replay.rows[0].response.user, replay: true };
      }
      const duplicate = await client.query("SELECT 1 FROM workshopos.membership WHERE lower(email)=lower($1)", [input.email]);
      if (duplicate.rowCount) throw new ApiError(409, "EMAIL_EXISTS");
      const quota = await client.query<{ allowed: number; used: string }>(
        "SELECT coalesce((quotas->>'users')::integer, 2147483647) AS allowed, (SELECT count(*)::text FROM workshopos.membership WHERE active) AS used FROM workshopos.tenant",
      );
      if (Number(quota.rows[0].used) >= quota.rows[0].allowed) throw new ApiError(409, "QUOTA_EXCEEDED");
      const id = randomUUID();
      await client.query(
        "INSERT INTO workshopos.membership(id, tenant_id, identity_subject, email, display_name, status, cognito_username, active, invited_at, last_invited_at) VALUES($1,$2,$3,$4,$5,$6,$7,true,transaction_timestamp(),transaction_timestamp())",
        [id, actor.tenantId, input.identitySubject, input.email, input.name, input.status, input.cognitoUsername],
      );
      await this.replaceAssignments(client, actor.tenantId, id, input.roleIds, input.branchIds);
      const roles = (await client.query<RoleOption>("SELECT id, name, permissions FROM workshopos.role_template WHERE active ORDER BY name")).rows;
      const branches = (await client.query<BranchOption>("SELECT id, name FROM workshopos.branch ORDER BY name")).rows;
      const row = (await client.query<any>("SELECT id, display_name, email, status, version::text, invited_at, last_invited_at, created_at, updated_at FROM workshopos.membership WHERE id=$1", [id])).rows[0];
      const user = await this.hydrateManagedUser(client, row, roles, branches);
      await client.query("INSERT INTO workshopos.membership_command(tenant_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4::jsonb)", [actor.tenantId, idempotencyKey, requestHash, JSON.stringify({ user })]);
      return { user, replay: false };
    });
  }

  async update(actor: AuthenticatedMembership, id: string, input: UpdateMembership) {
    return this.inScope(actor, async (client) => {
      await this.lockAdminInvariant(client, actor.tenantId);
      const target = await this.lockTarget(client, id);
      if (Number(target.version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      if (id === actor.id && !await this.hasManageRole(client, input.roleIds)) throw new ApiError(409, "SELF_ACCESS_FORBIDDEN");
      await this.protectFinalAdmin(client, id, input.roleIds);
      const updated = await client.query("UPDATE workshopos.membership SET display_name=$1, version=version+1, updated_at=transaction_timestamp() WHERE id=$2 AND version=$3", [input.name, id, input.version]);
      if (!updated.rowCount) throw new ApiError(409, "VERSION_CONFLICT");
      await this.replaceAssignments(client, actor.tenantId, id, input.roleIds, input.branchIds);
      const user = await this.userById(client, id);
      await this.auditAdmin(client, actor, id, "UPDATED", "User profile and assignments updated", user.version);
      return user;
    });
  }

  async archive(actor: AuthenticatedMembership, id: string, input: { version: number; reason: string }, idempotencyKey: string) {
    return this.inScope(actor, async (client) => {
      const requestHash = this.adminRequestHash("ARCHIVED", id, input);
      const replay = await this.replayAdminCommand(client, idempotencyKey, requestHash);
      if (replay) return { ...replay, replay: true };
      await this.lockAdminInvariant(client, actor.tenantId);
      const target = await this.lockTarget(client, id);
      if (id === actor.id) throw new ApiError(409, "SELF_ARCHIVE_FORBIDDEN");
      if (Number(target.version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      await this.protectFinalAdmin(client, id, []);
      await client.query("UPDATE workshopos.membership SET active=false,status='ARCHIVED',archived_at=transaction_timestamp(),archived_reason=$1,updated_at=transaction_timestamp(),version=version+1 WHERE id=$2", [input.reason, id]);
      const result = { user: await this.userById(client, id, true), cognitoUsername: String(target.cognito_username) };
      await this.auditAdmin(client, actor, id, "ARCHIVED", input.reason, result.user.version);
      await this.storeAdminCommand(client, actor.tenantId, idempotencyKey, requestHash, result);
      return { ...result, replay: false };
    });
  }

  async markInviteResent(actor: AuthenticatedMembership, id: string, version: number, idempotencyKey: string) {
    return this.inScope(actor, async (client) => {
      const requestHash = this.adminRequestHash("INVITE_RESENT", id, { version });
      const replay = await this.replayAdminCommand(client, idempotencyKey, requestHash);
      if (replay) return { ...replay, replay: true };
      const target = await this.lockTarget(client, id);
      if (Number(target.version) !== version) throw new ApiError(409, "VERSION_CONFLICT");
      if (target.status !== "INVITED") throw new ApiError(409, "INVITE_ALREADY_COMPLETED");
      await client.query("UPDATE workshopos.membership SET last_invited_at=transaction_timestamp(),updated_at=transaction_timestamp(),version=version+1 WHERE id=$1", [id]);
      const result = { user: await this.userById(client, id), cognitoUsername: String(target.cognito_username) };
      await this.auditAdmin(client, actor, id, "INVITE_RESENT", "Invitation resent", result.user.version);
      await this.storeAdminCommand(client, actor.tenantId, idempotencyKey, requestHash, result);
      return { ...result, replay: false };
    });
  }

  async changeStatus(actor: AuthenticatedMembership, id: string, input: { status: "ACTIVE" | "SUSPENDED"; version: number; reason: string }, idempotencyKey: string) {
    return this.inScope(actor, async (client) => {
      const requestHash = this.adminRequestHash(input.status, id, input);
      const replay = await this.replayAdminCommand(client, idempotencyKey, requestHash);
      if (replay) return { ...replay, replay: true };
      await this.lockAdminInvariant(client, actor.tenantId);
      const target = await this.lockTarget(client, id);
      if (Number(target.version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      if (target.status === "INVITED" || target.status === input.status) throw new ApiError(409, "STATUS_TRANSITION_INVALID");
      if (id === actor.id && input.status === "SUSPENDED") throw new ApiError(409, "SELF_ACCESS_FORBIDDEN");
      if (input.status === "SUSPENDED") await this.protectFinalAdmin(client, id, []);
      await client.query("UPDATE workshopos.membership SET status=$1,active=true,updated_at=transaction_timestamp(),version=version+1 WHERE id=$2", [input.status, id]);
      const result = { user: await this.userById(client, id), cognitoUsername: String(target.cognito_username) };
      await this.auditAdmin(client, actor, id, input.status === "ACTIVE" ? "ACTIVATED" : "SUSPENDED", input.reason, result.user.version);
      await this.storeAdminCommand(client, actor.tenantId, idempotencyKey, requestHash, result);
      return { ...result, replay: false };
    });
  }

  private mapManagedRole(row: {
    id: string; name: string; description: string; permissions: string[]; system_template: boolean;
    active: boolean; version: string; updated_at: Date;
  }): ManagedRole {
    return {
      id: row.id, name: row.name, description: row.description,
      permissions: Array.isArray(row.permissions) ? row.permissions : [], protected: row.system_template,
      active: row.active, version: Number(row.version), updatedAt: row.updated_at.toISOString(),
    };
  }

  private roleRequestHash(action: string, id: string | undefined, input: unknown) {
    return createHash("sha256").update(JSON.stringify({ action, id, input })).digest("hex");
  }

  private async replayRoleCommand(client: PoolClient, key: string, requestHash: string): Promise<ManagedRole | undefined> {
    const result = await client.query<{ request_hash: string; response: { role: ManagedRole } }>(
      "SELECT request_hash,response FROM workshopos.role_command WHERE idempotency_key=$1", [key],
    );
    if (!result.rowCount) return undefined;
    if (result.rows[0].request_hash !== requestHash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
    return result.rows[0].response.role;
  }

  private async storeRoleCommand(client: PoolClient, tenantId: string, key: string, hash: string, role: ManagedRole) {
    await client.query("INSERT INTO workshopos.role_command(tenant_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4::jsonb)", [tenantId, key, hash, JSON.stringify({ role })]);
  }

  private async lockRole(client: PoolClient, id: string) {
    const result = await client.query<{
      id: string; permissions: string[]; system_template: boolean; active: boolean; version: string;
    }>("SELECT id,permissions,system_template,active,version::text FROM workshopos.role_template WHERE id=$1 FOR UPDATE", [id]);
    if (!result.rowCount) throw new ApiError(404, "ROLE_NOT_FOUND");
    return result.rows[0];
  }

  private async insertRoleVersion(client: PoolClient, actor: AuthenticatedMembership, role: ManagedRole, reason: string) {
    await client.query(
      "INSERT INTO workshopos.role_template_version(id,tenant_id,role_id,version,name,description,permissions,active,changed_by_membership_id,change_reason) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10)",
      [randomUUID(), actor.tenantId, role.id, role.version, role.name, role.description, JSON.stringify(role.permissions), role.active, actor.id, reason],
    );
  }

  private adminRequestHash(action: string, id: string, input: unknown) {
    return createHash("sha256").update(JSON.stringify({ action, id, input })).digest("hex");
  }

  private async replayAdminCommand(client: PoolClient, idempotencyKey: string, requestHash: string) {
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`membership-command:${idempotencyKey}`]);
    const prior = await client.query<{ request_hash: string; response: { user: ManagedUser; cognitoUsername: string } }>(
      "SELECT request_hash,response FROM workshopos.membership_command WHERE idempotency_key=$1", [idempotencyKey],
    );
    if (!prior.rowCount) return undefined;
    if (prior.rows[0].request_hash !== requestHash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
    return prior.rows[0].response;
  }

  private async storeAdminCommand(client: PoolClient, tenantId: string, key: string, hash: string, response: unknown) {
    await client.query("INSERT INTO workshopos.membership_command(tenant_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4::jsonb)", [tenantId, key, hash, JSON.stringify(response)]);
  }

  private async lockAdminInvariant(client: PoolClient, tenantId: string) {
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${tenantId}:effective-admins`]);
  }

  private async hasManageRole(client: PoolClient, roleIds: string[]) {
    if (!roleIds.length) return false;
    const result = await client.query("SELECT 1 FROM workshopos.role_template WHERE id=ANY($1::uuid[]) AND active AND permissions ? 'membership.manage'", [roleIds]);
    return Boolean(result.rowCount);
  }

  private async auditAdmin(client: PoolClient, actor: AuthenticatedMembership, targetId: string, action: string, reason: string, version: number) {
    await client.query("INSERT INTO workshopos.membership_admin_audit(id,tenant_id,target_membership_id,actor_membership_id,action,reason,resource_version) VALUES($1,$2,$3,$4,$5,$6,$7)",
      [randomUUID(), actor.tenantId, targetId, actor.id, action, reason, version]);
  }

  private async replaceAssignments(client: PoolClient, tenantId: string, id: string, roleIds: string[], branchIds: string[]) {
    const validRoles = await client.query<{ id: string }>("SELECT id FROM workshopos.role_template WHERE id=ANY($1::uuid[]) AND active", [roleIds]);
    if (validRoles.rowCount !== roleIds.length) throw new ApiError(400, "ROLE_NOT_FOUND");
    const validBranches = await client.query<{ id: string }>("SELECT id FROM workshopos.branch WHERE id=ANY($1::uuid[])", [branchIds]);
    if (validBranches.rowCount !== branchIds.length) throw new ApiError(403, "BRANCH_FORBIDDEN");
    await client.query("DELETE FROM workshopos.membership_role WHERE membership_id=$1", [id]);
    await client.query("DELETE FROM workshopos.membership_branch WHERE membership_id=$1", [id]);
    for (const roleId of roleIds) await client.query("INSERT INTO workshopos.membership_role(tenant_id,membership_id,role_id) VALUES($1,$2,$3)", [tenantId, id, roleId]);
    for (const branchId of branchIds) await client.query("INSERT INTO workshopos.membership_branch(tenant_id,membership_id,branch_id) VALUES($1,$2,$3)", [tenantId, id, branchId]);
  }

  private async protectFinalAdmin(client: PoolClient, id: string, nextRoleIds: string[]) {
    const currentlyAdmin = await client.query("SELECT 1 FROM workshopos.membership m JOIN workshopos.membership_role mr ON mr.membership_id=m.id AND mr.tenant_id=m.tenant_id JOIN workshopos.role_template r ON r.id=mr.role_id AND r.tenant_id=mr.tenant_id WHERE m.id=$1 AND m.active AND m.status='ACTIVE' AND r.active AND r.permissions ? 'membership.manage'", [id]);
    const remainsAdmin = nextRoleIds.length ? await client.query("SELECT 1 FROM workshopos.role_template WHERE id=ANY($1::uuid[]) AND active AND permissions ? 'membership.manage'", [nextRoleIds]) : { rowCount: 0 };
    if (currentlyAdmin.rowCount && !remainsAdmin.rowCount) {
      const admins = await client.query<{ count: string }>("SELECT count(DISTINCT m.id)::text AS count FROM workshopos.membership m JOIN workshopos.membership_role mr ON mr.membership_id=m.id AND mr.tenant_id=m.tenant_id JOIN workshopos.role_template r ON r.id=mr.role_id AND r.tenant_id=mr.tenant_id WHERE m.active AND m.status='ACTIVE' AND r.active AND r.permissions ? 'membership.manage'");
      if (Number(admins.rows[0].count) <= 1) throw new ApiError(409, "FINAL_ADMIN_REQUIRED");
    }
  }

  private async protectFinalAdminAfterRoleChange(client: PoolClient, roleId: string) {
    const admins = await client.query<{ count: string }>(`
      SELECT count(*)::text AS count
      FROM workshopos.membership m
      WHERE m.active AND m.status='ACTIVE'
        AND NOT EXISTS (
          SELECT 1 FROM workshopos.membership_permission denied
          WHERE denied.membership_id=m.id AND denied.permission='membership.manage' AND denied.effect='DENY'
        )
        AND (
          EXISTS (
            SELECT 1 FROM workshopos.membership_permission allowed
            WHERE allowed.membership_id=m.id AND allowed.permission='membership.manage' AND allowed.effect='ALLOW'
          )
          OR EXISTS (
            SELECT 1
            FROM workshopos.membership_role mr
            JOIN workshopos.role_template r ON r.id=mr.role_id AND r.tenant_id=mr.tenant_id
            WHERE mr.membership_id=m.id AND r.active AND r.id<>$1 AND r.permissions ? 'membership.manage'
          )
        )`, [roleId]);
    if (Number(admins.rows[0].count) === 0) throw new ApiError(409, "FINAL_ADMIN_REQUIRED");
  }

  private async lockTarget(client: PoolClient, id: string) {
    const result = await client.query<any>("SELECT * FROM workshopos.membership WHERE id=$1 AND active FOR UPDATE", [id]);
    if (!result.rowCount) throw new ApiError(404, "USER_NOT_FOUND");
    return result.rows[0];
  }

  private async userById(client: PoolClient, id: string, includeArchived = false) {
    const result = await client.query<any>(`SELECT id, display_name, email, status, version::text, invited_at, last_invited_at, created_at, updated_at FROM workshopos.membership WHERE id=$1 ${includeArchived ? "" : "AND active"}`, [id]);
    if (!result.rowCount) throw new ApiError(404, "USER_NOT_FOUND");
    const roles = (await client.query<RoleOption>("SELECT id, name, permissions FROM workshopos.role_template WHERE active ORDER BY name")).rows;
    const branches = (await client.query<BranchOption>("SELECT id, name FROM workshopos.branch ORDER BY name")).rows;
    return this.hydrateManagedUser(client, result.rows[0], roles, branches);
  }

  private async hydrateManagedUser(client: PoolClient, row: any, roles: RoleOption[], branches: BranchOption[]): Promise<ManagedUser> {
    const roleIds = (await client.query<{ role_id: string }>("SELECT role_id FROM workshopos.membership_role WHERE membership_id=$1 ORDER BY role_id", [row.id])).rows.map((item) => item.role_id);
    const branchIds = (await client.query<{ branch_id: string }>("SELECT branch_id FROM workshopos.membership_branch WHERE membership_id=$1 ORDER BY branch_id", [row.id])).rows.map((item) => item.branch_id);
    return {
      id: row.id, name: row.display_name, email: row.email, status: row.status,
      roleIds, roles: roles.filter((item) => roleIds.includes(item.id)),
      branchIds, branches: branches.filter((item) => branchIds.includes(item.id)),
      version: Number(row.version),
      invitedAt: row.invited_at?.toISOString(), lastInvitedAt: row.last_invited_at?.toISOString(),
      createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString(),
    };
  }

  private readonly defaultBusinessSettings: BusinessSettings = {
    defaultLaborRateMinor: 150000,
    defaultJobDurationMinutes: 60,
    customerUpdatesEnabled: true,
    invoiceFooter: "Thank you for choosing our workshop.",
  };

  private async latestSettings(client: PoolClient, scopeKey: string) {
    const result = await client.query<{ version: string; values: BusinessSettingsOverrides }>(
      "SELECT version::text,values FROM workshopos.business_settings_version WHERE scope_key=$1 ORDER BY business_settings_version.version DESC LIMIT 1", [scopeKey],
    );
    return result.rowCount ? { version: Number(result.rows[0].version), values: result.rows[0].values } : { version: 0, values: {} as BusinessSettingsOverrides };
  }

  private async ensureSettingsDraft(client: PoolClient, actor: AuthenticatedMembership, branchId?: string) {
    const scopeKey = branchId ?? "00000000-0000-0000-0000-000000000000";
    const current = await this.latestSettings(client, scopeKey);
    const initialValues = branchId ? current.values : current.version ? current.values : this.defaultBusinessSettings;
    await client.query(`INSERT INTO workshopos.business_settings_draft(tenant_id,scope_key,branch_id,base_published_version,values,updated_by_membership_id)
      VALUES($1,$2,$3,$4,$5::jsonb,$6) ON CONFLICT (tenant_id,scope_key) DO NOTHING`,
    [actor.tenantId, scopeKey, branchId ?? null, current.version, JSON.stringify(initialValues), actor.id]);
    return scopeKey;
  }

  private async settingsWorkspace(client: PoolClient, actor: AuthenticatedMembership, branchId?: string): Promise<SettingsWorkspace> {
    const scopeKey = await this.ensureSettingsDraft(client, actor, branchId);
    const draft = (await client.query<{ version: string; values: BusinessSettingsOverrides; updated_at: Date }>(
      "SELECT version::text,values,updated_at FROM workshopos.business_settings_draft WHERE scope_key=$1", [scopeKey],
    )).rows[0];
    if (!draft) throw new ApiError(404, "SETTINGS_NOT_FOUND");
    const published = await this.latestSettings(client, scopeKey);
    const tenantPublished = branchId ? await this.latestSettings(client, "00000000-0000-0000-0000-000000000000") : published;
    const inherited = branchId
      ? { ...this.defaultBusinessSettings, ...(tenantPublished.version ? tenantPublished.values : {}) }
      : this.defaultBusinessSettings;
    let branchName: string | undefined;
    if (branchId) {
      const branch = await client.query<{ name: string }>("SELECT name FROM workshopos.branch WHERE id=$1", [branchId]);
      if (!branch.rowCount) throw new ApiError(403, "BRANCH_FORBIDDEN");
      branchName = branch.rows[0].name;
    }
    return {
      scope: branchId ? { kind: "BRANCH", branchId, branchName: branchName! } : { kind: "TENANT" },
      draftVersion: Number(draft.version), publishedVersion: published.version, inherited,
      overrides: draft.values, effective: { ...inherited, ...draft.values }, updatedAt: draft.updated_at.toISOString(),
    };
  }

  async workspace(actor: AuthenticatedMembership, branchId?: string): Promise<SettingsWorkspace> {
    return this.inScope(actor, (client) => this.settingsWorkspace(client, actor, branchId));
  }

  async saveDraft(actor: AuthenticatedMembership, branchId: string | undefined, input: { version: number; values: BusinessSettingsOverrides }): Promise<SettingsWorkspace> {
    return this.inScope(actor, async (client) => {
      const scopeKey = await this.ensureSettingsDraft(client, actor, branchId);
      const updated = await client.query(`UPDATE workshopos.business_settings_draft SET values=$1::jsonb,version=version+1,updated_by_membership_id=$2,updated_at=transaction_timestamp()
        WHERE scope_key=$3 AND version=$4 RETURNING version`, [JSON.stringify(input.values), actor.id, scopeKey, input.version]);
      if (!updated.rowCount) throw new ApiError(409, "VERSION_CONFLICT");
      return this.settingsWorkspace(client, actor, branchId);
    });
  }

  async publish(actor: AuthenticatedMembership, branchId: string | undefined, input: { version: number }, idempotencyKey: string): Promise<SettingsWorkspace> {
    return this.inScope(actor, async (client) => {
      const scopeKey = await this.ensureSettingsDraft(client, actor, branchId);
      const hash = createHash("sha256").update(JSON.stringify({ action: "publish-settings", scopeKey, input })).digest("hex");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${actor.tenantId}:settings:${idempotencyKey}`]);
      const prior = await client.query<{ request_hash: string; response: SettingsWorkspace }>("SELECT request_hash,response FROM workshopos.business_settings_command WHERE idempotency_key=$1", [idempotencyKey]);
      if (prior.rowCount) {
        if (prior.rows[0].request_hash !== hash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
        return prior.rows[0].response;
      }
      const draftResult = await client.query<{ version: string; base_published_version: string; values: BusinessSettingsOverrides }>(
        "SELECT version::text,base_published_version::text,values FROM workshopos.business_settings_draft WHERE scope_key=$1 FOR UPDATE", [scopeKey]);
      const draft = draftResult.rows[0]; const latest = await this.latestSettings(client, scopeKey);
      if (!draft || Number(draft.version) !== input.version || Number(draft.base_published_version) !== latest.version) throw new ApiError(409, "VERSION_CONFLICT");
      const nextVersion = latest.version + 1;
      await client.query(`INSERT INTO workshopos.business_settings_version(id,tenant_id,scope_key,branch_id,version,values,published_by_membership_id)
        VALUES($1,$2,$3,$4,$5,$6::jsonb,$7)`, [randomUUID(), actor.tenantId, scopeKey, branchId ?? null, nextVersion, JSON.stringify(draft.values), actor.id]);
      await client.query("UPDATE workshopos.business_settings_draft SET version=version+1,base_published_version=$1,updated_at=transaction_timestamp() WHERE scope_key=$2", [nextVersion, scopeKey]);
      const response = await this.settingsWorkspace(client, actor, branchId);
      await client.query("INSERT INTO workshopos.business_settings_command(tenant_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4::jsonb)", [actor.tenantId, idempotencyKey, hash, JSON.stringify(response)]);
      return response;
    });
  }

  async snapshotWorkItem(actor: AuthenticatedMembership, workItemId: string, branchId: string, idempotencyKey: string): Promise<SettingsSnapshot> {
    return this.inScope(actor, async (client) => {
      const hash = createHash("sha256").update(JSON.stringify({ action: "snapshot-work-item-settings", workItemId, branchId })).digest("hex");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`${actor.tenantId}:settings:${idempotencyKey}`]);
      const prior = await client.query<{ request_hash: string; response: SettingsSnapshot }>("SELECT request_hash,response FROM workshopos.business_settings_command WHERE idempotency_key=$1", [idempotencyKey]);
      if (prior.rowCount) { if (prior.rows[0].request_hash !== hash) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED"); return prior.rows[0].response; }
      const item = await client.query("SELECT 1 FROM workshopos.work_item WHERE id=$1 AND branch_id=$2 AND archived_at IS NULL FOR UPDATE", [workItemId, branchId]);
      if (!item.rowCount) throw new ApiError(404, "WORK_ITEM_NOT_FOUND");
      const existing = await client.query<{ tenant_version: string; branch_version: string | null; values: BusinessSettings; captured_at: Date }>(
        "SELECT tenant_version::text,branch_version::text,values,captured_at FROM workshopos.work_item_settings_snapshot WHERE work_item_id=$1", [workItemId]);
      let response: SettingsSnapshot;
      if (existing.rowCount) response = { workItemId, tenantVersion: Number(existing.rows[0].tenant_version), branchVersion: existing.rows[0].branch_version ? Number(existing.rows[0].branch_version) : undefined, values: existing.rows[0].values, capturedAt: existing.rows[0].captured_at.toISOString() };
      else {
        const tenant = await this.latestSettings(client, "00000000-0000-0000-0000-000000000000");
        if (!tenant.version) throw new ApiError(409, "TENANT_SETTINGS_NOT_PUBLISHED");
        const branch = await this.latestSettings(client, branchId); const values = { ...this.defaultBusinessSettings, ...tenant.values, ...(branch.version ? branch.values : {}) } as BusinessSettings;
        const inserted = (await client.query<{ captured_at: Date }>(`INSERT INTO workshopos.work_item_settings_snapshot(work_item_id,tenant_id,branch_id,tenant_version,branch_version,values,captured_by_membership_id)
          VALUES($1,$2,$3,$4,$5,$6::jsonb,$7) RETURNING captured_at`, [workItemId, actor.tenantId, branchId, tenant.version, branch.version || null, JSON.stringify(values), actor.id])).rows[0];
        response = { workItemId, tenantVersion: tenant.version, branchVersion: branch.version || undefined, values, capturedAt: inserted.captured_at.toISOString() };
      }
      await client.query("INSERT INTO workshopos.business_settings_command(tenant_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4::jsonb)", [actor.tenantId, idempotencyKey, hash, JSON.stringify(response)]);
      return response;
    });
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  private async inScope<T>(membership: Membership, action: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT set_config('app.tenant_id', $1, true), set_config('app.branch_ids', $2, true), set_config('app.subject_id', $3, true)", [
        membership.tenantId,
        membership.branchIds.join(","),
        membership.subject ?? membership.identitySubject ?? "",
      ]);
      await client.query("SELECT set_config('app.warehouse_ids',$1,true)", [(membership.warehouseIds ?? []).join(",")]);
      const result = await action(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
