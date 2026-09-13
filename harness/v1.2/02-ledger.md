# WorkshopOS v1.2 decisions ledger

Status: FROZEN for implementation

- D-001 | Production PostgreSQL accessed through authenticated `/api/v1` HTTP is authoritative. | Rejected: browser-local `sql.js` authority or direct browser-to-database access. | Tenant isolation, durability, and server enforcement require one production path.
- D-002 | Canonical production lifecycle stages remain unchanged. | Rejected: implementing the informal prompt's stage names as a second lifecycle. | v1.2 must preserve the established domain model.
- D-003 | Hold is a pause overlay that resumes to the same underlying stage. | Rejected: Hold as a destructive stage transition. | Work state and elapsed hold time must remain explainable.
- D-004 | Estimate Approved, Work Accepted, and Payment Cleared are distinct facts. | Rejected: one overloaded Approved status. | Commercial, operational, and financial approvals have different actors and evidence.
- D-005 | Before/Inspection media closes when active work begins; Progress applies during active work/QC; After begins after completion/QC. | Rejected: the prompt's ambiguous Completed boundary. | Categories must match evidentiary meaning.
- D-006 | Every media item requires a valid Job. | Rejected: unlinked uploads. | Media must be attributable and permission-checkable.
- D-007 | Private object storage holds originals; PostgreSQL holds thumbnails and metadata. | Rejected: originals as database byte arrays. | This preserves privacy while keeping lists efficient.
- D-008 | Cancelled Jobs may be reopened or archived, never hard-deleted. | Rejected: delete command. | Lifecycle and audit history must remain intact.
- D-009 | Final invoices, posted payments, stock ledgers, lifecycle history, audit records, and logs are immutable. | Rejected: in-place edits. | Corrections must be explicit and auditable.
- D-010 | Job List defaults to today's Visit/check-in date. | Rejected: creation or update date. | This matches workshop arrival operations.
- D-011 | Exports include every filtered and sorted result, not only the visible page. | Rejected: client export of current page. | Export semantics must not vary with pagination.
- D-012 | A gate pass is generated before vehicle release and closure. | Rejected: Closed as the point of first generation. | Security needs the artifact at the gate.
- D-013 | Tenant-user emulation requires a reason, MFA/re-authentication, different approver, exact tenant/user/branch scope, and 15-minute expiry. | Rejected: open-ended impersonation. | Emulation is a privileged, time-bounded support action.
- D-014 | Emulation is limited to the selected user's ordinary permissions and approval rules. | Rejected: support bypass. | Effective-user policy remains authoritative.
- D-015 | Emulated actions store both platform actor and effective user. | Rejected: single-actor audit. | Investigations require dual attribution.
- D-016 | Dialogs and lists use shared behavioral contracts but screens retain domain-specific validation and commands. | Rejected: one generic CRUD engine. | Consistency must not erase invariants.
- D-017 | Server list state is URL-addressable; presentation preferences are per tenant/user/screen. | Rejected: global device-only preference. | Links remain reproducible and shared devices remain safe.
- D-018 | Export generation is private and asynchronous. | Rejected: large synchronous browser generation. | Complete result exports may be large and contain protected data.
- D-019 | Business Settings publication is versioned and non-retroactive for active work through snapshots. | Rejected: mutable singleton settings. | Existing work must retain the rules under which it began.
- D-020 | Logs have daily partitions/objects with 30-day online and 90-day recoverable retention. | Rejected: indefinite unbounded primary storage. | This satisfies the approved operational window and controlled recovery.
- D-021 | External/manual evidence remains release-blocking and cannot be replaced with fixture assertions. | Rejected: marking local completion as production certification. | Evidence provenance must be truthful.
- D-022 | The v1.2 programme is incremental and preserves all historical S00–S28 artifacts. | Rejected: overwrite or renumber history. | Prior traceability remains auditable.
- D-023 | Deferred details use the simplest compatible default: existing v1.1 limits, policies, and domain vocabulary remain unless a v1.2 requirement explicitly changes them. | Rejected: silently inventing new limits. | This records the only safe default for unspecified details.

