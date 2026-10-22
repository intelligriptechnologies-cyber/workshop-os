"""Build the single clone specification from preserved audit evidence."""
from pathlib import Path
import json, hashlib, re
R=Path('data-migration')
def text(p):
    b=(R/p).read_bytes()
    return b.decode('utf-16' if b.startswith((b'\xff\xfe',b'\xfe\xff')) else 'utf-8-sig')
def read(p): return json.loads(text(p))
C=read('evidence/evidence-catalog.json.md');D=read('demo-data/runtime-defaults.json');B=read('evidence/runtime-capture.json')
S=read('demo-data/shipped-inventory.json');T=read('demo-data/runtime-initial-inventory.json')
def esc(s): return str(s).replace('|','&#124;').replace('\n',' ').replace('<','&lt;').replace('>','&gt;')
def link(path,label=None): return f'[{label or path}]({path.replace(" ","%20")})'
def src(span):
    path,lines=span.split(':',1)
    return link('../'+path,span)
out=[]
def add(s=''):out.append(s)
add('''# WorkshopOS — Current App clone info file

## Scope and evidence rules

This is the single main clone requirements and inspection document for the current local checkout. Preserve the approved appearance, labels, controls, navigation, calculations, roles and workflow sequences. This task documents the current application; it does not approve a new backend architecture, redesign, production deployment, or retirement of existing storage.

**Status: source inventory and local runtime evidence captured; full acceptance remains open for the explicit gaps below.** A source declaration proves an implemented branch exists, not that it is reachable or correct. A screenshot proves the captured state, not all actions on that screen. Passing named tests prove only their assertions. Failed baseline tests are findings, not desired behavior to silently reproduce or repair.

The initial 32 page keys and seven roles are confirmed against the current source. Login, developer utilities, nested tabs, record dialogs, conditional remote screens and legacy declarations are additional surfaces, not extra page keys. The declaration ledger at the end accounts for all extracted controls, forms and explicit dialog/tab/status declarations, including conditional expressions and handler attributes.
''')
revision=text('evidence/baseline-revision.txt').strip()
add(f'- Inspected revision: `{revision}`; branch `Prem-dev-fbb-Go21`. This identifies the checkout, not independent evidence of client sign-off.\n- Existing working-tree changes were preserved: {link("evidence/initial-working-tree.txt")}.\n- Inspected local URL: `{B["url"]}`; isolated Playwright Chromium `{B["browser"]}`. Capture began `{B["at"]}` UTC. Dates/month filters depend on the runtime clock; do not replace historical record dates with today.\n- Connected browser inventory returned no browsers or apps. The user’s existing browser and URL were requested but not supplied during this audit. Personal session data has **not** been captured or compared.\n- Prior `docs/backend-migration/` contained supporting extraction evidence rather than a signed-off main requirements specification. This document regenerates source evidence from the current checkout.\n- Graft was consulted before source inspection; ranked results were supplemented by exhaustive storage discovery and component/source ledgers.')
add('''
## Reading and verification map

1. Page and role matrices below define destinations and access.
2. Workflow contracts define handoffs and invariants.
3. The data inventory and restoration procedure define the preserved demo baseline.
4. Runtime evidence links show actual screenshots, visible controls, defaults and options.
5. The component and control ledger defines exact field bindings, required/disabled rules, handlers and conditional visibility. Full handler implementations and operation contracts are linked to avoid guessing validations from labels.

Verification terms: **SOURCE** = inspected/extracted implementation; **CAPTURED** = rendered in an isolated browser; **TEST PASS/FAIL** = named automated result; **UNVERIFIED** = not exercised or dependent on unavailable services/session. These terms are not interchangeable.

## Page inventory — all 32 keys

Every entry must preserve its existing layout and interactions. Some labels deliberately differ from their key. The Receive Vehicle key is in the catalogue but absent from default rails; the intake action is a dialog reached from the reception workflow. No new standalone route is required.
''')
descriptions={
'receive-vehicle':('CreateVisitDialog','Intake: existing/new customer and vehicle, advisor, ODO, fuel/battery, keys, accessories, requested work and body marks; Details/body-mark tabs, create/cancel and notification handoff. Catalogue key is not a default sidebar entry.'),
'advance-bookings':('BookingOperations, BookingCalendar, BookingCheckInDialog','Calendar/register, date/service/status filters, capacity configuration and overrides, booking create/edit, call logs, confirmation, reschedule/cancel/no-show reasons and arrival check-in to visit/job.'),
'today-queue':('Reception, ReceptionQueueRows, AdvisorAttendancePanel','Receive vehicle action, today/older queues, advisor attendance and assigned queues, select job, filters/reset; links intake to service advisor.'),
'customers':('EntityList, CustomerRecordDialog, CustomerEditor','Customer registry with search/filter/sort/page/export/view modes, linked vehicles/jobs, add/view/edit/archive and validation.'),
'vehicles':('EntityList, VehicleRecordDialog, VehicleMasterPanel','Vehicle registry and customer relationship; registration/make/model/color/ODO, add/view/edit/archive, linked history and list controls.'),
'search':('SearchPortal, AdminSearchOperationalWorkspace','Role-filtered category selector; query/status/date/month/payment-mode/low-stock filters, clear, paging, export and record navigation. Admin categories embed inventory/estimate/follow-up workflows. Remote mode substitutes RemoteFollowupsWorkspace.'),
'my-queue':('ServiceAdvisor, ServiceAdvisorList, EntityList','Advisor assigned active jobs with direct record actions. Service manager dispatches through EntityList because the role is not service; do not assume identical advisor filtering or edit permissions.'),
'job-card':('ServiceAdvisorList, JobRecordDialog, JobEditor','Job list and detail/edit views, job sheet/body marks, lifecycle checklist, estimates/materials/tasks/QC, notes, media and linked documents.'),
'estimate':('ServiceAdvisorList, ServiceEstimateDialog, EstimateDialog','Estimate list and item editor, quantity/rate/GST/discount totals, draft/save/view/approve, customer confirmation and document output.'),
'follow-ups':('ServiceAdvisorList, ServiceFollowupDialog','Follow-up list, add/view/edit, due date/type/status/note, resolution and material-related records; remote conditional workspace has separate API/loading/error behavior.'),
'media':('EntityList, JobMediaPanel, MediaMetadataDialog','Job-associated before/after/evidence images, category filters, file uploads, metadata edit, preview and archive; payload persistence limitation below.'),
'material-requests':('StoreDesk, StoreList, MaterialProcurementTriage','Pending material requirements, availability, job selection and procurement triage, create purchase request or issue available stock.'),
'issue-material':('StoreDesk, IssueMaterialEditor, ReleaseMaterialDialog','Issue/release material quantities for a job; enforce available stock and actor/approval checks; record stock movement.'),
'reconcile':('StoreDesk, ReconcileEditor','Issued/used/returned/wasted quantities, reconciliation reasons and inventory effects; unresolved balance blocks completion/closure where enforced.'),
'stock':('StoreDesk, StoreList, QuickAddStock, EditStockDetailsDialog, StockMovementHistory','Inventory list, low stock and stock movement tabs; item search/filter, supplier/category/unit/price/threshold fields, stock additions/adjustments and exports.'),
'approvals':('MaterialApprovalQueue','Admin material approval queue with pending badge; inspect submission, approve/reject with reasons, handoff back to operational jobs.'),
'inward-purchases':('PurchaseOrdersWorkspace','Sidebar label is Purchase Orders. Purchase request draft/edit/submit, approval, supplier/line/previous-price review, quotations, PO issue/confirmation/receipts/close/cancel; older inward workspace declarations are not proof of current routing.'),
'my-tasks':('Technician, TaskCreator','Assigned tasks and job selection, task status and notes; preserve assignment-specific task visibility.'),
'work-update':('Technician','Task work updates, Pending/Started/Paused/Completed statuses and notes; no implied advisor lifecycle authority.'),
'qc-prep':('Technician, QcEditor','QC checklist preparation/pass/fail state and related work evidence; preserve per-actor controls and blocked states.'),
'ready-to-invoice':('Accounts, BillingManager','Completed job invoice readiness, pending invoices, linked job selection and draft creation; remote mode uses invoice workspace.'),
'invoice':('BillingManager, InvoiceDialog, JobInvoicePanel','Create/view/edit invoice, line-item totals and GST, Tally reference, document output and void reason; archived/voided rules and audit trail.'),
'payment':('BillingManager, PaymentDialog, RecordPaymentForm, JobPaymentPanel','Payment amount/mode/reference, remaining balance, receipt creation, partial/full payment, void reason and invoice/payment status synchronization.'),
'delivery':('BillingManager','Delivery readiness/closure blockers, delivered-by/final-ODO/acknowledgement, receipt and gate pass, final delivery handoff; remote version is conditional.'),
'dashboard':('OperationalDashboard','KPI cards, date/month controls, cashflow/operational summaries and filtered destination drilldowns. Retain drilldown filter semantics and responsive layout.'),
'data-flow':('DataFlowWorkspace, DataFlowLine, JobDocuments','Linked workflow and document chain, status/blocker evidence, snapshot/print/download actions and job context.'),
'jobs':('EntityList, AddJobCardDialog, JobRecordDialog','Admin Job Cards grid/table with multi-row filters, add/view/edit/archive, list export/paging, selected record and all nested job panels.'),
'manage':('ManagementHub','Users, Customers, Vehicles, Suppliers, Job Cards, Estimates, Invoices, Payments, Delivery tabs. Load Large Demo Dataset replaces demo records in that isolated context; it is not the shipped snapshot or a production import.'),
'admin-console':('AdminConsole','Users; Team Structure; Service Task; Roles & Page Access; Business Settings; App Theme; Company Settings; Report Templates; Inventory Import; Support & Logs. Preserve nested editors, imports, previews, validation and save/cancel behavior.'),
'sales-leads':('LocalSalesWorkspace, SalesLeadRegister, SalesLeadDialog','Admin Sales CRM disclosure -> Leads; create/view/edit lead, name/phone/company/email/address/service interest/notes, stage/temperature/follow-up/site-visit fields, not-entered checkboxes and lead actions.'),
'quotations':('LocalSalesWorkspace, QuotationEditorDialog, QuotationDetailsDialog','Admin Sales CRM -> Quotations; lead-linked quotation lines, catalogue selection, tax/discount/totals, validity/notes/template, status actions and output preview/download.'),
'quotation-settings':('AdminConsole, ReportTemplatesTab','Admin Sales CRM -> Quotation Settings opens Report Templates with quotation category selected; not an independent settings data model.')}
for group in D['groups']:
 add('\n### '+group['label'])
 for page in group['pages']:
  key=page['key'];comps,desc=descriptions[key]
  rails=[D['roles'][r] for r,v in D['menus'].items() if key in v]
  matches=[x for x in B['pages'] if x['title']==page['label'] or (key=='approvals' and x['title'].startswith('Approvals'))]
  refs=[c for c in C['components'] if c['name'] in comps.split(', ')]
  add(f'\n#### `{key}` — {page["label"]}\n\n{desc}\n\nDefault rail roles: {", ".join(rails) or "none; catalogue/action only"}. Source components: '+ '; '.join(src(c['span'])+' (`'+c['name']+'`)' for c in refs)+'.')
  add('Rendered evidence: '+('; '.join(link(m['screenshot'],m['role']) for m in matches) if matches else '**UNVERIFIED as a standalone page**; see intake/dialog evidence')+'.')
