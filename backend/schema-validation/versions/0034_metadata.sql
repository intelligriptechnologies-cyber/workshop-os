-- Source custody is immutable; reviewed disposition and target mapping may evolve.
CREATE FUNCTION s4b_protect_source() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Import provenance deletion is forbidden' USING ERRCODE = '23514';
  END IF;
  IF (NEW.tenant_id,NEW.source_sha256,NEW.source_table,NEW.source_key,NEW.row_sha256,NEW.payload)
     IS DISTINCT FROM
     (OLD.tenant_id,OLD.source_sha256,OLD.source_table,OLD.source_key,OLD.row_sha256,OLD.payload) THEN
    RAISE EXCEPTION 'Import source evidence is immutable' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER s4b_source_immutable BEFORE UPDATE OR DELETE ON import_source_records
FOR EACH ROW EXECUTE FUNCTION s4b_protect_source();

-- Versioned document contents are append-only, including unavailable history.
CREATE FUNCTION s4b_protect_snapshot() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Document snapshots are append-only' USING ERRCODE = '23514';
END $$;
CREATE TRIGGER s4b_snapshot_immutable BEFORE UPDATE OR DELETE ON document_snapshots
FOR EACH ROW EXECUTE FUNCTION s4b_protect_snapshot();

-- Cross-table readiness needs a locked check; a CHECK cannot query another table.
CREATE FUNCTION s4b_check_ready_snapshot() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE asset_state text;
BEGIN
  IF NEW.availability = 'READY' AND NEW.html IS NULL THEN
    SELECT state INTO asset_state FROM object_assets
      WHERE id=NEW.asset_id AND tenant_id=NEW.tenant_id AND branch_id=NEW.branch_id
      FOR SHARE;
    IF asset_state IS DISTINCT FROM 'READY' THEN
      RAISE EXCEPTION 'READY snapshot requires HTML or a READY scoped asset' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER s4b_snapshot_ready BEFORE INSERT ON document_snapshots
FOR EACH ROW EXECUTE FUNCTION s4b_check_ready_snapshot();

CREATE FUNCTION s4b_protect_ready_asset() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.state = 'READY' AND NEW.state <> 'READY' AND EXISTS (
    SELECT 1 FROM document_snapshots WHERE asset_id=OLD.id AND tenant_id=OLD.tenant_id
      AND branch_id=OLD.branch_id AND availability='READY' AND html IS NULL
  ) THEN
    RAISE EXCEPTION 'Asset supports an immutable READY snapshot' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER s4b_asset_readiness BEFORE UPDATE OF state ON object_assets
FOR EACH ROW EXECUTE FUNCTION s4b_protect_ready_asset();
