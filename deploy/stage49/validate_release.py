"""Read-only release gate. Prints no rendered environment or secret values."""
import argparse
import json
import re
import subprocess
from pathlib import Path

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--env-file',required=True)
    args=parser.parse_args()
    root=Path(__file__).resolve().parents[2]
    config=json.loads(subprocess.check_output(['docker','compose','--env-file',args.env_file,'-p','workshopos-stage49','-f',str(root/'deploy/stage49/compose.yaml'),'-f',str(root/'deploy/stage49/compose.initialize.yaml'),'config','--format','json']))
    for name,s in config['services'].items():
        if not re.fullmatch(r'(?:sha256:|[^\s]+@sha256:)[a-f0-9]{64}',s['image']):
            raise SystemExit('Unpinned image rejected: '+name)
        if s.get('ports') or s.get('privileged') or s.get('network_mode')=='host':
            raise SystemExit('Public/privileged service rejected: '+name)
    assert config['services']['api']['environment']['SLICE_STAGE']=='staging'
    assert config['services']['api']['environment']['SLICE_PREFILL']=='false'
    assert config['networks']['database']['internal']
    print('Immutable-image/no-host-port/staging configuration gate passed; no services started.')

if __name__=='__main__': main()
