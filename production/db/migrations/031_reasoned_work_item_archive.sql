BEGIN;

ALTER TABLE workshopos.work_item
  ADD COLUMN archived_at timestamptz,
  ADD COLUMN archived_reason text,
  ADD COLUMN archived_by text,
  ADD CONSTRAINT work_item_archive_complete CHECK (
    (archived_at IS NULL AND archived_reason IS NULL AND archived_by IS NULL)
    OR (
      archived_at IS NOT NULL
      AND archived_reason IS NOT NULL
      AND archived_by IS NOT NULL
      AND length(trim(archived_reason)) > 0
      AND length(trim(archived_by)) > 0
    )
  );

ALTER TABLE workshopos.audit_entry
  ADD COLUMN detail jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMIT;
