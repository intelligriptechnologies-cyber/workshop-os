import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalActionNotificationApi } from "../src/action-notifications.js";

const memberships = {
  advisor: {
    identityId: "advisor-1", membershipId: "membership-advisor-1", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], roles: ["SERVICE_ADVISOR"], permissions: ["action.read", "notification.read"],
  },
  technician: {
    identityId: "technician-1", membershipId: "membership-technician-1", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], roles: ["TECHNICIAN"], permissions: ["action.read", "notification.read"],
  },
  advisor2: {
    identityId: "advisor-2", membershipId: "membership-advisor-2", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], roles: ["SERVICE_ADVISOR"], permissions: ["action.read", "notification.read"],
  },
  manager: {
    identityId: "manager-1", membershipId: "membership-manager-1", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], roles: ["SERVICE_ADVISOR", "MANAGER"], permissions: ["action.read", "action.team.read", "notification.read"],
  },
  jaipurAdvisor: {
    identityId: "advisor-jaipur", membershipId: "membership-advisor-jaipur", tenantId: "tenant-north",
    branchIds: ["branch-jaipur"], roles: ["SERVICE_ADVISOR"], permissions: ["action.read", "notification.read"],
  },
  southAdvisor: {
    identityId: "advisor-south", membershipId: "membership-advisor-south", tenantId: "tenant-south",
    branchIds: ["branch-bengaluru"], roles: ["SERVICE_ADVISOR"], permissions: ["action.read", "notification.read"],
  },
};

test("GET /api/v1/actions returns only prioritized role, membership, tenant, and branch actions with guidance", async () => {
  const api = createLocalActionNotificationApi({ memberships, templates: [], recipients: [] });
  for (const event of [
    {
      id: "event-delhi-owned", tenantId: "tenant-north", branchId: "branch-delhi", type: "ESTIMATE_REJECTED",
      occurredAt: "2026-09-11T05:00:00.000Z",
      action: { key: "estimate:42", roles: ["SERVICE_ADVISOR"], ownerMembershipId: "membership-advisor-1", priority: "URGENT" as const,
        title: "Customer rejected estimate", blocker: "The customer has not approved the repair cost.",
        nextAction: "Open the estimate, call the customer, and record the outcome.", dueAt: "2026-09-10T12:00:00.000Z", href: "/jobs/job-42/estimate" },
    },
    {
      id: "event-delhi-tech", tenantId: "tenant-north", branchId: "branch-delhi", type: "TASK_READY",
      occurredAt: "2026-09-11T05:01:00.000Z",
      action: { key: "task:7", roles: ["TECHNICIAN"], ownerMembershipId: "membership-technician-1", priority: "HIGH" as const,
        title: "Brake task is ready", nextAction: "Open the task and start work.", dueAt: "2026-09-11T11:00:00.000Z", href: "/tasks/task-7" },
    },
    {
      id: "event-jaipur", tenantId: "tenant-north", branchId: "branch-jaipur", type: "ESTIMATE_REJECTED",
      occurredAt: "2026-09-11T05:02:00.000Z",
      action: { key: "estimate:jaipur", roles: ["SERVICE_ADVISOR"], priority: "URGENT" as const, title: "Jaipur estimate rejected",
        nextAction: "Contact the customer.", href: "/jobs/jaipur" },
    },
    {
      id: "event-south", tenantId: "tenant-south", branchId: "branch-bengaluru", type: "ESTIMATE_REJECTED",
      occurredAt: "2026-09-11T05:03:00.000Z",
      action: { key: "estimate:south", roles: ["SERVICE_ADVISOR"], priority: "URGENT" as const, title: "South estimate rejected",
        nextAction: "Contact the customer.", href: "/jobs/south" },
    },
  ]) assert.equal(api.domainEvents.ingest(event).status, 201);

  const response = await api.signIn("advisor").get(
    "/api/v1/actions?branchId=branch-delhi&owner=me&asOf=2026-09-11T06:00:00.000Z",
  );
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.actions?.map((action) => action.title), ["Customer rejected estimate"]);
  assert.equal(response.body.actions?.[0].priority, "URGENT");
  assert.equal(response.body.actions?.[0].dueState, "OVERDUE");
  assert.equal(response.body.actions?.[0].ownerMembershipId, "membership-advisor-1");
  assert.equal(response.body.actions?.[0].blocker, "The customer has not approved the repair cost.");
  assert.equal(response.body.actions?.[0].nextAction, "Open the estimate, call the customer, and record the outcome.");
});

