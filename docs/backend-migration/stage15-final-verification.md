# Stage 1.5 final verification

2026-10-21. All eight SQLite SHA-256 hashes were recalculated after documentation/probes and match the initial stage-1.5 evidence.

| Database | Unchanged | SHA-256 |
|---|---|---|
| DB-01 | True | `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` |
| DB-02 | True | `6b5159435242db0d87246a883f0b46f27ebc519f7b78f61f3fee23323075e4c1` |
| DB-03 | True | `b61f8fa1c815141bd196a5c7b06199a480ae3c8af52209dc49d8ded58f8e3b70` |
| DB-04 | True | `b5c253b2d7a821ac0324f2d21193d5eaa79af01446bed2bc6443faa2fbc44c48` |
| DB-05 | True | `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` |
| DB-06 | True | `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` |
| DB-07 | True | `5da9c6b40b32429c2520fb6f3cbf274c60a7b3a94b55bc317692398e2131d3a5` |
| DB-08 | True | `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` |

All six deliverables and index are present. Relative evidence links checked; missing links: [].

## Git state

Tracked diff paths (AGENTS.md was pre-existing):

```text
AGENTS.md
```

Status includes pre-existing untracked work; no files were staged or committed:

```text
 M AGENTS.md
?? .scratch/capture-reference.mjs
?? .scratch/codex-decoy.sqlite
?? .scratch/codex-leads-source.sqlite
?? .scratch/codex-snappy/
?? .scratch/codex-ticket89-pg/
?? .scratch/pre-integration-20261019-080154/
?? .scratch/reference-a315448/
?? .scratch/reference-capture-a315448/
?? .scratch/rejected-stale-reference-captures/
?? .scratch/restoration-backend-results.txt
?? .scratch/restoration-browser-results.txt
?? .scratch/restoration-checkpoint-paths
?? .scratch/restoration-checkpoint.index
?? .scratch/restoration-inventory-a315448/
?? .scratch/restoration-reference-build/
?? .scratch/restoration-visual-results.txt
?? data-migration/
?? docs/backend-migration/
```

Initial Graft orientation auto-refreshed generated index metadata; this side effect was disclosed. No application source/test/configuration edits were made. Subsequent Graft calls used --no-refresh. No containers were started or stopped. Focused template tests still fail at the same three stale default-count expectations; the pure template-invariant and financial comparison probes used memory only. Backend integration tests were not run.
