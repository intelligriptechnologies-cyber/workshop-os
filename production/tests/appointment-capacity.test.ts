import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalAppointmentCapacityApi } from "../src/appointment-capacity.js";

const scheduler = {
  identityId: "scheduler-north",
  membershipId: "membership-scheduler-north",
  tenantId: "tenant-north",
  branchIds: ["branch-delhi"],
  permissions: ["appointment.manage", "appointment.read", "appointment.overbook"],
};

const branchCapacity = {
  tenantId: "tenant-north",
  branchId: "branch-delhi",
  configurationVersionId: "capacity-v3",
  defaultBufferBeforeMinutes: 10,
  defaultBufferAfterMinutes: 15,
  bays: [
    { id: "bay-1", skills: ["GENERAL", "DETAILING"] },
    { id: "bay-2", skills: ["GENERAL", "ELECTRICAL"] },
  ],
  staff: [
    { id: "tech-a", skills: ["GENERAL", "DETAILING"] },
    { id: "tech-b", skills: ["GENERAL", "ELECTRICAL"] },
  ],
  closures: [{ startsAt: "2026-09-12T00:00:00.000Z", endsAt: "2026-09-13T00:00:00.000Z", reason: "Workshop holiday" }],
};

test("appointment creation is tenant-scoped, reserves qualified capacity, and safely replays", async () => {
  const api = createLocalAppointmentCapacityApi({ memberships: { scheduler }, branchCapacities: [branchCapacity] });
  const session = api.signIn("scheduler");
  const command = {
    tenantId: "tenant-untrusted",
    branchId: "branch-delhi",
    customerId: "customer-1",
    vehicleId: "vehicle-1",
    scheduledStart: "2026-09-11T05:00:00.000Z",
    durationMinutes: 60,
    requiredSkills: ["DETAILING"],
    requiredBaySkills: ["DETAILING"],
    reason: "Customer requested morning appointment",
  };

  const created = await session.post("/api/v1/appointments", command, {
    idempotencyKey: "appointment-create-1", now: "2026-09-10T10:00:00.000Z", requestId: "request-1",
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.appointment?.tenantId, "tenant-north");
  assert.equal(created.body.appointment?.status, "BOOKED");
  assert.equal(created.body.appointment?.assignedBayId, "bay-1");
  assert.equal(created.body.appointment?.assignedStaffId, "tech-a");
  assert.equal(created.body.appointment?.capacityConfigurationVersionId, "capacity-v3");
  assert.equal(created.body.appointment?.history[0].reason, command.reason);
  assert.equal(created.body.resourceVersion, 1);
  assert.match(String(created.body.auditReference), /^audit-appointment-/);

  const replay = await session.post("/api/v1/appointments", command, {
    idempotencyKey: "appointment-create-1", now: "2026-09-10T10:00:30.000Z", requestId: "request-retry",
  });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.appointment?.id, created.body.appointment?.id);
  assert.equal(replay.body.auditReference, created.body.auditReference);
  assert.equal((await session.get(`/api/v1/appointments/${created.body.appointment?.id}?branchId=branch-delhi`)).body.appointment?.history.length, 1);

  const changedReplay = await session.post("/api/v1/appointments", { ...command, durationMinutes: 90 }, {
    idempotencyKey: "appointment-create-1", now: "2026-09-10T10:01:00.000Z",
  });
  assert.equal(changedReplay.status, 409);
  assert.equal(changedReplay.body.code, "IDEMPOTENCY_KEY_REUSED");
});

