import {
  Banknote,
  Boxes,
  Camera,
  Car,
  Check,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  DoorOpen,
  Download,
  FileText,
  Gauge,
  LogOut,
  Package,
  PackageCheck,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import type { Database } from "sql.js";
import { useDeferredValue, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  addFollowup,
  adjustStock,
  approveEstimate,
  archiveUser,
  archiveCustomer,
  archiveEstimateItem,
  archiveFollowup,
  archiveInventoryItem,
  archiveMaterialRequest,
  archiveJobPhotoForActor,
  archiveJobCardForActor,
  archiveTask,
  archiveVehicle,
  cancelJobCard,
  cancelJobCardStatus,
  closureBlockers,
  createCustomer,
  createEstimate,
  createEstimateItem,
  createFollowup,
  createInventoryItem,
  createMaterialRequest,
  createTask,
  createUser,
  createVehicle,
  failQcWithRework,
  issueMaterial,
  issueMaterialQty,
  invoiceItemsTotal,
  login,
  loadLargeDemoDataset,
  MAIN_STATUS_TRANSITIONS,
  canTransitionJobStatus,
  isTerminalMainStatus,
  markWashingNeeded,
  markFollowupDone,
  openWorkshopDb,
  passQc,
  paymentStatus,
  persist,
  readState,
  receiveVehicle,
  reconcileMaterial,
  reconcileMaterialQty,
  canMutateJobLifecycle,
  saveEstimateForActor,
  saveJobPhotoForActor,
  setChecklistItemCheckedForActor,
  setChecklistItemNotApplicableForActor,
  transitionJobStatusForActor,
  searchJobs,
  stockIn,
  updateCustomer,
  updateEstimate,
  updateEstimateItem,
  updateFollowup,
  updateInventoryItem,
  updateJobCard,
  updateJobCardForActor,
  updateMaterialRequest,
  updateJobPhotoForActor,
  updateQcCheck,
  updateTask,
  updateUser,
  updateVisit,
  updateVehicle,
} from "./db";
import type { ChecklistItem, Customer, EstimateItem, Followup, InventoryItem, JobView, MainStatus, MaterialMovement, MaterialRequest, Photo, QcCheck, Role, SearchCriteria, SubStatus, Task, TaskStatus, User, Vehicle, ViewMode, WorkshopState } from "./types";
import { activeFilterSummary, applyFilterDraft, clearFilterDraft, DEFAULT_PAGE_SIZE, normalizeSearch, pageNumbers, paginate, type FilterDraftState } from "./list-utils";
import type { ExportColumn } from "./export-utils";
import { beginCognitoLogin, endCognitoSession, loadAuthConfig, loadWorkshopSession, type AuthConfig, type CognitoConfig } from "./auth";
import { adminUsersApi, AdminApiError, type AdminDirectory, type AdminUser } from "./admin-users-api";
import { Dialog, DownloadMenu, handleTabListKeyDown, ListSearchActions, PageSizeSelect } from "./ui-kit";
import { AdminConsole } from "./admin-console";
import { loadAdminDemoState, PAGE_KEY_BY_MENU_LABEL, resolvePermittedPages, type AdminPageKey } from "./admin-demo-state";
import { downloadJobDocument, printJobDocument, resolveJobDocumentActions, resolveJobDocuments, type DocumentKind } from "./job-documents";
import { buildDataFlowTimeline, dataFlowDates, dataFlowMonths, filterDataFlowJobs, summarizeJobLifecycle } from "./data-flow";
import { BillingManager, InvoiceDialog, type BillingMode } from "./billing-manager";
import { compressMediaFile, type JobMediaCategory, type PreparedJobMedia } from "./job-media";

export const roleLabels: Record<Role, string> = {
  admin: "Owner/Admin",
  service: "Service Advisor",
  reception: "Reception",
  accounts: "Accounts",
  store: "Store",
  tech: "Technician",
};

const appTagline = "Workshop Management. Simplified.";

type MenuItem = {
  label: string;
  icon: React.ReactNode;
};

const roleMenus: Record<Role, MenuItem[]> = {
  reception: [
    { label: "Receive Vehicle", icon: <DoorOpen size={18} /> },
    { label: "Today Queue", icon: <Car size={18} /> },
    { label: "Customers", icon: <UserRound size={18} /> },
    { label: "Vehicles", icon: <Car size={18} /> },
    { label: "Search", icon: <Search size={18} /> },
  ],
  service: [
    { label: "My Queue", icon: <ClipboardList size={18} /> },
    { label: "Job Card", icon: <FileText size={18} /> },
    { label: "Estimate", icon: <ReceiptText size={18} /> },
    { label: "Follow-ups", icon: <ClipboardCheck size={18} /> },
    { label: "Media", icon: <Camera size={18} /> },
    { label: "Search", icon: <Search size={18} /> },
  ],
  store: [
    { label: "Material Requests", icon: <PackageCheck size={18} /> },
    { label: "Issue Material", icon: <Package size={18} /> },
    { label: "Reconcile", icon: <Check size={18} /> },
    { label: "Stock", icon: <Boxes size={18} /> },
    { label: "Search", icon: <Search size={18} /> },
  ],
  tech: [
    { label: "My Tasks", icon: <Wrench size={18} /> },
    { label: "Work Update", icon: <ClipboardCheck size={18} /> },
    { label: "QC Prep", icon: <ShieldCheck size={18} /> },
    { label: "Search", icon: <Search size={18} /> },
  ],
  accounts: [
    { label: "Ready To Invoice", icon: <ClipboardList size={18} /> },
    { label: "Invoice", icon: <ReceiptText size={18} /> },
    { label: "Payment", icon: <Banknote size={18} /> },
    { label: "Delivery", icon: <DoorOpen size={18} /> },
    { label: "Search", icon: <Search size={18} /> },
  ],
  admin: [
    { label: "Dashboard", icon: <Gauge size={18} /> },
    { label: "Data Flow", icon: <ClipboardCheck size={18} /> },
    { label: "Job Cards", icon: <FileText size={18} /> },
    { label: "Customers", icon: <UserRound size={18} /> },
    { label: "Vehicles", icon: <Car size={18} /> },
    { label: "Media", icon: <Camera size={18} /> },
    { label: "Masters", icon: <Boxes size={18} /> },
    { label: "Manage", icon: <ShieldCheck size={18} /> },
    { label: "Search", icon: <Search size={18} /> },
    { label: "Admin Console", icon: <Settings size={18} /> },
  ],
};

const demoLogins = [
  "admin@example.com",
  "service@example.com",
  "reception@example.com",
  "accounts@example.com",
  "store@example.com",
  "tech@example.com",
];

export type SearchTableCategory = "job" | "customer" | "vehicle" | "invoice";

const CATEGORY_PAGE_KEYS: Record<SearchTableCategory, AdminPageKey[]> = {
  job: ["jobs", "my-queue", "today-queue", "material-requests", "my-tasks", "ready-to-invoice"],
  customer: ["customers"],
  vehicle: ["vehicles"],
  invoice: ["jobs", "my-queue", "invoice"],
};

const SEARCH_CATEGORY_LABELS: Record<SearchTableCategory, string> = {
  job: "Job",
  customer: "Customer",
  vehicle: "Vehicle",
  invoice: "Invoice",
};

function findMenuLabelForPage(role: Role, key: AdminPageKey): string | undefined {
  return roleMenus[role].find((item) => PAGE_KEY_BY_MENU_LABEL[item.label] === key)?.label;
}

function workshopRole(names: string[]): Role {
  const value = names.join(" ").toLowerCase();
  if (value.includes("admin") || value.includes("owner")) return "admin";
  if (value.includes("reception")) return "reception";
  if (value.includes("technician")) return "tech";
  if (value.includes("store")) return "store";
  if (value.includes("accounts") || value.includes("cashier")) return "accounts";
  return "service";
}

const apiErrors: Record<string, string> = {
  EMAIL_EXISTS: "That email already belongs to a WorkshopOS account.",
  ROLE_NOT_FOUND: "One of the selected roles is no longer available.",
  BRANCH_FORBIDDEN: "You cannot assign one of the selected branches.",
  FINAL_ADMIN_REQUIRED: "The final active Admin must remain assigned.",
  SELF_ARCHIVE_FORBIDDEN: "You cannot archive your own signed-in account.",
  QUOTA_EXCEEDED: "This business has reached its user quota.",
  VERSION_CONFLICT: "This user changed elsewhere. The latest details have been loaded.",
  IDENTITY_PROVIDER_ERROR: "Cognito could not complete the request. Try again.",
  MEMBERSHIP_REQUIRED: "Your account does not have an active WorkshopOS membership.",
};

function apiErrorMessage(error: unknown) {
  const code = error instanceof AdminApiError ? error.code : error instanceof Error ? error.message : "API_FAILED";
  return apiErrors[code] ?? "WorkshopOS could not complete the request. Try again.";
}

function App() {
  const [db, setDb] = useState<Database>();
  const [state, setState] = useState<WorkshopState>();
  const [user, setUser] = useState<User>();
  const [selectedJobId, setSelectedJobId] = useState<number>();
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [railToggleTop, setRailToggleTop] = useState(118);
  const railToggleDragging = useRef(false);
  const railToggleMoved = useRef(false);
  const railToggleStartY = useRef(0);
  const [query, setQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<SearchTableCategory | "">("");
  const [searchStatus, setSearchStatus] = useState<SearchCriteria["status"]>("ALL");
  const [searchDateFilter, setSearchDateFilter] = useState("");
  const [searchMonthFilter, setSearchMonthFilter] = useState("");
  const [searchNavigate, setSearchNavigate] = useState<{ kind: "jobs" | "customers" | "vehicles"; id: number }>();
  const [loginError, setLoginError] = useState("");
  const [authConfig, setAuthConfig] = useState<AuthConfig>();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    openWorkshopDb().then((database) => {
      setDb(database);
      const next = readState(database);
      setState(next);
      setSelectedJobId(next.jobs[0]?.job.id);
    });
  }, []);

  useEffect(() => {
    loadAuthConfig().then(async (config) => {
      setAuthConfig(config);
      if (config.mode === "cognito") {
        try {
          const session = await loadWorkshopSession(config);
          if (session) {
            const role = workshopRole(session.membership.roles.map((item) => item.name));
            const authenticatedUser: User = {
              id: -1, name: session.membership.displayName, email: session.membership.email,
              role, password: "", externalAuth: true, externalId: session.membership.id,
            };
            setUser(authenticatedUser);
            setActiveMenuItem(roleMenus[role][0].label);
          }
        } catch (error) {
          setLoginError(apiErrorMessage(error));
        }
      }
    }).finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    const moveRailToggle = (clientY: number) => {
      if (Math.abs(clientY - railToggleStartY.current) > 4) railToggleMoved.current = true;
      const nextTop = Math.min(Math.max(clientY - 22, 82), window.innerHeight - 92);
      setRailToggleTop(nextTop);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!railToggleDragging.current) return;
      moveRailToggle(event.clientY);
    };
    const handlePointerUp = () => {
      if (!railToggleDragging.current) return;
      railToggleDragging.current = false;
      if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
    };
    const handleMouseMove = (event: MouseEvent) => {
      if (!railToggleDragging.current) return;
      moveRailToggle(event.clientY);
    };
    const handleMouseUp = () => {
      if (!railToggleDragging.current) return;
      railToggleDragging.current = false;
      if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const searchCriteria = useMemo<SearchCriteria | undefined>(
    () => (searchCategory ? { query, category: searchCategory, status: searchStatus } : undefined),
    [query, searchCategory, searchStatus],
  );
  const searchResults = useMemo(() => (state && searchCriteria ? searchJobs(state, searchCriteria) : []), [state, searchCriteria]);
  const jobs = useMemo(
    () => searchResults
      .map((result) => result.view)
      .filter((view) =>
        (!searchDateFilter || view.visit.received_at.slice(0, 10) === searchDateFilter)
        && (!searchMonthFilter || view.visit.received_at.slice(0, 7) === searchMonthFilter),
      ),
    [searchResults, searchDateFilter, searchMonthFilter],
  );
  const selected = state?.jobs.find((item) => item.job.id === selectedJobId) ?? state?.jobs[0];

  const mutate: Mutate = (action, onError) => {
    if (!db) return false;
    try {
      action(db);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action failed";
      if (onError) onError(message); else window.alert(message);
      return false;
    }
    persist(db);
    const next = readState(db);
    setState(next);
    if (!selectedJobId && next.jobs[0]) setSelectedJobId(next.jobs[0].job.id);
    return true;
  };

  const handleLogin = (email: string, password: string) => {
    if (!state) return;
    const found = login(state, email, password);
    if (!found) {
      setLoginError("Use one of the demo emails with password admin123.");
      return;
    }
    setUser(found);
    setActiveMenuItem(roleMenus[found.role][0].label);
    setLoginError("");
  };

  const handleLogout = () => {
    if (authConfig?.mode === "cognito") {
      endCognitoSession(authConfig);
      return;
    }
    setUser(undefined);
    setActiveMenuItem("");
    setQuery("");
    setSearchCategory("");
    setSearchStatus("ALL");
    setSearchDateFilter("");
    setSearchMonthFilter("");
  };

  const handleRailTogglePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    railToggleDragging.current = true;
    railToggleMoved.current = false;
    railToggleStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleRailTogglePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!railToggleDragging.current) return;
    if (Math.abs(event.clientY - railToggleStartY.current) > 4) railToggleMoved.current = true;
    const nextTop = Math.min(Math.max(event.clientY - 22, 82), window.innerHeight - 92);
    setRailToggleTop(nextTop);
  };

  const handleRailTogglePointerUp = () => {
    if (!railToggleDragging.current) return;
    railToggleDragging.current = false;
    if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
  };

  const handleRailToggleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    railToggleDragging.current = true;
    railToggleMoved.current = false;
    railToggleStartY.current = event.clientY;
  };

  if (!state || authLoading) return <div className="loading">Loading WorkshopOS...</div>;
  if (!user) return <LoginScreen onLogin={handleLogin} onCognitoLogin={() => authConfig?.mode === "cognito" && beginCognitoLogin(authConfig)} config={authConfig} error={loginError} />;

  // Reads the (session-storage backed) Admin Console role/page-access state fresh on every
  // render so a role's permitted pages here reflect the latest Roles & Page Access save made
  // in the Admin Console during this session, without the two stores needing to be merged.
  const permittedPages = resolvePermittedPages(loadAdminDemoState(), user.role);

  const openSearchRecord = (view: JobView, category: SearchTableCategory) => {
    if (category === "customer") {
      const label = findMenuLabelForPage(user.role, "customers");
      if (label) { setSearchNavigate({ kind: "customers", id: view.customer.id }); setActiveMenuItem(label); }
      return;
    }
    if (category === "vehicle") {
      const label = findMenuLabelForPage(user.role, "vehicles");
      if (label) { setSearchNavigate({ kind: "vehicles", id: view.vehicle.id }); setActiveMenuItem(label); }
      return;
    }
    if (category === "job") {
      const label = findMenuLabelForPage(user.role, "jobs") ?? findMenuLabelForPage(user.role, "my-queue");
      if (label) { setSearchNavigate({ kind: "jobs", id: view.job.id }); setActiveMenuItem(label); }
      return;
    }
    // invoice: prefer the role's own dedicated Invoice workflow page (Accounts) when granted;
    // otherwise fall back to the Jobs/My Queue record workspace, which also surfaces invoice status.
    const invoiceLabel = permittedPages.includes("invoice") ? findMenuLabelForPage(user.role, "invoice") : undefined;
    const leaveSearch = () => { setQuery(""); setSearchCategory(""); setSearchStatus("ALL"); setSearchDateFilter(""); setSearchMonthFilter(""); };
    if (invoiceLabel) { setSelectedJobId(view.job.id); leaveSearch(); setActiveMenuItem(invoiceLabel); return; }
    const jobsLabel = findMenuLabelForPage(user.role, "jobs") ?? findMenuLabelForPage(user.role, "my-queue");
    if (jobsLabel) { setSearchNavigate({ kind: "jobs", id: view.job.id }); leaveSearch(); setActiveMenuItem(jobsLabel); }
  };

  return (
    <div className={`app-shell role-${user.role}${sidebarCollapsed ? " rail-collapsed" : ""}`}>
      <aside className="rail">
        <div className="brand">
          <Car size={30} />
          <div>
            <strong>WorkshopOS</strong>
            <span>{appTagline}</span>
          </div>
        </div>
        <button
          className="rail-toggle"
          onPointerDown={handleRailTogglePointerDown}
          onPointerMove={handleRailTogglePointerMove}
          onPointerUp={handleRailTogglePointerUp}
          onMouseDown={handleRailToggleMouseDown}
          aria-label={sidebarCollapsed ? "Show left menu" : "Hide left menu"}
          title={sidebarCollapsed ? "Show left menu" : "Hide left menu"}
          style={{ top: railToggleTop }}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <div className="rail-role">{roleLabels[user.role]}</div>
        <nav className="role-nav" aria-label={`${roleLabels[user.role]} menu`}>
          {roleMenus[user.role].map((item) => (
            <button key={item.label} className={activeMenuItem === item.label ? "active" : ""} onClick={() => {
              if (activeMenuItem === "Search" && item.label !== "Search") {
                setQuery(""); setSearchCategory(""); setSearchStatus("ALL"); setSearchDateFilter(""); setSearchMonthFilter("");
              }
              setActiveMenuItem(item.label);
            }} title={item.label}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p>{roleLabels[user.role]}</p>
            <h1>{headlineFor(user.role)}</h1>
          </div>
          <div className="user-pill">
            <UserRound size={18} />
            {user.email}
          </div>
          <button className="mobile-logout" onClick={handleLogout} aria-label="Logout">
            <LogOut size={18} />
            Logout
          </button>
        </header>

        <RoleWorkspace
          activeMenuItem={activeMenuItem}
          jobs={jobs}
          mutate={mutate}
          query={query}
          searchCategory={searchCategory}
          searchStatus={searchStatus}
          searchDateFilter={searchDateFilter}
          searchMonthFilter={searchMonthFilter}
          searchNavigate={searchNavigate}
          permittedPages={permittedPages}
          selected={selected}
          selectedJobId={selectedJobId}
          setQuery={setQuery}
          setSearchCategory={setSearchCategory}
          setSearchStatus={setSearchStatus}
          setSearchDateFilter={setSearchDateFilter}
          setSearchMonthFilter={setSearchMonthFilter}
          setSelectedJobId={setSelectedJobId}
          onOpenSearchRecord={openSearchRecord}
          onSearchNavigateConsumed={() => setSearchNavigate(undefined)}
          state={state}
          user={user}
          cognitoConfig={authConfig?.mode === "cognito" ? authConfig : undefined}
        />
      </main>
    </div>
  );
}

function LoginScreen({ onLogin, onCognitoLogin, config, error }: { onLogin: (email: string, password: string) => void; onCognitoLogin: () => void; config?: AuthConfig; error: string }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="login-mark">
          <ShieldCheck size={36} />
          <div>
            <span>WorkshopOS</span>
            <small>{appTagline}</small>
          </div>
        </div>
        <h1>Sign in to your workshop desk</h1>
        {config?.mode === "cognito" ? (
          <div className="cognito-login">
            <p>Use your business account to continue. New invitations require a password change at first sign-in.</p>
            {error && <p className="error-text">{error}</p>}
            <button className="primary-action" onClick={onCognitoLogin}>Continue with Cognito</button>
          </div>
        ) : config?.mode === "local" && !config.allowDemo ? (
          <div className="cognito-login"><p className="error-text">Authentication is not configured for this deployment. Contact your WorkshopOS administrator.</p></div>
        ) : <form
          onSubmit={(event) => {
            event.preventDefault();
            onLogin(email, password);
          }}
        >
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-action">Login</button>
        </form>}
        {config?.mode === "local" && config.allowDemo && <label className="demo-login-select">
          Emulate User:
          <select value={email} onChange={(event) => setEmail(event.target.value)}>
            {demoLogins.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span>Demo version now - use quick logins only.</span>
        </label>}
      </section>
    </main>
  );
}

function RoleWorkspace({
  activeMenuItem,
  jobs,
  mutate,
  query,
  searchCategory,
  searchStatus,
  searchDateFilter,
  searchMonthFilter,
  searchNavigate,
  permittedPages,
  selected,
  selectedJobId,
  setQuery,
  setSearchCategory,
  setSearchStatus,
  setSearchDateFilter,
  setSearchMonthFilter,
  setSelectedJobId,
  onOpenSearchRecord,
  onSearchNavigateConsumed,
  state,
  user,
  cognitoConfig,
}: {
  activeMenuItem: string;
  jobs: JobView[];
  mutate: Mutate;
  query: string;
  searchCategory: SearchTableCategory | "";
  searchStatus: SearchCriteria["status"];
  searchDateFilter: string;
  searchMonthFilter: string;
  searchNavigate?: { kind: "jobs" | "customers" | "vehicles"; id: number };
  permittedPages: AdminPageKey[];
  selected?: JobView;
  selectedJobId?: number;
  setQuery: (value: string) => void;
  setSearchCategory: (value: SearchTableCategory | "") => void;
  setSearchStatus: (value: SearchCriteria["status"]) => void;
  setSearchDateFilter: (value: string) => void;
  setSearchMonthFilter: (value: string) => void;
  setSelectedJobId: (value: number) => void;
  onOpenSearchRecord: (view: JobView, category: SearchTableCategory) => void;
  onSearchNavigateConsumed: () => void;
  state: WorkshopState;
  user: User;
  cognitoConfig?: CognitoConfig;
}) {
  if (activeMenuItem === "Search") {
    return (
      <SearchPortal
        jobs={jobs}
        state={state}
        mutate={mutate}
        query={query}
        category={searchCategory}
        status={searchStatus}
        dateFilter={searchDateFilter}
        monthFilter={searchMonthFilter}
        permittedPages={permittedPages}
        role={user.role}
        actor={user}
        setQuery={setQuery}
        setCategory={setSearchCategory}
        setStatus={setSearchStatus}
        setDateFilter={setSearchDateFilter}
        setMonthFilter={setSearchMonthFilter}
        onOpenRecord={onOpenSearchRecord}
      />
    );
  }

  if (activeMenuItem === "Job Cards" || activeMenuItem === "My Queue") return <EntityList kind="jobs" state={state} mutate={mutate} actor={user} initialSelectedId={searchNavigate?.kind === "jobs" ? searchNavigate.id : undefined} onInitialSelectionConsumed={onSearchNavigateConsumed} />;
  if (activeMenuItem === "Customers") return <EntityList kind="customers" state={state} mutate={mutate} actor={user} initialSelectedId={searchNavigate?.kind === "customers" ? searchNavigate.id : undefined} onInitialSelectionConsumed={onSearchNavigateConsumed} />;
  if (activeMenuItem === "Vehicles") return <EntityList kind="vehicles" state={state} mutate={mutate} actor={user} initialSelectedId={searchNavigate?.kind === "vehicles" ? searchNavigate.id : undefined} onInitialSelectionConsumed={onSearchNavigateConsumed} />;
  if (activeMenuItem === "Media") return <EntityList kind="media" state={state} mutate={mutate} actor={user} />;

  if (user.role === "reception") return <Reception activeMenuItem={activeMenuItem} state={state} mutate={mutate} user={user} selected={selected} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "service") return <ServiceAdvisor activeMenuItem={activeMenuItem} state={state} view={selected?.job.advisor_id === user.id ? selected : state.jobs.find((item) => item.job.advisor_id === user.id)} mutate={mutate} setSelectedJobId={setSelectedJobId} user={user} />;
  if (user.role === "store") return <StoreDesk activeMenuItem={activeMenuItem} state={state} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "tech") return <Technician activeMenuItem={activeMenuItem} state={state} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "accounts") return <Accounts activeMenuItem={activeMenuItem} state={state} view={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} actor={user} />;
  return <Admin activeMenuItem={activeMenuItem} state={state} selected={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} user={user} cognitoConfig={cognitoConfig} />;
}

