-- DBA-authorized read-only inspection. No password hashes or business rows.
-- Run in the candidate existing cluster only after its identity is confirmed.
BEGIN READ ONLY;
SELECT version(), current_database(), current_user;
SELECT name, setting, unit FROM pg_settings
 WHERE name IN ('max_connections','shared_buffers','work_mem','maintenance_work_mem','wal_level','archive_mode');
SELECT datname, pg_database_size(oid) AS bytes, datallowconn, datconnlimit
 FROM pg_database WHERE NOT datistemplate ORDER BY datname;
SELECT datname, state, count(*) AS connections
 FROM pg_stat_activity GROUP BY datname,state ORDER BY datname,state;
SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolinherit, rolcanlogin,
       rolconnlimit, rolbypassrls
 FROM pg_roles WHERE rolname LIKE 'workshopos%' OR rolname='slice_auth';
SELECT parent.rolname AS granted_role, member.rolname AS member_role, m.admin_option
 FROM pg_auth_members m JOIN pg_roles parent ON parent.oid=m.roleid
 JOIN pg_roles member ON member.oid=m.member
 WHERE parent.rolname LIKE 'workshopos%' OR member.rolname LIKE 'workshopos%'
    OR parent.rolname='slice_auth' OR member.rolname='slice_auth';
SELECT extname, extversion FROM pg_extension ORDER BY extname;
COMMIT;
