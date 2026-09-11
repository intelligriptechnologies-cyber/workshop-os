import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createLocalWarrantyIncidentApi,
  type WarrantyIncidentMembership,
} from "../src/warranty-incidents.js";

const memberships: Record<string, WarrantyIncidentMembership> = {
  advisor: {
    identityId: "identity-advisor", membershipId: "membership-advisor", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], permissions: ["warranty.read", "warranty.create"],
  },
  outsider: {
    identityId: "identity-outsider", membershipId: "membership-outsider", tenantId: "tenant-south",
    branchIds: ["branch-chennai"], permissions: ["warranty.read", "warranty.create"],
  },
  incidentManager: {
    identityId: "identity-manager", membershipId: "membership-manager", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], permissions: ["custody.incident.read", "custody.incident.escalate", "custody.incident.resolve", "legal-hold.create", "legal-hold.read", "legal-hold.release"],
  },
  retentionOfficer: {
    identityId: "identity-retention", membershipId: "membership-retention", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], permissions: ["legal-hold.read", "legal-hold.release"],
  },
};

const deliveredJob = {
  tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-original", visitId: "visit-original",
  customerId: "customer-1", vehicleId: "vehicle-1", deliveredAt: "2026-08-15T10:00:00.000Z",
  lifecycleStatus: "CLOSED" as const, financeStatus: "CLOSED" as const, finalizedInvoiceId: "invoice-original",
  warrantySnapshot: {
    policyMasterId: "policy-detailing", version: 3, snapshottedAt: "2026-08-01T08:00:00.000Z",
    terms: [
      { sourceType: "SERVICE" as const, sourceId: "service-detailing", description: "Paint protection workmanship", durationDays: 365, distanceKm: 12000 },
      { sourceType: "ITEM" as const, sourceId: "item-coating", description: "Coating material", durationDays: 730, distanceKm: 20000 },
    ],
  },
};

const cleanIncidentEvidence = (name: string) => ({
  kind: "PHOTO" as const, objectKey: `private/tenant-north/branch-delhi/incidents/${name}.jpg`,
  checksumSha256: "c".repeat(64), scanStatus: "CLEAN" as const,
});

const openIncident = {
  id: "custody-incident-7", tenantId: "tenant-north", branchId: "branch-delhi", visitId: "visit-original",
  jobId: "job-original", vehicleId: "vehicle-1", severity: "HIGH" as const, category: "DAMAGE" as const,
  description: "Dent reported after vehicle movement", evidence: [cleanIncidentEvidence("intake")],
  ownerIdentityId: "identity-manager", actions: [{ description: "Review CCTV", ownerIdentityId: "identity-manager", status: "OPEN" as const }],
  notification: { recipientIdentityIds: ["identity-manager"], status: "QUEUED" as const, outboxEventId: "custody-notification-7" },
  status: "OPEN" as const, createdAt: "2026-09-11T08:00:00.000Z", resourceVersion: 1,
};

test("claim intake exposes immutable delivered-Job warranty terms and creates linked new operational records without reopening finance", async () => {
  const api = createLocalWarrantyIncidentApi({ memberships, deliveredJobs: [deliveredJob] });
  const advisor = api.signIn("advisor");

  const intake = await advisor.get("/api/v1/jobs/job-original/warranty-intake?branchId=branch-delhi");
  assert.equal(intake.status, 200);
  assert.equal(intake.body.originalJob?.financeStatus, "CLOSED");
  assert.equal(intake.body.warrantySnapshot?.version, 3);
  assert.deepEqual(intake.body.warrantySnapshot?.terms.map((term) => term.sourceType), ["SERVICE", "ITEM"]);

  const created = await advisor.post("/api/v1/warranty-claims", {
    branchId: "branch-delhi", originalJobId: "job-original", classification: "WARRANTY",
    diagnosis: "Coating has lifted on the left door", responsibility: "WORKSHOP",
    payer: { type: "WORKSHOP", payerId: "tenant-north" }, costOwner: { type: "BRANCH", ownerId: "branch-delhi" },
    scope: [{ code: "REAPPLY_COATING", description: "Strip and reapply coating to left door" }],
    outcome: "REMEDIAL_WORK_REQUIRED", customerRequest: "Inspect peeling coating",
  }, { idempotencyKey: "claim-1", ifMatch: 1, now: "2026-09-11T13:00:00.000Z" });
  assert.equal(created.status, 201);
  assert.equal(created.body.claim?.originalJobId, "job-original");
  assert.notEqual(created.body.visit?.id, "visit-original");
  assert.notEqual(created.body.job?.id, "job-original");
  assert.equal(created.body.job?.linkedOriginalJobId, "job-original");
  assert.equal(created.body.job?.jobType, "WARRANTY_COMEBACK");
  assert.equal(created.body.originalJob?.lifecycleStatus, "CLOSED");
  assert.equal(created.body.originalJob?.financeStatus, "CLOSED");
  assert.equal(created.body.originalJob?.finalizedInvoiceId, "invoice-original");
});

