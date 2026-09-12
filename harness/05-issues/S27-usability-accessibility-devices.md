# S27 — Accessibility, devices, documents, scanning, and training

Status: Complete
Implements: R-046, R-049, R-091, R-092, R-115, R-116, R-117

## Outcome
Prove WCAG, device/browser, camera/scanner/manual fallback, rendered documents, and role usability on representative hardware/users.

## Acceptance criteria
- [x] Local automation checks keyboard, focus, labels/errors, target size, reflow, and deterministic contrast thresholds across four critical role flows. WCAG 2.2 AA remains blocked pending authorized manual assistive-technology review.
- [x] Local contracts cover the supported client matrix, immutable PDF/A4/thermal document snapshots, minimum-disclosure single-purpose/replay-protected expiring/revocable QR verification, and safe camera/hardware/manual scanning. Current real-device/browser and rendered-printer verification remain external release evidence.
- [x] The calculation gate enforces no more than 120 training minutes, representative roles, at least 90% unaided success, and zero critical-control errors. Representative trained-staff results remain external and were not fabricated.

## Evidence

- `production/tests/experience-assurance.test.ts` has seven S27 scenarios for deterministic accessibility controls, supported clients and scan paths, document/QR behavior, the usability calculation, persistence controls, and fail-closed release evidence.
- `production/src/experience-assurance.ts` labels local results as deterministic contracts and explicitly reports that they do not prove WCAG conformance, current physical-device support, or representative-staff results.
- S12 continues to exercise authorized camera/hardware/manual scans and audited manual reasons; S21 continues to exercise every operational document type, private A4/thermal artifacts, and narrow expiring/revocable QR verification.
- `production/db/migrations/027_experience_assurance.sql` persists automated versus authorized-external evidence separately under forced tenant/branch RLS with append-only evidence and bounded training/error fields.
- Full verification: 201/201 production tests, production typecheck, build, and 7/7 browser tests passed. Harness becomes 28 contiguous slices after this status update.

## Remaining release evidence

- Authorized manual assistive-technology/WCAG review.
- Real current Android Chrome PWA, desktop Chrome/Edge, and iOS Safari device/browser runs including camera, representative hardware scanner, and manual fallback.
- Rendered PDF/A4/thermal output on representative printers.
- Representative staff study showing at least 90% unaided completion after at most two training hours with zero critical-control errors.
