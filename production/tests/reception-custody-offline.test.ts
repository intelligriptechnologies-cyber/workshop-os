import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createLocalReceptionApi,
  createReceptionDraftStore,
  type ReceptionCheckInRequest,
} from "../src/reception-custody-offline.js";

const reception = {
  identityId: "reception-north",
  membershipId: "membership-reception-north",
  tenantId: "tenant-north",
  branchIds: ["branch-delhi"],
  permissions: ["reception.check-in", "reception.read", "custody.incident.create", "custody.incident.read"],
};

const appointmentEvent: ReceptionCheckInRequest = {
  id: "reception-request-42",
  tenantId: "tenant-north",
  branchId: "branch-delhi",
  appointmentId: "appointment-42",
  appointmentVersion: 3,
  customerId: "customer-42",
  vehicleId: "vehicle-42",
  assignedBayId: "bay-2",
  assignedStaffId: "technician-7",
  requestedAt: "2026-09-11T04:30:00.000Z",
  auditReference: "audit-appointment-42",
  eventType: "RECEPTION_CHECK_IN_REQUESTED",
};

const configuration = {
  tenantId: "tenant-north",
  branchId: "branch-delhi",
  versionId: "reception-config-v4",
  requiredPhotoKinds: ["FRONT", "REAR", "ODOMETER"],
  acknowledgementTextVersion: "custody-ack-v2",
};

const evidence = [
  { kind: "FRONT", objectKey: "private/tenant-north/branch-delhi/reception/front.jpg", checksumSha256: "a".repeat(64), scanStatus: "CLEAN" },
  { kind: "REAR", objectKey: "private/tenant-north/branch-delhi/reception/rear.jpg", checksumSha256: "b".repeat(64), scanStatus: "CLEAN" },
  { kind: "ODOMETER", objectKey: "private/tenant-north/branch-delhi/reception/odo.jpg", checksumSha256: "c".repeat(64), scanStatus: "CLEAN" },
];

const checkInBody = {
  branchId: "branch-delhi",
  source: { type: "APPOINTMENT", receptionRequestId: appointmentEvent.id },
  advisorIdentityId: "advisor-4",
  odometerKm: 24510,
  fuelLevelEighths: 5,
  keyCount: 2,
  accessories: ["SPARE_WHEEL", "TOOL_KIT"],
  customerRequest: "Annual service and brake noise",
  promisedHandoffAt: "2026-09-11T05:00:00.000Z",
  evidence,
  acknowledgement: { accepted: true, textVersion: "custody-ack-v2", signerName: "Aarav Sharma", method: "SIGNATURE",
    evidence: { kind: "ACKNOWLEDGEMENT", objectKey: "private/tenant-north/branch-delhi/reception/signature.png", checksumSha256: "e".repeat(64), scanStatus: "CLEAN" } },
};

test("appointment reception event atomically creates exactly one Visit and linked draft Job under safe replay", async () => {
  const api = createLocalReceptionApi({ memberships: { reception }, receptionConfigurations: [configuration], appointmentEvents: [appointmentEvent] });
  const session = api.signIn("reception");

  const created = await session.post("/api/v1/reception/check-ins", checkInBody, {
    idempotencyKey: "check-in-42", now: "2026-09-11T04:45:00.000Z", requestId: "request-42",
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.visit?.appointmentId, "appointment-42");
  assert.equal(created.body.visit?.customerId, "customer-42");
  assert.equal(created.body.visit?.vehicleId, "vehicle-42");
  assert.equal(created.body.visit?.advisorIdentityId, "advisor-4");
  assert.equal(created.body.visit?.receptionConfigurationVersionId, "reception-config-v4");
  assert.equal(created.body.job?.visitId, created.body.visit?.id);
  assert.equal(created.body.job?.status, "DRAFT");
  assert.equal(created.body.job?.customerRequest, "Annual service and brake noise");
  assert.equal(created.body.resourceVersion, 1);
  assert.match(String(created.body.auditReference), /^audit-reception-/);

  const replay = await session.post("/api/v1/reception/check-ins", checkInBody, {
    idempotencyKey: "check-in-42", now: "2026-09-11T04:46:00.000Z", requestId: "request-retry",
  });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.visit?.id, created.body.visit?.id);
  assert.equal(replay.body.job?.id, created.body.job?.id);

  const listing = await session.get("/api/v1/reception/visits?branchId=branch-delhi");
  assert.equal(listing.body.visits?.length, 1);
  assert.equal(listing.body.jobs?.length, 1);
});