test("later warranty policy changes cannot rewrite the terms snapshotted on delivery", async () => {
  const mutableSource = structuredClone(deliveredJob);
  const api = createLocalWarrantyIncidentApi({ memberships, deliveredJobs: [mutableSource] });
  mutableSource.warrantySnapshot.version = 99;
  mutableSource.warrantySnapshot.terms[0].description = "Retroactively shortened term";
  const intake = await api.signIn("advisor").get("/api/v1/jobs/job-original/warranty-intake?branchId=branch-delhi");
  assert.equal(intake.body.warrantySnapshot?.version, 3);
  assert.equal(intake.body.warrantySnapshot?.terms[0].description, "Paint protection workmanship");
});

test("claim creation fails closed for incomplete attribution, tenant scope, stale writers, replay misuse, and concurrent duplicates", async () => {
  const api = createLocalWarrantyIncidentApi({ memberships, deliveredJobs: [deliveredJob] });
  const body = {
    branchId: "branch-delhi", originalJobId: "job-original", classification: "COMEBACK",
    diagnosis: "Noise returned after repair", responsibility: "UNDETERMINED",
    payer: { type: "CUSTOMER", payerId: "customer-1" }, costOwner: { type: "CUSTOMER", ownerId: "customer-1" },
    scope: [{ code: "DIAGNOSE_NOISE", description: "Repeat road test and diagnose" }],
    outcome: "REMEDIAL_WORK_REQUIRED", customerRequest: "Noise has returned",
  };
  const advisor = api.signIn("advisor");
  const invalid = await advisor.post("/api/v1/warranty-claims", { ...body, diagnosis: "" },
    { idempotencyKey: "invalid", ifMatch: 1 });
  assert.equal(invalid.status, 422);
  assert.equal(api.testing.claims().length, 0);
  assert.equal((await api.signIn("outsider").post("/api/v1/warranty-claims", body,
    { idempotencyKey: "cross-tenant", ifMatch: 1 })).status, 403);
  assert.equal((await advisor.post("/api/v1/warranty-claims", body,
    { idempotencyKey: "stale", ifMatch: 2 })).status, 412);

  const [left, right] = await Promise.all([
    advisor.post("/api/v1/warranty-claims", body, { idempotencyKey: "race-left", ifMatch: 1 }),
    advisor.post("/api/v1/warranty-claims", body, { idempotencyKey: "race-right", ifMatch: 1 }),
  ]);
  assert.deepEqual([left.status, right.status].sort(), [201, 409]);
  const replay = await advisor.post("/api/v1/warranty-claims", body, { idempotencyKey: "race-left", ifMatch: 1 });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.claim?.id, left.body.claim?.id);
  const reused = await advisor.post("/api/v1/warranty-claims", { ...body, diagnosis: "Changed" },
    { idempotencyKey: "race-left", ifMatch: 1 });
  assert.equal(reused.status, 409);
  assert.equal(api.testing.claims().length, 1);
});

