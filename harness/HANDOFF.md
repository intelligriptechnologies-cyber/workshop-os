# WorkshopOS implementation handoff

Updated: 2026-09-10  
Current branch: `prem-dev`  
Completed slice: S01
Next slice: S02 — Provisioning, identity, permissions, kiosk access, and audit

## Durable state

- The approved product contract is canonical in `harness/03-prd.md` (R-001 through R-119).
- Decisions D-001 through D-035 are frozen in `harness/02-ledger.md`.
- S00-S28 specifications live in `harness/05-issues/`; traceability is CLEAN.
- `BRD.md` is intentionally only a pointer. Do not create a second BRD copy.
- The React/sql.js demo is a behavioral reference; its checklist is a historical baseline appendix.

## S01 evidence

- RED/GREEN tracer bullets are recorded in `05-issues/S01-tenant-aware-aws-vertical.md`.
- `npm run test:production` passes 6/6 tenant vertical and infrastructure-contract tests.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run build`, and `npm run test:e2e` pass.
- Production seams are under `production/`: deterministic local PWA/API/store/outbox/worker adapters, PostgreSQL RLS migration, private object and queue/DLQ AWS SAM contract.
- No AWS resource was deployed and no external provider was contacted. AWS/network/Cognito/database inputs remain explicit prerequisites.

## S02 first action

Read S02, the BRD, ledger, and S01 production seams. Start with one failing public-interface test proving authenticated tenant membership and permission denial. Extend the existing production workspace; do not replace the demo or trust client identity/tenant fields.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; enforce membership plus PostgreSQL RLS.
- Keep authoritative commands idempotent and version checked.
- Keep `production/infra/template.yaml` un-deployed until explicit external authority and prerequisites exist.
- After S02 passes, update its evidence, checklist, traceability, and this handoff; commit locally with S02.
