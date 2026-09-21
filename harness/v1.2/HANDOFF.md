# WorkshopOS v1.2 handoff

Updated: 2026-09-21
Completed slice: V12-16
Next slice: NONE

## Requirement IDs implemented

V12-R001 through V12-R036 are implemented and have local passing evidence. All rich production screens use authenticated `/api/v1` operations backed by PostgreSQL; the legacy sql.js app is isolated to the direct `/demo` reference route. V12-R034 through V12-R036 close responsive/WCAG automation, executable traceability, and truthful local release-candidate evidence without claiming external certification.

## Changed paths

`package.json`, `package-lock.json`, `shared/xlsx-writer.ts`, `production/src/customer-vehicle-export.ts`, `production/src/inventory-export.ts`, `production/src/job-export.ts`, `production/src/remaining-screens.ts`, `production/src/user-export.ts`, `production/src/work-item-export.ts`, `src/export-utils.ts`, `src/main.tsx`, `src/release-assurance.css`, `tests/v12-release-assurance.spec.ts`, `scripts/verify-release-evidence-v1.2.mjs`, `RELEASE_CANDIDATE_EVIDENCE_v1.2.0.md`, `harness/v1.2/04-absences.md`, and the v1.2 checklist/issue/traceability/handoff.

## Focused and regression evidence

- `npm run test:release-assurance` passed 2/2. Axe A/AA, accessible-name, keyboard/visible-focus, 44px target, reflow, reduced-motion, and desktop-action parity checks cover all 22 tenant routes plus `/platform` at 320px, 768px, and 1280px (69 real-stack route/viewport combinations).
- Runtime/browser XLSX generation no longer imports advisory-affected `xlsx`; it uses the narrow `fflate` OOXML writer. `xlsx` remains development-only solely for protected historical artifact readers. `npm run audit:production` reports zero shipped-dependency vulnerabilities; `npm run test:release-evidence` passes.
- `npm run build` passed with the existing non-blocking chunk-size warning; unit passed 30/30; production passed 241/255 with 14 expected opt-in PostgreSQL skips; production typecheck passed.
- A fresh database previously applied all 45 migrations and the final rebuilt Docker runtime passed 63 HTTP/PostgreSQL checks. Full real-stack Playwright passed 74/74.
- Historical harness passed 119 requirements/29 contiguous slices. Production-authority verification passed 29 static modules, 22 locked routes, and all 34 historical surfaces with `/demo` isolated. The v1.2 release verifier passes 36 requirements/17 contiguous complete slices with `Next slice: NONE`; `git diff --check` passes.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from every v1.2 slice commit. The protected historical demo test executes unchanged through the isolated test wrapper.

## Risks and blockers

- This is a **locally verified release candidate, not production-certified**. `RELEASE_CANDIDATE_EVIDENCE_v1.2.0.md` is the canonical external-evidence register.
- Remaining external/manual evidence is release-blocking until genuinely obtained and accepted.
- Production certification remains blocked on authorized deployment/infrastructure, real identity/provider/object-store/scanner/payment/Tally evidence, independent penetration/privacy review, finance/tax approval, manual WCAG/assistive-technology and real-device/browser/scanner/printer testing, real backup/DR/log recovery, production-scale migration/reconciliation, deployed performance/SLO evidence, and pilot/cutover/hypercare acceptance.
- The development-only `xlsx` package remains because the protected historical Playwright reader imports it. It is absent from shipped dependencies and every runtime writer; a full development audit therefore retains its known advisory while the authoritative shipped-dependency audit is clean.
- The existing production bundle-size warning is non-blocking but remains an optimization opportunity. The sql.js demo is a separate dynamic chunk outside the production authority graph.
- The non-sensitive local test directory `%TEMP%\WorkshopOS-v1211-private-agent` may remain from an earlier slice; it is not referenced by the runtime or release evidence.

## Next-slice dependencies

NONE. No required local v1.2 implementation remains. External/manual evidence must be gathered through separately authorized deployment and certification work; it must not be backfilled with local fixtures or treated as already complete.
