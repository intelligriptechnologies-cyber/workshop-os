import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalPilotCutoverCoordinator } from "../src/pilot-cutover.js";

const playbookInput = {
  version: 1,
  stages: ["PROVISIONING", "CONFIGURATION", "IMPORT", "TRAINING", "ISOLATION", "PARALLEL", "CUTOVER", "ACCEPTANCE"],
  parallelDays: 14,
  hypercareDays: 28,
  tolerances: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
  hypercareExit: { openCriticalIncidents: 0, availabilityBasisPointsMinimum: 9990, maxRoutineP95Ms: 2000, maxAuthoritativeP95Ms: 3000 },
  approval: { makerIdentityId: "playbook-maker", checkerIdentityId: "playbook-checker" },
};
const applicationReleaseChecksum = "a".repeat(64);

function prepareReadyPilot(tenantId: string) {
  const coordinator = createLocalPilotCutoverCoordinator();
  const playbook = coordinator.playbooks.publish(playbookInput);
  let version = coordinator.tenants.start({ tenantId, branchId: "branch-a", playbookVersion: 1,
    playbookChecksum: playbook.checksum, applicationReleaseChecksum, idempotencyKey: `start-${tenantId}`, expectedVersion: 0 }).version;
  for (let day = 1; day <= 14; day += 1) {
    version = coordinator.parallel.recordDay({ tenantId, branchId: "branch-a", date: `2026-10-${String(day).padStart(2, "0")}`,
      differences: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
      evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: `external://parallel/${tenantId}/${day}`, recordedBy: "reconciler" },
      idempotencyKey: `day-${day}`, expectedVersion: version }).version;
  }
  for (const evidenceCode of coordinator.release.requiredPriorEvidence) {
    version = coordinator.release.recordPriorEvidence({ tenantId, branchId: "branch-a", evidenceCode,
      evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: `external://release/${tenantId}/${evidenceCode}`, recordedBy: "release-owner" },
      idempotencyKey: `evidence-${evidenceCode}`, expectedVersion: version }).version;
  }
  for (const kind of ["CUTOVER", "ROLLBACK"] as const) {
    version = coordinator.rehearsals.record({ tenantId, branchId: "branch-a", kind, makerIdentityId: "release-maker",
      checkerIdentityId: "release-checker", artifactReference: `external://rehearsal/${tenantId}/${kind}`,
      communicationReference: `external://communications/${tenantId}/${kind}`, dataReconciled: true, passed: true,
      idempotencyKey: `rehearsal-${kind}`, expectedVersion: version }).version;
  }
  return { coordinator, playbook, version };
}

