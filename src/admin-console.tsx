import { useEffect, useMemo, useRef, useState } from "react";
import { FileSpreadsheet, ShieldCheck, Sliders } from "lucide-react";
import type { User, WorkshopState } from "./types";
import { Dialog, DownloadMenu, ListSearchActions, PageSizeSelect } from "./ui-kit";
import type { ExportColumn } from "./export-utils";
import { activeFilterSummary, DEFAULT_PAGE_SIZE, normalizeSearch, paginate } from "./list-utils";
import { Info, PanelTitle, ResultPagination, UserManager, roleLabels, type Mutate } from "./App";
import type { CognitoConfig } from "./auth";
import {
  ADMIN_PAGE_GROUPS,
  addDemoRole,
  createReportTemplate,
  appendDemoLog,
  archiveDemoRole,
  clearDemoLogs,
  confirmInventoryImport,
  filterDemoLogs,
  loadAdminDemoState,
  normalizeBusinessSettings,
  resolvePermittedPages,
  saveAdminDemoState,
  saveCompanyIdentity,
  updateBusinessSettings,
  updateReportTemplate,
  updateDemoRole,
  updateRolePageAccess,
  validateBusinessSettings,
  type AdminDemoState,
  type AdminPageKey,
  type DemoLogEntry,
  type DemoLogStream,
  type DemoRole,
  type WorkshopBusinessSettings,
  type CompanyAssets,
  type ReportCategory,
} from "./admin-demo-state";
import {
  buildInventoryImportPreview,
  buildInventoryTemplateBuffer,
  INVENTORY_IMPORT_FIELDS,
  INVENTORY_TEMPLATE_HEADERS,
  parseInventoryWorkbook,
  suggestInventoryColumnMapping,
  type InventoryColumnMapping,
  type InventoryImportField,
  type InventoryImportPreview,
  type ParsedInventoryWorkbook,
  type RejectedInventoryImportRow,
} from "./inventory-import";
import { REPORT_CATEGORY_LABELS, REPORT_PLACEHOLDERS, findUnsupportedPlaceholders, renderReportTemplate, sampleReportValues } from "./report-templates";

const ADMIN_TABS = ["Users", "Roles & Page Access", "Business Settings", "Build Company Settings", "Report Templates", "Inventory Import", "Support & Logs"] as const;
type AdminTab = (typeof ADMIN_TABS)[number];

type LogEntryInput = Omit<DemoLogEntry, "id" | "timestamp">;

