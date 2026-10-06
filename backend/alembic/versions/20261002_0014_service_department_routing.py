"""Add branch-scoped service routing, team membership, and job assignment history.

Revision ID: 20261002_0014
Revises: 20261002_0013
"""

from alembic import op


revision = "20261002_0014"
down_revision = "20261001_0006"
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
        CREATE TABLE service_departments (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            name text NOT NULL CHECK (btrim(name) <> ''),
            status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ARCHIVED')),
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, name),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE service_department_managers (
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            department_id uuid NOT NULL REFERENCES service_departments(id) ON DELETE RESTRICT,
            manager_membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE RESTRICT,
            appointed_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            appointed_at timestamptz NOT NULL DEFAULT now(),
            PRIMARY KEY (department_id, manager_membership_id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE service_advisor_teams (
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            department_id uuid NOT NULL REFERENCES service_departments(id) ON DELETE RESTRICT,
            manager_membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE RESTRICT,
            advisor_membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE RESTRICT,
            assigned_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            assigned_at timestamptz NOT NULL DEFAULT now(),
            PRIMARY KEY (tenant_id, branch_id, advisor_membership_id),
            FOREIGN KEY (department_id, manager_membership_id) REFERENCES service_department_managers(department_id, manager_membership_id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        ALTER TABLE job_cards ADD COLUMN department_id uuid REFERENCES service_departments(id) ON DELETE RESTRICT;
        ALTER TABLE job_cards ADD COLUMN responsible_manager_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT;
        ALTER TABLE job_cards ADD COLUMN assignment_state text NOT NULL DEFAULT 'LEGACY'
            CHECK (assignment_state IN ('LEGACY','AWAITING_ADVISOR_ASSIGNMENT','ASSIGNED_TO_ADVISOR'));
        CREATE INDEX job_cards_manager_queue_idx ON job_cards (tenant_id, branch_id, responsible_manager_id, assignment_state, created_at DESC);
        CREATE TABLE job_assignment_history (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            department_id uuid REFERENCES service_departments(id) ON DELETE RESTRICT,
            department_name text, manager_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            manager_name text, advisor_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            advisor_name text, actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            action text NOT NULL CHECK (action IN ('ROUTED_TO_MANAGER','ADVISOR_ASSIGNED','MANAGER_TRANSFERRED')),
            reason text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX job_assignment_history_job_idx ON job_assignment_history (job_card_id, id);

        INSERT INTO tenant_roles (id, tenant_id, name, description, system_key)
        SELECT gen_random_uuid(), t.id, 'Service Department Manager', 'Service Department Manager workspace access', 'service_manager'
        FROM tenants t WHERE NOT EXISTS (SELECT 1 FROM tenant_roles r WHERE r.tenant_id=t.id AND r.system_key='service_manager');
        INSERT INTO role_permissions (role_id, permission)
        SELECT manager.id, permission.permission FROM tenant_roles manager
        JOIN tenant_roles advisor ON advisor.tenant_id=manager.tenant_id AND advisor.system_key='service'
        JOIN role_permissions permission ON permission.role_id=advisor.id
        WHERE manager.system_key='service_manager' ON CONFLICT DO NOTHING;
    """)
    for table in ("service_departments", "service_department_managers", "service_advisor_teams", "job_assignment_history"):
        _scoped(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE, DELETE ON service_departments, service_department_managers, service_advisor_teams TO workshopos_runtime;
        GRANT SELECT, INSERT ON job_assignment_history TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS job_assignment_history")
    op.execute("ALTER TABLE job_cards DROP COLUMN IF EXISTS assignment_state")
    op.execute("ALTER TABLE job_cards DROP COLUMN IF EXISTS responsible_manager_id")
    op.execute("ALTER TABLE job_cards DROP COLUMN IF EXISTS department_id")
    op.execute("DROP TABLE IF EXISTS service_advisor_teams")
    op.execute("DROP TABLE IF EXISTS service_department_managers")
    op.execute("DROP TABLE IF EXISTS service_departments")
