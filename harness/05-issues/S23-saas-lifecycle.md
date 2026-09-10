# S23 — SaaS tenant lifecycle, export, retention, and purge

Status: Approved  
Implements: R-009, R-100, R-101, R-102, R-103, R-104

## Outcome
Operate tenant provisioning, entitlements, suspension/reactivation, support, complete export, retention, legal hold, and purge.

## Acceptance criteria
- [ ] Idempotent provisioning and entitlement changes are server-enforced, versioned, audited, and never corrupt history.
- [ ] Suspension blocks configured tenant use but preserves allowed platform/recovery paths; reactivation restores only current authorization.
- [ ] Export is complete and checksum-manifested; purge dry-run and maker-checker respect eight-year statutory defaults, three-year photo defaults, warranty/legal holds, and all tenant-scoped stores.