test("action filters are membership-authorized and identical domain event replay creates no duplicate action", async () => {
  const api = createLocalActionNotificationApi({ memberships, templates: [], recipients: [] });
  const event = {
    id: "event-shared-advisor", tenantId: "tenant-north", branchId: "branch-delhi", type: "CUSTOMER_CALLBACK",
    occurredAt: "2026-09-11T05:00:00.000Z",
    action: { key: "callback:42", roles: ["SERVICE_ADVISOR"], priority: "HIGH" as const, title: "Call customer",
      blocker: "The estimate needs clarification.", nextAction: "Open the job and call the primary contact.",
      dueAt: "2026-09-11T08:00:00.000Z", href: "/jobs/job-42" },
  };
  assert.equal(api.domainEvents.ingest(event).status, 201);
  assert.equal(api.domainEvents.ingest(structuredClone(event)).status, 200);
  assert.equal(api.domainEvents.ingest({ ...event, type: "DIFFERENT" }).body.code, "DOMAIN_EVENT_ID_REUSED");
  assert.equal(api.domainEvents.ingest({ ...event, id: "event-owned-other", action: {
    ...event.action, key: "callback:43", ownerMembershipId: "membership-advisor-2", title: "Other advisor callback",
  } }).status, 201);

  const due = await api.signIn("advisor").get(
    "/api/v1/actions?branchId=branch-delhi&owner=all&role=SERVICE_ADVISOR&priority=HIGH&dueState=DUE_TODAY&status=OPEN&asOf=2026-09-11T06:00:00.000Z",
  );
  assert.equal(due.status, 200);
  assert.equal(due.body.actions?.length, 1);
  assert.deepEqual((await api.signIn("manager").get(
    "/api/v1/actions?branchId=branch-delhi&owner=all&role=SERVICE_ADVISOR&priority=HIGH&dueState=DUE_TODAY&asOf=2026-09-11T06:00:00.000Z",
  )).body.actions?.map((action) => action.title), ["Call customer", "Other advisor callback"]);
  assert.equal((await api.signIn("advisor").get("/api/v1/actions?branchId=branch-delhi&role=TECHNICIAN")).status, 403);
  assert.equal((await api.signIn("jaipurAdvisor").get("/api/v1/actions?branchId=branch-delhi")).status, 403);
  assert.equal((await api.signIn("southAdvisor").get("/api/v1/actions?branchId=branch-bengaluru")).body.actions?.length, 0);
  assert.equal(api.testing.actions().length, 2);
});

