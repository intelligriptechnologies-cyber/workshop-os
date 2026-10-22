# Stage 2 final integrity verification

Read-only verification on 2026-10-21. No browser tests, backend implementation, migration, dependency installation, tags or commits were performed. Original screenshots and databases were not rewritten. The only tracked modification remains pre-existing AGENTS.md; documentation resides in the already-untracked documentation directory.

```json
{
  "head": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
  "guard_files_checked": 115,
  "guard_file_mismatches": [],
  "original_images_checked": 94,
  "original_image_mismatches": [],
  "database_hash_checks": [
    {
      "id": "DB-01",
      "path": "public/workshopos-demo.sqlite",
      "unchanged": true
    },
    {
      "id": "DB-02",
      "path": ".scratch/chrome-profile1-workshopos-original.sqlite",
      "unchanged": true
    },
    {
      "id": "DB-03",
      "path": ".scratch/codex-leads-source.sqlite",
      "unchanged": true
    },
    {
      "id": "DB-04",
      "path": ".scratch/codex-decoy.sqlite",
      "unchanged": true
    },
    {
      "id": "DB-05",
      "path": ".scratch/restoration-reference-build/workshopos-demo.sqlite",
      "unchanged": true
    },
    {
      "id": "DB-06",
      "path": "data-migration/demo-data/shipped.sqlite",
      "unchanged": true
    },
    {
      "id": "DB-07",
      "path": "data-migration/demo-data/runtime-initial.sqlite",
      "unchanged": true
    },
    {
      "id": "DB-08",
      "path": ".scratch/reference-a315448/public/workshopos-demo.sqlite",
      "unchanged": true
    }
  ],
  "broken_document_links": [],
  "working_tree_status": " M AGENTS.md\n?? .scratch/capture-reference.mjs\n?? .scratch/codex-decoy.sqlite\n?? .scratch/codex-leads-source.sqlite\n?? .scratch/codex-snappy/\n?? .scratch/codex-ticket89-pg/\n?? .scratch/pre-integration-20261019-080154/\n?? .scratch/reference-a315448/\n?? .scratch/reference-capture-a315448/\n?? .scratch/rejected-stale-reference-captures/\n?? .scratch/restoration-backend-results.txt\n?? .scratch/restoration-browser-results.txt\n?? .scratch/restoration-checkpoint-paths\n?? .scratch/restoration-checkpoint.index\n?? .scratch/restoration-inventory-a315448/\n?? .scratch/restoration-reference-build/\n?? .scratch/restoration-visual-results.txt\n?? data-migration/\n?? docs/backend-migration/\n",
  "same_status_as_initial_manifest": true,
  "financial_affected_count": 51
}
```
