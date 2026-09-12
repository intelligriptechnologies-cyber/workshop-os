type JsonObject = Record<string, unknown>;

type ApiBody = {
  code?: string;
  workItem?: WorkItem;
  workItems?: WorkItem[];
  object?: PrivateObject;
  resourceVersion?: number;
  auditReference?: string;
};

type ApiResponse = {
  status: number;
  body: ApiBody;
};

type Membership = {
  subject: string;
  tenantId: string;
  branchIds: string[];
  platform: boolean;
};

type WorkItem = {
  id: string;
  tenantId: string;
  branchId: string;
  summary: string;
  version: number;
};

type AuditEntry = {
  auditReference: string;
  tenantId: string;
  branchId: string;
  subject: string;
  action: string;
};

type OutboxEvent = {
  id: string;
  tenantId: string;
  branchId: string;
  workItemId: string;
  auditReference: string;
  processed: boolean;
};

type PrivateObject = {
  key: string;
  tenantId: string;
  branchId: string;
  workItemId: string;
  auditReference: string;
};

type SafeLogEntry = {
  event: string;
  tenantId: string;
  branchId: string;
  auditReference: string;
  resourceId?: string;
};

const memberships: Record<string, Membership> = {
  "north-reception": {
    subject: "user-north-reception",
    tenantId: "tenant-north",
    branchIds: ["north-delhi"],
    platform: false,
  },
  "north-jaipur-manager": {
    subject: "user-north-jaipur-manager",
    tenantId: "tenant-north",
    branchIds: ["north-jaipur"],
    platform: false,
  },
  "south-reception": {
    subject: "user-south-reception",
    tenantId: "tenant-south",
    branchIds: ["south-bengaluru"],
    platform: false,
  },
};

class TenantStore {
  private readonly workItems: WorkItem[] = [];
  private readonly audits: AuditEntry[] = [];
  private readonly outbox: OutboxEvent[] = [];
  private readonly commandResults = new Map<string, { workItem: WorkItem; auditReference: string }>();

  createWorkItem(context: Membership, input: JsonObject, idempotencyKey: string) {
    const branchId = String(input.branchId ?? "");
    if (!context.branchIds.includes(branchId)) {
      throw new ForbiddenError("BRANCH_FORBIDDEN");
    }

    const commandKey = `${context.tenantId}:${idempotencyKey}`;
    const prior = this.commandResults.get(commandKey);
    if (prior) return { ...prior, replayed: true };

    const workItem: WorkItem = {
      id: `wi-${this.workItems.length + 1}`,
      tenantId: context.tenantId,
      branchId,
      summary: String(input.summary ?? ""),
      version: 1,
    };
    const auditReference = `audit-${context.tenantId}-${this.audits.length + 1}`;
    this.workItems.push(workItem);
    this.audits.push({
      auditReference,
      tenantId: context.tenantId,
      branchId,
      subject: context.subject,
      action: "work-item.created",
    });
    this.outbox.push({
      id: `outbox-${this.outbox.length + 1}`,
      tenantId: context.tenantId,
      branchId,
      workItemId: workItem.id,
      auditReference,
      processed: false,
    });
    const result = { workItem, auditReference };
    this.commandResults.set(commandKey, result);
    return { ...result, replayed: false };
  }

  listWorkItems(context: Membership): WorkItem[] {
    return this.workItems.filter(
      (item) => item.tenantId === context.tenantId && context.branchIds.includes(item.branchId),
    );
  }

  findWorkItem(context: Membership, workItemId: string): WorkItem | undefined {
    return this.listWorkItems(context).find((item) => item.id === workItemId);
  }

  pendingOutbox(): OutboxEvent[] {
    return this.outbox.filter((event) => !event.processed);
  }

  findOutbox(context: Membership, auditReference: string): OutboxEvent | undefined {
    return this.outbox.find(
      (event) =>
        event.auditReference === auditReference &&
        event.tenantId === context.tenantId &&
        context.branchIds.includes(event.branchId),
    );
  }

  markProcessed(event: OutboxEvent): void {
    event.processed = true;
  }
}

class TenantPrivateObjects {
  private readonly objects = new Map<string, PrivateObject>();

  putFromOutbox(event: OutboxEvent): boolean {
    if (this.objects.has(event.id)) return false;
    this.objects.set(event.id, {
      key: `private/${event.tenantId}/${event.branchId}/work-items/${event.workItemId}.json`,
      tenantId: event.tenantId,
      branchId: event.branchId,
      workItemId: event.workItemId,
      auditReference: event.auditReference,
    });
    return true;
  }

  get(context: Membership, workItemId: string): PrivateObject | undefined {
    return [...this.objects.values()].find(
      (object) =>
        object.workItemId === workItemId &&
        object.tenantId === context.tenantId &&
        context.branchIds.includes(object.branchId),
    );
  }
}

class TenantEffectIndexes {
  private readonly caches: PrivateObject[] = [];
  private readonly exports: PrivateObject[] = [];
  private readonly searches: PrivateObject[] = [];
  private readonly reports: PrivateObject[] = [];
  private readonly metrics: PrivateObject[] = [];

  index(object: PrivateObject): void {
    this.caches.push({ ...object });
    this.exports.push({ ...object });
    this.searches.push({ ...object });
    this.reports.push({ ...object });
    this.metrics.push({ ...object });
  }

  cache(context: Membership, workItemId: string): PrivateObject | undefined {
    return this.find(this.caches, context, workItemId);
  }

  export(context: Membership, workItemId: string): PrivateObject | undefined {
    return this.find(this.exports, context, workItemId);
  }

  search(context: Membership, workItemId: string): PrivateObject | undefined {
    return this.find(this.searches, context, workItemId);
  }

