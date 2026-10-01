"""Create RLS-backed job material reservations and immutable issue ledger.

Revision ID: 20260929_0008
Revises: 20260929_0007
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0008"
down_revision = "20260929_0007"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped_table(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE material_reservations (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            item_id bigint NOT NULL,
            reserved_qty numeric(14,3) NOT NULL CHECK (reserved_qty > 0),
            status text NOT NULL CHECK (status IN ('RESERVED','PARTIALLY_ISSUED','ISSUED','RELEASED')),
            note text NOT NULL DEFAULT '',
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX material_reservations_job_idx ON material_reservations(tenant_id, branch_id, job_card_id, created_at DESC);
        CREATE INDEX material_reservations_item_open_idx ON material_reservations(tenant_id, branch_id, item_id) WHERE status <> 'RELEASED';

        CREATE TABLE material_ledger (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            reservation_id bigint NOT NULL REFERENCES material_reservations(id) ON DELETE RESTRICT,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            item_id bigint NOT NULL,
            entry_type text NOT NULL CHECK (entry_type IN ('RESERVE','ISSUE','RETURN','WASTE','RELEASE','ISSUE_REVERSAL')),
            quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
            reason text NOT NULL DEFAULT '',
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX material_ledger_reservation_idx ON material_ledger(tenant_id, branch_id, reservation_id, id);
        CREATE INDEX material_ledger_job_idx ON material_ledger(tenant_id, branch_id, job_card_id, created_at DESC);
        CREATE UNIQUE INDEX material_ledger_one_reserve ON material_ledger(reservation_id) WHERE entry_type='RESERVE';

        ALTER TABLE stock_ledger ADD COLUMN material_ledger_id bigint UNIQUE REFERENCES material_ledger(id) ON DELETE RESTRICT;
        ALTER TABLE stock_ledger DROP CONSTRAINT stock_ledger_entry_type_check;
        ALTER TABLE stock_ledger ADD CONSTRAINT stock_ledger_entry_type_check
            CHECK (entry_type IN ('INWARD','ADJUSTMENT','ISSUE','RETURN','WASTE','ISSUE_REVERSAL'));

        CREATE FUNCTION material_ledger_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'material_ledger_is_immutable'; END $$;
        CREATE TRIGGER material_ledger_no_mutation BEFORE UPDATE OR DELETE ON material_ledger FOR EACH ROW EXECUTE FUNCTION material_ledger_immutable();

        -- Material events must agree with their reservation and cannot issue,
        -- settle, or release more quantity than the reservation permits.  Lock
        -- the reservation row so parallel commands have one serial history.
        CREATE FUNCTION material_ledger_validate() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE reservation record;
        DECLARE issued numeric(14,3); released numeric(14,3); settled numeric(14,3);
        BEGIN
            SELECT * INTO reservation FROM material_reservations WHERE id=NEW.reservation_id FOR UPDATE;
            IF NOT FOUND OR reservation.tenant_id<>NEW.tenant_id OR reservation.branch_id<>NEW.branch_id
               OR reservation.job_card_id<>NEW.job_card_id OR reservation.item_id<>NEW.item_id THEN
                RAISE EXCEPTION 'material_reservation_scope_mismatch';
            END IF;
            SELECT COALESCE(SUM(quantity) FILTER (WHERE entry_type='ISSUE'),0),
                   COALESCE(SUM(quantity) FILTER (WHERE entry_type='RELEASE'),0),
                   COALESCE(SUM(quantity) FILTER (WHERE entry_type IN ('RETURN','WASTE','ISSUE_REVERSAL')),0)
              INTO issued,released,settled FROM material_ledger WHERE reservation_id=NEW.reservation_id;
            IF NEW.entry_type='RESERVE' AND NEW.quantity<>reservation.reserved_qty THEN RAISE EXCEPTION 'material_reserve_quantity_mismatch'; END IF;
            IF NEW.entry_type='ISSUE' AND issued+NEW.quantity > reservation.reserved_qty-released THEN RAISE EXCEPTION 'material_issue_exceeds_reservation'; END IF;
            IF NEW.entry_type IN ('RETURN','WASTE','ISSUE_REVERSAL') AND settled+NEW.quantity > issued THEN RAISE EXCEPTION 'material_settlement_exceeds_issued'; END IF;
            IF NEW.entry_type='RELEASE' AND released+NEW.quantity > reservation.reserved_qty-issued THEN RAISE EXCEPTION 'material_release_exceeds_open_reservation'; END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER material_ledger_validate_before_insert BEFORE INSERT ON material_ledger FOR EACH ROW EXECUTE FUNCTION material_ledger_validate();

        -- Physical stock moves only when stock leaves or returns to the Store.
        -- WASTE settles material that has already left stock through ISSUE, so
        -- it remains an immutable job-material outcome without double-debiting
        -- the catalogue balance.
        CREATE FUNCTION material_ledger_stock_outcome() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE stock_type text; stock_quantity numeric(14,3);
        BEGIN
            stock_type := CASE NEW.entry_type WHEN 'ISSUE' THEN 'ISSUE' WHEN 'RETURN' THEN 'RETURN'
                WHEN 'ISSUE_REVERSAL' THEN 'ISSUE_REVERSAL' ELSE NULL END;
            IF stock_type IS NULL THEN RETURN NEW; END IF;
            stock_quantity := CASE WHEN NEW.entry_type='ISSUE' THEN -NEW.quantity ELSE NEW.quantity END;
            INSERT INTO stock_ledger (tenant_id,branch_id,item_id,material_ledger_id,entry_type,quantity,unit_cost,reason,actor_id)
            VALUES (NEW.tenant_id,NEW.branch_id,NEW.item_id,NEW.id,stock_type,stock_quantity,0,
                COALESCE(NULLIF(NEW.reason,''), lower(replace(NEW.entry_type,'_',' '))),NEW.actor_id);
            RETURN NEW;
        END $$;
        CREATE TRIGGER material_ledger_stock_outcome_after_insert AFTER INSERT ON material_ledger FOR EACH ROW EXECUTE FUNCTION material_ledger_stock_outcome();

        -- This guard deliberately lives at the ledger boundary, rather than in
        -- the browser.  The catalogue row serialises two Store users issuing the
        -- same item concurrently and rejects an overdraft regardless of caller.
        CREATE FUNCTION stock_ledger_prevent_negative() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE running numeric(14,3);
        BEGIN
            PERFORM 1 FROM catalogue_items WHERE id=NEW.item_id FOR UPDATE;
            SELECT COALESCE(SUM(quantity), 0) INTO running
            FROM stock_ledger WHERE tenant_id=NEW.tenant_id AND branch_id=NEW.branch_id AND item_id=NEW.item_id;
            IF running + NEW.quantity < 0 THEN
                RAISE EXCEPTION 'negative_stock_not_allowed';
            END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER stock_ledger_no_negative BEFORE INSERT ON stock_ledger FOR EACH ROW EXECUTE FUNCTION stock_ledger_prevent_negative();
    """)
    for table in ("material_reservations", "material_ledger"):
        _scoped_table(table)
    op.execute("GRANT SELECT, INSERT, UPDATE ON material_reservations, material_ledger TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON material_reservations, material_ledger FROM workshopos_runtime")
    op.execute("DROP TRIGGER IF EXISTS stock_ledger_no_negative ON stock_ledger")
    op.execute("DROP FUNCTION IF EXISTS stock_ledger_prevent_negative")
    op.execute("DROP TRIGGER IF EXISTS material_ledger_no_mutation ON material_ledger")
    op.execute("DROP FUNCTION IF EXISTS material_ledger_immutable")
    op.execute("DROP TRIGGER IF EXISTS material_ledger_stock_outcome_after_insert ON material_ledger")
    op.execute("DROP FUNCTION IF EXISTS material_ledger_stock_outcome")
    op.execute("DROP TRIGGER IF EXISTS material_ledger_validate_before_insert ON material_ledger")
    op.execute("DROP FUNCTION IF EXISTS material_ledger_validate")
    op.execute("ALTER TABLE stock_ledger DROP CONSTRAINT stock_ledger_entry_type_check")
    op.execute("ALTER TABLE stock_ledger ADD CONSTRAINT stock_ledger_entry_type_check CHECK (entry_type IN ('INWARD','ADJUSTMENT'))")
    op.execute("ALTER TABLE stock_ledger DROP COLUMN IF EXISTS material_ledger_id")
    for table in ("material_ledger", "material_reservations"):
        op.execute(f"DROP TABLE IF EXISTS {table}")