test("one immutable versioned playbook has a stable checksum for every tenant", () => {
  const coordinator = createLocalPilotCutoverCoordinator();
  const playbook = coordinator.playbooks.publish({
    version: 1,
    stages: ["PROVISIONING", "CONFIGURATION", "IMPORT", "TRAINING", "ISOLATION", "PARALLEL", "CUTOVER", "ACCEPTANCE"],
    parallelDays: 14,
    hypercareDays: 28,
    tolerances: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
    hypercareExit: { openCriticalIncidents: 0, availabilityBasisPointsMinimum: 9990, maxRoutineP95Ms: 2000, maxAuthoritativeP95Ms: 3000 },
    approval: { makerIdentityId: "playbook-maker", checkerIdentityId: "playbook-checker" },
  });

  assert.equal(playbook.version, 1);
  assert.match(playbook.checksum, /^[a-f0-9]{64}$/);
  assert.deepEqual(coordinator.playbooks.publish({
    version: 1,
    stages: ["PROVISIONING", "CONFIGURATION", "IMPORT", "TRAINING", "ISOLATION", "PARALLEL", "CUTOVER", "ACCEPTANCE"],
    parallelDays: 14,
    hypercareDays: 28,
    tolerances: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
    hypercareExit: { openCriticalIncidents: 0, availabilityBasisPointsMinimum: 9990, maxRoutineP95Ms: 2000, maxAuthoritativeP95Ms: 3000 },
    approval: { makerIdentityId: "playbook-maker", checkerIdentityId: "playbook-checker" },
  }), playbook);
  assert.throws(() => coordinator.playbooks.publish({ ...playbook, stages: ["CUTOVER"] }), /PLAYBOOK_VERSION_COLLISION/);
  assert.throws(() => coordinator.playbooks.publish({ ...playbookInput, version: 2,
    approval: { makerIdentityId: "same", checkerIdentityId: "same" } }), /INDEPENDENT_CHECKER_REQUIRED/);
  assert.throws(() => coordinator.playbooks.publish({ ...playbookInput, version: 3, parallelDays: 13 }), /MINIMUM_PILOT_WINDOWS_REQUIRED/);
  assert.throws(() => coordinator.playbooks.publish({ ...playbookInput, version: 4, hypercareDays: 27 }), /MINIMUM_PILOT_WINDOWS_REQUIRED/);
  assert.throws(() => coordinator.playbooks.publish({ ...playbookInput, version: 5,
    stages: playbookInput.stages.filter((stage) => stage !== "ISOLATION") }), /REQUIRED_PLAYBOOK_STAGES_MISSING/);
  assert.throws(() => coordinator.playbooks.publish({ ...playbookInput, version: 6,
    tolerances: { ...playbookInput.tolerances, stock: "-1" } }), /NON_NEGATIVE_TOLERANCE_REQUIRED/);
});

test("go/no-go requires fourteen distinct parallel days reconciled within exact configured tolerances", () => {
  const coordinator = createLocalPilotCutoverCoordinator();
  const playbook = coordinator.playbooks.publish(playbookInput);
  const pilot = coordinator.tenants.start({ tenantId: "tenant-a", branchId: "branch-a", playbookVersion: 1,
    playbookChecksum: playbook.checksum, applicationReleaseChecksum, idempotencyKey: "start-a", expectedVersion: 0 });

  for (let day = 1; day <= 13; day += 1) {
    const result = coordinator.parallel.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: `2026-10-${String(day).padStart(2, "0")}`,
      differences: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
      evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: `external://parallel/day-${day}`, recordedBy: "pilot-reconciler" },
      idempotencyKey: `parallel-${day}`, expectedVersion: pilot.version + day - 1 });
    assert.equal(result.status, "RECORDED");
  }
  assert.deepEqual(coordinator.parallel.evaluate("tenant-a", "branch-a"), { status: "BLOCKED", completedDistinctDays: 13,
    requiredDistinctDays: 14, failures: ["PARALLEL_DAYS_INCOMPLETE"], provesRealPilotAcceptance: false });

  const fourteenth = coordinator.parallel.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: "2026-10-14",
    differences: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
    evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: "external://parallel/day-14", recordedBy: "pilot-reconciler" },
    idempotencyKey: "parallel-14", expectedVersion: 14 });
  assert.equal(fourteenth.version, 15);
  assert.equal(coordinator.parallel.evaluate("tenant-a", "branch-a").status, "PARALLEL_RECONCILED");
  assert.deepEqual(coordinator.parallel.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: "2026-10-14",
    differences: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
    evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: "external://parallel/day-14", recordedBy: "pilot-reconciler" },
    idempotencyKey: "parallel-14", expectedVersion: 14 }), fourteenth);
  assert.equal(coordinator.parallel.recordDay({ tenantId: "tenant-b", branchId: "branch-a", date: "2026-10-15",
    differences: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
    evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: "external://parallel/day-15", recordedBy: "pilot-reconciler" },
    idempotencyKey: "wrong-scope", expectedVersion: 15 }).code, "PILOT_NOT_FOUND");
});