add('''
## Role access and action permissions

The sidebar is the intersection of ROLE_MENU_PAGE_KEYS and saved rolePageAccess. Grants do not automatically add arbitrary pages to a role-owned rail. Owner/Admin retains Admin Console protection. Admin Search additionally grants Material Requests, Issue Material, Reconcile, Stock, Estimate and Follow-ups. Custom role/page configuration is local demo configuration; production server enforcement is a separate implementation concern.

| Role | Default sidebar keys | Additional default granted keys |
|---|---|---|
''')
for role,label in D['roles'].items():
 add('|'+label+'|'+', '.join(D['menus'][role])+'|'+(', '.join(k for k in D['access'][role] if k not in D['menus'][role]) or '—')+'|')
add('''
Permission checks must be preserved per action, not inferred from page access. In the local implementation, canMutateJobLifecycle permits Owner/Admin or the assigned Service Advisor; canMutateBilling permits Owner/Admin or Accounts. Service Department Manager has an advisor-like rail but is not included in those two local guards. Record-level restrictions, archived/terminal jobs and material/media checks further narrow actions. This is a documented role asymmetry, not authorization to broaden manager access.

Reception receives/assigns work; service advisor prepares requirements, estimate and execution checklist; store sources/issues/reconciles stock; technician updates tasks and QC preparation; accounts handles invoice/payment/delivery; owner manages approvals/master data/settings. Exact allowed mutations and denied-action errors are defined by the linked actor-aware operation implementations below. Developer emulation lists five roles (admin, service, reception, accounts, tech), independently of the seven operational roles.

## Login, shell, developer and conditional screens

- Local login defaults to the seeded admin account, has Email/Password/Login and Emulate User selector. Invalid credentials show the implemented demo-login error. The selector changes the email; it does not itself submit login. Demo authentication is limited by loadAuthConfig/local host behavior.
- Cognito-configured deployments show Continue with Cognito, PKCE callback/token/session flow and membership/tenant branches. Non-local deployments without allowed demo auth show the configuration error. Real Cognito, invitation/password setup, expired-session and server-unavailable flows are **UNVERIFIED against live services**. Remote component declarations are retained in the component ledger.
- Shell: role rail, collapsible/movable rail handle, Sales CRM disclosure, logout/Return to Developer, role heading, Search category controls. Current pages are selected in React state; do not invent per-page URL routes.
- Developer Console: Tenants, Communications and Billing tabs. Tenant creation/profile/edit/lifecycle, role emulation, disabled-tenant guard, channel active/sender settings, simulated delivery log, platform charge/payment forms and Reset demo. Communication test is simulated; no real email/WhatsApp delivery is implied. Developer state persists in sessionStorage.
- Conditional surfaces include no-pages-assigned, empty lists, disabled/archived records, loading/error text, confirmation/void/archive dialogs, notification dialogs, upload previews, print/download menus and mobile-specific layouts. Exact JSX visibility guards are recorded for each declaration below.
- LegacyInwardPurchasesWorkspace and Duplicate* components are retained as SOURCE evidence; their names or presence do not make them required new destinations. Current RoleWorkspace routing is authoritative. Components without runtime evidence remain source-only until reachability is demonstrated.
''')
add('''
## Workflow and calculation contracts

### Intake and booking

Preserve customer/vehicle lookup versus new-record paths, duplicate checks, advisor assignment, ODO/fuel/battery/body marks and save/cancel behavior. Intake creates linked customer/vehicle/visit/job records as applicable and emits the existing notification prompt. Booking statuses are Booked, Confirmed, Arrived, Rescheduled, Cancelled and No-show. Preserve capacity/service-type rules, reason requirements and check-in links; do not create duplicate jobs by repeating check-in. Required/default fields and exact submit handlers appear in CreateVisitDialog, AddJobCardDialog, BookingCheckInDialog and the operation ledger.

### Job lifecycle and handoff

| Current state | Manual next-state candidates before actor/artifact checks |
|---|---|
| NEW | IN_PROGRESS, CANCELLED |
| IN_PROGRESS | COMPLETED, HOLD, CANCELLED |
| HOLD | IN_PROGRESS, CANCELLED |
| COMPLETED | IN_PROGRESS |
| CLOSED | none |
| CANCELLED | none |

CLOSED is not a generic manual transition candidate: payment/delivery closure has dedicated paths. Checklist order, cycle timestamps, checked/not-applicable flags, actor IDs and artifact-driven resolution must survive cloning. Preserve required confirmation notes and HOLD/terminal edit restrictions. Do not treat sub-status as an independent free-text field; it is derived from checklist progress. Reopening may create a new cycle and must retain historical evidence.

Stages cover gathering requirements, creating estimate, confirmation, material request/issue, washing, started work, follow-up, photo sharing, QC, customer verification, invoice, Google review reminder, payment, receipt, gate pass and delivery. Exact stage arrays and compatibility rules are in the type/constants and operation evidence.

### Estimates, invoices and payments

Keep per-line quantity/rate/GST normalization and existing discount/tax rounding helpers; do not substitute a simplified percentage formula. Estimate approval and invoice creation/edit/void retain actor checks and audit entries. Existing record numbers/prefixes and collision avoidance in nextDocumentNumber must remain consistent. Payment status is Pending for no active payment, Partial below total, Paid at full amount. Preserve overpayment/invalid amount guards, payment mode/reference fields, receipt and gate-pass effects, payment void synchronization and duplicate/idempotency behavior where implemented.

closureBlockers reports QC pass required; material reconciliation required when |issued-used-returned-wasted| exceeds 0.001; available non-void Tally invoice required; full payment required; receipt required; gate pass required. Delivery also has actor/final-ODO/acknowledgement checks. These blockers are exact existing behavior, not a new generalized rule for every screen.

### Inventory, procurement and media

Maintain stock issue/return/waste arithmetic and movement history, request approvals and purchasing lifecycle, supplier pricing/history, line-level receipts, attachment metadata and cancellation reasons. Related records must retain job/item/order/supplier links. Do not treat the old inward-purchase components as an alternative current PO page. Media add/edit/archive gates depend on actor, category and job status; archived/terminal restrictions and missing-evidence reconciliation are significant.

### Lists, dialogs, exports and settings

Preserve each list’s own filters, date/month defaults, sorting, grid/table availability, per-page choices and pagination state when returning from a record. There is no universal toolbar: the advisor Job Card page deliberately differs from admin Job Cards. Save success, validation error and cancellation must retain the existing draft/close behavior. Archive/void reason requirements are distinct from hard deletion. Use the existing CSV/XLSX/PDF/print/document menus and template placeholder/sanitization rules; available formats differ by control. Screenshot captures do not verify the bytes of every export.

Settings include business profile/branch/hours/calendar, job numbering/defaults, pricing, GST/banking/payment modes, stock settings, notifications, log retention, theme, company logo/stamp/signature, roles/page access, team/department assignments, service task/brand/segment masters, report templates and inventory import batch records. Preserve current field names, validation messages and defaults, including apparent inconsistencies. Runtime default JSON is the exact value reference; eight report templates exist in this baseline, while three unit assertions still expect six.
''')
add('## Demo data, schema and preservation\n')
add(f'Shipped file: {link("demo-data/shipped.sqlite")}; SHA-256 `{S["sha256"]}`. Fresh-start post-initialization file: {link("demo-data/runtime-initial.sqlite")}; SHA-256 `{T["sha256"]}`. Both are immutable evidence copies; the original `public/workshopos-demo.sqlite` was not modified. No identifiers were transformed.\n')
add('Exact schema/columns/types/PK/defaults/FKs/DDL/row hashes: '+link('demo-data/shipped-inventory.json')+' and '+link('demo-data/runtime-initial-inventory.json')+'. Full row values: '+link('demo-data/shipped-records.json')+' and '+link('demo-data/runtime-initial-records.json')+'. These are copies of shipped demo fixtures, not certified real customer data. Preserve even odd fixture values; do not silently normalize them.\n')
add('| Table | Shipped rows | Runtime rows | Rows identical |\n|---|---:|---:|---|')
diff=read('demo-data/shipped-runtime-diff.json')
for table,info in diff.items(): add(f'| `{table}` | {info["shipped"]} | {info["runtime"]} | {info["rows_equal"]} |')
add('''
All 52 invoice rows receive a changed updated_at timestamp during initialization; amounts, identifiers and other captured fields are unchanged. Exact field comparison is in [invoice initialization changes](demo-data/invoice-initialization-changes.json). This occurs again after normal browser restoration, so byte-for-byte runtime equality is not achieved after startup even though the SQLite backup restore is exact. The preserved runtime baseline must not be conflated with the raw shipped database. Schema migration/normalization runs on open, seeds only when users are absent, and ensures demo advisors/team structure. The separate “Load Large Demo Dataset” generator is not assumed equal to the shipped database.

Core relationships: customers -> vehicles and visits; visits -> job_cards; jobs -> estimates/items, material requests/movements/approvals, tasks/QC, lifecycle cycles/items/status history, photos, followups, invoices/items/payments/receipts/gate passes; users -> advisor/technician/actor assignments; suppliers/items -> purchase orders/lines/receipts; leads -> quotations/lines; departments -> managers/advisor teams. **This SQLite baseline declares zero foreign keys**, so foreign_key_check alone provides no relationship assurance. A separate [explicit relationship audit](evidence/relationship-verification.json) checks 100 inferred column-to-parent mappings and finds no missing nonempty references. Null/zero/empty sentinels are counted separately, not certified valid. Quotation template_id refers outside SQLite to templates and is listed unmapped; broader business semantics and actor fields without _id suffix remain review items.

### Storage and runtime-only assets

- localStorage `workshopos.sqlite.v2` contains base64 SQLite; v1 is a fallback. A delivery-date migration marker affects first-open handling. The original shipped database is fetched only when no saved database exists.
- sessionStorage admin-demo v2 (v1 migration fallback) holds role grants, business settings, theme, logs, import batches/session inventory, templates and company assets. Capture/restore it separately from SQLite.
- Developer control-plane state and document snapshots use separate sessionStorage stores. Cognito token/OAuth state is authentication data and must not be copied into demo restoration. This audit’s isolated local defaults contain no live Cognito session.
- Uploaded image payload rows are intentionally removed from durable SQLite export, and missing-photo checklist evidence is reset. Active in-memory uploaded media cannot be recovered from localStorage alone. The shipped placeholder/static media is preserved; the inaccessible personal session may contain additional unrecoverable-in-export media.
- No IndexedDB business-store use was found in the indexed source discovery. Browser/service-worker static caching is distinct from business persistence; this audit did not clear the user’s caches or inspect unconnected profiles.
''')
add('Defaults, templates, role grants, company assets and developer defaults: '+link('demo-data/runtime-defaults.json')+'. Preserved static assets: '+', '.join(link('demo-data/assets/'+p.name,p.name) for p in sorted((R/'demo-data/assets').iterdir()))+'.')
add('Fresh loader settings are separately preserved in '+link('demo-data/runtime-loaded-settings.json')+'. The zero-argument createDefaultAdminDemoState factory uses a fixed September timestamp, whereas loadAdminDemoState uses the current clock when no saved settings exist. Their generated log/template timestamps therefore differ; preserve the selected snapshot explicitly rather than assuming those defaults are identical.')
add('''
### Restore procedure and reconciliation

1. Use a disposable local checkout/browser profile at the inspected revision. Preserve any target browser’s original storage before restoration. Do not run against a production origin or existing user session.
2. For raw shipped startup, use the preserved shipped.sqlite as the isolated server’s `public/workshopos-demo.sqlite`, with empty local business storage. For the captured post-initialization state, load the saved localStorage and sessionStorage maps from runtime-defaults.json **before** application startup, on the same local origin. This includes the SQLite base64 and migration marker. It replaces only the disposable context, not real records.
3. Runtime default admin/developer objects are included separately because some defaults are computed without storage writes. Use the application’s normal load/save helpers if explicitly restoring those settings; do not merge token/OAuth state.
4. Reopen the application and compare every table/record, primary keys, related IDs, meaningful dates, statuses and amounts against runtime-initial-records.json. Verify schema integrity and declared foreign keys. Compare settings/templates and media separately.
5. The repeatable inventory script opens source SQLite in read-only immutable mode. Its restore check backs up into a separate in-memory database and compares all rows. The browser dialog capture script also restores the captured stores into a new browser context and compares all table rows after normal startup.
6. Rerunning collection overwrites this audit’s generated evidence files only; it is not an import into PostgreSQL and does not append or duplicate application records. PostgreSQL migration, production rollback and business-store retirement remain outside this documentation task. Keep the original and both preserved snapshots until separately approved migration reconciliation succeeds.
''')
for path in ['evidence/restore-verification.json','evidence/browser-restore-verification.json']:
 if (R/path).exists():
  result=read(path); compact={k:v for k,v in result.items() if k not in ['tables','differences']}
  if 'differences' in result:compact['changed_rows']=len(result['differences'])
  add(link(path)+': `'+json.dumps(compact,ensure_ascii=False)+'`')