const SEARCH_STATUS_OPTIONS: (MainStatus | "ALL")[] = ["ALL", "NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"];

function SearchPortal({
  jobs,
  state,
  mutate,
  query,
  category,
  status,
  dateFilter,
  monthFilter,
  permittedPages,
  role,
  actor,
  setQuery,
  setCategory,
  setStatus,
  setDateFilter,
  setMonthFilter,
  onOpenRecord,
}: {
  jobs: JobView[];
  state: WorkshopState;
  mutate: Mutate;
  query: string;
  category: SearchTableCategory | "";
  status: SearchCriteria["status"];
  dateFilter: string;
  monthFilter: string;
  permittedPages: AdminPageKey[];
  role: Role;
  actor: User;
  setQuery: (value: string) => void;
  setCategory: (value: SearchTableCategory | "") => void;
  setStatus: (value: SearchCriteria["status"]) => void;
  setDateFilter: (value: string) => void;
  setMonthFilter: (value: string) => void;
  onOpenRecord: (view: JobView, category: SearchTableCategory) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [record, setRecord] = useState<{ view: JobView; mode: "view" | "edit" }>();
  const [draftQuery, setDraftQuery] = useState(query);
  const [draftCategory, setDraftCategory] = useState<SearchTableCategory | "">(category);
  const [draftStatus, setDraftStatus] = useState<SearchCriteria["status"]>(status);
  const [draftDate, setDraftDate] = useState(dateFilter);
  const [draftMonth, setDraftMonth] = useState(monthFilter);

  const availableCategories = (Object.keys(CATEGORY_PAGE_KEYS) as SearchTableCategory[])
    .filter((item) => CATEGORY_PAGE_KEYS[item].some((key) => permittedPages.includes(key)));

  const applyFilters = () => { setQuery(draftQuery); setCategory(draftCategory); setStatus(draftStatus); setDateFilter(draftDate); setMonthFilter(draftMonth); setPage(1); };
  const clearFilters = () => { setDraftQuery(""); setDraftCategory(""); setDraftStatus("ALL"); setDraftDate(""); setDraftMonth(""); setQuery(""); setCategory(""); setStatus("ALL"); setDateFilter(""); setMonthFilter(""); setPage(1); };

  const paged = paginate(jobs, page, pageSize);

  return (
    <section className="portal">
      {record && category === "job" && <JobRecordDialog view={record.view} state={state} mutate={mutate} actor={actor} mode={record.mode} onClose={() => setRecord(undefined)} />}
      {record && category === "customer" && <CustomerRecordDialog customer={record.view.customer} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)} />}
      {record && category === "vehicle" && <VehicleRecordDialog vehicle={record.view.vehicle} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)} />}
      <div className="list-filter-bar" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applyFilters(); } }}>
        <label className="list-search">Search<input aria-label="Search records" value={draftQuery} placeholder="Search vehicle, mobile, customer, job card, invoice" onChange={(event) => setDraftQuery(event.target.value)} /></label>
        <div className="list-filter-fields open">
          <label>Category<select aria-label="Search category" value={draftCategory} onChange={(event) => setDraftCategory(event.target.value as SearchTableCategory | "")}>
            <option value="">Select a category</option>
            {availableCategories.map((item) => <option key={item} value={item}>{SEARCH_CATEGORY_LABELS[item]}</option>)}
          </select></label>
          {draftCategory && <>
            <label>Status<select aria-label="Job status" value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as SearchCriteria["status"])}>{SEARCH_STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item === "ALL" ? "All statuses" : item}</option>)}</select></label>
            <label>Date<input aria-label="Search date" type="date" value={draftDate} onChange={(event) => setDraftDate(event.target.value)} /></label>
            <label>Month<input aria-label="Search month" type="month" value={draftMonth} onChange={(event) => setDraftMonth(event.target.value)} /></label>
          </>}
          <ListSearchActions onClear={clearFilters} onSearch={applyFilters} />
        </div>
      </div>

      {!category ? (
        <div className="empty-state"><strong>Please select a category to activate search</strong><span>Choose Job, Customer, Vehicle or Invoice above to see results.</span></div>
      ) : (
        <>
          <div className="list-result-controls">
            <div className="result-summary" aria-live="polite">Showing {paged.from} to {paged.to} of {paged.totalCount}</div>
            <PageSizeSelect value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} />
          </div>
          <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
          {paged.totalCount === 0 ? (
            <div className="list-empty"><h3>No matching records</h3><p>Adjust the search or clear the filters.</p><button onClick={clearFilters}>Clear filters</button></div>
          ) : (
            <SearchResultsTable category={category} rows={paged.items} onOpenRecord={(view, itemCategory, mode) => itemCategory === "job" || itemCategory === "customer" || itemCategory === "vehicle" ? setRecord({ view, mode }) : onOpenRecord(view, itemCategory)} />
          )}
          <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
        </>
      )}
    </section>
  );
}

function SearchResultsTable({ category, rows, onOpenRecord }: { category: SearchTableCategory; rows: JobView[]; onOpenRecord: (view: JobView, category: SearchTableCategory, mode: "view" | "edit") => void }) {
  const headers = category === "job" ? ["Job #", "Vehicle", "Customer", "Status", "Total"]
    : category === "customer" ? ["Name", "Mobile", "Type"]
    : category === "vehicle" ? ["Registration", "Make / Model", "Customer"]
    : ["Invoice #", "Job", "Customer", "Amount", "Status"];
  return (
    <div className="table-wrap">
      <table aria-label={`${SEARCH_CATEGORY_LABELS[category]} search results`}>
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((view) => (
            <tr key={view.job.id} className="clickable-row" onClick={() => onOpenRecord(view, category, "view")}>
              {category === "job" && <>
                <td>{view.job.job_no}</td>
                <td>{view.vehicle.number} · {view.vehicle.make} {view.vehicle.model}</td>
                <td>{view.customer.name}</td>
                <td><Status status={view.job.main_status} sub={view.job.sub_status} /></td>
                <td>{money(jobTotal(view))}</td>
              </>}
              {category === "customer" && <>
                <td>{view.customer.name}</td>
                <td>{view.customer.mobile}</td>
                <td>{view.customer.type}</td>
              </>}
              {category === "vehicle" && <>
                <td>{view.vehicle.number}</td>
                <td>{view.vehicle.make} {view.vehicle.model}</td>
                <td>{view.customer.name}</td>
              </>}
              {category === "invoice" && <>
                <td>{view.invoice?.invoice_no || "Not generated"}</td>
                <td>{view.job.job_no}</td>
                <td>{view.customer.name}</td>
                <td>{money(view.invoice?.total ?? jobTotal(view))}</td>
                <td>{view.invoice?.status ?? "Not generated"}</td>
              </>}
              <td><RecordActions onView={() => onOpenRecord(view, category, "view")} onEdit={category === "job" || category === "customer" || category === "vehicle" ? () => onOpenRecord(view, category, "edit") : undefined} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Kpis({ jobs, inventory }: { jobs: JobView[]; inventory: WorkshopState["inventory"] }) {
  const revenue = jobs.reduce((sum, item) => sum + (item.invoice?.total ?? 0), 0);
  const paid = jobs.flatMap((item) => item.payments).reduce((sum, payment) => sum + payment.amount, 0);
  return (
    <section className="kpi-strip">
      <Kpi icon={<Car />} label="Cars Inside" value={jobs.filter((item) => item.job.main_status !== "CLOSED").length} />
      <Kpi icon={<ClipboardList />} label="New" value={jobs.filter((item) => item.job.main_status === "NEW").length} />
      <Kpi icon={<Wrench />} label="In Progress" value={jobs.filter((item) => item.job.main_status === "IN_PROGRESS").length} />
      <Kpi icon={<ReceiptText />} label="Revenue" value={money(revenue)} />
      <Kpi icon={<Banknote />} label="Collected" value={money(paid)} />
      <Kpi icon={<Boxes />} label="Low Stock" value={inventory.filter((item) => item.stock_qty < item.low_stock_qty).length} />
    </section>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="kpi">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Reception({
  activeMenuItem,
  state,
  mutate,
  user,
  selected,
  setSelectedJobId,
  embedded = false,
  onCreated,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  mutate: Mutate;
  user: User;
  selected?: JobView;
  setSelectedJobId: (id: number) => void;
  embedded?: boolean;
  onCreated?: () => void;
}) {
  const advisors = state.users.filter((item) => item.role === "service");
  const [customerEdit, setCustomerEdit] = useState<Customer>(state.customers[0] ?? { id: 0, name: "", mobile: "", type: "Individual" });
  const [vehicleEdit, setVehicleEdit] = useState<Vehicle>(state.vehicles[0] ?? { id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0 });
  const [form, setForm] = useState({
    customerId: 0,
    vehicleId: 0,
    customerName: "New Customer",
    mobile: "9000012345",
    customerType: "Individual",
    vehicleNo: "OD02NEW1001",
    make: "Toyota",
    model: "Fortuner",
    color: "Silver",
    km: 12000,
    fuel: "Half",
    keys: "2 keys",
    accessories: "Mats, charger",
    requestedWork: "PPF inspection, detailing",
    advisorId: advisors[0]?.id ?? 2,
  });
  const selectCustomer = (id: number) => {
    const customer = state.customers.find((item) => item.id === id);
    const vehicle = state.vehicles.find((item) => item.customer_id === id);
    if (!customer) return;
    setForm({
      ...form,
      customerId: customer.id,
      vehicleId: vehicle?.id ?? 0,
      customerName: customer.name,
      mobile: customer.mobile,
      customerType: customer.type,
      vehicleNo: vehicle?.number ?? form.vehicleNo,
      make: vehicle?.make ?? form.make,
      model: vehicle?.model ?? form.model,
      color: vehicle?.color ?? form.color,
      km: vehicle?.km ?? form.km,
    });
  };
  const selectVehicle = (id: number) => {
    const vehicle = state.vehicles.find((item) => item.id === id);
    if (!vehicle) return;
    const customer = state.customers.find((item) => item.id === vehicle.customer_id);
    setForm({
      ...form,
      customerId: customer?.id ?? form.customerId,
      vehicleId: vehicle.id,
      customerName: customer?.name ?? form.customerName,
      mobile: customer?.mobile ?? form.mobile,
      customerType: customer?.type ?? form.customerType,
      vehicleNo: vehicle.number,
      make: vehicle.make,
      model: vehicle.model,
      color: vehicle.color,
      km: vehicle.km,
    });
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.customerName.trim() || !form.mobile.trim() || !form.vehicleNo.trim() || !form.requestedWork.trim()) {
      window.alert("Customer, mobile, vehicle number and requested work are required.");
      return;
    }
    if (mutate((db) => receiveVehicle(db, { ...form, receptionId: user.id }))) onCreated?.();
  };
  if (activeMenuItem === "Today Queue") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<Car />} title="Today Queue" subtitle={`${state.visits.length} visits recorded`} />
          <FilterableJobRows title="Today Queue" jobs={state.jobs.filter((item) => item.job.main_status !== "CLOSED")} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} showStatusFilter />
        </div>
        <div className="desk-panel">
          <PanelTitle icon={<FileText />} title="Job Detail" subtitle={selected?.job.job_no ?? "Select a job"} />
          {selected && (
            <>
              <JobSnapshot view={selected} />
              <VisitEditor view={selected} advisors={advisors} mutate={mutate} />
              <button className="danger-action" onClick={() => mutate((db) => cancelJobCard(db, selected.job.id, "Cancelled at reception"))}>
                Archive Visit/Job
              </button>
            </>
          )}
        </div>
      </section>
    );
  }
  if (activeMenuItem === "Customers") {
    return (
      <section className="workspace masters-grid">
        <div className="desk-panel">
          <PanelTitle icon={<UserRound />} title="Customers" subtitle="Add, edit, archive and inspect history" />
          {state.customers.map((customer) => (
            <button className={customerEdit.id === customer.id ? "row active" : "row"} key={customer.id} onClick={() => setCustomerEdit(customer)}>
              <strong>{customer.name}</strong>
              <span>{customer.mobile}</span>
              <span>{customer.type}</span>
            </button>
          ))}
        </div>
        <CustomerEditor value={customerEdit} setValue={setCustomerEdit} mutate={mutate} />
        <VehicleMasterPanel state={state} value={vehicleEdit} setValue={setVehicleEdit} mutate={mutate} />
        <div className="desk-panel board-heading">
          <PanelTitle icon={<ClipboardList />} title="Linked History" subtitle={customerEdit.name || "Select customer"} />
          <FilterableJobRows title="Linked History" jobs={state.jobs.filter((job) => job.customer.id === customerEdit.id)} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} />
        </div>
      </section>
    );
  }
  const intakeForm = (
      <form className={embedded ? "" : "desk-panel intake-panel"} onSubmit={submit}>
        {!embedded && <PanelTitle icon={<DoorOpen />} title="Receive Vehicle" subtitle="Customer, vehicle, visit and linked NEW job card" />}
        <div className="form-grid">
          <label>
            Existing Customer
            <select value={form.customerId} onChange={(event) => selectCustomer(Number(event.target.value))}>
              <option value={0}>Create new customer</option>
              {state.customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} / {customer.mobile}
                </option>
              ))}
            </select>
          </label>
          <label>
            Existing Vehicle
            <select value={form.vehicleId} onChange={(event) => selectVehicle(Number(event.target.value))}>
              <option value={0}>Create new vehicle</option>
              {state.vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.number} / {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-grid">
          {textFields(form, setForm).map(([key, label]) => (
            key === "customerId" || key === "vehicleId" ? null :
            <label key={key}>
              {label}
              <input value={String(form[key])} onChange={(event) => setForm({ ...form, [key]: key === "km" ? Number(event.target.value) : event.target.value })} />
            </label>
          ))}
          <label>
            Advisor
            <select value={form.advisorId} onChange={(event) => setForm({ ...form, advisorId: Number(event.target.value) })}>
              {advisors.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="primary-action">
          <ClipboardList size={18} />
          Create Visit
        </button>
      </form>
  );
  if (embedded) return intakeForm;
  return <section className="workspace single-panel">{intakeForm}</section>;
}

function ServiceAdvisor({
  activeMenuItem,
  state,
  view,
  mutate,
  setSelectedJobId,
  user,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  view?: JobView;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
  user: User;
}) {
  if (activeMenuItem === "My Queue") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<ClipboardList />} title="My Queue" subtitle="Open advisor jobs" />
          <FilterableJobRows title="My Queue" jobs={state.jobs.filter((item) => item.job.advisor_id === user.id && item.job.main_status !== "CLOSED")} selectedJobId={view?.job.id} onSelect={setSelectedJobId} showStatusFilter />
        </div>
        <div className="desk-panel">
          <PanelTitle icon={<FileText />} title="Selected Job" subtitle={view?.job.job_no ?? "Select a job"} />
          {view && <JobSnapshot view={view} />}
        </div>
      </section>
    );
  }
  if (!view) return null;
  if (activeMenuItem === "Estimate") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<ReceiptText />} title="Estimate" subtitle={view.estimate?.status ?? "No estimate yet"} />
          <JobSnapshot view={view} />
          <Info label="GST" value={`${view.estimate?.gst_rate ?? 18}%`} />
          <Info label="Discount" value={money(view.estimate?.discount ?? 0)} />
          <Info label="Total" value={money(invoiceItemsTotal(view.estimate_items, view.estimate))} />
        </div>
        <EstimateEditor view={view} mutate={mutate} actor={user} />
      </section>
    );
  }
  if (activeMenuItem === "Follow-ups") {
    return (
      <section className="workspace two-panel">
        <FollowupEditor view={view} mutate={mutate} />
        <Timeline view={view} />
      </section>
    );
  }
  if (activeMenuItem === "Photos") {
    return (
      <section className="workspace two-panel">
        <JobMediaPanel view={view} actor={user} mutate={mutate} />
        <Timeline view={view} />
      </section>
    );
  }
  return (
    <section className="workspace single-panel">
      <div className="desk-panel command-panel">
        <PanelTitle icon={<FileText />} title="Job Card" subtitle="Add/edit remains available until closed" />
        <JobEditor view={view} users={state.users} mutate={mutate} actor={user} />
        <LinkedRecords view={view} />
      </div>
    </section>
  );
}

function StoreDesk({ activeMenuItem, state, mutate, setSelectedJobId }: { activeMenuItem: string; state: WorkshopState; mutate: Mutate; setSelectedJobId: (id: number) => void }) {
  const [stockTab, setStockTab] = useState<"Inventory List" | "Low Stock" | "Stock Movements">("Inventory List");
  const requests = state.jobs.flatMap((view) => view.material_requests.map((request) => ({ view, request, item: state.inventory.find((item) => item.id === request.item_id) })));
  if (activeMenuItem === "Stock") {
    const lowStock = state.inventory.filter((item) => item.stock_qty < item.low_stock_qty);
    return (
      <section className="workspace single-panel stock-workspace">
        <div className="desk-panel stock-overview">
          <PanelTitle icon={<Boxes />} title="Stock" subtitle="Inventory levels, low-stock attention and movement history" />
          <div className="sub-tabs" role="tablist" aria-label="Stock views">
            {(["Inventory List", "Low Stock", "Stock Movements"] as const).map((tab) => <button key={tab} role="tab" aria-selected={stockTab === tab} className={stockTab === tab ? "active" : ""} onClick={() => setStockTab(tab)}>{tab}</button>)}
          </div>
          <div className="stock-kpis">
            <Kpi icon={<Boxes />} label="Total SKUs" value={state.inventory.length} />
            <Kpi icon={<Package />} label="Total Units" value={state.inventory.reduce((sum, item) => sum + item.stock_qty, 0)} />
            <Kpi icon={<ClipboardCheck />} label="Low Stock" value={lowStock.length} />
            <Kpi icon={<ShieldCheck />} label="Out of Stock" value={state.inventory.filter((item) => item.stock_qty <= 0).length} />
          </div>
        </div>
        {stockTab === "Inventory List" && <div className="workspace two-panel embedded-workspace"><StoreList key="stock" kind="stock" inventory={state.inventory} requests={requests} onOpenJob={setSelectedJobId} /><InventoryEditor state={state} mutate={mutate} /></div>}
        {stockTab === "Low Stock" && <StoreList key="low-stock" kind="stock" inventory={lowStock} requests={requests} onOpenJob={setSelectedJobId} />}
        {stockTab === "Stock Movements" && <StockMovementHistory state={state} />}
      </section>
    );
  }
  if (activeMenuItem === "Material Requests") {
    return (
      <section className="workspace two-panel">
        <StoreList key="requests" kind="requests" inventory={state.inventory} requests={requests} onOpenJob={setSelectedJobId} />
        <MaterialRequestEditor state={state} mutate={mutate} />
      </section>
    );
  }
  return (
    <section className="workspace two-panel">
      <StoreList key={activeMenuItem} kind={activeMenuItem === "Issue Material" ? "issue" : "reconcile"} inventory={state.inventory} requests={requests} onOpenJob={setSelectedJobId} />
      {activeMenuItem === "Issue Material" ? <IssueMaterialEditor requests={requests} mutate={mutate} /> : <ReconcileEditor requests={requests} mutate={mutate} />}
    </section>
  );
}

