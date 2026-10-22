# Current data and demo data

## Authoritative observed snapshot

`public/workshopos-demo.sqlite` is the shipped initial dataset selected by `openWorkshopDb` when no saved browser SQLite payload exists. Read-only `mode=ro&immutable=1` inspection found **60 tables and 3,241 rows**. SQLite integrity and FK-check results, full CREATE TABLE DDL, field affinities/defaults/nullability, primary keys, declared foreign keys and index names are in [schema and counts](evidence-sqlite-schema.md). Every shipped record and original identifier is in [demo record inventory](evidence-demo-records.md); password/token/secret values are redacted. No database was modified or migrated.

Major counts: 121 customers, 132 vehicles, 145 visits, 145 job cards, 10 users, 144 estimates, 144 estimate items, 52 invoices, 105 invoice items, 27 payments, 27 receipts, 27 gate passes, 117 material requests, 4 inventory items, 289 photos, 145 tasks, 435 QC checks, 119 follow-ups, 145 checklist cycles and 711 checklist items. Purchasing has 2 suppliers, 2 orders, 3 order lines, 2 receipts, 3 receipt lines, 3 confirmations, 3 quotations and 3 stock inwards. Sales has 1 lead, 1 quotation and 2 quotation lines. Zero-row tables are explicitly retained in the schema inventory.

These are physical row counts including historical/archived records, not visible active-list counts. For example, the dashboard shows 120 customers served, not 121 physical customers; do not treat this as automatic data loss. Relations and selection predicates determine visible counts.

## Persistence layers and precedence

| Source | Classification / authority | Current behavior |
|---|---|---|
| localStorage workshopos.sqlite.v2 | Browser-specific business database | Base64 SQLite export; preferred over legacy v1 and shipped fixture |
| localStorage workshopos.sqlite.v1 | Legacy business snapshot | Fallback source, then schema migration on startup |
| public/workshopos-demo.sqlite | Shipped fixture | Fresh-browser source; immutable audit snapshot, not proof of current user data |
| src/db.ts seed / loadLargeDemoDataset | Alternate generated fixtures | Empty-user fallback versus explicit demo loading; NOT executed against existing data during audit |
| src/demo-delivery-dates.json | Targeted migration fixture | Startup changes delivery dates for selected saved active jobs if migration marker absent |
| SQL.js live Database | Active mutable business state | readState constructs joined WorkshopState/JobView; includes session-only uploaded media |
| sessionStorage workshopos.admin-demo.v2 (legacy v1) | Demo configuration plus business-like state | Roles/page grants, settings/theme/assets/templates, logs/import batches/session inventory |
| sessionStorage document snapshot key | Frozen document evidence | HTML/template/values/lines snapshots, with in-process cache; should not be discarded as a harmless preference |
| sessionStorage developer-control-plane key | Separate platform demo state | Demo tenant lifecycle, charges, payments and communications simulation |
| sessionStorage Cognito tokens / OAuth state | Authentication/session state | PKCE and token refresh; do not migrate token values into business records |
| React state | Temporary UI state | Drafts, selections, filters, dialogs, pagination; not an independent durable business dataset |
| Service worker Cache API | Static/offline asset cache | main.tsx registration/update behavior; sw.js cache lifecycle; disabled for audit browser |
| Existing backend/PostgreSQL | Parallel implementation | Schema and code exist; live records were not inspected, initialized or changed |

Exact keys, getters/setters and source spans: [storage evidence](evidence-storage-extra.md), [browser dependencies](evidence-browser-dependencies.md). No IndexedDB usage was found in indexed application code; this is not proof that every existing browser profile has no unrelated or legacy IndexedDB data. The existing user browser profile could not be accessed because the browser connector reported it already in use. Browser record counts therefore remain UNVERIFIED. Do not add shipped fixture counts to unknown browser or backend counts.

## Schema, relationships and sources

