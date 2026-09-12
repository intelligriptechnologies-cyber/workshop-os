import { createHash } from "node:crypto";

type MetricTolerances = { operational: string; stock: string; invoiceMinor: string; paymentMinor: string; custody: string };
type PlaybookInput = {
  version: number; stages: string[]; parallelDays: number; hypercareDays: number; tolerances: MetricTolerances;
  hypercareExit: { openCriticalIncidents: number; availabilityBasisPointsMinimum: number; maxRoutineP95Ms: number; maxAuthoritativeP95Ms: number };
  approval: { makerIdentityId: string; checkerIdentityId: string };
};
type Playbook = PlaybookInput & { checksum: string };
type Evidence = { evidenceClass: "AUTHORIZED_EXTERNAL"; artifactReference: string; recordedBy: string };
type ParallelDay = { date: string; differences: MetricTolerances; evidence: Evidence };
const REQUIRED_PLAYBOOK_STAGES = ["PROVISIONING", "CONFIGURATION", "IMPORT", "TRAINING", "ISOLATION", "PARALLEL", "CUTOVER", "ACCEPTANCE"] as const;
const REQUIRED_PRIOR_EVIDENCE = [
  "S01_AWS_DEPLOYMENT_IAM_OBJECT_REVIEW", "S18_INDIA_FINANCE_REVIEW", "S19_TALLY_RELEASE_CREDENTIAL_EVIDENCE",
  "S20_CASHFREE_MESSAGING_PROVIDER_EVIDENCE", "S25_SECURITY_AUTHORIZATION_INVARIANT_GATE",
  "S26_DEPLOYED_LOAD_RECOVERY_SLO_EVIDENCE", "S27_REAL_WORLD_EXPERIENCE_EVIDENCE",
] as const;
type PriorEvidenceCode = typeof REQUIRED_PRIOR_EVIDENCE[number];
type Rehearsal = { kind: "CUTOVER" | "ROLLBACK"; makerIdentityId: string; checkerIdentityId: string; artifactReference: string;
  communicationReference: string; dataReconciled: boolean; passed: boolean };
type HypercareDay = { date: string; availabilityBasisPoints: number; routineP95Ms: number; authoritativeP95Ms: number;
  openCriticalIncidents: number; evidence: Evidence };
type HypercareIncident = { incidentReference: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "RESOLVED"; evidence: Evidence };
type OnboardingStage = { stage: string; evidence: Evidence };
type Pilot = { tenantId: string; branchId: string; playbookVersion: number; playbookChecksum: string; applicationReleaseChecksum: string; version: number;
  parallel: ParallelDay[]; priorEvidence: Partial<Record<PriorEvidenceCode, Evidence>>; rehearsals: Rehearsal[];
  cutoverAuthorized: boolean; hypercare: HypercareDay[]; incidents: HypercareIncident[]; onboardingStages: OnboardingStage[] };

const clone = <T>(value: T): T => structuredClone(value);
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const validIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
};

