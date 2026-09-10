# S26 — Scale, recovery, observability, backup, and DR

Status: Approved  
Implements: R-108, R-109, R-110, R-111, R-112

## Outcome
Prove async/provider recovery, tenant-safe observability, target latency/capacity, availability controls, backup restore, and DR.

## Acceptance criteria
- [ ] Target-scale tests prove p95 at most 2 seconds routine and 3 seconds authoritative posting for 500 tenants and declared per-tenant/branch/history load.
- [ ] Queue/provider failure, dead-letter replay, duplicate/reordered delivery, and recovery produce no duplicate effect and are diagnosable through correlated tenant-safe telemetry.
- [ ] Timed backup/restore and regional recovery exercises prove RPO at most 15 minutes, RTO at most 2 hours, and controls supporting 99.9% monthly availability.