add('## Runtime screenshots and controls\n\nAll screenshots use isolated local demo contexts. JSON evidence records rendered text, visible/default field values, options and disabled/required state. Some DOM inventories include hidden option/button elements; screenshots establish visibility. These are new inspection captures, not a client-approved visual regression baseline.\n\n| Role | Page / tab / category | Screenshot | Rendered control evidence |\n|---|---|---|---|')
for p in B['pages']:add('|'+p['role']+'|'+esc(p['title'])+'|'+link(p['screenshot'],'image')+'|'+link(p['evidence'],'controls')+'|')
dialog=read('evidence/dialog-capture.json') if (R/'evidence/dialog-capture.json').exists() else {}
add('\n### Dialog inspection\n\nOpened representative add/view/edit dialogs and their cancel/back/close paths in isolated contexts. Full create/update/validation workflows are covered only where named test results demonstrate them. Repeated rows and every role/status/input combination were not exhaustively exercised.\n')
for p in dialog.get('visited',[]):add('- '+esc(p['role']+' / '+p['page']+' / '+str(p['tab'])+' / '+p['action'])+': '+link(p['screenshot'],'image')+'; '+link(p['evidence'],'fields'))
add('\nSkipped/disabled/inline actions and capture errors: '+link('evidence/dialog-capture.json')+'.')
add('## Tests, failures and explicit gaps\n')
unit=text('evidence/unit-results.txt')
summary=[l for l in unit.splitlines() if any(s in l for s in ['ℹ tests','ℹ pass','ℹ fail','ℹ skipped','ℹ duration'])]
add('Command `npm run test:unit` runs TypeScript checking then the unit suite. '+(' / '.join(summary))+'. Full output: '+link('evidence/unit-results.txt')+'.')
fails=list(dict.fromkeys(re.sub(r' \([\d.]+ms\)$','',l) for l in unit.splitlines() if l.startswith('✖ ') and 'failing tests:' not in l))
add('')
for f in fails:add('- Baseline failure: '+f)
add('')
pwr=R/'evidence/playwright-results.json'
if pwr.exists() and pwr.stat().st_size:
 try:
  pw=read('evidence/playwright-results.json');add('\nCommand `UI_TEST_PORT=5187 npx playwright test --workers=2 --reporter=json` targets the current-source Vite server (not a stale dist build). Results: `'+json.dumps(pw.get('stats',{}))+'`. Full report: '+link('evidence/playwright-results.json')+'.')
  def walk(suites):
   for suite in suites:
    for spec in suite.get('specs',[]):
     statuses=[t.get('status') for t in spec.get('tests',[])]
     errors=[r.get('error',{}).get('message','') for t in spec.get('tests',[]) for r in t.get('results',[]) if r.get('status') not in ('passed','skipped')]
     yield spec,statuses,errors
    yield from walk(suite.get('suites',[]))
  add('\nThe 87 browser tests produced **50 passed, 20 failed assertions and 17 timed-out tests**. No retries were marked flaky and no tests were skipped. Failures include My Queue expecting one row but seeing ten, a booking-calendar month mismatch, missing expected pagination/user elements, and workflow timeouts. These observations do not by themselves establish whether the application or test assumptions are wrong.\n')
  add('\n| Browser test | Actual result |\n|---|---|')
  for spec,statuses,errors in walk(pw.get('suites',[])):
   actual=[r['status'] for t in spec.get('tests',[])for r in t.get('results',[])]
   add('|'+esc(spec['title'])+'|'+esc(', '.join(actual))+'|')
  add('\n### Browser failure observations\n\nRaw assertion messages below are inspection findings, not approved clone behavior. Captured browser error contexts are preserved in the linked files following this list.\n')
  for spec,statuses,errors in walk(pw.get('suites',[])):
   if errors:
    add('\n#### '+spec['title']+'\n\n'+src('tests/'+spec['file']+':'+str(spec['line']))+'\n')
    for error in errors:add('```text\n'+re.sub(r'\x1b\[[0-9;]*m','',error)+'\n```\n')
  for context in sorted((R/'evidence/browser-test-failures').glob('*.md')):add('- '+link('evidence/browser-test-failures/'+context.name,context.stem))
 except Exception as e:add('Browser report unreadable: '+str(e))
