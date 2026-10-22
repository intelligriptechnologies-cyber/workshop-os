# 31 — Stage 4A foundation results

Stage 4A foundation implemented and verified locally. No business schema, records, frontend integration or deployment performed. Stop here for review; this report does not authorize Stage 4B.

## Preflight and incorporation

Active branch remains `Prem-dev-fbb-Go21`, HEAD `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. All 115 protected frontend/build/test-guard files matched approved revision hashes before and after implementation. The pre-existing tracked `AGENTS.md` modification and untracked scratch, data-migration and documentation work were retained. No reset, branch switch, merge or cherry-pick occurred. Exact initial status is in [preflight](stage4a-preflight.json.md).

The foundation extracts only backend files at `50c8aab1766b61c914e2829b460bfd1697723ec2` into ignored `backend/foundation/.generated/candidate`. All 63 extracted source/configuration files match their manifest; 21 application modules remain unchanged. Existing checked-out backend files remain unchanged. This avoids incorporating a branch snapshot over the approved frontend. Reproduction requires this Git object to be available locally; no branch tip is trusted implicitly.

## Files added or updated

All implementation files are new under `backend/foundation/`:

- `prepare.py`: pinned extraction and separate random local credentials; refuses divergent generated files.
- `compose.yaml`, `Dockerfile`, `init-db.sh`: three isolated services, restricted runtime roles, reproducible image/startup.
- `requirements.lock`: 38 exact Python distribution versions resolved inside the container; no host or frontend dependency changes.
- `foundation.py`: configuration guard, scoped connection pool, dependency override, structured request/error handling and two operational endpoints.
- `tests/test_foundation.py`, `tests/candidate-routes.json`: 26 foundation checks and 152-route baseline.
- `.gitignore`, `.dockerignore`, `README.md`: generated/secret exclusions and reproducible operator instructions.

New documentation: this report, [32 sentinel register](32-ZERO-SENTINEL-CLASSIFICATION.md), [33 role/auth dependencies](33-ROLE-LANDINGS-AND-AUTH-DEPENDENCIES.md), and five evidence files listed below. Index updated. Ignored `.local.env` and `.generated/candidate` are local generated artifacts, not proposed repository source. No secrets were printed or committed.

## Results and limits

| Check | Result | Interpretation |
|---|---|---|
| Image build/startup | PASS | Pinned candidate FastAPI starts under non-root Uvicorn; all three new services healthy. |
| Local API | PASS | `http://127.0.0.1:18184`; four health paths return 200 from Windows host. |
| PostgreSQL connectivity | PASS | Development readiness verifies expected DB and restricted user; test asserts test DB/user and no superuser/BYPASSRLS. |
| Environment isolation | PASS | Eight fail-closed environment cases; separate credentials/volumes/internal DB networks; PostgreSQL has no published host ports. API alone has an extra bridge for loopback publication. |
| Stop/restart | PASS | New Compose project stopped and restarted healthy, retaining volumes. Existing `workshopos-api-1` and `workshopos-db-1` left running on original network/ports. |
| Test suite | PASS | 26 passed, 0 failed, 0 timed out; post-restart execution 5.54 seconds, 3 warnings. |
| Health failure | PASS | Simulated SQL connection failure returns sanitized 503; liveness remains available. |
| Alembic lineage | PASS | 34 active revisions, one head `20261018_0033`; `alembic current` connects to empty test DB. |
| Migration tooling | PARTIALLY VERIFIED | `upgrade head --sql` generates SQL successfully; no upgrade/stamp execution. Full clean replay/downgrade/upgrade compatibility not certified. Runtime lacks DDL privileges intentionally. |
| Existing routes | PARTIALLY VERIFIED | All 152 candidate application method/path pairs remain; existing OpenAPI path contracts unchanged; only `/livez` and `/readyz` added. Business execution not tested without schema/data. |
| Initial authentication contracts | PARTIALLY VERIFIED | Config returns database mode; absent sessions denied despite forged identity header; password-hash primitive passes; malformed login does not echo credentials. Successful authentication/session lifecycle deferred. |
| Error/logging contracts | PASS with explicit change | Domain error codes preserved; unexpected 500 sanitized; validation 422 retains detail/loc/msg/type but omits input/ctx. Logs omit query/body/credentials and carry generated request ID. |
| Data protection | PASS | Eight SQLite hashes unchanged, including shipped dataset; no imports or historical financial recalculation. |
| UI protection | PASS | 115 protected files and 94 screenshots unchanged. No browser tests or screenshot replacement performed. |

