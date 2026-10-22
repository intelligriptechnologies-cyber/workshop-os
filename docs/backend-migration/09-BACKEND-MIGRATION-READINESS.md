# Backend migration readiness

**Assessment: enough evidence to begin a reviewed architecture discovery/design discussion, but not a complete, signed-off requirement baseline for implementation or data migration.** The approved source is now indexed at screen, role, component, control, command, schema and fixture levels. Remaining live-data authority, local/remote parity, failed tests and conditional-control mapping gaps are material, not cosmetic.

## Readiness gates

| Gate | Status | Reason |
|---|---|---|
| Approved UI identified and frozen | PARTIALLY VERIFIED | Current source and screenshots identified; exact client approval artifact unavailable and dist differs |
| Page/menu/role source inventory | VERIFIED | All declared page keys and built-in roles covered |
| Every conditional control/workflow confirmed | PARTIALLY VERIFIED | Static exhaustive ledger; not every callback/reachable state executed |
| Shipped demo schema/records | VERIFIED | 60 tables/3,241 records, hashes and full inventory |
| All authoritative data sources reconciled | UNVERIFIED | Browser profile, scratch provenance and live PostgreSQL not resolved |
| Test baseline green | NOT MET | Typecheck passes; 241/244 unit tests pass; three template-count failures |
| Backend parity and security | UNVERIFIED | Existing backend inspected statically, not exercised |
| Architecture design approval | PENDING USER REVIEW | This audit does not advance the project stage |
| Backend implementation / migration authorization | NOT GRANTED | No implementation or migration performed |

## Highest migration risks

1. Migrating only the shipped SQLite fixture could omit browser-owned data, configuration and frozen artifacts.
2. Reusing existing remote variants without parity review could change approved UI/workflows.
3. Splitting payment/handover, PO closure, intake or invoice material claims into independent writes could corrupt linked records under failure/retry.
4. Translating local boolean mutations directly to async calls could close editors before server success or duplicate submissions.
5. Treating page grants as complete authorization could expose records or bypass linked-advisor, role and terminal-state rules.
6. Generic decimal/date/numbering choices could change financial totals, delivery/calendar semantics or business identifiers.
7. Deleting legacy persistence before reconciling historical/archived/void rows and session-only assets could lose approved demo evidence.

## Recommended review sequence

Review 01–04 against the approved application; identify the intended local versus remote runtime and signed baseline. Review GAP-03/04/05/11 policy ambiguities without changing UI. Identify authoritative browser/database snapshots and reconcile counts/relationships with 05. Resolve ambiguous action callback mappings in the evidence ledger. Then approve architecture scope using 06, retaining every frontend constraint and the regression gates in 07.

Future architecture should specify schema/ID mapping, API command contracts, server authorization, transaction and idempotency boundaries, file/snapshot storage, migration reconciliation and rollback. Those designs have not been implemented here. No dependency installation, application source/config change, database migration, commit or push was performed. Stop at documentation and wait for user review and approval.
