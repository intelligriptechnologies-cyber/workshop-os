# Deliver private lifecycle-gated Job Media

Status: Complete
Implements: V12-R023, V12-R024, V12-R025  
Blocked by: V12-09, V12-10

## Outcome

Deliver Media upload from Media and Job details with strict Job/date selection, private scanned storage, thumbnails, archive, and server-enforced category gates.

## Acceptance criteria

- [x] Selecting a Visit date cascades a searchable selector to Jobs checked in on that date; no upload can exist without a valid authorized Job.
- [x] Originals remain private, lists use PostgreSQL metadata/thumbnails, and view/download is unavailable until scanning reaches an allowed result.
- [x] Before/Inspection is rejected after active work begins; Progress is accepted only during work/QC; After is accepted only after completion/QC.
- [x] Authorized archive preserves metadata/audit and does not hard-delete; both Media and Job details enforce identical rules.

## Evidence

- Migration 040 preserves the generic secure-media reservation contract while extending Job media with mandatory Job/category/label data, lifecycle validation, bounded PostgreSQL thumbnails, server-generated private object keys, trusted-scanner state changes, versioned archive, append-only evidence, forced RLS, and an availability view that exposes only clean non-archived Job media.
- The local API implements Visit-date Job discovery, list/upload/archive/scanner/view/download routes with exact permissions, 20 MB file and 28 MB request limits, signature and checksum validation, atomic private-file publication, truthful idempotent replay, quarantine, and no-store downloads.
- The responsive Media screen and Job details share the same production endpoints and permission contract.
- A fresh database applied all 40 migrations and focused PostgreSQL integration passed 4/4. Docker smoke passed after the root hardening review.
- Focused Playwright passed 3/3 against real HTTP/PostgreSQL. The complete real-stack Playwright suite passed 60/60 serially; state-colliding parallel cases also passed in isolation.
- Production tests passed 239/248 with nine expected opt-in PostgreSQL skips; unit passed 22/22; build, production typecheck, both harness verifiers, and diff check passed.
