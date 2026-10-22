# 25 - API contracts

Design proposal, not implemented OpenAPI. Extend existing FastAPI domain services behind a thin compatibility facade. Do not switch to alternative remote workspaces or introduce generic SQL/function execution endpoints.

## API-01 - Coverage and denominator

Candidate has 152 existing route declarations versus 109 in the frontend checkout: 43 added, 26 changed common handlers, 83 unchanged common handlers. Presence is not behavioral parity. Every existing route is listed below. The 344 exported named operations are all dispositioned below. An additional 44 methods across five API objects were recovered from object-property declarations outside that catalog; exact typed contracts are also included. They are not 44 additional workflows.

Operation classifications: AUTH=7, COMMAND=168, INTERNAL=8, PURE/CLIENT=126, READ=8, RETIRED/IMPORT-ONLY=12, SIMULATION=15.

148 distinct allowlisted command contracts are proposed under POST /api/v1/ui/commands/{command}. Together with five new read templates below, this means six new facade route declarations, all MISSING in the candidate. The command path allowlist is explicit below; unknown names return 404. The facade calls reusable domain services in-process using the same transaction/session. It must not chain independently committed HTTP requests. Existing native services require modification/verification as documented in 18; fully reusable business-operation coverage is not proven by route counts.

## API-02 - Common request, response, validation and transaction contract

All requests are same-origin UTF-8 JSON, unknown fields rejected. Request context is server-owned tenant/branch/actor/membership; remove db, actorId, byUser, actingUserId, state, storage and clock arguments from local wire inputs. Selected assignees remain inputs but must belong to the authorized scope. CSRF is mandatory on unsafe cookie-authenticated requests.

Command body: `{input:{<named parameters below>},expectedVersions:{[aggregateKey:string]:integer}}`; Idempotency-Key header UUID required for writes. Optional/defaulted parameters may be omitted, null only when the source type permits it. Named interfaces, literal unions, Pick/Omit/Partial and arrays expand from the exact [type contracts](evidence-types-and-constants.md). Local functions and private validators in [operation contracts](evidence-operation-contracts.md) and [private contracts](evidence-private-data-contracts.md) define all required/default/length/range/state validation; server must repeat them. No Database, function or storage object may be serialized.

Success 200: `{result:<local return projection or null for void>,revision:string,changed:[{entity:string,id:number|string,version:integer}],state:WorkshopStateProjection}`. Result retains the local return meaning, not an ORM object. All committed dependent effects appear in the authorized state projection, excluding credentials. All 344 source return types were resolved with the installed TypeScript checker in no-emit mode. The 148 canonical command structural schemas are linked below; accepting untyped business JSON is prohibited. Named types plus return expressions below are the design specification, not a claim that a standalone executable schema has already been generated.

Use exact decimal strings on the wire for money/quantity; adapter validates finite safe conversion into existing number fields. Preserve original decimal provenance. Dates retain date-only/instant distinctions and source display semantics. The opaque revision string identifies a coherent projection; it is not a globally ordered counter. Aggregate versions guard edits; 428 VERSION_REQUIRED for missing version, 409 STALE_VERSION on mismatch. Creates use empty version maps. Same key+actor+canonical payload replays original committed result; different payload/actor returns 409 IDEMPOTENCY_CONFLICT. Command receipt and effects commit together. Response loss requires retry of the SAME key; never assume failure means rollback.

Error schema: `{error:{code:string,message:string,fields?:{[path:string]:string},retryable:boolean,requestId:string}}`. Statuses: 400 malformed, 401 AUTHENTICATION_REQUIRED/SESSION_EXPIRED, 403 FORBIDDEN/CSRF_INVALID, 404 NOT_FOUND including out-of-scope identity, 409 STATE_CONFLICT/STALE_VERSION/IDEMPOTENCY_CONFLICT, 413 FILE_TOO_LARGE, 415 UNSUPPORTED_MEDIA, 422 VALIDATION_FAILED, 428 VERSION_REQUIRED, 429 RATE_LIMITED, 503 TEMPORARILY_UNAVAILABLE. Preserve existing field/error meaning through an explicit translation table; never expose SQL or secrets. Failed saves preserve draft and current dialog. Infrastructure errors may follow a committed command; replay resolves uncertainty.

Each command requires its named permission plus the role/record/status predicates in 26 and its source contract. One aggregate transaction includes all nested helper effects. Lower-level exported primitives are not permission bypasses: aliases below translate their parameters into the guarded command. Where multiple source signatures share a route, the canonical ForActor signature wins, with an explicit adapter translation and server-reloaded context; do not accept ambiguous unions of arbitrary arguments.

## API-03 - Read/auth/document contracts

| Method and path | Request | Response | Validation, authorization, transaction |
|---|---|---|---|
| GET /api/v1/ui/state | include?: fixed WorkshopState section names; absent means complete authorized state | {revision,state:WorkshopStateProjection,versions} | Repeatable-read snapshot; role/owner scope before aggregates; no hidden pagination/truncation |
| GET /api/v1/ui/admin-state | none | {revision,state:AdminDemoState business configuration} | Admin/configured-page grant; safe role-visible settings/theme subset also in state |
| GET /api/v1/ui/purchase-history/{itemId} | positive safe integer | {revision,items:PreviousPurchaseRecord[]} | Store/Admin; scoped item; source history/archive ordering |
| GET /api/v1/ui/document-snapshots | jobId integer; kind?: approved category | {revision,items:DocumentSnapshot[]} | Existing job/document visibility; unavailable artifacts explicit |
| GET /api/v1/ui/documents/{kind}/{id}/content | approved kind, scoped ID; format=html or pdf | bytes, content-type, safe filename, checksum/ETag | Read-only, no historical regeneration; 409 DOCUMENT_UNAVAILABLE where absent |
| GET /api/v1/auth/config | none | existing mode/config and capability version, no secrets | Reuse candidate; mode must not select alternate UI |
| POST /api/v1/auth/login | email,password; deployment determines tenant | safe session/profile/grants/expiry + persistent HttpOnly cookie/CSRF setup | Same backend login for manual and fixture-prefilled credentials in both environments; generic invalid-credentials 401; no dropdown whitelist |
| GET /api/v1/session | none | current membership, tenant, branches, actor, seven-role key, permissions, expiry | Candidate session endpoint; explicit source-ID bridge, not local id=-1 |
| POST /api/v1/auth/logout | empty body + CSRF | 204 | Session revocation/cookie expiry only |

Initial readState parity keeps complete authorized collections and existing client filters/sort/pagination. A paged server list must never silently replace that contract, or dashboard/export totals will change. For a later reviewed scalable projection: page>=1, pageSize 1..200, whitelisted sort/direction, stable ID tie-break, exact source date/month/archive filters, items and total from the same scope/query. Exports match all currently filtered rows/columns, not just a fetched server page. Large-state performance remains a risk to measure.

Media command input retains JobPhotoInput semantics at the adapter. Validate existing data URL signature/MIME/dimensions/size, stage bytes durably, then commit metadata only after content is READY. Browser-chosen storage_key does not confer authority. No visible broken reference after upload failure. Multipart optimization would require a separately specified route; it is not hidden in this proposal.

## API-04 - Every named operation and exact command input

Source spans and complete bodies are preserved in [machine-readable map](stage3-operation-api-map.json.md). Each COMMAND below composes with API-02 and its transaction family. Source actor/status guards are mandatory; lower-level missing guards receive the role matrix in 26. Pure helpers stay local, but server independently validates all mutating invariants.

### OP-admin-demo-state-resolveRoleMenuPageKeys

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/admin-demo-state.ts:158-161. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-createDefaultAdminDemoState

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/admin-demo-state.ts:469-483. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-normalizeAppTheme

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/admin-demo-state.ts:485-489. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-loadAdminDemoState

READ ? GET /api/v1/ui/admin-state

Source: src/admin-demo-state.ts:564-574. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; values obtained from this read endpoint and projected without altering the component contract.

### OP-admin-demo-state-saveAdminDemoState

INTERNAL ? Explicit commands or server audit hook; no whole-state replacement/reset API

Source: src/admin-demo-state.ts:576-580. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-resetAdminDemoState

INTERNAL ? Explicit commands or server audit hook; no whole-state replacement/reset API

Source: src/admin-demo-state.ts:582-585. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-addDemoRole

COMMAND ? POST /api/v1/ui/commands/addDemoRole

Source: src/admin-demo-state.ts:599-625. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  input: { label: string; description?: string; pageAccess?: readonly AdminPageKey[] };
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-updateDemoRole

COMMAND ? POST /api/v1/ui/commands/updateDemoRole

Source: src/admin-demo-state.ts:627-646. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  roleId: string;
  updates: { label?: string; description?: string };
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-archiveDemoRole

COMMAND ? POST /api/v1/ui/commands/archiveDemoRole

Source: src/admin-demo-state.ts:648-656. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  roleId: string;
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-updateRolePageAccess

COMMAND ? POST /api/v1/ui/commands/updateRolePageAccess

Source: src/admin-demo-state.ts:667-671. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  roleId: string;
  pages: readonly AdminPageKey[];
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-resolvePermittedPages

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/admin-demo-state.ts:673-678. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-updateBusinessSettings

COMMAND ? POST /api/v1/ui/commands/updateBusinessSettings

Source: src/admin-demo-state.ts:680-682. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  updates: DeepPartial<WorkshopBusinessSettings>;
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-updateAppTheme

COMMAND ? POST /api/v1/ui/commands/updateAppTheme

Source: src/admin-demo-state.ts:684-686. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  appTheme: Partial<AppTheme>;
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-normalizeBusinessSettings

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/admin-demo-state.ts:688-740. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-validateBusinessSettings

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/admin-demo-state.ts:742-763. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-createReportTemplate

COMMAND ? POST /api/v1/ui/commands/createReportTemplate

Source: src/admin-demo-state.ts:786-796. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  input: { category: ReportCategory; name: string; html: string; active?: boolean };
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-updateReportTemplate

COMMAND ? POST /api/v1/ui/commands/updateReportTemplate

Source: src/admin-demo-state.ts:798-818. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  templateId: string;
  updates: { name?: string; html?: string; active?: boolean };
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-activateReportTemplate

COMMAND ? POST /api/v1/ui/commands/activateReportTemplate

Source: src/admin-demo-state.ts:820-822. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  templateId: string;
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-deleteReportTemplate

COMMAND ? POST /api/v1/ui/commands/deleteReportTemplate

Source: src/admin-demo-state.ts:824-829. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  templateId: string;
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-saveCompanyIdentity

COMMAND ? POST /api/v1/ui/commands/saveCompanyIdentity

Source: src/admin-demo-state.ts:834-843. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  companyName: string;
  assets: CompanyAssets;
  details?: CompanyDetails;
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-appendDemoLog

INTERNAL ? Explicit commands or server audit hook; no whole-state replacement/reset API

Source: src/admin-demo-state.ts:853-864. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-filterDemoLogs

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/admin-demo-state.ts:866-885. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-admin-demo-state-clearDemoLogs

COMMAND ? POST /api/v1/ui/commands/clearDemoLogs

Source: src/admin-demo-state.ts:887-889. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  stream?: DemoLogStream | "all"; // default "all"
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-admin-demo-state-confirmInventoryImport

COMMAND ? POST /api/v1/ui/commands/confirmInventoryImport

