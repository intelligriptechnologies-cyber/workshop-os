"""Host-installed, reviewed same-schema deployer. Input is a CI release JSON.

No source checkout, migration, import, proxy changes, pruning or volume changes.
Policy and recovery evidence are provisioned separately by the operator.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time

BASE = Path('/opt/workshop/cicd')
STATE = BASE / 'state'
PROJECT = 'workshopos-stage51'
SCHEMA = '20261022_0053'

def require(condition, message):
    if not condition:
        raise RuntimeError(message)

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def validate_release(release, repository):
    require(re.fullmatch('[a-f0-9]{40}', release['commit']), 'Invalid commit')
    require(set(release['images']) == {'api', 'frontend'}, 'Unexpected services')
    for service, image in release['images'].items():
        require(re.fullmatch(re.escape('ghcr.io/' + repository.lower() + '-' + service) + r'@sha256:[a-f0-9]{64}', image), 'Untrusted or mutable image')

def validate_checkpoint(checkpoint, previous, commit):
    require(0 <= time.time() - checkpoint['verified_at'] <= 3600, 'Fresh verified recovery checkpoint required')
    require(checkpoint['schema'] == SCHEMA and checkpoint['previous_images'] == previous, 'Checkpoint does not match running release')
    require(checkpoint['candidate_commit'] == commit, 'Checkpoint must approve this candidate')
    require(checkpoint['restore_verified'] is True and checkpoint['offhost_retrieval_verified'] is True, 'Restore/off-host prerequisites incomplete')
    for field in ('database_backup', 'restore_report', 'rollback_report'):
        item = checkpoint[field]
        require(digest(item['path']) == item['sha256'], 'Recovery artifact missing or changed')
    require(checkpoint['rollback_same_schema_verified'] is True, 'Rollback rehearsal missing')

def run(args):
    return subprocess.check_output(args, text=True).strip()

def containers():
    ids = run(['docker', 'ps', '-aq']).splitlines()
    return json.loads(run(['docker', 'inspect', *ids])) if ids else []

def unchanged_inventory(items):
    return {c['Name']: (c['Id'], c['Image'], c['State']['StartedAt'], c['RestartCount'])
            for c in items if c['Name'] not in ('/workshopos-stage51-api-1', '/workshopos-stage51-frontend-1')}

def main():
    import fcntl
    os.umask(0o077)
    with (STATE / 'deploy.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        deploy(json.load(sys.stdin))

def deploy(release):
    policy = json.loads((BASE / 'policy.json').read_text())
    validate_release(release, policy['repository'])
    require(release['helper_sha256'] == digest(__file__), 'Installed helper differs from reviewed release')
    require(policy['enabled'] is True, 'Host deployment disabled')
    require(policy['origin'] == 'https://workshopos.nexiohyper.com', 'Hostname not activated')
    # Every existing compose/env/proxy file is approved by hash; never written here.
    for path, expected in policy['protected_files'].items():
        require(digest(path) == expected, 'Protected configuration drift')
    compose = ['docker', 'compose', '--env-file', policy['env_file'], '-p', PROJECT]
    for path in policy['compose_files']:
        require(path in policy['protected_files'], 'Uncheckpointed Compose file')
        compose += ['-f', path]
    require(policy['env_file'] in policy['protected_files'], 'Uncheckpointed environment file')
    config = json.loads(run(compose + ['config', '--format', 'json']))
    require(set(config['services']) == {'db', 'api', 'frontend', 'private-https'}, 'Unexpected project services')
    env = config['services']['api']['environment']
    require(env['SLICE_ORIGIN'] == policy['origin'] and env['SLICE_PREFILL'] == 'false', 'Unsafe runtime configuration')
    before = containers()
    by_name = {c['Name']: c for c in before}
    previous = {}
    for service in ('api', 'frontend', 'db'):
        c = by_name['/' + PROJECT + '-' + service + '-1']
        require(c['Config']['Labels']['com.docker.compose.project'] == PROJECT, 'Wrong project')
        require(c['State'].get('Health', {}).get('Status') == 'healthy', 'Existing service unhealthy')
        if service != 'db':
            previous[service] = c['Image']
    db = PROJECT + '-db-1'
    sql = ['docker', 'exec', db, 'psql', '-X', '-At', '-v', 'ON_ERROR_STOP=1', '-U', 'stage4c_rehearsal_owner', '-d', 'workshopos_staging', '-c']
    require(run(sql + ['SELECT version_num FROM alembic_version']) == SCHEMA, 'Schema requires separate migration approval')
    checkpoint = json.loads(Path(policy['checkpoint']).read_text())
    validate_checkpoint(checkpoint, previous, release['commit'])
    # Pull and validate both images before interrupting either service.
    for image in release['images'].values():
        run(['docker', 'pull', image])
        labels = json.loads(run(['docker', 'image', 'inspect', '--format', '{{json .Config.Labels}}', image]))
        require(labels['org.opencontainers.image.revision'] == release['commit'], 'Image provenance mismatch')
    head = run(['docker', 'run', '--rm', '--network', 'none', release['images']['api'], 'python', '-c',
                "from alembic.config import Config; from alembic.script import ScriptDirectory; c=Config('/workspace/alembic.ini'); c.set_main_option('script_location','/workspace/alembic'); c.set_main_option('version_locations','/workspace/alembic/versions /schema/versions /rehearsal/versions /slice/versions'); c.set_main_option('version_path_separator','space'); print(ScriptDirectory.from_config(c).get_current_head())"])
    require(head == SCHEMA, 'Candidate schema changed: separate migration release required')
    smoke(policy)
    target = STATE / ('release-' + release['commit'] + '-' + str(time.time_ns()))
    target.mkdir(mode=0o700)
    overlay = target / 'images.json'
    overlay.write_text(json.dumps({'services': {k: {'image': v} for k, v in release['images'].items()}}))
    (target / 'rollback.json').write_text(json.dumps({'services': {k: {'image': v} for k, v in previous.items()}}))
    (target / 'release.json').write_text(json.dumps(release))
    # Take a fresh consistent pre-change DB checkpoint; never restore automatically.
    with (target / 'predeploy.dump').open('wb') as out:
        subprocess.run(['docker', 'exec', db, 'pg_dump', '-U', 'stage4c_rehearsal_owner', '-d', 'workshopos_staging', '-Fc'], stdout=out, check=True)
    require((target / 'predeploy.dump').stat().st_size > 0, 'Empty database backup')
    try:
        run(compose + ['-f', str(overlay), 'up', '-d', '--no-deps', '--no-build', '--pull', 'never', '--wait', '--wait-timeout', '120', 'api', 'frontend'])
        smoke(policy)
    except Exception:
        run(compose + ['-f', str(target / 'rollback.json'), 'up', '-d', '--no-deps', '--no-build', '--pull', 'never', '--wait', '--wait-timeout', '120', 'api', 'frontend'])
        smoke(policy)
        raise RuntimeError('Deployment failed; previous same-schema images restored') from None
    finally:
        require(unchanged_inventory(before) == unchanged_inventory(containers()), 'Non-target container drift detected')
        for path, expected in policy['protected_files'].items():
            require(digest(path) == expected, 'Protected file drift detected')
    (STATE / 'active-release.json').write_text(json.dumps({'directory': str(target), **release}, indent=2))
    print('Workshop OS deployment and read-only smoke checks passed; recovery directory: ' + str(target))

def smoke(policy):
    # Host-side credentials never enter GitHub or command arguments.
    import base64
    import http.cookiejar
    import urllib.request
    import urllib.error
    access = json.loads(Path(policy['smoke_credentials']).read_text())
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    origin = policy['origin']
    def request(path, body=None, extra=None):
        headers = {'Authorization': 'Basic ' + base64.b64encode((access['gate_user'] + ':' + access['gate_password']).encode()).decode()}
        if body is not None:
            headers.update({'Content-Type': 'application/json', 'Origin': origin})
        headers.update(extra or {})
        req = urllib.request.Request(origin + path, headers=headers, data=None if body is None else json.dumps(body).encode())
        try:
            with opener.open(req, timeout=20) as response:
                return response.status, response.read()
        except urllib.error.HTTPError as error:
            return error.code, error.read()
    require(request('/health')[0] == 200, 'Frontend health failed')
    require(request('/api/v1/health/ready')[0] == 200, 'Database readiness failed')
    require(request('/api/v1/session')[0] == 401, 'Anonymous session not rejected')
    status, data = request('/api/v1/auth/config')
    config = json.loads(data)
    require(status == 200 and config['allowDemo'] is False, 'Hosted demo prefill exposed')
    require(request('/api/v1/auth/login', {'email': access['email'], 'password': access['password']}, {'X-Login-CSRF': config['loginCsrf']})[0] == 200, 'Login smoke failed')
    try:
        require(request('/api/v1/session')[0] == 200, 'Session smoke failed')
        require(request('/api/v1/customers')[0] == 200, 'Business read smoke failed')
    finally:
        csrf = next(c.value for c in jar if c.name == 'workshopos_csrf')
        require(request('/api/v1/auth/logout', {}, {'X-WorkshopOS-CSRF': csrf})[0] == 200, 'Logout failed')
    require(request('/api/v1/session')[0] == 401, 'Logout did not revoke session')

if __name__ == '__main__':
    main()
