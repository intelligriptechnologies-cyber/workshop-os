# P0: Backend Setup (Frappe migration Phase 0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a real, persisted, authenticated Frappe backend for WorkshopOS (forked from hyperflow_forge), wire session-cookie login/logout and admin user management to it end-to-end, and retire the dead Cognito frontend auth path — closing GitHub milestone "P0:Backend Setup" (issues #9, #10, #11, #12, parent #1).

**Architecture:** A new Frappe app (`workshop_os`, forked from `hyperflow_forge`) is installed as a new, isolated site (`workshop_os.localhost`) inside the existing bench at `~/hyperflow-forge/frappe_docker` (WSL2/Docker Desktop). The six WorkshopOS demo roles become Frappe Roles. The React frontend (`src/`) authenticates via Frappe's native `/api/method/login` session-cookie flow (CORS + credentials) instead of Cognito or the local sql.js demo-credential check. Admin user CRUD is rewired from the Cognito-backed `/api/v1/admin/users` API to Frappe's User/Role REST API. Once login and user management are verified against Frappe, the dead Cognito code path in `src/` is deleted (no `production/` directory exists in this repo to delete — see Task 4 scope note).

**Tech Stack:** Frappe/bench (Python, MariaDB, Redis, Docker Compose, WSL2), React + TypeScript (Vite) frontend, Playwright for frontend integration tests, Frappe `FrappeTestCase` for backend tests.

**Spec:** GitHub issues `intelligriptechnologies-cyber/workshop-os#1` (parent), `#9`, `#10`, `#11`, `#12`; ADR-0001 (`docs/adr/0001-frappe-replaces-custom-backend.md`), ADR-0002 (`docs/adr/0002-fork-hyperflow-forge-same-bench.md`), ADR-0004 (`docs/adr/0004-session-cookie-auth.md`). Fetch each issue with `gh issue view <n> --repo intelligriptechnologies-cyber/workshop-os --comments` for the authoritative acceptance criteria — this plan summarizes them but the issue body is binding.

## Global Constraints

- Bench lives at `~/hyperflow-forge/frappe_docker` inside the WSL2 Ubuntu distro (Hyper-V unavailable on this Windows 11 Home machine) — all bench/docker commands run via `wsl -d Ubuntu -- bash -lc '...'`, never directly in PowerShell/Git-Bash.
- New app forked from `hyperflow_forge`, installed as a **new site** in the **same bench/container** — not a new Docker stack (ADR-0002).
- Site name: `workshop_os.localhost`. An existing unrelated site `workshop2.localhost` on this bench must be deleted first (user-confirmed cleanup, Task 1).
- Auth: Frappe session-cookie via `/api/method/login` (ADR-0004). The frontend stores no password/token itself — it relies on the browser session cookie. No API-key/secret tokens, no Cognito bridge.
- The six WorkshopOS roles are exactly: `admin`, `service`, `reception`, `accounts`, `store`, `tech`. Do not rename or add roles.
- `roleMenus[role]` (`src/App.tsx:122`) visibility must keep working unchanged for all six roles after every task.
- `App.tsx`'s `mutate` seam (`src/App.tsx:332`) becomes `async` in Task 2. Only login/logout route through it in this phase; other call sites are adapted mechanically to `await`/promise-return, not redesigned.
- Failed login returns a generic, non-leaking "invalid credentials" error (must not reveal whether the email exists).
- Archived users are rejected at login server-side, even with correct credentials.
- Backend tests follow hyperflow_forge's existing pattern: a `FrappeTestCase` per doctype/controller (e.g. `test_workshop_service_card.py`) exercising controller methods directly — locate and mirror this pattern from `apps/hyperflow_forge` inside the bench before writing new tests.
- Frontend auth integration test hits the real Frappe login endpoint, not a mock.
- No JobCard/Customer/Vehicle/Visit doctypes or business logic in this plan (Phase 1, out of scope). No full per-role permission-rule tuning beyond login/identification. No password-reset flow.
- Ticket #12 scope (user-ruled, see Task 4): no `production/` directory exists anywhere in this repo currently, so "delete `production/`" is a no-op. Task 4 is scoped to removing dead Cognito/`authenticatedFetch`/`CognitoConfig` code from `src/` and rewriting `README.md`/`RAILWAY_DEPLOYMENT.md`.
- `workshop2.localhost` deletion (user-ruled, see Task 1): treat as stale cruft, delete via `bench drop-site` before scaffolding the real site.

