# UI Recovery Handoff

Progress: 8%
Completed: UIR-00, UIR-01
Next slice: UIR-02

Approved governance is under `harness/ui-recovery/`; existing harness histories remain unchanged. Production authority is PostgreSQL. The deterministic before screenshot and RED shell contracts are in `tests/ui-recovery/`. Next: implement the shared tenant workspace until both shell tests are green, then migrate every tenant route into it.
