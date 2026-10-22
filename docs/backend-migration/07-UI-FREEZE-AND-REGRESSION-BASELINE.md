# UI freeze and regression baseline

## Baseline identity and capture conditions

Source revision: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Existing tracked application files were not edited. AGENTS.md was already modified before the task. Pre-existing and concurrently appearing scratch artifacts are not audit output and were not changed by this audit. A current-source Vite build was generated with `write:false` and served from memory on loopback for captures; no installed dependency or project configuration was changed.

The existing `dist` build rendered “WorkshopOS could not complete the request. Try again.” and was not accepted as source-equivalent evidence. `screen-login.png` records that pre-existing build error; `screen-source-login.png` records the current-source login. These images must not be confused. Existing `dist` files were not overwritten.

Browser captures use isolated Chromium, local-demo mode, blocked API access, disabled service workers, and no-op storage setters/removers/clear. They read the shipped fixture and allow startup to create its normal **in-memory** projection; they do not persist it or modify original records. Therefore these captures verify UI rendering, not cross-session durability or existing-user browser contents. Default theme and audit-time date affect screenshots. Sandbox/service-worker console errors observed during template previews are recorded in browser evidence and are not silently declared production defects.

## Screenshot and UI-state index

Use [screen inventory](evidence-screenshots.md) for every captured route/role/state/image and [rendered controls](evidence-browser.json.md) for associated labels, values, disabled/required flags and errors. Seven built-in roles were visited. There are 94 current-source baseline images (93 role/state captures plus initial login), and one separate existing-dist diagnostic image. The inventory includes dashboard/mobile, role menu workspaces, Manage tabs, Admin Console tabs, stock tabs and selected dialogs. Login and pre-existing-build diagnostic screenshots are separately identified above. Missing states have no fabricated image.

Compare future changes against the matching role, date/filter/data state, viewport and mode. Do not regenerate baselines simply to accept an unexplained difference. Screenshots are new audit captures, not independently supplied client approval images. A pixel-perfect comparison with a signed client snapshot remains UNVERIFIED.

## Regression acceptance requirements

| Requirement | Preserve / verify |
|---|---|
| UI-01 Shell | Sidebar, header, role identity, menu labels/order/visibility, collapse behavior and Sales CRM grouping |
| UI-02 Editors | Fields, labels, order, type/default/required/disabled conditions, nested tabs, selectors and cancel/error/success behavior |
| UI-03 Lists | Grid/table modes, filters and draft apply semantics, sorts, pagination/ranges, empty state, row actions and selected-record return |
| UI-04 Lifecycle | Six job states, linked-actor permissions, checklist-derived substatus, historical cycles and terminal read-only behavior |
| UI-05 Financial | Estimate/invoice GST and discount math, first-payment financial locks, notes, void history, one-command full payment/handover |
| UI-06 Inventory | Request/approval/issue/reconcile separation, stock conservation, purchase request/PO states, revisions and audit exports |
| UI-07 Data | Original business IDs/numbers, histories, active/archive/void selection, fixture counts and relationships |
| UI-08 Files | Approved document rendering, frozen snapshots, print/PDF fallback, uploads/limits, image display and asset security |
| UI-09 Async integration | Pending action behavior, retry without duplication, failure preserves inputs, success selects/closes exactly as before |
| UI-10 Permissions | All roles, record scope, manager differences, protected owner pages and server-side denial |
| UI-11 Responsive | Existing breakpoints and keyboard/focus/touch; no inadvertent layout reflow from loading/error changes |

## Tests performed and limitations

`node node_modules/typescript/bin/tsc --noEmit`: **PASS**, exit 0; [log](evidence-typecheck.md).

`node --import tsx --test unit-tests/*.test.ts`: **244 tests, 241 passed, 3 failed**, exit 1; [complete log](evidence-unit-test-run.md). All three failures are template-count expectations: `unit-tests/report-templates.test.ts:44`, `:58`, `:69` expect 6 while observed defaults contain 8. The actual first assertion location is also preserved in the raw log. No test or implementation was changed to make these pass.

Unit tests create disposable in-memory databases/mocks. Their success does not imply real browser save/reload or backend persistence. Existing Playwright suites were inspected and mapped but not executed wholesale: they clear browser storage and perform business mutations, and the existing preview build was not the current-source reference. Instead, navigation-only audit captures were executed against the protected in-memory source build. Backend integration tests were not run because they can create/mutate database records. Test source declarations and operation links are in [test index](evidence-test-index.md) and [test mapping](evidence-test-operation-map.md).