Customer → vehicles → visits → job cards is the central chain. Jobs link advisor/technician users, estimates/lines, tasks, material requests, checklist cycles/items, QC, follow-ups and media. Invoices link jobs, invoice lines and claimed material rows; payment/receipt/gate-pass history remains distinct from the current non-void artifact. Purchasing links suppliers/orders/lines/receipts/confirmations/stock ledgers. Sales quotations link leads and ordered lines; team structures link departments, managers and advisors. Only the DDL's foreign keys are declared constraints; other relationships are application-maintained and must be validated independently.

`createSchema` and `migrateSchema` are separate from the shipped file schema. Their complete source is preserved in operation/private-contract appendices; no assumption is made that old browser snapshots already have every field. `readState` excludes archived rows selectively and preserves specific histories. Its projected objects are not extra SQL tables.

Hardcoded master data includes roles/page grants; lifecycle stage checklist labels; status unions; payment modes; GST choices; report categories/templates; fonts/palettes; booking types/windows; inventory fixtures; service task defaults and delivery-date fixtures. [Type/constant ledger](evidence-types-and-constants.md) and [evaluated defaults](evidence-default-fixtures.json.md) identify exact values. Default admin state has 7 roles, 5 initial logs, 8 report templates, 0 import batches and 0 session inventory rows. Default developer state has 1 tenant, 0 communication logs and 0 charges. This evaluated snapshot uses an explicit audit date; relative seed dates may differ from an old session.

## IDs, dates, money and files

SQLite uses integer IDs and several display-number algorithms based on existing values/ordinals. `nextDocumentNumber` checks preferred identifiers then advances beyond the maximum; purchase request ordinals have separate parsing/formatting. PostgreSQL must preserve original IDs or retain an explicit reversible ID map and separately preserve business numbers. Concurrent allocation requires uniqueness and serialization; a client-side max+1 is insufficient.

Dates mix ISO timestamps, SQLite datetime('now'), date-only strings, locale display and local date/month calculations. Default business timezone is Asia/Kolkata and currency INR; the configurable profile does not prove every helper honors its timezone. Freeze actual calculation behavior and explicitly decide serialization/timezone normalization. GST/discount rounding is specified in 03, not delegated to a generic currency library.

Uploaded job media uses browser file decoding/Canvas compression, JPEG/PNG/WebP verification, 10 MiB source limit, 1600px max dimension and 1,000,000-byte stored-image limit. Persisted exports deliberately delete uploaded data-image payloads and reset missing evidence (`db.ts:201-217`). Shipped placeholder photo records are a different source. Attachments, company assets, report HTML and document snapshots have their own rules; do not apply the job-photo lifetime policy universally.

Pre-existing `.scratch/` SQLite files and restoration directories were observed but their authority was not established. They are not silently merged into this dataset. This is GAP-06 and prevents claiming a complete inventory of all potentially authoritative local user records.

## Additional read-only reconciliation

Eight SQLite paths were discovered across public, scratch and concurrently present data-migration directories, representing five distinct byte hashes. Their per-table counts and integrity results are in [all database copies](evidence-all-databases.md); [record differences](evidence-database-differences.md) inventory rows/schema differences against the shipped file without merging them. Two copies contain 3,447 rows rather than 3,241. Provenance remains unresolved, including files appearing during the audit; no claim is made that the audit created those external artifacts.

The shipped schema declares **zero foreign keys**. Its empty foreign_key_check result therefore cannot prove application-level relationships. Twenty explicitly checked customer/vehicle/job/document/material/sales links had zero non-null/nonzero orphan references; index definitions and queries are in [integrity evidence](evidence-data-integrity.md). Remaining semantic/sentinel relationships require migration reconciliation.

Existing backend migrations contain 55 unique explicit CREATE TABLE names, including tenant/platform records and differently named operational entities. This is a separate schema declaration inventory, not 55 verified live tables or additional shipped SQLite rows. Full declarations are in [backend evidence](evidence-existing-backend.md).
