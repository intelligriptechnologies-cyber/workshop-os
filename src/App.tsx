import {
  Banknote,
  Boxes,
  Camera,
  Car,
  Check,
  ClipboardCheck,
  ClipboardList,
  DoorOpen,
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
  addPayment,
  addPhoto,
  adjustStock,
  approveEstimate,
  archiveUser,
  archiveCustomer,
  archiveEstimateItem,
  archiveFollowup,
  archiveInventoryItem,
  archiveMaterialRequest,
  archivePhoto,
  archiveTask,
  archiveVehicle,
  cancelJobCard,
  cancelJobCardStatus,
  closeJob,
  closureBlockers,
  createCustomer,
  createEstimate,
  createEstimateItem,
  createFollowup,
  createInventoryItem,
  createMaterialRequest,
  createPhoto,
  createTask,
  createUser,
  createVehicle,
  failQcWithRework,
  generateInvoice,
  generateReceiptAndGatePass,
  holdJobCard,
  issueMaterial,
  issueMaterialQty,
  invoiceItemsTotal,
  login,
  loadLargeDemoDataset,
  MAIN_STATUS_TRANSITIONS,
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
  reopenJobCard,
  resumeJobCard,
  searchJobs,
  stockIn,
  updateCustomer,
  updateDeliveryDetails,
  updateEstimate,
  updateEstimateItem,
  updateFollowup,
  updateInventoryItem,
  updateJobCard,
  updateMaterialRequest,
  updatePayment,
  updatePhoto,
  updateQcCheck,
  updateTask,
  updateUser,
  updateVisit,
  updateVehicle,
  voidInvoice,
  voidPayment,
} from "./db";
import type { Customer, EstimateItem, Followup, InventoryItem, JobView, MainStatus, MaterialMovement, MaterialRequest, Photo, QcCheck, Role, SearchCriteria, SubStatus, Task, TaskStatus, User, Vehicle, ViewMode, WorkshopState } from "./types";
import { activeFilterSummary, normalizeSearch, pageNumbers, paginate } from "./list-utils";
import type { ExportColumn } from "./export-utils";
import { frappeLogin, frappeLogout, loadAuthConfig, loadFrappeSession, type AuthConfig } from "./auth";
import { Dialog, DownloadMenu } from "./ui-kit";
import { AdminConsole } from "./admin-console";
import { adminUsersApi, AdminApiError, type AdminDirectory, type AdminUser } from "./admin-users-api";
import { loadAdminDemoState, PAGE_KEY_BY_MENU_LABEL, resolvePermittedPages, type AdminPageKey } from "./admin-demo-state";

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
    { label: "Jobs", icon: <FileText size={18} /> },
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
  job: ["jobs", "my-queue"],
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

// Frappe roles are assigned as exactly one of these six lowercase names (see Task 1's role
// provisioning); a user can hold more than one, so pick deterministically by priority.
const ROLE_PRIORITY: Role[] = ["admin", "service", "reception", "accounts", "store", "tech"];
function workshopRole(names: string[]): Role | undefined {
  return ROLE_PRIORITY.find((role) => names.includes(role));
}

// Codes are Frappe's `exc_type` (see admin-users-api.ts's `call` helper) for the admin console's
// Frappe-backed user directory (Task 3), not the old Cognito-backed codes this replaced.
const apiErrors: Record<string, string> = {
  PermissionError: "You do not have permission to manage users.",
  DuplicateEntryError: "That email already belongs to a WorkshopOS account.",
  ValidationError: "One of the selected roles is no longer available.",
};

function apiErrorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : "API_FAILED";
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
      if (config.mode === "frappe") {
        try {
          const session = await loadFrappeSession();
          const role = session && workshopRole(session.roles);
          if (session && role) {
            const authenticatedUser: User = {
              id: -1, name: session.fullName, email: session.email,
              role, password: "", externalAuth: true, externalId: session.email,
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

  const mutate = async (action: (database: Database) => void) => {
    if (!db) return false;
    try {
      action(db);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Action failed");
      return false;
    }
    persist(db);
    const next = readState(db);
    setState(next);
    if (!selectedJobId && next.jobs[0]) setSelectedJobId(next.jobs[0].job.id);
    return true;
  };

  const handleLogin = async (email: string, password: string) => {
    if (authConfig?.mode === "frappe") {
      try {
        const session = await frappeLogin(email, password);
        const role = workshopRole(session.roles);
        if (!role) {
          // frappeLogin already succeeded (a live sid cookie exists) before this check — an
          // unrecognized-role login must not leave a dangling authenticated Frappe session while
          // the UI claims "invalid credentials", so log the session back out before returning.
          await frappeLogout();
          setLoginError("Invalid email or password.");
          return;
        }
        setUser({ id: -1, name: session.fullName, email: session.email, role, password: "", externalAuth: true, externalId: session.email });
        setActiveMenuItem(roleMenus[role][0].label);
        setLoginError("");
      } catch {
        setLoginError("Invalid email or password.");
      }
      return;
    }
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

  const handleLogout = async () => {
    if (authConfig?.mode === "frappe") {
      await frappeLogout();
    }
    setUser(undefined);
    setActiveMenuItem("");
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
  if (!user) return <LoginScreen onLogin={handleLogin} config={authConfig} error={loginError} />;

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
    if (invoiceLabel) { setSelectedJobId(view.job.id); setActiveMenuItem(invoiceLabel); return; }
    const jobsLabel = findMenuLabelForPage(user.role, "jobs") ?? findMenuLabelForPage(user.role, "my-queue");
    if (jobsLabel) { setSearchNavigate({ kind: "jobs", id: view.job.id }); setActiveMenuItem(jobsLabel); }
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
            <button key={item.label} className={activeMenuItem === item.label ? "active" : ""} onClick={() => setActiveMenuItem(item.label)} title={item.label}>
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
        />
      </main>
    </div>
  );
}

function LoginScreen({ onLogin, config, error }: { onLogin: (email: string, password: string) => void; config?: AuthConfig; error: string }) {
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
        {config?.mode === "local" && !config.allowDemo ? (
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
}) {
  if (activeMenuItem === "Search") {
    return (
      <SearchPortal
        jobs={jobs}
        query={query}
        category={searchCategory}
        status={searchStatus}
        dateFilter={searchDateFilter}
        monthFilter={searchMonthFilter}
        permittedPages={permittedPages}
        role={user.role}
        setQuery={setQuery}
        setCategory={setSearchCategory}
        setStatus={setSearchStatus}
        setDateFilter={setSearchDateFilter}
        setMonthFilter={setSearchMonthFilter}
        onOpenRecord={onOpenSearchRecord}
      />
    );
  }

  if (activeMenuItem === "Jobs" || activeMenuItem === "My Queue") return <EntityList kind="jobs" state={state} mutate={mutate} role={user.role} userId={user.id} initialSelectedId={searchNavigate?.kind === "jobs" ? searchNavigate.id : undefined} onInitialSelectionConsumed={onSearchNavigateConsumed} />;
  if (activeMenuItem === "Customers") return <EntityList kind="customers" state={state} mutate={mutate} role={user.role} userId={user.id} initialSelectedId={searchNavigate?.kind === "customers" ? searchNavigate.id : undefined} onInitialSelectionConsumed={onSearchNavigateConsumed} />;
  if (activeMenuItem === "Vehicles") return <EntityList kind="vehicles" state={state} mutate={mutate} role={user.role} userId={user.id} initialSelectedId={searchNavigate?.kind === "vehicles" ? searchNavigate.id : undefined} onInitialSelectionConsumed={onSearchNavigateConsumed} />;
  if (activeMenuItem === "Media") return <EntityList kind="media" state={state} mutate={mutate} role={user.role} userId={user.id} />;

  if (user.role === "reception") return <Reception activeMenuItem={activeMenuItem} state={state} mutate={mutate} user={user} selected={selected} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "service") return <ServiceAdvisor activeMenuItem={activeMenuItem} state={state} view={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "store") return <StoreDesk activeMenuItem={activeMenuItem} state={state} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "tech") return <Technician activeMenuItem={activeMenuItem} state={state} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "accounts") return <Accounts activeMenuItem={activeMenuItem} state={state} view={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  return <Admin activeMenuItem={activeMenuItem} state={state} selected={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} user={user} />;
}

const SEARCH_STATUS_OPTIONS: (MainStatus | "ALL")[] = ["ALL", "NEW", "IN_PROGRESS", "COMPLETED", "HOLD", "CANCELLED", "CLOSED"];

function SearchPortal({
  jobs,
  query,
  category,
  status,
  dateFilter,
  monthFilter,
  permittedPages,
  role,
  setQuery,
  setCategory,
  setStatus,
  setDateFilter,
  setMonthFilter,
  onOpenRecord,
}: {
  jobs: JobView[];
  query: string;
  category: SearchTableCategory | "";
  status: SearchCriteria["status"];
  dateFilter: string;
  monthFilter: string;
  permittedPages: AdminPageKey[];
  role: Role;
  setQuery: (value: string) => void;
  setCategory: (value: SearchTableCategory | "") => void;
  setStatus: (value: SearchCriteria["status"]) => void;
  setDateFilter: (value: string) => void;
  setMonthFilter: (value: string) => void;
  onOpenRecord: (view: JobView, category: SearchTableCategory) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const resetPage = (action: () => void) => { action(); setPage(1); };

  const availableCategories = (Object.keys(CATEGORY_PAGE_KEYS) as SearchTableCategory[])
    .filter((item) => CATEGORY_PAGE_KEYS[item].some((key) => permittedPages.includes(key)));

  const clearFilters = () => { setQuery(""); setStatus("ALL"); setDateFilter(""); setMonthFilter(""); setPage(1); };

  const paged = paginate(jobs, page, pageSize);

  return (
    <section className="portal">
      <div className="list-filter-bar">
        <label className="list-search">Search<input aria-label="Search records" value={query} placeholder="Search vehicle, mobile, customer, job card, invoice" onChange={(event) => resetPage(() => setQuery(event.target.value))} /></label>
        <div className="list-filter-fields open">
          <label>Category<select aria-label="Search category" value={category} onChange={(event) => resetPage(() => setCategory(event.target.value as SearchTableCategory | ""))}>
            <option value="">Select a category</option>
            {availableCategories.map((item) => <option key={item} value={item}>{SEARCH_CATEGORY_LABELS[item]}</option>)}
          </select></label>
          {category && <>
            <label>Status<select aria-label="Job status" value={status} onChange={(event) => resetPage(() => setStatus(event.target.value as SearchCriteria["status"]))}>{SEARCH_STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item === "ALL" ? "All statuses" : item}</option>)}</select></label>
            <label>Date<input aria-label="Search date" type="date" value={dateFilter} onChange={(event) => resetPage(() => setDateFilter(event.target.value))} /></label>
            <label>Month<input aria-label="Search month" type="month" value={monthFilter} onChange={(event) => resetPage(() => setMonthFilter(event.target.value))} /></label>
          </>}
          <button onClick={clearFilters}>Clear</button>
          {category && <button className="primary-action" type="button" onClick={() => setPage(1)}>Search</button>}
        </div>
      </div>

      {!category ? (
        <div className="empty-state"><strong>Please select a category to activate search</strong><span>Choose Job, Customer, Vehicle or Invoice above to see results.</span></div>
      ) : (
        <>
          <div className="list-result-controls">
            <div className="result-summary" aria-live="polite">Showing {paged.from} to {paged.to} of {paged.totalCount}</div>
            <label className="page-size">Per page<select aria-label="Records per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select></label>
          </div>
          <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
          {paged.totalCount === 0 ? (
            <div className="list-empty"><h3>No matching records</h3><p>Adjust the search or clear the filters.</p><button onClick={clearFilters}>Clear filters</button></div>
          ) : (
            <SearchResultsTable category={category} rows={paged.items} onOpenRecord={onOpenRecord} />
          )}
          <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
        </>
      )}
    </section>
  );
}

function SearchResultsTable({ category, rows, onOpenRecord }: { category: SearchTableCategory; rows: JobView[]; onOpenRecord: (view: JobView, category: SearchTableCategory) => void }) {
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
            <tr key={view.job.id} className="clickable-row" onClick={() => onOpenRecord(view, category)}>
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
              <td><RecordActions onView={() => onOpenRecord(view, category)} /></td>
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
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.customerName.trim() || !form.mobile.trim() || !form.vehicleNo.trim() || !form.requestedWork.trim()) {
      window.alert("Customer, mobile, vehicle number and requested work are required.");
      return;
    }
    if (await mutate((db) => receiveVehicle(db, { ...form, receptionId: user.id }))) onCreated?.();
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
          <JobRows jobs={state.jobs.filter((job) => job.customer.id === customerEdit.id)} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} />
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
}: {
  activeMenuItem: string;
  state: WorkshopState;
  view?: JobView;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
}) {
  if (activeMenuItem === "My Queue") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<ClipboardList />} title="My Queue" subtitle="Open advisor jobs" />
          <JobRows jobs={state.jobs.filter((item) => item.job.main_status !== "CLOSED")} selectedJobId={view?.job.id} onSelect={setSelectedJobId} />
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
          <div className="action-row">
            <button onClick={() => mutate((db) => createEstimate(db, view.job.id))}>Create Estimate</button>
            <button onClick={() => mutate((db) => approveEstimate(db, view.job.id, view.estimate?.approval_note || "Approved"))}>Approve</button>
          </div>
        </div>
        <EstimateEditor view={view} mutate={mutate} />
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
        <PhotoEditor view={view} mutate={mutate} />
        <Timeline view={view} />
      </section>
    );
  }
  return (
    <section className="workspace single-panel">
      <div className="desk-panel command-panel">
        <PanelTitle icon={<FileText />} title="Job Card" subtitle="Add/edit remains available until closed" />
        <JobEditor view={view} users={state.users} mutate={mutate} allowStatus={false} />
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
  const [direction, setDirection] = useState("ALL");
  const [month, setMonth] = useState("");
  const uniqueMovements = Array.from(new Map(state.jobs.flatMap((view) => view.material_movements).map((movement) => [movement.id, movement])).values());
  const filtered = uniqueMovements.filter((movement) => {
    const item = state.inventory.find((row) => row.id === movement.item_id);
    const job = state.jobs.find((view) => view.job.id === movement.job_card_id);
    const matchesSearch = !normalizeSearch(search) || normalizeSearch(`${item?.sku ?? ""} ${item?.name ?? ""} ${job?.job.job_no ?? ""} ${movement.note}`).includes(normalizeSearch(search));
    return matchesSearch && (direction === "ALL" || movement.direction === direction) && (!month || movement.created_at.slice(0, 7) === month);
  });
  const columns: ExportColumn<MaterialMovement>[] = [
    { header: "Date", value: (row) => row.created_at },
    { header: "Item", value: (row) => state.inventory.find((item) => item.id === row.item_id)?.name ?? `Item ${row.item_id}` },
    { header: "Job", value: (row) => state.jobs.find((view) => view.job.id === row.job_card_id)?.job.job_no ?? "General stock" },
    { header: "Direction", value: (row) => row.direction },
    { header: "Quantity", value: (row) => row.qty },
    { header: "Note", value: (row) => row.note },
  ];
  return <div className="desk-panel store-list-page" role="tabpanel">
    <div className="store-filter-grid contextual-filter-bar">
      <label className="list-search">Quick search<input aria-label="Search stock movements" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Item, SKU, job or note" /></label>
      <label>Month-Year<input aria-label="Stock movement month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label>
      <label>Direction<select aria-label="Stock movement direction" value={direction} onChange={(event) => setDirection(event.target.value)}><option value="ALL">All movements</option>{Array.from(new Set(uniqueMovements.map((row) => row.direction))).sort().map((value) => <option key={value}>{value}</option>)}</select></label>
      <button onClick={() => { setSearch(""); setMonth(""); setDirection("ALL"); }}>Clear Filters</button>
    </div>
    <div className="list-result-controls"><ListExportControls report={{ title: "Stock Movements", filters: activeFilterSummary({ Search: search.trim(), Month: month, Direction: direction }), columns, rows: filtered }} /><span className="result-summary">{filtered.length} movement{filtered.length === 1 ? "" : "s"}</span></div>
    {filtered.length ? <div className="table-wrap"><table aria-label="Stock movement results"><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.header}>{column.value(row)}</td>)}</tr>)}</tbody></table></div> : <div className="list-empty"><h3>No matching movements</h3><button onClick={() => { setSearch(""); setMonth(""); setDirection("ALL"); }}>Clear filters</button></div>}
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
  const deferredSearch = useDeferredValue(search);
  const [primary, setPrimary] = useState("ALL");
  const [job, setJob] = useState("ALL");
  const [item, setItem] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const needle = normalizeSearch(deferredSearch);
  const reset = (action: () => void) => { action(); setPage(1); };
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
    <div className="store-filter-grid">
      <label className="list-search">Search<input aria-label={`Search ${title.toLocaleLowerCase()}`} value={search} onChange={(event) => reset(() => setSearch(event.target.value))} placeholder={kind === "stock" ? "SKU, item or category" : "Job, vehicle or item"} /></label>
      {kind === "stock" ? <>
        <label>Category<select aria-label="Stock category" value={primary} onChange={(event) => reset(() => setPrimary(event.target.value))}><option value="ALL">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Stock status<select aria-label="Stock status" value={job} onChange={(event) => reset(() => setJob(event.target.value))}><option value="ALL">All stock</option><option value="LOW">Low stock</option><option value="OK">In stock</option></select></label>
        <label>Unit<select aria-label="Stock unit" value={unit} onChange={(event) => reset(() => setUnit(event.target.value))}><option value="ALL">All units</option>{units.map((value) => <option key={value}>{value}</option>)}</select></label>
      </> : <>
        <label>{kind === "reconcile" ? "Reconciliation state" : "Request status"}<select aria-label={kind === "reconcile" ? "Reconciliation state" : "Request status"} value={primary} onChange={(event) => reset(() => setPrimary(event.target.value))}><option value="ALL">All states</option>{(kind === "reconcile" ? ["Matched", "Open"] : ["Pending", "Partially issued", "Issued", "Reconciled"]).map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Job<select aria-label={`${title} job`} value={job} onChange={(event) => reset(() => setJob(event.target.value))}><option value="ALL">All jobs</option>{uniqueJobs.map((row) => <option key={row.job.id} value={row.job.id}>{row.job.job_no}</option>)}</select></label>
        <label>Item<select aria-label={`${title} item`} value={item} onChange={(event) => reset(() => setItem(event.target.value))}><option value="ALL">All items</option>{inventory.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
      </>}
    </div>
    <div className="list-result-controls">
      <ListExportControls report={exportReport} />
      <div className="result-summary" aria-live="polite">Showing {paged.from} to {paged.to} of {paged.totalCount}</div>
      <label className="page-size">Per page<select aria-label={`${title} records per page`} value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select></label>
    </div>
    {paged.totalCount === 0 ? <div className="list-empty"><h3>No matching records</h3><p>Adjust the search or clear the filters.</p><button onClick={() => { setSearch(""); setPrimary("ALL"); setJob("ALL"); setItem("ALL"); setUnit("ALL"); setPage(1); }}>Clear filters</button></div> :
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

function Accounts({ activeMenuItem, state, view, mutate, setSelectedJobId }: { activeMenuItem: string; state: WorkshopState; view?: JobView; mutate: Mutate; setSelectedJobId: (id: number) => void }) {
  const [tally, setTally] = useState(view?.invoice?.tally_invoice_no || "TLY-NEW");
  const [amount, setAmount] = useState(view?.invoice?.total || 1000);
  const [mode, setMode] = useState("UPI");
  const [reference, setReference] = useState("MANUAL");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentModeFilter, setPaymentModeFilter] = useState("ALL");
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentPageSize, setPaymentPageSize] = useState(12);
  const [delivery, setDelivery] = useState({ by: "Accounts Desk", finalKm: view?.vehicle.km ?? 0, acknowledgement: "Customer acknowledged delivery" });
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
  if (!view) return null;
  const blockers = closureBlockers(view);
  if (activeMenuItem === "Payment") {
    const paymentNeedle = normalizeSearch(paymentSearch);
    const filteredPayments = view.payments.filter((payment) => (!paymentNeedle || normalizeSearch(`${payment.amount} ${payment.mode} ${payment.reference}`).includes(paymentNeedle)) && (paymentModeFilter === "ALL" || payment.mode === paymentModeFilter));
    const pagedPayments = paginate(filteredPayments, paymentPage, paymentPageSize);
    const paymentColumns: ExportColumn<(typeof view.payments)[number]>[] = [
      { header: "Amount", value: (payment) => payment.amount }, { header: "Mode", value: (payment) => payment.mode }, { header: "Reference", value: (payment) => payment.reference },
    ];
    return (
      <section className="workspace single-panel">
        <div className="desk-panel">
          <PanelTitle icon={<Banknote />} title="Payment" subtitle="Full or split collection" />
          <Info label="Invoice Total" value={money(view.invoice?.total ?? 0)} />
          <Info label="Paid" value={money(view.payments.reduce((sum, payment) => sum + payment.amount, 0))} />
          <div className="store-filter-grid"><label className="list-search">Search<input aria-label="Search payments" value={paymentSearch} onChange={(event) => { setPaymentSearch(event.target.value); setPaymentPage(1); }} placeholder="Amount, mode or reference" /></label><label>Mode<select aria-label="Payment mode filter" value={paymentModeFilter} onChange={(event) => { setPaymentModeFilter(event.target.value); setPaymentPage(1); }}><option value="ALL">All modes</option>{Array.from(new Set(view.payments.map((payment) => payment.mode))).map((value) => <option key={value}>{value}</option>)}</select></label></div>
          <div className="list-result-controls"><ListExportControls report={{ title: `Payments ${view.job.job_no}`, filters: activeFilterSummary({ Search: paymentSearch.trim(), Mode: paymentModeFilter }), columns: paymentColumns, rows: filteredPayments }} /><span className="result-summary">Showing {pagedPayments.from} to {pagedPayments.to} of {pagedPayments.totalCount}</span><label className="page-size">Per page<select aria-label="Payment records per page" value={paymentPageSize} onChange={(event) => { setPaymentPageSize(Number(event.target.value)); setPaymentPage(1); }}><option>12</option><option>24</option><option>48</option></select></label></div>
          {pagedPayments.items.map((payment) => (
            <div className="request-line" key={payment.id}>
              <strong>{money(payment.amount)}</strong>
              <span>
                {payment.mode} / {payment.reference}
              </span>
              <div className="action-row">
                <button onClick={() => mutate((db) => updatePayment(db, payment.id, payment.amount, payment.mode, `${payment.reference}-EDITED`))}>Mark Edited</button>
                <button className="danger-action" onClick={() => mutate((db) => voidPayment(db, payment.id, "Incorrect payment entry"))}>Void</button>
              </div>
            </div>
          ))}
          {pagedPayments.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setPaymentSearch(""); setPaymentModeFilter("ALL"); setPaymentPage(1); }}>Clear filters</button></div>}
          <ResultPagination page={pagedPayments.page} pageCount={pagedPayments.pageCount} onChange={setPaymentPage} />
          <label>
            Amount
            <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
          </label>
          <div className="form-grid">
            <label>
              Mode
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                {["UPI", "Card", "Cash", "Bank Transfer"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Reference
              <input value={reference} onChange={(event) => setReference(event.target.value)} />
            </label>
          </div>
          <button onClick={() => mutate((db) => addPayment(db, view.job.id, amount, mode, reference))}>Capture Payment</button>
        </div>
      </section>
    );
  }
  if (activeMenuItem === "Delivery") {
    return (
      <section className="workspace single-panel">
        <div className="desk-panel">
          <PanelTitle icon={<DoorOpen />} title="Delivery" subtitle="Receipt, gate pass, blockers" />
          <div className="form-grid">
            <label>
              Delivered By
              <input value={delivery.by} onChange={(event) => setDelivery({ ...delivery, by: event.target.value })} />
            </label>
            <label>
              Final KM
              <input type="number" value={delivery.finalKm} onChange={(event) => setDelivery({ ...delivery, finalKm: Number(event.target.value) })} />
            </label>
            <label>
              Acknowledgement
              <input value={delivery.acknowledgement} onChange={(event) => setDelivery({ ...delivery, acknowledgement: event.target.value })} />
            </label>
          </div>
          <Info label="Receipt" value={view.receipt?.receipt_no || "Not generated"} />
          <Info label="Gate Pass" value={view.gate_pass?.gate_pass_no || "Not generated"} />
          {blockers.map((blocker) => (
            <p className="blocker-pill" key={blocker}>
              {blocker}
            </p>
          ))}
          <div className="action-row">
            <button onClick={() => mutate((db) => updateDeliveryDetails(db, view.job.id, delivery.by, delivery.finalKm, delivery.acknowledgement))}>Save Delivery</button>
            <button onClick={() => mutate((db) => generateReceiptAndGatePass(db, view.job.id))}>Receipt + Gate Pass</button>
            <button disabled={blockers.length > 0} onClick={() => mutate((db) => closeJob(db, view.job.id))}>
              Close Job
            </button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="workspace single-panel">
      <div className="desk-panel close-desk">
        <PanelTitle icon={<ReceiptText />} title="Invoice" subtitle="Allowed after COMPLETED" />
        <Info label="Job Status" value={`${view.job.main_status} / ${view.job.sub_status}`} />
        <InvoiceSummary view={view} />
        <ListExportControls report={{ title: `Invoice ${view.job.job_no}`, filters: [], columns: [
          { header: "Invoice", value: (invoice: NonNullable<JobView["invoice"]>) => invoice.invoice_no }, { header: "Tally invoice", value: (invoice: NonNullable<JobView["invoice"]>) => invoice.tally_invoice_no },
          { header: "Total", value: (invoice: NonNullable<JobView["invoice"]>) => invoice.total }, { header: "Status", value: (invoice: NonNullable<JobView["invoice"]>) => invoice.status },
        ], rows: view.invoice ? [view.invoice] : [] }} />
        <label>
          Tally invoice number
          <input value={tally} onChange={(event) => setTally(event.target.value)} />
        </label>
        <div className="action-row">
          <button className="primary-action" disabled={view.job.main_status !== "COMPLETED"} onClick={() => mutate((db) => generateInvoice(db, view.job.id, tally))}>
            Generate Invoice
          </button>
          {view.invoice && <button className="danger-action" onClick={() => mutate((db) => voidInvoice(db, view.invoice!.id, "Regenerate requested"))}>Void Invoice</button>}
        </div>
      </div>
    </section>
  );
}

function Admin({ activeMenuItem, state, selected, mutate, setSelectedJobId, user }: { activeMenuItem: string; state: WorkshopState; selected?: JobView; mutate: Mutate; setSelectedJobId: (id: number) => void; user: User }) {
  const funnel = ["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"].map((status) => ({
    status,
    count: state.jobs.filter((view) => view.job.main_status === status).length,
  }));
  if (activeMenuItem === "Data Flow") {
    return (
      <section className="workspace single-panel">
        <div className="desk-panel data-flow">
          <PanelTitle icon={<ClipboardCheck />} title="Data Flow" subtitle={selected?.job.job_no ?? "Select a job"} />
          {selected && <DataFlow view={selected} />}
        </div>
      </section>
    );
  }
  if (activeMenuItem === "Jobs") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<FileText />} title="Jobs" subtitle="Linked operational records" />
          <JobRows jobs={state.jobs} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} />
        </div>
        <div className="desk-panel">
          <PanelTitle icon={<FileText />} title="Admin Job Detail" subtitle={selected?.job.job_no ?? "Select a job"} />
          {selected && (
            <>
              <JobEditor view={selected} users={state.users} mutate={mutate} allowStatus />
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
    return <ManagementHub state={state} mutate={mutate} actingUser={user} selected={selected} setSelectedJobId={setSelectedJobId} />;
  }
  if (activeMenuItem === "Admin Console") {
    return <AdminConsole state={state} mutate={mutate} actingUser={user} />;
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

const managementAreas = ["Users", "Customers", "Vehicles", "Visits / Jobs", "Estimates", "Tasks / QC", "Inventory / Materials", "Billing / Delivery"] as const;
type ManagementArea = (typeof managementAreas)[number];

function ManagementHub({ state, mutate, actingUser, selected, setSelectedJobId }: { state: WorkshopState; mutate: Mutate; actingUser: User; selected?: JobView; setSelectedJobId: (id: number) => void }) {
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
        <div className="management-tabs" role="tablist" aria-label="Management areas">
          {managementAreas.map((item) => <button key={item} role="tab" aria-selected={area === item} className={area === item ? "active" : ""} onClick={() => setArea(item)}>{item}</button>)}
        </div>
        {area === "Users" && <UsersPanel users={state.users} mutate={mutate} actingUser={actingUser} />}
        {area === "Customers" && <CustomerManager customers={state.customers} mutate={mutate} />}
        {area === "Vehicles" && <VehicleManager state={state} mutate={mutate} />}
        {area === "Visits / Jobs" && <VisitJobManager state={state} mutate={mutate} actingUser={actingUser} selected={selected} setSelectedJobId={setSelectedJobId} />}
        {area === "Estimates" && <EstimateManager view={selected} mutate={mutate} />}
        {area === "Tasks / QC" && <TaskQcManager view={selected} users={state.users} mutate={mutate} />}
        {area === "Inventory / Materials" && <InventoryMaterialsManager state={state} mutate={mutate} />}
        {area === "Billing / Delivery" && <BillingDeliveryManager state={state} view={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} />}
      </div>
    </section>
  );
}

function CustomerManager({ customers, mutate }: { customers: Customer[]; mutate: Mutate }) {
  const empty: Customer = { id: 0, name: "", mobile: "", type: "Individual" };
  const [draft, setDraft] = useState<Customer>(empty);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const needle = normalizeSearch(search);
  const filtered = customers.filter((item) => !needle || normalizeSearch(`${item.name} ${item.mobile} ${item.type}`).includes(needle));
  const paged = paginate(filtered, page, pageSize);
  const columns: ExportColumn<Customer>[] = [
    { header: "Customer", value: (row) => row.name }, { header: "Mobile", value: (row) => row.mobile }, { header: "Type", value: (row) => row.type },
  ];
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><h3>Customers</h3><button className="primary-action" onClick={() => { setDraft(empty); setEditing(true); }}>Add Customer</button></div>
    {editing && <Dialog title={draft.id ? "Edit Customer" : "Add Customer"} onClose={() => setEditing(false)}><CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setEditing(false)} /></Dialog>}
    <div className="store-filter-grid"><label className="list-search">Search<input aria-label="Search customers" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, mobile or type" /></label><button onClick={() => { setSearch(""); setPage(1); }}>Clear filters</button></div>
    <div className="list-result-controls"><DownloadMenu report={{ title: "Customers", filters: activeFilterSummary({ Search: search.trim() }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><label className="page-size">Per page<select aria-label="Customer records per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select></label></div>
    <div className="record-list">{paged.items.map((customer) => <div className="managed-record" key={customer.id}><div><strong>{customer.name}</strong><span>{customer.mobile} · {customer.type}</span></div><div className="action-row"><button onClick={() => { setDraft(customer); setEditing(true); }}>Edit</button><button className="danger-action" onClick={() => mutate((db) => archiveCustomer(db, customer.id, "Archived by Admin"))}>Archive</button></div></div>)}</div>
    {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearch(""); setPage(1); }}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

function VehicleManager({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const empty: Vehicle = { id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0 };
  const [draft, setDraft] = useState<Vehicle>(empty);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
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
    <div className="panel-actions"><h3>Vehicles</h3><button className="primary-action" onClick={() => { setDraft(empty); setEditing(true); }}>Add Vehicle</button></div>
    {editing && <Dialog title={draft.id ? "Edit Vehicle" : "Add Vehicle"} onClose={() => setEditing(false)}><VehicleMasterPanel embedded key={draft.id} state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setEditing(false)} /></Dialog>}
    <div className="store-filter-grid"><label className="list-search">Search<input aria-label="Search vehicles" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Registration, make, model or customer" /></label><button onClick={() => { setSearch(""); setPage(1); }}>Clear filters</button></div>
    <div className="list-result-controls"><DownloadMenu report={{ title: "Vehicles", filters: activeFilterSummary({ Search: search.trim() }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><label className="page-size">Per page<select aria-label="Vehicle records per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select></label></div>
    <div className="record-list">{paged.items.map((vehicle) => <div className="managed-record" key={vehicle.id}><div><strong>{vehicle.number}</strong><span>{vehicle.make} {vehicle.model} · {state.customers.find((customer) => customer.id === vehicle.customer_id)?.name ?? "—"}</span></div><div className="action-row"><button onClick={() => { setDraft(vehicle); setEditing(true); }}>Edit</button><button className="danger-action" onClick={() => mutate((db) => archiveVehicle(db, vehicle.id, "Archived by Admin"))}>Archive</button></div></div>)}</div>
    {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearch(""); setPage(1); }}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
  </div>;
}

function VisitJobManager({ state, mutate, actingUser, selected, setSelectedJobId }: { state: WorkshopState; mutate: Mutate; actingUser: User; selected?: JobView; setSelectedJobId: (id: number) => void }) {
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const needle = normalizeSearch(search);
  const filtered = state.jobs.filter((row) => (!needle || normalizeSearch(`${row.job.job_no} ${row.vehicle.number} ${row.customer.name}`).includes(needle)) && (status === "ALL" || row.job.main_status === status));
  const paged = paginate(filtered, page, pageSize);
  const columns: ExportColumn<JobView>[] = [
    { header: "Job", value: (row) => row.job.job_no }, { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name }, { header: "Status", value: (row) => row.job.main_status },
  ];
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><h3>Visits / Jobs</h3><button className="primary-action" onClick={() => setCreating(true)}>Create Visit / Job</button></div>
    {creating && <Dialog wide title="Create Visit / Job" subtitle="Pick a customer and vehicle to prefill intake, then complete the rest" onClose={() => setCreating(false)}><Reception embedded activeMenuItem="Receive Vehicle" state={state} mutate={mutate} user={actingUser} selected={selected} setSelectedJobId={setSelectedJobId} onCreated={() => setCreating(false)} /></Dialog>}
    <div className="store-filter-grid"><label className="list-search">Search<input aria-label="Search visits / jobs" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, vehicle or customer" /></label><label>Status<select aria-label="Job status filter" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="ALL">All statuses</option>{["NEW", "IN_PROGRESS", "COMPLETED", "HOLD", "CANCELLED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}</select></label><button onClick={() => { setSearch(""); setStatus("ALL"); setPage(1); }}>Clear filters</button></div>
    <div className="list-result-controls"><DownloadMenu report={{ title: "Visits / Jobs", filters: activeFilterSummary({ Search: search.trim(), Status: status }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><label className="page-size">Per page<select aria-label="Visit / job records per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select></label></div>
    <JobRows jobs={paged.items} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} />
    {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearch(""); setStatus("ALL"); setPage(1); }}>Clear filters</button></div>}
    <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    {selected && <div className="admin-override"><strong>Admin override</strong><JobEditor view={selected} users={state.users} mutate={mutate} allowStatus /><button className="danger-action" onClick={() => mutate((db) => cancelJobCard(db, selected.job.id, "Admin override: archived from Management Hub"))}>Archive Job</button></div>}
  </div>;
}

function EstimateManager({ view, mutate }: { view?: JobView; mutate: Mutate }) {
  return <div className="manager-panel" role="tabpanel"><div className="panel-actions"><h3>Estimates</h3><button className="primary-action" disabled={!view} onClick={() => view && mutate((db) => createEstimate(db, view.job.id))}>Create Estimate</button></div>{view ? <EstimateEditor view={view} mutate={mutate} /> : <p className="empty-state">Select a job first.</p>}</div>;
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
  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><h3>Inventory / Materials</h3><div className="action-row"><button className="primary-action" onClick={() => setAddingItem(true)}>Add / Edit Inventory Item</button><button className="primary-action" onClick={() => setAddingRequest(true)}>Add / Edit Material Request</button></div></div>
    {addingItem && <Dialog title="Inventory Item" subtitle="Master, stock-in and adjustment" onClose={() => setAddingItem(false)}><InventoryEditor embedded state={state} mutate={mutate} /></Dialog>}
    {addingRequest && <Dialog title="Material Request" subtitle="Job-linked material request" onClose={() => setAddingRequest(false)}><MaterialRequestEditor embedded state={state} mutate={mutate} /></Dialog>}
    <div className="record-list">{state.inventory.map((item) => <div className="managed-record" key={item.id}><div><strong>{item.name}</strong><span>{item.sku} · {item.category} · Stock {item.stock_qty} {item.unit}</span></div></div>)}</div>
  </div>;
}

function BillingDeliveryManager({ state, view, mutate, setSelectedJobId }: { state: WorkshopState; view?: JobView; mutate: Mutate; setSelectedJobId: (id: number) => void }) {
  const [mode, setMode] = useState<"Invoice" | "Payment" | "Delivery">("Invoice");
  return <div className="manager-panel" role="tabpanel"><div className="panel-actions"><h3>Billing / Delivery</h3><span className="override-badge">Reasoned voids preserve financial history</span></div><div className="sub-tabs" aria-label="Billing actions">{(["Invoice", "Payment", "Delivery"] as const).map((item) => <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>)}</div>{view ? <Accounts activeMenuItem={mode} state={state} view={view} mutate={mutate} setSelectedJobId={setSelectedJobId} /> : <p className="empty-state">Select a job first.</p>}</div>;
}

// `externalAuth` is set exactly when this session authenticated against the real Frappe backend
// (Task 2's frappeLogin/loadFrappeSession), as opposed to the local sql.js demo login - that's
// the signal for which user directory is "real" here, without threading AuthConfig through
// Admin/ManagementHub/AdminConsole just for this one panel. The branch lives in this wrapper
// (not inside UserManager's own body) because UserManager calls useState/etc. unconditionally;
// an early return before those hooks would violate the Rules of Hooks if actingUser.externalAuth
// ever changed while the component stayed mounted.
export function UsersPanel({ users, mutate, actingUser }: { users: User[]; mutate: Mutate; actingUser: User }) {
  if (actingUser.externalAuth) return <FrappeUserManager actorEmail={actingUser.externalId ?? actingUser.email} />;
  return <UserManager users={users} mutate={mutate} actingUser={actingUser} />;
}

function UserManager({ users, mutate, actingUser }: { users: User[]; mutate: Mutate; actingUser: User }) {
  const empty: User = { id: 0, name: "", email: "", role: "service", password: "" };
  const [draft, setDraft] = useState<User>(empty);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
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
        <form onSubmit={async (event) => {
          event.preventDefault();
          if (await mutate((db) => draft.id ? updateUser(db, draft.id, draft) : createUser(db, draft))) setEditing(false);
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
      <div className="store-filter-grid"><label className="list-search">Search<input aria-label="Search users" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email or role" /></label><label>Role<select aria-label="Filter users by role" value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }}><option value="ALL">All roles</option>{Object.entries(roleLabels).map(([role, label]) => <option key={role} value={role}>{label}</option>)}</select></label><label>Status<select aria-label="Filter users by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}><option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></select></label><button onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); setPage(1); }}>Clear filters</button></div>
      <div className="list-result-controls"><DownloadMenu report={{ title: "Users", filters: activeFilterSummary({ Search: search.trim(), Role: roleFilter === "ALL" ? "ALL" : roleLabels[roleFilter as Role], Status: statusFilter }), columns: userColumns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><label className="page-size">Per page<select aria-label="User records per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select></label></div>
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
      {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearch(""); setRoleFilter("ALL"); setPage(1); }}>Clear filters</button></div>}
      <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
    </div>
  );
}

type FrappeUserDraft = Pick<AdminUser, "id" | "name" | "email" | "roleIds" | "branchIds" | "version">;

function FrappeUserManager({ actorEmail }: { actorEmail: string }) {
  const [directory, setDirectory] = useState<AdminDirectory>({ users: [], roles: [], branches: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<FrappeUserDraft>({ id: "", name: "", email: "", roleIds: [], branchIds: [], version: 0 });

  const refresh = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      setDirectory(await adminUsersApi.list());
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
  }, []);

  const run = async (action: () => Promise<unknown>, closeEditor = false) => {
    setBusy(true);
    setError("");
    try {
      await action();
      if (closeEditor) setEditing(false);
      await refresh(true);
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally { setBusy(false); }
  };

  const toggle = (kind: "roleIds" | "branchIds", id: string) => {
    const current = draft[kind];
    setDraft({ ...draft, [kind]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] });
  };

  const startNew = () => {
    setDraft({ id: "", name: "", email: "", roleIds: directory.roles[0] ? [directory.roles[0].id] : [], branchIds: [], version: 0 });
    setEditing(true);
    setError("");
  };

  return <div className="manager-panel" role="tabpanel">
    <div className="panel-actions"><div><h3>Users</h3><span>Accounts are managed directly against the Frappe backend.</span></div><button className="primary-action" onClick={startNew}>Add User</button></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    {editing && <form onSubmit={(event) => {
      event.preventDefault();
      if (draft.id) void run(() => adminUsersApi.update(draft as AdminUser), true);
      else void run(() => adminUsersApi.create({ name: draft.name, email: draft.email, roleIds: draft.roleIds, branchIds: draft.branchIds }), true);
    }}>
      <div className="form-grid">
        <label>User name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
        <label>User email<input required type="email" disabled={Boolean(draft.id)} value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /><small>{draft.id ? "Email cannot be changed after creation." : "A default WorkshopOS password is set; share it with the new user directly."}</small></label>
      </div>
      <fieldset className="assignment-fieldset"><legend>Roles</legend>{directory.roles.map((role) => <label key={role.id}><input type="checkbox" checked={draft.roleIds.includes(role.id)} onChange={() => toggle("roleIds", role.id)} />{roleLabels[role.id as Role] ?? role.name}</label>)}</fieldset>
      <fieldset className="assignment-fieldset"><legend>Branch assignment</legend>{directory.branches.map((branch) => <label key={branch.id}><input type="checkbox" checked={draft.branchIds.includes(branch.id)} onChange={() => toggle("branchIds", branch.id)} />{branch.name}</label>)}</fieldset>
      <div className="action-row"><button className="primary-action" disabled={busy}>{draft.id ? "Save Changes" : "Create User"}</button><button type="button" disabled={busy} onClick={() => setEditing(false)}>Cancel</button></div>
    </form>}
    {loading ? <p className="empty-state">Loading users…</p> : <div className="record-list">{directory.users.map((item) => <div className="managed-record" key={item.id}>
      <div><strong>{item.name}</strong><span>{item.email} · {item.roles.map((role) => roleLabels[role.id as Role] ?? role.name).join(", ")}</span><span>{item.branches.map((branch) => branch.name).join(", ") || "No branch assigned"} · <b className={`membership-status ${item.status.toLowerCase()}`}>{item.status}</b></span></div>
      <div className="action-row">
        <button disabled={busy} onClick={() => { setDraft({ id: item.id, name: item.name, email: item.email, roleIds: item.roleIds, branchIds: item.branchIds, version: item.version }); setEditing(true); }}>Edit</button>
        <button className="danger-action" disabled={busy || item.id === actorEmail || item.status === "ARCHIVED"} title={item.id === actorEmail ? "You cannot archive your own signed-in account" : undefined} onClick={() => {
          const reason = window.prompt("Why is this user being archived?");
          if (reason?.trim()) void run(() => adminUsersApi.archive(item.id, reason));
        }}>Archive</button>
      </div>
    </div>)}</div>}
    {!loading && directory.users.length === 0 && <p className="empty-state">No users found.</p>}
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
    <form className={embedded ? "" : "desk-panel"} onSubmit={async (event) => {
      event.preventDefault();
      if (await mutate((db) => (value.id ? updateCustomer(db, value.id, value) : createCustomer(db, value)))) onSaved?.();
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
    <form className={embedded ? "" : "desk-panel"} onSubmit={async (event) => {
      event.preventDefault();
      if (await mutate((db) => (draft.id ? updateVehicle(db, draft.id, draft) : createVehicle(db, draft)))) onSaved?.();
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

function JobEditor({ view, users, mutate, allowStatus }: { view: JobView; users: User[]; mutate: Mutate; allowStatus: boolean }) {
  // Forward-only progression for the generic Status select: HOLD/CANCELLED/reopen/resume each have
  // their own dedicated, note-required action below, so they are deliberately excluded here — this
  // keeps every option this dropdown offers a transition that `updateJobCard` will actually accept.
  const statuses: MainStatus[] = [view.job.main_status, ...MAIN_STATUS_TRANSITIONS[view.job.main_status].filter((next) => next !== "HOLD" && next !== "CANCELLED")];
  const subStatuses: SubStatus[] = ["Gather Requirements", "Create Estimate", "Get Confirmation", "Material Requested", "Material Issued", "Washing Needed", "Work Started", "Follow-up Needed", "Photos Shared", "QC Pending", "Customer Verification", "Invoice Ready", "Payment Received", "Receipt Generated", "Gate Pass Generated", "Delivered"];
  const [draft, setDraft] = useState({
    advisor_id: view.job.advisor_id,
    technician_id: view.job.technician_id,
    main_status: view.job.main_status,
    sub_status: view.job.sub_status,
    work_list: view.job.work_list,
    promised_at: view.job.promised_at,
    advisor_notes: view.job.advisor_notes ?? "",
    customer_instructions: view.job.customer_instructions ?? "",
    internal_instructions: view.job.internal_instructions ?? "",
  });
  const [statusNote, setStatusNote] = useState("");
  const [lifecycleNote, setLifecycleNote] = useState("");
  const status = view.job.main_status;
  const runLifecycle = async (action: (db: Database, jobId: number, note: string) => void) => {
    const ok = await mutate((db) => action(db, view.job.id, lifecycleNote));
    if (ok) setLifecycleNote("");
  };
  return (
    <>
      <form onSubmit={(event) => {
        event.preventDefault();
        mutate((db) => updateJobCard(db, view.job.id, draft, statusNote));
        setStatusNote("");
      }}>
        <div className="form-grid">
          <label>Advisor<select value={draft.advisor_id} onChange={(event) => setDraft({ ...draft, advisor_id: Number(event.target.value) })}>{users.filter((item) => item.role === "service").map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}</select></label>
          <label>Technician<select value={draft.technician_id} onChange={(event) => setDraft({ ...draft, technician_id: Number(event.target.value) })}>{users.filter((item) => item.role === "tech").map((tech) => <option key={tech.id} value={tech.id}>{tech.name}</option>)}</select></label>
          {allowStatus && (status === "NEW" || status === "IN_PROGRESS" || status === "COMPLETED") && <label>Status<select value={draft.main_status} onChange={(event) => setDraft({ ...draft, main_status: event.target.value as MainStatus })}>{statuses.map((option) => <option key={option}>{option}</option>)}</select></label>}
          {allowStatus && <label>Sub Status<select value={draft.sub_status} onChange={(event) => setDraft({ ...draft, sub_status: event.target.value as SubStatus })}>{subStatuses.map((option) => <option key={option}>{option}</option>)}</select></label>}
          <label>Promised<input value={draft.promised_at} onChange={(event) => setDraft({ ...draft, promised_at: event.target.value })} /></label>
        </div>
        <label>Work List<input value={draft.work_list} onChange={(event) => setDraft({ ...draft, work_list: event.target.value })} /></label>
        <label>Customer Instructions<input value={draft.customer_instructions} onChange={(event) => setDraft({ ...draft, customer_instructions: event.target.value })} /></label>
        <label>Internal Instructions<input value={draft.internal_instructions} onChange={(event) => setDraft({ ...draft, internal_instructions: event.target.value })} /></label>
        <label>Advisor Notes<input value={draft.advisor_notes} onChange={(event) => setDraft({ ...draft, advisor_notes: event.target.value })} /></label>
        {allowStatus && <label>Status Change Note<input value={statusNote} onChange={(event) => setStatusNote(event.target.value)} placeholder="Why is this being saved/changed?" /></label>}
        <button className="primary-action">Save Job Card</button>
      </form>
      {allowStatus && status !== "CLOSED" && (status === "COMPLETED" || status === "HOLD" || status === "CANCELLED") && (
        <div className="editor-block job-lifecycle-actions">
          <PanelTitle icon={<ClipboardList />} title="Status Lifecycle" subtitle="Hold, cancel, resume or reopen — every change needs a note" />
          <label>Lifecycle Note<input required value={lifecycleNote} onChange={(event) => setLifecycleNote(event.target.value)} placeholder="Reason for this status change" /></label>
          <div className="action-row">
            {status === "COMPLETED" && <button type="button" disabled={!lifecycleNote.trim()} onClick={() => runLifecycle(holdJobCard)}>Place on Hold</button>}
            {status === "HOLD" && <button type="button" disabled={!lifecycleNote.trim()} onClick={() => runLifecycle(resumeJobCard)}>Resume (back to In Progress)</button>}
            {status === "HOLD" && <button type="button" className="danger-action" disabled={!lifecycleNote.trim()} onClick={() => runLifecycle(cancelJobCardStatus)}>Cancel Job</button>}
            {status === "CANCELLED" && <button type="button" disabled={!lifecycleNote.trim()} onClick={() => runLifecycle(reopenJobCard)}>Reopen (back to In Progress)</button>}
          </div>
        </div>
      )}
    </>
  );
}

function EstimateEditor({ view, mutate }: { view: JobView; mutate: Mutate }) {
  const [item, setItem] = useState<EstimateItem>({ id: 0, estimate_id: view.estimate?.id ?? 0, kind: "Service", description: "", qty: 1, rate: 0 });
  const [meta, setMeta] = useState({ discount: view.estimate?.discount ?? 0, gst_rate: view.estimate?.gst_rate ?? 18, approval_note: view.estimate?.approval_note ?? "" });
  return (
    <div className="desk-panel">
      <PanelTitle icon={<ReceiptText />} title="Estimate Items" subtitle="Add, edit, archive and approve" />
      {view.estimate_items.map((existing) => (
        <button className={item.id === existing.id ? "row active" : "row"} key={existing.id} onClick={() => setItem(existing)}>
          <strong>{existing.description}</strong><span>{existing.kind}</span><span>{money(existing.qty * existing.rate)}</span>
        </button>
      ))}
      {view.estimate && <form onSubmit={(event) => {
        event.preventDefault();
        mutate((db) => updateEstimate(db, view.estimate!.id, meta));
      }}>
        <div className="form-grid">
          <label>Discount<input type="number" value={meta.discount} onChange={(event) => setMeta({ ...meta, discount: Number(event.target.value) })} /></label>
          <label>GST %<input type="number" value={meta.gst_rate} onChange={(event) => setMeta({ ...meta, gst_rate: Number(event.target.value) })} /></label>
        </div>
        <label>Approval Note<input value={meta.approval_note} onChange={(event) => setMeta({ ...meta, approval_note: event.target.value })} /></label>
        <button>Save Estimate Header</button>
      </form>}
      <form onSubmit={(event) => {
        event.preventDefault();
        const estimateId = view.estimate?.id;
        mutate((db) => {
          const id = estimateId ?? createEstimate(db, view.job.id);
          item.id ? updateEstimateItem(db, item.id, { ...item, estimate_id: id }) : createEstimateItem(db, { ...item, estimate_id: id });
        });
        setItem({ id: 0, estimate_id: view.estimate?.id ?? 0, kind: "Service", description: "", qty: 1, rate: 0 });
      }}>
        <div className="form-grid">
          <label>Kind<select value={item.kind} onChange={(event) => setItem({ ...item, kind: event.target.value as "Service" | "Material" })}><option>Service</option><option>Material</option></select></label>
          <label>Description<input value={item.description} onChange={(event) => setItem({ ...item, description: event.target.value })} /></label>
          <label>Qty<input type="number" value={item.qty} onChange={(event) => setItem({ ...item, qty: Number(event.target.value) })} /></label>
          <label>Rate<input type="number" value={item.rate} onChange={(event) => setItem({ ...item, rate: Number(event.target.value) })} /></label>
        </div>
        <div className="action-row">
          <button className="primary-action">{item.id ? "Update Item" : "Add Item"}</button>
          {item.id > 0 && <button type="button" className="danger-action" onClick={() => mutate((db) => archiveEstimateItem(db, item.id, "Archived from estimate"))}>Archive Item</button>}
        </div>
      </form>
    </div>
  );
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

function PhotoEditor({ view, mutate, embedded = false }: { view: JobView; mutate: Mutate; embedded?: boolean }) {
  const [draft, setDraft] = useState<Photo>({ id: 0, job_card_id: view.job.id, label: "", category: "Progress", src: "" });
  return (
    <form className={embedded ? "" : "desk-panel"} onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (draft.id ? updatePhoto(db, draft.id, draft) : createPhoto(db, draft)));
    }}>
      {!embedded && <PanelTitle icon={<Camera />} title="Photos" subtitle="Label, category and image link" />}
      {view.photos.map((photo) => <button type="button" className={draft.id === photo.id ? "row active" : "row"} key={photo.id} onClick={() => setDraft(photo)}><strong>{photo.label}</strong><span>{photo.category || "General"}</span><span>{photo.src || "No link"}</span></button>)}
      <div className="form-grid">
        <label>Label<input value={draft.label} onChange={(event) => setDraft({ ...draft, label: event.target.value })} /></label>
        <label>Category<input value={draft.category ?? ""} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label>
      </div>
      <label>Upload/Link<input value={draft.src} onChange={(event) => setDraft({ ...draft, src: event.target.value })} /></label>
      <div className="action-row">
        <button className="primary-action">Save Photo</button>
        {draft.id > 0 && <button type="button" className="danger-action" onClick={() => mutate((db) => archivePhoto(db, draft.id, "Archived photo"))}>Archive</button>}
      </div>
    </form>
  );
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
  return <form onSubmit={async (event) => { event.preventDefault(); if (await mutate((db) => createTask(db, { job_card_id: view.job.id, technician_id: technicianId, title, status: "Pending", notes }))) { setTitle(""); setNotes(""); onCreated?.(); } }}><label>New Task<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Notes<input value={notes} onChange={(event) => setNotes(event.target.value)} /></label><button>Add Task</button></form>;
}

function QcEditor({ view, technicianId, mutate }: { view: JobView; technicianId: number; mutate: Mutate }) {
  const [reason, setReason] = useState("Rework required");
  return (
    <div className="qc-box">
      {view.qc_checks.map((check: QcCheck) => <div className="request-line" key={check.id}><strong>{check.label}</strong><span>{check.passed ? "Pass" : check.fail_reason || "Pending"}</span><div className="action-row"><button onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}>Pass</button><button onClick={() => mutate((db) => failQcWithRework(db, check.id, technicianId, reason))}>Fail + Rework</button></div></div>)}
      <label>Fail/Rework Reason<input value={reason} onChange={(event) => setReason(event.target.value)} /></label>
      <div className="action-row">
        <button onClick={() => mutate((db) => markWashingNeeded(db, view.job.id))}>Washing Needed</button>
        <button onClick={() => mutate((db) => addPhoto(db, view.job.id, "Technician progress photo"))}>Photo</button>
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

function DataFlow({ view }: { view: JobView }) {
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const steps = [
    ["Visit", Boolean(view.visit), view.visit.received_at],
    ["Estimate", Boolean(view.estimate), view.estimate?.status ?? "Missing"],
    ["Job Card", Boolean(view.job), view.job.sub_status],
    ["Material", view.material_requests.length > 0, `${view.material_requests.length} request(s)`],
    ["Work", view.tasks.length > 0, `${view.tasks.filter((task) => task.status === "Completed").length}/${view.tasks.length} complete`],
    ["QC", view.job.qc_status === "Pass", view.job.qc_status],
    ["Invoice", Boolean(view.invoice?.tally_invoice_no), view.invoice?.tally_invoice_no || "Missing"],
    ["Payment", Boolean(view.invoice && paid >= view.invoice.total), money(paid)],
    ["Gate Pass", Boolean(view.gate_pass), view.gate_pass?.gate_pass_no || "Missing"],
  ];
  return (
    <>
      {steps.map(([label, ok, detail]) => <div key={String(label)} className={ok ? "flow-step ok" : "flow-step blocked"}><Check size={16} />{label}: {detail}</div>)}
      {closureBlockers(view).map((blocker) => <p className="blocker-pill" key={blocker}>{blocker}</p>)}
      <Timeline view={view} />
    </>
  );
}

function Timeline({ view }: { view: JobView }) {
  return <div className="desk-panel"><PanelTitle icon={<ClipboardCheck />} title="Status History" subtitle={view.job.job_no} />{view.status_history.map((item) => <Info key={item.id} label={item.created_at} value={`${item.main_status} / ${item.sub_status}: ${item.note}`} />)}</div>;
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

function DuplicatePhotoEditor({ view, mutate }: { view: JobView; mutate: Mutate }) {
  const [label, setLabel] = useState("Progress photo");
  return (
    <div className="desk-panel">
      <PanelTitle icon={<Camera />} title="Photos" subtitle="Job photo placeholders" />
      {view.photos.map((photo) => (
        <div className="request-line" key={photo.id}>
          <Info label={photo.category || "Photo"} value={photo.label} />
          <button className="danger-action" onClick={() => mutate((db) => archivePhoto(db, photo.id, "Removed photo"))}>Archive Photo</button>
        </div>
      ))}
      <label>Label<input value={label} onChange={(event) => setLabel(event.target.value)} /></label>
      <button onClick={() => mutate((db) => createPhoto(db, { job_card_id: view.job.id, label, category: "Workshop", src: "" }))}>Add Photo</button>
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

function EntityList({ kind, state, mutate, role, userId, initialSelectedId, onInitialSelectionConsumed }: { kind: EntityKind; state: WorkshopState; mutate: Mutate; role: Role; userId: number; initialSelectedId?: number; onInitialSelectionConsumed?: () => void }) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [filter, setFilter] = useState("ALL");
  const [secondaryFilter, setSecondaryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("ALL");
  const [vehicleFilter, setVehicleFilter] = useState("ALL");
  const [advisorFilter, setAdvisorFilter] = useState("ALL");
  const [sort, setSort] = useState(kind === "jobs" ? "newest" : "alphabetical");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedId, setSelectedId] = useState<number | undefined>(initialSelectedId);
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
    return state.jobs.flatMap((job) => job.photos.map((photo) => ({ photo, job }))).filter(({ photo, job }) => {
      const matchesText = !needle || normalizeSearch(`${photo.label} ${job.job.job_no} ${job.vehicle.number}`).includes(needle);
      return matchesText && (filter === "ALL" || String(photo.job_card_id) === filter) && (secondaryFilter === "ALL" || (photo.category || "General") === secondaryFilter);
    }).sort((a, b) => b.photo.id - a.photo.id);
  }, [deferredSearch, filter, secondaryFilter, state.jobs]);

  const filtered: unknown[] = kind === "jobs" ? jobs : kind === "customers" ? customers : kind === "vehicles" ? vehicles : media;
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => { if (paged.page !== page) setPage(paged.page); }, [paged.page, page]);

  const changePage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => resultHeading.current?.focus());
  };
  const resetPage = (action: () => void) => { action(); setPage(1); };
  const openRecord = (id: number) => { scrollPosition.current = window.scrollY; setSelectedId(id); };
  const closeRecord = () => { setSelectedId(undefined); requestAnimationFrame(() => window.scrollTo(0, scrollPosition.current)); };

  if (selectedId !== undefined) {
    const selectedJob = kind === "jobs" ? state.jobs.find((item) => item.job.id === selectedId) : kind === "media" ? state.jobs.find((item) => item.photos.some((photo) => photo.id === selectedId)) : undefined;
    const selectedCustomer = kind === "customers" ? state.customers.find((item) => item.id === selectedId) : undefined;
    const selectedVehicle = kind === "vehicles" ? state.vehicles.find((item) => item.id === selectedId) : undefined;
    const selectedPhoto = selectedJob?.photos.find((photo) => photo.id === selectedId);
    return <section className="record-workspace">
      <button className="back-button" onClick={closeRecord}>← Back to {entityTitle(kind)}</button>
      <div className="list-page-heading"><div><h2>{kind === "jobs" ? "Job Card Workspace" : `${entityTitle(kind)} Detail`}</h2><p>Focused record workspace</p></div></div>
      {selectedJob && kind === "jobs" && <div className="job-detail-layout"><aside className="desk-panel"><PanelTitle icon={<Car />} title="Customer & Vehicle" subtitle={selectedJob.job.job_no} /><JobSnapshot view={selectedJob} /><Info label="Media" value={selectedJob.photos.length} /></aside><JobEditor key={selectedJob.job.updated_at} view={selectedJob} users={state.users} mutate={mutate} allowStatus={role === "admin" || role === "service"} /></div>}
      {selectedCustomer && <div className="workspace two-panel"><CustomerDetail key={`${selectedCustomer.id}-${selectedCustomer.updated_at}`} customer={selectedCustomer} mutate={mutate} /><div className="desk-panel"><PanelTitle icon={<Car />} title="Linked vehicles" subtitle={selectedCustomer.name} />{state.vehicles.filter((vehicle) => vehicle.customer_id === selectedCustomer.id).map((vehicle) => <Info key={vehicle.id} label={vehicle.number} value={`${vehicle.make} ${vehicle.model}`} />)}</div></div>}
      {selectedVehicle && <VehicleMasterPanel key={selectedVehicle.updated_at} state={state} value={selectedVehicle} setValue={() => undefined} mutate={mutate} />}
      {selectedJob && selectedPhoto && kind === "media" && <div className="job-detail-layout"><aside className="desk-panel"><img className="media-detail-image" src={selectedPhoto.src || "/media-placeholder.svg"} alt={selectedPhoto.label} /><Info label="Vehicle" value={selectedJob.vehicle.number} /><Info label="Job" value={selectedJob.job.job_no} /></aside><PhotoEditor key={selectedPhoto.updated_at} view={selectedJob} mutate={mutate} /></div>}
    </section>;
  }

  const title = entityTitle(kind);
  const categories = Array.from(new Set(state.jobs.flatMap((job) => job.photos.map((photo) => photo.category || "General")))).sort();
  const customerTypes = Array.from(new Set(state.customers.map((customer) => customer.type))).sort();
  const jobCustomerOptions = Array.from(new Map(state.jobs.map((item) => [item.customer.id, item.customer])).values()).sort((a, b) => a.name.localeCompare(b.name));
  const jobVehicleOptions = Array.from(new Map(state.jobs.map((item) => [item.vehicle.id, item.vehicle])).values()).sort((a, b) => a.number.localeCompare(b.number));
  const jobAdvisorOptions = Array.from(new Map(state.jobs.map((item) => [item.advisor.id, item.advisor])).values()).sort((a, b) => a.name.localeCompare(b.name));
  const canCreate = (kind === "customers" || kind === "vehicles") && (role === "admin" || role === "reception") || kind === "media" && (role === "admin" || role === "service");
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
    <div className="list-page-heading"><div><h2 ref={resultHeading} tabIndex={-1}>{title}</h2><p>{kind === "media" ? "Before, after and workshop documentation" : `Browse and manage ${title.toLocaleLowerCase()}`}</p></div>{canCreate && <button className="primary-action" onClick={() => setCreating(true)}>{createLabel}</button>}</div>
    {creating && <Dialog title={createLabel} onClose={() => setCreating(false)}>
      {kind === "customers" && <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} />}
      {kind === "vehicles" && <VehicleMasterPanel embedded state={state} value={{ id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0 }} setValue={() => undefined} mutate={mutate} />}
      {kind === "media" && state.jobs[0] && <PhotoEditor embedded view={state.jobs[0]} mutate={mutate} />}
    </Dialog>}
    <div className="list-filter-bar">
      <label className="list-search">Search<input aria-label={`Search ${title.toLocaleLowerCase()}`} value={search} placeholder={searchPlaceholder(kind)} onChange={(event) => resetPage(() => setSearch(event.target.value))} /></label>
      <button className="mobile-filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}>{filtersOpen ? "Hide filters" : "Show filters"}</button>
      <div className={filtersOpen ? "list-filter-fields open" : "list-filter-fields"}>
        {kind === "jobs" && <>
          <label>Main status<select aria-label="Main status" value={filter} onChange={(event) => resetPage(() => setFilter(event.target.value))}><option value="ALL">All statuses</option>{["NEW", "IN_PROGRESS", "COMPLETED", "HOLD", "CANCELLED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Workflow<select aria-label="Workflow status" value={secondaryFilter} onChange={(event) => resetPage(() => setSecondaryFilter(event.target.value))}><option value="ALL">All workflows</option>{Array.from(new Set(state.jobs.map((item) => item.job.sub_status))).map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Received date<input aria-label="Received date" type="date" value={dateFilter} onChange={(event) => resetPage(() => setDateFilter(event.target.value))} /></label>
          <label>Received month<input aria-label="Received month" type="month" value={monthFilter} onChange={(event) => resetPage(() => setMonthFilter(event.target.value))} /></label>
          <label>Customer<select aria-label="Customer filter" value={customerFilter} onChange={(event) => resetPage(() => setCustomerFilter(event.target.value))}><option value="ALL">All customers</option>{jobCustomerOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Vehicle<select aria-label="Vehicle filter" value={vehicleFilter} onChange={(event) => resetPage(() => setVehicleFilter(event.target.value))}><option value="ALL">All vehicles</option>{jobVehicleOptions.map((item) => <option key={item.id} value={item.id}>{item.number}</option>)}</select></label>
          <label>Service advisor<select aria-label="Service advisor filter" value={advisorFilter} onChange={(event) => resetPage(() => setAdvisorFilter(event.target.value))}><option value="ALL">All advisors</option>{jobAdvisorOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        </>}
        {kind === "customers" && <label>Customer type<select aria-label="Customer type" value={filter} onChange={(event) => resetPage(() => setFilter(event.target.value))}><option value="ALL">All types</option>{customerTypes.map((value) => <option key={value}>{value}</option>)}</select></label>}
        {kind === "media" && <><label>Job card<select aria-label="Job card filter" value={filter} onChange={(event) => resetPage(() => setFilter(event.target.value))}><option value="ALL">All job cards</option>{state.jobs.map((item) => <option value={item.job.id} key={item.job.id}>{item.job.job_no}</option>)}</select></label><label>Category<select aria-label="Media category" value={secondaryFilter} onChange={(event) => resetPage(() => setSecondaryFilter(event.target.value))}><option value="ALL">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label></>}
        {kind !== "media" && <label>Sort<select aria-label="Sort results" value={sort} onChange={(event) => resetPage(() => setSort(event.target.value))}>{kind === "jobs" ? <><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="amount">Amount</option></> : <><option value="alphabetical">Alphabetical</option><option value="recent">Recent</option></>}</select></label>}
        <button onClick={() => { setSearch(""); setFilter("ALL"); setSecondaryFilter("ALL"); setDateFilter(""); setMonthFilter(""); setCustomerFilter("ALL"); setVehicleFilter("ALL"); setAdvisorFilter("ALL"); setPage(1); }}>Clear filters</button>
      </div>
    </div>
    {kind === "media" && <MediaKpis rows={media} />}
    <div className="list-result-controls">
      <ListExportControls report={{ title, filters: exportFilters, columns: exportColumns, rows: filtered }} />
      <ViewModeToggle value={viewMode} onChange={setViewMode} />
      <div className="result-summary" aria-live="polite">Showing {paged.from} to {paged.to} of {paged.totalCount}</div>
      <label className="page-size">Per page<select aria-label="Records per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select></label>
    </div>
    {paged.totalCount === 0 ? <div className="list-empty"><h3>No matching records</h3><p>Adjust the search or clear the filters.</p><button onClick={() => { setSearch(""); setFilter("ALL"); setSecondaryFilter("ALL"); setDateFilter(""); setMonthFilter(""); setCustomerFilter("ALL"); setVehicleFilter("ALL"); setAdvisorFilter("ALL"); setPage(1); }}>Clear filters</button></div> : <EntityResults kind={kind} rows={paged.items} state={state} viewMode={viewMode} role={role} openRecord={openRecord} mutate={mutate} />}
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
  return <nav className="result-pagination" aria-label="Results pagination"><button disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button><span className="mobile-page-label">Page {page} of {pageCount}</span><div className="numbered-pages">{pageNumbers(page, pageCount).map((number) => <button key={number} aria-current={page === number ? "page" : undefined} className={page === number ? "active" : ""} onClick={() => onChange(number)}>{number}</button>)}</div><button disabled={page >= pageCount} onClick={() => onChange(page + 1)}>Next</button></nav>;
}

function ListExportControls({ report }: { report: { title: string; filters: string[]; columns: ExportColumn<any>[]; rows: any[] } }) {
  return <DownloadMenu report={report} />;
}

function MediaKpis({ rows }: { rows: { photo: Photo; job: JobView }[] }) {
  const before = rows.filter(({ photo }) => photo.category === "Before").length;
  const after = rows.filter(({ photo }) => photo.category === "After").length;
  return <div className="media-kpis"><Info label="Total Images" value={rows.length} /><Info label="Before Images" value={before} /><Info label="After Images" value={after} /><Info label="Job Cards" value={new Set(rows.map(({ job }) => job.job.id)).size} /></div>;
}

function EntityResults({ kind, rows, state, viewMode, role, openRecord, mutate }: { kind: EntityKind; rows: unknown[]; state: WorkshopState; viewMode: ViewMode; role: Role; openRecord: (id: number) => void; mutate: Mutate }) {
  const canArchive = role === "admin" || role === "reception" || (role === "service" && (kind === "jobs" || kind === "media"));
  const archive = (id: number) => {
    if (!window.confirm(`Archive this ${kind === "media" ? "media record" : kind.slice(0, -1)}? It remains recoverable in the local database.`)) return;
    mutate((db) => kind === "jobs" ? cancelJobCard(db, id, "Archived from list") : kind === "customers" ? archiveCustomer(db, id, "Archived from list") : kind === "vehicles" ? archiveVehicle(db, id, "Archived from list") : archivePhoto(db, id, "Archived from list"));
  };
  const cardFor = (raw: unknown): ReactNode => {
    if (kind === "jobs") { const row = raw as JobView; return <article className="record-card job-card" key={row.job.id}><div className="record-identity"><strong>{row.vehicle.number}</strong><span>{row.vehicle.make} {row.vehicle.model}</span></div><h3>{row.job.job_no}</h3><p>{row.customer.name} · {row.customer.mobile}</p><Status status={row.job.main_status} sub={row.job.sub_status} /><Info label="Total" value={money(jobTotal(row))} /><RecordActions onView={() => openRecord(row.job.id)} onArchive={canArchive ? () => archive(row.job.id) : undefined} /></article>; }
    if (kind === "customers") { const row = raw as Customer; const vehicles = state.vehicles.filter((item) => item.customer_id === row.id); const jobs = state.jobs.filter((item) => item.customer.id === row.id); return <article className="record-card" key={row.id}><div className="record-identity"><strong>{row.name}</strong><span>{row.mobile}</span></div><span className="category-badge">{row.type}</span><Info label="Vehicles" value={vehicles.length} /><Info label="Open jobs" value={jobs.filter((job) => job.job.main_status !== "CLOSED").length} /><Info label="Last visit" value={jobs[0]?.visit.received_at?.slice(0, 10) || "—"} /><RecordActions onView={() => openRecord(row.id)} onArchive={canArchive ? () => archive(row.id) : undefined} /></article>; }
    if (kind === "vehicles") { const row = raw as Vehicle; const customer = state.customers.find((item) => item.id === row.customer_id); return <article className="record-card" key={row.id}><div className="record-identity"><strong>{row.number}</strong><span>{row.make} {row.model}</span></div><p><i className="color-swatch" style={{ background: row.color }} />{row.color}</p><Info label="Customer" value={customer?.name ?? "—"} /><Info label="KM" value={row.km.toLocaleString("en-IN")} /><RecordActions onView={() => openRecord(row.id)} onArchive={canArchive ? () => archive(row.id) : undefined} /></article>; }
    const { photo, job } = raw as { photo: Photo; job: JobView }; return <article className="record-card media-card" key={photo.id}><div className="media-preview"><img src={photo.src || "/media-placeholder.svg"} alt={photo.label} /><span>{photo.category || "General"}</span></div><h3>{job.vehicle.number}</h3><p>{job.job.job_no} · {photo.label}</p><RecordActions onView={() => openRecord(photo.id)} onArchive={canArchive ? () => archive(photo.id) : undefined} /></article>;
  };
  const cards = <div className={`record-grid ${kind}`}>{rows.map(cardFor)}</div>;
  if (viewMode === "grid") return cards;
  return <><div className="mobile-table-fallback">{cards}</div><div className="table-wrap"><table><thead><tr>{tableHeaders(kind).map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((raw) => <EntityTableRow key={rowId(kind, raw)} kind={kind} raw={raw} state={state} canArchive={canArchive} openRecord={openRecord} archive={archive} />)}</tbody></table></div></>;
}

function RecordActions({ onView, onArchive }: { onView: () => void; onArchive?: () => void }) { return <div className="record-actions"><button onClick={onView}>View</button><button onClick={onView}>Edit</button>{onArchive && <button className="danger-action" onClick={onArchive}>Archive</button>}</div>; }
function CustomerDetail({ customer, mutate }: { customer: Customer; mutate: Mutate }) { const [draft, setDraft] = useState(customer); return <CustomerEditor value={draft} setValue={setDraft} mutate={mutate} />; }
function tableHeaders(kind: EntityKind) { return kind === "jobs" ? ["Job", "Vehicle", "Customer", "Status", "Total", "Actions"] : kind === "customers" ? ["Customer", "Mobile", "Type", "Vehicles", "Open Jobs", "Actions"] : kind === "vehicles" ? ["Registration", "Make / Model", "Color", "Customer", "KM", "Actions"] : ["Preview", "Label", "Category", "Vehicle / Job", "Actions"]; }
function rowId(kind: EntityKind, raw: unknown) { return kind === "jobs" ? (raw as JobView).job.id : kind === "media" ? (raw as { photo: Photo }).photo.id : (raw as Customer | Vehicle).id; }
function EntityTableRow({ kind, raw, state, canArchive, openRecord, archive }: { kind: EntityKind; raw: unknown; state: WorkshopState; canArchive: boolean; openRecord: (id: number) => void; archive: (id: number) => void }) {
  const id = rowId(kind, raw); let cells: ReactNode[];
  if (kind === "jobs") { const row = raw as JobView; cells = [row.job.job_no, `${row.vehicle.number} · ${row.vehicle.make} ${row.vehicle.model}`, row.customer.name, <Status status={row.job.main_status} sub={row.job.sub_status} />, money(jobTotal(row))]; }
  else if (kind === "customers") { const row = raw as Customer; cells = [row.name, row.mobile, row.type, state.vehicles.filter((item) => item.customer_id === row.id).length, state.jobs.filter((item) => item.customer.id === row.id && item.job.main_status !== "CLOSED").length]; }
  else if (kind === "vehicles") { const row = raw as Vehicle; cells = [row.number, `${row.make} ${row.model}`, row.color, state.customers.find((item) => item.id === row.customer_id)?.name ?? "—", row.km.toLocaleString("en-IN")]; }
  else { const { photo, job } = raw as { photo: Photo; job: JobView }; cells = [<img className="table-thumb" src={photo.src || "/media-placeholder.svg"} alt="" />, photo.label, photo.category || "General", `${job.vehicle.number} · ${job.job.job_no}`]; }
  return <tr>{cells.map((cell, index) => <td key={index}>{cell}</td>)}<td><RecordActions onView={() => openRecord(id)} onArchive={canArchive ? () => archive(id) : undefined} /></td></tr>;
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
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const needle = normalizeSearch(deferredSearch);
  const filtered = useMemo(() => jobs.filter((row) => (!needle || normalizeSearch(`${row.job.job_no} ${row.vehicle.number} ${row.customer.name}`).includes(needle)) && (status === "ALL" || row.job.main_status === status)), [jobs, needle, status]);
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => { if (paged.page !== page) setPage(paged.page); }, [paged.page, page]);
  const columns: ExportColumn<JobView>[] = [
    { header: "Job", value: (row) => row.job.job_no }, { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name }, { header: "Status", value: (row) => row.job.main_status }, { header: "Workflow", value: (row) => row.job.sub_status },
  ];
  return <div className="embedded-list">
    <div className="store-filter-grid"><label className="list-search">Search<input aria-label={`Search ${title.toLocaleLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, vehicle or customer" /></label>{showStatusFilter && <label>Status<select aria-label={`${title} status`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="ALL">All statuses</option>{["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}</select></label>}</div>
    <div className="list-result-controls"><ListExportControls report={{ title, filters: activeFilterSummary({ Search: search.trim(), Status: status }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><label className="page-size">Per page<select aria-label={`${title} records per page`} value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>12</option><option>24</option><option>48</option></select></label></div>
    {paged.totalCount ? <JobRows jobs={paged.items} selectedJobId={selectedJobId} onSelect={onSelect} /> : <div className="list-empty"><h3>No matching records</h3><button onClick={() => { setSearch(""); setStatus("ALL"); setPage(1); }}>Clear filters</button></div>}
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

export type Mutate = (action: (database: Database) => void) => Promise<boolean>;

export default App;
