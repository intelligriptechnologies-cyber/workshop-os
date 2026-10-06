# Pre-merge migration lineage archive

These revision files are retained as historical evidence of the backend
lineage that existed before the `Prem-dev-fbb` merge. They are intentionally
outside Alembic's active `versions` location.

The merged application uses the `20261001_0002` execution/QC lineage and its
successors. The archived September execution, finance, and follow-up lineage
creates the same domain tables through incompatible revisions, so loading both
lineages would create duplicate tables on a fresh database. The archived
October foundation also duplicated the active September foundation revision
identifier after the merge.

The archived `20261002_0013` finance-corrections revision duplicates the
active `20261001_0006` finance-corrections migration. Service-department
routing now follows the active revision directly, so a clean database does
not attempt to remove the same finance constraint twice.

Keeping these files out of the active graph preserves the merge history while
leaving one executable migration path for new Compose and staging databases.
This repository's agreed cutover assumption is a fresh, disposable staging
database; a database stamped at an archived revision needs a separately
planned reconciliation before it can be upgraded.
