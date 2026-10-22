"""Read-only protected-file comparison against pre-existing migration evidence."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
DOC=ROOT/'docs/backend-migration'

def verify():
    baseline=json.loads((DOC/'stage4c-rehearsal-preflight.json.md').read_text(encoding='utf-8-sig'))
    files=baseline['files']
    checks={p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==h for p,h in files.items()}
    protected=json.loads((DOC/'stage2-protected-file-manifest.json.md').read_text(encoding='utf-8-sig'))
    assert len(protected['files'])==115
    for entry in protected['files']:
        assert hashlib.sha256((ROOT/entry['path']).read_bytes()).hexdigest()==entry['git_sha256']
    screenshots=[p for p in files if p.endswith('.png') and p!='public/car-damage-diagram.png']
    assert len(screenshots)==94
    sqlite=[p for p in files if p.endswith('.sqlite')]
    head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
    assert head==baseline['head'] and all(checks.values())
    return {'head':head,'protected_files':115,'screenshots':len(screenshots),'screenshot_paths':screenshots,
            'sqlite_copies':len(sqlite),'all_baseline_files':len(checks),
            'all_unchanged':all(checks.values()),'checks':checks,
            'runtime_visual_verification':'NOT_RUN'}

if __name__=='__main__':
    result=verify()
    (DOC/'stage4c2-protection.json.md').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print({k:v for k,v in result.items() if k not in ('checks','screenshot_paths')})