test("an authorized custody owner escalates an independent evidenced case and resolves it only with evidence and acknowledgement", async () => {
  const api = createLocalWarrantyIncidentApi({ memberships, deliveredJobs: [deliveredJob], custodyIncidents: [openIncident] });
  const manager = api.signIn("incidentManager");
  const escalated = await manager.post("/api/v1/custody-incidents/custody-incident-7/escalations", {
    branchId: "branch-delhi", severity: "CRITICAL", reason: "Safety review requires immediate escalation",
    ownerIdentityId: "identity-manager", notifyIdentityIds: ["identity-manager", "identity-advisor"],
    actions: [{ description: "Obtain independent body inspection", ownerIdentityId: "identity-manager" }],
    evidence: [cleanIncidentEvidence("escalation")],
  }, { idempotencyKey: "incident-escalate", ifMatch: 1, now: "2026-09-11T13:10:00.000Z" });
  assert.equal(escalated.status, 200);
  assert.equal(escalated.body.incident?.status, "ESCALATED");
  assert.equal(escalated.body.incident?.severity, "CRITICAL");
  assert.equal(escalated.body.incident?.resourceVersion, 2);
  assert.equal(escalated.body.incident?.notification.recipientIdentityIds.length, 2);

  const missingAcknowledgement = await manager.post("/api/v1/custody-incidents/custody-incident-7/resolution", {
    branchId: "branch-delhi", outcome: "WORKSHOP_REPAIR_ACCEPTED", reason: "Repair agreed",
    evidence: [cleanIncidentEvidence("repair-agreement")],
  }, { idempotencyKey: "incident-resolution-invalid", ifMatch: 2 });
  assert.equal(missingAcknowledgement.status, 422);

  const resolved = await manager.post("/api/v1/custody-incidents/custody-incident-7/resolution", {
    branchId: "branch-delhi", outcome: "WORKSHOP_REPAIR_ACCEPTED", reason: "Customer accepted evidenced repair plan",
    evidence: [cleanIncidentEvidence("repair-agreement")], acknowledgement: {
      accepted: true, signerIdentityId: "customer-1", method: "SIGNATURE", evidence: cleanIncidentEvidence("customer-signature"),
    },
  }, { idempotencyKey: "incident-resolution", ifMatch: 2, now: "2026-09-11T13:20:00.000Z" });
  assert.equal(resolved.status, 200);
  assert.equal(resolved.body.incident?.status, "RESOLVED");
  assert.equal(resolved.body.resolution?.outcome, "WORKSHOP_REPAIR_ACCEPTED");
  assert.equal(resolved.body.resolution?.acknowledgement.signerIdentityId, "customer-1");
  assert.deepEqual(api.testing.incidentHistory().map((entry) => entry.action), ["ESCALATED", "RESOLVED"]);
  assert.equal(api.testing.releaseEvents()[0].type, "S17_INCIDENT_RESOLVED");
});

