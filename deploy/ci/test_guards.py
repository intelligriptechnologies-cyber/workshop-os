"""Negative release-input tests, without Docker or host access."""
import copy
import unittest
import tempfile
import time
from pathlib import Path
from deploy import validate_release, validate_checkpoint, unchanged_inventory, digest, SCHEMA

class ReleaseGuards(unittest.TestCase):
    def setUp(self):
        self.release = {'commit': 'a' * 40, 'images': {
            s: 'ghcr.io/owner/workshop-' + s + '@sha256:' + 'b' * 64
            for s in ('api', 'frontend')}}

    def test_digest_pair_accepted(self):
        validate_release(self.release, 'Owner/Workshop')

    def test_untrusted_inputs_rejected(self):
        for value in ['ghcr.io/owner/workshop-api:latest',
                      'ghcr.io/attacker/workshop-api@sha256:' + 'b' * 64,
                      'ghcr.io/owner/workshop-frontend@sha256:' + 'b' * 64,
                      'ghcr.io/owner/workshop-api@sha256:bad',
                      '$(touch /tmp/unsafe)']:
            with self.subTest(value=value), self.assertRaises(RuntimeError):
                release = copy.deepcopy(self.release)
                release['images']['api'] = value
                validate_release(release, 'owner/workshop')

    def test_extra_service_rejected(self):
        self.release['images']['db'] = 'postgres:latest'
        with self.assertRaises(RuntimeError):
            validate_release(self.release, 'owner/workshop')

    def test_non_sha_commit_rejected(self):
        self.release['commit'] = 'Prem-dev-fbb-Go21'
        with self.assertRaises(RuntimeError):
            validate_release(self.release, 'owner/workshop')

    def test_database_proxy_and_unrelated_containers_are_protected(self):
        def container(name):
            return {'Name': '/' + name, 'Id': '1', 'Image': 'sha256:x',
                    'State': {'StartedAt': 'now'}, 'RestartCount': 0}
        names = ['workshopos-stage51-api-1', 'workshopos-stage51-frontend-1',
                 'workshopos-stage51-db-1', 'workshopos-stage51-private-https-1', 'shared-caddy']
        inventory = unchanged_inventory([container(n) for n in names])
        self.assertEqual(set(inventory), {'/' + n for n in names[2:]})

    def test_recovery_requires_matching_fresh_verified_evidence(self):
        with tempfile.TemporaryDirectory() as directory:
            artifact = Path(directory) / 'evidence'
            artifact.write_text('verified fixture evidence')
            item = {'path': str(artifact), 'sha256': digest(artifact)}
            images = {'api': 'sha256:old-api', 'frontend': 'sha256:old-front'}
            checkpoint = dict(verified_at=time.time(), schema=SCHEMA, previous_images=images,
                              candidate_commit='a' * 40, restore_verified=True,
                              offhost_retrieval_verified=True, rollback_same_schema_verified=True,
                              database_backup=item, restore_report=item, rollback_report=item)
            validate_checkpoint(checkpoint, images, 'a' * 40)
            for field, value in [('verified_at', time.time() - 3601), ('verified_at', time.time() + 60),
                                 ('schema', 'old'), ('previous_images', {}), ('candidate_commit', 'b' * 40),
                                 ('restore_verified', False), ('offhost_retrieval_verified', False),
                                 ('rollback_same_schema_verified', False)]:
                with self.subTest(field=field), self.assertRaises(RuntimeError):
                    validate_checkpoint({**checkpoint, field: value}, images, 'a' * 40)
            artifact.write_text('changed')
            with self.assertRaises(RuntimeError):
                validate_checkpoint(checkpoint, images, 'a' * 40)

if __name__ == '__main__':
    unittest.main()
