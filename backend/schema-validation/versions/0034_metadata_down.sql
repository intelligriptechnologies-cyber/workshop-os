DROP TRIGGER s4b_asset_readiness ON object_assets;
DROP FUNCTION s4b_protect_ready_asset();
DROP TRIGGER s4b_snapshot_ready ON document_snapshots;
DROP FUNCTION s4b_check_ready_snapshot();
DROP TRIGGER s4b_snapshot_immutable ON document_snapshots;
DROP FUNCTION s4b_protect_snapshot();
DROP TRIGGER s4b_source_immutable ON import_source_records;
DROP FUNCTION s4b_protect_source();