export function createLocalPilotCutoverCoordinator() {
  const playbooks = new Map<number, Playbook>();
  const pilots = new Map<string, Pilot>();
  const commands = new Map<string, { hash: string; result: unknown }>();
  const key = (tenantId: string, branchId: string) => `${tenantId}:${branchId}`;
  const execute = <T>(scope: string, idempotencyKey: string, input: unknown, action: () => T): T => {
    const commandKey = `${scope}:${idempotencyKey}`;
    const hash = digest(input);
    const prior = commands.get(commandKey);
    if (prior) {
      if (prior.hash !== hash) throw new Error("IDEMPOTENCY_KEY_REUSED");
      return clone(prior.result as T);
    }
    const result = action();
    commands.set(commandKey, { hash, result: clone(result) });
    return result;
  };
  const exact = (value: string) => {
    if (!/^-?(0|[1-9][0-9]*)(\.[0-9]{1,6})?$/.test(value)) throw new Error("EXACT_DECIMAL_REQUIRED");
    const negative = value.startsWith("-"); const unsigned = negative ? value.slice(1) : value;
    const [whole, fraction = ""] = unsigned.split(".");
    const scaled = BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, "0"));
    return negative ? -scaled : scaled;
  };
  const releaseEvaluation = (tenantId: string, branchId: string) => {
    const pilot = pilots.get(key(tenantId, branchId));
    const missing: string[] = [];
    if (!pilot) missing.push("PILOT_NOT_FOUND");
    else {
      if (pilot.parallel.length < (playbooks.get(pilot.playbookVersion)?.parallelDays ?? 14)) missing.push("PARALLEL_DAYS_INCOMPLETE");
      for (const code of REQUIRED_PRIOR_EVIDENCE) if (!pilot.priorEvidence[code]) missing.push(code);
      for (const kind of ["CUTOVER", "ROLLBACK"] as const) {
        if (!pilot.rehearsals.some((item) => item.kind === kind && item.passed && item.dataReconciled)) missing.push(`${kind}_REHEARSAL`);
      }
      const playbook = playbooks.get(pilot.playbookVersion)!;
      const metrics = Object.keys(playbook.tolerances) as Array<keyof MetricTolerances>;
      if (pilot.parallel.some((day) => metrics.some((metric) => {
        const difference = exact(day.differences[metric]);
        return (difference < 0n ? -difference : difference) > exact(playbook.tolerances[metric]);
      }))) missing.push("RECONCILIATION_OUTSIDE_TOLERANCE");
    }
    const common = { missing, evidenceClass: "AUTHORIZED_EXTERNAL_REFERENCES_REQUIRED" as const,
      provesRealPilotAcceptance: false as const, overallGoalCanBeDeclaredAchievedLocally: false as const };
    return missing.length ? { status: "BLOCKED" as const, ...common } : { status: "GO_NO_GO_READY" as const, ...common };
  };
  return {
    playbooks: {
      publish(input: PlaybookInput) {
        const candidate = { ...clone(input), checksum: digest(input) };
        const prior = playbooks.get(input.version);
        if (prior) {
          if (prior.checksum !== candidate.checksum) throw new Error("PLAYBOOK_VERSION_COLLISION");
          return clone(prior);
        }
        if (!input.approval.makerIdentityId.trim() || input.approval.makerIdentityId === input.approval.checkerIdentityId) {
          throw new Error("INDEPENDENT_CHECKER_REQUIRED");
        }
        if (!Number.isInteger(input.parallelDays) || input.parallelDays < 14
          || !Number.isInteger(input.hypercareDays) || input.hypercareDays < 28) {
          throw new Error("MINIMUM_PILOT_WINDOWS_REQUIRED");
        }
        if (new Set(input.stages).size !== input.stages.length
          || REQUIRED_PLAYBOOK_STAGES.some((stage) => !input.stages.includes(stage))) {
          throw new Error("REQUIRED_PLAYBOOK_STAGES_MISSING");
        }
        if (Object.values(input.tolerances).some((tolerance) => exact(tolerance) < 0n)) {
          throw new Error("NON_NEGATIVE_TOLERANCE_REQUIRED");
        }
        playbooks.set(input.version, candidate);
        return clone(candidate);
      },
    },
    tenants: {
      start(input: { tenantId: string; branchId: string; playbookVersion: number; playbookChecksum: string;
        applicationReleaseChecksum: string; idempotencyKey: string; expectedVersion: number }) {
        return execute(key(input.tenantId, input.branchId), input.idempotencyKey, input, () => {
          if (input.expectedVersion !== 0) throw new Error("VERSION_CONFLICT");
          const playbook = playbooks.get(input.playbookVersion);
          if (!playbook || playbook.checksum !== input.playbookChecksum) throw new Error("PLAYBOOK_MISMATCH");
          if (!/^[a-f0-9]{64}$/.test(input.applicationReleaseChecksum)) throw new Error("APPLICATION_RELEASE_CHECKSUM_REQUIRED");
          if (pilots.has(key(input.tenantId, input.branchId))) throw new Error("PILOT_ALREADY_EXISTS");
          const pilot: Pilot = { tenantId: input.tenantId, branchId: input.branchId, playbookVersion: input.playbookVersion,
            playbookChecksum: input.playbookChecksum, applicationReleaseChecksum: input.applicationReleaseChecksum,
            version: 1, parallel: [], priorEvidence: {}, rehearsals: [], cutoverAuthorized: false, hypercare: [], incidents: [], onboardingStages: [] };
          pilots.set(key(input.tenantId, input.branchId), pilot);
          return { status: "STARTED" as const, version: pilot.version, playbookChecksum: pilot.playbookChecksum };
        });
      },
    },
    parallel: {
      recordDay(input: { tenantId: string; branchId: string; date: string; differences: MetricTolerances; evidence: Evidence;
        idempotencyKey: string; expectedVersion: number }) {
        const pilot = pilots.get(key(input.tenantId, input.branchId));
        if (!pilot) return { status: "NOT_FOUND" as const, code: "PILOT_NOT_FOUND" as const, version: 0 };
        return execute(key(input.tenantId, input.branchId), input.idempotencyKey, input, () => {
          if (pilot.version !== input.expectedVersion) throw new Error("VERSION_CONFLICT");
          if (!validIsoDate(input.date)) throw new Error("VALID_DATE_REQUIRED");
          if (pilot.parallel.some((day) => day.date === input.date)) throw new Error("PARALLEL_DATE_ALREADY_RECORDED");
          if (input.evidence.evidenceClass !== "AUTHORIZED_EXTERNAL" || !input.evidence.artifactReference.trim() || !input.evidence.recordedBy.trim()) {
            throw new Error("AUTHORIZED_EXTERNAL_EVIDENCE_REQUIRED");
          }
          Object.values(input.differences).forEach(exact);
          pilot.parallel.push(clone({ date: input.date, differences: input.differences, evidence: input.evidence }));
          pilot.version += 1;
          return { status: "RECORDED" as const, code: undefined, version: pilot.version };
        });
      },
      evaluate(tenantId: string, branchId: string) {
        const pilot = pilots.get(key(tenantId, branchId));
        if (!pilot) return { status: "BLOCKED" as const, completedDistinctDays: 0, requiredDistinctDays: 14,
          failures: ["PILOT_NOT_FOUND"], provesRealPilotAcceptance: false };
        const playbook = playbooks.get(pilot.playbookVersion)!;
        const metricKeys = Object.keys(playbook.tolerances) as Array<keyof MetricTolerances>;
        const outside = pilot.parallel.some((day) => metricKeys.some((metric) => {
          const difference = exact(day.differences[metric]);
          return (difference < 0n ? -difference : difference) > exact(playbook.tolerances[metric]);
        }));
        const failures: string[] = [];
        if (pilot.parallel.length < playbook.parallelDays) failures.push("PARALLEL_DAYS_INCOMPLETE");
        if (outside) failures.push("RECONCILIATION_OUTSIDE_TOLERANCE");
        const common = { completedDistinctDays: pilot.parallel.length, requiredDistinctDays: playbook.parallelDays,
          failures, provesRealPilotAcceptance: false as const };
        return failures.length ? { status: "BLOCKED" as const, ...common } : { status: "PARALLEL_RECONCILED" as const, ...common };
      },
    },
    rehearsals: {
      record(input: { tenantId: string; branchId: string; kind: "CUTOVER" | "ROLLBACK"; makerIdentityId: string;
        checkerIdentityId: string; artifactReference: string; communicationReference: string; dataReconciled: boolean;
        passed: boolean; idempotencyKey: string; expectedVersion: number }) {
        const pilot = pilots.get(key(input.tenantId, input.branchId));
        if (!pilot) throw new Error("PILOT_NOT_FOUND");
        return execute(key(input.tenantId, input.branchId), input.idempotencyKey, input, () => {
          if (pilot.version !== input.expectedVersion) throw new Error("VERSION_CONFLICT");
          if (!input.makerIdentityId.trim() || input.makerIdentityId === input.checkerIdentityId) throw new Error("INDEPENDENT_CHECKER_REQUIRED");
          if (!input.artifactReference.trim() || !input.communicationReference.trim()) throw new Error("REHEARSAL_EVIDENCE_REQUIRED");
          pilot.rehearsals.push(clone(input)); pilot.version += 1;
          return { status: "RECORDED" as const, version: pilot.version };
        });
      },
    },
    release: {
      requiredPriorEvidence: [...REQUIRED_PRIOR_EVIDENCE],
      recordPriorEvidence(input: { tenantId: string; branchId: string; evidenceCode: PriorEvidenceCode; evidence: Evidence;
        idempotencyKey: string; expectedVersion: number }) {
        const pilot = pilots.get(key(input.tenantId, input.branchId));
        if (!pilot) throw new Error("PILOT_NOT_FOUND");
        return execute(key(input.tenantId, input.branchId), input.idempotencyKey, input, () => {
          if (pilot.version !== input.expectedVersion) throw new Error("VERSION_CONFLICT");
          if (!REQUIRED_PRIOR_EVIDENCE.includes(input.evidenceCode) || input.evidence.evidenceClass !== "AUTHORIZED_EXTERNAL"
            || !input.evidence.artifactReference.trim() || !input.evidence.recordedBy.trim()) throw new Error("AUTHORIZED_EXTERNAL_EVIDENCE_REQUIRED");
          if (pilot.priorEvidence[input.evidenceCode]) throw new Error("PRIOR_EVIDENCE_ALREADY_RECORDED");
          pilot.priorEvidence[input.evidenceCode] = clone(input.evidence); pilot.version += 1;
          return { status: "RECORDED" as const, version: pilot.version };
        });
      },
      evaluate(tenantId: string, branchId: string) {
        return releaseEvaluation(tenantId, branchId);
      },
    },
    cutover: {
      authorize(input: { tenantId: string; branchId: string; makerIdentityId: string; checkerIdentityId: string;
        artifactReference: string; communicationReference: string; dataReconciled: boolean; idempotencyKey: string; expectedVersion: number }) {
        const pilot = pilots.get(key(input.tenantId, input.branchId));
        if (!pilot) throw new Error("PILOT_NOT_FOUND");
        return execute(key(input.tenantId, input.branchId), input.idempotencyKey, input, () => {
          if (pilot.version !== input.expectedVersion) throw new Error("VERSION_CONFLICT");
          if (releaseEvaluation(input.tenantId, input.branchId).status !== "GO_NO_GO_READY") throw new Error("GO_NO_GO_BLOCKED");
          if (!input.makerIdentityId.trim() || input.makerIdentityId === input.checkerIdentityId) throw new Error("INDEPENDENT_CHECKER_REQUIRED");
          if (!input.artifactReference.trim() || !input.communicationReference.trim() || !input.dataReconciled) throw new Error("CUTOVER_EVIDENCE_REQUIRED");
          pilot.cutoverAuthorized = true; pilot.version += 1;
          return { status: "HYPERCARE_ACTIVE" as const, version: pilot.version };
        });
      },
    },
    hypercare: {
      recordIncident(input: { tenantId: string; branchId: string; incidentReference: string; severity: HypercareIncident["severity"];
        status: HypercareIncident["status"]; evidence: Evidence; idempotencyKey: string; expectedVersion: number }) {
        const pilot = pilots.get(key(input.tenantId, input.branchId));
        if (!pilot) throw new Error("PILOT_NOT_FOUND");
        return execute(key(input.tenantId, input.branchId), input.idempotencyKey, input, () => {
          if (pilot.version !== input.expectedVersion) throw new Error("VERSION_CONFLICT");
          if (!pilot.cutoverAuthorized) throw new Error("HYPERCARE_NOT_ACTIVE");
          if (input.evidence.evidenceClass !== "AUTHORIZED_EXTERNAL" || !input.incidentReference.trim()
            || !input.evidence.artifactReference.trim() || !input.evidence.recordedBy.trim()) throw new Error("INCIDENT_EVIDENCE_REQUIRED");
          pilot.incidents.push(clone(input)); pilot.version += 1;
          return { status: "RECORDED" as const, version: pilot.version };
        });
      },
      recordDay(input: { tenantId: string; branchId: string; date: string; availabilityBasisPoints: number; routineP95Ms: number;
        authoritativeP95Ms: number; openCriticalIncidents: number; evidence: Evidence; idempotencyKey: string; expectedVersion: number }) {
        const pilot = pilots.get(key(input.tenantId, input.branchId));
        if (!pilot) throw new Error("PILOT_NOT_FOUND");
        return execute(key(input.tenantId, input.branchId), input.idempotencyKey, input, () => {
          if (pilot.version !== input.expectedVersion) throw new Error("VERSION_CONFLICT");
          if (!pilot.cutoverAuthorized) throw new Error("HYPERCARE_NOT_ACTIVE");
          if (pilot.hypercare.some((day) => day.date === input.date)) throw new Error("HYPERCARE_DATE_ALREADY_RECORDED");
          if (!validIsoDate(input.date) || !Number.isInteger(input.availabilityBasisPoints)
            || !Number.isInteger(input.routineP95Ms) || !Number.isInteger(input.authoritativeP95Ms)
            || !Number.isInteger(input.openCriticalIncidents) || input.openCriticalIncidents < 0) throw new Error("VALID_HYPERCARE_MEASUREMENT_REQUIRED");
          if (input.evidence.evidenceClass !== "AUTHORIZED_EXTERNAL"
            || !input.evidence.artifactReference.trim() || !input.evidence.recordedBy.trim()) throw new Error("AUTHORIZED_EXTERNAL_EVIDENCE_REQUIRED");
          pilot.hypercare.push(clone(input)); pilot.version += 1;
          return { status: "RECORDED" as const, version: pilot.version };
        });
      },
      evaluate(tenantId: string, branchId: string) {
        const pilot = pilots.get(key(tenantId, branchId));
        if (!pilot) return { status: "BLOCKED" as const, completedDistinctDays: 0, requiredDistinctDays: 28,
          failures: ["PILOT_NOT_FOUND"], incidentCount: 0, provesRealPilotAcceptance: false as const };
        const playbook = playbooks.get(pilot.playbookVersion)!; const failures: string[] = [];
        if (pilot.hypercare.length < playbook.hypercareDays) failures.push("HYPERCARE_DAYS_INCOMPLETE");
        if (pilot.hypercare.some((day) => day.availabilityBasisPoints < playbook.hypercareExit.availabilityBasisPointsMinimum)) failures.push("AVAILABILITY_BELOW_THRESHOLD");
        if (pilot.hypercare.some((day) => day.routineP95Ms > playbook.hypercareExit.maxRoutineP95Ms)) failures.push("ROUTINE_P95_ABOVE_THRESHOLD");
        if (pilot.hypercare.some((day) => day.authoritativeP95Ms > playbook.hypercareExit.maxAuthoritativeP95Ms)) failures.push("AUTHORITATIVE_P95_ABOVE_THRESHOLD");
        if ((pilot.hypercare.at(-1)?.openCriticalIncidents ?? 0) > playbook.hypercareExit.openCriticalIncidents) failures.push("CRITICAL_INCIDENTS_OPEN");
        const common = { completedDistinctDays: pilot.hypercare.length, requiredDistinctDays: playbook.hypercareDays,
          failures, incidentCount: pilot.incidents.length, provesRealPilotAcceptance: false as const };
        return failures.length ? { status: "BLOCKED" as const, ...common } : { status: "EXIT_THRESHOLDS_MET" as const, ...common };
      },
    },
    onboarding: {
      recordStage(input: { tenantId: string; branchId: string; stage: string; playbookVersion: number; playbookChecksum: string;
        applicationReleaseChecksum: string; evidence: Evidence; idempotencyKey: string; expectedVersion: number }) {
        const pilot = pilots.get(key(input.tenantId, input.branchId));
        if (!pilot) throw new Error("PILOT_NOT_FOUND");
        return execute(key(input.tenantId, input.branchId), input.idempotencyKey, input, () => {
          if (pilot.version !== input.expectedVersion) throw new Error("VERSION_CONFLICT");
          if (input.playbookVersion !== pilot.playbookVersion || input.playbookChecksum !== pilot.playbookChecksum) throw new Error("PLAYBOOK_MISMATCH");
          if (input.applicationReleaseChecksum !== pilot.applicationReleaseChecksum) throw new Error("CODE_FORK_DETECTED");
          const stages = playbooks.get(pilot.playbookVersion)!.stages;
          if (input.stage !== stages[pilot.onboardingStages.length]) throw new Error("PLAYBOOK_STAGE_OUT_OF_ORDER");
          if (input.evidence.evidenceClass !== "AUTHORIZED_EXTERNAL"
            || !input.evidence.artifactReference.trim() || !input.evidence.recordedBy.trim()) throw new Error("AUTHORIZED_EXTERNAL_EVIDENCE_REQUIRED");
          pilot.onboardingStages.push({ stage: input.stage, evidence: clone(input.evidence) }); pilot.version += 1;
          return { status: "STAGE_RECORDED" as const, version: pilot.version };
        });
      },
      compareTenants(input: { primaryTenantId: string; secondTenantId: string; branchId: string }) {
        const primary = pilots.get(key(input.primaryTenantId, input.branchId));
        const second = pilots.get(key(input.secondTenantId, input.branchId));
        if (!primary || !second) return { status: "BLOCKED" as const, code: "PILOT_NOT_FOUND" as const };
        const playbook = playbooks.get(primary.playbookVersion)!;
        const completedStages = primary.onboardingStages.map((item) => item.stage);
        const identical = primary.playbookVersion === second.playbookVersion && primary.playbookChecksum === second.playbookChecksum
          && primary.applicationReleaseChecksum === second.applicationReleaseChecksum
          && JSON.stringify(completedStages) === JSON.stringify(playbook.stages)
          && JSON.stringify(second.onboardingStages.map((item) => item.stage)) === JSON.stringify(playbook.stages);
        if (!identical) return { status: "BLOCKED" as const, code: "PLAYBOOK_OR_RELEASE_DIVERGENCE" as const, codeForkDetected: true as const };
        return { status: "IDENTICAL_PLAYBOOK_COMPLETE" as const, playbookVersion: primary.playbookVersion,
          playbookChecksum: primary.playbookChecksum, applicationReleaseChecksum: primary.applicationReleaseChecksum,
          completedStages, codeForkDetected: false as const, provesRealSecondTenantAcceptance: false as const,
          overallGoalCanBeDeclaredAchievedLocally: false as const };
      },
    },
  };
}
