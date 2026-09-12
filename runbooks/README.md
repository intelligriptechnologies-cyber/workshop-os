# WorkshopOS operational runbooks

These runbooks are the repository-owned targets emitted by the S26 health evaluator. They are response procedures, not authorization to mutate production or contact customers/providers.

- `availability-slo.md` — service availability and error-budget breach.
- `queue-recovery.md` — stalled durable work queue.
- `dead-letter-replay.md` — diagnosis and controlled idempotent replay.
- `provider-failure.md` — Cashfree, Tally, messaging, document, or other provider outage.
- `backup-restore.md` — backup-age/RPO risk and isolated restore verification.

Every incident must retain tenant-safe correlation and named ownership. Deployment, failover, restore promotion, provider changes, customer communications, and replay of financial/document effects require their configured approvals.
