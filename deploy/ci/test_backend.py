"""Disposable CI resources only. Never connects to an existing database/container."""
import json
import argparse
import secrets
import shutil
import sqlite3
import subprocess
import sys
import time
from pathlib import Path
from financial_history import QUERY as FINANCIAL_QUERY, validate as validate_financial_history

ROOT = Path(__file__).resolve().parents[2]
PG = 'postgres:17-alpine@sha256:6f30057d31f5861b66f3545d4821f987aacf1dd920765f0acadea0c58ff975b1'
SUITES = ['api', 'operations', 'vehicles', 'ownership', 'estimate_documents',
          'purchase_stock', 'purchase_stock_edges', 'financial_workflows',
          'financial_materials', 'bookings', 'execution_workflows', 'material_approvals',
          'catalog_workflows', 'sales_workflows', 'administration', 'configuration']

def run(*args, **kwargs):
    return subprocess.run(list(args), check=True, **kwargs)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--suite', action='append', choices=['tenant_isolation', *SUITES])
    selected = parser.parse_args().suite or ['tenant_isolation', *SUITES]
    token = secrets.token_hex(6)
    name = 'workshopos-ci-' + token
    work = ROOT / '.scratch' / name
    work.mkdir(parents=True)
    fixtures = work / 'slice'
    fixtures.mkdir()
    for source in (ROOT / 'backend/customer-slice').glob('*.py'):
        shutil.copyfile(source, fixtures / source.name)
    for source in (ROOT / 'backend/customer-slice').glob('*.json'):
        shutil.copyfile(source, fixtures / source.name)
    shutil.copyfile(ROOT / 'deploy/ci/tenant_isolation.py', fixtures / 'test_tenant_isolation.py')
    shutil.copyfile(ROOT / 'deploy/ci/financial_fixture.py', fixtures / 'ci_financial_fixture.py')
    (fixtures / '.generated').mkdir()
    (fixtures / 'artifacts').mkdir()
    (fixtures / 'artifacts').chmod(0o777)
    with sqlite3.connect((ROOT / 'public/workshopos-demo.sqlite').as_uri() + '?mode=ro&immutable=1', uri=True) as db:
        db.row_factory = sqlite3.Row
        users = [dict(row) for row in db.execute('SELECT id,name,email,role FROM users')]
    for user in users:
        user['password'] = secrets.token_hex(24)
    (fixtures / '.generated/accounts.json').write_text(json.dumps(users))
    secret = work / 'secrets'
    secret.mkdir()
    owner, runtime = secrets.token_hex(24), secrets.token_hex(24)
    (secret / 'owner_password').write_text(owner)
    (secret / 'runtime_password').write_text(runtime)
    (secret / 'accounts.json').write_text(json.dumps({u['email']: u['password'] for u in users}))
    # Only this random, internal network is reachable from test processes.
    run('docker', 'network', 'create', '--internal', '--label', 'workshopos.ci=' + token, name)
    try:
        run('docker', 'run', '-d', '--name', name, '--label', 'workshopos.ci=' + token,
            '--network', name, '--network-alias', 'workshopos-db', '--network-alias', 'slice-test',
            '--tmpfs', '/var/lib/postgresql/data', '-e', 'POSTGRES_DB=workshopos_staging',
            '-e', 'POSTGRES_USER=stage4c_rehearsal_owner', '-e', 'POSTGRES_PASSWORD_FILE=/run/secrets/owner_password',
            '-v', str(secret) + ':/run/secrets:ro', PG)
        for attempt in range(60):
            ready = subprocess.run(['docker', 'exec', name, 'pg_isready', '-U', 'stage4c_rehearsal_owner'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if ready.returncode == 0:
                break
            time.sleep(1)
        else:
            raise RuntimeError('Disposable PostgreSQL did not become ready')
        run('docker', 'run', '--rm', '--network', name, '-v', str(secret) + ':/run/secrets:ro',
            '-v', str(ROOT / 'public/workshopos-demo.sqlite') + ':/source/demo.sqlite:ro',
            '-e', 'WORKSHOPOS_INITIALIZE=EMPTY_DEDICATED_STAGE49', 'workshopos-ci-api', 'python', '/deployment/initialize.py')
        # Initialization checks clean migration replay, bridge migration, duplicate import,
        # source checksum, all historical financial values and expected schema head.
        def sql(statement):
            run('docker', 'exec', '-i', name, 'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U',
                'stage4c_rehearsal_owner', '-d', 'postgres', '-c', statement)
        def financial_history(database):
            output = subprocess.check_output(['docker', 'exec', '-i', name, 'psql', '-X', '-qAt',
                '-v', 'ON_ERROR_STOP=1', '-U', 'stage4c_rehearsal_owner', '-d', database,
                '-c', 'BEGIN READ ONLY;' + FINANCIAL_QUERY + 'COMMIT;'], text=True)
            return validate_financial_history(output)
        original_finance = financial_history('workshopos_staging')
        failures = []
        results = {}
        for suite in selected:
            sql('CREATE DATABASE slice_test TEMPLATE workshopos_staging;')
            try:
                run('docker', 'run', '--rm', '--network', name,
                    '-v', str(fixtures) + ':/slice',
                    '-e', 'SLICE_STAGE=test', '-e', 'SLICE_PREFILL=false',
                    '-e', 'SLICE_ORIGIN=https://localhost:18444',
                    '-e', 'SLICE_DATABASE_URL=postgresql+psycopg://slice_auth:' + runtime + '@slice-test:5432/slice_test',
                    'workshopos-ci-api', 'python', '/slice/ci_financial_fixture.py' if suite == 'financial_workflows' else '/slice/test_' + suite + '.py')
                results[suite] = 'passed'
            except subprocess.CalledProcessError:
                failures.append(suite)
                results[suite] = 'failed'
                print('FAILED suite: ' + suite, flush=True)
            finally:
                if financial_history('slice_test') != original_finance:
                    failures.append(suite + ': historical finance changed')
                    results[suite] = 'failed: historical finance changed'
                else:
                    print('242 historical financial records unchanged after ' + suite, flush=True)
                sql('DROP DATABASE slice_test WITH (FORCE);')
                (ROOT / '.scratch/backend-ci-results.json').write_text(json.dumps(results, indent=2))
        if failures:
            raise RuntimeError('Failed suites: ' + ', '.join(failures))
        print('All disposable migration/auth/RBAC/business suites passed.')
    finally:
        # Teardown is restricted to resources created by this invocation.
        inspected = subprocess.run(['docker', 'inspect', '--format', '{{index .Config.Labels "workshopos.ci"}}', name], capture_output=True, text=True)
        if inspected.returncode == 0 and inspected.stdout.strip() == token:
            subprocess.run(['docker', 'rm', '-f', name], check=True)
        inspected = subprocess.run(['docker', 'network', 'inspect', '--format', '{{index .Labels "workshopos.ci"}}', name], capture_output=True, text=True)
        if inspected.returncode == 0 and inspected.stdout.strip() == token:
            subprocess.run(['docker', 'network', 'rm', name], check=True)
        shutil.rmtree(secret)
        (fixtures / '.generated/accounts.json').unlink()

if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError:
        sys.exit('CI container command failed; see preceding output (command credentials suppressed).')
    except RuntimeError as error:
        sys.exit(str(error))