test("parallel evidence rejects invalid calendar dates and blocks an exact one-unit tolerance excess", () => {
  const coordinator = createLocalPilotCutoverCoordinator();
  const playbook = coordinator.playbooks.publish({ ...playbookInput, tolerances: { ...playbookInput.tolerances, stock: "0.500000" } });
  let version = coordinator.tenants.start({ tenantId: "tenant-a", branchId: "branch-a", playbookVersion: 1,
    playbookChecksum: playbook.checksum, applicationReleaseChecksum, idempotencyKey: "start-exact", expectedVersion: 0 }).version;
  assert.throws(() => coordinator.parallel.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: "2026-02-30",
    differences: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
    evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: "fixture://invalid-date", recordedBy: "test-reconciler" },
    idempotencyKey: "invalid-date", expectedVersion: version }), /VALID_DATE_REQUIRED/);
  for (let day = 1; day <= 14; day += 1) {
    version = coordinator.parallel.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: `2026-10-${String(day).padStart(2, "0")}`,
      differences: { operational: "0", stock: day === 14 ? "0.500001" : "0.500000", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
      evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: `fixture://tolerance/${day}`, recordedBy: "test-reconciler" },
      idempotencyKey: `exact-day-${day}`, expectedVersion: version }).version;
  }
  assert.deepEqual(coordinator.parallel.evaluate("tenant-a", "branch-a").failures, ["RECONCILIATION_OUTSIDE_TOLERANCE"]);
});

test("go/no-go fail-closes on prior release evidence and distinct-authority cutover and rollback rehearsals", () => {
  const coordinator = createLocalPilotCutoverCoordinator();
  const playbook = coordinator.playbooks.publish(playbookInput);
  let version = coordinator.tenants.start({ tenantId: "tenant-a", branchId: "branch-a", playbookVersion: 1,
    playbookChecksum: playbook.checksum, applicationReleaseChecksum, idempotencyKey: "start", expectedVersion: 0 }).version;
  for (let day = 1; day <= 14; day += 1) {
    version = coordinator.parallel.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: `2026-10-${String(day).padStart(2, "0")}`,
      differences: { operational: "0", stock: "0", invoiceMinor: "0", paymentMinor: "0", custody: "0" },
      evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: `external://parallel/${day}`, recordedBy: "reconciler" },
      idempotencyKey: `day-${day}`, expectedVersion: version }).version;
  }

  const blocked = coordinator.release.evaluate("tenant-a", "branch-a");
  assert.equal(blocked.status, "BLOCKED");
  assert.ok(blocked.missing.includes("CUTOVER_REHEARSAL"));
  assert.ok(blocked.missing.includes("ROLLBACK_REHEARSAL"));
  assert.ok(blocked.missing.includes("S25_SECURITY_AUTHORIZATION_INVARIANT_GATE"));
  assert.ok(blocked.missing.includes("S26_DEPLOYED_LOAD_RECOVERY_SLO_EVIDENCE"));
  assert.ok(blocked.missing.includes("S27_REAL_WORLD_EXPERIENCE_EVIDENCE"));

  for (const evidenceCode of coordinator.release.requiredPriorEvidence) {
    version = coordinator.release.recordPriorEvidence({ tenantId: "tenant-a", branchId: "branch-a", evidenceCode,
      evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: `external://release/${evidenceCode}`, recordedBy: "release-owner" },
      idempotencyKey: `evidence-${evidenceCode}`, expectedVersion: version }).version;
  }
  assert.throws(() => coordinator.release.recordPriorEvidence({ tenantId: "tenant-a", branchId: "branch-a",
    evidenceCode: coordinator.release.requiredPriorEvidence[0],
    evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: "fixture://replacement", recordedBy: "other-owner" },
    idempotencyKey: "replace-prior-evidence", expectedVersion: version }), /PRIOR_EVIDENCE_ALREADY_RECORDED/);
  for (const kind of ["CUTOVER", "ROLLBACK"] as const) {
    version = coordinator.rehearsals.record({ tenantId: "tenant-a", branchId: "branch-a", kind, makerIdentityId: "release-maker",
      checkerIdentityId: "release-checker", artifactReference: `external://rehearsal/${kind}`, communicationReference: `external://communications/${kind}`,
      dataReconciled: true, passed: true, idempotencyKey: `rehearsal-${kind}`, expectedVersion: version }).version;
  }
  assert.throws(() => coordinator.rehearsals.record({ tenantId: "tenant-a", branchId: "branch-a", kind: "CUTOVER",
    makerIdentityId: "same-person", checkerIdentityId: "same-person", artifactReference: "external://bad", communicationReference: "external://bad-comms",
    dataReconciled: true, passed: true, idempotencyKey: "bad-authority", expectedVersion: version }), /INDEPENDENT_CHECKER_REQUIRED/);

  assert.deepEqual(coordinator.release.evaluate("tenant-a", "branch-a"), {
    status: "GO_NO_GO_READY", missing: [], evidenceClass: "AUTHORIZED_EXTERNAL_REFERENCES_REQUIRED",
    provesRealPilotAcceptance: false, overallGoalCanBeDeclaredAchievedLocally: false,
  });
});