Source: src/admin-demo-state.ts:921-967. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  input: {
    fileName: string;
    columnMapping: Record<string, string>;
    totalRows: number;
    validRows: readonly InventoryImportRowInput[];
    rejectedRows: number;
  };
}
```

Response result: AdminDemoState. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-admin-demo-state-enforceLogRetention

INTERNAL ? Explicit commands or server audit hook; no whole-state replacement/reset API

Source: src/admin-demo-state.ts:969-980. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-advance-booking-range-shiftCalendarMonth

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/advance-booking-range.ts:11-15. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-advance-booking-range-localDateOnly

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/advance-booking-range.ts:23-25. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-advance-booking-range-advanceBookingRange

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/advance-booking-range.ts:31-38. Service/transaction: intake/bookings; TX-01/02.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-advance-booking-range-isAdvanceBookingDate

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/advance-booking-range.ts:40-42. Service/transaction: intake/bookings; TX-01/02.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-advance-booking-range-clampAdvanceBookingDate

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/advance-booking-range.ts:44-48. Service/transaction: intake/bookings; TX-01/02.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-advance-booking-range-datesForCalendarMonth

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/advance-booking-range.ts:50-59. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-auth-loadAuthConfig

AUTH ? GET /api/v1/auth/config

Source: src/auth.ts:46-55. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-auth-beginCognitoLogin

AUTH ? Provider alternative; proposed database mode uses POST /api/v1/auth/login

Source: src/auth.ts:57-72. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-auth-completeCognitoCallback

AUTH ? Provider alternative; not used by proposed database mode

Source: src/auth.ts:99-113. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-auth-authenticatedFetch

AUTH ? Transport wrapper; cookie/CSRF

Source: src/auth.ts:115-119. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-auth-loadWorkshopSession

AUTH ? GET /api/v1/session

Source: src/auth.ts:121-129. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-auth-endCognitoSession

AUTH ? POST /api/v1/auth/logout

Source: src/auth.ts:131-136. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-booking-followup-expectedBookingsForDate

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/booking-followup.ts:12-56. Service/transaction: intake/bookings; TX-01/02.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-dashboard-metrics-cashflowFacts

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/dashboard-metrics.ts:43-73. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-dashboard-metrics-dashboardFacts

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/dashboard-metrics.ts:79-111. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-data-flow-dataFlowMonths

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/data-flow.ts:15-17. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-data-flow-dataFlowDates

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/data-flow.ts:19-21. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-data-flow-dataFlowSearchText

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/data-flow.ts:23-25. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-data-flow-filterDataFlowJobs

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/data-flow.ts:27-34. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-data-flow-summarizeJobLifecycle

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/data-flow.ts:62-75. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-data-flow-buildDataFlowTimeline

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/data-flow.ts:88-160. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-data-flow-buildGhostSteps

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/data-flow.ts:170-186. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-data-flow-buildStageRows

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/data-flow.ts:197-213. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-deriveChecklistSubStatus

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:133-141. Service/transaction: execution/checklists; TX-11.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-openWorkshopDb

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:156-186. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-persist

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:188-199. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-exportPersistableDatabase

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:201-217. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-readState

READ ? GET /api/v1/ui/state

Source: src/db.ts:219-603. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; values obtained from this read endpoint and projected without altering the component contract.

### OP-db-presentAdvisors

READ ? GET /api/v1/ui/state

Source: src/db.ts:617-628. Service/transaction: tenant_admin/service_catalog; TX-14.

Input/output remains the source contract; values obtained from this read endpoint and projected without altering the component contract.

### OP-db-setAdvisorPresent

COMMAND ? POST /api/v1/ui/commands/setAdvisorPresent

Source: src/db.ts:630-640. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  userId: number;
  present: boolean;
  date?: INFERRED; // default todayKey()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-assignAdvisor

COMMAND ? POST /api/v1/ui/commands/assignAdvisor

Source: src/db.ts:643-666. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  jobId: number;
  advisorId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-ensureDemoAdvisors

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:669-723. Service/transaction: tenant_admin/service_catalog; TX-14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-ensureDemoTeamStructure

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:731-763. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-loadLargeDemoDataset

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:769-1083. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-login

AUTH ? POST /api/v1/auth/login

Source: src/db.ts:1134-1140. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-createUser

COMMAND ? POST /api/v1/ui/commands/createUser

Source: src/db.ts:1152-1167. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  payload: Pick<User, "email" | "name" | "role" | "password">;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-updateUser

COMMAND ? POST /api/v1/ui/commands/updateUser

Source: src/db.ts:1169-1187. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  id: number;
  payload: Pick<User, "email" | "name" | "role" | "password">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-archiveUser

COMMAND ? POST /api/v1/ui/commands/archiveUser

Source: src/db.ts:1189-1215. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-createCustomer

COMMAND ? POST /api/v1/ui/commands/createCustomer

Source: src/db.ts:1237-1252. Service/transaction: intake; TX-01.

Request input structural schema:

```typescript
{
  payload: Pick<Customer, "name" | "mobile" | "type"> & { address?: string };
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake; TX-01.

### OP-db-updateCustomer

COMMAND ? POST /api/v1/ui/commands/updateCustomer

Source: src/db.ts:1254-1270. Service/transaction: intake; TX-01.

Request input structural schema:

```typescript
{
  id: number;
  payload: Pick<Customer, "name" | "mobile" | "type"> & { address?: string };
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake; TX-01.

### OP-db-archiveCustomer

COMMAND ? POST /api/v1/ui/commands/archiveCustomer

Source: src/db.ts:1272-1274. Service/transaction: intake; TX-01.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake; TX-01.

### OP-db-createVehicle

COMMAND ? POST /api/v1/ui/commands/createVehicle

Source: src/db.ts:1276-1291. Service/transaction: intake; TX-01.

Request input structural schema:

```typescript
{
  payload: Omit<Vehicle, "id">;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake; TX-01.

### OP-db-updateVehicle

COMMAND ? POST /api/v1/ui/commands/updateVehicle

Source: src/db.ts:1293-1312. Service/transaction: intake; TX-01.

Request input structural schema:

```typescript
{
  id: number;
  payload: Omit<Vehicle, "id">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake; TX-01.

### OP-db-archiveVehicle

COMMAND ? POST /api/v1/ui/commands/archiveVehicle

Source: src/db.ts:1314-1316. Service/transaction: intake; TX-01.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake; TX-01.

### OP-db-updateVisit

COMMAND ? POST /api/v1/ui/commands/updateVisit

Source: src/db.ts:1318-1346. Service/transaction: intake; TX-01.

Request input structural schema:

```typescript
{
  id: number;
  payload: Partial<
    Pick<
      Visit,
      | "advisor_id"
      | "fuel"
      | "keys"
      | "accessories"
      | "requested_work"
      | "photos_note"
    >
  >;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake; TX-01.

### OP-db-bookingCapacityForDate

READ ? GET /api/v1/ui/state

Source: src/db.ts:1394-1417. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; values obtained from this read endpoint and projected without altering the component contract.

### OP-db-setBookingCapacityForDate

COMMAND ? POST /api/v1/ui/commands/setBookingCapacityForDate

Source: src/db.ts:1420-1438. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  bookingDate: string;
  capacities: { serviceWork: number; generalCheckupFollowup: number };
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-createBooking

COMMAND ? POST /api/v1/ui/commands/createBooking

Source: src/db.ts:1546-1601. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  input: BookingInput;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-updateBooking

COMMAND ? POST /api/v1/ui/commands/updateBooking

Source: src/db.ts:1604-1651. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  bookingId: number;
  input: BookingInput;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-confirmBooking

COMMAND ? POST /api/v1/ui/commands/confirmBooking

Source: src/db.ts:1653-1667. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  bookingId: number;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-rescheduleBooking

COMMAND ? POST /api/v1/ui/commands/rescheduleBooking

Source: src/db.ts:1669-1739. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  bookingId: number;
  bookingDate: string;
  reason: string;
  arrivalWindow?: BookingArrivalWindow; // default ""
  timestamp?: INFERRED; // default new Date().toISOString()
  capacityOverrideReason?: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-cancelBooking

COMMAND ? POST /api/v1/ui/commands/cancelBooking

Source: src/db.ts:1741-1755. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  bookingId: number;
  reason: string;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-markBookingNoShow

COMMAND ? POST /api/v1/ui/commands/markBookingNoShow

Source: src/db.ts:1757-1771. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  bookingId: number;
  reason: string;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-recordBookingCall

COMMAND ? POST /api/v1/ui/commands/recordBookingCall

Source: src/db.ts:1773-1787. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  bookingId: number;
  note: string;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-checkInBooking

COMMAND ? POST /api/v1/ui/commands/checkInBooking

Source: src/db.ts:1795-1852. Service/transaction: intake/bookings; TX-01/02.

Request input structural schema:

```typescript
{
  bookingId: number;
  receptionId: number;
  input: BookingCheckInInput;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: { jobId: number; visitId: number; }. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake/bookings; TX-01/02.

### OP-db-receiveVehicle

COMMAND ? POST /api/v1/ui/commands/receiveVehicle

Source: src/db.ts:1854-2035. Service/transaction: intake; TX-01.

Request input structural schema:

```typescript
{
  payload: {
    customerId?: number;
    vehicleId?: number;
    customerName: string;
    mobile: string;
    customerType: string;
    vehicleNo: string;
    make: string;
    model: string;
    color: string;
    km: number;
    fuel: string;
    odoReading?: number;
    fuelLevelValue?: string;
    fuelLevelUnit?: "bars" | "%" | "litres" | "Other";
    keys: string;
    accessories: string;
    requestedWork: string;
    advisorId?: number;
    receptionId: number;
    damageMarks?: string;
    address?: string;
    engineNo?: string;
    serviceType?: string;
    pickupDrop?: string;
    estimatedDelivery?: string;
  };
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: intake; TX-01.

### OP-db-isTerminalMainStatus

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:2052-2054. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-canMutateJobLifecycle

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:2056-2064. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-canTransitionJobStatus

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:2068-2076. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-assertJobLifecycleMutationAccess

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:2078-2100. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-createServiceCatalogItemForActor

COMMAND ? POST /api/v1/ui/commands/createServiceCatalogItemForActor

Source: src/db.ts:2125-2156. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  input: Pick<ServiceCatalogItem, "name" | "base_rate" | "service_department_id" | "brand_id" | "car_segment_id"> & {
    gst_rate?: number;
  };
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-updateServiceCatalogItemForActor

COMMAND ? POST /api/v1/ui/commands/updateServiceCatalogItemForActor

Source: src/db.ts:2158-2190. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  id: number;
  input: Pick<ServiceCatalogItem, "name" | "base_rate" | "service_department_id" | "brand_id" | "car_segment_id"> & {
    gst_rate?: number;
  };
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-archiveServiceCatalogItemForActor

COMMAND ? POST /api/v1/ui/commands/archiveServiceCatalogItemForActor

Source: src/db.ts:2199-2209. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  id: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-addJobTaskListItemForActor

COMMAND ? POST /api/v1/ui/commands/addJobTaskListItemForActor

Source: src/db.ts:2211-2247. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  jobId: number;
  input: {
    service_catalog_item_id?: number;
    name?: string;
    base_rate?: number;
    gst_rate?: number;
  };
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-updateJobTaskListItemForActor

COMMAND ? POST /api/v1/ui/commands/updateJobTaskListItemForActor

Source: src/db.ts:2249-2269. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  id: number;
  input: Pick<JobTaskListItem, "name" | "base_rate" | "done">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-archiveJobTaskListItemForActor

COMMAND ? POST /api/v1/ui/commands/archiveJobTaskListItemForActor

Source: src/db.ts:2271-2286. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  id: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-prefillEstimateFromTaskListForActor

COMMAND ? POST /api/v1/ui/commands/prefillEstimateFromTaskListForActor

Source: src/db.ts:2289-2346. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  jobId: number;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-transitionJobStatusForActor

COMMAND ? POST /api/v1/ui/commands/transitionJobStatusForActor

Source: src/db.ts:2348-2389. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  to: MainStatus;
  note: string;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-saveEstimateForActor

COMMAND ? POST /api/v1/ui/commands/saveEstimateForActor

Source: src/db.ts:2423-2492. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  draft: EstimateDraftInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-updateJobCard

COMMAND ? POST /api/v1/ui/commands/updateJobCardForActor

Source: src/db.ts:2501-2548. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  payload: Partial<
    Pick<
      JobCard,
      | "advisor_id"
      | "technician_id"
      | "main_status"
      | "sub_status"
      | "work_list"
      | "promised_at"
      | "advisor_notes"
      | "customer_instructions"
      | "internal_instructions"
    >
  >;
  note?: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-updateJobCardForActor

COMMAND ? POST /api/v1/ui/commands/updateJobCardForActor

Source: src/db.ts:2550-2569. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  payload: Partial<
    Pick<
      JobCard,
      | "advisor_id"
      | "technician_id"
      | "work_list"
      | "promised_at"
      | "advisor_notes"
      | "customer_instructions"
      | "internal_instructions"
    >
  >;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-saveJobDetailsForActor

COMMAND ? POST /api/v1/ui/commands/saveJobDetailsForActor

Source: src/db.ts:2592-2641. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  input: JobDetailsInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-updateJobSheetForActor

COMMAND ? POST /api/v1/ui/commands/updateJobSheetForActor

Source: src/db.ts:2644-2651. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  input: JobSheetInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-updateEstimatedDeliveryForActor

COMMAND ? POST /api/v1/ui/commands/updateEstimatedDeliveryForActor

Source: src/db.ts:2654-2665. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  jobId: number;
  estimatedDelivery: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-setDamageMarksForActor

COMMAND ? POST /api/v1/ui/commands/setDamageMarksForActor

Source: src/db.ts:2668-2679. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  jobId: number;
  marks: DamageMark[];
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-db-cancelJobCard

COMMAND ? POST /api/v1/ui/commands/cancelJobCard

Source: src/db.ts:2684-2695. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-archiveJobCardForActor

COMMAND ? POST /api/v1/ui/commands/archiveJobCardForActor

Source: src/db.ts:2697-2706. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-cancelJobCardStatus

COMMAND ? POST /api/v1/ui/commands/cancelJobCardStatus

Source: src/db.ts:2712-2714. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  note: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-createEstimate

COMMAND ? POST /api/v1/ui/commands/createEstimate

Source: src/db.ts:2716-2746. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-updateEstimate

COMMAND ? POST /api/v1/ui/commands/updateEstimate

Source: src/db.ts:2748-2769. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  id: number;
  payload: Partial<
    Pick<Estimate, "status" | "discount" | "gst_rate" | "approval_note">
  >;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-createEstimateItem

COMMAND ? POST /api/v1/ui/commands/createEstimateItem

Source: src/db.ts:2771-2793. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  payload: Omit<EstimateItem, "id">;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-updateEstimateItem

COMMAND ? POST /api/v1/ui/commands/updateEstimateItem

Source: src/db.ts:2795-2817. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  id: number;
  payload: Omit<EstimateItem, "id">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-archiveEstimateItem

COMMAND ? POST /api/v1/ui/commands/archiveEstimateItem

Source: src/db.ts:2819-2821. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-approveEstimateForActor

COMMAND ? POST /api/v1/ui/commands/approveEstimateForActor

Source: src/db.ts:2824-2845. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  note: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-approveEstimate

COMMAND ? POST /api/v1/ui/commands/approveEstimateForActor

Source: src/db.ts:2847-2872. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  note?: INFERRED; // default "Customer approved"
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-createMaterialRequest

COMMAND ? POST /api/v1/ui/commands/createMaterialRequest

Source: src/db.ts:2874-2901. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  payload: Omit<MaterialRequest, "id">;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-updateMaterialRequest

COMMAND ? POST /api/v1/ui/commands/updateMaterialRequest

Source: src/db.ts:2903-2933. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  id: number;
  payload: Omit<MaterialRequest, "id">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-archiveMaterialRequest

COMMAND ? POST /api/v1/ui/commands/archiveMaterialRequest

Source: src/db.ts:2935-2954. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-createLocalPurchase

COMMAND ? POST /api/v1/ui/commands/createLocalPurchase

Source: src/db.ts:2983-2999. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  payload: LocalPurchaseInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-updateLocalPurchase

COMMAND ? POST /api/v1/ui/commands/updateLocalPurchase

Source: src/db.ts:3002-3022. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  id: number;
  payload: LocalPurchaseInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-archiveLocalPurchase

COMMAND ? POST /api/v1/ui/commands/archiveLocalPurchase

Source: src/db.ts:3024-3026. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-createMaterialPurchaseRequestForActor

COMMAND ? POST /api/v1/ui/commands/createMaterialPurchaseRequestForActor

Source: src/db.ts:3045-3061. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  jobId: number;
  input: MaterialPurchaseRequestInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-purchaseStockAndIssueForActor

COMMAND ? POST /api/v1/ui/commands/purchaseStockAndIssueForActor

Source: src/db.ts:3068-3081. Service/transaction: tenant settings/admin; TX-13/14.

Request input structural schema:

```typescript
{
  requestId: number;
  input: PurchaseStockAndIssueInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant settings/admin; TX-13/14.

### OP-db-createSupplierForActor

COMMAND ? POST /api/v1/ui/commands/createSupplierForActor

Source: src/db.ts:3145-3165. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  input: SupplierInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-updateSupplierForActor

COMMAND ? POST /api/v1/ui/commands/updateSupplierForActor

Source: src/db.ts:3167-3188. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  id: number;
  input: SupplierInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-archiveSupplierForActor

COMMAND ? POST /api/v1/ui/commands/archiveSupplierForActor

Source: src/db.ts:3190-3200. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  id: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-createInwardPurchaseDraft

COMMAND ? POST /api/v1/ui/commands/createInwardPurchaseDraft

Source: src/db.ts:3321-3342. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  input?: InwardPurchaseDraftInput; // default {}
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-updateInwardPurchaseDraftForActor

COMMAND ? POST /api/v1/ui/commands/updateInwardPurchaseDraftForActor

Source: src/db.ts:3344-3378. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseId: number;
  input: InwardPurchaseDraftInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-sendInwardPurchaseForPoApprovalForActor

COMMAND ? POST /api/v1/ui/commands/sendInwardPurchaseForPoApprovalForActor

Source: src/db.ts:3447-3531. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseId: number;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-approveInwardPurchaseForActor

COMMAND ? POST /api/v1/ui/commands/approveInwardPurchaseForActor

Source: src/db.ts:3533-3571. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseId: number;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-receiveAndPostInwardPurchaseForActor

COMMAND ? POST /api/v1/ui/commands/receiveAndPostInwardPurchaseForActor

Source: src/db.ts:3573-3725. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseId: number;
  input?: InwardPurchaseDraftInput; // default {}
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-submitInwardPurchaseForActor

COMMAND ? POST /api/v1/ui/commands/submitInwardPurchaseForActor

Source: src/db.ts:3728-3783. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseId: number;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-previousPurchaseHistoryForItem

READ ? GET /api/v1/ui/purchase-history/{itemId}

Source: src/db.ts:3854-3872. Service/transaction: procurement/inventory; TX-08/09/10.

Input/output remains the source contract; values obtained from this read endpoint and projected without altering the component contract.

### OP-db-savePurchaseOrderQuotationForActor

COMMAND ? POST /api/v1/ui/commands/savePurchaseOrderQuotationForActor

Source: src/db.ts:3874-3903. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseOrderId: number;
  input: PurchaseOrderQuotationInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-purchaseRequestNumberForOrdinal

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:3905-3914. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-purchaseRequestOrdinal

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:3916-3925. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-nextPurchaseRequestNumberForOrders

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:3927-3935. Service/transaction: procurement/inventory; TX-08/09/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-createPurchaseRequestForActor

COMMAND ? POST /api/v1/ui/commands/createPurchaseRequestForActor

Source: src/db.ts:4009-4030. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  input: PurchaseRequestInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-updatePurchaseRequestForActor

COMMAND ? POST /api/v1/ui/commands/updatePurchaseRequestForActor

Source: src/db.ts:4033-4053. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  id: number;
  input: PurchaseRequestInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-cancelPurchaseRequestForActor

COMMAND ? POST /api/v1/ui/commands/cancelPurchaseRequestForActor

Source: src/db.ts:4055-4065. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  id: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-approvePurchaseRequestForActor

COMMAND ? POST /api/v1/ui/commands/approvePurchaseRequestForActor

Source: src/db.ts:4073-4165. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseOrderId: number;
  input: PurchaseRequestApprovalInput;
}
```

Response result: number[]. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-issuePurchaseOrderForActor

COMMAND ? POST /api/v1/ui/commands/issuePurchaseOrderForActor

Source: src/db.ts:4171-4206. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseOrderId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-recordPurchaseOrderReceiptForActor

COMMAND ? POST /api/v1/ui/commands/recordPurchaseOrderReceiptForActor

Source: src/db.ts:4214-4250. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseOrderId: number;
  input: PurchaseOrderReceiptInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-confirmPurchaseOrderForActor

COMMAND ? POST /api/v1/ui/commands/confirmPurchaseOrderForActor

Source: src/db.ts:4257-4290. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseOrderId: number;
  input: PurchaseOrderConfirmationInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-closePurchaseOrderForActor

COMMAND ? POST /api/v1/ui/commands/closePurchaseOrderForActor

Source: src/db.ts:4297-4370. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseOrderId: number;
}
```

Response result: number[]. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-createPurchaseOrderForActor

COMMAND ? POST /api/v1/ui/commands/createPurchaseOrderForActor

Source: src/db.ts:4428-4448. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  input: PurchaseOrderInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-updatePurchaseOrderForActor

COMMAND ? POST /api/v1/ui/commands/updatePurchaseOrderForActor

Source: src/db.ts:4449-4475. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  id: number;
  input: PurchaseOrderInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-setPurchaseOrderStatusForActor

COMMAND ? POST /api/v1/ui/commands/setPurchaseOrderStatusForActor

Source: src/db.ts:4476-4512. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  id: number;
  action: "send" | "cancel" | "close";
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-recordStockInwardForActor

COMMAND ? POST /api/v1/ui/commands/recordStockInwardForActor

Source: src/db.ts:4553-4624. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  input: {
    item_id: number;
    qty: number;
    note?: string;
    purchase_order_line_id?: number;
  };
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-reviseInwardPurchaseForActor

COMMAND ? POST /api/v1/ui/commands/reviseInwardPurchaseForActor

Source: src/db.ts:4627-4737. Service/transaction: procurement/inventory; TX-08/09/10.

Request input structural schema:

```typescript
{
  purchaseId: number;
  input: InwardPurchaseRevisionInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: procurement/inventory; TX-08/09/10.

### OP-db-issueMaterialQty

COMMAND ? POST /api/v1/ui/commands/issueMaterialQty

Source: src/db.ts:4739-4781. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  requestId: number;
  qty: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-issueMaterial

COMMAND ? POST /api/v1/ui/commands/issueMaterialQty

Source: src/db.ts:4783-4794. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  requestId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-reconcileMaterialQty

COMMAND ? POST /api/v1/ui/commands/reconcileMaterialQty

Source: src/db.ts:4796-4853. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  requestId: number;
  used: number;
  returned: number;
  wasted: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-reconcileMaterial

COMMAND ? POST /api/v1/ui/commands/reconcileMaterialQty

Source: src/db.ts:4855-4863. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  requestId: number;
  used: number;
  returned: number;
  wasted: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-approvalBlocksMaterialOperations

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:4884-4888. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-submitMaterialApprovalForActor

COMMAND ? POST /api/v1/ui/commands/submitMaterialApprovalForActor

Source: src/db.ts:4921-4970. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  rowId: number;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-decideMaterialApprovalForActor

COMMAND ? POST /api/v1/ui/commands/decideMaterialApprovalForActor

Source: src/db.ts:4972-5039. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  jobId: number;
  decision: "Approved" | "Rejected";
  rejectionReason?: INFERRED; // default ""
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-resubmitMaterialApprovalForActor

COMMAND ? POST /api/v1/ui/commands/resubmitMaterialApprovalForActor

Source: src/db.ts:5041-5094. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  jobId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-materialStockOnHand

READ ? GET /api/v1/ui/state

Source: src/db.ts:5154-5160. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; values obtained from this read endpoint and projected without altering the component contract.

### OP-db-addMaterialRowForActor

COMMAND ? POST /api/v1/ui/commands/addMaterialRowForActor

Source: src/db.ts:5162-5176. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  jobId: number;
  itemId: number;
  qty: number;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-updateMaterialRowForActor

COMMAND ? POST /api/v1/ui/commands/updateMaterialRowForActor

Source: src/db.ts:5178-5191. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  rowId: number;
  itemId: number;
  qty: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-deleteMaterialRowForActor

COMMAND ? POST /api/v1/ui/commands/deleteMaterialRowForActor

Source: src/db.ts:5193-5200. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  rowId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-requestMaterialRowForActor

COMMAND ? POST /api/v1/ui/commands/requestMaterialRowForActor

Source: src/db.ts:5231-5242. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  rowId: number;
}
```

Response result: { onHand: number; warning: string | undefined; }. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-reRequestMaterialRowForActor

COMMAND ? POST /api/v1/ui/commands/reRequestMaterialRowForActor

Source: src/db.ts:5245-5265. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  rowId: number;
  itemId: number;
  qty: number;
}
```

Response result: { onHand: number; warning: string | undefined; }. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-releaseMaterialRowForActor

COMMAND ? POST /api/v1/ui/commands/releaseMaterialRowForActor

Source: src/db.ts:5303-5357. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  rowId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-editIssuedMaterialRowForActor

COMMAND ? POST /api/v1/ui/commands/editIssuedMaterialRowForActor

Source: src/db.ts:5360-5423. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  rowId: number;
  itemId: number;
  qty: number;
  note: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-cancelMaterialRowForActor

COMMAND ? POST /api/v1/ui/commands/cancelMaterialRowForActor

Source: src/db.ts:5426-5437. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  rowId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-createInventoryItem

COMMAND ? POST /api/v1/ui/commands/createInventoryItem

Source: src/db.ts:5439-5456. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  payload: Omit<InventoryItem, "id">;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-updateInventoryItem

COMMAND ? POST /api/v1/ui/commands/updateInventoryItem

Source: src/db.ts:5458-5475. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  id: number;
  payload: Omit<InventoryItem, "id">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-archiveInventoryItem

COMMAND ? POST /api/v1/ui/commands/archiveInventoryItem

Source: src/db.ts:5477-5479. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-stockIn

COMMAND ? POST /api/v1/ui/commands/stockIn

Source: src/db.ts:5482-5500. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  itemId: number;
  qty: number;
  note: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-adjustStock

COMMAND ? POST /api/v1/ui/commands/adjustStock

Source: src/db.ts:5502-5525. Service/transaction: materials/inventory; TX-06/07/10.

Request input structural schema:

```typescript
{
  itemId: number;
  qty: number;
  note: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: materials/inventory; TX-06/07/10.

### OP-db-createTask

COMMAND ? POST /api/v1/ui/commands/createTask

Source: src/db.ts:5527-5539. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  payload: Omit<Task, "id">;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-updateTask

COMMAND ? POST /api/v1/ui/commands/updateTask

Source: src/db.ts:5541-5562. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  taskId: number;
  status: TaskStatus;
  notes: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-archiveTask

COMMAND ? POST /api/v1/ui/commands/archiveTask

Source: src/db.ts:5564-5566. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-markWashingNeeded

COMMAND ? POST /api/v1/ui/commands/markWashingNeeded

Source: src/db.ts:5568-5574. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  jobId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-updateQcCheck

COMMAND ? POST /api/v1/ui/commands/updateQcCheck

Source: src/db.ts:5576-5600. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  id: number;
  passed: boolean;
  failReason?: INFERRED; // default ""
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-failQcWithRework

COMMAND ? POST /api/v1/ui/commands/failQcWithRework

Source: src/db.ts:5602-5619. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  checkId: number;
  technicianId: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-passQc

COMMAND ? POST /api/v1/ui/commands/passQc

Source: src/db.ts:5621-5631. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  jobId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-generateInvoice

COMMAND ? POST /api/v1/ui/commands/createInvoiceForActor

Source: src/db.ts:5633-5652. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  jobId: number;
  tally: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-canMutateBilling

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:5677-5679. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-updateInvoiceFields

COMMAND ? POST /api/v1/ui/commands/updateInvoiceForActor

Source: src/db.ts:5817-5850. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  invoiceId: number;
  input: InvoiceFieldsInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-createInvoiceItem

COMMAND ? POST /api/v1/ui/commands/createInvoiceItem

Source: src/db.ts:5852-5890. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  invoiceId: number;
  input: InvoiceItemInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-updateInvoiceItem

COMMAND ? POST /api/v1/ui/commands/updateInvoiceItem

Source: src/db.ts:5892-5922. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  itemId: number;
  input: InvoiceItemInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-archiveInvoiceItem

COMMAND ? POST /api/v1/ui/commands/archiveInvoiceItem

Source: src/db.ts:5925-5953. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  itemId: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-createInvoiceFromEstimate

COMMAND ? POST /api/v1/ui/commands/createInvoiceForActor

Source: src/db.ts:5955-6064. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  jobId: number;
  input: CreateInvoiceInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-createInvoiceForActor

COMMAND ? POST /api/v1/ui/commands/createInvoiceForActor

Source: src/db.ts:6066-6094. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  jobId: number;
  input: CreateInvoiceInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-updateInvoiceForActor

COMMAND ? POST /api/v1/ui/commands/updateInvoiceForActor

Source: src/db.ts:6096-6120. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  invoiceId: number;
  input: InvoiceFieldsInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-saveInvoiceForActor

COMMAND ? POST /api/v1/ui/commands/saveInvoiceForActor

Source: src/db.ts:6164-6251. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  invoiceId: number;
  input: InvoiceEditorInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-voidInvoice

COMMAND ? POST /api/v1/ui/commands/voidInvoiceForActor

Source: src/db.ts:6254-6291. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  invoiceId: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-voidInvoiceForActor

COMMAND ? POST /api/v1/ui/commands/voidInvoiceForActor

Source: src/db.ts:6293-6301. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  invoiceId: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-recordPayment

COMMAND ? POST /api/v1/ui/commands/recordPaymentForActor

Source: src/db.ts:6388-6515. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  invoiceId: number;
  input: PaymentInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-recordPaymentForActor

COMMAND ? POST /api/v1/ui/commands/recordPaymentForActor

Source: src/db.ts:6517-6525. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  invoiceId: number;
  input: PaymentInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-voidPayment

COMMAND ? POST /api/v1/ui/commands/voidPaymentForActor

Source: src/db.ts:6528-6574. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-voidPaymentForActor

COMMAND ? POST /api/v1/ui/commands/voidPaymentForActor

Source: src/db.ts:6576-6584. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-updateDeliveryDetails

COMMAND ? POST /api/v1/ui/commands/updateDeliveryForActor

Source: src/db.ts:6620-6631. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  jobId: number;
  deliveredBy: string;
  finalKm: number;
  acknowledgement: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-updateDeliveryForActor

COMMAND ? POST /api/v1/ui/commands/updateDeliveryForActor

Source: src/db.ts:6633-6652. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  jobId: number;
  deliveredBy: string;
  finalKm: number;
  acknowledgement: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-markJobDeliveredForActor

COMMAND ? POST /api/v1/ui/commands/markJobDeliveredForActor

Source: src/db.ts:6654-6702. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  jobId: number;
  deliveredBy: string;
  finalKm: number;
  acknowledgement: string;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-closeJob

COMMAND ? POST /api/v1/ui/commands/markJobDeliveredForActor

Source: src/db.ts:6704-6708. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Request input structural schema:

```typescript
{
  jobId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: finance; TX-03/04/05/12; FIN-01..04.

### OP-db-createFollowup

COMMAND ? POST /api/v1/ui/commands/createFollowup

Source: src/db.ts:6710-6724. Service/transaction: followups; scoped aggregate.

Request input structural schema:

```typescript
{
  payload: Omit<Followup, "id">;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: followups; scoped aggregate.

### OP-db-createResolvedFollowup

COMMAND ? POST /api/v1/ui/commands/createResolvedFollowup

Source: src/db.ts:6730-6761. Service/transaction: followups; scoped aggregate.

Request input structural schema:

```typescript
{
  payload: Omit<Followup, "id">;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: followups; scoped aggregate.

### OP-db-updateFollowup

COMMAND ? POST /api/v1/ui/commands/updateFollowup

Source: src/db.ts:6763-6772. Service/transaction: followups; scoped aggregate.

Request input structural schema:

```typescript
{
  id: number;
  payload: Omit<Followup, "id">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: followups; scoped aggregate.

### OP-db-archiveFollowup

COMMAND ? POST /api/v1/ui/commands/archiveFollowup

Source: src/db.ts:6774-6776. Service/transaction: followups; scoped aggregate.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: followups; scoped aggregate.

### OP-db-markFollowupDone

COMMAND ? POST /api/v1/ui/commands/markFollowupDone

Source: src/db.ts:6778-6783. Service/transaction: followups; scoped aggregate.

Request input structural schema:

```typescript
{
  id: number;
  outcome: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: followups; scoped aggregate.

### OP-db-addFollowup

COMMAND ? POST /api/v1/ui/commands/createFollowup

Source: src/db.ts:6785-6793. Service/transaction: followups; scoped aggregate.

Request input structural schema:

```typescript
{
  jobId: number;
  note: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: followups; scoped aggregate.

### OP-db-createPhoto

COMMAND ? POST /api/v1/ui/commands/saveJobPhotoForActor

Source: src/db.ts:6795-6808. Service/transaction: media; TX-11 + asset finalization.

Request input structural schema:

```typescript
{
  payload: Omit<Photo, "id">;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: media; TX-11 + asset finalization.

### OP-db-updatePhoto

COMMAND ? POST /api/v1/ui/commands/updateJobPhotoForActor

Source: src/db.ts:6810-6819. Service/transaction: media; TX-11 + asset finalization.

Request input structural schema:

```typescript
{
  id: number;
  payload: Omit<Photo, "id">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: media; TX-11 + asset finalization.

### OP-db-archivePhoto

COMMAND ? POST /api/v1/ui/commands/archiveJobPhotoForActor

Source: src/db.ts:6821-6825. Service/transaction: media; TX-11 + asset finalization.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: media; TX-11 + asset finalization.

### OP-db-saveJobPhotoForActor

COMMAND ? POST /api/v1/ui/commands/saveJobPhotoForActor

Source: src/db.ts:6877-6910. Service/transaction: media; TX-11 + asset finalization.

Request input structural schema:

```typescript
{
  jobId: number;
  input: JobPhotoInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: media; TX-11 + asset finalization.

### OP-db-updateJobPhotoForActor

COMMAND ? POST /api/v1/ui/commands/updateJobPhotoForActor

Source: src/db.ts:6912-6935. Service/transaction: media; TX-11 + asset finalization.

Request input structural schema:

```typescript
{
  id: number;
  input: Pick<JobPhotoInput, "label" | "category">;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: media; TX-11 + asset finalization.

### OP-db-archiveJobPhotoForActor

COMMAND ? POST /api/v1/ui/commands/archiveJobPhotoForActor

Source: src/db.ts:6937-6956. Service/transaction: media; TX-11 + asset finalization.

Request input structural schema:

```typescript
{
  id: number;
  reason: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: media; TX-11 + asset finalization.

### OP-db-addPhoto

COMMAND ? POST /api/v1/ui/commands/saveJobPhotoForActor

Source: src/db.ts:6958-6960. Service/transaction: media; TX-11 + asset finalization.

Request input structural schema:

```typescript
{
  jobId: number;
  label: string;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: media; TX-11 + asset finalization.

### OP-db-searchJobs

READ ? GET /api/v1/ui/state

Source: src/db.ts:6962-7030. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; values obtained from this read endpoint and projected without altering the component contract.

### OP-db-closureBlockers

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:7071-7095. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-paymentStatus

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:7097-7105. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-invoiceItemsTotal

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/db.ts:7107-7120. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-createSchema

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:7122-7176. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-migrateSchema

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:7178-7489. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-migrateLifecycleStorage

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:7491-7521. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-ensureLifecycleChecklist

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:7571-7598. Service/transaction: execution/checklists; TX-11.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-syncSubStatusFromChecklist

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:7648-7665. Service/transaction: execution/checklists; TX-11.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-setChecklistItemChecked

COMMAND ? POST /api/v1/ui/commands/setChecklistItemCheckedForActor

Source: src/db.ts:7687-7720. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  itemId: number;
  checked: boolean;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-setChecklistItemNotApplicable

COMMAND ? POST /api/v1/ui/commands/setChecklistItemNotApplicableForActor

Source: src/db.ts:7723-7775. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  itemId: number;
  notApplicable: boolean;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-setChecklistItemCheckedForActor

COMMAND ? POST /api/v1/ui/commands/setChecklistItemCheckedForActor

Source: src/db.ts:7903-7928. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  itemId: number;
  checked: boolean;
  timestamp?: INFERRED; // default new Date().toISOString()
  payment?: PaymentInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-setChecklistItemNotApplicableForActor

COMMAND ? POST /api/v1/ui/commands/setChecklistItemNotApplicableForActor

Source: src/db.ts:7930-7949. Service/transaction: execution/checklists; TX-11.

Request input structural schema:

```typescript
{
  itemId: number;
  notApplicable: boolean;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: execution/checklists; TX-11.

### OP-db-transitionJobStatus

COMMAND ? POST /api/v1/ui/commands/transitionJobStatusForActor

Source: src/db.ts:8201-8209. Service/transaction: jobs/estimates; TX-02/11/12.

Request input structural schema:

```typescript
{
  jobId: number;
  to: MainStatus;
  note: string;
  timestamp?: INFERRED; // default new Date().toISOString()
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: jobs/estimates; TX-02/11/12.

### OP-db-reconcileArtifactChecklist

RETIRED/IMPORT-ONLY ? No browser endpoint; deployment/import service only

Source: src/db.ts:8280-8305. Service/transaction: execution/checklists; TX-11.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-db-createSalesLead

COMMAND ? POST /api/v1/ui/commands/createSalesLead

Source: src/db.ts:8560-8565. Service/transaction: sales_crm; quotation/lead aggregate.

Request input structural schema:

```typescript
{
  input: LocalLeadInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: sales_crm; quotation/lead aggregate.

### OP-db-updateSalesLead

COMMAND ? POST /api/v1/ui/commands/updateSalesLead

Source: src/db.ts:8567-8572. Service/transaction: sales_crm; quotation/lead aggregate.

Request input structural schema:

```typescript
{
  leadId: number;
  input: LocalLeadInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: sales_crm; quotation/lead aggregate.

### OP-db-createSalesQuotation

COMMAND ? POST /api/v1/ui/commands/createSalesQuotation

Source: src/db.ts:8574-8590. Service/transaction: sales_crm; quotation/lead aggregate.

Request input structural schema:

```typescript
{
  input: LocalQuotationInput;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: sales_crm; quotation/lead aggregate.

### OP-db-updateSalesQuotation

COMMAND ? POST /api/v1/ui/commands/updateSalesQuotation

Source: src/db.ts:8593-8610. Service/transaction: sales_crm; quotation/lead aggregate.

Request input structural schema:

```typescript
{
  quotationId: number;
  input: LocalQuotationInput;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: sales_crm; quotation/lead aggregate.

### OP-db-setSalesQuotationStatus

COMMAND ? POST /api/v1/ui/commands/setSalesQuotationStatus

Source: src/db.ts:8612-8618. Service/transaction: sales_crm; quotation/lead aggregate.

Request input structural schema:

```typescript
{
  quotationId: number;
  status: QuotationStatus;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: sales_crm; quotation/lead aggregate.

### OP-db-createServiceDepartment

COMMAND ? POST /api/v1/ui/commands/createServiceDepartment

Source: src/db.ts:8620-8625. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  name: string;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-updateServiceDepartment

COMMAND ? POST /api/v1/ui/commands/updateServiceDepartment

Source: src/db.ts:8627-8631. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  departmentId: number;
  name: string;
  status: "ACTIVE" | "ARCHIVED";
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-createServiceCatalogMaster

COMMAND ? POST /api/v1/ui/commands/createServiceCatalogMaster

Source: src/db.ts:8633-8639. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  table: "service_brands" | "car_segments";
  name: string;
}
```

Response result: number. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-updateServiceCatalogMaster

COMMAND ? POST /api/v1/ui/commands/updateServiceCatalogMaster

Source: src/db.ts:8641-8647. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  table: "service_brands" | "car_segments";
  id: number;
  name: string;
  status: "ACTIVE" | "ARCHIVED";
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-appointServiceDepartmentManager

COMMAND ? POST /api/v1/ui/commands/appointServiceDepartmentManager

Source: src/db.ts:8649-8655. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  departmentId: number;
  managerId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-removeServiceDepartmentManager

COMMAND ? POST /api/v1/ui/commands/removeServiceDepartmentManager

Source: src/db.ts:8657-8660. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  departmentId: number;
  managerId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-assignServiceAdvisorTeam

COMMAND ? POST /api/v1/ui/commands/assignServiceAdvisorTeam

Source: src/db.ts:8662-8667. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  departmentId: number;
  managerId: number;
  advisorId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-db-removeServiceAdvisorTeam

COMMAND ? POST /api/v1/ui/commands/removeServiceAdvisorTeam

Source: src/db.ts:8669-8672. Service/transaction: tenant_admin/service_catalog; TX-14.

Request input structural schema:

```typescript
{
  departmentId: number;
  managerId: number;
  advisorId: number;
}
```

Response result: void. Also committed authorized state/versions. Validation/error branches: exact source function and called private validators plus API-02. Authorization: 26 command group + record/status predicate. Atomic scope: tenant_admin/service_catalog; TX-14.

### OP-developer-control-plane-createDefaultDeveloperControlPlane

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:73-80. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-loadDeveloperControlPlane

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:85-87. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-saveDeveloperControlPlane

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:88-90. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-resetDeveloperControlPlane

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:91-93. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-selectedTenant

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:94-96. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-createTenant

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:97-101. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-selectTenant

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:102-105. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-setTenantLifecycle

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:106-108. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-updateTenantProfile

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:109-111. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-updateCommunication

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:112-114. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-simulateCommunicationTest

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:115-121. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-createPlatformCharge

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:122-126. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-recordPlatformPayment

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:127-130. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-chargeStatus

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:131-131. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-developer-control-plane-roleForEmulation

SIMULATION ? Existing isolated simulation; real platform adoption unapproved

Source: src/developer-control-plane.ts:132-132. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-document-snapshots-loadDocumentSnapshots

READ ? GET /api/v1/ui/document-snapshots

Source: src/document-snapshots.ts:33-39. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; values obtained from this read endpoint and projected without altering the component contract.

### OP-document-snapshots-saveDocumentSnapshots

INTERNAL ? Transactional snapshot hook; no browser overwrite/clear API

Source: src/document-snapshots.ts:41-44. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-document-snapshots-clearDocumentSnapshots

INTERNAL ? Transactional snapshot hook; no browser overwrite/clear API

Source: src/document-snapshots.ts:46-46. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-document-snapshots-planSnapshots

INTERNAL ? Transactional snapshot hook; no browser overwrite/clear API

Source: src/document-snapshots.ts:63-89. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-document-snapshots-syncDocumentSnapshots

INTERNAL ? Transactional snapshot hook; no browser overwrite/clear API

Source: src/document-snapshots.ts:92-98. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-export-utils-buildExportMatrix

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/export-utils.ts:17-26. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-export-utils-downloadExcel

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/export-utils.ts:32-41. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-export-utils-downloadPdf

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/export-utils.ts:43-84. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-finance-ui-canVoidRemoteInvoice

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/finance-ui.ts:4-6. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-finance-ui-isActiveRemoteInvoice

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/finance-ui.ts:9-11. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-finance-ui-requiresInvoiceReplacement

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/finance-ui.ts:13-15. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-finance-ui-canReplaceRemoteInvoice

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/finance-ui.ts:18-20. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-finance-ui-remoteDocumentFilename

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/finance-ui.ts:22-24. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-inventory-import-parseInventoryWorkbook

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/inventory-import.ts:145-166. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-inventory-import-suggestInventoryColumnMapping

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/inventory-import.ts:169-182. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-inventory-import-buildInventoryImportPreview

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/inventory-import.ts:228-291. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-inventory-import-buildInventoryTemplateBuffer

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/inventory-import.ts:303-313. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-normalizeGstLine

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:12-15. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-invoiceTotals

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:29-45. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-buildInvoiceDraft

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:52-64. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-pickableMaterialLines

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:67-69. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-unissuedWarning

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:71-73. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-canCreateInvoice

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:79-86. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-canEditInvoice

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:89-92. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-canCompleteWithInvoice

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:95-97. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-billingReconciliation

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:100-114. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-mixedPaymentRows

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:123-133. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-canRecordOrVoidPayment

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:136-138. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-invoice-math-canVoidCurrentInvoice

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/invoice-math.ts:141-144. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-card-layout-isStubTab

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-card-layout.ts:25-27. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-card-layout-resolveJobCardFooter

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-card-layout.ts:52-73. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-card-notifications-renderJobCardNotificationTemplate

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-card-notifications.ts:20-28. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-card-notifications-renderJobCardNotification

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-card-notifications.ts:30-57. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-card-notifications-deliverJobCardNotificationStub

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-card-notifications.ts:60-65. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-delivery-highlight-localDeliveryDate

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-delivery-highlight.ts:15-20. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-delivery-highlight-jobDeliveryTone

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-delivery-highlight.ts:22-34. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-delivery-highlight-jobDeliveryClass

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-delivery-highlight.ts:36-39. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-delivery-highlight-useLocalDeliveryDate

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-delivery-highlight.ts:41-65. Service/transaction: finance; TX-03/04/05/12; FIN-01..04.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-resolveJobDocumentActions

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:12-25. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-documentInfo

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:39-46. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-resolveJobDocuments

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:71-83. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-documentFilename

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:85-88. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-withDamageDiagram

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:95-102. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-renderLive

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:104-113. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-renderJobDocument

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:116-123. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-renderSnapshotDocument

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:125-128. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-documents-printRenderedDocument

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-documents.ts:133-148. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-media-validateMediaDataUrl

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-media.ts:20-29. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-media-validateMediaFile

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-media.ts:31-37. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-media-compressMediaFile

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-media.ts:48-80. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-sheet-parseDamageMarks

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-sheet.ts:27-38. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-sheet-serializeDamageMarks

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-sheet.ts:40-44. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-sheet-legacyMarkToUnified

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-sheet.ts:47-52. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-sheet-addDamageMark

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-sheet.ts:54-57. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-sheet-removeDamageMark

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-sheet.ts:59-61. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-sheet-bodyPanelShapes

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-sheet.ts:69-86. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-sheet-staticBodyMarksSvg

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-sheet.ts:89-95. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-job-sheet-staticDamageDiagramHtml

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/job-sheet.ts:98-102. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-list-utils-normalizeSearch

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/list-utils.ts:6-8. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-list-utils-clampPage

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/list-utils.ts:10-13. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-list-utils-paginate

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/list-utils.ts:15-28. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-list-utils-pageNumbers

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/list-utils.ts:30-47. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-list-utils-activeFilterSummary

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/list-utils.ts:49-53. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-list-utils-applyFilterDraft

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/list-utils.ts:61-63. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-list-utils-clearFilterDraft

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/list-utils.ts:65-67. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-canManageMaterialRows

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:10-13. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-materialRowStatus

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:15-17. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-materialRowActions

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:20-28. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-stockOnHand

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:30-32. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-overStockWarning

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:35-37. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-triageMaterialDemand

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:57-66. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-triageMaterialDemands

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:73-78. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-allocateMaterialDemands

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:84-101. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-filterInventory

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:103-106. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-pickerLabel

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:108-110. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-canReleaseMaterialRows

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:116-118. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-canEditIssuedMaterialRows

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:121-124. Service/transaction: materials/inventory; TX-06/07/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-materials-materialRowActionsFor

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/materials.ts:127-134. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-pdf-render-renderHtmlToPdf

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/pdf-render.ts:11-42. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-purchase-order-supplier-display-supplierNameForPurchaseOrder

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/purchase-order-supplier-display.ts:8-15. Service/transaction: procurement/inventory; TX-08/09/10.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-seedReportTemplates

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:106-130. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-findUnsupportedPlaceholders

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:136-143. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-rupeesInWords

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:147-162. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-reportAvailable

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:191-197. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-buildReportValues

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:199-232. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-buildReportLines

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:235-238. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-sampleReportLines

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:240-245. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-sampleReportValues

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:247-266. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-sanitizeReportHtml

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:271-293. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-renderReportTemplate

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:296-309. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-report-templates-buildPrintDocument

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/report-templates.ts:313-315. Service/transaction: tenant settings/admin; TX-13/14.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-service-advisor-isServiceActiveJob

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/service-advisor.ts:6-8. Service/transaction: jobs/estimates; TX-02/11/12.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-service-advisor-canAddServiceFollowup

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/service-advisor.ts:10-12. Service/transaction: followups; scoped aggregate.

Input/output remains the source contract; no additional business mutation endpoint implied.

### OP-service-advisor-serviceFollowupStatus

PURE/CLIENT ? No HTTP; pure presentation/validation helper

Source: src/service-advisor.ts:14-19. Service/transaction: followups; scoped aggregate.

Input/output remains the source contract; no additional business mutation endpoint implied.

## API-05 - All 44 existing adapter methods

Typed request/response and routes below are current evidence. Reuse transport with session/CSRF adaptation; convert outputs explicitly. Finance partial payments/credits/refunds and remote-only job gates are not approved UI behavior.

### adminUsersApi.list

src/admin-users-api.ts

```typescript
list: (config: CognitoConfig) => request<AdminDirectory>(config, "/api/v1/admin/users")
```

### adminUsersApi.create

src/admin-users-api.ts

```typescript
create: (config: CognitoConfig, input: { name: string; email: string; roleIds: string[]; branchIds: string[] }) =>
    request<{ user: AdminUser }>(config, "/api/v1/admin/users", {
      method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify(input),
    })
```

### adminUsersApi.update

src/admin-users-api.ts

```typescript
update: (config: CognitoConfig, user: AdminUser) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${user.id}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: user.name, roleIds: user.roleIds, branchIds: user.branchIds, version: user.version }),
  })
```

### adminUsersApi.archive

src/admin-users-api.ts

```typescript
archive: (config: CognitoConfig, id: string, reason: string) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${id}/archive`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason }),
  })
```

### adminUsersApi.resend

src/admin-users-api.ts

```typescript
resend: (config: CognitoConfig, id: string) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${id}/resend-invite`, { method: "POST" })
```

### adminUsersApi.listServiceDepartments

src/admin-users-api.ts

```typescript
listServiceDepartments: (config: CognitoConfig) => request<{ serviceDepartments: ServiceDepartment[] }>(config, "/api/v1/admin/service-departments")
```

### adminUsersApi.createServiceDepartment

src/admin-users-api.ts

```typescript
createServiceDepartment: (config: CognitoConfig, input: { branchId: string; name: string }) => request<{ serviceDepartment: ServiceDepartment }>(config, "/api/v1/admin/service-departments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) })
```

### adminUsersApi.updateServiceDepartment

src/admin-users-api.ts

```typescript
updateServiceDepartment: (config: CognitoConfig, id: string, input: { name: string; status: "ACTIVE" | "ARCHIVED" }) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(input) })
```

### adminUsersApi.appointManager

src/admin-users-api.ts

```typescript
appointManager: (config: CognitoConfig, departmentId: string, membershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${membershipId}`, { method: "PUT" })
```

### adminUsersApi.removeManager

src/admin-users-api.ts

```typescript
removeManager: (config: CognitoConfig, departmentId: string, membershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${membershipId}`, { method: "DELETE" })
```

### adminUsersApi.assignAdvisorTeam

src/admin-users-api.ts

```typescript
assignAdvisorTeam: (config: CognitoConfig, departmentId: string, managerMembershipId: string, advisorMembershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${managerMembershipId}/advisors/${advisorMembershipId}`, { method: "PUT" })
```

### adminUsersApi.removeAdvisorTeam

src/admin-users-api.ts

```typescript
removeAdvisorTeam: (config: CognitoConfig, departmentId: string, managerMembershipId: string, advisorMembershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${managerMembershipId}/advisors/${advisorMembershipId}`, { method: "DELETE" })
```

### financeApi.invoices

src/finance-api.ts

```typescript
invoices: (config: CognitoConfig, jobId: number) => request<RemoteInvoice[]>(config, `/api/v1/jobs/${jobId}/invoices`)
```

### financeApi.issueInvoice

src/finance-api.ts

```typescript
issueInvoice: (config: CognitoConfig, jobId: number, input: { customerState?: string; replacesInvoiceId?: number } = {}, requestKey?: string) => request<RemoteInvoice>(config, `/api/v1/jobs/${jobId}/invoices`, json(input, requestKey))
```

### financeApi.voidInvoice

src/finance-api.ts

```typescript
voidInvoice: (config: CognitoConfig, invoiceId: number, reason: string, requestKey?: string) => request<RemoteInvoice>(config, `/api/v1/invoices/${invoiceId}/void`, json({ reason }, requestKey))
```

### financeApi.issueCreditNote

src/finance-api.ts

```typescript
issueCreditNote: (config: CognitoConfig, invoiceId: number, input: { amountPaise: number; reason: string }, requestKey?: string) => request<RemoteCreditNote>(config, `/api/v1/invoices/${invoiceId}/credit-notes`, json(input, requestKey))
```

### financeApi.recordRefund

src/finance-api.ts

```typescript
recordRefund: (config: CognitoConfig, creditNoteId: number, input: { amountPaise: number; method: "cash" | "card" | "upi" | "bank_transfer" | "other"; reference?: string }, requestKey?: string) => request<{ id: number; creditNoteId: number }>(config, `/api/v1/credit-notes/${creditNoteId}/refunds`, json(input, requestKey))
```

### financeApi.payments

src/finance-api.ts

```typescript
payments: (config: CognitoConfig, invoiceId: number) => request<RemotePayment[]>(config, `/api/v1/invoices/${invoiceId}/payments`)
```

### financeApi.recordPayment

src/finance-api.ts

```typescript
recordPayment: (config: CognitoConfig, invoiceId: number, input: { amountPaise: number; method: "cash" | "card" | "upi" | "bank_transfer" | "other"; reference?: string; payer?: string; receivedAt?: string; supportingAttachment?: { filename: string; contentType: "image/jpeg" | "image/png" | "application/pdf"; dataBase64: string } }, requestKey?: string) => request<RemotePayment>(config, `/api/v1/invoices/${invoiceId}/payments`, json(input, requestKey))
```

### financeApi.delivery

src/finance-api.ts

```typescript
delivery: (config: CognitoConfig, jobId: number) => request<RemoteHandover | null>(config, `/api/v1/jobs/${jobId}/delivery`)
```

### financeApi.completeHandover

src/finance-api.ts

```typescript
completeHandover: (config: CognitoConfig, jobId: number, input: { deliveredBy: string; finalOdometer: number; acknowledgement: string }, requestKey?: string) => request<RemoteHandover>(config, `/api/v1/jobs/${jobId}/complete-handover`, json(input, requestKey))
```

### followupsApi.list

src/followups-api.ts

```typescript
list: (config: CognitoConfig, options: { archived?: boolean; jobId?: number } = {}) => request<RemoteFollowup[]>(config, `/api/v1/follow-ups?archived=${options.archived ? "true" : "false"}${options.jobId ? `&jobId=${options.jobId}` : ""}`)
```

### followupsApi.jobs

src/followups-api.ts

```typescript
jobs: (config: CognitoConfig) => request<FollowupJob[]>(config, "/api/v1/follow-ups/jobs")
```

### followupsApi.create

src/followups-api.ts

```typescript
create: (config: CognitoConfig, input: { jobId: number; note: string; dueAt?: string }) => request<RemoteFollowup>(config, "/api/v1/follow-ups", json("POST", input))
```

### followupsApi.update

src/followups-api.ts

```typescript
update: (config: CognitoConfig, id: number, input: { note: string; dueAt?: string; outcome?: string }) => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}`, json("PUT", input))
```

### followupsApi.complete

src/followups-api.ts

```typescript
complete: (config: CognitoConfig, id: number, outcome = "") => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}/commands/complete`, json("POST", { outcome }))
```

### followupsApi.archive

src/followups-api.ts

```typescript
archive: (config: CognitoConfig, id: number, reason: string) => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}/archive`, json("POST", { reason }))
```

### followupsApi.search

src/followups-api.ts

```typescript
search: (config: CognitoConfig, q: string) => request<{ query: string; results: SearchResult[] }>(config, `/api/v1/search?q=${encodeURIComponent(q)}`)
```

### jobsApi.list

src/jobs-api.ts

```typescript
list: (config: CognitoConfig) => request<RemoteJob[]>(config, "/api/v1/jobs")
```

### jobsApi.create

src/jobs-api.ts

```typescript
create: (config: CognitoConfig, input: { visitId: number; departmentId: string; responsibleManagerId: string; workList?: string; promisedAt?: string }) => request<RemoteJob>(config, "/api/v1/jobs", json(input))
```

### jobsApi.assignAdvisor

src/jobs-api.ts

```typescript
assignAdvisor: (config: CognitoConfig, jobId: number, input: { advisorId: string; reason?: string }) => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/advisor`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(input) })
```

### jobsApi.transferManager

src/jobs-api.ts

```typescript
transferManager: (config: CognitoConfig, jobId: number, input: { departmentId: string; responsibleManagerId: string; reason?: string }) => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/manager`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(input) })
```

### jobsApi.createEstimate

src/jobs-api.ts

```typescript
createEstimate: (config: CognitoConfig, jobId: number, input: { discount?: number; gstRate?: number; note?: string; lines: RemoteEstimateLine[] }) => request<RemoteEstimate>(config, `/api/v1/jobs/${jobId}/estimates`, json(input))
```

### jobsApi.decideEstimate

src/jobs-api.ts

```typescript
decideEstimate: (config: CognitoConfig, estimateId: number, input: { outcome: "approved" | "declined"; channel: "in_person" | "phone" | "whatsapp" | "email" | "other"; decidedAt: string; note?: string }) => request<{ estimate: RemoteEstimate }>(config, `/api/v1/estimates/${estimateId}/decision`, json(input))
```

### jobsApi.command

src/jobs-api.ts

```typescript
command: (config: CognitoConfig, jobId: number, command: "start-work" | "hold-job" | "resume-work" | "cancel-job" | "start-rework" | "complete-work", reason = "") => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/commands/${command}`, json({ reason }))
```

### salesApi.leads

src/sales-api.ts

```typescript
leads: (config: CognitoConfig, filters = "") => request<Lead[]>(config, `/api/v1/sales/leads${filters}`)
```

### salesApi.createLead

src/sales-api.ts

```typescript
createLead: (config: CognitoConfig, input: Omit<Lead, "id" | "branchId" | "createdAt" | "updatedAt">) => request<Lead>(config, "/api/v1/sales/leads", json("POST", input))
```

### salesApi.updateLead

src/sales-api.ts

```typescript
updateLead: (config: CognitoConfig, id: number, input: Omit<Lead, "id" | "branchId" | "createdAt" | "updatedAt">) => request<Lead>(config, `/api/v1/sales/leads/${id}`, json("PUT", input))
```

### salesApi.quotations

src/sales-api.ts

```typescript
quotations: (config: CognitoConfig, filters = "") => request<Quotation[]>(config, `/api/v1/sales/quotations${filters}`)
```

### salesApi.createQuotation

src/sales-api.ts

```typescript
createQuotation: (config: CognitoConfig, input: { leadId: number; validUntil?: string; customerNotes?: string; discount?: number; templateId: string; templateHtml: string; lines: QuotationLine[] }) => request<Quotation>(config, "/api/v1/sales/quotations", json("POST", input))
```

### salesApi.updateQuotation

src/sales-api.ts

```typescript
updateQuotation: (config: CognitoConfig, id: number, input: { leadId: number; validUntil?: string; customerNotes?: string; discount?: number; templateId: string; templateHtml: string; lines: QuotationLine[] }) => request<Quotation>(config, `/api/v1/sales/quotations/${id}`, json("PUT", input))
```

### salesApi.status

src/sales-api.ts

```typescript
status: (config: CognitoConfig, id: number, quotationStatus: QuotationStatus) => request<Quotation>(config, `/api/v1/sales/quotations/${id}/status`, json("POST", { status: quotationStatus }))
```

### salesApi.serviceTasks

src/sales-api.ts

```typescript
serviceTasks: (config: CognitoConfig, filters = "") => request<ServiceTask[]>(config, `/api/v1/sales/service-tasks${filters}`)
```

### salesApi.document

src/sales-api.ts

```typescript
document: (config: CognitoConfig, id: number) => request<QuotationDocument>(config, `/api/v1/sales/quotations/${id}/document`)
```

## API-06 - All 152 candidate routes

Presence is source-verified; behavior remains subject to PAR-01..28. Native endpoints must enforce the same authorization as the facade so direct callers cannot bypass approved invariants.

| Method | Path | Source / handler |
|---|---|---|
| GET | /api/v1/admin/demo-import/rows | /app/app/tenant_admin.py:26 list_demo_import_rows |
| GET | /api/v1/admin/roles | /app/app/tenant_admin.py:607 list_roles |
| POST | /api/v1/admin/roles | /app/app/tenant_admin.py:614 create_role |
| PATCH | /api/v1/admin/roles/{role_id} | /app/app/tenant_admin.py:633 update_role |
| POST | /api/v1/admin/roles/{role_id}/archive | /app/app/tenant_admin.py:669 archive_role |
| GET | /api/v1/admin/service-departments | /app/app/tenant_admin.py:385 list_service_departments |
| POST | /api/v1/admin/service-departments | /app/app/tenant_admin.py:392 create_service_department |
| PATCH | /api/v1/admin/service-departments/{department_id} | /app/app/tenant_admin.py:412 update_service_department |
| DELETE | /api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id} | /app/app/tenant_admin.py:494 remove_service_advisor_team |
| PUT | /api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id} | /app/app/tenant_admin.py:470 assign_service_advisor_team |
| DELETE | /api/v1/admin/service-departments/{department_id}/managers/{membership_id} | /app/app/tenant_admin.py:454 remove_service_department_manager |
| PUT | /api/v1/admin/service-departments/{department_id}/managers/{membership_id} | /app/app/tenant_admin.py:437 appoint_service_department_manager |
| GET | /api/v1/admin/users | /app/app/tenant_admin.py:378 list_users |
| POST | /api/v1/admin/users | /app/app/tenant_admin.py:509 create_user |
| PATCH | /api/v1/admin/users/{membership_id} | /app/app/tenant_admin.py:545 update_user |
| POST | /api/v1/admin/users/{membership_id}/archive | /app/app/tenant_admin.py:571 archive_user |
| POST | /api/v1/admin/users/{membership_id}/resend-invite | /app/app/tenant_admin.py:591 resend_invite |
| GET | /api/v1/attachments/{attachment_id}/content | /app/app/execution.py:166 read_attachment |
| GET | /api/v1/auth/config | /app/app/main.py:103 auth_config |
| POST | /api/v1/auth/login | /app/app/database_auth.py:108 login |
| POST | /api/v1/auth/logout | /app/app/database_auth.py:172 logout |
| GET | /api/v1/auth/tenants/{code}/users | /app/app/database_auth.py:93 list_login_users |
| GET | /api/v1/auth/workshops | /app/app/database_auth.py:78 list_login_workshops |
| GET | /api/v1/bookings | /app/app/intake.py:225 list_bookings |
| POST | /api/v1/bookings | /app/app/intake.py:243 create_booking |
| GET | /api/v1/bookings/{booking_id} | /app/app/intake.py:264 get_booking |
| POST | /api/v1/bookings/{booking_id}/check-in | /app/app/intake.py:274 check_in_booking |
| GET | /api/v1/branches/{branch_id}/settings | /app/app/main.py:198 read_branch_settings |
| GET | /api/v1/catalogue-items | /app/app/inventory.py:231 list_catalogue |
| POST | /api/v1/catalogue-items | /app/app/inventory.py:249 create_catalogue |
| PUT | /api/v1/catalogue-items/{item_id} | /app/app/inventory.py:257 update_catalogue |
| POST | /api/v1/catalogue-items/{item_id}/archive | /app/app/inventory.py:265 archive_catalogue |
| GET | /api/v1/checklists | /app/app/checklists.py:70 list_checklists |
| POST | /api/v1/checklists | /app/app/checklists.py:76 create_cycle |
| PUT | /api/v1/checklists/items/{item_id} | /app/app/checklists.py:102 decide_item |
| POST | /api/v1/credit-notes/{credit_note_id}/refunds | /app/app/finance.py:412 record_refund |
| GET | /api/v1/customers | /app/app/intake.py:335 list_customers |
| POST | /api/v1/customers | /app/app/intake.py:351 create_customer |
| GET | /api/v1/customers/{customer_id} | /app/app/intake.py:363 get_customer |
| PUT | /api/v1/customers/{customer_id} | /app/app/intake.py:369 update_customer |
| POST | /api/v1/customers/{customer_id}/archive | /app/app/intake.py:380 archive_customer |
| POST | /api/v1/estimates/{estimate_id}/decision | /app/app/jobs.py:390 record_estimate_decision |
| GET | /api/v1/financial-documents/{document_id}/content | /app/app/finance.py:534 get_document_content |
| GET | /api/v1/follow-ups | /app/app/followups.py:90 list_followups |
| POST | /api/v1/follow-ups | /app/app/followups.py:139 create_followup |
| GET | /api/v1/follow-ups/jobs | /app/app/followups.py:122 followup_jobs |
| PUT | /api/v1/follow-ups/{followup_id} | /app/app/followups.py:156 update_followup |
| POST | /api/v1/follow-ups/{followup_id}/archive | /app/app/followups.py:189 archive_followup |
| POST | /api/v1/follow-ups/{followup_id}/commands/complete | /app/app/followups.py:173 complete_followup |
| GET | /api/v1/health | /app/app/main.py:97 api_health |
| POST | /api/v1/invoices/{invoice_id}/credit-notes | /app/app/finance.py:380 issue_credit_note |
| GET | /api/v1/invoices/{invoice_id}/payments | /app/app/finance.py:476 list_payments |
| POST | /api/v1/invoices/{invoice_id}/payments | /app/app/finance.py:433 record_payment |
| POST | /api/v1/invoices/{invoice_id}/void | /app/app/finance.py:348 void_invoice |
| GET | /api/v1/jobs | /app/app/jobs.py:226 list_jobs |
| POST | /api/v1/jobs | /app/app/jobs.py:275 create_job |
| GET | /api/v1/jobs/{job_id} | /app/app/jobs.py:241 get_job |
| PUT | /api/v1/jobs/{job_id}/advisor | /app/app/jobs.py:300 assign_job_advisor |
| POST | /api/v1/jobs/{job_id}/attachments | /app/app/execution.py:283 create_remote_attachment |
| POST | /api/v1/jobs/{job_id}/commands/{command} | /app/app/jobs.py:482 command_job |
| POST | /api/v1/jobs/{job_id}/complete-handover | /app/app/finance.py:484 complete_handover |
| GET | /api/v1/jobs/{job_id}/delivery | /app/app/finance.py:525 get_delivery |
| PUT | /api/v1/jobs/{job_id}/estimated-delivery | /app/app/jobs.py:250 update_estimated_delivery |
| POST | /api/v1/jobs/{job_id}/estimates | /app/app/jobs.py:360 create_estimate |
| GET | /api/v1/jobs/{job_id}/execution | /app/app/execution.py:300 get_remote_execution |
| GET | /api/v1/jobs/{job_id}/invoices | /app/app/finance.py:270 list_job_invoices |
| POST | /api/v1/jobs/{job_id}/invoices | /app/app/finance.py:279 issue_invoice |
| PUT | /api/v1/jobs/{job_id}/manager | /app/app/jobs.py:337 transfer_job_manager |
| GET | /api/v1/jobs/{job_id}/material-reservations | /app/app/materials.py:177 list_job_reservations |
| POST | /api/v1/jobs/{job_id}/qc-checks | /app/app/execution.py:312 create_remote_qc_check |
| POST | /api/v1/jobs/{job_id}/technician-tasks | /app/app/execution.py:224 assign_remote_task |
| POST | /api/v1/jobs/{job_id}/work-updates | /app/app/execution.py:267 create_remote_work_update |
| GET | /api/v1/material-ledger | /app/app/materials.py:182 list_material_ledger |
| GET | /api/v1/material-reservations | /app/app/materials.py:161 list_reservations |
| POST | /api/v1/material-reservations | /app/app/materials.py:197 create_reservation |
| POST | /api/v1/material-reservations/{reservation_id}/commands/{command} | /app/app/materials.py:242 material_command |
| POST | /api/v1/material-shortages | /app/app/materials.py:226 create_material_shortage |
| GET | /api/v1/media | /app/app/media.py:64 list_media |
| POST | /api/v1/media | /app/app/media.py:75 create_media |
| PUT | /api/v1/media/{media_id} | /app/app/media.py:93 update_media |
| POST | /api/v1/media/{media_id}/archive | /app/app/media.py:105 archive_media |
| GET | /api/v1/payments/{payment_id}/supporting-attachment | /app/app/finance.py:548 get_supporting_attachment |
| GET | /api/v1/purchase-orders | /app/app/inventory.py:308 list_purchase_orders |
| POST | /api/v1/purchase-orders | /app/app/inventory.py:316 create_purchase_order |
| PUT | /api/v1/purchase-orders/{purchase_id} | /app/app/inventory.py:324 update_purchase_order |
| POST | /api/v1/purchase-orders/{purchase_id}/commands/{command} | /app/app/inventory.py:333 purchase_order_command |
| POST | /api/v1/purchase-orders/{purchase_id}/delivery-confirmations | /app/app/inventory.py:394 confirm_delivery |
| POST | /api/v1/purchase-orders/{purchase_id}/delivery-receipts | /app/app/inventory.py:362 record_delivery_receipt |
| GET | /api/v1/purchase-requests | /app/app/procurement.py:78 list_requests |
| POST | /api/v1/purchase-requests | /app/app/procurement.py:87 create_request |
| GET | /api/v1/purchase-requests/{request_id} | /app/app/procurement.py:84 get_request |
| POST | /api/v1/purchase-requests/{request_id}/approve | /app/app/procurement.py:121 approve |
| POST | /api/v1/purchase-requests/{request_id}/commands/{command} | /app/app/procurement.py:148 command |
| GET | /api/v1/purchase-requests/{request_id}/supplier-comparison | /app/app/procurement.py:113 comparison |
| POST | /api/v1/purchase-requests/{request_id}/supplier-quotes | /app/app/procurement.py:104 add_quote |
| POST | /api/v1/qc-checks | /app/app/execution.py:178 create_qc_check |
| POST | /api/v1/qc-checks/{check_id}/legacy-result | /app/app/execution.py:188 record_qc_result |
| POST | /api/v1/qc-checks/{check_id}/result | /app/app/execution.py:325 record_remote_qc_result |
| GET | /api/v1/sales/leads | /app/app/sales_crm.py:93 list_leads |
| POST | /api/v1/sales/leads | /app/app/sales_crm.py:98 create_lead |
| PUT | /api/v1/sales/leads/{lead_id} | /app/app/sales_crm.py:103 update_lead |
| GET | /api/v1/sales/quotations | /app/app/sales_crm.py:109 list_quotations |
| POST | /api/v1/sales/quotations | /app/app/sales_crm.py:126 create_quotation |
| PUT | /api/v1/sales/quotations/{quotation_id} | /app/app/sales_crm.py:136 update_quotation |
| GET | /api/v1/sales/quotations/{quotation_id}/document | /app/app/sales_crm.py:165 quotation_document |
| POST | /api/v1/sales/quotations/{quotation_id}/status | /app/app/sales_crm.py:150 change_status |
| GET | /api/v1/sales/service-tasks | /app/app/sales_crm.py:114 list_service_tasks |
| GET | /api/v1/search | /app/app/followups.py:205 search |
| GET | /api/v1/service-catalog | /app/app/service_catalog.py:61 list_catalogue |
| POST | /api/v1/service-catalog | /app/app/service_catalog.py:68 create_catalogue |
| GET | /api/v1/service-catalog/job-tasks | /app/app/service_catalog.py:119 list_job_tasks |
| POST | /api/v1/service-catalog/job-tasks | /app/app/service_catalog.py:127 create_job_task |
| PUT | /api/v1/service-catalog/job-tasks/{task_id}/done | /app/app/service_catalog.py:149 set_job_task_done |
| PUT | /api/v1/service-catalog/{item_id} | /app/app/service_catalog.py:90 update_catalogue |
| GET | /api/v1/session | /app/app/main.py:135 session |
| POST | /api/v1/stock-adjustments | /app/app/inventory.py:453 adjust_stock |
| GET | /api/v1/stock-inwards | /app/app/inventory.py:424 list_stock_inwards |
| POST | /api/v1/stock-inwards | /app/app/inventory.py:432 record_stock_inward |
| GET | /api/v1/stock-ledger | /app/app/inventory.py:462 list_stock_ledger |
| POST | /api/v1/superadmin/emulations/{emulation_id}/end | /app/app/superadmin.py:330 end_emulation |
| GET | /api/v1/superadmin/tenants | /app/app/superadmin.py:237 list_tenants |
| POST | /api/v1/superadmin/tenants | /app/app/superadmin.py:255 provision_tenant |
| GET | /api/v1/superadmin/tenants/{tenant_id} | /app/app/superadmin.py:285 get_tenant |
| GET | /api/v1/superadmin/tenants/{tenant_id}/audit-events | /app/app/superadmin.py:343 list_audit_events |
| PUT | /api/v1/superadmin/tenants/{tenant_id}/billing | /app/app/superadmin.py:291 update_billing |
| POST | /api/v1/superadmin/tenants/{tenant_id}/emulations | /app/app/superadmin.py:314 start_emulation |
| POST | /api/v1/superadmin/tenants/{tenant_id}/lifecycle | /app/app/superadmin.py:301 update_lifecycle |
| GET | /api/v1/suppliers | /app/app/inventory.py:275 list_suppliers |
| POST | /api/v1/suppliers | /app/app/inventory.py:283 create_supplier |
| PUT | /api/v1/suppliers/{supplier_id} | /app/app/inventory.py:290 update_supplier |
| POST | /api/v1/suppliers/{supplier_id}/archive | /app/app/inventory.py:298 archive_supplier |
| GET | /api/v1/technician-tasks | /app/app/execution.py:111 list_my_tasks |
| POST | /api/v1/technician-tasks | /app/app/execution.py:118 assign_task |
| GET | /api/v1/technician-tasks/mine | /app/app/execution.py:216 list_remote_tasks |
| POST | /api/v1/technician-tasks/{task_id}/commands/{command} | /app/app/execution.py:248 command_remote_task |
| POST | /api/v1/technician-tasks/{task_id}/update | /app/app/execution.py:138 update_task |
| GET | /api/v1/tenant/settings | /app/app/main.py:142 read_tenant_settings |
| PUT | /api/v1/tenant/settings | /app/app/main.py:176 write_tenant_settings |
| GET | /api/v1/tenant/theme | /app/app/main.py:154 read_tenant_theme |
| PUT | /api/v1/tenant/theme | /app/app/main.py:162 write_tenant_theme |
| GET | /api/v1/vehicles | /app/app/intake.py:391 list_vehicles |
| POST | /api/v1/vehicles | /app/app/intake.py:399 create_vehicle |
| GET | /api/v1/vehicles/{vehicle_id} | /app/app/intake.py:408 get_vehicle |
| PUT | /api/v1/vehicles/{vehicle_id} | /app/app/intake.py:414 update_vehicle |
| POST | /api/v1/vehicles/{vehicle_id}/archive | /app/app/intake.py:425 archive_vehicle |
| GET | /api/v1/visits | /app/app/intake.py:434 list_visits |
| POST | /api/v1/visits | /app/app/intake.py:442 create_visit |
| GET | /api/v1/visits/{visit_id} | /app/app/intake.py:451 get_visit |
| PUT | /api/v1/visits/{visit_id} | /app/app/intake.py:457 update_visit |
| POST | /api/v1/visits/{visit_id}/archive | /app/app/intake.py:466 archive_visit |
| POST | /api/v1/work-updates/{update_id}/attachments | /app/app/execution.py:151 upload_attachment |
| GET | /health | /app/app/main.py:84 health |

## Contract sign-off gate

Resolve named/inferred return types to executable schemas, confirm helper-alias parameter translations, and run contract tests before accepting implementation. This exhaustive operation disposition is not a claim of complete runtime verification. Unresolved financial, identity and legacy projection decisions remain explicit blockers in 30.

## API-07 - Structural schemas and remaining wire expansion

[148 canonical command schemas](stage3-command-schemas.json.md) resolve each allowlisted command's named input and result using the pinned source and existing TypeScript checker without emitting code. These are **adapter structural schemas**, not deployed OpenAPI: number fields still reflect the existing component types. Apply API-02 decimal-string transport conversion with the numeric field mapping in24, then validate safe conversion back to these schemas. The schema identifiers/definitions are local to each command. Required/default arguments and unknown-field rejection are explicit. Thirteen admin-state-returning commands retain an x-unverified unknown metadata dictionary from the source type; restrict/redact that metadata to approved bounded JSON values before wire schema sign-off. It is not permission to accept unknown business inputs.

The module-level src/db.ts:614 todayKey arrow helper is an additional pure clock helper outside the344 named-function catalog: no HTTP endpoint, unchanged UTC date extraction behavior until an explicit date-policy decision. Constants/default fixtures in the type/master ledger are configuration, not omitted CRUD commands. Existing44 API object methods are separately enumerated above.

### Sensitive identity fields

WorkshopStateProjection explicitly omits users.password and all credential/session hashes. The adapter must not reconstruct real credentials. Any existing user-editor behavior that expects a prefilled stored password is an unresolved security/UI contract conflict, requiring explicit review before that caller is integrated; do not silently return plaintext or change its default. Credential-changing commands must not store request secrets in command receipts/audit. Use a keyed payload digest for sensitive requests, secret-free response receipts and approved retention; never log request bodies.

**Source follow-up VERIFIED:** UserManager initializes an empty password for new users (src/App.tsx:10920?10929), binds the required minLength=6 password input to draft.password (11024?11035), and Edit uses setDraft(item) (11159?11168). Thus editing currently prefills the stored credential. This is a concrete account-management compatibility conflict, not merely a hypothetical. Secure update-only password handling needs explicit approval of that behavior before user-editor integration; no UI/source change is made in Stage3. Login also has a preset demo password and demo error messaging (1377 and907), so production demo-control treatment must be decided without silently altering the approved screen.

## AUTH-DEC-01 - Normative authentication contract update

POST /api/v1/auth/login accepts manually entered valid credentials and development-prefilled credentials identically. Neither account membership in the dropdown nor a development header authorizes access. The submitted password is checked against a backend hash; no password/hash is returned. GET /api/v1/auth/config may advertise the explicit non-secret prefill capability and pre-auth CSRF bootstrap, but never serves demo credentials in production. Development fixture delivery is a separate gated build/config input, not a business/auth password lookup endpoint.

Login creates a persistent HttpOnly cookie with Max-Age/Expires bounded by server expiry, appropriate SameSite/Secure and rotated session identity. GET /api/v1/session validates backend session state and returns safe actor/scope/permissions/expiry; missing/expired/revoked session returns401. Browser cookie presence alone is insufficient. Authenticated unsafe endpoints and logout validate CSRF; login also needs login-CSRF protection. POST /api/v1/auth/logout revokes the active server session, clears matching cookies and returns204. Already expired/revoked credentials cannot authorize any business action; safe cookie cleanup may be idempotent without making an invalid session valid.

/login redirect and protected-route behavior are client routing around this shared session endpoint, not new authentication methods. The source root/page-key versus Dashboard binding is tracked in26. No arbitrary saved return URL may override the required valid-session /login destination. A network failure is not an invalid-session verdict and must not cause redirect loops. User-management password-editing approval remains separate from the approved login fixture exception.
