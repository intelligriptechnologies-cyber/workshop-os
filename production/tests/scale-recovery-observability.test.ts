import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalReleaseAssuranceHarness } from "../src/release-assurance.js";

test("provider and queue failure recover through retry, dead letter and replay with one correlated effect", () => {
  const harness = createLocalReleaseAssuranceHarness();
  const queued = harness.async.enqueue({
    tenantId: "tenant-a", branchId: "branch-a", kind: "DOCUMENT", effectKey: "invoice-42",
    correlationId: "corr-invoice-42", payload: { documentId: "invoice-42", customerName: "Sensitive Name" },
  });
  harness.async.injectOutcomes("invoice-42", ["TRANSIENT_FAILURE", "TRANSIENT_FAILURE", "SUCCESS"]);

  assert.deepEqual(harness.async.drain("2026-09-12T10:00:00.000Z"), { attempted: 1, effects: 0 });
  assert.deepEqual(harness.async.drain("2026-09-12T10:01:00.000Z"), { attempted: 1, effects: 0 });
  assert.equal(harness.async.deadLetters("tenant-a").length, 1);
  assert.equal(harness.async.replay("tenant-b", queued.eventId, "provider restored").code, "NOT_FOUND");
  assert.equal(harness.async.replay("tenant-a", queued.eventId, "provider restored").status, 202);
  assert.deepEqual(harness.async.drain("2026-09-12T10:02:00.000Z"), { attempted: 1, effects: 1 });
  assert.deepEqual(harness.async.deliverAgain(queued.eventId), { effects: 0 });
  assert.equal(harness.async.effects("tenant-a").length, 1);

  const telemetry = harness.observability.trace("tenant-a", "corr-invoice-42");
  assert.ok(telemetry.some((entry) => entry.event === "async.dead_lettered"));
  assert.ok(telemetry.some((entry) => entry.event === "async.replayed"));
  assert.ok(telemetry.some((entry) => entry.event === "async.effect_committed"));
  assert.ok(telemetry.every((entry) => entry.tenantId === "tenant-a"));
  assert.ok(telemetry.every((entry) => !JSON.stringify(entry).includes("Sensitive Name")));
  assert.deepEqual(harness.observability.trace("tenant-b", "corr-invoice-42"), []);
});