else:add('Browser suite is not yet finalized; inspect the run report before claiming completion. No pass count is inferred from a running process.')
add('''
Explicit remaining gaps / risks:

- Existing personal browser session: browser and exact URL unidentified; no capture/export, no comparison with shipped/runtime defaults. Do not label fixture restoration as personal-data recovery.
- Full combinatorial coverage: every extracted declaration is accounted for below, but every instantiated control, input error, archive/void status, role grant, handoff and dialog combination has not been exercised. Controls lacking named runtime/test evidence remain SOURCE/UNVERIFIED. Static extraction may not discover UI dynamically generated outside the matched JSX/control patterns; all component implementations are preserved for review.
- Backend/Cognito/PostgreSQL: no live authenticated server integration, tenant isolation, real communications, cross-device persistence or production deployment was verified. Mocked browser tests are not live server verification. Remote-only fields and errors are source-backed requirements candidates requiring confirmation against the intended deployed mode.
- Screenshots establish this local checkout’s appearance. No approved pixel baseline was replaced, and no complete visual-diff comparison was performed. UI regression status is **unverified as a full regression claim**.
- Uploaded in-memory media from the inaccessible personal browser remains unavailable.
- Exact backup restore equality is verified. Normal application startup changes updated_at on 52 invoices again; all other captured fields match in the new-context restoration check. No FK constraints are declared; the separate 100-mapping audit is the relationship evidence, with sentinel and semantic limitations above.
- Existing unit/browser failures must be triaged as stale tests, fixture dependence, date sensitivity or application defects before clone acceptance. Do not silently turn failed behavior into a desired requirement.
- Documentation-only scope: no application source, backend, schema, migration or approved workflow implementation was intentionally changed; no commit/push or production data operation was performed. Next action is to review this inventory, resolve the blocked session and baseline discrepancies, and approve the next migration stage separately.
''')
add('## Source evidence and reproducibility\n')
for p,label in [('evidence/source-hashes.json','Source hashes'),('evidence/component-implementations.md','Exact component bodies including private event handlers/defaults'),('evidence/evidence-operation-contracts.md','344 exported operation implementations and dependencies'),('evidence/evidence-types-and-constants.md','Types, statuses, default constants and enumerations'),('evidence/evidence-test-index.md','Test declaration inventory'),('evidence/clone-storage-graft.txt','Storage discovery'),('evidence/clone-routing-graft.txt','Routing discovery'),('evidence/workflow-graft.txt','Workflow discovery'),('evidence/developer-graft.txt','Developer discovery')]:add('- '+link(p,label))
add('- '+link('evidence/private-helper-contracts.md','Private validation/calculation helpers and callbacks'))
add('- '+link('evidence/styles-baseline.css','Preserved CSS baseline')+'; source '+link('../src/styles.css','src/styles.css')+'. Source hashes also cover package/lockfile and Vite/Playwright configuration; use those pinned dependencies when reproducing layout.')
add('''
Reproduce from repository root with the existing dependencies: start `npx vite --host 127.0.0.1 --port 5187 --strictPort`; run `node data-migration/scripts/extract-source.mjs`, `node data-migration/scripts/extract-contracts.mjs`, `node data-migration/scripts/capture.mjs`, `node data-migration/scripts/capture-loaded-settings.mjs`, `python data-migration/scripts/inventory.py`, `python data-migration/scripts/check-relationships.py`, `node data-migration/scripts/capture-dialogs.mjs`, the unit/browser commands above, then `python data-migration/scripts/build-document.py`. `verify-browser-restore.mjs` repeats just the browser restoration check. Capture scripts launch isolated headless browsers and do not attach to personal profiles. Review changed source hashes before treating regenerated evidence as the same baseline.

## Component / conditional-screen inventory

This includes nested dialogs, shared controls, remote-only surfaces and legacy declarations. The exact implementation link includes private handlers and component state defaults. A component listing is SOURCE evidence; runtime status is established only by the screenshot/test indexes above.

| Component | Source span | Extracted controls | Forms | Explicit state declarations |
|---|---|---:|---:|---:|
''')
for c in C['components']:
 counts=[sum(x['file']==c['file'] and x['owner']==c['name'] for x in C[k]) for k in ['controls','forms','states']]
 add('|`'+c['name']+'`|'+src(c['span'])+'|'+ '|'.join(map(str,counts))+'|')
