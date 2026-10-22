import json
from pathlib import Path
from PIL import Image,ImageChops
p=Path(__file__).parent/'artifacts';results={}
for a in sorted(p.glob('baseline-financial-*.png')):
    state=a.name.removeprefix('baseline-');b=p/('slice-'+state)
    x=Image.open(a).convert('RGB');y=Image.open(b).convert('RGB')
    assert x.size==y.size,(state,x.size,y.size)
    d=ImageChops.difference(x,y);d.save(p/('diff-'+state))
    results[state]=dict(different_pixels=sum(v!=(0,0,0) for v in d.getdata()),bounds=d.getbbox(),max_channel_difference=max(v[1] for v in d.getextrema()))
for kind in ['Invoice','Payment-Receipt','Gate-Pass']:
    results[kind+' HTML']={'identical':(p/('baseline-financial-'+kind+'.html')).read_bytes()==(p/('slice-financial-'+kind+'.html')).read_bytes()}
(p/'financial-visual-results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
assert all(r.get('different_pixels',0)==0 and r.get('identical',True) for r in results.values()),'Strict visual comparison requires review; baseline remains unchanged'