function StockMovementHistory({ state }: { state: WorkshopState }) {
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [direction, setDirection] = useState("ALL");
  const [directionDraft, setDirectionDraft] = useState("ALL");
  const [month, setMonth] = useState("");
  const [monthDraft, setMonthDraft] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const uniqueMovements = Array.from(new Map(state.jobs.flatMap((view) => view.material_movements).map((movement) => [movement.id, movement])).values());
  const filtered = uniqueMovements.filter((movement) => {
    const item = state.inventory.find((row) => row.id === movement.item_id);
    const job = state.jobs.find((view) => view.job.id === movement.job_card_id);
    const matchesSearch = !normalizeSearch(search) || normalizeSearch(`${item?.sku ?? ""} ${item?.name ?? ""} ${job?.job.job_no ?? ""} ${movement.note}`).includes(normalizeSearch(search));
    return matchesSearch && (direction === "ALL" || movement.direction === direction) && (!month || movement.created_at.slice(0, 7) === month);
  });
  const paged = paginate(filtered, page, pageSize);
  const applySearch = () => { setSearch(searchDraft); setMonth(monthDraft); setDirection(directionDraft); setPage(1); };
  const clearFilters = () => { setSearchDraft(""); setSearch(""); setMonthDraft(""); setMonth(""); setDirectionDraft("ALL"); setDirection("ALL"); setPage(1); };
  const columns: ExportColumn<MaterialMovement>[] = [
    { header: "Date", value: (row) => row.created_at },
    { header: "Item", value: (row) => state.inventory.find((item) => item.id === row.item_id)?.name ?? `Item ${row.item_id}` },
    { header: "Job", value: (row) => state.jobs.find((view) => view.job.id === row.job_card_id)?.job.job_no ?? "General stock" },
    { header: "Direction", value: (row) => row.direction },
    { header: "Quantity", value: (row) => row.qty },
    { header: "Note", value: (row) => row.note },
  ];
  return <div className="desk-panel store-list-page" role="tabpanel">
    <div className="store-filter-grid contextual-filter-bar" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applySearch(); } }}>
      <label className="list-search">Quick search<input aria-label="Search stock movements" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Item, SKU, job or note" /></label>
      <label>Month-Year<input aria-label="Stock movement month" type="month" value={monthDraft} onChange={(event) => setMonthDraft(event.target.value)} /></label>
      <label>Direction<select aria-label="Stock movement direction" value={directionDraft} onChange={(event) => setDirectionDraft(event.target.value)}><option value="ALL">All movements</option>{Array.from(new Set(uniqueMovements.map((row) => row.direction))).sort().map((value) => <option key={value}>{value}</option>)}</select></label>
      <ListSearchActions onClear={clearFilters} onSearch={applySearch} />
    </div>
    <div className="list-result-controls"><ListExportControls report={{ title: "Stock Movements", filters: activeFilterSummary({ Search: search.trim(), Month: month, Direction: direction }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel="Stock movement records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    {filtered.length ? <div className="table-wrap"><table aria-label="Stock movement results"><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}</tr></thead><tbody>{paged.items.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.header}>{column.value(row)}</td>)}</tr>)}</tbody></table></div> : <div className="list-empty"><h3>No matching movements</h3><button onClick={clearFilters}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

type StoreListKind = "stock" | "requests" | "issue" | "reconcile";
type StoreRequestRow = { view: JobView; request: MaterialRequest; item?: InventoryItem };

function requestState(row: StoreRequestRow) {
  const { request } = row;
  const reconciled = request.used_qty + request.returned_qty + request.wasted_qty;
  if (request.issued_qty > 0 && Math.abs(reconciled - request.issued_qty) < 0.001) return "Reconciled";
  if (request.issued_qty >= request.requested_qty) return "Issued";
  if (request.issued_qty > 0) return "Partially issued";
  return "Pending";
}

function reconciliationState(row: StoreRequestRow) {
  const { request } = row;
  return request.issued_qty > 0 && Math.abs(request.issued_qty - request.used_qty - request.returned_qty - request.wasted_qty) < 0.001 ? "Matched" : "Open";
}

function StoreList({ kind, inventory, requests, onOpenJob }: { kind: StoreListKind; inventory: InventoryItem[]; requests: StoreRequestRow[]; onOpenJob: (id: number) => void }) {
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [primary, setPrimary] = useState("ALL");
  const [primaryDraft, setPrimaryDraft] = useState("ALL");
  const [job, setJob] = useState("ALL");
  const [jobDraft, setJobDraft] = useState("ALL");
  const [item, setItem] = useState("ALL");
  const [itemDraft, setItemDraft] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [unitDraft, setUnitDraft] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(deferredSearch);
  const applySearch = () => { setSearch(searchDraft); setPrimary(primaryDraft); setJob(jobDraft); setItem(itemDraft); setUnit(unitDraft); setPage(1); };
  const clearFilters = () => { setSearchDraft(""); setSearch(""); setPrimaryDraft("ALL"); setPrimary("ALL"); setJobDraft("ALL"); setJob("ALL"); setItemDraft("ALL"); setItem("ALL"); setUnitDraft("ALL"); setUnit("ALL"); setPage(1); };
  const title = kind === "stock" ? "Stock" : kind === "requests" ? "Material Requests" : kind === "issue" ? "Issue Material" : "Reconcile";

  const stockRows = useMemo(() => inventory.filter((row) => {
    const stockState = row.stock_qty < row.low_stock_qty ? "LOW" : "OK";
    return (!needle || normalizeSearch(`${row.sku} ${row.name} ${row.category} ${row.unit}`).includes(needle))
      && (primary === "ALL" || row.category === primary)
      && (job === "ALL" || stockState === job)
      && (unit === "ALL" || row.unit === unit);
  }), [inventory, needle, primary, job, unit]);

  const requestRows = useMemo(() => requests.filter((row) => {
    const state = kind === "reconcile" ? reconciliationState(row) : requestState(row);
    return (!needle || normalizeSearch(`${row.view.job.job_no} ${row.view.vehicle.number} ${row.item?.sku ?? ""} ${row.item?.name ?? ""}`).includes(needle))
      && (primary === "ALL" || state === primary)
      && (job === "ALL" || String(row.view.job.id) === job)
      && (item === "ALL" || String(row.request.item_id) === item);
  }), [requests, kind, needle, primary, job, item]);

  const filtered: Array<InventoryItem | StoreRequestRow> = kind === "stock" ? stockRows : requestRows;
  const paged = paginate<InventoryItem | StoreRequestRow>(filtered, page, pageSize);
  useEffect(() => { if (paged.page !== page) setPage(paged.page); }, [paged.page, page]);
  const categories = Array.from(new Set(inventory.map((row) => row.category))).sort();
  const units = Array.from(new Set(inventory.map((row) => row.unit))).sort();
  const uniqueJobs = Array.from(new Map(requests.map((row) => [row.view.job.id, row.view])).values());
  const activeFilters = activeFilterSummary(kind === "stock"
    ? { Search: search.trim(), Category: primary, "Stock status": job === "LOW" ? "Low stock" : job === "OK" ? "In stock" : "ALL", Unit: unit }
    : { Search: search.trim(), [kind === "reconcile" ? "Reconciliation state" : "Request status"]: primary, Job: job === "ALL" ? "ALL" : uniqueJobs.find((row) => String(row.job.id) === job)?.job.job_no ?? job, Item: item === "ALL" ? "ALL" : inventory.find((row) => String(row.id) === item)?.name ?? item });

  const stockColumns: ExportColumn<InventoryItem>[] = [
    { header: "SKU", value: (row) => row.sku }, { header: "Item", value: (row) => row.name },
    { header: "Category", value: (row) => row.category }, { header: "Stock", value: (row) => row.stock_qty },
    { header: "Unit", value: (row) => row.unit }, { header: "Minimum", value: (row) => row.low_stock_qty },
    { header: "Status", value: (row) => row.stock_qty < row.low_stock_qty ? "Low stock" : "In stock" },
  ];
  const requestColumns: ExportColumn<StoreRequestRow>[] = [
    { header: "Job", value: (row) => row.view.job.job_no }, { header: "Vehicle", value: (row) => row.view.vehicle.number },
    { header: "Item", value: (row) => row.item?.name ?? "Unknown" }, { header: "Requested", value: (row) => row.request.requested_qty },
    { header: "Issued", value: (row) => row.request.issued_qty },
    ...(kind === "reconcile" ? [
      { header: "Used", value: (row: StoreRequestRow) => row.request.used_qty }, { header: "Returned", value: (row: StoreRequestRow) => row.request.returned_qty },
      { header: "Wasted", value: (row: StoreRequestRow) => row.request.wasted_qty }, { header: "State", value: reconciliationState },
    ] : [{ header: "Status", value: requestState }]),
  ];
  const exportReport = kind === "stock"
    ? { title, filters: activeFilters, columns: stockColumns, rows: stockRows }
    : { title, filters: activeFilters, columns: requestColumns, rows: requestRows };

  return <div className="desk-panel store-list-page">
    <PanelTitle icon={kind === "stock" ? <Boxes /> : kind === "issue" ? <Package /> : kind === "reconcile" ? <Check /> : <PackageCheck />} title={title} subtitle="Search, filter and export the current list" />
    <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applySearch(); } }}>
      <label className="list-search">Search<input aria-label={`Search ${title.toLocaleLowerCase()}`} value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder={kind === "stock" ? "SKU, item, category or unit" : "Job, vehicle or item"} /></label>
      {kind === "stock" ? <>
        <label>Category<select aria-label="Stock category" value={primaryDraft} onChange={(event) => setPrimaryDraft(event.target.value)}><option value="ALL">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Stock status<select aria-label="Stock status" value={jobDraft} onChange={(event) => setJobDraft(event.target.value)}><option value="ALL">All stock</option><option value="LOW">Low stock</option><option value="OK">In stock</option></select></label>
        <label>Unit<select aria-label="Stock unit" value={unitDraft} onChange={(event) => setUnitDraft(event.target.value)}><option value="ALL">All units</option>{units.map((value) => <option key={value}>{value}</option>)}</select></label>
      </> : <>
        <label>{kind === "reconcile" ? "Reconciliation state" : "Request status"}<select aria-label={kind === "reconcile" ? "Reconciliation state" : "Request status"} value={primaryDraft} onChange={(event) => setPrimaryDraft(event.target.value)}><option value="ALL">All states</option>{(kind === "reconcile" ? ["Matched", "Open"] : ["Pending", "Partially issued", "Issued", "Reconciled"]).map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Job<select aria-label={`${title} job`} value={jobDraft} onChange={(event) => setJobDraft(event.target.value)}><option value="ALL">All jobs</option>{uniqueJobs.map((row) => <option key={row.job.id} value={row.job.id}>{row.job.job_no}</option>)}</select></label>
        <label>Item<select aria-label={`${title} item`} value={itemDraft} onChange={(event) => setItemDraft(event.target.value)}><option value="ALL">All items</option>{inventory.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
      </>}
      <ListSearchActions onClear={clearFilters} onSearch={applySearch} />
    </div>
    <div className="list-result-controls">
      <ListExportControls report={exportReport} />
      <div className="result-summary" aria-live="polite">Showing {paged.from} to {paged.to} of {paged.totalCount}</div>
      <PageSizeSelect ariaLabel={`${title} records per page`} value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} />
    </div>
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    {paged.totalCount === 0 ? <div className="list-empty"><h3>No matching records</h3><p>Adjust the search or clear the filters.</p><button onClick={clearFilters}>Clear filters</button></div> :
      <div className="table-wrap"><table aria-label={`${title} results`}><thead><tr>{(kind === "stock" ? stockColumns : requestColumns).map((column) => <th key={column.header}>{column.header}</th>)}</tr></thead><tbody>{kind === "stock" ? (paged.items as InventoryItem[]).map((row) => <tr key={row.id}>{stockColumns.map((column) => <td key={column.header}>{column.value(row)}</td>)}</tr>) : (paged.items as StoreRequestRow[]).map((row) => <tr key={row.request.id} className="clickable-row" onClick={() => onOpenJob(row.view.job.id)}>{requestColumns.map((column) => <td key={column.header}>{column.value(row)}</td>)}</tr>)}</tbody></table></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

function Technician({ activeMenuItem, state, mutate, setSelectedJobId }: { activeMenuItem: string; state: WorkshopState; mutate: Mutate; setSelectedJobId: (id: number) => void }) {
  const taskJobs = state.jobs.filter((view) => view.job.main_status === "IN_PROGRESS");
  const statuses: TaskStatus[] = ["Started", "Paused", "Completed"];
  return (
    <section className="workspace tech-board">
      <div className="desk-panel board-heading">
        <PanelTitle icon={activeMenuItem === "QC Prep" ? <ShieldCheck /> : <Wrench />} title={activeMenuItem} subtitle="Assigned work, progress state and QC handoff" />
      </div>
      {taskJobs.map((view) => (
        <div className="desk-panel task-column" key={view.job.id} onFocus={() => setSelectedJobId(view.job.id)}>
          <PanelTitle icon={<Wrench />} title={view.vehicle.number} subtitle={view.job.job_no} />
          {view.tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <strong>{task.title}</strong>
              <p>{task.notes}</p>
              <Info label="Started" value={task.started_at || "Not started"} />
              <Info label="Paused" value={task.paused_at || "Not paused"} />
              <Info label="Completed" value={task.completed_at || "Not completed"} />
              <Status status={view.job.main_status} sub={view.job.sub_status} />
              <label>
                Work notes
                <input defaultValue={task.notes} onBlur={(event) => mutate((db) => updateTask(db, task.id, task.status, event.target.value))} />
              </label>
              <div className="segmented">
                {statuses.map((status) => (
                  <button key={status} className={task.status === status ? "active" : ""} onClick={() => mutate((db) => updateTask(db, task.id, status, `${status} from technician board`))}>
                    {status}
                  </button>
                ))}
              </div>
              <button className="danger-action" onClick={() => mutate((db) => archiveTask(db, task.id, "Removed from technician board"))}>
                Archive Task
              </button>
            </div>
          ))}
          <TaskCreator view={view} users={state.users} mutate={mutate} />
          {activeMenuItem === "QC Prep" && (
            <QcEditor view={view} technicianId={state.users.find((item) => item.role === "tech")?.id ?? 6} mutate={mutate} />
          )}
        </div>
      ))}
    </section>
  );
}

function Accounts({ activeMenuItem, state, view, mutate, setSelectedJobId, actor }: { activeMenuItem: string; state: WorkshopState; view?: JobView; mutate: Mutate; setSelectedJobId: (id: number) => void; actor: User }) {
  if (activeMenuItem === "Ready To Invoice") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<ClipboardList />} title="Ready To Invoice" subtitle="Completed jobs waiting for billing" />
          <FilterableJobRows title="Ready To Invoice" jobs={state.jobs.filter((item) => item.job.main_status === "COMPLETED")} selectedJobId={view?.job.id} onSelect={setSelectedJobId} />
        </div>
        <div className="desk-panel">
          <PanelTitle icon={<ReceiptText />} title="Billable Items" subtitle={view?.job.job_no ?? "Select a completed job"} />
          {view && <InvoiceSummary view={view} />}
        </div>
      </section>
    );
  }
  const mode: BillingMode = activeMenuItem === "Payment" ? "Payments" : activeMenuItem === "Delivery" ? "Delivery" : "Invoices";
  return <BillingManager mode={mode} state={state} actor={actor} mutate={mutate} />;
}

function Admin({ activeMenuItem, state, selected, mutate, setSelectedJobId, user, cognitoConfig }: { activeMenuItem: string; state: WorkshopState; selected?: JobView; mutate: Mutate; setSelectedJobId: (id: number) => void; user: User; cognitoConfig?: CognitoConfig }) {
  const funnel = ["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"].map((status) => ({
    status,
    count: state.jobs.filter((view) => view.job.main_status === status).length,
  }));
  if (activeMenuItem === "Data Flow") {
    return <DataFlowWorkspace jobs={state.jobs} users={state.users} />;
  }
  if (activeMenuItem === "Job Cards") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<FileText />} title="Job Cards" subtitle="Linked operational records" />
          <FilterableJobRows title="Job Cards" jobs={state.jobs} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} showStatusFilter />
        </div>
        <div className="desk-panel">
          <PanelTitle icon={<FileText />} title="Admin Job Detail" subtitle={selected?.job.job_no ?? "Select a job"} />
          {selected && (
            <>
              <JobEditor view={selected} users={state.users} mutate={mutate} actor={user} />
              <LinkedRecords view={selected} />
              <button className="danger-action" onClick={() => mutate((db) => cancelJobCard(db, selected.job.id, "Cancelled by admin"))}>Archive Job</button>
            </>
          )}
        </div>
      </section>
    );
  }
  if (activeMenuItem === "Masters") {
    return (
      <section className="workspace masters-grid">
        <div className="desk-panel board-heading">
          <PanelTitle icon={<Boxes />} title="Masters" subtitle="Users, inventory and vehicle records" />
        </div>
        <div className="desk-panel">
          <PanelTitle icon={<UserRound />} title="Users" subtitle="Demo login roles" />
          {state.users.map((item) => (
            <Info key={item.id} label={item.name} value={roleLabels[item.role]} />
          ))}
        </div>
        <InventoryEditor state={state} mutate={mutate} />
        <VehicleMasterPanel state={state} value={state.vehicles[0] ?? { id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0 }} setValue={() => undefined} mutate={mutate} />
      </section>
    );
  }
  if (activeMenuItem === "Manage") {
    return <ManagementHub state={state} mutate={mutate} actingUser={user} selected={selected} setSelectedJobId={setSelectedJobId} cognitoConfig={cognitoConfig} />;
  }
  if (activeMenuItem === "Admin Console") {
    return <AdminConsole state={state} mutate={mutate} actingUser={user} cognitoConfig={cognitoConfig} />;
  }
  return (
    <section className="workspace admin-room">
      <Kpis jobs={state.jobs} inventory={state.inventory} />
      <div className="desk-panel">
        <PanelTitle icon={<Gauge />} title="Dashboard" subtitle="Lifecycle, blockers, revenue and inventory alerts" />
        {funnel.map((item) => (
          <button className="info-row as-button" key={item.status} onClick={() => setSelectedJobId(state.jobs.find((job) => job.job.main_status === item.status)?.job.id ?? selected?.job.id ?? state.jobs[0]?.job.id)}>
            <span>{item.status}</span>
            <strong>{String(item.count)}</strong>
          </button>
        ))}
        {state.inventory
          .filter((item) => item.stock_qty < item.low_stock_qty)
          .map((item) => (
            <p className="blocker-pill" key={item.id}>
              Low stock: {item.name}
            </p>
          ))}
      </div>
    </section>
  );
}

const managementAreas = ["Users", "Customers", "Vehicles", "Job Cards", "Estimates", "Tasks / QC", "Inventory / Materials", "Invoices", "Payments", "Delivery"] as const;
type ManagementArea = (typeof managementAreas)[number];

