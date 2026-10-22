import json
from pathlib import Path
from PIL import Image,ImageChops
p=Path(__file__).parent/'artifacts';results={}
for a in sorted(p.glob('baseline-*.png')):
 state=a.name.removeprefix('baseline-');b=p/('slice-'+state)
 if not b.exists():continue
 x=Image.open(a).convert('RGB');y=Image.open(b).convert('RGB');assert x.size==y.size
 d=ImageChops.difference(x,y);count=sum(v!=(0,0,0) for v in d.getdata());d.save(p/('diff-'+state))
 results[state]={'different_pixels':count,'bounds':d.getbbox(),'max_channel_difference':max(channel[1] for channel in d.getextrema())}
(p/'operational-visual-results.json').write_text(json.dumps(results,indent=2))
print(results);assert all(r['different_pixels']==0 for r in results.values())
print(len(results),'states pixel-identical')
