"""Create tenant and branch scoped customer, vehicle, and visit intake records.

Revision ID: 20260929_0005
Revises: 20260929_0004
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0005"
down_revision = "20260929_0004"
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
    op.execute(
        """
        CREATE TABLE customers (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            name text NOT NULL CHECK (btrim(name) <> ''),
            mobile text NOT NULL CHECK (btrim(mobile) <> ''),
            type text NOT NULL DEFAULT 'Individual' CHECK (btrim(type) <> ''),
            address text NOT NULL DEFAULT '',
            archived_at timestamptz,
            archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX customers_active_mobile_per_branch
            ON customers (tenant_id, branch_id, lower(mobile)) WHERE archived_at IS NULL;
        CREATE INDEX customers_scope_search_idx
            ON customers (tenant_id, branch_id, archived_at, lower(name), lower(mobile));

        CREATE TABLE vehicles (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            customer_id bigint NOT NULL,
            number text NOT NULL CHECK (btrim(number) <> ''),
            make text NOT NULL CHECK (btrim(make) <> ''),
            model text NOT NULL CHECK (btrim(model) <> ''),
            color text NOT NULL DEFAULT '',
            km integer NOT NULL DEFAULT 0 CHECK (km >= 0),
            engine_no text NOT NULL DEFAULT '',
            archived_at timestamptz,
            archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES customers(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX vehicles_active_number_per_branch
            ON vehicles (tenant_id, branch_id, upper(number)) WHERE archived_at IS NULL;
        CREATE INDEX vehicles_scope_search_idx
            ON vehicles (tenant_id, branch_id, archived_at, upper(number), lower(make), lower(model));

        CREATE TABLE visits (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            customer_id bigint NOT NULL,
            vehicle_id bigint NOT NULL,
            advisor_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            received_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            received_at timestamptz NOT NULL DEFAULT now(),
            fuel text NOT NULL CHECK (btrim(fuel) <> ''),
            odo_reading integer NOT NULL CHECK (odo_reading >= 0),
            fuel_level_value text NOT NULL DEFAULT '',
            fuel_level_unit text NOT NULL DEFAULT '',
            keys text NOT NULL DEFAULT '',
            accessories text NOT NULL DEFAULT '',
            requested_work text NOT NULL CHECK (btrim(requested_work) <> ''),
            photos_note text NOT NULL DEFAULT '',
            archived_at timestamptz,
            archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES customers(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES vehicles(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX visits_scope_search_idx ON visits (tenant_id, branch_id, archived_at, received_at DESC);
        """
    )
    for table in ("customers", "vehicles", "visits"):
        _scoped_table(table)
    op.execute("GRANT SELECT, INSERT, UPDATE ON customers, vehicles, visits TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON customers, vehicles, visits FROM workshopos_runtime")
    op.execute("DROP TABLE IF EXISTS visits")
    op.execute("DROP TABLE IF EXISTS vehicles")
    op.execute("DROP TABLE IF EXISTS customers")
