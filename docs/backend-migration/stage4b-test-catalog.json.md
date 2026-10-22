{
  "columns": [
    {
      "table_name": "active_invoice_claims",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "active_invoice_claims",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "active_invoice_claims",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "active_invoice_claims",
      "column_name": "invoice_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "active_invoice_claims",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "advisor_attendance",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "advisor_attendance",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "advisor_attendance",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "advisor_attendance",
      "column_name": "user_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "advisor_attendance",
      "column_name": "date",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "advisor_attendance",
      "column_name": "present",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "alembic_version",
      "column_name": "version_num",
      "data_type": "character varying",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "approvals",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "approvals",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "approvals",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "approvals",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "approvals",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "approvals",
      "column_name": "approved_by",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "approvals",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "approvals",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_call_logs",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_call_logs",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_call_logs",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_call_logs",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "booking_call_logs",
      "column_name": "booking_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_call_logs",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_call_logs",
      "column_name": "called_by",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_call_logs",
      "column_name": "called_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_limits",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_limits",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_limits",
      "column_name": "booking_date",
      "data_type": "date",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_limits",
      "column_name": "service_work_capacity",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "10",
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_limits",
      "column_name": "general_checkup_followup_capacity",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "10",
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_limits",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_limits",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_limits",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "booking_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "booking_date",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "approved_by",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_capacity_overrides",
      "column_name": "approved_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "booking_events",
      "column_name": "booking_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "kind",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "actor_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "previous_booking_date",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "booking_events",
      "column_name": "booking_date",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "bookings",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "customer_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "vehicle_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "booking_date",
      "data_type": "date",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "service_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "arrival_window",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "requested_work",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'BOOKED'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "visit_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "arrived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "confirmed_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "rescheduled_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "cancelled_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "no_show_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "reschedule_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "cancellation_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "no_show_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "bookings",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branch_settings",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branch_settings",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branch_settings",
      "column_name": "settings",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": "'{}'::jsonb",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branch_settings",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branch_settings",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branches",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branches",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branches",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branches",
      "column_name": "is_primary",
      "data_type": "boolean",
      "is_nullable": "NO",
      "column_default": "false",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "branches",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "car_segments",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "car_segments",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "car_segments",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "car_segments",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "car_segments",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "car_segments",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'ACTIVE'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "car_segments",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "car_segments",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "catalogue_items",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "sku",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "category",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "unit",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "low_stock_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "selling_price",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "archived_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "stock_qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "catalogue_items",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "command_receipts",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "command_receipts",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "command_receipts",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "command_receipts",
      "column_name": "operation",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "command_receipts",
      "column_name": "request_key",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "command_receipts",
      "column_name": "payload_sha256",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "command_receipts",
      "column_name": "response",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "command_receipts",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "credit_notes",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "invoice_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "issued_document_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "amount_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "credit_notes",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "customers",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "mobile",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'Individual'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "address",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "archived_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "customers",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "database_sessions",
      "column_name": "token_hash",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "database_sessions",
      "column_name": "csrf_hash",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "database_sessions",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "database_sessions",
      "column_name": "user_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "database_sessions",
      "column_name": "membership_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "database_sessions",
      "column_name": "expires_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "database_sessions",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "invoice_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "gate_pass_document_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "delivered_by",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "final_odometer",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "acknowledgement",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "handover_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "delivery_acknowledgements",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_rows",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_rows",
      "column_name": "source_table",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_rows",
      "column_name": "source_id",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_rows",
      "column_name": "target_id",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_rows",
      "column_name": "payload",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_rows",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_runs",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_runs",
      "column_name": "source_sha256",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_runs",
      "column_name": "import_version",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_runs",
      "column_name": "source_counts",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_runs",
      "column_name": "mapped_counts",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "demo_import_runs",
      "column_name": "imported_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_sequences",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_sequences",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_sequences",
      "column_name": "document_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_sequences",
      "column_name": "fiscal_year",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_sequences",
      "column_name": "next_value",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "document_snapshots",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "source_kind",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "source_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "snapshot_version",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "template_version_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "values",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "html",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "asset_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "availability",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'UNAVAILABLE'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "document_snapshots",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "estimate_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "outcome",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "channel",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "decided_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_decisions",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "estimate_lines",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "estimate_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "line_no",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "kind",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "description",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "quantity",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "gst_type",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "archived_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "archived_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "task_list_item_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimate_lines",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "estimates",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "revision",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "discount",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "18",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "approved_snapshot",
      "data_type": "jsonb",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "superseded_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "superseded_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "approval_note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "archived_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "archived_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "estimates",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "work_update_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "filename",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "content_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "size_bytes",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "sha256",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "content",
      "data_type": "bytea",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "uploaded_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "category",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'work_evidence'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "evidence_attachments",
      "column_name": "caption",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "financial_document_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "document_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "event_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "related_document_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_document_events",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "financial_documents",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "document_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "fiscal_year",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "sequence_value",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "document_no",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "template_version",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "snapshot",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "rendered_html",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "artifact",
      "data_type": "bytea",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "content_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'text/html'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "sha256",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "predecessor_document_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "issued_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "financial_documents",
      "column_name": "issued_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "followups",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "due_at",
      "data_type": "date",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'OPEN'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "outcome",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "completed_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "completed_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "archived_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "version",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "followups",
      "column_name": "done",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "source_sha256",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "source_table",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "source_key",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "row_sha256",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "target_table",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "target_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "payload",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "disposition",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "import_source_records",
      "column_name": "exception",
      "data_type": "jsonb",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "invoice_lines",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "invoice_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "line_no",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "description",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "quantity",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "unit_amount_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "gst_rate_bps",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "taxable_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "tax_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "total_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "kind",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "rate",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "gst_type",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "material_row_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "archived_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "archived_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoice_lines",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "invoices",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "issued_document_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "replaces_invoice_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "subtotal_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "discount_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "tax_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "total_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "invoice_no",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "tally_invoice_no",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "discount",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": "18",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "subtotal",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "gst_amount",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "total",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "notes",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "document_available",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "document_generated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "voided_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "void_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "invoices",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "purchase_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "original_name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "mime_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "byte_size",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "storage_key",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "document_url",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "uploaded_by",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_attachments",
      "column_name": "uploaded_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "purchase_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "kind",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "actor_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_events",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "purchase_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "received_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "unit_cost",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "discount",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "subtotal",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "gst_amount",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "total",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_lines",
      "column_name": "purchase_order_line_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "revision_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "received_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "unit_cost",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "discount",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "subtotal",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "gst_amount",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "column_name": "total",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "purchase_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "revision_no",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "revised_by",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchase_revisions",
      "column_name": "revised_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "inward_purchases",
      "column_name": "supplier_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "supplier_invoice_no",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "invoice_date",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "po_number",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'Draft'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "subtotal",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "discount_total",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "gst_total",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "total",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "created_by",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "submitted_by",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "submitted_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "purchase_order_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "approved_by",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "inward_purchases",
      "column_name": "approved_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "department_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "department_name",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "manager_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "manager_name",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "advisor_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "advisor_name",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "action",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_assignment_history",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "job_cards",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "job_no",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "visit_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "advisor_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "work_list",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "promised_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "department_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "responsible_manager_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "assignment_state",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'LEGACY'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "estimated_delivery",
      "data_type": "date",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "technician_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "sub_status",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "qc_status",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "washing_needed",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "closed_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "service_type",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "pickup_drop",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "damage_marks",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "damage_marks_recorded_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "archived_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "advisor_notes",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "customer_instructions",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "internal_instructions",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "delivery_by",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "final_km",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "acknowledgement",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_cards",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "stage",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "cycle_number",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "started_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "completed_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_cycles",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "cycle_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "item_key",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "label",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "sort_order",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "required",
      "data_type": "boolean",
      "is_nullable": "NO",
      "column_default": "true",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "checked_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "checked_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "na_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "na_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "started_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "completed_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "legacy_checked_by",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_checklist_items",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "job_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "command",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "from_status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "to_status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_events",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "job_media",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "label",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "category",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "src",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "mime_type",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "byte_size",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "original_name",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "width",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "height",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_media",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "catalogue_item_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "base_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "done",
      "data_type": "boolean",
      "is_nullable": "NO",
      "column_default": "false",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "job_service_tasks",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "invoice_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "gate_pass_no",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "voided_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "void_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_gate_passes",
      "column_name": "native_document_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "invoice_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "kind",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "by_user",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "old_total",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "new_total",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_invoice_events",
      "column_name": "detail",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "main_status",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "sub_status",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_job_status_history",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "direction",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_material_movements",
      "column_name": "legacy_job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "invoice_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "receipt_no",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "voided_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "void_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "legacy_receipts",
      "column_name": "native_document_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "local_purchases",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "item_description",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "quantity",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "unit",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "unit_cost",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "vendor",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "bill_reference",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "archived_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "archived_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "local_purchases",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "material_approval_events",
      "column_name": "approval_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "action",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "actor_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approval_events",
      "column_name": "revision",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "material_approvals",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "submitted_by",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "submitted_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "reviewed_by",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "reviewed_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "rejection_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_approvals",
      "column_name": "revision",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "material_events",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "material_row_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "kind",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "by_user",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "old_item_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "old_qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "new_item_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_events",
      "column_name": "new_qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "material_ledger",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "reservation_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "entry_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "quantity",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 3,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_ledger",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "item_name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "quantity",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "unit",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'Pending'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "mapped_inventory_item_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "material_request_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "local_purchase_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "completed_by",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "completed_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_purchase_requests",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "material_requests",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "requested_qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "issued_qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "used_qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "returned_qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "wasted_qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'Requested'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "invoiced_in",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "archived_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "archived_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_requests",
      "column_name": "reservation_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "material_reservations",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "reserved_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 3,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_reservations",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "material_shortages",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "requested_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 3,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "available_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 3,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "shortage_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 3,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "material_shortages",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "membership_branches",
      "column_name": "membership_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "membership_branches",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "membership_branches",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "membership_roles",
      "column_name": "membership_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "membership_roles",
      "column_name": "role_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "membership_roles",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "storage_key",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "sha256",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "mime_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "byte_size",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "state",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'STAGED'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "object_assets",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "event_key",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "kind",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "payload",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'PENDING'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "attempts",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "next_attempt_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "outbox_events",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "payments",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "invoice_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "receipt_document_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "amount_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "method",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "reference",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "payer",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "supporting_filename",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "supporting_content_type",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "supporting_artifact",
      "data_type": "bytea",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "supporting_sha256",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "received_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "received_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "amount",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "mode",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "other_detail",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "notes",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "voided_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "void_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "payments",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "plan",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "agreed_price",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 12,
      "numeric_scale": 2,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "currency",
      "data_type": "character",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "billing_cycle",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "renewal_date",
      "data_type": "date",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "due_date",
      "data_type": "date",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "payment_status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "internal_notes",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_billing",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "cognito_subject",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "display_name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "email",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'ACTIVE'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "active_membership_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "platform_users",
      "column_name": "password_hash",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "purchase_order_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "purchase_order_line_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "accepted_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "rejected_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 3,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "rejection_reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "confirmed_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "confirmed_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "column_name": "receipt_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "column_name": "purchase_order_line_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "column_name": "delivered_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "purchase_order_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "received_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "received_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "purchase_order_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "line_no",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "ordered_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "unit_cost",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "discount",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "source_purchase_order_line_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_lines",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "purchase_order_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "purchase_order_line_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "supplier_name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "quote_date",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "quoted_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "unit_cost",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "notes",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "created_by",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_order_quotations",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_orders",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "supplier_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "po_number",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "order_date",
      "data_type": "date",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "notes",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "source_purchase_order_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_orders",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_events",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_request_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_events",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_events",
      "column_name": "purchase_request_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_events",
      "column_name": "command",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_events",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_events",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_events",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "purchase_request_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "line_no",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "new_item_name",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "unit",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "ordered_qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 3,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_lines",
      "column_name": "material_shortage_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "column_name": "purchase_request_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "column_name": "purchase_order_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "purchase_request_line_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "supplier_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "unit_cost",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 2,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_request_quotes",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "purchase_requests",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "request_number",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "source_reference",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "notes",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "requested_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "approved_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "purchase_requests",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "qc_checks",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "label",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "required",
      "data_type": "boolean",
      "is_nullable": "NO",
      "column_default": "true",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'PENDING'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "passed",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "fail_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "archived_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_checks",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_results",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "qc_results",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_results",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_results",
      "column_name": "qc_check_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_results",
      "column_name": "outcome",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_results",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_results",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "qc_results",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "quotation_lines",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "quotation_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "line_no",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "kind",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'Service'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "description",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "quantity",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotation_lines",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "quotations",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "lead_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "quotation_no",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'DRAFT'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "valid_until",
      "data_type": "date",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "customer_notes",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "discount",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "subtotal",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "gst_amount",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "total",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "template_id",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "template_html",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "document_snapshot",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": "'{}'::jsonb",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "quotations",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "refunds",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "credit_note_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "amount_paise",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "method",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "reference",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "request_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "refunds",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "report_template_versions",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "report_template_versions",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "report_template_versions",
      "column_name": "template_key",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "report_template_versions",
      "column_name": "version",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "report_template_versions",
      "column_name": "category",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "report_template_versions",
      "column_name": "definition",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "report_template_versions",
      "column_name": "active",
      "data_type": "boolean",
      "is_nullable": "NO",
      "column_default": "false",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "report_template_versions",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "report_template_versions",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "role_permissions",
      "column_name": "role_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "role_permissions",
      "column_name": "permission",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "sales_leads",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "display_name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "phone",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "company",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "email",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "address",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "service_interest",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "notes",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "stage",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'NEW'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "temperature",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'WARM'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "follow_up_due",
      "data_type": "date",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "site_visit_completed",
      "data_type": "boolean",
      "is_nullable": "NO",
      "column_default": "false",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "site_visit_date",
      "data_type": "date",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "company_not_entered",
      "data_type": "boolean",
      "is_nullable": "NO",
      "column_default": "false",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "email_not_entered",
      "data_type": "boolean",
      "is_nullable": "NO",
      "column_default": "false",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "sales_leads",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_advisor_teams",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_advisor_teams",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_advisor_teams",
      "column_name": "department_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_advisor_teams",
      "column_name": "manager_membership_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_advisor_teams",
      "column_name": "advisor_membership_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_advisor_teams",
      "column_name": "assigned_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_advisor_teams",
      "column_name": "assigned_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_advisor_teams",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_brands",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_brands",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_brands",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_brands",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "service_brands",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_brands",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'ACTIVE'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_brands",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_brands",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_department_managers",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_department_managers",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_department_managers",
      "column_name": "department_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_department_managers",
      "column_name": "manager_membership_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_department_managers",
      "column_name": "appointed_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_department_managers",
      "column_name": "appointed_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_department_managers",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'ACTIVE'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_departments",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "description",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "gst_rate",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "18",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'ACTIVE'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "department_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "brand_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "car_segment_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "service_task_catalog",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "stock_inwards",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "purchase_order_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "purchase_order_line_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "qty",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "unit_cost",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": 14,
      "numeric_scale": 2,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "received_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "received_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "delivery_confirmation_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "ledger_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_inwards",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "stock_ledger",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "item_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "inward_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "entry_type",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "quantity",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 14,
      "numeric_scale": 3,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "unit_cost",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": 14,
      "numeric_scale": 2,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "material_ledger_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "material_row_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "qty",
      "data_type": "numeric",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "type",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "by_user",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "note",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "inward_purchase_line_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "legacy_job_card_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "legacy_material_row_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "stock_ledger",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "superadmins",
      "column_name": "user_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "superadmins",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "suppliers",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "mobile",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "email",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "address",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "archived_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "contact_name",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "phone",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "gstin",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "suppliers",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "support_emulations",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "support_emulations",
      "column_name": "superadmin_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "support_emulations",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "support_emulations",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'ACTIVE'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "support_emulations",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "support_emulations",
      "column_name": "started_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "support_emulations",
      "column_name": "ended_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "support_emulations",
      "column_name": "ended_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "technician_tasks",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "assigned_to",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "title",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "notes",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'PENDING'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "completed_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "ui_status",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "archived_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "archived_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "started_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "paused_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "technician_tasks",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_admin_invitations",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_admin_invitations",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_admin_invitations",
      "column_name": "membership_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_admin_invitations",
      "column_name": "email",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_admin_invitations",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'PENDING'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_admin_invitations",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_admin_invitations",
      "column_name": "accepted_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_admin_invitations",
      "column_name": "last_sent_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_audit_events",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_audit_events",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_audit_events",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_audit_events",
      "column_name": "action",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_audit_events",
      "column_name": "reason",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_audit_events",
      "column_name": "before_value",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": "'{}'::jsonb",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_audit_events",
      "column_name": "after_value",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": "'{}'::jsonb",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_audit_events",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_memberships",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_memberships",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_memberships",
      "column_name": "user_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_memberships",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'INVITED'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_memberships",
      "column_name": "version",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_memberships",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_memberships",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "'ACTIVE'::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "version",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "description",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "system_key",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_roles",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_settings",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_settings",
      "column_name": "settings",
      "data_type": "jsonb",
      "is_nullable": "NO",
      "column_default": "'{}'::jsonb",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_settings",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenant_settings",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenants",
      "column_name": "id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenants",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenants",
      "column_name": "lifecycle_state",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenants",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "tenants",
      "column_name": "code",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "vehicles",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "customer_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "number",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "make",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "model",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "color",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "km",
      "data_type": "integer",
      "is_nullable": "NO",
      "column_default": "0",
      "numeric_precision": 32,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "engine_no",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "archived_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "created_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "updated_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "vehicles",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "visits",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "customer_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "vehicle_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "advisor_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "received_by",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "received_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "fuel",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "odo_reading",
      "data_type": "numeric",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "fuel_level_value",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "fuel_level_unit",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "keys",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "accessories",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "requested_work",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "photos_note",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": "''::text",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "archived_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "archived_by",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "archive_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "updated_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "visits",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "work_updates",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "ALWAYS"
    },
    {
      "table_name": "work_updates",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "work_updates",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "work_updates",
      "column_name": "job_card_id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "work_updates",
      "column_name": "task_id",
      "data_type": "bigint",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "work_updates",
      "column_name": "body",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "work_updates",
      "column_name": "status",
      "data_type": "text",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "work_updates",
      "column_name": "actor_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "work_updates",
      "column_name": "created_at",
      "data_type": "timestamp with time zone",
      "is_nullable": "NO",
      "column_default": "now()",
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "tenant_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "branch_id",
      "data_type": "uuid",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "version",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": "1",
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "id",
      "data_type": "bigint",
      "is_nullable": "NO",
      "column_default": null,
      "numeric_precision": 64,
      "numeric_scale": 0,
      "is_identity": "YES",
      "identity_generation": "BY DEFAULT"
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "email",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "name",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "role",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "archived_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "archived_reason",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "created_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "updated_at",
      "data_type": "text",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    },
    {
      "table_name": "workshop_user_profiles",
      "column_name": "platform_user_id",
      "data_type": "uuid",
      "is_nullable": "YES",
      "column_default": null,
      "numeric_precision": null,
      "numeric_scale": null,
      "is_identity": "NO",
      "identity_generation": null
    }
  ],
  "constraints": [
    {
      "table_name": "active_invoice_claims",
      "conname": "active_invoice_claims_invoice_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "active_invoice_claims",
      "conname": "active_invoice_claims_invoice_id_key",
      "contype": "u",
      "definition": "UNIQUE (invoice_id)",
      "convalidated": true
    },
    {
      "table_name": "active_invoice_claims",
      "conname": "active_invoice_claims_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "active_invoice_claims",
      "conname": "active_invoice_claims_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (job_card_id)",
      "convalidated": true
    },
    {
      "table_name": "active_invoice_claims",
      "conname": "active_invoice_claims_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "active_invoice_claims",
      "conname": "active_invoice_claims_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "advisor_attendance",
      "conname": "advisor_attendance_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id, branch_id, user_id, date)",
      "convalidated": true
    },
    {
      "table_name": "advisor_attendance",
      "conname": "s4b_ck_advisor_attendance_present",
      "contype": "c",
      "definition": "CHECK ((present = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
      "convalidated": true
    },
    {
      "table_name": "advisor_attendance",
      "conname": "s4b_ck_advisor_attendance_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "advisor_attendance",
      "conname": "s4b_fk_advisor_attendance_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "advisor_attendance",
      "conname": "s4b_fk_advisor_attendance_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "advisor_attendance",
      "conname": "s4b_fk_advisor_attendance_tenant_id_branch_id_user_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, user_id) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "alembic_version",
      "conname": "alembic_version_pkc",
      "contype": "p",
      "definition": "PRIMARY KEY (version_num)",
      "convalidated": true
    },
    {
      "table_name": "approvals",
      "conname": "approvals_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "approvals",
      "conname": "s4b_ck_approvals_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "approvals",
      "conname": "s4b_fk_approvals_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "approvals",
      "conname": "s4b_fk_approvals_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "approvals",
      "conname": "s4b_fk_approvals_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "approvals",
      "conname": "s4b_uk_approvals_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "booking_call_logs",
      "conname": "booking_call_logs_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "booking_call_logs",
      "conname": "s4b_ck_booking_call_logs_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "booking_call_logs",
      "conname": "s4b_fk_booking_call_logs_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_call_logs",
      "conname": "s4b_fk_booking_call_logs_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_call_logs",
      "conname": "s4b_fk_booking_call_logs_tenant_id_branch_id_booking_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, booking_id) REFERENCES bookings(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_call_logs",
      "conname": "s4b_fk_booking_call_logs_tenant_id_branch_id_called_by",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, called_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_call_logs",
      "conname": "s4b_uk_booking_call_logs_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_limits",
      "conname": "booking_capacity_limits_general_checkup_followup_capacity_check",
      "contype": "c",
      "definition": "CHECK ((general_checkup_followup_capacity >= 0))",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_limits",
      "conname": "booking_capacity_limits_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id, branch_id, booking_date)",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_limits",
      "conname": "booking_capacity_limits_service_work_capacity_check",
      "contype": "c",
      "definition": "CHECK ((service_work_capacity >= 0))",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_limits",
      "conname": "booking_capacity_limits_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_limits",
      "conname": "booking_capacity_limits_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_limits",
      "conname": "booking_capacity_limits_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_limits",
      "conname": "s4b_ck_booking_capacity_limits_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_overrides",
      "conname": "booking_capacity_overrides_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_overrides",
      "conname": "s4b_ck_booking_capacity_overrides_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_overrides",
      "conname": "s4b_fk_booking_capacity_overrides_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_overrides",
      "conname": "s4b_fk_booking_capacity_overrides_tenant_id_br_3f67f151c34f",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, approved_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_overrides",
      "conname": "s4b_fk_booking_capacity_overrides_tenant_id_br_814822f65a6f",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, booking_id) REFERENCES bookings(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_overrides",
      "conname": "s4b_fk_booking_capacity_overrides_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_capacity_overrides",
      "conname": "s4b_uk_booking_capacity_overrides_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "booking_events",
      "conname": "booking_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "booking_events",
      "conname": "s4b_ck_booking_events_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "booking_events",
      "conname": "s4b_fk_booking_events_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_events",
      "conname": "s4b_fk_booking_events_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_events",
      "conname": "s4b_fk_booking_events_tenant_id_branch_id_actor_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, actor_id) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_events",
      "conname": "s4b_fk_booking_events_tenant_id_branch_id_booking_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, booking_id) REFERENCES bookings(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "booking_events",
      "conname": "s4b_uk_booking_events_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_job_card_id_key",
      "contype": "u",
      "definition": "UNIQUE (job_card_id)",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_requested_work_check",
      "contype": "c",
      "definition": "CHECK ((btrim(requested_work) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_service_type_check",
      "contype": "c",
      "definition": "CHECK ((service_type = ANY (ARRAY['Service Work'::text, 'General Checkup / Follow-up'::text])))",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['BOOKED'::text, 'CONFIRMED'::text, 'RESCHEDULED'::text, 'ARRIVED'::text, 'CANCELLED'::text, 'NO_SHOW'::text])))",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_tenant_id_branch_id_customer_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES customers(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_tenant_id_branch_id_vehicle_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES vehicles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_visit_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "bookings_visit_id_key",
      "contype": "u",
      "definition": "UNIQUE (visit_id)",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "s4b_ck_bookings_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "bookings",
      "conname": "s4b_uk_bookings_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "branch_settings",
      "conname": "branch_settings_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id, branch_id)",
      "convalidated": true
    },
    {
      "table_name": "branch_settings",
      "conname": "branch_settings_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "branch_settings",
      "conname": "branch_settings_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "branches",
      "conname": "branches_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "branches",
      "conname": "branches_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "branches",
      "conname": "branches_tenant_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "branches",
      "conname": "branches_tenant_id_name_key",
      "contype": "u",
      "definition": "UNIQUE NULLS NOT DISTINCT (tenant_id, name)",
      "convalidated": true
    },
    {
      "table_name": "car_segments",
      "conname": "car_segments_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "car_segments",
      "conname": "s4b_ck_car_segments_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "car_segments",
      "conname": "s4b_fk_car_segments_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "car_segments",
      "conname": "s4b_fk_car_segments_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "car_segments",
      "conname": "s4b_uk_car_segments_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_archived_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (archived_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_low_stock_qty_check",
      "contype": "c",
      "definition": "CHECK ((low_stock_qty >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_name_check",
      "contype": "c",
      "definition": "CHECK ((btrim(name) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_selling_price_check",
      "contype": "c",
      "definition": "CHECK ((selling_price >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_sku_check",
      "contype": "c",
      "definition": "CHECK ((btrim(sku) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_unit_check",
      "contype": "c",
      "definition": "CHECK ((btrim(unit) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "catalogue_items_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "catalogue_items",
      "conname": "s4b_ck_catalogue_items_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "command_receipts",
      "conname": "command_receipts_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id, branch_id, operation, request_key)",
      "convalidated": true
    },
    {
      "table_name": "command_receipts",
      "conname": "s4b_ck_command_receipts_hash",
      "contype": "c",
      "definition": "CHECK ((payload_sha256 ~ '^[0-9a-f]{64}$'::text))",
      "convalidated": true
    },
    {
      "table_name": "command_receipts",
      "conname": "s4b_fk_command_receipts_actor_id",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "command_receipts",
      "conname": "s4b_fk_command_receipts_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "command_receipts",
      "conname": "s4b_fk_command_receipts_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_amount_paise_check",
      "contype": "c",
      "definition": "CHECK ((amount_paise > 0))",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_invoice_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_invoice_id_request_key_key",
      "contype": "u",
      "definition": "UNIQUE (invoice_id, request_key)",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_issued_document_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (issued_document_id) REFERENCES financial_documents(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_issued_document_id_key",
      "contype": "u",
      "definition": "UNIQUE (issued_document_id)",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_reason_check",
      "contype": "c",
      "definition": "CHECK ((btrim(reason) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "credit_notes",
      "conname": "credit_notes_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_archived_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (archived_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_mobile_check",
      "contype": "c",
      "definition": "CHECK ((btrim(mobile) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_name_check",
      "contype": "c",
      "definition": "CHECK ((btrim(name) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_type_check",
      "contype": "c",
      "definition": "CHECK ((btrim(type) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "customers_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "customers",
      "conname": "s4b_ck_customers_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "database_sessions",
      "conname": "database_sessions_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (membership_id) REFERENCES tenant_memberships(id) ON DELETE CASCADE",
      "convalidated": true
    },
    {
      "table_name": "database_sessions",
      "conname": "database_sessions_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (token_hash)",
      "convalidated": true
    },
    {
      "table_name": "database_sessions",
      "conname": "database_sessions_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE",
      "convalidated": true
    },
    {
      "table_name": "database_sessions",
      "conname": "database_sessions_tenant_id_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, membership_id) REFERENCES tenant_memberships(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "database_sessions",
      "conname": "database_sessions_user_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (user_id) REFERENCES platform_users(id) ON DELETE CASCADE",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_acknowledgement_check",
      "contype": "c",
      "definition": "CHECK ((length(btrim(acknowledgement)) > 0))",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_delivered_by_check",
      "contype": "c",
      "definition": "CHECK ((length(btrim(delivered_by)) > 0))",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_final_odometer_check",
      "contype": "c",
      "definition": "CHECK ((final_odometer >= 0))",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_gate_pass_document_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (gate_pass_document_id) REFERENCES financial_documents(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_gate_pass_document_id_key",
      "contype": "u",
      "definition": "UNIQUE (gate_pass_document_id)",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_invoice_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_job_card_id_key",
      "contype": "u",
      "definition": "UNIQUE (job_card_id)",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_job_card_id_request_key_key",
      "contype": "u",
      "definition": "UNIQUE (job_card_id, request_key)",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "delivery_acknowledgements",
      "conname": "delivery_acknowledgements_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "demo_import_rows",
      "conname": "demo_import_rows_branch_fk",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "demo_import_rows",
      "conname": "demo_import_rows_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id, source_table, source_id)",
      "convalidated": true
    },
    {
      "table_name": "demo_import_rows",
      "conname": "demo_import_rows_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "demo_import_runs",
      "conname": "demo_import_runs_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id)",
      "convalidated": true
    },
    {
      "table_name": "demo_import_runs",
      "conname": "demo_import_runs_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "document_sequences",
      "conname": "document_sequences_document_type_check",
      "contype": "c",
      "definition": "CHECK ((document_type = ANY (ARRAY['INVOICE'::text, 'RECEIPT'::text, 'GATE_PASS'::text, 'CREDIT_NOTE'::text])))",
      "convalidated": true
    },
    {
      "table_name": "document_sequences",
      "conname": "document_sequences_fiscal_year_check",
      "contype": "c",
      "definition": "CHECK ((fiscal_year ~ '^FY[0-9]{4}-[0-9]{2}$'::text))",
      "convalidated": true
    },
    {
      "table_name": "document_sequences",
      "conname": "document_sequences_next_value_check",
      "contype": "c",
      "definition": "CHECK ((next_value > 0))",
      "convalidated": true
    },
    {
      "table_name": "document_sequences",
      "conname": "document_sequences_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id, branch_id, document_type, fiscal_year)",
      "convalidated": true
    },
    {
      "table_name": "document_sequences",
      "conname": "document_sequences_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "document_sequences",
      "conname": "document_sequences_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "document_snapshots_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "s4b_ck_document_snapshots_availability",
      "contype": "c",
      "definition": "CHECK (((availability = ANY (ARRAY['UNAVAILABLE'::text, 'READY'::text])) AND ((availability <> 'READY'::text) OR (html IS NOT NULL) OR (asset_id IS NOT NULL))))",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "s4b_ck_document_snapshots_version",
      "contype": "c",
      "definition": "CHECK ((snapshot_version > 0))",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "s4b_fk_document_snapshots_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "s4b_fk_document_snapshots_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "s4b_fk_document_snapshots_tenant_id_branch_id_asset_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, asset_id) REFERENCES object_assets(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "s4b_fk_document_snapshots_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "s4b_fk_document_snapshots_tenant_id_template_version_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, template_version_id) REFERENCES report_template_versions(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "document_snapshots",
      "conname": "s4b_uk_document_snapshots_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "estimate_decisions",
      "conname": "estimate_decisions_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimate_decisions",
      "conname": "estimate_decisions_channel_check",
      "contype": "c",
      "definition": "CHECK ((channel = ANY (ARRAY['in_person'::text, 'phone'::text, 'whatsapp'::text, 'email'::text, 'other'::text])))",
      "convalidated": true
    },
    {
      "table_name": "estimate_decisions",
      "conname": "estimate_decisions_estimate_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimate_decisions",
      "conname": "estimate_decisions_estimate_id_key",
      "contype": "u",
      "definition": "UNIQUE (estimate_id)",
      "convalidated": true
    },
    {
      "table_name": "estimate_decisions",
      "conname": "estimate_decisions_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimate_decisions",
      "conname": "estimate_decisions_outcome_check",
      "contype": "c",
      "definition": "CHECK ((outcome = ANY (ARRAY['approved'::text, 'declined'::text])))",
      "convalidated": true
    },
    {
      "table_name": "estimate_decisions",
      "conname": "estimate_decisions_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "estimate_decisions",
      "conname": "estimate_decisions_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_description_check",
      "contype": "c",
      "definition": "CHECK ((btrim(description) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_estimate_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_estimate_id_line_no_key",
      "contype": "u",
      "definition": "UNIQUE (estimate_id, line_no)",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_gst_rate_check",
      "contype": "c",
      "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_kind_check",
      "contype": "c",
      "definition": "CHECK ((btrim(kind) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_line_no_check",
      "contype": "c",
      "definition": "CHECK ((line_no > 0))",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_quantity_check",
      "contype": "c",
      "definition": "CHECK ((quantity > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_rate_check",
      "contype": "c",
      "definition": "CHECK ((rate >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "estimate_lines_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "s4b_ck_estimate_lines_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "estimate_lines",
      "conname": "s4b_fk_estimate_lines_tenant_id_branch_id_task_list_item_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, task_list_item_id) REFERENCES job_service_tasks(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_discount_check",
      "contype": "c",
      "definition": "CHECK ((discount >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_gst_rate_check",
      "contype": "c",
      "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_job_card_id_revision_key",
      "contype": "u",
      "definition": "UNIQUE (job_card_id, revision)",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_revision_check",
      "contype": "c",
      "definition": "CHECK ((revision > 0))",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['DRAFT'::text, 'APPROVED'::text, 'DECLINED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_superseded_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (superseded_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "estimates_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "estimates",
      "conname": "s4b_ck_estimates_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_category_check",
      "contype": "c",
      "definition": "CHECK ((category = ANY (ARRAY['before_work'::text, 'after_work'::text, 'work_evidence'::text, 'qc_evidence'::text])))",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id)",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_sha256_check",
      "contype": "c",
      "definition": "CHECK ((length(sha256) = 64))",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_size_bytes_check",
      "contype": "c",
      "definition": "CHECK (((size_bytes > 0) AND (size_bytes <= 10485760)))",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_uploaded_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (uploaded_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "evidence_attachments",
      "conname": "evidence_attachments_work_update_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (work_update_id) REFERENCES work_updates(id)",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_correction_link_key",
      "contype": "u",
      "definition": "UNIQUE (document_id, event_type, related_document_id)",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_document_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (document_id) REFERENCES financial_documents(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_document_id_request_key_key",
      "contype": "u",
      "definition": "UNIQUE (document_id, request_key)",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_event_type_check",
      "contype": "c",
      "definition": "CHECK ((event_type = ANY (ARRAY['VOID'::text, 'REPLACED'::text, 'CREDITED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_reason_check",
      "contype": "c",
      "definition": "CHECK ((length(btrim(reason)) > 0))",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_related_document_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (related_document_id) REFERENCES financial_documents(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "financial_document_events",
      "conname": "financial_document_events_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_artifact_check",
      "contype": "c",
      "definition": "CHECK (((octet_length(artifact) > 0) AND (octet_length(artifact) <= 10485760)))",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_content_type_check",
      "contype": "c",
      "definition": "CHECK ((content_type = ANY (ARRAY['text/html'::text, 'application/pdf'::text])))",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_document_type_check",
      "contype": "c",
      "definition": "CHECK ((document_type = ANY (ARRAY['INVOICE'::text, 'RECEIPT'::text, 'GATE_PASS'::text, 'CREDIT_NOTE'::text])))",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_issued_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (issued_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_predecessor_document_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (predecessor_document_id) REFERENCES financial_documents(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_sequence_value_check",
      "contype": "c",
      "definition": "CHECK ((sequence_value > 0))",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_sha256_check",
      "contype": "c",
      "definition": "CHECK ((length(sha256) = 64))",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_tenant_id_branch_id_document_no_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, document_no)",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_tenant_id_branch_id_document_type_fisca_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, document_type, fiscal_year, sequence_value)",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "financial_documents",
      "conname": "financial_documents_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_archived_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (archived_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_completed_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (completed_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_note_check",
      "contype": "c",
      "definition": "CHECK ((btrim(note) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['OPEN'::text, 'COMPLETED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_tenant_id_branch_id_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "followups_version_check",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "followups",
      "conname": "s4b_ck_followups_done",
      "contype": "c",
      "definition": "CHECK ((done = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
      "convalidated": true
    },
    {
      "table_name": "import_source_records",
      "conname": "import_source_records_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id, source_sha256, source_table, source_key)",
      "convalidated": true
    },
    {
      "table_name": "import_source_records",
      "conname": "s4b_ck_import_source_records_disposition",
      "contype": "c",
      "definition": "CHECK (((disposition = ANY (ARRAY['MAPPED'::text, 'PRESERVED_HISTORY'::text, 'CREDENTIAL_EXCLUDED'::text, 'BLOCKED'::text])) AND ((disposition <> 'BLOCKED'::text) OR (exception IS NOT NULL))))",
      "convalidated": true
    },
    {
      "table_name": "import_source_records",
      "conname": "s4b_ck_import_source_records_hashes",
      "contype": "c",
      "definition": "CHECK (((source_sha256 ~ '^[0-9a-f]{64}$'::text) AND (row_sha256 ~ '^[0-9a-f]{64}$'::text)))",
      "convalidated": true
    },
    {
      "table_name": "import_source_records",
      "conname": "s4b_fk_import_source_records_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_description_check",
      "contype": "c",
      "definition": "CHECK ((length(btrim(description)) > 0))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_gst_rate_bps_check",
      "contype": "c",
      "definition": "CHECK (((gst_rate_bps >= 0) AND (gst_rate_bps <= 10000)))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_invoice_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_invoice_id_line_no_key",
      "contype": "u",
      "definition": "UNIQUE (invoice_id, line_no)",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_line_no_check",
      "contype": "c",
      "definition": "CHECK ((line_no > 0))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_quantity_check",
      "contype": "c",
      "definition": "CHECK ((quantity > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_tax_paise_check",
      "contype": "c",
      "definition": "CHECK ((tax_paise >= 0))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_taxable_paise_check",
      "contype": "c",
      "definition": "CHECK ((taxable_paise >= 0))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_total_paise_check",
      "contype": "c",
      "definition": "CHECK ((total_paise >= 0))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "invoice_lines_unit_amount_paise_check",
      "contype": "c",
      "definition": "CHECK ((unit_amount_paise >= 0))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "s4b_ck_invoice_lines_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "invoice_lines",
      "conname": "s4b_fk_invoice_lines_tenant_id_branch_id_material_row_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, material_row_id) REFERENCES material_requests(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_discount_paise_check",
      "contype": "c",
      "definition": "CHECK ((discount_paise >= 0))",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_issued_document_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (issued_document_id) REFERENCES financial_documents(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_issued_document_id_key",
      "contype": "u",
      "definition": "UNIQUE (issued_document_id)",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_job_card_id_request_key_key",
      "contype": "u",
      "definition": "UNIQUE (job_card_id, request_key)",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_replaces_invoice_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (replaces_invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_subtotal_paise_check",
      "contype": "c",
      "definition": "CHECK ((subtotal_paise >= 0))",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_tax_paise_check",
      "contype": "c",
      "definition": "CHECK ((tax_paise >= 0))",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "invoices_total_paise_check",
      "contype": "c",
      "definition": "CHECK ((total_paise >= 0))",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "s4b_ck_invoices_document_available",
      "contype": "c",
      "definition": "CHECK ((document_available = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "s4b_ck_invoices_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "invoices",
      "conname": "s4b_job_bdd14661fb224cb8cc0a",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, job_card_id, id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_attachments",
      "conname": "inward_purchase_attachments_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_attachments",
      "conname": "s4b_ck_inward_purchase_attachments_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_attachments",
      "conname": "s4b_fk_inward_purchase_attachments_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_attachments",
      "conname": "s4b_fk_inward_purchase_attachments_tenant_id_b_501211b52490",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_id) REFERENCES inward_purchases(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_attachments",
      "conname": "s4b_fk_inward_purchase_attachments_tenant_id_b_63722988f392",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, uploaded_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_attachments",
      "conname": "s4b_fk_inward_purchase_attachments_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_attachments",
      "conname": "s4b_uk_inward_purchase_attachments_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_events",
      "conname": "inward_purchase_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_events",
      "conname": "s4b_ck_inward_purchase_events_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_events",
      "conname": "s4b_fk_inward_purchase_events_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_events",
      "conname": "s4b_fk_inward_purchase_events_tenant_id_branch_501ec864b0bb",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_id) REFERENCES inward_purchases(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_events",
      "conname": "s4b_fk_inward_purchase_events_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_events",
      "conname": "s4b_fk_inward_purchase_events_tenant_id_branch_id_actor_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, actor_id) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_events",
      "conname": "s4b_uk_inward_purchase_events_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_lines",
      "conname": "inward_purchase_lines_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_lines",
      "conname": "s4b_ck_inward_purchase_lines_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_lines",
      "conname": "s4b_fk_inward_purchase_lines_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_lines",
      "conname": "s4b_fk_inward_purchase_lines_tenant_id_branch__711173c6bff0",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_lines",
      "conname": "s4b_fk_inward_purchase_lines_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_lines",
      "conname": "s4b_fk_inward_purchase_lines_tenant_id_branch_id_item_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_lines",
      "conname": "s4b_fk_inward_purchase_lines_tenant_id_branch_id_purchase_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_id) REFERENCES inward_purchases(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_lines",
      "conname": "s4b_uk_inward_purchase_lines_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "conname": "inward_purchase_revision_lines_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "conname": "s4b_ck_inward_purchase_revision_lines_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "conname": "s4b_fk_inward_purchase_revision_lines_tenant_i_1fafd4260b9f",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "conname": "s4b_fk_inward_purchase_revision_lines_tenant_i_2687b76ebf0c",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, revision_id) REFERENCES inward_purchase_revisions(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "conname": "s4b_fk_inward_purchase_revision_lines_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "conname": "s4b_fk_inward_purchase_revision_lines_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revision_lines",
      "conname": "s4b_uk_inward_purchase_revision_lines_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revisions",
      "conname": "inward_purchase_revisions_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revisions",
      "conname": "s4b_ck_inward_purchase_revisions_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revisions",
      "conname": "s4b_fk_inward_purchase_revisions_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revisions",
      "conname": "s4b_fk_inward_purchase_revisions_tenant_id_bra_895044419875",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_id) REFERENCES inward_purchases(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revisions",
      "conname": "s4b_fk_inward_purchase_revisions_tenant_id_bra_943066d0781f",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, revised_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revisions",
      "conname": "s4b_fk_inward_purchase_revisions_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchase_revisions",
      "conname": "s4b_uk_inward_purchase_revisions_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "inward_purchases_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_ck_inward_purchases_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_fk_inward_purchases_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_fk_inward_purchases_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_fk_inward_purchases_tenant_id_branch_id_approved_by",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, approved_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_fk_inward_purchases_tenant_id_branch_id_created_by",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, created_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_fk_inward_purchases_tenant_id_branch_id_pu_1cc450220c1c",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_fk_inward_purchases_tenant_id_branch_id_submitted_by",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, submitted_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_fk_inward_purchases_tenant_id_branch_id_supplier_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES suppliers(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "inward_purchases",
      "conname": "s4b_uk_inward_purchases_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_action_check",
      "contype": "c",
      "definition": "CHECK ((action = ANY (ARRAY['ROUTED_TO_MANAGER'::text, 'ADVISOR_ASSIGNED'::text, 'MANAGER_TRANSFERRED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_advisor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (advisor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_department_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (department_id) REFERENCES service_departments(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_manager_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (manager_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_assignment_history",
      "conname": "job_assignment_history_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_advisor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (advisor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_assignment_state_check",
      "contype": "c",
      "definition": "CHECK ((assignment_state = ANY (ARRAY['LEGACY'::text, 'AWAITING_ADVISOR_ASSIGNMENT'::text, 'ASSIGNED_TO_ADVISOR'::text])))",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_department_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (department_id) REFERENCES service_departments(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_responsible_manager_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (responsible_manager_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['NEW'::text, 'IN_PROGRESS'::text, 'HOLD'::text, 'COMPLETED'::text, 'CANCELLED'::text, 'CLOSED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_tenant_id_job_no_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, job_no)",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_visit_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "job_cards_visit_id_key",
      "contype": "u",
      "definition": "UNIQUE (visit_id)",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "s4b_ck_job_cards_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "s4b_ck_job_cards_washing_needed",
      "contype": "c",
      "definition": "CHECK ((washing_needed = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
      "convalidated": true
    },
    {
      "table_name": "job_cards",
      "conname": "s4b_fk_job_cards_tenant_id_branch_id_technician_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, technician_id) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_cycles",
      "conname": "job_checklist_cycles_cycle_number_check",
      "contype": "c",
      "definition": "CHECK ((cycle_number > 0))",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_cycles",
      "conname": "job_checklist_cycles_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_cycles",
      "conname": "job_checklist_cycles_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_cycles",
      "conname": "job_checklist_cycles_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_cycles",
      "conname": "job_checklist_cycles_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_cycles",
      "conname": "job_checklist_cycles_tenant_id_branch_id_job_card_id_stage__key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, job_card_id, stage, cycle_number)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_cycles",
      "conname": "job_checklist_cycles_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_cycles",
      "conname": "s4b_ck_job_checklist_cycles_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "job_checklist_items_checked_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (checked_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "job_checklist_items_cycle_id_item_key_key",
      "contype": "u",
      "definition": "UNIQUE (cycle_id, item_key)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "job_checklist_items_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "job_checklist_items_na_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (na_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "job_checklist_items_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "job_checklist_items_tenant_id_branch_id_cycle_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, cycle_id) REFERENCES job_checklist_cycles(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "job_checklist_items_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "job_checklist_items_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "s4b_ck_job_checklist_items_legacy_checked_by",
      "contype": "c",
      "definition": "CHECK (((legacy_checked_by IS NULL) OR (legacy_checked_by = 0)))",
      "convalidated": true
    },
    {
      "table_name": "job_checklist_items",
      "conname": "s4b_ck_job_checklist_items_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "job_events",
      "conname": "job_events_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_events",
      "conname": "job_events_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_events",
      "conname": "job_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "job_events",
      "conname": "job_events_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_events",
      "conname": "job_events_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_media",
      "conname": "job_media_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "job_media",
      "conname": "job_media_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "job_media",
      "conname": "job_media_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_media",
      "conname": "job_media_tenant_id_branch_id_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_media",
      "conname": "job_media_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "job_media",
      "conname": "job_media_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "job_media",
      "conname": "s4b_ck_job_media_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_base_rate_check",
      "contype": "c",
      "definition": "CHECK ((base_rate >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_catalogue_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (catalogue_item_id) REFERENCES service_task_catalog(id)",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_gst_rate_check",
      "contype": "c",
      "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id)",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_name_check",
      "contype": "c",
      "definition": "CHECK ((btrim(name) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "job_service_tasks_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "s4b_ck_job_service_tasks_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "job_service_tasks",
      "conname": "s4b_uk_job_service_tasks_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "legacy_gate_passes_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "s4b_ck_legacy_gate_passes_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "s4b_fk_legacy_gate_passes_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "s4b_fk_legacy_gate_passes_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "s4b_fk_legacy_gate_passes_tenant_id_branch_id__a057c7573eb4",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, native_document_id) REFERENCES financial_documents(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "s4b_fk_legacy_gate_passes_tenant_id_branch_id_invoice_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, invoice_id) REFERENCES invoices(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "s4b_job_3d9ee402d50a4e1a82a4",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, invoice_id) REFERENCES invoices(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_gate_passes",
      "conname": "s4b_uk_legacy_gate_passes_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "legacy_invoice_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "s4b_ck_legacy_invoice_events_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "s4b_fk_legacy_invoice_events_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "s4b_fk_legacy_invoice_events_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "s4b_fk_legacy_invoice_events_tenant_id_branch_id_by_user",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, by_user) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "s4b_fk_legacy_invoice_events_tenant_id_branch_id_invoice_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, invoice_id) REFERENCES invoices(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "s4b_fk_legacy_invoice_events_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "s4b_job_d57836fb7cabf406d444",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, invoice_id) REFERENCES invoices(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_invoice_events",
      "conname": "s4b_uk_legacy_invoice_events_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_job_status_history",
      "conname": "legacy_job_status_history_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_job_status_history",
      "conname": "s4b_ck_legacy_job_status_history_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "legacy_job_status_history",
      "conname": "s4b_fk_legacy_job_status_history_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_job_status_history",
      "conname": "s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_job_status_history",
      "conname": "s4b_fk_legacy_job_status_history_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_job_status_history",
      "conname": "s4b_uk_legacy_job_status_history_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_material_movements",
      "conname": "legacy_material_movements_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_material_movements",
      "conname": "s4b_ck_legacy_material_movements_legacy_job_card_id",
      "contype": "c",
      "definition": "CHECK (((legacy_job_card_id IS NULL) OR (legacy_job_card_id = 0)))",
      "convalidated": true
    },
    {
      "table_name": "legacy_material_movements",
      "conname": "s4b_ck_legacy_material_movements_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "legacy_material_movements",
      "conname": "s4b_fk_legacy_material_movements_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_material_movements",
      "conname": "s4b_fk_legacy_material_movements_tenant_id_bra_9d1a70e62bdb",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_material_movements",
      "conname": "s4b_fk_legacy_material_movements_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_material_movements",
      "conname": "s4b_fk_legacy_material_movements_tenant_id_branch_id_item_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_material_movements",
      "conname": "s4b_uk_legacy_material_movements_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "legacy_receipts_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "s4b_ck_legacy_receipts_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "s4b_fk_legacy_receipts_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "s4b_fk_legacy_receipts_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "s4b_fk_legacy_receipts_tenant_id_branch_id_invoice_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, invoice_id) REFERENCES invoices(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "s4b_fk_legacy_receipts_tenant_id_branch_id_nat_ed7918bc4f3e",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, native_document_id) REFERENCES financial_documents(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "s4b_job_85280abab948c0f7032e",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, invoice_id) REFERENCES invoices(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "legacy_receipts",
      "conname": "s4b_uk_legacy_receipts_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "local_purchases",
      "conname": "local_purchases_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "local_purchases",
      "conname": "s4b_ck_local_purchases_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "local_purchases",
      "conname": "s4b_fk_local_purchases_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "local_purchases",
      "conname": "s4b_fk_local_purchases_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "local_purchases",
      "conname": "s4b_fk_local_purchases_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "local_purchases",
      "conname": "s4b_job_f7830977d826e9a8f94f",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, job_card_id, id)",
      "convalidated": true
    },
    {
      "table_name": "local_purchases",
      "conname": "s4b_uk_local_purchases_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "material_approval_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "s4b_ck_material_approval_events_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "s4b_fk_material_approval_events_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "s4b_fk_material_approval_events_tenant_id_bran_594dba6809fa",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "s4b_fk_material_approval_events_tenant_id_bran_bf18e81a4ac1",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, approval_id) REFERENCES material_approvals(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "s4b_fk_material_approval_events_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "s4b_fk_material_approval_events_tenant_id_branch_id_actor_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, actor_id) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "s4b_job_42a5adf13bece540a211",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, approval_id) REFERENCES material_approvals(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approval_events",
      "conname": "s4b_uk_material_approval_events_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "material_approvals_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "s4b_ck_material_approvals_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "s4b_fk_material_approvals_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "s4b_fk_material_approvals_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "s4b_fk_material_approvals_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "s4b_fk_material_approvals_tenant_id_branch_id_reviewed_by",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, reviewed_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "s4b_fk_material_approvals_tenant_id_branch_id_submitted_by",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, submitted_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "s4b_job_c6ca7e3c9f00ed5449bf",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, job_card_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_approvals",
      "conname": "s4b_uk_material_approvals_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "material_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_ck_material_events_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_fk_material_events_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_fk_material_events_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_fk_material_events_tenant_id_branch_id_by_user",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, by_user) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_fk_material_events_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_fk_material_events_tenant_id_branch_id_material_row_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, material_row_id) REFERENCES material_requests(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_fk_material_events_tenant_id_branch_id_new_item_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, new_item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_fk_material_events_tenant_id_branch_id_old_item_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, old_item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_job_c219f4aabc83b6a94674",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, material_row_id) REFERENCES material_requests(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_events",
      "conname": "s4b_uk_material_events_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_entry_type_check",
      "contype": "c",
      "definition": "CHECK ((entry_type = ANY (ARRAY['RESERVE'::text, 'ISSUE'::text, 'RETURN'::text, 'WASTE'::text, 'RELEASE'::text, 'ISSUE_REVERSAL'::text])))",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_job_card_id_fkey1",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_quantity_check",
      "contype": "c",
      "definition": "CHECK ((quantity > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_reservation_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (reservation_id) REFERENCES material_reservations(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_tenant_id_branch_id_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_ledger",
      "conname": "material_ledger_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "material_purchase_requests_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_ck_material_purchase_requests_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_fk_material_purchase_requests_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_fk_material_purchase_requests_tenant_id_br_1e5cc5a56a23",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, completed_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_fk_material_purchase_requests_tenant_id_br_6534aca8d4e5",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, material_request_id) REFERENCES material_requests(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_fk_material_purchase_requests_tenant_id_br_9372efbd1a63",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, local_purchase_id) REFERENCES local_purchases(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_fk_material_purchase_requests_tenant_id_br_b653fc940da3",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, mapped_inventory_item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_fk_material_purchase_requests_tenant_id_br_f3daf2bced3a",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_fk_material_purchase_requests_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_job_1af3d8d525651d455bc0",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, material_request_id) REFERENCES material_requests(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_job_96efb2ddb955f6a75c44",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, local_purchase_id) REFERENCES local_purchases(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_purchase_requests",
      "conname": "s4b_uk_material_purchase_requests_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "material_requests_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_ck_material_requests_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_fk_material_requests_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_fk_material_requests_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_fk_material_requests_tenant_id_branch_id_invoiced_in",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, invoiced_in) REFERENCES invoices(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_fk_material_requests_tenant_id_branch_id_item_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_fk_material_requests_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_fk_material_requests_tenant_id_branch_id_reservation_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, reservation_id) REFERENCES material_reservations(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_job_1965087bc3f1a6683300",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, job_card_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_job_ebd9cfe502fe03bcd243",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, invoiced_in) REFERENCES invoices(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_requests",
      "conname": "s4b_uk_material_requests_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_job_card_id_fkey1",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_reserved_qty_check",
      "contype": "c",
      "definition": "CHECK ((reserved_qty > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['RESERVED'::text, 'PARTIALLY_ISSUED'::text, 'ISSUED'::text, 'RELEASED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_tenant_id_branch_id_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_reservations",
      "conname": "material_reservations_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_requested_qty_check",
      "contype": "c",
      "definition": "CHECK ((requested_qty > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_shortage_qty_check",
      "contype": "c",
      "definition": "CHECK ((shortage_qty > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['OPEN'::text, 'PROCURED'::text, 'CANCELLED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_tenant_id_branch_id_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "material_shortages",
      "conname": "material_shortages_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "membership_branches",
      "conname": "membership_branches_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (membership_id) REFERENCES tenant_memberships(id) ON DELETE CASCADE",
      "convalidated": true
    },
    {
      "table_name": "membership_branches",
      "conname": "membership_branches_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (membership_id, branch_id)",
      "convalidated": true
    },
    {
      "table_name": "membership_branches",
      "conname": "membership_branches_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "membership_branches",
      "conname": "membership_branches_tenant_id_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, membership_id) REFERENCES tenant_memberships(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "membership_roles",
      "conname": "membership_roles_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (membership_id) REFERENCES tenant_memberships(id) ON DELETE CASCADE",
      "convalidated": true
    },
    {
      "table_name": "membership_roles",
      "conname": "membership_roles_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (membership_id, role_id)",
      "convalidated": true
    },
    {
      "table_name": "membership_roles",
      "conname": "membership_roles_role_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (role_id) REFERENCES tenant_roles(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "membership_roles",
      "conname": "membership_roles_tenant_id_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, membership_id) REFERENCES tenant_memberships(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "membership_roles",
      "conname": "membership_roles_tenant_id_role_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, role_id) REFERENCES tenant_roles(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "object_assets",
      "conname": "object_assets_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "object_assets",
      "conname": "s4b_ck_object_assets_sha",
      "contype": "c",
      "definition": "CHECK ((sha256 ~ '^[0-9a-f]{64}$'::text))",
      "convalidated": true
    },
    {
      "table_name": "object_assets",
      "conname": "s4b_ck_object_assets_size",
      "contype": "c",
      "definition": "CHECK ((byte_size >= 0))",
      "convalidated": true
    },
    {
      "table_name": "object_assets",
      "conname": "s4b_ck_object_assets_state",
      "contype": "c",
      "definition": "CHECK ((state = ANY (ARRAY['STAGED'::text, 'READY'::text, 'RETIRED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "object_assets",
      "conname": "s4b_fk_object_assets_created_by",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "object_assets",
      "conname": "s4b_fk_object_assets_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "object_assets",
      "conname": "s4b_fk_object_assets_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "object_assets",
      "conname": "s4b_uk_object_assets_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "outbox_events",
      "conname": "outbox_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "outbox_events",
      "conname": "s4b_ck_outbox_events_attempts",
      "contype": "c",
      "definition": "CHECK ((attempts >= 0))",
      "convalidated": true
    },
    {
      "table_name": "outbox_events",
      "conname": "s4b_ck_outbox_events_status",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['PENDING'::text, 'PROCESSING'::text, 'DONE'::text, 'FAILED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "outbox_events",
      "conname": "s4b_fk_outbox_events_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "outbox_events",
      "conname": "s4b_fk_outbox_events_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "outbox_events",
      "conname": "s4b_uk_outbox_events_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_amount_paise_check",
      "contype": "c",
      "definition": "CHECK ((amount_paise > 0))",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_invoice_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_invoice_id_request_key_key",
      "contype": "u",
      "definition": "UNIQUE (invoice_id, request_key)",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_method_check",
      "contype": "c",
      "definition": "CHECK ((method = ANY (ARRAY['CASH'::text, 'CARD'::text, 'UPI'::text, 'BANK_TRANSFER'::text, 'OTHER'::text])))",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_receipt_document_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (receipt_document_id) REFERENCES financial_documents(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_receipt_document_id_key",
      "contype": "u",
      "definition": "UNIQUE (receipt_document_id)",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_received_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (received_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_supporting_artifact_check",
      "contype": "c",
      "definition": "CHECK (((supporting_artifact IS NULL) OR (octet_length(supporting_artifact) <= 10485760)))",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_supporting_content_type_check",
      "contype": "c",
      "definition": "CHECK (((supporting_content_type IS NULL) OR (supporting_content_type = ANY (ARRAY['image/jpeg'::text, 'image/png'::text, 'application/pdf'::text]))))",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_supporting_sha256_check",
      "contype": "c",
      "definition": "CHECK (((supporting_sha256 IS NULL) OR (length(supporting_sha256) = 64)))",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "payments_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "s4b_ck_payments_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "payments",
      "conname": "s4b_fk_payments_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "platform_billing",
      "conname": "platform_billing_agreed_price_check",
      "contype": "c",
      "definition": "CHECK ((agreed_price >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "platform_billing",
      "conname": "platform_billing_billing_cycle_check",
      "contype": "c",
      "definition": "CHECK ((billing_cycle = ANY (ARRAY['monthly'::text, 'quarterly'::text, 'annual'::text])))",
      "convalidated": true
    },
    {
      "table_name": "platform_billing",
      "conname": "platform_billing_payment_status_check",
      "contype": "c",
      "definition": "CHECK ((payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'overdue'::text, 'waived'::text])))",
      "convalidated": true
    },
    {
      "table_name": "platform_billing",
      "conname": "platform_billing_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id)",
      "convalidated": true
    },
    {
      "table_name": "platform_billing",
      "conname": "platform_billing_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "platform_billing",
      "conname": "platform_billing_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "platform_users",
      "conname": "platform_users_active_membership_fk",
      "contype": "f",
      "definition": "FOREIGN KEY (active_membership_id) REFERENCES tenant_memberships(id) ON DELETE SET NULL",
      "convalidated": true
    },
    {
      "table_name": "platform_users",
      "conname": "platform_users_cognito_subject_key",
      "contype": "u",
      "definition": "UNIQUE (cognito_subject)",
      "convalidated": true
    },
    {
      "table_name": "platform_users",
      "conname": "platform_users_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "platform_users",
      "conname": "platform_users_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ARCHIVED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_conf_tenant_id_branch_id_purchase_fkey1",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confi_purchase_order_id_purchase_or_key",
      "contype": "u",
      "definition": "UNIQUE (purchase_order_id, purchase_order_line_id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confi_tenant_id_branch_id_purchase_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmation_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmations_accepted_qty_check",
      "contype": "c",
      "definition": "CHECK ((accepted_qty >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmations_check",
      "contype": "c",
      "definition": "CHECK (((accepted_qty + rejected_qty) > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmations_confirmed_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (confirmed_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmations_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmations_rejected_qty_check",
      "contype": "c",
      "definition": "CHECK ((rejected_qty >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmations_request_key_check",
      "contype": "c",
      "definition": "CHECK ((btrim(request_key) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmations_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "purchase_order_delivery_confirmations_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_confirmations",
      "conname": "s4b_ck_purchase_order_delivery_confirmations_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "purchase_order_delivery_rece_tenant_id_branch_id_purchase_fkey1",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "purchase_order_delivery_recei_receipt_id_purchase_order_lin_key",
      "contype": "u",
      "definition": "UNIQUE (receipt_id, purchase_order_line_id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "purchase_order_delivery_recei_tenant_id_branch_id_receipt__fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, receipt_id) REFERENCES purchase_order_delivery_receipts(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "purchase_order_delivery_receipt_line_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "purchase_order_delivery_receipt_lines_delivered_qty_check",
      "contype": "c",
      "definition": "CHECK ((delivered_qty > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "purchase_order_delivery_receipt_lines_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "purchase_order_delivery_receipt_lines_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "purchase_order_delivery_receipt_lines_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipt_lines",
      "conname": "s4b_ck_purchase_order_delivery_receipt_lines_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "purchase_order_delivery_recei_purchase_order_id_request_key_key",
      "contype": "u",
      "definition": "UNIQUE (purchase_order_id, request_key)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "purchase_order_delivery_recei_tenant_id_branch_id_purchase_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "purchase_order_delivery_receipts_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "purchase_order_delivery_receipts_received_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (received_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "purchase_order_delivery_receipts_request_key_check",
      "contype": "c",
      "definition": "CHECK ((btrim(request_key) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "purchase_order_delivery_receipts_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "purchase_order_delivery_receipts_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "purchase_order_delivery_receipts_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_delivery_receipts",
      "conname": "s4b_ck_purchase_order_delivery_receipts_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_discount_check",
      "contype": "c",
      "definition": "CHECK ((discount >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_gst_rate_check",
      "contype": "c",
      "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_line_no_check",
      "contype": "c",
      "definition": "CHECK ((line_no > 0))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_ordered_qty_check",
      "contype": "c",
      "definition": "CHECK ((ordered_qty > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_purchase_order_id_line_no_key",
      "contype": "u",
      "definition": "UNIQUE (purchase_order_id, line_no)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_tenant_id_branch_id_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_tenant_id_branch_id_purchase_order_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "purchase_order_lines_unit_cost_check",
      "contype": "c",
      "definition": "CHECK ((unit_cost >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "s4b_ck_purchase_order_lines_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_lines",
      "conname": "s4b_fk_purchase_order_lines_tenant_id_branch_i_27f0eb5d3dee",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, source_purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_quotations",
      "conname": "purchase_order_quotations_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_quotations",
      "conname": "s4b_ck_purchase_order_quotations_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_quotations",
      "conname": "s4b_fk_purchase_order_quotations_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_quotations",
      "conname": "s4b_fk_purchase_order_quotations_tenant_id_bra_75ba933f3b60",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_quotations",
      "conname": "s4b_fk_purchase_order_quotations_tenant_id_bra_bd8eaf344e0e",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_quotations",
      "conname": "s4b_fk_purchase_order_quotations_tenant_id_bra_ff7eedb6879d",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, created_by) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_quotations",
      "conname": "s4b_fk_purchase_order_quotations_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_order_quotations",
      "conname": "s4b_uk_purchase_order_quotations_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_po_number_check",
      "contype": "c",
      "definition": "CHECK ((btrim(po_number) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['DRAFT'::text, 'SENT'::text, 'PARTIALLY_RECEIVED'::text, 'READY_TO_CLOSE'::text, 'CLOSED'::text, 'CANCELLED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_tenant_id_branch_id_po_number_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, po_number)",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_tenant_id_branch_id_supplier_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES suppliers(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "purchase_orders_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "s4b_ck_purchase_orders_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "purchase_orders",
      "conname": "s4b_fk_purchase_orders_tenant_id_branch_id_sou_9b4b8e162d57",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, source_purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_events",
      "conname": "purchase_request_events_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_events",
      "conname": "purchase_request_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_events",
      "conname": "purchase_request_events_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_events",
      "conname": "purchase_request_events_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_events",
      "conname": "purchase_request_events_tenant_id_branch_id_purchase_reque_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_request_id) REFERENCES purchase_requests(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_events",
      "conname": "purchase_request_events_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_check",
      "contype": "c",
      "definition": "CHECK ((((item_id IS NOT NULL) AND (new_item_name IS NULL)) OR ((item_id IS NULL) AND (btrim(new_item_name) <> ''::text))))",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (item_id) REFERENCES catalogue_items(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_line_no_check",
      "contype": "c",
      "definition": "CHECK ((line_no > 0))",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_ordered_qty_check",
      "contype": "c",
      "definition": "CHECK ((ordered_qty > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_purchase_request_id_line_no_key",
      "contype": "u",
      "definition": "UNIQUE (purchase_request_id, line_no)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_shortage_fk",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, material_shortage_id) REFERENCES material_shortages(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_tenant_id_branch_id_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_tenant_id_branch_id_purchase_reques_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_request_id) REFERENCES purchase_requests(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_lines",
      "conname": "purchase_request_lines_unit_check",
      "contype": "c",
      "definition": "CHECK ((btrim(unit) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "conname": "purchase_request_purchase_or_tenant_id_branch_id_purchase_fkey1",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "conname": "purchase_request_purchase_ord_tenant_id_branch_id_purchase_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_request_id) REFERENCES purchase_requests(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "conname": "purchase_request_purchase_orders_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (purchase_request_id, purchase_order_id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "conname": "purchase_request_purchase_orders_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_purchase_orders",
      "conname": "purchase_request_purchase_orders_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_purchase_request_line_id_supplier_i_key",
      "contype": "u",
      "definition": "UNIQUE (purchase_request_line_id, supplier_id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_tenant_id_branch_id_purchase_reque_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_request_line_id) REFERENCES purchase_request_lines(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_tenant_id_branch_id_supplier_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES suppliers(tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_request_quotes",
      "conname": "purchase_request_quotes_unit_cost_check",
      "contype": "c",
      "definition": "CHECK ((unit_cost >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_approved_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (approved_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_request_number_check",
      "contype": "c",
      "definition": "CHECK ((btrim(request_number) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_requested_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (requested_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['REQUESTED'::text, 'APPROVED'::text, 'ISSUED'::text, 'CANCELLED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_tenant_id_branch_id_request_number_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, request_number)",
      "convalidated": true
    },
    {
      "table_name": "purchase_requests",
      "conname": "purchase_requests_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "qc_checks_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "qc_checks_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id)",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "qc_checks_label_check",
      "contype": "c",
      "definition": "CHECK ((btrim(label) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "qc_checks_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "qc_checks_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['PENDING'::text, 'FAILED'::text, 'PASSED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "qc_checks_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "qc_checks_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "s4b_ck_qc_checks_passed",
      "contype": "c",
      "definition": "CHECK ((passed = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
      "convalidated": true
    },
    {
      "table_name": "qc_checks",
      "conname": "s4b_ck_qc_checks_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "qc_results",
      "conname": "qc_results_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "qc_results",
      "conname": "qc_results_outcome_check",
      "contype": "c",
      "definition": "CHECK ((outcome = ANY (ARRAY['FAILED'::text, 'PASSED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "qc_results",
      "conname": "qc_results_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "qc_results",
      "conname": "qc_results_qc_check_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (qc_check_id) REFERENCES qc_checks(id)",
      "convalidated": true
    },
    {
      "table_name": "qc_results",
      "conname": "qc_results_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "qc_results",
      "conname": "qc_results_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_description_check",
      "contype": "c",
      "definition": "CHECK ((btrim(description) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_gst_rate_check",
      "contype": "c",
      "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_line_no_check",
      "contype": "c",
      "definition": "CHECK ((line_no > 0))",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_quantity_check",
      "contype": "c",
      "definition": "CHECK ((quantity > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_quotation_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_quotation_id_line_no_key",
      "contype": "u",
      "definition": "UNIQUE (quotation_id, line_no)",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_rate_check",
      "contype": "c",
      "definition": "CHECK ((rate >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "quotation_lines_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "quotation_lines",
      "conname": "s4b_ck_quotation_lines_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_discount_check",
      "contype": "c",
      "definition": "CHECK ((discount >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_lead_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (lead_id) REFERENCES sales_leads(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['DRAFT'::text, 'SENT'::text, 'ACCEPTED'::text, 'REJECTED'::text, 'EXPIRED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_tenant_id_quotation_no_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, quotation_no)",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "quotations_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "quotations",
      "conname": "s4b_ck_quotations_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_amount_paise_check",
      "contype": "c",
      "definition": "CHECK ((amount_paise > 0))",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_credit_note_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (credit_note_id) REFERENCES credit_notes(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_credit_note_id_request_key_key",
      "contype": "u",
      "definition": "UNIQUE (credit_note_id, request_key)",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_method_check",
      "contype": "c",
      "definition": "CHECK ((method = ANY (ARRAY['CASH'::text, 'CARD'::text, 'UPI'::text, 'BANK_TRANSFER'::text, 'OTHER'::text])))",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "refunds",
      "conname": "refunds_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "report_template_versions",
      "conname": "report_template_versions_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "report_template_versions",
      "conname": "s4b_ck_report_template_versions_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "report_template_versions",
      "conname": "s4b_fk_report_template_versions_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "report_template_versions",
      "conname": "s4b_uk_report_template_versions_tenant_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "role_permissions",
      "conname": "role_permissions_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (role_id, permission)",
      "convalidated": true
    },
    {
      "table_name": "role_permissions",
      "conname": "role_permissions_role_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (role_id) REFERENCES tenant_roles(id) ON DELETE CASCADE",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "s4b_ck_sales_leads_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_display_name_check",
      "contype": "c",
      "definition": "CHECK ((btrim(display_name) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_phone_check",
      "contype": "c",
      "definition": "CHECK ((btrim(phone) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_stage_check",
      "contype": "c",
      "definition": "CHECK ((stage = ANY (ARRAY['NEW'::text, 'QUALIFIED'::text, 'QUOTATION_SENT'::text, 'WON'::text, 'LOST'::text])))",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_temperature_check",
      "contype": "c",
      "definition": "CHECK ((temperature = ANY (ARRAY['HOT'::text, 'WARM'::text, 'COLD'::text])))",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "sales_leads",
      "conname": "sales_leads_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "s4b_ck_service_advisor_teams_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "service_advisor_teams_advisor_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (advisor_membership_id) REFERENCES tenant_memberships(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "service_advisor_teams_assigned_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (assigned_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "service_advisor_teams_department_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (department_id) REFERENCES service_departments(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "service_advisor_teams_department_id_manager_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (department_id, manager_membership_id) REFERENCES service_department_managers(department_id, manager_membership_id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "service_advisor_teams_manager_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (manager_membership_id) REFERENCES tenant_memberships(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "service_advisor_teams_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id, branch_id, advisor_membership_id)",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "service_advisor_teams_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_advisor_teams",
      "conname": "service_advisor_teams_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_brands",
      "conname": "s4b_ck_service_brands_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "service_brands",
      "conname": "s4b_fk_service_brands_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_brands",
      "conname": "s4b_fk_service_brands_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_brands",
      "conname": "s4b_uk_service_brands_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "service_brands",
      "conname": "service_brands_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "service_department_managers",
      "conname": "s4b_ck_service_department_managers_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "service_department_managers",
      "conname": "service_department_managers_appointed_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (appointed_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_department_managers",
      "conname": "service_department_managers_department_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (department_id) REFERENCES service_departments(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_department_managers",
      "conname": "service_department_managers_manager_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (manager_membership_id) REFERENCES tenant_memberships(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_department_managers",
      "conname": "service_department_managers_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (department_id, manager_membership_id)",
      "convalidated": true
    },
    {
      "table_name": "service_department_managers",
      "conname": "service_department_managers_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_department_managers",
      "conname": "service_department_managers_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "s4b_ck_service_departments_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "service_departments_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "service_departments_name_check",
      "contype": "c",
      "definition": "CHECK ((btrim(name) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "service_departments_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "service_departments_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ARCHIVED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "service_departments_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "service_departments_tenant_id_branch_id_name_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, name)",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "service_departments_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_departments",
      "conname": "service_departments_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "s4b_ck_service_task_catalog_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "s4b_fk_service_task_catalog_tenant_id_branch_i_9a95c10c0d25",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, car_segment_id) REFERENCES car_segments(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "s4b_fk_service_task_catalog_tenant_id_branch_id_brand_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, brand_id) REFERENCES service_brands(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_department_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (department_id) REFERENCES service_departments(id)",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_gst_rate_check",
      "contype": "c",
      "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_name_check",
      "contype": "c",
      "definition": "CHECK ((btrim(name) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_rate_check",
      "contype": "c",
      "definition": "CHECK ((rate >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ARCHIVED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "service_task_catalog",
      "conname": "service_task_catalog_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "s4b_ck_stock_inwards_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "s4b_fk_stock_inwards_tenant_id_branch_id_ledger_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, ledger_id) REFERENCES stock_ledger(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_delivery_confirmation_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (delivery_confirmation_id) REFERENCES purchase_order_delivery_confirmations(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_delivery_confirmation_id_key",
      "contype": "u",
      "definition": "UNIQUE (delivery_confirmation_id)",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_qty_check",
      "contype": "c",
      "definition": "CHECK ((qty > (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_received_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (received_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_tenant_id_branch_id_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_tenant_id_branch_id_purchase_order_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_tenant_id_branch_id_purchase_order_line_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_inwards",
      "conname": "stock_inwards_unit_cost_check",
      "contype": "c",
      "definition": "CHECK ((unit_cost >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "s4b_ck_stock_ledger_legacy_job_card_id",
      "contype": "c",
      "definition": "CHECK (((legacy_job_card_id IS NULL) OR (legacy_job_card_id = 0)))",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "s4b_ck_stock_ledger_legacy_material_row_id",
      "contype": "c",
      "definition": "CHECK (((legacy_material_row_id IS NULL) OR (legacy_material_row_id = 0)))",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "s4b_ck_stock_ledger_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "s4b_fk_stock_ledger_tenant_id_branch_id_by_user",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, by_user) REFERENCES workshop_user_profiles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "s4b_fk_stock_ledger_tenant_id_branch_id_inward_f70fe8ed7e32",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, inward_purchase_line_id) REFERENCES inward_purchase_lines(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "s4b_fk_stock_ledger_tenant_id_branch_id_job_card_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "s4b_fk_stock_ledger_tenant_id_branch_id_material_row_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, material_row_id) REFERENCES material_requests(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "s4b_job_138d913c999c68dffbac",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, job_card_id, material_row_id) REFERENCES material_requests(tenant_id, branch_id, job_card_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_entry_type_check",
      "contype": "c",
      "definition": "CHECK ((entry_type = ANY (ARRAY['INWARD'::text, 'ADJUSTMENT'::text, 'ISSUE'::text, 'RETURN'::text, 'WASTE'::text, 'ISSUE_REVERSAL'::text])))",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_inward_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (inward_id) REFERENCES stock_inwards(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_material_ledger_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (material_ledger_id) REFERENCES material_ledger(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_material_ledger_id_key",
      "contype": "u",
      "definition": "UNIQUE (material_ledger_id)",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_quantity_check",
      "contype": "c",
      "definition": "CHECK ((quantity <> (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_reason_check",
      "contype": "c",
      "definition": "CHECK ((btrim(reason) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_tenant_id_branch_id_item_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "stock_ledger",
      "conname": "stock_ledger_unit_cost_check",
      "contype": "c",
      "definition": "CHECK ((unit_cost >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "superadmins",
      "conname": "superadmins_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (user_id)",
      "convalidated": true
    },
    {
      "table_name": "superadmins",
      "conname": "superadmins_user_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (user_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "s4b_ck_suppliers_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "suppliers_archived_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (archived_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "suppliers_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "suppliers_name_check",
      "contype": "c",
      "definition": "CHECK ((btrim(name) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "suppliers_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "suppliers_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "suppliers_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "suppliers_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "suppliers",
      "conname": "suppliers_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "support_emulations",
      "conname": "support_emulations_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "support_emulations",
      "conname": "support_emulations_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ENDED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "support_emulations",
      "conname": "support_emulations_superadmin_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (superadmin_id) REFERENCES superadmins(user_id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "support_emulations",
      "conname": "support_emulations_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "s4b_ck_technician_tasks_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_assigned_to_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (assigned_to) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id)",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['PENDING'::text, 'IN_PROGRESS'::text, 'PAUSED'::text, 'COMPLETED'::text, 'CANCELLED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_title_check",
      "contype": "c",
      "definition": "CHECK ((btrim(title) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "technician_tasks",
      "conname": "technician_tasks_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_admin_invitations",
      "conname": "tenant_admin_invitations_membership_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (membership_id) REFERENCES tenant_memberships(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenant_admin_invitations",
      "conname": "tenant_admin_invitations_membership_id_key",
      "contype": "u",
      "definition": "UNIQUE (membership_id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_admin_invitations",
      "conname": "tenant_admin_invitations_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_admin_invitations",
      "conname": "tenant_admin_invitations_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['PENDING'::text, 'ACCEPTED'::text, 'CANCELLED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "tenant_admin_invitations",
      "conname": "tenant_admin_invitations_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenant_audit_events",
      "conname": "tenant_audit_events_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenant_audit_events",
      "conname": "tenant_audit_events_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_audit_events",
      "conname": "tenant_audit_events_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenant_memberships",
      "conname": "tenant_memberships_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_memberships",
      "conname": "tenant_memberships_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['INVITED'::text, 'ACTIVE'::text, 'ARCHIVED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "tenant_memberships",
      "conname": "tenant_memberships_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenant_memberships",
      "conname": "tenant_memberships_tenant_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_memberships",
      "conname": "tenant_memberships_tenant_id_user_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, user_id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_memberships",
      "conname": "tenant_memberships_user_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (user_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenant_memberships",
      "conname": "tenant_memberships_version_check",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "tenant_roles",
      "conname": "tenant_roles_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_roles",
      "conname": "tenant_roles_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ARCHIVED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "tenant_roles",
      "conname": "tenant_roles_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenant_roles",
      "conname": "tenant_roles_tenant_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_roles",
      "conname": "tenant_roles_tenant_id_name_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, name)",
      "convalidated": true
    },
    {
      "table_name": "tenant_roles",
      "conname": "tenant_roles_version_check",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "tenant_settings",
      "conname": "tenant_settings_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (tenant_id)",
      "convalidated": true
    },
    {
      "table_name": "tenant_settings",
      "conname": "tenant_settings_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenant_settings",
      "conname": "tenant_settings_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "tenants",
      "conname": "tenants_lifecycle_state_check",
      "contype": "c",
      "definition": "CHECK ((lifecycle_state = ANY (ARRAY['trial'::text, 'active'::text, 'payment_due'::text, 'suspended'::text, 'closed'::text])))",
      "convalidated": true
    },
    {
      "table_name": "tenants",
      "conname": "tenants_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "s4b_ck_vehicles_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_archived_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (archived_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_created_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (created_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_km_check",
      "contype": "c",
      "definition": "CHECK ((km >= 0))",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_make_check",
      "contype": "c",
      "definition": "CHECK ((btrim(make) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_model_check",
      "contype": "c",
      "definition": "CHECK ((btrim(model) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_number_check",
      "contype": "c",
      "definition": "CHECK ((btrim(number) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_tenant_id_branch_id_customer_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES customers(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_tenant_id_branch_id_id_key",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "vehicles",
      "conname": "vehicles_updated_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (updated_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "s4b_ck_visits_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_advisor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (advisor_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_archived_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (archived_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_fuel_check",
      "contype": "c",
      "definition": "CHECK ((btrim(fuel) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_odo_reading_check",
      "contype": "c",
      "definition": "CHECK ((odo_reading >= (0)::numeric))",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_received_by_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (received_by) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_requested_work_check",
      "contype": "c",
      "definition": "CHECK ((btrim(requested_work) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_tenant_id_branch_id_customer_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES customers(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_tenant_id_branch_id_vehicle_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES vehicles(tenant_id, branch_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "visits",
      "conname": "visits_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "work_updates",
      "conname": "work_updates_actor_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (actor_id) REFERENCES platform_users(id)",
      "convalidated": true
    },
    {
      "table_name": "work_updates",
      "conname": "work_updates_body_check",
      "contype": "c",
      "definition": "CHECK ((btrim(body) <> ''::text))",
      "convalidated": true
    },
    {
      "table_name": "work_updates",
      "conname": "work_updates_job_card_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (job_card_id) REFERENCES job_cards(id)",
      "convalidated": true
    },
    {
      "table_name": "work_updates",
      "conname": "work_updates_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    },
    {
      "table_name": "work_updates",
      "conname": "work_updates_status_check",
      "contype": "c",
      "definition": "CHECK ((status = ANY (ARRAY['IN_PROGRESS'::text, 'PAUSED'::text, 'COMPLETED'::text])))",
      "convalidated": true
    },
    {
      "table_name": "work_updates",
      "conname": "work_updates_task_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (task_id) REFERENCES technician_tasks(id)",
      "convalidated": true
    },
    {
      "table_name": "work_updates",
      "conname": "work_updates_tenant_id_branch_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "work_updates",
      "conname": "work_updates_tenant_id_fkey",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id)",
      "convalidated": true
    },
    {
      "table_name": "workshop_user_profiles",
      "conname": "s4b_ck_workshop_user_profiles_version",
      "contype": "c",
      "definition": "CHECK ((version > 0))",
      "convalidated": true
    },
    {
      "table_name": "workshop_user_profiles",
      "conname": "s4b_fk_workshop_user_profiles_platform_user_id",
      "contype": "f",
      "definition": "FOREIGN KEY (platform_user_id) REFERENCES platform_users(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "workshop_user_profiles",
      "conname": "s4b_fk_workshop_user_profiles_tenant_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "workshop_user_profiles",
      "conname": "s4b_fk_workshop_user_profiles_tenant_id_branch_id",
      "contype": "f",
      "definition": "FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT",
      "convalidated": true
    },
    {
      "table_name": "workshop_user_profiles",
      "conname": "s4b_uk_workshop_user_profiles_tenant_id_branch_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, branch_id, id)",
      "convalidated": true
    },
    {
      "table_name": "workshop_user_profiles",
      "conname": "s4b_uk_workshop_user_profiles_tenant_id_id",
      "contype": "u",
      "definition": "UNIQUE (tenant_id, id)",
      "convalidated": true
    },
    {
      "table_name": "workshop_user_profiles",
      "conname": "workshop_user_profiles_pkey",
      "contype": "p",
      "definition": "PRIMARY KEY (id)",
      "convalidated": true
    }
  ],
  "indexes": [
    {
      "tablename": "active_invoice_claims",
      "indexname": "active_invoice_claims_invoice_id_key",
      "indexdef": "CREATE UNIQUE INDEX active_invoice_claims_invoice_id_key ON public.active_invoice_claims USING btree (invoice_id)"
    },
    {
      "tablename": "active_invoice_claims",
      "indexname": "active_invoice_claims_pkey",
      "indexdef": "CREATE UNIQUE INDEX active_invoice_claims_pkey ON public.active_invoice_claims USING btree (job_card_id)"
    },
    {
      "tablename": "advisor_attendance",
      "indexname": "advisor_attendance_pkey",
      "indexdef": "CREATE UNIQUE INDEX advisor_attendance_pkey ON public.advisor_attendance USING btree (tenant_id, branch_id, user_id, date)"
    },
    {
      "tablename": "advisor_attendance",
      "indexname": "s4b_ix_advisor_attendance_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_advisor_attendance_tenant_id ON public.advisor_attendance USING btree (tenant_id)"
    },
    {
      "tablename": "advisor_attendance",
      "indexname": "s4b_ix_advisor_attendance_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_advisor_attendance_tenant_id_branch_id ON public.advisor_attendance USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "advisor_attendance",
      "indexname": "s4b_ix_advisor_attendance_tenant_id_branch_id_user_id",
      "indexdef": "CREATE INDEX s4b_ix_advisor_attendance_tenant_id_branch_id_user_id ON public.advisor_attendance USING btree (tenant_id, branch_id, user_id)"
    },
    {
      "tablename": "alembic_version",
      "indexname": "alembic_version_pkc",
      "indexdef": "CREATE UNIQUE INDEX alembic_version_pkc ON public.alembic_version USING btree (version_num)"
    },
    {
      "tablename": "approvals",
      "indexname": "approvals_pkey",
      "indexdef": "CREATE UNIQUE INDEX approvals_pkey ON public.approvals USING btree (id)"
    },
    {
      "tablename": "approvals",
      "indexname": "s4b_ix_approvals_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_approvals_tenant_id ON public.approvals USING btree (tenant_id)"
    },
    {
      "tablename": "approvals",
      "indexname": "s4b_ix_approvals_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_approvals_tenant_id_branch_id ON public.approvals USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "approvals",
      "indexname": "s4b_ix_approvals_tenant_id_branch_id_created_at_id",
      "indexdef": "CREATE INDEX s4b_ix_approvals_tenant_id_branch_id_created_at_id ON public.approvals USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "approvals",
      "indexname": "s4b_ix_approvals_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_approvals_tenant_id_branch_id_job_card_id ON public.approvals USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "approvals",
      "indexname": "s4b_uk_approvals_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_approvals_tenant_id_branch_id_id ON public.approvals USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "booking_call_logs",
      "indexname": "booking_call_logs_pkey",
      "indexdef": "CREATE UNIQUE INDEX booking_call_logs_pkey ON public.booking_call_logs USING btree (id)"
    },
    {
      "tablename": "booking_call_logs",
      "indexname": "s4b_ix_booking_call_logs_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_call_logs_tenant_id ON public.booking_call_logs USING btree (tenant_id)"
    },
    {
      "tablename": "booking_call_logs",
      "indexname": "s4b_ix_booking_call_logs_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_call_logs_tenant_id_branch_id ON public.booking_call_logs USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "booking_call_logs",
      "indexname": "s4b_ix_booking_call_logs_tenant_id_branch_id_booking_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_call_logs_tenant_id_branch_id_booking_id ON public.booking_call_logs USING btree (tenant_id, branch_id, booking_id)"
    },
    {
      "tablename": "booking_call_logs",
      "indexname": "s4b_ix_booking_call_logs_tenant_id_branch_id_called_by",
      "indexdef": "CREATE INDEX s4b_ix_booking_call_logs_tenant_id_branch_id_called_by ON public.booking_call_logs USING btree (tenant_id, branch_id, called_by)"
    },
    {
      "tablename": "booking_call_logs",
      "indexname": "s4b_uk_booking_call_logs_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_booking_call_logs_tenant_id_branch_id_id ON public.booking_call_logs USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "booking_capacity_limits",
      "indexname": "booking_capacity_limits_pkey",
      "indexdef": "CREATE UNIQUE INDEX booking_capacity_limits_pkey ON public.booking_capacity_limits USING btree (tenant_id, branch_id, booking_date)"
    },
    {
      "tablename": "booking_capacity_overrides",
      "indexname": "booking_capacity_overrides_pkey",
      "indexdef": "CREATE UNIQUE INDEX booking_capacity_overrides_pkey ON public.booking_capacity_overrides USING btree (id)"
    },
    {
      "tablename": "booking_capacity_overrides",
      "indexname": "s4b_ix_booking_capacity_overrides_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_capacity_overrides_tenant_id ON public.booking_capacity_overrides USING btree (tenant_id)"
    },
    {
      "tablename": "booking_capacity_overrides",
      "indexname": "s4b_ix_booking_capacity_overrides_tenant_id_br_c5ba6e745151",
      "indexdef": "CREATE INDEX s4b_ix_booking_capacity_overrides_tenant_id_br_c5ba6e745151 ON public.booking_capacity_overrides USING btree (tenant_id, branch_id, booking_id)"
    },
    {
      "tablename": "booking_capacity_overrides",
      "indexname": "s4b_ix_booking_capacity_overrides_tenant_id_br_c8e3626bf0f9",
      "indexdef": "CREATE INDEX s4b_ix_booking_capacity_overrides_tenant_id_br_c8e3626bf0f9 ON public.booking_capacity_overrides USING btree (tenant_id, branch_id, approved_by)"
    },
    {
      "tablename": "booking_capacity_overrides",
      "indexname": "s4b_ix_booking_capacity_overrides_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_capacity_overrides_tenant_id_branch_id ON public.booking_capacity_overrides USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "booking_capacity_overrides",
      "indexname": "s4b_uk_booking_capacity_overrides_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_booking_capacity_overrides_tenant_id_branch_id_id ON public.booking_capacity_overrides USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "booking_events",
      "indexname": "booking_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX booking_events_pkey ON public.booking_events USING btree (id)"
    },
    {
      "tablename": "booking_events",
      "indexname": "s4b_ix_booking_events_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_events_tenant_id ON public.booking_events USING btree (tenant_id)"
    },
    {
      "tablename": "booking_events",
      "indexname": "s4b_ix_booking_events_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_events_tenant_id_branch_id ON public.booking_events USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "booking_events",
      "indexname": "s4b_ix_booking_events_tenant_id_branch_id_actor_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_events_tenant_id_branch_id_actor_id ON public.booking_events USING btree (tenant_id, branch_id, actor_id)"
    },
    {
      "tablename": "booking_events",
      "indexname": "s4b_ix_booking_events_tenant_id_branch_id_booking_id",
      "indexdef": "CREATE INDEX s4b_ix_booking_events_tenant_id_branch_id_booking_id ON public.booking_events USING btree (tenant_id, branch_id, booking_id)"
    },
    {
      "tablename": "booking_events",
      "indexname": "s4b_uk_booking_events_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_booking_events_tenant_id_branch_id_id ON public.booking_events USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "bookings",
      "indexname": "bookings_capacity_idx",
      "indexdef": "CREATE INDEX bookings_capacity_idx ON public.bookings USING btree (tenant_id, branch_id, booking_date, service_type) WHERE (status = ANY (ARRAY['BOOKED'::text, 'CONFIRMED'::text, 'RESCHEDULED'::text]))"
    },
    {
      "tablename": "bookings",
      "indexname": "bookings_job_card_id_key",
      "indexdef": "CREATE UNIQUE INDEX bookings_job_card_id_key ON public.bookings USING btree (job_card_id)"
    },
    {
      "tablename": "bookings",
      "indexname": "bookings_pkey",
      "indexdef": "CREATE UNIQUE INDEX bookings_pkey ON public.bookings USING btree (id)"
    },
    {
      "tablename": "bookings",
      "indexname": "bookings_visit_id_key",
      "indexdef": "CREATE UNIQUE INDEX bookings_visit_id_key ON public.bookings USING btree (visit_id)"
    },
    {
      "tablename": "bookings",
      "indexname": "s4b_uk_bookings_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_bookings_tenant_id_branch_id_id ON public.bookings USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "branch_settings",
      "indexname": "branch_settings_pkey",
      "indexdef": "CREATE UNIQUE INDEX branch_settings_pkey ON public.branch_settings USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "branch_settings",
      "indexname": "branch_settings_scope_idx",
      "indexdef": "CREATE INDEX branch_settings_scope_idx ON public.branch_settings USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "branches",
      "indexname": "branches_one_primary_per_tenant",
      "indexdef": "CREATE UNIQUE INDEX branches_one_primary_per_tenant ON public.branches USING btree (tenant_id) WHERE is_primary"
    },
    {
      "tablename": "branches",
      "indexname": "branches_pkey",
      "indexdef": "CREATE UNIQUE INDEX branches_pkey ON public.branches USING btree (id)"
    },
    {
      "tablename": "branches",
      "indexname": "branches_tenant_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX branches_tenant_id_id_key ON public.branches USING btree (tenant_id, id)"
    },
    {
      "tablename": "branches",
      "indexname": "branches_tenant_id_name_key",
      "indexdef": "CREATE UNIQUE INDEX branches_tenant_id_name_key ON public.branches USING btree (tenant_id, name) NULLS NOT DISTINCT"
    },
    {
      "tablename": "car_segments",
      "indexname": "car_segments_pkey",
      "indexdef": "CREATE UNIQUE INDEX car_segments_pkey ON public.car_segments USING btree (id)"
    },
    {
      "tablename": "car_segments",
      "indexname": "s4b_ix_car_segments_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_car_segments_tenant_id ON public.car_segments USING btree (tenant_id)"
    },
    {
      "tablename": "car_segments",
      "indexname": "s4b_ix_car_segments_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_car_segments_tenant_id_branch_id ON public.car_segments USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "car_segments",
      "indexname": "s4b_ix_car_segments_tenant_id_branch_id_created_at_id",
      "indexdef": "CREATE INDEX s4b_ix_car_segments_tenant_id_branch_id_created_at_id ON public.car_segments USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "car_segments",
      "indexname": "s4b_uk_car_segments_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_car_segments_tenant_id_branch_id_id ON public.car_segments USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "car_segments",
      "indexname": "s4b_ux_car_segments_tenant_id_branch_id_name",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_car_segments_tenant_id_branch_id_name ON public.car_segments USING btree (tenant_id, branch_id, name)"
    },
    {
      "tablename": "catalogue_items",
      "indexname": "catalogue_items_active_sku",
      "indexdef": "CREATE UNIQUE INDEX catalogue_items_active_sku ON public.catalogue_items USING btree (tenant_id, branch_id, upper(sku)) WHERE (archived_at IS NULL)"
    },
    {
      "tablename": "catalogue_items",
      "indexname": "catalogue_items_pkey",
      "indexdef": "CREATE UNIQUE INDEX catalogue_items_pkey ON public.catalogue_items USING btree (id)"
    },
    {
      "tablename": "catalogue_items",
      "indexname": "catalogue_items_scope_search",
      "indexdef": "CREATE INDEX catalogue_items_scope_search ON public.catalogue_items USING btree (tenant_id, branch_id, archived_at, lower(name))"
    },
    {
      "tablename": "catalogue_items",
      "indexname": "catalogue_items_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX catalogue_items_tenant_id_branch_id_id_key ON public.catalogue_items USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "command_receipts",
      "indexname": "command_receipts_pkey",
      "indexdef": "CREATE UNIQUE INDEX command_receipts_pkey ON public.command_receipts USING btree (tenant_id, branch_id, operation, request_key)"
    },
    {
      "tablename": "command_receipts",
      "indexname": "s4b_ix_command_receipts_actor_id",
      "indexdef": "CREATE INDEX s4b_ix_command_receipts_actor_id ON public.command_receipts USING btree (actor_id)"
    },
    {
      "tablename": "command_receipts",
      "indexname": "s4b_ix_command_receipts_created_at",
      "indexdef": "CREATE INDEX s4b_ix_command_receipts_created_at ON public.command_receipts USING btree (created_at)"
    },
    {
      "tablename": "command_receipts",
      "indexname": "s4b_ix_command_receipts_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_command_receipts_tenant_id ON public.command_receipts USING btree (tenant_id)"
    },
    {
      "tablename": "command_receipts",
      "indexname": "s4b_ix_command_receipts_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_command_receipts_tenant_id_branch_id ON public.command_receipts USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "credit_notes",
      "indexname": "credit_notes_invoice_id_request_key_key",
      "indexdef": "CREATE UNIQUE INDEX credit_notes_invoice_id_request_key_key ON public.credit_notes USING btree (invoice_id, request_key)"
    },
    {
      "tablename": "credit_notes",
      "indexname": "credit_notes_invoice_idx",
      "indexdef": "CREATE INDEX credit_notes_invoice_idx ON public.credit_notes USING btree (tenant_id, branch_id, invoice_id, created_at)"
    },
    {
      "tablename": "credit_notes",
      "indexname": "credit_notes_issued_document_id_key",
      "indexdef": "CREATE UNIQUE INDEX credit_notes_issued_document_id_key ON public.credit_notes USING btree (issued_document_id)"
    },
    {
      "tablename": "credit_notes",
      "indexname": "credit_notes_pkey",
      "indexdef": "CREATE UNIQUE INDEX credit_notes_pkey ON public.credit_notes USING btree (id)"
    },
    {
      "tablename": "credit_notes",
      "indexname": "credit_notes_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX credit_notes_tenant_id_branch_id_id_key ON public.credit_notes USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "customers",
      "indexname": "customers_active_mobile_per_branch",
      "indexdef": "CREATE UNIQUE INDEX customers_active_mobile_per_branch ON public.customers USING btree (tenant_id, branch_id, lower(mobile)) WHERE (archived_at IS NULL)"
    },
    {
      "tablename": "customers",
      "indexname": "customers_pkey",
      "indexdef": "CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id)"
    },
    {
      "tablename": "customers",
      "indexname": "customers_scope_search_idx",
      "indexdef": "CREATE INDEX customers_scope_search_idx ON public.customers USING btree (tenant_id, branch_id, archived_at, lower(name), lower(mobile))"
    },
    {
      "tablename": "customers",
      "indexname": "customers_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX customers_tenant_id_branch_id_id_key ON public.customers USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "database_sessions",
      "indexname": "database_sessions_expiry",
      "indexdef": "CREATE INDEX database_sessions_expiry ON public.database_sessions USING btree (expires_at)"
    },
    {
      "tablename": "database_sessions",
      "indexname": "database_sessions_pkey",
      "indexdef": "CREATE UNIQUE INDEX database_sessions_pkey ON public.database_sessions USING btree (token_hash)"
    },
    {
      "tablename": "delivery_acknowledgements",
      "indexname": "delivery_acknowledgements_gate_pass_document_id_key",
      "indexdef": "CREATE UNIQUE INDEX delivery_acknowledgements_gate_pass_document_id_key ON public.delivery_acknowledgements USING btree (gate_pass_document_id)"
    },
    {
      "tablename": "delivery_acknowledgements",
      "indexname": "delivery_acknowledgements_job_card_id_key",
      "indexdef": "CREATE UNIQUE INDEX delivery_acknowledgements_job_card_id_key ON public.delivery_acknowledgements USING btree (job_card_id)"
    },
    {
      "tablename": "delivery_acknowledgements",
      "indexname": "delivery_acknowledgements_job_card_id_request_key_key",
      "indexdef": "CREATE UNIQUE INDEX delivery_acknowledgements_job_card_id_request_key_key ON public.delivery_acknowledgements USING btree (job_card_id, request_key)"
    },
    {
      "tablename": "delivery_acknowledgements",
      "indexname": "delivery_acknowledgements_pkey",
      "indexdef": "CREATE UNIQUE INDEX delivery_acknowledgements_pkey ON public.delivery_acknowledgements USING btree (id)"
    },
    {
      "tablename": "delivery_acknowledgements",
      "indexname": "delivery_acknowledgements_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX delivery_acknowledgements_tenant_id_branch_id_id_key ON public.delivery_acknowledgements USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "demo_import_rows",
      "indexname": "demo_import_rows_pkey",
      "indexdef": "CREATE UNIQUE INDEX demo_import_rows_pkey ON public.demo_import_rows USING btree (tenant_id, source_table, source_id)"
    },
    {
      "tablename": "demo_import_runs",
      "indexname": "demo_import_runs_pkey",
      "indexdef": "CREATE UNIQUE INDEX demo_import_runs_pkey ON public.demo_import_runs USING btree (tenant_id)"
    },
    {
      "tablename": "document_sequences",
      "indexname": "document_sequences_pkey",
      "indexdef": "CREATE UNIQUE INDEX document_sequences_pkey ON public.document_sequences USING btree (tenant_id, branch_id, document_type, fiscal_year)"
    },
    {
      "tablename": "document_snapshots",
      "indexname": "document_snapshots_pkey",
      "indexdef": "CREATE UNIQUE INDEX document_snapshots_pkey ON public.document_snapshots USING btree (id)"
    },
    {
      "tablename": "document_snapshots",
      "indexname": "s4b_ix_document_snapshots_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_document_snapshots_tenant_id ON public.document_snapshots USING btree (tenant_id)"
    },
    {
      "tablename": "document_snapshots",
      "indexname": "s4b_ix_document_snapshots_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_document_snapshots_tenant_id_branch_id ON public.document_snapshots USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "document_snapshots",
      "indexname": "s4b_ix_document_snapshots_tenant_id_branch_id_asset_id",
      "indexdef": "CREATE INDEX s4b_ix_document_snapshots_tenant_id_branch_id_asset_id ON public.document_snapshots USING btree (tenant_id, branch_id, asset_id)"
    },
    {
      "tablename": "document_snapshots",
      "indexname": "s4b_ix_document_snapshots_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_document_snapshots_tenant_id_branch_id_job_card_id ON public.document_snapshots USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "document_snapshots",
      "indexname": "s4b_ix_document_snapshots_tenant_id_template_version_id",
      "indexdef": "CREATE INDEX s4b_ix_document_snapshots_tenant_id_template_version_id ON public.document_snapshots USING btree (tenant_id, template_version_id)"
    },
    {
      "tablename": "document_snapshots",
      "indexname": "s4b_uk_document_snapshots_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_document_snapshots_tenant_id_branch_id_id ON public.document_snapshots USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "document_snapshots",
      "indexname": "s4b_ux_document_snapshots_tenant_id_branch_id__57274a825232",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_document_snapshots_tenant_id_branch_id__57274a825232 ON public.document_snapshots USING btree (tenant_id, branch_id, source_kind, source_id, snapshot_version)"
    },
    {
      "tablename": "estimate_decisions",
      "indexname": "estimate_decisions_estimate_id_key",
      "indexdef": "CREATE UNIQUE INDEX estimate_decisions_estimate_id_key ON public.estimate_decisions USING btree (estimate_id)"
    },
    {
      "tablename": "estimate_decisions",
      "indexname": "estimate_decisions_pkey",
      "indexdef": "CREATE UNIQUE INDEX estimate_decisions_pkey ON public.estimate_decisions USING btree (id)"
    },
    {
      "tablename": "estimate_lines",
      "indexname": "estimate_lines_estimate_id_line_no_key",
      "indexdef": "CREATE UNIQUE INDEX estimate_lines_estimate_id_line_no_key ON public.estimate_lines USING btree (estimate_id, line_no)"
    },
    {
      "tablename": "estimate_lines",
      "indexname": "estimate_lines_pkey",
      "indexdef": "CREATE UNIQUE INDEX estimate_lines_pkey ON public.estimate_lines USING btree (id)"
    },
    {
      "tablename": "estimate_lines",
      "indexname": "s4b_ix_estimate_lines_tenant_id_branch_id_task_list_item_id",
      "indexdef": "CREATE INDEX s4b_ix_estimate_lines_tenant_id_branch_id_task_list_item_id ON public.estimate_lines USING btree (tenant_id, branch_id, task_list_item_id)"
    },
    {
      "tablename": "estimates",
      "indexname": "estimates_job_card_id_revision_key",
      "indexdef": "CREATE UNIQUE INDEX estimates_job_card_id_revision_key ON public.estimates USING btree (job_card_id, revision)"
    },
    {
      "tablename": "estimates",
      "indexname": "estimates_one_current_per_job",
      "indexdef": "CREATE UNIQUE INDEX estimates_one_current_per_job ON public.estimates USING btree (job_card_id) WHERE (superseded_at IS NULL)"
    },
    {
      "tablename": "estimates",
      "indexname": "estimates_pkey",
      "indexdef": "CREATE UNIQUE INDEX estimates_pkey ON public.estimates USING btree (id)"
    },
    {
      "tablename": "evidence_attachments",
      "indexname": "evidence_attachments_job",
      "indexdef": "CREATE INDEX evidence_attachments_job ON public.evidence_attachments USING btree (tenant_id, branch_id, job_card_id, id)"
    },
    {
      "tablename": "evidence_attachments",
      "indexname": "evidence_attachments_pkey",
      "indexdef": "CREATE UNIQUE INDEX evidence_attachments_pkey ON public.evidence_attachments USING btree (id)"
    },
    {
      "tablename": "financial_document_events",
      "indexname": "financial_document_events_correction_link_key",
      "indexdef": "CREATE UNIQUE INDEX financial_document_events_correction_link_key ON public.financial_document_events USING btree (document_id, event_type, related_document_id)"
    },
    {
      "tablename": "financial_document_events",
      "indexname": "financial_document_events_document_id_request_key_key",
      "indexdef": "CREATE UNIQUE INDEX financial_document_events_document_id_request_key_key ON public.financial_document_events USING btree (document_id, request_key)"
    },
    {
      "tablename": "financial_document_events",
      "indexname": "financial_document_events_document_idx",
      "indexdef": "CREATE INDEX financial_document_events_document_idx ON public.financial_document_events USING btree (tenant_id, branch_id, document_id, created_at)"
    },
    {
      "tablename": "financial_document_events",
      "indexname": "financial_document_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX financial_document_events_pkey ON public.financial_document_events USING btree (id)"
    },
    {
      "tablename": "financial_document_events",
      "indexname": "financial_document_events_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX financial_document_events_tenant_id_branch_id_id_key ON public.financial_document_events USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "financial_documents",
      "indexname": "financial_documents_job_idx",
      "indexdef": "CREATE INDEX financial_documents_job_idx ON public.financial_documents USING btree (tenant_id, branch_id, job_card_id, issued_at DESC)"
    },
    {
      "tablename": "financial_documents",
      "indexname": "financial_documents_pkey",
      "indexdef": "CREATE UNIQUE INDEX financial_documents_pkey ON public.financial_documents USING btree (id)"
    },
    {
      "tablename": "financial_documents",
      "indexname": "financial_documents_tenant_id_branch_id_document_no_key",
      "indexdef": "CREATE UNIQUE INDEX financial_documents_tenant_id_branch_id_document_no_key ON public.financial_documents USING btree (tenant_id, branch_id, document_no)"
    },
    {
      "tablename": "financial_documents",
      "indexname": "financial_documents_tenant_id_branch_id_document_type_fisca_key",
      "indexdef": "CREATE UNIQUE INDEX financial_documents_tenant_id_branch_id_document_type_fisca_key ON public.financial_documents USING btree (tenant_id, branch_id, document_type, fiscal_year, sequence_value)"
    },
    {
      "tablename": "financial_documents",
      "indexname": "financial_documents_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX financial_documents_tenant_id_branch_id_id_key ON public.financial_documents USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "followups",
      "indexname": "followups_job_idx",
      "indexdef": "CREATE INDEX followups_job_idx ON public.followups USING btree (tenant_id, branch_id, job_card_id, archived_at, id DESC)"
    },
    {
      "tablename": "followups",
      "indexname": "followups_pkey",
      "indexdef": "CREATE UNIQUE INDEX followups_pkey ON public.followups USING btree (id)"
    },
    {
      "tablename": "followups",
      "indexname": "followups_scope_due_idx",
      "indexdef": "CREATE INDEX followups_scope_due_idx ON public.followups USING btree (tenant_id, branch_id, archived_at, status, due_at, id)"
    },
    {
      "tablename": "followups",
      "indexname": "followups_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX followups_tenant_id_branch_id_id_key ON public.followups USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "import_source_records",
      "indexname": "import_source_records_pkey",
      "indexdef": "CREATE UNIQUE INDEX import_source_records_pkey ON public.import_source_records USING btree (tenant_id, source_sha256, source_table, source_key)"
    },
    {
      "tablename": "import_source_records",
      "indexname": "s4b_ix_import_source_records_target_table_target_key",
      "indexdef": "CREATE INDEX s4b_ix_import_source_records_target_table_target_key ON public.import_source_records USING btree (target_table, target_key)"
    },
    {
      "tablename": "import_source_records",
      "indexname": "s4b_ix_import_source_records_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_import_source_records_tenant_id ON public.import_source_records USING btree (tenant_id)"
    },
    {
      "tablename": "invoice_lines",
      "indexname": "invoice_lines_invoice_id_line_no_key",
      "indexdef": "CREATE UNIQUE INDEX invoice_lines_invoice_id_line_no_key ON public.invoice_lines USING btree (invoice_id, line_no)"
    },
    {
      "tablename": "invoice_lines",
      "indexname": "invoice_lines_pkey",
      "indexdef": "CREATE UNIQUE INDEX invoice_lines_pkey ON public.invoice_lines USING btree (id)"
    },
    {
      "tablename": "invoice_lines",
      "indexname": "s4b_ix_invoice_lines_tenant_id_branch_id_material_row_id",
      "indexdef": "CREATE INDEX s4b_ix_invoice_lines_tenant_id_branch_id_material_row_id ON public.invoice_lines USING btree (tenant_id, branch_id, material_row_id)"
    },
    {
      "tablename": "invoices",
      "indexname": "invoices_issued_document_id_key",
      "indexdef": "CREATE UNIQUE INDEX invoices_issued_document_id_key ON public.invoices USING btree (issued_document_id)"
    },
    {
      "tablename": "invoices",
      "indexname": "invoices_job_card_id_request_key_key",
      "indexdef": "CREATE UNIQUE INDEX invoices_job_card_id_request_key_key ON public.invoices USING btree (job_card_id, request_key)"
    },
    {
      "tablename": "invoices",
      "indexname": "invoices_job_idx",
      "indexdef": "CREATE INDEX invoices_job_idx ON public.invoices USING btree (tenant_id, branch_id, job_card_id, created_at DESC)"
    },
    {
      "tablename": "invoices",
      "indexname": "invoices_pkey",
      "indexdef": "CREATE UNIQUE INDEX invoices_pkey ON public.invoices USING btree (id)"
    },
    {
      "tablename": "invoices",
      "indexname": "invoices_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX invoices_tenant_id_branch_id_id_key ON public.invoices USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "invoices",
      "indexname": "s4b_job_bdd14661fb224cb8cc0a",
      "indexdef": "CREATE UNIQUE INDEX s4b_job_bdd14661fb224cb8cc0a ON public.invoices USING btree (tenant_id, branch_id, job_card_id, id)"
    },
    {
      "tablename": "inward_purchase_attachments",
      "indexname": "inward_purchase_attachments_pkey",
      "indexdef": "CREATE UNIQUE INDEX inward_purchase_attachments_pkey ON public.inward_purchase_attachments USING btree (id)"
    },
    {
      "tablename": "inward_purchase_attachments",
      "indexname": "s4b_ix_inward_purchase_attachments_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_attachments_tenant_id ON public.inward_purchase_attachments USING btree (tenant_id)"
    },
    {
      "tablename": "inward_purchase_attachments",
      "indexname": "s4b_ix_inward_purchase_attachments_tenant_id_b_487197459cda",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_attachments_tenant_id_b_487197459cda ON public.inward_purchase_attachments USING btree (tenant_id, branch_id, purchase_id)"
    },
    {
      "tablename": "inward_purchase_attachments",
      "indexname": "s4b_ix_inward_purchase_attachments_tenant_id_b_e7a948cedfa7",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_attachments_tenant_id_b_e7a948cedfa7 ON public.inward_purchase_attachments USING btree (tenant_id, branch_id, uploaded_by)"
    },
    {
      "tablename": "inward_purchase_attachments",
      "indexname": "s4b_ix_inward_purchase_attachments_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_attachments_tenant_id_branch_id ON public.inward_purchase_attachments USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "inward_purchase_attachments",
      "indexname": "s4b_uk_inward_purchase_attachments_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_inward_purchase_attachments_tenant_id_branch_id_id ON public.inward_purchase_attachments USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "inward_purchase_events",
      "indexname": "inward_purchase_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX inward_purchase_events_pkey ON public.inward_purchase_events USING btree (id)"
    },
    {
      "tablename": "inward_purchase_events",
      "indexname": "s4b_ix_inward_purchase_events_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_events_tenant_id ON public.inward_purchase_events USING btree (tenant_id)"
    },
    {
      "tablename": "inward_purchase_events",
      "indexname": "s4b_ix_inward_purchase_events_tenant_id_branch_77b229b4f21c",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_events_tenant_id_branch_77b229b4f21c ON public.inward_purchase_events USING btree (tenant_id, branch_id, purchase_id)"
    },
    {
      "tablename": "inward_purchase_events",
      "indexname": "s4b_ix_inward_purchase_events_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_events_tenant_id_branch_id ON public.inward_purchase_events USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "inward_purchase_events",
      "indexname": "s4b_ix_inward_purchase_events_tenant_id_branch_id_actor_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_events_tenant_id_branch_id_actor_id ON public.inward_purchase_events USING btree (tenant_id, branch_id, actor_id)"
    },
    {
      "tablename": "inward_purchase_events",
      "indexname": "s4b_uk_inward_purchase_events_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_inward_purchase_events_tenant_id_branch_id_id ON public.inward_purchase_events USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "inward_purchase_lines",
      "indexname": "inward_purchase_lines_pkey",
      "indexdef": "CREATE UNIQUE INDEX inward_purchase_lines_pkey ON public.inward_purchase_lines USING btree (id)"
    },
    {
      "tablename": "inward_purchase_lines",
      "indexname": "s4b_ix_inward_purchase_lines_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_lines_tenant_id ON public.inward_purchase_lines USING btree (tenant_id)"
    },
    {
      "tablename": "inward_purchase_lines",
      "indexname": "s4b_ix_inward_purchase_lines_tenant_id_branch__14ed52bb2625",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_lines_tenant_id_branch__14ed52bb2625 ON public.inward_purchase_lines USING btree (tenant_id, branch_id, purchase_order_line_id)"
    },
    {
      "tablename": "inward_purchase_lines",
      "indexname": "s4b_ix_inward_purchase_lines_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_lines_tenant_id_branch_id ON public.inward_purchase_lines USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "inward_purchase_lines",
      "indexname": "s4b_ix_inward_purchase_lines_tenant_id_branch_id_item_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_lines_tenant_id_branch_id_item_id ON public.inward_purchase_lines USING btree (tenant_id, branch_id, item_id)"
    },
    {
      "tablename": "inward_purchase_lines",
      "indexname": "s4b_ix_inward_purchase_lines_tenant_id_branch_id_purchase_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_lines_tenant_id_branch_id_purchase_id ON public.inward_purchase_lines USING btree (tenant_id, branch_id, purchase_id)"
    },
    {
      "tablename": "inward_purchase_lines",
      "indexname": "s4b_uk_inward_purchase_lines_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_inward_purchase_lines_tenant_id_branch_id_id ON public.inward_purchase_lines USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "inward_purchase_revision_lines",
      "indexname": "inward_purchase_revision_lines_pkey",
      "indexdef": "CREATE UNIQUE INDEX inward_purchase_revision_lines_pkey ON public.inward_purchase_revision_lines USING btree (id)"
    },
    {
      "tablename": "inward_purchase_revision_lines",
      "indexname": "s4b_ix_inward_purchase_revision_lines_tenant_i_5d9148740513",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_revision_lines_tenant_i_5d9148740513 ON public.inward_purchase_revision_lines USING btree (tenant_id, branch_id, item_id)"
    },
    {
      "tablename": "inward_purchase_revision_lines",
      "indexname": "s4b_ix_inward_purchase_revision_lines_tenant_i_f88a8f10180b",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_revision_lines_tenant_i_f88a8f10180b ON public.inward_purchase_revision_lines USING btree (tenant_id, branch_id, revision_id)"
    },
    {
      "tablename": "inward_purchase_revision_lines",
      "indexname": "s4b_ix_inward_purchase_revision_lines_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_revision_lines_tenant_id ON public.inward_purchase_revision_lines USING btree (tenant_id)"
    },
    {
      "tablename": "inward_purchase_revision_lines",
      "indexname": "s4b_ix_inward_purchase_revision_lines_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_revision_lines_tenant_id_branch_id ON public.inward_purchase_revision_lines USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "inward_purchase_revision_lines",
      "indexname": "s4b_uk_inward_purchase_revision_lines_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_inward_purchase_revision_lines_tenant_id_branch_id_id ON public.inward_purchase_revision_lines USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "inward_purchase_revisions",
      "indexname": "inward_purchase_revisions_pkey",
      "indexdef": "CREATE UNIQUE INDEX inward_purchase_revisions_pkey ON public.inward_purchase_revisions USING btree (id)"
    },
    {
      "tablename": "inward_purchase_revisions",
      "indexname": "s4b_ix_inward_purchase_revisions_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_revisions_tenant_id ON public.inward_purchase_revisions USING btree (tenant_id)"
    },
    {
      "tablename": "inward_purchase_revisions",
      "indexname": "s4b_ix_inward_purchase_revisions_tenant_id_bra_18e3233ab6c2",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_revisions_tenant_id_bra_18e3233ab6c2 ON public.inward_purchase_revisions USING btree (tenant_id, branch_id, purchase_id)"
    },
    {
      "tablename": "inward_purchase_revisions",
      "indexname": "s4b_ix_inward_purchase_revisions_tenant_id_bra_63bf06c8fa44",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_revisions_tenant_id_bra_63bf06c8fa44 ON public.inward_purchase_revisions USING btree (tenant_id, branch_id, revised_by)"
    },
    {
      "tablename": "inward_purchase_revisions",
      "indexname": "s4b_ix_inward_purchase_revisions_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchase_revisions_tenant_id_branch_id ON public.inward_purchase_revisions USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "inward_purchase_revisions",
      "indexname": "s4b_uk_inward_purchase_revisions_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_inward_purchase_revisions_tenant_id_branch_id_id ON public.inward_purchase_revisions USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "inward_purchase_revisions",
      "indexname": "s4b_ux_inward_purchase_revisions_tenant_id_bra_14594d8920af",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_inward_purchase_revisions_tenant_id_bra_14594d8920af ON public.inward_purchase_revisions USING btree (tenant_id, branch_id, purchase_id, revision_no)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "inward_purchases_pkey",
      "indexdef": "CREATE UNIQUE INDEX inward_purchases_pkey ON public.inward_purchases USING btree (id)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ix_inward_purchases_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchases_tenant_id ON public.inward_purchases USING btree (tenant_id)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ix_inward_purchases_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchases_tenant_id_branch_id ON public.inward_purchases USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ix_inward_purchases_tenant_id_branch_id_approved_by",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchases_tenant_id_branch_id_approved_by ON public.inward_purchases USING btree (tenant_id, branch_id, approved_by)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ix_inward_purchases_tenant_id_branch_id_created_at_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchases_tenant_id_branch_id_created_at_id ON public.inward_purchases USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ix_inward_purchases_tenant_id_branch_id_created_by",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchases_tenant_id_branch_id_created_by ON public.inward_purchases USING btree (tenant_id, branch_id, created_by)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ix_inward_purchases_tenant_id_branch_id_pu_d4ee35d79986",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchases_tenant_id_branch_id_pu_d4ee35d79986 ON public.inward_purchases USING btree (tenant_id, branch_id, purchase_order_id)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ix_inward_purchases_tenant_id_branch_id_submitted_by",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchases_tenant_id_branch_id_submitted_by ON public.inward_purchases USING btree (tenant_id, branch_id, submitted_by)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ix_inward_purchases_tenant_id_branch_id_supplier_id",
      "indexdef": "CREATE INDEX s4b_ix_inward_purchases_tenant_id_branch_id_supplier_id ON public.inward_purchases USING btree (tenant_id, branch_id, supplier_id)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_uk_inward_purchases_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_inward_purchases_tenant_id_branch_id_id ON public.inward_purchases USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "inward_purchases",
      "indexname": "s4b_ux_inward_purchases_tenant_id_branch_id_su_0311b1c1f499",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_inward_purchases_tenant_id_branch_id_su_0311b1c1f499 ON public.inward_purchases USING btree (tenant_id, branch_id, supplier_id, supplier_invoice_no) WHERE (status = ANY (ARRAY['Received'::text, 'Submitted'::text]))"
    },
    {
      "tablename": "job_assignment_history",
      "indexname": "job_assignment_history_job_idx",
      "indexdef": "CREATE INDEX job_assignment_history_job_idx ON public.job_assignment_history USING btree (job_card_id, id)"
    },
    {
      "tablename": "job_assignment_history",
      "indexname": "job_assignment_history_pkey",
      "indexdef": "CREATE UNIQUE INDEX job_assignment_history_pkey ON public.job_assignment_history USING btree (id)"
    },
    {
      "tablename": "job_cards",
      "indexname": "job_cards_manager_queue_idx",
      "indexdef": "CREATE INDEX job_cards_manager_queue_idx ON public.job_cards USING btree (tenant_id, branch_id, responsible_manager_id, assignment_state, created_at DESC)"
    },
    {
      "tablename": "job_cards",
      "indexname": "job_cards_pkey",
      "indexdef": "CREATE UNIQUE INDEX job_cards_pkey ON public.job_cards USING btree (id)"
    },
    {
      "tablename": "job_cards",
      "indexname": "job_cards_scope_idx",
      "indexdef": "CREATE INDEX job_cards_scope_idx ON public.job_cards USING btree (tenant_id, branch_id, status, created_at DESC)"
    },
    {
      "tablename": "job_cards",
      "indexname": "job_cards_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX job_cards_tenant_id_branch_id_id_key ON public.job_cards USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "job_cards",
      "indexname": "job_cards_tenant_id_job_no_key",
      "indexdef": "CREATE UNIQUE INDEX job_cards_tenant_id_job_no_key ON public.job_cards USING btree (tenant_id, job_no)"
    },
    {
      "tablename": "job_cards",
      "indexname": "job_cards_visit_id_key",
      "indexdef": "CREATE UNIQUE INDEX job_cards_visit_id_key ON public.job_cards USING btree (visit_id)"
    },
    {
      "tablename": "job_cards",
      "indexname": "s4b_ix_job_cards_tenant_id_branch_id_technician_id",
      "indexdef": "CREATE INDEX s4b_ix_job_cards_tenant_id_branch_id_technician_id ON public.job_cards USING btree (tenant_id, branch_id, technician_id)"
    },
    {
      "tablename": "job_checklist_cycles",
      "indexname": "job_checklist_cycles_job_idx",
      "indexdef": "CREATE INDEX job_checklist_cycles_job_idx ON public.job_checklist_cycles USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "job_checklist_cycles",
      "indexname": "job_checklist_cycles_pkey",
      "indexdef": "CREATE UNIQUE INDEX job_checklist_cycles_pkey ON public.job_checklist_cycles USING btree (id)"
    },
    {
      "tablename": "job_checklist_cycles",
      "indexname": "job_checklist_cycles_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX job_checklist_cycles_tenant_id_branch_id_id_key ON public.job_checklist_cycles USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "job_checklist_cycles",
      "indexname": "job_checklist_cycles_tenant_id_branch_id_job_card_id_stage__key",
      "indexdef": "CREATE UNIQUE INDEX job_checklist_cycles_tenant_id_branch_id_job_card_id_stage__key ON public.job_checklist_cycles USING btree (tenant_id, branch_id, job_card_id, stage, cycle_number)"
    },
    {
      "tablename": "job_checklist_items",
      "indexname": "job_checklist_items_cycle_id_item_key_key",
      "indexdef": "CREATE UNIQUE INDEX job_checklist_items_cycle_id_item_key_key ON public.job_checklist_items USING btree (cycle_id, item_key)"
    },
    {
      "tablename": "job_checklist_items",
      "indexname": "job_checklist_items_job_idx",
      "indexdef": "CREATE INDEX job_checklist_items_job_idx ON public.job_checklist_items USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "job_checklist_items",
      "indexname": "job_checklist_items_pkey",
      "indexdef": "CREATE UNIQUE INDEX job_checklist_items_pkey ON public.job_checklist_items USING btree (id)"
    },
    {
      "tablename": "job_events",
      "indexname": "job_events_idempotency_key",
      "indexdef": "CREATE UNIQUE INDEX job_events_idempotency_key ON public.job_events USING btree (tenant_id, job_card_id, request_key) WHERE (request_key IS NOT NULL)"
    },
    {
      "tablename": "job_events",
      "indexname": "job_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX job_events_pkey ON public.job_events USING btree (id)"
    },
    {
      "tablename": "job_media",
      "indexname": "job_media_pkey",
      "indexdef": "CREATE UNIQUE INDEX job_media_pkey ON public.job_media USING btree (id)"
    },
    {
      "tablename": "job_service_tasks",
      "indexname": "job_service_tasks_job_idx",
      "indexdef": "CREATE INDEX job_service_tasks_job_idx ON public.job_service_tasks USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "job_service_tasks",
      "indexname": "job_service_tasks_pkey",
      "indexdef": "CREATE UNIQUE INDEX job_service_tasks_pkey ON public.job_service_tasks USING btree (id)"
    },
    {
      "tablename": "job_service_tasks",
      "indexname": "s4b_uk_job_service_tasks_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_job_service_tasks_tenant_id_branch_id_id ON public.job_service_tasks USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "legacy_gate_passes_pkey",
      "indexdef": "CREATE UNIQUE INDEX legacy_gate_passes_pkey ON public.legacy_gate_passes USING btree (id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_ix_legacy_gate_passes_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_gate_passes_tenant_id ON public.legacy_gate_passes USING btree (tenant_id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_ix_legacy_gate_passes_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_gate_passes_tenant_id_branch_id ON public.legacy_gate_passes USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_ix_legacy_gate_passes_tenant_id_branch_id__7f21e123b232",
      "indexdef": "CREATE INDEX s4b_ix_legacy_gate_passes_tenant_id_branch_id__7f21e123b232 ON public.legacy_gate_passes USING btree (tenant_id, branch_id, native_document_id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_ix_legacy_gate_passes_tenant_id_branch_id_created_at_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_gate_passes_tenant_id_branch_id_created_at_id ON public.legacy_gate_passes USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_ix_legacy_gate_passes_tenant_id_branch_id_invoice_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_gate_passes_tenant_id_branch_id_invoice_id ON public.legacy_gate_passes USING btree (tenant_id, branch_id, invoice_id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_ix_legacy_gate_passes_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_gate_passes_tenant_id_branch_id_job_card_id ON public.legacy_gate_passes USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_job_3d9ee402d50a4e1a82a4_ix",
      "indexdef": "CREATE INDEX s4b_job_3d9ee402d50a4e1a82a4_ix ON public.legacy_gate_passes USING btree (tenant_id, branch_id, job_card_id, invoice_id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_uk_legacy_gate_passes_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_legacy_gate_passes_tenant_id_branch_id_id ON public.legacy_gate_passes USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "legacy_gate_passes",
      "indexname": "s4b_ux_legacy_gate_passes_tenant_id_branch_id__caba1c6dcc94",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_legacy_gate_passes_tenant_id_branch_id__caba1c6dcc94 ON public.legacy_gate_passes USING btree (tenant_id, branch_id, native_document_id) WHERE (native_document_id IS NOT NULL)"
    },
    {
      "tablename": "legacy_invoice_events",
      "indexname": "legacy_invoice_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX legacy_invoice_events_pkey ON public.legacy_invoice_events USING btree (id)"
    },
    {
      "tablename": "legacy_invoice_events",
      "indexname": "s4b_ix_legacy_invoice_events_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_invoice_events_tenant_id ON public.legacy_invoice_events USING btree (tenant_id)"
    },
    {
      "tablename": "legacy_invoice_events",
      "indexname": "s4b_ix_legacy_invoice_events_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_invoice_events_tenant_id_branch_id ON public.legacy_invoice_events USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "legacy_invoice_events",
      "indexname": "s4b_ix_legacy_invoice_events_tenant_id_branch_id_by_user",
      "indexdef": "CREATE INDEX s4b_ix_legacy_invoice_events_tenant_id_branch_id_by_user ON public.legacy_invoice_events USING btree (tenant_id, branch_id, by_user)"
    },
    {
      "tablename": "legacy_invoice_events",
      "indexname": "s4b_ix_legacy_invoice_events_tenant_id_branch_id_invoice_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_invoice_events_tenant_id_branch_id_invoice_id ON public.legacy_invoice_events USING btree (tenant_id, branch_id, invoice_id)"
    },
    {
      "tablename": "legacy_invoice_events",
      "indexname": "s4b_ix_legacy_invoice_events_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_invoice_events_tenant_id_branch_id_job_card_id ON public.legacy_invoice_events USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "legacy_invoice_events",
      "indexname": "s4b_job_d57836fb7cabf406d444_ix",
      "indexdef": "CREATE INDEX s4b_job_d57836fb7cabf406d444_ix ON public.legacy_invoice_events USING btree (tenant_id, branch_id, job_card_id, invoice_id)"
    },
    {
      "tablename": "legacy_invoice_events",
      "indexname": "s4b_uk_legacy_invoice_events_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_legacy_invoice_events_tenant_id_branch_id_id ON public.legacy_invoice_events USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "legacy_job_status_history",
      "indexname": "legacy_job_status_history_pkey",
      "indexdef": "CREATE UNIQUE INDEX legacy_job_status_history_pkey ON public.legacy_job_status_history USING btree (id)"
    },
    {
      "tablename": "legacy_job_status_history",
      "indexname": "s4b_ix_legacy_job_status_history_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_job_status_history_tenant_id ON public.legacy_job_status_history USING btree (tenant_id)"
    },
    {
      "tablename": "legacy_job_status_history",
      "indexname": "s4b_ix_legacy_job_status_history_tenant_id_bra_cf2e352f69d0",
      "indexdef": "CREATE INDEX s4b_ix_legacy_job_status_history_tenant_id_bra_cf2e352f69d0 ON public.legacy_job_status_history USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "legacy_job_status_history",
      "indexname": "s4b_ix_legacy_job_status_history_tenant_id_bra_d1c0f1dadba5",
      "indexdef": "CREATE INDEX s4b_ix_legacy_job_status_history_tenant_id_bra_d1c0f1dadba5 ON public.legacy_job_status_history USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "legacy_job_status_history",
      "indexname": "s4b_ix_legacy_job_status_history_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_job_status_history_tenant_id_branch_id ON public.legacy_job_status_history USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "legacy_job_status_history",
      "indexname": "s4b_uk_legacy_job_status_history_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_legacy_job_status_history_tenant_id_branch_id_id ON public.legacy_job_status_history USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "legacy_material_movements",
      "indexname": "legacy_material_movements_pkey",
      "indexdef": "CREATE UNIQUE INDEX legacy_material_movements_pkey ON public.legacy_material_movements USING btree (id)"
    },
    {
      "tablename": "legacy_material_movements",
      "indexname": "s4b_ix_legacy_material_movements_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_material_movements_tenant_id ON public.legacy_material_movements USING btree (tenant_id)"
    },
    {
      "tablename": "legacy_material_movements",
      "indexname": "s4b_ix_legacy_material_movements_tenant_id_bra_72e8d077064e",
      "indexdef": "CREATE INDEX s4b_ix_legacy_material_movements_tenant_id_bra_72e8d077064e ON public.legacy_material_movements USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "legacy_material_movements",
      "indexname": "s4b_ix_legacy_material_movements_tenant_id_bra_883e64166174",
      "indexdef": "CREATE INDEX s4b_ix_legacy_material_movements_tenant_id_bra_883e64166174 ON public.legacy_material_movements USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "legacy_material_movements",
      "indexname": "s4b_ix_legacy_material_movements_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_material_movements_tenant_id_branch_id ON public.legacy_material_movements USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "legacy_material_movements",
      "indexname": "s4b_ix_legacy_material_movements_tenant_id_branch_id_item_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_material_movements_tenant_id_branch_id_item_id ON public.legacy_material_movements USING btree (tenant_id, branch_id, item_id)"
    },
    {
      "tablename": "legacy_material_movements",
      "indexname": "s4b_uk_legacy_material_movements_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_legacy_material_movements_tenant_id_branch_id_id ON public.legacy_material_movements USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "legacy_receipts_pkey",
      "indexdef": "CREATE UNIQUE INDEX legacy_receipts_pkey ON public.legacy_receipts USING btree (id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_ix_legacy_receipts_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_receipts_tenant_id ON public.legacy_receipts USING btree (tenant_id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_ix_legacy_receipts_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_receipts_tenant_id_branch_id ON public.legacy_receipts USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_ix_legacy_receipts_tenant_id_branch_id_created_at_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_receipts_tenant_id_branch_id_created_at_id ON public.legacy_receipts USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_ix_legacy_receipts_tenant_id_branch_id_invoice_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_receipts_tenant_id_branch_id_invoice_id ON public.legacy_receipts USING btree (tenant_id, branch_id, invoice_id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_ix_legacy_receipts_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_legacy_receipts_tenant_id_branch_id_job_card_id ON public.legacy_receipts USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_ix_legacy_receipts_tenant_id_branch_id_nat_f6cb08e2c6ca",
      "indexdef": "CREATE INDEX s4b_ix_legacy_receipts_tenant_id_branch_id_nat_f6cb08e2c6ca ON public.legacy_receipts USING btree (tenant_id, branch_id, native_document_id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_job_85280abab948c0f7032e_ix",
      "indexdef": "CREATE INDEX s4b_job_85280abab948c0f7032e_ix ON public.legacy_receipts USING btree (tenant_id, branch_id, job_card_id, invoice_id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_uk_legacy_receipts_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_legacy_receipts_tenant_id_branch_id_id ON public.legacy_receipts USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "legacy_receipts",
      "indexname": "s4b_ux_legacy_receipts_tenant_id_branch_id_nat_d0dab92c9bc5",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_legacy_receipts_tenant_id_branch_id_nat_d0dab92c9bc5 ON public.legacy_receipts USING btree (tenant_id, branch_id, native_document_id) WHERE (native_document_id IS NOT NULL)"
    },
    {
      "tablename": "local_purchases",
      "indexname": "local_purchases_pkey",
      "indexdef": "CREATE UNIQUE INDEX local_purchases_pkey ON public.local_purchases USING btree (id)"
    },
    {
      "tablename": "local_purchases",
      "indexname": "s4b_ix_local_purchases_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_local_purchases_tenant_id ON public.local_purchases USING btree (tenant_id)"
    },
    {
      "tablename": "local_purchases",
      "indexname": "s4b_ix_local_purchases_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_local_purchases_tenant_id_branch_id ON public.local_purchases USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "local_purchases",
      "indexname": "s4b_ix_local_purchases_tenant_id_branch_id_created_at_id",
      "indexdef": "CREATE INDEX s4b_ix_local_purchases_tenant_id_branch_id_created_at_id ON public.local_purchases USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "local_purchases",
      "indexname": "s4b_ix_local_purchases_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_local_purchases_tenant_id_branch_id_job_card_id ON public.local_purchases USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "local_purchases",
      "indexname": "s4b_job_f7830977d826e9a8f94f",
      "indexdef": "CREATE UNIQUE INDEX s4b_job_f7830977d826e9a8f94f ON public.local_purchases USING btree (tenant_id, branch_id, job_card_id, id)"
    },
    {
      "tablename": "local_purchases",
      "indexname": "s4b_uk_local_purchases_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_local_purchases_tenant_id_branch_id_id ON public.local_purchases USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "material_approval_events",
      "indexname": "material_approval_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX material_approval_events_pkey ON public.material_approval_events USING btree (id)"
    },
    {
      "tablename": "material_approval_events",
      "indexname": "s4b_ix_material_approval_events_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_material_approval_events_tenant_id ON public.material_approval_events USING btree (tenant_id)"
    },
    {
      "tablename": "material_approval_events",
      "indexname": "s4b_ix_material_approval_events_tenant_id_bran_2d5d21555b07",
      "indexdef": "CREATE INDEX s4b_ix_material_approval_events_tenant_id_bran_2d5d21555b07 ON public.material_approval_events USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "material_approval_events",
      "indexname": "s4b_ix_material_approval_events_tenant_id_bran_8ae3ed0127e2",
      "indexdef": "CREATE INDEX s4b_ix_material_approval_events_tenant_id_bran_8ae3ed0127e2 ON public.material_approval_events USING btree (tenant_id, branch_id, approval_id)"
    },
    {
      "tablename": "material_approval_events",
      "indexname": "s4b_ix_material_approval_events_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_material_approval_events_tenant_id_branch_id ON public.material_approval_events USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "material_approval_events",
      "indexname": "s4b_ix_material_approval_events_tenant_id_branch_id_actor_id",
      "indexdef": "CREATE INDEX s4b_ix_material_approval_events_tenant_id_branch_id_actor_id ON public.material_approval_events USING btree (tenant_id, branch_id, actor_id)"
    },
    {
      "tablename": "material_approval_events",
      "indexname": "s4b_job_42a5adf13bece540a211_ix",
      "indexdef": "CREATE INDEX s4b_job_42a5adf13bece540a211_ix ON public.material_approval_events USING btree (tenant_id, branch_id, job_card_id, approval_id)"
    },
    {
      "tablename": "material_approval_events",
      "indexname": "s4b_uk_material_approval_events_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_material_approval_events_tenant_id_branch_id_id ON public.material_approval_events USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "material_approvals_pkey",
      "indexdef": "CREATE UNIQUE INDEX material_approvals_pkey ON public.material_approvals USING btree (id)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "s4b_ix_material_approvals_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_material_approvals_tenant_id ON public.material_approvals USING btree (tenant_id)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "s4b_ix_material_approvals_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_material_approvals_tenant_id_branch_id ON public.material_approvals USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "s4b_ix_material_approvals_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_material_approvals_tenant_id_branch_id_job_card_id ON public.material_approvals USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "s4b_ix_material_approvals_tenant_id_branch_id_reviewed_by",
      "indexdef": "CREATE INDEX s4b_ix_material_approvals_tenant_id_branch_id_reviewed_by ON public.material_approvals USING btree (tenant_id, branch_id, reviewed_by)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "s4b_ix_material_approvals_tenant_id_branch_id_submitted_by",
      "indexdef": "CREATE INDEX s4b_ix_material_approvals_tenant_id_branch_id_submitted_by ON public.material_approvals USING btree (tenant_id, branch_id, submitted_by)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "s4b_job_c6ca7e3c9f00ed5449bf",
      "indexdef": "CREATE UNIQUE INDEX s4b_job_c6ca7e3c9f00ed5449bf ON public.material_approvals USING btree (tenant_id, branch_id, job_card_id, id)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "s4b_uk_material_approvals_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_material_approvals_tenant_id_branch_id_id ON public.material_approvals USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "material_approvals",
      "indexname": "s4b_ux_material_approvals_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_material_approvals_tenant_id_branch_id_job_card_id ON public.material_approvals USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "material_events",
      "indexname": "material_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX material_events_pkey ON public.material_events USING btree (id)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_ix_material_events_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_material_events_tenant_id ON public.material_events USING btree (tenant_id)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_ix_material_events_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_material_events_tenant_id_branch_id ON public.material_events USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_ix_material_events_tenant_id_branch_id_by_user",
      "indexdef": "CREATE INDEX s4b_ix_material_events_tenant_id_branch_id_by_user ON public.material_events USING btree (tenant_id, branch_id, by_user)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_ix_material_events_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_material_events_tenant_id_branch_id_job_card_id ON public.material_events USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_ix_material_events_tenant_id_branch_id_material_row_id",
      "indexdef": "CREATE INDEX s4b_ix_material_events_tenant_id_branch_id_material_row_id ON public.material_events USING btree (tenant_id, branch_id, material_row_id)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_ix_material_events_tenant_id_branch_id_new_item_id",
      "indexdef": "CREATE INDEX s4b_ix_material_events_tenant_id_branch_id_new_item_id ON public.material_events USING btree (tenant_id, branch_id, new_item_id)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_ix_material_events_tenant_id_branch_id_old_item_id",
      "indexdef": "CREATE INDEX s4b_ix_material_events_tenant_id_branch_id_old_item_id ON public.material_events USING btree (tenant_id, branch_id, old_item_id)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_job_c219f4aabc83b6a94674_ix",
      "indexdef": "CREATE INDEX s4b_job_c219f4aabc83b6a94674_ix ON public.material_events USING btree (tenant_id, branch_id, job_card_id, material_row_id)"
    },
    {
      "tablename": "material_events",
      "indexname": "s4b_uk_material_events_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_material_events_tenant_id_branch_id_id ON public.material_events USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "material_ledger",
      "indexname": "material_ledger_job_idx",
      "indexdef": "CREATE INDEX material_ledger_job_idx ON public.material_ledger USING btree (tenant_id, branch_id, job_card_id, created_at DESC)"
    },
    {
      "tablename": "material_ledger",
      "indexname": "material_ledger_one_reserve",
      "indexdef": "CREATE UNIQUE INDEX material_ledger_one_reserve ON public.material_ledger USING btree (reservation_id) WHERE (entry_type = 'RESERVE'::text)"
    },
    {
      "tablename": "material_ledger",
      "indexname": "material_ledger_pkey",
      "indexdef": "CREATE UNIQUE INDEX material_ledger_pkey ON public.material_ledger USING btree (id)"
    },
    {
      "tablename": "material_ledger",
      "indexname": "material_ledger_reservation_idx",
      "indexdef": "CREATE INDEX material_ledger_reservation_idx ON public.material_ledger USING btree (tenant_id, branch_id, reservation_id, id)"
    },
    {
      "tablename": "material_ledger",
      "indexname": "material_ledger_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX material_ledger_tenant_id_branch_id_id_key ON public.material_ledger USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "material_purchase_requests_pkey",
      "indexdef": "CREATE UNIQUE INDEX material_purchase_requests_pkey ON public.material_purchase_requests USING btree (id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_ix_material_purchase_requests_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_material_purchase_requests_tenant_id ON public.material_purchase_requests USING btree (tenant_id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_ix_material_purchase_requests_tenant_id_br_168d58e28d64",
      "indexdef": "CREATE INDEX s4b_ix_material_purchase_requests_tenant_id_br_168d58e28d64 ON public.material_purchase_requests USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_ix_material_purchase_requests_tenant_id_br_4ea9943ee60d",
      "indexdef": "CREATE INDEX s4b_ix_material_purchase_requests_tenant_id_br_4ea9943ee60d ON public.material_purchase_requests USING btree (tenant_id, branch_id, completed_by)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_ix_material_purchase_requests_tenant_id_br_abf09b8e9b35",
      "indexdef": "CREATE INDEX s4b_ix_material_purchase_requests_tenant_id_br_abf09b8e9b35 ON public.material_purchase_requests USING btree (tenant_id, branch_id, mapped_inventory_item_id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_ix_material_purchase_requests_tenant_id_br_b73e85ac112c",
      "indexdef": "CREATE INDEX s4b_ix_material_purchase_requests_tenant_id_br_b73e85ac112c ON public.material_purchase_requests USING btree (tenant_id, branch_id, local_purchase_id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_ix_material_purchase_requests_tenant_id_br_e9cae1b3ce38",
      "indexdef": "CREATE INDEX s4b_ix_material_purchase_requests_tenant_id_br_e9cae1b3ce38 ON public.material_purchase_requests USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_ix_material_purchase_requests_tenant_id_br_f92bf756e7fc",
      "indexdef": "CREATE INDEX s4b_ix_material_purchase_requests_tenant_id_br_f92bf756e7fc ON public.material_purchase_requests USING btree (tenant_id, branch_id, material_request_id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_ix_material_purchase_requests_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_material_purchase_requests_tenant_id_branch_id ON public.material_purchase_requests USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_job_1af3d8d525651d455bc0_ix",
      "indexdef": "CREATE INDEX s4b_job_1af3d8d525651d455bc0_ix ON public.material_purchase_requests USING btree (tenant_id, branch_id, job_card_id, material_request_id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_job_96efb2ddb955f6a75c44_ix",
      "indexdef": "CREATE INDEX s4b_job_96efb2ddb955f6a75c44_ix ON public.material_purchase_requests USING btree (tenant_id, branch_id, job_card_id, local_purchase_id)"
    },
    {
      "tablename": "material_purchase_requests",
      "indexname": "s4b_uk_material_purchase_requests_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_material_purchase_requests_tenant_id_branch_id_id ON public.material_purchase_requests USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "material_requests_pkey",
      "indexdef": "CREATE UNIQUE INDEX material_requests_pkey ON public.material_requests USING btree (id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_ix_material_requests_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_material_requests_tenant_id ON public.material_requests USING btree (tenant_id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_ix_material_requests_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_material_requests_tenant_id_branch_id ON public.material_requests USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_ix_material_requests_tenant_id_branch_id_created_at_id",
      "indexdef": "CREATE INDEX s4b_ix_material_requests_tenant_id_branch_id_created_at_id ON public.material_requests USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_ix_material_requests_tenant_id_branch_id_invoiced_in",
      "indexdef": "CREATE INDEX s4b_ix_material_requests_tenant_id_branch_id_invoiced_in ON public.material_requests USING btree (tenant_id, branch_id, invoiced_in)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_ix_material_requests_tenant_id_branch_id_item_id",
      "indexdef": "CREATE INDEX s4b_ix_material_requests_tenant_id_branch_id_item_id ON public.material_requests USING btree (tenant_id, branch_id, item_id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_ix_material_requests_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_material_requests_tenant_id_branch_id_job_card_id ON public.material_requests USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_ix_material_requests_tenant_id_branch_id_reservation_id",
      "indexdef": "CREATE INDEX s4b_ix_material_requests_tenant_id_branch_id_reservation_id ON public.material_requests USING btree (tenant_id, branch_id, reservation_id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_job_1965087bc3f1a6683300",
      "indexdef": "CREATE UNIQUE INDEX s4b_job_1965087bc3f1a6683300 ON public.material_requests USING btree (tenant_id, branch_id, job_card_id, id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_job_ebd9cfe502fe03bcd243_ix",
      "indexdef": "CREATE INDEX s4b_job_ebd9cfe502fe03bcd243_ix ON public.material_requests USING btree (tenant_id, branch_id, job_card_id, invoiced_in)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_uk_material_requests_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_material_requests_tenant_id_branch_id_id ON public.material_requests USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "material_requests",
      "indexname": "s4b_ux_material_requests_tenant_id_branch_id_reservation_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_material_requests_tenant_id_branch_id_reservation_id ON public.material_requests USING btree (tenant_id, branch_id, reservation_id) WHERE ((reservation_id IS NOT NULL) AND (archived_at IS NULL))"
    },
    {
      "tablename": "material_reservations",
      "indexname": "material_reservations_idempotency_key",
      "indexdef": "CREATE UNIQUE INDEX material_reservations_idempotency_key ON public.material_reservations USING btree (tenant_id, job_card_id, request_key) WHERE (request_key IS NOT NULL)"
    },
    {
      "tablename": "material_reservations",
      "indexname": "material_reservations_item_open_idx",
      "indexdef": "CREATE INDEX material_reservations_item_open_idx ON public.material_reservations USING btree (tenant_id, branch_id, item_id) WHERE (status <> 'RELEASED'::text)"
    },
    {
      "tablename": "material_reservations",
      "indexname": "material_reservations_job_idx",
      "indexdef": "CREATE INDEX material_reservations_job_idx ON public.material_reservations USING btree (tenant_id, branch_id, job_card_id, created_at DESC)"
    },
    {
      "tablename": "material_reservations",
      "indexname": "material_reservations_pkey",
      "indexdef": "CREATE UNIQUE INDEX material_reservations_pkey ON public.material_reservations USING btree (id)"
    },
    {
      "tablename": "material_reservations",
      "indexname": "material_reservations_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX material_reservations_tenant_id_branch_id_id_key ON public.material_reservations USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "material_shortages",
      "indexname": "material_shortages_pkey",
      "indexdef": "CREATE UNIQUE INDEX material_shortages_pkey ON public.material_shortages USING btree (id)"
    },
    {
      "tablename": "material_shortages",
      "indexname": "material_shortages_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX material_shortages_tenant_id_branch_id_id_key ON public.material_shortages USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "membership_branches",
      "indexname": "membership_branches_pkey",
      "indexdef": "CREATE UNIQUE INDEX membership_branches_pkey ON public.membership_branches USING btree (membership_id, branch_id)"
    },
    {
      "tablename": "membership_roles",
      "indexname": "membership_roles_pkey",
      "indexdef": "CREATE UNIQUE INDEX membership_roles_pkey ON public.membership_roles USING btree (membership_id, role_id)"
    },
    {
      "tablename": "object_assets",
      "indexname": "object_assets_pkey",
      "indexdef": "CREATE UNIQUE INDEX object_assets_pkey ON public.object_assets USING btree (id)"
    },
    {
      "tablename": "object_assets",
      "indexname": "s4b_ix_object_assets_created_by",
      "indexdef": "CREATE INDEX s4b_ix_object_assets_created_by ON public.object_assets USING btree (created_by)"
    },
    {
      "tablename": "object_assets",
      "indexname": "s4b_ix_object_assets_state_created_at",
      "indexdef": "CREATE INDEX s4b_ix_object_assets_state_created_at ON public.object_assets USING btree (state, created_at)"
    },
    {
      "tablename": "object_assets",
      "indexname": "s4b_ix_object_assets_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_object_assets_tenant_id ON public.object_assets USING btree (tenant_id)"
    },
    {
      "tablename": "object_assets",
      "indexname": "s4b_ix_object_assets_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_object_assets_tenant_id_branch_id ON public.object_assets USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "object_assets",
      "indexname": "s4b_uk_object_assets_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_object_assets_tenant_id_branch_id_id ON public.object_assets USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "object_assets",
      "indexname": "s4b_ux_object_assets_tenant_id_storage_key",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_object_assets_tenant_id_storage_key ON public.object_assets USING btree (tenant_id, storage_key)"
    },
    {
      "tablename": "outbox_events",
      "indexname": "outbox_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX outbox_events_pkey ON public.outbox_events USING btree (id)"
    },
    {
      "tablename": "outbox_events",
      "indexname": "s4b_ix_outbox_events_status_next_attempt_at",
      "indexdef": "CREATE INDEX s4b_ix_outbox_events_status_next_attempt_at ON public.outbox_events USING btree (status, next_attempt_at)"
    },
    {
      "tablename": "outbox_events",
      "indexname": "s4b_ix_outbox_events_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_outbox_events_tenant_id ON public.outbox_events USING btree (tenant_id)"
    },
    {
      "tablename": "outbox_events",
      "indexname": "s4b_ix_outbox_events_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_outbox_events_tenant_id_branch_id ON public.outbox_events USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "outbox_events",
      "indexname": "s4b_uk_outbox_events_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_outbox_events_tenant_id_branch_id_id ON public.outbox_events USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "outbox_events",
      "indexname": "s4b_ux_outbox_events_tenant_id_event_key",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_outbox_events_tenant_id_event_key ON public.outbox_events USING btree (tenant_id, event_key)"
    },
    {
      "tablename": "payments",
      "indexname": "payments_invoice_id_request_key_key",
      "indexdef": "CREATE UNIQUE INDEX payments_invoice_id_request_key_key ON public.payments USING btree (invoice_id, request_key)"
    },
    {
      "tablename": "payments",
      "indexname": "payments_invoice_idx",
      "indexdef": "CREATE INDEX payments_invoice_idx ON public.payments USING btree (tenant_id, branch_id, invoice_id, created_at)"
    },
    {
      "tablename": "payments",
      "indexname": "payments_pkey",
      "indexdef": "CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id)"
    },
    {
      "tablename": "payments",
      "indexname": "payments_receipt_document_id_key",
      "indexdef": "CREATE UNIQUE INDEX payments_receipt_document_id_key ON public.payments USING btree (receipt_document_id)"
    },
    {
      "tablename": "payments",
      "indexname": "payments_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX payments_tenant_id_branch_id_id_key ON public.payments USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "payments",
      "indexname": "s4b_ix_payments_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_payments_tenant_id_branch_id_job_card_id ON public.payments USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "platform_billing",
      "indexname": "platform_billing_pkey",
      "indexdef": "CREATE UNIQUE INDEX platform_billing_pkey ON public.platform_billing USING btree (tenant_id)"
    },
    {
      "tablename": "platform_users",
      "indexname": "platform_users_cognito_subject_key",
      "indexdef": "CREATE UNIQUE INDEX platform_users_cognito_subject_key ON public.platform_users USING btree (cognito_subject)"
    },
    {
      "tablename": "platform_users",
      "indexname": "platform_users_pkey",
      "indexdef": "CREATE UNIQUE INDEX platform_users_pkey ON public.platform_users USING btree (id)"
    },
    {
      "tablename": "purchase_order_delivery_confirmations",
      "indexname": "purchase_order_delivery_confi_purchase_order_id_purchase_or_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_confi_purchase_order_id_purchase_or_key ON public.purchase_order_delivery_confirmations USING btree (purchase_order_id, purchase_order_line_id)"
    },
    {
      "tablename": "purchase_order_delivery_confirmations",
      "indexname": "purchase_order_delivery_confirmation_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_confirmation_tenant_id_branch_id_id_key ON public.purchase_order_delivery_confirmations USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_order_delivery_confirmations",
      "indexname": "purchase_order_delivery_confirmations_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_confirmations_pkey ON public.purchase_order_delivery_confirmations USING btree (id)"
    },
    {
      "tablename": "purchase_order_delivery_receipt_lines",
      "indexname": "purchase_order_delivery_recei_receipt_id_purchase_order_lin_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_recei_receipt_id_purchase_order_lin_key ON public.purchase_order_delivery_receipt_lines USING btree (receipt_id, purchase_order_line_id)"
    },
    {
      "tablename": "purchase_order_delivery_receipt_lines",
      "indexname": "purchase_order_delivery_receipt_line_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_receipt_line_tenant_id_branch_id_id_key ON public.purchase_order_delivery_receipt_lines USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_order_delivery_receipt_lines",
      "indexname": "purchase_order_delivery_receipt_lines_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_receipt_lines_pkey ON public.purchase_order_delivery_receipt_lines USING btree (id)"
    },
    {
      "tablename": "purchase_order_delivery_receipts",
      "indexname": "purchase_order_delivery_recei_purchase_order_id_request_key_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_recei_purchase_order_id_request_key_key ON public.purchase_order_delivery_receipts USING btree (purchase_order_id, request_key)"
    },
    {
      "tablename": "purchase_order_delivery_receipts",
      "indexname": "purchase_order_delivery_receipts_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_receipts_pkey ON public.purchase_order_delivery_receipts USING btree (id)"
    },
    {
      "tablename": "purchase_order_delivery_receipts",
      "indexname": "purchase_order_delivery_receipts_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_delivery_receipts_tenant_id_branch_id_id_key ON public.purchase_order_delivery_receipts USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_order_lines",
      "indexname": "purchase_order_lines_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_lines_pkey ON public.purchase_order_lines USING btree (id)"
    },
    {
      "tablename": "purchase_order_lines",
      "indexname": "purchase_order_lines_purchase_order_id_line_no_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_lines_purchase_order_id_line_no_key ON public.purchase_order_lines USING btree (purchase_order_id, line_no)"
    },
    {
      "tablename": "purchase_order_lines",
      "indexname": "purchase_order_lines_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_lines_tenant_id_branch_id_id_key ON public.purchase_order_lines USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_order_lines",
      "indexname": "s4b_ix_purchase_order_lines_tenant_id_branch_i_7d55ede9343d",
      "indexdef": "CREATE INDEX s4b_ix_purchase_order_lines_tenant_id_branch_i_7d55ede9343d ON public.purchase_order_lines USING btree (tenant_id, branch_id, source_purchase_order_line_id)"
    },
    {
      "tablename": "purchase_order_quotations",
      "indexname": "purchase_order_quotations_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_order_quotations_pkey ON public.purchase_order_quotations USING btree (id)"
    },
    {
      "tablename": "purchase_order_quotations",
      "indexname": "s4b_ix_purchase_order_quotations_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_purchase_order_quotations_tenant_id ON public.purchase_order_quotations USING btree (tenant_id)"
    },
    {
      "tablename": "purchase_order_quotations",
      "indexname": "s4b_ix_purchase_order_quotations_tenant_id_bra_1f502bda7be8",
      "indexdef": "CREATE INDEX s4b_ix_purchase_order_quotations_tenant_id_bra_1f502bda7be8 ON public.purchase_order_quotations USING btree (tenant_id, branch_id, purchase_order_id)"
    },
    {
      "tablename": "purchase_order_quotations",
      "indexname": "s4b_ix_purchase_order_quotations_tenant_id_bra_33268beaad28",
      "indexdef": "CREATE INDEX s4b_ix_purchase_order_quotations_tenant_id_bra_33268beaad28 ON public.purchase_order_quotations USING btree (tenant_id, branch_id, purchase_order_line_id)"
    },
    {
      "tablename": "purchase_order_quotations",
      "indexname": "s4b_ix_purchase_order_quotations_tenant_id_bra_5e4ee9088896",
      "indexdef": "CREATE INDEX s4b_ix_purchase_order_quotations_tenant_id_bra_5e4ee9088896 ON public.purchase_order_quotations USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "purchase_order_quotations",
      "indexname": "s4b_ix_purchase_order_quotations_tenant_id_bra_e1c84b503328",
      "indexdef": "CREATE INDEX s4b_ix_purchase_order_quotations_tenant_id_bra_e1c84b503328 ON public.purchase_order_quotations USING btree (tenant_id, branch_id, created_by)"
    },
    {
      "tablename": "purchase_order_quotations",
      "indexname": "s4b_ix_purchase_order_quotations_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_purchase_order_quotations_tenant_id_branch_id ON public.purchase_order_quotations USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "purchase_order_quotations",
      "indexname": "s4b_uk_purchase_order_quotations_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_purchase_order_quotations_tenant_id_branch_id_id ON public.purchase_order_quotations USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_orders",
      "indexname": "purchase_orders_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_orders_pkey ON public.purchase_orders USING btree (id)"
    },
    {
      "tablename": "purchase_orders",
      "indexname": "purchase_orders_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_orders_tenant_id_branch_id_id_key ON public.purchase_orders USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_orders",
      "indexname": "purchase_orders_tenant_id_branch_id_po_number_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_orders_tenant_id_branch_id_po_number_key ON public.purchase_orders USING btree (tenant_id, branch_id, po_number)"
    },
    {
      "tablename": "purchase_orders",
      "indexname": "s4b_ix_purchase_orders_tenant_id_branch_id_sou_573693b01f59",
      "indexdef": "CREATE INDEX s4b_ix_purchase_orders_tenant_id_branch_id_sou_573693b01f59 ON public.purchase_orders USING btree (tenant_id, branch_id, source_purchase_order_id)"
    },
    {
      "tablename": "purchase_request_events",
      "indexname": "purchase_request_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_events_pkey ON public.purchase_request_events USING btree (id)"
    },
    {
      "tablename": "purchase_request_events",
      "indexname": "purchase_request_events_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_events_tenant_id_branch_id_id_key ON public.purchase_request_events USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_request_lines",
      "indexname": "purchase_request_lines_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_lines_pkey ON public.purchase_request_lines USING btree (id)"
    },
    {
      "tablename": "purchase_request_lines",
      "indexname": "purchase_request_lines_purchase_request_id_line_no_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_lines_purchase_request_id_line_no_key ON public.purchase_request_lines USING btree (purchase_request_id, line_no)"
    },
    {
      "tablename": "purchase_request_lines",
      "indexname": "purchase_request_lines_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_lines_tenant_id_branch_id_id_key ON public.purchase_request_lines USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_request_purchase_orders",
      "indexname": "purchase_request_purchase_orders_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_purchase_orders_pkey ON public.purchase_request_purchase_orders USING btree (purchase_request_id, purchase_order_id)"
    },
    {
      "tablename": "purchase_request_quotes",
      "indexname": "purchase_request_quotes_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_quotes_pkey ON public.purchase_request_quotes USING btree (id)"
    },
    {
      "tablename": "purchase_request_quotes",
      "indexname": "purchase_request_quotes_purchase_request_line_id_supplier_i_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_quotes_purchase_request_line_id_supplier_i_key ON public.purchase_request_quotes USING btree (purchase_request_line_id, supplier_id)"
    },
    {
      "tablename": "purchase_request_quotes",
      "indexname": "purchase_request_quotes_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_request_quotes_tenant_id_branch_id_id_key ON public.purchase_request_quotes USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_requests",
      "indexname": "purchase_requests_pkey",
      "indexdef": "CREATE UNIQUE INDEX purchase_requests_pkey ON public.purchase_requests USING btree (id)"
    },
    {
      "tablename": "purchase_requests",
      "indexname": "purchase_requests_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_requests_tenant_id_branch_id_id_key ON public.purchase_requests USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "purchase_requests",
      "indexname": "purchase_requests_tenant_id_branch_id_request_number_key",
      "indexdef": "CREATE UNIQUE INDEX purchase_requests_tenant_id_branch_id_request_number_key ON public.purchase_requests USING btree (tenant_id, branch_id, request_number)"
    },
    {
      "tablename": "qc_checks",
      "indexname": "qc_checks_pkey",
      "indexdef": "CREATE UNIQUE INDEX qc_checks_pkey ON public.qc_checks USING btree (id)"
    },
    {
      "tablename": "qc_results",
      "indexname": "qc_results_pkey",
      "indexdef": "CREATE UNIQUE INDEX qc_results_pkey ON public.qc_results USING btree (id)"
    },
    {
      "tablename": "quotation_lines",
      "indexname": "quotation_lines_pkey",
      "indexdef": "CREATE UNIQUE INDEX quotation_lines_pkey ON public.quotation_lines USING btree (id)"
    },
    {
      "tablename": "quotation_lines",
      "indexname": "quotation_lines_quotation_id_line_no_key",
      "indexdef": "CREATE UNIQUE INDEX quotation_lines_quotation_id_line_no_key ON public.quotation_lines USING btree (quotation_id, line_no)"
    },
    {
      "tablename": "quotations",
      "indexname": "quotations_pkey",
      "indexdef": "CREATE UNIQUE INDEX quotations_pkey ON public.quotations USING btree (id)"
    },
    {
      "tablename": "quotations",
      "indexname": "quotations_scope_idx",
      "indexdef": "CREATE INDEX quotations_scope_idx ON public.quotations USING btree (tenant_id, branch_id, status, valid_until, created_at DESC)"
    },
    {
      "tablename": "quotations",
      "indexname": "quotations_tenant_id_quotation_no_key",
      "indexdef": "CREATE UNIQUE INDEX quotations_tenant_id_quotation_no_key ON public.quotations USING btree (tenant_id, quotation_no)"
    },
    {
      "tablename": "refunds",
      "indexname": "refunds_credit_note_id_request_key_key",
      "indexdef": "CREATE UNIQUE INDEX refunds_credit_note_id_request_key_key ON public.refunds USING btree (credit_note_id, request_key)"
    },
    {
      "tablename": "refunds",
      "indexname": "refunds_credit_note_idx",
      "indexdef": "CREATE INDEX refunds_credit_note_idx ON public.refunds USING btree (tenant_id, branch_id, credit_note_id, created_at)"
    },
    {
      "tablename": "refunds",
      "indexname": "refunds_pkey",
      "indexdef": "CREATE UNIQUE INDEX refunds_pkey ON public.refunds USING btree (id)"
    },
    {
      "tablename": "refunds",
      "indexname": "refunds_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX refunds_tenant_id_branch_id_id_key ON public.refunds USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "report_template_versions",
      "indexname": "report_template_versions_pkey",
      "indexdef": "CREATE UNIQUE INDEX report_template_versions_pkey ON public.report_template_versions USING btree (id)"
    },
    {
      "tablename": "report_template_versions",
      "indexname": "s4b_ix_report_template_versions_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_report_template_versions_tenant_id ON public.report_template_versions USING btree (tenant_id)"
    },
    {
      "tablename": "report_template_versions",
      "indexname": "s4b_uk_report_template_versions_tenant_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_report_template_versions_tenant_id_id ON public.report_template_versions USING btree (tenant_id, id)"
    },
    {
      "tablename": "report_template_versions",
      "indexname": "s4b_ux_report_template_versions_tenant_id_category",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_report_template_versions_tenant_id_category ON public.report_template_versions USING btree (tenant_id, category) WHERE (active AND (archived_at IS NULL))"
    },
    {
      "tablename": "report_template_versions",
      "indexname": "s4b_ux_report_template_versions_tenant_id_temp_a3c6bf79b9ff",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_report_template_versions_tenant_id_temp_a3c6bf79b9ff ON public.report_template_versions USING btree (tenant_id, template_key, version)"
    },
    {
      "tablename": "role_permissions",
      "indexname": "role_permissions_pkey",
      "indexdef": "CREATE UNIQUE INDEX role_permissions_pkey ON public.role_permissions USING btree (role_id, permission)"
    },
    {
      "tablename": "sales_leads",
      "indexname": "sales_leads_pkey",
      "indexdef": "CREATE UNIQUE INDEX sales_leads_pkey ON public.sales_leads USING btree (id)"
    },
    {
      "tablename": "sales_leads",
      "indexname": "sales_leads_scope_idx",
      "indexdef": "CREATE INDEX sales_leads_scope_idx ON public.sales_leads USING btree (tenant_id, branch_id, stage, temperature, created_at DESC)"
    },
    {
      "tablename": "service_advisor_teams",
      "indexname": "service_advisor_teams_pkey",
      "indexdef": "CREATE UNIQUE INDEX service_advisor_teams_pkey ON public.service_advisor_teams USING btree (tenant_id, branch_id, advisor_membership_id)"
    },
    {
      "tablename": "service_brands",
      "indexname": "s4b_ix_service_brands_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_service_brands_tenant_id ON public.service_brands USING btree (tenant_id)"
    },
    {
      "tablename": "service_brands",
      "indexname": "s4b_ix_service_brands_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_service_brands_tenant_id_branch_id ON public.service_brands USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "service_brands",
      "indexname": "s4b_ix_service_brands_tenant_id_branch_id_created_at_id",
      "indexdef": "CREATE INDEX s4b_ix_service_brands_tenant_id_branch_id_created_at_id ON public.service_brands USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "service_brands",
      "indexname": "s4b_uk_service_brands_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_service_brands_tenant_id_branch_id_id ON public.service_brands USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "service_brands",
      "indexname": "s4b_ux_service_brands_tenant_id_branch_id_name",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_service_brands_tenant_id_branch_id_name ON public.service_brands USING btree (tenant_id, branch_id, name)"
    },
    {
      "tablename": "service_brands",
      "indexname": "service_brands_pkey",
      "indexdef": "CREATE UNIQUE INDEX service_brands_pkey ON public.service_brands USING btree (id)"
    },
    {
      "tablename": "service_department_managers",
      "indexname": "service_department_managers_pkey",
      "indexdef": "CREATE UNIQUE INDEX service_department_managers_pkey ON public.service_department_managers USING btree (department_id, manager_membership_id)"
    },
    {
      "tablename": "service_departments",
      "indexname": "service_departments_pkey",
      "indexdef": "CREATE UNIQUE INDEX service_departments_pkey ON public.service_departments USING btree (id)"
    },
    {
      "tablename": "service_departments",
      "indexname": "service_departments_tenant_id_branch_id_name_key",
      "indexdef": "CREATE UNIQUE INDEX service_departments_tenant_id_branch_id_name_key ON public.service_departments USING btree (tenant_id, branch_id, name)"
    },
    {
      "tablename": "service_task_catalog",
      "indexname": "s4b_ix_service_task_catalog_tenant_id_branch_i_7d05220c3103",
      "indexdef": "CREATE INDEX s4b_ix_service_task_catalog_tenant_id_branch_i_7d05220c3103 ON public.service_task_catalog USING btree (tenant_id, branch_id, car_segment_id)"
    },
    {
      "tablename": "service_task_catalog",
      "indexname": "s4b_ix_service_task_catalog_tenant_id_branch_id_brand_id",
      "indexdef": "CREATE INDEX s4b_ix_service_task_catalog_tenant_id_branch_id_brand_id ON public.service_task_catalog USING btree (tenant_id, branch_id, brand_id)"
    },
    {
      "tablename": "service_task_catalog",
      "indexname": "service_task_catalog_pkey",
      "indexdef": "CREATE UNIQUE INDEX service_task_catalog_pkey ON public.service_task_catalog USING btree (id)"
    },
    {
      "tablename": "service_task_catalog",
      "indexname": "service_task_catalog_scope_idx",
      "indexdef": "CREATE INDEX service_task_catalog_scope_idx ON public.service_task_catalog USING btree (tenant_id, branch_id, status, name)"
    },
    {
      "tablename": "stock_inwards",
      "indexname": "s4b_ix_stock_inwards_tenant_id_branch_id_ledger_id",
      "indexdef": "CREATE INDEX s4b_ix_stock_inwards_tenant_id_branch_id_ledger_id ON public.stock_inwards USING btree (tenant_id, branch_id, ledger_id)"
    },
    {
      "tablename": "stock_inwards",
      "indexname": "stock_inwards_delivery_confirmation_id_key",
      "indexdef": "CREATE UNIQUE INDEX stock_inwards_delivery_confirmation_id_key ON public.stock_inwards USING btree (delivery_confirmation_id)"
    },
    {
      "tablename": "stock_inwards",
      "indexname": "stock_inwards_pkey",
      "indexdef": "CREATE UNIQUE INDEX stock_inwards_pkey ON public.stock_inwards USING btree (id)"
    },
    {
      "tablename": "stock_inwards",
      "indexname": "stock_inwards_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX stock_inwards_tenant_id_branch_id_id_key ON public.stock_inwards USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "s4b_ix_stock_ledger_tenant_id_branch_id_by_user",
      "indexdef": "CREATE INDEX s4b_ix_stock_ledger_tenant_id_branch_id_by_user ON public.stock_ledger USING btree (tenant_id, branch_id, by_user)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "s4b_ix_stock_ledger_tenant_id_branch_id_inward_a918e679e28d",
      "indexdef": "CREATE INDEX s4b_ix_stock_ledger_tenant_id_branch_id_inward_a918e679e28d ON public.stock_ledger USING btree (tenant_id, branch_id, inward_purchase_line_id)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "s4b_ix_stock_ledger_tenant_id_branch_id_job_card_id",
      "indexdef": "CREATE INDEX s4b_ix_stock_ledger_tenant_id_branch_id_job_card_id ON public.stock_ledger USING btree (tenant_id, branch_id, job_card_id)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "s4b_ix_stock_ledger_tenant_id_branch_id_material_row_id",
      "indexdef": "CREATE INDEX s4b_ix_stock_ledger_tenant_id_branch_id_material_row_id ON public.stock_ledger USING btree (tenant_id, branch_id, material_row_id)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "s4b_job_138d913c999c68dffbac_ix",
      "indexdef": "CREATE INDEX s4b_job_138d913c999c68dffbac_ix ON public.stock_ledger USING btree (tenant_id, branch_id, job_card_id, material_row_id)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "stock_ledger_item_history",
      "indexdef": "CREATE INDEX stock_ledger_item_history ON public.stock_ledger USING btree (tenant_id, branch_id, item_id, created_at DESC)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "stock_ledger_material_ledger_id_key",
      "indexdef": "CREATE UNIQUE INDEX stock_ledger_material_ledger_id_key ON public.stock_ledger USING btree (material_ledger_id)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "stock_ledger_pkey",
      "indexdef": "CREATE UNIQUE INDEX stock_ledger_pkey ON public.stock_ledger USING btree (id)"
    },
    {
      "tablename": "stock_ledger",
      "indexname": "stock_ledger_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX stock_ledger_tenant_id_branch_id_id_key ON public.stock_ledger USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "superadmins",
      "indexname": "superadmins_pkey",
      "indexdef": "CREATE UNIQUE INDEX superadmins_pkey ON public.superadmins USING btree (user_id)"
    },
    {
      "tablename": "suppliers",
      "indexname": "suppliers_active_name",
      "indexdef": "CREATE UNIQUE INDEX suppliers_active_name ON public.suppliers USING btree (tenant_id, branch_id, lower(name)) WHERE (archived_at IS NULL)"
    },
    {
      "tablename": "suppliers",
      "indexname": "suppliers_pkey",
      "indexdef": "CREATE UNIQUE INDEX suppliers_pkey ON public.suppliers USING btree (id)"
    },
    {
      "tablename": "suppliers",
      "indexname": "suppliers_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX suppliers_tenant_id_branch_id_id_key ON public.suppliers USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "support_emulations",
      "indexname": "support_emulations_one_active_per_actor_tenant",
      "indexdef": "CREATE UNIQUE INDEX support_emulations_one_active_per_actor_tenant ON public.support_emulations USING btree (superadmin_id, tenant_id) WHERE (status = 'ACTIVE'::text)"
    },
    {
      "tablename": "support_emulations",
      "indexname": "support_emulations_pkey",
      "indexdef": "CREATE UNIQUE INDEX support_emulations_pkey ON public.support_emulations USING btree (id)"
    },
    {
      "tablename": "technician_tasks",
      "indexname": "technician_tasks_assignee",
      "indexdef": "CREATE INDEX technician_tasks_assignee ON public.technician_tasks USING btree (tenant_id, assigned_to, status, updated_at DESC)"
    },
    {
      "tablename": "technician_tasks",
      "indexname": "technician_tasks_pkey",
      "indexdef": "CREATE UNIQUE INDEX technician_tasks_pkey ON public.technician_tasks USING btree (id)"
    },
    {
      "tablename": "tenant_admin_invitations",
      "indexname": "tenant_admin_invitations_membership_id_key",
      "indexdef": "CREATE UNIQUE INDEX tenant_admin_invitations_membership_id_key ON public.tenant_admin_invitations USING btree (membership_id)"
    },
    {
      "tablename": "tenant_admin_invitations",
      "indexname": "tenant_admin_invitations_pending_email",
      "indexdef": "CREATE UNIQUE INDEX tenant_admin_invitations_pending_email ON public.tenant_admin_invitations USING btree (tenant_id, email) WHERE (status = 'PENDING'::text)"
    },
    {
      "tablename": "tenant_admin_invitations",
      "indexname": "tenant_admin_invitations_pkey",
      "indexdef": "CREATE UNIQUE INDEX tenant_admin_invitations_pkey ON public.tenant_admin_invitations USING btree (id)"
    },
    {
      "tablename": "tenant_audit_events",
      "indexname": "tenant_audit_events_pkey",
      "indexdef": "CREATE UNIQUE INDEX tenant_audit_events_pkey ON public.tenant_audit_events USING btree (id)"
    },
    {
      "tablename": "tenant_audit_events",
      "indexname": "tenant_audit_events_tenant_created_idx",
      "indexdef": "CREATE INDEX tenant_audit_events_tenant_created_idx ON public.tenant_audit_events USING btree (tenant_id, created_at DESC)"
    },
    {
      "tablename": "tenant_memberships",
      "indexname": "tenant_memberships_pkey",
      "indexdef": "CREATE UNIQUE INDEX tenant_memberships_pkey ON public.tenant_memberships USING btree (id)"
    },
    {
      "tablename": "tenant_memberships",
      "indexname": "tenant_memberships_tenant_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX tenant_memberships_tenant_id_id_key ON public.tenant_memberships USING btree (tenant_id, id)"
    },
    {
      "tablename": "tenant_memberships",
      "indexname": "tenant_memberships_tenant_id_user_id_key",
      "indexdef": "CREATE UNIQUE INDEX tenant_memberships_tenant_id_user_id_key ON public.tenant_memberships USING btree (tenant_id, user_id)"
    },
    {
      "tablename": "tenant_roles",
      "indexname": "tenant_roles_pkey",
      "indexdef": "CREATE UNIQUE INDEX tenant_roles_pkey ON public.tenant_roles USING btree (id)"
    },
    {
      "tablename": "tenant_roles",
      "indexname": "tenant_roles_system_key_unique",
      "indexdef": "CREATE UNIQUE INDEX tenant_roles_system_key_unique ON public.tenant_roles USING btree (tenant_id, system_key) WHERE (system_key IS NOT NULL)"
    },
    {
      "tablename": "tenant_roles",
      "indexname": "tenant_roles_tenant_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX tenant_roles_tenant_id_id_key ON public.tenant_roles USING btree (tenant_id, id)"
    },
    {
      "tablename": "tenant_roles",
      "indexname": "tenant_roles_tenant_id_name_key",
      "indexdef": "CREATE UNIQUE INDEX tenant_roles_tenant_id_name_key ON public.tenant_roles USING btree (tenant_id, name)"
    },
    {
      "tablename": "tenant_settings",
      "indexname": "tenant_settings_pkey",
      "indexdef": "CREATE UNIQUE INDEX tenant_settings_pkey ON public.tenant_settings USING btree (tenant_id)"
    },
    {
      "tablename": "tenants",
      "indexname": "tenants_code_unique",
      "indexdef": "CREATE UNIQUE INDEX tenants_code_unique ON public.tenants USING btree (lower(code)) WHERE (code IS NOT NULL)"
    },
    {
      "tablename": "tenants",
      "indexname": "tenants_pkey",
      "indexdef": "CREATE UNIQUE INDEX tenants_pkey ON public.tenants USING btree (id)"
    },
    {
      "tablename": "vehicles",
      "indexname": "vehicles_active_number_per_branch",
      "indexdef": "CREATE UNIQUE INDEX vehicles_active_number_per_branch ON public.vehicles USING btree (tenant_id, branch_id, upper(number)) WHERE (archived_at IS NULL)"
    },
    {
      "tablename": "vehicles",
      "indexname": "vehicles_pkey",
      "indexdef": "CREATE UNIQUE INDEX vehicles_pkey ON public.vehicles USING btree (id)"
    },
    {
      "tablename": "vehicles",
      "indexname": "vehicles_scope_search_idx",
      "indexdef": "CREATE INDEX vehicles_scope_search_idx ON public.vehicles USING btree (tenant_id, branch_id, archived_at, upper(number), lower(make), lower(model))"
    },
    {
      "tablename": "vehicles",
      "indexname": "vehicles_tenant_id_branch_id_id_key",
      "indexdef": "CREATE UNIQUE INDEX vehicles_tenant_id_branch_id_id_key ON public.vehicles USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "visits",
      "indexname": "visits_pkey",
      "indexdef": "CREATE UNIQUE INDEX visits_pkey ON public.visits USING btree (id)"
    },
    {
      "tablename": "visits",
      "indexname": "visits_scope_search_idx",
      "indexdef": "CREATE INDEX visits_scope_search_idx ON public.visits USING btree (tenant_id, branch_id, archived_at, received_at DESC)"
    },
    {
      "tablename": "work_updates",
      "indexname": "work_updates_pkey",
      "indexdef": "CREATE UNIQUE INDEX work_updates_pkey ON public.work_updates USING btree (id)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "s4b_ix_workshop_user_profiles_platform_user_id",
      "indexdef": "CREATE INDEX s4b_ix_workshop_user_profiles_platform_user_id ON public.workshop_user_profiles USING btree (platform_user_id)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "s4b_ix_workshop_user_profiles_tenant_id",
      "indexdef": "CREATE INDEX s4b_ix_workshop_user_profiles_tenant_id ON public.workshop_user_profiles USING btree (tenant_id)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "s4b_ix_workshop_user_profiles_tenant_id_branch_9ca683450510",
      "indexdef": "CREATE INDEX s4b_ix_workshop_user_profiles_tenant_id_branch_9ca683450510 ON public.workshop_user_profiles USING btree (tenant_id, branch_id, created_at, id)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "s4b_ix_workshop_user_profiles_tenant_id_branch_id",
      "indexdef": "CREATE INDEX s4b_ix_workshop_user_profiles_tenant_id_branch_id ON public.workshop_user_profiles USING btree (tenant_id, branch_id)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "s4b_uk_workshop_user_profiles_tenant_id_branch_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_workshop_user_profiles_tenant_id_branch_id_id ON public.workshop_user_profiles USING btree (tenant_id, branch_id, id)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "s4b_uk_workshop_user_profiles_tenant_id_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_uk_workshop_user_profiles_tenant_id_id ON public.workshop_user_profiles USING btree (tenant_id, id)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "s4b_ux_workshop_user_profiles_tenant_id_branch_id_email",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_workshop_user_profiles_tenant_id_branch_id_email ON public.workshop_user_profiles USING btree (tenant_id, branch_id, email)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "s4b_ux_workshop_user_profiles_tenant_id_platform_user_id",
      "indexdef": "CREATE UNIQUE INDEX s4b_ux_workshop_user_profiles_tenant_id_platform_user_id ON public.workshop_user_profiles USING btree (tenant_id, platform_user_id) WHERE (platform_user_id IS NOT NULL)"
    },
    {
      "tablename": "workshop_user_profiles",
      "indexname": "workshop_user_profiles_pkey",
      "indexdef": "CREATE UNIQUE INDEX workshop_user_profiles_pkey ON public.workshop_user_profiles USING btree (id)"
    }
  ]
}