The empty database is deliberate. `/readyz` returns `schema: not_applied`; a green infrastructure probe does not certify functioning business routes. Both databases were freshly initialized without business tables. Tests explicitly confirm zero public tables before and after Alembic inspection/offline generation.

## Failures encountered and resolved

1. Initial test collection failed with `ModuleNotFoundError: foundation`: the standalone pytest executable did not include the working directory in imports. New harness command changed to `python -m pytest`; all 26 checks then passed, including a repeat after stack restart.
2. Docker Desktop did not publish the API host port while it had only an internal network; in-container probes passed but Windows loopback refused connections. Added a separate API-only bridge; host probes subsequently passed. Both PostgreSQL networks remain internal, their ports unpublished, and the test runner cannot join the development network through its Compose configuration.
3. Three non-failing dependency warnings remain: one Starlette/AnyIO deprecation and Pydantic warnings for `tenantCode` and `userId` aliases. No dependency or candidate business-code refactoring performed. Stage 4B needs valid login-payload contract coverage before claiming alias compatibility. These warnings are separate from the historical three report-template frontend unit failures; those tests were not run or changed.

## Integrity and landing decisions

[32](32-ZERO-SENTINEL-CLASSIFICATION.md) enumerates every one of 61 zero references across 58 records: 52 checklist actor references, three material-movement job references and six references on three stock-ledger records. The stock rows are purchase-order closure inwards, not demonstrated opening balances. Proposed nullable FK mapping retains original zero/provenance and requires DATA-SENTINEL-01 approval. No mapping applied. All 51 historical invoice discrepancies remain unchanged through byte-identical database preservation.

[33](33-ROLE-LANDINGS-AND-AUTH-DEPENDENCIES.md) records each built-in role's authorized first-menu page. Non-Admin roles must not be sent automatically to Admin Dashboard. Custom/empty-grant behavior and URL binding require resolution without new pages or altered grants.

## Remaining blockers and Stage 4B recommendation

Approve a bounded Stage 4B to validate clean candidate Alembic replay and rollback on disposable PostgreSQL using a dedicated migration-owner process, then implement/test only the approved unified authentication/session contract using synthetic disposable users covering seven roles. Keep frontend integration and business modules out of that package until their separate acceptance gates are met.

Before authentication completion: resolve session lifetime/renewal, tenant provisioning, HTTPS browser-test setup, custom/no-grant landing behavior, logout/session API response alignment and the user-editor password behavior approval. Run all 18 document-29 authentication specifications, including production demo-fixture exclusion and CSRF. Foundation tests do not replace those specifications.

Before demo import: approve DATA-SENTINEL-01 and remaining data authority/browser preservation decisions; validate proposed constraints without discarding records; preserve all historical financial values. The 106-table architecture proposal was not implemented. Existing older migration lineage must not be upgraded in place merely because the candidate offline SQL compiles.

## Evidence

- [Initial revision, status and source provenance](stage4a-preflight.json.md)
- [Foundation test execution](stage4a-foundation-test-results.md)
- [Runtime, network, port and health verification](stage4a-runtime-verification.json.md)
- [Final protected/source/SQLite/screenshot hashes](stage4a-final-hashes.json.md)
- [All zero-sentinel occurrences and source records](stage4a-zero-sentinels.json.md)
- [Startup, configuration and shutdown commands](../../backend/foundation/README.md)
