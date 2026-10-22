import json
from pathlib import Path
from PIL import Image,ImageChops
p=Path(__file__).parent/'artifacts';results={}
for a in sorted(p.glob('baseline-estimate-*.png')):
    state=a.name.removeprefix('baseline-');b=p/('slice-'+state)
    if not b.exists():raise AssertionError('Missing comparison '+str(b))
    x=Image.open(a).convert('RGB');y=Image.open(b).convert('RGB')
    if x.size!=y.size:
        results[state]={'size_difference':[x.size,y.size]};continue
    d=ImageChops.difference(x,y);d.save(p/('diff-'+state))
    results[state]={'different_pixels':sum(v!=(0,0,0) for v in d.getdata()),'bounds':d.getbbox(),'max_channel_difference':max(v[1] for v in d.getextrema()),'authorized_media_change':'media-authorized' in state}
(p/'estimate-visual-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
assert all(r.get('different_pixels')==0 or r.get('authorized_media_change') for r in results.values()),'Strict visual differences require review; baseline is unchanged'
