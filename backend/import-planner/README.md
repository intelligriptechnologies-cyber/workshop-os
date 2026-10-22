# Dry-run import planner

Run from the repository root:

```powershell
python backend/import-planner/planner.py
python backend/import-planner/test_planner.py
```

The planner uses Python's standard library, opens only the pinned SQLite candidate with `mode=ro&immutable=1` and `PRAGMA query_only=ON`, rejects unexpected hashes/sidecars, and rechecks the source hash afterwards. It has no PostgreSQL driver, connection option, INSERT, migration or apply/import mode. Outputs are restricted to `docs/backend-migration/`. No passwords are exported; source file custody retains the original bytes. Float hexadecimal provenance retains SQLite REAL representation; proposed decimal strings are never rounded.

Input evidence is the Stage 3 mapping, Stage 4B contract, Stage 4A sentinel register and the separately captured `stage4c1-target-readonly.json.md`. The latter is a point-in-time snapshot, not an enduring claim about target state. At actual import approval, refresh source/target evidence and reject drift. A deterministic content candidate is not an approved or constraint-complete insert. Every manifest retains raw source key/payload, proposed values, issue list and an explicit disposition. UUID identities are not fabricated. Source scope, native prerequisites and dependency blockers remain gates.

`probe.py` and `check_constraints.py` run only with the existing guarded Stage 4B image/network and `STAGE4B_SCOPE=test`. Override the runner command; never invoke its default migration test command for this stage:

```powershell
$probe = (Resolve-Path backend/import-planner/probe.py).Path
docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml run --rm -v "${probe}:/probe.py:ro" migrate-test python /probe.py
$checker = (Resolve-Path backend/import-planner/check_constraints.py).Path
$plan = (Resolve-Path docs/backend-migration/stage4c1-dry-run).Path
$target = (Resolve-Path docs/backend-migration/stage4c1-target-readonly.json.md).Path
docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml run --rm -v "${checker}:/check.py:ro" -v "${plan}:/plan:ro" -v "${target}:/target.json:ro" migrate-test python /check.py
```

Capture JSON stdout to the documented evidence files using an explicit UTF-8 writer. Docker diagnostics are on stderr. Both scripts verify the pinned source/environment through `guarded_engine`, require target head 0035, issue `SET TRANSACTION READ ONLY`, perform SELECTs, and roll back. The checker evaluates PostgreSQL CHECK expressions against complete candidate values using SELECT projections, never INSERT-and-rollback. It marks incomplete expressions UNVERIFIED and confirms zero business rows before/after. Foreign keys are checked against source-parent identities offline; SQL CHECK results do not certify actual inserts, trigger behavior, partial unique indexes or unresolved native identity links.

No original database, source record, historical financial value, target business row, frontend or browser storage is changed. Reports contain demo business data and should remain under the same custody controls as the original approved dataset. Approval for real import remains a separate gate in document 38.