test("one domain event durably renders versioned consent-aware in-app, push, and WhatsApp deliveries exactly once", async () => {
  const api = createLocalActionNotificationApi({
    memberships,
    templates: [
      { tenantId: "tenant-north", key: "estimate-approved", version: 3, channel: "IN_APP", body: "Estimate {{estimateNumber}} approved." },
      { tenantId: "tenant-north", key: "estimate-approved", version: 3, channel: "PUSH", body: "Open job {{jobNumber}}." },
      { tenantId: "tenant-north", key: "estimate-approved", version: 3, channel: "WHATSAPP", body: "Your estimate {{estimateNumber}} is approved." },
      { tenantId: "tenant-north", key: "estimate-approved", version: 3, channel: "SMS", body: "Estimate {{estimateNumber}} approved." },
    ],
    recipients: [
      { id: "staff-advisor", tenantId: "tenant-north", branchId: "branch-delhi", kind: "STAFF", membershipId: "membership-advisor-1",
        destinations: { PUSH: "device-token-private" }, consent: { IN_APP: true, PUSH: true }, optedOut: [] },
      { id: "customer-42", tenantId: "tenant-north", branchId: "branch-delhi", kind: "CUSTOMER",
        destinations: { WHATSAPP: "+919900000042", SMS: "+919900000042" }, consent: { WHATSAPP: true, SMS: true }, optedOut: [] },
    ],
  });
  const staffEvent = {
    id: "event-notify-staff", tenantId: "tenant-north", branchId: "branch-delhi", type: "ESTIMATE_APPROVED",
    occurredAt: "2026-09-11T06:00:00.000Z",
    notification: { recipientId: "staff-advisor", templateKey: "estimate-approved", templateVersion: 3,
      channels: ["IN_APP", "PUSH"] as const, variables: { estimateNumber: "EST-42", jobNumber: "JOB-42" } },
  };
  const customerEvent = {
    id: "event-notify-customer", tenantId: "tenant-north", branchId: "branch-delhi", type: "ESTIMATE_APPROVED",
    occurredAt: "2026-09-11T06:01:00.000Z",
    notification: { recipientId: "customer-42", templateKey: "estimate-approved", templateVersion: 3,
      channels: ["WHATSAPP"] as const, variables: { estimateNumber: "EST-42" }, whatsappFallbackToSms: true },
  };
  assert.equal(api.domainEvents.ingest(staffEvent).status, 201);
  assert.equal(api.domainEvents.ingest(customerEvent).status, 201);
  assert.equal(api.domainEvents.ingest(structuredClone(customerEvent)).status, 200);

  assert.deepEqual(await api.worker.drain("2026-09-11T06:02:00.000Z"), { processed: 3, providerCalls: 2 });
  assert.deepEqual(await api.worker.drain("2026-09-11T06:03:00.000Z"), { processed: 0, providerCalls: 0 });
  const inbox = await api.signIn("advisor").get("/api/v1/notifications?branchId=branch-delhi");
  assert.equal(inbox.status, 200);
  assert.equal(inbox.body.notifications?.length, 1);
  assert.equal(inbox.body.notifications?.[0].body, "Estimate EST-42 approved.");
  assert.equal(inbox.body.notifications?.[0].templateVersion, 3);

  const deliveries = api.testing.deliveries();
  assert.deepEqual(deliveries.map((delivery) => [delivery.channel, delivery.status, delivery.templateVersion]), [
    ["IN_APP", "DELIVERED", 3], ["PUSH", "PROVIDER_ACCEPTED", 3], ["WHATSAPP", "PROVIDER_ACCEPTED", 3],
  ]);
  assert.deepEqual(api.testing.providerCalls().map((call) => call.channel), ["PUSH", "WHATSAPP"]);
  assert.equal(api.testing.providerCalls()[1].body, "Your estimate EST-42 is approved.");
});

test("WhatsApp transient retry exhausts with explicit failure, dead letter, and one consented SMS fallback", async () => {
  const api = createLocalActionNotificationApi({
    memberships,
    templates: [
      { tenantId: "tenant-north", key: "approval-needed", version: 2, channel: "WHATSAPP", body: "Approve {{estimate}}", maxAttempts: 2 },
      { tenantId: "tenant-north", key: "approval-needed", version: 2, channel: "SMS", body: "Approve {{estimate}}", maxAttempts: 2 },
    ],
    recipients: [{ id: "customer-42", tenantId: "tenant-north", branchId: "branch-delhi", kind: "CUSTOMER",
      destinations: { WHATSAPP: "+919900000042", SMS: "+919900000042" }, consent: { WHATSAPP: true, SMS: true }, optedOut: [] }],
  });
  api.testing.queueProviderOutcomes("WHATSAPP", [
    { kind: "TRANSIENT_FAILURE", reason: "Provider timed out" },
    { kind: "TRANSIENT_FAILURE", reason: "Provider unavailable" },
  ]);
  assert.equal(api.domainEvents.ingest({
    id: "event-approval-needed", tenantId: "tenant-north", branchId: "branch-delhi", type: "APPROVAL_NEEDED",
    occurredAt: "2026-09-11T06:00:00.000Z",
    notification: { recipientId: "customer-42", templateKey: "approval-needed", templateVersion: 2,
      channels: ["WHATSAPP"], variables: { estimate: "EST-42" }, whatsappFallbackToSms: true },
  }).status, 201);

  assert.deepEqual(await api.worker.drain("2026-09-11T06:00:00.000Z"), { processed: 1, providerCalls: 1 });
  assert.equal(api.testing.deliveries()[0].status, "RETRY_SCHEDULED");
  assert.equal(api.testing.deliveries()[0].nextAttemptAt, "2026-09-11T06:01:00.000Z");
  assert.deepEqual(await api.worker.drain("2026-09-11T06:00:59.999Z"), { processed: 0, providerCalls: 0 });
  assert.deepEqual(await api.worker.drain("2026-09-11T06:01:00.000Z"), { processed: 1, providerCalls: 1 });

  const afterExhaustion = api.testing.deliveries();
  assert.equal(afterExhaustion[0].status, "DEAD_LETTER");
  assert.equal(afterExhaustion[0].failureReason, "Provider unavailable");
  assert.equal(afterExhaustion[1].channel, "SMS");
  assert.equal(afterExhaustion[1].fallbackOfDeliveryId, afterExhaustion[0].id);
  assert.deepEqual(await api.worker.drain("2026-09-11T06:01:00.000Z"), { processed: 1, providerCalls: 1 });
  assert.equal(api.testing.deliveries()[1].status, "PROVIDER_ACCEPTED");
  assert.deepEqual(api.testing.providerCalls().map((call) => call.channel), ["WHATSAPP", "WHATSAPP", "SMS"]);
});

