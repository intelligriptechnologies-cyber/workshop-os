BEGIN;

ALTER TABLE workshopos.platform_emulated_action
  ADD COLUMN phase text NOT NULL DEFAULT 'RESULT'
    CHECK (phase IN ('REQUEST','RESULT')),
  ALTER COLUMN response_status DROP NOT NULL,
  ADD CONSTRAINT platform_emulated_action_status_ck CHECK (
    (phase = 'REQUEST' AND response_status IS NULL) OR
    (phase = 'RESULT' AND response_status BETWEEN 100 AND 599)
  ),
  ADD CONSTRAINT platform_emulated_action_trace_phase_uq UNIQUE (trace_id, phase);

COMMIT;
