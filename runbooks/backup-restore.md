# Backup RPO risk and restore

Owner: database-operations

## Immediate actions

1. Confirm the latest successful database and object backup timestamps, replication health, checksum status, retention policy, and legal-hold coverage.
2. Open an incident when the 15-minute RPO is at risk. Preserve the suspected source and prevent unapproved purge, rotation, or overwrite.
3. Name the restore point, isolated target environment, recovery owner, checker, and maximum two-hour RTO clock.

## Recovery

1. Restore into an isolated authorized environment first. Verify backup manifests and checksums before opening application access.
2. Apply database migrations and replay durable queues only from the documented recovery boundary with original effect keys.
3. Reconcile tenant counts, scoped object manifests, immutable inventory/finance ledgers, document sequences, and audit history. Production promotion or regional failover requires maker-checker authorization.

## Verification

Record measured RPO and RTO, checksum results, tenant/branch isolation tests, application smoke tests, queue replay uniqueness, and reconciliation totals. A local simulation is not evidence of a production restore or regional DR exercise.

## Escalation

Escalate checksum failure, missing backups, legal-hold risk, cross-tenant visibility, financial divergence, or an RTO forecast over two hours to the incident commander, security, finance, and executive recovery authority.