test("latest consent and opt-out are enforced before dispatch and prevent provider effects", async () => {
  const api = createLocalActionNotificationApi({
    memberships,
    templates: [
      { tenantId: "tenant-north", key: "ready", version: 1, channel: "PUSH", body: "Vehicle ready" },
      { tenantId: "tenant-north", key: "ready", version: 1, channel: "WHATSAPP", body: "Vehicle ready" },
    ],
    recipients: [
      { id: "staff-advisor", tenantId: "tenant-north", branchId: "branch-delhi", kind: "STAFF", membershipId: "membership-advisor-1",
        destinations: { PUSH: "device-token-private" }, consent: { PUSH: false }, optedOut: [] },
      { id: "customer-42", tenantId: "tenant-north", branchId: "branch-delhi", kind: "CUSTOMER",
        destinations: { WHATSAPP: "+919900000042" }, consent: { WHATSAPP: true }, optedOut: [] },
    ],
  });
  assert.equal(api.domainEvents.ingest({ id: "push-no-consent", tenantId: "tenant-north", branchId: "branch-delhi", type: "READY",
    occurredAt: "2026-09-11T07:00:00.000Z", notification: { recipientId: "staff-advisor", templateKey: "ready", templateVersion: 1, channels: ["PUSH"] } }).status, 201);
  assert.equal(api.domainEvents.ingest({ id: "whatsapp-opt-out", tenantId: "tenant-north", branchId: "branch-delhi", type: "READY",
    occurredAt: "2026-09-11T07:00:00.000Z", notification: { recipientId: "customer-42", templateKey: "ready", templateVersion: 1, channels: ["WHATSAPP"] } }).status, 201);
  assert.equal(api.recipientPreferences.recordOptOut({ tenantId: "tenant-north", recipientId: "customer-42", channel: "WHATSAPP",
    occurredAt: "2026-09-11T07:00:01.000Z", source: "CUSTOMER_REPLY" }).status, 201);

  assert.deepEqual(await api.worker.drain("2026-09-11T07:01:00.000Z"), { processed: 2, providerCalls: 0 });
  assert.deepEqual(api.testing.deliveries().map((delivery) => delivery.status), ["SKIPPED_NO_CONSENT", "SKIPPED_OPT_OUT"]);
  assert.deepEqual(api.testing.providerCalls(), []);
  assert.equal(api.testing.preferenceHistory().length, 1);
});

