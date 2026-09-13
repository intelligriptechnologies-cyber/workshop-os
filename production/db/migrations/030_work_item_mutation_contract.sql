BEGIN;

ALTER TABLE workshopos.work_item
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT transaction_timestamp();

ALTER TABLE workshopos.idempotency_result
  ADD COLUMN request_hash text;

COMMIT;
