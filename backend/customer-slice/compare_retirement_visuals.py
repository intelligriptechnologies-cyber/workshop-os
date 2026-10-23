from pathlib import Path
from PIL import Image,ImageChops
import json
p=Path('backend/customer-slice/artifacts/retirement-visual');result=[]
for a in sorted(p.glob('baseline-*.png')):
 b=p/a.name.replace('baseline-','slice-',1)
 if not b.exists():continue
 x=Image.open(a).convert('RGB');y=Image.open(b).convert('RGB');assert x.size==y.size
 d=ImageChops.difference(x,y);count=sum(v!=(0,0,0) for v in d.getdata());ext=d.getextrema();result.append(dict(state=a.stem.removeprefix('baseline-'),different_pixels=count,max_channel_difference=max(z[1] for z in ext),bbox=d.getbbox()))
 if count:d.save(p/a.name.replace('baseline-','diff-',1))
Path('backend/customer-slice/artifacts/retirement-visual-comparison.json').write_text(json.dumps(result,indent=2));print(len(result),'compared;',sum(r['different_pixels']==0 for r in result),'exact');print([r for r in result if r['different_pixels']])

if any(r['different_pixels'] for r in result):raise SystemExit(1)
