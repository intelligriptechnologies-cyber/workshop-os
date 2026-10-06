"""Persist the Technician workspace's attachment metadata and pause state.

Revision ID: 20261006_0019
Revises: 20261006_0018
"""

from alembic import op


revision = "20261006_0019"
down_revision = "20261006_0018"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE evidence_attachments ADD COLUMN category text NOT NULL DEFAULT 'work_evidence' CHECK (category IN ('before_work','after_work','work_evidence','qc_evidence'))")
    op.execute("ALTER TABLE evidence_attachments ADD COLUMN caption text NOT NULL DEFAULT ''")
    op.execute("ALTER TABLE technician_tasks DROP CONSTRAINT technician_tasks_status_check")
    op.execute("ALTER TABLE technician_tasks ADD CONSTRAINT technician_tasks_status_check CHECK (status IN ('PENDING','IN_PROGRESS','PAUSED','COMPLETED','CANCELLED'))")
    op.execute("UPDATE technician_tasks SET status='PAUSED' WHERE status='BLOCKED'")
    op.execute("ALTER TABLE work_updates DROP CONSTRAINT work_updates_status_check")
    op.execute("ALTER TABLE work_updates ADD CONSTRAINT work_updates_status_check CHECK (status IN ('IN_PROGRESS','PAUSED','COMPLETED'))")
    op.execute("UPDATE work_updates SET status='PAUSED' WHERE status='BLOCKED'")


def downgrade() -> None:
    op.execute("UPDATE work_updates SET status='BLOCKED' WHERE status='PAUSED'")
    op.execute("ALTER TABLE work_updates DROP CONSTRAINT work_updates_status_check")
    op.execute("ALTER TABLE work_updates ADD CONSTRAINT work_updates_status_check CHECK (status IN ('IN_PROGRESS','BLOCKED','COMPLETED'))")
    op.execute("UPDATE technician_tasks SET status='BLOCKED' WHERE status='PAUSED'")
    op.execute("ALTER TABLE technician_tasks DROP CONSTRAINT technician_tasks_status_check")
    op.execute("ALTER TABLE technician_tasks ADD CONSTRAINT technician_tasks_status_check CHECK (status IN ('PENDING','IN_PROGRESS','BLOCKED','COMPLETED','CANCELLED'))")
    op.execute("ALTER TABLE evidence_attachments DROP COLUMN caption")
    op.execute("ALTER TABLE evidence_attachments DROP COLUMN category")