test("legal hold protects incident records and media from expiry or purge until a distinct authorized actor releases it", async () => {
  const api = createLocalWarrantyIncidentApi({ memberships, deliveredJobs: [deliveredJob], custodyIncidents: [openIncident] });
  const manager = api.signIn("incidentManager");
  const held = await manager.post("/api/v1/legal-holds", {
    branchId: "branch-delhi", targetType: "CUSTODY_INCIDENT", targetId: "custody-incident-7",
    appliesTo: ["RECORD", "MEDIA"], reason: "Customer damage dispute under legal review",
  }, { idempotencyKey: "hold-incident", ifMatch: 1, now: "2026-09-11T14:00:00.000Z" });
  assert.equal(held.status, 201);
  assert.equal(held.body.legalHold?.status, "ACTIVE");

  const protectedState = await manager.get("/api/v1/retention/CUSTODY_INCIDENT/custody-incident-7?branchId=branch-delhi");
  assert.equal(protectedState.status, 200);
  assert.equal(protectedState.body.retention?.legalHoldActive, true);
  assert.equal(protectedState.body.retention?.recordPurgeAllowed, false);
  assert.equal(protectedState.body.retention?.mediaExpiryAllowed, false);

  const selfRelease = await manager.post(`/api/v1/legal-holds/${held.body.legalHold?.id}/release`, {
    branchId: "branch-delhi", reason: "Legal review complete", evidence: [cleanIncidentEvidence("release-review")],
  }, { idempotencyKey: "self-release", ifMatch: 1, now: "2026-09-11T14:10:00.000Z", reauthenticatedAt: "2026-09-11T14:09:00.000Z" });
  assert.equal(selfRelease.status, 409);
  assert.equal(selfRelease.body.code, "INDEPENDENT_HOLD_RELEASER_REQUIRED");

  const released = await api.signIn("retentionOfficer").post(`/api/v1/legal-holds/${held.body.legalHold?.id}/release`, {
    branchId: "branch-delhi", reason: "Counsel confirmed dispute closure", evidence: [cleanIncidentEvidence("release-review")],
  }, { idempotencyKey: "release-hold", ifMatch: 1, now: "2026-09-11T14:10:00.000Z", reauthenticatedAt: "2026-09-11T14:09:00.000Z" });
  assert.equal(released.status, 200);
  assert.equal(released.body.legalHold?.status, "RELEASED");
  assert.equal(released.body.legalHoldRelease?.releasedByMembershipId, "membership-retention");
  const unblocked = await api.signIn("retentionOfficer").get("/api/v1/retention/CUSTODY_INCIDENT/custody-incident-7?branchId=branch-delhi");
  assert.equal(unblocked.body.retention?.legalHoldActive, false);
  assert.equal(unblocked.body.retention?.recordPurgeAllowed, true);
  assert.equal(unblocked.body.retention?.mediaExpiryAllowed, true);
  assert.equal(api.testing.legalHoldReleases().length, 1);
});

test("PostgreSQL warranty and incident contract forces scoped RLS, immutable links/evidence, serialized commands, and hold-aware retention", async () => {
  const sql = await readFile(new URL("../db/migrations/017_warranty_incidents.sql", import.meta.url), "utf8");
  for (const table of [
    "warranty_delivered_job_snapshot", "warranty_term_snapshot", "warranty_claim", "warranty_claim_scope",
    "custody_incident_escalation", "custody_incident_resolution", "custody_incident_acknowledgement",
    "warranty_incident_evidence", "warranty_incident_notification_outbox", "warranty_incident_event",
    "legal_hold", "legal_hold_release", "warranty_incident_command_receipt",
  ]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
    assert.match(sql, new RegExp(`CREATE POLICY ${table}_isolation`));
  }
  assert.match(sql, /original_lifecycle_status = 'CLOSED'/i);
  assert.match(sql, /original_finance_status = 'CLOSED'/i);
  assert.match(sql, /linked_original_job_id/i);
  assert.match(sql, /FOR UPDATE/i);
  assert.match(sql, /CREATE UNIQUE INDEX warranty_one_open_claim_per_original_job[\s\S]*\(tenant_id, original_job_id\) WHERE status = 'OPEN'/i);
  assert.match(sql, /S17_INCIDENT_RESOLVED/);
  assert.match(sql, /placed_by_membership_id <> released_by_membership_id/i);
  assert.match(sql, /assert_retention_not_held/i);
  assert.match(sql, /legal hold prevents record purge or media expiry/i);
  assert.match(sql, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(sql, /payload_fingerprint/i);
  for (const table of [
    "warranty_delivered_job_snapshot", "warranty_term_snapshot", "warranty_claim_scope", "custody_incident_escalation",
    "custody_incident_resolution", "custody_incident_acknowledgement", "warranty_incident_evidence",
    "warranty_incident_event", "legal_hold_release", "warranty_incident_command_receipt",
  ]) assert.match(sql, new RegExp(`CREATE TRIGGER ${table}_append_only`));
  assert.doesNotMatch(sql, /ON DELETE CASCADE/i);
});
