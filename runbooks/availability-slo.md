# Availability SLO breach

Owner: incident-commander

## Immediate actions

1. Open an incident, assign a correlation reference, and confirm the signal from API, worker, database, queue, and provider health rather than customer data.
2. Identify affected tenants and branches using scoped metrics; never paste customer, vehicle, payment, token, or media values into incident channels.
3. Freeze non-essential releases and record the start of customer impact and the current error-budget position.

## Recovery

1. Follow the failing dependency's runbook and use only pre-authorized traffic controls, rollback procedures, or provider fallbacks.
2. Preserve idempotency keys, outbox rows, audit evidence, and immutable ledgers; do not repair availability by deleting or rewriting committed records.
3. Escalate any proposed failover, restore, customer communication, or production mutation to the named maker-checker authority.

## Verification

Confirm routine and authoritative success rates, queue age, provider health, tenant isolation, and duplicate-effect counts over the agreed observation window. Record timestamps, queries, dashboards, decisions, and the recovery correlation reference.

## Escalation

Escalate immediately to platform operations, security, database operations, and the business incident owner when isolation, financial integrity, RPO/RTO, or the 99.9% objective is at risk. Customer or regulator communications require authorized owners.
