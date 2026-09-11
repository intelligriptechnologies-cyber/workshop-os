# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S17<br>
Next slice: S18 — Native GST invoicing and adjustments

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S17 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S12 establish the tenant-aware journey through technician completion. S13-S15 own exact inventory, procurement, and Job material conservation; S16 owns independent QC/rework; S17 now owns immutable delivered warranties, linked comeback work, custody-incident resolution, and legal holds.

## S17 evidence

- `production/src/warranty-incidents.ts` exposes immutable policy/service/item warranty terms on the delivered original Job and creates a classified new Visit/draft comeback Job with diagnosis, responsibility, payer, cost ownership, scope, and outcome. Original lifecycle, finance, and finalized invoice remain closed and unchanged.
- S07 incidents progress through tenant/branch-authorized evidenced escalation, notification/action ownership, and a resolution that requires clean private evidence plus acknowledgement. Resolution emits one `S17_INCIDENT_RESOLVED` S21 boundary while preserving intake and escalation history.
- Record/media legal holds block expiry/purge eligibility until an evidenced, recently authenticated, separately authorized actor distinct from the maker releases the hold.
- `017_warranty_incidents.sql` persists immutable snapshots and linked work, incident evidence/acknowledgements/outbox/events, legal-hold releases, hold-aware retention checks, command fingerprints, row locking, append-only controls, and forced tenant/branch RLS.
- Six focused S17 tests passed; the full production suite passed 117/117 and production typecheck passed. No deployment, provider enrollment, customer/staff message, vehicle release, invoice/payment posting, or other external/production action occurred.

## Verification

- `npm run test:production`: 117/117 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 18 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S18 first action

Read S18 and R-073 through R-078, plus the S03 fiscal sequence/configuration snapshots, S09 approved scope/payer allocation, S15 material reconciliation, S16 QC release signals, and S21 billing-finalized boundary. Start with one failing public-interface test proving billing cannot begin until work, supplementary scope, exact materials, and independent QC are ready and the tenant explicitly selects WorkshopOS-native invoice authority.

## Guardrails

- Preserve unrelated user changes and demo behavior; do not evolve browser-local SQLite into the production source.
- Derive tenant/branch authority from verified membership and force PostgreSQL RLS. Client identifiers never establish authority.
- Store money in minor units, use snapshotted India GST rules, allocate every approved line exactly once to one payer, and atomically allocate never-reused branch/document/financial-year numbers.
- Final invoice documents are immutable; corrections use approved credit/debit notes or cancellation/reissue rather than destructive edits.
- India finance/tax certification, production provider credentials, and any deployment remain external prerequisites. Do not post real invoices, collect payment, message customers, or push GitHub.