  report(context: Membership, workItemId: string): PrivateObject | undefined {
    return this.find(this.reports, context, workItemId);
  }

  metric(context: Membership, workItemId: string): PrivateObject | undefined {
    return this.find(this.metrics, context, workItemId);
  }

  private find(items: PrivateObject[], context: Membership, workItemId: string): PrivateObject | undefined {
    return items.find(
      (item) =>
        item.workItemId === workItemId &&
        item.tenantId === context.tenantId &&
        context.branchIds.includes(item.branchId),
    );
  }
}

class TenantSafeObservability {
  private readonly entries: SafeLogEntry[] = [];

  record(entry: SafeLogEntry): void {
    this.entries.push({ ...entry });
  }

  forAudit(auditReference: string): SafeLogEntry[] {
    return this.entries.filter((entry) => entry.auditReference === auditReference).map((entry) => ({ ...entry }));
  }

  forContext(context: Membership, auditReference: string): SafeLogEntry[] {
    return this.entries.filter(
      (entry) =>
        entry.auditReference === auditReference &&
        entry.tenantId === context.tenantId &&
        context.branchIds.includes(entry.branchId),
    );
  }
}

class OutboxWorker {
  constructor(
    private readonly store: TenantStore,
    private readonly objects: TenantPrivateObjects,
    private readonly indexes: TenantEffectIndexes,
    private readonly observability: TenantSafeObservability,
  ) {}

  async drain(): Promise<number> {
    let effects = 0;
    for (const event of this.store.pendingOutbox()) {
      if (this.objects.putFromOutbox(event)) {
        effects += 1;
        const object = this.objects.get(
          {
            subject: "worker",
            tenantId: event.tenantId,
            branchIds: [event.branchId],
            platform: false,
          },
          event.workItemId,
        );
        if (object) this.indexes.index(object);
      }
      this.store.markProcessed(event);
      this.observability.record({
        event: "outbox.processed",
        tenantId: event.tenantId,
        branchId: event.branchId,
        auditReference: event.auditReference,
        resourceId: event.workItemId,
      });
    }
    return effects;
  }
}

class ForbiddenError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

type CommandOptions = { idempotencyKey?: string };

class PwaSession {
  constructor(
    private readonly membership: Membership,
    private readonly store: TenantStore,
    private readonly objects: TenantPrivateObjects,
    private readonly observability: TenantSafeObservability,
  ) {}

  async post(path: string, body: JsonObject, _options: CommandOptions = {}): Promise<ApiResponse> {
    if (path.startsWith("/api/platform/")) {
      return { status: 403, body: { code: "PLATFORM_CREDENTIAL_REQUIRED" } };
    }
    if (path !== "/api/v1/work-items") return { status: 404, body: { code: "NOT_FOUND" } };
    try {
      if (!(_options.idempotencyKey?.trim())) {
        return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
      }
      const result = this.store.createWorkItem(this.membership, body, _options.idempotencyKey);
      if (!result.replayed) {
        this.observability.record({
          event: "command.committed",
          tenantId: result.workItem.tenantId,
          branchId: result.workItem.branchId,
          auditReference: result.auditReference,
          resourceId: result.workItem.id,
        });
      }
      return {
        status: result.replayed ? 200 : 201,
        body: {
          workItem: result.workItem,
          resourceVersion: result.workItem.version,
          auditReference: result.auditReference,
        },
      };
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return { status: 403, body: { code: error.code } };
      }
      throw error;
    }
  }

  async get(path: string): Promise<ApiResponse> {
    if (path === "/api/v1/work-items") {
      return { status: 200, body: { workItems: this.store.listWorkItems(this.membership) } };
    }
    const objectMatch = path.match(/^\/api\/v1\/objects\/([^/]+)$/);
    if (objectMatch) {
      const object = this.objects.get(this.membership, objectMatch[1]);
      return object ? { status: 200, body: { object } } : { status: 404, body: { code: "NOT_FOUND" } };
    }
    return { status: 404, body: { code: "NOT_FOUND" } };
  }
}

export function createLocalProductionVertical() {
  const store = new TenantStore();
  const objects = new TenantPrivateObjects();
  const indexes = new TenantEffectIndexes();
  const observability = new TenantSafeObservability();
  const worker = new OutboxWorker(store, objects, indexes, observability);
  return {
    worker,
    observability: {
      forAudit(identity: string, auditReference: string) {
        const context = memberships[identity];
        if (!context) throw new Error(`Unknown local identity: ${identity}`);
        return observability.forContext(context, auditReference);
      },
    },
    isolation: {
      probe(identity: string, target: {
        requestedTenantId: string;
        requestedBranchId: string;
        workItemId: string;
        auditReference: string;
      }) {
        const context = memberships[identity];
        if (!context) throw new Error(`Unknown local identity: ${identity}`);
        // requestedTenantId/requestedBranchId are deliberately not authority inputs.
        const database = Boolean(store.findWorkItem(context, target.workItemId));
        return {
          api: database,
          database,
          object: Boolean(objects.get(context, target.workItemId)),
          queue: Boolean(store.findOutbox(context, target.auditReference)),
          cache: Boolean(indexes.cache(context, target.workItemId)),
          export: Boolean(indexes.export(context, target.workItemId)),
          search: Boolean(indexes.search(context, target.workItemId)),
          report: Boolean(indexes.report(context, target.workItemId)),
          metric: Boolean(indexes.metric(context, target.workItemId)),
          log: observability.forContext(context, target.auditReference).length > 0,
        };
      },
    },
    pwa: {
      signIn(identity: string) {
        const membership = memberships[identity];
        if (!membership) throw new Error(`Unknown local identity: ${identity}`);
        return new PwaSession(membership, store, objects, observability);
      },
    },
  };
}
