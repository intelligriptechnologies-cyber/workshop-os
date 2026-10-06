"""Add durable, capacity-aware Bookings and atomic Booking check-in.

Revision ID: 20261006_0018
Revises: 20261006_0017
Create Date: 2026-10-06
"""

from alembic import op


revision = "20261006_0018"
down_revision = "20261006_0017"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE booking_capacity_limits (
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            booking_date date NOT NULL,
            service_work_capacity integer NOT NULL DEFAULT 10 CHECK (service_work_capacity >= 0),
            general_checkup_followup_capacity integer NOT NULL DEFAULT 10 CHECK (general_checkup_followup_capacity >= 0),
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_at timestamptz NOT NULL DEFAULT now(),
            PRIMARY KEY (tenant_id, branch_id, booking_date),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE bookings (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            customer_id bigint NOT NULL,
            vehicle_id bigint NOT NULL,
            booking_date date NOT NULL,
            service_type text NOT NULL CHECK (service_type IN ('Service Work', 'General Checkup / Follow-up')),
            arrival_window text NOT NULL DEFAULT '',
            requested_work text NOT NULL CHECK (btrim(requested_work) <> ''),
            status text NOT NULL DEFAULT 'BOOKED' CHECK (status IN ('BOOKED','CONFIRMED','RESCHEDULED','ARRIVED','CANCELLED','NO_SHOW')),
            visit_id bigint UNIQUE REFERENCES visits(id) ON DELETE RESTRICT,
            job_card_id bigint UNIQUE REFERENCES job_cards(id) ON DELETE RESTRICT,
            arrived_at timestamptz,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES customers(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES vehicles(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX bookings_capacity_idx ON bookings (tenant_id, branch_id, booking_date, service_type)
            WHERE status IN ('BOOKED','CONFIRMED','RESCHEDULED');
    """)
    for table in ("booking_capacity_limits", "bookings"):
        _scoped(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON booking_capacity_limits, bookings TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON booking_capacity_limits, bookings FROM workshopos_runtime")
    op.execute("DROP TABLE IF EXISTS bookings")
    op.execute("DROP TABLE IF EXISTS booking_capacity_limits")
