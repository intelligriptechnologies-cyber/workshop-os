"""Owner-only setup for isolated clones. Never executed by an API process."""
import json,os,sys
from pathlib import Path
from datetime import datetime,timedelta,timezone
from uuid import UUID,uuid5
from sqlalchemy import create_engine,text
from alembic import command
from alembic.config import Config
from app.database_auth import hash_password
from cryptography import x509
from cryptography.hazmat.primitives import hashes,serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID
TENANT='eb01f21c-09d1-5cb1-aadb-d15649568fd7'
accounts=json.loads(Path('/slice/.generated/accounts.json').read_text())
for scope in ('dev','test'):
    url=f"postgresql+psycopg://slice_owner:{os.environ['OWNER_PASSWORD']}@slice-{scope}:5432/slice_{scope}"
    os.environ['WORKSHOPOS_DATABASE_URL']=url
    from app.config import get_settings
    get_settings.cache_clear()
    cfg=Config('/workspace/alembic.ini')
    cfg.set_main_option('script_location','/workspace/alembic')
    cfg.set_main_option('version_locations','/workspace/alembic/versions /schema/versions /rehearsal/versions /slice/versions')
    cfg.set_main_option('version_path_separator','space')
    command.upgrade(cfg,'head')
    engine=create_engine(url,hide_parameters=True)
    with engine.begin() as c:
        if not c.scalar(text("SELECT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='slice_auth')")):
            password=os.environ['RUNTIME_PASSWORD']
            assert password.isalnum()
            c.exec_driver_sql(f"CREATE ROLE slice_auth LOGIN PASSWORD '{password}' NOSUPERUSER NOBYPASSRLS NOINHERIT")
        c.execute(text('GRANT workshopos_runtime TO slice_auth'))
        c.execute(text('GRANT USAGE ON SCHEMA public TO slice_auth,workshopos_runtime'))
        c.execute(text('GRANT SELECT ON platform_users,tenant_memberships,tenants,workshop_user_profiles TO slice_auth'))
        c.execute(text('GRANT SELECT,INSERT,DELETE ON database_sessions TO slice_auth'))
        c.execute(text('GRANT INSERT ON slice_auth_events TO slice_auth'))
        c.execute(text('GRANT USAGE ON SEQUENCE slice_auth_events_id_seq TO slice_auth'))
        c.execute(text('GRANT SELECT ON customers,vehicles,visits,job_cards,workshop_user_profiles TO workshopos_runtime'))
        c.execute(text('GRANT INSERT,UPDATE ON customers TO workshopos_runtime'))
        c.execute(text('GRANT SELECT,INSERT ON customer_changes,customer_commands TO workshopos_runtime'))
        c.execute(text('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime'))
        for u in accounts:
            actor=str(uuid5(UUID(TENANT),'account:'+str(u['id'])))
            membership=str(uuid5(UUID(TENANT),'membership:'+str(u['id'])))
            c.execute(text('''INSERT INTO platform_users(id,display_name,email,password_hash) VALUES(:id,:n,:e,:p)
              ON CONFLICT(id) DO NOTHING'''),{'id':actor,'n':u['name'],'e':u['email'],'p':hash_password(u['password'])})
            c.execute(text('''INSERT INTO tenant_memberships(id,tenant_id,user_id,status) VALUES(:m,:t,:u,'ACTIVE')
              ON CONFLICT(id) DO NOTHING'''),{'m':membership,'t':TENANT,'u':actor})
            c.execute(text('UPDATE workshop_user_profiles SET platform_user_id=:a WHERE id=:id AND tenant_id=:t'),{'a':actor,'id':u['id'],'t':TENANT})
    engine.dispose()
cert=Path('/slice/.generated/localhost.crt'); keypath=Path('/slice/.generated/localhost.key')
if not cert.exists():
    key=rsa.generate_private_key(public_exponent=65537,key_size=2048)
    name=x509.Name([x509.NameAttribute(NameOID.COMMON_NAME,'WorkshopOS local slice')])
    built=x509.CertificateBuilder().subject_name(name).issuer_name(name).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(datetime.now(timezone.utc)-timedelta(days=1)).not_valid_after(datetime.now(timezone.utc)+timedelta(days=30)).add_extension(x509.SubjectAlternativeName([x509.DNSName('localhost')]),critical=False).sign(key,hashes.SHA256())
    keypath.write_bytes(key.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.TraditionalOpenSSL,serialization.NoEncryption()))
    cert.write_bytes(built.public_bytes(serialization.Encoding.PEM))
print('Isolated clones migrated; accounts provisioned through normal password hashing.')
