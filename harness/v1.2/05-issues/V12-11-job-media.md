# Deliver private lifecycle-gated Job Media

Status: Planned  
Implements: V12-R023, V12-R024, V12-R025  
Blocked by: V12-09, V12-10

## Outcome

Deliver Media upload from Media and Job details with strict Job/date selection, private scanned storage, thumbnails, archive, and server-enforced category gates.

## Acceptance criteria

- [ ] Selecting a Visit date cascades a searchable selector to Jobs checked in on that date; no upload can exist without a valid authorized Job.
- [ ] Originals remain private, lists use PostgreSQL metadata/thumbnails, and view/download is unavailable until scanning reaches an allowed result.
- [ ] Before/Inspection is rejected after active work begins; Progress is accepted only during work/QC; After is accepted only after completion/QC.
- [ ] Authorized archive preserves metadata/audit and does not hard-delete; both Media and Job details enforce identical rules.

## Evidence

Pending.

