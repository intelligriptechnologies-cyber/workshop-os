"""Validate and persist existing administration state, never browser authority."""
import json,re,math,base64
from pathlib import Path
from fastapi import APIRouter,Request
from pydantic import BaseModel,ConfigDict
from sqlalchemy import text
from api import business,fail
from operations import command,update_fields
router=APIRouter(prefix='/api/v1/configuration')
DEFAULT=json.loads((Path(__file__).parent/'admin-defaults.json').read_text())
OPTIONS=json.loads((Path(__file__).parent/'admin-options.json').read_text())

def require(ok,message):
    if not ok:fail(message,422)

def structure(value,example,path):
    if isinstance(example,dict):
        require(isinstance(value,dict) and set(value)==set(example),'Invalid '+path+' fields.')
        for k,v in example.items():structure(value[k],v,path+'.'+k)
    elif isinstance(example,list):require(isinstance(value,list) and all(isinstance(v,str) for v in value),'Invalid '+path+'.')
    elif type(example) is bool:require(type(value) is bool,'Invalid '+path+'.')
    elif isinstance(example,(int,float)):require(type(value) in (int,float) and math.isfinite(value),'Invalid '+path+'.')
    else:require(isinstance(value,str),'Invalid '+path+'.')

def validate(s):
    require(set(s)==set(DEFAULT) and s['version']==DEFAULT['version'],'Invalid administration state.')
    require(len(json.dumps(s))<=8_000_000,'Settings exceed the supported size.')
    b=s['businessSettings'];structure(b,DEFAULT['businessSettings'],'business settings')
    require(bool(b['profile']['businessName'].strip()),'Business name is required.')
    require(bool(re.fullmatch(r'\S+@\S+\.\S+',b['profile']['email'].strip())),'Enter a valid business email.')
    require(bool(b['branch']['name'].strip()),'Branch name is required.')
    require(b['jobs']['defaultPromisedHours']>0,'Default promised hours must be greater than zero.')
    require(b['pricing']['estimateValidityDays']>0,'Estimate validity must be at least 1 day.')
    require(b['pricing']['defaultLabourRate']>=0,'Default labour rate cannot be negative.')
    require(0<=b['billing']['defaultGstPercent']<=100,'GST percent must be between 0 and 100.')
    for key,pattern,label in [('gstin',r'[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]','GSTIN'),('bankIfsc',r'[A-Z]{4}0[A-Z0-9]{6}','IFSC'),('upiId',r'[A-Za-z0-9._-]+@[A-Za-z0-9.-]+','UPI ID')]:
        require(not b['billing'][key] or bool(re.fullmatch(pattern,b['billing'][key])),'Invalid '+label+'.')
    for key in ('jobCardCreatedWhatsAppTemplate','jobCardCreatedEmailTemplate','jobCardClosedWhatsAppTemplate','jobCardClosedEmailTemplate'):require(bool(b['notifications'][key]),'Notification template is required.')
    require(b['branch']['holidayBehavior'] in ('closed','appointment-only'),'Invalid holiday behavior.')
    require(set(b['notifications']['customerChannels'])<= {'sms','email','whatsapp'},'Invalid customer notification channels.')
    require(all(type(v) is int and v>=0 for v in b['logRetention'].values()),'Invalid log retention.')
    theme=s['appTheme'];require(isinstance(theme,dict) and set(theme)==set(DEFAULT['appTheme']),'Invalid theme.')
    require(theme['fontId'] in OPTIONS['fonts'] and theme['paletteId'] in OPTIONS['palettes'],'Invalid theme selection.')
    roles=s['roles'];require(isinstance(roles,list) and all(isinstance(r,dict) for r in roles),'Invalid roles.')
    ids=[r.get('id') for r in roles];labels=[r.get('label','').strip().casefold() for r in roles]
    require(all(isinstance(i,str) and i for i in ids) and len(ids)==len(set(ids)) and all(labels) and len(labels)==len(set(labels)),'Role names and identities must be unique.')
    builtins={r['id']:r for r in DEFAULT['roles']}
    require(set(builtins)<=set(ids),'Built-in roles cannot be removed.')
    for r in roles:
        require(r.get('status') in ('active','archived'),'Invalid role status.')
        if r['id'] in builtins:require(r.get('systemRole')==builtins[r['id']]['systemRole'] and r.get('isBuiltIn') is True,'Built-in role identity cannot change.')
        else:require(not r.get('isBuiltIn') and not r.get('systemRole') and bool(re.fullmatch(r'custom-\d+',r['id'])),'Custom roles cannot become system roles.')
    require(next(r for r in roles if r['id']=='admin')['status']=='active','Owner/Admin cannot be archived.')
    access=s['rolePageAccess'];require(isinstance(access,dict) and set(access)<=set(ids),'Invalid role page grants.')
    for pages in access.values():require(isinstance(pages,list) and all(isinstance(p,str) and p in OPTIONS['pages'] for p in pages) and len(pages)==len(set(pages)),'Invalid page access.')
    require('admin-console' in access.get('admin',[]),'Owner administration access must remain enabled.')
    templates=s['reportTemplates'];require(isinstance(templates,list),'Invalid templates.')
    template_ids=[];active=[]
    for t in templates:
        require(isinstance(t,dict) and all(isinstance(t.get(k),str) for k in ('id','category','name','html','createdAt','updatedAt')) and type(t.get('active')) is bool,'Invalid report template.')
        require(t['category'] in OPTIONS['placeholders'] and bool(t['name'].strip()) and bool(t['html'].strip()),'Template name, category and HTML are required.')
        loops=re.findall(r'{{\s*#lines\s*}}([\s\S]*?){{\s*/lines\s*}}',t['html']);outside=re.sub(r'{{\s*#lines\s*}}[\s\S]*?{{\s*/lines\s*}}','',t['html'])
        for html,allowed in [(outside,OPTIONS['placeholders'][t['category']])]+[(loop,OPTIONS['placeholders'][t['category']]+OPTIONS['linePlaceholders']) for loop in loops]:
            require(all(key.strip() in allowed for key in re.findall(r'{{\s*([^{}]+?)\s*}}',html)),'Unsupported template placeholder.')
        template_ids.append(t['id'])
        if t['active']:active.append(t['category'])
    require(len(template_ids)==len(set(template_ids)) and len(active)==len(set(active)),'Duplicate template identity or active category.')
    assets=s['companyAssets'];require(isinstance(assets,dict) and set(assets)==set(DEFAULT['companyAssets']),'Invalid company assets.')
    for asset in assets.values():
        if asset is None:continue
        require(isinstance(asset,str) and bool(re.match(r'^data:image/(png|jpeg|webp);base64,',asset)) and len(asset)<=800000,'Invalid company image.')
        try:raw=base64.b64decode(asset.split(',',1)[1],validate=True)
        except (ValueError,TypeError):fail('Invalid company image.',422)
        require(raw.startswith(b'\x89PNG\r\n\x1a\n') or raw.startswith(b'\xff\xd8\xff') or (raw.startswith(b'RIFF') and raw[8:12]==b'WEBP'),'Invalid image content.')
    for key in ('logs','importBatches','sessionInventory'):require(isinstance(s[key],list) and all(isinstance(r,dict) for r in s[key]),'Invalid '+key+'.')
    batches={r.get('id') for r in s['importBatches']}
    for item in s['sessionInventory']:
        require(all(isinstance(item.get(k),str) and item[k].strip() for k in ('id','importBatchId','sku','name','category','unit')) and item['importBatchId'] in batches,'Invalid imported inventory record.')
        require(all(type(item.get(k)) in (int,float) and math.isfinite(item[k]) and item[k]>=0 for k in ('stockQty','lowStockQty','sellingPrice')),'Invalid imported inventory quantity or price.')