test("reschedule, cancel, no-show, arrive, and convert use versions and preserve reasoned append-only history", async () => {
  const api = createLocalAppointmentCapacityApi({ memberships: { scheduler }, branchCapacities: [branchCapacity] });
  const session = api.signIn("scheduler");
  const book = async (key: string, start: string) => session.post("/api/v1/appointments", {
    branchId: "branch-delhi", customerId: `customer-${key}`, vehicleId: `vehicle-${key}`,
    scheduledStart: start, durationMinutes: 30, requiredSkills: ["GENERAL"], requiredBaySkills: ["GENERAL"], reason: "Telephone booking",
  }, { idempotencyKey: `create-${key}`, now: "2026-09-10T10:00:00.000Z" });

  const journey = await book("journey", "2026-09-11T05:00:00.000Z");
  const appointmentId = String(journey.body.appointment?.id);
  const missingVersion = await session.post(`/api/v1/appointments/${appointmentId}/reschedules`, {
    branchId: "branch-delhi", scheduledStart: "2026-09-11T07:00:00.000Z", durationMinutes: 45,
    requiredSkills: ["ELECTRICAL"], requiredBaySkills: ["ELECTRICAL"], reason: "Customer requested later slot", evidence: ["call-note-12"],
  }, { idempotencyKey: "reschedule-missing-version" });
  assert.equal(missingVersion.status, 428);

  const rescheduled = await session.post(`/api/v1/appointments/${appointmentId}/reschedules`, {
    branchId: "branch-delhi", scheduledStart: "2026-09-11T07:00:00.000Z", durationMinutes: 45,
    requiredSkills: ["ELECTRICAL"], requiredBaySkills: ["ELECTRICAL"], reason: "Customer requested later slot", evidence: ["call-note-12"],
  }, { idempotencyKey: "reschedule-journey", ifMatch: 1, now: "2026-09-10T10:10:00.000Z" });
  assert.equal(rescheduled.status, 200);
  assert.equal(rescheduled.body.resourceVersion, 2);
  assert.equal(rescheduled.body.appointment?.assignedBayId, "bay-2");
  assert.equal(rescheduled.body.appointment?.history[1].action, "RESCHEDULED");
  assert.equal(rescheduled.body.appointment?.history[1].oldSchedule?.scheduledStart, "2026-09-11T05:00:00.000Z");

  const stale = await session.post(`/api/v1/appointments/${appointmentId}/transitions`, {
    branchId: "branch-delhi", action: "ARRIVE", reason: "Vehicle at reception", evidence: ["arrival-token-9"],
  }, { idempotencyKey: "arrive-stale", ifMatch: 1, now: "2026-09-11T06:55:00.000Z" });
  assert.equal(stale.status, 412);

  const arrived = await session.post(`/api/v1/appointments/${appointmentId}/transitions`, {
    branchId: "branch-delhi", action: "ARRIVE", reason: "Vehicle at reception", evidence: ["arrival-token-9"],
  }, { idempotencyKey: "arrive-journey", ifMatch: 2, now: "2026-09-11T06:55:00.000Z" });
  assert.equal(arrived.body.appointment?.status, "ARRIVED");
  const converted = await session.post(`/api/v1/appointments/${appointmentId}/transitions`, {
    branchId: "branch-delhi", action: "CONVERT", reason: "Reception accepted handoff", evidence: ["handoff-ack-2"],
  }, { idempotencyKey: "convert-journey", ifMatch: 3, now: "2026-09-11T07:00:00.000Z" });
  assert.equal(converted.status, 202);
  assert.equal(converted.body.appointment?.status, "CONVERTED");
  assert.equal(converted.body.receptionRequest?.eventType, "RECEPTION_CHECK_IN_REQUESTED");
  assert.equal(converted.body.receptionRequest?.appointmentVersion, 4);
  const convertReplay = await session.post(`/api/v1/appointments/${appointmentId}/transitions`, {
    branchId: "branch-delhi", action: "CONVERT", reason: "Reception accepted handoff", evidence: ["handoff-ack-2"],
  }, { idempotencyKey: "convert-journey", ifMatch: 3, now: "2026-09-11T07:01:00.000Z" });
  assert.equal(convertReplay.status, 200);
  assert.equal(convertReplay.body.receptionRequest?.id, converted.body.receptionRequest?.id);

  const cancelledSeed = await book("cancel", "2026-09-11T09:00:00.000Z");
  const cancelled = await session.post(`/api/v1/appointments/${cancelledSeed.body.appointment?.id}/transitions`, {
    branchId: "branch-delhi", action: "CANCEL", reason: "Customer travelling", evidence: ["call-note-cancel"],
  }, { idempotencyKey: "cancel-appointment", ifMatch: 1, now: "2026-09-10T11:00:00.000Z" });
  assert.equal(cancelled.body.appointment?.status, "CANCELLED");

  const noShowSeed = await book("no-show", "2026-09-11T10:00:00.000Z");
  const noShow = await session.post(`/api/v1/appointments/${noShowSeed.body.appointment?.id}/transitions`, {
    branchId: "branch-delhi", action: "MARK_NO_SHOW", reason: "No arrival after follow-up", evidence: ["call-attempt-44"],
  }, { idempotencyKey: "no-show-appointment", ifMatch: 1, now: "2026-09-11T11:00:00.000Z" });
  assert.equal(noShow.body.appointment?.status, "NO_SHOW");
  assert.deepEqual(noShow.body.appointment?.history.map((entry) => [entry.action, entry.reason]), [
    ["CREATED", "Telephone booking"], ["NO_SHOW", "No arrival after follow-up"],
  ]);
});

