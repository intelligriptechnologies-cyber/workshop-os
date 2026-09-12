# WorkshopOS implementation handoff

Updated: 2026-09-12
Current branch: `prem-dev`
Completed slice: S27<br>
Next slice: S28 — Pilot, cutover, rollback, hypercare, and second tenant

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain unchanged and traceability is CLEAN through S27.
- S00–S27 are complete locally. S27 is deterministic browser/application/persistence-contract evidence, not proof of WCAG 2.2 AA, current physical-device support, rendered-printer output, or representative-staff usability acceptance.
- S24 remains an inert migration contract. S28 still owns authorized real-tenant rehearsal, parallel reconciliation, cutover/rollback, hypercare, and repeatable second-tenant acceptance.

## S27 evidence

- `production/tests/experience-assurance.test.ts` runs seven scenarios covering four critical role flows, deterministic WCAG controls, supported clients and scan paths, versioned PDF/A4/thermal documents, single-purpose replay-protected expiring/revocable QR verification, usability thresholds, persistence controls, and external-evidence blocking.
- Existing S12 tests validate camera and hardware scans plus reasoned audited manual fallback; existing S21 tests validate all six operational document types and private A4/thermal artifacts.
- `production/src/experience-assurance.ts` marks local accessibility, client, and usability reports as deterministic evidence that cannot establish real-world conformance.
- `production/db/migrations/027_experience_assurance.sql` separates `AUTOMATED` from `AUTHORIZED_EXTERNAL` evidence under forced tenant/branch RLS and append-only triggers.
- Release evaluation remains `BLOCKED` without authorized manual assistive-tech review, real current-device/browser evidence, rendered-printer verification, and representative trained-staff results of at least 90% unaided success with zero critical-control errors.

## Verification

- `npm run test:production`: 201/201 passed.
- `npm run test:production:typecheck`: passed.
- S27 focused suite: 7/7 passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 28 contiguous complete, no orphans.
- `npm run build`: passed.
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S28 first action

Read S28 and R-118–R-119. Build a deterministic pilot/cutover evidence coordinator that fail-closes on the required two-week parallel reconciliation, signed variance disposition, cutover readiness, tested rollback criteria, four-week hypercare, and repeatable second-tenant onboarding. Keep all live-tenant activity external and require explicit authority; do not represent local fixtures as pilot acceptance.

## Guardrails

- S27 external evidence remains blocking: authorized manual WCAG/assistive-tech review, current physical device/browser checks, representative scanner/printer verification, and trained-staff usability acceptance.
- S26 external exercises remain blocking: authorized deployed target load, ten-year dataset/query plan, production availability measurement, backup restoration, regional DR, and provider/queue recovery.
- Infrastructure penetration/IAM/object review, malware/provider certification, AWS/provider/DNS/Tally credentials, finance review, and pilot inputs remain external prerequisites.
- Do not deploy, contact providers, upload live data, message customers, push GitHub, or commit without the parent agent's review.
