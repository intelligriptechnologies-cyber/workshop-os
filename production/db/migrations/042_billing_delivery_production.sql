BEGIN;

-- V12-13 exposes the existing S18/S20/S21 finance and custody ledgers through
-- the production runtime.  These permissions are evaluated by both the UI and
-- the HTTP boundary.
ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
UPDATE workshopos.role_template
SET permissions = permissions || '["billing.page","billing.read","invoice.finalize","invoice.correction.request","invoice.correction.approve","payment.record","payment.correction.request","payment.correction.approve","delivery.record","gate-pass.issue","gate-pass.verify","job.close"]'::jsonb,
    version = version + 1,
    updated_at = transaction_timestamp()
WHERE system_template
  AND name = 'Business Owner/Admin'
  AND NOT permissions ?& ARRAY['billing.page','billing.read','invoice.finalize','invoice.correction.request','invoice.correction.approve','payment.record','payment.correction.request','payment.correction.approve','delivery.record','gate-pass.issue','gate-pass.verify','job.close'];
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;

CREATE OR REPLACE FUNCTION workshopos.guard_payment_correction_decision() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP='DELETE' OR OLD.status<>'APPROVAL_PENDING' OR NEW.status NOT IN ('APPROVED','REJECTED') OR
     (OLD.tenant_id,OLD.branch_id,OLD.id,OLD.original_financial_event_id,OLD.correction_kind,OLD.currency,
      OLD.amount_minor,OLD.reason,OLD.evidence_ref,OLD.maker_membership_id,OLD.created_at)
     IS DISTINCT FROM
     (NEW.tenant_id,NEW.branch_id,NEW.id,NEW.original_financial_event_id,NEW.correction_kind,NEW.currency,
      NEW.amount_minor,NEW.reason,NEW.evidence_ref,NEW.maker_membership_id,NEW.created_at) OR
     NEW.checker_membership_id IS NULL OR NEW.checker_membership_id=NEW.maker_membership_id OR
     NEW.resource_version<>OLD.resource_version+1 THEN
    RAISE EXCEPTION 'payment corrections require one independent append-only decision';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER payment_correction_decision_guard BEFORE UPDATE OR DELETE ON workshopos.payment_correction
FOR EACH ROW EXECUTE FUNCTION workshopos.guard_payment_correction_decision();

CREATE INDEX native_invoice_job_production_idx ON workshopos.native_invoice(tenant_id,branch_id,job_id,status,drafted_at DESC);
CREATE INDEX financial_event_job_production_idx ON workshopos.financial_event(tenant_id,branch_id,job_id,occurred_at,id);
CREATE INDEX payment_correction_production_idx ON workshopos.payment_correction(tenant_id,branch_id,original_financial_event_id,status,created_at);
CREATE INDEX gate_pass_job_production_idx ON workshopos.gate_pass(tenant_id,branch_id,job_id,valid_from DESC);

COMMIT;
