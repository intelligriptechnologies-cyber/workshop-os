"""Create the authenticated Tenant and Branch security boundary.

Revision ID: 20260929_0002
Revises: 20260929_0001
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0002"
down_revision = "20260929_0001"
branch_labels = None
depends_on = None


TENANT_RLS = """
    tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
"""

BRANCH_RLS = f"""
    ({TENANT_RLS})
    AND branch_id = ANY(
        COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
    )
"""


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'workshopos_runtime') THEN
                CREATE ROLE workshopos_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
            END IF;
        END $$;
        ALTER ROLE workshopos_runtime NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
        GRANT workshopos_runtime TO CURRENT_USER;
        """
    )
    op.execute(
        """
        CREATE TABLE tenants (
            id uuid PRIMARY KEY,
            name text NOT NULL,
            lifecycle_state text NOT NULL CHECK (lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended', 'closed')),
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE branches (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            name text NOT NULL,
            is_primary boolean NOT NULL DEFAULT false,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, id),
            UNIQUE NULLS NOT DISTINCT (tenant_id, name)
        );
        CREATE UNIQUE INDEX branches_one_primary_per_tenant ON branches (tenant_id) WHERE is_primary;

        CREATE TABLE platform_users (
            id uuid PRIMARY KEY,
            cognito_subject text NOT NULL UNIQUE,
            display_name text NOT NULL,
            email text NOT NULL,
            status text NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')) DEFAULT 'ACTIVE',
            active_membership_id uuid,
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE tenant_memberships (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            user_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            status text NOT NULL CHECK (status IN ('INVITED', 'ACTIVE', 'ARCHIVED')) DEFAULT 'INVITED',
            version integer NOT NULL DEFAULT 1 CHECK (version > 0),
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, user_id),
            UNIQUE (tenant_id, id)
        );
        ALTER TABLE platform_users
            ADD CONSTRAINT platform_users_active_membership_fk
            FOREIGN KEY (active_membership_id) REFERENCES tenant_memberships(id) ON DELETE SET NULL;
        CREATE TABLE membership_branches (
            membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE CASCADE,
            branch_id uuid NOT NULL,
            tenant_id uuid NOT NULL,
            PRIMARY KEY (membership_id, branch_id),
            FOREIGN KEY (tenant_id, membership_id) REFERENCES tenant_memberships(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE tenant_roles (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            name text NOT NULL,
            status text NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')) DEFAULT 'ACTIVE',
            version integer NOT NULL DEFAULT 1 CHECK (version > 0),
            UNIQUE (tenant_id, name),
            UNIQUE (tenant_id, id)
        );
        CREATE TABLE membership_roles (
            membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE CASCADE,
            role_id uuid NOT NULL REFERENCES tenant_roles(id) ON DELETE RESTRICT,
            tenant_id uuid NOT NULL,
            PRIMARY KEY (membership_id, role_id),
            FOREIGN KEY (tenant_id, membership_id) REFERENCES tenant_memberships(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, role_id) REFERENCES tenant_roles(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE role_permissions (
            role_id uuid NOT NULL REFERENCES tenant_roles(id) ON DELETE CASCADE,
            permission text NOT NULL,
            PRIMARY KEY (role_id, permission)
        );
        """
    )
    # These are the first tenant-owned settings records.  Their policies are
    # templates for every later operational table: explicit tenant ownership,
    # branch composite integrity, and fail-closed transaction-local scope.
    op.execute(
        """
        CREATE TABLE tenant_settings (
            tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE RESTRICT,
            settings jsonb NOT NULL DEFAULT '{}'::jsonb,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE branch_settings (
            tenant_id uuid NOT NULL,
            branch_id uuid NOT NULL,
            settings jsonb NOT NULL DEFAULT '{}'::jsonb,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_at timestamptz NOT NULL DEFAULT now(),
            PRIMARY KEY (tenant_id, branch_id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        """
    )
    for table, predicate in (("tenant_settings", TENANT_RLS), ("branch_settings", BRANCH_RLS)):
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
        op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
        op.execute(f"CREATE POLICY {table}_tenant_scope ON {table} USING ({predicate}) WITH CHECK ({predicate})")
    op.execute("CREATE INDEX branch_settings_scope_idx ON branch_settings (tenant_id, branch_id)")
    op.execute(
        """
        GRANT USAGE ON SCHEMA public TO workshopos_runtime;
        GRANT SELECT, INSERT, UPDATE ON tenant_settings, branch_settings TO workshopos_runtime;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS branch_settings;
        DROP TABLE IF EXISTS tenant_settings;
        DROP TABLE IF EXISTS role_permissions;
        DROP TABLE IF EXISTS membership_roles;
        DROP TABLE IF EXISTS tenant_roles;
        DROP TABLE IF EXISTS membership_branches;
        ALTER TABLE IF EXISTS platform_users DROP CONSTRAINT IF EXISTS platform_users_active_membership_fk;
        DROP TABLE IF EXISTS tenant_memberships;
        DROP TABLE IF EXISTS platform_users;
        DROP TABLE IF EXISTS branches;
        DROP TABLE IF EXISTS tenants;
        """
    )
    op.execute("REVOKE workshopos_runtime FROM CURRENT_USER")
    op.execute("DROP ROLE IF EXISTS workshopos_runtime")
