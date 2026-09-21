# WorkshopOS v1.2 local release-candidate evidence

Evidence status: **LOCAL RELEASE CANDIDATE — NOT PRODUCTION-CERTIFIED**
Scope: repository implementation and local deterministic verification only
Evidence date: 2026-09-21
Canonical requirements: `harness/v1.2/03-prd.md`

## Claim boundary

This record can establish that the v1.2 code and its local PostgreSQL runtime pass the recorded automated gates. It cannot establish that a deployed production environment, external provider, live customer data, real device, human reviewer, or workshop pilot is ready. A green local gate therefore means **locally verified release candidate**, never production certification or permission to cut over.

Fixtures, mocks, Docker services, deterministic contract evaluators, and automated browser runs are classified as local automated evidence. They cannot be relabelled as authorized external or manual evidence.

## Local automated evidence

The final integration owner ran the release gate from the V12-16 integration checkpoint. Exact local results were: build passed with its existing non-blocking chunk-size warning; unit 30/30; production 241/255 with 14 intentionally environment-gated PostgreSQL skips; production typecheck passed; fresh 45-migration PostgreSQL evidence and the 63-check Docker HTTP/PostgreSQL smoke passed; real-stack Playwright 74/74; focused release assurance 2/2 covering 69 route/viewport combinations; historical harness 119 requirements and 29 contiguous slices; production authority 29 static modules, 22 routes, and 34 historical surfaces; release-evidence verification and shipped-dependency audit passed; v1.2 release verification reported 36 requirements and 17 contiguous complete slices; and diff validation passed.

The reproducible gate is:

```text
npm run build
npm run test:unit
npm run test:production
npm run test:production:typecheck
npm run local:up
npm run local:test
$env:PRODUCTION_E2E_BASE_URL='http://127.0.0.1:4173'; npm run test:e2e
Remove-Item Env:PRODUCTION_E2E_BASE_URL
npm run test:harness
npm run test:production-authority
npm run test:release-evidence
npm run audit:production
node scripts/verify-ui-enhancement-v1.2.mjs --release
git diff --check
npm run local:down
```

The automated accessibility layer combines axe WCAG 2.0/2.1 A/AA and WCAG 2.2 AA rules with route-level keyboard focus, visible focus, 44-by-44 CSS-pixel target, 320/768/1280 responsive-shell, accessible-name, landmark, reduced-motion, and document-overflow assertions. This is meaningful regression evidence, but it does not replace human testing with assistive technology or real devices.

The production dependency audit intentionally excludes development-only packages. Production and browser export writers use the narrow `shared/xlsx-writer.ts` OOXML writer; the advisory-affected `xlsx` package remains development-only solely because the protected historical Playwright test reads generated workbooks with it. `npm run audit:production` is the authoritative shipped-dependency audit. A full development audit remains expected to report that isolated advisory until the protected historical parser is authorized for migration.

## External and manual release blockers

Every row below is **MISSING / RELEASE-BLOCKING** until an authorized evidence reference, accountable owner, environment, timestamp, and result are recorded. No local test satisfies these rows.

| Evidence class | Required evidence before production certification |
| --- | --- |
| Deployment and infrastructure | Authorized deployment in the intended region; DNS/TLS; IAM and network boundaries; environment configuration; secret creation and rotation; monitoring and operational ownership. |
| Identity and external providers | Real Cognito tenant and platform pools with MFA/re-authentication; private object-store policy; trusted malware scanner; payment provider; email/SMS where used; Tally connector; failure and reconciliation evidence for each provider. |
| Security and privacy | Independent penetration test; vulnerability disposition; IAM/object-store policy review; privacy/data-protection assessment; log/media access review; incident response and security sign-off. |
| Finance and tax | Accountable finance approval of invoices, credits, receipts, payment reconciliation, numbering, retention, and applicable tax/Tally behavior using the production configuration. |
| Accessibility and devices | Manual WCAG 2.2 AA review; keyboard and screen-reader runs; zoom/reflow and contrast review; current Android Chrome PWA, desktop Chrome, desktop Edge, and iOS Safari on real supported devices; representative scanner and A4/thermal printer checks. |
| Backup, DR, logs, and recovery | Real encrypted backup and restore; regional/disaster-recovery exercise; deployed 30-day online and 90-day recoverable log retention; protected download and archive recovery with measured RPO/RTO and operator evidence. |
| Migration and live data | Authorized source ownership and mappings; privacy-approved extracts; production-scale dry run; error-manifest resolution; reconciliation; rollback rehearsal; signed acceptance. No live import has been run. |
| Performance and SLO | Production-shaped load, concurrency, soak, queue recovery, availability, latency percentiles, alert routing, capacity, and agreed SLO evidence in the target environment. |
| Pilot, cutover, and hypercare | Named tenant and trained staff; 14 signed parallel-reconciliation days; independent maker-checker go/no-go; cutover and rollback rehearsal; controlled cutover; 28 measured hypercare days meeting exit thresholds; repeatable second-tenant onboarding without a fork. |

## Certification decision

**BLOCKED FOR PRODUCTION CERTIFICATION.** Local implementation may be complete when the complete release gate is green, but deployment approval, production certification, live-data migration, and tenant cutover remain unauthorized until every applicable external/manual blocker above has genuine accepted evidence.
