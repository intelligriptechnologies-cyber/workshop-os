# Stalled queue recovery

Owner: platform-operations

## Immediate actions

1. Confirm oldest-message age, pending count, worker errors, visibility timeout, throttling, and dead-letter growth for the affected tenant-safe queue dimensions.
2. Stop broad replay while the cause is unknown. Capture delivery ID, effect key digest, attempt count, correlation ID, and safe error code without payload contents.
3. Check worker concurrency, database connectivity, object access, and provider status.

## Recovery

1. Correct the worker or dependency fault through the authorized deployment or configuration path.
2. Resume a small canary batch using the existing effect keys and durable claim mechanism, then increase throughput only while error and duplicate-effect counters remain clear.
3. Move exhausted work through the authorized dead-letter replay workflow; never copy messages into a new tenant or invent new effect keys.

## Verification

Verify queue age is falling, claims are exclusive, successful effects remain unique, retries retain their original correlation, and no other tenant or branch becomes visible. Retain canary and steady-state evidence.

## Escalation

Escalate to application operations when messages dead-letter, to database operations for claim/transaction failures, and to the incident commander when the queue threatens the service SLO or promised delivery operations.
