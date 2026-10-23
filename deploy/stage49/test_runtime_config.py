import os
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'backend/customer-slice'))
from runtime_config import load_runtime


class RuntimeTests(unittest.TestCase):
    def test_local_unchanged(self):
        for stage, host, db in [('development','slice-dev','slice_dev'),('test','slice-test','slice_test')]:
            result = load_runtime(dict(SLICE_STAGE=stage, SLICE_ORIGIN='https://localhost:18444', SLICE_PREFILL='true', SLICE_DATABASE_URL=f'postgresql+psycopg://slice_auth:fixture@{host}:5432/{db}'))
            self.assertTrue(result[2])

    def test_staging_secret_and_target_guards(self):
        with tempfile.TemporaryDirectory() as directory:
            secret = Path(directory)/'url'
            secret.write_text('postgresql+psycopg://slice_auth:fixture@workshopos-db:5432/workshopos_staging')
            env = dict(SLICE_STAGE='staging', SLICE_ORIGIN='https://workshopos-staging.example.com', SLICE_PREFILL='false', SLICE_DATABASE_URL_FILE=str(secret))
            self.assertEqual(load_runtime(env)[0], 'staging')
            for field,value in [('SLICE_STAGE','production'),('SLICE_PREFILL','true'),('SLICE_ORIGIN','http://example.com'),('SLICE_ORIGIN','https://example.com/path'),('SLICE_ORIGIN','https://user@example.com'),('SLICE_DATABASE_URL','postgresql://example.com')]:
                with self.subTest(field=field,value=value), self.assertRaises(RuntimeError):
                    load_runtime({**env,field:value})
            for value in ['postgresql+psycopg://slice_owner:fixture@workshopos-db/workshopos_staging','postgresql+psycopg://slice_auth:fixture@shared-db/workshopos_staging','postgresql+psycopg://slice_auth:fixture@workshopos-db/production','postgresql+psycopg://slice_auth:fixture@workshopos-db:5433/workshopos_staging']:
                secret.write_text(value)
                with self.subTest(target=value), self.assertRaises(RuntimeError): load_runtime(env)

if __name__ == '__main__': unittest.main()