test("walk-in check-in requires the configured private evidence and acknowledgement before committing either record", async () => {
  const api = createLocalReceptionApi({ memberships: { reception }, receptionConfigurations: [configuration] });
  const session = api.signIn("reception");
  const walkIn = {
    ...checkInBody,
    source: { type: "WALK_IN" }, customerId: "customer-walk-in", vehicleId: "vehicle-walk-in",
    evidence: evidence.slice(0, 2),
  };
  const missing = await session.post("/api/v1/reception/check-ins", walkIn, { idempotencyKey: "walk-in" });
  assert.equal(missing.status, 422);
  assert.equal(missing.body.code, "REQUIRED_EVIDENCE_MISSING");
  assert.deepEqual(missing.body.missingEvidenceKinds, ["ODOMETER"]);
  assert.deepEqual((await session.get("/api/v1/reception/visits?branchId=branch-delhi")).body.visits, []);

  const invalidAck = await session.post("/api/v1/reception/check-ins", {
    ...walkIn, evidence, acknowledgement: { ...checkInBody.acknowledgement, textVersion: "stale-v1" },
  }, { idempotencyKey: "walk-in-invalid-ack" });
  assert.equal(invalidAck.body.code, "VALID_ACKNOWLEDGEMENT_REQUIRED");

  const created = await session.post("/api/v1/reception/check-ins", { ...walkIn, evidence }, { idempotencyKey: "walk-in-valid" });
  assert.equal(created.status, 201);
  assert.equal(created.body.visit?.appointmentId, undefined);
  assert.equal(created.body.visit?.customerId, "customer-walk-in");
  assert.deepEqual(created.body.visit?.accessories, ["SPARE_WHEEL", "TOOL_KIT"]);
  assert.equal(created.body.visit?.fuelLevelEighths, 5);
  assert.equal(created.body.visit?.keyCount, 2);
});

test("appointment events are single-consumer and tenant/branch authority ignores spoofed tenant input", async () => {
  const south = { ...reception, identityId: "reception-south", membershipId: "membership-south", tenantId: "tenant-south" };
  const otherBranch = { ...reception, identityId: "reception-jaipur", membershipId: "membership-jaipur", branchIds: ["branch-jaipur"] };
  const api = createLocalReceptionApi({ memberships: { reception, south, otherBranch }, receptionConfigurations: [configuration, { ...configuration, tenantId: "tenant-south" }], appointmentEvents: [appointmentEvent] });
  const session = api.signIn("reception");
  const created = await session.post("/api/v1/reception/check-ins", { ...checkInBody, tenantId: "tenant-south" }, { idempotencyKey: "first-consumer" });
  assert.equal(created.body.visit?.tenantId, "tenant-north");
  const duplicate = await session.post("/api/v1/reception/check-ins", checkInBody, { idempotencyKey: "second-consumer" });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.code, "RECEPTION_REQUEST_ALREADY_CONSUMED");
  assert.equal((await api.signIn("south").post("/api/v1/reception/check-ins", checkInBody, { idempotencyKey: "south" })).status, 404);
  assert.equal((await api.signIn("otherBranch").get("/api/v1/reception/visits?branchId=branch-delhi")).status, 403);

  const reused = await session.post("/api/v1/reception/check-ins", { ...checkInBody, customerRequest: "changed" }, { idempotencyKey: "first-consumer" });
  assert.equal(reused.status, 409);
  assert.equal(reused.body.code, "IDEMPOTENCY_KEY_REUSED");
});

