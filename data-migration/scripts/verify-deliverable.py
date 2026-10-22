import pathlib,json,re,hashlib,urllib.parse
R=pathlib.Path('data-migration');main=R/'Current App clone info file.md'
content=main.read_text(encoding='utf8')
# Links inside source code fences are not Markdown references.
prose=re.sub(r'```[^\n]*\n.*?\n```','',content,flags=re.S)
missing=[];checked=0
for target in re.findall(r'\]\(([^)]+)\)',prose):
 if target.startswith(('http:','https:','#')):continue
 path=R/urllib.parse.unquote(target.split('#')[0]);checked+=1
 if not path.exists():missing.append(str(path))
hashes=json.loads((R/'evidence/source-hashes.json').read_text())
source_unchanged=all(hashlib.sha256(pathlib.Path(f).read_bytes()).hexdigest()==h for f,h in hashes.items())
shipped=json.loads((R/'demo-data/shipped-inventory.json').read_text())
original_unchanged=hashlib.sha256(pathlib.Path('public/workshopos-demo.sqlite').read_bytes()).hexdigest()==shipped['sha256']
catalog=json.loads((R/'evidence/evidence-catalog.json.md').read_text(encoding='utf8'))
missing_controls=[c['id']for c in catalog['controls']if c['id'] not in content]
result={'main_file':str(main),'link_count':checked,'missing_links':missing,'source_hashes_match':source_unchanged,'original_shipped_hash_matches':original_unchanged,'source_control_count':len(catalog['controls']),'missing_control_ids':missing_controls,'page_heading_count':len(re.findall(r'^#### `',content,re.M))}
(R/'evidence/deliverable-verification.json').write_text(json.dumps(result,indent=2))
manifest={str(p.relative_to(R)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest()for p in R.rglob('*')if p.is_file() and p.name!='sha256-manifest.json'}
(R/'evidence/sha256-manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(result))
if missing or missing_controls or not source_unchanged or not original_unchanged or result['page_heading_count']!=32:raise SystemExit(1)