function ManagementHub({ state, mutate, actingUser, selected, setSelectedJobId, cognitoConfig }: { state: WorkshopState; mutate: Mutate; actingUser: User; selected?: JobView; setSelectedJobId: (id: number) => void; cognitoConfig?: CognitoConfig }) {
  const [area, setArea] = useState<ManagementArea>("Users");
  return (
    <section className="workspace single-panel management-hub">
      <div className="desk-panel">
        <PanelTitle icon={<ShieldCheck />} title="Management Hub" subtitle="Admin master data and workflow controls" />
        <div className="demo-dataset-control">
          <div><strong>Large demo dataset</strong><span>120 customers, 132 vehicles, 144 jobs and 288 offline media records.</span></div>
          <button className="primary-action" onClick={() => {
            if (window.confirm("Load Large Demo Dataset? Current local demo records will be replaced. This cannot be undone from this screen.")) mutate(loadLargeDemoDataset);
          }}>Load Large Demo Dataset</button>
        </div>
        <div className="management-tabs" role="tablist" aria-label="Management areas" onKeyDown={handleTabListKeyDown}>
          {managementAreas.map((item) => <button id={`management-tab-${item.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`} aria-controls="management-active-panel" tabIndex={area === item ? 0 : -1} key={item} role="tab" aria-selected={area === item} className={area === item ? "active" : ""} onClick={() => setArea(item)}>{item}</button>)}
        </div>
        <div id="management-active-panel" role="tabpanel" aria-labelledby={`management-tab-${area.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}>
        {(area === "Estimates" || area === "Tasks / QC") && <JobSelector jobs={state.jobs} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} label={`Job for ${area}`} />}
        {area === "Users" && <UserManager users={state.users} mutate={mutate} actingUser={actingUser} cognitoConfig={cognitoConfig} />}
        {area === "Customers" && <CustomerManager state={state} mutate={mutate} />}
        {area === "Vehicles" && <VehicleManager state={state} mutate={mutate} />}
        {area === "Job Cards" && <VisitJobManager state={state} mutate={mutate} actingUser={actingUser} selected={selected} setSelectedJobId={setSelectedJobId} />}
        {area === "Estimates" && <EstimateManager view={selected} mutate={mutate} actor={actingUser} />}
        {area === "Tasks / QC" && <TaskQcManager view={selected} users={state.users} mutate={mutate} />}
        {area === "Inventory / Materials" && <InventoryMaterialsManager state={state} mutate={mutate} />}
        {(area === "Invoices" || area === "Payments" || area === "Delivery") && <BillingManager mode={area} state={state} actor={actingUser} mutate={mutate} panel={false} />}
        </div>
      </div>
    </section>
  );
}

function CustomerManager({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const customers = state.customers;
  const empty: Customer = { id: 0, name: "", mobile: "", type: "Individual" };
  const [draft, setDraft] = useState<Customer>(empty);
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{ customer: Customer; mode: "view" | "edit" }>();
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filtered = customers.filter((item) => !needle || normalizeSearch(`${item.name} ${item.mobile} ${item.type}`).includes(needle));
  const paged = paginate(filtered, page, pageSize);
  const columns: ExportColumn<Customer>[] = [
    { header: "Customer", value: (row) => row.name }, { header: "Mobile", value: (row) => row.mobile }, { header: "Type", value: (row) => row.type },
  ];
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><h3>Customers</h3><button className="primary-action" onClick={() => { setDraft(empty); setCreating(true); }}>Add Customer</button></div>
    {creating && <Dialog title="Add Customer" onClose={() => setCreating(false)}><CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /></Dialog>}
    {record && <CustomerRecordDialog customer={record.customer} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)} />}
    <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setSearch(searchDraft); setPage(1); } }}><label className="list-search">Search<input aria-label="Search customers" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Name, mobile or type" /></label><ListSearchActions onClear={() => { setSearchDraft(""); setSearch(""); setPage(1); }} onSearch={() => { setSearch(searchDraft); setPage(1); }} /></div>
    <div className="list-result-controls"><DownloadMenu report={{ title: "Customers", filters: activeFilterSummary({ Search: search.trim() }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel="Customer records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    <div className="record-list">{paged.items.map((customer) => <div className="managed-record" key={customer.id}><div><strong>{customer.name}</strong><span>{customer.mobile} · {customer.type}</span></div><div className="action-row"><RecordActions onView={() => setRecord({ customer, mode: "view" })} onEdit={() => setRecord({ customer, mode: "edit" })} onArchive={() => mutate((db) => archiveCustomer(db, customer.id, "Archived by Admin"))} /></div></div>)}</div>
    {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearchDraft(""); setSearch(""); setPage(1); }}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

function VehicleManager({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const empty: Vehicle = { id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0 };
  const [draft, setDraft] = useState<Vehicle>(empty);
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{ id: number; mode: "view" | "edit" }>();
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filtered = state.vehicles.filter((item) => {
    const owner = state.customers.find((customer) => customer.id === item.customer_id)?.name ?? "";
    return !needle || normalizeSearch(`${item.number} ${item.make} ${item.model} ${owner}`).includes(needle);
  });
  const paged = paginate(filtered, page, pageSize);
  const columns: ExportColumn<Vehicle>[] = [
    { header: "Registration", value: (row) => row.number }, { header: "Make / Model", value: (row) => `${row.make} ${row.model}` },
    { header: "Customer", value: (row) => state.customers.find((customer) => customer.id === row.customer_id)?.name ?? "" }, { header: "KM", value: (row) => row.km },
  ];
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><h3>Vehicles</h3><button className="primary-action" onClick={() => { setDraft(empty); setCreating(true); }}>Add Vehicle</button></div>
    {creating && <Dialog title="Add Vehicle" onClose={() => setCreating(false)}><VehicleMasterPanel embedded key={draft.id} state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /></Dialog>}
    {record && <VehicleRecordDialog vehicle={state.vehicles.find((vehicle) => vehicle.id === record.id)!} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)} />}
    <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setSearch(searchDraft); setPage(1); } }}><label className="list-search">Search<input aria-label="Search vehicles" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Registration, make, model or customer" /></label><ListSearchActions onClear={() => { setSearchDraft(""); setSearch(""); setPage(1); }} onSearch={() => { setSearch(searchDraft); setPage(1); }} /></div>
    <div className="list-result-controls"><DownloadMenu report={{ title: "Vehicles", filters: activeFilterSummary({ Search: search.trim() }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel="Vehicle records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    <div className="record-list">{paged.items.map((vehicle) => <div className="managed-record" key={vehicle.id}><div><strong>{vehicle.number}</strong><span>{vehicle.make} {vehicle.model} · {state.customers.find((customer) => customer.id === vehicle.customer_id)?.name ?? "—"}</span></div><div className="action-row"><RecordActions onView={() => setRecord({ id: vehicle.id, mode: "view" })} onEdit={() => setRecord({ id: vehicle.id, mode: "edit" })} onArchive={() => mutate((db) => archiveVehicle(db, vehicle.id, "Archived by Admin"))} /></div></div>)}</div>
    {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearchDraft(""); setSearch(""); setPage(1); }}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

function VisitJobManager({ state, mutate, actingUser, selected, setSelectedJobId }: { state: WorkshopState; mutate: Mutate; actingUser: User; selected?: JobView; setSelectedJobId: (id: number) => void }) {
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{ id: number; mode: "view" | "edit" }>();
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [status, setStatus] = useState("ALL");
  const [statusDraft, setStatusDraft] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filtered = state.jobs.filter((row) => (!needle || normalizeSearch(`${row.job.job_no} ${row.vehicle.number} ${row.customer.name}`).includes(needle)) && (status === "ALL" || row.job.main_status === status));
  const paged = paginate(filtered, page, pageSize);
  const columns: ExportColumn<JobView>[] = [
    { header: "Job Card", value: (row) => row.job.job_no }, { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name }, { header: "Status", value: (row) => row.job.main_status },
  ];
  const dialogJob = record ? state.jobs.find((row) => row.job.id === record.id) : undefined;
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><h3>Job Cards</h3><button className="primary-action" onClick={() => setCreating(true)}>Create Job Card</button></div>
    {creating && <Dialog wide title="Create Job Card" subtitle="Pick a customer and vehicle to prefill intake, then complete the rest" onClose={() => setCreating(false)}><Reception embedded activeMenuItem="Receive Vehicle" state={state} mutate={mutate} user={actingUser} selected={selected} setSelectedJobId={setSelectedJobId} onCreated={() => setCreating(false)} /></Dialog>}
    {dialogJob && <JobRecordDialog view={dialogJob} state={state} mutate={mutate} actor={actingUser} mode={record?.mode ?? "view"} onClose={() => setRecord(undefined)} onAdminArchive={() => mutate((db) => cancelJobCard(db, dialogJob.job.id, "Admin override: archived from Management Hub"))} />}
    <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setSearch(searchDraft); setStatus(statusDraft); setPage(1); } }}><label className="list-search">Search<input aria-label="Search job cards" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Job card, vehicle or customer" /></label><label>Status<select aria-label="Job status filter" value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}><option value="ALL">All statuses</option>{["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}</select></label><ListSearchActions onClear={() => { setSearchDraft(""); setSearch(""); setStatusDraft("ALL"); setStatus("ALL"); setPage(1); }} onSearch={() => { setSearch(searchDraft); setStatus(statusDraft); setPage(1); }} /></div>
    <div className="list-result-controls"><DownloadMenu report={{ title: "Job Cards", filters: activeFilterSummary({ Search: search.trim(), Status: status }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel="Job card records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    {paged.totalCount > 0 && <div className="table-wrap manage-job-table"><table aria-label="Managed job cards"><thead><tr>{["Job Card", "Vehicle", "Customer", "Status", "Actions"].map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{paged.items.map((row) => <tr key={row.job.id}><td>{row.job.job_no}</td><td>{row.vehicle.number} · {row.vehicle.make} {row.vehicle.model}</td><td>{row.customer.name}</td><td><Status status={row.job.main_status} sub={row.job.sub_status} /></td><td><RecordActions onView={() => setRecord({ id: row.job.id, mode: "view" })} onEdit={() => setRecord({ id: row.job.id, mode: "edit" })} /></td></tr>)}</tbody></table></div>}
    {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearchDraft(""); setSearch(""); setStatus("ALL"); setPage(1); }}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

function EstimateManager({ view, mutate, actor }: { view?: JobView; mutate: Mutate; actor: User }) {
  return <div className="manager-panel" role="tabpanel"><div className="panel-actions"><h3>Estimates</h3></div>{view ? <EstimateEditor view={view} mutate={mutate} actor={actor} /> : <p className="empty-state">Select a job first.</p>}</div>;
}

function TaskQcManager({ view, users, mutate }: { view?: JobView; users: User[]; mutate: Mutate }) {
  const [addingTask, setAddingTask] = useState(false);
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><h3>Tasks / QC</h3><div className="action-row"><button className="primary-action" disabled={!view} onClick={() => setAddingTask(true)}>Add Task</button><span className="override-badge">Admin override controls</span></div></div>
    {addingTask && view && <Dialog title="Add Task" onClose={() => setAddingTask(false)}><TaskCreator embedded view={view} users={users} mutate={mutate} onCreated={() => setAddingTask(false)} /></Dialog>}
    {view ? <QcEditor view={view} technicianId={view.job.technician_id} mutate={mutate} /> : <p className="empty-state">Select a job first.</p>}
  </div>;
}

function InventoryMaterialsManager({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const [addingItem, setAddingItem] = useState(false);
  const [addingRequest, setAddingRequest] = useState(false);
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filtered = state.inventory.filter((item) => !needle || normalizeSearch(`${item.sku} ${item.name} ${item.category} ${item.unit}`).includes(needle));
  const paged = paginate(filtered, page, pageSize);
  const clearSearch = () => { setSearchDraft(""); setSearch(""); setPage(1); };
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><h3>Inventory / Materials</h3><div className="action-row"><button className="primary-action" onClick={() => setAddingItem(true)}>Add / Edit Inventory Item</button><button className="primary-action" onClick={() => setAddingRequest(true)}>Add / Edit Material Request</button></div></div>
    {addingItem && <Dialog title="Inventory Item" subtitle="Master, stock-in and adjustment" onClose={() => setAddingItem(false)}><InventoryEditor embedded state={state} mutate={mutate} /></Dialog>}
    {addingRequest && <Dialog title="Material Request" subtitle="Job-linked material request" onClose={() => setAddingRequest(false)}><MaterialRequestEditor embedded state={state} mutate={mutate} /></Dialog>}
    <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setSearch(searchDraft); setPage(1); } }}><label className="list-search">Search<input aria-label="Search inventory / materials" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="SKU, name, category or unit" /></label><ListSearchActions onClear={clearSearch} onSearch={() => { setSearch(searchDraft); setPage(1); }} /></div>
    <div className="list-result-controls"><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel="Inventory records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    <div className="record-list">{paged.items.map((item) => <div className="managed-record" key={item.id}><div><strong>{item.name}</strong><span>{item.sku} · {item.category} · Stock {item.stock_qty} {item.unit}</span></div></div>)}</div>
    {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={clearSearch}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

export function UserManager({ users, mutate, actingUser, cognitoConfig }: { users: User[]; mutate: Mutate; actingUser: User; cognitoConfig?: CognitoConfig }) {
  if (cognitoConfig) return <RemoteUserManager config={cognitoConfig} actorId={actingUser.externalId} />;
  const empty: User = { id: 0, name: "", email: "", role: "service", password: "" };
  const [draft, setDraft] = useState<User>(empty);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [roleDraft, setRoleDraft] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [statusDraft, setStatusDraft] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  // sql.js only ever returns active (non-archived) users here (readState filters archived_at is null),
  // so "Active" is the only status this session can observe; the filter is kept for the spec's UI
  // shape and to make the (empty) "Archived" branch explicit rather than silently dropping the control.
  const filtered = users.filter((item) => (!needle || normalizeSearch(`${item.name} ${item.email} ${roleLabels[item.role]}`).includes(needle)) && (roleFilter === "ALL" || item.role === roleFilter) && (statusFilter === "ALL" || statusFilter === "ACTIVE"));
  const paged = paginate(filtered, page, pageSize);
  const userColumns: ExportColumn<User>[] = [
    { header: "Name", value: (item) => item.name }, { header: "Email", value: (item) => item.email }, { header: "Role", value: (item) => roleLabels[item.role] }, { header: "Status", value: () => "Active" },
  ];
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Users</h3>
        <button className="primary-action" onClick={() => { setDraft(empty); setEditing(true); }}>Add User</button>
      </div>
      {editing && (
        <form onSubmit={(event) => {
          event.preventDefault();
          if (mutate((db) => draft.id ? updateUser(db, draft.id, draft) : createUser(db, draft))) setEditing(false);
        }}>
          <div className="form-grid">
            <label>User name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label>User email<input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
            <label>User role<select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role })}>{Object.entries(roleLabels).map(([role, label]) => <option key={role} value={role}>{label}</option>)}</select></label>
            <label>User password<input required minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} /></label>
          </div>
          <div className="action-row"><button className="primary-action">Save User</button><button type="button" onClick={() => setEditing(false)}>Cancel</button></div>
        </form>
      )}
      <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setSearch(searchDraft); setRoleFilter(roleDraft); setStatusFilter(statusDraft); setPage(1); } }}><label className="list-search">Search<input aria-label="Search users" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Name, email or role" /></label><label>Role<select aria-label="Filter users by role" value={roleDraft} onChange={(event) => setRoleDraft(event.target.value)}><option value="ALL">All roles</option>{Object.entries(roleLabels).map(([role, label]) => <option key={role} value={role}>{label}</option>)}</select></label><label>Status<select aria-label="Filter users by status" value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}><option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></select></label><ListSearchActions onClear={() => { setSearchDraft(""); setSearch(""); setRoleDraft("ALL"); setRoleFilter("ALL"); setStatusDraft("ALL"); setStatusFilter("ALL"); setPage(1); }} onSearch={() => { setSearch(searchDraft); setRoleFilter(roleDraft); setStatusFilter(statusDraft); setPage(1); }} /></div>
      <div className="list-result-controls"><DownloadMenu report={{ title: "Users", filters: activeFilterSummary({ Search: search.trim(), Role: roleFilter === "ALL" ? "ALL" : roleLabels[roleFilter as Role], Status: statusFilter }), columns: userColumns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel="User records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
      <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
      <div className="record-list">
        {paged.items.map((item) => (
          <div className="managed-record" key={item.id}>
            <div><strong>{item.name}</strong><span>{item.email} · {roleLabels[item.role]}</span></div>
            <div className="action-row">
              <button onClick={() => { setDraft(item); setEditing(true); }}>Edit</button>
              <button className="danger-action" disabled={item.id === actingUser.id} title={item.id === actingUser.id ? "You cannot archive your own signed-in account" : undefined} onClick={() => mutate((db) => archiveUser(db, item.id, "Archived by Admin", actingUser.id))}>Archive</button>
            </div>
          </div>
        ))}
      </div>
      {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearchDraft(""); setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); setPage(1); }}>Clear filters</button></div>}
      <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    </div>
  );
}

type RemoteDraft = Pick<AdminUser, "id" | "name" | "email" | "roleIds" | "branchIds" | "version">;

function RemoteUserManager({ config, actorId }: { config: CognitoConfig; actorId?: string }) {
  const [directory, setDirectory] = useState<AdminDirectory>({ users: [], roles: [], branches: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RemoteDraft>({ id: "", name: "", email: "", roleIds: [], branchIds: [], version: 0 });
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filteredUsers = directory.users.filter((item) => !needle || normalizeSearch(`${item.name} ${item.email} ${item.roles.map((role) => role.name).join(" ")} ${item.branches.map((branch) => branch.name).join(" ")} ${item.status}`).includes(needle));
  const pagedUsers = paginate(filteredUsers, page, pageSize);
  const clearSearch = () => { setSearchDraft(""); setSearch(""); setPage(1); };

  const refresh = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      setDirectory(await adminUsersApi.list(config));
      setError("");
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(true), 30_000);
    const onFocus = () => void refresh(true);
    window.addEventListener("focus", onFocus);
    return () => { window.clearInterval(interval); window.removeEventListener("focus", onFocus); };
  }, [config]);

  const run = async (action: () => Promise<unknown>, closeEditor = false) => {
    setBusy(true);
    setError("");
    try {
      await action();
      if (closeEditor) setEditing(false);
      await refresh(true);
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
      if (nextError instanceof AdminApiError && nextError.code === "VERSION_CONFLICT") await refresh(true);
    } finally { setBusy(false); }
  };

  const toggle = (kind: "roleIds" | "branchIds", id: string) => {
    const current = draft[kind];
    setDraft({ ...draft, [kind]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] });
  };

  const startNew = () => {
    setDraft({ id: "", name: "", email: "", roleIds: directory.roles[0] ? [directory.roles[0].id] : [], branchIds: directory.branches[0] ? [directory.branches[0].id] : [], version: 0 });
    setEditing(true);
    setError("");
  };

  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><div><h3>Users</h3><span>Accounts are tenant-scoped and invitations are sent by Cognito.</span></div><button className="primary-action" onClick={startNew}>Add User</button></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    {editing && <form onSubmit={(event) => {
      event.preventDefault();
      if (draft.id) void run(() => adminUsersApi.update(config, draft as AdminUser), true);
      else void run(() => adminUsersApi.create(config, { name: draft.name, email: draft.email, roleIds: draft.roleIds, branchIds: draft.branchIds }), true);
    }}>
      <div className="form-grid">
        <label>User name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
        <label>User email<input required type="email" disabled={Boolean(draft.id)} value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /><small>{draft.id ? "Email cannot be changed after invitation." : "Cognito will email a temporary password."}</small></label>
      </div>
      <fieldset className="assignment-fieldset"><legend>Roles</legend>{directory.roles.map((role) => <label key={role.id}><input type="checkbox" checked={draft.roleIds.includes(role.id)} onChange={() => toggle("roleIds", role.id)} />{role.name}</label>)}</fieldset>
      <fieldset className="assignment-fieldset"><legend>Permitted branches</legend>{directory.branches.map((branch) => <label key={branch.id}><input type="checkbox" checked={draft.branchIds.includes(branch.id)} onChange={() => toggle("branchIds", branch.id)} />{branch.name}</label>)}</fieldset>
      <div className="action-row"><button className="primary-action" disabled={busy}>{draft.id ? "Save Changes" : "Invite User"}</button><button type="button" disabled={busy} onClick={() => setEditing(false)}>Cancel</button></div>
    </form>}
    <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setSearch(searchDraft); setPage(1); } }}><label className="list-search">Search<input aria-label="Search remote users" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Name, email, role, branch or status" /></label><ListSearchActions onClear={clearSearch} onSearch={() => { setSearch(searchDraft); setPage(1); }} /></div>
    <div className="list-result-controls"><span className="result-summary">Showing {pagedUsers.from} to {pagedUsers.to} of {pagedUsers.totalCount}</span><PageSizeSelect ariaLabel="Remote user records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
    <ResultPagination page={pagedUsers.page} pageCount={pagedUsers.pageCount} onChange={setPage} />
    {loading ? <p className="empty-state">Loading users…</p> : <div className="record-list">{pagedUsers.items.map((item) => <div className="managed-record" key={item.id}>
      <div><strong>{item.name}</strong><span>{item.email} · {item.roles.map((role) => role.name).join(", ")}</span><span>{item.branches.map((branch) => branch.name).join(", ")} · <b className={`membership-status ${item.status.toLowerCase()}`}>{item.status === "INVITED" ? "Invitation pending" : item.status}</b></span></div>
      <div className="action-row">
        {item.status === "INVITED" && <button disabled={busy} onClick={() => void run(() => adminUsersApi.resend(config, item.id))}>Resend invite</button>}
        <button disabled={busy} onClick={() => { setDraft({ id: item.id, name: item.name, email: item.email, roleIds: item.roleIds, branchIds: item.branchIds, version: item.version }); setEditing(true); }}>Edit</button>
        <button className="danger-action" disabled={busy || item.id === actorId} title={item.id === actorId ? "You cannot archive your own signed-in account" : undefined} onClick={() => {
          const reason = window.prompt("Why is this user being archived?");
          if (reason?.trim()) void run(() => adminUsersApi.archive(config, item.id, reason));
        }}>Archive</button>
      </div>
    </div>)}</div>}
    {!loading && pagedUsers.totalCount === 0 && <div className="list-empty"><h3>No matching users</h3><button onClick={clearSearch}>Clear filters</button></div>}
    <ResultPagination page={pagedUsers.page} pageCount={pagedUsers.pageCount} onChange={setPage} />
  </div>;
}

function DuplicateJobSnapshot({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Status status={view.job.main_status} sub={view.job.sub_status} />
      <Info label="Customer" value={`${view.customer.name} / ${view.customer.mobile}`} />
      <Info label="Vehicle" value={`${view.vehicle.number} / ${view.vehicle.make} ${view.vehicle.model}`} />
      <Info label="Visit" value={`${view.visit.received_at} / ${view.visit.fuel}`} />
      <Info label="Advisor" value={view.advisor.name} />
      <Info label="Technician" value={view.technician.name} />
    </div>
  );
}

function LinkedRecords({ view }: { view: JobView }) {
  return (
    <div className="linked-grid">
      <Info label="Estimate Items" value={view.estimate_items.length} />
      <Info label="Materials" value={view.material_requests.length} />
      <Info label="Tasks" value={view.tasks.length} />
      <Info label="QC Checks" value={`${view.qc_checks.filter((item) => item.passed).length}/${view.qc_checks.length}`} />
      <Info label="Invoice" value={view.invoice?.invoice_no || "None"} />
      <Info label="Payments" value={money(view.payments.reduce((sum, item) => sum + item.amount, 0))} />
      <Info label="Photos" value={view.photos.length} />
      <Info label="Follow-ups" value={view.followups.length} />
      <Info label="Receipt" value={view.receipt?.receipt_no || "None"} />
      <Info label="Gate Pass" value={view.gate_pass?.gate_pass_no || "None"} />
    </div>
  );
}

function CustomerEditor({ value, setValue, mutate, embedded = false, onSaved }: { value: Customer; setValue: (value: Customer) => void; mutate: Mutate; embedded?: boolean; onSaved?: () => void }) {
  return (
    <form className={embedded ? "" : "desk-panel"} onSubmit={(event) => {
      event.preventDefault();
      if (mutate((db) => (value.id ? updateCustomer(db, value.id, value) : createCustomer(db, value)))) onSaved?.();
    }}>
      {!embedded && <PanelTitle icon={<UserRound />} title="Customer Form" subtitle={value.id ? "Edit selected customer" : "Add customer"} />}
      <label>Customer name<input aria-label="Customer name" required value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} /></label>
      <label>Mobile<input required value={value.mobile} onChange={(event) => setValue({ ...value, mobile: event.target.value })} /></label>
      <label>Type<input required value={value.type} onChange={(event) => setValue({ ...value, type: event.target.value })} /></label>
      <div className="action-row">
        <button className="primary-action">Save Customer</button>
        <button type="button" onClick={() => setValue({ id: 0, name: "", mobile: "", type: "Individual" })}>New</button>
        {value.id > 0 && <button type="button" className="danger-action" onClick={() => mutate((db) => archiveCustomer(db, value.id, "Archived from customer master"))}>Archive</button>}
      </div>
    </form>
  );
}

function VehicleMasterPanel({ state, value, setValue, mutate, embedded = false, onSaved }: { state: WorkshopState; value: Vehicle; setValue: (value: Vehicle) => void; mutate: Mutate; embedded?: boolean; onSaved?: () => void }) {
  const [draft, setDraft] = useState<Vehicle>(value);
  return (
    <form className={embedded ? "" : "desk-panel"} onSubmit={(event) => {
      event.preventDefault();
      if (mutate((db) => (draft.id ? updateVehicle(db, draft.id, draft) : createVehicle(db, draft)))) onSaved?.();
    }}>
      {!embedded && <PanelTitle icon={<Car />} title="Vehicle Form" subtitle="Vehicle master CRUD" />}
      <select value={draft.id} onChange={(event) => {
        const next = state.vehicles.find((item) => item.id === Number(event.target.value)) ?? { id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0 };
        setDraft(next);
        setValue(next);
      }}>
        <option value={0}>New vehicle</option>
        {state.vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.number}</option>)}
      </select>
      <label>Customer<select value={draft.customer_id} onChange={(event) => setDraft({ ...draft, customer_id: Number(event.target.value) })}>{state.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
      <div className="form-grid">
        <label>Number<input value={draft.number} onChange={(event) => setDraft({ ...draft, number: event.target.value })} /></label>
        <label>Make<input value={draft.make} onChange={(event) => setDraft({ ...draft, make: event.target.value })} /></label>
        <label>Model<input value={draft.model} onChange={(event) => setDraft({ ...draft, model: event.target.value })} /></label>
        <label>Color<input value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value })} /></label>
        <label>KM<input type="number" value={draft.km} onChange={(event) => setDraft({ ...draft, km: Number(event.target.value) })} /></label>
      </div>
      <div className="action-row">
        <button className="primary-action">Save Vehicle</button>
        {draft.id > 0 && <button type="button" className="danger-action" onClick={() => mutate((db) => archiveVehicle(db, draft.id, "Archived from vehicle master"))}>Archive</button>}
      </div>
    </form>
  );
}

function DuplicateVisitEditor({ view, advisors, mutate }: { view: JobView; advisors: User[]; mutate: Mutate }) {
  const [draft, setDraft] = useState({ advisor_id: view.visit.advisor_id, fuel: view.visit.fuel, keys: view.visit.keys, accessories: view.visit.accessories, requested_work: view.visit.requested_work, photos_note: view.visit.photos_note });
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => updateVisit(db, view.visit.id, draft));
    }}>
      <label>Advisor<select value={draft.advisor_id} onChange={(event) => setDraft({ ...draft, advisor_id: Number(event.target.value) })}>{advisors.map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}</select></label>
      <div className="form-grid">
        <label>Fuel<input value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value })} /></label>
        <label>Keys<input value={draft.keys} onChange={(event) => setDraft({ ...draft, keys: event.target.value })} /></label>
        <label>Accessories<input value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value })} /></label>
        <label>Photo Note<input value={draft.photos_note} onChange={(event) => setDraft({ ...draft, photos_note: event.target.value })} /></label>
      </div>
      <label>Requested Work<input value={draft.requested_work} onChange={(event) => setDraft({ ...draft, requested_work: event.target.value })} /></label>
      <button className="primary-action">Save Visit</button>
    </form>
  );
}

function JobEditor({ view, users, mutate, actor }: { view: JobView; users: User[]; mutate: Mutate; actor: User }) {
  const [draft, setDraft] = useState({
    advisor_id: view.job.advisor_id,
    technician_id: view.job.technician_id,
    work_list: view.job.work_list,
    promised_at: view.job.promised_at,
    advisor_notes: view.job.advisor_notes ?? "",
    customer_instructions: view.job.customer_instructions ?? "",
    internal_instructions: view.job.internal_instructions ?? "",
  });
  return (
    <>
      <form onSubmit={(event) => {
        event.preventDefault();
        mutate((db) => updateJobCardForActor(db, view.job.id, actor.id, draft));
      }}>
        <div className="form-grid">
          <label>Advisor<select value={draft.advisor_id} onChange={(event) => setDraft({ ...draft, advisor_id: Number(event.target.value) })}>{users.filter((item) => item.role === "service").map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}</select></label>
          <label>Technician<select value={draft.technician_id} onChange={(event) => setDraft({ ...draft, technician_id: Number(event.target.value) })}>{users.filter((item) => item.role === "tech").map((tech) => <option key={tech.id} value={tech.id}>{tech.name}</option>)}</select></label>
          <label>Main Status<select aria-label="Main Status" disabled value={view.job.main_status}><option>{view.job.main_status}</option></select></label>
          <label>Promised<input value={draft.promised_at} onChange={(event) => setDraft({ ...draft, promised_at: event.target.value })} /></label>
        </div>
        <label>Work List<input value={draft.work_list} onChange={(event) => setDraft({ ...draft, work_list: event.target.value })} /></label>
        <label>Customer Instructions<input value={draft.customer_instructions} onChange={(event) => setDraft({ ...draft, customer_instructions: event.target.value })} /></label>
        <label>Internal Instructions<input value={draft.internal_instructions} onChange={(event) => setDraft({ ...draft, internal_instructions: event.target.value })} /></label>
        <label>Advisor Notes<input value={draft.advisor_notes} onChange={(event) => setDraft({ ...draft, advisor_notes: event.target.value })} /></label>
        <button className="primary-action">Save Job Card</button>
      </form>
      <JobLifecyclePanel view={view} users={users} actor={actor} mutate={mutate} />
      <section className="editor-block job-card-documents" aria-label="Current job documents">
        <PanelTitle icon={<FileText />} title="Current Documents" subtitle="Only active records are available" />
        <JobDocuments view={view} actor={actor} mutate={mutate} />
      </section>
    </>
  );
}

function JobLifecyclePanel({ view, users, actor, mutate }: { view: JobView; users: User[]; actor: User; mutate: Mutate }) {
  const [target, setTarget] = useState<MainStatus>();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const allowed = MAIN_STATUS_TRANSITIONS[view.job.main_status].filter((status) => canTransitionJobStatus(actor, view.job, status));
  const terminal = isTerminalMainStatus(view.job.main_status);
  const canMutate = canMutateJobLifecycle(actor, view.job) && !terminal && view.job.main_status !== "HOLD";
  const cycle = [...view.checklist_cycles].sort((a, b) => b.id - a.id)[0];
  const items = view.checklist_items.filter((item) => item.checklist_cycle_id === cycle?.id).sort((a, b) => a.sort_order - b.sort_order);
  const firstOpen = items.findIndex((item) => !item.checked_at);
  const remaining = items.filter((item) => !item.checked_at);
  const toggleNotApplicable = (item: ChecklistItem, notApplicable: boolean) => {
    setError("");
    mutate((db) => setChecklistItemNotApplicableForActor(db, item.id, actor.id, notApplicable), setError);
  };
  const toggle = (item: ChecklistItem, checked: boolean) => {
    setError("");
    mutate((db) => setChecklistItemCheckedForActor(db, item.id, actor.id, checked), setError);
  };
  const confirm = (event: FormEvent) => {
    event.preventDefault();
    if (!note.trim()) { setError("A confirmation note is required."); return; }
    if (target && mutate((db) => transitionJobStatusForActor(db, view.job.id, actor.id, target, note), setError)) {
      setTarget(undefined); setNote(""); setError("");
    }
  };
  return <section className="editor-block lifecycle-panel" aria-label="Job lifecycle">
    <PanelTitle icon={<ClipboardList />} title="Lifecycle Checklist" subtitle={cycle ? `${cycle.stage} · cycle ${cycle.cycle_number}` : "No active cycle"} />
    <p className="remaining-steps" aria-live="polite">{remaining.length ? `${remaining.length} remaining: ${remaining.map((item) => item.label).join(" → ")}` : "All steps complete. The next lifecycle action is available."}</p>
    <ol className="lifecycle-checklist">
      {items.map((item, index) => {
        const laterChecked = items.some((candidate) => candidate.sort_order > item.sort_order && candidate.checked_at);
        const artifactLocked = (item.label === "Create Estimate" && !view.estimate) || (item.label === "Invoice Ready" && !view.invoice);
        const blockedByEarlier = items.some((candidate) => candidate.sort_order < item.sort_order && candidate.required && !candidate.checked_at);
        const enabled = canMutate && !artifactLocked && (item.checked_at ? !laterChecked : !blockedByEarlier);
        const notApplicable = Boolean(item.na_at);
        const actorName = item.checked_by === 0 ? "System" : users.find((user) => user.id === item.checked_by)?.name;
        const detail = notApplicable ? `N/A ${formatTimestamp(item.na_at!)}${actorName ? ` by ${users.find((user) => user.id === item.na_by)?.name ?? actorName}` : ""}` : item.checked_at ? `Completed ${formatTimestamp(item.checked_at)}${actorName ? ` by ${actorName}` : ""}` : item.started_at ? `Started ${formatTimestamp(item.started_at)}` : artifactLocked ? `Available after the ${item.label === "Invoice Ready" ? "invoice" : "estimate"} is saved` : "Waiting for the previous step";
        return <li key={item.id} className={item.checked_at ? "complete" : index === firstOpen ? "active" : "locked"}><label><input type="checkbox" checked={Boolean(item.checked_at)} disabled={!enabled} onChange={(event) => toggle(item, event.target.checked)} /><span><strong>{item.label}{!item.required && <em className="optional-tag"> (optional)</em>}</strong><small>{detail}</small></span></label>{canMutate && !artifactLocked && (notApplicable || !item.checked_at) && <button type="button" className="link-action" disabled={notApplicable && laterChecked} onClick={() => toggleNotApplicable(item, !notApplicable)}>{notApplicable ? "Undo N/A" : "Mark N/A"}</button>}</li>;
      })}
    </ol>
    {terminal && <p className="permission-note">This job is {view.job.main_status} and read-only.</p>}
    {!terminal && !canMutate && allowed.length === 0 && <p className="permission-note">Read only. Lifecycle changes are limited to the Owner and the linked Service Advisor.</p>}
    {error && !target && <p className="error-text" role="alert">{error}</p>}
    {allowed.length > 0 && <div className="action-row">{allowed.map((status) => <button type="button" key={status} className={status === "CANCELLED" ? "danger-action" : "primary-action"} onClick={() => { setTarget(status); setNote(""); setError(""); }}>{lifecycleActionLabel(view.job.main_status, status)}</button>)}</div>}
    {target && <Dialog title={`${lifecycleActionLabel(view.job.main_status, target)}?`} subtitle={`${view.job.job_no}: ${view.job.main_status} → ${target}`} onClose={() => { setTarget(undefined); setError(""); }}><form onSubmit={confirm}><label>Confirmation note<textarea data-dialog-initial-focus aria-describedby="lifecycle-note-help" value={note} onChange={(event) => setNote(event.target.value)} /></label><p id="lifecycle-note-help" className="field-help">Required. This note is recorded in status history.</p>{error && <p className="error-text" role="alert">{error}</p>}<div className="action-row"><button className="primary-action">Confirm status change</button><button type="button" onClick={() => setTarget(undefined)}>Cancel</button></div></form></Dialog>}
  </section>;
}

function lifecycleActionLabel(from: MainStatus, to: MainStatus) {
  if (to === "CANCELLED") return "Cancel Job";
  if (to === "HOLD") return "Put On Hold";
  if (from === "HOLD") return "Resume Work";
  if (from === "COMPLETED" && to === "IN_PROGRESS") return "Start Rework";
  if (to === "IN_PROGRESS") return "Start Work";
  if (to === "COMPLETED") return "Complete Work";
  return "Close Job";
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function EstimateEditor({ view, mutate, actor }: { view: JobView; mutate: Mutate; actor: User }) {
  const [open, setOpen] = useState(false);
  const canMutate = canMutateJobLifecycle(actor, view.job);
  return (
    <div className="desk-panel">
      <PanelTitle icon={<ReceiptText />} title="Estimate" subtitle={view.estimate ? `${view.estimate.status} · ${view.estimate_items.length} items` : "Not created"} />
      {view.estimate_items.map((existing) => (
        <div className="row" key={existing.id}>
          <strong>{existing.description}</strong><span>{existing.kind}</span><span>{money(existing.qty * existing.rate)}</span>
        </div>
      ))}
      {view.estimate && <><Info label="Discount" value={money(view.estimate.discount)} /><Info label="GST" value={`${view.estimate.gst_rate}%`} /><Info label="Notes" value={view.estimate.approval_note || "—"} /><Info label="Total" value={money(invoiceItemsTotal(view.estimate_items, view.estimate))} /></>}
      {canMutate ? <button className="primary-action" onClick={() => setOpen(true)}>{view.estimate ? "Edit Estimate" : "Create Estimate"}</button> : <p className="permission-note">Read only. Estimate changes are limited to the Owner and the linked Service Advisor.</p>}
      {open && <EstimateDialog view={view} actor={actor} mutate={mutate} onClose={() => setOpen(false)} />}
    </div>
  );
}

type EstimateDraftRow = { key: string; kind: "Service" | "Material"; description: string; qty: number; rate: number };

function EstimateDialog({ view, actor, mutate, onClose }: { view: JobView; actor: User; mutate: Mutate; onClose: () => void }) {
  const [items, setItems] = useState<EstimateDraftRow[]>(view.estimate_items.map((item) => ({ key: `saved-${item.id}`, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate })));
  const [discount, setDiscount] = useState(view.estimate?.discount ?? 0);
  const [gst, setGst] = useState(view.estimate?.gst_rate ?? 18);
  const [notes, setNotes] = useState(view.estimate?.approval_note ?? "");
  const [error, setError] = useState("");
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const total = Math.max(0, subtotal - discount) * (1 + gst / 100);
  const updateItem = (key: string, patch: Partial<EstimateDraftRow>) => setItems((rows) => rows.map((row) => row.key === key ? { ...row, ...patch } : row));
  const save = (event: FormEvent) => {
    event.preventDefault(); setError("");
    if (mutate((db) => saveEstimateForActor(db, view.job.id, actor.id, { discount, gst_rate: gst, notes, items }), setError)) onClose();
  };
  return <Dialog wide title={`${view.estimate ? "Edit" : "Create"} Estimate`} subtitle={`${view.job.job_no} · Changes apply only when saved`} onClose={onClose}><form onSubmit={save} className="estimate-dialog-form"><div className="estimate-items"><div className="estimate-item estimate-item-heading"><span>Kind</span><span>Description</span><span>Quantity</span><span>Rate</span><span>Action</span></div>{items.map((item, index) => <div className="estimate-item" key={item.key}><select aria-label={`Item ${index + 1} kind`} value={item.kind} onChange={(event) => updateItem(item.key, { kind: event.target.value as EstimateDraftRow["kind"] })}><option>Service</option><option>Material</option></select><input data-dialog-initial-focus={index === 0 ? true : undefined} aria-label={`Item ${index + 1} description`} value={item.description} onChange={(event) => updateItem(item.key, { description: event.target.value })} /><input aria-label={`Item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} onChange={(event) => updateItem(item.key, { qty: Number(event.target.value) })} /><input aria-label={`Item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.key, { rate: Number(event.target.value) })} /><button type="button" className="danger-action" aria-label={`Remove item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((row) => row.key !== item.key))}>Remove</button></div>)}</div><button type="button" onClick={() => setItems((rows) => [...rows, { key: `new-${Date.now()}-${rows.length}`, kind: "Service", description: "", qty: 1, rate: 0 }])}>Add Item</button><div className="form-grid"><label>Discount<input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /></label><label>Overall GST %<input type="number" min="0" step="0.01" value={gst} onChange={(event) => setGst(Number(event.target.value))} /></label></div><label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="estimate-total"><span>Subtotal {money(subtotal)}</span><strong>Total {money(total)}</strong></div>{error && <p className="error-text" role="alert">{error}</p>}<div className="action-row"><button className="primary-action">Save Estimate</button><button type="button" onClick={onClose}>Cancel</button></div></form></Dialog>;
}

