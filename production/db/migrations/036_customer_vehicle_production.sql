BEGIN;

CREATE UNIQUE INDEX customer_mobile_identity
  ON workshopos.customer_contact (tenant_id, branch_id, normalized_value)
  WHERE contact_type = 'MOBILE';

CREATE INDEX customer_active_list
  ON workshopos.customer (tenant_id, branch_id, updated_at DESC, id) WHERE status = 'ACTIVE';
CREATE INDEX vehicle_active_list
  ON workshopos.vehicle (tenant_id, branch_id, updated_at DESC, id) WHERE status = 'ACTIVE';

ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
WITH changed AS (
  UPDATE workshopos.role_template
  SET permissions = permissions || '["customers.page","customer.read","customer.manage","customer.export","vehicles.page","vehicle.read","vehicle.manage","vehicle.export"]'::jsonb,
      version = version + 1, updated_at = transaction_timestamp()
  WHERE system_template AND name = 'Business Owner/Admin'
    AND NOT permissions ? 'customers.page'
  RETURNING *
)
INSERT INTO workshopos.role_template_version(id,tenant_id,role_id,version,name,description,permissions,active,change_reason)
SELECT gen_random_uuid(),tenant_id,id,version,name,description,permissions,active,'V12-07 customer and vehicle permissions' FROM changed;
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;

COMMIT;