---

## Task 1: Scaffold Frappe app, site, and roles (closes #9)

**Files:**
- Create (in WSL, inside the bench, not this git repo): new Frappe app `apps/workshop_os/**` forked from `hyperflow_forge`, new site `workshop_os.localhost` under `development/frappe-bench/sites/workshop_os.localhost/`.
- Modify (in WSL bench): `development/frappe-bench/sites/common_site_config.json` if a site-level CORS/`allow_cors` addition is needed; site's own `site_config.json` for `allow_cors`.
- No changes to this git repo (`C:\demo_ws`) in this task — it is pure bench/infra provisioning. Record the exact commands run and any environment quirks in a short `docs/adr/`-adjacent note is NOT required by the ticket; instead capture them in the task report file only (the ledger keeps the record).

**Interfaces:**
- Consumes: nothing from earlier tasks (first task, unblocked).
- Produces (for Task 2 to consume): a reachable Frappe site at `http://workshop_os.localhost:8000` (or the bench's mapped port), with `admin`, `service`, `reception`, `accounts`, `store`, `tech` Roles present, and CORS configured to accept credentialed requests from the WorkshopOS Vite dev origin (`http://localhost:5173` — confirm the actual dev port in `vite.config.ts` before configuring CORS). Task 2's implementer needs: the site URL, the bench working directory (`~/hyperflow-forge/frappe_docker/development/frappe-bench` inside WSL), and confirmation that `bench --site workshop_os.localhost console` / REST calls work.

- [ ] **Step 1: Start Docker Desktop and verify the WSL2 backend + bench containers come up**

  Docker Desktop must be started from Windows (it cannot be started headlessly from inside WSL). Launch it, wait for it to report "Engine running", then verify from WSL:

  ```bash
  wsl -d Ubuntu -- bash -lc 'docker ps -a'
  wsl -d Ubuntu -- bash -lc 'cd ~/hyperflow-forge/frappe_docker/development && docker compose -f ../docker-compose.dev.yml ps 2>&1 || cat ~/hyperflow-forge/frappe_docker/docker-compose.dev.yml | head -40'
  ```

  If containers are stopped, bring them up (the dev compose file is `docker-compose.dev.yml` at the bench root — inspect it first for the correct `up` invocation and working directory before running it, since this repo's compose layout is bespoke to hyperflow_forge). Expected: `mariadb`, `redis-cache`, `redis-queue`, and a frappe container are `Up`.

- [ ] **Step 2: Delete the stale `workshop2.localhost` site**

  ```bash
  wsl -d Ubuntu -- bash -lc 'cd ~/hyperflow-forge/frappe_docker/development/frappe-bench && bench drop-site workshop2.localhost --force --no-backup'
  ```

  If `bench` must be run inside the frappe container rather than directly in WSL (check whether `bench` is on the WSL Ubuntu PATH or only inside the container — `which bench` in WSL first), use the container-exec form instead, e.g. `docker compose exec frappe bench drop-site workshop2.localhost --force --no-backup`. Confirm removal: `ls sites/` no longer lists `workshop2.localhost`.

- [ ] **Step 3: Fork `hyperflow_forge` into a new `workshop_os` app**

  Inside the bench (WSL or container exec, whichever `bench`/`git` actually run from):

  ```bash
  cd ~/hyperflow-forge/frappe_docker/development/frappe-bench
  bench new-app workshop_os
  ```

  Answer the interactive prompts (app title `WorkshopOS`, description, publisher, email, license) non-interactively via `bench new-app workshop_os --app-title "WorkshopOS" --app-description "WorkshopOS backend" --app-publisher "WorkshopOS" --app-email "dev@workshop-os.local" --app-license mit` (adjust flags to whatever this Frappe version's `new-app` actually accepts — check `bench new-app --help` first). This creates `apps/workshop_os` as its own app, not a copy of `hyperflow_forge`'s doctypes (ADR-0003, out of scope here) — it only needs to exist as an installable app for this phase; Phase 1 adds real doctypes.

- [ ] **Step 4: Create the new site and install the app**

  ```bash
  bench new-site workshop_os.localhost --db-root-password <mariadb root password, read from common_site_config.json or the compose env file> --admin-password <pick one, record in the task report> --install-app workshop_os
  ```

  Verify: `bench --site workshop_os.localhost list-apps` includes `frappe` and `workshop_os`.

- [ ] **Step 5: Create the six WorkshopOS Roles**

  ```bash
  bench --site workshop_os.localhost console
  ```
  then, in the console:
  ```python
  import frappe
  for role in ["admin", "service", "reception", "accounts", "store", "tech"]:
      if not frappe.db.exists("Role", role):
          frappe.get_doc({"doctype": "Role", "role_name": role}).insert(ignore_permissions=True)
  frappe.db.commit()
  ```
  Verify: `bench --site workshop_os.localhost console` → `frappe.get_all("Role", filters={"role_name": ["in", ["admin","service","reception","accounts","store","tech"]]})` returns all six.

- [ ] **Step 6: Configure CORS for the WorkshopOS frontend dev origin**

  Determine the frontend's dev origin from `vite.config.ts` (default Vite port unless overridden — read the file, don't assume). Add to the site's `site_config.json` (`sites/workshop_os.localhost/site_config.json`):
  ```json
  {
    "allow_cors": "http://localhost:<vite-dev-port>"
  }
  ```
  Restart the bench/webserver for the config to take effect (`bench restart` or container restart, per whatever this bench's supervisor setup uses — check `Procfile`/`docker-compose.dev.yml` for the right restart command).

- [ ] **Step 7: Verify reachability end-to-end**

  ```bash
  curl -i http://workshop_os.localhost:8000/api/method/frappe.auth.get_logged_user
  ```
  Expected: a JSON response (401/403 for unauthenticated is fine — the point is the site responds, not that login is wired yet). Then:
  ```bash
  curl -i -X POST http://workshop_os.localhost:8000/api/method/login \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "usr=Administrator&pwd=<admin-password-from-step-4>"
  ```
  Expected: `200 OK` with a `Set-Cookie: sid=...` header — this confirms the site, auth stack, and DB are all working before Task 2 touches the frontend.

- [ ] **Step 8: Write the task report**

  In the task report file (per the brief/report convention), record: the exact site URL, the admin password chosen in Step 4 (flag it as a dev-only secret, not for commit), the CORS origin configured, the bench restart command that worked, and any deviation from the commands above (flag version-specific `bench`/`new-app` flag differences as `DONE_WITH_CONCERNS` if any step needed a workaround).

---

## Task 2: Session-cookie login/logout wired end-to-end (closes #10)

**Files:**
- Modify: `src/auth.ts` — replace the Cognito-specific exports (`beginCognitoLogin`, `completeCognitoCallback`, `authenticatedFetch`, `endCognitoSession`, `CognitoConfig`, `loadWorkshopSession`) with a Frappe session-cookie equivalent. Keep the `AuthConfig`/`WorkshopSession`/`SessionMembership` shape only where still meaningful; add a `"frappe"` mode.
- Modify: `src/App.tsx` — `mutate` (line 332) becomes `async`; its callers that need the result (`handleLogin` region, `~line 347-366`, and the `Admin`/`ManagementHub`/`UserManager` props chain that thread `mutate`/`cognitoConfig`) are updated to `await` it. `LoginScreen`/login handlers route through the new Frappe login function instead of `beginCognitoLogin`/`login(state, email, password)`.
- Create: `src/frappe-auth.ts` (or extend `src/auth.ts` directly — implementer's call, follow whichever keeps `auth.ts` under ~150 lines per the codebase's existing file-size norms) with `frappeLogin(email, password)`, `frappeLogout()`, `loadFrappeSession()` functions that call `/api/method/login`, `/api/method/logout`, `/api/method/frappe.auth.get_logged_user` (or `/api/method/frappe.client.get_list` for role lookup) with `credentials: "include"`.
- Create (in the bench, `apps/workshop_os`): a Frappe `TestCase` covering login/logout/archived-user rejection, following hyperflow_forge's existing controller-test pattern — locate that pattern first (e.g. `apps/hyperflow_forge/**/test_*.py`) via `wsl -d Ubuntu -- bash -lc 'find ~/hyperflow-forge/frappe_docker/development/frappe-bench/apps/hyperflow_forge -name "test_*.py" | head -5'` and mirror its structure exactly.
- Create: a Playwright integration test (repo already has `playwright.config.ts` and `tests/`) exercising real login against the Task 1 Frappe site — not a mock. Place it under `tests/` following the existing test file naming there.

**Interfaces:**
- Consumes: Task 1's live site URL (`http://workshop_os.localhost:8000`), the six Roles, and the CORS origin already configured. Six roles exist but this task does not yet create real Frappe Users for them — for the Playwright test, create one throwaway test user per role status needed (active + one archived) directly via `bench --site workshop_os.localhost console`, documented in the test setup, not hardcoded as production seed data.
- Produces (for Task 3 to consume): the session-cookie request helper(s) in `src/auth.ts`/`src/frappe-auth.ts` that Task 3's `admin-users-api.ts` rewrite calls instead of `authenticatedFetch`/`CognitoConfig`. Name and export whatever generic "credentialed fetch to the Frappe site" helper you write clearly (e.g. `frappeFetch(path, init)`), since Task 3 depends on its exact name/signature — record the final name in this task's report file.

- [ ] **Step 1: Read the existing auth flow completely before changing it**

  Read `src/auth.ts` (full file, 137 lines) and `src/App.tsx` lines ~240-400 (auth bootstrap `useEffect`, `mutate`, `handleLogin`, `handleLogout`) and lines ~500-560 (`LoginScreen`) before writing any code — this task replaces a working flow and must preserve `roleMenus[role]` behavior exactly.

- [ ] **Step 2: Write the failing Playwright integration test first**

  Following the repo's existing Playwright conventions (check `playwright.config.ts` and any existing `tests/*.spec.ts` for the pattern), write a test that: navigates to the app, logs in with a valid Frappe user/password from Task 1, asserts the correct `roleMenus[role]` items render, reloads the page and asserts the session persists (no re-prompt), logs out, and asserts a reload now shows the login screen. Add a second test asserting an archived user cannot log in (generic error shown) and a third asserting wrong password shows the same generic error as an unknown email (non-leaking).

  Run it and confirm it fails (no Frappe wiring yet):
  ```bash
  npx playwright test <new test file> 2>&1 | tail -40
  ```

- [ ] **Step 3: Write the failing backend `TestCase`**

  Mirror hyperflow_forge's existing controller-test pattern exactly (file location, base class, fixture setup). Cover: valid login, wrong password, unknown email, archived-user rejection, logout invalidating the session cookie. Run it inside the bench:
  ```bash
  wsl -d Ubuntu -- bash -lc 'cd ~/hyperflow-forge/frappe_docker/development/frappe-bench && bench --site workshop_os.localhost run-tests --app workshop_os --module <new test module>'
  ```
  Confirm it fails first if any backend customization (e.g. an archived-check hook) is needed beyond Frappe's stock `enabled` field — Frappe's `User.enabled = 0` already rejects login stock, so check whether "archived" maps directly to `enabled=0` or needs a custom field before writing a failing test for behavior that might already pass. If it already passes stock, still write the test (documents the contract) and note in the report that no backend hook was needed.

- [ ] **Step 4: Implement `src/auth.ts` (or `src/frappe-auth.ts`) session-cookie flow**

  Implement `frappeLogin`, `frappeLogout`, `loadFrappeSession`/`frappeFetch` per the Interfaces section above, calling the Frappe site from Task 1 with `credentials: "include"`. Remove `beginCognitoLogin`, `completeCognitoCallback`, `authenticatedFetch`, `endCognitoSession`, `CognitoConfig` (Task 4 does the final broad sweep for any stragglers elsewhere, but this task's own file should not reintroduce them). Keep `loadAuthConfig`'s local/demo fallback only if the plan's Global Constraints don't already require removing it — this plan does not require removing the local demo path in this task; only replace the Cognito branch with the Frappe branch.

- [ ] **Step 5: Make `mutate` async and route login/logout through it**

  Update `src/App.tsx:332`'s `mutate` to `async (action) => {...}` (awaiting `persist(db)` if `persist` is/can be async — check `db.ts`; if `persist` is sync, wrapping in an async function is still correct per the ticket's ask, it just resolves immediately). Update `handleLogin`/`handleLogout` (lines ~347-366) to call the new Frappe functions and `await mutate(...)` where the login result needs to flow into local state. Update every other caller of `mutate` in `App.tsx` to handle it returning a `Promise<boolean>` instead of `boolean` (mechanical `await` insertion at each call site — do not redesign unrelated call sites).

- [ ] **Step 6: Run both tests and confirm they pass**

  ```bash
  npx playwright test <new test file> 2>&1 | tail -40
  wsl -d Ubuntu -- bash -lc 'cd ~/hyperflow-forge/frappe_docker/development/frappe-bench && bench --site workshop_os.localhost run-tests --app workshop_os --module <new test module>'
  ```

- [ ] **Step 7: Manually verify `roleMenus[role]` is unchanged for all six roles**

  Log in as one user per role (create throwaway test users if not already present from Step 2) and confirm the rendered menu matches `roleMenus[role]` in `src/App.tsx:122` exactly — this is the ticket's explicit "invisible from a UX perspective" requirement and is worth a manual pass beyond the automated menu-item test.

- [ ] **Step 8: Commit**

  ```bash
  git add src/auth.ts src/App.tsx tests/<new test file>
  git commit -m "feat: wire session-cookie login/logout to Frappe backend"
  ```
  (Backend test files inside the WSL bench are a separate app repo, not this git repo — commit those per hyperflow_forge/workshop_os app's own VCS conventions; note in the report where that app's changes were committed, if it has its own git history.)

---

## Task 3: Real user management (create/update/archive) against Frappe (closes #11)

**Files:**
- Modify: `src/admin-users-api.ts` — replace every `authenticatedFetch(config: CognitoConfig, ...)` call with the Task 2 `frappeFetch`-equivalent helper. `AdminUser`/`AdminRole`/`AdminBranch`/`AdminDirectory` types stay the same shape the frontend consumes; only the transport and endpoint paths change (Frappe's `/api/resource/User` REST endpoints instead of `/api/v1/admin/users`).
- Modify: `src/App.tsx` — the `Admin`/`ManagementHub`/`UserManager`/`RemoteUserManager` components (lines ~1414-1692+) currently take a `cognitoConfig?: CognitoConfig` prop; replace with whatever the Task 2 config type is now (or drop the prop entirely if the new auth helper doesn't need a passed-in config — implementer's call, but must not leave a `CognitoConfig`-typed prop passed a Frappe value).
- Create (in the bench, `apps/workshop_os`): a `TestCase` covering create/update/archive controller methods, mirroring hyperflow_forge's pattern (same location convention as Task 2's test).

**Interfaces:**
- Consumes: Task 2's `frappeFetch`/session-cookie helper (exact name/signature from Task 2's report file) and the six Roles from Task 1.
- Produces: nothing further downstream in this plan (Task 4 only removes dead code, it doesn't build on Task 3's new code).

- [ ] **Step 1: Read the existing admin console user-management UI**

  Read `src/admin-users-api.ts` (already read above — 37 lines) and grep `src/admin-console.tsx` and `src/App.tsx` for every call site of `adminUsersApi.*` to know the full surface this task must keep working:
  ```bash
  grep -n "adminUsersApi\." src/App.tsx src/admin-console.tsx
  ```

- [ ] **Step 2: Write the failing backend `TestCase` for create/update/archive**

  Mirror hyperflow_forge's controller-test pattern. Cover: admin creates a user with each of the six roles, admin updates name/role/branch, admin archives a user and a subsequent login attempt (reusing Task 2's login test helper/fixture) is rejected. Run inside the bench and confirm it fails first if any custom controller logic (beyond stock `User`/`Role` doctype behavior) is needed — e.g. if "branch assignment" requires a new field/child table on `User` that doesn't exist yet, that field addition is itself part of this task (a doctype customization, not new business-domain doctypes — still in scope, unlike Phase-1 JobCard/Customer/Vehicle doctypes which are explicitly out of scope).

- [ ] **Step 3: Implement the branch-assignment field if needed**

  If Frappe's stock `User` doctype has nowhere to hold WorkshopOS's `branchIds`, add a minimal custom field (Frappe "Custom Field" or a small child doctype) via `bench --site workshop_os.localhost` migrate tooling — keep this to the smallest addition that satisfies the acceptance criteria; do not design a full branch/location system (out of scope, Phase 1+).

- [ ] **Step 4: Rewrite `src/admin-users-api.ts` against Frappe's REST API**

  Replace `request<T>` and each `adminUsersApi` method to call Frappe's `/api/resource/User` (list/create/update) and whatever archive mechanism Step 3 settled on (e.g. `PUT /api/resource/User/<name>` setting `enabled=0`, or a whitelisted method if archive needs side effects like invalidating existing sessions). Keep the exported `AdminUser`/`AdminRole`/`AdminBranch`/`AdminDirectory`/`AdminApiError` types' shape stable so `admin-console.tsx`/`App.tsx` call sites don't need type-level rewrites beyond the auth-config prop change from the Files section.

- [ ] **Step 5: Update `App.tsx`/`admin-console.tsx` call sites**

  Swap the `CognitoConfig` prop threading for the new auth type from Task 2 at every call site found in Step 1.

- [ ] **Step 6: Run the backend test and confirm it passes**

  ```bash
  wsl -d Ubuntu -- bash -lc 'cd ~/hyperflow-forge/frappe_docker/development/frappe-bench && bench --site workshop_os.localhost run-tests --app workshop_os --module <new test module>'
  ```

- [ ] **Step 7: Manual end-to-end pass through the admin console UI**

  Start the frontend dev server, log in as an `admin` user (from Task 2's test users), and manually create a user for each of the six roles, update one, archive one, and confirm the archived user is rejected at login (Task 2's login flow). Confirm `roleMenus[role]` renders correctly for a freshly created user of each role.

- [ ] **Step 8: Typecheck and commit**

  ```bash
  npx tsc --noEmit
  git add src/admin-users-api.ts src/App.tsx src/admin-console.tsx
  git commit -m "feat: wire admin user create/update/archive to Frappe User/Role APIs"
  ```

---

## Task 4: Retire the dead Cognito frontend auth path + docs (closes #12)

**Ruling carried into this task (from the pre-execution AskUserQuestion, recorded in the ledger):** no `production/` directory exists anywhere in this repo — ticket #12's "delete `production/`" is a no-op here. This task is scoped to: (a) confirming zero remaining references to `CognitoConfig`/`authenticatedFetch`/`beginCognitoLogin`/`completeCognitoCallback`/`endCognitoSession` anywhere in `src/`, (b) rewriting `README.md` and `RAILWAY_DEPLOYMENT.md` to describe the Frappe-backed bench/site deployment instead of Postgres/Railway/Cognito, (c) a full six-role smoke test.

**Files:**
- Modify: `README.md`, `RAILWAY_DEPLOYMENT.md`.
- Modify (only if Step 1's grep finds stragglers Tasks 2-3 didn't already remove): any remaining `src/**` file referencing Cognito symbols.
- No deletion of any `production/` directory — it does not exist (verified: `find . -maxdepth 2 -iname "*production*"` returned nothing at plan-time; re-verify at task-run time in case another branch/PR added one since).

**Interfaces:**
- Consumes: the fully-Frappe `src/auth.ts` and `src/admin-users-api.ts` from Tasks 2-3.
- Produces: nothing further downstream — this is the last task in the plan.

- [ ] **Step 1: Grep for remaining Cognito references and confirm the directory doesn't exist**

  ```bash
  grep -rn "Cognito\|authenticatedFetch\|CognitoConfig" src/
  find . -maxdepth 2 -iname "*production*"
  ```

  Expected after Tasks 2-3: the `src/` grep returns nothing (or only comments/docs, which this task also cleans up). If the `find` unexpectedly turns up a `production/` directory (e.g. reintroduced on another branch merged since plan-time), stop and re-scope this step as a real deletion — do not silently skip a directory that does exist; that would contradict ticket #12's actual intent. Record either outcome in the task report.

- [ ] **Step 2: Rewrite `README.md`**

  Read the current `README.md` (3.7K) in full. Replace any Postgres/Cognito/Railway-specific setup instructions with: how to start the WSL2/Docker Desktop bench (from Task 1's report), how to run the frontend dev server against `workshop_os.localhost`, and a pointer to `docs/adr/0001-frappe-replaces-custom-backend.md` for why. Keep any sections unrelated to backend/deployment (e.g. general project description) unchanged.

- [ ] **Step 3: Rewrite `RAILWAY_DEPLOYMENT.md`**

  Read the current file (4.2K) in full. Since Railway/Postgres deployment no longer applies, either (a) rewrite it to describe Frappe-backed deployment, or (b) mark it clearly historical with a one-line pointer to ADR-0001 and the new `README.md` section, if a full deployment rewrite is out of scope for a dev-stage app per the ticket's own "or clearly marked historical" wording. Prefer (b) if the current file's content is Railway-infrastructure-specific enough that a full rewrite would be speculative (no actual Frappe deployment target has been decided yet in this plan) — implementer's call, ledger it if choosing (b).

- [ ] **Step 4: Full six-role smoke test**

  Start the frontend dev server against the Task 1 site, log in as each of the six roles' Task-2 test users, and confirm `roleMenus[role]` renders correctly for each with `production/` (nonexistent, confirmed Step 1) and Cognito code (removed by Step 1's grep being clean) gone. Record pass/fail per role in the task report.

- [ ] **Step 5: Typecheck, run the full frontend test suite once, and commit**

  ```bash
  npx tsc --noEmit
  npx playwright test
  git add README.md RAILWAY_DEPLOYMENT.md
  git commit -m "docs: rewrite deployment docs for Frappe-backed backend, confirm Cognito path fully retired"
  ```

---

## Final Review Note

After Task 4, dispatch the final whole-branch code review per subagent-driven-development (most capable model), pointed at all four tasks' diffs plus the ledger's parked/deferred-minor entries. Then use `superpowers:finishing-a-development-branch` to decide how `feature/frappe-backend-migration` integrates — do not push, merge, or close the GitHub issues without the user's explicit go-ahead (closing #1/#9/#10/#11/#12 is a shared-state, user-facing action).
