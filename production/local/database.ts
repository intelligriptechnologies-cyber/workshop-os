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
import { jobStageLabel, type JobListQuery } from "../src/job-list-contract.js";
import { isJobLifecycleCommand, projectJobLifecycle, type JobLifecycleStage } from "../src/job-lifecycle.js";
import { allowedMediaCategories, type JobMediaRecord, type MediaCategory, type MediaListQuery, type MediaScanStatus } from "../src/job-media.js";
import { createEstimateDocument } from "../src/estimate-task-qc.js";
import { createBillingPdf, validateDeliveryEvidence, validateMoney } from "../src/billing-delivery.js";

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
export type JobDocumentLink = { id: string; type: "ESTIMATE"|"INVOICE"|"RECEIPT"|"GATE_PASS"; label: string };
export type JobRecord = { id:string; tenantId:string; branchId:string; jobNumber:string; visitId:string; visitDate:string; checkedInAt:string; customerName:string; registration:string; vehicleDescription:string; customerRequest:string; promisedHandoffAt:string; stage:string; statusLabel:string; version:number; updatedAt:string; documents:JobDocumentLink[]; settingsSnapshotCaptured:boolean };
export type ProductionEstimate = { id:string;streamId:string;jobId:string;branchId:string;jobNumber:string;revision:number;status:string;documentNumber?:string;notes:string;totalMinor:string;currency:string;validUntil?:string;version:number;superseded:boolean;createdAt:string;approval?:{outcome:string;evidence:Record<string,unknown>;recordedAt:string;receiptReference:string} };
export type ProductionTask = { id:string;jobId:string;branchId:string;jobNumber:string;title:string;status:string;priority:string;estimatedMinutes:number;technicianIds:string[];responsibleTechnicianId:string;dependencies:string[];blockedBy:string[];checklist:Array<Record<string,unknown>>;evidenceCount:number;version:number;updatedAt:string };
export type ProductionQc = { taskId:string;jobId:string;branchId:string;jobNumber:string;title:string;status:string;technicianIds:string[];version:number;updatedAt:string;rework?:{id:string;status:string;reason:string;failedChecklistKeys:string[];assignedTechnicianId?:string;version:number} };
export type BillingJob = { id:string;branchId:string;jobNumber:string;stage:string;version:number;customerName:string;registration:string;invoice?:{id:string;number:string;originalPayableMinor:string;creditMinor:string;payableMinor:string;version:number};paidMinor:string;balanceMinor:string;workAccepted:boolean;paymentCleared:boolean;deliveryRecorded:boolean;gatePass?:{id:string;number:string;status:string;version:number;validUntil:string};released:boolean;closed:boolean;payments:Array<{id:string;kind:string;amountMinor:string;mode:string;reference:string;occurredAt:string}>;corrections:Array<{id:string;kind:string;amountMinor:string;status:string;version:number}>;invoiceCorrections:Array<{id:string;kind:string;amountMinor:string;status:string;version:number;documentNumber?:string}> };

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

  async queryJobs(membership: Membership, query: JobListQuery, all=false) {
    if(query.branchId&&!membership.branchIds.includes(query.branchId))throw new ApiError(403,"BRANCH_FORBIDDEN");
    return this.inScope(membership,async(client)=>{
      const tenant=await client.query<{timezone:string}>("SELECT timezone FROM workshopos.tenant WHERE tenant_id=$1",[membership.tenantId]);
      const timezone=tenant.rows[0]?.timezone??"Asia/Kolkata";
      const effectiveDate=query.visitDate||(await client.query<{today:string}>("SELECT to_char(transaction_timestamp() AT TIME ZONE $1,'YYYY-MM-DD') today",[timezone])).rows[0].today;
      const values:unknown[]=[timezone,effectiveDate]; const where=["lr.resource_type='JOB'","(rv.checked_in_at AT TIME ZONE $1)::date=$2::date"];
      if(query.search){values.push(`%${query.search}%`);where.push(`(j.id::text ILIKE $${values.length} OR c.display_name ILIKE $${values.length} OR v.normalized_registration ILIKE regexp_replace($${values.length},'[^a-zA-Z0-9%]','','g'))`);}
      if(query.branchId){values.push(query.branchId);where.push(`j.branch_id=$${values.length}`);}
      if(query.stage){values.push(query.stage);where.push(`lr.stage=$${values.length}`);}
      const from=`FROM workshopos.reception_job_card j JOIN workshopos.reception_visit rv ON rv.tenant_id=j.tenant_id AND rv.branch_id=j.branch_id AND rv.id=j.visit_id JOIN workshopos.lifecycle_resources lr ON lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id AND lr.id=j.id JOIN workshopos.customer c ON c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id AND c.id=j.customer_id JOIN workshopos.vehicle v ON v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id AND v.id=j.vehicle_id`;
      const condition=where.join(" AND "); const totalCount=Number((await client.query<{count:string}>(`SELECT count(*)::text count ${from} WHERE ${condition}`,values)).rows[0].count); const pageCount=Math.max(1,Math.ceil(totalCount/query.pageSize));const page=all?1:Math.min(query.page,pageCount);
      const order=query.sort==="visitDate.asc"?"rv.checked_in_at ASC,j.id":query.sort==="jobNumber.asc"?"j.id ASC":query.sort==="jobNumber.desc"?"j.id DESC":"rv.checked_in_at DESC,j.id"; const paging=all?"":` LIMIT ${query.pageSize} OFFSET ${(page-1)*query.pageSize}`;
      const result=await client.query<any>(`SELECT j.id,j.tenant_id,j.branch_id,j.visit_id,j.customer_request,j.promised_handoff_at,j.resource_version,lr.stage,lr.updated_at,rv.checked_in_at,c.display_name customer_name,v.normalized_registration registration,v.attributes,
        EXISTS(SELECT 1 FROM workshopos.job_settings_snapshot s WHERE s.tenant_id=j.tenant_id AND s.branch_id=j.branch_id AND s.job_id=j.id) snapshot_captured,
        coalesce((SELECT jsonb_agg(jsonb_build_object('id',d.id,'type',d.document_type,'label',d.public_reference) ORDER BY d.rendered_at,d.id) FROM workshopos.rendered_document d JOIN workshopos.job_document_content dc ON dc.document_id=d.id AND dc.tenant_id=d.tenant_id AND dc.branch_id=d.branch_id WHERE d.tenant_id=j.tenant_id AND d.branch_id=j.branch_id AND ((d.document_type='ESTIMATE' AND EXISTS(SELECT 1 FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id AND es.id=ev.estimate_stream_id WHERE ev.id=d.source_id AND ev.tenant_id=d.tenant_id AND ev.branch_id=d.branch_id AND es.job_id=j.id AND ev.status IN('SENT','APPROVED','PARTIALLY_APPROVED'))) OR (d.document_type='INVOICE' AND EXISTS(SELECT 1 FROM workshopos.native_invoice ni JOIN workshopos.native_invoice_document nd ON nd.tenant_id=ni.tenant_id AND nd.branch_id=ni.branch_id AND nd.entity_type='INVOICE' AND nd.entity_id=ni.id AND nd.scan_status='CLEAN' WHERE ni.id=d.source_id AND ni.tenant_id=d.tenant_id AND ni.branch_id=d.branch_id AND ni.job_id=j.id AND ni.status='FINALIZED')) OR (d.document_type='RECEIPT' AND EXISTS(SELECT 1 FROM workshopos.financial_event fe WHERE fe.id=d.source_id AND fe.tenant_id=d.tenant_id AND fe.branch_id=d.branch_id AND fe.job_id=j.id AND fe.event_kind='PAYMENT_RECEIPT')) OR (d.document_type='GATE_PASS' AND EXISTS(SELECT 1 FROM workshopos.gate_pass gp WHERE gp.id=d.source_id AND gp.tenant_id=d.tenant_id AND gp.branch_id=d.branch_id AND gp.job_id=j.id AND gp.status IN('ISSUED','RELEASED'))))), '[]'::jsonb) documents ${from} WHERE ${condition} ORDER BY ${order}${paging}`,values);
      const jobs=result.rows.map(row=>this.mapJob(row,timezone)); return{jobs,page:{page,pageSize:query.pageSize,totalCount,pageCount},query:{...query,visitDate:effectiveDate,page},timezone};
    });
  }

  async getJob(membership:Membership,id:string){return this.inScope(membership,async(client)=>{const tenant=await client.query<{timezone:string}>("SELECT timezone FROM workshopos.tenant WHERE tenant_id=$1",[membership.tenantId]);const result=await client.query<any>(`SELECT j.id,j.tenant_id,j.branch_id,j.visit_id,j.customer_request,j.promised_handoff_at,j.resource_version,lr.stage,lr.updated_at,rv.checked_in_at,c.display_name customer_name,v.normalized_registration registration,v.attributes,EXISTS(SELECT 1 FROM workshopos.job_settings_snapshot s WHERE s.tenant_id=j.tenant_id AND s.branch_id=j.branch_id AND s.job_id=j.id) snapshot_captured,
      coalesce((SELECT jsonb_agg(jsonb_build_object('id',d.id,'type',d.document_type,'label',d.public_reference) ORDER BY d.rendered_at,d.id) FROM workshopos.rendered_document d JOIN workshopos.job_document_content dc ON dc.document_id=d.id AND dc.tenant_id=d.tenant_id AND dc.branch_id=d.branch_id WHERE d.tenant_id=j.tenant_id AND d.branch_id=j.branch_id AND ((d.document_type='ESTIMATE' AND EXISTS(SELECT 1 FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=d.source_id AND ev.tenant_id=d.tenant_id AND ev.branch_id=d.branch_id AND es.job_id=j.id AND ev.status IN('SENT','APPROVED','PARTIALLY_APPROVED'))) OR (d.document_type='INVOICE' AND EXISTS(SELECT 1 FROM workshopos.native_invoice ni JOIN workshopos.native_invoice_document nd ON nd.entity_id=ni.id AND nd.tenant_id=ni.tenant_id AND nd.branch_id=ni.branch_id AND nd.entity_type='INVOICE' AND nd.scan_status='CLEAN' WHERE ni.id=d.source_id AND ni.tenant_id=d.tenant_id AND ni.branch_id=d.branch_id AND ni.job_id=j.id AND ni.status='FINALIZED')) OR (d.document_type='RECEIPT' AND EXISTS(SELECT 1 FROM workshopos.financial_event fe WHERE fe.id=d.source_id AND fe.tenant_id=d.tenant_id AND fe.branch_id=d.branch_id AND fe.job_id=j.id AND fe.event_kind='PAYMENT_RECEIPT')) OR (d.document_type='GATE_PASS' AND EXISTS(SELECT 1 FROM workshopos.gate_pass gp WHERE gp.id=d.source_id AND gp.tenant_id=d.tenant_id AND gp.branch_id=d.branch_id AND gp.job_id=j.id AND gp.status IN('ISSUED','RELEASED'))))),'[]'::jsonb) documents FROM workshopos.reception_job_card j JOIN workshopos.reception_visit rv ON rv.id=j.visit_id AND rv.tenant_id=j.tenant_id AND rv.branch_id=j.branch_id JOIN workshopos.lifecycle_resources lr ON lr.id=j.id AND lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id AND lr.resource_type='JOB' JOIN workshopos.customer c ON c.id=j.customer_id AND c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id JOIN workshopos.vehicle v ON v.id=j.vehicle_id AND v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id WHERE j.id=$1`,[id]);if(!result.rowCount)throw new ApiError(404,"JOB_NOT_FOUND");return this.mapJob(result.rows[0],tenant.rows[0]?.timezone??"Asia/Kolkata");});}

  async mediaJobs(membership:Membership,input:{visitDate:string;search:string;branchId?:string}){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(input.visitDate))throw new ApiError(400,"VISIT_DATE_REQUIRED");
    if(input.branchId&&!membership.branchIds.includes(input.branchId))throw new ApiError(403,"BRANCH_FORBIDDEN");
    return this.inScope(membership,async(client)=>{
      const timezone=(await client.query<{timezone:string}>("SELECT timezone FROM workshopos.tenant WHERE tenant_id=$1",[membership.tenantId])).rows[0]?.timezone??"Asia/Kolkata";
      const values:unknown[]=[timezone,input.visitDate];const where=["(rv.checked_in_at AT TIME ZONE $1)::date=$2::date","lr.resource_type='JOB'"];
      if(input.branchId){values.push(input.branchId);where.push(`j.branch_id=$${values.length}`);}
      if(input.search.trim()){values.push(`%${input.search.trim()}%`);where.push(`(j.id::text ILIKE $${values.length} OR c.display_name ILIKE $${values.length} OR v.normalized_registration ILIKE regexp_replace($${values.length},'[^a-zA-Z0-9%]','','g'))`);}
      const rows=(await client.query<any>(`SELECT j.id,j.branch_id,rv.checked_in_at,c.display_name customer_name,v.normalized_registration registration,lr.stage
        FROM workshopos.reception_job_card j JOIN workshopos.reception_visit rv ON rv.tenant_id=j.tenant_id AND rv.branch_id=j.branch_id AND rv.id=j.visit_id
        JOIN workshopos.lifecycle_resources lr ON lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id AND lr.id=j.id
        JOIN workshopos.customer c ON c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id AND c.id=j.customer_id
        JOIN workshopos.vehicle v ON v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id AND v.id=j.vehicle_id
        WHERE ${where.join(" AND ")} ORDER BY rv.checked_in_at DESC,j.id LIMIT 100`,values)).rows;
      return{jobs:rows.map((row:any)=>({id:row.id,branchId:row.branch_id,jobNumber:`JOB-${String(row.id).slice(0,8).toUpperCase()}`,visitDate:input.visitDate,customerName:row.customer_name,registration:row.registration,stage:row.stage,allowedCategories:allowedMediaCategories(row.stage)})),timezone};
    });
  }

  async queryJobMedia(membership:Membership,query:MediaListQuery){
    if(query.branchId&&!membership.branchIds.includes(query.branchId))throw new ApiError(403,"BRANCH_FORBIDDEN");
    return this.inScope(membership,async(client)=>{
      const timezone=(await client.query<{timezone:string}>("SELECT timezone FROM workshopos.tenant WHERE tenant_id=$1",[membership.tenantId])).rows[0]?.timezone??"Asia/Kolkata";
      const effectiveDate=query.visitDate||(await client.query<{today:string}>("SELECT to_char(transaction_timestamp() AT TIME ZONE $1,'YYYY-MM-DD') today",[timezone])).rows[0].today;
      const values:unknown[]=[timezone,effectiveDate];const where=["(rv.checked_in_at AT TIME ZONE $1)::date=$2::date"];
      if(!query.includeArchived)where.push("m.archived_at IS NULL");
      if(query.branchId){values.push(query.branchId);where.push(`m.branch_id=$${values.length}`);}if(query.jobId){values.push(query.jobId);where.push(`m.job_id=$${values.length}`);}
      if(query.category){values.push(query.category);where.push(`m.category=$${values.length}`);}if(query.search){values.push(`%${query.search}%`);where.push(`(m.label ILIKE $${values.length} OR m.file_name ILIKE $${values.length} OR c.display_name ILIKE $${values.length} OR v.normalized_registration ILIKE regexp_replace($${values.length},'[^a-zA-Z0-9%]','','g'))`);}
      const from=`FROM workshopos.secure_media_object m JOIN workshopos.reception_job_card j ON j.tenant_id=m.tenant_id AND j.branch_id=m.branch_id AND j.id=m.job_id JOIN workshopos.reception_visit rv ON rv.tenant_id=j.tenant_id AND rv.branch_id=j.branch_id AND rv.id=j.visit_id JOIN workshopos.customer c ON c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id AND c.id=j.customer_id JOIN workshopos.vehicle v ON v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id AND v.id=j.vehicle_id`;
      const total=Number((await client.query<{count:string}>(`SELECT count(*)::text count ${from} WHERE ${where.join(" AND ")}`,values)).rows[0].count);const pageCount=Math.max(1,Math.ceil(total/query.pageSize));const page=Math.min(query.page,pageCount);
      const rows=(await client.query<any>(`SELECT m.*,rv.checked_in_at,c.display_name customer_name,v.normalized_registration registration ${from} WHERE ${where.join(" AND ")} ORDER BY m.created_at DESC,m.media_id LIMIT ${query.pageSize} OFFSET ${(page-1)*query.pageSize}`,values)).rows;
      return{media:rows.map((row:any)=>this.mapMedia(row,effectiveDate)),page:{page,pageSize:query.pageSize,totalCount:total,pageCount},query:{...query,visitDate:effectiveDate,page},timezone};
    });
  }

  async getJobMedia(membership:Membership,id:string){
    return this.inScope(membership,async(client)=>{
      const row=(await client.query<any>("SELECT m.*,rv.checked_in_at,c.display_name customer_name,v.normalized_registration registration,t.timezone FROM workshopos.secure_media_object m JOIN workshopos.reception_job_card j ON j.id=m.job_id AND j.tenant_id=m.tenant_id AND j.branch_id=m.branch_id JOIN workshopos.reception_visit rv ON rv.id=j.visit_id AND rv.tenant_id=j.tenant_id AND rv.branch_id=j.branch_id JOIN workshopos.customer c ON c.id=j.customer_id AND c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id JOIN workshopos.vehicle v ON v.id=j.vehicle_id AND v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id JOIN workshopos.tenant t ON t.tenant_id=m.tenant_id WHERE m.media_id=$1",[id])).rows[0];
      if(!row)throw new ApiError(404,"MEDIA_NOT_FOUND");
      const visitDate=new Intl.DateTimeFormat("en-CA",{timeZone:row.timezone??"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(row.checked_in_at);
      return this.mapMedia(row,visitDate);
    });
  }

  async createJobMedia(membership:Membership,input:{jobId:string;branchId:string;category:MediaCategory;label:string;fileName:string;mimeType:string;byteLength:number;checksumSha256:string;thumbnail:Buffer},idempotencyKey:string){
    if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");if(!idempotencyKey.trim())throw new ApiError(400,"IDEMPOTENCY_KEY_REQUIRED");
    if(!membership.branchIds.includes(input.branchId))throw new ApiError(403,"BRANCH_FORBIDDEN");if(!input.label.trim()||input.label.trim().length>200)throw new ApiError(422,"MEDIA_LABEL_REQUIRED");
    if(!(["BEFORE","INSPECTION","PROGRESS","AFTER"] as string[]).includes(input.category))throw new ApiError(422,"MEDIA_CATEGORY_INVALID");
    if(!input.fileName.trim()||input.fileName.length>255||!["image/jpeg","image/png","application/pdf"].includes(input.mimeType)||input.byteLength<1||input.byteLength>20*1024*1024)throw new ApiError(422,"MEDIA_FILE_INVALID");
    return this.inScope(membership,async(client)=>{
      const hash=this.commandHash({...input,thumbnail:input.thumbnail.toString("base64")});await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))",[`${membership.tenantId}:job-media:${idempotencyKey}`]);
      const prior=await client.query<{request_hash:string;response:any}>("SELECT request_hash,response FROM workshopos.job_media_command_receipt WHERE idempotency_key=$1",[idempotencyKey]);if(prior.rowCount){if(prior.rows[0].request_hash!==hash)throw new ApiError(409,"IDEMPOTENCY_KEY_REUSED");return{...prior.rows[0].response,replay:true};}
      const job=await client.query<{stage:string}>("SELECT lr.stage FROM workshopos.reception_job_card j JOIN workshopos.lifecycle_resources lr ON lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id AND lr.id=j.id AND lr.resource_type='JOB' WHERE j.id=$1 AND j.branch_id=$2 FOR UPDATE",[input.jobId,input.branchId]);if(!job.rowCount)throw new ApiError(404,"MEDIA_JOB_NOT_FOUND");
      if(!allowedMediaCategories(job.rows[0].stage).includes(input.category))throw new ApiError(409,"MEDIA_CATEGORY_STAGE_INVALID");
      const id=(await client.query<{id:string}>("SELECT workshopos.reserve_secure_media_upload($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) id",[input.branchId,input.jobId,input.category,input.label.trim(),input.fileName,input.mimeType,input.byteLength,input.checksumSha256,input.thumbnail,"image/png",membership.id])).rows[0].id;
      const row=(await client.query<any>("SELECT m.*,rv.checked_in_at,c.display_name customer_name,v.normalized_registration registration FROM workshopos.secure_media_object m JOIN workshopos.reception_job_card j ON j.id=m.job_id AND j.tenant_id=m.tenant_id AND j.branch_id=m.branch_id JOIN workshopos.reception_visit rv ON rv.id=j.visit_id AND rv.tenant_id=j.tenant_id AND rv.branch_id=j.branch_id JOIN workshopos.customer c ON c.id=j.customer_id AND c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id JOIN workshopos.vehicle v ON v.id=j.vehicle_id AND v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id WHERE m.media_id=$1",[id])).rows[0];
      const response={media:this.mapMedia(row,new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(row.checked_in_at)),objectKey:row.object_key};
      await client.query("INSERT INTO workshopos.job_media_command_receipt(tenant_id,branch_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4,$5::jsonb)",[membership.tenantId,input.branchId,idempotencyKey,hash,JSON.stringify(response)]);return{...response,replay:false};
    });
  }

  async archiveJobMedia(membership:Membership,id:string,input:{version:number;reason:string},idempotencyKey:string){
    if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");if(!idempotencyKey.trim())throw new ApiError(400,"IDEMPOTENCY_KEY_REQUIRED");if(!input.reason.trim())throw new ApiError(422,"ARCHIVE_REASON_REQUIRED");
    return this.inScope(membership,async(client)=>{const hash=this.commandHash({id,...input});await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))",[`${membership.tenantId}:job-media:${idempotencyKey}`]);const prior=await client.query<{request_hash:string;response:any}>("SELECT request_hash,response FROM workshopos.job_media_command_receipt WHERE idempotency_key=$1",[idempotencyKey]);if(prior.rowCount){if(prior.rows[0].request_hash!==hash)throw new ApiError(409,"IDEMPOTENCY_KEY_REUSED");return{...prior.rows[0].response,replay:true};}
      const updated=await client.query<any>("UPDATE workshopos.secure_media_object SET archived_at=transaction_timestamp(),archived_by_membership_id=$1,archive_reason=$2,version=version+1 WHERE media_id=$3 AND version=$4 AND archived_at IS NULL RETURNING branch_id,version",[membership.id,input.reason.trim(),id,input.version]);if(!updated.rowCount){const exists=await client.query("SELECT 1 FROM workshopos.secure_media_object WHERE media_id=$1",[id]);throw new ApiError(exists.rowCount?409:404,exists.rowCount?"VERSION_CONFLICT":"MEDIA_NOT_FOUND");}const response={id,version:Number(updated.rows[0].version),archived:true};await client.query("INSERT INTO workshopos.job_media_command_receipt(tenant_id,branch_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4,$5::jsonb)",[membership.tenantId,updated.rows[0].branch_id,idempotencyKey,hash,JSON.stringify(response)]);return{...response,replay:false};});
  }

  async recordJobMediaScan(membership:Membership,id:string,status:Exclude<MediaScanStatus,"PENDING">,scannerReference:string){if(!scannerReference.trim())throw new ApiError(422,"MEDIA_SCAN_RESULT_INVALID");return this.inScope(membership,async(client)=>{const current=await client.query<{scan_status:string}>("SELECT scan_status FROM workshopos.secure_media_object WHERE media_id=$1 AND archived_at IS NULL",[id]);if(!current.rowCount)throw new ApiError(404,"MEDIA_NOT_FOUND");if(current.rows[0].scan_status!=="PENDING")throw new ApiError(409,"MEDIA_SCAN_NOT_PENDING");await client.query("SELECT set_config('app.scanner_authority','true',true)");await client.query("SELECT workshopos.record_job_media_scan($1,$2,$3)",[id,status,scannerReference.trim()]);return{id,status};});}

  async authorizeJobMediaAccess(membership:Membership,id:string){return this.inScope(membership,async(client)=>{if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");const row=(await client.query<any>("SELECT media_id,branch_id,object_key,file_name,mime_type FROM workshopos.available_job_media WHERE media_id=$1",[id])).rows[0];if(!row)throw new ApiError(404,"MEDIA_NOT_AVAILABLE");await client.query("INSERT INTO workshopos.secure_media_access_audit(tenant_id,branch_id,media_id,actor_membership_id,outcome) VALUES($1,$2,$3,$4,'ALLOWED')",[membership.tenantId,row.branch_id,id,membership.id]);return{id:row.media_id,objectKey:row.object_key,fileName:row.file_name,mimeType:row.mime_type};});}

  async getJobLifecycle(membership:Membership,id:string){return this.inScope(membership,(client)=>this.jobLifecycleProjection(client,membership,id));}

  async commandJobLifecycle(membership:Membership,id:string,input:{command:string;version:number;reason:string;evidence?:Record<string,unknown>},idempotencyKey:string){
    if(!idempotencyKey.trim())throw new ApiError(400,"IDEMPOTENCY_KEY_REQUIRED");
    if(!isJobLifecycleCommand(input.command))throw new ApiError(400,"LIFECYCLE_COMMAND_INVALID");
    if(!Number.isSafeInteger(input.version)||input.version<1)throw new ApiError(400,"VERSION_REQUIRED");
    return this.inScope(membership,async(client)=>{
      if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))",[`${membership.tenantId}:job-lifecycle:${idempotencyKey}`]);
      const requestHash=this.commandHash({jobId:id,command:input.command,version:input.version,reason:input.reason.trim(),evidence:input.evidence??{}});
      const replay=await client.query<{request_hash:string;response:any}>("SELECT request_hash,response FROM workshopos.job_lifecycle_command_receipt WHERE idempotency_key=$1",[idempotencyKey]);
      if(replay.rowCount){if(replay.rows[0].request_hash!==requestHash)throw new ApiError(409,"IDEMPOTENCY_KEY_REUSED");return{...replay.rows[0].response,replay:true};}
      await client.query("SELECT id FROM workshopos.lifecycle_resources WHERE id=$1 AND resource_type='JOB' FOR UPDATE",[id]);
      const before=await this.jobLifecycleProjection(client,membership,id);
      if(before.version!==input.version)throw new ApiError(409,"VERSION_CONFLICT");
      const action=before.validActions.find((candidate:any)=>candidate.command===input.command);
      if(!action)throw new ApiError(409,"LIFECYCLE_COMMAND_INVALID");
      if(action.reasonRequired&&!input.reason.trim())throw new ApiError(422,"REASON_REQUIRED");
      if(input.command.startsWith("RECORD_")&&(!input.evidence||Object.keys(input.evidence).length===0))throw new ApiError(422,"LIFECYCLE_EVIDENCE_REQUIRED");
      if(action.blockers.length)throw new ApiError(422,"LIFECYCLE_BLOCKED");
      const auditReference=randomUUID(); const now=new Date(); const reason=input.reason.trim();
      const stage=before.canonicalStage as JobLifecycleStage;
      if(input.command==="HOLD"||input.command==="RESUME"){
        await client.query("INSERT INTO workshopos.job_lifecycle_overlay_event(tenant_id,branch_id,id,job_id,event_kind,underlying_stage,reason,actor_membership_id,occurred_at,audit_reference) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[membership.tenantId,before.branchId,randomUUID(),id,input.command,stage,reason,membership.id,now,auditReference]);
      }else if(input.command==="ARCHIVE"){
        await client.query("INSERT INTO workshopos.job_archive_event(tenant_id,branch_id,id,job_id,reason,actor_membership_id,occurred_at,audit_reference) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",[membership.tenantId,before.branchId,randomUUID(),id,reason,membership.id,now,auditReference]);
      }else if(input.command.startsWith("RECORD_")){
        const factKind=input.command.replace("RECORD_","");
        await client.query("INSERT INTO workshopos.job_lifecycle_fact(tenant_id,branch_id,id,job_id,fact_kind,evidence,actor_membership_id,occurred_at,audit_reference) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9)",[membership.tenantId,before.branchId,randomUUID(),id,factKind,JSON.stringify(input.evidence??{}),membership.id,now,auditReference]);
      }else{
        const target=action.targetStage as JobLifecycleStage;
        const lastOperational=input.command==="CANCEL"?stage:before.resumeStage??null;
        await client.query("UPDATE workshopos.lifecycle_resources SET stage=$1,last_operational_stage=$2,updated_at=$3 WHERE id=$4",[target,lastOperational,now,id]);
        await client.query("INSERT INTO workshopos.lifecycle_history(id,tenant_id,branch_id,resource_id,from_stage,to_stage,actor_identity_id,reason,evidence,audit_reference,occurred_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11)",[randomUUID(),membership.tenantId,before.branchId,id,stage,target,membership.subject??membership.identitySubject??"unknown",reason||null,JSON.stringify(input.evidence?Object.values(input.evidence).map(String):[]),auditReference,now]);
      }
      await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=$1 WHERE id=$2",[now,id]);
      await client.query("INSERT INTO workshopos.lifecycle_audit(id,tenant_id,branch_id,resource_id,audit_reference,actor_identity_id,membership_id,action,old_stage,new_stage,authentication,reason,evidence,overridden_blockers,occurred_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'{}'::jsonb,$11,$12::jsonb,'[]'::jsonb,$13)",[randomUUID(),membership.tenantId,before.branchId,id,auditReference,membership.subject??membership.identitySubject??"unknown",membership.id,`job.${input.command.toLowerCase()}`,stage,action.targetStage??stage,reason||null,JSON.stringify(input.evidence?Object.values(input.evidence).map(String):[]),now]);
      const lifecycle=await this.jobLifecycleProjection(client,membership,id); const response={lifecycle,auditReference};
      await client.query("INSERT INTO workshopos.job_lifecycle_command_receipt(tenant_id,branch_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4,$5::jsonb)",[membership.tenantId,before.branchId,idempotencyKey,requestHash,JSON.stringify(response)]);
      return{...response,replay:false};
    });
  }

  async getJobDataFlow(membership:Membership,id:string){return this.inScope(membership,async(client)=>{
    const lifecycle=await this.jobLifecycleProjection(client,membership,id);
    const row=(await client.query<any>(`SELECT j.id,j.visit_id,rv.checked_in_at,c.display_name customer_name,v.normalized_registration registration,
      (SELECT count(*)::int FROM workshopos.estimate_stream es WHERE es.job_id=j.id) estimate_streams,
      (SELECT count(*)::int FROM workshopos.work_plan wp WHERE wp.job_id=j.id) work_plans,
      (SELECT count(*)::int FROM workshopos.qc_task_state qs WHERE qs.job_id=j.id) qc_tasks,
      (SELECT count(*)::int FROM workshopos.native_invoice ni WHERE ni.job_id=j.id AND ni.status='FINALIZED') final_invoices,
      (SELECT count(*)::int FROM workshopos.financial_event fe WHERE fe.job_id=j.id) financial_events,
      (SELECT count(*)::int FROM workshopos.custody_incident ci WHERE ci.job_id=j.id AND ci.status='OPEN') open_incidents,
      (SELECT count(*)::int FROM workshopos.rendered_document d JOIN workshopos.job_document_content dc ON dc.document_id=d.id AND dc.tenant_id=d.tenant_id AND dc.branch_id=d.branch_id WHERE
        (d.document_type='ESTIMATE' AND EXISTS(SELECT 1 FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=d.source_id AND es.job_id=j.id)) OR
        (d.document_type='INVOICE' AND EXISTS(SELECT 1 FROM workshopos.native_invoice ni WHERE ni.id=d.source_id AND ni.job_id=j.id AND ni.status='FINALIZED')) OR
        (d.document_type='RECEIPT' AND EXISTS(SELECT 1 FROM workshopos.financial_event fe WHERE fe.id=d.source_id AND fe.job_id=j.id AND fe.event_kind='PAYMENT_RECEIPT')) OR
        (d.document_type='GATE_PASS' AND EXISTS(SELECT 1 FROM workshopos.gate_pass gp WHERE gp.id=d.source_id AND gp.job_id=j.id AND gp.status IN('ISSUED','RELEASED')))) linked_documents
      FROM workshopos.reception_job_card j JOIN workshopos.reception_visit rv ON rv.id=j.visit_id AND rv.tenant_id=j.tenant_id AND rv.branch_id=j.branch_id
      JOIN workshopos.customer c ON c.id=j.customer_id AND c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id
      JOIN workshopos.vehicle v ON v.id=j.vehicle_id AND v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id WHERE j.id=$1`,[id])).rows[0];
    if(!row)throw new ApiError(404,"JOB_NOT_FOUND");
    const sections=[
      {key:"visit",label:"Visit / check-in",summary:`Checked in ${row.checked_in_at.toISOString()} for ${row.customer_name} · ${row.registration}.`,recordCount:1,relevance:"The Visit establishes custody and the Job's local-date identity."},
      {key:"estimate",label:"Estimate",summary:`${row.estimate_streams} estimate stream(s); Estimate Approved: ${lifecycle.facts.estimateApproved?"recorded":"not recorded"}.`,recordCount:row.estimate_streams,relevance:"Approved scope is separate from later work acceptance."},
      {key:"work",label:"Work",summary:`${row.work_plans} work plan(s); Work Accepted: ${lifecycle.facts.workAccepted?"recorded":"not recorded"}.`,recordCount:row.work_plans,relevance:"Work execution and customer acceptance remain separately attributable."},
      {key:"qc",label:"Quality control",summary:`${row.qc_tasks} QC task projection(s).`,recordCount:row.qc_tasks,relevance:"QC evidence determines readiness for billing and may return work to In Progress."},
      {key:"billing",label:"Billing",summary:`${row.final_invoices} final invoice(s).`,recordCount:row.final_invoices,relevance:"Final invoices are immutable and precede release."},
      {key:"payment",label:"Payment",summary:`${row.financial_events} financial event(s); Payment Cleared: ${lifecycle.facts.paymentCleared?"recorded":"not recorded"}.`,recordCount:row.financial_events,relevance:"Payment events and the explicit clearance decision are distinct."},
      {key:"custody",label:"Custody / release",summary:`${row.open_incidents} open custody incident(s).`,recordCount:row.open_incidents,relevance:"Gate verification and vehicle release complete workshop custody."},
      {key:"documents",label:"Linked artifacts",summary:`${row.linked_documents} protected document artifact(s).`,recordCount:row.linked_documents,relevance:"Only existing immutable artifacts are downloadable."},
      {key:"history",label:"Status history",summary:`${lifecycle.history.length} attributed lifecycle event(s).`,recordCount:lifecycle.history.length,relevance:"Append-only history explains how this Job reached its current state."},
    ];
    return{selectedJob:{id:row.id,jobNumber:`JOB-${String(row.id).slice(0,8).toUpperCase()}`,visitId:row.visit_id,customerName:row.customer_name,registration:row.registration},lifecycle,sections};
  });}

  async searchJobDataFlowJobs(membership:Membership,search:string){return this.inScope(membership,async(client)=>{
    const needle=search.trim();const values:unknown[]=[];let condition="";
    if(needle){values.push(`%${needle}%`);condition=`AND (j.id::text ILIKE $1 OR c.display_name ILIKE $1 OR v.normalized_registration ILIKE regexp_replace($1,'[^a-zA-Z0-9%]','','g'))`;}
    const rows=await client.query<any>(`SELECT j.id,rv.checked_in_at,c.display_name customer_name,v.normalized_registration registration
      FROM workshopos.reception_job_card j JOIN workshopos.reception_visit rv ON rv.id=j.visit_id AND rv.tenant_id=j.tenant_id AND rv.branch_id=j.branch_id
      JOIN workshopos.customer c ON c.id=j.customer_id AND c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id
      JOIN workshopos.vehicle v ON v.id=j.vehicle_id AND v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id
      WHERE NOT EXISTS(SELECT 1 FROM workshopos.job_archive_event a WHERE a.job_id=j.id) ${condition}
      ORDER BY rv.checked_in_at DESC,j.id LIMIT 50`,values);
    return{jobs:rows.rows.map(row=>({id:row.id,jobNumber:`JOB-${String(row.id).slice(0,8).toUpperCase()}`,checkedInAt:row.checked_in_at.toISOString(),customerName:row.customer_name,registration:row.registration??""})),search:needle};
  });}

  private async jobLifecycleProjection(client:PoolClient,membership:Membership,id:string){
    const row=(await client.query<any>(`SELECT lr.stage,lr.resource_version::int version,lr.last_operational_stage,j.branch_id,
      coalesce((SELECT event_kind='HOLD' FROM workshopos.job_lifecycle_overlay_event e WHERE e.job_id=j.id ORDER BY e.occurred_at DESC,e.id DESC LIMIT 1),false) held,
      EXISTS(SELECT 1 FROM workshopos.job_archive_event a WHERE a.job_id=j.id) archived,
      (EXISTS(SELECT 1 FROM workshopos.job_lifecycle_fact f WHERE f.job_id=j.id AND f.fact_kind='ESTIMATE_APPROVED') OR EXISTS(SELECT 1 FROM workshopos.estimate_scope_activation a WHERE a.job_id=j.id)) estimate_approved,
      EXISTS(SELECT 1 FROM workshopos.job_lifecycle_fact f WHERE f.job_id=j.id AND f.fact_kind='WORK_ACCEPTED') work_accepted,
      EXISTS(SELECT 1 FROM workshopos.job_lifecycle_fact f WHERE f.job_id=j.id AND f.fact_kind='PAYMENT_CLEARED') payment_cleared,
      EXISTS(SELECT 1 FROM workshopos.native_invoice i WHERE i.job_id=j.id AND i.status='FINALIZED') invoice_finalized,
      EXISTS(SELECT 1 FROM workshopos.gate_pass g WHERE g.job_id=j.id AND g.status IN('ISSUED','RELEASED')) gate_pass_issued,
      EXISTS(SELECT 1 FROM workshopos.gate_release r WHERE r.job_id=j.id) gate_verified,
      NOT EXISTS(SELECT 1 FROM workshopos.technician_task t WHERE t.job_id=j.id AND t.status<>'COMPLETED') work_complete,
      (EXISTS(SELECT 1 FROM workshopos.qc_task_state q WHERE q.job_id=j.id) AND NOT EXISTS(SELECT 1 FROM workshopos.qc_task_state q WHERE q.job_id=j.id AND q.qc_status NOT IN('PASSED','OVERRIDDEN'))) qc_passed,
      NOT EXISTS(SELECT 1 FROM workshopos.job_material_issue i WHERE i.job_id=j.id AND NOT EXISTS(SELECT 1 FROM workshopos.job_material_reconciliation r WHERE r.job_id=i.job_id AND r.task_id=i.task_id AND r.item_id=i.item_id AND r.uom=i.uom)) materials_reconciled,
      NOT EXISTS(SELECT 1 FROM workshopos.estimate_stream es WHERE es.job_id=j.id AND es.kind='SUPPLEMENTARY' AND NOT EXISTS(SELECT 1 FROM workshopos.estimate_scope_activation a WHERE a.job_id=j.id AND a.estimate_version_id IN(SELECT ev.id FROM workshopos.estimate_version ev WHERE ev.estimate_stream_id=es.id))) supplementary_scope_resolved,
      NOT EXISTS(SELECT 1 FROM workshopos.custody_incident c WHERE c.job_id=j.id AND c.status='OPEN') incidents_resolved,
      EXISTS(SELECT 1 FROM workshopos.delivery_evidence d WHERE d.job_id=j.id) delivery_evidence_captured
      FROM workshopos.reception_job_card j JOIN workshopos.lifecycle_resources lr ON lr.id=j.id AND lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id AND lr.resource_type='JOB' WHERE j.id=$1`,[id])).rows[0];
    if(!row)throw new ApiError(404,"JOB_NOT_FOUND");
    const projection=projectJobLifecycle({stage:row.stage,version:Number(row.version),held:row.held,archived:row.archived,resumeStage:row.last_operational_stage??undefined,facts:{estimateApproved:row.estimate_approved,workAccepted:row.work_accepted,paymentCleared:row.payment_cleared,invoiceFinalized:row.invoice_finalized,gatePassIssued:row.gate_pass_issued,gateVerified:row.gate_verified,vehicleReleased:row.gate_verified,workComplete:row.work_complete,qcPassed:row.qc_passed,materialsReconciled:row.materials_reconciled,supplementaryScopeResolved:row.supplementary_scope_resolved,incidentsResolved:row.incidents_resolved,deliveryEvidenceCaptured:row.delivery_evidence_captured}});
    const history=(await client.query<any>(`SELECT kind,label,at,actor,reason,audit_reference FROM (
      SELECT 'STAGE' kind,coalesce(from_stage,'Created')||' → '||to_stage label,occurred_at at,actor_identity_id actor,reason,audit_reference FROM workshopos.lifecycle_history WHERE resource_id=$1
      UNION ALL SELECT event_kind,event_kind||' at '||underlying_stage,e.occurred_at,coalesce(m.display_name,m.identity_subject),e.reason,e.audit_reference::text FROM workshopos.job_lifecycle_overlay_event e JOIN workshopos.membership m ON m.id=e.actor_membership_id WHERE e.job_id=$1
      UNION ALL SELECT 'FACT',replace(fact_kind,'_',' '),f.occurred_at,coalesce(m.display_name,m.identity_subject),f.evidence->>'note',f.audit_reference::text FROM workshopos.job_lifecycle_fact f JOIN workshopos.membership m ON m.id=f.actor_membership_id WHERE f.job_id=$1
      UNION ALL SELECT 'ARCHIVE','JOB ARCHIVED',a.occurred_at,coalesce(m.display_name,m.identity_subject),a.reason,a.audit_reference::text FROM workshopos.job_archive_event a JOIN workshopos.membership m ON m.id=a.actor_membership_id WHERE a.job_id=$1
    ) events ORDER BY at,audit_reference`,[id])).rows.map((item:any)=>({kind:item.kind,label:item.label,at:item.at.toISOString(),actor:item.actor,reason:item.reason??undefined,auditReference:item.audit_reference}));
    return{...projection,branchId:row.branch_id,resumeStage:row.last_operational_stage??undefined,history};
  }

  async downloadJobDocument(membership:Membership,id:string){return this.inScope(membership,async(client)=>{const result=await client.query<any>(`SELECT dc.content,dc.mime_type,dc.filename FROM workshopos.job_document_content dc JOIN workshopos.rendered_document d ON d.id=dc.document_id AND d.tenant_id=dc.tenant_id AND d.branch_id=dc.branch_id WHERE d.id=$1 AND ((d.document_type='ESTIMATE' AND EXISTS(SELECT 1 FROM workshopos.estimate_version ev WHERE ev.id=d.source_id AND ev.tenant_id=d.tenant_id AND ev.branch_id=d.branch_id AND ev.status IN('SENT','APPROVED','PARTIALLY_APPROVED'))) OR (d.document_type='INVOICE' AND EXISTS(SELECT 1 FROM workshopos.native_invoice ni JOIN workshopos.native_invoice_document nd ON nd.entity_id=ni.id AND nd.tenant_id=ni.tenant_id AND nd.branch_id=ni.branch_id AND nd.entity_type='INVOICE' AND nd.scan_status='CLEAN' WHERE ni.id=d.source_id AND ni.tenant_id=d.tenant_id AND ni.branch_id=d.branch_id AND ni.status='FINALIZED')) OR (d.document_type='RECEIPT' AND EXISTS(SELECT 1 FROM workshopos.financial_event fe WHERE fe.id=d.source_id AND fe.tenant_id=d.tenant_id AND fe.branch_id=d.branch_id AND fe.event_kind='PAYMENT_RECEIPT')) OR (d.document_type='GATE_PASS' AND EXISTS(SELECT 1 FROM workshopos.gate_pass gp WHERE gp.id=d.source_id AND gp.tenant_id=d.tenant_id AND gp.branch_id=d.branch_id AND gp.status IN('ISSUED','RELEASED'))))`,[id]);if(!result.rowCount)throw new ApiError(404,"JOB_DOCUMENT_NOT_FOUND");if(result.rowCount!==1)throw new ApiError(409,"JOB_DOCUMENT_REFERENCE_AMBIGUOUS");return{content:result.rows[0].content as Buffer,mimeType:result.rows[0].mime_type as string,filename:result.rows[0].filename as string};});}

  private mapMedia(row:any,visitDate:string):JobMediaRecord{return{id:row.media_id,jobId:row.job_id,branchId:row.branch_id,jobNumber:`JOB-${String(row.job_id).slice(0,8).toUpperCase()}`,visitDate,customerName:row.customer_name,registration:row.registration??"",label:row.label,category:row.category,fileName:row.file_name,mimeType:row.mime_type,byteLength:Number(row.byte_length),scanStatus:row.scan_status,thumbnailDataUrl:`data:${row.thumbnail_mime_type};base64,${(row.thumbnail_bytes as Buffer).toString("base64")}`,available:row.scan_status==="CLEAN"&&!row.archived_at,archived:Boolean(row.archived_at),version:Number(row.version),createdAt:row.created_at.toISOString()};}

  private mapJob(row:any,timezone:string):JobRecord{return{id:row.id,tenantId:row.tenant_id,branchId:row.branch_id,jobNumber:`JOB-${String(row.id).slice(0,8).toUpperCase()}`,visitId:row.visit_id,visitDate:new Intl.DateTimeFormat("en-CA",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit"}).format(row.checked_in_at),checkedInAt:row.checked_in_at.toISOString(),customerName:row.customer_name,registration:row.registration??"",vehicleDescription:[row.attributes?.make,row.attributes?.model].filter(Boolean).join(" "),customerRequest:row.customer_request,promisedHandoffAt:row.promised_handoff_at.toISOString(),stage:row.stage,statusLabel:jobStageLabel(row.stage),version:Number(row.resource_version),updatedAt:row.updated_at.toISOString(),documents:row.documents??[],settingsSnapshotCaptured:Boolean(row.snapshot_captured)};}

  async queryEstimates(membership:Membership,search="",branchId="") { if(branchId&&!membership.branchIds.includes(branchId))throw new ApiError(403,"BRANCH_FORBIDDEN");return this.inScope(membership,async client=>{const values:unknown[]=[];const where=["true"];if(search.trim()){values.push(`%${search.trim()}%`);where.push(`(ev.document_number ILIKE $${values.length} OR ev.notes ILIKE $${values.length} OR es.job_id::text ILIKE $${values.length})`);}if(branchId){values.push(branchId);where.push(`ev.branch_id=$${values.length}`);}const rows=await client.query<any>(`SELECT ev.*,es.job_id,(SELECT max(v.revision) FROM workshopos.estimate_version v WHERE v.estimate_stream_id=ev.estimate_stream_id) latest_revision,ao.outcome,ao.evidence,ao.recorded_at,ao.receipt_reference FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id LEFT JOIN workshopos.estimate_approval_outcome ao ON ao.estimate_version_id=ev.id AND ao.tenant_id=ev.tenant_id AND ao.branch_id=ev.branch_id WHERE ${where.join(" AND ")} ORDER BY ev.created_at DESC,ev.id`,values);return{estimates:rows.rows.map(row=>this.mapEstimate(row)),totalCount:rows.rowCount??0};}); }

  async createEstimateVersion(membership:Membership,input:{branchId:string;jobId:string;priorVersionId?:string;notes:string;totalMinor:string;validDays:number},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");if(!membership.branchIds.includes(input.branchId))throw new ApiError(403,"BRANCH_FORBIDDEN");if(!key.trim())throw new ApiError(400,"IDEMPOTENCY_KEY_REQUIRED");if(!/^\d+$/.test(input.totalMinor)||BigInt(input.totalMinor)<0n)throw new ApiError(422,"ESTIMATE_TOTAL_INVALID");if(!Number.isInteger(input.validDays)||input.validDays<1||input.validDays>90)throw new ApiError(422,"ESTIMATE_VALIDITY_INVALID");return this.inScope(membership,async client=>this.operationalCommand(client,membership,input.branchId,key,{action:"estimate-version",input},async()=>{const job=(await client.query<any>("SELECT customer_id FROM workshopos.reception_job_card WHERE id=$1 AND branch_id=$2",[input.jobId,input.branchId])).rows[0];if(!job)throw new ApiError(404,"JOB_NOT_FOUND");let streamId=randomUUID(),revision=1,priorId:null|string=null;if(input.priorVersionId){const prior=(await client.query<any>(`SELECT ev.id,ev.estimate_stream_id,ev.revision,es.job_id FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=$1 AND ev.branch_id=$2`,[input.priorVersionId,input.branchId])).rows[0];if(!prior)throw new ApiError(404,"ESTIMATE_NOT_FOUND");if(prior.job_id!==input.jobId)throw new ApiError(422,"ESTIMATE_JOB_MISMATCH");const latest=(await client.query<{revision:string}>("SELECT max(revision)::text revision FROM workshopos.estimate_version WHERE estimate_stream_id=$1",[prior.estimate_stream_id])).rows[0];if(Number(latest.revision)!==Number(prior.revision))throw new ApiError(409,"ESTIMATE_SUPERSEDED");streamId=prior.estimate_stream_id;revision=Number(prior.revision)+1;priorId=prior.id;}else await client.query("INSERT INTO workshopos.estimate_stream(tenant_id,branch_id,id,job_id,kind,scope_handoff_id) VALUES($1,$2,$3,$4,'PRIMARY',$5)",[membership.tenantId,input.branchId,streamId,input.jobId,randomUUID()]);const id=randomUUID(),lineId=randomUUID(),now=new Date();const totals={subtotalMinor:input.totalMinor,discountMinor:"0",taxableMinor:input.totalMinor,taxMinor:"0",grandTotalMinor:input.totalMinor,currency:"INR"};await client.query(`INSERT INTO workshopos.estimate_version(tenant_id,branch_id,id,estimate_stream_id,revision,prior_version_id,configuration_version_id,status,totals,payer_totals,resource_version,created_at,notes,supersedes_version_id) VALUES($1,$2,$3,$4,$5,$6,'v12-production','DRAFT',$7::jsonb,$8::jsonb,1,$9,$10,$6)`,[membership.tenantId,input.branchId,id,streamId,revision,priorId,JSON.stringify(totals),JSON.stringify([{payerId:job.customer_id,amountMinor:input.totalMinor}]),now,input.notes.trim()]);await client.query(`INSERT INTO workshopos.estimate_line(tenant_id,branch_id,estimate_version_id,id,configuration_line_id,scope_code,kind,quantity,unit_price_minor,discount_minor,tax_rate_bps,total_minor,partial_approval_allowed) VALUES($1,$2,$3,$4,'v12-production-line','GENERAL','SERVICE',1,$5,0,0,$5,false)`,[membership.tenantId,input.branchId,id,lineId,input.totalMinor]);if(BigInt(input.totalMinor)>0n)await client.query("INSERT INTO workshopos.estimate_payer_allocation(tenant_id,branch_id,estimate_version_id,estimate_line_id,payer_id,amount_minor) VALUES($1,$2,$3,$4,$5,$6)",[membership.tenantId,input.branchId,id,lineId,job.customer_id,input.totalMinor]);const row=(await client.query<any>(`SELECT ev.*,es.job_id,ev.revision latest_revision FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=$1`,[id])).rows[0];return{estimate:this.mapEstimate(row)};}));}

  async updateEstimateDraft(membership:Membership,id:string,input:{version:number;notes:string;totalMinor:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");if(!/^\d+$/.test(input.totalMinor)||BigInt(input.totalMinor)<0n)throw new ApiError(422,"ESTIMATE_TOTAL_INVALID");return this.inScope(membership,async client=>{const current=(await client.query<any>(`SELECT ev.*,es.job_id,j.customer_id,(SELECT max(revision) FROM workshopos.estimate_version WHERE estimate_stream_id=ev.estimate_stream_id) latest_revision FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id JOIN workshopos.reception_job_card j ON j.id=es.job_id AND j.tenant_id=es.tenant_id AND j.branch_id=es.branch_id WHERE ev.id=$1 FOR UPDATE OF ev`,[id])).rows[0];if(!current)throw new ApiError(404,"ESTIMATE_NOT_FOUND");return this.operationalCommand(client,membership,current.branch_id,key,{action:"estimate-edit",id,input},async()=>{if(current.status!=="DRAFT")throw new ApiError(409,"ESTIMATE_NOT_DRAFT");if(Number(current.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(Number(current.revision)!==Number(current.latest_revision))throw new ApiError(409,"ESTIMATE_SUPERSEDED");const totals={subtotalMinor:input.totalMinor,discountMinor:"0",taxableMinor:input.totalMinor,taxMinor:"0",grandTotalMinor:input.totalMinor,currency:"INR"};await client.query("UPDATE workshopos.estimate_version SET notes=$1,totals=$2::jsonb,payer_totals=$3::jsonb,resource_version=resource_version+1 WHERE id=$4",[input.notes.trim(),JSON.stringify(totals),JSON.stringify([{payerId:current.customer_id,amountMinor:input.totalMinor}]),id]);const line=(await client.query<{id:string}>("UPDATE workshopos.estimate_line SET unit_price_minor=$1,total_minor=$1 WHERE estimate_version_id=$2 RETURNING id",[input.totalMinor,id])).rows[0];await client.query("DELETE FROM workshopos.estimate_payer_allocation WHERE estimate_version_id=$1",[id]);if(BigInt(input.totalMinor)>0n)await client.query("INSERT INTO workshopos.estimate_payer_allocation(tenant_id,branch_id,estimate_version_id,estimate_line_id,payer_id,amount_minor) VALUES($1,$2,$3,$4,$5,$6)",[membership.tenantId,current.branch_id,id,line.id,current.customer_id,input.totalMinor]);const row=(await client.query<any>(`SELECT ev.*,es.job_id,ev.revision latest_revision FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=$1`,[id])).rows[0];return{estimate:this.mapEstimate(row)};});});}

  async submitEstimate(membership:Membership,id:string,input:{version:number;validDays:number},key:string){
    if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");
    if(!Number.isInteger(input.validDays)||input.validDays<1||input.validDays>90)throw new ApiError(422,"ESTIMATE_VALIDITY_INVALID");
    return this.inScope(membership,async client=>{
      const current=(await client.query<any>(`SELECT ev.*,es.job_id,(SELECT max(revision) FROM workshopos.estimate_version WHERE estimate_stream_id=ev.estimate_stream_id) latest_revision FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=$1 FOR UPDATE OF ev`,[id])).rows[0];
      if(!current)throw new ApiError(404,"ESTIMATE_NOT_FOUND");
      return this.operationalCommand(client,membership,current.branch_id,key,{action:"estimate-submit",id,input},async()=>{
        if(current.status!=="DRAFT")throw new ApiError(409,"ESTIMATE_NOT_DRAFT");
        if(Number(current.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");
        if(Number(current.revision)!==Number(current.latest_revision))throw new ApiError(409,"ESTIMATE_SUPERSEDED");
        const now=new Date(),year=now.getUTCFullYear(),number=`EST-${year}-${id.slice(0,8).toUpperCase()}`;
        await client.query("UPDATE workshopos.estimate_version SET status='SENT',document_number=$1,financial_year=$2,valid_until=transaction_timestamp()+($3||' days')::interval,sent_at=transaction_timestamp(),resource_version=resource_version+1 WHERE id=$4",[number,`${year}-${String((year+1)%100).padStart(2,"0")}`,input.validDays,id]);
        const row=(await client.query<any>(`SELECT ev.*,es.job_id,ev.revision latest_revision FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=$1`,[id])).rows[0];
        const estimate=this.mapEstimate(row),artifact=createEstimateDocument(estimate),documentId=randomUUID(),auditReference=randomUUID();
        const checksum=createHash("sha256").update(artifact.content).digest("hex");
        await client.query(`INSERT INTO workshopos.rendered_document(tenant_id,branch_id,id,document_type,source_id,public_reference,template_version,artifacts,private_object_ref,content_sha256,rendered_at,audit_reference) VALUES($1,$2,$3,'ESTIMATE',$4,$5,$6,$7::jsonb,$8,$9,transaction_timestamp(),$10)`,[membership.tenantId,current.branch_id,documentId,id,number,Number(row.revision),JSON.stringify([{mimeType:artifact.mimeType,filename:artifact.filename,byteLength:artifact.content.byteLength}]),`private/estimates/${id}/${artifact.filename}`,checksum,auditReference]);
        await client.query("INSERT INTO workshopos.job_document_content(tenant_id,branch_id,document_id,content,mime_type,filename) VALUES($1,$2,$3,$4,$5,$6)",[membership.tenantId,current.branch_id,documentId,artifact.content,artifact.mimeType,artifact.filename]);
        return{estimate};
      });
    });
  }

  async approveEstimate(membership:Membership,id:string,input:{version:number;customerName:string;acknowledgement:string},key:string){
    if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");
    return this.inScope(membership,async client=>{
      const current=(await client.query<any>(`SELECT ev.*,es.job_id,(SELECT max(revision) FROM workshopos.estimate_version WHERE estimate_stream_id=ev.estimate_stream_id) latest_revision FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=$1 FOR UPDATE OF ev`,[id])).rows[0];
      if(!current)throw new ApiError(404,"ESTIMATE_NOT_FOUND");
      return this.operationalCommand(client,membership,current.branch_id,key,{action:"estimate-approve",id,input},async()=>{
        if(current.status!=="SENT"||new Date(current.valid_until).getTime()<Date.now())throw new ApiError(409,"ESTIMATE_NOT_ACTIONABLE");
        if(Number(current.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");
        if(Number(current.revision)!==Number(current.latest_revision))throw new ApiError(409,"ESTIMATE_SUPERSEDED");
        if(!input.customerName.trim()||!input.acknowledgement.trim())throw new ApiError(422,"APPROVAL_EVIDENCE_REQUIRED");
        const lineIds=(await client.query<{id:string}>("SELECT id FROM workshopos.estimate_line WHERE estimate_version_id=$1",[id])).rows.map(x=>x.id);
        const outcomeId=randomUUID(),activationId=randomUUID(),audit=randomUUID(),receipt=`EST-APP-${id.slice(0,8).toUpperCase()}`,evidence={customerName:input.customerName.trim(),acknowledgement:input.acknowledgement.trim()};
        const configurationSnapshot={PRICE:{version:1},TAX:{version:1},WORKFLOW:{version:1},RECIPE:{version:1},CHECKLIST:{version:1},POLICY:{version:1}};
        await client.query(`INSERT INTO workshopos.estimate_approval_outcome(tenant_id,branch_id,id,estimate_version_id,outcome,selected_line_ids,source,evidence,checker_membership_id,receipt_reference,recorded_at) VALUES($1,$2,$3,$4,'APPROVE_ALL',$5::jsonb,'MANUAL',$6::jsonb,$7,$8,transaction_timestamp())`,[membership.tenantId,current.branch_id,outcomeId,id,JSON.stringify(lineIds),JSON.stringify(evidence),membership.id,receipt]);
        await client.query(`INSERT INTO workshopos.estimate_scope_activation(tenant_id,branch_id,id,estimate_version_id,job_id,approval_outcome_id,approved_line_ids,configuration_snapshot,activated_at) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,transaction_timestamp())`,[membership.tenantId,current.branch_id,activationId,id,current.job_id,outcomeId,JSON.stringify(lineIds),JSON.stringify(configurationSnapshot)]);
        const outboxPayload=JSON.stringify({jobId:current.job_id,estimateVersionId:id,approvalOutcomeId:outcomeId,approvedLineIds:lineIds,configurationSnapshot});
        for(const eventType of ["APPROVED_SCOPE_WORK_PLANNING","APPROVED_SCOPE_MATERIAL_CONTROL"]){
          await client.query("INSERT INTO workshopos.estimate_outbox(tenant_id,branch_id,id,activation_id,event_type,payload) VALUES($1,$2,$3,$4,$5,$6::jsonb)",[membership.tenantId,current.branch_id,randomUUID(),activationId,eventType,outboxPayload]);
        }
        await client.query("UPDATE workshopos.estimate_version SET status='APPROVED',resource_version=resource_version+1 WHERE id=$1",[id]);
        await client.query(`INSERT INTO workshopos.job_lifecycle_fact(tenant_id,branch_id,id,job_id,fact_kind,evidence,actor_membership_id,audit_reference) VALUES($1,$2,$3,$4,'ESTIMATE_APPROVED',$5::jsonb,$6,$7) ON CONFLICT(tenant_id,branch_id,job_id,fact_kind) DO NOTHING`,[membership.tenantId,current.branch_id,randomUUID(),current.job_id,JSON.stringify({estimateVersionId:id,receiptReference:receipt,...evidence}),membership.id,audit]);
        await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[current.job_id]);
        const row=(await client.query<any>(`SELECT ev.*,es.job_id,ev.revision latest_revision,ao.outcome,ao.evidence,ao.recorded_at,ao.receipt_reference FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id LEFT JOIN workshopos.estimate_approval_outcome ao ON ao.estimate_version_id=ev.id WHERE ev.id=$1`,[id])).rows[0];
        return{estimate:this.mapEstimate(row),auditReference:audit};
      });
    });
  }

  async getEstimateDocument(membership:Membership,id:string){return this.inScope(membership,async client=>{const row=(await client.query<any>(`SELECT ev.*,es.job_id FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE ev.id=$1 AND ev.status IN('SENT','APPROVED','PARTIALLY_APPROVED')`,[id])).rows[0];if(!row)throw new ApiError(404,"ESTIMATE_DOCUMENT_NOT_FOUND");return this.mapEstimate({...row,latest_revision:row.revision});});}

  async queryTasks(membership:Membership){return this.inScope(membership,async client=>{const rows=await client.query<any>(`SELECT t.*,coalesce(array_agg(DISTINCT d.depends_on_task_id) FILTER(WHERE d.depends_on_task_id IS NOT NULL),'{}') dependencies,coalesce((SELECT count(*) FROM workshopos.technician_task_evidence e WHERE e.task_id=t.task_id),0)::int evidence_count FROM workshopos.technician_task t LEFT JOIN workshopos.work_task_dependency d ON d.task_id=t.task_id AND d.tenant_id=t.tenant_id AND d.branch_id=t.branch_id GROUP BY t.tenant_id,t.branch_id,t.task_id ORDER BY t.updated_at DESC,t.task_id`);const completed=new Set<string>(rows.rows.filter((x:any)=>x.status==="COMPLETED").map((x:any)=>String(x.task_id)));return{tasks:rows.rows.map((row:any)=>this.mapTask(row,completed))};});}

  async assignTask(membership:Membership,id:string,input:{version:number;technicianId:string},key:string){
    if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");
    return this.inScope(membership,async client=>{
      const row=(await client.query<any>(`SELECT t.*,wt.resource_version planning_version,wt.technician_ids planning_technician_ids,
        wt.responsible_technician_id planning_responsible_technician_id,wt.capacity_warnings,
        lr.stage job_stage,coalesce((SELECT event_kind='HOLD' FROM workshopos.job_lifecycle_overlay_event o
          WHERE o.job_id=t.job_id ORDER BY o.occurred_at DESC,o.id DESC LIMIT 1),false) held
        FROM workshopos.technician_task t
        JOIN workshopos.work_task wt ON wt.id=t.task_id AND wt.tenant_id=t.tenant_id AND wt.branch_id=t.branch_id
        JOIN workshopos.lifecycle_resources lr ON lr.id=t.job_id AND lr.tenant_id=t.tenant_id AND lr.branch_id=t.branch_id AND lr.resource_type='JOB'
        WHERE t.task_id=$1 FOR UPDATE OF t,wt`,[id])).rows[0];
      if(!row)throw new ApiError(404,"TASK_NOT_FOUND");
      return this.operationalCommand(client,membership,row.branch_id,key,{action:"task-assign",id,input},async()=>{
        if(Number(row.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");
        if(row.job_stage!=="ACTIVE"||row.held)throw new ApiError(409,row.held?"JOB_ON_HOLD":"TASK_LIFECYCLE_BLOCKED");
        if(!input.technicianId)throw new ApiError(422,"TECHNICIAN_REQUIRED");
        const technician=await client.query("SELECT 1 FROM workshopos.membership m JOIN workshopos.membership_branch b ON b.membership_id=m.id AND b.tenant_id=m.tenant_id WHERE m.id=$1 AND b.branch_id=$2 AND m.active",[input.technicianId,row.branch_id]);
        if(!technician.rowCount)throw new ApiError(422,"TECHNICIAN_INVALID");
        const now=new Date(),audit=randomUUID(),planningVersion=Number(row.planning_version)+1,nextVersion=Number(row.resource_version)+1;
        await client.query("UPDATE workshopos.work_task SET technician_ids=ARRAY[$1]::uuid[],responsible_technician_id=$1,resource_version=$2 WHERE id=$3",[input.technicianId,planningVersion,id]);
        await client.query(`INSERT INTO workshopos.work_task_assignment_history
          (tenant_id,branch_id,id,job_id,task_id,task_version,technician_ids,responsible_technician_id,
           previous_technician_ids,previous_responsible_technician_id,capacity_warnings,warnings_acknowledged,
           actor_membership_id,audit_reference,occurred_at)
          VALUES($1,$2,$3,$4,$5,$6,ARRAY[$7]::uuid[],$7,$8,$9,$10::jsonb,true,$11,$12,$13)`,[
          membership.tenantId,row.branch_id,randomUUID(),row.job_id,id,planningVersion,input.technicianId,
          row.planning_technician_ids,row.planning_responsible_technician_id,JSON.stringify(row.capacity_warnings??[]),
          membership.id,audit,now,
        ]);
        await client.query("UPDATE workshopos.technician_task SET technician_ids=ARRAY[$1]::uuid[],responsible_technician_id=$1,resource_version=$2,updated_at=$3 WHERE task_id=$4",[input.technicianId,nextVersion,now,id]);
        const refreshed=(await client.query<any>("SELECT t.*,t.dependency_ids dependencies,(SELECT count(*) FROM workshopos.technician_task_evidence e WHERE e.task_id=t.task_id)::int evidence_count FROM workshopos.technician_task t WHERE task_id=$1",[id])).rows[0];
        return{task:this.mapTask(refreshed,new Set()),auditReference:audit};
      });
    });
  }

  async commandTask(membership:Membership,id:string,input:{action:string;version:number;reason:string;technicianId?:string;checklistKey?:string;evidenceId?:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const row=(await client.query<any>(`SELECT t.*,lr.stage job_stage,coalesce((SELECT event_kind='HOLD' FROM workshopos.job_lifecycle_overlay_event o WHERE o.job_id=t.job_id ORDER BY o.occurred_at DESC,o.id DESC LIMIT 1),false) held FROM workshopos.technician_task t JOIN workshopos.lifecycle_resources lr ON lr.id=t.job_id AND lr.tenant_id=t.tenant_id AND lr.branch_id=t.branch_id AND lr.resource_type='JOB' WHERE t.task_id=$1 FOR UPDATE OF t`,[id])).rows[0];if(!row)throw new ApiError(404,"TASK_NOT_FOUND");return this.operationalCommand(client,membership,row.branch_id,key,{action:"task",id,input},async()=>{if(Number(row.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(row.job_stage!=="ACTIVE"||row.held)throw new ApiError(409,row.held?"JOB_ON_HOLD":"TASK_LIFECYCLE_BLOCKED");const audit=randomUUID(),now=new Date(),nextVersion=input.version+1;if(input.action==="ASSIGN"){if(!input.technicianId)throw new ApiError(422,"TECHNICIAN_REQUIRED");const tech=await client.query("SELECT 1 FROM workshopos.membership m JOIN workshopos.membership_branch b ON b.membership_id=m.id AND b.tenant_id=m.tenant_id WHERE m.id=$1 AND b.branch_id=$2 AND m.active",[input.technicianId,row.branch_id]);if(!tech.rowCount)throw new ApiError(422,"TECHNICIAN_INVALID");await client.query("UPDATE workshopos.technician_task SET technician_ids=ARRAY[$1]::uuid[],responsible_technician_id=$1,resource_version=$2,updated_at=$3 WHERE task_id=$4",[input.technicianId,nextVersion,now,id]);}else{if(!row.technician_ids.includes(membership.id))throw new ApiError(403,"TASK_ASSIGNEE_REQUIRED");if(input.action==="EVIDENCE"){if(!input.checklistKey?.trim()||!input.evidenceId)throw new ApiError(422,"TASK_EVIDENCE_INVALID");const media=(await client.query<any>("SELECT media_id,object_key,checksum_sha256,mime_type,byte_length FROM workshopos.secure_media_object WHERE media_id=$1 AND job_id=$2 AND scan_status='CLEAN' AND archived_at IS NULL",[input.evidenceId,row.job_id])).rows[0];if(!media)throw new ApiError(422,"VERIFIED_CLEAN_EVIDENCE_REQUIRED");const evidenceRef=`${media.object_key}/private/tasks/${media.media_id}`;await client.query(`INSERT INTO workshopos.technician_task_evidence(tenant_id,branch_id,id,task_id,checklist_key,evidence_kind,private_object_ref,content_type,checksum,scan_status,size_bytes,actor_membership_id,audit_reference,captured_at) VALUES($1,$2,$3,$4,$5,'PHOTO',$6,$7,$8,'CLEAN',$9,$10,$11,$12)`,[membership.tenantId,row.branch_id,randomUUID(),id,input.checklistKey.trim(),evidenceRef,media.mime_type,media.checksum_sha256,media.byte_length,membership.id,audit,now]);await client.query("UPDATE workshopos.technician_task SET resource_version=$1,updated_at=$2 WHERE task_id=$3",[nextVersion,now,id]);}else{const transitions:Record<string,[string,string]>={START:["ASSIGNED","IN_PROGRESS"],PAUSE:["IN_PROGRESS","PAUSED"],RESUME:["PAUSED","IN_PROGRESS"],COMPLETE:["IN_PROGRESS","COMPLETED"]};const transition=transitions[input.action];if(!transition||row.status!==transition[0])throw new ApiError(409,"TASK_ACTION_INVALID");if(input.action==="PAUSE"&&!input.reason.trim())throw new ApiError(422,"REASON_REQUIRED");if(input.action==="START"&&row.dependency_ids?.length){const pending=await client.query("SELECT 1 FROM workshopos.technician_task WHERE task_id=ANY($1::uuid[]) AND status<>'COMPLETED' LIMIT 1",[row.dependency_ids]);if(pending.rowCount)throw new ApiError(422,"TASK_DEPENDENCY_BLOCKED");}if(input.action==="COMPLETE"){const checklist=Array.isArray(row.checklist_snapshot)?row.checklist_snapshot:[];const required=checklist.filter((x:any)=>x.required&&x.evidenceRequired);const evidence=await client.query<{checklist_key:string}>("SELECT checklist_key FROM workshopos.technician_task_evidence WHERE task_id=$1",[id]);const keys=new Set(evidence.rows.map(x=>x.checklist_key));if(required.some((x:any)=>!keys.has(x.key)))throw new ApiError(422,"TASK_EVIDENCE_REQUIRED");}await client.query("UPDATE workshopos.technician_task SET status=$1,status_reason=$2,active_started_at=CASE WHEN $1='IN_PROGRESS' THEN transaction_timestamp() ELSE NULL END,resource_version=$3,updated_at=$4 WHERE task_id=$5",[transition[1],input.reason.trim()||null,nextVersion,now,id]);await client.query(`INSERT INTO workshopos.technician_task_status_history(tenant_id,branch_id,id,task_id,task_version,prior_status,new_status,reason,elapsed_seconds,actor_membership_id,audit_reference,occurred_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,[membership.tenantId,row.branch_id,randomUUID(),id,nextVersion,row.status,transition[1],input.reason.trim()||null,row.elapsed_seconds,membership.id,audit,now]);}}const refreshed=(await client.query<any>("SELECT t.*,t.dependency_ids dependencies,(SELECT count(*) FROM workshopos.technician_task_evidence e WHERE e.task_id=t.task_id)::int evidence_count FROM workshopos.technician_task t WHERE task_id=$1",[id])).rows[0];return{task:this.mapTask(refreshed,new Set()),auditReference:audit};});});}

  async queryQc(membership:Membership){return this.inScope(membership,async client=>{const rows=await client.query<any>(`SELECT q.*,t.title,r.id rework_id,r.status rework_status,r.reason rework_reason,r.failed_checklist_keys,r.assigned_technician_membership_id,r.resource_version rework_version FROM workshopos.qc_task_state q JOIN workshopos.technician_task t ON t.task_id=q.task_id AND t.tenant_id=q.tenant_id AND t.branch_id=q.branch_id LEFT JOIN LATERAL(SELECT * FROM workshopos.qc_rework r WHERE r.task_id=q.task_id ORDER BY r.created_at DESC LIMIT 1)r ON true ORDER BY q.updated_at DESC,q.task_id`);return{qc:rows.rows.map((row:any)=>this.mapQc(row))};});}

  async inspectQc(membership:Membership,taskId:string,input:{version:number;result:string;reason:string;items:Array<{key:string;status:string;notes:string}>},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const state=(await client.query<any>("SELECT * FROM workshopos.qc_task_state WHERE task_id=$1 FOR UPDATE",[taskId])).rows[0];if(!state)throw new ApiError(404,"QC_TASK_NOT_FOUND");return this.operationalCommand(client,membership,state.branch_id,key,{action:"qc-inspect",taskId,input},async()=>{if(Number(state.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(state.qc_status!=="PENDING_QC")throw new ApiError(409,"QC_NOT_ACTIONABLE");if(state.technician_membership_ids.includes(membership.id))throw new ApiError(403,"INDEPENDENT_QC_REQUIRED");if(!["PASS","FAIL"].includes(input.result)||!input.reason.trim()||!input.items.length||input.items.some(x=>!["PASS","FAIL","NOT_APPLICABLE"].includes(x.status)||!x.key.trim()||!x.notes.trim()))throw new ApiError(422,"INVALID_QC_CHECKLIST");const inspectionId=randomUUID(),audit=randomUUID(),attempt=Number((await client.query<{count:string}>("SELECT count(*)::text count FROM workshopos.qc_inspection WHERE task_id=$1",[taskId])).rows[0].count)+1;await client.query(`INSERT INTO workshopos.qc_inspection(tenant_id,branch_id,id,job_id,task_id,attempt,checklist_master_id,checklist_version,result,reason,actor_membership_id,occurred_at,audit_reference) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,transaction_timestamp(),$12)`,[membership.tenantId,state.branch_id,inspectionId,state.job_id,taskId,attempt,state.checklist_master_id,state.checklist_version,input.result,input.reason.trim(),membership.id,audit]);for(const item of input.items)await client.query("INSERT INTO workshopos.qc_inspection_item(tenant_id,branch_id,inspection_id,checklist_key,item_status,notes) VALUES($1,$2,$3,$4,$5,$6)",[membership.tenantId,state.branch_id,inspectionId,item.key.trim(),item.status,item.notes.trim()]);const failed=input.items.filter(x=>x.status==="FAIL").map(x=>x.key.trim());let reworkId:string|undefined;if(input.result==="FAIL"){if(!failed.length)throw new ApiError(422,"FAILED_QC_ITEM_REQUIRED");reworkId=randomUUID();await client.query(`INSERT INTO workshopos.qc_rework(tenant_id,branch_id,id,job_id,task_id,failed_inspection_id,failed_checklist_keys,status,reason,created_by_membership_id,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,'BLOCKING',$8,$9,transaction_timestamp(),transaction_timestamp())`,[membership.tenantId,state.branch_id,reworkId,state.job_id,taskId,inspectionId,failed,input.reason.trim(),membership.id]);}await client.query("UPDATE workshopos.qc_task_state SET qc_status=$1,resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE task_id=$2",[input.result==="PASS"?"PASSED":"FAILED",taskId]);return{inspectionId,reworkId,status:input.result==="PASS"?"PASSED":"FAILED",auditReference:audit};});});}

  async commandReworkVerified(membership:Membership,id:string,input:{action:string;version:number;reason:string;technicianId?:string;evidenceId?:string;result?:string;items?:Array<{key:string;status:string;notes:string}>},key:string){let verified:undefined|{privateObjectRef:string;checksum:string};if(input.action==="COMPLETE"){if(!input.evidenceId)throw new ApiError(422,"VERIFIED_CLEAN_EVIDENCE_REQUIRED");verified=await this.inScope(membership,async client=>{const row=(await client.query<any>(`SELECT m.object_key,m.media_id,m.checksum_sha256 FROM workshopos.secure_media_object m JOIN workshopos.qc_rework r ON r.id=$1 AND r.tenant_id=m.tenant_id AND r.branch_id=m.branch_id AND r.job_id=m.job_id WHERE m.media_id=$2 AND m.scan_status='CLEAN' AND m.archived_at IS NULL`,[id,input.evidenceId])).rows[0];if(!row)throw new ApiError(422,"VERIFIED_CLEAN_EVIDENCE_REQUIRED");return{privateObjectRef:`${row.object_key}/private/qc/${row.media_id}`,checksum:row.checksum_sha256};});}return this.commandRework(membership,id,{...input,...verified},key);}

  async commandRework(membership:Membership,id:string,input:{action:string;version:number;reason:string;technicianId?:string;privateObjectRef?:string;checksum?:string;result?:string;items?:Array<{key:string;status:string;notes:string}>},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const rework=(await client.query<any>("SELECT * FROM workshopos.qc_rework WHERE id=$1 FOR UPDATE",[id])).rows[0];if(!rework)throw new ApiError(404,"REWORK_NOT_FOUND");return this.operationalCommand(client,membership,rework.branch_id,key,{action:"rework",id,input},async()=>{if(Number(rework.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(!input.reason.trim())throw new ApiError(422,"REASON_REQUIRED");const lifecycle=(await client.query<any>(`SELECT lr.stage,coalesce((SELECT event_kind='HOLD' FROM workshopos.job_lifecycle_overlay_event o WHERE o.job_id=r.job_id ORDER BY o.occurred_at DESC,o.id DESC LIMIT 1),false) held FROM workshopos.qc_rework r JOIN workshopos.lifecycle_resources lr ON lr.id=r.job_id AND lr.tenant_id=r.tenant_id AND lr.branch_id=r.branch_id WHERE r.id=$1`,[id])).rows[0];if(lifecycle?.stage!=="QC"||lifecycle.held)throw new ApiError(409,lifecycle?.held?"JOB_ON_HOLD":"QC_LIFECYCLE_BLOCKED");const audit=randomUUID(),next=input.version+1,prior=rework.status;let status:string;if(input.action==="ASSIGN"){if(prior!=="BLOCKING"||!input.technicianId)throw new ApiError(409,"REWORK_NOT_ASSIGNABLE");const tech=await client.query("SELECT 1 FROM workshopos.membership m JOIN workshopos.membership_branch b ON b.membership_id=m.id AND b.tenant_id=m.tenant_id WHERE m.id=$1 AND b.branch_id=$2 AND m.active",[input.technicianId,rework.branch_id]);if(!tech.rowCount)throw new ApiError(422,"TECHNICIAN_INVALID");status="ASSIGNED";await client.query("UPDATE workshopos.qc_rework SET status=$1,assigned_technician_membership_id=$2,resource_version=$3,updated_at=transaction_timestamp() WHERE id=$4",[status,input.technicianId,next,id]);}else if(input.action==="COMPLETE"){if(prior!=="ASSIGNED"||rework.assigned_technician_membership_id!==membership.id)throw new ApiError(409,"REWORK_NOT_ASSIGNED_TO_ACTOR");if(!input.privateObjectRef?.includes("/private/qc/")||!/^[0-9a-f]{64}$/.test(input.checksum??""))throw new ApiError(422,"REWORK_EVIDENCE_REQUIRED");status="READY_FOR_REINSPECTION";const evidenceId=randomUUID();await client.query(`INSERT INTO workshopos.qc_evidence(tenant_id,branch_id,id,entity_type,entity_id,evidence_kind,private_object_ref,checksum_sha256,scan_status,actor_membership_id,captured_at) VALUES($1,$2,$3,'REWORK',$4,'PHOTO',$5,$6,'CLEAN',$7,transaction_timestamp())`,[membership.tenantId,rework.branch_id,evidenceId,id,input.privateObjectRef,input.checksum,membership.id]);await client.query("UPDATE workshopos.qc_rework SET status=$1,resource_version=$2,updated_at=transaction_timestamp() WHERE id=$3",[status,next,id]);}else if(input.action==="REINSPECT"){if(prior!=="READY_FOR_REINSPECTION"||rework.assigned_technician_membership_id===membership.id)throw new ApiError(409,"INDEPENDENT_REINSPECTION_REQUIRED");const state=(await client.query<any>("SELECT * FROM workshopos.qc_task_state WHERE task_id=$1 FOR UPDATE",[rework.task_id])).rows[0],items=input.items??[];if(!["PASS","FAIL"].includes(input.result??"")||!items.length||items.some(x=>!["PASS","FAIL","NOT_APPLICABLE"].includes(x.status)||!x.notes.trim()))throw new ApiError(422,"INVALID_QC_CHECKLIST");const inspectionId=randomUUID(),attempt=Number((await client.query<{count:string}>("SELECT count(*)::text count FROM workshopos.qc_inspection WHERE task_id=$1",[rework.task_id])).rows[0].count)+1;await client.query(`INSERT INTO workshopos.qc_inspection(tenant_id,branch_id,id,job_id,task_id,attempt,checklist_master_id,checklist_version,result,reason,actor_membership_id,occurred_at,audit_reference) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,transaction_timestamp(),$12)`,[membership.tenantId,rework.branch_id,inspectionId,rework.job_id,rework.task_id,attempt,state.checklist_master_id,state.checklist_version,input.result,input.reason.trim(),membership.id,audit]);for(const item of items)await client.query("INSERT INTO workshopos.qc_inspection_item(tenant_id,branch_id,inspection_id,checklist_key,item_status,notes) VALUES($1,$2,$3,$4,$5,$6)",[membership.tenantId,rework.branch_id,inspectionId,item.key,item.status,item.notes]);status=input.result==="PASS"?"PASSED":"BLOCKING";await client.query("UPDATE workshopos.qc_rework SET status=$1,resource_version=$2,updated_at=transaction_timestamp() WHERE id=$3",[status,next,id]);await client.query("UPDATE workshopos.qc_task_state SET qc_status=$1,resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE task_id=$2",[input.result==="PASS"?"PASSED":"FAILED",rework.task_id]);}else throw new ApiError(400,"REWORK_ACTION_INVALID");await client.query(`INSERT INTO workshopos.qc_rework_history(tenant_id,branch_id,id,rework_id,prior_status,new_status,reason,actor_membership_id,occurred_at,audit_reference) VALUES($1,$2,$3,$4,$5,$6,$7,$8,transaction_timestamp(),$9)`,[membership.tenantId,rework.branch_id,randomUUID(),id,prior,status,input.reason.trim(),membership.id,audit]);return{rework:{id,status,version:next},auditReference:audit};});});}

  private mapEstimate(row:any):ProductionEstimate{return{id:row.id,streamId:row.estimate_stream_id,jobId:row.job_id,branchId:row.branch_id,jobNumber:`JOB-${String(row.job_id).slice(0,8).toUpperCase()}`,revision:Number(row.revision),status:row.status,documentNumber:row.document_number??undefined,notes:row.notes,totalMinor:String(row.totals?.grandTotalMinor??"0"),currency:String(row.totals?.currency??"INR"),validUntil:row.valid_until?.toISOString(),version:Number(row.resource_version),superseded:Number(row.revision)<Number(row.latest_revision),createdAt:row.created_at.toISOString(),approval:row.outcome?{outcome:row.outcome,evidence:row.evidence,recordedAt:row.recorded_at.toISOString(),receiptReference:row.receipt_reference}:undefined};}
  private mapTask(row:any,completed:Set<string>):ProductionTask{const dependencies=(row.dependencies??row.dependency_ids??[]) as string[];return{id:row.task_id,jobId:row.job_id,branchId:row.branch_id,jobNumber:`JOB-${String(row.job_id).slice(0,8).toUpperCase()}`,title:row.title,status:row.status,priority:row.priority,estimatedMinutes:Number(row.estimated_minutes),technicianIds:row.technician_ids,responsibleTechnicianId:row.responsible_technician_id,dependencies,blockedBy:dependencies.filter(id=>!completed.has(id)),checklist:row.checklist_snapshot,evidenceCount:Number(row.evidence_count),version:Number(row.resource_version),updatedAt:row.updated_at.toISOString()};}
  private mapQc(row:any):ProductionQc{return{taskId:row.task_id,jobId:row.job_id,branchId:row.branch_id,jobNumber:`JOB-${String(row.job_id).slice(0,8).toUpperCase()}`,title:row.title,status:row.qc_status,technicianIds:row.technician_membership_ids,version:Number(row.resource_version),updatedAt:row.updated_at.toISOString(),rework:row.rework_id?{id:row.rework_id,status:row.rework_status,reason:row.rework_reason,failedChecklistKeys:row.failed_checklist_keys,assignedTechnicianId:row.assigned_technician_membership_id??undefined,version:Number(row.rework_version)}:undefined};}
  async getBillingJob(membership:Membership,id:string):Promise<BillingJob>{return this.inScope(membership,async client=>{
    const row=(await client.query<any>(`SELECT j.id,j.branch_id,lr.stage,lr.resource_version,c.display_name customer_name,v.normalized_registration registration,
      ni.id invoice_id,ni.document_number,ni.payable_minor,ni.resource_version invoice_version,
      coalesce((SELECT sum(CASE WHEN fe.event_kind IN('PAYMENT_RECEIPT','ADVANCE_RECEIPT') THEN fe.amount_minor ELSE -fe.amount_minor END) FROM workshopos.financial_event fe WHERE fe.job_id=j.id AND fe.invoice_id=ni.id),0) paid_minor,
      EXISTS(SELECT 1 FROM workshopos.job_lifecycle_fact f WHERE f.job_id=j.id AND f.fact_kind='WORK_ACCEPTED') work_accepted,
      EXISTS(SELECT 1 FROM workshopos.job_lifecycle_fact f WHERE f.job_id=j.id AND f.fact_kind='PAYMENT_CLEARED') payment_cleared,
      EXISTS(SELECT 1 FROM workshopos.delivery_evidence de WHERE de.job_id=j.id) delivery_recorded,
      gp.id gate_id,gp.document_number gate_number,gp.status gate_status,gp.resource_version gate_version,gp.valid_until,
      EXISTS(SELECT 1 FROM workshopos.gate_release gr WHERE gr.job_id=j.id) released
      FROM workshopos.reception_job_card j JOIN workshopos.lifecycle_resources lr ON lr.id=j.id AND lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id
      JOIN workshopos.customer c ON c.id=j.customer_id AND c.tenant_id=j.tenant_id AND c.branch_id=j.branch_id JOIN workshopos.vehicle v ON v.id=j.vehicle_id AND v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id
      LEFT JOIN LATERAL(SELECT * FROM workshopos.native_invoice x WHERE x.job_id=j.id AND x.status='FINALIZED' ORDER BY x.finalized_at DESC LIMIT 1) ni ON true
      LEFT JOIN LATERAL(SELECT * FROM workshopos.gate_pass x WHERE x.job_id=j.id ORDER BY x.valid_from DESC LIMIT 1) gp ON true WHERE j.id=$1`,[id])).rows[0];
    if(!row)throw new ApiError(404,"JOB_NOT_FOUND");
    const payments=(await client.query<any>("SELECT id,event_kind,amount_minor,payment_mode,external_reference,occurred_at FROM workshopos.financial_event WHERE job_id=$1 ORDER BY occurred_at,id",[id])).rows.map((x:any)=>({id:x.id,kind:x.event_kind,amountMinor:String(x.amount_minor),mode:x.payment_mode,reference:x.external_reference,occurredAt:x.occurred_at.toISOString()}));
    const corrections=(await client.query<any>(`SELECT pc.id,pc.correction_kind,pc.amount_minor,pc.status,pc.resource_version FROM workshopos.payment_correction pc JOIN workshopos.financial_event fe ON fe.id=pc.original_financial_event_id AND fe.tenant_id=pc.tenant_id AND fe.branch_id=pc.branch_id WHERE fe.job_id=$1 ORDER BY pc.created_at`,[id])).rows.map((x:any)=>({id:x.id,kind:x.correction_kind,amountMinor:String(x.amount_minor),status:x.status,version:Number(x.resource_version)}));
    const invoiceCorrections=row.invoice_id?(await client.query<any>("SELECT id,adjustment_type,total_minor,status,resource_version,document_number FROM workshopos.native_invoice_adjustment WHERE invoice_id=$1 ORDER BY requested_at,id",[row.invoice_id])).rows.map((x:any)=>({id:x.id,kind:x.adjustment_type,amountMinor:String(x.total_minor),status:x.status,version:Number(x.resource_version),documentNumber:x.document_number??undefined})):[];
    const originalPayable=BigInt(row.payable_minor??0),credit=invoiceCorrections.filter((x:any)=>x.status==="FINALIZED"&&["CREDIT_NOTE","CANCEL_REISSUE"].includes(x.kind)).reduce((sum:bigint,x:any)=>sum+BigInt(x.amountMinor),0n),payable=originalPayable-credit,paid=BigInt(row.paid_minor??0);
    return{id:row.id,branchId:row.branch_id,jobNumber:`JOB-${row.id.slice(0,8).toUpperCase()}`,stage:row.stage,version:Number(row.resource_version),customerName:row.customer_name,registration:row.registration,invoice:row.invoice_id?{id:row.invoice_id,number:row.document_number,originalPayableMinor:String(originalPayable),creditMinor:String(credit),payableMinor:String(payable),version:Number(row.invoice_version)}:undefined,paidMinor:String(paid),balanceMinor:String(payable-paid),workAccepted:row.work_accepted,paymentCleared:row.payment_cleared&&payable===paid,deliveryRecorded:row.delivery_recorded,gatePass:row.gate_id?{id:row.gate_id,number:row.gate_number,status:row.gate_status,version:Number(row.gate_version),validUntil:row.valid_until.toISOString()}:undefined,released:row.released,closed:row.stage==='CLOSED',payments,corrections,invoiceCorrections};
  });}

  private async persistBillingDocument(client:PoolClient,membership:Membership,branchId:string,type:"INVOICE"|"RECEIPT"|"GATE_PASS",sourceId:string,reference:string,lines:string[]){const artifact=createBillingPdf(type,reference,lines),documentId=randomUUID(),auditReference=randomUUID(),privateRef=`private/${membership.tenantId}/${branchId}/finance/${artifact.filename}`;await client.query(`INSERT INTO workshopos.rendered_document(tenant_id,branch_id,id,document_type,source_id,public_reference,template_version,artifacts,private_object_ref,content_sha256,rendered_at,audit_reference) VALUES($1,$2,$3,$4,$5,$6,1,$7::jsonb,$8,$9,transaction_timestamp(),$10)`,[membership.tenantId,branchId,documentId,type,sourceId,reference,JSON.stringify([{mimeType:artifact.mimeType,filename:artifact.filename,byteLength:artifact.content.byteLength}]),privateRef,artifact.checksum,auditReference]);await client.query("INSERT INTO workshopos.job_document_content(tenant_id,branch_id,document_id,content,mime_type,filename) VALUES($1,$2,$3,$4,$5,$6)",[membership.tenantId,branchId,documentId,artifact.content,artifact.mimeType,artifact.filename]);if(type==="INVOICE")await client.query("INSERT INTO workshopos.native_invoice_document(tenant_id,branch_id,id,entity_type,entity_id,render_format,private_object_ref,checksum_sha256,scan_status,rendered_at) VALUES($1,$2,$3,'INVOICE',$4,'PDF_A4',$5,$6,'CLEAN',transaction_timestamp())",[membership.tenantId,branchId,randomUUID(),sourceId,privateRef,artifact.checksum]);return documentId;}

  private async persistInvoiceAdjustmentDocument(client:PoolClient,membership:Membership,branchId:string,invoiceId:string,adjustmentId:string,reference:string,amountMinor:string,reason:string){const artifact=createBillingPdf("INVOICE",reference,["CREDIT NOTE",`Adjustment INR ${amountMinor} minor units`,reason]),documentId=randomUUID(),privateRef=`private/${membership.tenantId}/${branchId}/finance/${artifact.filename}`;await client.query(`INSERT INTO workshopos.rendered_document(tenant_id,branch_id,id,document_type,source_id,public_reference,template_version,artifacts,private_object_ref,content_sha256,rendered_at,audit_reference) VALUES($1,$2,$3,'INVOICE',$4,$5,1,$6::jsonb,$7,$8,transaction_timestamp(),$9)`,[membership.tenantId,branchId,documentId,invoiceId,reference,JSON.stringify([{mimeType:artifact.mimeType,filename:artifact.filename,byteLength:artifact.content.byteLength}]),privateRef,artifact.checksum,randomUUID()]);await client.query("INSERT INTO workshopos.job_document_content(tenant_id,branch_id,document_id,content,mime_type,filename) VALUES($1,$2,$3,$4,$5,$6)",[membership.tenantId,branchId,documentId,artifact.content,artifact.mimeType,artifact.filename]);await client.query("INSERT INTO workshopos.native_invoice_document(tenant_id,branch_id,id,entity_type,entity_id,render_format,private_object_ref,checksum_sha256,scan_status,rendered_at) VALUES($1,$2,$3,'ADJUSTMENT',$4,'PDF_A4',$5,$6,'CLEAN',transaction_timestamp())",[membership.tenantId,branchId,randomUUID(),adjustmentId,privateRef,artifact.checksum]);return documentId;}

  async finalizeJobInvoice(membership:Membership,id:string,input:{version:number},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const job=(await client.query<any>("SELECT j.*,lr.stage,lr.resource_version FROM workshopos.reception_job_card j JOIN workshopos.lifecycle_resources lr ON lr.id=j.id AND lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id WHERE j.id=$1 FOR UPDATE OF lr",[id])).rows[0];if(!job)throw new ApiError(404,"JOB_NOT_FOUND");return this.operationalCommand(client,membership,job.branch_id,key,{action:"finalize-invoice",id,input},async()=>{if(job.stage!=="BILLING")throw new ApiError(409,"BILLING_STAGE_REQUIRED");if(Number(job.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if((await client.query("SELECT 1 FROM workshopos.native_invoice WHERE job_id=$1 AND status='FINALIZED'",[id])).rowCount)throw new ApiError(409,"INVOICE_ALREADY_FINALIZED");const estimate=(await client.query<any>(`SELECT ev.id,ev.totals,ev.configuration_version_id FROM workshopos.estimate_version ev JOIN workshopos.estimate_stream es ON es.id=ev.estimate_stream_id AND es.tenant_id=ev.tenant_id AND es.branch_id=ev.branch_id WHERE es.job_id=$1 AND ev.status IN('APPROVED','PARTIALLY_APPROVED') ORDER BY ev.revision DESC LIMIT 1`,[id])).rows[0];if(!estimate)throw new ApiError(409,"APPROVED_ESTIMATE_REQUIRED");const amount=String(estimate.totals.grandTotalMinor),invoiceId=randomUUID(),lineId=(await client.query<any>("SELECT id FROM workshopos.estimate_line WHERE estimate_version_id=$1 ORDER BY id LIMIT 1",[estimate.id])).rows[0]?.id;if(!lineId)throw new ApiError(409,"APPROVED_ESTIMATE_LINE_REQUIRED");await client.query(`INSERT INTO workshopos.native_invoice(tenant_id,branch_id,id,job_id,payer_id,invoice_authority,status,tenant_timezone,currency,supplier_gstin,supplier_state_code,place_of_supply_state_code,tax_treatment,tax_snapshot_id,document_template_snapshot_id,gross_minor,discount_minor,taxable_minor,cgst_minor,sgst_minor,igst_minor,rounding_adjustment_minor,payable_minor,drafted_by_membership_id,drafted_at,audit_reference) VALUES($1,$2,$3,$4,$5,'WORKSHOPOS_NATIVE','DRAFT','Asia/Kolkata','INR','07AAAAA0000A1Z5','07','07','INTRASTATE',$6,$7,$8,0,$8,0,0,0,0,$8,$9,transaction_timestamp(),$10)`,[membership.tenantId,job.branch_id,invoiceId,id,job.customer_id,randomUUID(),randomUUID(),amount,membership.id,randomUUID()]);await client.query(`INSERT INTO workshopos.native_invoice_line(tenant_id,branch_id,invoice_id,source_estimate_line_id,description,hsn_sac,supply_type,gst_rate_bps,gross_minor,discount_minor,taxable_minor,cgst_minor,sgst_minor,igst_minor,total_minor,payer_id) VALUES($1,$2,$3,$4,'Approved workshop scope','998729','SERVICE',0,$5,0,$5,0,0,0,$5,$6)`,[membership.tenantId,job.branch_id,invoiceId,lineId,amount,job.customer_id]);const invoice=(await client.query<any>("SELECT * FROM workshopos.finalize_native_invoice($1,$2,$3,$4,transaction_timestamp())",[membership.tenantId,job.branch_id,invoiceId,membership.id])).rows[0];await client.query("INSERT INTO workshopos.native_invoice_payer_register(tenant_id,branch_id,job_id,payer_id,active_invoice_id) VALUES($1,$2,$3,$4,$5) ON CONFLICT(tenant_id,branch_id,job_id,payer_id) DO UPDATE SET active_invoice_id=excluded.active_invoice_id,resource_version=workshopos.native_invoice_payer_register.resource_version+1",[membership.tenantId,job.branch_id,id,job.customer_id,invoiceId]);await client.query("INSERT INTO workshopos.native_invoice_event_outbox(tenant_id,branch_id,id,event_type,aggregate_id,aggregate_version,payload,status,occurred_at) VALUES($1,$2,$3,'S18_INVOICE_FINALIZED',$4,$5,$6::jsonb,'PENDING',transaction_timestamp())",[membership.tenantId,job.branch_id,randomUUID(),invoiceId,Number(invoice.resource_version),JSON.stringify({jobId:id,payerId:job.customer_id,authority:"WORKSHOPOS_NATIVE",documentNumber:invoice.document_number,payableMinor:amount,currency:"INR",consumers:["S20_PAYMENTS","S21_DELIVERY","DOCUMENT_WORKER"],documentVisibility:"PRIVATE"})]);await this.persistBillingDocument(client,membership,job.branch_id,"INVOICE",invoiceId,invoice.document_number,[`Job ${id}`,`Payable INR ${amount} minor units`]);await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[id]);return{invoiceId,documentNumber:invoice.document_number,payableMinor:amount,resourceVersion:Number(job.resource_version)+1};});});}

  async recordWorkAccepted(membership:Membership,id:string,input:{version:number;customerName:string;acknowledgement:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const job=(await client.query<any>("SELECT branch_id,stage,resource_version FROM workshopos.lifecycle_resources WHERE id=$1 AND resource_type='JOB' FOR UPDATE",[id])).rows[0];if(!job)throw new ApiError(404,"JOB_NOT_FOUND");return this.operationalCommand(client,membership,job.branch_id,key,{action:"work-accepted",id,input},async()=>{if(!["BILLING","GATE_VERIFICATION"].includes(job.stage))throw new ApiError(409,"WORK_ACCEPTANCE_STAGE_INVALID");if(Number(job.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(!input.customerName.trim()||!input.acknowledgement.trim())throw new ApiError(422,"WORK_ACCEPTANCE_EVIDENCE_REQUIRED");if((await client.query("SELECT 1 FROM workshopos.job_lifecycle_fact WHERE job_id=$1 AND fact_kind='WORK_ACCEPTED'",[id])).rowCount)throw new ApiError(409,"WORK_ALREADY_ACCEPTED");const auditReference=randomUUID();await client.query("INSERT INTO workshopos.job_lifecycle_fact(tenant_id,branch_id,id,job_id,fact_kind,evidence,actor_membership_id,occurred_at,audit_reference) VALUES($1,$2,$3,$4,'WORK_ACCEPTED',$5::jsonb,$6,transaction_timestamp(),$7)",[membership.tenantId,job.branch_id,randomUUID(),id,JSON.stringify({customerName:input.customerName.trim(),acknowledgement:input.acknowledgement.trim()}),membership.id,auditReference]);await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[id]);return{resourceVersion:Number(job.resource_version)+1,auditReference};});});}

  async recordJobPayment(membership:Membership,id:string,input:{version:number;amountMinor:string;mode:string;reference:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");if(!validateMoney(input.amountMinor)||!input.mode.trim()||!input.reference.trim())throw new ApiError(422,"PAYMENT_INVALID");return this.inScope(membership,async client=>{const job=(await client.query<any>("SELECT j.*,lr.stage,lr.resource_version FROM workshopos.reception_job_card j JOIN workshopos.lifecycle_resources lr ON lr.id=j.id AND lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id WHERE j.id=$1 FOR UPDATE OF lr",[id])).rows[0];if(!job)throw new ApiError(404,"JOB_NOT_FOUND");return this.operationalCommand(client,membership,job.branch_id,key,{action:"payment",id,input},async()=>{if(!["BILLING","GATE_VERIFICATION"].includes(job.stage))throw new ApiError(409,"PAYMENT_STAGE_INVALID");if(Number(job.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");const invoice=(await client.query<any>("SELECT * FROM workshopos.native_invoice WHERE job_id=$1 AND status='FINALIZED' ORDER BY finalized_at DESC LIMIT 1 FOR UPDATE",[id])).rows[0];if(!invoice)throw new ApiError(409,"FINAL_INVOICE_REQUIRED");const paid=BigInt((await client.query<{paid:string}>("SELECT coalesce(sum(CASE WHEN event_kind IN('PAYMENT_RECEIPT','ADVANCE_RECEIPT') THEN amount_minor ELSE -amount_minor END),0)::text paid FROM workshopos.financial_event WHERE job_id=$1 AND invoice_id=$2",[id,invoice.id])).rows[0].paid),credit=BigInt((await client.query<{credit:string}>("SELECT coalesce(sum(total_minor),0)::text credit FROM workshopos.native_invoice_adjustment WHERE invoice_id=$1 AND status='FINALIZED' AND adjustment_type IN('CREDIT_NOTE','CANCEL_REISSUE')",[invoice.id])).rows[0].credit),amount=BigInt(input.amountMinor),payable=BigInt(invoice.payable_minor)-credit;if(paid+amount>payable)throw new ApiError(422,"PAYMENT_EXCEEDS_BALANCE");const eventId=randomUUID(),receipt=`RCPT-${new Date().getUTCFullYear()}-${eventId.slice(0,8).toUpperCase()}`,auditReference=randomUUID();await client.query(`INSERT INTO workshopos.financial_event(tenant_id,branch_id,id,event_kind,customer_id,visit_id,job_id,invoice_id,payer_id,currency,amount_minor,payment_mode,external_reference,evidence_ref,occurred_at,actor_membership_id,audit_reference) VALUES($1,$2,$3,'PAYMENT_RECEIPT',$4,$5,$6,$7,$4,'INR',$8,$9,$10,$11,transaction_timestamp(),$12,$13)`,[membership.tenantId,job.branch_id,eventId,job.customer_id,job.visit_id,id,invoice.id,input.amountMinor,input.mode.trim(),input.reference.trim(),`private/${membership.tenantId}/${job.branch_id}/finance/payments/${eventId}`,membership.id,auditReference]);await this.persistBillingDocument(client,membership,job.branch_id,"RECEIPT",eventId,receipt,[`Invoice ${invoice.document_number}`,`Received INR ${input.amountMinor} minor units`,input.mode.trim()]);if(paid+amount===payable&&!(await client.query("SELECT 1 FROM workshopos.job_lifecycle_fact WHERE job_id=$1 AND fact_kind='PAYMENT_CLEARED'",[id])).rowCount)await client.query("INSERT INTO workshopos.job_lifecycle_fact(tenant_id,branch_id,id,job_id,fact_kind,evidence,actor_membership_id,occurred_at,audit_reference) VALUES($1,$2,$3,$4,'PAYMENT_CLEARED',$5::jsonb,$6,transaction_timestamp(),$7)",[membership.tenantId,job.branch_id,randomUUID(),id,JSON.stringify({invoiceId:invoice.id,paidMinor:String(payable),derivedFromEventId:eventId}),membership.id,randomUUID()]);await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[id]);return{paymentId:eventId,receipt,paidMinor:String(paid+amount),paymentCleared:paid+amount===payable,resourceVersion:Number(job.resource_version)+1};});});}

  async requestPaymentCorrection(membership:Membership,eventId:string,input:{amountMinor:string;reason:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");if(!validateMoney(input.amountMinor)||!input.reason.trim())throw new ApiError(422,"CORRECTION_INVALID");return this.inScope(membership,async client=>{const event=(await client.query<any>("SELECT * FROM workshopos.financial_event WHERE id=$1 AND event_kind='PAYMENT_RECEIPT'",[eventId])).rows[0];if(!event)throw new ApiError(404,"PAYMENT_NOT_FOUND");return this.operationalCommand(client,membership,event.branch_id,key,{action:"payment-correction-request",eventId,input},async()=>{if(BigInt(input.amountMinor)>BigInt(event.amount_minor))throw new ApiError(422,"CORRECTION_EXCEEDS_PAYMENT");if((await client.query("SELECT 1 FROM workshopos.gate_release WHERE job_id=$1",[event.job_id])).rowCount)throw new ApiError(409,"RELEASED_FINANCE_LOCKED");const correctionId=randomUUID();await client.query(`INSERT INTO workshopos.payment_correction(tenant_id,branch_id,id,original_financial_event_id,correction_kind,currency,amount_minor,reason,evidence_ref,status,maker_membership_id,created_at) VALUES($1,$2,$3,$4,'PAYMENT_REVERSAL','INR',$5,$6,$7,'APPROVAL_PENDING',$8,transaction_timestamp())`,[membership.tenantId,event.branch_id,correctionId,eventId,input.amountMinor,input.reason.trim(),`private/${membership.tenantId}/${event.branch_id}/finance/corrections/${correctionId}`,membership.id]);return{correctionId,status:"APPROVAL_PENDING",version:1};});});}

  async requestInvoiceCorrection(membership:Membership,invoiceId:string,input:{amountMinor:string;reason:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");if(!validateMoney(input.amountMinor)||!input.reason.trim())throw new ApiError(422,"CORRECTION_INVALID");return this.inScope(membership,async client=>{const invoice=(await client.query<any>("SELECT * FROM workshopos.native_invoice WHERE id=$1 AND status='FINALIZED' FOR UPDATE",[invoiceId])).rows[0];if(!invoice)throw new ApiError(404,"INVOICE_NOT_FOUND");return this.operationalCommand(client,membership,invoice.branch_id,key,{action:"invoice-correction-request",invoiceId,input},async()=>{const committed=BigInt((await client.query<{amount:string}>("SELECT coalesce(sum(total_minor),0)::text amount FROM workshopos.native_invoice_adjustment WHERE invoice_id=$1 AND status IN('APPROVAL_PENDING','FINALIZED') AND adjustment_type IN('CREDIT_NOTE','CANCEL_REISSUE')",[invoiceId])).rows[0].amount);if(committed+BigInt(input.amountMinor)>BigInt(invoice.payable_minor))throw new ApiError(422,"CORRECTION_EXCEEDS_INVOICE");if((await client.query("SELECT 1 FROM workshopos.gate_release WHERE job_id=$1",[invoice.job_id])).rowCount)throw new ApiError(409,"RELEASED_FINANCE_LOCKED");const adjustmentId=randomUUID(),source=(await client.query<any>("SELECT source_estimate_line_id FROM workshopos.native_invoice_line WHERE invoice_id=$1 ORDER BY source_estimate_line_id LIMIT 1",[invoiceId])).rows[0];await client.query(`INSERT INTO workshopos.native_invoice_adjustment(tenant_id,branch_id,id,invoice_id,adjustment_type,status,reason,taxable_minor,tax_minor,total_minor,maker_membership_id,resource_version,requested_at,audit_reference) VALUES($1,$2,$3,$4,'CREDIT_NOTE','APPROVAL_PENDING',$5,$6,0,$6,$7,1,transaction_timestamp(),$8)`,[membership.tenantId,invoice.branch_id,adjustmentId,invoiceId,input.reason.trim(),input.amountMinor,membership.id,randomUUID()]);await client.query("INSERT INTO workshopos.native_invoice_adjustment_line(tenant_id,branch_id,adjustment_id,source_invoice_line_id,taxable_adjustment_minor,gst_rate_bps,tax_adjustment_minor,total_adjustment_minor) VALUES($1,$2,$3,$4,$5,0,0,$5)",[membership.tenantId,invoice.branch_id,adjustmentId,source.source_estimate_line_id,input.amountMinor]);return{adjustmentId,status:"APPROVAL_PENDING",version:1};});});}

  async approveInvoiceCorrection(membership:Membership,adjustmentId:string,input:{version:number},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const adjustment=(await client.query<any>(`SELECT a.*,i.job_id,i.tenant_timezone,lr.resource_version job_version FROM workshopos.native_invoice_adjustment a JOIN workshopos.native_invoice i ON i.id=a.invoice_id AND i.tenant_id=a.tenant_id AND i.branch_id=a.branch_id JOIN workshopos.lifecycle_resources lr ON lr.id=i.job_id AND lr.tenant_id=i.tenant_id AND lr.branch_id=i.branch_id WHERE a.id=$1 FOR UPDATE OF a,lr`,[adjustmentId])).rows[0];if(!adjustment)throw new ApiError(404,"CORRECTION_NOT_FOUND");return this.operationalCommand(client,membership,adjustment.branch_id,key,{action:"invoice-correction-approve",adjustmentId,input},async()=>{if(adjustment.status!=="APPROVAL_PENDING"||Number(adjustment.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(adjustment.maker_membership_id===membership.id)throw new ApiError(409,"MAKER_CHECKER_SEPARATION_REQUIRED");if((await client.query("SELECT 1 FROM workshopos.gate_release WHERE job_id=$1",[adjustment.job_id])).rowCount)throw new ApiError(409,"RELEASED_FINANCE_LOCKED");const fy=(await client.query<{fy:string}>("SELECT workshopos.india_financial_year(transaction_timestamp(),$1) fy",[adjustment.tenant_timezone])).rows[0].fy,sequence=(await client.query<{number:string}>("SELECT workshopos.allocate_document_number($1,$2,'CREDIT_NOTE',$3)::text number",[membership.tenantId,adjustment.branch_id,fy])).rows[0].number,number=`CN/${fy}/${String(sequence).padStart(6,"0")}`;await client.query("UPDATE workshopos.native_invoice_adjustment SET status='FINALIZED',checker_membership_id=$1,reauthenticated_at=transaction_timestamp(),document_number=$2,financial_year=$3,resource_version=resource_version+1,finalized_at=transaction_timestamp() WHERE id=$4",[membership.id,number,fy,adjustmentId]);await this.persistInvoiceAdjustmentDocument(client,membership,adjustment.branch_id,adjustment.invoice_id,adjustmentId,number,String(adjustment.total_minor),adjustment.reason);await client.query("INSERT INTO workshopos.native_invoice_event_outbox(tenant_id,branch_id,id,event_type,aggregate_id,aggregate_version,payload,status,occurred_at) VALUES($1,$2,$3,'S18_INVOICE_ADJUSTED',$4,2,$5::jsonb,'PENDING',transaction_timestamp())",[membership.tenantId,adjustment.branch_id,randomUUID(),adjustmentId,JSON.stringify({invoiceId:adjustment.invoice_id,jobId:adjustment.job_id,adjustmentType:adjustment.adjustment_type,totalMinor:String(adjustment.total_minor),documentNumber:number})]);await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[adjustment.job_id]);return{adjustmentId,status:"FINALIZED",version:2,documentNumber:number,jobVersion:Number(adjustment.job_version)+1};});});}

  async approvePaymentCorrection(membership:Membership,correctionId:string,input:{version:number},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const correction=(await client.query<any>(`SELECT pc.*,fe.job_id,fe.customer_id,fe.visit_id,fe.invoice_id,fe.payer_id,fe.payment_mode,lr.resource_version job_version FROM workshopos.payment_correction pc JOIN workshopos.financial_event fe ON fe.id=pc.original_financial_event_id AND fe.tenant_id=pc.tenant_id AND fe.branch_id=pc.branch_id JOIN workshopos.lifecycle_resources lr ON lr.id=fe.job_id AND lr.tenant_id=fe.tenant_id AND lr.branch_id=fe.branch_id WHERE pc.id=$1 FOR UPDATE OF pc,lr`,[correctionId])).rows[0];if(!correction)throw new ApiError(404,"CORRECTION_NOT_FOUND");return this.operationalCommand(client,membership,correction.branch_id,key,{action:"payment-correction-approve",correctionId,input},async()=>{if(correction.status!=="APPROVAL_PENDING"||Number(correction.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(correction.maker_membership_id===membership.id)throw new ApiError(409,"MAKER_CHECKER_SEPARATION_REQUIRED");if((await client.query("SELECT 1 FROM workshopos.gate_release WHERE job_id=$1",[correction.job_id])).rowCount)throw new ApiError(409,"RELEASED_FINANCE_LOCKED");await client.query("UPDATE workshopos.payment_correction SET status='APPROVED',checker_membership_id=$1,resource_version=resource_version+1 WHERE id=$2",[membership.id,correctionId]);const eventId=randomUUID();await client.query(`INSERT INTO workshopos.financial_event(tenant_id,branch_id,id,event_kind,original_financial_event_id,customer_id,visit_id,job_id,invoice_id,payer_id,currency,amount_minor,payment_mode,external_reference,evidence_ref,reason,occurred_at,actor_membership_id,audit_reference) VALUES($1,$2,$3,'PAYMENT_REVERSAL',$4,$5,$6,$7,$8,$9,'INR',$10,$11,$12,$13,$14,transaction_timestamp(),$15,$16)`,[membership.tenantId,correction.branch_id,eventId,correction.original_financial_event_id,correction.customer_id,correction.visit_id,correction.job_id,correction.invoice_id,correction.payer_id,correction.amount_minor,correction.payment_mode,`REV-${correctionId}`,correction.evidence_ref,correction.reason,membership.id,randomUUID()]);await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[correction.job_id]);return{correctionId,status:"APPROVED",version:2,compensatingEventId:eventId,jobVersion:Number(correction.job_version)+1};});});}

  async recordDeliveryEvidence(membership:Membership,id:string,input:{version:number;finalOdometerKm:number;deliveredToName:string;identityType:string;identityLast4:string;acknowledgement:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");if(!validateDeliveryEvidence(input))throw new ApiError(422,"DELIVERY_EVIDENCE_INVALID");return this.inScope(membership,async client=>{const job=(await client.query<any>("SELECT j.*,lr.stage,lr.resource_version FROM workshopos.reception_job_card j JOIN workshopos.lifecycle_resources lr ON lr.id=j.id AND lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id WHERE j.id=$1 FOR UPDATE OF lr",[id])).rows[0];if(!job)throw new ApiError(404,"JOB_NOT_FOUND");return this.operationalCommand(client,membership,job.branch_id,key,{action:"delivery-evidence",id,input},async()=>{if(job.stage!=="BILLING")throw new ApiError(409,"DELIVERY_EVIDENCE_STAGE_INVALID");if(Number(job.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");const evidenceId=randomUUID(),auditReference=randomUUID();await client.query(`INSERT INTO workshopos.delivery_evidence(tenant_id,branch_id,id,job_id,visit_id,vehicle_id,final_odometer_km,delivered_by_membership_id,delivered_to_name,delivered_to_identity_type,delivered_to_identity_last4,acknowledgement,evidence,exceptions,recorded_at,audit_reference) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'[]'::jsonb,'[]'::jsonb,transaction_timestamp(),$13)`,[membership.tenantId,job.branch_id,evidenceId,id,job.visit_id,job.vehicle_id,input.finalOdometerKm,membership.id,input.deliveredToName.trim(),input.identityType.trim(),input.identityLast4,input.acknowledgement.trim(),auditReference]);await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[id]);return{deliveryEvidenceId:evidenceId,resourceVersion:Number(job.resource_version)+1,auditReference};});});}

  private async financialReadiness(client:PoolClient,id:string){const row=(await client.query<any>(`SELECT ni.id invoice_id,ni.payable_minor-coalesce((SELECT sum(total_minor) FROM workshopos.native_invoice_adjustment a WHERE a.invoice_id=ni.id AND a.status='FINALIZED' AND a.adjustment_type IN('CREDIT_NOTE','CANCEL_REISSUE')),0) effective_payable_minor,coalesce((SELECT sum(CASE WHEN event_kind IN('PAYMENT_RECEIPT','ADVANCE_RECEIPT') THEN amount_minor ELSE -amount_minor END) FROM workshopos.financial_event WHERE job_id=$1 AND invoice_id=ni.id),0) paid_minor,EXISTS(SELECT 1 FROM workshopos.job_lifecycle_fact WHERE job_id=$1 AND fact_kind='WORK_ACCEPTED') accepted,EXISTS(SELECT 1 FROM workshopos.job_lifecycle_fact WHERE job_id=$1 AND fact_kind='PAYMENT_CLEARED') cleared,EXISTS(SELECT 1 FROM workshopos.delivery_evidence WHERE job_id=$1) delivery FROM workshopos.native_invoice ni WHERE ni.job_id=$1 AND ni.status='FINALIZED' ORDER BY ni.finalized_at DESC LIMIT 1`,[id])).rows[0];return Boolean(row&&row.accepted&&row.cleared&&row.delivery&&BigInt(row.effective_payable_minor)===BigInt(row.paid_minor));}

  async issueGatePass(membership:Membership,id:string,input:{version:number;validUntil:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const job=(await client.query<any>("SELECT j.*,lr.stage,lr.resource_version,v.normalized_registration FROM workshopos.reception_job_card j JOIN workshopos.lifecycle_resources lr ON lr.id=j.id AND lr.tenant_id=j.tenant_id AND lr.branch_id=j.branch_id JOIN workshopos.vehicle v ON v.id=j.vehicle_id AND v.tenant_id=j.tenant_id AND v.branch_id=j.branch_id WHERE j.id=$1 FOR UPDATE OF lr",[id])).rows[0];if(!job)throw new ApiError(404,"JOB_NOT_FOUND");return this.operationalCommand(client,membership,job.branch_id,key,{action:"gate-pass",id,input},async()=>{if(job.stage!=="BILLING")throw new ApiError(409,"GATE_PASS_STAGE_INVALID");if(Number(job.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(!await this.financialReadiness(client,id))throw new ApiError(409,"RELEASE_BLOCKERS_REMAIN");const until=new Date(input.validUntil);if(!Number.isFinite(until.getTime())||until<=new Date())throw new ApiError(422,"GATE_PASS_EXPIRY_INVALID");const tenant=(await client.query<{timezone:string}>("SELECT timezone FROM workshopos.tenant WHERE tenant_id=$1",[membership.tenantId])).rows[0],fy=(await client.query<{fy:string}>("SELECT workshopos.india_financial_year(transaction_timestamp(),$1) fy",[tenant.timezone])).rows[0].fy,allocated=Number((await client.query<{n:string}>("SELECT workshopos.allocate_gate_pass_number($1,$2,$3)::text n",[membership.tenantId,job.branch_id,fy])).rows[0].n),passId=randomUUID(),number=`GP/${fy}/${String(allocated).padStart(6,"0")}`;await client.query(`INSERT INTO workshopos.gate_pass(tenant_id,branch_id,id,job_id,visit_id,vehicle_id,registration_number,financial_year,allocated_number,document_number,valid_from,valid_until,release_conditions,issued_by_membership_id,status,audit_reference) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,transaction_timestamp(),$11,$12::jsonb,$13,'ISSUED',$14)`,[membership.tenantId,job.branch_id,passId,id,job.visit_id,job.vehicle_id,job.normalized_registration,fy,allocated,number,until,JSON.stringify(["Match vehicle and registration","Independent gate verification"]),membership.id,randomUUID()]);await this.persistBillingDocument(client,membership,job.branch_id,"GATE_PASS",passId,number,[job.normalized_registration,`Valid until ${until.toISOString()}`]);await client.query("UPDATE workshopos.lifecycle_resources SET resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[id]);return{gatePassId:passId,documentNumber:number,resourceVersion:Number(job.resource_version)+1};});});}

  async releaseGatePass(membership:Membership,passId:string,input:{version:number;registration:string;verificationMode:string;evidence:string},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const pass=(await client.query<any>(`SELECT gp.*,lr.stage,lr.resource_version job_version FROM workshopos.gate_pass gp JOIN workshopos.lifecycle_resources lr ON lr.id=gp.job_id AND lr.tenant_id=gp.tenant_id AND lr.branch_id=gp.branch_id WHERE gp.id=$1 FOR UPDATE OF gp,lr`,[passId])).rows[0];if(!pass)throw new ApiError(404,"GATE_PASS_NOT_FOUND");return this.operationalCommand(client,membership,pass.branch_id,key,{action:"gate-release",passId,input},async()=>{if(pass.stage!=="GATE_VERIFICATION")throw new ApiError(409,"GATE_VERIFICATION_STAGE_REQUIRED");if(Number(pass.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");if(!["CAMERA_SCANNER","HARDWARE_SCANNER","MANUAL"].includes(input.verificationMode)||!input.evidence.trim())throw new ApiError(422,"GATE_VERIFICATION_EVIDENCE_REQUIRED");if(!await this.financialReadiness(client,pass.job_id))throw new ApiError(409,"RELEASE_BLOCKERS_REMAIN");const releaseId=randomUUID(),auditReference=randomUUID();await client.query("SELECT * FROM workshopos.release_gate_pass_atomically($1,$2,$3,$4,$5,$6,$7,$8,$9,true,transaction_timestamp(),$10)",[membership.tenantId,pass.branch_id,passId,releaseId,membership.id,pass.vehicle_id,input.registration.trim(),input.verificationMode,input.evidence.trim(),auditReference]);await client.query("UPDATE workshopos.lifecycle_resources SET stage='DELIVERED',resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[pass.job_id]);await client.query("INSERT INTO workshopos.lifecycle_history(id,tenant_id,branch_id,resource_id,from_stage,to_stage,actor_identity_id,evidence,audit_reference,occurred_at) VALUES($1,$2,$3,$4,'GATE_VERIFICATION','DELIVERED',$5,$6::jsonb,$7,transaction_timestamp())",[randomUUID(),membership.tenantId,pass.branch_id,pass.job_id,membership.subject??membership.identitySubject??"unknown",JSON.stringify([input.verificationMode,input.evidence.trim()]),auditReference]);return{releaseId,jobId:pass.job_id,jobVersion:Number(pass.job_version)+1,gatePassVersion:Number(pass.resource_version)+1,auditReference};});});}

  async closeDeliveredJob(membership:Membership,id:string,input:{version:number},key:string){if(!membership.id)throw new ApiError(403,"MEMBERSHIP_REQUIRED");return this.inScope(membership,async client=>{const job=(await client.query<any>("SELECT branch_id,stage,resource_version FROM workshopos.lifecycle_resources WHERE id=$1 AND resource_type='JOB' FOR UPDATE",[id])).rows[0];if(!job)throw new ApiError(404,"JOB_NOT_FOUND");return this.operationalCommand(client,membership,job.branch_id,key,{action:"close-delivered",id,input},async()=>{if(job.stage!=="DELIVERED"||!(await client.query("SELECT 1 FROM workshopos.gate_release WHERE job_id=$1",[id])).rowCount)throw new ApiError(409,"VEHICLE_RELEASE_REQUIRED");if(Number(job.resource_version)!==input.version)throw new ApiError(409,"VERSION_CONFLICT");const auditReference=randomUUID();await client.query("UPDATE workshopos.lifecycle_resources SET stage='CLOSED',resource_version=resource_version+1,updated_at=transaction_timestamp() WHERE id=$1",[id]);await client.query("INSERT INTO workshopos.lifecycle_history(id,tenant_id,branch_id,resource_id,from_stage,to_stage,actor_identity_id,evidence,audit_reference,occurred_at) VALUES($1,$2,$3,$4,'DELIVERED','CLOSED',$5,'[]'::jsonb,$6,transaction_timestamp())",[randomUUID(),membership.tenantId,job.branch_id,id,membership.subject??membership.identitySubject??"unknown",auditReference]);return{jobId:id,stage:"CLOSED",resourceVersion:Number(job.resource_version)+1,auditReference};});});}

  private async operationalCommand<T extends Record<string,unknown>>(client:PoolClient,membership:Membership,branchId:string,key:string,payload:unknown,work:()=>Promise<T>):Promise<T&{replay:boolean}>{if(!key.trim())throw new ApiError(400,"IDEMPOTENCY_KEY_REQUIRED");const requestHash=createHash("sha256").update(JSON.stringify(payload)).digest("hex");await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))",[`${membership.tenantId}:v12:${key}`]);const prior=await client.query<{request_hash:string;response:T}>("SELECT request_hash,response FROM workshopos.v12_operational_command_receipt WHERE idempotency_key=$1",[key]);if(prior.rowCount){if(prior.rows[0].request_hash!==requestHash)throw new ApiError(409,"IDEMPOTENCY_KEY_REUSED");return{...prior.rows[0].response,replay:true};}const response=await work();await client.query("INSERT INTO workshopos.v12_operational_command_receipt(tenant_id,branch_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4,$5::jsonb)",[membership.tenantId,branchId,key,requestHash,JSON.stringify(response)]);return{...response,replay:false};}

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
