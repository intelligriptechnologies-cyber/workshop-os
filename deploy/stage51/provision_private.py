"""Executed only as prem on the authorized host. Refuses existing secret paths."""
import os,json,secrets,subprocess,hashlib
from pathlib import Path
os.umask(0o077)
root=Path('/home/prem/.workshopos-stage51')
assert os.getuid()==1001 and Path.home()==Path('/home/prem')
root.mkdir(mode=0o700,exist_ok=False)
secret=root/'secrets';secret.mkdir(mode=0o700)
(root/'recovery').mkdir(mode=0o700)
def put(name,value,mode=0o400):
 p=secret/name
 with p.open('x') as f:f.write(value)
 p.chmod(mode)
owner=secrets.token_hex(32);runtime=secrets.token_hex(32)
put('owner_password',owner,0o444);put('runtime_password',runtime,0o444)
put('runtime_url','postgresql+psycopg://slice_auth:'+runtime+'@workshopos-db:5432/workshopos_staging',0o444)
accounts={email:secrets.token_urlsafe(32) for email in ['admin@example.com', 'service@example.com', 'reception@example.com', 'accounts@example.com', 'store@example.com', 'tech@example.com', 'advisor.aa@example.com', 'advisor.bb1@example.com', 'general.service.manager@example.com', 'ppf.paint.manager@example.com']}
put('accounts.json',json.dumps(accounts),0o444)
access={'username':'workshop-reviewer','password':secrets.token_urlsafe(32)}
hashvalue=subprocess.run(['openssl','passwd','-6','-stdin'],input=access['password'].encode(),capture_output=True,check=True).stdout.decode().strip()
put('access_htpasswd',access['username']+':'+hashvalue+'\n',0o444)
put('test-access.json',json.dumps({'accounts':accounts,'access':access}))
subprocess.run(['openssl','req','-x509','-newkey','rsa:3072','-nodes','-sha256','-days','30','-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost,IP:127.0.0.1','-keyout',str(secret/'private.key'),'-out',str(secret/'private.crt')],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=True)
(secret/'private.key').chmod(0o400);(secret/'private.crt').chmod(0o444)
assert root.stat().st_mode&0o777==0o700 and secret.stat().st_mode&0o777==0o700
print('New isolated staging secrets provisioned; values suppressed.')
