import fs from 'node:fs';
import ts from 'typescript';
import crypto from 'node:crypto';
const base='data-migration/evidence/';
const catalog=JSON.parse(fs.readFileSync(base+'evidence-catalog.json.md'));
const components=['# Exact component implementations','Source evidence, not proof of execution. Includes private handlers, state defaults and render branches.'];
const helpers=['# Private helper and callback contracts','Source evidence for validations, calculations and guards not represented by exported operations.'];
const hashes={};
for(const name of fs.readdirSync('src').filter(n=>/\.tsx?$/.test(n))){
 const file='src/'+name,source=fs.readFileSync(file,'utf8');
 hashes[file]=crypto.createHash('sha256').update(source).digest('hex');
 const lines=source.split(/\r?\n/);
 for(const c of catalog.components.filter(c=>c.file===file)){
  const [,from,to]=c.span.match(/:(\d+)-(\d+)/);
  components.push(`\n## ${c.id}\n\n${c.span}\n\n~~~tsx\n${lines.slice(Number(from)-1,Number(to)).join('\n')}\n~~~`);
 }
 const sf=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,name.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 const walk=n=>{
  const privateFunction=ts.isFunctionDeclaration(n)&&n.name&&!n.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)&&!(/^[A-Z]/.test(n.name.text)&&name.endsWith('tsx'));
  const callback=ts.isVariableDeclaration(n)&&n.initializer&&(ts.isArrowFunction(n.initializer)||ts.isFunctionExpression(n.initializer));
  if(privateFunction||callback)helpers.push(`\n## ${file} ${n.name.getText(sf)}\n\n${file}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1}\n\n~~~typescript\n${n.getText(sf)}\n~~~`);
  ts.forEachChild(n,walk);
 };walk(sf);
}
for(const file of ['src/styles.css','package.json','package-lock.json','vite.config.ts','playwright.config.ts']) hashes[file]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
fs.copyFileSync('src/styles.css',base+'styles-baseline.css');
fs.writeFileSync(base+'component-implementations.md',components.join('\n'));
fs.writeFileSync(base+'private-helper-contracts.md',helpers.join('\n'));
fs.writeFileSync(base+'source-hashes.json',JSON.stringify(hashes,null,2));
