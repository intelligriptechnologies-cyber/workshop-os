import { createHash } from "node:crypto";

type AsyncKind = "NOTIFICATION" | "DOCUMENT" | "REPORT" | "TALLY" | "CASHFREE";
type Outcome = "SUCCESS" | "TRANSIENT_FAILURE" | "PERMANENT_FAILURE";
type AsyncEvent = {
  eventId: string; tenantId: string; branchId: string; kind: AsyncKind; effectKey: string;
  correlationId: string; payload: Record<string, unknown>; status: "PENDING" | "RETRY" | "DEAD_LETTER" | "COMPLETED";
  attempts: number;
};
type Telemetry = { timestamp: string; event: string; tenantId: string; branchId: string; correlationId: string; resourceId: string };

const clone = <T>(value: T): T => structuredClone(value);

export function createLocalReleaseAssuranceHarness() {
  const events: AsyncEvent[] = [];
  const outcomes = new Map<string, Outcome[]>();
  const committedEffects = new Map<string, { tenantId: string; effectKey: string; eventId: string }>();
  const telemetry: Telemetry[] = [];
  let restoredState: Record<string, Record<string, unknown>> = {};
  let sequence = 0;

  const record = (event: AsyncEvent, name: string, timestamp: string) => telemetry.push({
    timestamp, event: name, tenantId: event.tenantId, branchId: event.branchId,
    correlationId: event.correlationId, resourceId: event.effectKey,
  });
  const percentile95 = (samples: number[]) => {
    if (samples.length === 0 || samples.some((sample) => !Number.isFinite(sample) || sample < 0)) throw new Error("VALID_LATENCY_SAMPLES_REQUIRED");
    const ordered = [...samples].sort((left, right) => left - right);
    return ordered[Math.ceil(ordered.length * 0.95) - 1];
  };
  const checksum = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

  return {
    async: {
      enqueue(input: Omit<AsyncEvent, "eventId" | "status" | "attempts">) {
        const prior = events.find((event) => event.tenantId === input.tenantId && event.kind === input.kind && event.effectKey === input.effectKey);
        if (prior) {
          const priorInput = { tenantId: prior.tenantId, branchId: prior.branchId, kind: prior.kind, effectKey: prior.effectKey,
            correlationId: prior.correlationId, payload: prior.payload };
          return checksum(priorInput) === checksum(input)
            ? { eventId: prior.eventId, status: 200 }
            : { eventId: prior.eventId, status: 409, code: "EFFECT_KEY_REUSED" };
        }
        const event: AsyncEvent = { ...clone(input), eventId: `recovery-event-${++sequence}`, status: "PENDING", attempts: 0 };
        events.push(event);
        record(event, "async.enqueued", new Date(0).toISOString());
        return { eventId: event.eventId, status: 201 };
      },
      injectOutcomes(effectKey: string, injected: Outcome[]) { outcomes.set(effectKey, [...injected]); },
      drain(now: string) {
        let attempted = 0; let effects = 0;
        for (const event of events.filter((candidate) => candidate.status === "PENDING" || candidate.status === "RETRY")) {
          attempted += 1; event.attempts += 1;
          const outcome = outcomes.get(event.effectKey)?.shift() ?? "SUCCESS";
          record(event, "async.attempted", now);
          if (outcome === "SUCCESS") {
            const key = `${event.tenantId}:${event.kind}:${event.effectKey}`;
            if (!committedEffects.has(key)) { committedEffects.set(key, { tenantId: event.tenantId, effectKey: event.effectKey, eventId: event.eventId }); effects += 1; }
            event.status = "COMPLETED"; record(event, "async.effect_committed", now);
          } else if (outcome === "PERMANENT_FAILURE" || event.attempts >= 2) {
            event.status = "DEAD_LETTER"; record(event, "async.dead_lettered", now);
          } else { event.status = "RETRY"; record(event, "async.retry_scheduled", now); }
        }
        return { attempted, effects };
      },
      deadLetters(tenantId: string) { return clone(events.filter((event) => event.tenantId === tenantId && event.status === "DEAD_LETTER")); },
      replay(tenantId: string, eventId: string, reason: string) {
        const event = events.find((candidate) => candidate.tenantId === tenantId && candidate.eventId === eventId);
        if (!event) return { status: 404, code: "NOT_FOUND" };
        if (event.status !== "DEAD_LETTER") return { status: 409, code: "NOT_DEAD_LETTER" };
        if (!reason.trim()) return { status: 422, code: "REASON_REQUIRED" };
        event.status = "PENDING"; event.attempts = 0; record(event, "async.replayed", new Date(0).toISOString());
        return { status: 202 };
      },
      deliverAgain(eventId: string) {
        const event = events.find((candidate) => candidate.eventId === eventId);
        if (!event) return { effects: 0 };
        const key = `${event.tenantId}:${event.kind}:${event.effectKey}`;
        return { effects: committedEffects.has(key) ? 0 : 1 };
      },
      deliverInOrder(eventIds: string[], now: string) {
        let attempted = 0; let effects = 0;
        for (const eventId of eventIds) {
          const event = events.find((candidate) => candidate.eventId === eventId);
          if (!event) continue;
          attempted += 1;
          const key = `${event.tenantId}:${event.kind}:${event.effectKey}`;
          if (committedEffects.has(key)) { record(event, "async.duplicate_ignored", now); continue; }
          committedEffects.set(key, { tenantId: event.tenantId, effectKey: event.effectKey, eventId: event.eventId });
          event.status = "COMPLETED"; effects += 1; record(event, "async.effect_committed", now);
        }
        return { attempted, effects };
      },
      effects(tenantId: string) { return clone([...committedEffects.values()].filter((effect) => effect.tenantId === tenantId)); },
    },
    observability: {
      trace(tenantId: string, correlationId: string) {
        return clone(telemetry.filter((entry) => entry.tenantId === tenantId && entry.correlationId === correlationId));
      },
    },
    performance: {
      evaluate(input: {
        shape: { tenants: number; branchesPerTenant: number; usersPerTenant: number; concurrentUsersPerTenant: number;
          visitsPerBranchPerDay: number; historyYears: number };
        routineMilliseconds: number[]; authoritativeMilliseconds: number[];
      }) {
        const requiredShape = { tenants: 500, branchesPerTenant: 25, usersPerTenant: 500, concurrentUsersPerTenant: 150,
          visitsPerBranchPerDay: 300, historyYears: 10 };
        if (JSON.stringify(input.shape) !== JSON.stringify(requiredShape)) throw new Error("TARGET_SHAPE_REQUIRED");
        const routineP95Milliseconds = percentile95(input.routineMilliseconds);
        const authoritativeP95Milliseconds = percentile95(input.authoritativeMilliseconds);
        return {
          routineP95Milliseconds, authoritativeP95Milliseconds,
          passed: routineP95Milliseconds <= 2_000 && authoritativeP95Milliseconds <= 3_000,
          evidenceClass: "LOCAL_DETERMINISTIC_TARGET_SHAPE" as const,
          provesDeployedAwsCapacity: false,
          externalReleaseExercises: ["DEPLOYED_TARGET_LOAD", "TEN_YEAR_DATASET_QUERY_PLAN"] as const,
        };
      },
    },
    recovery: {
      capture(capturedAt: string, state: Record<string, Record<string, unknown>>) {
        const contents = { capturedAt, state: clone(state) };
        return { ...contents, checksum: checksum(contents) };
      },
      restore(snapshot: { capturedAt: string; state: Record<string, Record<string, unknown>>; checksum: string }, timing: {
        failureAt: string; completedAt: string;
      }) {
        if (checksum({ capturedAt: snapshot.capturedAt, state: snapshot.state }) !== snapshot.checksum) {
          return { status: "CHECKSUM_MISMATCH" as const };
        }
        const rpoMinutes = (Date.parse(timing.failureAt) - Date.parse(snapshot.capturedAt)) / 60_000;
        const rtoMinutes = (Date.parse(timing.completedAt) - Date.parse(timing.failureAt)) / 60_000;
        if (!Number.isFinite(rpoMinutes) || !Number.isFinite(rtoMinutes) || rpoMinutes < 0 || rtoMinutes < 0) {
          return { status: "INVALID_REHEARSAL_TIMING" as const };
        }
        restoredState = clone(snapshot.state);
        return { status: "RESTORED" as const, rpoMinutes, rtoMinutes, passed: rpoMinutes <= 15 && rtoMinutes <= 120,
          evidenceClass: "LOCAL_DETERMINISTIC_RESTORE_REHEARSAL" as const, provesAwsRegionalRecovery: false };
      },
      readRestored(tenantId: string) { return clone(restoredState[tenantId]); },
    },
    health: {
      evaluate(input: { monthMinutes: number; unavailableMinutes: number; queueOldestAgeSeconds: number;
        deadLetterCount: number; providerFailureRate: number; backupAgeMinutes: number }) {
        if (input.monthMinutes <= 0 || input.unavailableMinutes < 0 || input.unavailableMinutes > input.monthMinutes) {
          throw new Error("VALID_AVAILABILITY_WINDOW_REQUIRED");
        }
        const availabilityPercent = Number((((input.monthMinutes - input.unavailableMinutes) / input.monthMinutes) * 100).toFixed(4));
        const alerts: Array<{ code: string; owner: string; runbook: string }> = [];
        const add = (code: string, owner: string, runbook: string) => alerts.push({ code, owner, runbook });
        if (availabilityPercent < 99.9) add("AVAILABILITY_SLO_BREACH", "incident-commander", "runbooks/availability-slo.md");
        if (input.queueOldestAgeSeconds > 900) add("QUEUE_STALLED", "platform-operations", "runbooks/queue-recovery.md");
        if (input.deadLetterCount > 0) add("DEAD_LETTERS_PRESENT", "application-operations", "runbooks/dead-letter-replay.md");
        if (input.providerFailureRate > 0.2) add("PROVIDER_FAILURE_RATE_HIGH", "integration-operations", "runbooks/provider-failure.md");
        if (input.backupAgeMinutes > 15) add("BACKUP_RPO_AT_RISK", "database-operations", "runbooks/backup-restore.md");
        return { availabilityPercent, sloMet: availabilityPercent >= 99.9, alerts,
          evidenceClass: "LOCAL_CONTROL_EVALUATION" as const, provesProductionAvailability: false };
      },
    },
    release: {
      evaluate(input: { localAsyncRecoveryPassed: boolean; localTargetShapePassed: boolean; localRestorePassed: boolean;
        localControlsPassed: boolean; deployedTargetLoadEvidence: string | null; productionAvailabilityEvidence: string | null;
        productionRestoreEvidence: string | null; regionalDrEvidence: string | null }) {
        const missing: string[] = [];
        if (!input.localAsyncRecoveryPassed) missing.push("LOCAL_ASYNC_RECOVERY");
        if (!input.localTargetShapePassed) missing.push("LOCAL_TARGET_SHAPE");
        if (!input.localRestorePassed) missing.push("LOCAL_RESTORE_REHEARSAL");
        if (!input.localControlsPassed) missing.push("LOCAL_OPERATIONAL_CONTROLS");
        if (!input.deployedTargetLoadEvidence?.trim()) missing.push("DEPLOYED_TARGET_LOAD");
        if (!input.productionAvailabilityEvidence?.trim()) missing.push("PRODUCTION_99_9_AVAILABILITY_WINDOW");
        if (!input.productionRestoreEvidence?.trim()) missing.push("PRODUCTION_BACKUP_RESTORE");
        if (!input.regionalDrEvidence?.trim()) missing.push("AUTHORIZED_REGIONAL_DR");
        return missing.length > 0 ? { status: "BLOCKED" as const, missing } : { status: "EVIDENCE_COMPLETE" as const, missing };
      },
    },
  };
}
