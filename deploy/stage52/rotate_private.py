"""Run as prem on the dedicated staging host. No secret output; no proxy reload."""
import base64
import http.cookiejar
import json
import os
from pathlib import Path
import secrets
import ssl
import subprocess
import urllib.error
import urllib.request

ROOT = Path('/home/prem/.workshopos-stage51')
SECRET = ROOT / 'secrets'
RECOVERY = ROOT / 'recovery/stage52'
ORIGIN = 'https://localhost:18551'

def run(args, data=None):
    r = subprocess.run(args, input=data, capture_output=True)
    if r.returncode:
        raise RuntimeError('Scoped subprocess failed; secret-bearing output suppressed')
    return r.stdout

def put(path, value, mode=0o400):
    with path.open('x') as f:
        f.write(value)
        f.flush()
        os.fsync(f.fileno())
    path.chmod(mode)

def main():
    os.umask(0o077)
    assert os.getuid() == 1001 and ROOT.stat().st_mode & 0o777 == 0o700
    assert (RECOVERY / 'pre-rotation.dump').stat().st_size > 0
    assert not (RECOVERY / 'new-access.json').exists(), 'Never rerun over pending credentials'
    old = json.loads((SECRET / 'test-access.json').read_text())
    jar = http.cookiejar.CookieJar()
    context = ssl.create_default_context(cafile=str(SECRET / 'private.crt'))
    opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=context), urllib.request.HTTPCookieProcessor(jar))
    def request(path, access, data=None, extra=None):
        headers = {'Authorization': 'Basic ' + base64.b64encode((access['username']+':'+access['password']).encode()).decode()}
        if data is not None:
            headers.update({'Content-Type':'application/json','Origin':ORIGIN})
        headers.update(extra or {})
        req = urllib.request.Request(ORIGIN+path, headers=headers, data=None if data is None else json.dumps(data).encode())
        try:
            with opener.open(req, timeout=20) as response:
                return response.status, response.read()
        except urllib.error.HTTPError as e:
            return e.code, e.read()
    code, body = request('/api/v1/auth/config',old['access'])
    assert code == 200 and json.loads(body)['allowDemo'] is False
    code, _ = request('/api/v1/auth/login',old['access'],{'email':'admin@example.com','password':old['accounts']['admin@example.com']},{'X-Login-CSRF':json.loads(body)['loginCsrf']})
    assert code == 200, 'Pre-rotation session probe failed'
    assert request('/api/v1/session',old['access'])[0] == 200
    emails = json.loads(run(['docker','exec','workshopos-stage51-db-1','psql','-X','-At','-U','stage4c_rehearsal_owner','-d','workshopos_staging','-c','SELECT json_agg(email ORDER BY email) FROM platform_users;']))
    assert set(old['accounts']).issubset(emails) and 10 <= len(emails) < 100
    new = {'accounts':{e:secrets.token_urlsafe(32) for e in emails},'access':{'username':'workshop-reviewer','password':secrets.token_urlsafe(32)}}
    put(RECOVERY/'old-access.json',json.dumps(old))
    put(RECOVERY/'new-access.json',json.dumps(new))
    hashed = run(['openssl','passwd','-6','-stdin'],new['access']['password'].encode()).decode().strip()
    put(RECOVERY/'new-htpasswd',new['access']['username']+':'+hashed+'\n')
    code = '''import json,sys,psycopg
from app.database_auth import hash_password,verify_password
p=json.load(sys.stdin)
with psycopg.connect(host='workshopos-db',dbname='workshopos_staging',user='stage4c_rehearsal_owner',password=p['owner']) as c:
 with c.cursor() as q:
  q.execute('SELECT current_database(),current_user');assert q.fetchone()==('workshopos_staging','stage4c_rehearsal_owner')
  q.execute('SELECT version_num FROM alembic_version');assert q.fetchone()[0]=='20261022_0053'
  q.execute('SELECT id,email FROM platform_users FOR UPDATE');rows=q.fetchall()
  assert {r[1] for r in rows}==set(p['accounts'])
  for uid,email in rows:
   h=hash_password(p['accounts'][email]);assert verify_password(p['accounts'][email],h)
   if email in p['old']:assert not verify_password(p['old'][email],h)
   q.execute('UPDATE platform_users SET password_hash=%s,updated_at=now() WHERE id=%s',(h,uid))
  q.execute('UPDATE tenant_memberships SET version=version+1,updated_at=now()')
  q.execute('DELETE FROM database_sessions');revoked=q.rowcount
  q.execute('SELECT count(*) FROM database_sessions');assert q.fetchone()[0]==0
print(json.dumps({'accounts_rotated':len(rows),'sessions_revoked':revoked,'old_passwords_rejected_by_verifier':True}))
'''
    payload={'owner':(SECRET/'owner_password').read_text().strip(),'accounts':new['accounts'],'old':old['accounts']}
    result=json.loads(run(['docker','exec','-i','workshopos-stage51-api-1','python','-c',code],json.dumps(payload).encode()))
    # Keep the mounted inode: Nginx reads this file on each gated request.
    # During the brief rewrite, access fails closed; no proxy/service reload needed.
    gate=SECRET/'access_htpasswd'
    gate.chmod(0o600)
    with gate.open('w') as f:
        f.write((RECOVERY/'new-htpasswd').read_text());f.flush();os.fsync(f.fileno())
    gate.chmod(0o444)
    for name,value,mode in [('accounts.json',new['accounts'],0o444),('test-access.json',new,0o400)]:
        temporary=SECRET/(name+'.stage52-new')
        put(temporary,json.dumps(value),mode)
        os.replace(temporary,SECRET/name)
    assert request('/',old['access'])[0]==401, 'Old gate credential still accepted'
    assert request('/api/v1/session',new['access'])[0]==401, 'Old session still accepted'
    code, body=request('/api/v1/auth/config',new['access']);assert code==200
    code,_=request('/api/v1/auth/login',new['access'],{'email':'admin@example.com','password':old['accounts']['admin@example.com']},{'X-Login-CSRF':json.loads(body)['loginCsrf']})
    assert code==401, 'Old application password still accepted'
    result.update(old_gate_rejected=True,old_session_rejected=True,old_admin_password_rejected=True,private_origin_preserved=True)
    put(RECOVERY/'rotation-result.json',json.dumps(result,indent=2))
    print(json.dumps(result))

if __name__=='__main__':
    try:
        main()
    except Exception as e:
        print('STOP: rotation failed ('+type(e).__name__+'); secret details suppressed.',flush=True)
        raise SystemExit(1)