add('''
## Full declaration ledger — fields, actions, forms and conditional states

This ledger intentionally preserves exact JSX expressions rather than guessing resolved values. `value`, `checked`, `required`, `disabled`, `min`, `max`, `step`, `accept`, event handlers and conditional visibility are part of the clone contract. For a state variable’s initial value and private submit validation, follow the owning component in the exact implementation evidence. For handler functions that persist data, follow the operation contracts. Dynamic `.map()` declarations instantiate one control per runtime option/record; the rendered evidence captures concrete default options. Presence here alone does not assert successful execution or required reachability.

All entries below are SOURCE; runtime/action verification is limited to the named capture/test evidence. Identifiers use source line plus a suffix when multiple declarations occupy a minified source line.
''')
seen={}
for file in sorted(set(x['file'] for kind in ['controls','forms','states'] for x in C[kind])):
 add('\n### '+file)
 entries=[]
 for kind in ['controls','forms','states']:
  for x in C[kind]:
   if x['file']==file and not any(y==x for y in entries): entries.append(x)
 for x in sorted(entries,key=lambda x:x['line']):
  stem=x['id'];seen[stem]=seen.get(stem,0)+1;ident=stem+'-'+str(seen[stem])
  add(f'\n#### {ident}\n\nOwner `{x["owner"]}`; {src(x["file"]+":"+str(x["line"]))}; tag `{x["tag"]}`.\n\nVisibility: '+(x['conditions'] or 'No enclosing JSX condition captured; owning component/parent routing may still guard it.')+'\n\n```tsx\n'+x['attrs']+'\n```\n\nLabel/content expression:\n\n```tsx\n'+x['label']+'\n```')