test("provider status events are idempotent, terminal WhatsApp failure falls back once, and delivery evidence is retained", async () => {
  const api = createLocalActionNotificationApi({
    memberships,
    templates: [
      { tenantId: "tenant-north", key: "ready", version: 4, channel: "WHATSAPP", body: "Ready: {{job}}" },
      { tenantId: "tenant-north", key: "ready", version: 4, channel: "SMS", body: "Collect {{job}}" },
    ],
    recipients: [{ id: "customer-42", tenantId: "tenant-north", branchId: "branch-delhi", kind: "CUSTOMER",
      destinations: { WHATSAPP: "+919900000042", SMS: "+919900000042" }, consent: { WHATSAPP: true, SMS: true }, optedOut: [] }],
  });
  api.domainEvents.ingest({ id: "ready-42", tenantId: "tenant-north", branchId: "branch-delhi", type: "VEHICLE_READY",
    occurredAt: "2026-09-11T08:00:00.000Z", notification: { recipientId: "customer-42", templateKey: "ready", templateVersion: 4,
      channels: ["WHATSAPP"], variables: { job: "JOB-42" }, whatsappFallbackToSms: true } });
  await api.worker.drain("2026-09-11T08:00:01.000Z");
  const whatsapp = api.testing.deliveries()[0];

  const failed = { id: "provider-status-1", tenantId: "tenant-north", channel: "WHATSAPP" as const,
    providerMessageId: String(whatsapp.providerMessageId), status: "FAILED" as const, reason: "Undeliverable number",
    occurredAt: "2026-09-11T08:01:00.000Z" };
  assert.equal(api.providerStatuses.ingest(failed).status, 201);
  assert.equal(api.providerStatuses.ingest(structuredClone(failed)).status, 200);
  assert.equal(api.providerStatuses.ingest({ ...failed, status: "DELIVERED" }).body.code, "PROVIDER_STATUS_ID_REUSED");
  assert.equal(api.testing.deliveries()[0].status, "DEAD_LETTER");
  assert.equal(api.testing.deliveries().filter((delivery) => delivery.channel === "SMS").length, 1);

  await api.worker.drain("2026-09-11T08:01:00.000Z");
  const sms = api.testing.deliveries()[1];
  assert.equal(api.testing.providerCalls()[1].body, "Collect JOB-42", "fallback uses its own versioned SMS template");
  assert.equal(api.providerStatuses.ingest({ id: "provider-status-2", tenantId: "tenant-north", channel: "SMS",
    providerMessageId: String(sms.providerMessageId), status: "DELIVERED", occurredAt: "2026-09-11T08:02:00.000Z" }).status, 201);
  assert.equal(api.testing.deliveries()[1].status, "DELIVERED");
  assert.equal(api.testing.providerStatusHistory().length, 2);
});

test("dead letters require explicit replay and a successful replay cannot be dispatched again", async () => {
  const api = createLocalActionNotificationApi({
    memberships,
    templates: [{ tenantId: "tenant-north", key: "staff-alert", version: 1, channel: "PUSH", body: "Check job", maxAttempts: 1 }],
    recipients: [{ id: "staff-advisor", tenantId: "tenant-north", branchId: "branch-delhi", kind: "STAFF", membershipId: "membership-advisor-1",
      destinations: { PUSH: "device-token-private" }, consent: { PUSH: true }, optedOut: [] }],
  });
  api.testing.queueProviderOutcomes("PUSH", [{ kind: "PERMANENT_FAILURE", reason: "Invalid device token" }]);
  api.domainEvents.ingest({ id: "staff-alert-1", tenantId: "tenant-north", branchId: "branch-delhi", type: "STAFF_ALERT",
    occurredAt: "2026-09-11T09:00:00.000Z", notification: { recipientId: "staff-advisor", templateKey: "staff-alert", templateVersion: 1, channels: ["PUSH"] } });
  await api.worker.drain("2026-09-11T09:00:00.000Z");
  const deliveryId = api.testing.deliveries()[0].id;
  assert.equal(api.testing.deliveries()[0].status, "DEAD_LETTER");
  assert.equal(api.worker.replayDeadLetter(deliveryId, "2026-09-11T09:05:00.000Z", "Device token refreshed").status, 202);
  assert.equal(api.worker.replayDeadLetter(deliveryId, "2026-09-11T09:05:01.000Z", "Duplicate replay").status, 409);
  await api.worker.drain("2026-09-11T09:05:00.000Z");
  assert.equal(api.testing.deliveries()[0].status, "PROVIDER_ACCEPTED");
  assert.equal(api.worker.replayDeadLetter(deliveryId, "2026-09-11T09:06:00.000Z", "Not dead").status, 409);
  assert.deepEqual(await api.worker.drain("2026-09-11T09:06:00.000Z"), { processed: 0, providerCalls: 0 });
  assert.equal(api.testing.replayHistory().length, 1);
});

