import json
from pathlib import Path
from PIL import Image,ImageChops
p=Path(__file__).parent/'artifacts';results={}
for file in sorted(p.glob('baseline-stock-*.png')):
 a=Image.open(file).convert('RGB');b=Image.open(p/file.name.replace('baseline-','slice-')).convert('RGB');assert a.size==b.size
 d=ImageChops.difference(a,b);results[file.name.removeprefix('baseline-stock-')]={'different_pixels':sum(x!=(0,0,0) for x in d.getdata()),'bounds':d.getbbox(),'max_channel_difference':max(x[1] for x in d.getextrema())};d.save(p/file.name.replace('baseline-','diff-'))
(p/'stock-visual-results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