test("custody incident is an independent evidenced case with severity, notification, owner, and actions", async () => {
  const api = createLocalReceptionApi({ memberships: { reception }, receptionConfigurations: [configuration] });
  const session = api.signIn("reception");
  const checkedIn = await session.post("/api/v1/reception/check-ins", {
    ...checkInBody, source: { type: "WALK_IN" }, customerId: "customer-incident", vehicleId: "vehicle-incident",
  }, { idempotencyKey: "incident-walk-in", now: "2026-09-11T05:00:00.000Z" });

  const created = await session.post("/api/v1/custody-incidents", {
    branchId: "branch-delhi", visitId: checkedIn.body.visit?.id, jobId: checkedIn.body.job?.id,
    vehicleId: "vehicle-incident", severity: "HIGH", category: "DAMAGE",
    description: "Fresh dent found on left door after vehicle movement",
    evidence: [{ kind: "DAMAGE", objectKey: "private/tenant-north/branch-delhi/incidents/dent.jpg", checksumSha256: "d".repeat(64), scanStatus: "CLEAN" }],
    ownerIdentityId: "manager-1", notifyIdentityIds: ["manager-1", "advisor-4"],
    actions: [
      { description: "Secure CCTV recording", ownerIdentityId: "manager-1", dueAt: "2026-09-11T07:00:00.000Z" },
      { description: "Call customer", ownerIdentityId: "advisor-4" },
    ],
  }, { idempotencyKey: "incident-1", now: "2026-09-11T05:15:00.000Z", requestId: "incident-request-1" });
  assert.equal(created.status, 202);
  assert.equal(created.body.incident?.severity, "HIGH");
  assert.equal(created.body.incident?.vehicleId, "vehicle-incident");
  assert.equal(created.body.incident?.ownerIdentityId, "manager-1");
  assert.equal(created.body.incident?.actions.length, 2);
  assert.equal(created.body.incident?.notification.status, "QUEUED");
  assert.deepEqual(created.body.incident?.notification.recipientIdentityIds, ["advisor-4", "manager-1"]);
  assert.match(String(created.body.incident?.notification.outboxEventId), /^custody-notification-/);

  const listed = await session.get("/api/v1/custody-incidents?branchId=branch-delhi");
  assert.equal(listed.body.incidents?.length, 1);
  assert.equal(listed.body.incidents?.[0].description, "Fresh dent found on left door after vehicle movement");
  assert.equal(listed.body.incidents?.[0].status, "OPEN");
  assert.equal(listed.body.jobs, undefined, "incident records are not Job notes");
});

test("custody incident rejects invalid links, absent evidence, and missing permission without side effects", async () => {
  const observer = { ...reception, identityId: "observer", membershipId: "observer-membership", permissions: ["reception.read", "custody.incident.read"] };
  const api = createLocalReceptionApi({ memberships: { reception, observer }, receptionConfigurations: [configuration] });
  const session = api.signIn("reception");
  const base = { branchId: "branch-delhi", visitId: "visit-missing", jobId: "job-missing", vehicleId: "vehicle-x",
    severity: "CRITICAL", category: "SAFETY", description: "Smoke", evidence: [], ownerIdentityId: "manager-1",
    notifyIdentityIds: ["manager-1"], actions: [{ description: "Isolate vehicle", ownerIdentityId: "manager-1" }] };
  assert.equal((await session.post("/api/v1/custody-incidents", base, { idempotencyKey: "invalid-links" })).body.code, "VISIT_JOB_LINK_INVALID");
  assert.equal((await api.signIn("observer").post("/api/v1/custody-incidents", base, { idempotencyKey: "denied" })).status, 403);
  assert.deepEqual((await session.get("/api/v1/custody-incidents?branchId=branch-delhi")).body.incidents, []);
});