function FollowupEditor({ view, mutate }: { view: JobView; mutate: Mutate }) {
  const [draft, setDraft] = useState<Followup>({ id: 0, job_card_id: view.job.id, note: "", due_at: new Date().toISOString().slice(0, 10), done: 0, outcome: "" });
  return (
    <form className="desk-panel" onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (draft.id ? updateFollowup(db, draft.id, draft) : createFollowup(db, draft)));
    }}>
      <PanelTitle icon={<ClipboardCheck />} title="Follow-ups" subtitle="Due date, outcome and completion" />
      {view.followups.map((followup) => <button type="button" className={draft.id === followup.id ? "row active" : "row"} key={followup.id} onClick={() => setDraft(followup)}><strong>{followup.due_at}</strong><span>{followup.done ? "Done" : "Open"}</span><span>{followup.note}</span></button>)}
      <label>Note<input value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} /></label>
      <div className="form-grid">
        <label>Due<input type="date" value={draft.due_at} onChange={(event) => setDraft({ ...draft, due_at: event.target.value })} /></label>
        <label>Outcome<input value={draft.outcome ?? ""} onChange={(event) => setDraft({ ...draft, outcome: event.target.value })} /></label>
      </div>
      <div className="action-row">
        <button className="primary-action">Save Follow-up</button>
        {draft.id > 0 && <button type="button" onClick={() => mutate((db) => markFollowupDone(db, draft.id, draft.outcome || "Done"))}>Mark Done</button>}
        {draft.id > 0 && <button type="button" className="danger-action" onClick={() => mutate((db) => archiveFollowup(db, draft.id, "Archived follow-up"))}>Archive</button>}
      </div>
    </form>
  );
}

