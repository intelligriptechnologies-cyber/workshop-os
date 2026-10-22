"""Exact comparisons; never updates approved screenshot baselines."""
import json
from pathlib import Path
from PIL import Image,ImageChops
p=Path(__file__).parent/'artifacts'; results={}
for state in ['login','list','add','edit','view','search']:
    a=Image.open(p/f'baseline-{state}.png').convert('RGB')
    b=Image.open(p/f'slice-{state}.png').convert('RGB')
    assert a.size==b.size
    diff=ImageChops.difference(a,b)
    count=sum(v!=(0,0,0) for v in diff.getdata())
    results[state]={'different_pixels':count,'total_pixels':a.width*a.height}
    diff.save(p/f'diff-{state}.png')
(p/'visual-results.json').write_text(json.dumps(results,indent=2))
assert all(v['different_pixels']==0 for v in results.values()),results
print('6/6 affected states pixel-identical to approved baseline build')