test("availability honors closures, qualified bays and staff, duration, and reservation buffers", async () => {
  const api = createLocalAppointmentCapacityApi({ memberships: { scheduler }, branchCapacities: [branchCapacity] });
  const session = api.signIn("scheduler");
  const query = (values: Record<string, string>) => `/api/v1/appointments/availability?${new URLSearchParams({ branchId: "branch-delhi", ...values })}`;

  const holiday = await session.get(query({ scheduledStart: "2026-09-12T05:00:00.000Z", durationMinutes: "60", requiredSkills: "GENERAL", requiredBaySkills: "GENERAL" }));
  assert.equal(holiday.status, 200);
  assert.equal(holiday.body.availability?.available, false);
  assert.equal(holiday.body.availability?.code, "BRANCH_CLOSED");
  assert.equal(holiday.body.availability?.closureReason, "Workshop holiday");

  const noSkill = await session.get(query({ scheduledStart: "2026-09-11T05:00:00.000Z", durationMinutes: "60", requiredSkills: "PAINT", requiredBaySkills: "GENERAL" }));
  assert.equal(noSkill.body.availability?.code, "NO_QUALIFIED_STAFF");

  await session.post("/api/v1/appointments", {
    branchId: "branch-delhi", customerId: "customer-buffer", vehicleId: "vehicle-buffer",
    scheduledStart: "2026-09-11T05:00:00.000Z", durationMinutes: 60,
    requiredSkills: ["DETAILING"], requiredBaySkills: ["DETAILING"], reason: "Detailing booking",
  }, { idempotencyKey: "create-buffer-booking" });
  const bufferConflict = await session.get(query({
    scheduledStart: "2026-09-11T06:20:00.000Z", durationMinutes: "30", bufferBeforeMinutes: "10", bufferAfterMinutes: "15",
    requiredSkills: "DETAILING", requiredBaySkills: "DETAILING",
  }));
  assert.equal(bufferConflict.body.availability?.available, false);
  assert.equal(bufferConflict.body.availability?.code, "CAPACITY_UNAVAILABLE");
  const afterBuffer = await session.get(query({
    scheduledStart: "2026-09-11T06:25:00.000Z", durationMinutes: "30", bufferBeforeMinutes: "10", bufferAfterMinutes: "15",
    requiredSkills: "DETAILING", requiredBaySkills: "DETAILING",
  }));
  assert.equal(afterBuffer.body.availability?.available, true);
  assert.deepEqual(afterBuffer.body.availability?.availableBayIds, ["bay-1"]);
  assert.deepEqual(afterBuffer.body.availability?.availableStaffIds, ["tech-a"]);
});

