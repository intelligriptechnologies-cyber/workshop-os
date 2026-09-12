# S26 — Scale, recovery, observability, backup, and DR

Status: Complete
Implements: R-108, R-109, R-110, R-111, R-112

## Outcome
Prove async/provider recovery, tenant-safe observability, target latency/capacity, availability controls, backup restore, and DR.

## Acceptance criteria
- [x] A deterministic representative target-shape workload measures p95 at most 2 seconds routine and 3 seconds authoritative posting while explicitly withholding deployed-AWS capacity certification.
- [x] Queue/provider failure, dead-letter replay, duplicate/reordered delivery, and recovery produce no duplicate effect and are diagnosable through correlated tenant-safe telemetry.
- [x] A checksum-verified local restore rehearsal measures RPO at most 15 minutes and RTO at most 2 hours; availability, queue, provider, dead-letter, and backup-risk controls produce actionable alerts.

## Local evidence

- `production/tests/scale-recovery-observability.test.ts` contains seven public-contract scenarios covering retry/dead-letter/replay and exactly-once effects, all five async domains, deterministic p95 measurement at the declared target shape, checksum-verified restore timing and tenant separation, availability/provider/queue/backup alerts, durable storage/infrastructure contracts, and a fail-closed release-evidence decision.
- `production/src/release-assurance.ts` is the inert local assurance harness. Telemetry exposes tenant, branch, correlation, event and resource identifiers but never payload fields. Effect-key reuse with changed input is rejected; identical ingress and duplicate delivery do not duplicate committed effects.
- `production/db/migrations/026_release_assurance.sql` persists uniquely keyed delivery effects, append-only attempts/replays/telemetry/rehearsals/SLO evidence, actionable alerts, concurrency-safe claiming, and forced tenant/branch RLS.
- `production/infra/template.yaml` now declares queue-age and dead-letter CloudWatch alarm contracts alongside the existing private bucket, queue/DLQ and partial-batch worker boundary.
- The deterministic workload reported routine p95 `400 ms` and authoritative p95 `2000 ms`; the local restore rehearsal reported RPO `12 minutes` and RTO `35 minutes`. These are fixture results, not observations from deployed AWS or production history.

Seven S26-focused tests and the full 193-test production regression suite pass with type checking.

## External release exercises

S26 deliberately remains release-blocking until evidence references exist for an authorized deployed target-load run with a ten-year representative dataset/query-plan review, a production 99.9% measurement window, a real backup restoration, and an authorized regional DR exercise. Local simulations do not prove AWS capacity, achieved availability, provider recovery, production RPO/RTO, or regional failover. No deployment, provider contact, live backup, customer data, or regional action occurred.
