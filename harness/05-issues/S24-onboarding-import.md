# S24 — Idempotent onboarding import and reconciliation

Status: Approved  
Implements: R-113, R-114

## Outcome
Stage, validate, map, dry-run, commit, rerun, and reconcile real tenant migration extracts without treating demo SQLite as source.

## Acceptance criteria
- [ ] Source-to-target manifest identifies every accepted/rejected row; repeated dry-run/commit cannot duplicate effects and remains tenant-scoped.
- [ ] Counts, duplicates, stock quantity/value, advances/payments/credit, and document balances reconcile or block acceptance with actionable differences.

