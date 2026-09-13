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

export type Membership = {
  subject?: string;
  identitySubject?: string;
  tenantId: string;
  branchIds: string[];
};

export type WorkItem = {
  id: string;
  tenantId: string;
  branchId: string;
  summary: string;
  version: number;
};

export const memberships: Record<string, Membership> = {
  "north-reception": {
    subject: "00000000-0000-4000-8000-000000000101",
    tenantId: "00000000-0000-4000-8000-000000000001",
    branchIds: ["00000000-0000-4000-8000-000000000011"],
  },
  "north-jaipur-manager": {
    subject: "00000000-0000-4000-8000-000000000102",
    tenantId: "00000000-0000-4000-8000-000000000001",
    branchIds: ["00000000-0000-4000-8000-000000000012"],
  },
  "south-reception": {
    subject: "00000000-0000-4000-8000-000000000201",
    tenantId: "00000000-0000-4000-8000-000000000002",
    branchIds: ["00000000-0000-4000-8000-000000000021"],
  },
};

type StoredResponse = {
  workItem: WorkItem;
  resourceVersion: number;
  auditReference: string;
};

export class PostgresVertical implements AdminUserRepository {
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
        id: string; tenant_id: string; branch_id: string; summary: string; version: string;
      }>("SELECT id, tenant_id, branch_id, summary, version::text FROM workshopos.work_item WHERE archived_at IS NULL ORDER BY created_at, id");
      return result.rows.map((row) => ({
        id: row.id,
        tenantId: row.tenant_id,
        branchId: row.branch_id,
        summary: row.summary,
        version: Number(row.version),
      }));
    });
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
      return { id: row.id, tenantId: row.tenant_id, branchId: row.branch_id, summary: row.summary, version: Number(row.version) };
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
      const workItem: WorkItem = { id: row.id, tenantId: row.tenant_id, branchId: row.branch_id, summary: row.summary, version: Number(row.version) };
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
        id: string; identity_subject: string; display_name: string; email: string; status: "INVITED" | "ACTIVE" | "ARCHIVED"; version: string;
      }>("SELECT id, identity_subject, display_name, email, status, version::text FROM workshopos.membership WHERE identity_subject = $1 AND active", [identitySubject]);
      if (!membershipResult.rowCount) { await client.query("ROLLBACK"); return undefined; }
      const membership = membershipResult.rows[0];
      if (membership.status === "INVITED") {
        await client.query("UPDATE workshopos.membership SET status='ACTIVE', updated_at=transaction_timestamp(), version=version+1 WHERE id=$1", [membership.id]);
        membership.status = "ACTIVE";
        membership.version = String(Number(membership.version) + 1);
      }
      const roleResult = await client.query<{ id: string; name: string; permissions: string[] }>(
        "SELECT r.id, r.name, r.permissions FROM workshopos.membership_role mr JOIN workshopos.role_template r ON r.tenant_id=mr.tenant_id AND r.id=mr.role_id WHERE mr.membership_id=$1 ORDER BY r.name",
        [membership.id],
      );
      const branchIds = (await client.query<{ branch_id: string }>(
        "SELECT branch_id FROM workshopos.membership_branch WHERE membership_id=$1 ORDER BY branch_id", [membership.id],
      )).rows.map((row) => row.branch_id);
      await client.query("SELECT set_config('app.branch_ids', $1, true)", [branchIds.join(",")]);
      const branches = branchIds.length ? (await client.query<BranchOption>(
        "SELECT id, name FROM workshopos.branch WHERE id = ANY($1::uuid[]) ORDER BY name", [branchIds],
      )).rows : [];
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

  async directory(actor: AuthenticatedMembership): Promise<UserDirectory> {
    return this.inScope(actor, async (client) => {
      const roles = (await client.query<RoleOption>("SELECT id, name, permissions FROM workshopos.role_template ORDER BY name")).rows;
      const branches = (await client.query<BranchOption>("SELECT id, name FROM workshopos.branch ORDER BY name")).rows;
      const rows = await client.query<{
        id: string; display_name: string; email: string; status: ManagedUser["status"]; version: string;
        invited_at: Date | null; last_invited_at: Date | null; created_at: Date; updated_at: Date;
      }>("SELECT id, display_name, email, status, version::text, invited_at, last_invited_at, created_at, updated_at FROM workshopos.membership WHERE status <> 'ARCHIVED' ORDER BY display_name, email");
      const users: ManagedUser[] = [];
      for (const row of rows.rows) users.push(await this.hydrateManagedUser(client, row, roles, branches));
      return { users, roles, branches };
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
      const roles = (await client.query<RoleOption>("SELECT id, name, permissions FROM workshopos.role_template ORDER BY name")).rows;
      const branches = (await client.query<BranchOption>("SELECT id, name FROM workshopos.branch ORDER BY name")).rows;
      const row = (await client.query<any>("SELECT id, display_name, email, status, version::text, invited_at, last_invited_at, created_at, updated_at FROM workshopos.membership WHERE id=$1", [id])).rows[0];
      const user = await this.hydrateManagedUser(client, row, roles, branches);
      await client.query("INSERT INTO workshopos.membership_command(tenant_id,idempotency_key,request_hash,response) VALUES($1,$2,$3,$4::jsonb)", [actor.tenantId, idempotencyKey, requestHash, JSON.stringify({ user })]);
      return { user, replay: false };
    });
  }

  async update(actor: AuthenticatedMembership, id: string, input: UpdateMembership) {
    return this.inScope(actor, async (client) => {
      const target = await this.lockTarget(client, id);
      if (Number(target.version) !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
      await this.protectFinalAdmin(client, id, input.roleIds);
      const updated = await client.query("UPDATE workshopos.membership SET display_name=$1, version=version+1, updated_at=transaction_timestamp() WHERE id=$2 AND version=$3", [input.name, id, input.version]);
      if (!updated.rowCount) throw new ApiError(409, "VERSION_CONFLICT");
      await this.replaceAssignments(client, actor.tenantId, id, input.roleIds, input.branchIds);
      return this.userById(client, id);
    });
  }

  async archive(actor: AuthenticatedMembership, id: string, reason: string) {
    return this.inScope(actor, async (client) => {
      const target = await this.lockTarget(client, id);
      if (id === actor.id) throw new ApiError(409, "SELF_ARCHIVE_FORBIDDEN");
      await this.protectFinalAdmin(client, id, []);
      await client.query("UPDATE workshopos.membership SET active=false,status='ARCHIVED',archived_at=transaction_timestamp(),archived_reason=$1,updated_at=transaction_timestamp(),version=version+1 WHERE id=$2", [reason, id]);
      return { user: await this.userById(client, id, true), cognitoUsername: String(target.cognito_username) };
    });
  }

  async markInviteResent(actor: AuthenticatedMembership, id: string) {
    return this.inScope(actor, async (client) => {
      const target = await this.lockTarget(client, id);
      if (target.status !== "INVITED") throw new ApiError(409, "INVITE_ALREADY_COMPLETED");
      await client.query("UPDATE workshopos.membership SET last_invited_at=transaction_timestamp(),updated_at=transaction_timestamp(),version=version+1 WHERE id=$1", [id]);
      return { user: await this.userById(client, id), cognitoUsername: String(target.cognito_username) };
    });
  }

  private async replaceAssignments(client: PoolClient, tenantId: string, id: string, roleIds: string[], branchIds: string[]) {
    const validRoles = await client.query<{ id: string }>("SELECT id FROM workshopos.role_template WHERE id=ANY($1::uuid[])", [roleIds]);
    if (validRoles.rowCount !== roleIds.length) throw new ApiError(400, "ROLE_NOT_FOUND");
    const validBranches = await client.query<{ id: string }>("SELECT id FROM workshopos.branch WHERE id=ANY($1::uuid[])", [branchIds]);
    if (validBranches.rowCount !== branchIds.length) throw new ApiError(403, "BRANCH_FORBIDDEN");
    await client.query("DELETE FROM workshopos.membership_role WHERE membership_id=$1", [id]);
    await client.query("DELETE FROM workshopos.membership_branch WHERE membership_id=$1", [id]);
    for (const roleId of roleIds) await client.query("INSERT INTO workshopos.membership_role(tenant_id,membership_id,role_id) VALUES($1,$2,$3)", [tenantId, id, roleId]);
    for (const branchId of branchIds) await client.query("INSERT INTO workshopos.membership_branch(tenant_id,membership_id,branch_id) VALUES($1,$2,$3)", [tenantId, id, branchId]);
  }

  private async protectFinalAdmin(client: PoolClient, id: string, nextRoleIds: string[]) {
    const currentlyAdmin = await client.query("SELECT 1 FROM workshopos.membership_role mr JOIN workshopos.role_template r ON r.id=mr.role_id AND r.tenant_id=mr.tenant_id WHERE mr.membership_id=$1 AND r.permissions ? 'membership.manage'", [id]);
    const remainsAdmin = nextRoleIds.length ? await client.query("SELECT 1 FROM workshopos.role_template WHERE id=ANY($1::uuid[]) AND permissions ? 'membership.manage'", [nextRoleIds]) : { rowCount: 0 };
    if (currentlyAdmin.rowCount && !remainsAdmin.rowCount) {
      const admins = await client.query<{ count: string }>("SELECT count(DISTINCT m.id)::text AS count FROM workshopos.membership m JOIN workshopos.membership_role mr ON mr.membership_id=m.id AND mr.tenant_id=m.tenant_id JOIN workshopos.role_template r ON r.id=mr.role_id AND r.tenant_id=mr.tenant_id WHERE m.active AND r.permissions ? 'membership.manage'");
      if (Number(admins.rows[0].count) <= 1) throw new ApiError(409, "FINAL_ADMIN_REQUIRED");
    }
  }

  private async lockTarget(client: PoolClient, id: string) {
    const result = await client.query<any>("SELECT * FROM workshopos.membership WHERE id=$1 AND active FOR UPDATE", [id]);
    if (!result.rowCount) throw new ApiError(404, "USER_NOT_FOUND");
    return result.rows[0];
  }

  private async userById(client: PoolClient, id: string, includeArchived = false) {
    const result = await client.query<any>(`SELECT id, display_name, email, status, version::text, invited_at, last_invited_at, created_at, updated_at FROM workshopos.membership WHERE id=$1 ${includeArchived ? "" : "AND active"}`, [id]);
    if (!result.rowCount) throw new ApiError(404, "USER_NOT_FOUND");
    const roles = (await client.query<RoleOption>("SELECT id, name, permissions FROM workshopos.role_template ORDER BY name")).rows;
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

  async close(): Promise<void> {
    await this.pool.end();
  }

  private async inScope<T>(membership: { tenantId: string; branchIds: string[] }, action: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT set_config('app.tenant_id', $1, true), set_config('app.branch_ids', $2, true)", [
        membership.tenantId,
        membership.branchIds.join(","),
      ]);
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