test("local reception draft survives restart, remains visibly uncommitted, and supports explicit conflict recovery", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
  const first = createReceptionDraftStore({ storage, tenantId: "tenant-north", branchId: "branch-delhi", deviceId: "tablet-7" });
  const saved = first.save("draft-1", { customerId: "customer-1", vehicleId: "vehicle-1", odometerKm: 1000 }, {
    baseResourceVersion: 3, updatedAt: "2026-09-11T06:00:00.000Z",
  });
  assert.equal(saved.syncStatus, "UNCOMMITTED");
  assert.equal(saved.authoritative, false);
  assert.equal(saved.statusLabel, "Draft — not submitted");
  assert.equal(saved.localVersion, 1);

  const afterRestart = createReceptionDraftStore({ storage, tenantId: "tenant-north", branchId: "branch-delhi", deviceId: "tablet-7" });
  assert.deepEqual(afterRestart.get("draft-1")?.payload, { customerId: "customer-1", vehicleId: "vehicle-1", odometerKm: 1000 });
  const conflict = afterRestart.detectConflict("draft-1", 4);
  assert.equal(conflict?.syncStatus, "CONFLICT");
  assert.deepEqual(conflict?.conflict, { baseResourceVersion: 3, serverResourceVersion: 4 });

  const recovered = afterRestart.resolveConflict("draft-1", "REBASE", 4, "2026-09-11T06:05:00.000Z");
  assert.equal(recovered?.syncStatus, "UNCOMMITTED");
  assert.equal(recovered?.baseResourceVersion, 4);
  assert.equal(recovered?.localVersion, 2);
  assert.equal(recovered?.conflict, undefined);
});

test("offline draft boundary categorically blocks every authoritative or sensitive posting", () => {
  const values = new Map<string, string>();
  const store = createReceptionDraftStore({
    storage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } },
    tenantId: "tenant-north", branchId: "branch-delhi", deviceId: "tablet-7",
  });
  const categories = ["LIFECYCLE", "CUSTODY", "APPROVAL", "INVENTORY", "FINANCE", "QC_OVERRIDE", "CLOSURE", "GATE"] as const;
  for (const category of categories) {
    assert.deepEqual(store.attemptOfflinePosting(category), {
      status: 409, code: "ONLINE_REQUIRED", category, authoritative: false,
      message: `${category} actions cannot be posted offline. Reconnect to continue.`,
    });
  }
  assert.deepEqual(store.list(), [], "blocked postings never become a queue");
});

test("PostgreSQL reception contract forces tenant/branch RLS, atomic check-in, and append-only evidence", async () => {
  const migration = await readFile(new URL("../db/migrations/007_reception_custody_offline.sql", import.meta.url), "utf8");
  const tables = [
    "reception_visit", "reception_job_card", "reception_evidence", "reception_acknowledgement",
    "reception_event_consumption", "custody_incident", "custody_incident_evidence", "custody_incident_action",
    "custody_incident_notification_outbox", "reception_audit", "reception_idempotency",
  ];
  for (const table of tables) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /CREATE FUNCTION workshopos\.commit_reception_check_in/i);
  assert.match(migration, /INSERT INTO workshopos\.reception_visit/i);
  assert.match(migration, /INSERT INTO workshopos\.reception_job_card/i);
  assert.match(migration, /INSERT INTO workshopos\.reception_event_consumption/i);
  assert.match(migration, /UNIQUE \(tenant_id, source_event_id\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, branch_id, visit_id\)/i);
  assert.match(migration, /object_key text NOT NULL CHECK \(object_key LIKE 'private\/%'/i);
  assert.match(migration, /checksum_sha256 text NOT NULL CHECK \(checksum_sha256 ~ '\^\[0-9a-fA-F\]\{64\}\$'\)/i);
  assert.match(migration, /reject_reception_ledger_mutation/i);
  for (const table of ["reception_evidence", "reception_acknowledgement", "reception_event_consumption", "custody_incident_evidence", "custody_incident_notification_outbox", "reception_audit"]) {
    assert.match(migration, new RegExp(`BEFORE UPDATE OR DELETE ON workshopos\\.${table}`, "i"));
  }
  assert.match(migration, /UNIQUE \(tenant_id, idempotency_key\)/i);
});