test("representative target-shape workload measures routine and authoritative p95 without claiming deployed scale", () => {
  const harness = createLocalReleaseAssuranceHarness();
  const report = harness.performance.evaluate({
    shape: { tenants: 500, branchesPerTenant: 25, usersPerTenant: 500, concurrentUsersPerTenant: 150,
      visitsPerBranchPerDay: 300, historyYears: 10 },
    routineMilliseconds: [50, 80, 120, 200, 1999, 400, 300, 100, 90, 70, 60, 55, 75, 95, 110, 130, 140, 150, 160, 170],
    authoritativeMilliseconds: [100, 200, 300, 400, 2999, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
  });

  assert.equal(report.routineP95Milliseconds, 400);
  assert.equal(report.authoritativeP95Milliseconds, 2000);
  assert.equal(report.passed, true);
  assert.equal(report.evidenceClass, "LOCAL_DETERMINISTIC_TARGET_SHAPE");
  assert.equal(report.provesDeployedAwsCapacity, false);
  assert.deepEqual(report.externalReleaseExercises, ["DEPLOYED_TARGET_LOAD", "TEN_YEAR_DATASET_QUERY_PLAN"]);
});

test("checksum-verified backup restore rehearsal measures RPO and RTO and preserves tenant boundaries", () => {
  const harness = createLocalReleaseAssuranceHarness();
  const snapshot = harness.recovery.capture("2026-09-12T10:00:00.000Z", {
    "tenant-a": { jobs: 120, ledgerMinor: "987654" },
    "tenant-b": { jobs: 45, ledgerMinor: "123456" },
  });
  const rehearsal = harness.recovery.restore(snapshot, {
    failureAt: "2026-09-12T10:12:00.000Z", completedAt: "2026-09-12T10:47:00.000Z",
  });

  assert.deepEqual(rehearsal, {
    status: "RESTORED", rpoMinutes: 12, rtoMinutes: 35, passed: true,
    evidenceClass: "LOCAL_DETERMINISTIC_RESTORE_REHEARSAL", provesAwsRegionalRecovery: false,
  });
  assert.deepEqual(harness.recovery.readRestored("tenant-a"), { jobs: 120, ledgerMinor: "987654" });
  assert.equal(harness.recovery.readRestored("tenant-c"), undefined);
  assert.equal(harness.recovery.restore({ ...snapshot, checksum: "tampered" }, {
    failureAt: "2026-09-12T10:12:00.000Z", completedAt: "2026-09-12T10:47:00.000Z",
  }).status, "CHECKSUM_MISMATCH");
});

test("availability SLO and provider, queue, backup health produce actionable tenant-safe alerts", () => {
  const harness = createLocalReleaseAssuranceHarness();
  const healthy = harness.health.evaluate({ monthMinutes: 43_200, unavailableMinutes: 40,
    queueOldestAgeSeconds: 60, deadLetterCount: 0, providerFailureRate: 0.01, backupAgeMinutes: 10 });
  assert.equal(healthy.availabilityPercent, 99.9074);
  assert.equal(healthy.sloMet, true);
  assert.deepEqual(healthy.alerts, []);

  const unhealthy = harness.health.evaluate({ monthMinutes: 43_200, unavailableMinutes: 50,
    queueOldestAgeSeconds: 901, deadLetterCount: 4, providerFailureRate: 0.21, backupAgeMinutes: 16 });
  assert.equal(unhealthy.sloMet, false);
  assert.deepEqual(unhealthy.alerts.map((alert) => alert.code), [
    "AVAILABILITY_SLO_BREACH", "QUEUE_STALLED", "DEAD_LETTERS_PRESENT", "PROVIDER_FAILURE_RATE_HIGH", "BACKUP_RPO_AT_RISK",
  ]);
  assert.ok(unhealthy.alerts.every((alert) => alert.runbook && alert.owner && !JSON.stringify(alert).includes("tenant-a")));
  assert.equal(unhealthy.evidenceClass, "LOCAL_CONTROL_EVALUATION");
  assert.equal(unhealthy.provesProductionAvailability, false);
});

test("durable persistence and infrastructure contracts expose claim, replay, telemetry, and actionable alarms", async () => {
  const migration = await readFile(new URL("../db/migrations/026_release_assurance.sql", import.meta.url), "utf8");
  const infrastructure = await readFile(new URL("../infra/template.yaml", import.meta.url), "utf8");
  for (const table of ["async_delivery", "async_delivery_attempt", "async_dead_letter_replay", "operational_telemetry", "recovery_rehearsal", "slo_evaluation", "operational_alert"]) {
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(migration, /FOR UPDATE SKIP LOCKED/i);
  assert.match(migration, /UNIQUE \(tenant_id, effect_kind, effect_key\)/i);
  assert.match(migration, /prevent_release_assurance_evidence_mutation/i);
  assert.match(infrastructure, /QueueAgeAlarm/);
  assert.match(infrastructure, /DeadLetterAlarm/);
  assert.match(infrastructure, /AWS::CloudWatch::Alarm/);
  assert.match(infrastructure, /AlarmActions:\s*\n\s*- !Ref OperationalAlertTopicArn/);
});

test("release remains blocked until authorized deployed load, availability, restore, and regional DR evidence is recorded", () => {
  const harness = createLocalReleaseAssuranceHarness();
  const decision = harness.release.evaluate({
    localAsyncRecoveryPassed: true, localTargetShapePassed: true, localRestorePassed: true, localControlsPassed: true,
    deployedTargetLoadEvidence: null, productionAvailabilityEvidence: null,
    productionRestoreEvidence: null, regionalDrEvidence: null,
  });
  assert.deepEqual(decision, { status: "BLOCKED", missing: [
    "DEPLOYED_TARGET_LOAD", "PRODUCTION_99_9_AVAILABILITY_WINDOW", "PRODUCTION_BACKUP_RESTORE", "AUTHORIZED_REGIONAL_DR",
  ] });
});

test("transactional outbox ingress covers every async domain and rejects effect-key payload collisions", () => {
  const harness = createLocalReleaseAssuranceHarness();
  for (const [index, kind] of (["NOTIFICATION", "DOCUMENT", "REPORT", "TALLY", "CASHFREE"] as const).entries()) {
    const input = { tenantId: "tenant-a", branchId: "branch-a", kind, effectKey: `${kind}-${index}`,
      correlationId: `corr-${kind}`, payload: { sourceVersion: 1 } };
    const first = harness.async.enqueue(input);
    assert.equal(harness.async.enqueue(structuredClone(input)).eventId, first.eventId);
    assert.equal(harness.async.enqueue({ ...input, payload: { sourceVersion: 2 } }).code, "EFFECT_KEY_REUSED");
  }
  assert.deepEqual(harness.async.drain("2026-09-12T12:00:00.000Z"), { attempted: 5, effects: 5 });
  assert.equal(harness.async.effects("tenant-a").length, 5);
});

test("reordered and duplicated queue delivery commits each distinct effect once", () => {
  const harness = createLocalReleaseAssuranceHarness();
  const first = harness.async.enqueue({ tenantId: "tenant-a", branchId: "branch-a", kind: "REPORT", effectKey: "report-first",
    correlationId: "corr-first", payload: { reportId: "first" } });
  const second = harness.async.enqueue({ tenantId: "tenant-a", branchId: "branch-a", kind: "REPORT", effectKey: "report-second",
    correlationId: "corr-second", payload: { reportId: "second" } });

  assert.deepEqual(harness.async.deliverInOrder([second.eventId, first.eventId, second.eventId], "2026-09-12T12:30:00.000Z"),
    { attempted: 3, effects: 2 });
  assert.deepEqual(harness.async.effects("tenant-a").map((effect) => effect.effectKey), ["report-second", "report-first"]);
});