test("controlled cutover starts a measured twenty-eight-day hypercare window and fail-closes its SLO exit", () => {
  const { coordinator, version: readyVersion } = prepareReadyPilot("tenant-a");
  const cutover = coordinator.cutover.authorize({ tenantId: "tenant-a", branchId: "branch-a", makerIdentityId: "cutover-maker",
    checkerIdentityId: "cutover-checker", artifactReference: "external://cutover/evidence", communicationReference: "external://cutover/communications",
    dataReconciled: true, idempotencyKey: "authorize-cutover", expectedVersion: readyVersion });
  assert.equal(cutover.status, "HYPERCARE_ACTIVE");

  assert.throws(() => coordinator.hypercare.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: "2026-10-31",
    availabilityBasisPoints: 10000, routineP95Ms: 1, authoritativeP95Ms: 1, openCriticalIncidents: 0,
    evidence: { evidenceClass: "AUTOMATED", artifactReference: "fixture://automated", recordedBy: "test" } as any,
    idempotencyKey: "automated-hypercare", expectedVersion: cutover.version }), /AUTHORIZED_EXTERNAL_EVIDENCE_REQUIRED/);

  let version = cutover.version;
  const incident = coordinator.hypercare.recordIncident({ tenantId: "tenant-a", branchId: "branch-a", incidentReference: "external://incident/1",
    severity: "CRITICAL", status: "RESOLVED", evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: "external://incident/1/resolution",
      recordedBy: "incident-commander" }, idempotencyKey: "incident-1", expectedVersion: version });
  version = incident.version;
  for (let day = 1; day <= 27; day += 1) {
    version = coordinator.hypercare.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: `2026-11-${String(day).padStart(2, "0")}`,
      availabilityBasisPoints: 9995, routineP95Ms: 1200, authoritativeP95Ms: 2200, openCriticalIncidents: 0,
      evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: `external://hypercare/${day}`, recordedBy: "hypercare-lead" },
      idempotencyKey: `hypercare-${day}`, expectedVersion: version }).version;
  }
  assert.deepEqual(coordinator.hypercare.evaluate("tenant-a", "branch-a"), { status: "BLOCKED", completedDistinctDays: 27,
    requiredDistinctDays: 28, failures: ["HYPERCARE_DAYS_INCOMPLETE"], incidentCount: 1, provesRealPilotAcceptance: false });
  version = coordinator.hypercare.recordDay({ tenantId: "tenant-a", branchId: "branch-a", date: "2026-11-28",
    availabilityBasisPoints: 9995, routineP95Ms: 1200, authoritativeP95Ms: 2200, openCriticalIncidents: 0,
    evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: "external://hypercare/28", recordedBy: "hypercare-lead" },
    idempotencyKey: "hypercare-28", expectedVersion: version }).version;
  assert.equal(version > readyVersion, true);
  assert.equal(coordinator.hypercare.evaluate("tenant-a", "branch-a").status, "EXIT_THRESHOLDS_MET");
});

