[
  {
    "source_table": "advisor_attendance",
    "source_key": "{\"date\":\"2026-10-02\",\"user_id\":2}",
    "target_table": "advisor_attendance",
    "target_key": {
      "date": "2026-10-02",
      "user_id": 2,
      "branch_id": "12809bd1-d793-52d2-878d-7f0f8f1d6e09",
      "tenant_id": "eb01f21c-09d1-5cb1-aadb-d15649568fd7"
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "advisor_attendance",
    "source_key": "{\"date\":\"2026-10-02\",\"user_id\":7}",
    "target_table": "advisor_attendance",
    "target_key": {
      "date": "2026-10-02",
      "user_id": 7,
      "branch_id": "12809bd1-d793-52d2-878d-7f0f8f1d6e09",
      "tenant_id": "eb01f21c-09d1-5cb1-aadb-d15649568fd7"
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "booking_events",
    "source_key": "{\"id\":1}",
    "target_table": "booking_events",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_booking_events_tenant_id_branch_id_booking_id"
    ]
  },
  {
    "source_table": "booking_events",
    "source_key": "{\"id\":2}",
    "target_table": "booking_events",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_booking_events_tenant_id_branch_id_booking_id"
    ]
  },
  {
    "source_table": "bookings",
    "source_key": "{\"id\":1}",
    "target_table": "bookings",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:created_by",
      "REQUIRED_NULL:customer_id",
      "REQUIRED_NULL:vehicle_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "bookings",
    "source_key": "{\"id\":2}",
    "target_table": "bookings",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:created_by",
      "REQUIRED_NULL:customer_id",
      "REQUIRED_NULL:vehicle_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":100}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":101}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":102}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":103}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":104}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":105}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":106}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":107}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":108}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":109}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":10}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":110}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":111}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":112}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":113}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":114}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":115}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":116}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":117}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":118}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":119}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":11}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":120}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":121}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":122}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":123}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":124}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":125}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":126}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":127}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":128}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":129}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":12}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":130}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":131}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":132}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":133}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":134}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":135}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":136}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":137}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":138}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":139}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":13}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":140}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":141}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":142}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":143}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":144}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":145}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":14}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":15}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":16}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":17}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":18}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":19}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":1}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":20}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":21}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":22}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":23}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":24}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":25}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":26}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":27}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":28}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":29}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":2}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":30}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":31}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":32}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":33}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":34}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":35}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":36}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":37}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":38}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":39}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":3}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":40}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":41}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":42}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":43}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":44}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":45}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":46}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":47}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":48}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":49}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":4}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":50}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":51}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":52}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":53}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":54}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":55}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":56}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":57}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":58}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":59}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":5}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":60}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":61}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":62}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":63}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":64}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":65}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":66}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":67}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":68}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":69}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":6}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":70}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":71}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":72}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":73}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":74}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":75}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":76}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":77}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":78}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":79}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":7}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":80}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":81}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":82}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":83}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":84}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":85}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":86}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":87}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":88}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":89}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":8}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":90}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":91}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":92}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":93}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":94}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":95}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":96}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":97}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":98}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":99}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_cycles",
    "source_key": "{\"id\":9}",
    "target_table": "job_checklist_cycles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":100}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":101}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":102}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":103}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":104}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":105}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":106}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":107}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":108}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":109}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":10}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":110}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":111}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":112}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":113}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":114}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":115}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":116}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":117}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":118}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":119}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":11}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":120}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":121}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":122}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":123}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":124}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":125}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":126}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":127}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":128}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":129}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":12}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":130}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":131}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":132}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":133}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":134}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":135}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":136}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":137}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":138}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":139}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":13}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":140}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":141}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":142}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":143}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":144}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":145}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":146}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":147}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":148}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":149}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":14}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":150}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":151}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":152}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":153}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":154}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":155}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":156}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":157}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":158}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":159}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":15}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":160}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":161}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":162}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":163}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":164}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":165}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":166}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":167}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":168}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":169}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":16}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":170}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":171}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":172}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":173}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":174}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":175}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":176}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":177}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":178}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":179}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":17}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":180}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":181}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":182}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":183}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":184}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":185}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":186}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":187}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":188}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":189}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":18}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":190}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":191}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":192}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":193}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":194}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":195}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":196}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":197}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":198}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":199}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":19}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":1}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":200}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":201}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":202}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":203}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":204}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":205}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":206}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":207}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":208}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":209}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":20}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":210}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":211}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":212}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":213}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":214}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":215}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":216}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":217}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":218}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":219}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":21}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":220}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":221}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":222}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":223}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":224}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":225}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":226}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":227}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":228}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":229}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":22}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":230}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":231}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":232}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":233}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":234}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":235}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":236}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":237}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":238}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":239}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":23}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":240}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":241}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":242}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":243}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":244}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":245}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":246}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":247}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":248}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":249}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":24}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":250}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":251}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":252}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":253}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":254}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":255}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":256}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":257}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":258}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":259}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":25}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":260}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":261}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":262}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":263}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":264}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":265}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":266}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":267}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":268}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":269}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":26}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":270}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":271}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":272}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":273}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":274}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":275}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":276}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":277}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":278}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":279}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":27}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":280}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":281}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":282}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":283}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":284}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":285}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":286}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":287}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":288}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":289}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":28}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":290}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":291}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":292}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":293}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":294}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":295}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":296}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":297}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":298}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":299}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":29}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":2}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":300}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":301}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":302}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":303}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":304}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":305}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":306}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":307}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":308}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":309}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":30}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":310}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":311}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":312}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":313}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":314}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":315}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":316}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":317}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":318}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":319}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":31}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":320}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":321}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":322}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":323}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":324}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":325}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":326}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":327}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":328}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":329}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":32}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":330}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":331}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":332}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":333}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":334}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":335}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":336}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":337}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":338}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":339}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":33}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":340}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":341}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":342}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":343}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":344}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":345}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":346}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":347}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":348}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":349}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":34}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":350}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":351}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":352}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":353}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":354}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":355}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":356}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":357}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":358}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":359}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":35}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":360}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":361}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":362}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":363}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":364}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":365}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":366}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":367}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":368}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":369}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":36}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":370}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":371}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":372}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":373}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":374}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":375}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":376}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":377}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":378}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":379}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":37}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":380}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":381}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":382}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":383}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":384}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":385}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":386}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":387}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":388}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":389}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":38}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":390}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":391}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":392}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":393}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":394}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":395}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":396}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":397}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":398}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":399}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":39}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":3}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":400}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":401}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":402}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":403}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":404}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":405}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":406}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":407}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":408}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":409}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":40}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":410}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":411}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":412}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":413}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":414}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":415}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":416}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":417}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":418}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":419}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":41}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":420}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":421}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":422}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":423}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":424}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":425}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":426}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":427}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":428}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":429}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":42}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":430}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":431}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":432}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":433}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":434}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":435}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":436}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":437}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":438}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":439}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":43}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":440}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":441}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":442}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":443}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":444}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":445}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":446}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":447}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":448}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":449}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":44}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":450}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":451}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":452}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":453}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":454}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":455}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":456}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":457}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":458}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":459}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":45}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":460}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":461}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":462}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":463}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":464}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":465}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":466}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":467}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":468}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":469}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":46}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":470}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":471}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":472}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":473}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":474}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":475}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":476}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":477}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":478}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":479}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":47}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":480}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":481}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":482}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":483}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":484}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":485}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":486}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":487}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":488}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":489}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":48}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":490}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":491}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":492}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":493}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":494}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":495}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":496}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":497}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":498}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":499}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":49}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":4}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":500}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":501}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":502}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":503}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":504}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":505}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":506}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":507}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":508}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":509}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":50}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":510}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":511}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":512}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":513}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":514}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":515}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":516}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":517}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":518}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":519}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":51}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":520}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":521}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":522}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":523}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":524}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":525}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":526}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":527}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":528}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":529}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":52}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":530}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":531}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":532}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":533}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":534}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":535}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":536}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":537}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":538}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":539}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":53}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":540}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":541}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":542}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":543}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":544}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":545}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":546}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":547}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":548}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":549}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":54}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":550}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":551}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":552}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":553}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":554}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":555}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":556}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":557}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":558}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":559}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":55}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":560}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":561}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":562}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":563}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":564}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":565}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":566}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":567}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":568}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":569}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":56}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":570}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":571}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":572}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":573}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":574}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":575}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":576}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":577}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":578}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":579}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":57}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":580}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":581}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":582}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":583}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":584}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":585}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":586}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":587}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":588}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":589}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":58}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":590}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":591}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":592}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":593}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":594}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":595}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":596}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":597}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":598}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":599}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":59}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":5}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":600}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":601}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":602}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":603}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":604}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":605}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":606}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":607}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":608}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":609}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":60}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":610}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":611}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":612}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":613}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":614}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":615}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":616}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":617}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":618}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":619}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":61}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":620}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":621}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":622}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":623}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":624}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":625}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":626}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":627}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":628}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":629}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":62}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":630}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":631}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":632}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":633}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":634}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":635}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":636}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":637}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":638}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":639}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":63}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":640}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":641}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":642}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":643}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":644}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":645}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":646}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":647}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":648}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":649}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":64}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":650}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":651}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":652}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":653}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":654}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":655}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":656}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":657}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":658}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":659}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":65}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":660}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":661}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":662}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":663}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":664}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":665}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":666}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":667}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":668}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":669}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":66}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":670}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":671}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":672}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":673}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":674}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":675}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":676}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":677}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":678}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":679}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":67}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":680}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":681}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":682}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":683}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":684}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":685}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":686}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":687}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":688}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":689}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":68}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":690}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":691}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":692}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":693}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":694}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":695}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":696}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":697}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":698}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":699}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":69}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":6}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":700}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":701}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":702}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":703}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":704}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":705}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":706}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":707}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":708}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":709}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":70}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":710}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":711}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":71}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":72}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:checked_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:checked_by"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":73}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":74}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":75}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":76}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":77}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":78}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":79}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":7}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":80}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":81}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":82}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":83}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":84}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":85}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":86}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":87}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":88}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":89}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":8}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":90}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":91}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":92}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":93}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":94}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":95}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":96}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":97}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":98}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":99}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "checklist_items",
    "source_key": "{\"id\":9}",
    "target_table": "job_checklist_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:job_checklist_items_job_card_id_fkey"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":100}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":101}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":102}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":103}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":104}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":105}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":106}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":107}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":108}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":109}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":10}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":110}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":111}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":112}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":113}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":114}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":115}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":116}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":117}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":118}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":119}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":11}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":120}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":121}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":12}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":13}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":14}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":15}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":16}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":17}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":18}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":19}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":1}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":20}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":21}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":22}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":23}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":24}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":25}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":26}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":27}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":28}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":29}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":2}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":30}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":31}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":32}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":33}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":34}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":35}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":36}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":37}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":38}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":39}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":3}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":40}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":41}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":42}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":43}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":44}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":45}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":46}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":47}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":48}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":49}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":4}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":50}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":51}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":52}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":53}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":54}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":55}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":56}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":57}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":58}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":59}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":5}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":60}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":61}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":62}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":63}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":64}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":65}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":66}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":67}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":68}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":69}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":6}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":70}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":71}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":72}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":73}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":74}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":75}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":76}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":77}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":78}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":79}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":7}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":80}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":81}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":82}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":83}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":84}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":85}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":86}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":87}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":88}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":89}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":8}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":90}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":91}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":92}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":93}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":94}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":95}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":96}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":97}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":98}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":99}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "customers",
    "source_key": "{\"id\":9}",
    "target_table": "customers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:address"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":100}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":101}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":102}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":103}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":104}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":105}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":106}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":107}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":108}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":109}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":10}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":110}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":111}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":112}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":113}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":114}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":115}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":116}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":117}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":118}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":119}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":11}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":120}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":121}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":122}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":123}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":124}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":125}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":126}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":127}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":128}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":129}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":12}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":130}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":131}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":132}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":133}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":134}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":135}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":136}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":137}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":138}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":139}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":13}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":140}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":141}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":142}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":143}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":144}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":14}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":15}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":16}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":17}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":18}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":19}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":1}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":20}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":21}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":22}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":23}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":24}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":25}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":26}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":27}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":28}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":29}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":2}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":30}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":31}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":32}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":33}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":34}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":35}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":36}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":37}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":38}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":39}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":3}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":40}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":41}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":42}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":43}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":44}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":45}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":46}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":47}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":48}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":49}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":4}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":50}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":51}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":52}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":53}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":54}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":55}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":56}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":57}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":58}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":59}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":5}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":60}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":61}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":62}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":63}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":64}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":65}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":66}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":67}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":68}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":69}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":6}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":70}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":71}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":72}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":73}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":74}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":75}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":76}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":77}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":78}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":79}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":7}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":80}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":81}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":82}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":83}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":84}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":85}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":86}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":87}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":88}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":89}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":8}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":90}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":91}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":92}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":93}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":94}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":95}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":96}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":97}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":98}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":99}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimate_items",
    "source_key": "{\"id\":9}",
    "target_table": "estimate_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":100}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":101}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":102}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":103}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":104}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":105}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":106}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":107}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":108}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":109}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":10}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":110}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":111}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":112}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":113}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":114}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":115}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":116}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":117}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":118}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":119}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":11}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":120}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":121}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":122}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":123}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":124}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":125}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":126}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":127}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":128}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":129}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":12}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":130}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":131}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":132}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":133}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":134}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":135}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":136}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":137}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":138}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":139}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":13}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":140}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":141}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":142}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":143}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":144}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":14}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":15}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":16}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":17}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":18}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":19}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":1}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":20}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":21}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":22}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":23}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":24}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":25}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":26}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":27}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":28}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":29}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":2}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":30}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":31}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":32}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":33}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":34}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":35}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":36}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":37}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":38}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":39}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":3}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":40}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":41}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":42}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":43}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":44}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":45}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":46}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":47}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":48}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":49}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":4}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":50}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":51}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":52}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":53}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":54}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":55}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":56}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":57}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":58}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":59}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":5}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":60}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":61}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":62}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":63}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":64}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":65}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":66}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":67}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":68}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":69}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":6}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":70}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":71}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":72}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":73}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":74}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":75}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":76}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":77}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":78}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":79}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":7}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":80}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":81}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":82}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":83}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":84}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":85}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":86}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":87}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":88}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":89}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":8}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":90}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":91}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":92}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":93}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":94}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":95}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":96}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":97}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":98}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":99}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "estimates",
    "source_key": "{\"id\":9}",
    "target_table": "estimates",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:revision",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":100}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":101}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":102}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":103}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":104}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":105}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":106}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":107}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":108}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":109}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":10}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":110}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":111}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":112}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":113}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":114}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":115}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":116}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":117}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":118}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":119}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":11}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":12}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":13}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":14}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":15}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":16}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":17}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":18}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":19}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":1}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":20}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":21}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":22}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":23}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":24}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":25}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":26}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":27}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":28}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":29}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":2}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":30}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":31}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":32}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":33}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":34}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":35}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":36}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":37}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":38}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":39}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":3}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":40}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":41}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":42}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":43}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":44}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":45}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":46}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":47}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":48}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":49}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":4}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":50}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":51}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":52}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":53}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":54}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":55}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":56}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":57}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":58}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":59}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":5}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":60}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":61}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":62}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":63}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":64}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":65}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":66}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":67}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":68}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":69}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":6}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":70}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":71}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":72}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":73}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":74}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":75}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":76}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":77}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":78}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":79}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":7}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":80}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":81}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":82}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":83}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":84}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":85}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":86}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":87}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":88}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":89}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":8}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":90}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":91}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":92}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":93}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":94}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":95}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":96}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":97}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":98}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":99}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "followups",
    "source_key": "{\"id\":9}",
    "target_table": "followups",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":10}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":11}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":12}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":13}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":14}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":15}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":16}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":17}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":18}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":19}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":1}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":20}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":21}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":22}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":23}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":24}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":25}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":26}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":27}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":2}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":3}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":4}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":5}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":6}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":7}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":8}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "gate_passes",
    "source_key": "{\"id\":9}",
    "target_table": "legacy_gate_passes",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "inventory",
    "source_key": "{\"id\":1}",
    "target_table": "catalogue_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "inventory",
    "source_key": "{\"id\":2}",
    "target_table": "catalogue_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "inventory",
    "source_key": "{\"id\":3}",
    "target_table": "catalogue_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "inventory",
    "source_key": "{\"id\":4}",
    "target_table": "catalogue_items",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "invoice_events",
    "source_key": "{\"id\":1}",
    "target_table": "legacy_invoice_events",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_invoice_events_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":100}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":101}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":102}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":103}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":104}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":105}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":10}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":11}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":12}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":13}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":14}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":15}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":16}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":17}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":18}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":19}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":1}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":20}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":21}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":22}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":23}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":24}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":25}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":26}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":27}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":28}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":29}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":2}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":30}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":31}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":32}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":33}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":34}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":35}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":36}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":37}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":38}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":39}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":3}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":40}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":41}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":42}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":43}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":44}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":45}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":46}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":47}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":48}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":49}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":4}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":50}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":51}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":52}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":53}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":54}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":55}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":56}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":57}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":58}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":59}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":5}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":60}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":61}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":62}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":63}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":64}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":65}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":66}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":67}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":68}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":69}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":6}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":70}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":71}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":72}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":73}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":74}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":75}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":76}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":77}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":78}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":79}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":7}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":80}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":81}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":82}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":83}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":84}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":85}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":86}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":87}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":88}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":89}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":8}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":90}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":91}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":92}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":93}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":94}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":95}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":96}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":97}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":98}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":99}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoice_items",
    "source_key": "{\"id\":9}",
    "target_table": "invoice_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:gst_rate_bps",
      "MISSING_REQUIRED:line_no",
      "MISSING_REQUIRED:tax_paise",
      "MISSING_REQUIRED:taxable_paise",
      "MISSING_REQUIRED:total_paise",
      "MISSING_REQUIRED:unit_amount_paise"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":10}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":11}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":12}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":13}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":14}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":15}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":16}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":17}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":18}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":19}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":1}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":20}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":21}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":22}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":23}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":24}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":25}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":26}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":27}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":28}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":29}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":2}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":30}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":31}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":32}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":33}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":34}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":35}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":36}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":37}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":38}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":39}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":3}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":40}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":41}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":42}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":43}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":44}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":45}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":46}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":47}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":48}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":49}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":4}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":50}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":51}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":52}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":5}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":6}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":7}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":8}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "invoices",
    "source_key": "{\"id\":9}",
    "target_table": "invoices",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:issued_document_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":100}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":101}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":102}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":103}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":104}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":105}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":106}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":107}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":108}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":109}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":10}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":110}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":111}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":112}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":113}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":114}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":115}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":116}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":117}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":118}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":119}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":11}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":120}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":121}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":122}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":123}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":124}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":125}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":126}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":127}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":128}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":129}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":12}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":130}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":131}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":132}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":133}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":134}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":135}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":136}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":137}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":138}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":139}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":13}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":140}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":141}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":142}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":143}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":144}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":145}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":14}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":15}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":16}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":17}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":18}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":19}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":1}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":20}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":21}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":22}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":23}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":24}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":25}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":26}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":27}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":28}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":29}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":2}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":30}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":31}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":32}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":33}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":34}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":35}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":36}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":37}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":38}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":39}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":3}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":40}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":41}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":42}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":43}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":44}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":45}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":46}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":47}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":48}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":49}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":4}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":50}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":51}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":52}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":53}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":54}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":55}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":56}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":57}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":58}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":59}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":5}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":60}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":61}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":62}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":63}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":64}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":65}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":66}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":67}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":68}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":69}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":6}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":70}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":71}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":72}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":73}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":74}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":75}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":76}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":77}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":78}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":79}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":7}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":80}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":81}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":82}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":83}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":84}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":85}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":86}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":87}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":88}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":89}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":8}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":90}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":91}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":92}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":93}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":94}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":95}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":96}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":97}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":98}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":99}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_cards",
    "source_key": "{\"id\":9}",
    "target_table": "job_cards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id"
    ]
  },
  {
    "source_table": "job_task_list_items",
    "source_key": "{\"id\":1}",
    "target_table": "job_service_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "job_task_list_items",
    "source_key": "{\"id\":2}",
    "target_table": "job_service_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "job_task_list_items",
    "source_key": "{\"id\":3}",
    "target_table": "job_service_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "job_task_list_items",
    "source_key": "{\"id\":4}",
    "target_table": "job_service_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "material_events",
    "source_key": "{\"id\":1}",
    "target_table": "material_events",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_events_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_movements",
    "source_key": "{\"id\":1}",
    "target_table": "legacy_material_movements",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:job_card_id"
    ]
  },
  {
    "source_table": "material_movements",
    "source_key": "{\"id\":2}",
    "target_table": "legacy_material_movements",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:job_card_id"
    ]
  },
  {
    "source_table": "material_movements",
    "source_key": "{\"id\":3}",
    "target_table": "legacy_material_movements",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "UNRESOLVED_SOURCE_PARENT:job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":100}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":101}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":102}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":103}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":104}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":105}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":106}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":107}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":108}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":109}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":10}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":110}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":111}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":112}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":113}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":114}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":115}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":116}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":117}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":11}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":12}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":13}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":14}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":15}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":16}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":17}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":18}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":19}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":1}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":20}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":21}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":22}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":23}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":24}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":25}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":26}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":27}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":28}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":29}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":2}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":30}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":31}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":32}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":33}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":34}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":35}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":36}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":37}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":38}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":39}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":3}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":40}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":41}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":42}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":43}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":44}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":45}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":46}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":47}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":48}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":49}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":4}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":50}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":51}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":52}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":53}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":54}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":55}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":56}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":57}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":58}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":59}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":5}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":60}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":61}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":62}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":63}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":64}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":65}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":66}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":67}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":68}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":69}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":6}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":70}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":71}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":72}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":73}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":74}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":75}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":76}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":77}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":78}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":79}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":7}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":80}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":81}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":82}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":83}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":84}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":85}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":86}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":87}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":88}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":89}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":8}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":90}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":91}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":92}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":93}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":94}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":95}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":96}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":97}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":98}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":99}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "material_requests",
    "source_key": "{\"id\":9}",
    "target_table": "material_requests",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":10}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":11}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":12}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":13}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":14}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":15}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":16}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":17}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":18}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":19}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":1}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":20}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":21}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":22}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":23}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":24}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":25}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":26}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":27}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":2}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":3}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":4}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":5}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":6}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":7}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":8}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "payments",
    "source_key": "{\"id\":9}",
    "target_table": "payments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:receipt_document_id",
      "MISSING_REQUIRED:received_at",
      "MISSING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":100}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":101}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":102}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":103}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":104}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":105}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":106}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":107}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":108}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":109}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":10}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":110}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":111}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":112}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":113}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":114}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":115}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":116}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":117}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":118}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":119}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":11}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":120}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":121}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":122}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":123}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":124}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":125}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":126}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":127}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":128}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":129}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":12}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":130}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":131}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":132}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":133}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":134}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":135}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":136}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":137}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":138}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":139}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":13}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":140}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":141}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":142}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":143}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":144}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":145}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":146}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":147}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":148}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":149}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":14}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":150}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":151}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":152}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":153}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":154}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":155}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":156}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":157}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":158}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":159}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":15}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":160}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":161}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":162}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":163}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":164}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":165}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":166}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":167}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":168}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":169}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":16}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":170}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":171}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":172}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":173}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":174}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":175}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":176}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":177}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":178}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":179}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":17}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":180}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":181}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":182}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":183}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":184}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":185}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":186}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":187}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":188}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":189}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":18}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":190}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":191}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":192}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":193}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":194}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":195}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":196}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":197}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":198}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":199}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":19}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":1}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":200}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":201}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":202}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":203}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":204}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":205}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":206}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":207}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":208}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":209}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":20}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":210}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":211}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":212}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":213}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":214}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":215}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":216}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":217}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":218}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":219}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":21}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":220}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":221}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":222}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":223}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":224}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":225}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":226}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":227}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":228}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":229}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":22}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":230}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":231}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":232}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":233}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":234}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":235}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":236}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":237}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":238}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":239}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":23}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":240}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":241}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":242}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":243}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":244}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":245}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":246}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":247}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":248}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":249}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":24}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":250}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":251}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":252}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":253}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":254}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":255}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":256}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":257}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":258}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":259}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":25}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":260}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":261}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":262}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":263}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":264}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":265}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":266}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":267}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":268}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":269}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":26}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":270}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":271}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":272}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":273}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":274}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":275}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":276}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":277}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":278}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":279}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":27}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":280}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":281}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":282}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":283}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":284}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":285}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":286}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":287}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":288}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":289}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":28}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":29}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":2}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":30}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":31}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":32}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":33}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":34}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":35}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":36}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":37}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":38}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":39}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":3}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":40}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":41}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":42}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":43}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":44}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":45}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":46}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":47}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":48}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":49}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":4}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":50}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":51}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":52}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":53}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":54}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":55}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":56}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":57}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":58}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":59}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":5}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":60}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":61}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":62}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":63}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":64}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":65}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":66}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":67}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":68}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":69}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":6}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":70}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":71}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":72}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":73}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":74}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":75}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":76}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":77}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":78}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":79}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":7}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":80}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":81}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":82}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":83}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":84}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":85}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":86}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":87}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":88}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":89}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":8}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":90}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":91}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":92}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":93}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":94}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":95}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":96}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":97}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":98}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":99}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "photos",
    "source_key": "{\"id\":9}",
    "target_table": "job_media",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by"
    ]
  },
  {
    "source_table": "purchase_order_confirmations",
    "source_key": "{\"id\":1}",
    "target_table": "purchase_order_delivery_confirmations",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:rejected_qty",
      "MISSING_REQUIRED:request_key",
      "REQUIRED_NULL:confirmed_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:confirmed_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:confirmed_by"
    ]
  },
  {
    "source_table": "purchase_order_confirmations",
    "source_key": "{\"id\":2}",
    "target_table": "purchase_order_delivery_confirmations",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:rejected_qty",
      "MISSING_REQUIRED:request_key",
      "REQUIRED_NULL:confirmed_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:confirmed_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:confirmed_by"
    ]
  },
  {
    "source_table": "purchase_order_confirmations",
    "source_key": "{\"id\":3}",
    "target_table": "purchase_order_delivery_confirmations",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:rejected_qty",
      "MISSING_REQUIRED:request_key",
      "REQUIRED_NULL:confirmed_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:confirmed_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:confirmed_by"
    ]
  },
  {
    "source_table": "purchase_order_lines",
    "source_key": "{\"id\":1}",
    "target_table": "purchase_order_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "purchase_order_lines",
    "source_key": "{\"id\":2}",
    "target_table": "purchase_order_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "purchase_order_lines",
    "source_key": "{\"id\":3}",
    "target_table": "purchase_order_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:line_no"
    ]
  },
  {
    "source_table": "purchase_order_quotations",
    "source_key": "{\"id\":1}",
    "target_table": "purchase_order_quotations",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_purchase_order_quotations_tenant_id_bra_75ba933f3b60"
    ]
  },
  {
    "source_table": "purchase_order_quotations",
    "source_key": "{\"id\":2}",
    "target_table": "purchase_order_quotations",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_purchase_order_quotations_tenant_id_bra_75ba933f3b60"
    ]
  },
  {
    "source_table": "purchase_order_quotations",
    "source_key": "{\"id\":3}",
    "target_table": "purchase_order_quotations",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_purchase_order_quotations_tenant_id_bra_75ba933f3b60"
    ]
  },
  {
    "source_table": "purchase_order_receipt_lines",
    "source_key": "{\"id\":1}",
    "target_table": "purchase_order_delivery_receipt_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:purchase_order_delivery_recei_tenant_id_branch_id_receipt__fkey"
    ]
  },
  {
    "source_table": "purchase_order_receipt_lines",
    "source_key": "{\"id\":2}",
    "target_table": "purchase_order_delivery_receipt_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:purchase_order_delivery_recei_tenant_id_branch_id_receipt__fkey"
    ]
  },
  {
    "source_table": "purchase_order_receipt_lines",
    "source_key": "{\"id\":3}",
    "target_table": "purchase_order_delivery_receipt_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:purchase_order_delivery_recei_tenant_id_branch_id_receipt__fkey"
    ]
  },
  {
    "source_table": "purchase_order_receipts",
    "source_key": "{\"id\":1}",
    "target_table": "purchase_order_delivery_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:request_key",
      "REQUIRED_NULL:received_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:received_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "purchase_order_receipts",
    "source_key": "{\"id\":2}",
    "target_table": "purchase_order_delivery_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:request_key",
      "REQUIRED_NULL:received_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:received_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "purchase_orders",
    "source_key": "{\"id\":1}",
    "target_table": "purchase_orders",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:created_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "purchase_orders",
    "source_key": "{\"id\":2}",
    "target_table": "purchase_orders",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:created_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":100}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":101}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":102}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":103}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":104}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":105}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":106}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":107}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":108}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":109}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":10}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":110}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":111}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":112}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":113}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":114}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":115}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":116}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":117}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":118}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":119}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":11}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":120}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":121}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":122}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":123}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":124}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":125}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":126}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":127}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":128}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":129}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":12}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":130}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":131}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":132}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":133}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":134}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":135}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":136}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":137}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":138}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":139}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":13}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":140}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":141}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":142}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":143}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":144}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":145}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":146}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":147}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":148}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":149}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":14}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":150}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":151}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":152}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":153}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":154}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":155}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":156}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":157}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":158}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":159}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":15}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":160}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":161}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":162}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":163}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":164}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":165}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":166}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":167}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":168}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":169}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":16}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":170}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":171}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":172}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":173}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":174}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":175}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":176}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":177}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":178}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":179}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":17}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":180}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":181}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":182}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":183}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":184}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":185}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":186}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":187}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":188}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":189}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":18}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":190}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":191}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":192}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":193}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":194}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":195}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":196}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":197}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":198}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":199}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":19}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":1}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":200}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":201}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":202}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":203}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":204}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":205}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":206}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":207}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":208}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":209}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":20}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":210}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":211}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":212}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":213}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":214}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":215}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":216}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":217}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":218}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":219}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":21}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":220}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":221}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":222}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":223}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":224}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":225}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":226}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":227}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":228}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":229}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":22}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":230}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":231}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":232}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":233}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":234}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":235}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":236}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":237}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":238}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":239}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":23}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":240}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":241}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":242}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":243}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":244}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":245}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":246}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":247}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":248}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":249}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":24}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":250}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":251}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":252}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":253}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":254}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":255}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":256}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":257}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":258}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":259}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":25}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":260}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":261}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":262}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":263}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":264}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":265}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":266}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":267}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":268}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":269}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":26}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":270}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":271}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":272}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":273}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":274}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":275}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":276}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":277}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":278}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":279}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":27}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":280}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":281}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":282}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":283}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":284}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":285}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":286}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":287}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":288}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":289}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":28}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":290}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":291}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":292}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":293}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":294}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":295}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":296}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":297}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":298}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":299}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":29}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":2}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":300}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":301}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":302}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":303}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":304}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":305}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":306}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":307}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":308}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":309}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":30}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":310}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":311}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":312}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":313}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":314}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":315}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":316}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":317}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":318}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":319}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":31}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":320}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":321}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":322}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":323}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":324}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":325}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":326}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":327}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":328}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":329}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":32}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":330}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":331}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":332}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":333}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":334}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":335}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":336}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":337}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":338}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":339}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":33}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":340}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":341}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":342}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":343}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":344}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":345}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":346}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":347}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":348}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":349}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":34}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":350}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":351}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":352}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":353}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":354}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":355}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":356}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":357}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":358}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":359}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":35}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":360}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":361}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":362}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":363}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":364}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":365}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":366}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":367}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":368}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":369}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":36}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":370}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":371}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":372}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":373}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":374}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":375}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":376}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":377}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":378}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":379}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":37}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":380}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":381}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":382}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":383}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":384}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":385}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":386}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":387}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":388}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":389}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":38}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":390}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":391}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":392}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":393}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":394}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":395}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":396}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":397}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":398}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":399}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":39}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":3}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":400}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":401}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":402}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":403}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":404}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":405}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":406}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":407}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":408}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":409}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":40}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":410}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":411}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":412}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":413}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":414}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":415}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":416}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":417}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":418}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":419}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":41}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":420}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":421}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":422}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":423}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":424}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":425}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":426}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":427}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":428}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":429}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":42}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":430}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":431}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":432}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":433}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":434}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":435}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":43}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":44}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":45}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":46}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":47}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":48}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":49}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":4}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":50}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":51}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":52}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":53}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":54}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":55}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":56}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":57}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":58}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":59}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":5}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":60}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":61}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":62}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":63}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":64}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":65}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":66}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":67}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":68}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":69}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":6}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":70}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":71}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":72}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":73}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":74}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":75}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":76}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":77}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":78}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":79}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":7}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":80}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":81}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":82}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":83}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":84}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":85}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":86}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":87}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":88}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":89}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":8}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":90}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":91}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":92}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":93}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":94}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":95}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":96}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":97}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":98}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":99}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "qc_checks",
    "source_key": "{\"id\":9}",
    "target_table": "qc_checks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":10}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":11}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":12}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":13}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":14}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":15}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":16}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":17}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":18}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":19}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":1}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":20}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":21}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":22}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":23}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":24}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":25}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":26}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":27}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":2}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":3}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":4}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":5}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":6}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":7}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":8}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "receipts",
    "source_key": "{\"id\":9}",
    "target_table": "legacy_receipts",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id"
    ]
  },
  {
    "source_table": "sales_leads",
    "source_key": "{\"id\":1}",
    "target_table": "sales_leads",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "sales_quotation_lines",
    "source_key": "{\"id\":1}",
    "target_table": "quotation_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:quotation_lines_quotation_id_fkey"
    ]
  },
  {
    "source_table": "sales_quotation_lines",
    "source_key": "{\"id\":2}",
    "target_table": "quotation_lines",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:quotation_lines_quotation_id_fkey"
    ]
  },
  {
    "source_table": "sales_quotations",
    "source_key": "{\"id\":1}",
    "target_table": "quotations",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "service_catalog_items",
    "source_key": "{\"id\":1}",
    "target_table": "service_task_catalog",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "service_catalog_items",
    "source_key": "{\"id\":2}",
    "target_table": "service_task_catalog",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "service_catalog_items",
    "source_key": "{\"id\":3}",
    "target_table": "service_task_catalog",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "service_department_managers",
    "source_key": "{\"department_id\":1,\"manager_id\":9}",
    "target_table": "service_department_managers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:appointed_by",
      "REQUIRED_NULL:department_id",
      "REQUIRED_NULL:manager_membership_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:department_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:manager_membership_id"
    ]
  },
  {
    "source_table": "service_department_managers",
    "source_key": "{\"department_id\":2,\"manager_id\":10}",
    "target_table": "service_department_managers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:appointed_by",
      "REQUIRED_NULL:department_id",
      "REQUIRED_NULL:manager_membership_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:department_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:manager_membership_id"
    ]
  },
  {
    "source_table": "service_departments",
    "source_key": "{\"id\":1}",
    "target_table": "service_departments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:id",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:id"
    ]
  },
  {
    "source_table": "service_departments",
    "source_key": "{\"id\":2}",
    "target_table": "service_departments",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:id",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:id"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":100}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":101}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":102}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":103}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":104}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":105}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":106}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":107}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":108}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":109}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":10}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":110}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":111}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":112}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":113}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":114}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":115}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":116}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":117}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":118}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":119}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":11}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":120}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":121}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":122}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":123}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":124}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":125}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":126}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":127}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":128}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":129}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":12}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":130}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":131}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":132}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":133}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":134}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":135}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":136}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":137}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":138}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":139}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":13}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":140}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":141}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":142}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":143}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":144}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":145}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":146}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":14}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":15}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":16}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":17}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":18}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":19}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":1}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":20}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":21}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":22}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":23}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":24}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":25}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":26}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":27}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":28}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":29}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":2}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":30}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":31}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":32}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":33}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":34}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":35}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":36}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":37}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":38}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":39}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":3}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":40}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":41}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":42}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":43}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":44}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":45}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":46}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":47}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":48}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":49}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":4}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":50}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":51}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":52}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":53}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":54}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":55}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":56}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":57}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":58}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":59}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":5}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":60}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":61}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":62}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":63}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":64}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":65}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":66}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":67}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":68}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":69}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":6}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":70}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":71}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":72}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":73}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":74}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":75}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":76}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":77}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":78}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":79}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":7}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":80}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":81}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":82}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":83}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":84}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":85}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":86}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":87}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":88}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":89}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":8}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":90}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":91}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":92}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":93}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":94}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":95}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":96}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":97}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":98}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":99}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "status_history",
    "source_key": "{\"id\":9}",
    "target_table": "legacy_job_status_history",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8"
    ]
  },
  {
    "source_table": "stock_inwards",
    "source_key": "{\"id\":1}",
    "target_table": "stock_inwards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:received_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:received_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "stock_inwards",
    "source_key": "{\"id\":2}",
    "target_table": "stock_inwards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:received_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:received_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "stock_inwards",
    "source_key": "{\"id\":3}",
    "target_table": "stock_inwards",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:received_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:received_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "stock_ledger",
    "source_key": "{\"id\":1}",
    "target_table": "stock_ledger",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:actor_id",
      "MISSING_REQUIRED:entry_type",
      "MISSING_REQUIRED:quantity",
      "MISSING_REQUIRED:reason",
      "UNRESOLVED_SOURCE_PARENT:job_card_id",
      "UNRESOLVED_SOURCE_PARENT:material_row_id"
    ]
  },
  {
    "source_table": "stock_ledger",
    "source_key": "{\"id\":2}",
    "target_table": "stock_ledger",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:actor_id",
      "MISSING_REQUIRED:entry_type",
      "MISSING_REQUIRED:quantity",
      "MISSING_REQUIRED:reason",
      "UNRESOLVED_SOURCE_PARENT:job_card_id",
      "UNRESOLVED_SOURCE_PARENT:material_row_id"
    ]
  },
  {
    "source_table": "stock_ledger",
    "source_key": "{\"id\":3}",
    "target_table": "stock_ledger",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:actor_id",
      "MISSING_REQUIRED:entry_type",
      "MISSING_REQUIRED:quantity",
      "MISSING_REQUIRED:reason"
    ]
  },
  {
    "source_table": "stock_ledger",
    "source_key": "{\"id\":4}",
    "target_table": "stock_ledger",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "MISSING_REQUIRED:actor_id",
      "MISSING_REQUIRED:entry_type",
      "MISSING_REQUIRED:quantity",
      "MISSING_REQUIRED:reason",
      "UNRESOLVED_SOURCE_PARENT:job_card_id",
      "UNRESOLVED_SOURCE_PARENT:material_row_id"
    ]
  },
  {
    "source_table": "suppliers",
    "source_key": "{\"id\":1}",
    "target_table": "suppliers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:created_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "suppliers",
    "source_key": "{\"id\":2}",
    "target_table": "suppliers",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:created_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:created_by"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":100}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":101}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":102}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":103}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":104}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":105}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":106}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":107}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":108}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":109}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":10}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":110}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":111}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":112}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":113}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":114}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":115}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":116}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":117}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":118}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":119}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":11}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":120}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":121}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":122}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":123}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":124}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":125}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":126}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":127}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":128}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":129}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":12}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":130}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":131}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":132}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":133}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":134}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":135}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":136}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":137}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":138}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":139}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":13}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":140}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":141}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":142}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":143}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":144}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":145}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":14}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":15}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":16}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":17}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":18}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":19}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":1}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":20}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":21}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":22}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":23}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":24}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":25}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":26}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":27}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":28}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":29}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":2}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":30}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":31}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":32}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":33}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":34}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":35}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":36}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":37}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":38}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":39}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":3}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":40}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":41}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":42}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":43}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":44}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":45}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":46}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":47}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":48}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":49}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":4}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":50}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":51}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":52}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":53}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":54}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":55}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":56}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":57}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":58}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":59}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":5}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":60}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":61}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":62}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":63}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":64}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":65}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":66}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":67}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":68}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":69}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":6}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":70}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":71}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":72}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":73}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":74}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":75}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":76}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":77}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":78}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":79}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":7}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":80}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":81}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":82}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":83}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":84}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":85}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":86}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":87}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":88}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":89}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":8}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":90}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":91}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":92}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":93}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":94}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":95}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":96}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":97}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":98}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":99}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "tasks",
    "source_key": "{\"id\":9}",
    "target_table": "technician_tasks",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:assigned_to",
      "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to"
    ]
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":10}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 10
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":1}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 1
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":2}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 2
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":3}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 3
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":4}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 4
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":5}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 5
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":6}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 6
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":7}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 7
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":8}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 8
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "users",
    "source_key": "{\"id\":9}",
    "target_table": "workshop_user_profiles",
    "target_key": {
      "id": 9
    },
    "disposition": "BUSINESS",
    "reasons": []
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":100}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":101}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":102}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":103}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":104}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":105}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":106}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":107}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":108}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":109}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":10}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":110}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":111}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":112}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":113}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":114}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":115}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":116}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":117}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":118}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":119}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":11}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":120}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":121}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":122}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":123}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":124}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":125}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":126}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":127}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":128}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":129}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":12}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":130}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":131}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":132}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":13}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":14}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":15}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":16}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":17}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":18}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":19}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":1}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":20}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":21}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":22}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":23}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":24}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":25}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":26}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":27}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":28}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":29}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":2}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":30}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":31}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":32}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":33}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":34}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":35}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":36}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":37}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":38}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":39}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":3}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":40}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":41}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":42}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":43}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":44}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":45}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":46}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":47}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":48}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":49}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":4}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":50}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":51}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":52}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":53}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":54}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":55}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":56}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":57}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":58}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":59}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":5}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":60}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":61}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":62}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":63}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":64}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":65}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":66}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":67}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":68}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":69}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":6}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":70}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":71}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":72}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":73}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":74}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":75}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":76}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":77}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":78}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":79}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":7}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":80}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":81}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":82}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":83}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":84}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":85}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":86}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":87}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":88}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":89}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":8}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":90}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":91}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":92}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":93}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":94}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":95}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":96}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":97}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":98}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":99}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "vehicles",
    "source_key": "{\"id\":9}",
    "target_table": "vehicles",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "MISSING_REQUIRED:created_by",
      "MISSING_REQUIRED:updated_by",
      "REQUIRED_NULL:engine_no"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":100}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":101}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":102}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":103}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":104}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":105}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":106}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":107}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":108}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":109}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":10}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":110}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":111}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":112}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":113}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":114}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":115}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":116}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":117}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":118}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":119}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":11}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":120}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":121}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":122}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":123}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":124}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":125}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":126}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":127}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":128}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":129}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":12}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":130}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":131}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":132}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":133}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":134}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":135}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":136}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":137}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":138}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":139}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":13}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":140}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":141}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":142}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":143}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":144}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":145}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:received_by",
      "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:received_at",
      "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":14}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":15}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":16}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":17}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":18}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":19}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":1}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":20}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":21}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":22}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":23}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":24}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":25}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":26}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":27}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":28}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":29}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":2}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":30}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":31}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":32}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":33}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":34}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":35}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":36}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":37}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":38}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":39}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":3}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":40}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":41}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":42}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":43}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":44}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":45}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":46}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":47}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":48}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":49}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":4}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":50}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":51}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":52}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":53}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":54}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":55}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":56}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":57}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":58}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":59}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":5}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":60}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":61}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":62}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":63}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":64}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":65}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":66}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":67}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":68}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":69}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":6}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":70}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":71}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":72}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":73}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":74}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":75}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":76}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":77}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":78}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":79}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":7}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":80}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":81}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":82}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":83}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":84}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":85}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":86}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":87}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":88}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":89}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":8}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":90}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":91}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":92}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":93}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":94}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":95}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":96}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":97}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":98}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":99}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  },
  {
    "source_table": "visits",
    "source_key": "{\"id\":9}",
    "target_table": "visits",
    "target_key": null,
    "disposition": "QUARANTINE",
    "reasons": [
      "REQUIRED_NULL:fuel_level_unit",
      "REQUIRED_NULL:fuel_level_value",
      "REQUIRED_NULL:odo_reading",
      "REQUIRED_NULL:received_by",
      "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "UUID_IDENTITY_MAPPING_REQUIRED:received_by"
    ]
  }
]
