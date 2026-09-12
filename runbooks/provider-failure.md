# Provider failure response

Owner: integration-operations

## Immediate actions

1. Confirm provider health, signature failures, latency, rejection codes, credential expiry, and callback delay using safe identifiers and raw-body checksums only.
2. Identify the affected integration and tenant scope: messaging, Cashfree, Tally, document delivery, or another approved provider.
3. Preserve queued commands and provider evidence; do not trust redirects, synthesize acknowledgements, or mark delivery successful manually.

## Recovery

1. Apply the configured circuit breaker, retry schedule, or consent-aware fallback. Provider enrollment, credential rotation, endpoint change, and customer messaging require explicit authority.
2. On recovery, process original idempotent effects in bounded order and accept reordered callbacks only through signature, amount/state, and event-ID validation.
3. Reconcile provider and WorkshopOS state before clearing the incident.

## Verification

Verify signature enforcement, event deduplication, terminal-state ordering, fallback consent, settlement or voucher reconciliation, queue health, and tenant-safe telemetry. Confirm no duplicate financial, document, or notification effect occurred.

## Escalation

Escalate credential or signature anomalies to security, payment divergence to finance and Cashfree owners, Tally divergence to the finance/Tally owner, and prolonged customer-impacting failure to the incident commander.
