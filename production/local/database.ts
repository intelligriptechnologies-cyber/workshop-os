import { randomUUID } from "node:crypto";

import { Pool, type PoolClient } from "pg";

export type Membership = {
  subject: string;
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

export class PostgresVertical {
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
      return { status: 403, body: { code: "BRANCH_FORBIDDEN" } } as const;
    }
    if (!idempotencyKey.trim()) {
      return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } } as const;
    }
    if (!input.summary.trim()) {
      return { status: 400, body: { code: "SUMMARY_REQUIRED" } } as const;
    }

    return this.inScope(membership, async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
        `${membership.tenantId}:${idempotencyKey}`,
      ]);
      const replay = await client.query<{ response: StoredResponse }>(
        "SELECT response FROM workshopos.idempotency_result WHERE tenant_id = $1 AND idempotency_key = $2 FOR UPDATE",
        [membership.tenantId, idempotencyKey],
      );
      if (replay.rowCount) return { status: 200, body: replay.rows[0].response } as const;

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
        [auditReference, membership.tenantId, input.branchId, membership.subject],
      );
      await client.query(
        "INSERT INTO workshopos.outbox_event (id, tenant_id, branch_id, aggregate_id, audit_reference, kind, payload) VALUES ($1, $2, $3, $4, $5, 'work-item.created', $6::jsonb)",
        [outboxId, membership.tenantId, input.branchId, id, auditReference, JSON.stringify({ workItemId: id })],
      );
      await client.query(
        "INSERT INTO workshopos.idempotency_result (tenant_id, idempotency_key, response) VALUES ($1, $2, $3::jsonb)",
        [membership.tenantId, idempotencyKey, JSON.stringify(body)],
      );
      return { status: 201, body } as const;
    });
  }

  async listWorkItems(membership: Membership): Promise<WorkItem[]> {
    return this.inScope(membership, async (client) => {
      const result = await client.query<{
        id: string; tenant_id: string; branch_id: string; summary: string; version: string;
      }>("SELECT id, tenant_id, branch_id, summary, version::text FROM workshopos.work_item ORDER BY created_at, id");
      return result.rows.map((row) => ({
        id: row.id,
        tenantId: row.tenant_id,
        branchId: row.branch_id,
        summary: row.summary,
        version: Number(row.version),
      }));
    });
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  private async inScope<T>(membership: Membership, action: (client: PoolClient) => Promise<T>): Promise<T> {
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