test("a second tenant follows the identical provisioning-to-acceptance playbook and application release without a code fork", () => {
  const coordinator = createLocalPilotCutoverCoordinator();
  const playbook = coordinator.playbooks.publish(playbookInput);
  const versions = new Map<string, number>();
  for (const tenantId of ["tenant-first", "tenant-second"]) {
    versions.set(tenantId, coordinator.tenants.start({ tenantId, branchId: "branch-a", playbookVersion: playbook.version,
      playbookChecksum: playbook.checksum, applicationReleaseChecksum, idempotencyKey: `start-${tenantId}`, expectedVersion: 0 }).version);
    if (tenantId === "tenant-first") {
      assert.throws(() => coordinator.onboarding.recordStage({ tenantId, branchId: "branch-a", stage: "PROVISIONING",
        playbookVersion: playbook.version, playbookChecksum: playbook.checksum, applicationReleaseChecksum,
        evidence: { evidenceClass: "AUTOMATED", artifactReference: "fixture://automated", recordedBy: "test" } as any,
        idempotencyKey: "automated-onboarding", expectedVersion: versions.get(tenantId)! }), /AUTHORIZED_EXTERNAL_EVIDENCE_REQUIRED/);
    }
    for (const stage of playbook.stages) {
      const version = versions.get(tenantId)!;
      versions.set(tenantId, coordinator.onboarding.recordStage({ tenantId, branchId: "branch-a", stage,
        playbookVersion: playbook.version, playbookChecksum: playbook.checksum, applicationReleaseChecksum,
        evidence: { evidenceClass: "AUTHORIZED_EXTERNAL", artifactReference: `external://onboarding/${tenantId}/${stage}`, recordedBy: "onboarding-lead" },
        idempotencyKey: `stage-${stage}`, expectedVersion: version }).version);
    }
  }

  assert.deepEqual(coordinator.onboarding.compareTenants({ primaryTenantId: "tenant-first", secondTenantId: "tenant-second", branchId: "branch-a" }), {
    status: "IDENTICAL_PLAYBOOK_COMPLETE", playbookVersion: 1, playbookChecksum: playbook.checksum,
    applicationReleaseChecksum, completedStages: playbook.stages, codeForkDetected: false,
    provesRealSecondTenantAcceptance: false, overallGoalCanBeDeclaredAchievedLocally: false,
  });
});

test("pilot evidence persistence is tenant-scoped, append-only, idempotent, and concurrency controlled", async () => {
  const migration = await readFile(new URL("../db/migrations/028_pilot_cutover.sql", import.meta.url), "utf8");
  const tables = ["pilot_playbook", "tenant_pilot", "parallel_reconciliation_day", "release_prerequisite_evidence",
    "cutover_rollback_rehearsal", "cutover_authorization", "hypercare_day", "hypercare_incident", "tenant_onboarding_stage", "pilot_command"];
  for (const table of tables) {
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(migration, /prevent_pilot_evidence_mutation/i);
  assert.match(migration, /UNIQUE \(tenant_id, branch_id, pilot_id, operation_date\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, branch_id, idempotency_key\)/i);
  assert.match(migration, /expected_version/i);
  assert.match(migration, /FOR UPDATE/i);
  assert.match(migration, /evidence_class[^\n]+AUTHORIZED_EXTERNAL/i);
  assert.match(migration, /application_release_checksum/i);
  assert.match(migration, /FOREIGN KEY \(tenant_id, branch_id, playbook_id\) REFERENCES workshopos\.pilot_playbook \(tenant_id, branch_id, id\)/i);
});
