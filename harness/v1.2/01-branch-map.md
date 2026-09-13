# WorkshopOS v1.2 branch map

Status: COMPLETE — questions were subsequently resolved in the frozen ledger/PRD.

## Coverage

Every capability from the confirmed intake maps to at least one domain below. No capability is unmapped.

## 1. Users and personas

Implications: Tenant operational roles need task-specific screens, while tenant administrators and Platform Super Admins need separate scopes. Shared devices and delegated support make effective identity and attribution visible concerns.

Open questions at fan-out: Which roles may perform each command? How are final-admin and emulation safeguards expressed? How do shared-device users verify identity for privileged actions?

## 2. Core domain model

Implications: Jobs, Visits, lifecycle facts, documents, media, users, roles, settings versions, stock records, and audit events have different mutability rules. The raw wishlist contains lifecycle wording that could conflict with the canonical model.

Open questions at fan-out: Is Hold a stage or overlay? Are Work Accepted and Payment Cleared lifecycle stages or facts? When do media categories open/close? What can be archived versus deleted?

## 3. Backend / API surface

Implications: Rich screens require authenticated list/detail/command/export endpoints with consistent concurrency and replay behavior. Lifecycle projection, permissions, and media gates cannot be browser-only.

Open questions at fan-out: What is the common query shape? Which operations require idempotency or reasons? How are long exports and uploads represented? How do errors correlate with logs?

## 4. Frontend / UX

Implications: Dialogs, filters, grid/table controls, Job actions, document links, Data Flow, and responsive behavior span nearly every screen. Consistency must coexist with domain-specific validation.

Open questions at fan-out: What behavior is shared by dialogs and lists? What is each screen's Clear default? Which screens support grid and table? How does Data Flow identify its record?

## 5. Data and persistence

Implications: PostgreSQL must become authoritative while immutable facts, versions, snapshots, thumbnails, export jobs, support grants, and log metadata remain queryable. Private binary originals need a separate store.

Open questions at fan-out: Which data is versioned or append-only? Where are originals and thumbnails held? How long are logs online and recoverable? How is demo storage isolated?

## 6. Auth, security, privacy

Implications: Tenant and branch isolation, permission-filtered search, protected downloads, final-admin protection, privileged platform actions, and emulation must fail closed. UI hiding alone is insufficient.

Open questions at fan-out: How are UI and API permissions kept aligned? What may an emulated user do? What approvals and expiry apply? What information must denied search avoid leaking?

## 7. External integrations

Implications: Object storage, malware scanning, identity/MFA, and deployed log/archive services participate in v1.2. Local substitutes can prove contracts but cannot certify providers.

Open questions at fan-out: What happens while scanning or providers are unavailable? Which evidence requires an authorized environment? How are download links protected and expired?

## 8. Observability

Implications: Readable UI errors need trace identifiers; commands, exports, platform access, emulation, and downloads need immutable audit. Daily logs need protected retrieval.

Open questions at fan-out: Which actor/effective-user fields are mandatory? What log retention tiers apply? How does a user report a failing request without seeing secrets?

## 9. Failure modes and recovery

Implications: Stale edits, duplicate submits, interrupted imports, failed scans/exports, invalid transitions, expired support grants, and unavailable archives require explicit recovery paths.

Open questions at fan-out: Which retries are safe? What can resume? What requires a compensating command? How is log recovery authorized and evidenced?

## 10. Testing strategy

Implications: UI behavior, API enforcement, PostgreSQL RLS, migration integrity, accessibility, responsive behavior, and traceability need separate but composable gates. External/manual certification must remain distinguishable.

Open questions at fan-out: Which acceptance tests prove each requirement? How are skipped slices and stale handoffs rejected? Which checks require Docker, browsers, devices, or people?

## 11. Performance and scale

Implications: Server-side paging, asynchronous full-result exports, thumbnail lists, global search, logs, and inventory analytics must remain within inherited v1.1 scale limits.

Open questions at fan-out: Which inherited latency/volume limits apply? How are stable sorts and export jobs bounded? What prevents loading originals or all filtered rows into the browser?

## 12. Deployment and operations

Implications: The incremental migration must coexist with the historical programme, existing migrations, and local Docker verification. Release evidence includes local and external gates with different provenance.

Open questions at fan-out: How is each screen cut over without split authority? What migration count/update coupling exists? What may be committed, deployed, or exercised automatically?

## 13. Compliance and constraints

Implications: WCAG 2.2 AA, privacy, immutable finance/stock/audit history, India-first finance controls, retention, and maker-checker requirements apply across domains.

Open questions at fan-out: Which records are immutable? Which corrections require maker-checker? What manual reviews remain release-blocking? How are fixtures labelled?

## 14. Docs and onboarding

Implications: Developers need canonical contracts, slice dependencies, evidence, known risks, and a single next action. Users need understandable empty states, errors, Data Flow, and permission outcomes.

Open questions at fan-out: What survives context loss? What exact evidence belongs in each handoff? How is stale programme state detected automatically?

## Dependency order used for resolution

Users/personas → core domain → compliance/security → data/persistence → backend/API → failure/recovery → frontend/UX → integrations → performance → observability → testing → deployment/operations → docs/onboarding.