export function AdminConsole({ state, mutate, actingUser, cognitoConfig }: { state: WorkshopState; mutate: Mutate; actingUser: User; cognitoConfig?: CognitoConfig }) {
  const [tab, setTab] = useState<AdminTab>("Users");
  const [adminState, setAdminState] = useState<AdminDemoState>(() => loadAdminDemoState());
  const [templateDirty, setTemplateDirty] = useState(false);
  const [storageError, setStorageError] = useState("");

  /** Applies a pure admin-state change, optionally appends a log entry, then persists to sessionStorage. */
  const commit = (mutator: (current: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => {
    try {
      let next = mutator(adminState);
      if (entry) next = appendDemoLog(next, entry);
      const saved = saveAdminDemoState(next);
      setAdminState(saved);
      setStorageError("");
      return true;
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Unable to save this session. Your previous settings are unchanged.");
      return false;
    }
  };

  const refresh = () => setAdminState(loadAdminDemoState());

  return (
    <section className="workspace single-panel admin-console">
      <div className="desk-panel">
        <PanelTitle icon={<ShieldCheck />} title="Admin Console" subtitle="Owner/Admin configuration for this demo session" />
        <div className="management-tabs" role="tablist" aria-label="Admin Console tabs">
          {ADMIN_TABS.map((item) => (
            <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => {
              if (item === tab) return;
              if (tab === "Report Templates" && templateDirty && !window.confirm("Discard unsaved template changes?")) return;
              setTemplateDirty(false);
              setTab(item);
            }}>
              {item}
            </button>
          ))}
        </div>
        {storageError && <div className="api-error" role="alert"><p>{storageError}</p></div>}
        {tab === "Users" && <UserManager users={state.users} mutate={mutate} actingUser={actingUser} cognitoConfig={cognitoConfig} />}
        {tab === "Roles & Page Access" && <RolesPageAccessTab adminState={adminState} commit={commit} actingUser={actingUser} />}
        {tab === "Business Settings" && <BusinessSettingsTab adminState={adminState} commit={commit} actingUser={actingUser} />}
        {tab === "Build Company Settings" && <CompanySettingsTab adminState={adminState} commit={commit} actingUser={actingUser} />}
        {tab === "Report Templates" && <ReportTemplatesTab adminState={adminState} commit={commit} actingUser={actingUser} onDirtyChange={setTemplateDirty} />}
        {tab === "Inventory Import" && <InventoryImportTab adminState={adminState} commit={commit} actingUser={actingUser} state={state} />}
        {tab === "Support & Logs" && <SupportLogsTab adminState={adminState} commit={commit} refresh={refresh} actingUser={actingUser} />}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Roles & Page Access ---- */

const ALL_PAGE_KEYS: AdminPageKey[] = ADMIN_PAGE_GROUPS.flatMap((group) => group.pages.map((page) => page.key));

function RolesPageAccessTab({ adminState, commit, actingUser }: { adminState: AdminDemoState; commit: (mutator: (s: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => void; actingUser: User }) {
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "active" | "archived">("ALL");
  const [statusDraft, setStatusDraft] = useState<"ALL" | "active" | "archived">("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(adminState.roles[0]?.id);
  const [creating, setCreating] = useState(false);
  const [newRole, setNewRole] = useState({ label: "", description: "" });
  const [editingRoleId, setEditingRoleId] = useState<string | undefined>();
  const [editDraft, setEditDraft] = useState({ label: "", description: "" });
  const [pageSearch, setPageSearch] = useState("");
  const [draftPages, setDraftPages] = useState<AdminPageKey[]>([]);
  const [formError, setFormError] = useState("");

  const needle = normalizeSearch(search);
  const roles = adminState.roles.filter((role) => (!needle || normalizeSearch(`${role.label} ${role.description}`).includes(needle)) && (statusFilter === "ALL" || role.status === statusFilter));
  const pagedRoles = paginate(roles, page, pageSize);
  const selectedRole = adminState.roles.find((role) => role.id === selectedRoleId);
  const savedPages = selectedRoleId ? resolvePermittedPages(adminState, selectedRoleId) : [];
  const isOwnerRole = selectedRoleId === "admin";
  const dirty = selectedRoleId !== undefined && JSON.stringify([...draftPages].sort()) !== JSON.stringify([...savedPages].sort());

  useEffect(() => {
    setDraftPages(selectedRoleId ? resolvePermittedPages(adminState, selectedRoleId) : []);
    // Only re-sync when the selected role changes (see effect note in BusinessSettingsTab for why
    // adminState itself isn't a dependency: this would clobber in-progress edits).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId]);

  const togglePage = (key: AdminPageKey) => {
    if (isOwnerRole && key === "admin-console") return;
    setDraftPages((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };
  const toggleGroup = (keys: AdminPageKey[], checked: boolean) => {
    setDraftPages((prev) => {
      const withoutGroup = prev.filter((item) => !keys.includes(item));
      const next = checked ? [...withoutGroup, ...keys] : withoutGroup;
      return isOwnerRole ? Array.from(new Set([...next, "admin-console" as AdminPageKey])) : next;
    });
  };
  const filteredGroups = ADMIN_PAGE_GROUPS.map((group) => ({
    ...group,
    pages: group.pages.filter((page) => !pageSearch.trim() || normalizeSearch(page.label).includes(normalizeSearch(pageSearch))),
  })).filter((group) => group.pages.length > 0);

  const roleColumns: ExportColumn<DemoRole>[] = [
    { header: "Role", value: (row) => row.label },
    { header: "Description", value: (row) => row.description },
    { header: "Status", value: (row) => row.status },
    { header: "Pages granted", value: (row) => resolvePermittedPages(adminState, row.id).length },
  ];

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Roles &amp; Page Access</h3>
        <button className="primary-action" onClick={() => { setNewRole({ label: "", description: "" }); setFormError(""); setCreating(true); }}>Add Role</button>
      </div>

      {creating && (
        <Dialog title="Add Role" subtitle="Session-only demo role" onClose={() => setCreating(false)}>
          <form onSubmit={(event) => {
            event.preventDefault();
            try {
              commit((current) => addDemoRole(current, newRole), {
                stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access",
                message: `Role "${newRole.label.trim()}" created`, userId: String(actingUser.id), userName: actingUser.name,
              });
              setCreating(false);
            } catch (error) {
              setFormError(error instanceof Error ? error.message : "Could not create role.");
            }
          }}>
            <label>Role name<input required value={newRole.label} onChange={(event) => setNewRole({ ...newRole, label: event.target.value })} /></label>
            <label>Description<input value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value })} /></label>
            {formError && <p className="error-text">{formError}</p>}
            <div className="action-row"><button className="primary-action">Save Role</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div>
          </form>
        </Dialog>
      )}

      <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setSearch(searchDraft); setStatusFilter(statusDraft); setPage(1); } }}>
        <label className="list-search">Search<input aria-label="Search roles" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Role name or description" /></label>
        <label>Status<select aria-label="Filter roles by status" value={statusDraft} onChange={(event) => setStatusDraft(event.target.value as typeof statusDraft)}><option value="ALL">All statuses</option><option value="active">Active</option><option value="archived">Archived</option></select></label>
        <ListSearchActions onClear={() => { setSearchDraft(""); setSearch(""); setStatusDraft("ALL"); setStatusFilter("ALL"); setPage(1); }} onSearch={() => { setSearch(searchDraft); setStatusFilter(statusDraft); setPage(1); }} />
        <DownloadMenu report={{ title: "Roles", filters: activeFilterSummary({ Search: search.trim(), Status: statusFilter }), columns: roleColumns, rows: roles }} />
      </div>
      <div className="list-result-controls"><span className="result-summary">Showing {pagedRoles.from} to {pagedRoles.to} of {pagedRoles.totalCount}</span><PageSizeSelect ariaLabel="Role records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
      <ResultPagination page={pagedRoles.page} pageCount={pagedRoles.pageCount} onChange={setPage} />

      <div className="role-access-layout">
        <div className="record-list role-list">
          {pagedRoles.items.map((role) => (
            <div className={`managed-record${selectedRoleId === role.id ? " active-record" : ""}`} key={role.id}>
              {editingRoleId === role.id ? (
                <form className="inline-edit" onSubmit={(event) => {
                  event.preventDefault();
                  try {
                    commit((current) => updateDemoRole(current, role.id, editDraft), {
                      stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access",
                      message: `Role "${role.label}" updated`, userId: String(actingUser.id), userName: actingUser.name,
                    });
                    setEditingRoleId(undefined);
                  } catch (error) { window.alert(error instanceof Error ? error.message : "Could not update role."); }
                }}>
                  <input required value={editDraft.label} onChange={(event) => setEditDraft({ ...editDraft, label: event.target.value })} />
                  <input value={editDraft.description} onChange={(event) => setEditDraft({ ...editDraft, description: event.target.value })} placeholder="Description" />
                  <div className="action-row"><button className="primary-action">Save</button><button type="button" onClick={() => setEditingRoleId(undefined)}>Cancel</button></div>
                </form>
              ) : (
                <button className="record-select" onClick={() => setSelectedRoleId(role.id)}>
                  <strong>{role.label}</strong>
                  <span>{role.description || "No description"} · {role.status}{role.isBuiltIn ? " · built-in" : ""}</span>
                </button>
              )}
              {editingRoleId !== role.id && (
                <div className="action-row">
                  <button onClick={() => { setEditingRoleId(role.id); setEditDraft({ label: role.label, description: role.description }); }}>Edit</button>
                  <button className="danger-action" disabled={role.id === "admin" || role.status === "archived"} title={role.id === "admin" ? "Owner/Admin cannot be archived" : undefined} onClick={() => {
                    if (!window.confirm(`Archive role "${role.label}"?`)) return;
                    commit((current) => archiveDemoRole(current, role.id), {
                      stream: "feature", level: "warning", area: "Administration", feature: "Roles & Page Access",
                      message: `Role "${role.label}" archived`, userId: String(actingUser.id), userName: actingUser.name,
                    });
                    if (selectedRoleId === role.id) setSelectedRoleId(undefined);
                  }}>Archive</button>
                </div>
              )}
            </div>
          ))}
          {roles.length === 0 && <div className="list-empty"><h3>No matching roles</h3><button onClick={() => { setSearchDraft(""); setSearch(""); setStatusDraft("ALL"); setStatusFilter("ALL"); setPage(1); }}>Clear filters</button></div>}
        </div>

        <div className="desk-panel page-access-panel">
          {!selectedRole ? <p className="empty-state">Select a role to manage page access.</p> : (
            <>
              <PanelTitle icon={<Sliders />} title={`Page Access · ${selectedRole.label}`} subtitle={isOwnerRole ? "Admin Console access is always protected for Owner/Admin" : "Grouped by navigation area"} />
              <div className="store-filter-grid">
                <label className="list-search">Search pages<input value={pageSearch} onChange={(event) => setPageSearch(event.target.value)} placeholder="Page name" /></label>
                <div className="action-row">
                  <button onClick={() => setDraftPages(isOwnerRole ? [...ALL_PAGE_KEYS] : [...ALL_PAGE_KEYS])}>Select All</button>
                  <button onClick={() => setDraftPages(isOwnerRole ? ["admin-console"] : [])}>Clear All</button>
                  <button onClick={() => setDraftPages(savedPages)} disabled={!dirty}>Reset to Saved</button>
                  <button className="primary-action" disabled={!dirty} onClick={() => {
                    commit((current) => updateRolePageAccess(current, selectedRole.id, draftPages), {
                      stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access",
                      message: `Page access saved for "${selectedRole.label}"`, userId: String(actingUser.id), userName: actingUser.name, referenceId: selectedRole.id,
                    });
                  }}>Save Changes</button>
                </div>
              </div>
              <div className="page-access-groups">
                {filteredGroups.map((group) => (
                  <GroupFieldset key={group.key} group={group} draftPages={draftPages} isOwnerRole={isOwnerRole} onToggleGroup={toggleGroup} onTogglePage={togglePage} />
                ))}
              </div>
              <div className="nav-preview">
                <strong>Navigation preview</strong>
                <div className="nav-preview-pills">
                  {draftPages.length === 0 ? <span className="empty-state">No pages granted.</span> : ADMIN_PAGE_GROUPS.flatMap((group) => group.pages).filter((page) => draftPages.includes(page.key)).map((page) => <span className="category-badge" key={page.key}>{page.label}</span>)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ResultPagination page={pagedRoles.page} pageCount={pagedRoles.pageCount} onChange={setPage} />
    </div>
  );
}

function GroupFieldset({ group, draftPages, isOwnerRole, onToggleGroup, onTogglePage }: {
  group: (typeof ADMIN_PAGE_GROUPS)[number];
  draftPages: AdminPageKey[];
  isOwnerRole: boolean;
  onToggleGroup: (keys: AdminPageKey[], checked: boolean) => void;
  onTogglePage: (key: AdminPageKey) => void;
}) {
  const groupRef = useRef<HTMLInputElement>(null);
  const keys = group.pages.map((page) => page.key);
  const checkedCount = keys.filter((key) => draftPages.includes(key)).length;
  const allChecked = checkedCount === keys.length;
  const noneChecked = checkedCount === 0;
  useEffect(() => { if (groupRef.current) groupRef.current.indeterminate = !allChecked && !noneChecked; }, [allChecked, noneChecked]);
  return (
    <fieldset className="assignment-fieldset page-access-group">
      <legend>
        <label>
          <input ref={groupRef} type="checkbox" checked={allChecked} onChange={() => onToggleGroup(keys, !allChecked)} /> {group.label}
        </label>
      </legend>
      {group.pages.map((page) => {
        const locked = isOwnerRole && page.key === "admin-console";
        return (
          <label key={page.key} title={locked ? "Owner/Admin always keeps Admin Console access" : undefined}>
            <input type="checkbox" checked={draftPages.includes(page.key)} disabled={locked} onChange={() => onTogglePage(page.key)} /> {page.label}
          </label>
        );
      })}
    </fieldset>
  );
}

/* ------------------------------------------------------------------------- Business Settings */

const SETTINGS_GROUPS = [
  { key: "profile", label: "Workshop Profile" },
  { key: "branch", label: "Branch & Working Hours" },
  { key: "jobs", label: "Jobs & Workflow" },
  { key: "pricing", label: "Estimates & Pricing" },
  { key: "billing", label: "Tax & Billing" },
  { key: "inventory", label: "Inventory" },
  { key: "notifications", label: "Notifications & Documents" },
] as const;
type SettingsGroupKey = (typeof SETTINGS_GROUPS)[number]["key"];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PAYMENT_MODE_OPTIONS = ["Cash", "Card", "UPI", "Bank Transfer", "Cheque"];
const NOTIFICATION_CHANNEL_OPTIONS = ["sms", "email", "whatsapp"] as const;

function BusinessSettingsTab({ adminState, commit, actingUser }: { adminState: AdminDemoState; commit: (mutator: (s: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => boolean; actingUser: User }) {
  const [subTab, setSubTab] = useState<SettingsGroupKey>("profile");
  const [draft, setDraft] = useState<WorkshopBusinessSettings>(adminState.businessSettings);
  const [errors, setErrors] = useState<string[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    // Re-syncs the working draft only when the *saved* settings object changes (i.e. after this
    // tab's own Save/Reset commits, or on first mount) — not on every keystroke.
    setDraft(adminState.businessSettings);
  }, [adminState.businessSettings]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(adminState.businessSettings);

  const setField = <G extends keyof WorkshopBusinessSettings>(group: G, field: keyof WorkshopBusinessSettings[G], value: WorkshopBusinessSettings[G][keyof WorkshopBusinessSettings[G]]) => {
    setJustSaved(false);
    setDraft((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }));
  };
  const toggleListValue = <G extends keyof WorkshopBusinessSettings>(group: G, field: keyof WorkshopBusinessSettings[G], value: string) => {
    setJustSaved(false);
    setDraft((prev) => {
      const current = prev[group][field] as unknown as string[];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [group]: { ...prev[group], [field]: next } };
    });
  };

  const save = () => {
    const normalized = normalizeBusinessSettings(draft);
    const validationErrors = validateBusinessSettings(normalized);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;
    const saved = commit((current) => updateBusinessSettings(current, normalized), {
      stream: "feature", level: "info", area: "Administration", feature: "Business Settings",
      message: "Business settings saved", userId: String(actingUser.id), userName: actingUser.name,
    });
    if (!saved) return;
    setDraft(normalized);
    setJustSaved(true);
  };
  const reset = () => {
    if (!window.confirm("Reset unsaved changes back to the saved business settings?")) return;
    setDraft(adminState.businessSettings);
    setErrors([]);
    setJustSaved(false);
  };

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Business Settings</h3>
        <div className="action-row">
          <button onClick={reset} disabled={!dirty}>Reset to Saved</button>
          <button className="primary-action" onClick={save} disabled={!dirty}>Save Settings</button>
        </div>
      </div>
      {errors.length > 0 && <div className="api-error" role="alert">{errors.map((message) => <p key={message}>{message}</p>)}</div>}
      {justSaved && !dirty && <p className="save-confirmation">Settings saved for this session.</p>}
      {dirty && <p className="unsaved-note">Unsaved changes.</p>}
      <div className="sub-tabs" role="tablist" aria-label="Business settings sections">
        {SETTINGS_GROUPS.map((group) => <button key={group.key} role="tab" aria-selected={subTab === group.key} className={subTab === group.key ? "active" : ""} onClick={() => setSubTab(group.key)}>{group.label}</button>)}
      </div>

      {subTab === "profile" && (
        <div className="form-grid">
          <label>Business name<input value={draft.profile.businessName} onChange={(event) => setField("profile", "businessName", event.target.value)} /></label>
          <label>Legal name<input value={draft.profile.legalName} onChange={(event) => setField("profile", "legalName", event.target.value)} /></label>
          <label>Phone<input value={draft.profile.phone} onChange={(event) => setField("profile", "phone", event.target.value)} /></label>
          <label>Email<input type="email" value={draft.profile.email} onChange={(event) => setField("profile", "email", event.target.value)} /></label>
          <label>Address<input value={draft.profile.address} onChange={(event) => setField("profile", "address", event.target.value)} /></label>
          <label>Timezone<input value={draft.profile.timezone} onChange={(event) => setField("profile", "timezone", event.target.value)} /></label>
          <label>Currency<input value={draft.profile.currency} onChange={(event) => setField("profile", "currency", event.target.value)} /></label>
        </div>
      )}
      {subTab === "branch" && (
        <>
          <div className="form-grid">
            <label>Branch name<input value={draft.branch.name} onChange={(event) => setField("branch", "name", event.target.value)} /></label>
            <label>Opening time<input type="time" value={draft.branch.openingTime} onChange={(event) => setField("branch", "openingTime", event.target.value)} /></label>
            <label>Closing time<input type="time" value={draft.branch.closingTime} onChange={(event) => setField("branch", "closingTime", event.target.value)} /></label>
            <label>Holiday behavior<select value={draft.branch.holidayBehavior} onChange={(event) => setField("branch", "holidayBehavior", event.target.value as WorkshopBusinessSettings["branch"]["holidayBehavior"])}><option value="closed">Closed</option><option value="appointment-only">Appointment only</option></select></label>
          </div>
          <fieldset className="assignment-fieldset"><legend>Working days</legend>{WEEKDAYS.map((day) => <label key={day}><input type="checkbox" checked={draft.branch.workingDays.includes(day)} onChange={() => toggleListValue("branch", "workingDays", day)} />{day}</label>)}</fieldset>
        </>
      )}
      {subTab === "jobs" && (
        <div className="form-grid">
          <label>Job number prefix<input value={draft.jobs.jobNumberPrefix} onChange={(event) => setField("jobs", "jobNumberPrefix", event.target.value)} /></label>
          <label>Default promised hours<input type="number" min={1} value={draft.jobs.defaultPromisedHours} onChange={(event) => setField("jobs", "defaultPromisedHours", Number(event.target.value))} /></label>
          <label><input type="checkbox" checked={draft.jobs.requireQc} onChange={(event) => setField("jobs", "requireQc", event.target.checked)} /> Require QC before closure</label>
          <label><input type="checkbox" checked={draft.jobs.washingDefault} onChange={(event) => setField("jobs", "washingDefault", event.target.checked)} /> Washing needed by default</label>
          <label><input type="checkbox" checked={draft.jobs.autoCloseAfterDelivery} onChange={(event) => setField("jobs", "autoCloseAfterDelivery", event.target.checked)} /> Auto-close after delivery</label>
        </div>
      )}
      {subTab === "pricing" && (
        <div className="form-grid">
          <label>Estimate validity (days)<input type="number" min={1} value={draft.pricing.estimateValidityDays} onChange={(event) => setField("pricing", "estimateValidityDays", Number(event.target.value))} /></label>
          <label>Default labour rate<input type="number" min={0} value={draft.pricing.defaultLabourRate} onChange={(event) => setField("pricing", "defaultLabourRate", Number(event.target.value))} /></label>
          <label>Discount approval threshold (%)<input type="number" min={0} max={100} value={draft.pricing.discountApprovalPercent} onChange={(event) => setField("pricing", "discountApprovalPercent", Number(event.target.value))} /></label>
          <label><input type="checkbox" checked={draft.pricing.requireEstimateApproval} onChange={(event) => setField("pricing", "requireEstimateApproval", event.target.checked)} /> Require estimate approval</label>
        </div>
      )}
      {subTab === "billing" && (
        <>
          <div className="form-grid">
            <label>GSTIN<input aria-label="GSTIN" value={draft.billing.gstin} onChange={(event) => setField("billing", "gstin", event.target.value)} /></label>
            <label>Account holder<input aria-label="Account holder" value={draft.billing.bankAccountHolder} onChange={(event) => setField("billing", "bankAccountHolder", event.target.value)} /></label>
            <label>Bank name<input aria-label="Bank name" value={draft.billing.bankName} onChange={(event) => setField("billing", "bankName", event.target.value)} /></label>
            <label>Account number<input aria-label="Account number" inputMode="numeric" value={draft.billing.bankAccountNumber} onChange={(event) => setField("billing", "bankAccountNumber", event.target.value)} /></label>
            <label>IFSC<input aria-label="IFSC" value={draft.billing.bankIfsc} onChange={(event) => setField("billing", "bankIfsc", event.target.value)} /></label>
            <label>Branch<input aria-label="Bank branch" value={draft.billing.bankBranch} onChange={(event) => setField("billing", "bankBranch", event.target.value)} /></label>
            <label>UPI ID<input aria-label="UPI ID" value={draft.billing.upiId} onChange={(event) => setField("billing", "upiId", event.target.value)} /></label>
            <label>Default GST %<input type="number" min={0} max={100} value={draft.billing.defaultGstPercent} onChange={(event) => setField("billing", "defaultGstPercent", Number(event.target.value))} /></label>
            <label>Invoice prefix<input value={draft.billing.invoicePrefix} onChange={(event) => setField("billing", "invoicePrefix", event.target.value)} /></label>
            <label>Receipt prefix<input value={draft.billing.receiptPrefix} onChange={(event) => setField("billing", "receiptPrefix", event.target.value)} /></label>
            <label>Gate pass prefix<input value={draft.billing.gatePassPrefix} onChange={(event) => setField("billing", "gatePassPrefix", event.target.value)} /></label>
          </div>
          <fieldset className="assignment-fieldset"><legend>Accepted payment modes</legend>{PAYMENT_MODE_OPTIONS.map((mode) => <label key={mode}><input type="checkbox" checked={draft.billing.paymentModes.includes(mode)} onChange={() => toggleListValue("billing", "paymentModes", mode)} />{mode}</label>)}</fieldset>
        </>
      )}
      {subTab === "inventory" && (
        <div className="form-grid">
          <label>Default unit<input value={draft.inventory.defaultUnit} onChange={(event) => setField("inventory", "defaultUnit", event.target.value)} /></label>
          <label><input type="checkbox" checked={draft.inventory.lowStockNotifications} onChange={(event) => setField("inventory", "lowStockNotifications", event.target.checked)} /> Low-stock notifications</label>
          <label><input type="checkbox" checked={draft.inventory.requireAdjustmentReason} onChange={(event) => setField("inventory", "requireAdjustmentReason", event.target.checked)} /> Require a reason for stock adjustments</label>
        </div>
      )}
      {subTab === "notifications" && (
        <>
          <fieldset className="assignment-fieldset"><legend>Customer update channels</legend>{NOTIFICATION_CHANNEL_OPTIONS.map((channel) => <label key={channel}><input type="checkbox" checked={draft.notifications.customerChannels.includes(channel)} onChange={() => toggleListValue("notifications", "customerChannels", channel)} />{channel}</label>)}</fieldset>
          <div className="form-grid">
            <label>Document header<input value={draft.notifications.documentHeader} onChange={(event) => setField("notifications", "documentHeader", event.target.value)} /></label>
            <label>Estimate template<input value={draft.notifications.estimateTemplate} onChange={(event) => setField("notifications", "estimateTemplate", event.target.value)} /></label>
            <label>Invoice template<input value={draft.notifications.invoiceTemplate} onChange={(event) => setField("notifications", "invoiceTemplate", event.target.value)} /></label>
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- Company identity ---- */

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_COMPANY_IMAGE_BYTES = 1024 * 1024;

function CompanyImageField({ label, value, onChange, onError }: { label: string; value: string | null; onChange: (value: string | null) => void; onError: (message: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const choose = (file?: File) => {
    if (!file) return;
    if (!IMAGE_TYPES.has(file.type)) { onError(`${label} must be a PNG, JPEG, or WebP image.`); if (inputRef.current) inputRef.current.value = ""; return; }
    if (file.size > MAX_COMPANY_IMAGE_BYTES) { onError(`${label} must be 1 MB or smaller.`); if (inputRef.current) inputRef.current.value = ""; return; }
    const reader = new FileReader();
    reader.onerror = () => onError(`${label} could not be read.`);
    reader.onload = () => { if (typeof reader.result === "string") { onError(""); onChange(reader.result); } };
    reader.readAsDataURL(file);
  };
  return <div className="company-image-field"><strong>{label}</strong><div className="company-image-preview">{value ? <img src={value} alt={`${label} preview`} /> : <span>No image configured</span>}</div><div className="action-row"><label className="file-upload-button">Choose image<input ref={inputRef} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => choose(event.target.files?.[0])} /></label><button type="button" disabled={!value} onClick={() => { onError(""); onChange(null); if (inputRef.current) inputRef.current.value = ""; }}>Clear</button></div><small>PNG, JPEG, or WebP · maximum 1 MB</small></div>;
}

function CompanySettingsTab({ adminState, commit, actingUser }: { adminState: AdminDemoState; commit: (mutator: (s: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => boolean; actingUser: User }) {
  const saved = { companyName: adminState.businessSettings.profile.businessName, assets: adminState.companyAssets };
  const [companyName, setCompanyName] = useState(saved.companyName);
  const [assets, setAssets] = useState<CompanyAssets>(saved.assets);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);
  const dirty = companyName !== saved.companyName || JSON.stringify(assets) !== JSON.stringify(saved.assets);

  useEffect(() => { setCompanyName(saved.companyName); setAssets(saved.assets); }, [saved.companyName, saved.assets]);
  const changeAsset = (key: keyof CompanyAssets, next: string | null) => { setSavedMessage(false); setAssets((current) => ({ ...current, [key]: next })); };
  const save = () => {
    if (!companyName.trim()) { setError("Company name is required."); return; }
    const ok = commit((current) => saveCompanyIdentity(current, companyName, assets), { stream: "feature", level: "info", area: "Administration", feature: "Company Settings", message: "Company identity and report assets saved", userId: String(actingUser.id), userName: actingUser.name });
    if (ok) { setError(""); setSavedMessage(true); }
  };
  const reset = () => {
    if (dirty && !window.confirm("Reset unsaved company settings?")) return;
    setCompanyName(saved.companyName); setAssets(saved.assets); setError(""); setSavedMessage(false);
  };
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><div><h3>Build Company Settings</h3><p>Canonical identity and images used by report templates.</p></div><div className="action-row"><button type="button" disabled={!dirty} onClick={reset}>Reset to Saved</button><button type="button" className="primary-action" disabled={!dirty} onClick={save}>Save Company Settings</button></div></div>
    {error && <div className="api-error" role="alert"><p>{error}</p></div>}
    {savedMessage && !dirty && <p className="save-confirmation">Company settings saved for this session.</p>}
    {dirty && <p className="unsaved-note">Unsaved changes.</p>}
    <label>Company name<input value={companyName} onChange={(event) => { setCompanyName(event.target.value); setSavedMessage(false); }} /></label>
    <div className="company-assets-grid">
      <CompanyImageField label="Company logo" value={assets.logo} onChange={(next) => changeAsset("logo", next)} onError={setError} />
      <CompanyImageField label="Company stamp" value={assets.stamp} onChange={(next) => changeAsset("stamp", next)} onError={setError} />
      <CompanyImageField label="Authorized signature" value={assets.authorizedSignature} onChange={(next) => changeAsset("authorizedSignature", next)} onError={setError} />
    </div>
  </div>;
}

/* ------------------------------------------------------------ Report templates ---- */

const REPORT_CATEGORIES = Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[];

function ReportTemplatesTab({ adminState, commit, actingUser, onDirtyChange }: { adminState: AdminDemoState; commit: (mutator: (s: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => boolean; actingUser: User; onDirtyChange: (dirty: boolean) => void }) {
  const [category, setCategory] = useState<ReportCategory>("invoice");
  const categoryTemplates = adminState.reportTemplates.filter((template) => template.category === category);
  const initial = categoryTemplates.find((template) => template.active) ?? categoryTemplates[0];
  const [selectedId, setSelectedId] = useState<string | null>(initial?.id ?? null);
  const selected = adminState.reportTemplates.find((template) => template.id === selectedId);
  const [draft, setDraft] = useState({ name: initial?.name ?? "", html: initial?.html ?? "", active: initial?.active ?? false });
  const [mode, setMode] = useState<"type" | "preview">("type");
  const [errors, setErrors] = useState<string[]>([]);
  const [justSaved, setJustSaved] = useState(false);
  const dirty = selected ? draft.name !== selected.name || draft.html !== selected.html || draft.active !== selected.active : Boolean(draft.name || draft.html || draft.active);
  const unsupported = findUnsupportedPlaceholders(draft.html, category);

  useEffect(() => { onDirtyChange(dirty); return () => onDirtyChange(false); }, [dirty, onDirtyChange]);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", guard); return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);

  const load = (id: string | null, nextCategory = category) => {
    const template = id ? adminState.reportTemplates.find((item) => item.id === id) : undefined;
    setSelectedId(id); setDraft({ name: template?.name ?? "", html: template?.html ?? "", active: template?.active ?? false });
    setErrors([]); setJustSaved(false); setMode("type"); setCategory(nextCategory);
  };
  const confirmDiscard = () => !dirty || window.confirm("Discard unsaved template changes?");
  const changeCategory = (next: ReportCategory) => {
    if (!confirmDiscard()) return;
    const templates = adminState.reportTemplates.filter((item) => item.category === next);
    const template = templates.find((item) => item.active) ?? templates[0];
    setCategory(next); load(template?.id ?? null, next);
  };
  const save = () => {
    const validation: string[] = [];
    if (!draft.name.trim()) validation.push("Template name is required.");
    if (!draft.html.trim()) validation.push("Template HTML is required.");
    if (unsupported.length) validation.push(`Unsupported placeholders: ${unsupported.join(", ")}`);
    if (validation.length) { setErrors(validation); return; }
    let nextId = selectedId;
    const ok = commit((current) => {
      const next = selectedId
        ? updateReportTemplate(current, selectedId, draft)
        : createReportTemplate(current, { category, ...draft });
      if (!selectedId) nextId = next.reportTemplates.at(-1)?.id ?? null;
      return next;
    }, { stream: "feature", level: "info", area: "Administration", feature: "Report Templates", message: `${REPORT_CATEGORY_LABELS[category]} template ${selectedId ? "updated" : "created"}`, userId: String(actingUser.id), userName: actingUser.name });
    if (ok) { setSelectedId(nextId); setErrors([]); setJustSaved(true); }
  };
  let preview = "";
  if (!unsupported.length && draft.html.trim()) {
    try { preview = renderReportTemplate({ category, html: draft.html }, sampleReportValues(category)); } catch { preview = ""; }
  }
  return <div className="manager-panel report-template-panel" role="tabpanel">
    <div className="panel-actions"><div><h3>Report Templates</h3><p>Design sanitized print layouts using the supported placeholders.</p></div><div className="action-row"><button type="button" onClick={() => { if (confirmDiscard()) load(null); }}>New Template</button><button type="button" className="primary-action" disabled={!dirty} onClick={save}>{selectedId ? "Update Template" : "Create Template"}</button></div></div>
    {errors.length > 0 && <div className="api-error" role="alert">{errors.map((message) => <p key={message}>{message}</p>)}</div>}
    {justSaved && !dirty && <p className="save-confirmation">Template saved for this session.</p>}
    {dirty && <p className="unsaved-note">Unsaved changes.</p>}
    <div className="template-selectors form-grid">
      <label>Report category<select aria-label="Report category" value={category} onChange={(event) => changeCategory(event.target.value as ReportCategory)}>{REPORT_CATEGORIES.map((item) => <option key={item} value={item}>{REPORT_CATEGORY_LABELS[item]}</option>)}</select></label>
      <label>Template<select aria-label="Report template" value={selectedId ?? ""} onChange={(event) => { if (confirmDiscard()) load(event.target.value || null); }}><option value="">New unsaved template</option>{categoryTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}{template.active ? " (Active)" : ""}</option>)}</select></label>
      <label>Template name<input aria-label="Template name" value={draft.name} onChange={(event) => { setDraft({ ...draft, name: event.target.value }); setJustSaved(false); }} /></label>
      <label className="template-active"><input type="checkbox" checked={draft.active} onChange={(event) => { if (draft.active && !event.target.checked) { setErrors(["Activate another template before deactivating the current template."]); return; } setDraft({ ...draft, active: event.target.checked }); setErrors([]); setJustSaved(false); }} /> Active template</label>
    </div>
    <div className="template-workspace">
      <div className="template-editor-column">
        <div className="sub-tabs" role="tablist" aria-label="Template editor mode"><button role="tab" aria-selected={mode === "type"} className={mode === "type" ? "active" : ""} onClick={() => setMode("type")}>Type</button><button role="tab" aria-selected={mode === "preview"} className={mode === "preview" ? "active" : ""} onClick={() => setMode("preview")}>Preview</button></div>
        {mode === "type" ? <label>Template HTML<textarea aria-label="Template HTML" className="template-html-editor" spellCheck={false} value={draft.html} onChange={(event) => { setDraft({ ...draft, html: event.target.value }); setJustSaved(false); }} /></label> : unsupported.length ? <div className="api-error" role="alert"><p>Preview unavailable until unsupported placeholders are removed.</p></div> : <iframe className="template-preview" title={`${REPORT_CATEGORY_LABELS[category]} template preview`} sandbox="" srcDoc={`<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}*{box-sizing:border-box}</style></head><body>${preview}</body></html>`} />}
      </div>
      <aside className="placeholder-registry"><h4>Allowed placeholders</h4><p>Insert a placeholder exactly as shown. Blocks generate safe report tables or configured images.</p>{REPORT_PLACEHOLDERS[category].map((name) => <code key={name}>{`{{${name}}}`}</code>)}{unsupported.length > 0 && <div className="api-error" role="alert"><strong>Unsupported</strong>{unsupported.map((name) => <p key={name}>{name}</p>)}</div>}</aside>
    </div>
  </div>;
}

/* --------------------------------------------------------------------------- Inventory Import */

type WizardStep = 1 | 2 | 3 | 4;

function downloadTemplate() {
  const buffer = buildInventoryTemplateBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "workshopos-inventory-import-template.xlsx";
  link.click();
  URL.revokeObjectURL(url);
}

function InventoryImportTab({ adminState, commit, actingUser, state }: { adminState: AdminDemoState; commit: (mutator: (s: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => void; actingUser: User; state: WorkshopState }) {
  const [step, setStep] = useState<WizardStep>(1);
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedInventoryWorkbook>();
  const [mapping, setMapping] = useState<InventoryColumnMapping>({});
  const [preview, setPreview] = useState<InventoryImportPreview>();
  const [uploadError, setUploadError] = useState("");
  const [result, setResult] = useState<{ accepted: number; rejected: number; total: number; batchId: string }>();

  const existingInventory = useMemo(() => [
    ...state.inventory.map((item) => ({ id: item.id, sku: item.sku })),
    ...adminState.sessionInventory.map((item, index) => ({ id: -1_000_000 - index, sku: item.sku })),
  ], [state.inventory, adminState.sessionInventory]);

  const resetWizard = () => { setStep(1); setFileName(""); setParsed(undefined); setMapping({}); setPreview(undefined); setUploadError(""); setResult(undefined); };

  const onFileChosen = async (file: File) => {
    setUploadError("");
    try {
      const buffer = await file.arrayBuffer();
      const workbook = parseInventoryWorkbook(buffer);
      setFileName(file.name);
      setParsed(workbook);
      setMapping(suggestInventoryColumnMapping(workbook.headers));
      setStep(2);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not read this file.");
    }
  };

  const runValidation = () => {
    if (!parsed) return;
    const nextPreview = buildInventoryImportPreview({ headers: parsed.headers, rows: parsed.rows, mapping, existingInventory });
    setPreview(nextPreview);
    setStep(3);
  };

  const confirmImport = () => {
    if (!preview || preview.validRows.length === 0) return;
    const validRows = preview.validRows.map((row) => ({ sku: row.item.sku, name: row.item.name, category: row.item.category, unit: row.item.unit, stockQty: row.item.stock_qty, lowStockQty: row.item.low_stock_qty }));
    let batchId = "";
    commit((current) => {
      const before = current.importBatches.length;
      const next = confirmInventoryImport(current, { fileName, columnMapping: mapping as Record<string, string>, totalRows: preview.totalRows, validRows, rejectedRows: preview.rejectedRows.length });
      batchId = next.importBatches[before]?.id ?? "";
      return next;
    }, {
      stream: "feature", level: "info", area: "Inventory", feature: "Inventory Import",
      message: `Imported ${validRows.length} of ${preview.totalRows} rows from "${fileName}"`, userId: String(actingUser.id), userName: actingUser.name,
    });
    setResult({ accepted: validRows.length, rejected: preview.rejectedRows.length, total: preview.totalRows, batchId });
    setStep(4);
  };

  const rejectedColumns: ExportColumn<RejectedInventoryImportRow>[] = [
    { header: "Row", value: (row) => row.sourceRowNumber },
    { header: "SKU", value: (row) => row.normalized.sku ?? "" },
    { header: "Name", value: (row) => row.normalized.name ?? "" },
    { header: "Issues", value: (row) => row.issues.map((issue) => issue.message).join("; ") },
  ];

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Inventory Import</h3>
        <span>Step {step} of 4 · session-only, never touches the persisted inventory</span>
      </div>
      <div className="wizard-steps">
        {["Upload", "Map Columns", "Validate & Preview", "Confirm"].map((label, index) => (
          <span key={label} className={`wizard-step${step === index + 1 ? " active" : ""}${step > index + 1 ? " done" : ""}`}>{index + 1}. {label}</span>
        ))}
      </div>

      {step === 1 && (
        <div className="desk-panel">
          <p>Upload a CSV or XLSX file with your opening inventory, or start from the WorkshopOS template.</p>
          <div className="action-row">
            <label className="primary-action file-upload-button">
              Choose File
              <input type="file" accept=".csv,.xlsx,.xls" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onFileChosen(file); event.target.value = ""; }} hidden />
            </label>
            <button onClick={downloadTemplate}>Download Template</button>
          </div>
          {uploadError && <p className="error-text">{uploadError}</p>}
        </div>
      )}

      {step === 2 && parsed && (
        <div className="desk-panel">
          <p>Mapped from <strong>{fileName}</strong> ({parsed.rows.length} rows). Adjust any column below.</p>
          <div className="form-grid">
            {INVENTORY_IMPORT_FIELDS.map((field: InventoryImportField) => (
              <label key={field}>{INVENTORY_TEMPLATE_HEADERS[field]}
                <select value={mapping[field] ?? ""} onChange={(event) => setMapping((prev) => ({ ...prev, [field]: event.target.value || undefined }))}>
                  <option value="">Not mapped</option>
                  {parsed.headers.map((header) => <option key={header} value={header}>{header}</option>)}
                </select>
              </label>
            ))}
          </div>
          <div className="action-row"><button onClick={() => setStep(1)}>Back</button><button className="primary-action" onClick={runValidation}>Validate &amp; Preview</button></div>
        </div>
      )}

      {step === 3 && preview && (
        <div className="desk-panel">
          {preview.mappingIssues.length > 0 ? (
            <>
              <p className="error-text">Fix the column mapping before continuing:</p>
              <ul>{preview.mappingIssues.map((issue) => <li key={`${issue.field}-${issue.code}`}>{issue.message}</li>)}</ul>
              <button onClick={() => setStep(2)}>Back to Mapping</button>
            </>
          ) : (
            <>
              <div className="linked-grid">
                <Info label="Total rows" value={preview.totalRows} />
                <Info label="Valid rows" value={preview.validRows.length} />
                <Info label="Rejected rows" value={preview.rejectedRows.length} />
              </div>
              <h4>Valid rows (first 10)</h4>
              <div className="table-wrap"><table><thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Unit</th><th>Opening Qty</th><th>Low-stock</th></tr></thead>
                <tbody>{preview.validRows.slice(0, 10).map((row) => <tr key={row.sourceRowNumber}><td>{row.item.sku}</td><td>{row.item.name}</td><td>{row.item.category}</td><td>{row.item.unit}</td><td>{row.item.stock_qty}</td><td>{row.item.low_stock_qty}</td></tr>)}</tbody>
              </table></div>
              {preview.rejectedRows.length > 0 && (
                <>
                  <div className="panel-actions"><h4>Rejected rows</h4><DownloadMenu report={{ title: "Rejected Inventory Import Rows", filters: [`File: ${fileName}`], columns: rejectedColumns, rows: preview.rejectedRows }} /></div>
                  <div className="table-wrap"><table><thead><tr><th>Row</th><th>SKU</th><th>Name</th><th>Issues</th></tr></thead>
                    <tbody>{preview.rejectedRows.slice(0, 20).map((row) => <tr key={row.sourceRowNumber}><td>{row.sourceRowNumber}</td><td>{row.normalized.sku}</td><td>{row.normalized.name}</td><td>{row.issues.map((issue) => issue.message).join("; ")}</td></tr>)}</tbody>
                  </table></div>
                </>
              )}
              <div className="action-row"><button onClick={() => setStep(2)}>Back</button><button className="primary-action" disabled={preview.validRows.length === 0} onClick={confirmImport}>Confirm Import</button></div>
            </>
          )}
        </div>
      )}

      {step === 4 && result && (
        <div className="desk-panel">
          <PanelTitle icon={<FileSpreadsheet />} title="Import complete" subtitle={`Batch ${result.batchId}`} />
          <div className="linked-grid">
            <Info label="Total rows" value={result.total} />
            <Info label="Imported" value={result.accepted} />
            <Info label="Rejected" value={result.rejected} />
          </div>
          <p>Imported rows are merged into Stock presentation data for this session only.</p>
          <button className="primary-action" onClick={resetWizard}>Start New Import</button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------------- Support & Logs */

const SUPPORT_SUB_TABS = ["Daily Operational Logs", "Feature Activity", "Retention Settings"] as const;
type SupportSubTab = (typeof SUPPORT_SUB_TABS)[number];
const LOG_LEVELS = ["info", "warning", "error"] as const;

function LogTable({ logs, onSelect }: { logs: DemoLogEntry[]; onSelect: (log: DemoLogEntry) => void }) {
  if (logs.length === 0) return <div className="list-empty"><h3>No matching log entries</h3></div>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Timestamp</th><th>Level</th><th>Area</th><th>Feature</th><th>Message</th><th>User</th><th>Reference</th></tr></thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="clickable-row" onClick={() => onSelect(log)}>
              <td>{new Date(log.timestamp).toLocaleString("en-IN")}</td>
              <td><span className={`status ${log.level}`}>{log.level}</span></td>
              <td>{log.area}</td>
              <td>{log.feature}</td>
              <td>{log.message}</td>
              <td>{log.userName ?? "Unavailable"}</td>
              <td>{log.referenceId ?? "Unavailable"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogsPanel({ adminState, stream, commit }: { adminState: AdminDemoState; stream: DemoLogStream; commit: (mutator: (s: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => void }) {
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateFromDraft, setDateFromDraft] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateToDraft, setDateToDraft] = useState("");
  const [level, setLevel] = useState("ALL");
  const [levelDraft, setLevelDraft] = useState("ALL");
  const [area, setArea] = useState("ALL");
  const [areaDraft, setAreaDraft] = useState("ALL");
  const [selected, setSelected] = useState<DemoLogEntry>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const streamLogs = adminState.logs.filter((log) => log.stream === stream);
  const areas = Array.from(new Set(streamLogs.map((log) => log.area))).sort();
  const filtered = filterDemoLogs(streamLogs, {
    stream, search, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined,
    levels: level === "ALL" ? undefined : [level as (typeof LOG_LEVELS)[number]],
    area: area === "ALL" ? undefined : area,
  });
  const paged = paginate(filtered, page, pageSize);
  const applyFilters = () => { setSearch(searchDraft); setDateFrom(dateFromDraft); setDateTo(dateToDraft); setLevel(levelDraft); setArea(areaDraft); setPage(1); };
  const clearFilters = () => { setSearchDraft(""); setSearch(""); setDateFromDraft(""); setDateFrom(""); setDateToDraft(""); setDateTo(""); setLevelDraft("ALL"); setLevel("ALL"); setAreaDraft("ALL"); setArea("ALL"); setPage(1); };
  const columns: ExportColumn<DemoLogEntry>[] = [
    { header: "Timestamp", value: (row) => new Date(row.timestamp).toLocaleString("en-IN") },
    { header: "Level", value: (row) => row.level }, { header: "Area", value: (row) => row.area }, { header: "Feature", value: (row) => row.feature },
    { header: "Message", value: (row) => row.message }, { header: "User", value: (row) => row.userName ?? "Unavailable" }, { header: "Reference", value: (row) => row.referenceId ?? "Unavailable" },
  ];
  const clear = () => {
    if (!window.confirm(`Clear all ${stream} logs for this session? This cannot be undone.`)) return;
    commit((current) => clearDemoLogs(current, stream));
  };

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applyFilters(); } }}>
        <label className="list-search">Search<input aria-label="Search logs" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Message, area, feature, user or reference" /></label>
        <label>Date from<input type="date" value={dateFromDraft} onChange={(event) => setDateFromDraft(event.target.value)} /></label>
        <label>Date to<input type="date" value={dateToDraft} onChange={(event) => setDateToDraft(event.target.value)} /></label>
        <label>Level<select value={levelDraft} onChange={(event) => setLevelDraft(event.target.value)}><option value="ALL">All levels</option>{LOG_LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>Area<select value={areaDraft} onChange={(event) => setAreaDraft(event.target.value)}><option value="ALL">All areas</option>{areas.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <ListSearchActions onClear={clearFilters} onSearch={applyFilters} />
      </div>
      <div className="list-result-controls">
        <DownloadMenu report={{ title: stream === "operational" ? "Daily Operational Logs" : "Feature Activity", filters: activeFilterSummary({ Search: search.trim(), Level: level, Area: area, "Date from": dateFrom, "Date to": dateTo }), columns, rows: filtered }} />
        <span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span>
        <PageSizeSelect ariaLabel="Log records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} />
        <button className="danger-action" onClick={clear} disabled={streamLogs.length === 0}>Clear Logs</button>
      </div>
      <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
      <LogTable logs={paged.items} onSelect={setSelected} />
      <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
      {selected && (
        <Dialog title="Log detail" subtitle={new Date(selected.timestamp).toLocaleString("en-IN")} onClose={() => setSelected(undefined)}>
          <div className="linked-grid">
            <Info label="Level" value={selected.level} />
            <Info label="Area" value={selected.area} />
            <Info label="Feature" value={selected.feature} />
            <Info label="User" value={selected.userName ?? "Unavailable"} />
            <Info label="Reference" value={selected.referenceId ?? "Unavailable"} />
          </div>
          <p>{selected.message}</p>
          {selected.details && <pre className="log-details">{JSON.stringify(selected.details, null, 2)}</pre>}
        </Dialog>
      )}
    </div>
  );
}

function RetentionSettingsPanel({ adminState, commit, actingUser }: { adminState: AdminDemoState; commit: (mutator: (s: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => void; actingUser: User }) {
  const [operationalDays, setOperationalDays] = useState(adminState.businessSettings.logRetention.operationalDays);
  const [featureDays, setFeatureDays] = useState(adminState.businessSettings.logRetention.featureDays);
  useEffect(() => { setOperationalDays(adminState.businessSettings.logRetention.operationalDays); setFeatureDays(adminState.businessSettings.logRetention.featureDays); }, [adminState.businessSettings.logRetention]);
  const dirty = operationalDays !== adminState.businessSettings.logRetention.operationalDays || featureDays !== adminState.businessSettings.logRetention.featureDays;

  return (
    <div className="manager-panel" role="tabpanel">
      <p>This is demo operational visibility, not a production observability or compliance audit trail.</p>
      <div className="form-grid">
        <label>Operational / error log retention (days)<input type="number" min={1} value={operationalDays} onChange={(event) => setOperationalDays(Number(event.target.value))} /></label>
        <label>Feature activity retention (days)<input type="number" min={1} value={featureDays} onChange={(event) => setFeatureDays(Number(event.target.value))} /></label>
      </div>
      <div className="action-row">
        <button disabled={!dirty} onClick={() => { setOperationalDays(adminState.businessSettings.logRetention.operationalDays); setFeatureDays(adminState.businessSettings.logRetention.featureDays); }}>Reset to Saved</button>
        <button className="primary-action" disabled={!dirty || operationalDays < 1 || featureDays < 1} onClick={() => commit((current) => updateBusinessSettings(current, { logRetention: { operationalDays, featureDays } }), {
          stream: "feature", level: "info", area: "Administration", feature: "Support & Logs", message: "Log retention settings updated", userId: String(actingUser.id), userName: actingUser.name,
        })}>Save Retention Settings</button>
      </div>
    </div>
  );
}

function SupportLogsTab({ adminState, commit, refresh, actingUser }: { adminState: AdminDemoState; commit: (mutator: (s: AdminDemoState) => AdminDemoState, entry?: LogEntryInput) => void; refresh: () => void; actingUser: User }) {
  const [subTab, setSubTab] = useState<SupportSubTab>("Daily Operational Logs");
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Support &amp; Logs</h3>
        <button onClick={refresh}>Refresh</button>
      </div>
      <div className="sub-tabs" role="tablist" aria-label="Support and logs sections">
        {SUPPORT_SUB_TABS.map((item) => <button key={item} role="tab" aria-selected={subTab === item} className={subTab === item ? "active" : ""} onClick={() => setSubTab(item)}>{item}</button>)}
      </div>
      {subTab === "Daily Operational Logs" && <LogsPanel adminState={adminState} stream="operational" commit={commit} />}
      {subTab === "Feature Activity" && <LogsPanel adminState={adminState} stream="feature" commit={commit} />}
      {subTab === "Retention Settings" && <RetentionSettingsPanel adminState={adminState} commit={commit} actingUser={actingUser} />}
    </div>
  );
}
