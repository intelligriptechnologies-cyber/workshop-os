// Audit-only extraction. Execute through node --input-type=module on stdin from repo root.
import fs from 'node:fs';
import ts from 'typescript';
const out='data-migration/evidence/';
const files=fs.readdirSync('src').filter(x=>/\.tsx?$/.test(x)).map(x=>'src/'+x);
const clean=x=>String(x??'').replace(/\s+/g,' ').replace(/\|/g,'\\|');
const fence='```';
const components=[], controls=[], forms=[], operations=[], types=[], tests=[], states=[];
let ui=['# Exhaustive static UI declaration ledger','','Counts are source declaration sites, not rendered instances. Dynamic maps can instantiate many controls. Legacy/unreachable declarations are retained and explicitly not asserted reachable. IDs are fixed to this revision and source line. Fields preserve exact JSX attributes, including required/default/value/disabled rules. Ancestor expressions preserve conditional visibility. Use parent component IDs to join screens and actions.'];
let ops=['# Operation and workflow source contracts','','Each exported function has its exact implementation, inputs, call dependencies, SQL evidence, validation/error branches and source span. This is static VERIFIED evidence; runtime effects are PARTIALLY VERIFIED until exercised. Helper calls are linked by literal symbol. No proposed endpoint path is implied.'];
let typeDoc=['# Type, status and master constants contracts',''];
for(const file of files){
 const source=fs.readFileSync(file,'utf8');
 const sf=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 const line=n=>sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1;
 const span=n=>file+':'+line(n)+'-'+(sf.getLineAndCharacterOfPosition(n.end).line+1);
 const owner=n=>{for(let p=n.parent;p;p=p.parent){if(ts.isFunctionDeclaration(p)&&p.name&&/^[A-Z]/.test(p.name.text)) return p.name.text;if(ts.isVariableDeclaration(p)&&/^[A-Z]/.test(p.name.getText(sf)))return p.name.getText(sf);}return 'module';};
 const walk=n=>{
  if(ts.isFunctionDeclaration(n)&&n.name){
   const name=n.name.text, body=n.getText(sf);
   if(/^[A-Z]/.test(name)&&file.endsWith('tsx')){components.push({id:'CMP-'+file.slice(4,-4)+'-'+name,name,file,span:span(n)});}
   if(n.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)&&!file.endsWith('tsx')){
    const calls=new Set();const sql=[];const scan=p=>{if(ts.isCallExpression(p)){calls.add(p.expression.getText(sf));if(/^(db\.|insert$|all$|one$|maybe$|scalar$)/.test(p.expression.getText(sf)))sql.push(clean(p.getText(sf)));}ts.forEachChild(p,scan);};scan(n);
    const id='OP-'+file.slice(4,-3)+'-'+name;operations.push({id,name,file,span:span(n),calls:[...calls],sql,body});
    ops.push('','## '+id,'','Source: '+span(n),'','Dependencies: '+[...calls].join(', '),'',fence+'typescript',body,fence);
   }
  }
  if(ts.isInterfaceDeclaration(n)||ts.isTypeAliasDeclaration(n)){types.push({name:n.name.text,file,span:span(n)});typeDoc.push('','## TYPE-'+n.name.text,'',span(n),'',fence+'typescript',n.getText(sf),fence);}
  if(ts.isVariableDeclaration(n)&&n.initializer&&n.parent.parent===sf.statements.find(s=>s===n.parent.parent)&&/^[A-Z][A-Z_0-9]+$/.test(n.name.getText(sf))){typeDoc.push('', '## CONST-'+n.name.getText(sf),'',span(n),'',fence+'typescript',n.getText(sf),fence);}
  if(ts.isJsxOpeningElement(n)||ts.isJsxSelfClosingElement(n)){
   const tag=n.tagName.getText(sf), attrs=n.attributes.properties.map(a=>a.getText(sf)).join(' ');
   const isControl=/^(button|input|select|textarea|a|summary|SearchSelect|JobPicker|PageSizeSelect|DownloadMenu|DocumentDownloadButton|ViewModeToggle|PaginationToolbar|ResultPagination)$/.test(tag)||/\bon[A-Z]\w*=/.test(attrs);
   const isForm=tag==='form';const isState=/^(Dialog|Modal|Drawer)$/.test(tag)||/role=["'](dialog|tab|tablist|tabpanel|alert|status)/.test(attrs);
   if(isControl||isForm||isState){
    const parent=ts.isJsxOpeningElement(n)?n.parent:n;
    const label=ts.isJsxElement(parent)?parent.children.map(x=>x.getText(sf)).join(' '):'';
    const ancestors=[];for(let p=n.parent;p&&!ts.isFunctionDeclaration(p);p=p.parent){if(ts.isConditionalExpression(p))ancestors.push(clean(p.condition.getText(sf)));if(ts.isBinaryExpression(p)&&p.operatorToken.kind===ts.SyntaxKind.AmpersandAmpersandToken)ancestors.push(clean(p.left.getText(sf)));}
    const id=(isForm?'FORM-':isState?'STATE-':'ACT-')+file.slice(4).replace(/\W/g,'-')+'-'+line(n);
    const obj={id,file,line:line(n),owner:owner(n),tag,attrs:clean(attrs),label:clean(label),conditions:ancestors.join('; ')};
    if(isForm)forms.push(obj);if(isControl)controls.push(obj);if(isState)states.push(obj);
    ui.push('','### '+id,'', 'Component: '+owner(n)+' Â· '+span(n),'', 'Tag: '+tag+'; visibility: '+(obj.conditions||'No enclosing JSX conditional; inspect owning component guard.'),'',fence+'tsx',n.getText(sf),fence,'', 'Content/label expression: '+clean(label));
   }
  }
  ts.forEachChild(n,walk);
 };walk(sf);
}
const walkDir=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walkDir(d+'/'+e.name):[d+'/'+e.name]);
for(const file of [...walkDir('unit-tests'),...walkDir('tests'),...walkDir('backend/tests')].filter(x=>/\.(ts|py)$/.test(x))){const source=fs.readFileSync(file,'utf8');source.split('\n').forEach((s,i)=>{if(/\b(test|it)\s*\(|\bdef test_/.test(s))tests.push({id:'TEST-'+file.replace(/\W/g,'-')+'-'+(i+1),file,line:i+1,contract:clean(s)});});}
fs.writeFileSync(out+'evidence-ui-controls.md',ui.join('\n'));
fs.writeFileSync(out+'evidence-operation-contracts.md',ops.join('\n'));
fs.writeFileSync(out+'evidence-types-and-constants.md',typeDoc.join('\n'));
fs.writeFileSync(out+'evidence-component-index.md',['# Component index','','| ID | Source |','|---|---|',...components.map(c=>'| '+c.id+' | '+c.span+' |')].join('\n'));
fs.writeFileSync(out+'evidence-test-index.md',['# Test declaration index','','Existing test assertions are source evidence, not proof of execution in this audit. Multiline test names are resolved in the source, not inferred from this declaration list.','','| ID | Source | Declaration |','|---|---|---|',...tests.map(t=>'| '+t.id+' | '+t.file+':'+t.line+' | '+t.contract+' |')].join('\n'));
fs.writeFileSync(out+'evidence-catalog.json.md',JSON.stringify({components,controls,forms,states,operations,types,tests},null,2));
console.log(JSON.stringify({components:components.length,controls:controls.length,forms:forms.length,states:states.length,operations:operations.length,types:types.length,tests:tests.length}));


