"""Real-role snapshot security assertions shared by estimate and finance suites."""
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError


def assert_frozen_documents(connection, check, required_kinds):
    identity = connection.execute(text('SELECT session_user,current_user')).one()
    check('document security uses deployed login and effective runtime role',
          tuple(identity) == ('slice_auth', 'workshopos_runtime'))
    roles = connection.execute(text("SELECT rolname,rolsuper,rolinherit,rolcanlogin,rolbypassrls FROM pg_roles WHERE rolname IN ('slice_auth','workshopos_runtime') ORDER BY rolname")).all()
    check('document principals cannot bypass RLS or inherit owner powers',
          [tuple(row) for row in roles] == [('slice_auth', False, False, True, False),
                                          ('workshopos_runtime', False, False, False, False)])
    privileges = {p: connection.scalar(text("SELECT has_table_privilege(current_user,'document_snapshots',:p)"), {'p': p})
                  for p in ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'TRIGGER')}
    check('document grants match deployed SELECT INSERT UPDATE without destructive privileges',
          privileges == dict(SELECT=True, INSERT=True, UPDATE=True, DELETE=False, TRUNCATE=False, TRIGGER=False))
    check('authentication principal has no direct snapshot mutation privileges',
          not any(connection.scalar(text("SELECT has_table_privilege(session_user,'document_snapshots',:p)"), {'p': p})
                  for p in ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE')))
    metadata = connection.execute(text("SELECT pg_get_userbyid(relowner),relrowsecurity,relforcerowsecurity FROM pg_class WHERE oid='document_snapshots'::regclass")).one()
    check('document runtime is not table owner and RLS is forced',
          metadata[0] not in identity and metadata[1] and metadata[2])
    trigger = connection.execute(text("SELECT t.tgenabled,p.proname,pg_get_triggerdef(t.oid) FROM pg_trigger t JOIN pg_proc p ON p.oid=t.tgfoid WHERE t.tgrelid='document_snapshots'::regclass AND t.tgname='s4b_snapshot_immutable'")).one()
    check('append-only trigger is enabled for UPDATE and DELETE',
          trigger[0] == 'O' and trigger[1] == 's4b_protect_snapshot'
          and 'BEFORE DELETE OR UPDATE' in trigger[2] and 'FOR EACH ROW' in trigger[2])

    def rows():
        return connection.execute(text('SELECT id,source_kind,to_jsonb(d)::text FROM document_snapshots d ORDER BY id')).all()

    before = rows()
    check('authorized API created required frozen document kinds', required_kinds <= {row[1] for row in before})
    # Existing valid row + no-op assignment necessarily satisfies its CHECKs/FKs.
    # A changed non-null HTML value also preserves readiness/version constraints.
    # Savepoints roll back unexpected successes before failing the assertion.
    statements = [
        ('valid no-op update', 'UPDATE document_snapshots SET html=html WHERE id=:id', '23514'),
        ('valid HTML rewrite', "UPDATE document_snapshots SET html=coalesce(html,'') || '<!-- forbidden rewrite -->' WHERE id=:id", '23514'),
        ('valid values rewrite', "UPDATE document_snapshots SET values=values || jsonb_build_object('ciTamper',true) WHERE id=:id", '23514'),
        ('delete', 'DELETE FROM document_snapshots WHERE id=:id', '42501'),
    ]
    for kind in sorted(required_kinds):
        target = next(row[0] for row in before if row[1] == kind)
        for label, statement, state in statements:
            error = None
            with connection.begin_nested() as savepoint:
                try:
                    connection.execute(text(statement), {'id': target})
                except DBAPIError as caught:
                    error = caught.orig
                finally:
                    savepoint.rollback()
            check(kind + ' ' + label + ' rejected by intended protection', error is not None and error.sqlstate == state)
            if state == '23514':
                check(kind + ' ' + label + ' comes from append-only trigger, not unrelated CHECK',
                      error.diag.message_primary == 'Document snapshots are append-only'
                      and 's4b_protect_snapshot' in (error.diag.context or ''))
            else:
                check(kind + ' deletion denied by table privilege',
                      error.diag.message_primary == 'permission denied for table document_snapshots')
            check(kind + ' ' + label + ' preserves all snapshot bytes and rows', rows() == before)
    for label, statement in [
        ('truncate', 'TRUNCATE document_snapshots'),
        ('disable immutability trigger', 'ALTER TABLE document_snapshots DISABLE TRIGGER s4b_snapshot_immutable'),
    ]:
        error = None
        with connection.begin_nested() as savepoint:
            try:
                connection.execute(text(statement))
            except DBAPIError as caught:
                error = caught.orig
            finally:
                savepoint.rollback()
        check('runtime cannot ' + label, error is not None and error.sqlstate == '42501')
    check('snapshot contents unchanged after all bypass attempts', rows() == before)