function JobMediaPanel({ view, actor, mutate, embedded = false }: { view: JobView; actor: User; mutate: Mutate; embedded?: boolean }) {
  const [category, setCategory] = useState<JobMediaCategory>("Before Work");
  const [label, setLabel] = useState("");
  const [prepared, setPrepared] = useState<PreparedJobMedia>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Photo>();
  const [archiveTarget, setArchiveTarget] = useState<Photo>();
  const [archiveReason, setArchiveReason] = useState("");
  const canMutate = canMutateJobLifecycle(actor, view.job);
  const rows = view.photos.filter((photo) => photo.category === category && photo.src);
  const chooseFile = async (file?: File) => {
    setPrepared(undefined);
    setError("");
    if (!file) return;
    setBusy(true);
    try {
      const next = await compressMediaFile(file);
      setPrepared(next);
      if (!label.trim()) setLabel(file.name.replace(/\.[^.]+$/, ""));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not prepare this image.");
    } finally {
      setBusy(false);
    }
  };
  const upload = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!prepared) { setError("Choose an image to upload."); return; }
    if (mutate((db) => saveJobPhotoForActor(db, view.job.id, actor.id, { label, category, ...prepared }), setError)) {
      setLabel("");
      setPrepared(undefined);
      const input = document.getElementById(`job-media-file-${view.job.id}`) as HTMLInputElement | null;
      if (input) input.value = "";
    }
  };
  return <section className={embedded ? "job-media-panel" : "desk-panel job-media-panel"} aria-label="Job card photos and media">
    {!embedded && <PanelTitle icon={<Camera />} title="Photos / Media" subtitle="Compressed images stay in this browser session" />}
    <div className="sub-tabs media-phase-tabs" role="tablist" aria-label="Photo work phase" onKeyDown={handleTabListKeyDown}>
      {(["Before Work", "After Work"] as const).map((phase) => { const id = phase === "Before Work" ? "before" : "after"; return <button type="button" id={`media-tab-${view.job.id}-${id}`} role="tab" aria-selected={category === phase} aria-controls={`media-panel-${view.job.id}-${id}`} tabIndex={category === phase ? 0 : -1} className={category === phase ? "active" : ""} key={phase} onClick={() => setCategory(phase)}>{phase}</button>; })}
    </div>
    <div id={`media-panel-${view.job.id}-${category === "Before Work" ? "before" : "after"}`} role="tabpanel" aria-labelledby={`media-tab-${view.job.id}-${category === "Before Work" ? "before" : "after"}`}>
    {canMutate ? <form className="media-upload" onSubmit={upload}>
      <div className="form-grid">
        <label>Photo label<input value={label} onChange={(event) => setLabel(event.target.value)} placeholder={`${category} photo`} /></label>
        <label>Image file<input id={`job-media-file-${view.job.id}`} aria-describedby={`job-media-help-${view.job.id}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void chooseFile(event.target.files?.[0])} /></label>
      </div>
      <p className="field-help" id={`job-media-help-${view.job.id}`}>JPEG, PNG, or WebP; maximum input 10 MB. Images are compressed below 1 MB and are not stored outside this session.</p>
      {prepared && <p className="media-ready" aria-live="polite">Ready: {prepared.width} × {prepared.height} · {Math.ceil(prepared.byteSize / 1024)} KB</p>}
      {error && <p className="error-text" role="alert">{error}</p>}
      <button className="primary-action" disabled={busy}>{busy ? "Compressing…" : `Upload to ${category}`}</button>
    </form> : <p className="permission-note">Read only. Media changes are limited to the Owner and the linked Service Advisor.</p>}
    {rows.length ? <div className="job-media-gallery" data-testid="job-media-gallery">
      {rows.map((photo) => <article className="job-media-card" key={photo.id}>
        <img src={photo.src} alt={photo.label} />
        <div><strong>{photo.label}</strong><span>{photo.original_name || photo.mime_type || "Image"}{photo.byte_size ? ` · ${Math.ceil(photo.byte_size / 1024)} KB` : ""}</span></div>
        {canMutate && <div className="record-actions"><button type="button" onClick={() => setEditing(photo)}>Edit</button><button type="button" className="danger-action" onClick={() => { setArchiveTarget(photo); setArchiveReason(""); }}>Archive</button></div>}
      </article>)}
    </div> : <p className="empty-state">No {category.toLocaleLowerCase()} images yet.</p>}
    {editing && <MediaMetadataDialog photo={editing} actor={actor} mutate={mutate} onClose={() => setEditing(undefined)} />}
    {archiveTarget && <Dialog title="Archive photo?" subtitle={archiveTarget.label} onClose={() => setArchiveTarget(undefined)}><form onSubmit={(event) => { event.preventDefault(); setError(""); if (mutate((db) => archiveJobPhotoForActor(db, archiveTarget.id, actor.id, archiveReason), setError)) setArchiveTarget(undefined); }}><label>Archive reason<textarea data-dialog-initial-focus required value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} /></label>{error && <p className="error-text" role="alert">{error}</p>}<div className="dialog-actions"><button type="button" onClick={() => setArchiveTarget(undefined)}>Cancel</button><button className="danger-action">Archive photo</button></div></form></Dialog>}
    </div>
  </section>;
}

function MediaMetadataDialog({ photo, actor, mutate, onClose }: { photo: Photo; actor: User; mutate: Mutate; onClose: () => void }) {
  const [label, setLabel] = useState(photo.label);
  const [category, setCategory] = useState<JobMediaCategory>(photo.category === "After Work" ? "After Work" : "Before Work");
  const [error, setError] = useState("");
  return <Dialog title="Edit photo metadata" subtitle={photo.original_name || photo.label} onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); if (mutate((db) => updateJobPhotoForActor(db, photo.id, actor.id, { label, category }), setError)) onClose(); }}><label>Photo label<input data-dialog-initial-focus value={label} onChange={(event) => setLabel(event.target.value)} /></label><label>Work phase<select value={category} onChange={(event) => setCategory(event.target.value as JobMediaCategory)}><option>Before Work</option><option>After Work</option></select></label>{error && <p className="error-text" role="alert">{error}</p>}<div className="dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary-action">Save metadata</button></div></form></Dialog>;
}

function MaterialRequestEditor({ state, mutate, embedded = false }: { state: WorkshopState; mutate: Mutate; embedded?: boolean }) {
  const [draft, setDraft] = useState<MaterialRequest>({ id: 0, job_card_id: state.jobs[0]?.job.id ?? 0, item_id: state.inventory[0]?.id ?? 0, requested_qty: 1, issued_qty: 0, used_qty: 0, returned_qty: 0, wasted_qty: 0 });
  const requests = state.jobs.flatMap((view) => view.material_requests.map((request) => ({ ...request, job_card_id: view.job.id })));
  return (
    <form className={embedded ? "" : "desk-panel"} onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (draft.id ? updateMaterialRequest(db, draft.id, draft) : createMaterialRequest(db, draft)));
    }}>
      {!embedded && <PanelTitle icon={<PackageCheck />} title="Request Form" subtitle="Job-linked material request" />}
      <select value={draft.id} onChange={(event) => setDraft(requests.find((item) => item.id === Number(event.target.value)) ?? { ...draft, id: 0 })}><option value={0}>New request</option>{requests.map((request) => <option key={request.id} value={request.id}>Request #{request.id}</option>)}</select>
      <label>Job<select value={draft.job_card_id} onChange={(event) => setDraft({ ...draft, job_card_id: Number(event.target.value) })}>{state.jobs.map((job) => <option key={job.job.id} value={job.job.id}>{job.job.job_no}</option>)}</select></label>
      <label>Item<select value={draft.item_id} onChange={(event) => setDraft({ ...draft, item_id: Number(event.target.value) })}>{state.inventory.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Requested Qty<input type="number" value={draft.requested_qty} onChange={(event) => setDraft({ ...draft, requested_qty: Number(event.target.value) })} /></label>
      <div className="action-row">
        <button className="primary-action">Save Request</button>
        {draft.id > 0 && <button type="button" className="danger-action" onClick={() => mutate((db) => archiveMaterialRequest(db, draft.id, "Archived material request"))}>Archive</button>}
      </div>
    </form>
  );
}

function IssueMaterialEditor({ requests, mutate }: { requests: { view: JobView; request: MaterialRequest; item?: InventoryItem }[]; mutate: Mutate }) {
  const [requestId, setRequestId] = useState(requests[0]?.request.id ?? 0);
  const [qty, setQty] = useState(1);
  return <form className="desk-panel" onSubmit={(event) => { event.preventDefault(); mutate((db) => issueMaterialQty(db, requestId, qty)); }}><PanelTitle icon={<Package />} title="Issue Quantity" subtitle="Validated against stock" /><select value={requestId} onChange={(event) => setRequestId(Number(event.target.value))}>{requests.map(({ view, request, item }) => <option key={request.id} value={request.id}>{view.job.job_no} / {item?.name}</option>)}</select><label>Issue Qty<input type="number" value={qty} onChange={(event) => setQty(Number(event.target.value))} /></label><button className="primary-action">Issue Material</button></form>;
}

function ReconcileEditor({ requests, mutate }: { requests: { view: JobView; request: MaterialRequest; item?: InventoryItem }[]; mutate: Mutate }) {
  const selected = requests[0]?.request;
  const [requestId, setRequestId] = useState(selected?.id ?? 0);
  const request = requests.find((item) => item.request.id === requestId)?.request ?? selected;
  const [used, setUsed] = useState(request?.used_qty ?? 0);
  const [returned, setReturned] = useState(request?.returned_qty ?? 0);
  const [wasted, setWasted] = useState(request?.wasted_qty ?? 0);
  const variance = (request?.issued_qty ?? 0) - used - returned - wasted;
  return <form className="desk-panel" onSubmit={(event) => { event.preventDefault(); mutate((db) => reconcileMaterialQty(db, requestId, used, returned, wasted)); }}><PanelTitle icon={<Check />} title="Reconcile Material" subtitle={`Variance ${variance}`} /><select value={requestId} onChange={(event) => setRequestId(Number(event.target.value))}>{requests.map(({ view, request: item, item: stock }) => <option key={item.id} value={item.id}>{view.job.job_no} / {stock?.name}</option>)}</select><div className="form-grid"><label>Used<input type="number" value={used} onChange={(event) => setUsed(Number(event.target.value))} /></label><label>Returned<input type="number" value={returned} onChange={(event) => setReturned(Number(event.target.value))} /></label><label>Wasted<input type="number" value={wasted} onChange={(event) => setWasted(Number(event.target.value))} /></label></div><button className="primary-action">Save Reconciliation</button></form>;
}

function InventoryEditor({ state, mutate, embedded = false }: { state: WorkshopState; mutate: Mutate; embedded?: boolean }) {
  const [draft, setDraft] = useState<InventoryItem>(state.inventory[0] ?? { id: 0, sku: "", category: "", name: "", unit: "", stock_qty: 0, low_stock_qty: 0 });
  const [movementQty, setMovementQty] = useState(1);
  return (
    <form className={embedded ? "" : "desk-panel"} onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (draft.id ? updateInventoryItem(db, draft.id, draft) : createInventoryItem(db, draft)));
    }}>
      {!embedded && <PanelTitle icon={<Boxes />} title="Stock Form" subtitle="Master, stock-in and adjustment" />}
      <select value={draft.id} onChange={(event) => setDraft(state.inventory.find((item) => item.id === Number(event.target.value)) ?? { id: 0, sku: "", category: "", name: "", unit: "piece", stock_qty: 0, low_stock_qty: 0 })}><option value={0}>New item</option>{state.inventory.map((item) => <option key={item.id} value={item.id}>{item.sku}</option>)}</select>
      <div className="form-grid">
        <label>SKU<input value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} /></label>
        <label>Category<input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label>
        <label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
        <label>Unit<input value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value })} /></label>
        <label>Stock<input type="number" value={draft.stock_qty} onChange={(event) => setDraft({ ...draft, stock_qty: Number(event.target.value) })} /></label>
        <label>Low Stock<input type="number" value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value) })} /></label>
      </div>
      <label>Movement Qty<input type="number" value={movementQty} onChange={(event) => setMovementQty(Number(event.target.value))} /></label>
      <div className="action-row">
        <button className="primary-action">Save Item</button>
        {draft.id > 0 && <button type="button" onClick={() => mutate((db) => stockIn(db, draft.id, movementQty, "Manual stock-in"))}>Stock In</button>}
        {draft.id > 0 && <button type="button" onClick={() => mutate((db) => adjustStock(db, draft.id, movementQty, "Manual adjustment"))}>Set Stock</button>}
        {draft.id > 0 && <button type="button" className="danger-action" onClick={() => mutate((db) => archiveInventoryItem(db, draft.id, "Archived inventory item"))}>Archive</button>}
      </div>
    </form>
  );
}

function TaskCreator({ view, users, mutate, onCreated }: { view: JobView; users: User[]; mutate: Mutate; embedded?: boolean; onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const technicianId = users.find((item) => item.role === "tech")?.id ?? view.job.technician_id;
  return <form onSubmit={(event) => { event.preventDefault(); if (mutate((db) => createTask(db, { job_card_id: view.job.id, technician_id: technicianId, title, status: "Pending", notes }))) { setTitle(""); setNotes(""); onCreated?.(); } }}><label>New Task<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Notes<input value={notes} onChange={(event) => setNotes(event.target.value)} /></label><button>Add Task</button></form>;
}

function QcEditor({ view, technicianId, mutate }: { view: JobView; technicianId: number; mutate: Mutate }) {
  const [reason, setReason] = useState("Rework required");
  return (
    <div className="qc-box">
      {view.qc_checks.map((check: QcCheck) => <div className="request-line" key={check.id}><strong>{check.label}</strong><span>{check.passed ? "Pass" : check.fail_reason || "Pending"}</span><div className="action-row"><button onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}>Pass</button><button onClick={() => mutate((db) => failQcWithRework(db, check.id, technicianId, reason))}>Fail + Rework</button></div></div>)}
      <label>Fail/Rework Reason<input value={reason} onChange={(event) => setReason(event.target.value)} /></label>
      <div className="action-row">
        <button onClick={() => mutate((db) => markWashingNeeded(db, view.job.id))}>Washing Needed</button>
        <button onClick={() => mutate((db) => passQc(db, view.job.id))}>Pass All QC</button>
      </div>
    </div>
  );
}

function InvoiceSummary({ view }: { view: JobView }) {
  return (
    <div>
      {view.estimate_items.map((item) => <Info key={item.id} label={item.description} value={money(item.qty * item.rate)} />)}
      <Info label="Discount" value={money(view.estimate?.discount ?? 0)} />
      <Info label="GST" value={`${view.estimate?.gst_rate ?? 18}%`} />
      <Info label="Draft Total" value={money(invoiceItemsTotal(view.estimate_items, view.estimate))} />
      <Info label="Generated Total" value={money(view.invoice?.total ?? 0)} />
    </div>
  );
}

function DataFlowWorkspace({ jobs, users }: { jobs: JobView[]; users: User[] }) {
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const months = useMemo(() => dataFlowMonths(jobs), [jobs]);
  const dates = useMemo(() => dataFlowDates(jobs, month), [jobs, month]);
  const options = useMemo(() => filterDataFlowJobs(jobs, { query, month, date }), [jobs, query, month, date]);
  const selected = jobs.find((view) => view.job.id === selectedId);

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  useEffect(() => {
    if (selectedId && !options.some((view) => view.job.id === selectedId)) setSelectedId(undefined);
    setActiveIndex((index) => Math.max(-1, Math.min(index, options.length - 1)));
  }, [options, selectedId]);

  const choose = (view: JobView) => {
    setSelectedId(view.job.id);
    setQuery(view.job.job_no);
    setOpen(false);
  };
  const clear = () => {
    setMonth(""); setDate(""); setQuery(""); setSelectedId(undefined); setOpen(false); setActiveIndex(-1);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => event.key === "ArrowDown" ? Math.min(index + 1, options.length - 1) : index < 0 ? options.length - 1 : Math.max(index - 1, 0));
    } else if (event.key === "Enter" && options.length > 0) {
      event.preventDefault(); choose(options[Math.max(0, activeIndex)]);
    } else if (event.key === "Escape") {
      event.preventDefault(); setOpen(false);
    }
  };

  return <section className="workspace single-panel">
    <div className="desk-panel data-flow">
      <PanelTitle icon={<ClipboardCheck />} title="Data Flow" subtitle={selected?.job.job_no ?? "Select a job"} />
      <div className="data-flow-filters" ref={rootRef}>
        <label>Visit month
          <select aria-label="Visit month" value={month} onChange={(event) => { setMonth(event.target.value); setDate(""); setQuery(""); setSelectedId(undefined); setOpen(false); }}>
            <option value="">All months</option>
            {months.map((value) => <option key={value} value={value}>{new Date(`${value}-01T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</option>)}
          </select>
        </label>
        <label>Visit date
          <select aria-label="Visit date" value={date} onChange={(event) => { const next = event.target.value; setDate(next); if (next) setMonth(next.slice(0, 7)); setQuery(""); setSelectedId(undefined); setOpen(false); }}>
            <option value="">All dates</option>
            {dates.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <div className="data-flow-combobox">
          <label htmlFor="data-flow-job-search">Find a job</label>
          <input id="data-flow-job-search" type="search" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="data-flow-job-options" aria-activedescendant={open && options[activeIndex] ? `data-flow-job-${options[activeIndex].job.id}` : undefined} autoComplete="off" value={query} placeholder="Job, vehicle, customer or mobile" onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setSelectedId(undefined); setOpen(true); setActiveIndex(-1); }} onKeyDown={onKeyDown} />
          {open && <div id="data-flow-job-options" className="data-flow-options" role="listbox" aria-label="Matching jobs">
            {options.length ? options.map((view, index) => <button id={`data-flow-job-${view.job.id}`} type="button" role="option" aria-selected={selectedId === view.job.id} className={index === activeIndex ? "highlighted" : ""} key={view.job.id} onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(view)}><strong>{view.job.job_no}</strong><span>{view.vehicle.number} · {view.customer.name}</span></button>) : <p className="data-flow-no-matches" role="status">No matching jobs</p>}
          </div>}
        </div>
        <button type="button" className="data-flow-clear" onClick={clear}>Clear</button>
      </div>
      {!jobs.length ? <div className="empty-state">No jobs are available.</div> : selected ? <DataFlow view={selected} users={users} /> : <div className="empty-state">Select a job to view its data flow.</div>}
    </div>
  </section>;
}

function DocumentDownloadButton({ kind, view, className = "document-download" }: { kind: DocumentKind; view: JobView; className?: string }) {
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const download = async () => {
    setStatus("generating");
    setErrorMessage("");
    try {
      if (kind === "estimate" || kind === "invoice") {
        await new Promise<void>((resolve) => window.setTimeout(resolve, 50));
        if (!downloadJobDocument(kind, view, loadAdminDemoState().businessSettings)) throw new Error("Document is not available.");
      } else {
        const result = printJobDocument(kind, view, loadAdminDemoState());
        if (!result.ok) throw new Error(result.error);
      }
      setStatus("idle");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Document generation failed. Please try again.");
      setStatus("error");
    }
  };
  return <><button type="button" className={className} disabled={status === "generating"} aria-busy={status === "generating"} onClick={download}><Download size={15} />{status === "generating" ? "Generating…" : kind === "estimate" || kind === "invoice" ? "Download PDF" : "Print / Save as PDF"}</button>{status === "error" && <span className="document-error" role="alert">{errorMessage}</span>}</>;
}

function DataFlow({ view, users }: { view: JobView; users: User[] }) {
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const lifecycle = summarizeJobLifecycle(view);
  const steps = [
    ["Visit", Boolean(view.visit), view.visit.received_at],
    ["Estimate", Boolean(view.estimate), view.estimate?.status ?? "Missing"],
    ["Job Card", Boolean(view.job), view.job.sub_status],
    ["Material", view.material_requests.length > 0, `${view.material_requests.length} request(s)`],
    ["Work", view.tasks.length > 0, `${view.tasks.filter((task) => task.status === "Completed").length}/${view.tasks.length} complete`],
    ["QC", view.job.qc_status === "Pass", view.job.qc_status],
    ["Invoice", Boolean(view.invoice?.tally_invoice_no), view.invoice?.tally_invoice_no || "Missing"],
    ["Payment", Boolean(view.invoice && paid >= view.invoice.total), money(paid)],
    ["Payment Receipt", Boolean(view.receipt && view.payments.length), view.receipt?.receipt_no || "Missing"],
    ["Gate Pass", Boolean(view.gate_pass), view.gate_pass?.gate_pass_no || "Missing"],
  ];
  return (
    <>
      <section className="lifecycle-summary" aria-label="Active lifecycle stage">
        <div><span>Active stage</span><strong>{lifecycle.stage}{lifecycle.cycle ? ` · cycle ${lifecycle.cycle}` : ""}</strong></div>
        <div><span>Current step</span><strong>{lifecycle.activeStep}</strong></div>
        <div className="lifecycle-summary-remaining"><span>Ordered remaining steps</span><strong>{lifecycle.remainingSteps.length ? lifecycle.remainingSteps.join(" → ") : "None"}</strong></div>
      </section>
      {steps.map(([label, ok, detail]) => <div key={String(label)} className={ok ? "flow-step ok" : "flow-step blocked"}><Check size={16} />{label}: {detail}{(["Estimate", "Job Card", "Invoice", "Payment Receipt", "Gate Pass"].includes(String(label))) && (() => { const kind = String(label).toLowerCase().replaceAll(" ", "-") as DocumentKind; const descriptor = resolveJobDocuments(view).find((item) => item.kind === kind); return descriptor?.available ? <DocumentDownloadButton kind={kind} view={view} /> : descriptor?.message ? <span className="document-missing">{descriptor.message}</span> : null; })()}</div>)}
      {closureBlockers(view).map((blocker) => <p className="blocker-pill" key={blocker}>{blocker}</p>)}
      <Timeline view={view} users={users} />
    </>
  );
}

function JobSelector({ jobs, selectedJobId, onSelect, label = "Select job" }: { jobs: JobView[]; selectedJobId?: number; onSelect: (id: number) => void; label?: string }) {
  const [query, setQuery] = useState("");
  const needle = normalizeSearch(query);
  const options = jobs.filter((view) => !needle || normalizeSearch(`${view.job.job_no} ${view.vehicle.number} ${view.vehicle.make} ${view.vehicle.model} ${view.customer.name} ${view.customer.mobile}`).includes(needle));
  return <div className="job-selector"><label>{label}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job, vehicle, customer or mobile" /></label><label>Matching jobs<select aria-label="Job results" value={selectedJobId ?? ""} onChange={(event) => event.target.value && onSelect(Number(event.target.value))}><option value="">Choose a job</option>{options.map((view) => <option key={view.job.id} value={view.job.id}>{view.job.job_no} · {view.vehicle.number} · {view.customer.name}</option>)}</select></label></div>;
}

function JobDocuments({ view, actor, mutate }: { view: JobView; actor: User; mutate: Mutate }) {
  const [editor, setEditor] = useState<"estimate" | "invoice">();
  const documents = resolveJobDocuments(view);
  return <><div className="document-center">{documents.length ? documents.map((document) => {
    const actions = resolveJobDocumentActions(document.kind, view, actor);
    return <div className={`document-row ${document.available ? "available" : "missing"}`} key={document.kind}><div><strong>{document.label}</strong><span>{document.available ? "Ready from current job data" : document.message}</span></div><div className="document-actions">{actions.includes("create-estimate") && <button type="button" className="primary-action" onClick={() => setEditor("estimate")}>Create Estimate</button>}{actions.includes("edit-estimate") && <button type="button" onClick={() => setEditor("estimate")}>Edit</button>}{actions.includes("create-invoice") && <button type="button" className="primary-action" onClick={() => setEditor("invoice")}>Create Invoice</button>}{actions.includes("edit-invoice") && <button type="button" onClick={() => setEditor("invoice")}>Edit</button>}{actions.includes("download") && <DocumentDownloadButton kind={document.kind} view={view} className="primary-action document-download" />}</div></div>;
  }) : <p className="empty-state">No documents are available for this job.</p>}</div>{editor === "estimate" && <EstimateDialog view={view} actor={actor} mutate={mutate} onClose={() => setEditor(undefined)} />}{editor === "invoice" && <InvoiceDialog fixedJob action={view.invoice ? "edit" : "create"} view={view} actor={actor} mutate={mutate} onClose={() => setEditor(undefined)} />}</>;
}

function JobRecordDialog({ view, state, mutate, actor, mode, onClose, onAdminArchive }: { view: JobView; state: WorkshopState; mutate: Mutate; actor: User; mode: "view" | "edit"; onClose: () => void; onAdminArchive?: () => boolean }) {
  const [tab, setTab] = useState<"details" | "media" | "documents">("details");
  const archive = () => {
    if (!onAdminArchive || !window.confirm(`Archive Job ${view.job.job_no}? This will cancel the job card.`)) return;
    if (onAdminArchive()) onClose();
  };
  const panelId = `job-record-${view.job.id}-${tab}`;
  return <Dialog wide title={`${mode === "view" ? "View" : "Edit"} Job ${view.job.job_no}`} subtitle={`${view.vehicle.number} · ${view.customer.name}`} onClose={onClose}><div className="sub-tabs" role="tablist" aria-label="Job record sections" onKeyDown={handleTabListKeyDown}>{(["details", "media", "documents"] as const).map((item) => <button id={`job-record-tab-${view.job.id}-${item}`} aria-controls={`job-record-${view.job.id}-${item}`} tabIndex={tab === item ? 0 : -1} key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "details" ? "Details" : item === "media" ? "Photos / Media" : "Documents"}</button>)}</div><div id={panelId} role="tabpanel" aria-labelledby={`job-record-tab-${view.job.id}-${tab}`}>{tab === "documents" ? <JobDocuments view={view} actor={actor} mutate={mutate} /> : tab === "media" ? <JobMediaPanel embedded view={view} actor={actor} mutate={mutate} /> : mode === "edit" ? <><JobEditor key={view.job.updated_at} view={view} users={state.users} mutate={mutate} actor={actor} />{onAdminArchive && <div className="admin-archive-action"><button type="button" className="danger-action" onClick={archive}>Archive Job</button></div>}</> : <div className="record-view"><JobSnapshot view={view} /><Info label="Requested work" value={view.visit.requested_work} /><Info label="Work completed" value={view.job.work_list || "—"} /><Info label="Advisor" value={view.advisor.name} /><Info label="Technician" value={view.technician.name} /><JobDocuments view={view} actor={actor} mutate={mutate} /></div>}</div></Dialog>;
}

function CustomerRecordDialog({ customer, state, mutate, mode, onClose }: { customer: Customer; state: WorkshopState; mutate: Mutate; mode: "view" | "edit"; onClose: () => void }) {
  const [draft, setDraft] = useState(customer);
  const vehicles = state.vehicles.filter((vehicle) => vehicle.customer_id === customer.id);
  const jobs = state.jobs.filter((view) => view.customer.id === customer.id);
  return <Dialog wide title={`${mode === "view" ? "View" : "Edit"} Customer`} subtitle={`${customer.name} · ${customer.mobile}`} onClose={onClose}>{mode === "edit" ? <CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={onClose} /> : <div className="record-view"><Info label="Customer type" value={customer.type} /><Info label="Vehicles" value={vehicles.length} />{vehicles.map((vehicle) => <Info key={vehicle.id} label={vehicle.number} value={`${vehicle.make} ${vehicle.model}`} />)}<Info label="Jobs" value={jobs.length} />{jobs.map((view) => <Info key={view.job.id} label={view.job.job_no} value={`${view.vehicle.number} · ${view.job.main_status}`} />)}</div>}</Dialog>;
}

function VehicleRecordDialog({ vehicle, state, mutate, mode, onClose }: { vehicle: Vehicle; state: WorkshopState; mutate: Mutate; mode: "view" | "edit"; onClose: () => void }) {
  const [draft, setDraft] = useState(vehicle);
  const owner = state.customers.find((customer) => customer.id === vehicle.customer_id);
  const jobs = state.jobs.filter((view) => view.vehicle.id === vehicle.id);
  return <Dialog wide title={`${mode === "view" ? "View" : "Edit"} Vehicle`} subtitle={`${vehicle.number} · ${vehicle.make} ${vehicle.model}`} onClose={onClose}>{mode === "edit" ? <VehicleMasterPanel embedded state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={onClose} /> : <div className="record-view"><Info label="Registration" value={vehicle.number} /><Info label="Make / model" value={`${vehicle.make} ${vehicle.model}`} /><Info label="Color" value={vehicle.color} /><Info label="Odometer" value={`${vehicle.km.toLocaleString("en-IN")} km`} /><Info label="Owner" value={owner ? `${owner.name} · ${owner.mobile}` : "—"} /><Info label="Linked jobs" value={jobs.length} />{jobs.map((view) => <Info key={view.job.id} label={view.job.job_no} value={`${view.job.main_status} · ${view.visit.received_at.slice(0, 10)}`} />)}</div>}</Dialog>;
}

function Timeline({ view, users = [] }: { view: JobView; users?: User[] }) {
  const events = buildDataFlowTimeline(view, users);
  return <section className="data-flow-timeline" aria-label="Chronological data flow"><PanelTitle icon={<ClipboardCheck />} title="Chronological Data Flow" subtitle={`${events.length} event${events.length === 1 ? "" : "s"}`} /><ol>{events.map((event) => <li key={event.id} className={`timeline-event ${event.state ?? ""}`} data-event-kind={event.kind}><time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time><div><strong>{event.title}</strong><span>{event.detail}</span>{event.actor && <small>Actor: {event.actor}</small>}</div>{event.state && <span className="timeline-state">{event.state}</span>}</li>)}</ol></section>;
}

function JobSnapshot({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Info label="Customer" value={`${view.customer.name} / ${view.customer.mobile}`} />
      <Info label="Vehicle" value={`${view.vehicle.number} / ${view.vehicle.make} ${view.vehicle.model}`} />
      <Info label="Job Card" value={view.job.job_no} />
      <Info label="Status" value={`${view.job.main_status} / ${view.job.sub_status}`} />
    </div>
  );
}