test("concurrent booking has one winner while overbooking needs separate authority, reason, and evidence", async () => {
  const ordinary = { ...scheduler, identityId: "ordinary", membershipId: "membership-ordinary", permissions: ["appointment.manage", "appointment.read"] };
  const api = createLocalAppointmentCapacityApi({ memberships: { scheduler, ordinary }, branchCapacities: [branchCapacity] });
  const body = (key: string) => ({
    branchId: "branch-delhi", customerId: `customer-${key}`, vehicleId: `vehicle-${key}`,
    scheduledStart: "2026-09-11T05:00:00.000Z", durationMinutes: 60,
    requiredSkills: ["DETAILING"], requiredBaySkills: ["DETAILING"], reason: "Requested detailing slot",
  });
  const [first, second] = await Promise.all([
    api.signIn("ordinary").post("/api/v1/appointments", body("first"), { idempotencyKey: "race-first" }),
    api.signIn("ordinary").post("/api/v1/appointments", body("second"), { idempotencyKey: "race-second" }),
  ]);
  assert.deepEqual([first.status, second.status].sort(), [201, 409]);

  const denied = await api.signIn("ordinary").post("/api/v1/appointments", {
    ...body("denied"), overbooking: { reason: "Urgent roadside repair", evidence: ["manager-call-1"] },
  }, { idempotencyKey: "overbook-denied" });
  assert.equal(denied.status, 403);
  assert.equal(denied.body.code, "OVERBOOK_PERMISSION_REQUIRED");

  const missingEvidence = await api.signIn("scheduler").post("/api/v1/appointments", {
    ...body("missing-evidence"), overbooking: { reason: "Urgent roadside repair", evidence: [] },
  }, { idempotencyKey: "overbook-missing-evidence" });
  assert.equal(missingEvidence.status, 422);
  assert.equal(missingEvidence.body.code, "OVERBOOK_REASON_AND_EVIDENCE_REQUIRED");

  const overbooked = await api.signIn("scheduler").post("/api/v1/appointments", {
    ...body("authorized"), overbooking: { reason: "Emergency customer commitment", evidence: ["manager-authorization-7"] },
  }, { idempotencyKey: "overbook-authorized", requestId: "overbook-request-7" });
  assert.equal(overbooked.status, 201);
  assert.equal(overbooked.body.appointment?.overbooked, true);
  assert.equal(overbooked.body.appointment?.history[0].reason, "Requested detailing slot");
  assert.deepEqual(overbooked.body.appointment?.history[0].evidence, ["manager-authorization-7"]);

  const closed = await api.signIn("scheduler").post("/api/v1/appointments", {
    ...body("closed"), scheduledStart: "2026-09-12T05:00:00.000Z",
    overbooking: { reason: "Try holiday override", evidence: ["manager-authorization-8"] },
  }, { idempotencyKey: "overbook-closure" });
  assert.equal(closed.status, 409);
  assert.equal(closed.body.code, "BRANCH_CLOSED");
});

