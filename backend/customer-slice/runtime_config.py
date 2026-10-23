"""Explicit local/staging targets; never accepts an arbitrary production URL."""
from pathlib import Path
from urllib.parse import urlsplit
from sqlalchemy.engine import make_url


def load_runtime(environ):
    stage = environ['SLICE_STAGE']
    origin = environ['SLICE_ORIGIN']
    prefill = environ.get('SLICE_PREFILL') == 'true'
    if stage not in ('development', 'test', 'staging'):
        raise RuntimeError('Unsupported deployment stage')
    if prefill and stage not in ('development', 'test'):
        raise RuntimeError('Production fixture prohibited')
    secret_file = environ.get('SLICE_DATABASE_URL_FILE')
    if secret_file and environ.get('SLICE_DATABASE_URL'):
        raise RuntimeError('Ambiguous database configuration')
    raw = Path(secret_file).read_text().strip() if secret_file else environ['SLICE_DATABASE_URL']
    try:
        url = make_url(raw)
    except Exception:
        raise RuntimeError('Invalid database configuration') from None
    expected = [('slice-dev', 'slice_dev', 'slice_auth'), ('slice-test', 'slice_test', 'slice_auth')]
    if stage == 'staging':
        expected = [('workshopos-db', 'workshopos_staging', 'slice_auth')]
        parsed = urlsplit(origin)
        if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password or parsed.path or parsed.query or parsed.fragment:
            raise RuntimeError('Staging requires an exact HTTPS origin')
        if not secret_file or environ.get('SLICE_PREFILL') != 'false':
            raise RuntimeError('Staging requires a database secret file and disabled prefill')
    if (url.host, url.database, url.username) not in expected or url.query or url.drivername != 'postgresql+psycopg' or url.port not in (None, 5432) or not url.password:
        raise RuntimeError('Database target is outside the permitted deployment boundary')
    return stage, origin, prefill, url
