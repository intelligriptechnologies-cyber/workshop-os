# UIR-09 — Complete visual and responsive assurance

Requirements: UIR-R008, UIR-R016, UIR-R017. Acceptance: structural, accessibility, responsive, and screenshot evidence covers all families; missing CRUD is deferred.

Status: COMPLETE

Evidence:

- `tests/v12-release-assurance.spec.ts` exercises every tenant route plus `/platform` at 1280, 768, and 320 pixels, including axe WCAG 2.2 AA, accessible names, visible focus, 44px targets, overflow, and action parity.
- `tests/ui-recovery/reviewed/` contains inspected screenshots for Home, standard list, Jobs, Media, Settings, Roles, Billing, and Platform families.
- `harness/ui-recovery/07-deferred-crud.md` records mutations that lack authoritative backend APIs; none were simulated in browser state.
- Contrast and narrow select overflow defects discovered by the matrix were repaired in the shared production visual system.
- Passing gates: `npm run test:release-assurance`, `npm run local:test`, `npm run test:unit`, `npm run test:production:typecheck`, `npm run build`, `node scripts/verify-ui-recovery.mjs`, and `git diff --check`.