test("appointment reads and reception handoff fail closed by tenant and invalid commands leave capacity unchanged", async () => {
  const south = { ...scheduler, identityId: "scheduler-south", membershipId: "membership-scheduler-south", tenantId: "tenant-south" };
  const southCapacity = { ...branchCapacity, tenantId: "tenant-south", closures: [] };
  const api = createLocalAppointmentCapacityApi({ memberships: { scheduler, south }, branchCapacities: [branchCapacity, southCapacity] });
  const north = api.signIn("scheduler");
  const created = await north.post("/api/v1/appointments", {
    branchId: "branch-delhi", customerId: "customer-isolated", vehicleId: "vehicle-isolated",
    scheduledStart: "2026-09-11T05:00:00.000Z", durationMinutes: 60,
    requiredSkills: ["DETAILING"], requiredBaySkills: ["DETAILING"], reason: "Isolation test booking",
  }, { idempotencyKey: "isolated-create" });
  const appointmentId = String(created.body.appointment?.id);
  assert.equal((await api.signIn("south").get(`/api/v1/appointments/${appointmentId}?branchId=branch-delhi`)).status, 404);
  assert.equal((await north.get(`/api/v1/appointments/${appointmentId}?branchId=branch-jaipur`)).status, 403);

  const invalidConvert = await north.post(`/api/v1/appointments/${appointmentId}/transitions`, {
    branchId: "branch-delhi", action: "CONVERT", reason: "Invalid early conversion", evidence: ["operator-note"],
  }, { idempotencyKey: "invalid-convert", ifMatch: 1 });
  assert.equal(invalidConvert.status, 409);
  const unchanged = await north.get(`/api/v1/appointments/${appointmentId}?branchId=branch-delhi`);
  assert.equal(unchanged.body.resourceVersion, 1);
  assert.equal(unchanged.body.appointment?.history.length, 1);

  await north.post(`/api/v1/appointments/${appointmentId}/transitions`, {
    branchId: "branch-delhi", action: "ARRIVE", reason: "Vehicle arrived", evidence: ["arrival-note"],
  }, { idempotencyKey: "isolated-arrive", ifMatch: 1 });
  await north.post(`/api/v1/appointments/${appointmentId}/transitions`, {
    branchId: "branch-delhi", action: "CONVERT", reason: "Handed to reception", evidence: ["handoff-note"],
  }, { idempotencyKey: "isolated-convert", ifMatch: 2 });
  await north.post(`/api/v1/appointments/${appointmentId}/transitions`, {
    branchId: "branch-delhi", action: "CONVERT", reason: "Handed to reception", evidence: ["handoff-note"],
  }, { idempotencyKey: "isolated-convert", ifMatch: 2 });
  const requests = await north.get("/api/v1/appointments/reception-requests?branchId=branch-delhi");
  assert.equal(requests.status, 200);
  assert.equal(requests.body.receptionRequests?.length, 1);
  assert.equal(requests.body.receptionRequests?.[0].appointmentId, appointmentId);

  const released = await north.get(`/api/v1/appointments/availability?${new URLSearchParams({
    branchId: "branch-delhi", scheduledStart: "2026-09-11T05:00:00.000Z", durationMinutes: "60",
    requiredSkills: "DETAILING", requiredBaySkills: "DETAILING",
  })}`);
  assert.equal(released.body.availability?.available, true);
});

test("PostgreSQL appointment contract forces RLS, immutable history/events, and serialized capacity enforcement", async () => {
  const migration = await readFile(new URL("../db/migrations/006_appointment_capacity.sql", import.meta.url), "utf8");
  const tables = [
    "appointment_capacity_resource", "appointment_branch_closure", "appointment", "appointment_resource_reservation",
    "appointment_history", "appointment_reception_outbox", "appointment_audit", "appointment_idempotency",
  ];
  for (const table of tables) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /resource_version bigint NOT NULL CHECK \(resource_version > 0\)/i);
  assert.match(migration, /capacity_configuration_version_id uuid NOT NULL/i);
  assert.match(migration, /CHECK \(scheduled_end > scheduled_start\)/i);
  assert.match(migration, /CHECK \(reserved_end > reserved_start\)/i);
  assert.match(migration, /enforce_appointment_reservation_capacity/i);
  assert.match(migration, /pg_advisory_xact_lock/i);
  assert.match(migration, /OVERBOOK_AUTHORIZATION_REQUIRED/i);
  assert.match(migration, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, appointment_id, appointment_version, resource_kind\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, appointment_id, appointment_version\)/i);
  assert.match(migration, /reject_appointment_ledger_mutation/i);
  for (const table of ["appointment_resource_reservation", "appointment_history", "appointment_reception_outbox", "appointment_audit"]) {
    assert.match(migration, new RegExp(`BEFORE UPDATE OR DELETE ON workshopos\\.${table}`, "i"));
  }
});
