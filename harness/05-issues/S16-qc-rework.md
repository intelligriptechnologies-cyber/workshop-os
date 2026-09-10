# S16 — Independent QC and rework

Status: Approved  
Implements: R-064, R-065, R-066, R-067, R-068

## Outcome
Separate technician completion from evidence-rich QC, rework, reinspection, and emergency override.

## Acceptance criteria
- [ ] A technician's task completion cannot pass QC; an authorized independent actor applies the snapshotted checklist and evidence.
- [ ] Failure creates blocking linked rework and reinspection without erasing any prior result.
- [ ] Emergency override needs recent auth, configured checker, reason/evidence and customer/release visibility, and remains auditable.