function VisitEditor({ view, advisors, mutate }: { view: JobView; advisors: User[]; mutate: Mutate }) {
  const [advisorId, setAdvisorId] = useState(view.visit.advisor_id);
  return (
    <div className="editor-block">
      <label>
        Advisor
        <select value={advisorId} onChange={(event) => setAdvisorId(Number(event.target.value))}>
          {advisors.map((advisor) => (
            <option key={advisor.id} value={advisor.id}>{advisor.name}</option>
          ))}
        </select>
      </label>
      <button onClick={() => mutate((db) => updateJobCard(db, view.job.id, { advisor_id: advisorId }))}>Update Advisor</button>
    </div>
  );
}

function DuplicateCustomerEditor({ value, setValue, mutate }: { value: Customer; setValue: (value: Customer) => void; mutate: Mutate }) {
  return (
    <div className="desk-panel">
      <PanelTitle icon={<UserRound />} title="Customer Editor" subtitle="Update selected customer" />
      <label>Name<input value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} /></label>
      <label>Mobile<input value={value.mobile} onChange={(event) => setValue({ ...value, mobile: event.target.value })} /></label>
      <label>Type<input value={value.type} onChange={(event) => setValue({ ...value, type: event.target.value })} /></label>
      <div className="action-row">
        <button disabled={!value.id} onClick={() => mutate((db) => updateCustomer(db, value.id, { name: value.name, mobile: value.mobile, type: value.type }))}>Save Customer</button>
        <button className="danger-action" disabled={!value.id} onClick={() => mutate((db) => archiveCustomer(db, value.id, "Archived from customer desk"))}>Archive</button>
      </div>
    </div>
  );
}

function DuplicateVehicleMasterPanel({ state, value, setValue, mutate }: { state: WorkshopState; value: Vehicle; setValue: (value: Vehicle) => void; mutate: Mutate }) {
  return (
    <div className="desk-panel">
      <PanelTitle icon={<Car />} title="Vehicle Editor" subtitle="Update selected vehicle" />
      <label>Customer<select value={value.customer_id} onChange={(event) => setValue({ ...value, customer_id: Number(event.target.value) })}>{state.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
      <label>Number<input value={value.number} onChange={(event) => setValue({ ...value, number: event.target.value })} /></label>
      <label>Make<input value={value.make} onChange={(event) => setValue({ ...value, make: event.target.value })} /></label>
      <label>Model<input value={value.model} onChange={(event) => setValue({ ...value, model: event.target.value })} /></label>
      <label>Color<input value={value.color} onChange={(event) => setValue({ ...value, color: event.target.value })} /></label>
      <label>KM<input type="number" value={value.km} onChange={(event) => setValue({ ...value, km: Number(event.target.value) })} /></label>
      <div className="action-row">
        <button disabled={!value.id} onClick={() => mutate((db) => updateVehicle(db, value.id, { customer_id: value.customer_id, number: value.number, make: value.make, model: value.model, color: value.color, km: value.km }))}>Save Vehicle</button>
        <button className="danger-action" disabled={!value.id} onClick={() => mutate((db) => archiveVehicle(db, value.id, "Archived from vehicle desk"))}>Archive</button>
      </div>
    </div>
  );
}

function DuplicateEstimateEditor({ view, mutate }: { view: JobView; mutate: Mutate }) {
  const estimateId = view.estimate?.id;
  const [draft, setDraft] = useState({ kind: "Service" as EstimateItem["kind"], description: "Additional work", qty: 1, rate: 1000 });
  return (
    <div className="desk-panel">
      <PanelTitle icon={<ReceiptText />} title="Estimate Items" subtitle="Edit line items" />
      {view.estimate_items.map((item) => (
        <div className="request-line" key={item.id}>
          <Info label={item.description} value={money(item.qty * item.rate)} />
          <button className="danger-action" onClick={() => mutate((db) => archiveEstimateItem(db, item.id, "Removed from estimate"))}>Archive Item</button>
        </div>
      ))}
      <label>Description<input value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
      <label>Qty<input type="number" value={draft.qty} onChange={(event) => setDraft({ ...draft, qty: Number(event.target.value) })} /></label>
      <label>Rate<input type="number" value={draft.rate} onChange={(event) => setDraft({ ...draft, rate: Number(event.target.value) })} /></label>
      <button disabled={!estimateId} onClick={() => estimateId && mutate((db) => createEstimateItem(db, { estimate_id: estimateId, ...draft }))}>Add Item</button>
    </div>
  );
}

function DuplicateFollowupEditor({ view, mutate }: { view: JobView; mutate: Mutate }) {
  const [note, setNote] = useState("Customer update required");
  return (
    <div className="desk-panel">
      <PanelTitle icon={<ClipboardCheck />} title="Follow-ups" subtitle="Customer touchpoints" />
      {view.followups.map((followup) => (
        <div className="request-line" key={followup.id}>
          <Info label={followup.due_at} value={followup.note} />
          <div className="action-row">
            <button onClick={() => mutate((db) => markFollowupDone(db, followup.id, followup.outcome || "Done"))}>Done</button>
            <button className="danger-action" onClick={() => mutate((db) => archiveFollowup(db, followup.id, "Removed follow-up"))}>Archive</button>
          </div>
        </div>
      ))}
      <label>New note<input value={note} onChange={(event) => setNote(event.target.value)} /></label>
      <button onClick={() => mutate((db) => createFollowup(db, { job_card_id: view.job.id, note, due_at: new Date().toISOString().slice(0, 10), done: 0, outcome: "" }))}>Add Follow-up</button>
    </div>
  );
}

function DuplicateTimeline({ view }: { view: JobView }) {
  return (
    <div className="desk-panel">
      <PanelTitle icon={<ClipboardList />} title="Timeline" subtitle="Current linked records" />
      <LinkedRecords view={view} />
    </div>
  );
}

function DuplicateJobEditor({ view, users, mutate, allowStatus }: { view: JobView; users: User[]; mutate: Mutate; allowStatus: boolean }) {
  const [workList, setWorkList] = useState(view.job.work_list);
  const [advisorId, setAdvisorId] = useState(view.job.advisor_id);
  const [technicianId, setTechnicianId] = useState(view.job.technician_id);
  const [mainStatus, setMainStatus] = useState<MainStatus>(view.job.main_status);
  const [subStatus, setSubStatus] = useState<SubStatus>(view.job.sub_status);
  return (
    <div className="editor-block">
      <label>Work List<input value={workList} onChange={(event) => setWorkList(event.target.value)} /></label>
      <label>Advisor<select value={advisorId} onChange={(event) => setAdvisorId(Number(event.target.value))}>{users.filter((item) => item.role === "service").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Technician<select value={technicianId} onChange={(event) => setTechnicianId(Number(event.target.value))}>{users.filter((item) => item.role === "tech").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      {allowStatus && <label>Status<select value={mainStatus} onChange={(event) => setMainStatus(event.target.value as MainStatus)}><option>NEW</option><option>IN_PROGRESS</option><option>COMPLETED</option><option>CLOSED</option></select></label>}
      {allowStatus && <label>Sub Status<input value={subStatus} onChange={(event) => setSubStatus(event.target.value as SubStatus)} /></label>}
      <button onClick={() => mutate((db) => updateJobCard(db, view.job.id, { advisor_id: advisorId, technician_id: technicianId, main_status: mainStatus, sub_status: subStatus, work_list: workList }))}>Save Job Card</button>
    </div>
  );
}

function DuplicateLinkedRecords({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Info label="Estimate Items" value={view.estimate_items.length} />
      <Info label="Material Requests" value={view.material_requests.length} />
      <Info label="Tasks" value={view.tasks.length} />
      <Info label="Payments" value={view.payments.length} />
      <Info label="QC" value={view.job.qc_status} />
    </div>
  );
}

function DuplicateInventoryEditor({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const first = state.inventory[0] ?? { id: 0, sku: "SKU", category: "General", name: "New Item", unit: "unit", stock_qty: 0, low_stock_qty: 0 };
  const [item, setItem] = useState<InventoryItem>(first);
  const [qty, setQty] = useState(1);
  return (
    <div className="desk-panel">
      <PanelTitle icon={<Boxes />} title="Inventory Editor" subtitle="Stock in, adjust, edit and archive" />
      <label>Item<select value={item.id} onChange={(event) => setItem(state.inventory.find((next) => next.id === Number(event.target.value)) ?? item)}>{state.inventory.map((next) => <option key={next.id} value={next.id}>{next.name}</option>)}</select></label>
      <label>Name<input value={item.name} onChange={(event) => setItem({ ...item, name: event.target.value })} /></label>
      <label>Quantity<input type="number" value={qty} onChange={(event) => setQty(Number(event.target.value))} /></label>
      <div className="action-row">
        <button onClick={() => mutate((db) => updateInventoryItem(db, item.id, item))}>Save Item</button>
        <button onClick={() => mutate((db) => stockIn(db, item.id, qty, "Manual stock-in"))}>Stock In</button>
        <button onClick={() => mutate((db) => adjustStock(db, item.id, qty, "Manual adjustment"))}>Adjust</button>
        <button onClick={() => mutate((db) => createInventoryItem(db, { sku: `${item.sku}-NEW`, category: item.category, name: item.name, unit: item.unit, stock_qty: qty, low_stock_qty: item.low_stock_qty }))}>Duplicate New</button>
        <button className="danger-action" onClick={() => mutate((db) => archiveInventoryItem(db, item.id, "Archived from stock desk"))}>Archive</button>
      </div>
    </div>
  );
}

function DuplicateMaterialRequestEditor({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const [jobId, setJobId] = useState(state.jobs[0]?.job.id ?? 0);
  const [itemId, setItemId] = useState(state.inventory[0]?.id ?? 0);
  const [qty, setQty] = useState(1);
  return (
    <div className="desk-panel">
      <PanelTitle icon={<PackageCheck />} title="Request Editor" subtitle="Create a job-linked material request" />
      <label>Job<select value={jobId} onChange={(event) => setJobId(Number(event.target.value))}>{state.jobs.map((view) => <option key={view.job.id} value={view.job.id}>{view.job.job_no}</option>)}</select></label>
      <label>Item<select value={itemId} onChange={(event) => setItemId(Number(event.target.value))}>{state.inventory.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Requested Qty<input type="number" value={qty} onChange={(event) => setQty(Number(event.target.value))} /></label>
      <button onClick={() => mutate((db) => createMaterialRequest(db, { job_card_id: jobId, item_id: itemId, requested_qty: qty, issued_qty: 0, used_qty: 0, returned_qty: 0, wasted_qty: 0 }))}>Create Request</button>
    </div>
  );
}

function DuplicateIssueMaterialEditor({ requests, mutate }: { requests: { request: MaterialRequest; item?: InventoryItem }[]; mutate: Mutate }) {
  const first = requests[0]?.request;
  const [requestId, setRequestId] = useState(first?.id ?? 0);
  const [qty, setQty] = useState(first?.requested_qty ?? 1);
  return (
    <div className="desk-panel">
      <PanelTitle icon={<Package />} title="Issue Material" subtitle="Issue exact quantity" />
      <label>Request<select value={requestId} onChange={(event) => setRequestId(Number(event.target.value))}>{requests.map(({ request, item }) => <option key={request.id} value={request.id}>{item?.name ?? request.id}</option>)}</select></label>
      <label>Qty<input type="number" value={qty} onChange={(event) => setQty(Number(event.target.value))} /></label>
      <button onClick={() => mutate((db) => issueMaterialQty(db, requestId, qty))}>Issue Quantity</button>
    </div>
  );
}

function DuplicateReconcileEditor({ requests, mutate }: { requests: { request: MaterialRequest; item?: InventoryItem }[]; mutate: Mutate }) {
  const first = requests[0]?.request;
  const [requestId, setRequestId] = useState(first?.id ?? 0);
  const [used, setUsed] = useState(first?.used_qty ?? 0);
  const [returned, setReturned] = useState(first?.returned_qty ?? 0);
  const [wasted, setWasted] = useState(first?.wasted_qty ?? 0);
  return (
    <div className="desk-panel">
      <PanelTitle icon={<Check />} title="Reconcile" subtitle="Used, returned and wasted quantity" />
      <label>Request<select value={requestId} onChange={(event) => setRequestId(Number(event.target.value))}>{requests.map(({ request, item }) => <option key={request.id} value={request.id}>{item?.name ?? request.id}</option>)}</select></label>
      <label>Used<input type="number" value={used} onChange={(event) => setUsed(Number(event.target.value))} /></label>
      <label>Returned<input type="number" value={returned} onChange={(event) => setReturned(Number(event.target.value))} /></label>
      <label>Wasted<input type="number" value={wasted} onChange={(event) => setWasted(Number(event.target.value))} /></label>
      <button onClick={() => mutate((db) => reconcileMaterialQty(db, requestId, used, returned, wasted))}>Save Reconcile</button>
    </div>
  );
}

function DuplicateTaskCreator({ view, users, mutate }: { view: JobView; users: User[]; mutate: Mutate }) {
  const [title, setTitle] = useState("Workshop task");
  const techId = users.find((item) => item.role === "tech")?.id ?? view.job.technician_id;
  return (
    <div className="editor-block">
      <label>New Task<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <button onClick={() => mutate((db) => createTask(db, { job_card_id: view.job.id, technician_id: techId, title, status: "Pending", notes: "" }))}>Add Task</button>
    </div>
  );
}

function DuplicateQcEditor({ view, technicianId, mutate }: { view: JobView; technicianId: number; mutate: Mutate }) {
  const [reason, setReason] = useState("Needs rework");
  return (
    <div className="editor-block">
      {view.qc_checks.map((check: QcCheck) => (
        <div className="request-line" key={check.id}>
          <Info label={check.label} value={check.passed ? "Pass" : check.fail_reason || "Pending"} />
          <div className="action-row">
            <button onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}>Pass</button>
            <button onClick={() => mutate((db) => updateQcCheck(db, check.id, false, reason || `Rework: ${technicianId}`))}>Fail</button>
          </div>
        </div>
      ))}
      <label>Fail reason<input value={reason} onChange={(event) => setReason(event.target.value)} /></label>
      <button onClick={() => mutate((db) => passQc(db, view.job.id))}>Pass All QC</button>
    </div>
  );
}

function DuplicateInvoiceSummary({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Info label="Invoice" value={view.invoice?.invoice_no || "Not generated"} />
      <Info label="Total" value={money(view.invoice?.total ?? invoiceItemsTotal(view.estimate_items, view.estimate))} />
      <Info label="Payment" value={paymentStatus(view)} />
    </div>
  );
}

function DuplicateDataFlow({ view }: { view: JobView }) {
  const steps = ["Visit", "Estimate", "Job Card", "Material", "Work", "QC", "Invoice", "Payment", "Gate Pass"];
  return (
    <>
      {steps.map((step) => (
        <div key={step} className="flow-step">
          <Check size={16} />
          {step}
        </div>
      ))}
      <LinkedRecords view={view} />
    </>
  );
}

type EntityKind = "jobs" | "customers" | "vehicles" | "media";
type EntityFilters = { search: string; primary: string; secondary: string; date: string; month: string; customer: string; vehicle: string; advisor: string; sort: string };

function EntityList({ kind, state, mutate, actor, initialSelectedId, onInitialSelectionConsumed }: { kind: EntityKind; state: WorkshopState; mutate: Mutate; actor: User; initialSelectedId?: number; onInitialSelectionConsumed?: () => void }) {
  const { role, id: userId } = actor;
  const emptyFilters: EntityFilters = { search: "", primary: "ALL", secondary: "ALL", date: "", month: "", customer: "ALL", vehicle: "ALL", advisor: "ALL", sort: kind === "jobs" ? "newest" : "alphabetical" };
  const [filterState, setFilterState] = useState<FilterDraftState<EntityFilters>>({ draft: emptyFilters, applied: emptyFilters, page: 1 });
  const { search, primary: filter, secondary: secondaryFilter, date: dateFilter, month: monthFilter, customer: customerFilter, vehicle: vehicleFilter, advisor: advisorFilter, sort } = filterState.applied;
  const draftFilters = filterState.draft;
  const updateDraft = (patch: Partial<EntityFilters>) => setFilterState((current) => ({ ...current, draft: { ...current.draft, ...patch } }));
  const applyFilters = () => setFilterState((current) => applyFilterDraft(current));
  const clearFilters = () => setFilterState((current) => clearFilterDraft(current, emptyFilters));
  const deferredSearch = useDeferredValue(search);
  const page = filterState.page;
  const setPage = (next: number | ((page: number) => number)) => setFilterState((current) => ({ ...current, page: typeof next === "function" ? next(current.page) : next }));
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedId, setSelectedId] = useState<number | undefined>(initialSelectedId);
  const [recordMode, setRecordMode] = useState<"view" | "edit">("view");
  useEffect(() => {
    if (initialSelectedId !== undefined) onInitialSelectionConsumed?.();
    // Only meant to consume a one-time hand-off from Search page navigation on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Customer>({ id: 0, name: "", mobile: "", type: "Individual" });
  const scrollPosition = useRef(0);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  const jobs = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    const source = role === "service" ? state.jobs.filter((item) => item.job.advisor_id === userId) : state.jobs;
    return source.filter((item) => {
      const matchesText = !needle || normalizeSearch(`${item.job.job_no} ${item.vehicle.number} ${item.vehicle.make} ${item.vehicle.model} ${item.customer.name} ${item.customer.mobile}`).includes(needle);
      return matchesText
        && (filter === "ALL" || item.job.main_status === filter)
        && (secondaryFilter === "ALL" || item.job.sub_status === secondaryFilter)
        && (!dateFilter || item.visit.received_at.slice(0, 10) === dateFilter)
        && (!monthFilter || item.visit.received_at.slice(0, 7) === monthFilter)
        && (customerFilter === "ALL" || String(item.customer.id) === customerFilter)
        && (vehicleFilter === "ALL" || String(item.vehicle.id) === vehicleFilter)
        && (advisorFilter === "ALL" || String(item.advisor.id) === advisorFilter);
    }).sort((a, b) => {
      if (sort === "oldest") return a.job.id - b.job.id;
      if (sort === "amount") return jobTotal(b) - jobTotal(a);
      return b.job.id - a.job.id;
    });
  }, [deferredSearch, filter, secondaryFilter, dateFilter, monthFilter, customerFilter, vehicleFilter, advisorFilter, sort, state.jobs, role, userId]);

  const customers = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    return state.customers.filter((item) => (!needle || normalizeSearch(`${item.name} ${item.mobile}`).includes(needle)) && (filter === "ALL" || item.type === filter)).sort((a, b) => sort === "recent" ? b.id - a.id : a.name.localeCompare(b.name));
  }, [deferredSearch, filter, sort, state.customers]);

  const vehicles = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    return state.vehicles.filter((item) => {
      const owner = state.customers.find((customer) => customer.id === item.customer_id)?.name ?? "";
      return !needle || normalizeSearch(`${item.number} ${item.make} ${item.model} ${owner}`).includes(needle);
    }).sort((a, b) => sort === "recent" ? b.id - a.id : a.number.localeCompare(b.number));
  }, [deferredSearch, sort, state.vehicles, state.customers]);

  const media = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    const source = role === "service" ? state.jobs.filter((job) => job.job.advisor_id === userId) : state.jobs;
    return source.flatMap((job) => job.photos.map((photo) => ({ photo, job }))).filter(({ photo, job }) => {
      const matchesText = !needle || normalizeSearch(`${photo.label} ${job.job.job_no} ${job.vehicle.number}`).includes(needle);
      return matchesText && (filter === "ALL" || String(photo.job_card_id) === filter) && (secondaryFilter === "ALL" || (photo.category || "General") === secondaryFilter);
    }).sort((a, b) => b.photo.id - a.photo.id);
  }, [deferredSearch, filter, secondaryFilter, state.jobs, role, userId]);

  const filtered: unknown[] = kind === "jobs" ? jobs : kind === "customers" ? customers : kind === "vehicles" ? vehicles : media;
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => { if (paged.page !== page) setPage(paged.page); }, [paged.page, page]);

  const changePage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => resultHeading.current?.focus());
  };
  const openRecord = (id: number, mode: "view" | "edit" = "view") => { scrollPosition.current = window.scrollY; setRecordMode(mode); setSelectedId(id); };
  const closeRecord = () => { setSelectedId(undefined); requestAnimationFrame(() => window.scrollTo(0, scrollPosition.current)); };

  if (selectedId !== undefined && kind === "media") {
    const selectedJob = kind === "media" ? state.jobs.find((item) => item.photos.some((photo) => photo.id === selectedId)) : undefined;
    const selectedPhoto = selectedJob?.photos.find((photo) => photo.id === selectedId);
    return <section className="record-workspace">
      <button className="back-button" onClick={closeRecord}>← Back to {entityTitle(kind)}</button>
      <div className="list-page-heading"><div><h2>{entityTitle(kind)} Detail</h2><p>Focused record workspace</p></div></div>
      {selectedJob && selectedPhoto && kind === "media" && <div className="job-detail-layout"><aside className="desk-panel"><img className="media-detail-image" src={selectedPhoto.src || "/media-placeholder.svg"} alt={selectedPhoto.label} /><Info label="Vehicle" value={selectedJob.vehicle.number} /><Info label="Job" value={selectedJob.job.job_no} /></aside><JobMediaPanel key={selectedPhoto.updated_at} view={selectedJob} actor={actor} mutate={mutate} /></div>}
    </section>;
  }

  const title = kind === "jobs" && role === "admin" ? "Job Cards" : entityTitle(kind);
  const dialogJob = kind === "jobs" && selectedId !== undefined ? state.jobs.find((item) => item.job.id === selectedId) : undefined;
  const dialogCustomer = kind === "customers" && selectedId !== undefined ? state.customers.find((item) => item.id === selectedId) : undefined;
  const dialogVehicle = kind === "vehicles" && selectedId !== undefined ? state.vehicles.find((item) => item.id === selectedId) : undefined;
  const categories = Array.from(new Set(state.jobs.flatMap((job) => job.photos.map((photo) => photo.category || "General")))).sort();
  const customerTypes = Array.from(new Set(state.customers.map((customer) => customer.type))).sort();
  const jobCustomerOptions = Array.from(new Map(state.jobs.map((item) => [item.customer.id, item.customer])).values()).sort((a, b) => a.name.localeCompare(b.name));
  const jobVehicleOptions = Array.from(new Map(state.jobs.map((item) => [item.vehicle.id, item.vehicle])).values()).sort((a, b) => a.number.localeCompare(b.number));
  const jobAdvisorOptions = Array.from(new Map(state.jobs.map((item) => [item.advisor.id, item.advisor])).values()).sort((a, b) => a.name.localeCompare(b.name));
  const canCreate = (kind === "customers" || kind === "vehicles") && (role === "admin" || role === "reception");
  const createLabel = kind === "customers" ? "Add Customer" : kind === "vehicles" ? "Add Vehicle" : "Upload Media";
  const exportFilters = activeFilterSummary(kind === "jobs"
    ? {
        Search: search.trim(), "Main status": filter, Workflow: secondaryFilter, Sort: sort,
        "Received date": dateFilter, "Received month": monthFilter,
        Customer: customerFilter === "ALL" ? "ALL" : jobCustomerOptions.find((item) => String(item.id) === customerFilter)?.name ?? customerFilter,
        Vehicle: vehicleFilter === "ALL" ? "ALL" : jobVehicleOptions.find((item) => String(item.id) === vehicleFilter)?.number ?? vehicleFilter,
        Advisor: advisorFilter === "ALL" ? "ALL" : jobAdvisorOptions.find((item) => String(item.id) === advisorFilter)?.name ?? advisorFilter,
      }
    : kind === "customers" ? { Search: search.trim(), "Customer type": filter, Sort: sort }
    : kind === "media" ? { Search: search.trim(), "Job card": filter === "ALL" ? "ALL" : state.jobs.find((row) => String(row.job.id) === filter)?.job.job_no ?? filter, Category: secondaryFilter }
    : { Search: search.trim(), Sort: sort });
  const exportColumns: ExportColumn<any>[] = kind === "jobs" ? [
    { header: "Job", value: (row: JobView) => row.job.job_no }, { header: "Vehicle", value: (row: JobView) => `${row.vehicle.number} ${row.vehicle.make} ${row.vehicle.model}` },
    { header: "Customer", value: (row: JobView) => row.customer.name }, { header: "Status", value: (row: JobView) => row.job.main_status },
    { header: "Workflow", value: (row: JobView) => row.job.sub_status }, { header: "Total", value: (row: JobView) => jobTotal(row) },
  ] : kind === "customers" ? [
    { header: "Customer", value: (row: Customer) => row.name }, { header: "Mobile", value: (row: Customer) => row.mobile }, { header: "Type", value: (row: Customer) => row.type },
    { header: "Vehicles", value: (row: Customer) => state.vehicles.filter((vehicle) => vehicle.customer_id === row.id).length }, { header: "Open jobs", value: (row: Customer) => state.jobs.filter((job) => job.customer.id === row.id && job.job.main_status !== "CLOSED").length },
  ] : kind === "vehicles" ? [
    { header: "Registration", value: (row: Vehicle) => row.number }, { header: "Make / Model", value: (row: Vehicle) => `${row.make} ${row.model}` }, { header: "Color", value: (row: Vehicle) => row.color },
    { header: "Customer", value: (row: Vehicle) => state.customers.find((customer) => customer.id === row.customer_id)?.name ?? "" }, { header: "KM", value: (row: Vehicle) => row.km },
  ] : [
    { header: "Label", value: (row: { photo: Photo }) => row.photo.label }, { header: "Category", value: (row: { photo: Photo }) => row.photo.category ?? "General" },
    { header: "Vehicle", value: (row: { job: JobView }) => row.job.vehicle.number }, { header: "Job", value: (row: { job: JobView }) => row.job.job.job_no },
  ];
  return <section className={`entity-list-page kind-${kind}`}>
    {dialogJob && <JobRecordDialog view={dialogJob} state={state} mutate={mutate} actor={actor} mode={recordMode} onClose={closeRecord} />}
    {dialogCustomer && <CustomerRecordDialog customer={dialogCustomer} state={state} mutate={mutate} mode={recordMode} onClose={closeRecord} />}
    {dialogVehicle && <VehicleRecordDialog vehicle={dialogVehicle} state={state} mutate={mutate} mode={recordMode} onClose={closeRecord} />}
    <div className="list-page-heading"><div><h2 ref={resultHeading} tabIndex={-1}>{title}</h2><p>{kind === "media" ? "Before, after and workshop documentation" : `Browse and manage ${title.toLocaleLowerCase()}`}</p></div>{canCreate && <button className="primary-action" onClick={() => setCreating(true)}>{createLabel}</button>}</div>
    {creating && <Dialog title={createLabel} onClose={() => setCreating(false)}>
      {kind === "customers" && <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} />}
      {kind === "vehicles" && <VehicleMasterPanel embedded state={state} value={{ id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0 }} setValue={() => undefined} mutate={mutate} />}
    </Dialog>}
    <div className="list-filter-bar" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applyFilters(); } }}>
      <label className="list-search">Search<input aria-label={`Search ${title.toLocaleLowerCase()}`} value={draftFilters.search} placeholder={searchPlaceholder(kind)} onChange={(event) => updateDraft({ search: event.target.value })} /></label>
      <button className="mobile-filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}>{filtersOpen ? "Hide filters" : "Show filters"}</button>
      <div className={filtersOpen ? "list-filter-fields open" : "list-filter-fields"}>
        {kind === "jobs" && <>
          <label>Main status<select aria-label="Main status" value={draftFilters.primary} onChange={(event) => updateDraft({ primary: event.target.value })}><option value="ALL">All statuses</option>{["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Workflow<select aria-label="Workflow status" value={draftFilters.secondary} onChange={(event) => updateDraft({ secondary: event.target.value })}><option value="ALL">All workflows</option>{Array.from(new Set(state.jobs.map((item) => item.job.sub_status))).map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Received date<input aria-label="Received date" type="date" value={draftFilters.date} onChange={(event) => updateDraft({ date: event.target.value })} /></label>
          <label>Received month<input aria-label="Received month" type="month" value={draftFilters.month} onChange={(event) => updateDraft({ month: event.target.value })} /></label>
          <label>Customer<select aria-label="Customer filter" value={draftFilters.customer} onChange={(event) => updateDraft({ customer: event.target.value })}><option value="ALL">All customers</option>{jobCustomerOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Vehicle<select aria-label="Vehicle filter" value={draftFilters.vehicle} onChange={(event) => updateDraft({ vehicle: event.target.value })}><option value="ALL">All vehicles</option>{jobVehicleOptions.map((item) => <option key={item.id} value={item.id}>{item.number}</option>)}</select></label>
          <label>Service advisor<select aria-label="Service advisor filter" value={draftFilters.advisor} onChange={(event) => updateDraft({ advisor: event.target.value })}><option value="ALL">All advisors</option>{jobAdvisorOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        </>}
        {kind === "customers" && <label>Customer type<select aria-label="Customer type" value={draftFilters.primary} onChange={(event) => updateDraft({ primary: event.target.value })}><option value="ALL">All types</option>{customerTypes.map((value) => <option key={value}>{value}</option>)}</select></label>}
        {kind === "media" && <><label>Job card<select aria-label="Job card filter" value={draftFilters.primary} onChange={(event) => updateDraft({ primary: event.target.value })}><option value="ALL">All job cards</option>{state.jobs.map((item) => <option value={item.job.id} key={item.job.id}>{item.job.job_no}</option>)}</select></label><label>Category<select aria-label="Media category" value={draftFilters.secondary} onChange={(event) => updateDraft({ secondary: event.target.value })}><option value="ALL">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label></>}
        {kind !== "media" && <label>Sort<select aria-label="Sort results" value={draftFilters.sort} onChange={(event) => updateDraft({ sort: event.target.value })}>{kind === "jobs" ? <><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="amount">Amount</option></> : <><option value="alphabetical">Alphabetical</option><option value="recent">Recent</option></>}</select></label>}
        <ListSearchActions
          onClear={clearFilters}
          onSearch={applyFilters}
        />
      </div>
    </div>
    {kind === "media" && <MediaKpis rows={media} />}
    <div className="list-result-controls">
      <ListExportControls report={{ title, filters: exportFilters, columns: exportColumns, rows: filtered }} />
      <ViewModeToggle value={viewMode} onChange={setViewMode} />
      <div className="result-summary" aria-live="polite">Showing {paged.from} to {paged.to} of {paged.totalCount}</div>
      <PageSizeSelect value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} />
    </div>
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={changePage} />
    {paged.totalCount === 0 ? <div className="list-empty"><h3>No matching records</h3><p>Adjust the search or clear the filters.</p><button onClick={clearFilters}>Clear filters</button></div> : <EntityResults kind={kind} rows={paged.items} state={state} viewMode={viewMode} role={role} actor={actor} openRecord={openRecord} mutate={mutate} />}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={changePage} />
  </section>;
}

function entityTitle(kind: EntityKind) { return ({ jobs: "Jobs", customers: "Customers", vehicles: "Vehicles", media: "Media" })[kind]; }
function searchPlaceholder(kind: EntityKind) { return ({ jobs: "Job, vehicle or customer", customers: "Name or mobile", vehicles: "Registration, make, model or customer", media: "Label, job or vehicle" })[kind]; }
function jobTotal(view: JobView) { return view.invoice?.total ?? invoiceItemsTotal(view.estimate_items, view.estimate); }

function ViewModeToggle({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
  return <div className="view-toggle" role="group" aria-label="View mode"><button aria-pressed={value === "grid"} className={value === "grid" ? "active" : ""} onClick={() => onChange("grid")}>Grid</button><button aria-pressed={value === "table"} className={value === "table" ? "active" : ""} onClick={() => onChange("table")}>Table</button></div>;
}

export function ResultPagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  const atFirstPage = page <= 1;
  const atLastPage = page >= pageCount;

  return <nav className="result-pagination" aria-label="Results pagination">
    <button type="button" aria-label="First page" title="First page" disabled={atFirstPage} onClick={() => onChange(1)}><ChevronFirst aria-hidden="true" size={18} /></button>
    <button type="button" aria-label="Previous page" title="Previous page" disabled={atFirstPage} onClick={() => onChange(page - 1)}><ChevronLeft aria-hidden="true" size={18} /></button>
    <span className="mobile-page-label">Page {page} of {pageCount}</span>
    <div className="numbered-pages">
      {pageNumbers(page, pageCount).map((token, index) => token === "ellipsis"
        ? <span className="page-ellipsis" aria-hidden="true" key={`ellipsis-${index}`}>…</span>
        : <button type="button" key={token} aria-label={`Page ${token}`} aria-current={page === token ? "page" : undefined} className={page === token ? "active" : ""} onClick={() => onChange(token)}>{token}</button>)}
    </div>
    <button type="button" aria-label="Next page" title="Next page" disabled={atLastPage} onClick={() => onChange(page + 1)}><ChevronRight aria-hidden="true" size={18} /></button>
    <button type="button" aria-label="Last page" title="Last page" disabled={atLastPage} onClick={() => onChange(pageCount)}><ChevronLast aria-hidden="true" size={18} /></button>
  </nav>;
}

function ListExportControls({ report }: { report: { title: string; filters: string[]; columns: ExportColumn<any>[]; rows: any[] } }) {
  return <DownloadMenu report={report} />;
}

function MediaKpis({ rows }: { rows: { photo: Photo; job: JobView }[] }) {
  const before = rows.filter(({ photo }) => photo.category === "Before Work" || photo.category === "Before").length;
  const after = rows.filter(({ photo }) => photo.category === "After Work" || photo.category === "After").length;
  return <div className="media-kpis"><Info label="Total Images" value={rows.length} /><Info label="Before Images" value={before} /><Info label="After Images" value={after} /><Info label="Job Cards" value={new Set(rows.map(({ job }) => job.job.id)).size} /></div>;
}

function EntityResults({ kind, rows, state, viewMode, role, actor, openRecord, mutate }: { kind: EntityKind; rows: unknown[]; state: WorkshopState; viewMode: ViewMode; role: Role; actor: User; openRecord: (id: number, mode?: "view" | "edit") => void; mutate: Mutate }) {
  const canArchive = kind === "media" ? role === "admin" : role === "admin" || role === "reception";
  const canManageJob = (row: JobView) => canMutateJobLifecycle(actor, row.job);
  const archive = (id: number) => {
    if (!window.confirm(`Archive this ${kind === "media" ? "media record" : kind.slice(0, -1)}? It remains recoverable in the local database.`)) return;
    mutate((db) => kind === "jobs" ? archiveJobCardForActor(db, id, actor.id, "Archived from list") : kind === "customers" ? archiveCustomer(db, id, "Archived from list") : kind === "vehicles" ? archiveVehicle(db, id, "Archived from list") : archiveJobPhotoForActor(db, id, actor.id, "Archived from media list"));
  };
  const cardFor = (raw: unknown): ReactNode => {
    if (kind === "jobs") { const row = raw as JobView; const manageable = canManageJob(row); return <article className="record-card job-card" key={row.job.id}><div className="record-identity"><strong>{row.vehicle.number}</strong><span>{row.vehicle.make} {row.vehicle.model}</span></div><h3>{row.job.job_no}</h3><p>{row.customer.name} · {row.customer.mobile}</p><Status status={row.job.main_status} sub={row.job.sub_status} /><Info label="Total" value={money(jobTotal(row))} /><RecordActions onView={() => openRecord(row.job.id, "view")} onEdit={manageable ? () => openRecord(row.job.id, "edit") : undefined} onArchive={manageable ? () => archive(row.job.id) : undefined} /></article>; }
    if (kind === "customers") { const row = raw as Customer; const vehicles = state.vehicles.filter((item) => item.customer_id === row.id); const jobs = state.jobs.filter((item) => item.customer.id === row.id); return <article className="record-card" key={row.id}><div className="record-identity"><strong>{row.name}</strong><span>{row.mobile}</span></div><span className="category-badge">{row.type}</span><Info label="Vehicles" value={vehicles.length} /><Info label="Open jobs" value={jobs.filter((job) => job.job.main_status !== "CLOSED").length} /><Info label="Last visit" value={jobs[0]?.visit.received_at?.slice(0, 10) || "—"} /><RecordActions onView={() => openRecord(row.id, "view")} onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined} onArchive={canArchive ? () => archive(row.id) : undefined} /></article>; }
    if (kind === "vehicles") { const row = raw as Vehicle; const customer = state.customers.find((item) => item.id === row.customer_id); return <article className="record-card" key={row.id}><div className="record-identity"><strong>{row.number}</strong><span>{row.make} {row.model}</span></div><p><i className="color-swatch" style={{ background: row.color }} />{row.color}</p><Info label="Customer" value={customer?.name ?? "—"} /><Info label="KM" value={row.km.toLocaleString("en-IN")} /><RecordActions onView={() => openRecord(row.id, "view")} onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined} onArchive={canArchive ? () => archive(row.id) : undefined} /></article>; }
    const { photo, job } = raw as { photo: Photo; job: JobView }; return <article className="record-card media-card" key={photo.id}><div className="media-preview"><img src={photo.src || "/media-placeholder.svg"} alt={photo.label} /><span>{photo.category || "General"}</span></div><h3>{job.vehicle.number}</h3><p>{job.job.job_no} · {photo.label}</p><RecordActions onView={() => openRecord(photo.id)} onArchive={canArchive ? () => archive(photo.id) : undefined} /></article>;
  };
  const cards = <div className={`record-grid ${kind}`}>{rows.map(cardFor)}</div>;
  if (viewMode === "grid") return cards;
  return <><div className="mobile-table-fallback">{cards}</div><div className="table-wrap"><table><thead><tr>{tableHeaders(kind).map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((raw) => <EntityTableRow key={rowId(kind, raw)} kind={kind} raw={raw} state={state} canArchive={canArchive} canManageJob={kind === "jobs" && canManageJob(raw as JobView)} openRecord={openRecord} archive={archive} />)}</tbody></table></div></>;
}