class Save(BaseModel):
    model_config=ConfigDict(extra='forbid')
    version:int
    state:dict

def current(c):
    r=c.execute(text('SELECT values,version FROM slice_admin_configuration')).mappings().one()
    return {'state':r['values'],'version':r['version']}

def authorize(c,u,path,method):
    if path.startswith('/api/v1/auth/') or path=='/api/v1/session':return
    s=current(c)['state'];role=next((r for r in s['roles'] if r.get('systemRole')==u['role']),None)
    if not role or role['status']!='active':fail('This role is inactive.',403)
    if method in ('GET','HEAD','OPTIONS'):return
    pages=set(s['rolePageAccess'].get(role['id'],[]))
    if path.startswith('/api/v1/configuration'):required={'admin-console','quotation-settings'}
    elif path.startswith('/api/v1/administration'):required={'admin-console','manage'}
    elif path.startswith('/api/v1/catalog'):required={'admin-console','manage','job-card','jobs','estimate'}
    elif path.startswith('/api/v1/sales'):required={'sales-leads','quotations'}
    elif path.startswith('/api/v1/bookings'):required={'advance-bookings'}
    elif path.startswith('/api/v1/customers'):required={'customers','manage','today-queue','receive-vehicle'}
    elif path.startswith('/api/v1/vehicles'):required={'vehicles','manage','today-queue','receive-vehicle'}
    elif path.startswith('/api/v1/reception'):required={'today-queue','receive-vehicle','jobs','my-queue','manage'}
    elif path.startswith('/api/v1/stock'):required={'stock','inward-purchases','material-requests','issue-material','reconcile','manage','jobs','job-card','search'}
    elif path.startswith('/api/v1/financial'):required={'invoice','payment','delivery','ready-to-invoice','manage','jobs','job-card'}
    elif path.startswith('/api/v1/execution'):required={'my-tasks','work-update','qc-prep','follow-ups','job-card','jobs','manage'}
    else:required={'jobs','job-card','my-queue','estimate','media','approvals','manage','search'}
    if not pages.intersection(required):fail('Page access does not permit this action.',403)

@router.get('')
def read(request:Request):
    with business(request,snapshot=True) as (c,_):return current(c)

@router.post('')
def save_config(value:Save,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        if u['role']!='admin':fail('Only Admin can change configuration.',403)
        if replay:return replay
        before=current(c)
        if value.version!=before['version']:fail('Settings changed. Reload before saving.',409)
        validate(value.state)
        c.execute(text('UPDATE slice_admin_configuration SET values=CAST(:v AS jsonb),version=version+1,updated_at=now(),updated_by=:a'),{'v':json.dumps(value.state),'a':u['user_id']})
        return save(current(c))
