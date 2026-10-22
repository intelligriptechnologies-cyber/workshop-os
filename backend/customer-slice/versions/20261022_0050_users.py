"""Narrow scoped account administration without runtime credential-table grants."""
from alembic import op
revision='20261022_0050'
down_revision='20261022_0049'
branch_labels=depends_on=None

def upgrade():
    op.execute(r"""CREATE FUNCTION slice_manage_user(target bigint, expected bigint, operation text, details jsonb, new_hash text)
    RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
    DECLARE scope uuid:=current_setting('workshopos.tenant_id')::uuid;
      branch uuid:=(current_setting('workshopos.branch_ids')::uuid[])[1];
      actor uuid:=current_setting('workshopos.actor_id')::uuid;
      existing workshop_user_profiles; account uuid; membership uuid; profile bigint;
    BEGIN
      IF NOT EXISTS(SELECT 1 FROM workshop_user_profiles WHERE tenant_id=scope AND branch_id=branch AND platform_user_id=actor AND role='admin' AND archived_at IS NULL) THEN RAISE EXCEPTION 'Admin required'; END IF;
      PERFORM pg_advisory_xact_lock(hashtext(scope::text||'/users'));
      IF operation NOT IN ('create','update','archive') THEN RAISE EXCEPTION 'Invalid user operation'; END IF;
      IF operation<>'create' THEN
        SELECT * INTO STRICT existing FROM workshop_user_profiles WHERE tenant_id=scope AND branch_id=branch AND id=target FOR UPDATE;
        IF existing.version<>expected OR existing.archived_at IS NOT NULL THEN RAISE EXCEPTION 'Stale or archived user'; END IF;
        IF existing.email IN ('general.service.manager@example.com','ppf.paint.manager@example.com') THEN RAISE EXCEPTION 'Preloaded Service Department Manager accounts are locked'; END IF;
        IF existing.platform_user_id IS NULL THEN RAISE EXCEPTION 'Historical identity requires explicit provisioning'; END IF;
        IF existing.role='admin' AND (operation='archive' OR details->>'role'<>'admin') AND (SELECT count(*) FROM workshop_user_profiles WHERE tenant_id=scope AND branch_id=branch AND role='admin' AND archived_at IS NULL)<=1 THEN RAISE EXCEPTION 'Final Admin must be retained'; END IF;
        account:=existing.platform_user_id;profile:=existing.id;
      END IF;
      IF operation='archive' THEN
        IF account=actor OR btrim(coalesce(details->>'reason',''))='' THEN RAISE EXCEPTION 'Invalid user archive'; END IF;
        UPDATE workshop_user_profiles SET archived_at=now()::text,archived_reason=details->>'reason',updated_at=now()::text,version=version+1 WHERE tenant_id=scope AND branch_id=branch AND id=target;
        UPDATE tenant_memberships SET status='ARCHIVED',version=version+1,updated_at=now() WHERE tenant_id=scope AND user_id=account;
      ELSE
        IF btrim(coalesce(details->>'name',''))='' OR coalesce(details->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR details->>'role' NOT IN ('admin','service','service_manager','reception','accounts','store','tech') THEN RAISE EXCEPTION 'Invalid user details'; END IF;
        IF EXISTS(SELECT 1 FROM workshop_user_profiles WHERE tenant_id=scope AND branch_id=branch AND lower(email)=lower(details->>'email') AND archived_at IS NULL AND id<>coalesce(target,0)) THEN RAISE EXCEPTION 'Duplicate email'; END IF;
        IF operation='create' THEN
          IF new_hash IS NULL THEN RAISE EXCEPTION 'Password required'; END IF;
          account:=gen_random_uuid();membership:=gen_random_uuid();
          INSERT INTO platform_users(id,display_name,email,status,password_hash) VALUES(account,details->>'name',details->>'email','ACTIVE',new_hash);
          INSERT INTO tenant_memberships(id,tenant_id,user_id,status) VALUES(membership,scope,account,'ACTIVE');
          UPDATE platform_users SET active_membership_id=membership WHERE id=account;
          INSERT INTO membership_branches(membership_id,branch_id,tenant_id) VALUES(membership,branch,scope);
          SELECT coalesce(max(id),0)+1 INTO profile FROM workshop_user_profiles;
          INSERT INTO workshop_user_profiles(tenant_id,branch_id,id,email,name,role,platform_user_id,created_at,updated_at) VALUES(scope,branch,profile,details->>'email',details->>'name',details->>'role',account,now()::text,now()::text);
        ELSE
          UPDATE workshop_user_profiles SET name=details->>'name',email=details->>'email',role=details->>'role',updated_at=now()::text,version=version+1 WHERE tenant_id=scope AND branch_id=branch AND id=target;
          UPDATE platform_users SET display_name=details->>'name',email=details->>'email',password_hash=coalesce(new_hash,password_hash),updated_at=now() WHERE id=account;
          UPDATE tenant_memberships SET version=version+1,updated_at=now() WHERE tenant_id=scope AND user_id=account;
        END IF;
      END IF;
      DELETE FROM database_sessions WHERE tenant_id=scope AND user_id=account;
      RETURN profile;
    END $$""")
    op.execute('REVOKE ALL ON FUNCTION slice_manage_user(bigint,bigint,text,jsonb,text) FROM PUBLIC')
    op.execute('GRANT EXECUTE ON FUNCTION slice_manage_user(bigint,bigint,text,jsonb,text) TO workshopos_runtime')
    op.execute('CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON workshop_user_profiles FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')

def downgrade():
    raise RuntimeError('Restore checkpoint separately and reconcile account changes.')
