# WorkshopOS UI Recovery Checklist v1.0.0

Current progress: **85%**
Last completed slice: **UIR-07**
Next slice: **UIR-08**

- [x] UIR-00 — Persist programme governance (0–3%)
- [x] UIR-01 — Lock the regression baseline (3–8%)
- [x] UIR-02 — Restore the Production Workspace (8–30%)
- [x] UIR-03 — Establish the visual system (30–50%)
- [x] UIR-04 — Standardize primary production lists (50–60%)
- [x] UIR-05 — Repair workshop execution routes (60–69%)
- [x] UIR-06 — Repair inventory and operational routes (69–77%)
- [x] UIR-07 — Repair administration routes (77–85%)
- [ ] UIR-08 — Repair Platform Administration (85–90%)
- [ ] UIR-09 — Complete visual and responsive assurance (90–97%)
- [ ] UIR-10 — Final integration and release evidence (97–100%)

Per-slice gates: `npm run test:unit`, `npm run test:production:typecheck`, `npm run build`, and `git diff --check`. Route slices additionally require the local PostgreSQL gate and focused Playwright.

Final matrix: build, unit, production, production typecheck, local stack, E2E, harness, authority, release assurance/evidence, production audit, both UI verifiers in release mode, diff check, then local stack shutdown.
