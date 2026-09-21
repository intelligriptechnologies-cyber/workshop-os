# Verify the v1.2 release candidate truthfully

Status: Complete
Implements: V12-R034, V12-R035, V12-R036  
Blocked by: V12-01–V12-15

## Outcome

Complete responsive/accessibility/security cleanup, eliminate traceability drift, document the release, and run the complete local release-candidate gate without overstating external evidence.

## Acceptance criteria

- [x] Migrated screens retain all required actions on phone/tablet/desktop and pass automated keyboard, focus, contrast, error, target-size, reduced-motion, and screen-reader-oriented WCAG 2.2 AA checks.
- [x] All requirements map to passing acceptance evidence, every slice/checklist item is complete and contiguous, traceability is CLEAN, and the handoff has `Next slice: NONE`.
- [x] `npm run build`, unit, production, production typecheck, PostgreSQL integration, Playwright, historical harness, v1.2 verifier release mode, and diff checks all pass.
- [x] Outstanding deployment, provider, penetration, finance/tax, manual device/accessibility, real recovery/migration, and pilot evidence is explicitly recorded and the programme is not called production-certified until obtained.

## Evidence

- `tests/v12-release-assurance.spec.ts` applies axe A/AA rules, accessible-name checks, keyboard focus/visible-focus assertions, 44px targets, document reflow, reduced motion, and desktop-action parity across every one of the 22 tenant routes plus `/platform` at 320px, 768px, and 1280px. The focused release assurance passes 2/2, including 69 real-stack route/viewport combinations.
- Scoped `src/release-assurance.css` supplies visible focus, minimum targets, responsive containment, media containment, and reduced-motion behavior to tenant and platform workspaces without changing the isolated demo. Full real-stack Playwright passes 74/74.
- Every runtime/browser XLSX writer now uses the narrow `shared/xlsx-writer.ts` OOXML writer backed by `fflate`; advisory-affected `xlsx` is development-only for protected historical artifact readers. `npm run audit:production` reports zero shipped-dependency vulnerabilities, export-focused contracts pass, build and typecheck pass, and the release-evidence verifier rejects runtime regression to `xlsx`.
- `RELEASE_CANDIDATE_EVIDENCE_v1.2.0.md` records the local-only claim boundary and nine explicit missing external/manual evidence classes. The result is a locally verified release candidate, not production certification, deployment approval, migration authorization, or cutover approval.
- Final local results: build passed with the existing non-blocking chunk warning; unit 30/30; production 241/255 with 14 expected environment-gated PostgreSQL skips; fresh 45-migration evidence and Docker 63-check HTTP/PostgreSQL smoke passed; production typecheck passed; Playwright 74/74; historical harness 119 requirements/29 slices; production authority 29 static modules/22 routes/34 historical surfaces; release evidence and production audit passed; v1.2 release-mode verifier reports 36 requirements/17 complete contiguous slices/Next NONE; diff check passed.
