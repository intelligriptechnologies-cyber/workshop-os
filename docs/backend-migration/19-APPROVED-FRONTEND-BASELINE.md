# 19 - Approved frontend baseline protection

Stage 2, 2026-10-21. **User-confirmed protected frontend commit: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`.** Current branch is `Prem-dev-fbb-Go21` at that exact commit. This is the source revision used by Stage 1 captures and contracts, preserved through Stages 1.5/1.5A/1.6, and consistent with the user's instruction to keep that approved frontend unchanged. Confidence is high for technical baseline identity. An independently signed client artifact naming the SHA is not available; this report does not fabricate one. The final authentication instruction explicitly confirms this frontend SHA as approved. No tag or commit was created.

The user has now provisionally adopted the backend candidate at 50c8aab, public SQLite dataset and PostgreSQL authority direction. Those choices supersede prior wording that all such directions were undecided; authentication, historic financial treatment, preservation/retention and detailed contracts still need decisions. Backend candidate source is **not** the approved frontend revision.

## BASE-01 - Worktree and uncommitted differences

All **70 protected frontend/runtime/build files** are byte-identical to their Git blobs at the proposed commit:58 src files,7 public files and5 root entry/build/dependency files. An additional 45 test/config guard files are also byte-identical. No staged differences and no untracked files under src/public were found. `git diff a315448 -- src public index.html package.json package-lock.json vite.config.ts tsconfig.json` is empty. The only tracked working-tree modification is pre-existing `AGENTS.md`; it is not treated as approved application source and was not reverted.

Untracked work is present in `.scratch/`, `data-migration/` and `docs/backend-migration/`. Do not delete, stage, import or assume ownership of those files. Exact observed status, including individual scratch paths, is retained in [the protection manifest](stage2-protected-file-manifest.json.md). Existing scratch captures/alternate SQLite copies are not interchangeable with this baseline. No reset, checkout, merge, branch overwrite, tag or commit occurred.

The manifest records **full SHA-256 for Git bytes and working bytes**, byte length and class for each of 115 files. It is documentation evidence; no automatic guard is installed yet. The proposed later guard must also detect additions, deletions, renames and dependency changes, not merely compare hashes of still-existing files.

## BASE-02 - Protection classes and permitted future seams

| Class | Protected contract | Future integration boundary, subject to separate approval |
|---|---|---|
| Presentation | JSX hierarchy, navigation, labels, field type/order/default/required/disabled logic, dialogs, tables/cards, reports and responsive CSS | No redesign, replacement page or alternate remote workspace. Internal data plumbing changes need exact reviewed diff plus behavior/visual equivalence. |
| Behavioral reference | Local db/domain validators, state transitions, arithmetic, roles, numbering, templates, default fixtures | Preserve immutable reference bytes for comparison. Future server implementation must reproduce approved effects; local source is not automatically production persistence. |
| Adapter candidates | `*-api.ts`, `auth.ts`, App data orchestration, types/state projections, snapshot/export boundaries | Necessary API seams, not exempt from protection. Map async completion/error/double-submit semantics before changing; currently no edits authorized. |
| Rendering environment | CSS, icon package/lockfile, static assets, manifest, service worker, build/entry configuration | Pin environment and prevent dependency/font/build changes from silently changing rendering. |
| Regression guards | tests, unit-tests and Playwright config | Preserve now. Later approved corrections must not weaken assertions to accept changed UI or mutate shipped data. |

`App.tsx` contains both presentation and integration logic; a whole-file allowlist exception would defeat protection. `remote-*` files are included because mode switching can reach them, but their existence does not approve adopting their different screens. Legacy/duplicate components remain inventoried and frozen; they are not an instruction to add pages or backend scope.

## BASE-03 - Pages, navigation, forms and components

The exact catalog remains [01](01-APPLICATION-INVENTORY.md), [UI contracts](02-PAGE-AND-UI-CONTRACTS.md), [component IDs/spans](evidence-component-index.md), [full component contracts](evidence-ui-component-contracts.md), [field register](evidence-field-register.md) and [control ledger](evidence-ui-controls.md). These cover 32 declared page keys,197 named JSX component declarations,52 native form sites,533 fields and1,122 interactive declaration sites. Counts include conditional/legacy source declarations and do not mean1,122 browser-verified actions. ACT/FORM/CMP/SCR/WF/OP identifiers must be retained for later traceability.

| UI family | Protected sources / presentation scope |
|---|---|
| Shell, page switching, role rail, login and Search | `App.tsx`, `main.tsx`, `admin-demo-state.ts`, `auth.ts`, `ui-kit.tsx`; main workspaces switch keys within `/`, authentication callback is separate. `receive-vehicle` is a legacy non-menu key, not a missing page to build. |
| Dashboard and reports | App dashboard components, `dashboard-metrics.ts`, `data-flow.ts`, export/document renderers; preserve metric/filter semantics and source date behavior. |
| Reception, booking and intake | App reception/CreateVisitDialog, `booking-calendar.tsx`, `booking-check-in.tsx`, `booking-expected-today.tsx`, date/follow-up helpers; customer/vehicle picker links and Details/Body Mark tabs. |
| Job, estimate, task, QC and lifecycle | App JobRecordDialog/JobEditor and nested tabs; `job-card-layout.ts`, `job-sheet-ui.tsx`, `job-picker.tsx`, `service-advisor.ts`, body marks and local business helpers. |
| Billing, payment and delivery | `billing-manager.tsx`, `invoice-math.ts`, `finance-ui.ts`, `job-documents.ts`, `document-snapshots.ts`; preserve full-payment closure, read-only Accounts views and financial locks. |
| Materials, stock and procurement | App purchasing/stock workspaces, `materials-ui.tsx`, `materials.ts`, inventory import/seed and supplier display helpers; request/issue/reconcile separation and receipt/confirmation/close behavior. |
| Sales CRM | `local-sales.tsx`, lead register/dialog, quotation dialog/filter, report templates; remote-sales is not a replacement approval. |
| Admin/developer | `admin-console.tsx`, `admin-demo-state.ts`, developer console/control-plane; custom grants, department teams, theme/company settings, templates/import/logs. Developer billing/communications are simulations unless separately approved. |
| Forms/dialogs/tables | Shared ui-kit, pagination toolbar and full component contracts; preserve accessible names, focus return, nesting, defaults, cancellation and validation. Some View dialogs intentionally contain separately permitted actions; do not infer blanket read-only from title. |
| Styling/icons/images | `styles.css`, lucide-react import sites and package lock, body-mark SVG/PNG, icon and media placeholder; theme tokens/default company assets and report HTML are part of appearance. |
| Print/download | report templates, job documents, snapshots, pdf-render, document-download, export-utils; preserve six categories/eight defaults and frozen historical output. |

Seven built-in roles: admin, service, service_manager, reception, accounts, store, tech. Presentation must retain exact accessible menus, per-record actor/status restrictions, custom grants and manager-versus-advisor differences from [04](04-ROLES-AND-PERMISSIONS.md). An Admin screenshot is not evidence of another role's conditional controls. No permissions are relaxed merely because the future backend exposes an endpoint.

## BASE-04 - Exact protected file inventory

All entries below are exact Git-relative paths. Full digests and byte equality are in the machine-readable manifest. The component index identifies every one of the 197 named declarations; entries below show the declaration count per file where applicable, not an assertion that every component is reachable.

| File | Protection class | Named JSX declarations |
|---|---|---:|
| `index.html` | build-entry-dependency | 0 |
| `package-lock.json` | build-entry-dependency | 0 |
| `package.json` | build-entry-dependency | 0 |
| `public/body-mark-vehicle.svg` | public-asset-data-runtime | 0 |
| `public/car-damage-diagram.png` | public-asset-data-runtime | 0 |
| `public/icon.svg` | public-asset-data-runtime | 0 |
| `public/manifest.webmanifest` | public-asset-data-runtime | 0 |
| `public/media-placeholder.svg` | public-asset-data-runtime | 0 |
| `public/sw.js` | public-asset-data-runtime | 0 |
| `public/workshopos-demo.sqlite` | public-asset-data-runtime | 0 |
| `src/App.tsx` | frontend-source | 118 |
| `src/admin-console.tsx` | frontend-source | 26 |
| `src/admin-demo-state.ts` | frontend-source | 0 |
| `src/admin-users-api.ts` | frontend-source | 0 |
| `src/advance-booking-range.ts` | frontend-source | 0 |
| `src/auth.ts` | frontend-source | 0 |
| `src/billing-manager.tsx` | frontend-source | 10 |
| `src/body-mark.tsx` | frontend-source | 1 |
| `src/booking-calendar.tsx` | frontend-source | 1 |
| `src/booking-check-in.tsx` | frontend-source | 1 |
| `src/booking-expected-today.tsx` | frontend-source | 1 |
| `src/booking-followup.ts` | frontend-source | 0 |
| `src/dashboard-metrics.ts` | frontend-source | 0 |
| `src/data-flow.ts` | frontend-source | 0 |
| `src/db.ts` | frontend-source | 0 |
| `src/demo-delivery-dates.json` | frontend-source | 0 |
| `src/developer-console.tsx` | frontend-source | 4 |
| `src/developer-control-plane.ts` | frontend-source | 0 |
| `src/document-download.tsx` | frontend-source | 1 |
| `src/document-snapshots.ts` | frontend-source | 0 |
| `src/export-utils.ts` | frontend-source | 0 |
| `src/finance-api.ts` | frontend-source | 0 |
| `src/finance-ui.ts` | frontend-source | 0 |
| `src/followups-api.ts` | frontend-source | 0 |
| `src/inventory-import.ts` | frontend-source | 0 |
| `src/inventory-seed.ts` | frontend-source | 0 |
| `src/invoice-math.ts` | frontend-source | 0 |
| `src/job-card-layout.ts` | frontend-source | 0 |
| `src/job-card-notifications.ts` | frontend-source | 0 |
| `src/job-delivery-highlight.ts` | frontend-source | 0 |
| `src/job-documents.ts` | frontend-source | 0 |
| `src/job-media.ts` | frontend-source | 0 |
| `src/job-picker.tsx` | frontend-source | 1 |
| `src/job-sheet-ui.tsx` | frontend-source | 4 |
| `src/job-sheet.ts` | frontend-source | 0 |
| `src/jobs-api.ts` | frontend-source | 0 |
| `src/list-utils.ts` | frontend-source | 0 |
| `src/local-sales.tsx` | frontend-source | 1 |
| `src/main.tsx` | frontend-source | 0 |
| `src/materials-ui.tsx` | frontend-source | 4 |
| `src/materials.ts` | frontend-source | 0 |
| `src/pagination-toolbar.tsx` | frontend-source | 2 |
| `src/pdf-render.ts` | frontend-source | 0 |
| `src/purchase-order-supplier-display.ts` | frontend-source | 0 |
| `src/quotation-dialog.tsx` | frontend-source | 6 |
| `src/quotation-filter-bar.tsx` | frontend-source | 1 |
| `src/remote-finance.tsx` | frontend-source | 2 |
| `src/remote-followups.tsx` | frontend-source | 1 |
| `src/remote-sales.tsx` | frontend-source | 2 |
| `src/report-templates.ts` | frontend-source | 0 |
| `src/sales-api.ts` | frontend-source | 0 |
| `src/sales-lead-dialog.tsx` | frontend-source | 1 |
| `src/sales-lead-register.tsx` | frontend-source | 2 |
| `src/service-advisor.ts` | frontend-source | 0 |
| `src/styles.css` | frontend-source | 0 |
| `src/types.ts` | frontend-source | 0 |
| `src/ui-kit.tsx` | frontend-source | 7 |
| `src/vite-env.d.ts` | frontend-source | 0 |
| `tsconfig.json` | build-entry-dependency | 0 |
| `vite.config.ts` | build-entry-dependency | 0 |

Protect the 45 additional test/config entries listed individually in the manifest. Dependency-provided icons, SQL.js WASM, fonts selected by the system stack, PDF/canvas behavior and sanitizer behavior are pinned indirectly by lockfile and documented environment; do not copy node_modules into the approval inventory. Untracked dist/build outputs and root legacy desktop/mobile PNGs are not promoted to the 94-image source reference. Deployment configuration remains unchanged by task scope even though it is not part of the 70-file presentation/runtime manifest.

## BASE-05 - Reference evidence and approval boundary

The94 source screenshots are preserved individually with hashes/dimensions/role/state in [screenshot manifest](stage2-screenshot-manifest.json.md); the old compiled-build error image is excluded. Eight labeled derived overview sheets were created solely to review existing images; they are not new application captures, replacements or regression goldens. See [20](20-UI-REGRESSION-PROTECTION.md) for limitations and proposed capture parameters.

No evidence establishes that all conditional workflows were client-signed at every state. Protect observed/source behavior provisionally, preserve financial ambiguities under [21](21-FINANCIAL-DATA-RECONCILIATION.md), and obtain review of this SHA/inventory before any future exception. The high-confidence revision identification does not authorize integration edits. Automated enforcement is proposed in [22](22-INTEGRATION-ACCEPTANCE-PLAN.md), not implemented.
