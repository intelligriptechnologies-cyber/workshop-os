"""Publish paired OCI images; tags are discovery only, deployment uses digests."""
import json
import hashlib
import os
import subprocess
from pathlib import Path

release = {'commit': os.environ['GITHUB_SHA'], 'run_id': os.environ['GITHUB_RUN_ID'], 'images': {},
           'helper_sha256': hashlib.sha256(Path('deploy/ci/deploy.py').read_bytes()).hexdigest()}
for service in ('api', 'frontend'):
    name = 'ghcr.io/' + os.environ['GITHUB_REPOSITORY'].lower() + '-' + service
    tag = name + ':' + release['commit'] + '-' + release['run_id'] + '-' + os.environ['GITHUB_RUN_ATTEMPT']
    subprocess.run(['docker', 'tag', 'workshopos-ci-' + service, tag], check=True)
    subprocess.run(['docker', 'push', tag], check=True)
    refs = json.loads(subprocess.check_output(['docker', 'image', 'inspect', '--format', '{{json .RepoDigests}}', tag]))
    release['images'][service] = next(ref for ref in refs if ref.startswith(name + '@sha256:'))
Path('.scratch/postgres-release.json').write_text(json.dumps(release, indent=2) + '\n')
with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as summary:
    summary.write('Release commit: `' + release['commit'] + '`\n\n')
    for service, ref in release['images'].items():
        summary.write(service + ': `' + ref + '`\n\n')
