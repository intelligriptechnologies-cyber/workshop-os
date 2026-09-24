# Data Flow implementation checklist

This file is the execution source of truth for the Data Flow refinement.

- [x] Confirm requirements and interaction decisions.
  - Evidence: approved implementation and context-handoff plan supplied by the user.
- [x] Inspect current implementation and storage boundaries.
  - Evidence: Data Flow reads `WorkshopState.jobs`; no server or persistence changes are needed.
- [x] Establish baseline.
  - Evidence from prior context: 24 unit tests, production build, and targeted E2E passed on port 4176.
- [x] Add failing unit tests for month derivation and combined job filtering.
  - Evidence: focused unit run failed with `ERR_MODULE_NOT_FOUND` for the intentionally absent `src/data-flow` module (24 passed, 1 failed).
- [x] Implement pure Data Flow filtering helpers.
  - Evidence: `src/data-flow.ts`; focused and full unit runs pass.
- [x] Add the isolated Data Flow workspace with no initial selection.
  - Evidence: `DataFlowWorkspace` owns selection/filter state and the re-entry E2E assertion confirms a fresh empty workspace.
- [x] Implement month/year and exact-date cascade.
  - Evidence: dates set their month; changing month clears date; covered in desktop E2E.
- [x] Implement the accessible searchable combobox.
  - Evidence: ARIA combobox/listbox/option semantics, active descendant, Arrow keys, Enter, Escape, mouse selection, and outside dismissal.
- [x] Implement selection invalidation, Clear, empty, and zero-match states.
  - Evidence: desktop E2E covers query invalidation, `No matching jobs`, empty entry, and full Clear reset.
- [x] Add responsive Data Flow filter styling.
  - Evidence: mobile Playwright test verifies suggestions and filter panel fit a 390px viewport without horizontal overflow.
- [x] Add polished inline PDF buttons with generating/error feedback.
  - Evidence: shared `DocumentDownloadButton` exposes disabled/`aria-busy` generating state, accessible error status, focus/hover styling, and deterministic filename coverage.
- [x] Add complete desktop and mobile Playwright coverage.
  - Evidence: targeted Data Flow suite passes 2/2; complete suite passes 30/30.
- [x] Verify Manage selectors and existing PDF behavior remain unchanged.
  - Evidence: shared `JobSelector` remains in Manage; Manage selectors and document download pass in the complete E2E suite.
- [x] Run the full unit, E2E, and production-build gates.
  - Evidence: unit 26/26; Playwright 30/30 on `UI_TEST_PORT=4177`; `npm run build` completed successfully.
- [x] Run `graft build` and verify the refreshed graph.
  - Evidence: broken global launcher bypassed with `npx @nanonets/graft@0.19.0 build`; 531 nodes, 1189 edges, 31 cards. A follow-up `graft ask` returned the new helpers and workspace with exact spans.
- [x] Review the final diff against the checklist and mark the goal complete.
  - Evidence: `git diff --check` passes; all checklist acceptance gates are satisfied.

## Current execution record

- Tests run: RED focused unit test; GREEN focused unit 26/26; targeted Playwright 2/2; full unit 26/26; full Playwright 30/30; production build passed.
- Data Flow files touched: `src/data-flow.ts`, `src/App.tsx`, `src/styles.css`, `unit-tests/data-flow.test.ts`, `tests/workshopos.spec.ts`, and this checklist. Existing concurrent/uncommitted changes were preserved.
- Graft: refreshed and verified through the registry-backed one-off CLI because the global shim is missing its package files.
- Exact next action: none; implementation and verification are complete.
