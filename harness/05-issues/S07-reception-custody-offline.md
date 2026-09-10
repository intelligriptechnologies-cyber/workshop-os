# S07 — Reception check-in, custody evidence, and offline drafts

Status: Approved  
Implements: R-028, R-029, R-071

## Outcome
Create a Visit plus draft Job Card atomically with custody evidence, advisor handoff, incident capture, and recoverable reception drafts.

## Acceptance criteria
- [ ] One idempotent online check-in creates exactly one linked Visit/draft Job with KM, fuel, keys, accessories, request, advisor, and required acknowledgements/photos.
- [ ] Offline work is visibly a draft, survives restart/conflict, and cannot post custody, approval, inventory, finance, or release ledgers.
- [ ] A custody incident records severity, evidence, notification, owner/actions, and vehicle/job links independently of Job notes.