add('\n## Operation index — persistence, validation and errors\n\nExact implementations are in [operation contracts](evidence/evidence-operation-contracts.md). This index covers exports across database, auth, data adapters, helpers, settings and rendering/output modules; it is not a proposed REST API list.\n\n| Operation | Source |\n|---|---|')
for op in C['operations']:add('|`'+op['name']+'`|'+src(op['span'])+'|')
add('\n## Completion report\n\nTask delivered: clone requirements main file, supporting screenshots, static/runtime evidence, preserved demo files and repeatable audit scripts. Requirements covered: pages/roles/controls/dialogs/conditional branches, source workflow contracts, settings/templates/media/persistence, data counts/schema/relationships and restore instructions. Files created are under `data-migration/`; original working-tree changes were preserved. Backend/frontend/schema changes: none. Demo impact: isolated test contexts only; original shipped hash preserved. Tests and failures: listed above with raw reports. Approved UI/workflow behavior intentionally changed: none; full UI regression remains unverified. Remaining issues and recommended next action are listed in the explicit gaps section.\n')
(R/'Current App clone info file.md').write_text('\n'.join(out),encoding='utf8')
print(json.dumps({'main_bytes':(R/'Current App clone info file.md').stat().st_size,'pages':sum(len(g['pages'])for g in D['groups']),'roles':len(D['roles']),'components':len(C['components']),'controls':len(C['controls']),'screenshots':len(B['pages']),'dialog_captures':len(dialog.get('visited',[]))}))