function RecordActions({ onView, onEdit, onArchive }: { onView: () => void; onEdit?: () => void; onArchive?: () => void }) { return <div className="record-actions"><button onClick={(event) => { event.stopPropagation(); onView(); }}>View</button>{onEdit && <button onClick={(event) => { event.stopPropagation(); onEdit(); }}>Edit</button>}{onArchive && <button className="danger-action" onClick={(event) => { event.stopPropagation(); onArchive(); }}>Archive</button>}</div>; }
function CustomerDetail({ customer, mutate }: { customer: Customer; mutate: Mutate }) { const [draft, setDraft] = useState(customer); return <CustomerEditor value={draft} setValue={setDraft} mutate={mutate} />; }
function tableHeaders(kind: EntityKind) { return kind === "jobs" ? ["Job", "Vehicle", "Customer", "Status", "Total", "Actions"] : kind === "customers" ? ["Customer", "Mobile", "Type", "Vehicles", "Open Jobs", "Actions"] : kind === "vehicles" ? ["Registration", "Make / Model", "Color", "Customer", "KM", "Actions"] : ["Preview", "Label", "Category", "Vehicle / Job", "Actions"]; }
function rowId(kind: EntityKind, raw: unknown) { return kind === "jobs" ? (raw as JobView).job.id : kind === "media" ? (raw as { photo: Photo }).photo.id : (raw as Customer | Vehicle).id; }
function EntityTableRow({ kind, raw, state, canArchive, canManageJob, openRecord, archive }: { kind: EntityKind; raw: unknown; state: WorkshopState; canArchive: boolean; canManageJob: boolean; openRecord: (id: number, mode?: "view" | "edit") => void; archive: (id: number) => void }) {
  const id = rowId(kind, raw); let cells: ReactNode[];
  if (kind === "jobs") { const row = raw as JobView; cells = [row.job.job_no, `${row.vehicle.number} · ${row.vehicle.make} ${row.vehicle.model}`, row.customer.name, <Status status={row.job.main_status} sub={row.job.sub_status} />, money(jobTotal(row))]; }
  else if (kind === "customers") { const row = raw as Customer; cells = [row.name, row.mobile, row.type, state.vehicles.filter((item) => item.customer_id === row.id).length, state.jobs.filter((item) => item.customer.id === row.id && item.job.main_status !== "CLOSED").length]; }
  else if (kind === "vehicles") { const row = raw as Vehicle; cells = [row.number, `${row.make} ${row.model}`, row.color, state.customers.find((item) => item.id === row.customer_id)?.name ?? "—", row.km.toLocaleString("en-IN")]; }
  else { const { photo, job } = raw as { photo: Photo; job: JobView }; cells = [<img className="table-thumb" src={photo.src || "/media-placeholder.svg"} alt="" />, photo.label, photo.category || "General", `${job.vehicle.number} · ${job.job.job_no}`]; }
  return <tr>{cells.map((cell, index) => <td key={index}>{cell}</td>)}<td><RecordActions onView={() => openRecord(id, "view")} onEdit={kind === "jobs" ? canManageJob ? () => openRecord(id, "edit") : undefined : (kind === "customers" || kind === "vehicles") && canArchive ? () => openRecord(id, "edit") : undefined} onArchive={kind === "jobs" ? canManageJob ? () => archive(id) : undefined : canArchive ? () => archive(id) : undefined} /></td></tr>;
}

function JobRows({ jobs, selectedJobId, onSelect }: { jobs: JobView[]; selectedJobId?: number; onSelect?: (id: number) => void }) {
  return (
    <div className="row-list">
      {jobs.map((view) => (
        <button className={selectedJobId === view.job.id ? "row active" : "row"} key={view.job.id} onClick={() => onSelect?.(view.job.id)}>
          <strong>{view.job.job_no}</strong>
          <span>{view.vehicle.number}</span>
          <Status status={view.job.main_status} sub={view.job.sub_status} />
        </button>
      ))}
    </div>
  );
}

function FilterableJobRows({ title, jobs, selectedJobId, onSelect, showStatusFilter = false }: { title: string; jobs: JobView[]; selectedJobId?: number; onSelect: (id: number) => void; showStatusFilter?: boolean }) {
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState("ALL");
  const [statusDraft, setStatusDraft] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(deferredSearch);
  const filtered = useMemo(() => jobs.filter((row) => (!needle || normalizeSearch(`${row.job.job_no} ${row.vehicle.number} ${row.customer.name}`).includes(needle)) && (status === "ALL" || row.job.main_status === status)), [jobs, needle, status]);
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => { if (paged.page !== page) setPage(paged.page); }, [paged.page, page]);
  const columns: ExportColumn<JobView>[] = [
    { header: "Job", value: (row) => row.job.job_no }, { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name }, { header: "Status", value: (row) => row.job.main_status }, { header: "Workflow", value: (row) => row.job.sub_status },
  ];
  return <div className="embedded-list">
    <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setSearch(searchDraft); setStatus(statusDraft); setPage(1); } }}><label className="list-search">Search<input aria-label={`Search ${title.toLocaleLowerCase()}`} value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Job, vehicle or customer" /></label>{showStatusFilter && <label>Status<select aria-label={`${title} status`} value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}><option value="ALL">All statuses</option>{["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}</select></label>}<ListSearchActions onClear={() => { setSearchDraft(""); setSearch(""); setStatusDraft("ALL"); setStatus("ALL"); setPage(1); }} onSearch={() => { setSearch(searchDraft); setStatus(statusDraft); setPage(1); }} /></div>
    <div className="list-result-controls"><ListExportControls report={{ title, filters: activeFilterSummary({ Search: search.trim(), Status: status }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel={`${title} records per page`} value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    {paged.totalCount ? <JobRows jobs={paged.items} selectedJobId={selectedJobId} onSelect={onSelect} /> : <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearchDraft(""); setSearch(""); setStatusDraft("ALL"); setStatus("ALL"); setPage(1); }}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

export function PanelTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="panel-title">
      {icon}
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

export function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Status({ status, sub }: { status: string; sub: string }) {
  const label = status.replaceAll("_", " ");
  return (
    <span className={`status ${status.toLowerCase()}`}>
      {label} · {sub}
    </span>
  );
}

function headlineFor(role: Role) {
  return {
    admin: "Control room for linked workflow, blockers and cash.",
    service: "Command queue for estimates, approvals and customer updates.",
    reception: "Intake desk for visits, customers and new job cards.",
    accounts: "Closure desk for invoice, payment, receipt and gate pass.",
    store: "Issue counter for accountable material movement.",
    tech: "Task board for work updates, washing and QC handoff.",
  }[role];
}

function textFields<T extends Record<string, unknown>>(form: T, setForm: (value: T) => void) {
  void setForm;
  return [
    ["customerName", "Customer Name"],
    ["mobile", "Mobile"],
    ["customerType", "Customer Type"],
    ["vehicleNo", "Vehicle Number"],
    ["make", "Make"],
    ["model", "Model"],
    ["color", "Color"],
    ["km", "KM"],
    ["fuel", "Fuel"],
    ["keys", "Keys"],
    ["accessories", "Accessories"],
    ["requestedWork", "Requested Work"],
  ] as [keyof T, string][];
}

export function money(value: number) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

export type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;

export default App;
