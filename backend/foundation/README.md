# Stage 4A isolated foundation

Run commands from the repository root. Requires Git, Python 3, Docker Engine and Compose v2. This harness uses only backend source from `50c8aab1766b61c914e2829b460bfd1697723ec2`; it does not replace the checked-out backend or touch frontend files. The commit must exist locally.

```powershell
python backend/foundation/prepare.py
docker compose --env-file backend/foundation/.local.env -f backend/foundation/compose.yaml config --quiet
docker compose --env-file backend/foundation/.local.env -f backend/foundation/compose.yaml up --build -d --wait api db-test
docker compose --env-file backend/foundation/.local.env -f backend/foundation/compose.yaml --profile test run --rm tests
docker compose --env-file backend/foundation/.local.env -f backend/foundation/compose.yaml stop
```

Restart with the same `up` command. `stop` retains the disposable volumes. Optional teardown of containers/networks is the same Compose prefix followed by `down`; do not add `-v` when retaining data. These commands target project `workshopos-stage4a` only. Never substitute existing development, staging or production database URLs.

`prepare.py` materializes 63 pinned files under ignored `.generated/candidate`, refuses to overwrite divergent generated files, and generates four separate random local passwords in ignored `.local.env`. Keep that file private; do not paste expanded Compose configuration or container environment output. Retain it alongside existing disposable volumes: changing a password variable does not rotate an initialized PostgreSQL role. No demo credentials are used or created. No SQLite dataset is copied into the image.

The image pins Python and PostgreSQL image digests and 38 Python distributions in `requirements.lock`. Dependency installation occurs inside the image. The build needs registry/package network access. Both database networks are internal; the API alone also joins an ordinary bridge network to support Docker Desktop loopback port publication. Runtime uses an unprivileged container user, read-only application filesystem and restricted database login. Owner credentials are present only on their respective PostgreSQL initialization containers; neither application nor test runner receives owner credentials.

## Configuration and scope

| Variable | Source / required value |
|---|---|
| DEV_OWNER_PASSWORD, DEV_RUNTIME_PASSWORD | Generated local values, development cluster only |
| TEST_OWNER_PASSWORD, TEST_RUNTIME_PASSWORD | Independently generated local values, test cluster only |
| STAGE4A_SCOPE | Compose supplies `dev` or `test` |
| WORKSHOPOS_ENVIRONMENT | `stage4a` |
| WORKSHOPOS_AUTH_MODE | `database`, same backend authentication system |
| WORKSHOPOS_ALLOW_DEMO_AUTH | `false`; disables backend identity-header bypass, not the frozen frontend dropdown |
| WORKSHOPOS_DATABASE_URL | Compose builds the exact scoped runtime URL; external hosts, query overrides and mismatched scope fail startup |

Only API port `127.0.0.1:18184` is published. PostgreSQL has no host ports. Development and test clusters use separate credentials, volumes and internal networks. Do not connect the approved frontend to this harness yet.

`GET /livez` checks process availability. `GET /readyz` verifies database connectivity and the expected non-superuser/non-BYPASSRLS role. Its `schema: not_applied` field is intentional: **this is infrastructure readiness, not business readiness**. Existing `/health` and `/api/v1/health` remain registered. Database schema and accounts are absent; successful login and business operations are not available.

Alembic is copied unchanged with candidate lineage: 34 active revisions, one head `20261018_0033`. Tests run `alembic current` and `alembic upgrade head --sql`; no schema is applied or stamped. Runtime credentials deliberately lack schema-creation privileges. Stage 4B must validate full migration replay using a separately scoped migration-owner process before deploying business operations. Never run migrations against the pre-existing stack through this harness.

Candidate 152 application method/path registrations and OpenAPI path contracts are checked; two operational endpoints are added. Structured logs contain generated request IDs, route templates, method, status and timing, without request bodies/query strings/credentials. Unexpected exceptions return a sanitized 500. Validation retains 422/detail/loc/msg/type but omits submitted input/context to avoid credential disclosure. Existing domain HTTP error codes remain intact. These error-envelope changes are explicit compatibility qualifications.

See [Stage 4A report](../../docs/backend-migration/31-STAGE4A-FOUNDATION-RESULTS.md) for results, limits and Stage 4B approval gates.