test("invalid or cross-tenant notification plans fail atomically before actions or outbox effects", () => {
  const api = createLocalActionNotificationApi({
    memberships,
    templates: [{ tenantId: "tenant-north", key: "approval", version: 2, channel: "WHATSAPP", body: "Approve {{estimate}}" }],
    recipients: [{ id: "customer-42", tenantId: "tenant-north", branchId: "branch-delhi", kind: "CUSTOMER",
      destinations: { WHATSAPP: "+919900000042" }, consent: { WHATSAPP: true }, optedOut: [] }],
  });
  const base = { tenantId: "tenant-north", branchId: "branch-delhi", type: "APPROVAL_NEEDED",
    occurredAt: "2026-09-11T10:00:00.000Z",
    action: { key: "approval:42", roles: ["SERVICE_ADVISOR"], priority: "HIGH" as const, title: "Approval needed",
      nextAction: "Open the estimate and contact the customer.", href: "/estimates/42" } };
  assert.equal(api.domainEvents.ingest({ ...base, id: "missing-version", notification: {
    recipientId: "customer-42", templateKey: "approval", templateVersion: 1, channels: ["WHATSAPP"] } }).body.code, "NOTIFICATION_TEMPLATE_NOT_FOUND");
  assert.equal(api.domainEvents.ingest({ ...base, id: "missing-variable", notification: {
    recipientId: "customer-42", templateKey: "approval", templateVersion: 2, channels: ["WHATSAPP"] } }).body.code, "TEMPLATE_VARIABLES_MISSING");
  assert.equal(api.domainEvents.ingest({ ...base, id: "missing-fallback", notification: {
    recipientId: "customer-42", templateKey: "approval", templateVersion: 2, channels: ["WHATSAPP"],
    variables: { estimate: "EST-42" }, whatsappFallbackToSms: true } }).body.code, "SMS_FALLBACK_TEMPLATE_NOT_FOUND");
  assert.equal(api.domainEvents.ingest({ ...base, id: "wrong-tenant", tenantId: "tenant-south", notification: {
    recipientId: "customer-42", templateKey: "approval", templateVersion: 2, channels: ["WHATSAPP"], variables: { estimate: "EST-42" } } }).body.code,
  "NOTIFICATION_RECIPIENT_NOT_FOUND");
  assert.deepEqual(api.testing.actions(), []);
  assert.deepEqual(api.testing.deliveries(), []);
});

test("PostgreSQL action and notification contract forces branch RLS, append-only evidence, unique effects, and durable claiming", async () => {
  const migration = await readFile(new URL("../db/migrations/010_action_inbox_notifications.sql", import.meta.url), "utf8");
  const tables = [
    "notification_domain_event", "action_inbox", "notification_template", "notification_recipient",
    "notification_preference_history", "notification_outbox", "in_app_notification",
    "notification_delivery_attempt", "provider_status_event", "notification_dead_letter_replay", "notification_audit",
  ];
  for (const table of tables) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /UNIQUE \(tenant_id, source_event_id, recipient_id, channel\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, provider_event_id\)/i);
  assert.match(migration, /CREATE FUNCTION workshopos\.claim_notification_outbox/i);
  assert.match(migration, /FOR UPDATE SKIP LOCKED/i);
  assert.match(migration, /next_attempt_at <= p_now/i);
  assert.match(migration, /CREATE FUNCTION workshopos\.reject_notification_ledger_mutation/i);
  for (const table of ["notification_domain_event", "notification_preference_history", "in_app_notification",
    "notification_delivery_attempt", "provider_status_event", "notification_dead_letter_replay", "notification_audit"]) {
    assert.match(migration, new RegExp(`BEFORE UPDATE OR DELETE ON workshopos\\.${table}`, "i"));
  }
});
