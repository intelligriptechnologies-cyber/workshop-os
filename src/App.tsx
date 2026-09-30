import {
  Banknote,
  Boxes,
  Camera,
  CalendarDays,
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
  Pencil,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Printer,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Workflow,
  Wrench,
} from "lucide-react";
import type { Database } from "sql.js";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  JobPicker,
  localCalendarDate,
  todayJobPeriod,
  type JobPeriod,
} from "./job-picker";
import { dashboardFacts } from "./dashboard-metrics";
import { isServiceActiveJob, serviceFollowupStatus } from "./service-advisor";
import { ExpectedTodayBookings } from "./booking-expected-today";
import {
  addFollowup,
  adjustStock,
  approveEstimate,
  approveEstimateForActor,
  archiveUser,
  archiveCustomer,
  archiveEstimateItem,
  archiveFollowup,
  archiveInventoryItem,
  archiveLocalPurchase,
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
  createInwardPurchaseDraft,
  createSupplierForActor,
  createLocalPurchase,
  createMaterialRequest,
  createTask,
  createUser,
  createVehicle,
  failQcWithRework,
  issueMaterial,
  releaseMaterialRowForActor,
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
  canMutateBilling,
  saveEstimateForActor,
  saveJobPhotoForActor,
  setChecklistItemCheckedForActor,
  setChecklistItemNotApplicableForActor,
  transitionJobStatusForActor,
  searchJobs,
  stockIn,
  createPurchaseOrderForActor,
  updatePurchaseOrderForActor,
  setPurchaseOrderStatusForActor,
  recordStockInwardForActor,
  submitInwardPurchaseForActor,
  sendInwardPurchaseForPoApprovalForActor,
  approveInwardPurchaseForActor,
  receiveAndPostInwardPurchaseForActor,
  updateInwardPurchaseDraftForActor,
  updateSupplierForActor,
  archiveSupplierForActor,
  reviseInwardPurchaseForActor,
  updateCustomer,
  updateEstimate,
  updateEstimateItem,
  updateFollowup,
  updateInventoryItem,
  updateJobCard,
  updateJobCardForActor,
  saveJobDetailsForActor,
  purchaseStockAndIssueForActor,
  updateMaterialRequest,
  updateLocalPurchase,
  updateJobPhotoForActor,
  updateQcCheck,
  updateTask,
  updateUser,
  updateVisit,
  updateVehicle,
  presentAdvisors,
  setAdvisorPresent,
  assignAdvisor,
  todayKey,
  ADVISOR_NOT_MAPPED_LABEL,
  setDamageMarksForActor,
  submitMaterialApprovalForActor,
  decideMaterialApprovalForActor,
  resubmitMaterialApprovalForActor,
  addJobTaskListItemForActor,
  updateJobTaskListItemForActor,
  archiveJobTaskListItemForActor,
  prefillEstimateFromTaskListForActor,
} from "./db";
import type {
  InwardPurchaseAttachmentInput,
  InwardPurchaseLineInput,
  PurchaseOrderInput,
} from "./db";
import type {
  ChecklistItem,
  Customer,
  EstimateItem,
  Followup,
  InventoryItem,
  InwardPurchase,
  JobView,
  LocalPurchase,
  MainStatus,
  MaterialMovement,
  MaterialPurchaseRequest,
  MaterialRequest,
  Payment,
  PaymentMode,
  Photo,
  PurchaseOrder,
  PurchaseOrderLine,
  QcCheck,
  Role,
  SearchCriteria,
  SubStatus,
  Supplier,
  Task,
  TaskStatus,
  User,
  Vehicle,
  ViewMode,
  WorkshopState,
} from "./types";
import {
  activeFilterSummary,
  DEFAULT_PAGE_SIZE,
  normalizeSearch,
  paginate,
} from "./list-utils";
import type { ExportColumn } from "./export-utils";
import {
  beginCognitoLogin,
  endCognitoSession,
  loadAuthConfig,
  loadWorkshopSession,
  type AuthConfig,
  type CognitoConfig,
} from "./auth";
import {
  adminUsersApi,
  AdminApiError,
  type AdminDirectory,
  type AdminUser,
} from "./admin-users-api";
import { JobSheetSection } from "./job-sheet-ui";
import { BodyMarkDiagram } from "./body-mark";
import {
  FUEL_LEVELS,
  PICKUP_DROP_OPTIONS,
  SERVICE_TYPES,
  parseDamageMarks,
  serializeDamageMarks,
  type DamageMark,
} from "./job-sheet";
import { InventoryPicker, JobMaterialsPanel } from "./materials-ui";
import { MATERIALS_CHECKLIST_LABELS, materialRowActionsFor } from "./materials";
import {
  JOB_CARD_TABS,
  isStubTab,
  type JobCardTabKey,
} from "./job-card-layout";
import {
  Dialog,
  DownloadMenu,
  FilterClearButton,
  handleTabListKeyDown,
  ListSearchActions,
  SearchSelect,
  Switch,
} from "./ui-kit";
import { AdminConsole } from "./admin-console";
import { BookingCalendar } from "./booking-calendar";
import {
  APP_THEME_FONTS,
  APP_THEME_PALETTES,
  loadAdminDemoState,
  PAGE_LABEL_BY_KEY,
  resolvePermittedPages,
  resolveRoleMenuPageKeys,
  type AdminPageKey,
  type AppTheme,
} from "./admin-demo-state";
import {
  renderJobDocument,
  renderSnapshotDocument,
  printRenderedDocument,
  DOCUMENT_LABELS,
  resolveJobDocumentActions,
  resolveJobDocuments,
  type DocumentKind,
  type RenderedDocument,
} from "./job-documents";
import {
  clearDocumentSnapshots,
  loadDocumentSnapshots,
  syncDocumentSnapshots,
} from "./document-snapshots";
import { renderHtmlToPdf } from "./pdf-render";
import {
  buildDataFlowTimeline,
  buildStageRows,
  summarizeJobLifecycle,
  buildGhostSteps,
  type DataFlowEvent,
  dataFlowDates,
  dataFlowMonths,
  filterDataFlowJobs,
} from "./data-flow";
import {
  buildInvoiceDraft,
  canCompleteWithInvoice,
  canCreateInvoice,
  GST_RATES,
  invoiceTotals,
  unissuedWarning,
  type GstType,
} from "./invoice-math";
import {
  BillingManager,
  InvoiceDialog,
  JobInvoicePanel,
  JobPaymentPanel,
  type BillingMode,
} from "./billing-manager";
import {
  compressMediaFile,
  type JobMediaCategory,
  type PreparedJobMedia,
} from "./job-media";
import { PaginationToolbar, ResultPagination } from "./pagination-toolbar";

export { ResultPagination } from "./pagination-toolbar";

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
  key: AdminPageKey;
  label: string;
  icon: React.ReactNode;
};

const MENU_ICON_BY_PAGE_KEY: Partial<Record<AdminPageKey, React.ReactNode>> = {
  "advance-bookings": <CalendarDays size={18} />,
  "today-queue": <Car size={18} />,
  customers: <UserRound size={18} />,
  vehicles: <Car size={18} />,
  search: <Search size={18} />,
  "my-queue": <ClipboardList size={18} />,
  "job-card": <FileText size={18} />,
  estimate: <ReceiptText size={18} />,
  "follow-ups": <ClipboardCheck size={18} />,
  media: <Camera size={18} />,
  "material-requests": <PackageCheck size={18} />,
  "issue-material": <Package size={18} />,
  reconcile: <Check size={18} />,
  stock: <Boxes size={18} />,
  approvals: <ShieldCheck size={18} />,
  "inward-purchases": <ReceiptText size={18} />,
  "my-tasks": <Wrench size={18} />,
  "work-update": <ClipboardCheck size={18} />,
  "qc-prep": <ShieldCheck size={18} />,
  "ready-to-invoice": <ClipboardList size={18} />,
  invoice: <ReceiptText size={18} />,
  payment: <Banknote size={18} />,
  delivery: <DoorOpen size={18} />,
  dashboard: <Gauge size={18} />,
  "data-flow": <ClipboardCheck size={18} />,
  jobs: <FileText size={18} />,
  manage: <ShieldCheck size={18} />,
  "admin-console": <Settings size={18} />,
};

export function menuItemsForRole(
  role: Role,
  permittedPages: readonly AdminPageKey[],
): MenuItem[] {
  return resolveRoleMenuPageKeys(role, permittedPages).map((key) => ({
    key,
    label: PAGE_LABEL_BY_KEY[key],
    icon: MENU_ICON_BY_PAGE_KEY[key],
  }));
}

const demoLogins = [
  "admin@example.com",
  "service@example.com",
  "advisor.aa@example.com",
  "advisor.bb1@example.com",
  "reception@example.com",
  "accounts@example.com",
  "store@example.com",
  "tech@example.com",
];

export type SearchTableCategory =
  "job" | "customer" | "vehicle" | "invoice" | "payment" | "stock";
type AdminOperationalSearchCategory =
  | "material-requests"
  | "issue-material"
  | "reconcile"
  | "stock"
  | "estimate"
  | "follow-ups";
type SearchCategorySelection =
  SearchTableCategory | Exclude<AdminOperationalSearchCategory, "stock">;

const CATEGORY_PAGE_KEYS: Record<SearchTableCategory, AdminPageKey[]> = {
  job: [
    "jobs",
    "my-queue",
    "today-queue",
    "material-requests",
    "my-tasks",
    "ready-to-invoice",
  ],
  customer: ["customers"],
  vehicle: ["vehicles"],
  invoice: ["jobs", "my-queue", "invoice"],
  payment: ["admin-console"],
  stock: ["stock"],
};

const SEARCH_CATEGORY_LABELS: Record<SearchTableCategory, string> = {
  job: "Job Card",
  customer: "Customer",
  vehicle: "Vehicle",
  invoice: "Invoice",
  payment: "Payments",
  stock: "Stock",
};
const ADMIN_OPERATIONAL_SEARCH_CATEGORIES: readonly AdminOperationalSearchCategory[] =
  [
    "material-requests",
    "issue-material",
    "reconcile",
    "stock",
    "estimate",
    "follow-ups",
  ];
const ADMIN_OPERATIONAL_SEARCH_LABELS: Record<
  AdminOperationalSearchCategory,
  string
> = {
  "material-requests": "Material Requests",
  "issue-material": "Issue Material",
  reconcile: "Reconcile Stock",
  stock: "Stock",
  estimate: "Estimate",
  "follow-ups": "Follow-ups",
};
const SEARCH_MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
type PaymentSearchRow = { view: JobView; payment: Payment };
type DashboardDrilldown = {
  destination: string;
  month?: string;
  date?: string;
  status?: string;
  category?: SearchTableCategory;
  lowStockOnly?: boolean;
  stockTab?: "Inventory List" | "Low Stock";
  served?: "customers" | "vehicles";
};

function paymentRowHighlight(mode: PaymentMode) {
  const classes: Record<PaymentMode, string> = {
    Cash: "billing-row-payment-cash",
    UPI: "billing-row-payment-upi",
    Card: "billing-row-payment-card",
    "Bank transfer": "billing-row-payment-bank-transfer",
    Other: "billing-row-payment-other",
  };
  return classes[mode];
}

function findMenuLabelForPage(
  role: Role,
  key: AdminPageKey,
  permittedPages: readonly AdminPageKey[],
): string | undefined {
  return menuItemsForRole(role, permittedPages).find((item) => item.key === key)
    ?.label;
}

function workshopRole(names: string[]): Role {
  const value = names.join(" ").toLowerCase();
  if (value.includes("admin") || value.includes("owner")) return "admin";
  if (value.includes("reception")) return "reception";
  if (value.includes("technician")) return "tech";
  if (value.includes("store")) return "store";
  if (value.includes("accounts") || value.includes("cashier"))
    return "accounts";
  return "service";
}

const apiErrors: Record<string, string> = {
  EMAIL_EXISTS: "That email already belongs to a WorkshopOS account.",
  ROLE_NOT_FOUND: "One of the selected roles is no longer available.",
  BRANCH_FORBIDDEN: "You cannot assign one of the selected branches.",
  FINAL_ADMIN_REQUIRED: "The final active Admin must remain assigned.",
  SELF_ARCHIVE_FORBIDDEN: "You cannot archive your own signed-in account.",
  QUOTA_EXCEEDED: "This business has reached its user quota.",
  VERSION_CONFLICT:
    "This user changed elsewhere. The latest details have been loaded.",
  IDENTITY_PROVIDER_ERROR: "Cognito could not complete the request. Try again.",
  MEMBERSHIP_REQUIRED:
    "Your account does not have an active WorkshopOS membership.",
};

function apiErrorMessage(error: unknown) {
  const code =
    error instanceof AdminApiError
      ? error.code
      : error instanceof Error
        ? error.message
        : "API_FAILED";
  return (
    apiErrors[code] ?? "WorkshopOS could not complete the request. Try again."
  );
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
  const [searchCategory, setSearchCategory] = useState<
    SearchCategorySelection | ""
  >("");
  const [searchStatus, setSearchStatus] =
    useState<SearchCriteria["status"]>("ALL");
  const [searchDateFilter, setSearchDateFilter] = useState("");
  const [searchMonthFilter, setSearchMonthFilter] = useState("");
  const [searchPaymentMode, setSearchPaymentMode] = useState<
    "ALL" | PaymentMode
  >("ALL");
  const [searchLowStockOnly, setSearchLowStockOnly] = useState(false);
  const [searchNavigate, setSearchNavigate] = useState<{
    kind: "jobs" | "customers" | "vehicles";
    id: number;
  }>();
  const [stockSearchNavigate, setStockSearchNavigate] = useState<string>();
  const [dashboardDrilldown, setDashboardDrilldown] =
    useState<DashboardDrilldown>();
  const [adminStateVersion, setAdminStateVersion] = useState(0);
  const [appTheme, setAppTheme] = useState<AppTheme>(
    () => loadAdminDemoState().appTheme,
  );
  const [loginError, setLoginError] = useState("");
  const [authConfig, setAuthConfig] = useState<AuthConfig>();
  const [authLoading, setAuthLoading] = useState(true);
  const currentAdminState = useMemo(
    () => loadAdminDemoState(),
    [adminStateVersion],
  );

  useEffect(() => {
    if (!user) return;
    const items = menuItemsForRole(
      user.role,
      resolvePermittedPages(currentAdminState, user.role),
    );
    if (!items.some((item) => item.label === activeMenuItem))
      setActiveMenuItem(items[0]?.label ?? "");
  }, [activeMenuItem, currentAdminState, user]);

  useEffect(() => {
    openWorkshopDb().then((database) => {
      setDb(database);
      const next = readState(database);
      syncDocumentSnapshots(undefined, next.jobs, loadAdminDemoState());
      setState(next);
      setSelectedJobId(next.jobs[0]?.job.id);
    });
  }, []);

  useEffect(() => {
    const font =
      APP_THEME_FONTS.find((item) => item.id === appTheme.fontId) ??
      APP_THEME_FONTS[0];
    const palette =
      APP_THEME_PALETTES.find((item) => item.id === appTheme.paletteId) ??
      APP_THEME_PALETTES[0];
    const root = document.documentElement;
    root.style.setProperty("--app-font-family", font.cssFamily);
    root.style.setProperty("--app-theme-background", palette.tokens.background);
    root.style.setProperty("--app-theme-sidebar", palette.tokens.sidebar);
    root.style.setProperty(
      "--app-theme-sidebar-border",
      palette.tokens.sidebarBorder,
    );
    root.style.setProperty(
      "--app-theme-sidebar-text",
      palette.tokens.sidebarText,
    );
    root.style.setProperty("--app-theme-active", palette.tokens.active);
    root.style.setProperty(
      "--app-theme-active-border",
      palette.tokens.activeBorder,
    );
    root.style.setProperty("--app-theme-hover", palette.tokens.hover);
    root.style.setProperty("--app-theme-accent", palette.tokens.accent);
    root.style.setProperty("--app-theme-focus", palette.tokens.focus);
    root.style.setProperty(
      "--app-theme-table-header",
      palette.tokens.tableHeader,
    );
  }, [appTheme]);

  useEffect(() => {
    loadAuthConfig()
      .then(async (config) => {
        setAuthConfig(config);
        if (config.mode === "cognito") {
          try {
            const session = await loadWorkshopSession(config);
            if (session) {
              const role = workshopRole(
                session.membership.roles.map((item) => item.name),
              );
              const authenticatedUser: User = {
                id: -1,
                name: session.membership.displayName,
                email: session.membership.email,
                role,
                password: "",
                externalAuth: true,
                externalId: session.membership.id,
              };
              setUser(authenticatedUser);
              const items = menuItemsForRole(
                role,
                resolvePermittedPages(loadAdminDemoState(), role),
              );
              setActiveMenuItem(items[0]?.label ?? "");
            }
          } catch (error) {
            setLoginError(apiErrorMessage(error));
          }
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    const moveRailToggle = (clientY: number) => {
      if (Math.abs(clientY - railToggleStartY.current) > 4)
        railToggleMoved.current = true;
      const nextTop = Math.min(
        Math.max(clientY - 22, 82),
        window.innerHeight - 92,
      );
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
    () =>
      searchCategory === "job" || searchCategory === "invoice"
        ? {
            query,
            category: searchCategory,
            status: searchCategory === "job" ? searchStatus : "ALL",
          }
        : undefined,
    [query, searchCategory, searchStatus],
  );
  const searchResults = useMemo(
    () => (state && searchCriteria ? searchJobs(state, searchCriteria) : []),
    [state, searchCriteria],
  );
  const jobs = useMemo(
    () =>
      searchResults
        .map((result) => result.view)
        .filter(
          (view) =>
            (!searchDateFilter ||
              (searchCategory === "job"
                ? view.job.estimated_delivery
                : view.visit.received_at.slice(0, 10)) === searchDateFilter) &&
            (searchDateFilter ||
              !searchMonthFilter ||
              (searchCategory === "job"
                ? view.job.estimated_delivery
                : view.visit.received_at.slice(0, 7)
              )?.slice(0, 7) === searchMonthFilter),
        ),
    [searchResults, searchCategory, searchDateFilter, searchMonthFilter],
  );
  const paymentRows = useMemo(() => {
    if (!state || searchCategory !== "payment") return [];
    const needle = normalizeSearch(query);
    return state.jobs
      .flatMap((view) => view.payments.map((payment) => ({ view, payment })))
      .filter(({ view, payment }) => {
        const paidAt = payment.created_at ?? "";
        const searchable = normalizeSearch(
          [
            view.job.job_no,
            view.invoice?.invoice_no,
            view.invoice?.tally_invoice_no,
            view.customer.name,
            view.customer.mobile,
            view.vehicle.number,
            view.vehicle.make,
            view.vehicle.model,
            payment.mode,
            payment.reference,
            payment.other_detail,
          ].join(" "),
        );
        return (
          !payment.voided_at &&
          (!needle || searchable.includes(needle)) &&
          (searchPaymentMode === "ALL" || payment.mode === searchPaymentMode) &&
          (!searchDateFilter || paidAt.slice(0, 10) === searchDateFilter) &&
          (!searchMonthFilter || paidAt.slice(0, 7) === searchMonthFilter)
        );
      })
      .sort((left, right) =>
        (right.payment.created_at ?? "").localeCompare(
          left.payment.created_at ?? "",
        ),
      );
  }, [
    state,
    searchCategory,
    query,
    searchPaymentMode,
    searchDateFilter,
    searchMonthFilter,
  ]);
  const selected =
    state?.jobs.find((item) => item.job.id === selectedJobId) ?? state?.jobs[0];

  const mutate: Mutate = (action, onError) => {
    if (!db) return false;
    try {
      action(db);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action failed";
      if (onError) onError(message);
      else window.alert(message);
      return false;
    }
    persist(db);
    const next = readState(db);
    if (action === loadLargeDemoDataset) clearDocumentSnapshots();
    syncDocumentSnapshots(
      action === loadLargeDemoDataset ? undefined : state?.jobs,
      next.jobs,
      loadAdminDemoState(),
    );
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
    const items = menuItemsForRole(
      found.role,
      resolvePermittedPages(loadAdminDemoState(), found.role),
    );
    setActiveMenuItem(items[0]?.label ?? "");
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
    setSearchPaymentMode("ALL");
  };

  const handleRailTogglePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    railToggleDragging.current = true;
    railToggleMoved.current = false;
    railToggleStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleRailTogglePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!railToggleDragging.current) return;
    if (Math.abs(event.clientY - railToggleStartY.current) > 4)
      railToggleMoved.current = true;
    const nextTop = Math.min(
      Math.max(event.clientY - 22, 82),
      window.innerHeight - 92,
    );
    setRailToggleTop(nextTop);
  };

  const handleRailTogglePointerUp = () => {
    if (!railToggleDragging.current) return;
    railToggleDragging.current = false;
    if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
  };

  const handleRailToggleMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    railToggleDragging.current = true;
    railToggleMoved.current = false;
    railToggleStartY.current = event.clientY;
  };

  if (!state || authLoading)
    return <div className="loading">Loading WorkshopOS...</div>;
  if (!user)
    return (
      <LoginScreen
        onLogin={handleLogin}
        onCognitoLogin={() =>
          authConfig?.mode === "cognito" && beginCognitoLogin(authConfig)
        }
        config={authConfig}
        error={loginError}
      />
    );

  // Reads the (session-storage backed) Admin Console role/page-access state fresh on every
  // render so a role's permitted pages here reflect the latest Roles & Page Access save made
  // in the Admin Console during this session, without the two stores needing to be merged.
  const permittedPages = resolvePermittedPages(currentAdminState, user.role);
  const menuItems = menuItemsForRole(user.role, permittedPages);

  const leaveSearch = () => {
    setQuery("");
    setSearchCategory("");
    setSearchStatus("ALL");
    setSearchDateFilter("");
    setSearchMonthFilter("");
    setSearchPaymentMode("ALL");
  };
  const openStockSearchRecord = (item: InventoryItem) => {
    if (user.role === "admin") {
      setQuery("");
      setSearchCategory("stock");
      setSearchStatus("ALL");
      setSearchDateFilter("");
      setSearchMonthFilter("");
      setSearchPaymentMode("ALL");
      setActiveMenuItem("Search");
      return;
    }
    const label = findMenuLabelForPage(user.role, "stock", permittedPages);
    if (label) {
      setStockSearchNavigate(item.sku);
      leaveSearch();
      setActiveMenuItem(label);
    }
  };
  const openSearchRecord = (
    view: JobView,
    category: Exclude<SearchTableCategory, "stock">,
  ) => {
    if (category === "customer") {
      const label = findMenuLabelForPage(
        user.role,
        "customers",
        permittedPages,
      );
      if (label) {
        setSearchNavigate({ kind: "customers", id: view.customer.id });
        setActiveMenuItem(label);
      }
      return;
    }
    if (category === "vehicle") {
      const label = findMenuLabelForPage(user.role, "vehicles", permittedPages);
      if (label) {
        setSearchNavigate({ kind: "vehicles", id: view.vehicle.id });
        setActiveMenuItem(label);
      }
      return;
    }
    if (category === "job") {
      const label =
        findMenuLabelForPage(user.role, "jobs", permittedPages) ??
        findMenuLabelForPage(user.role, "my-queue", permittedPages);
      if (label) {
        setSearchNavigate({ kind: "jobs", id: view.job.id });
        setActiveMenuItem(label);
      }
      return;
    }
    // invoice: prefer the role's own dedicated Invoice workflow page (Accounts) when granted;
    // otherwise fall back to the Jobs/My Queue record workspace, which also surfaces invoice status.
    const invoiceLabel = permittedPages.includes("invoice")
      ? findMenuLabelForPage(user.role, "invoice", permittedPages)
      : undefined;
    if (invoiceLabel) {
      setSelectedJobId(view.job.id);
      leaveSearch();
      setActiveMenuItem(invoiceLabel);
      return;
    }
    const jobsLabel =
      findMenuLabelForPage(user.role, "jobs", permittedPages) ??
      findMenuLabelForPage(user.role, "my-queue", permittedPages);
    if (jobsLabel) {
      setSearchNavigate({ kind: "jobs", id: view.job.id });
      leaveSearch();
      setActiveMenuItem(jobsLabel);
    }
  };
  const openDashboardDrilldown = (drilldown: DashboardDrilldown) => {
    setDashboardDrilldown(drilldown);
    if (drilldown.destination === "Search") {
      setQuery("");
      setSearchCategory(drilldown.category ?? "");
      setSearchStatus("ALL");
      setSearchDateFilter(drilldown.date ?? "");
      setSearchMonthFilter(drilldown.month ?? "");
      setSearchPaymentMode("ALL");
      setSearchLowStockOnly(drilldown.category === "stock");
    }
    setActiveMenuItem(drilldown.destination);
  };

  return (
    <div
      className={`app-shell role-${user.role}${sidebarCollapsed ? " rail-collapsed" : ""}`}
    >
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
          {sidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
        <div className="rail-role">{roleLabels[user.role]}</div>
        <nav className="role-nav" aria-label={`${roleLabels[user.role]} menu`}>
          {menuItems.length === 0 ? (
            <p className="empty-state">No pages assigned.</p>
          ) : (
            menuItems.map((item) => (
              <button
                key={item.label}
                className={activeMenuItem === item.label ? "active" : ""}
                onClick={() => {
                  if (activeMenuItem === "Search" && item.label !== "Search") {
                    setQuery("");
                    setSearchCategory("");
                    setSearchStatus("ALL");
                    setSearchDateFilter("");
                    setSearchMonthFilter("");
                    setSearchPaymentMode("ALL");
                  }
                  setActiveMenuItem(item.label);
                }}
                title={item.label}
              >
                {item.icon}
                <span>
                  {item.label === "Approvals"
                    ? `Approvals (${state.jobs.filter((view) => view.material_approval?.status === "Pending").length})`
                    : item.label}
                </span>
              </button>
            ))
          )}
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
          <button
            className="mobile-logout"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {menuItems.length === 0 ? (
          <section className="workspace single-panel">
            <div className="list-empty">
              <h2>No pages assigned</h2>
              <p>
                Your role has no permitted workspace pages. Contact an
                Owner/Admin.
              </p>
            </div>
          </section>
        ) : (
          <RoleWorkspace
            activeMenuItem={activeMenuItem}
            jobs={jobs}
            mutate={mutate}
            query={query}
            searchCategory={searchCategory}
            searchStatus={searchStatus}
            searchDateFilter={searchDateFilter}
            searchMonthFilter={searchMonthFilter}
            searchPaymentMode={searchPaymentMode}
            searchLowStockOnly={searchLowStockOnly}
            paymentRows={paymentRows}
            searchNavigate={searchNavigate}
            permittedPages={permittedPages}
            selected={selected}
            selectedJobId={selectedJobId}
            setQuery={setQuery}
            setSearchCategory={setSearchCategory}
            setSearchStatus={setSearchStatus}
            setSearchDateFilter={setSearchDateFilter}
            setSearchMonthFilter={setSearchMonthFilter}
            setSearchPaymentMode={setSearchPaymentMode}
            setSearchLowStockOnly={setSearchLowStockOnly}
            setSelectedJobId={setSelectedJobId}
            onOpenSearchRecord={openSearchRecord}
            onOpenStockSearchRecord={openStockSearchRecord}
            onSearchNavigateConsumed={() => setSearchNavigate(undefined)}
            stockSearchNavigate={stockSearchNavigate}
            dashboardDrilldown={dashboardDrilldown}
            state={state}
            user={user}
            cognitoConfig={
              authConfig?.mode === "cognito" ? authConfig : undefined
            }
            onNavigate={setActiveMenuItem}
            onDashboardNavigate={openDashboardDrilldown}
            onThemeSaved={setAppTheme}
            onAdminStateSaved={() => setAdminStateVersion((value) => value + 1)}
          />
        )}
      </main>
    </div>
  );
}

function LoginScreen({
  onLogin,
  onCognitoLogin,
  config,
  error,
}: {
  onLogin: (email: string, password: string) => void;
  onCognitoLogin: () => void;
  config?: AuthConfig;
  error: string;
}) {
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
            <p>
              Use your business account to continue. New invitations require a
              password change at first sign-in.
            </p>
            {error && <p className="error-text">{error}</p>}
            <button className="primary-action" onClick={onCognitoLogin}>
              Continue with Cognito
            </button>
          </div>
        ) : config?.mode === "local" && !config.allowDemo ? (
          <div className="cognito-login">
            <p className="error-text">
              Authentication is not configured for this deployment. Contact your
              WorkshopOS administrator.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onLogin(email, password);
            }}
          >
            <label>
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="primary-action">Login</button>
          </form>
        )}
        {config?.mode === "local" && config.allowDemo && (
          <label className="demo-login-select">
            Emulate User:
            <select
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            >
              {demoLogins.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <span>Demo version now - use quick logins only.</span>
          </label>
        )}
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
  searchPaymentMode,
  searchLowStockOnly,
  paymentRows,
  searchNavigate,
  permittedPages,
  selected,
  selectedJobId,
  setQuery,
  setSearchCategory,
  setSearchStatus,
  setSearchDateFilter,
  setSearchMonthFilter,
  setSearchPaymentMode,
  setSearchLowStockOnly,
  setSelectedJobId,
  onOpenSearchRecord,
  onOpenStockSearchRecord,
  onSearchNavigateConsumed,
  stockSearchNavigate,
  dashboardDrilldown,
  state,
  user,
  cognitoConfig,
  onNavigate,
  onDashboardNavigate,
  onThemeSaved,
  onAdminStateSaved,
}: {
  activeMenuItem: string;
  jobs: JobView[];
  mutate: Mutate;
  query: string;
  searchCategory: SearchCategorySelection | "";
  searchStatus: SearchCriteria["status"];
  searchDateFilter: string;
  searchMonthFilter: string;
  searchPaymentMode: "ALL" | PaymentMode;
  searchLowStockOnly: boolean;
  paymentRows: PaymentSearchRow[];
  searchNavigate?: { kind: "jobs" | "customers" | "vehicles"; id: number };
  permittedPages: AdminPageKey[];
  selected?: JobView;
  selectedJobId?: number;
  setQuery: (value: string) => void;
  setSearchCategory: (value: SearchCategorySelection | "") => void;
  setSearchStatus: (value: SearchCriteria["status"]) => void;
  setSearchDateFilter: (value: string) => void;
  setSearchMonthFilter: (value: string) => void;
  setSearchPaymentMode: (value: "ALL" | PaymentMode) => void;
  setSearchLowStockOnly: (value: boolean) => void;
  setSelectedJobId: (value: number) => void;
  onOpenSearchRecord: (
    view: JobView,
    category: Exclude<SearchTableCategory, "stock">,
  ) => void;
  onOpenStockSearchRecord: (item: InventoryItem) => void;
  onSearchNavigateConsumed: () => void;
  stockSearchNavigate?: string;
  dashboardDrilldown?: DashboardDrilldown;
  state: WorkshopState;
  user: User;
  cognitoConfig?: CognitoConfig;
  onNavigate: (label: string) => void;
  onDashboardNavigate: (drilldown: DashboardDrilldown) => void;
  onThemeSaved: (theme: AppTheme) => void;
  onAdminStateSaved: () => void;
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
        paymentMode={searchPaymentMode}
        lowStockOnly={searchLowStockOnly}
        initialLowStockOnly={
          dashboardDrilldown?.destination === "Search" &&
          dashboardDrilldown.category === "stock" &&
          Boolean(dashboardDrilldown.lowStockOnly)
        }
        paymentRows={paymentRows}
        permittedPages={permittedPages}
        actor={user}
        setQuery={setQuery}
        setCategory={setSearchCategory}
        setStatus={setSearchStatus}
        setDateFilter={setSearchDateFilter}
        setMonthFilter={setSearchMonthFilter}
        setPaymentMode={setSearchPaymentMode}
        setLowStockOnly={setSearchLowStockOnly}
        onOpenRecord={onOpenSearchRecord}
        onOpenStockRecord={onOpenStockSearchRecord}
      />
    );
  }

  if (
    (activeMenuItem === "Job Cards" && user.role !== "service") ||
    (activeMenuItem === "My Queue" && user.role !== "service")
  )
    return (
      <EntityList
        key={`jobs-${dashboardDrilldown?.month ?? ""}-${dashboardDrilldown?.date ?? ""}-${dashboardDrilldown?.status ?? ""}`}
        kind="jobs"
        state={state}
        mutate={mutate}
        actor={user}
        initialFilters={
          dashboardDrilldown?.destination === activeMenuItem
            ? {
                month: dashboardDrilldown.month,
                date: dashboardDrilldown.date,
                primary: dashboardDrilldown.status,
              }
            : undefined
        }
        initialSelectedId={
          searchNavigate?.kind === "jobs" ? searchNavigate.id : undefined
        }
        onInitialSelectionConsumed={onSearchNavigateConsumed}
      />
    );
  if (activeMenuItem === "Customers")
    return (
      <EntityList
        key={`customers-${dashboardDrilldown?.month ?? ""}`}
        kind="customers"
        state={state}
        mutate={mutate}
        actor={user}
        initialFilters={
          dashboardDrilldown?.served === "customers"
            ? { month: dashboardDrilldown.month }
            : undefined
        }
        initialSelectedId={
          searchNavigate?.kind === "customers" ? searchNavigate.id : undefined
        }
        onInitialSelectionConsumed={onSearchNavigateConsumed}
      />
    );
  if (activeMenuItem === "Vehicles")
    return (
      <EntityList
        key={`vehicles-${dashboardDrilldown?.month ?? ""}`}
        kind="vehicles"
        state={state}
        mutate={mutate}
        actor={user}
        initialFilters={
          dashboardDrilldown?.served === "vehicles"
            ? { month: dashboardDrilldown.month }
            : undefined
        }
        initialSelectedId={
          searchNavigate?.kind === "vehicles" ? searchNavigate.id : undefined
        }
        onInitialSelectionConsumed={onSearchNavigateConsumed}
      />
    );
  if (activeMenuItem === "Media")
    return (
      <EntityList kind="media" state={state} mutate={mutate} actor={user} />
    );
  if (
    activeMenuItem === "Purchase Orders" &&
    (user.role === "store" || user.role === "admin")
  )
    return (
      <PurchaseOrdersWorkspace state={state} actor={user} mutate={mutate} />
    );

  if (user.role === "reception")
    return (
      <Reception
        activeMenuItem={activeMenuItem}
        state={state}
        mutate={mutate}
        user={user}
        selected={selected}
        setSelectedJobId={setSelectedJobId}
      />
    );
  if (user.role === "service")
    return (
      <ServiceAdvisor
        activeMenuItem={activeMenuItem}
        state={state}
        view={
          selected?.job.advisor_id === user.id
            ? selected
            : state.jobs.find((item) => item.job.advisor_id === user.id)
        }
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        user={user}
      />
    );
  if (
    ["Stock", "Material Requests", "Issue Material", "Reconcile"].includes(
      activeMenuItem,
    ) &&
    (user.role === "store" || user.role === "admin")
  )
    return (
      <StoreDesk
        activeMenuItem={activeMenuItem}
        state={state}
        actor={user}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        initialStockSearch={stockSearchNavigate}
        initialDrilldown={dashboardDrilldown}
      />
    );
  if (user.role === "store")
    return (
      <StoreDesk
        activeMenuItem={activeMenuItem}
        state={state}
        actor={user}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
      />
    );
  if (user.role === "tech")
    return (
      <Technician
        activeMenuItem={activeMenuItem}
        state={state}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
      />
    );
  if (user.role === "accounts")
    return (
      <Accounts
        activeMenuItem={activeMenuItem}
        state={state}
        view={selected}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        actor={user}
      />
    );
  return (
    <Admin
      activeMenuItem={activeMenuItem}
      state={state}
      selected={selected}
      mutate={mutate}
      setSelectedJobId={setSelectedJobId}
      user={user}
      cognitoConfig={cognitoConfig}
      onNavigate={onNavigate}
      onDashboardNavigate={onDashboardNavigate}
      dashboardDrilldown={dashboardDrilldown}
      onThemeSaved={onThemeSaved}
      onAdminStateSaved={onAdminStateSaved}
    />
  );
}

const SEARCH_STATUS_OPTIONS: (MainStatus | "ALL")[] = [
  "ALL",
  "NEW",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "CLOSED",
];

function SearchPortal({
  jobs,
  state,
  mutate,
  query,
  category,
  status,
  dateFilter,
  monthFilter,
  paymentMode,
  lowStockOnly,
  initialLowStockOnly,
  paymentRows,
  permittedPages,
  actor,
  setQuery,
  setCategory,
  setStatus,
  setDateFilter,
  setMonthFilter,
  setPaymentMode,
  setLowStockOnly,
  onOpenRecord,
  onOpenStockRecord,
}: {
  jobs: JobView[];
  state: WorkshopState;
  mutate: Mutate;
  query: string;
  category: SearchCategorySelection | "";
  status: SearchCriteria["status"];
  dateFilter: string;
  monthFilter: string;
  paymentMode: "ALL" | PaymentMode;
  lowStockOnly: boolean;
  initialLowStockOnly: boolean;
  paymentRows: PaymentSearchRow[];
  permittedPages: AdminPageKey[];
  actor: User;
  setQuery: (value: string) => void;
  setCategory: (value: SearchCategorySelection | "") => void;
  setStatus: (value: SearchCriteria["status"]) => void;
  setDateFilter: (value: string) => void;
  setMonthFilter: (value: string) => void;
  setPaymentMode: (value: "ALL" | PaymentMode) => void;
  setLowStockOnly: (value: boolean) => void;
  onOpenRecord: (
    view: JobView,
    category: Exclude<SearchTableCategory, "stock">,
  ) => void;
  onOpenStockRecord: (item: InventoryItem) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [activeLowStockOnly, setActiveLowStockOnly] = useState(
    lowStockOnly || initialLowStockOnly,
  );
  useEffect(() => {
    if (lowStockOnly || initialLowStockOnly) setActiveLowStockOnly(true);
  }, [lowStockOnly, initialLowStockOnly]);
  const [record, setRecord] = useState<{
    view: JobView;
    category: Exclude<SearchTableCategory, "stock">;
    mode: "view" | "edit";
  }>();

  // Service Advisors can always search the records they need to advise on, even when
  // those underlying workspace pages have not been granted.
  const baseCategories =
    actor.role === "service"
      ? (["job", "customer", "vehicle", "invoice"] as SearchTableCategory[])
      : (Object.keys(CATEGORY_PAGE_KEYS) as SearchTableCategory[]).filter(
          (item) =>
            item !== "payment" &&
            CATEGORY_PAGE_KEYS[item].some((key) =>
              permittedPages.includes(key),
            ),
        );
  // Customer and Vehicle remain Admin-granted pages even though they are intentionally
  // absent from the Admin rail; Search is their Admin entry point.
  const availableCategories: SearchCategorySelection[] =
    actor.role === "admin"
      ? [
          ...Array.from(
            new Set([
              ...baseCategories.filter((item) => item !== "stock"),
              "customer" as const,
              "vehicle" as const,
              "payment" as const,
            ]),
          ),
          ...ADMIN_OPERATIONAL_SEARCH_CATEGORIES,
        ]
      : baseCategories;
  const operationalCategory =
    actor.role === "admin" &&
    category !== "stock" &&
    ADMIN_OPERATIONAL_SEARCH_CATEGORIES.includes(
      category as AdminOperationalSearchCategory,
    )
      ? (category as AdminOperationalSearchCategory)
      : undefined;
  const availableMonths = [
    ...new Set(
      (category === "payment"
        ? [
            monthFilter,
            ...state.jobs.flatMap((view) =>
              view.payments
                .filter((payment) => !payment.voided_at)
                .map((payment) => payment.created_at?.slice(0, 7) ?? ""),
            ),
          ]
        : state.jobs.map((view) =>
            category === "job"
              ? view.job.estimated_delivery?.slice(0, 7) ?? ""
              : view.visit.received_at.slice(0, 7),
          )
      ).filter((month) => /^\d{4}-\d{2}$/.test(month)),
    ),
  ].sort((left, right) => right.localeCompare(left));

  const changeFilters = (change: () => void) => {
    change();
    setPage(1);
  };
  const clearFilters = () => {
    setQuery("");
    setCategory(category === "stock" ? "stock" : "");
    setStatus("ALL");
    setDateFilter("");
    setMonthFilter("");
    setPaymentMode("ALL");
    setLowStockOnly(false);
    setActiveLowStockOnly(false);
    setPage(1);
  };

  const paged = paginate(jobs, page, pageSize);
  const stockRows = useMemo(() => {
    const needle = normalizeSearch(query);
    return state.inventory.filter(
      (item) =>
        (!activeLowStockOnly || item.stock_qty < item.low_stock_qty) &&
        (!needle ||
          normalizeSearch(
            `${item.sku} ${item.name} ${item.category} ${item.unit}`,
          ).includes(needle)),
    );
  }, [state.inventory, query, activeLowStockOnly]);
  const pagedStock = paginate(stockRows, page, pageSize);
  const isStock = category === "stock";
  const isPayment = category === "payment";
  const entityListKind:
    Extract<EntityKind, "customers" | "vehicles"> | undefined =
    category === "customer"
      ? "customers"
      : category === "vehicle"
        ? "vehicles"
        : undefined;
  const pagedPayments = paginate(paymentRows, page, pageSize);
  const resultPage = isStock ? pagedStock : isPayment ? pagedPayments : paged;

  return (
    <section className="portal">
      {record?.category === "job" && (
        <JobRecordDialog
          view={record.view}
          state={state}
          mutate={mutate}
          actor={actor}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
      )}
      {record?.category === "invoice" && (
        <InvoiceDialog
          fixedJob
          action={record.mode}
          view={record.view}
          actor={actor}
          mutate={mutate}
          onClose={() => setRecord(undefined)}
        />
      )}
      {record?.category === "payment" && (
        <InvoiceDialog
          fixedJob
          action="view"
          view={record.view}
          actor={actor}
          mutate={mutate}
          onClose={() => setRecord(undefined)}
        />
      )}
      <div className="list-filter-bar">
        {!operationalCategory && (
          <label className="list-search">
            Search
            <input
              aria-label="Search records"
              value={query}
              placeholder="Search vehicle, mobile, customer, job card, invoice"
              onChange={(event) =>
                changeFilters(() => setQuery(event.target.value))
              }
            />
          </label>
        )}
        <div className="list-filter-fields open">
          <label>
            {operationalCategory ? "Workspace" : "Category"}
            <select
              aria-label="Search category"
              value={category}
              onChange={(event) =>
                changeFilters(() => {
                  const nextCategory = event.target.value as
                    SearchCategorySelection | "";
                  setCategory(nextCategory);
                  if (nextCategory !== "job") setStatus("ALL");
                  if (nextCategory !== "payment") setPaymentMode("ALL");
                  if (nextCategory !== "stock") {
                    setLowStockOnly(false);
                    setActiveLowStockOnly(false);
                  }
                })
              }
            >
              <option value="">Select a category</option>
              {availableCategories.map((item) => (
                <option key={item} value={item}>
                  {item in ADMIN_OPERATIONAL_SEARCH_LABELS
                    ? ADMIN_OPERATIONAL_SEARCH_LABELS[
                        item as AdminOperationalSearchCategory
                      ]
                    : SEARCH_CATEGORY_LABELS[item as SearchTableCategory]}
                </option>
              ))}
            </select>
          </label>
          {category === "stock" && activeLowStockOnly && (
            <span className="search-scope" role="status">
              Low stock only
            </span>
          )}
          {!operationalCategory &&
            category &&
            category !== "stock" &&
            !entityListKind && (
              <>
                {category === "job" && (
                  <label>
                    Status
                    <select
                      aria-label="Job status"
                      value={status}
                      onChange={(event) =>
                        changeFilters(() =>
                          setStatus(
                            event.target.value as SearchCriteria["status"],
                          ),
                        )
                      }
                    >
                      {SEARCH_STATUS_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item === "ALL" ? "All statuses" : item}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {category === "payment" && (
                  <label>
                    Payment mode
                    <select
                      aria-label="Payment mode filter"
                      value={paymentMode}
                      onChange={(event) =>
                        changeFilters(() =>
                          setPaymentMode(
                            event.target.value as "ALL" | PaymentMode,
                          ),
                        )
                      }
                    >
                      <option value="ALL">All</option>
                      {(
                        [
                          "UPI",
                          "Cash",
                          "Card",
                          "Bank transfer",
                          "Other",
                        ] as PaymentMode[]
                      ).map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label>
                  {category === "job" ? "Estimated Delivery Date" : "Date"}
                  <input
                    aria-label={category === "job" ? "Estimated delivery date" : "Search date"}
                    type="date"
                    value={dateFilter}
                    onChange={(event) =>
                      changeFilters(() => {
                        setDateFilter(event.target.value);
                        if (category === "payment") setMonthFilter("");
                      })
                    }
                  />
                </label>
                <label>
                  {category === "job" ? "Estimated Delivery Month" : "Month-Year"}
                  <select
                    aria-label={category === "job" ? "Estimated delivery month" : "Search month-year"}
                    value={monthFilter}
                    onChange={(event) =>
                      changeFilters(() => {
                        setMonthFilter(event.target.value);
                        if (category === "payment") setDateFilter("");
                      })
                    }
                  >
                    <option value="">All months</option>
                    {availableMonths.map((month) => (
                      <option key={month} value={month}>
                        {SEARCH_MONTH_YEAR_FORMATTER.format(
                          new Date(`${month}-01T00:00:00Z`),
                        )}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
          {!operationalCategory && <ListSearchActions onClear={clearFilters} />}
        </div>
      </div>

      {operationalCategory ? (
        <AdminSearchOperationalWorkspace
          category={operationalCategory}
          state={state}
          actor={actor}
          mutate={mutate}
        />
      ) : !category ? (
        <div className="empty-state">
          <strong>Please select a category to activate search</strong>
          <span>
            Choose Job Card, Customer, Vehicle, Invoice or Stock above to see
            results.
          </span>
        </div>
      ) : entityListKind ? (
        <EntityList
          key={`search-${entityListKind}`}
          kind={entityListKind}
          state={state}
          mutate={mutate}
          actor={actor}
          externalSearch={query}
          onExternalSearchChange={(value) =>
            changeFilters(() => setQuery(value))
          }
          hideSearch
        />
      ) : (
        <>
          <PaginationToolbar
            from={resultPage.from}
            to={resultPage.to}
            totalCount={resultPage.totalCount}
            page={resultPage.page}
            pageCount={resultPage.pageCount}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
          />
          {resultPage.totalCount === 0 ? (
            <div className="list-empty">
              <h3>No matching records</h3>
              <p>Adjust the search or clear the filters.</p>
              <FilterClearButton onClick={clearFilters} label="Clear filters" />
            </div>
          ) : isStock ? (
            <StockSearchResultsTable
              rows={pagedStock.items}
              onOpenRecord={onOpenStockRecord}
            />
          ) : isPayment ? (
            <PaymentSearchResultsTable
              rows={pagedPayments.items}
              onOpenRecord={(view) =>
                setRecord({ view, category: "payment", mode: "view" })
              }
            />
          ) : (
            <SearchResultsTable
              category={
                category as Exclude<
                  SearchTableCategory,
                  "stock" | "customer" | "vehicle" | "payment"
                >
              }
              rows={paged.items}
              actor={actor}
              onOpenRecord={(view, itemCategory, mode) => {
                if (actor.role === "service" || itemCategory !== "invoice")
                  setRecord({ view, category: itemCategory, mode });
                else onOpenRecord(view, itemCategory);
              }}
            />
          )}
          <ResultPagination
            page={resultPage.page}
            pageCount={resultPage.pageCount}
            onChange={setPage}
          />
        </>
      )}
    </section>
  );
}

function AdminSearchOperationalWorkspace({
  category,
  state,
  actor,
  mutate,
}: {
  category: AdminOperationalSearchCategory;
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  if (category === "estimate")
    return (
      <ServiceAdvisorList
        key={category}
        kind="estimates"
        jobs={state.jobs}
        state={state}
        mutate={mutate}
        actor={actor}
      />
    );
  if (category === "follow-ups")
    return (
      <ServiceAdvisorList
        key={category}
        kind="followups"
        jobs={state.jobs}
        state={state}
        mutate={mutate}
        actor={actor}
      />
    );
  const activeMenuItem =
    category === "material-requests"
      ? "Material Requests"
      : category === "issue-material"
        ? "Issue Material"
        : category === "reconcile"
          ? "Reconcile"
          : "Stock";
  return (
    <StoreDesk
      key={category}
      activeMenuItem={activeMenuItem}
      state={state}
      actor={actor}
      mutate={mutate}
      setSelectedJobId={() => undefined}
    />
  );
}

function SearchResultsTable({
  category,
  rows,
  actor,
  onOpenRecord,
}: {
  category: Exclude<SearchTableCategory, "stock" | "customer" | "vehicle">;
  rows: JobView[];
  actor: User;
  onOpenRecord: (
    view: JobView,
    category: Exclude<SearchTableCategory, "stock" | "customer" | "vehicle">,
    mode: "view" | "edit",
  ) => void;
}) {
  const headers =
    category === "job"
      ? ["Job #", "Vehicle", "Customer", "Estimated Delivery Date", "Status", "Total", "Actions"]
      : ["Invoice #", "Job", "Customer", "Amount", "Status", "Actions"];
  return (
    <div className="table-wrap">
      <table aria-label={`${SEARCH_CATEGORY_LABELS[category]} search results`}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((view) => {
            const serviceJobEditable =
              actor.role === "service" &&
              canMutateJobLifecycle(actor, view.job) &&
              !isTerminalMainStatus(view.job.main_status);
            const serviceInvoiceEditable =
              actor.role === "service" &&
              Boolean(view.invoice) &&
              resolveJobDocumentActions("invoice", view, actor).includes(
                "edit-invoice",
              );
            const editable =
              actor.role === "service"
                ? category === "job"
                  ? serviceJobEditable
                  : category === "invoice"
                    ? serviceInvoiceEditable
                    : false
                : !(
                    actor.role === "accounts" ||
                    (category === "job" && actor.role === "reception") ||
                    category === "invoice"
                  );
            return (
              <tr
                key={view.job.id}
                className="clickable-row"
                onClick={() => onOpenRecord(view, category, "view")}
              >
                {category === "job" && (
                  <>
                    <td>{view.job.job_no}</td>
                    <td>
                      {view.vehicle.number} · {view.vehicle.make}{" "}
                      {view.vehicle.model}
                    </td>
                    <td>{view.customer.name}</td>
                    <td>{view.job.estimated_delivery || "—"}</td>
                    <td>
                      <Status
                        status={view.job.main_status}
                        sub={view.job.sub_status}
                      />
                    </td>
                    <td>{money(jobTotal(view))}</td>
                  </>
                )}
                {category === "invoice" && (
                  <>
                    <td>{view.invoice?.invoice_no || "Not generated"}</td>
                    <td>{view.job.job_no}</td>
                    <td>{view.customer.name}</td>
                    <td>{money(view.invoice?.total ?? jobTotal(view))}</td>
                    <td>{view.invoice?.status ?? "Not generated"}</td>
                  </>
                )}
                <td>
                  <RecordActions
                    inGrid
                    onView={() => onOpenRecord(view, category, "view")}
                    onEdit={
                      editable
                        ? () => onOpenRecord(view, category, "edit")
                        : undefined
                    }
                    editLabel={
                      category === "invoice" ? "Edit Invoice" : undefined
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PaymentSearchResultsTable({
  rows,
  onOpenRecord,
}: {
  rows: PaymentSearchRow[];
  onOpenRecord: (view: JobView) => void;
}) {
  const headers = [
    "Paid at",
    "Job",
    "Invoice",
    "Customer",
    "Amount",
    "Mode",
    "Status",
    "Actions",
  ];
  return (
    <div className="table-wrap">
      <table aria-label="Payments search results">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ view, payment }) => (
            <tr
              key={payment.id}
              className={`clickable-row ${paymentRowHighlight(payment.mode)}`}
              onClick={() => onOpenRecord(view)}
            >
              <td>
                {payment.created_at ? formatTimestamp(payment.created_at) : "—"}
              </td>
              <td>{view.job.job_no}</td>
              <td>{view.invoice?.invoice_no ?? "Not generated"}</td>
              <td>{view.customer.name}</td>
              <td>{money(payment.amount)}</td>
              <td>{payment.mode}</td>
              <td>Paid</td>
              <td>
                <RecordActions inGrid onView={() => onOpenRecord(view)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StockSearchResultsTable({
  rows,
  onOpenRecord,
}: {
  rows: InventoryItem[];
  onOpenRecord: (item: InventoryItem) => void;
}) {
  const headers = [
    "SKU",
    "Item",
    "Category",
    "Quantity",
    "Unit",
    "Minimum quantity",
    "Stock status",
    "Actions",
  ];
  return (
    <div className="table-wrap">
      <table aria-label="Stock search results">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const stockStatus =
              item.stock_qty === 0
                ? "out-of-stock"
                : item.stock_qty <= item.low_stock_qty
                  ? "low-stock"
                  : "in-stock";
            const statusLabel =
              stockStatus === "out-of-stock"
                ? "Out of stock"
                : stockStatus === "low-stock"
                  ? "Low stock"
                  : "In stock";
            return (
              <tr
                key={item.id}
                className="clickable-row"
                onClick={() => onOpenRecord(item)}
              >
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.stock_qty}</td>
                <td>{item.unit}</td>
                <td>{item.low_stock_qty}</td>
                <td>
                  <span
                    className={`status stock-status stock-status-${stockStatus}`}
                  >
                    {statusLabel}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenRecord(item);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Kpis({
  jobs,
  inventory,
}: {
  jobs: JobView[];
  inventory: WorkshopState["inventory"];
}) {
  const revenue = jobs.reduce(
    (sum, item) => sum + (item.invoice?.total ?? 0),
    0,
  );
  const paid = jobs
    .flatMap((item) => item.payments)
    .reduce((sum, payment) => sum + payment.amount, 0);
  return (
    <section className="kpi-strip">
      <Kpi
        icon={<Car />}
        label="Cars Inside"
        value={jobs.filter((item) => item.job.main_status !== "CLOSED").length}
      />
      <Kpi
        icon={<ClipboardList />}
        label="New"
        value={jobs.filter((item) => item.job.main_status === "NEW").length}
      />
      <Kpi
        icon={<Wrench />}
        label="In Progress"
        value={
          jobs.filter((item) => item.job.main_status === "IN_PROGRESS").length
        }
      />
      <Kpi icon={<ReceiptText />} label="Revenue" value={money(revenue)} />
      <Kpi icon={<Banknote />} label="Collected" value={money(paid)} />
      <Kpi
        icon={<Boxes />}
        label="Low Stock"
        value={
          inventory.filter((item) => item.stock_qty < item.low_stock_qty).length
        }
      />
    </section>
  );
}

function Kpi({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
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
}: {
  activeMenuItem: string;
  state: WorkshopState;
  mutate: Mutate;
  user: User;
  selected?: JobView;
  setSelectedJobId: (id: number) => void;
}) {
  const today = todayKey();
  const [creating, setCreating] = useState(false);
  const [createdJobNo, setCreatedJobNo] = useState("");
  const openQueue = state.jobs
    .filter(
      (item) =>
        item.job.main_status !== "CLOSED" &&
        item.job.main_status !== "CANCELLED",
    )
    .sort((left, right) => {
      const leftIsCarryForward = left.visit.received_at.slice(0, 10) !== today;
      const rightIsCarryForward =
        right.visit.received_at.slice(0, 10) !== today;
      if (leftIsCarryForward !== rightIsCarryForward)
        return leftIsCarryForward ? -1 : 1;
      return left.visit.received_at.localeCompare(right.visit.received_at);
    });
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<number>();
  if (activeMenuItem === "Advance Bookings") {
    return (
      <BookingOperations
        state={state}
        actor={user}
        mutate={mutate}
        onCheckedIn={(jobId) => setSelectedJobId(jobId)}
      />
    );
  }
  return (
    <>
    <section className="workspace two-panel reception-queue">
      <div className="desk-panel">
        <div className="queue-heading">
          <PanelTitle
            icon={<Car />}
            title="Reception Queue"
            subtitle={`${today} · all open reception visits`}
          />
          <button className="primary-action" onClick={() => setCreating(true)}>
            <Plus size={18} />
            Create New Visit
          </button>
        </div>
        <div className="queue-summary">
          <span>
            <strong>{openQueue.length}</strong> open visits
          </span>
          <span>
            <strong>
              {openQueue.filter((item) => !item.job.advisor_id).length}
            </strong>{" "}
            unassigned
          </span>
        </div>
        {createdJobNo && (
          <p className="permission-note" role="status">
            Visit created: {createdJobNo} is now selected.
          </p>
        )}
        <AdvisorAttendancePanel
          state={state}
          jobs={openQueue}
          today={today}
          selectedAdvisorId={selectedAdvisorId}
          onSelectAdvisor={setSelectedAdvisorId}
          mutate={mutate}
        />
        <ReceptionQueueRows
          jobs={openQueue}
          users={state.users}
          today={today}
          selectedAdvisorId={selectedAdvisorId}
          selectedJobId={selected?.job.id}
          onSelect={setSelectedJobId}
        />
      </div>
      <div className="desk-panel">
        <PanelTitle
          icon={<FileText />}
          title="Job Detail"
          subtitle={selected?.job.job_no ?? "Select a job"}
        />
        {selected ? (
          <>
            <JobSnapshot view={selected} />
            <VisitEditor
              key={`${selected.job.id}-${selected.job.advisor_id}`}
              view={selected}
              advisors={state.users.filter((item) => item.role === "service")}
              attendance={state.attendance}
              today={today}
              mutate={mutate}
            />
            <div className="reception-archive-zone">
              <button
                className="danger-action"
                onClick={() =>
                  mutate((db) =>
                    cancelJobCard(
                      db,
                      selected.job.id,
                      "Cancelled at reception",
                    ),
                  )
                }
              >
                Archive Visit/Job
              </button>
            </div>
          </>
        ) : (
          <p className="empty-state">Select a visit to review or assign it.</p>
        )}
      </div>
      {creating && (
        <CreateVisitDialog
          state={state}
          mutate={mutate}
          actor={user}
          onClose={() => setCreating(false)}
          onCreated={(jobId, jobNo) => {
            setSelectedJobId(jobId);
            setCreatedJobNo(jobNo);
            setCreating(false);
          }}
        />
      )}
    </section>
    </>
  );
}

/** Shared booking desk; Admin has the additional, auditable capacity controls inside the calendar. */
function BookingOperations({
  state,
  actor,
  mutate,
  onCheckedIn,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
  onCheckedIn: (jobId: number, jobNo: string) => void;
}) {
  const today = todayKey();
  return (
    <>
      <BookingCalendar state={state} actor={actor} mutate={mutate} />
      <section className="workspace">
        <div className="desk-panel">
          <ExpectedTodayBookings
            state={state}
            actor={actor}
            mutate={mutate}
            operationalDate={today}
            onCheckedIn={onCheckedIn}
          />
        </div>
      </section>
    </>
  );
}

function AdvisorAttendancePanel({
  state,
  jobs,
  today,
  selectedAdvisorId,
  onSelectAdvisor,
  mutate,
}: {
  state: WorkshopState;
  jobs: JobView[];
  today: string;
  selectedAdvisorId?: number;
  onSelectAdvisor: (advisorId?: number) => void;
  mutate: Mutate;
}) {
  const advisors = state.users.filter((item) => item.role === "service");
  const present = new Set(
    presentAdvisors(advisors, state.attendance, today).map((item) => item.id),
  );
  const [page, setPage] = useState(0);
  const advisorsPerPage = 6;
  const pageCount = Math.max(1, Math.ceil(advisors.length / advisorsPerPage));
  const visibleAdvisors = advisors.slice(
    page * advisorsPerPage,
    page * advisorsPerPage + advisorsPerPage,
  );
  useEffect(() => {
    if (page >= pageCount) setPage(pageCount - 1);
  }, [page, pageCount]);
  const availabilityCount = advisors.filter((advisor) =>
    present.has(advisor.id),
  ).length;
  return (
    <section
      className="advisor-attendance"
      aria-label="Service advisor availability"
    >
      <div className="advisor-roster-heading">
        <div>
          <strong>Advisor availability</strong>
          <span>
            {availabilityCount} of {advisors.length} advisors available today
          </span>
        </div>
        <div className="advisor-roster-actions">
          <button
            type="button"
            className={
              selectedAdvisorId === undefined
                ? "advisor-reset active"
                : "advisor-reset"
            }
            onClick={() => onSelectAdvisor(undefined)}
          >
            All advisors
          </button>
          {pageCount > 1 && (
            <div className="advisor-page-controls" aria-label="Advisor pages">
              <button
                type="button"
                aria-label="Previous advisors"
                title="Previous advisors"
                disabled={page === 0}
                onClick={() => setPage((current) => current - 1)}
              >
                <ChevronLeft aria-hidden="true" size={16} />
              </button>
              <span>
                {page + 1} / {pageCount}
              </span>
              <button
                type="button"
                aria-label="Next advisors"
                title="Next advisors"
                disabled={page === pageCount - 1}
                onClick={() => setPage((current) => current + 1)}
              >
                <ChevronRight aria-hidden="true" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="advisor-roster">
        {visibleAdvisors.map((advisor) => {
          const isPresent = present.has(advisor.id);
          const activeJobs = jobs.filter(
            (job) => job.job.advisor_id === advisor.id,
          ).length;
          return (
            <article
              key={advisor.id}
              className={`advisor-card ${isPresent ? "present" : "away"} ${selectedAdvisorId === advisor.id ? "selected" : ""}`}
            >
              <button
                type="button"
                className="advisor-card-select"
                aria-pressed={selectedAdvisorId === advisor.id}
                onClick={() =>
                  onSelectAdvisor(
                    selectedAdvisorId === advisor.id ? undefined : advisor.id,
                  )
                }
              >
                <strong>{advisor.name}</strong>
                <span>
                  {isPresent ? "Present" : "Away"} · {activeJobs} open
                </span>
              </button>
              <button
                type="button"
                className={
                  isPresent
                    ? "advisor-availability-toggle present"
                    : "advisor-availability-toggle away"
                }
                aria-label={`Mark ${advisor.name} ${isPresent ? "away" : "present"}`}
                aria-pressed={isPresent}
                onClick={() =>
                  mutate((db) =>
                    setAdvisorPresent(db, advisor.id, !isPresent, today),
                  )
                }
              >
                <span aria-hidden="true" />
                {isPresent ? "Present" : "Away"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ReceptionQueueRows({
  jobs,
  users,
  today,
  selectedAdvisorId,
  selectedJobId,
  onSelect,
}: {
  jobs: JobView[];
  users: User[];
  today: string;
  selectedAdvisorId?: number;
  selectedJobId?: number;
  onSelect: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "ALL" | "NEW" | "IN_PROGRESS" | "COMPLETED" | "UNASSIGNED"
  >("ALL");
  const needle = normalizeSearch(search);
  const filtered = jobs.filter((row) => {
    const advisor = users.find((user) => user.id === row.job.advisor_id);
    const matchesSearch =
      !needle ||
      normalizeSearch(
        `${row.job.job_no} ${row.vehicle.number} ${row.customer.name} ${row.customer.mobile} ${advisor?.name ?? "Unassigned"} ${row.visit.requested_work}`,
      ).includes(needle);
    const matchesStatus =
      status === "ALL" ||
      (status === "UNASSIGNED"
        ? !row.job.advisor_id
        : row.job.main_status === status);
    return (
      matchesSearch &&
      matchesStatus &&
      (selectedAdvisorId === undefined ||
        row.job.advisor_id === selectedAdvisorId)
    );
  });
  const reset = () => {
    setSearch("");
    setStatus("ALL");
  };
  return (
    <div className="embedded-list reception-queue-list">
      <div className="queue-filter-bar">
        <label className="list-search">
          Search
          <input
            aria-label="Search reception queue"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Job, vehicle, customer or requested work"
          />
        </label>
        <label className="queue-status-select">
          Status
          <select
            aria-label="Reception queue status"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
          >
            <option value="ALL">All open</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="UNASSIGNED">Unassigned</option>
          </select>
        </label>
        <button
          type="button"
          className="secondary-action"
          onClick={reset}
          disabled={!search && status === "ALL"}
        >
          Clear
        </button>
      </div>
      <div className="reception-list-summary" role="status">
        {filtered.length} of {jobs.length} open jobs
        {selectedAdvisorId !== undefined ? " for selected advisor" : ""}
      </div>
      {filtered.length ? (
        <div className="reception-visit-rows" aria-label="Reception queue jobs">
          {filtered.map((row) => {
            const advisor = users.find(
              (user) => user.id === row.job.advisor_id,
            );
            const receivedDate = row.visit.received_at.slice(0, 10);
            const isCarryForward = receivedDate !== today;
            const statusClass = `job-status-${row.job.main_status.toLowerCase()}`;
            return (
              <button
                type="button"
                key={row.job.id}
                className={`reception-visit-row ${statusClass}${selectedJobId === row.job.id ? " active" : ""}`}
                onClick={() => onSelect(row.job.id)}
              >
                <div className="reception-job-identity">
                  <strong>{row.job.job_no}</strong>
                  <span>
                    {row.vehicle.number} · {row.customer.name}
                  </span>
                </div>
                <div className="reception-job-meta">
                  <span
                    className={
                      advisor ? "advisor-name" : "advisor-name unassigned"
                    }
                  >
                    {advisor?.name ?? "Unassigned"}
                  </span>
                  <Status
                    status={row.job.main_status}
                    sub={row.job.sub_status}
                  />
                </div>
                <div className="reception-job-received">
                  <strong
                    className={
                      isCarryForward ? "carry-forward" : "today-marker"
                    }
                  >
                    {isCarryForward ? "Carry-forward" : "Today"}
                  </strong>
                  <span>
                    {isCarryForward
                      ? receptionAgeLabel(receivedDate, today)
                      : "Received today"}{" "}
                    · {receivedDate}
                  </span>
                </div>
                <p title={row.visit.requested_work}>
                  {row.visit.requested_work}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="list-empty">
          <h3>No matching open jobs</h3>
          <button type="button" onClick={reset}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
  /* Previous paginated queue implementation, disabled by the contained-scroll redesign. */
  /*
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("ALL"); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const statuses = ["ALL", "NEW", "IN_PROGRESS", "COMPLETED"];
  const filtered = jobs.filter((row) => (!normalizeSearch(search) || normalizeSearch(`${row.job.job_no} ${row.vehicle.number} ${row.customer.name} ${row.customer.mobile}`).includes(normalizeSearch(search))) && (status === "ALL" || row.job.main_status === status));
  const paged = paginate(filtered, page, pageSize); useEffect(() => { if (paged.page !== page) setPage(paged.page); }, [page, paged.page]);
  const reset = () => { setSearch(""); setStatus("ALL"); setPage(1); };
  const columns: ExportColumn<JobView>[] = [{ header: "Job", value: (row) => row.job.job_no }, { header: "Registration", value: (row) => row.vehicle.number }, { header: "Customer", value: (row) => row.customer.name }, { header: "Mobile", value: (row) => row.customer.mobile }, { header: "Advisor", value: (row) => users.find((user) => user.id === row.job.advisor_id)?.name ?? "Unassigned" }, { header: "Status", value: (row) => row.job.main_status }, { header: "Requested work", value: (row) => row.visit.requested_work }];
  return <div className="embedded-list reception-queue-list"><div className="queue-filter-bar"><label className="list-search">Search<input aria-label="Search today's queue" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, registration, customer or mobile" /></label><div className="queue-statuses" aria-label="Today Queue status filters">{statuses.map((value) => <button key={value} type="button" className={status === value ? "active" : ""} onClick={() => { setStatus(value); setPage(1); }}>{value === "ALL" ? "All" : value.replaceAll("_", " ")} <span>{value === "ALL" ? jobs.length : jobs.filter((row) => row.job.main_status === value).length}</span></button>)}</div><ListSearchActions onClear={reset} /></div><div className="list-result-controls"><ListExportControls report={{ title: "Today Queue", filters: activeFilterSummary({ Search: search.trim(), Status: status }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel="Today Queue records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div><ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />{paged.totalCount ? <div className="reception-visit-rows">{paged.items.map((row) => { const advisor = users.find((user) => user.id === row.job.advisor_id); return <button type="button" key={row.job.id} className={selectedJobId === row.job.id ? "reception-visit-row active" : "reception-visit-row"} onClick={() => onSelect(row.job.id)}><div><strong>{row.job.job_no}</strong><span>{row.customer.name} · {row.customer.mobile}</span></div><div><strong>{row.vehicle.number}</strong><span>{row.vehicle.make} {row.vehicle.model}</span></div><div><span className={advisor ? "advisor-name" : "advisor-name unassigned"}>{advisor?.name ?? "Unassigned"}</span><Status status={row.job.main_status} sub={row.job.sub_status} unmapped={!advisor} /></div><p>{row.visit.requested_work}</p></button>; })}</div> : <div className="list-empty"><h3>No matching visits</h3><button type="button" onClick={reset}>Clear filters</button></div>}<ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /></div>;
  */
}

function receptionAgeLabel(receivedDate: string, today: string) {
  const age = Math.max(
    1,
    Math.round(
      (Date.parse(`${today}T00:00:00Z`) -
        Date.parse(`${receivedDate}T00:00:00Z`)) /
        86_400_000,
    ),
  );
  return `${age} day${age === 1 ? "" : "s"} old`;
}

function CreateVisitDialog({
  state,
  mutate,
  actor,
  onClose,
  onCreated,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  onClose: () => void;
  onCreated: (jobId: number, jobNo: string) => void;
}) {
  const today = todayKey();
  const [tab, setTab] = useState<"details" | "body-mark">("details");
  const [marks, setMarks] = useState<DamageMark[]>([]);
  const [error, setError] = useState("");
  const [quickAdd, setQuickAdd] = useState<"customer" | "vehicle">();
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: "",
    mobile: "",
    type: "Individual",
  });
  const [form, setForm] = useState({
    customerId: 0,
    vehicleId: 0,
    customerName: "",
    mobile: "",
    customerType: "Individual",
    vehicleNo: "",
    make: "",
    model: "",
    color: "",
    odoReading: "",
    fuelLevelValue: "",
    fuelLevelUnit: "bars" as "bars" | "%" | "litres" | "Other",
    keys: "",
    accessories: "",
    requestedWork: "",
    advisorId: 0,
  });
  const clearCustomer = () =>
    setForm((current) => ({
      ...current,
      customerId: 0,
      vehicleId: 0,
      customerName: "",
      mobile: "",
      customerType: "Individual",
      vehicleNo: "",
      make: "",
      model: "",
      color: "",
      odoReading: "",
    }));
  const clearVehicle = () =>
    setForm((current) => ({
      ...current,
      vehicleId: 0,
      vehicleNo: "",
      make: "",
      model: "",
      color: "",
      odoReading: "",
    }));
  const selectCustomer = (id: number) => {
    if (!id) {
      clearCustomer();
      return;
    }
    const customer = state.customers.find((item) => item.id === id);
    const vehicle = state.vehicles.find((item) => item.customer_id === id);
    if (!customer) return;
    setForm((current) => ({
      ...current,
      customerId: id,
      vehicleId: vehicle?.id ?? 0,
      customerName: customer.name,
      mobile: customer.mobile,
      customerType: customer.type,
      vehicleNo: vehicle?.number ?? current.vehicleNo,
      make: vehicle?.make ?? current.make,
      model: vehicle?.model ?? current.model,
      color: vehicle?.color ?? current.color,
      odoReading: String(vehicle?.km ?? current.odoReading),
    }));
  };
  const selectVehicle = (id: number) => {
    if (!id) {
      clearVehicle();
      return;
    }
    const vehicle = state.vehicles.find((item) => item.id === id);
    const customer = state.customers.find(
      (item) => item.id === vehicle?.customer_id,
    );
    if (!vehicle) return;
    setForm((current) => ({
      ...current,
      vehicleId: id,
      customerId: customer?.id ?? current.customerId,
      customerName: customer?.name ?? current.customerName,
      mobile: customer?.mobile ?? current.mobile,
      customerType: customer?.type ?? current.customerType,
      vehicleNo: vehicle.number,
      make: vehicle.make,
      model: vehicle.model,
      color: vehicle.color,
      odoReading: String(vehicle.km),
    }));
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (
      ![
        form.customerName,
        form.mobile,
        form.vehicleNo,
        form.make,
        form.model,
        form.odoReading,
        form.fuelLevelValue,
        form.requestedWork,
      ].every((value) => value.trim())
    ) {
      setTab("details");
      setError(
        "Complete all required visit details before creating the visit.",
      );
      return;
    }
    const odoReading = Number(form.odoReading);
    if (!Number.isFinite(odoReading) || odoReading < 0) {
      setTab("details");
      setError("Enter the ODO meter reading in km.");
      return;
    }
    const fuel =
      form.fuelLevelUnit === "Other"
        ? form.fuelLevelValue
        : `${form.fuelLevelValue} ${form.fuelLevelUnit}`;
    let jobId = 0;
    let jobNo = "";
    if (
      mutate((db) => {
        jobId = receiveVehicle(db, {
          customerId: form.customerId || undefined,
          vehicleId: form.vehicleId || undefined,
          customerName: form.customerName,
          mobile: form.mobile,
          customerType: form.customerType,
          vehicleNo: form.vehicleNo,
          make: form.make,
          model: form.model,
          color: form.color,
          km: odoReading,
          odoReading,
          fuel,
          fuelLevelValue: form.fuelLevelValue,
          fuelLevelUnit: form.fuelLevelUnit,
          keys: form.keys,
          accessories: form.accessories,
          requestedWork: form.requestedWork,
          advisorId: form.advisorId || undefined,
          receptionId: actor.id,
          damageMarks: serializeDamageMarks(marks),
        });
        jobNo = String(
          db.exec("select job_no from job_cards where id=?", [jobId])[0]
            ?.values[0]?.[0] ?? "",
        );
      }, setError)
    )
      onCreated(jobId, jobNo);
  };
  const present = presentAdvisors(state.users, state.attendance, today);
  const advisors = [
    ...present,
    ...state.users.filter(
      (user) =>
        user.role === "service" && !present.some((item) => item.id === user.id),
    ),
  ];
  const customerOptions = [
    { value: 0, label: "Clear customer and vehicle" },
    ...state.customers.map((customer) => ({
      value: customer.id,
      label: `${customer.name} · ${customer.mobile}`,
    })),
  ];
  const vehicleOptions = [
    { value: 0, label: "Clear vehicle" },
    ...state.vehicles.map((vehicle) => {
      const customer = state.customers.find(
        (item) => item.id === vehicle.customer_id,
      );
      return {
        value: vehicle.id,
        label: [
          vehicle.number,
          `${vehicle.make} ${vehicle.model}`,
          customer?.name,
          customer?.mobile,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    }),
  ];
  const tabId = (name: "details" | "body-mark") => `create-visit-${name}-tab`;
  const panelId = (name: "details" | "body-mark") =>
    `create-visit-${name}-panel`;

  return (
    <Dialog
      wide
      title="Create New Visit"
      subtitle="Link an existing customer and vehicle, or enter new details"
      onClose={onClose}
      footer={
        <button className="primary-action" form="create-visit-form">
          Create Visit
        </button>
      }
    >
      <form id="create-visit-form" onSubmit={submit}>
        <div
          className="sub-tabs create-visit-tabs"
          role="tablist"
          aria-label="Create visit sections"
          onKeyDown={handleTabListKeyDown}
        >
          {(["details", "body-mark"] as const).map((item) => (
            <button
              type="button"
              id={tabId(item)}
              aria-controls={panelId(item)}
              tabIndex={tab === item ? 0 : -1}
              key={item}
              role="tab"
              aria-selected={tab === item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {item === "details" ? "Details" : "Body Mark"}
            </button>
          ))}
        </div>
        {tab === "details" ? (
          <div
            id={panelId("details")}
            role="tabpanel"
            aria-labelledby={tabId("details")}
            className="create-visit-tab-panel"
          >
            <div className="form-grid">
              <div className="field-with-action">
                <SearchSelect
                  label="Existing customer"
                  options={customerOptions}
                  value={form.customerId}
                  onChange={(value) => selectCustomer(Number(value))}
                  placeholder="Search customer or mobile"
                />
                <button
                  type="button"
                  className="link-action"
                  onClick={() => setQuickAdd("customer")}
                >
                  Add New Customer
                </button>
              </div>
              <div className="field-with-action">
                <SearchSelect
                  label="Existing vehicle"
                  options={vehicleOptions}
                  value={form.vehicleId}
                  onChange={(value) => selectVehicle(Number(value))}
                  placeholder="Search customer, phone, registration or model"
                />
                <button
                  type="button"
                  className="link-action"
                  disabled={!form.customerId}
                  onClick={() => setQuickAdd("vehicle")}
                >
                  Add New Vehicle
                </button>
              </div>
              <label>
                Customer Name
                <input
                  required
                  value={form.customerName}
                  onChange={(event) =>
                    setForm({ ...form, customerName: event.target.value })
                  }
                />
              </label>
              <label>
                Mobile
                <input
                  required
                  value={form.mobile}
                  onChange={(event) =>
                    setForm({ ...form, mobile: event.target.value })
                  }
                />
              </label>
              <label>
                Vehicle Number
                <input
                  required
                  value={form.vehicleNo}
                  onChange={(event) =>
                    setForm({ ...form, vehicleNo: event.target.value })
                  }
                />
              </label>
              <label>
                Make
                <input
                  required
                  value={form.make}
                  onChange={(event) =>
                    setForm({ ...form, make: event.target.value })
                  }
                />
              </label>
              <label>
                Model
                <input
                  required
                  value={form.model}
                  onChange={(event) =>
                    setForm({ ...form, model: event.target.value })
                  }
                />
              </label>
              <label>
                Color
                <input
                  value={form.color}
                  onChange={(event) =>
                    setForm({ ...form, color: event.target.value })
                  }
                />
              </label>
              <label>
                ODO meter reading (km)
                <input
                  required
                  type="number"
                  min="0"
                  value={form.odoReading}
                  onChange={(event) =>
                    setForm({ ...form, odoReading: event.target.value })
                  }
                />
              </label>
              <label>
                Fuel / battery level
                <div className="field-pair">
                  <input
                    required
                    value={form.fuelLevelValue}
                    onChange={(event) =>
                      setForm({ ...form, fuelLevelValue: event.target.value })
                    }
                  />
                  <select
                    value={form.fuelLevelUnit}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        fuelLevelUnit: event.target
                          .value as typeof form.fuelLevelUnit,
                      })
                    }
                  >
                    <option value="bars">bars</option>
                    <option value="%">%</option>
                    <option value="litres">litres</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </label>
              <label>
                Keys
                <input
                  value={form.keys}
                  onChange={(event) =>
                    setForm({ ...form, keys: event.target.value })
                  }
                />
              </label>
              <label>
                Accessories
                <input
                  value={form.accessories}
                  onChange={(event) =>
                    setForm({ ...form, accessories: event.target.value })
                  }
                />
              </label>
              <label>
                Advisor
                <select
                  value={form.advisorId}
                  onChange={(event) =>
                    setForm({ ...form, advisorId: Number(event.target.value) })
                  }
                >
                  <option value={0}>Assign later</option>
                  {advisors.map((advisor) => (
                    <option key={advisor.id} value={advisor.id}>
                      {advisor.name}
                      {present.some((item) => item.id === advisor.id)
                        ? " (Present)"
                        : " (Away)"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Requested Work
              <textarea
                required
                rows={3}
                value={form.requestedWork}
                onChange={(event) =>
                  setForm({ ...form, requestedWork: event.target.value })
                }
              />
            </label>
          </div>
        ) : (
          <div
            id={panelId("body-mark")}
            role="tabpanel"
            aria-labelledby={tabId("body-mark")}
            className="create-visit-tab-panel create-visit-body-mark-panel"
          >
            <div className="damage-capture">
              <strong>Body mark</strong>
              <BodyMarkDiagram
                marks={marks}
                onChange={setMarks}
                hideDownload
                meta={{
                  vehicleName: `${form.make} ${form.model}`,
                  color: form.color,
                  regNo: form.vehicleNo,
                }}
              />
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </form>
      {quickAdd === "customer" && (
        <Dialog title="Add New Customer" onClose={() => setQuickAdd(undefined)}>
          <CustomerEditor
            embedded
            value={newCustomer}
            setValue={setNewCustomer}
            mutate={mutate}
            onSaved={() => {
              setQuickAdd(undefined);
              setNewCustomer({
                id: 0,
                name: "",
                mobile: "",
                type: "Individual",
              });
            }}
          />
        </Dialog>
      )}
      {quickAdd === "vehicle" && form.customerId > 0 && (
        <Dialog title="Add New Vehicle" onClose={() => setQuickAdd(undefined)}>
          <VehicleMasterPanel
            key={form.customerId}
            embedded
            state={state}
            value={{
              id: 0,
              customer_id: form.customerId,
              number: "",
              make: "",
              model: "",
              color: "",
              km: 0,
            }}
            setValue={() => undefined}
            mutate={mutate}
            onSaved={() => setQuickAdd(undefined)}
          />
        </Dialog>
      )}
    </Dialog>
  );
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
  const assignedActiveJobs = state.jobs.filter(
    (item) =>
      item.job.advisor_id === user.id && isServiceActiveJob(item),
  );
  if (activeMenuItem === "My Queue") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle
            icon={<ClipboardList />}
            title="My Queue"
            subtitle="Open advisor jobs"
          />
          <FilterableJobRows
            title="My Queue"
            jobs={assignedActiveJobs}
            selectedJobId={view?.job.id}
            onSelect={setSelectedJobId}
            showStatusFilter
          />
        </div>
        <div className="desk-panel">
          <PanelTitle
            icon={<FileText />}
            title="Selected Job"
            subtitle={view?.job.job_no ?? "Select a job"}
          />
          {view && <JobSnapshot view={view} />}
        </div>
      </section>
    );
  }
  if (
    (activeMenuItem === "Job Card" || activeMenuItem === "Job Cards") ||
    activeMenuItem === "Estimate" ||
    activeMenuItem === "Follow-ups"
  )
    return (
      <ServiceAdvisorList
        kind={
          activeMenuItem === "Job Card" || activeMenuItem === "Job Cards"
            ? "job-cards"
            : activeMenuItem === "Estimate"
              ? "estimates"
              : "followups"
        }
        jobs={assignedActiveJobs}
        state={state}
        mutate={mutate}
        actor={user}
      />
    );
  if (!view) return null;
  if (activeMenuItem === "Photos") {
    return (
      <section className="workspace two-panel">
        <JobMediaPanel view={view} actor={user} mutate={mutate} />
        <Timeline view={view} />
      </section>
    );
  }
  return null;
}

type ServiceListKind = "job-cards" | "estimates" | "followups";

function ServiceAdvisorList({
  kind,
  jobs,
  state,
  mutate,
  actor,
}: {
  kind: ServiceListKind;
  jobs: JobView[];
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
}) {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(() =>
    kind === "job-cards" ? "" : localCalendarDate(),
  );
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<JobView>();
  const [dialog, setDialog] = useState<
    "job" | "estimate" | "followup" | "followup-view"
  >();
  const needle = normalizeSearch(useDeferredValue(search));
  const listedJobs = useMemo(
    () => (kind === "job-cards" ? jobs : jobs.filter(isServiceActiveJob)),
    [jobs, kind],
  );
  const months = useMemo(
    () =>
      [
        ...new Set(
          listedJobs
            .map((item) =>
              kind === "job-cards"
                ? item.job.estimated_delivery?.slice(0, 7) ?? ""
                : item.visit.received_at.slice(0, 7),
            )
            .filter((value) => /^\d{4}-\d{2}$/.test(value)),
        ),
      ]
        .sort()
        .reverse(),
    [listedJobs],
  );
  const filtered = useMemo(
    () =>
      listedJobs.filter((item) => {
        const filteredDate =
          kind === "job-cards"
            ? item.job.estimated_delivery ?? ""
            : item.visit.received_at.slice(0, 10);
        return (
          (!needle ||
            normalizeSearch(
              `${item.job.job_no} ${item.vehicle.number} ${item.customer.name}`,
            ).includes(needle)) &&
          (!date || filteredDate === date) && // Exact date intentionally takes precedence over month/year.
          (date || !month || filteredDate.slice(0, 7) === month)
        );
      }),
    [listedJobs, needle, date, month, kind],
  );
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => {
    if (paged.page !== page) setPage(paged.page);
  }, [paged.page, page]);
  const title =
    kind === "job-cards"
      ? "Job Cards"
      : kind === "estimates"
        ? "Estimates"
        : "Follow-ups";
  const clear = () => {
    setSearch("");
    setDate("");
    setMonth("");
    setPage(1);
  };
  const open = (row: JobView, next: "job" | "estimate" | "followup") => {
    setSelected(row);
    setDialog(next);
  };
  const columns: ExportColumn<JobView>[] = [
    { header: "Job card", value: (row) => row.job.job_no },
    { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name },
    ...(kind === "job-cards"
      ? [{ header: "Estimated Delivery Date", value: (row: JobView) => row.job.estimated_delivery || "—" }]
      : []),
    { header: "Job status", value: (row) => row.job.main_status },
    {
      header: "Estimate status",
      value: (row) => row.estimate?.status ?? "Not created",
    },
    { header: "Follow-up status", value: serviceFollowupStatus },
  ];
  const followupTone = (status: string) =>
    status.startsWith("Done(") ? "done" : "pending";
  const monthYearLabel = (value: string) => {
    const dateValue = new Date(`${value}-01T00:00:00`);
    return Number.isNaN(dateValue.valueOf())
      ? value
      : dateValue.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        });
  };
  return (
    <section className="entity-list-page service-advisor-list">
      {selected && dialog === "job" && (
        <JobRecordDialog
          view={selected}
          state={state}
          mutate={mutate}
          actor={actor}
          mode="view"
          onClose={() => setDialog(undefined)}
        />
      )}
      {selected && dialog === "estimate" && (
        <ServiceEstimateDialog
          view={selected}
          actor={actor}
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
      )}
      {selected && dialog === "followup" && (
        <ServiceFollowupDialog
          view={selected}
          mode="add"
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
      )}
      {selected && dialog === "followup-view" && (
        <ServiceFollowupDialog
          view={selected}
          mode="view"
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
      )}
      <div className="list-page-heading">
        <div>
          <h2>{title}</h2>
          <p>
            {actor.role === "admin"
              ? "All workshop jobs"
              : "Jobs assigned to you"}
          </p>
        </div>
      </div>
      <div className="list-filter-bar">
        <label className="list-search">
          Search
          <input
            aria-label={`Search ${title.toLowerCase()}`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job, vehicle or customer"
          />
        </label>
        <div className="list-filter-fields open">
          <label>
            {kind === "job-cards" ? "Estimated Delivery Date" : "Received date"}
            <input
              aria-label={kind === "job-cards" ? `${title} estimated delivery date` : `${title} received date`}
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setMonth("");
                setPage(1);
              }}
            />
          </label>
          <label>
            Month-Year
            <select
              aria-label={`${title} month-year`}
              value={month}
              onChange={(event) => {
                setMonth(event.target.value);
                setDate("");
                setPage(1);
              }}
            >
              <option value="">All months</option>
              {months.map((value) => (
                <option key={value} value={value}>
                  {monthYearLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <ListSearchActions onClear={clear} />
        </div>
      </div>
      <PaginationToolbar
        controls={
          <ListExportControls
            report={{
              title,
              filters: activeFilterSummary({
                Search: search.trim(),
                [kind === "job-cards" ? "Estimated Delivery Date" : "Received date"]: date,
                [kind === "job-cards" ? "Estimated Delivery Month" : "Received month"]: date ? "" : month,
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel={`${title} records per page`}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job Card</th>
                <th>Vehicle</th>
                <th>Customer</th>
                {kind === "job-cards" && <th>Estimated Delivery Date</th>}
                {kind !== "followups" && <th>Job Status</th>}
                <th>Estimate Status</th>
                <th>Follow-up Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.items.map((row) => {
                const status = serviceFollowupStatus(row);
                const tone = followupTone(status);
                return (
                  <tr
                    key={row.job.id}
                    className={
                      kind === "followups"
                        ? `service-followup-row service-followup-${tone}`
                        : undefined
                    }
                  >
                    <td>{row.job.job_no}</td>
                    <td>{row.vehicle.number}</td>
                    <td>{row.customer.name}</td>
                    {kind === "job-cards" && <td>{row.job.estimated_delivery || "—"}</td>}
                    {kind !== "followups" && (
                      <td>
                        <Status
                          status={row.job.main_status}
                          sub={row.job.sub_status}
                        />
                      </td>
                    )}
                    <td>{row.estimate?.status ?? "Not created"}</td>
                    <td>
                      {kind === "followups" ? (
                        <span
                          className={`service-followup-status service-followup-status-${tone}`}
                          role="status"
                        >
                          {status}
                        </span>
                      ) : (
                        status
                      )}
                    </td>
                    <td>
                      <div className="grid-actions">
                        {kind === "job-cards" && (
                          <button
                            className="grid-action"
                            onClick={() => open(row, "job")}
                          >
                            View
                          </button>
                        )}
                        {kind === "estimates" && (
                          <>
                            {isServiceActiveJob(row) && (
                              <button
                                type="button"
                                className={`workflow-action ${row.estimate ? "action-secondary" : "action-primary"}`}
                                onClick={() => open(row, "estimate")}
                              >
                                {row.estimate ? (
                                  <>
                                    <Pencil size={15} />
                                    Edit Estimate
                                  </>
                                ) : (
                                  <>
                                    <Plus size={15} />
                                    Create Estimate
                                  </>
                                )}
                              </button>
                            )}
                            {row.estimate && (
                              <DocumentDownloadButton
                                kind="estimate"
                                view={row}
                              />
                            )}
                          </>
                        )}
                        {kind === "followups" && (
                          <>
                            <button
                              className="grid-action"
                              onClick={() => open(row, "followup")}
                            >
                              Add Follow-up
                            </button>
                            {tone === "done" && (
                              <a
                                className="link-action"
                                href="#follow-up-history"
                                onClick={(event) => {
                                  event.preventDefault();
                                  setSelected(row);
                                  setDialog("followup-view");
                                }}
                              >
                                View
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton onClick={clear} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </section>
  );
}

function ServiceEstimateDialog({
  view,
  actor,
  mutate,
  onClose,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  if (isServiceActiveJob(view))
    return (
      <EstimateDialog
        view={view}
        actor={actor}
        mutate={mutate}
        onClose={onClose}
      />
    );
  return (
    <Dialog
      title="View Estimate"
      subtitle={`${view.job.job_no} · ${view.estimate?.status ?? "Not created"}`}
      onClose={onClose}
    >
      {view.estimate ? (
        <div className="record-view">
          {view.estimate_items.map((item) => (
            <Info
              key={item.id}
              label={item.description}
              value={money(item.qty * item.rate)}
            />
          ))}
          <Info
            label="Total"
            value={money(invoiceItemsTotal(view.estimate_items, view.estimate))}
          />
        </div>
      ) : (
        <p className="empty-state">
          No estimate has been created for this job.
        </p>
      )}
    </Dialog>
  );
}

function ServiceFollowupDialog({
  view,
  mode,
  mutate,
  onClose,
}: {
  view: JobView;
  mode: "add" | "view";
  mutate: Mutate;
  onClose: () => void;
}) {
  const editable = mode === "add" && isServiceActiveJob(view);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [completions, setCompletions] = useState<
    Record<number, { selected: boolean; outcome: string }>
  >({});
  const [history, setHistory] = useState(() =>
    [...view.followups].sort((left, right) =>
      (right.created_at || right.updated_at || right.due_at).localeCompare(
        left.created_at || left.updated_at || left.due_at,
      ),
    ),
  );
  const [editingId, setEditingId] = useState<number>();
  const resetComposer = () => {
    setNote("");
    setOutcome("");
    setDone(false);
    setEditingId(undefined);
  };
  const editOpen = (item: Followup) => {
    setEditingId(item.id);
    setNote(item.note);
    setOutcome(item.outcome ?? "");
    setDone(false);
  };
  const save = (event: FormEvent, keepOpen = false) => {
    event.preventDefault();
    if (!note.trim()) return;
    const timestamp = new Date().toISOString();
    const current = history.find((item) => item.id === editingId);
    let createdId = -Date.now();
    const saved =
      editingId && current
        ? {
            ...current,
            note: note.trim(),
            outcome: outcome.trim(),
            done: done ? 1 : 0,
            updated_at: timestamp,
          }
        : {
            id: createdId,
            job_card_id: view.job.id,
            note: note.trim(),
            due_at: localCalendarDate(),
            done: done ? 1 : 0,
            outcome: outcome.trim(),
            created_at: timestamp,
            updated_at: timestamp,
          };
    if (
      mutate((db) =>
        editingId && current
          ? updateFollowup(db, editingId, {
              ...current,
              note: note.trim(),
              done: done ? 1 : 0,
              outcome: outcome.trim(),
            })
          : (createdId = createFollowup(db, {
              job_card_id: view.job.id,
              note: note.trim(),
              due_at: localCalendarDate(),
              done: done ? 1 : 0,
              outcome: outcome.trim(),
            })),
      )
    ) {
      if (!editingId) saved.id = createdId;
      setHistory((items) => [
        saved,
        ...items.filter((item) => item.id !== saved.id),
      ]);
      if (keepOpen) resetComposer();
      else onClose();
    }
  };
  const materialName = (itemId: number) =>
    view.inventory.find((item) => item.id === itemId)?.name ??
    `Item #${itemId}`;
  return (
    <Dialog
      wide
      className="service-followup-dialog"
      title={mode === "view" ? "Follow-up History" : "Follow-ups"}
      subtitle="Customer contact and service coordination"
      onClose={onClose}
    >
      <div className="followup-job-card">
        <div>
          <span>Job card</span>
          <strong>{view.job.job_no}</strong>
        </div>
        <div>
          <span>Customer</span>
          <strong>{view.customer.name}</strong>
          <a href={`tel:${view.customer.mobile}`}>{view.customer.mobile}</a>
        </div>
        <div>
          <span>Vehicle</span>
          <strong>{view.vehicle.number}</strong>
          <small>
            {view.vehicle.make} {view.vehicle.model}
          </small>
        </div>
        <div>
          <span>Current job status</span>
          <Status status={view.job.main_status} sub={view.job.sub_status} />
        </div>
      </div>
      <div className="followup-details">
        <details>
          <summary>Vehicle details</summary>
          <div>
            <span>Registration: {view.vehicle.number}</span>
            <span>
              Model: {view.vehicle.make} {view.vehicle.model}
            </span>
            <span>Odometer: {view.vehicle.km.toLocaleString("en-IN")} km</span>
            <span>Requested work: {view.visit.requested_work || "—"}</span>
          </div>
        </details>
        <details>
          <summary>
            Requested materials (
            {view.material_requests.length +
              view.material_purchase_requests.length}
            )
          </summary>
          <div>
            {view.material_requests.length ||
            view.material_purchase_requests.length ? (
              <>
                {view.material_requests.map((item) => (
                  <span key={`material-${item.id}`}>
                    {materialName(item.item_id)} · {item.requested_qty} ·{" "}
                    {item.status ?? "Requested"}
                  </span>
                ))}
                {view.material_purchase_requests.map((item) => (
                  <span key={`purchase-${item.id}`}>
                    {item.item_name} · {item.quantity} {item.unit} ·{" "}
                    {item.status}
                  </span>
                ))}
              </>
            ) : (
              <span>No materials requested.</span>
            )}
          </div>
        </details>
        <details>
          <summary>
            Estimate{" "}
            {view.estimate ? `· ${view.estimate.status}` : "· Not created"}
          </summary>
          <div>
            <span>Status: {view.estimate?.status ?? "Not created"}</span>
            <span>Items: {view.estimate_items.length}</span>
            <span>
              Total:{" "}
              {money(invoiceItemsTotal(view.estimate_items, view.estimate))}
            </span>
          </div>
        </details>
      </div>
      <section className="followup-history" aria-label="Follow-up history">
        <div className="followup-section-heading">
          <h3>History</h3>
          <span>{history.length} saved</span>
        </div>
        {history.length ? (
          history.map((item) => (
            <article
              className={`followup-history-card ${item.done ? "done" : "open"}`}
              key={item.id}
            >
              <div>
                <span className="followup-state">
                  {item.done ? "Done" : "Open"}
                </span>
                <strong>{item.note}</strong>
                {item.outcome && <p>Outcome: {item.outcome}</p>}
              </div>
              <div className="followup-timestamps">
                <span>
                  Created {formatTimestamp(item.created_at || item.due_at)}
                </span>
                {item.done && (
                  <span>
                    Completed{" "}
                    {formatTimestamp(
                      item.updated_at || item.created_at || item.due_at,
                    )}
                  </span>
                )}
                {editable && !item.done && (
                  <button
                    type="button"
                    className="link-action"
                    onClick={() => editOpen(item)}
                  >
                    Edit
                  </button>
                )}
                {item.done && <small>Completed entries are read-only.</small>}
              </div>
            </article>
          ))
        ) : (
          <p className="empty-state">No saved follow-ups.</p>
        )}
      </section>
      {editable && (
        <form
          id="service-followup-form"
          className="followup-composer"
          onSubmit={(event) => save(event, false)}
        >
          <div className="followup-section-heading">
            <h3>{editingId ? "Edit open follow-up" : "Add follow-up"}</h3>
            {editingId && (
              <button
                type="button"
                className="link-action"
                onClick={resetComposer}
              >
                Cancel edit
              </button>
            )}
          </div>
          <label>
            Note
            <textarea
              data-dialog-initial-focus
              rows={3}
              required
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a concise follow-up note"
            />
          </label>
          <label>
            Outcome <small>Optional</small>
            <input
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
              placeholder="Customer response or next step"
            />
          </label>
          <button
            type="button"
            className={`followup-done-toggle ${done ? "checked" : ""}`}
            role="checkbox"
            aria-checked={done}
            onClick={() => setDone((value) => !value)}
          >
            <Check size={16} aria-hidden="true" /> Mark this follow-up done
          </button>
          <div className="followup-composer-actions">
            <button type="submit" className="secondary-action">
              Save Follow-up
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={(event) => save(event as unknown as FormEvent, true)}
            >
              Save & Add Another
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
  return (
    <Dialog
      title={mode === "view" ? "Follow-up History" : "Follow-ups"}
      subtitle={`${view.job.job_no} · ${view.vehicle.number}`}
      onClose={onClose}
      footer={
        editable ? (
          <button form="service-followup-form" className="primary-action">
            Save Follow-up
          </button>
        ) : undefined
      }
    >
      <div className="followup-history">
        {view.followups.length ? (
          view.followups.map((item) => (
            <div className="row" key={item.id}>
              <strong>{item.note}</strong>
              <span>
                {item.done ? "Done" : "Open"}
                {item.outcome ? ` · ${item.outcome}` : ""}
              </span>
              <span>
                {formatTimestamp(
                  item.created_at || item.updated_at || item.due_at,
                )}
              </span>
              {editable && !item.done && (
                <label className="followup-completion">
                  <input
                    type="checkbox"
                    checked={completions[item.id]?.selected ?? false}
                    onChange={(event) =>
                      setCompletions((current) => ({
                        ...current,
                        [item.id]: {
                          selected: event.target.checked,
                          outcome: current[item.id]?.outcome ?? "",
                        },
                      }))
                    }
                  />{" "}
                  Mark Done{" "}
                  <input
                    aria-label={`Outcome for ${item.note}`}
                    value={completions[item.id]?.outcome ?? ""}
                    disabled={!completions[item.id]?.selected}
                    onChange={(event) =>
                      setCompletions((current) => ({
                        ...current,
                        [item.id]: {
                          selected: current[item.id]?.selected ?? false,
                          outcome: event.target.value,
                        },
                      }))
                    }
                    placeholder="Outcome"
                  />
                </label>
              )}
            </div>
          ))
        ) : (
          <p className="empty-state">No saved follow-ups.</p>
        )}
      </div>
      {editable && (
        <form id="service-followup-form" onSubmit={save}>
          <label>
            Note
            <input
              data-dialog-initial-focus
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a follow-up note"
            />
          </label>
          <label>
            Outcome
            <input
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
            />
          </label>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={done}
              onChange={(event) => setDone(event.target.checked)}
            />{" "}
            Mark new follow-up Done
          </label>
        </form>
      )}
    </Dialog>
  );
}

function StoreDesk({
  activeMenuItem,
  state,
  actor,
  mutate,
  setSelectedJobId,
  initialStockSearch,
  initialDrilldown,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
  initialStockSearch?: string;
  initialDrilldown?: DashboardDrilldown;
}) {
  const [stockTab, setStockTab] = useState<
    "Inventory List" | "Low Stock" | "Stock Movements"
  >(initialDrilldown?.stockTab ?? "Inventory List");
  const [editingStock, setEditingStock] = useState<InventoryItem>();
  const [quickAddStockOpen, setQuickAddStockOpen] = useState(false);
  const [releaseCandidate, setReleaseCandidate] = useState<StoreRequestRow>();
  const [approvalCandidate, setApprovalCandidate] = useState<StoreRequestRow>();
  const [reconcileCandidate, setReconcileCandidate] =
    useState<StoreRequestRow>();
  const [viewJobId, setViewJobId] = useState<number>();
  const openJob = (id: number) => {
    setSelectedJobId(id);
    setViewJobId(id);
  };
  const viewJob = state.jobs.find((view) => view.job.id === viewJobId);
  const requests = state.jobs.flatMap((view) =>
    view.material_requests.map((request) => ({
      view,
      request,
      item: state.inventory.find((item) => item.id === request.item_id),
    })),
  );
  const localPurchases = state.jobs.flatMap((view) =>
    view.local_purchases.map((purchase) => ({ view, purchase })),
  );
  const purchaseRequests = state.jobs.flatMap((view) =>
    view.material_purchase_requests.map((purchaseRequest) => ({
      view,
      purchaseRequest,
    })),
  );
  if (activeMenuItem === "Stock") {
    const lowStock = state.inventory.filter(
      (item) => item.stock_qty < item.low_stock_qty,
    );
    return (
      <section className="workspace single-panel stock-workspace">
        <div className="desk-panel stock-overview">
          <PanelTitle
            icon={<Boxes />}
            title="Stock"
            subtitle="Inventory levels, low-stock attention and movement history"
          />
          <div className="sub-tabs" role="tablist" aria-label="Stock views">
            {(["Inventory List", "Low Stock", "Stock Movements"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={stockTab === tab}
                  className={stockTab === tab ? "active" : ""}
                  onClick={() => setStockTab(tab)}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
          <div className="stock-summary" aria-label="Stock summary">
            <span>
              <Boxes size={16} />
              <strong>{state.inventory.length}</strong> Total SKUs
            </span>
            <span>
              <Package size={16} />
              <strong>
                {state.inventory.reduce((sum, item) => sum + item.stock_qty, 0)}
              </strong>{" "}
              Total Units
            </span>
            <span>
              <ClipboardCheck size={16} />
              <strong>{lowStock.length}</strong> Low Stock
            </span>
            <span>
              <ShieldCheck size={16} />
              <strong>
                {state.inventory.filter((item) => item.stock_qty <= 0).length}
              </strong>{" "}
              Out of Stock
            </span>
          </div>
        </div>
        {stockTab === "Inventory List" && (
          <StoreList
            key={`stock-${initialStockSearch ?? "all"}`}
            kind="stock"
            inventory={state.inventory}
            requests={requests}
            onOpenJob={openJob}
            onEditStock={setEditingStock}
            initialSearch={initialStockSearch}
            initialPrimary={initialDrilldown?.status}
            headerAction={
              <button
                type="button"
                className="primary-action"
                aria-haspopup="dialog"
                onClick={() => setQuickAddStockOpen(true)}
              >
                <Plus size={16} /> Quick Add Stock
              </button>
            }
          />
        )}
        {stockTab === "Low Stock" && (
          <StoreList
            key="low-stock"
            kind="stock"
            inventory={lowStock}
            requests={requests}
            onOpenJob={openJob}
          />
        )}
        {stockTab === "Stock Movements" && (
          <StockMovementHistory state={state} />
        )}
        {quickAddStockOpen && (
          <Dialog
            title="Quick Add Stock"
            subtitle="Record an inward against an existing SKU or create a new SKU"
            onClose={() => setQuickAddStockOpen(false)}
          >
            <QuickAddStock
              inventory={state.inventory}
              actor={actor}
              purchaseOrders={state.purchase_orders}
              purchaseOrderLines={state.purchase_order_lines}
              mutate={mutate}
              onSaved={() => setQuickAddStockOpen(false)}
            />
          </Dialog>
        )}
        {editingStock && (
          <EditStockDetailsDialog
            item={editingStock}
            mutate={mutate}
            onClose={() => setEditingStock(undefined)}
          />
        )}
      </section>
    );
  }
  if (activeMenuItem === "Material Requests") {
    return (
      <section className="workspace single-panel store-list-first-workspace">
        <StoreList
          key={`requests-${initialDrilldown?.month ?? ""}`}
          kind="requests"
          inventory={state.inventory}
          requests={requests}
          purchases={localPurchases}
          purchaseRequests={purchaseRequests}
          onOpenJob={openJob}
          onNeedsApproval={setApprovalCandidate}
          initialMonth={initialDrilldown?.month}
        />
        <details className="workflow-disclosure">
          <summary>Purchase, Stock &amp; Issue</summary>
          <div className="store-request-actions">
            <PurchaseStockIssueEditor
              state={state}
              actor={actor}
              purchaseRequests={purchaseRequests}
              mutate={mutate}
            />
          </div>
        </details>
        {approvalCandidate && (
          <MaterialApprovalSubmitDialog
            row={approvalCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setApprovalCandidate(undefined)}
          />
        )}
        {viewJob && (
          <JobRecordDialog
            view={viewJob}
            state={state}
            mutate={mutate}
            actor={actor}
            mode="view"
            onClose={() => setViewJobId(undefined)}
          />
        )}
      </section>
    );
  }
  const eligibleRequests = requests.filter(({ view, request }) =>
    materialRowActionsFor(actor, view.job, request).includes("release"),
  );
  if (activeMenuItem === "Issue Material") {
    return (
      <section className="workspace single-panel store-list-first-workspace">
        <StoreList
          key={`${activeMenuItem}-${initialDrilldown?.month ?? ""}`}
          kind="issue"
          inventory={state.inventory}
          requests={eligibleRequests}
          onOpenJob={openJob}
          onRelease={setReleaseCandidate}
          onNeedsApproval={setApprovalCandidate}
          initialMonth={initialDrilldown?.month}
          initialPrimary={initialDrilldown?.status}
        />
        <details className="workflow-disclosure">
          <summary>Issue workflow</summary>
          <IssueMaterialEditor />
        </details>
        {releaseCandidate && (
          <ReleaseMaterialDialog
            row={releaseCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setReleaseCandidate(undefined)}
          />
        )}
        {approvalCandidate && (
          <MaterialApprovalSubmitDialog
            row={approvalCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setApprovalCandidate(undefined)}
          />
        )}
        {viewJob && (
          <JobRecordDialog
            view={viewJob}
            state={state}
            mutate={mutate}
            actor={actor}
            mode="view"
            onClose={() => setViewJobId(undefined)}
          />
        )}
      </section>
    );
  }
  const reconcileRequests = requests.filter(
    ({ request }) => request.issued_qty > 0,
  );
  return (
    <section className="workspace single-panel store-list-first-workspace">
      <StoreList
        key={activeMenuItem}
        kind="reconcile"
        inventory={state.inventory}
        requests={reconcileRequests}
        onOpenJob={openJob}
        onReconcile={setReconcileCandidate}
      />
      {reconcileCandidate && (
        <ReconcileEditor
          row={reconcileCandidate}
          mutate={mutate}
          onClose={() => setReconcileCandidate(undefined)}
        />
      )}
    </section>
  );
}

function PurchaseStockIssueEditor({
  state,
  actor,
  purchaseRequests,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  purchaseRequests: Array<{
    view: JobView;
    purchaseRequest: MaterialPurchaseRequest;
  }>;
  mutate: Mutate;
}) {
  const pending = purchaseRequests.filter(
    ({ purchaseRequest }) => purchaseRequest.status === "Pending",
  );
  const [requestId, setRequestId] = useState(
    pending[0]?.purchaseRequest.id ?? 0,
  );
  const [itemId, setItemId] = useState(0);
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Local purchase");
  const [unitCost, setUnitCost] = useState(0);
  const [vendor, setVendor] = useState("");
  const [billReference, setBillReference] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const selected = pending.find((row) => row.purchaseRequest.id === requestId);
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!requestId) {
      setError("Choose a pending request.");
      return;
    }
    setError("");
    if (
      mutate(
        (db) =>
          purchaseStockAndIssueForActor(db, requestId, actor.id, {
            inventory_item_id: itemId || undefined,
            sku,
            category,
            unit_cost: unitCost,
            vendor,
            bill_reference: billReference,
            note,
          }),
        setError,
      )
    ) {
      setVendor("");
      setBillReference("");
      setNote("");
      setItemId(0);
    }
  };
  return (
    <form className="desk-panel" onSubmit={save}>
      <PanelTitle
        icon={<PackageCheck />}
        title="Purchase, Stock & Issue"
        subtitle="Complete a requested new item in one audited operation"
      />
      {!pending.length ? (
        <p className="empty-state">No pending new-item requests.</p>
      ) : (
        <>
          <label>
            Pending request
            <select
              value={requestId}
              onChange={(event) => setRequestId(Number(event.target.value))}
            >
              {pending.map(({ view, purchaseRequest }) => (
                <option key={purchaseRequest.id} value={purchaseRequest.id}>
                  {view.job.job_no} · {purchaseRequest.item_name} ·{" "}
                  {purchaseRequest.quantity} {purchaseRequest.unit}
                </option>
              ))}
            </select>
          </label>
          <label>
            Map to inventory item (optional)
            <select
              value={itemId}
              onChange={(event) => setItemId(Number(event.target.value))}
            >
              <option value={0}>Create inventory item</option>
              {state.inventory
                .filter((item) => item.unit === selected?.purchaseRequest.unit)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.sku}
                  </option>
                ))}
            </select>
          </label>
          {!itemId && (
            <div className="form-grid">
              <label>
                SKU
                <input
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder={`LOCAL-${requestId}`}
                />
              </label>
              <label>
                Category
                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
              </label>
            </div>
          )}
          <div className="form-grid">
            <label>
              Unit cost
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(event) => setUnitCost(Number(event.target.value))}
              />
            </label>
            <label>
              Vendor / shop
              <input
                required
                value={vendor}
                onChange={(event) => setVendor(event.target.value)}
              />
            </label>
            <label>
              Bill / reference
              <input
                required
                value={billReference}
                onChange={(event) => setBillReference(event.target.value)}
              />
            </label>
          </div>
          <label>
            Note (optional)
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
          <button className="primary-action">Purchase, Stock & Issue</button>
        </>
      )}
    </form>
  );
}

type PurchaseFormLine = InwardPurchaseLineInput & { key: string };

type PurchaseOrderFormLine = PurchaseOrderInput["lines"][number] & {
  key: string;
};

/** Active purchasing is a commitment register. Legacy invoices below remain history only. */
function PurchaseOrdersWorkspace({
  state,
  actor,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  const [selectedId, setSelectedId] = useState<number>();
  const [dialog, setDialog] = useState<"form" | "view">();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [supplierId, setSupplierId] = useState(0);
  const [poNumber, setPoNumber] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<PurchaseOrderFormLine[]>([]);
  const supplierName = (id: number) =>
    state.suppliers.find((supplier) => supplier.id === id)?.name ??
    "Unknown supplier";
  const legacyOrderIds = new Set(
    state.inward_purchases
      .map((purchase) => purchase.purchase_order_id)
      .filter((id): id is number => id !== null && id !== undefined),
  );
  const orders = state.purchase_orders.filter(
    (order) => !legacyOrderIds.has(order.id),
  );
  const selected = orders.find((order) => order.id === selectedId);
  const selectedLines = selected
    ? state.purchase_order_lines.filter(
        (line) => line.purchase_order_id === selected.id,
      )
    : [];
  const receivedFor = (line: PurchaseOrderLine) =>
    state.stock_inwards
      .filter((inward) => inward.purchase_order_line_id === line.id)
      .reduce((sum, inward) => sum + inward.qty, 0);
  const close = () => {
    setDialog(undefined);
    setSelectedId(undefined);
  };
  const openNew = () => {
    setSelectedId(undefined);
    setSupplierId(0);
    setPoNumber("");
    setOrderDate(new Date().toISOString().slice(0, 10));
    setNotes("");
    setLines(
      state.inventory[0]
        ? [
            {
              key: crypto.randomUUID(),
              item_id: state.inventory[0].id,
              ordered_qty: 1,
              unit_cost: 0,
              discount: 0,
              gst_rate: 0,
            },
          ]
        : [],
    );
    setDialog("form");
  };
  const openEdit = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setSupplierId(order.supplier_id);
    setPoNumber(order.po_number);
    setOrderDate(order.order_date);
    setNotes(order.notes);
    setLines(
      state.purchase_order_lines
        .filter((line) => line.purchase_order_id === order.id)
        .map((line) => ({
          key: String(line.id),
          item_id: line.item_id,
          ordered_qty: line.ordered_qty,
          unit_cost: line.unit_cost,
          discount: line.discount,
          gst_rate: line.gst_rate,
        })),
    );
    setDialog("form");
  };
  const openView = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setDialog("view");
  };
  const valid =
    supplierId > 0 &&
    poNumber.trim() &&
    /^\d{4}-\d{2}-\d{2}$/.test(orderDate) &&
    lines.length > 0 &&
    lines.every(
      (line) =>
        line.ordered_qty > 0 &&
        line.unit_cost >= 0 &&
        (line.discount ?? 0) >= 0 &&
        (line.gst_rate ?? 0) >= 0 &&
        (line.gst_rate ?? 0) <= 100,
    );
  const save = () => {
    const input: PurchaseOrderInput = {
      supplier_id: supplierId,
      po_number: poNumber,
      order_date: orderDate,
      notes,
      lines: lines.map(({ key: _key, ...line }) => line),
    };
    let id = selectedId;
    if (
      mutate((db) => {
        if (id) updatePurchaseOrderForActor(db, id, actor.id, input);
        else id = createPurchaseOrderForActor(db, actor.id, input);
      })
    ) {
      setSelectedId(id);
      setDialog("view");
    }
  };
  const filtered = orders.filter(
    (order) =>
      (status === "ALL" || order.status === status) &&
      (!search.trim() ||
        normalizeSearch(
          `${order.po_number} ${supplierName(order.supplier_id)} ${order.notes}`,
        ).includes(normalizeSearch(search))),
  );
  const totalReceived = selectedLines.reduce(
    (sum, line) => sum + receivedFor(line),
    0,
  );
  const totalOrdered = selectedLines.reduce(
    (sum, line) => sum + line.ordered_qty,
    0,
  );
  const receivedValue = selectedLines.reduce(
    (sum, line) => sum + receivedFor(line) * line.unit_cost,
    0,
  );
  return (
    <section className="workspace single-panel purchase-orders-workspace">
      <div className="desk-panel store-list-page inward-register">
        <div className="action-row">
          <PanelTitle
            icon={<ReceiptText />}
            title="Purchase Orders"
            subtitle="Ordering commitments; stock is recorded only through Stock Inward."
          />
          <button className="primary-action" onClick={openNew}>
            <Plus size={16} /> New purchase order
          </button>
        </div>
        <div className="store-filter-grid register-filter-toolbar">
          <label className="list-search">
            Search
            <input
              aria-label="Search purchase orders"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="PO number or supplier"
            />
          </label>
          <label>
            Status
            <select
              aria-label="Purchase order status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              {[
                "Draft",
                "Sent",
                "Partially Received",
                "Ready to Close",
                "Closed",
                "Cancelled",
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
        </div>
        <div className="table-wrap">
          <table aria-label="Purchase order register">
            <thead>
              <tr>
                <th>PO</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Ordered</th>
                <th>Received</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const orderLines = state.purchase_order_lines.filter(
                  (line) => line.purchase_order_id === order.id,
                );
                const received = orderLines.reduce(
                  (sum, line) => sum + receivedFor(line),
                  0,
                );
                return (
                  <tr
                    key={order.id}
                    className="clickable-row"
                    onClick={() => openView(order)}
                  >
                    <td>{order.po_number}</td>
                    <td>{order.order_date}</td>
                    <td>{supplierName(order.supplier_id)}</td>
                    <td>
                      {orderLines.reduce(
                        (sum, line) => sum + line.ordered_qty,
                        0,
                      )}
                    </td>
                    <td>{received}</td>
                    <td>{money(order.total)}</td>
                    <td>
                      <span className="status-badge">{order.status}</span>
                    </td>
                    <td>
                      <div className="grid-actions purchase-order-actions">
                        {order.status === "Draft" && (
                          <button
                            type="button"
                            className="workflow-action action-secondary purchase-order-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEdit(order);
                            }}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        )}
                        <button
                          type="button"
                          className="workflow-action action-document purchase-order-action"
                          onClick={(event) => {
                            event.stopPropagation();
                            openView(order);
                          }}
                        >
                          <Workflow size={15} />
                          Process
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {dialog === "form" && (
        <Dialog
          wide
          title={selectedId ? `Edit ${poNumber}` : "New purchase order"}
          subtitle="Only draft POs are editable. Sending never affects inventory."
          onClose={close}
          footer={
            <button
              type="button"
              className="primary-action"
              disabled={!valid}
              onClick={save}
            >
              {selectedId ? "Save draft" : "Create draft"}
            </button>
          }
        >
          <div className="inward-dialog-content">
            <div className="form-grid">
              <label>
                Supplier
                <select
                  data-dialog-initial-focus
                  aria-label="PO supplier"
                  value={supplierId}
                  onChange={(event) =>
                    setSupplierId(Number(event.target.value))
                  }
                >
                  <option value={0}>Select active supplier</option>
                  {state.suppliers
                    .filter((supplier) => supplier.status === "Active")
                    .map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                PO number
                <input
                  aria-label="PO number"
                  value={poNumber}
                  onChange={(event) => setPoNumber(event.target.value)}
                />
              </label>
              <label>
                Order date
                <input
                  aria-label="PO order date"
                  type="date"
                  value={orderDate}
                  onChange={(event) => setOrderDate(event.target.value)}
                />
              </label>
              <label>
                Notes
                <input
                  aria-label="PO notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
            </div>
            <section>
              <div className="receipt-lines-heading">
                <h4>Order lines</h4>
                <button
                  type="button"
                  onClick={() =>
                    state.inventory[0] &&
                    setLines((current) => [
                      ...current,
                      {
                        key: crypto.randomUUID(),
                        item_id: state.inventory[0].id,
                        ordered_qty: 1,
                        unit_cost: 0,
                        discount: 0,
                        gst_rate: 0,
                      },
                    ])
                  }
                >
                  Add line
                </button>
              </div>
              {lines.map((line, index) => (
                <div className="receipt-line-row" key={line.key}>
                  <InventoryPicker
                    inventory={state.inventory}
                    value={line.item_id}
                    onChange={(item_id) =>
                      setLines((current) =>
                        current.map((candidate) =>
                          candidate.key === line.key
                            ? { ...candidate, item_id }
                            : candidate,
                        ),
                      )
                    }
                    label={`PO line ${index + 1} item`}
                  />
                  <label>
                    Qty
                    <input
                      aria-label={`PO line ${index + 1} quantity`}
                      type="number"
                      min="0.01"
                      value={line.ordered_qty}
                      onChange={(event) =>
                        setLines((current) =>
                          current.map((candidate) =>
                            candidate.key === line.key
                              ? {
                                  ...candidate,
                                  ordered_qty: Number(event.target.value),
                                }
                              : candidate,
                          ),
                        )
                      }
                    />
                  </label>
                  <label>
                    Unit cost
                    <input
                      type="number"
                      min="0"
                      value={line.unit_cost}
                      onChange={(event) =>
                        setLines((current) =>
                          current.map((candidate) =>
                            candidate.key === line.key
                              ? {
                                  ...candidate,
                                  unit_cost: Number(event.target.value),
                                }
                              : candidate,
                          ),
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="danger-action"
                    onClick={() =>
                      setLines((current) =>
                        current.filter(
                          (candidate) => candidate.key !== line.key,
                        ),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </section>
          </div>
        </Dialog>
      )}
      {dialog === "view" && selected && (
        <Dialog
          wide
          title={selected.po_number}
          subtitle={`${supplierName(selected.supplier_id)} · ${selected.status}`}
          onClose={close}
          footer={
            <>
              {selected.status === "Draft" && (
                <>
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => openEdit(selected)}
                  >
                    Edit draft
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      mutate((db) =>
                        setPurchaseOrderStatusForActor(
                          db,
                          selected.id,
                          actor.id,
                          "send",
                        ),
                      )
                    }
                  >
                    Send saved PO
                  </button>
                </>
              )}
              {[
                "Draft",
                "Sent",
                "Partially Received",
                "Ready to Close",
              ].includes(selected.status) && (
                <button
                  type="button"
                  className="danger-action"
                  onClick={() =>
                    mutate((db) =>
                      setPurchaseOrderStatusForActor(
                        db,
                        selected.id,
                        actor.id,
                        "cancel",
                      ),
                    )
                  }
                >
                  Cancel PO
                </button>
              )}
              {["Sent", "Partially Received", "Ready to Close"].includes(
                selected.status,
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    mutate((db) =>
                      setPurchaseOrderStatusForActor(
                        db,
                        selected.id,
                        actor.id,
                        "close",
                      ),
                    )
                  }
                >
                  Close PO
                </button>
              )}
            </>
          }
        >
          <div className="inward-dialog-content">
            <p>
              <strong>Order vs received:</strong> {totalOrdered} ordered ·{" "}
              {totalReceived} received · {totalOrdered - totalReceived}{" "}
              remaining · {money(receivedValue)} received value
            </p>
            <p className="muted">
              Shortages and excesses are flags only; unlinked/manual receipts
              remain valid and do not alter this reconciliation.
            </p>
            <div className="table-wrap">
              <table aria-label="Purchase order reconciliation">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Ordered</th>
                    <th>Received</th>
                    <th>Received value</th>
                    <th>Remaining</th>
                    <th>Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLines.map((line) => {
                    const received = receivedFor(line);
                    const item = state.inventory.find(
                      (candidate) => candidate.id === line.item_id,
                    );
                    return (
                      <tr key={line.id}>
                        <td>
                          {item?.sku} · {item?.name}
                        </td>
                        <td>{line.ordered_qty}</td>
                        <td>{received}</td>
                        <td>{money(received * line.unit_cost)}</td>
                        <td>{Math.max(0, line.ordered_qty - received)}</td>
                        <td>{received - line.ordered_qty}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <h4>Linked stock inward history</h4>
            {state.stock_inwards.filter(
              (inward) => inward.purchase_order_id === selected.id,
            ).length ? (
              <ul>
                {state.stock_inwards
                  .filter((inward) => inward.purchase_order_id === selected.id)
                  .map((inward) => (
                    <li key={inward.id}>
                      {inward.received_at}: {inward.qty}{" "}
                      {
                        state.inventory.find(
                          (item) => item.id === inward.item_id,
                        )?.unit
                      }{" "}
                      · {inward.note}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="empty-state">No linked receipts yet.</p>
            )}
            {selected.status === "Cancelled" &&
              totalReceived < totalOrdered && (
                <p className="error-text">
                  Outstanding balance cancelled: {totalOrdered - totalReceived}{" "}
                  not received.
                </p>
              )}
          </div>
        </Dialog>
      )}
    </section>
  );
}

function LegacyInwardPurchasesWorkspace({
  state,
  actor,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [composerOpen, setComposerOpen] = useState(false);
  const [supplierId, setSupplierId] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [poNumber, setPoNumber] = useState("");
  const [lines, setLines] = useState<PurchaseFormLine[]>(() =>
    state.inventory[0]
      ? [
          {
            key: crypto.randomUUID(),
            item_id: state.inventory[0].id,
            received_qty: 1,
            unit_cost: 0,
            discount: 0,
            gst_rate: 0,
          },
        ]
      : [],
  );
  const [attachments, setAttachments] = useState<
    InwardPurchaseAttachmentInput[]
  >([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [revisionReason, setRevisionReason] = useState("");
  const selected = state.inward_purchases.find(
    (purchase) => purchase.id === selectedId,
  );
  const selectedLines = selected
    ? state.inward_purchase_lines.filter(
        (line) => line.purchase_id === selected.id,
      )
    : [];
  const selectedAttachments = selected
    ? state.inward_purchase_attachments.filter(
        (attachment) => attachment.purchase_id === selected.id,
      )
    : [];

  useEffect(() => {
    if (!selected) return;
    setSupplierId(selected.supplier_id ?? 0);
    setInvoiceNo(selected.supplier_invoice_no);
    setInvoiceDate(
      selected.invoice_date || new Date().toISOString().slice(0, 10),
    );
    setPoNumber(selected.po_number ?? "");
    setLines(
      selectedLines.map((line) => ({
        key: String(line.id),
        item_id: line.item_id,
        received_qty: line.received_qty,
        unit_cost: line.unit_cost,
        discount: line.discount,
        gst_rate: line.gst_rate,
      })),
    );
    setAttachments([]);
    setRevisionReason("");
    // Selected records are intentionally copied into editable draft state only when selection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const reset = () => {
    setSelectedId(undefined);
    setComposerOpen(true);
    setSupplierId(0);
    setInvoiceNo("");
    setInvoiceDate(new Date().toISOString().slice(0, 10));
    setPoNumber("");
    setLines(
      state.inventory[0]
        ? [
            {
              key: crypto.randomUUID(),
              item_id: state.inventory[0].id,
              received_qty: 1,
              unit_cost: 0,
              discount: 0,
              gst_rate: 0,
            },
          ]
        : [],
    );
    setAttachments([]);
    setRevisionReason("");
  };
  const draftInput = () => ({
    supplier_id: supplierId || undefined,
    supplier_invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    po_number: poNumber,
    lines: lines.map(({ key: _key, ...line }) => line),
    attachments,
  });
  const saveDraft = () => {
    let newId = selectedId;
    if (
      mutate((db) => {
        if (selectedId)
          updateInwardPurchaseDraftForActor(
            db,
            selectedId,
            actor.id,
            draftInput(),
          );
        else newId = createInwardPurchaseDraft(db, actor.id, draftInput());
      })
    )
      setSelectedId(newId);
  };
  const addLine = () => {
    if (state.inventory[0])
      setLines((current) => [
        ...current,
        {
          key: crypto.randomUUID(),
          item_id: state.inventory[0].id,
          received_qty: 1,
          unit_cost: 0,
          discount: 0,
          gst_rate: 0,
        },
      ]);
  };
  const updateLine = (key: string, patch: Partial<InwardPurchaseLineInput>) =>
    setLines((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  const selectFile = async (file?: File) => {
    if (!file) return;
    if (
      !(file.type === "application/pdf" || file.type === "image/jpeg") ||
      file.size > 10 * 1024 * 1024
    ) {
      window.alert("Use a PDF or JPG invoice scan no larger than 10 MB.");
      return;
    }
    const document_url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setAttachments((current) => [
      ...current,
      {
        original_name: file.name,
        mime_type: file.type,
        byte_size: file.size,
        document_url,
      },
    ]);
  };
  const supplierName = (id: number) =>
    state.suppliers.find((supplier) => supplier.id === id)?.name ??
    "Unknown supplier";
  const filtered = state.inward_purchases.filter(
    (purchase) =>
      (status === "ALL" || purchase.status === status) &&
      (!search.trim() ||
        normalizeSearch(
          `${supplierName(purchase.supplier_id)} ${purchase.supplier_invoice_no} ${purchase.po_number}`,
        ).includes(normalizeSearch(search))),
  );
  const editable = !selected || selected.status === "Draft";
  const total = lines.reduce((sum, line) => {
    const base = line.received_qty * line.unit_cost - (line.discount ?? 0);
    return sum + base * (1 + (line.gst_rate ?? 0) / 100);
  }, 0);
  const projectedQuantity = (itemId: number) =>
    (state.inventory.find((item) => item.id === itemId)?.stock_qty ?? 0) +
    lines
      .filter((line) => line.item_id === itemId)
      .reduce(
        (sum, line) =>
          sum + (Number.isFinite(line.received_qty) ? line.received_qty : 0),
        0,
      );
  const activeSupplier =
    state.suppliers.find((supplier) => supplier.id === supplierId)?.status ===
    "Active";
  const validDate =
    Boolean(invoiceDate) &&
    !Number.isNaN(new Date(`${invoiceDate}T00:00:00`).getTime());
  const validLines =
    lines.length > 0 &&
    lines.every(
      (line) =>
        state.inventory.some((item) => item.id === line.item_id) &&
        line.received_qty > 0 &&
        line.unit_cost >= 0 &&
        (line.discount ?? 0) >= 0 &&
        (line.gst_rate ?? 0) >= 0 &&
        (line.gst_rate ?? 0) <= 100,
    );
  const hasScan = selectedAttachments.length + attachments.length > 0;
  const ready =
    activeSupplier &&
    Boolean(invoiceNo.trim()) &&
    validDate &&
    validLines &&
    hasScan;
  const lineTotal = (line: PurchaseFormLine) => {
    const base = line.received_qty * line.unit_cost - (line.discount ?? 0);
    return base * (1 + (line.gst_rate ?? 0) / 100);
  };

  return (
    <section
      className={`workspace two-panel inward-workspace${composerOpen ? " inward-composer-open" : ""}`}
    >
      <div className="desk-panel store-list-page inward-register">
        <PanelTitle
          icon={<ReceiptText />}
          title="Inward Purchases"
          subtitle="Invoice-based goods receipts and item purchase history"
        />
        <div className="store-filter-grid">
          <label className="list-search">
            Search
            <input
              aria-label="Search inward purchases"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Supplier, invoice or PO"
            />
          </label>
          <label>
            Status
            <select
              aria-label="Inward purchase status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option>Draft</option>
              <option>Submitted</option>
            </select>
          </label>
          <ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
        </div>
        <div className="action-row">
          <button className="primary-action" onClick={reset}>
            <Plus size={16} /> New inward purchase
          </button>
          <ListExportControls
            report={{
              title: "Inward Purchases",
              filters: activeFilterSummary({ Search: search, Status: status }),
              columns: [
                {
                  header: "Invoice date",
                  value: (row: InwardPurchase) => row.invoice_date,
                },
                {
                  header: "Supplier",
                  value: (row: InwardPurchase) => supplierName(row.supplier_id),
                },
                {
                  header: "Invoice",
                  value: (row: InwardPurchase) => row.supplier_invoice_no,
                },
                {
                  header: "Status",
                  value: (row: InwardPurchase) => row.status,
                },
                { header: "Total", value: (row: InwardPurchase) => row.total },
              ],
              rows: filtered,
            }}
          />
        </div>
        <div className="table-wrap">
          <table aria-label="Inward purchase register">
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>Invoice</th>
                <th>PO</th>
                <th>Total</th>
                <th>Status</th>
                <th>Lines</th>
                <th>Scan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((purchase) => {
                const attachment = state.inward_purchase_attachments.find(
                  (item) => item.purchase_id === purchase.id,
                );
                const lineCount = state.inward_purchase_lines.filter(
                  (line) => line.purchase_id === purchase.id,
                ).length;
                return (
                  <tr
                    key={purchase.id}
                    className={`clickable-row${purchase.id === selectedId ? " selected-register-row" : ""}`}
                    aria-selected={purchase.id === selectedId}
                    onClick={() => {
                      setSelectedId(purchase.id);
                      setComposerOpen(true);
                    }}
                  >
                    <td>{purchase.invoice_date || "—"}</td>
                    <td>{supplierName(purchase.supplier_id)}</td>
                    <td>{purchase.supplier_invoice_no || "—"}</td>
                    <td>{purchase.po_number || "—"}</td>
                    <td>{money(purchase.total)}</td>
                    <td>
                      <span className="status-badge">{purchase.status}</span>
                    </td>
                    <td>{lineCount}</td>
                    <td>
                      {attachment ? (
                        <a
                          href={attachment.document_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <form
        className="desk-panel inward-composer"
        onSubmit={(event) => {
          event.preventDefault();
          saveDraft();
        }}
      >
        <button
          type="button"
          className="inward-back"
          onClick={() => setComposerOpen(false)}
        >
          ← Back to register
        </button>
        <PanelTitle
          icon={<PackageCheck />}
          title={selected ? `Receipt #${selected.id}` : "New receipt draft"}
          subtitle={
            selected?.status === "Submitted"
              ? "Posted receipt is immutable; Admin corrections append a revision."
              : "Save a draft, attach the supplier invoice, then submit."
          }
        />
        {selected?.status === "Submitted" ? (
          <div className="submitted-receipt">
            <section>
              <h4>Receipt details</h4>
              <dl>
                <div>
                  <dt>Supplier</dt>
                  <dd>{supplierName(supplierId)}</dd>
                </div>
                <div>
                  <dt>Invoice</dt>
                  <dd>{invoiceNo}</dd>
                </div>
                <div>
                  <dt>Invoice date</dt>
                  <dd>{invoiceDate}</dd>
                </div>
                <div>
                  <dt>PO</dt>
                  <dd>{poNumber || "—"}</dd>
                </div>
                <div>
                  <dt>Posting status</dt>
                  <dd>
                    <span className="status-badge">Submitted</span>
                  </dd>
                </div>
              </dl>
            </section>
            <section>
              <h4>Posted lines</h4>
              <div className="receipt-line-grid readonly">
                {lines.map((line) => {
                  const item = state.inventory.find(
                    (candidate) => candidate.id === line.item_id,
                  );
                  return (
                    <div className="receipt-line-row" key={line.key}>
                      <span>
                        {item?.sku} · {item?.name}
                      </span>
                      <span>
                        {line.received_qty} {item?.unit}
                      </span>
                      <span>{money(line.unit_cost)}</span>
                      <strong>{money(lineTotal(line))}</strong>
                    </div>
                  );
                })}
              </div>
              <p className="receipt-total">Posted total: {money(total)}</p>
            </section>
            <section>
              <h4>Invoice scans</h4>
              {selectedAttachments.map((attachment) => (
                <AttachmentItem key={attachment.id} attachment={attachment} />
              ))}
            </section>
          </div>
        ) : (
          <>
            <section className="receipt-header">
              <h4>Receipt header</h4>
              <div className="form-grid">
                <label>
                  Supplier
                  <select
                    aria-label="Purchase supplier"
                    required
                    value={supplierId}
                    onChange={(event) =>
                      setSupplierId(Number(event.target.value))
                    }
                  >
                    <option value={0}>Select active supplier</option>
                    {state.suppliers
                      .filter(
                        (supplier) =>
                          supplier.status === "Active" ||
                          supplier.id === supplierId,
                      )
                      .map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                          {supplier.status === "On hold" ? " (On hold)" : ""}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Supplier invoice no.
                  <input
                    aria-label="Supplier invoice number"
                    value={invoiceNo}
                    onChange={(event) => setInvoiceNo(event.target.value)}
                  />
                </label>
                <label>
                  Invoice date
                  <input
                    aria-label="Invoice date"
                    type="date"
                    value={invoiceDate}
                    onChange={(event) => setInvoiceDate(event.target.value)}
                  />
                </label>
                <label>
                  PO number (optional)
                  <input
                    aria-label="PO number"
                    value={poNumber}
                    onChange={(event) => setPoNumber(event.target.value)}
                  />
                </label>
              </div>
            </section>
            <section>
              <div className="receipt-lines-heading">
                <h4>Receipt lines</h4>
                <button type="button" onClick={addLine}>
                  Add line
                </button>
              </div>
              <div className="receipt-line-grid">
                {lines.map((line, index) => {
                  const item = state.inventory.find(
                    (candidate) => candidate.id === line.item_id,
                  );
                  return (
                    <div className="receipt-line-row" key={line.key}>
                      <InventoryPicker
                        inventory={state.inventory}
                        value={line.item_id}
                        onChange={(item_id) =>
                          updateLine(line.key, { item_id })
                        }
                        label={`Receipt line ${index + 1} item`}
                      />
                      <small>
                        {item?.sku} · {item?.unit} · stock {item?.stock_qty} →{" "}
                        {projectedQuantity(line.item_id)} {item?.unit}
                      </small>
                      <label>
                        Qty
                        <input
                          aria-label={`Receipt line ${index + 1} quantity`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={line.received_qty}
                          onChange={(event) =>
                            updateLine(line.key, {
                              received_qty: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label>
                        Pre-GST cost
                        <input
                          aria-label={`Receipt line ${index + 1} unit cost`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unit_cost}
                          onChange={(event) =>
                            updateLine(line.key, {
                              unit_cost: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label>
                        Discount
                        <input
                          aria-label={`Receipt line ${index + 1} discount`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.discount}
                          onChange={(event) =>
                            updateLine(line.key, {
                              discount: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label>
                        GST %
                        <input
                          aria-label={`Receipt line ${index + 1} GST`}
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={line.gst_rate}
                          onChange={(event) =>
                            updateLine(line.key, {
                              gst_rate: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <strong>{money(lineTotal(line))}</strong>
                      <button
                        type="button"
                        className="danger-action"
                        aria-label={`Remove receipt line ${index + 1}`}
                        onClick={() =>
                          setLines((current) =>
                            current.filter((item) => item.key !== line.key),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="receipt-attachments">
              <h4>Invoice scan</h4>
              <label className="file-upload-button">
                Attach invoice scan (PDF/JPG, max 10 MB)
                <input
                  aria-label="Invoice scan"
                  type="file"
                  accept="application/pdf,image/jpeg"
                  onChange={(event) => {
                    void selectFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                  hidden
                />
              </label>
              {selectedAttachments.map((attachment) => (
                <AttachmentItem key={attachment.id} attachment={attachment} />
              ))}
              {attachments.map((attachment, index) => (
                <AttachmentItem
                  key={`${attachment.original_name}-${index}`}
                  attachment={attachment}
                  onRemove={() =>
                    setAttachments((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                />
              ))}
            </section>
          </>
        )}
        {selected?.status === "Submitted" && actor.role === "admin" && (
          <section className="receipt-correction">
            <h4>Admin correction</h4>
            <p>
              Post only the revised receipt quantities; WorkshopOS records the
              delta and reason.
            </p>
            <label>
              Correction reason
              <input
                aria-label="Correction reason"
                value={revisionReason}
                onChange={(event) => setRevisionReason(event.target.value)}
                placeholder="Required reason for stock delta"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                mutate((db) =>
                  reviseInwardPurchaseForActor(db, selected.id, actor.id, {
                    reason: revisionReason,
                    lines: lines.map(({ key: _key, ...line }) => line),
                  }),
                )
              }
            >
              Post revision delta
            </button>
          </section>
        )}
        {editable && (
          <div className="receipt-status-bar" aria-label="Receipt readiness">
            <div>
              <strong>{money(total)}</strong>
              <span>
                {lines.length} line{lines.length === 1 ? "" : "s"} ·{" "}
                {hasScan ? "scan attached" : "scan needed"}
              </span>
            </div>
            <ul>
              <li className={activeSupplier ? "ready" : ""}>Active supplier</li>
              <li className={invoiceNo.trim() ? "ready" : ""}>
                Invoice number
              </li>
              <li className={validDate ? "ready" : ""}>Valid date</li>
              <li className={validLines ? "ready" : ""}>Valid lines</li>
              <li className={hasScan ? "ready" : ""}>Invoice scan</li>
            </ul>
            <div className="action-row">
              <button className="primary-action">Save draft</button>
              {selected && (
                <button
                  type="button"
                  className="primary-action"
                  disabled={!ready}
                  onClick={() =>
                    mutate((db) =>
                      submitInwardPurchaseForActor(db, selected.id, actor.id),
                    )
                  }
                >
                  Submit receipt
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </section>
  );
}

function InwardPurchasesWorkspace({
  state,
  actor,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  const [dialog, setDialog] = useState<
    "create" | "view" | "edit" | "receive" | "approve"
  >();
  const [recordId, setRecordId] = useState<number>();
  const [supplierId, setSupplierId] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [poNumber, setPoNumber] = useState("");
  const [lines, setLines] = useState<PurchaseFormLine[]>([]);
  const [attachments, setAttachments] = useState<
    InwardPurchaseAttachmentInput[]
  >([]);
  const [revisionReason, setRevisionReason] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const record = state.inward_purchases.find(
    (purchase) => purchase.id === recordId,
  );
  const recordLines = record
    ? state.inward_purchase_lines.filter(
        (line) => line.purchase_id === record.id,
      )
    : [];
  const recordAttachments = record
    ? state.inward_purchase_attachments.filter(
        (attachment) => attachment.purchase_id === record.id,
      )
    : [];
  const supplierName = (id: number) =>
    state.suppliers.find((supplier) => supplier.id === id)?.name ??
    "Unknown supplier";
  const freshLine = (): PurchaseFormLine | undefined =>
    state.inventory[0] && {
      key: crypto.randomUUID(),
      item_id: state.inventory[0].id,
      received_qty: 1,
      unit_cost: 0,
      discount: 0,
      gst_rate: 0,
    };
  const open = (next: NonNullable<typeof dialog>, id?: number) => {
    setRecordId(id);
    setDialog(next);
    setError("");
    setAttachments([]);
    setRevisionReason("");
  };
  const close = () => {
    setDialog(undefined);
    setRecordId(undefined);
  };

  useEffect(() => {
    if (!dialog) return;
    if (!record) {
      const line = freshLine();
      setSupplierId(0);
      setInvoiceNo("");
      setInvoiceDate(new Date().toISOString().slice(0, 10));
      setPoNumber("");
      setLines(line ? [line] : []);
      return;
    }
    setSupplierId(record.supplier_id ?? 0);
    setInvoiceNo(record.supplier_invoice_no);
    setInvoiceDate(
      record.invoice_date || new Date().toISOString().slice(0, 10),
    );
    setPoNumber(record.po_number ?? "");
    setLines(
      recordLines.map((line) => ({
        key: String(line.id),
        purchase_order_line_id: line.purchase_order_line_id ?? undefined,
        item_id: line.item_id,
        received_qty: line.received_qty,
        unit_cost: line.unit_cost,
        discount: line.discount,
        gst_rate: line.gst_rate,
      })),
    );
    // The dialog intentionally snapshots a record into form state on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, recordId]);

  const updateLine = (key: string, patch: Partial<InwardPurchaseLineInput>) =>
    setLines((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  const draftInput = () => ({
    supplier_id: supplierId || undefined,
    supplier_invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    po_number: poNumber,
    lines: lines.map(({ key: _key, ...line }) => line),
    attachments,
  });
  const lineTotal = (line: PurchaseFormLine) =>
    (line.received_qty * line.unit_cost - (line.discount ?? 0)) *
    (1 + (line.gst_rate ?? 0) / 100);
  const total = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const activeSupplier =
    state.suppliers.find((supplier) => supplier.id === supplierId)?.status ===
    "Active";
  const validLines =
    lines.length > 0 &&
    lines.every(
      (line) =>
        state.inventory.some((item) => item.id === line.item_id) &&
        line.received_qty > 0 &&
        line.unit_cost >= 0 &&
        (line.discount ?? 0) >= 0 &&
        (line.gst_rate ?? 0) >= 0 &&
        (line.gst_rate ?? 0) <= 100,
    );
  const validDate =
    Boolean(invoiceDate) &&
    !Number.isNaN(new Date(`${invoiceDate}T00:00:00`).getTime());
  const hasScan = recordAttachments.length + attachments.length > 0;
  const filtered = state.inward_purchases.filter(
    (purchase) =>
      (status === "ALL" || purchase.status === status) &&
      (!search.trim() ||
        normalizeSearch(
          `${purchase.id} ${supplierName(purchase.supplier_id)} ${purchase.supplier_invoice_no} ${purchase.po_number}`,
        ).includes(normalizeSearch(search))),
  );
  const selectFile = async (file?: File) => {
    if (!file) return;
    if (
      !(file.type === "application/pdf" || file.type === "image/jpeg") ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Use a PDF or JPG invoice scan no larger than 10 MB.");
      return;
    }
    const document_url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setAttachments((current) => [
      ...current,
      {
        original_name: file.name,
        mime_type: file.type,
        byte_size: file.size,
        document_url,
      },
    ]);
  };
  const saveDraft = () => {
    let newId = recordId;
    if (
      mutate((db) => {
        if (recordId)
          updateInwardPurchaseDraftForActor(
            db,
            recordId,
            actor.id,
            draftInput(),
          );
        else newId = createInwardPurchaseDraft(db, actor.id, draftInput());
      }, setError)
    ) {
      setRecordId(newId);
      setDialog("edit");
    }
  };
  const sendForApproval = () => {
    if (!recordId) {
      setError("Save the purchase draft before sending it for PO approval.");
      return;
    }
    if (
      mutate(
        (db) => sendInwardPurchaseForPoApprovalForActor(db, recordId, actor.id),
        setError,
      )
    )
      close();
  };
  const receive = () => {
    if (
      recordId &&
      mutate(
        (db) =>
          receiveAndPostInwardPurchaseForActor(
            db,
            recordId,
            actor.id,
            draftInput(),
          ),
        setError,
      )
    )
      close();
  };
  const approve = () => {
    if (
      recordId &&
      mutate(
        (db) => approveInwardPurchaseForActor(db, recordId, actor.id),
        setError,
      )
    )
      close();
  };
  const revise = () => {
    if (
      recordId &&
      mutate(
        (db) =>
          reviseInwardPurchaseForActor(db, recordId, actor.id, {
            reason: revisionReason,
            lines: lines.map(
              ({ key: _key, purchase_order_line_id: _poLine, ...line }) => line,
            ),
          }),
        setError,
      )
    )
      close();
  };
  const editorMode = dialog === "create" || dialog === "edit";
  const receiveMode = dialog === "receive";
  const receivedMode =
    record?.status === "Received" || record?.status === "Submitted";
  const dialogTitle =
    dialog === "create"
      ? "Add purchase record"
      : dialog === "approve"
        ? "Approve purchase order"
        : receiveMode
          ? `Receive & Post · ${record?.po_number ?? `Purchase #${record?.id}`}`
          : editorMode
            ? `Edit purchase record · #${record?.id ?? "new"}`
            : `Purchase record · #${record?.id}`;
  const dialogFooter =
    dialog === "approve" ? (
      actor.role === "admin" ? (
        <button type="button" className="primary-action" onClick={approve}>
          Approve PO
        </button>
      ) : undefined
    ) : editorMode ? (
      <>
        <button type="button" className="secondary-action" onClick={saveDraft}>
          Save Draft
        </button>
        {record && (
          <button
            type="button"
            className="primary-action"
            onClick={sendForApproval}
          >
            Send for PO
          </button>
        )}
      </>
    ) : receiveMode ? (
      <button type="button" className="primary-action" onClick={receive}>
        Receive & Post
      </button>
    ) : receivedMode && actor.role === "admin" ? (
      <button type="button" className="danger-action" onClick={revise}>
        Post revision delta
      </button>
    ) : undefined;

  return (
    <section className="workspace single-panel inward-purchases-workspace">
      <div className="desk-panel store-list-page inward-register">
        <div className="action-row">
          <PanelTitle
            icon={<ReceiptText />}
            title="Inward Purchases"
            subtitle="Invoice-based goods receipts and item purchase history"
          />
          <button
            type="button"
            className="primary-action"
            onClick={() => open("create")}
          >
            <Plus size={16} /> Add purchase record
          </button>
        </div>
        <div className="store-filter-grid register-filter-toolbar">
          <label className="list-search">
            Search
            <input
              aria-label="Search inward purchases"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Supplier, invoice or PO"
            />
          </label>
          <label>
            Status
            <select
              aria-label="Inward purchase status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option>Draft</option>
              <option>Awaiting PO Approval</option>
              <option>Approved</option>
              <option>Received</option>
            </select>
          </label>
          <ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
        </div>
        <div className="action-row register-export-actions">
          <ListExportControls
            report={{
              title: "Inward Purchases",
              filters: activeFilterSummary({ Search: search, Status: status }),
              columns: [
                { header: "Record", value: (row: InwardPurchase) => row.id },
                { header: "PO", value: (row: InwardPurchase) => row.po_number },
                {
                  header: "Date",
                  value: (row: InwardPurchase) => row.invoice_date,
                },
                {
                  header: "Supplier",
                  value: (row: InwardPurchase) => supplierName(row.supplier_id),
                },
                {
                  header: "Invoice",
                  value: (row: InwardPurchase) => row.supplier_invoice_no,
                },
                {
                  header: "Status",
                  value: (row: InwardPurchase) => row.status,
                },
                { header: "Total", value: (row: InwardPurchase) => row.total },
              ],
              rows: filtered,
            }}
          />
        </div>
        <div className="table-wrap">
          <table aria-label="Inward purchase register">
            <thead>
              <tr>
                <th>Record / PO</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Invoice</th>
                <th>Lines</th>
                <th>Total</th>
                <th>Status</th>
                <th>Scan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((purchase) => {
                const attachment = state.inward_purchase_attachments.find(
                  (item) => item.purchase_id === purchase.id,
                );
                const count = state.inward_purchase_lines.filter(
                  (line) => line.purchase_id === purchase.id,
                ).length;
                const reviewMode =
                  purchase.status === "Awaiting PO Approval"
                    ? "approve"
                    : purchase.status === "Draft"
                      ? "edit"
                      : "view";
                return (
                  <tr
                    key={purchase.id}
                    className="clickable-row"
                    onClick={() =>
                      open(
                        purchase.status === "Awaiting PO Approval"
                          ? "approve"
                          : "view",
                        purchase.id,
                      )
                    }
                  >
                    <td>
                      <strong>#{purchase.id}</strong>
                      <br />
                      <small>{purchase.po_number || "—"}</small>
                    </td>
                    <td>{purchase.invoice_date || "—"}</td>
                    <td>{supplierName(purchase.supplier_id)}</td>
                    <td>{purchase.supplier_invoice_no || "—"}</td>
                    <td>{count}</td>
                    <td>{money(purchase.total)}</td>
                    <td>
                      <span className="status-badge">
                        {purchase.status === "Submitted"
                          ? "Received"
                          : purchase.status}
                      </span>
                    </td>
                    <td>
                      {attachment ? (
                        <a
                          href={attachment.document_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div className="grid-actions">
                        <button
                          type="button"
                          className="grid-action"
                          onClick={(event) => {
                            event.stopPropagation();
                            open(reviewMode, purchase.id);
                          }}
                        >
                          {purchase.status === "Draft"
                            ? "Edit"
                            : purchase.status === "Awaiting PO Approval"
                              ? "Review"
                              : "View"}
                        </button>
                        {purchase.status === "Draft" && (
                          <button
                            type="button"
                            className="grid-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              open("edit", purchase.id);
                            }}
                          >
                            Send for PO
                          </button>
                        )}
                        {purchase.status === "Awaiting PO Approval" &&
                          actor.role === "admin" && (
                            <button
                              type="button"
                              className="grid-action"
                              onClick={(event) => {
                                event.stopPropagation();
                                open("approve", purchase.id);
                              }}
                            >
                              Approve
                            </button>
                          )}
                        {purchase.status === "Approved" && (
                          <button
                            type="button"
                            className="grid-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              open("receive", purchase.id);
                            }}
                          >
                            Receive & Post
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {dialog && (
        <Dialog
          wide
          title={dialogTitle}
          subtitle={
            dialog === "approve"
              ? "Review the immutable PO snapshot before authorizing it."
              : receivedMode
                ? "Posted receipt is read-only; Admin corrections append a revision."
                : receiveMode
                  ? "Record the actual received quantities, invoice details, and scan."
                  : "Save a draft, then submit its immutable PO snapshot for approval."
          }
          onClose={close}
          footer={dialogFooter}
        >
          <div className="inward-dialog-content">
            {dialog === "approve" ? (
              <PurchaseSnapshot
                record={record!}
                lines={lines}
                inventory={state.inventory}
                supplierName={supplierName}
              />
            ) : receivedMode && !receiveMode ? (
              <>
                <PurchaseSnapshot
                  record={record!}
                  lines={lines}
                  inventory={state.inventory}
                  supplierName={supplierName}
                  attachments={recordAttachments}
                />
                {actor.role === "admin" && (
                  <section className="receipt-correction">
                    <h4>Admin correction</h4>
                    <p>
                      Enter the corrected receipt quantities, then provide the
                      audit reason.
                    </p>
                    <ReceiptLines
                      lines={lines}
                      inventory={state.inventory}
                      editableQuantity
                      updateLine={updateLine}
                      lineTotal={lineTotal}
                    />
                    <label>
                      Correction reason
                      <input
                        data-dialog-initial-focus
                        aria-label="Correction reason"
                        value={revisionReason}
                        onChange={(event) =>
                          setRevisionReason(event.target.value)
                        }
                        required
                      />
                    </label>
                  </section>
                )}
              </>
            ) : (
              <>
                <section className="receipt-header">
                  <h4>{receiveMode ? "Receipt header" : "Purchase header"}</h4>
                  <div className="form-grid">
                    <label>
                      Supplier
                      {editorMode ? (
                        <select
                          data-dialog-initial-focus
                          aria-label="Purchase supplier"
                          value={supplierId}
                          onChange={(event) =>
                            setSupplierId(Number(event.target.value))
                          }
                        >
                          <option value={0}>Select active supplier</option>
                          {state.suppliers
                            .filter(
                              (supplier) =>
                                supplier.status === "Active" ||
                                supplier.id === supplierId,
                            )
                            .map((supplier) => (
                              <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <input readOnly value={supplierName(supplierId)} />
                      )}
                    </label>
                    <label>
                      Supplier invoice no.
                      <input
                        aria-label="Supplier invoice number"
                        value={invoiceNo}
                        readOnly={!editorMode && !receiveMode}
                        onChange={(event) => setInvoiceNo(event.target.value)}
                      />
                    </label>
                    <label>
                      Invoice date
                      <input
                        aria-label="Invoice date"
                        type="date"
                        value={invoiceDate}
                        readOnly={!editorMode && !receiveMode}
                        onChange={(event) => setInvoiceDate(event.target.value)}
                      />
                    </label>
                    {editorMode && (
                      <label>
                        PO number (optional)
                        <input
                          aria-label="PO number"
                          value={poNumber}
                          onChange={(event) => setPoNumber(event.target.value)}
                        />
                      </label>
                    )}
                  </div>
                </section>
                <section>
                  <div className="receipt-lines-heading">
                    <h4>
                      {receiveMode
                        ? "Actual received quantities"
                        : "Purchase lines"}
                    </h4>
                    {editorMode && (
                      <button
                        type="button"
                        onClick={() => {
                          const line = freshLine();
                          if (line) setLines((current) => [...current, line]);
                        }}
                      >
                        Add line
                      </button>
                    )}
                  </div>
                  <ReceiptLines
                    lines={lines}
                    inventory={state.inventory}
                    editable={editorMode}
                    editableQuantity={receiveMode}
                    updateLine={updateLine}
                    lineTotal={lineTotal}
                    onRemove={(key) =>
                      setLines((current) =>
                        current.filter((line) => line.key !== key),
                      )
                    }
                  />
                </section>
                {receiveMode && (
                  <section className="receipt-attachments">
                    <h4>Invoice scan</h4>
                    <label className="file-upload-button">
                      Attach invoice scan (PDF/JPG, max 10 MB)
                      <input
                        aria-label="Invoice scan"
                        type="file"
                        accept="application/pdf,image/jpeg"
                        onChange={(event) => {
                          void selectFile(event.target.files?.[0]);
                          event.target.value = "";
                        }}
                        hidden
                      />
                    </label>
                    {recordAttachments.map((attachment) => (
                      <AttachmentItem
                        key={attachment.id}
                        attachment={attachment}
                      />
                    ))}
                    {attachments.map((attachment, index) => (
                      <AttachmentItem
                        key={`${attachment.original_name}-${index}`}
                        attachment={attachment}
                        onRemove={() =>
                          setAttachments((current) =>
                            current.filter((_, item) => item !== index),
                          )
                        }
                      />
                    ))}
                  </section>
                )}
                <div
                  className="receipt-status-bar"
                  aria-label="Purchase readiness"
                >
                  <strong>{money(total)}</strong>
                  <span>
                    {editorMode
                      ? `${activeSupplier ? "Active supplier" : "Supplier needed"} · ${validLines ? "valid lines" : "valid lines needed"}`
                      : `${invoiceNo.trim() && validDate && validLines && hasScan ? "Ready to post" : "Invoice, date, quantities and scan are required"}`}
                  </span>
                </div>
              </>
            )}
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
          </div>
        </Dialog>
      )}
    </section>
  );
}

function ReceiptLines({
  lines,
  inventory,
  editable = false,
  editableQuantity = false,
  updateLine,
  lineTotal,
  onRemove,
}: {
  lines: PurchaseFormLine[];
  inventory: InventoryItem[];
  editable?: boolean;
  editableQuantity?: boolean;
  updateLine: (key: string, patch: Partial<InwardPurchaseLineInput>) => void;
  lineTotal: (line: PurchaseFormLine) => number;
  onRemove?: (key: string) => void;
}) {
  return (
    <div className="receipt-line-grid">
      {lines.map((line, index) => {
        const item = inventory.find(
          (candidate) => candidate.id === line.item_id,
        );
        return (
          <div className="receipt-line-row" key={line.key}>
            {editable ? (
              <InventoryPicker
                inventory={inventory}
                value={line.item_id}
                onChange={(item_id) => updateLine(line.key, { item_id })}
                label={`Receipt line ${index + 1} item`}
              />
            ) : (
              <span>
                {item?.sku} · {item?.name}
              </span>
            )}
            <small>{item?.unit}</small>
            <label>
              Qty
              <input
                aria-label={`Receipt line ${index + 1} quantity`}
                readOnly={!editable && !editableQuantity}
                type="number"
                min="0.01"
                step="0.01"
                value={line.received_qty}
                onChange={(event) =>
                  updateLine(line.key, {
                    received_qty: Number(event.target.value),
                  })
                }
              />
            </label>
            {editable ? (
              <>
                <label>
                  Pre-GST cost
                  <input
                    aria-label={`Receipt line ${index + 1} unit cost`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.unit_cost}
                    onChange={(event) =>
                      updateLine(line.key, {
                        unit_cost: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Discount
                  <input
                    aria-label={`Receipt line ${index + 1} discount`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.discount}
                    onChange={(event) =>
                      updateLine(line.key, {
                        discount: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  GST %
                  <input
                    aria-label={`Receipt line ${index + 1} GST`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={line.gst_rate}
                    onChange={(event) =>
                      updateLine(line.key, {
                        gst_rate: Number(event.target.value),
                      })
                    }
                  />
                </label>
              </>
            ) : (
              <>
                <span>{money(line.unit_cost)}</span>
                <span>{line.gst_rate}% GST</span>
              </>
            )}
            <strong>{money(lineTotal(line))}</strong>
            {editable && onRemove && (
              <button
                type="button"
                className="danger-action"
                aria-label={`Remove receipt line ${index + 1}`}
                onClick={() => onRemove(line.key)}
              >
                Remove
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PurchaseSnapshot({
  record,
  lines,
  inventory,
  supplierName,
  attachments = [],
}: {
  record: InwardPurchase;
  lines: PurchaseFormLine[];
  inventory: InventoryItem[];
  supplierName: (id: number) => string;
  attachments?: {
    id: number;
    original_name: string;
    mime_type: string;
    byte_size: number;
    document_url: string;
  }[];
}) {
  return (
    <div className="submitted-receipt">
      <section>
        <h4>Purchase details</h4>
        <dl>
          <div>
            <dt>Supplier</dt>
            <dd>{supplierName(record.supplier_id)}</dd>
          </div>
          <div>
            <dt>PO</dt>
            <dd>{record.po_number || "—"}</dd>
          </div>
          <div>
            <dt>Invoice</dt>
            <dd>{record.supplier_invoice_no || "—"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className="status-badge">
                {record.status === "Submitted" ? "Received" : record.status}
              </span>
            </dd>
          </div>
        </dl>
      </section>
      <section>
        <h4>Lines</h4>
        <ReceiptLines
          lines={lines}
          inventory={inventory}
          updateLine={() => undefined}
          lineTotal={(line) =>
            (line.received_qty * line.unit_cost - (line.discount ?? 0)) *
            (1 + (line.gst_rate ?? 0) / 100)
          }
        />
      </section>
      {attachments.length > 0 && (
        <section>
          <h4>Invoice scans</h4>
          {attachments.map((attachment) => (
            <AttachmentItem key={attachment.id} attachment={attachment} />
          ))}
        </section>
      )}
    </div>
  );
}

function AttachmentItem({
  attachment,
  onRemove,
}: {
  attachment: {
    original_name: string;
    mime_type: string;
    byte_size: number;
    document_url: string;
  };
  onRemove?: () => void;
}) {
  const size =
    attachment.byte_size >= 1024 * 1024
      ? `${(attachment.byte_size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(attachment.byte_size / 1024)} KB`;
  return (
    <div className="receipt-attachment">
      <span>
        <strong>{attachment.original_name}</strong>
        <small>
          {attachment.mime_type} · {size}
        </small>
      </span>
      <a href={attachment.document_url} target="_blank" rel="noreferrer">
        Open
      </a>
      {onRemove && (
        <button type="button" className="danger-action" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

function SupplierMasterWorkspace({
  state,
  actor,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const selected = state.suppliers.find(
    (supplier) => supplier.id === selectedId,
  );
  const [draft, setDraft] = useState({
    name: "",
    contact_name: "",
    phone: "",
    email: "",
    gstin: "",
    status: "Active" as Supplier["status"],
  });
  useEffect(() => {
    if (selected)
      setDraft({
        name: selected.name,
        contact_name: selected.contact_name,
        phone: selected.phone,
        email: selected.email,
        gstin: selected.gstin,
        status: selected.status,
      });
  }, [selected]);
  const reset = () => {
    setSelectedId(undefined);
    setDraft({
      name: "",
      contact_name: "",
      phone: "",
      email: "",
      gstin: "",
      status: "Active",
    });
  };
  const closeDialog = () => {
    setDialogOpen(false);
    reset();
  };
  const openNew = () => {
    reset();
    setDialogOpen(true);
  };
  const openEdit = (supplier: Supplier) => {
    setSelectedId(supplier.id);
    setDialogOpen(true);
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const saved = selected
      ? mutate((db) => updateSupplierForActor(db, selected.id, actor.id, draft))
      : mutate((db) => {
          createSupplierForActor(db, actor.id, draft);
        });
    if (saved) closeDialog();
  };
  return (
    <section className="workspace single-panel">
      <div className="desk-panel">
        <div className="panel-actions">
          <PanelTitle
            icon={<UserRound />}
            title="Supplier Master"
            subtitle="Admin-managed suppliers; only active suppliers are available on goods receipts."
          />
          <button type="button" className="primary-action" onClick={openNew}>
            <Plus size={16} />
            Add new supplier
          </button>
        </div>
        <div className="table-wrap">
          <table aria-label="Supplier master">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>GSTIN</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact_name || supplier.phone || "—"}</td>
                  <td>{supplier.gstin || "—"}</td>
                  <td>{supplier.status}</td>
                  <td>
                    <div className="grid-actions">
                      <button
                        type="button"
                        className="grid-action"
                        onClick={() => openEdit(supplier)}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {dialogOpen && (
        <Dialog
          title={selected ? "Edit supplier" : "Add supplier"}
          subtitle="Hold and archive preserve purchase history."
          onClose={closeDialog}
          footer={
            <>
              {selected && (
                <button
                  type="button"
                  className="danger-action"
                  onClick={() => {
                    if (
                      mutate((db) =>
                        archiveSupplierForActor(db, selected.id, actor.id),
                      )
                    )
                      closeDialog();
                  }}
                >
                  Archive supplier
                </button>
              )}
              <button
                type="submit"
                form="supplier-form"
                className="primary-action"
              >
                Save supplier
              </button>
            </>
          }
        >
          <form id="supplier-form" onSubmit={save}>
            <label>
              Name
              <input
                required
                data-dialog-initial-focus
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              Contact name
              <input
                value={draft.contact_name}
                onChange={(event) =>
                  setDraft({ ...draft, contact_name: event.target.value })
                }
              />
            </label>
            <label>
              Phone
              <input
                value={draft.phone}
                onChange={(event) =>
                  setDraft({ ...draft, phone: event.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
            </label>
            <label>
              GSTIN
              <input
                value={draft.gstin}
                onChange={(event) =>
                  setDraft({ ...draft, gstin: event.target.value })
                }
              />
            </label>
            <label>
              Status
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    status: event.target.value as Supplier["status"],
                  })
                }
              >
                <option>Active</option>
                <option>On hold</option>
              </select>
            </label>
          </form>
        </Dialog>
      )}
    </section>
  );
}

function StockMovementHistory({ state }: { state: WorkshopState }) {
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("ALL");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const uniqueMovements = Array.from(
    new Map(
      state.jobs
        .flatMap((view) => view.material_movements)
        .map((movement) => [movement.id, movement]),
    ).values(),
  );
  const filtered = uniqueMovements.filter((movement) => {
    const item = state.inventory.find((row) => row.id === movement.item_id);
    const job = state.jobs.find((view) => view.job.id === movement.job_card_id);
    const matchesSearch =
      !normalizeSearch(search) ||
      normalizeSearch(
        `${item?.sku ?? ""} ${item?.name ?? ""} ${job?.job.job_no ?? ""} ${movement.note}`,
      ).includes(normalizeSearch(search));
    return (
      matchesSearch &&
      (direction === "ALL" || movement.direction === direction) &&
      (!date || movement.created_at.slice(0, 10) === date) &&
      (!month || movement.created_at.slice(0, 7) === month)
    );
  });
  const paged = paginate(filtered, page, pageSize);
  const movementMonths = Array.from(
    new Set(
      uniqueMovements
        .map((movement) => movement.created_at.slice(0, 7))
        .filter((value) => /^\d{4}-\d{2}$/.test(value)),
    ),
  ).sort((left, right) => right.localeCompare(left));
  const clearFilters = () => {
    setSearch("");
    setDate("");
    setMonth("");
    setDirection("ALL");
    setPage(1);
  };
  const columns: ExportColumn<MaterialMovement>[] = [
    { header: "Date", value: (row) => row.created_at },
    {
      header: "Item",
      value: (row) =>
        state.inventory.find((item) => item.id === row.item_id)?.name ??
        `Item ${row.item_id}`,
    },
    {
      header: "Job",
      value: (row) =>
        state.jobs.find((view) => view.job.id === row.job_card_id)?.job
          .job_no ?? "General stock",
    },
    { header: "Direction", value: (row) => row.direction },
    { header: "Quantity", value: (row) => row.qty },
    { header: "Note", value: (row) => row.note },
  ];
  return (
    <div className="desk-panel store-list-page" role="tabpanel">
      <div className="store-filter-grid stock-filter-grid contextual-filter-bar">
        <label className="list-search">
          Quick search
          <input
            aria-label="Search stock movements"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Item, SKU, job or note"
          />
        </label>
        <label>
          Date
          <input
            aria-label="Stock movement date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Month-Year
          <select
            aria-label="Stock movement month"
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All months</option>
            {movementMonths.map((value) => (
              <option key={value} value={value}>
                {SEARCH_MONTH_YEAR_FORMATTER.format(
                  new Date(`${value}-01T00:00:00Z`),
                )}
              </option>
            ))}
          </select>
        </label>
        <label>
          Direction
          <select
            aria-label="Stock movement direction"
            value={direction}
            onChange={(event) => {
              setDirection(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All movements</option>
            {Array.from(new Set(uniqueMovements.map((row) => row.direction)))
              .sort()
              .map((value) => (
                <option key={value}>{value}</option>
              ))}
          </select>
        </label>
        <ListSearchActions onClear={clearFilters} />
      </div>
      <PaginationToolbar
        controls={
          <ListExportControls
            report={{
              title: "Stock Movements",
              filters: activeFilterSummary({
                Search: search.trim(),
                Date: date,
                Month: month,
                Direction: direction,
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Stock movement records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {filtered.length ? (
        <div className="table-wrap">
          <table aria-label="Stock movement results">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.header}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.header}>{column.value(row)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="list-empty">
          <h3>No matching movements</h3>
          <FilterClearButton onClick={clearFilters} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

type StoreListKind = "stock" | "requests" | "issue" | "reconcile";
type StoreRequestRow = {
  view: JobView;
  request: MaterialRequest;
  item?: InventoryItem;
};
type StorePurchaseRow = { view: JobView; purchase: LocalPurchase };
type StoreHistoryRow = StoreRequestRow | StorePurchaseRow;

function isLocalPurchase(row: StoreHistoryRow): row is StorePurchaseRow {
  return "purchase" in row;
}

function requestState(row: StoreRequestRow) {
  const { request } = row;
  const reconciled =
    request.used_qty + request.returned_qty + request.wasted_qty;
  if (
    request.issued_qty > 0 &&
    Math.abs(reconciled - request.issued_qty) < 0.001
  )
    return "Reconciled";
  if (request.issued_qty >= request.requested_qty) return "Issued";
  if (request.issued_qty > 0) return "Partially issued";
  return "Pending";
}

function reconciliationState(row: StoreRequestRow) {
  const { request } = row;
  return request.issued_qty > 0 &&
    Math.abs(
      request.issued_qty -
        request.used_qty -
        request.returned_qty -
        request.wasted_qty,
    ) < 0.001
    ? "Matched"
    : "Open";
}

function storeMaterialStatusClass(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function StoreList({
  kind,
  inventory,
  requests,
  purchases = [],
  purchaseRequests = [],
  onOpenJob,
  onEditStock,
  onRelease,
  onNeedsApproval,
  onReconcile,
  initialSearch,
  initialMonth,
  initialPrimary,
  headerAction,
}: {
  kind: StoreListKind;
  inventory: InventoryItem[];
  requests: StoreRequestRow[];
  purchases?: StorePurchaseRow[];
  purchaseRequests?: Array<{
    view: JobView;
    purchaseRequest: MaterialPurchaseRequest;
  }>;
  onOpenJob: (id: number) => void;
  onEditStock?: (item: InventoryItem) => void;
  onRelease?: (row: StoreRequestRow) => void;
  onNeedsApproval?: (row: StoreRequestRow) => void;
  onReconcile?: (row: StoreRequestRow) => void;
  initialSearch?: string;
  initialMonth?: string;
  initialPrimary?: string;
  headerAction?: ReactNode;
}) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const deferredSearch = useDeferredValue(search);
  const [primary, setPrimary] = useState(initialPrimary ?? "ALL");
  const [job, setJob] = useState("ALL");
  const [item, setItem] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [recordDate, setRecordDate] = useState(() =>
    initialMonth ? "" : localCalendarDate(),
  );
  const [recordMonth, setRecordMonth] = useState(initialMonth ?? "");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(deferredSearch);
  const isMaterialRecordList = kind === "requests" || kind === "issue";
  const clearFilters = () => {
    setSearch("");
    setPrimary("ALL");
    setJob("ALL");
    setItem("ALL");
    setUnit("ALL");
    if (isMaterialRecordList) {
      setRecordDate("");
      setRecordMonth("");
    }
    setPage(1);
  };
  const title =
    kind === "stock"
      ? "Stock"
      : kind === "requests"
        ? "Material Requests"
        : kind === "issue"
          ? "Issue Material"
          : "Reconcile";

  const stockRows = useMemo(
    () =>
      inventory.filter((row) => {
        const stockState = row.stock_qty < row.low_stock_qty ? "LOW" : "OK";
        return (
          (!needle ||
            normalizeSearch(
              `${row.sku} ${row.name} ${row.category} ${row.unit}`,
            ).includes(needle)) &&
          (primary === "ALL" || row.category === primary) &&
          (job === "ALL" || stockState === job) &&
          (unit === "ALL" || row.unit === unit)
        );
      }),
    [inventory, needle, primary, job, unit],
  );

  const history = kind === "requests" ? [...requests, ...purchases] : requests;
  const matchesRecordDate = (createdAt?: string) =>
    !isMaterialRecordList ||
    ((!recordDate || createdAt?.slice(0, 10) === recordDate) &&
      (!recordMonth || createdAt?.slice(0, 7) === recordMonth));
  const filteredPurchaseRequests = useMemo(
    () =>
      purchaseRequests.filter(
        ({ view, purchaseRequest }) =>
          (isMaterialRecordList ||
            !needle ||
            normalizeSearch(
              `${view.job.job_no} ${view.vehicle.number} ${view.customer.name} ${view.customer.mobile} ${purchaseRequest.item_name} ${purchaseRequest.status}`,
            ).includes(needle)) &&
          (primary === "ALL" ||
            primary === "New item request" ||
            primary === purchaseRequest.status) &&
          (isMaterialRecordList ||
            job === "ALL" ||
            String(view.job.id) === job) &&
          matchesRecordDate(purchaseRequest.created_at),
      ),
    [
      purchaseRequests,
      needle,
      primary,
      job,
      recordDate,
      recordMonth,
      isMaterialRecordList,
    ],
  );
  const requestRows = useMemo(
    () =>
      history.filter((row) => {
        if (isLocalPurchase(row))
          return (
            (isMaterialRecordList ||
              !needle ||
              normalizeSearch(
                `${row.view.job.job_no} ${row.view.vehicle.number} ${row.view.customer.name} ${row.view.customer.mobile} ${row.purchase.item_description} ${row.purchase.vendor} ${row.purchase.bill_reference}`,
              ).includes(needle)) &&
            (primary === "ALL" || primary === "Local purchase") &&
            (isMaterialRecordList ||
              job === "ALL" ||
              String(row.view.job.id) === job) &&
            item === "ALL" &&
            matchesRecordDate(row.purchase.created_at)
          );
        const state =
          kind === "reconcile" ? reconciliationState(row) : requestState(row);
        return (
          (isMaterialRecordList ||
            !needle ||
            normalizeSearch(
              `${row.view.job.job_no} ${row.view.vehicle.number} ${row.view.customer.name} ${row.view.customer.mobile} ${row.item?.sku ?? ""} ${row.item?.name ?? ""}`,
            ).includes(needle)) &&
          (primary === "ALL" || state === primary) &&
          (isMaterialRecordList ||
            job === "ALL" ||
            String(row.view.job.id) === job) &&
          (item === "ALL" || String(row.request.item_id) === item) &&
          matchesRecordDate(row.request.created_at)
        );
      }),
    [
      history,
      kind,
      needle,
      primary,
      job,
      item,
      recordDate,
      recordMonth,
      isMaterialRecordList,
    ],
  );

  const filtered: Array<InventoryItem | StoreHistoryRow> =
    kind === "stock" ? stockRows : requestRows;
  const paged = paginate<InventoryItem | StoreHistoryRow>(
    filtered,
    page,
    pageSize,
  );
  useEffect(() => {
    if (paged.page !== page) setPage(paged.page);
  }, [paged.page, page]);
  const categories = Array.from(
    new Set(inventory.map((row) => row.category)),
  ).sort();
  const units = Array.from(new Set(inventory.map((row) => row.unit))).sort();
  const uniqueJobs = Array.from(
    new Map(history.map((row) => [row.view.job.id, row.view])).values(),
  );
  const activeFilters = activeFilterSummary(
    kind === "stock"
      ? {
          Search: search.trim(),
          Category: primary,
          "Stock status":
            job === "LOW" ? "Low stock" : job === "OK" ? "In stock" : "ALL",
          Unit: unit,
        }
      : isMaterialRecordList
        ? {
            "Record date": recordDate,
            "Month-Year": recordMonth || "ALL",
            Status: primary,
            Item:
              item === "ALL"
                ? "ALL"
                : (inventory.find((row) => String(row.id) === item)?.name ??
                  item),
          }
        : {
            Search: search.trim(),
            "Reconciliation state": primary,
            Job:
              job === "ALL"
                ? "ALL"
                : (uniqueJobs.find((row) => String(row.job.id) === job)?.job
                    .job_no ?? job),
            Item:
              item === "ALL"
                ? "ALL"
                : (inventory.find((row) => String(row.id) === item)?.name ??
                  item),
          },
  );

  const stockColumns: ExportColumn<InventoryItem>[] = [
    { header: "SKU", value: (row) => row.sku },
    { header: "Item", value: (row) => row.name },
    { header: "Category", value: (row) => row.category },
    { header: "Stock", value: (row) => row.stock_qty },
    { header: "Unit", value: (row) => row.unit },
    { header: "Minimum", value: (row) => row.low_stock_qty },
    { header: "Sell Price", value: (row) => money(row.selling_price) },
    {
      header: "Status",
      value: (row) =>
        row.stock_qty < row.low_stock_qty ? "Low stock" : "In stock",
    },
  ];
  const stockDisplayColumns: ExportColumn<InventoryItem>[] = [
    { header: "SKU", value: (row) => row.sku },
    { header: "Item", value: (row) => row.name },
    { header: "Category", value: (row) => row.category },
    { header: "Stock", value: (row) => `${row.stock_qty} ${row.unit}` },
    { header: "Minimum", value: (row) => row.low_stock_qty },
    { header: "Sell Price", value: (row) => money(row.selling_price) },
    {
      header: "Status",
      value: (row) =>
        row.stock_qty < row.low_stock_qty ? "Low stock" : "In stock",
    },
  ];
  const requestColumns: ExportColumn<StoreHistoryRow>[] = [
    { header: "Job Card", value: (row) => row.view.job.job_no },
    { header: "Vehicle", value: (row) => row.view.vehicle.number },
    ...(kind === "requests"
      ? [
          {
            header: "Type",
            value: (row: StoreHistoryRow) =>
              isLocalPurchase(row) ? "Local purchase" : "Inventory",
          },
        ]
      : []),
    {
      header: kind === "reconcile" ? "Item / SKU" : "Item",
      value: (row) =>
        isLocalPurchase(row)
          ? row.purchase.item_description
          : kind === "reconcile"
            ? `${row.item?.name ?? "Unknown"} · ${row.item?.sku ?? "No SKU"}`
            : (row.item?.name ?? "Unknown"),
    },
    {
      header: "Requested",
      value: (row) =>
        isLocalPurchase(row)
          ? `${row.purchase.quantity} ${row.purchase.unit}`
          : row.request.requested_qty,
    },
    {
      header: "Issued",
      value: (row) => (isLocalPurchase(row) ? "—" : row.request.issued_qty),
    },
    ...(kind === "reconcile"
      ? [
          {
            header: "Used",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row) ? row.request.used_qty : "—",
          },
          {
            header: "Returned",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row) ? row.request.returned_qty : "—",
          },
          {
            header: "Wasted",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row) ? row.request.wasted_qty : "—",
          },
          {
            header: "Variance",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row)
                ? row.request.issued_qty -
                  row.request.used_qty -
                  row.request.returned_qty -
                  row.request.wasted_qty
                : "—",
          },
          {
            header: "State",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row) ? reconciliationState(row) : "—",
          },
        ]
      : [
          {
            header: "Status",
            value: (row: StoreHistoryRow) =>
              isLocalPurchase(row) ? "Local purchase" : requestState(row),
          },
        ]),
  ];
  const exportReport =
    kind === "stock"
      ? {
          title,
          filters: activeFilters,
          columns: stockColumns,
          rows: stockRows,
        }
      : {
          title,
          filters: activeFilters,
          columns: requestColumns,
          rows: requestRows,
        };

  return (
    <div className="desk-panel store-list-page">
      <div className="store-list-header">
        <PanelTitle
          icon={
            kind === "stock" ? (
              <Boxes />
            ) : kind === "issue" ? (
              <Package />
            ) : kind === "reconcile" ? (
              <Check />
            ) : (
              <PackageCheck />
            )
          }
          title={title}
          subtitle="Search, filter and export the current list"
        />
        {headerAction && (
          <div className="store-list-header-action">{headerAction}</div>
        )}
      </div>
      {kind === "requests" && purchaseRequests.length > 0 && (
        <p className="permission-note">
          {filteredPurchaseRequests.length} new-item purchase request
          {filteredPurchaseRequests.length === 1 ? "" : "s"} match the current
          filters. Use Purchase, Stock & Issue to complete a pending request.
        </p>
      )}
      {kind === "requests" && purchaseRequests.length > 0 && (
        <section
          className="purchase-request-list"
          aria-label="New item purchase requests"
        >
          <h3>New-item purchase requests</h3>
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Trail</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchaseRequests.map(({ view, purchaseRequest }) => (
                <tr
                  key={purchaseRequest.id}
                  className="clickable-row"
                  onClick={() => onOpenJob(view.job.id)}
                >
                  <td>{view.job.job_no}</td>
                  <td>{purchaseRequest.item_name}</td>
                  <td>
                    {purchaseRequest.quantity} {purchaseRequest.unit}
                  </td>
                  <td>{purchaseRequest.status}</td>
                  <td>
                    {purchaseRequest.status === "Completed"
                      ? `Inventory #${purchaseRequest.mapped_inventory_item_id} · issued row #${purchaseRequest.material_request_id}`
                      : "Awaiting purchase"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <div
        className={
          kind === "stock"
            ? "store-filter-grid stock-filter-grid"
            : kind === "reconcile"
              ? "store-filter-grid reconcile-filter-grid"
              : isMaterialRecordList
                ? "store-filter-grid material-record-filter-grid"
                : "store-filter-grid"
        }
      >
        {!isMaterialRecordList && (
          <label className="list-search">
            Search
            <input
              aria-label={`Search ${title.toLocaleLowerCase()}`}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={
                kind === "stock"
                  ? "SKU, item, category or unit"
                  : "Job, vehicle or item"
              }
            />
          </label>
        )}
        {kind === "stock" ? (
          <>
            <label>
              Category
              <select
                aria-label="Stock category"
                value={primary}
                onChange={(event) => {
                  setPrimary(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All categories</option>
                {categories.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Stock status
              <select
                aria-label="Stock status"
                value={job}
                onChange={(event) => {
                  setJob(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All stock</option>
                <option value="LOW">Low stock</option>
                <option value="OK">In stock</option>
              </select>
            </label>
            <label>
              Unit
              <select
                aria-label="Stock unit"
                value={unit}
                onChange={(event) => {
                  setUnit(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All units</option>
                {units.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            {isMaterialRecordList && (
              <>
                <label>
                  Date
                  <input
                    aria-label={`${title} record date`}
                    type="date"
                    value={recordDate}
                    onChange={(event) => {
                      setRecordDate(event.target.value);
                      setRecordMonth("");
                      setPage(1);
                    }}
                  />
                </label>
                <label>
                  Month-Year
                  <select
                    aria-label={`${title} record month`}
                    value={recordMonth}
                    onChange={(event) => {
                      setRecordMonth(event.target.value);
                      setRecordDate("");
                      setPage(1);
                    }}
                  >
                    <option value="">All months</option>
                    {Array.from(
                      new Set(
                        [
                          ...history.map((row) =>
                            (isLocalPurchase(row)
                              ? row.purchase.created_at
                              : row.request.created_at
                            )?.slice(0, 7),
                          ),
                          ...purchaseRequests.map(({ purchaseRequest }) =>
                            purchaseRequest.created_at?.slice(0, 7),
                          ),
                        ].filter((value): value is string =>
                          Boolean(value && /^\d{4}-\d{2}$/.test(value)),
                        ),
                      ),
                    )
                      .sort((left, right) => right.localeCompare(left))
                      .map((value) => (
                        <option key={value} value={value}>
                          {SEARCH_MONTH_YEAR_FORMATTER.format(
                            new Date(`${value}-01T00:00:00Z`),
                          )}
                        </option>
                      ))}
                  </select>
                </label>
              </>
            )}
            <label>
              {kind === "reconcile" ? "Reconciliation state" : "Status"}
              <select
                aria-label={
                  kind === "reconcile" ? "Reconciliation state" : "Status"
                }
                value={primary}
                onChange={(event) => {
                  setPrimary(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All states</option>
                {(kind === "reconcile"
                  ? ["Matched", "Open"]
                  : [
                      "Pending",
                      "Partially issued",
                      "Issued",
                      "Reconciled",
                      ...(purchases.length ? ["Local purchase"] : []),
                      ...(purchaseRequests.length
                        ? ["New item request", "Completed"]
                        : []),
                    ]
                ).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            {!isMaterialRecordList && (
              <label>
                Job
                <select
                  aria-label={`${title} job`}
                  value={job}
                  onChange={(event) => {
                    setJob(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All jobs</option>
                  {uniqueJobs.map((row) => (
                    <option key={row.job.id} value={row.job.id}>
                      {row.job.job_no} · {row.vehicle.number} ·{" "}
                      {row.customer.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {isMaterialRecordList ? (
              <label>
                Item
                <InventoryPicker
                  inventory={inventory}
                  value={item === "ALL" ? undefined : Number(item)}
                  onChange={(id) => {
                    setItem(String(id));
                    setPage(1);
                  }}
                  label="Item"
                  allOptionLabel="All items"
                  onSelectAll={() => {
                    setItem("ALL");
                    setPage(1);
                  }}
                />
              </label>
            ) : (
              <label>
                Item
                <select
                  aria-label={`${title} item`}
                  value={item}
                  onChange={(event) => {
                    setItem(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All items</option>
                  {inventory.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </>
        )}
        <ListSearchActions onClear={clearFilters} />
      </div>
      <PaginationToolbar
        controls={<ListExportControls report={exportReport} />}
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel={`${title} records per page`}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount === 0 ? (
        <div className="list-empty">
          <h3>No matching records</h3>
          <p>Adjust the search or clear the filters.</p>
          <FilterClearButton onClick={clearFilters} label="Clear filters" />
        </div>
      ) : (
        <div className="table-wrap">
          <table
            className={
              isMaterialRecordList ? "store-material-record-table" : undefined
            }
            aria-label={`${title} results`}
          >
            <thead>
              <tr>
                {(kind === "stock" ? stockDisplayColumns : requestColumns).map(
                  (column) => (
                    <th key={column.header}>{column.header}</th>
                  ),
                )}
                {kind === "stock" && onEditStock && <th>Action</th>}
                {(kind === "issue" || kind === "reconcile") && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {kind === "stock"
                ? (paged.items as InventoryItem[]).map((row) => (
                    <tr key={row.id}>
                      {stockDisplayColumns.map((column) => (
                        <td key={column.header}>{column.value(row)}</td>
                      ))}
                      {onEditStock && (
                        <td>
                          <button
                            type="button"
                            className="secondary-action"
                            onClick={() => onEditStock(row)}
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                : (paged.items as StoreHistoryRow[]).map((row) => {
                    const status =
                      kind === "reconcile" && !isLocalPurchase(row)
                        ? reconciliationState(row)
                        : isLocalPurchase(row)
                          ? "Local purchase"
                          : requestState(row);
                    return (
                      <tr
                        key={
                          isLocalPurchase(row)
                            ? `purchase-${row.purchase.id}`
                            : `request-${row.request.id}`
                        }
                        className="clickable-row"
                        onClick={() => onOpenJob(row.view.job.id)}
                      >
                        {requestColumns.map((column) => (
                          <td
                            key={column.header}
                            className={
                              column.header === "Status" ||
                              column.header === "State"
                                ? `store-material-status-cell store-material-status-cell-${storeMaterialStatusClass(status)}`
                                : undefined
                            }
                          >
                            {column.header === "Job Card" ? (
                              <button
                                type="button"
                                className="link-action"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onOpenJob(row.view.job.id);
                                }}
                              >
                                {String(column.value(row))}
                              </button>
                            ) : column.header === "Status" ||
                              column.header === "State" ? (
                              <span
                                className={`store-material-status store-material-status-${storeMaterialStatusClass(status)}`}
                              >
                                {status}
                              </span>
                            ) : (
                              column.value(row)
                            )}
                          </td>
                        ))}
                        {(kind === "issue" || kind === "reconcile") && (
                          <td
                            className={
                              kind === "issue"
                                ? "store-material-action-cell"
                                : undefined
                            }
                          >
                            {!isLocalPurchase(row) && (
                              <div className="grid-actions store-material-actions">
                                {kind === "issue" && onRelease && (
                                  <button
                                    type="button"
                                    className="workflow-action action-primary"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onRelease(row);
                                    }}
                                  >
                                    <Package size={15} />
                                    Issue Material
                                  </button>
                                )}
                                {kind === "issue" &&
                                  onNeedsApproval &&
                                  ["Requested", "Re-requested"].includes(
                                    row.request.status ?? "Requested",
                                  ) &&
                                  !row.request.invoiced_in && (
                                    <button
                                      type="button"
                                      className="workflow-action action-secondary"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onNeedsApproval(row);
                                      }}
                                    >
                                      <ShieldCheck size={15} />
                                      Needs Approval
                                    </button>
                                  )}
                                {kind === "reconcile" && onReconcile && (
                                  <button
                                    type="button"
                                    className="store-material-action"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onReconcile(row);
                                    }}
                                  >
                                    {reconciliationState(row) === "Matched"
                                      ? "Edit Reconciliation"
                                      : "Reconcile"}
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

function Technician({
  activeMenuItem,
  state,
  mutate,
  setSelectedJobId,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
}) {
  const taskJobs = state.jobs.filter(
    (view) => view.job.main_status === "IN_PROGRESS",
  );
  const statuses: TaskStatus[] = ["Started", "Paused", "Completed"];
  return (
    <section className="workspace tech-board">
      <div className="desk-panel board-heading">
        <PanelTitle
          icon={activeMenuItem === "QC Prep" ? <ShieldCheck /> : <Wrench />}
          title={activeMenuItem}
          subtitle="Assigned work, progress state and QC handoff"
        />
      </div>
      {taskJobs.map((view) => (
        <div
          className="desk-panel task-column"
          key={view.job.id}
          onFocus={() => setSelectedJobId(view.job.id)}
        >
          <PanelTitle
            icon={<Wrench />}
            title={view.vehicle.number}
            subtitle={view.job.job_no}
          />
          {view.tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <strong>{task.title}</strong>
              <p>{task.notes}</p>
              <Info label="Started" value={task.started_at || "Not started"} />
              <Info label="Paused" value={task.paused_at || "Not paused"} />
              <Info
                label="Completed"
                value={task.completed_at || "Not completed"}
              />
              <Status status={view.job.main_status} sub={view.job.sub_status} />
              <label>
                Work notes
                <input
                  defaultValue={task.notes}
                  onBlur={(event) =>
                    mutate((db) =>
                      updateTask(db, task.id, task.status, event.target.value),
                    )
                  }
                />
              </label>
              <div className="segmented">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={task.status === status ? "active" : ""}
                    onClick={() =>
                      mutate((db) =>
                        updateTask(
                          db,
                          task.id,
                          status,
                          `${status} from technician board`,
                        ),
                      )
                    }
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                className="danger-action"
                onClick={() =>
                  mutate((db) =>
                    archiveTask(db, task.id, "Removed from technician board"),
                  )
                }
              >
                Archive Task
              </button>
            </div>
          ))}
          <TaskCreator view={view} users={state.users} mutate={mutate} />
          {activeMenuItem === "QC Prep" && (
            <QcEditor
              view={view}
              technicianId={
                state.users.find((item) => item.role === "tech")?.id ?? 6
              }
              mutate={mutate}
            />
          )}
        </div>
      ))}
    </section>
  );
}

function Accounts({
  activeMenuItem,
  state,
  view,
  mutate,
  setSelectedJobId,
  actor,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  view?: JobView;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
  actor: User;
}) {
  if (activeMenuItem === "Ready To Invoice") {
    return (
      <BillingManager
        mode="Invoices"
        state={state}
        actor={actor}
        mutate={mutate}
        pendingInvoicesOnly
      />
    );
  }
  const mode: BillingMode =
    activeMenuItem === "Payment"
      ? "Payments"
      : activeMenuItem === "Delivery"
        ? "Delivery"
        : "Invoices";
  return (
    <BillingManager mode={mode} state={state} actor={actor} mutate={mutate} />
  );
}

function MaterialApprovalQueue({
  state,
  actor,
  mutate,
  setSelectedJobId,
  initialMonth,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
  initialMonth?: string;
}) {
  const pending = state.jobs.filter(
    (view) =>
      view.material_approval?.status === "Pending" &&
      (!initialMonth ||
        view.material_approval?.submitted_at?.slice(0, 7) === initialMonth),
  );
  const [reviewing, setReviewing] = useState<JobView>();
  const [viewing, setViewing] = useState<JobView>();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const decide = (decision: "Approved" | "Rejected") => {
    if (!reviewing) return;
    setError("");
    if (
      mutate(
        (db) =>
          decideMaterialApprovalForActor(
            db,
            reviewing.job.id,
            actor.id,
            decision,
            reason,
          ),
        setError,
      )
    ) {
      setReviewing(undefined);
      setReason("");
    }
  };
  return (
    <section className="workspace single-panel">
      <div className="desk-panel">
        <PanelTitle
          icon={<ShieldCheck />}
          title="Approvals"
          subtitle={`${pending.length} pending job-level material approval${pending.length === 1 ? "" : "s"}`}
        />
        {pending.length ? (
          <div className="table-wrap">
            <table aria-label="Pending material approvals">
              <thead>
                <tr>
                  <th>Job Card</th>
                  <th>Vehicle / Customer</th>
                  <th>Store user</th>
                  <th>Submitted</th>
                  <th>Job status</th>
                  <th>Outstanding materials</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((view) => {
                  const approval = view.material_approval!;
                  const requester =
                    state.users.find(
                      (user) => user.id === approval.submitted_by,
                    )?.name ?? "Store";
                  const materials = view.material_requests
                    .filter((row) =>
                      ["Requested", "Re-requested"].includes(
                        row.status ?? "Requested",
                      ),
                    )
                    .map(
                      (row) =>
                        `${state.inventory.find((item) => item.id === row.item_id)?.name ?? `Item ${row.item_id}`} × ${row.requested_qty}`,
                    )
                    .join(", ");
                  return (
                    <tr key={approval.id}>
                      <td>
                        <button
                          className="link-action"
                          onClick={() => {
                            setSelectedJobId(view.job.id);
                            setViewing(view);
                          }}
                        >
                          {view.job.job_no}
                        </button>
                      </td>
                      <td>
                        {view.vehicle.number} · {view.customer.name}
                      </td>
                      <td>{requester}</td>
                      <td>{formatTimestamp(approval.submitted_at)}</td>
                      <td>
                        <Status
                          status={view.job.main_status}
                          sub={view.job.sub_status}
                        />
                      </td>
                      <td>{materials || "No outstanding rows"}</td>
                      <td>
                        <button
                          className="primary-action"
                          onClick={() => setReviewing(view)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="list-empty">
            <h3>No pending approvals</h3>
            <p>Store material approval requests will appear here.</p>
          </div>
        )}
      </div>
      {viewing && (
        <JobRecordDialog
          view={viewing}
          state={state}
          mutate={mutate}
          actor={actor}
          mode="view"
          onClose={() => setViewing(undefined)}
        />
      )}
      {reviewing && (
        <Dialog
          title="Review material approval"
          subtitle={`${reviewing.job.job_no} · decision controls`}
          onClose={() => setReviewing(undefined)}
          footer={
            <>
              <button
                type="button"
                className="secondary-action"
                onClick={() => decide("Approved")}
              >
                Approve
              </button>
              <button
                type="button"
                className="danger-action"
                onClick={() => decide("Rejected")}
              >
                Reject
              </button>
            </>
          }
        >
          <p>
            Approve restores the retained requested rows for Store issue. Reject
            keeps the job on HOLD for the linked Service Advisor to correct.
          </p>
          <label>
            Rejection reason
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              placeholder="Required when rejecting"
            />
          </label>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
        </Dialog>
      )}
    </section>
  );
}

function Admin({
  activeMenuItem,
  state,
  selected,
  mutate,
  setSelectedJobId,
  user,
  cognitoConfig,
  onNavigate,
  onDashboardNavigate,
  dashboardDrilldown,
  onThemeSaved,
  onAdminStateSaved,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  selected?: JobView;
  mutate: Mutate;
  setSelectedJobId: (value: number) => void;
  user: User;
  cognitoConfig?: CognitoConfig;
  onNavigate: (label: string) => void;
  onDashboardNavigate: (drilldown: DashboardDrilldown) => void;
  dashboardDrilldown?: DashboardDrilldown;
  onThemeSaved: (theme: AppTheme) => void;
  onAdminStateSaved: () => void;
}) {
  if (activeMenuItem === "Advance Bookings") {
    return (
      <BookingOperations
        state={state}
        actor={user}
        mutate={mutate}
        onCheckedIn={(jobId) => setSelectedJobId(jobId)}
      />
    );
  }
  if (activeMenuItem === "Data Flow") {
    return <DataFlowWorkspace jobs={state.jobs} users={state.users} />;
  }
  if (activeMenuItem === "Approvals")
    return (
      <MaterialApprovalQueue
        state={state}
        actor={user}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        initialMonth={dashboardDrilldown?.month}
      />
    );
  if (activeMenuItem === "Job Cards") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle
            icon={<FileText />}
            title="Job Cards"
            subtitle="Linked operational records"
          />
          <FilterableJobRows
            title="Job Cards"
            jobs={state.jobs}
            selectedJobId={selected?.job.id}
            onSelect={setSelectedJobId}
            showStatusFilter
          />
        </div>
        <div className="desk-panel">
          <PanelTitle
            icon={<FileText />}
            title="Admin Job Detail"
            subtitle={selected?.job.job_no ?? "Select a job"}
          />
          {selected && (
            <>
              <JobEditor
                view={selected}
                users={state.users}
                mutate={mutate}
                actor={user}
              />
              <LinkedRecords view={selected} />
              <button
                className="danger-action"
                onClick={() =>
                  mutate((db) =>
                    cancelJobCard(db, selected.job.id, "Cancelled by admin"),
                  )
                }
              >
                Archive Job
              </button>
            </>
          )}
        </div>
      </section>
    );
  }
  if (activeMenuItem === "Manage") {
    return (
      <>
        <ManagementHub
          state={state}
          mutate={mutate}
          actingUser={user}
          selected={selected}
          setSelectedJobId={setSelectedJobId}
          cognitoConfig={cognitoConfig}
        />
      </>
    );
  }
  if (activeMenuItem === "Admin Console") {
    return (
      <AdminConsole
        state={state}
        mutate={mutate}
        actingUser={user}
        cognitoConfig={cognitoConfig}
        onThemeSaved={onThemeSaved}
        onStateSaved={onAdminStateSaved}
      />
    );
  }
  return (
    <OperationalDashboard state={state} onNavigate={onDashboardNavigate} />
  );
}

type DashboardMetric = {
  label: string;
  value: string | number;
  tone: string;
  drilldown: DashboardDrilldown;
  layout?: "primary" | "projection" | "supporting" | "secondary";
  context?: string;
};
type DashboardCard = {
  title: string;
  subtitle: string;
  tone: string;
  action: string;
  drilldown: DashboardDrilldown;
  metrics: DashboardMetric[];
};

function OperationalDashboard({
  state,
  onNavigate,
}: {
  state: WorkshopState;
  onNavigate: (drilldown: DashboardDrilldown) => void;
}) {
  const today = localCalendarDate();
  const currentMonth = today.slice(0, 7);
  const [cashflowMonth, setCashflowMonth] = useState(currentMonth);
  const cashflowMonths = useMemo(
    () =>
      [
        ...new Set([
          currentMonth,
          ...state.jobs
            .flatMap((view) => view.payments)
            .filter((payment) => !payment.voided_at)
            .map((payment) => payment.created_at?.slice(0, 7) ?? "")
            .filter((month) => /^\d{4}-\d{2}$/.test(month)),
        ]),
      ].sort((left, right) => right.localeCompare(left)),
    [currentMonth, state.jobs],
  );
  const facts = dashboardFacts(
    state.jobs,
    state.inventory,
    today,
    cashflowMonth,
  );
  const dateLabel = new Date(`${today}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const collectionPace = facts.cashflowMonthComplete
    ? 100
    : facts.daysInMonth
      ? Math.round((facts.daysElapsed / facts.daysInMonth) * 100)
      : 0;
  const cards: DashboardCard[] = [
    {
      title: "Workshop flow",
      subtitle: "All job-card history",
      tone: "flow",
      action: "View active jobs",
      drilldown: { destination: "Job Cards", status: "ACTIVE" },
      metrics: [
        {
          label: "Active today",
          value: facts.activeToday,
          tone: "active",
          layout: "primary",
          drilldown: { destination: "Job Cards", status: "ACTIVE" },
        },
        {
          label: "Total visits",
          value: facts.totalVisits,
          tone: "received",
          layout: "secondary",
          drilldown: { destination: "Job Cards" },
        },
        {
          label: "In progress",
          value: facts.inProgress,
          tone: "progress",
          drilldown: { destination: "Job Cards", status: "IN_PROGRESS" },
        },
        {
          label: "Closed",
          value: facts.closed,
          tone: "closed",
          drilldown: { destination: "Job Cards", status: "CLOSED" },
        },
        {
          label: "On hold",
          value: facts.onHold,
          tone: "hold",
          drilldown: { destination: "Job Cards", status: "HOLD" },
        },
      ],
    },
    {
      title: "Cashflow",
      subtitle: `${facts.cashflowMonthLabel} ${facts.cashflowMonthComplete ? "collection complete" : "collection runway"}`,
      tone: "cashflow",
      action: "View collections",
      drilldown: {
        destination: "Search",
        month: cashflowMonth,
        category: "payment" as const,
      },
      metrics: [
        {
          label: facts.cashflowMonthComplete
            ? "Final collection"
            : "Total collections",
          value: money(facts.totalCollections),
          tone: "collections",
          layout: "primary",
          drilldown: {
            destination: "Search",
            month: cashflowMonth,
            category: "payment" as const,
          },
        },
        ...(facts.cashflowMonthComplete
          ? []
          : [
              {
                label: "Projected monthly collection",
                value: money(facts.projectedMonthlyCollection),
                tone: "projection",
                layout: "projection" as const,
                context: `${facts.daysElapsed} of ${facts.daysInMonth} calendar days elapsed`,
                drilldown: {
                  destination: "Search",
                  month: cashflowMonth,
                  category: "payment" as const,
                },
              },
            ]),
        {
          label: "Payments received",
          value: facts.paymentsReceived,
          tone: "payments",
          layout: "supporting",
          drilldown: {
            destination: "Search",
            month: cashflowMonth,
            category: "payment" as const,
          },
        },
        {
          label: "Invoices generated",
          value: facts.invoicesGenerated,
          tone: "invoices",
          layout: "supporting",
          drilldown: {
            destination: "Search",
            month: cashflowMonth,
            category: "invoice" as const,
          },
        },
      ],
    },
    {
      title: "Customer reach",
      subtitle: "All customers and vehicles served",
      tone: "reach",
      action: "View customers served",
      drilldown: { destination: "Search", category: "customer" },
      metrics: [
        {
          label: "Customers served",
          value: facts.customersServed,
          tone: "customers",
          drilldown: { destination: "Customers", served: "customers" },
        },
        {
          label: "Vehicles served",
          value: facts.vehiclesServed,
          tone: "vehicles",
          drilldown: { destination: "Vehicles", served: "vehicles" },
        },
      ],
    },
    {
      title: "Inventory watch",
      subtitle: `${facts.monthLabel} materials attention`,
      tone: "inventory",
      action: "View low-stock blockers",
      drilldown: {
        destination: "Search",
        category: "stock",
        lowStockOnly: true,
      },
      metrics: [
        {
          label: "Low-stock items",
          value: facts.lowStock,
          tone: "low-stock",
          drilldown: { destination: "Stock", stockTab: "Low Stock" },
        },
        {
          label: "Pending approvals",
          value: facts.pendingApprovals,
          tone: "approvals",
          drilldown: { destination: "Approvals", month: currentMonth },
        },
        {
          label: "Material requests",
          value: facts.materialRequests,
          tone: "requests",
          drilldown: { destination: "Material Requests", month: currentMonth },
        },
        {
          label: "Materials issued",
          value: facts.materialsIssued,
          tone: "issued",
          drilldown: {
            destination: "Issue Material",
            month: currentMonth,
            status: "Issued",
          },
        },
      ],
    },
  ];
  return (
    <section
      className="workspace operational-dashboard"
      aria-label="Workshop command center"
    >
      <header className="command-header">
        <div>
          <p className="command-kicker">Workshop command center</p>
          <h1>Operational dashboard</h1>
          <p>Live job flow, customer reach, stock attention and collections.</p>
        </div>
        <div className="command-date" aria-label={`Today: ${dateLabel}`}>
          <CalendarDays size={20} />
          <div>
            <strong>{dateLabel}</strong>
            <span>Real-time overview</span>
          </div>
        </div>
      </header>
      <div className="command-grid">
        {cards.map((card) => {
          const icon =
            card.tone === "flow" ? (
              <Gauge size={21} />
            ) : card.tone === "cashflow" ? (
              <Banknote size={21} />
            ) : card.tone === "reach" ? (
              <UsersRound size={21} />
            ) : (
              <Boxes size={21} />
            );
          return (
            <article
              key={card.title}
              data-dashboard-card={card.tone}
              className={`command-card command-${card.tone}`}
              tabIndex={0}
              onClick={() => onNavigate(card.drilldown)}
              onKeyDown={(event) => {
                if (
                  event.target === event.currentTarget &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  onNavigate(card.drilldown);
                }
              }}
            >
              <div className="command-card-heading">
                <span className="command-icon-tile" aria-hidden="true">
                  {icon}
                </span>
                <div>
                  <h2>{card.title}</h2>
                  <p>{card.subtitle}</p>
                </div>
                {card.tone === "cashflow" && (
                  <label className="cashflow-month">
                    Cashflow month
                    <select
                      aria-label="Cashflow month"
                      value={cashflowMonth}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        event.stopPropagation();
                        setCashflowMonth(event.target.value);
                      }}
                    >
                      {cashflowMonths.map((month) => (
                        <option key={month} value={month}>
                          {SEARCH_MONTH_YEAR_FORMATTER.format(
                            new Date(`${month}-01T00:00:00Z`),
                          )}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <div
                className={`command-metrics${card.tone === "cashflow" ? " command-cashflow-metrics" : ""}`}
              >
                {card.metrics.map((metric) => (
                  <button
                    type="button"
                    key={metric.label}
                    className={`command-metric metric-${metric.tone}${metric.layout ? ` command-metric-${metric.layout}` : ""}`}
                    aria-label={`Open ${metric.label}: ${metric.value}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onNavigate(metric.drilldown);
                    }}
                  >
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    {metric.context && <small>{metric.context}</small>}
                  </button>
                ))}
              </div>
              {card.tone === "cashflow" &&
                (facts.cashflowMonthComplete ? (
                  <div
                    className="collection-pace collection-complete"
                    aria-label={`${facts.cashflowMonthLabel} collection complete`}
                  >
                    <div className="collection-pace-label">
                      <span>Collection period</span>
                      <strong>Month complete</strong>
                    </div>
                  </div>
                ) : (
                  <div
                    className="collection-pace"
                    aria-label={`${collectionPace}% of calendar month elapsed`}
                  >
                    <div className="collection-pace-label">
                      <span>Collection runway</span>
                      <strong>{collectionPace}% elapsed</strong>
                    </div>
                    <div className="collection-pace-track">
                      <span style={{ width: `${collectionPace}%` }} />
                    </div>
                    <div className="collection-bars" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                ))}
              {card.tone === "reach" && (
                <svg
                  className="customer-trend"
                  viewBox="0 0 260 62"
                  role="img"
                  aria-label="Decorative customer reach trend"
                >
                  <path
                    d="M2 52C28 48 31 36 53 42S83 51 103 29s33 5 54-8 29-1 46-17 30-1 55-3"
                    fill="none"
                    pathLength="1"
                  />
                  <path d="M2 59H258" />
                </svg>
              )}
              {card.tone === "inventory" && (
                <div className="inventory-signal" aria-hidden="true">
                  <Sparkles size={15} />
                  <span>Attention queue</span>
                  <i />
                  <i />
                  <i />
                </div>
              )}
              <div className="command-card-footer">
                <button
                  type="button"
                  className="command-card-open"
                  aria-label={card.action}
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigate(card.drilldown);
                  }}
                >
                  {card.action} <ChevronRight size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const managementAreas = [
  "Users",
  "Customers",
  "Vehicles",
  "Suppliers",
  "Job Cards",
  "Estimates",
  "Invoices",
  "Payments",
  "Delivery",
] as const;
type ManagementArea = (typeof managementAreas)[number];

function ManagementHub({
  state,
  mutate,
  actingUser,
  selected,
  setSelectedJobId,
  cognitoConfig,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actingUser: User;
  selected?: JobView;
  setSelectedJobId: (id: number) => void;
  cognitoConfig?: CognitoConfig;
}) {
  const [area, setArea] = useState<ManagementArea>("Users");
  const [managedJobId, setManagedJobId] = useState<number>();
  const managedJob = state.jobs.find((view) => view.job.id === managedJobId);
  return (
    <section className="workspace single-panel management-hub">
      <div className="desk-panel">
        <PanelTitle
          icon={<ShieldCheck />}
          title="Management Hub"
          subtitle="Admin master data and workflow controls"
        />
        <div className="demo-dataset-control">
          <div>
            <strong>Large demo dataset</strong>
            <span>
              120 customers, 132 vehicles, 144 jobs and 288 offline media
              records.
            </span>
          </div>
          <button
            className="primary-action"
            onClick={() => {
              if (
                window.confirm(
                  "Load Large Demo Dataset? Current local demo records will be replaced. This cannot be undone from this screen.",
                )
              )
                mutate(loadLargeDemoDataset);
            }}
          >
            Load Large Demo Dataset
          </button>
        </div>
        <div
          className="management-tabs"
          role="tablist"
          aria-label="Management areas"
          onKeyDown={handleTabListKeyDown}
        >
          {managementAreas.map((item) => (
            <button
              id={`management-tab-${item.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}
              aria-controls="management-active-panel"
              tabIndex={area === item ? 0 : -1}
              key={item}
              role="tab"
              aria-selected={area === item}
              className={area === item ? "active" : ""}
              onClick={() => setArea(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div
          id="management-active-panel"
          role="tabpanel"
          aria-labelledby={`management-tab-${area.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}
        >
          {area === "Estimates" && (
            <JobPicker
              jobs={state.jobs}
              selectedJobId={managedJob?.job.id}
              onSelect={setManagedJobId}
              label={`Job for ${area}`}
            />
          )}
          {area === "Users" && (
            <UserManager
              users={state.users}
              mutate={mutate}
              actingUser={actingUser}
              cognitoConfig={cognitoConfig}
            />
          )}
          {area === "Customers" && (
            <CustomerManager state={state} mutate={mutate} actor={actingUser} />
          )}
          {area === "Vehicles" && (
            <VehicleManager state={state} mutate={mutate} actor={actingUser} />
          )}
          {area === "Suppliers" && (
            <SupplierMasterWorkspace
              state={state}
              actor={actingUser}
              mutate={mutate}
            />
          )}
          {area === "Job Cards" && (
            <VisitJobManager
              state={state}
              mutate={mutate}
              actingUser={actingUser}
              selected={selected}
              setSelectedJobId={setSelectedJobId}
            />
          )}
          {area === "Estimates" && (
            <EstimateManager
              view={managedJob}
              mutate={mutate}
              actor={actingUser}
            />
          )}
          {(area === "Invoices" ||
            area === "Payments" ||
            area === "Delivery") && (
            <BillingManager
              key={area}
              mode={area}
              state={state}
              actor={actingUser}
              mutate={mutate}
              panel={false}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function CustomerManager({
  state,
  mutate,
  actor,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
}) {
  const [archivedOnly, setArchivedOnly] = useState(false);
  const customers = archivedOnly ? state.archived_customers : state.customers;
  const empty: Customer = { id: 0, name: "", mobile: "", type: "Individual" };
  const [draft, setDraft] = useState<Customer>(empty);
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{
    customer: Customer;
    mode: "view" | "edit";
  }>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filtered = customers.filter(
    (item) =>
      !needle ||
      normalizeSearch(`${item.name} ${item.mobile} ${item.type}`).includes(
        needle,
      ),
  );
  const paged = paginate(filtered, page, pageSize);
  const vehicleCount = (customer: Customer) =>
    state.vehicles.filter((vehicle) => vehicle.customer_id === customer.id)
      .length;
  const openJobCount = (customer: Customer) =>
    state.jobs.filter(
      (view) =>
        view.customer.id === customer.id && view.job.main_status !== "CLOSED",
    ).length;
  const columns: ExportColumn<Customer>[] = [
    { header: "Customer", value: (row) => row.name },
    { header: "Mobile", value: (row) => row.mobile },
    { header: "Type", value: (row) => row.type },
    { header: "Vehicles", value: vehicleCount },
    { header: "Open Jobs", value: openJobCount },
  ];
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Customers</h3>
        {!archivedOnly && (
          <button
            className="primary-action"
            onClick={() => {
              setDraft(empty);
              setCreating(true);
            }}
          >
            Add Customer
          </button>
        )}
      </div>
      {creating && (
        <Dialog title="Add Customer" onClose={() => setCreating(false)}>
          <CustomerEditor
            embedded
            value={draft}
            setValue={setDraft}
            mutate={mutate}
            onSaved={() => setCreating(false)}
          />
        </Dialog>
      )}
      {record && (
        <CustomerRecordDialog
          customer={record.customer}
          state={state}
          mutate={mutate}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search customers"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, mobile or type"
          />
        </label>
        {actor.role === "admin" && (
          <Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
        )}
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Customers",
              filters: activeFilterSummary({
                Search: search.trim(),
                "Show archived only": archivedOnly ? "Yes" : "No",
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Customer records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount > 0 && (
        <div className="table-wrap management-table">
          <table aria-label="Customer manager">
            <thead>
              <tr>
                {[
                  "Customer",
                  "Mobile",
                  "Type",
                  "Vehicles",
                  "Open Jobs",
                  "Actions",
                ].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.type}</td>
                  <td>{vehicleCount(customer)}</td>
                  <td>{openJobCount(customer)}</td>
                  <td>
                    <RecordActions
                      inGrid
                      onView={() => setRecord({ customer, mode: "view" })}
                      onEdit={
                        !archivedOnly
                          ? () => setRecord({ customer, mode: "edit" })
                          : undefined
                      }
                      onArchive={
                        !archivedOnly
                          ? () =>
                              mutate((db) =>
                                archiveCustomer(
                                  db,
                                  customer.id,
                                  "Archived by Admin",
                                ),
                              )
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            label="Clear filters"
          />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

function VehicleManager({
  state,
  mutate,
  actor,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
}) {
  const [archivedOnly, setArchivedOnly] = useState(false);
  const empty: Vehicle = {
    id: 0,
    customer_id: state.customers[0]?.id ?? 0,
    number: "",
    make: "",
    model: "",
    color: "",
    km: 0,
  };
  const [draft, setDraft] = useState<Vehicle>(empty);
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{ id: number; mode: "view" | "edit" }>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const vehicles = archivedOnly ? state.archived_vehicles : state.vehicles;
  const owners = archivedOnly
    ? [...state.customers, ...state.archived_customers]
    : state.customers;
  const filtered = vehicles.filter((item) => {
    const owner =
      owners.find((customer) => customer.id === item.customer_id)?.name ?? "";
    return (
      !needle ||
      normalizeSearch(
        `${item.number} ${item.make} ${item.model} ${owner}`,
      ).includes(needle)
    );
  });
  const paged = paginate(filtered, page, pageSize);
  const ownerName = (vehicle: Vehicle) =>
    owners.find((customer) => customer.id === vehicle.customer_id)?.name ?? "—";
  const columns: ExportColumn<Vehicle>[] = [
    { header: "Registration", value: (row) => row.number },
    { header: "Make / Model", value: (row) => `${row.make} ${row.model}` },
    { header: "Color", value: (row) => row.color },
    { header: "Customer", value: ownerName },
    { header: "KM", value: (row) => row.km },
  ];
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Vehicles</h3>
        {!archivedOnly && (
          <button
            className="primary-action"
            onClick={() => {
              setDraft(empty);
              setCreating(true);
            }}
          >
            Add Vehicle
          </button>
        )}
      </div>
      {creating && (
        <Dialog title="Add Vehicle" onClose={() => setCreating(false)}>
          <VehicleMasterPanel
            embedded
            key={draft.id}
            state={state}
            value={draft}
            setValue={setDraft}
            mutate={mutate}
            onSaved={() => setCreating(false)}
          />
        </Dialog>
      )}
      {record && (
        <VehicleRecordDialog
          vehicle={vehicles.find((vehicle) => vehicle.id === record.id)!}
          state={state}
          mutate={mutate}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search vehicles"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Registration, make, model or customer"
          />
        </label>
        {actor.role === "admin" && (
          <Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
        )}
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Vehicles",
              filters: activeFilterSummary({
                Search: search.trim(),
                "Show archived only": archivedOnly ? "Yes" : "No",
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Vehicle records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount > 0 && (
        <div className="table-wrap management-table">
          <table aria-label="Vehicle manager">
            <thead>
              <tr>
                {[
                  "Registration",
                  "Make / Model",
                  "Color",
                  "Customer",
                  "KM",
                  "Actions",
                ].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.number}</td>
                  <td>
                    {vehicle.make} {vehicle.model}
                  </td>
                  <td>{vehicle.color}</td>
                  <td>{ownerName(vehicle)}</td>
                  <td>{vehicle.km.toLocaleString("en-IN")}</td>
                  <td>
                    <RecordActions
                      inGrid
                      onView={() => setRecord({ id: vehicle.id, mode: "view" })}
                      onEdit={
                        !archivedOnly
                          ? () => setRecord({ id: vehicle.id, mode: "edit" })
                          : undefined
                      }
                      onArchive={
                        !archivedOnly
                          ? () =>
                              mutate((db) =>
                                archiveVehicle(
                                  db,
                                  vehicle.id,
                                  "Archived by Admin",
                                ),
                              )
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            label="Clear filters"
          />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

function VisitJobManager({
  state,
  mutate,
  actingUser,
  selected,
  setSelectedJobId,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actingUser: User;
  selected?: JobView;
  setSelectedJobId: (id: number) => void;
}) {
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{ id: number; mode: "view" | "edit" }>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryMonth, setDeliveryMonth] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const jobs = archivedOnly ? state.archived_jobs : state.jobs;
  const filtered = jobs.filter(
    (row) =>
      (!needle ||
        normalizeSearch(
          `${row.job.job_no} ${row.vehicle.number} ${row.customer.name}`,
        ).includes(needle)) &&
      (status === "ALL" || row.job.main_status === status) &&
      (!deliveryDate || row.job.estimated_delivery === deliveryDate) &&
      (deliveryDate ||
        !deliveryMonth ||
        row.job.estimated_delivery?.slice(0, 7) === deliveryMonth),
  );
  const paged = paginate(filtered, page, pageSize);
  const columns: ExportColumn<JobView>[] = [
    { header: "Job Card", value: (row) => row.job.job_no },
    { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name },
    {
      header: "Estimated Delivery Date",
      value: (row) => row.job.estimated_delivery || "—",
    },
    { header: "Status", value: (row) => row.job.main_status },
  ];
  const dialogJob = record
    ? jobs.find((row) => row.job.id === record.id)
    : undefined;
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Job Cards</h3>
        {!archivedOnly && (
          <button className="add-action" onClick={() => setCreating(true)}>
            <Plus size={17} />
            Add Job Card
          </button>
        )}
      </div>
      {creating && (
        <AddJobCardDialog
          state={state}
          mutate={mutate}
          actor={actingUser}
          onClose={() => setCreating(false)}
        />
      )}
      {dialogJob && (
        <JobRecordDialog
          view={dialogJob}
          state={state}
          mutate={mutate}
          actor={actingUser}
          mode={archivedOnly ? "view" : (record?.mode ?? "view")}
          historical={archivedOnly}
          onClose={() => setRecord(undefined)}
          onAdminArchive={
            !archivedOnly
              ? () =>
                  mutate((db) =>
                    cancelJobCard(
                      db,
                      dialogJob.job.id,
                      "Admin override: archived from Management Hub",
                    ),
                  )
              : undefined
          }
        />
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search job cards"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job card, vehicle or customer"
          />
        </label>
        <label>
          Status
          <select
            aria-label="Job status filter"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All statuses</option>
            {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map(
              (value) => (
                <option key={value}>{value}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Estimated Delivery Date
          <input
            aria-label="Estimated delivery date"
            type="date"
            value={deliveryDate}
            onChange={(event) => {
              setDeliveryDate(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Estimated Delivery Month
          <input
            aria-label="Estimated delivery month"
            type="month"
            value={deliveryMonth}
            onChange={(event) => {
              setDeliveryMonth(event.target.value);
              setPage(1);
            }}
          />
        </label>
        {actingUser.role === "admin" && (
          <Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
        )}
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setStatus("ALL");
            setDeliveryDate("");
            setDeliveryMonth("");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Job Cards",
              filters: activeFilterSummary({
                Search: search.trim(),
                Status: status,
                "Estimated Delivery Date": deliveryDate,
                "Estimated Delivery Month": deliveryDate ? "" : deliveryMonth,
                "Show archived only": archivedOnly ? "Yes" : "No",
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Job card records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount > 0 && (
        <div className="table-wrap manage-job-table">
          <table aria-label="Managed job cards">
            <thead>
              <tr>
                {[
                  "Job Card",
                  "Vehicle",
                  "Customer",
                  "Estimated Delivery Date",
                  "Status",
                  "Actions",
                ].map(
                  (header) => (
                    <th key={header}>{header}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((row) => (
                <tr key={row.job.id}>
                  <td>{row.job.job_no}</td>
                  <td>
                    {row.vehicle.number} · {row.vehicle.make}{" "}
                    {row.vehicle.model}
                  </td>
                  <td>{row.customer.name}</td>
                  <td>{row.job.estimated_delivery || "—"}</td>
                  <td>
                    <Status
                      status={row.job.main_status}
                      sub={row.job.sub_status}
                    />
                  </td>
                  <td>
                    <RecordActions
                      inGrid
                      onView={() => setRecord({ id: row.job.id, mode: "view" })}
                      onEdit={
                        !archivedOnly
                          ? () => setRecord({ id: row.job.id, mode: "edit" })
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton
            onClick={() => {
              setSearch("");
              setStatus("ALL");
              setPage(1);
            }}
            label="Clear filters"
          />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

function EstimateManager({
  view,
  mutate,
  actor,
}: {
  view?: JobView;
  mutate: Mutate;
  actor: User;
}) {
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Estimates</h3>
      </div>
      {view ? (
        <EstimateEditor view={view} mutate={mutate} actor={actor} />
      ) : (
        <p className="empty-state">Select a job first.</p>
      )}
    </div>
  );
}

function TaskQcManager({
  view,
  users,
  mutate,
}: {
  view?: JobView;
  users: User[];
  mutate: Mutate;
}) {
  const [addingTask, setAddingTask] = useState(false);
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Tasks / QC</h3>
        <div className="action-row">
          <button
            className="primary-action"
            disabled={!view}
            onClick={() => setAddingTask(true)}
          >
            Add Task
          </button>
          <span className="override-badge">Admin override controls</span>
        </div>
      </div>
      {addingTask && view && (
        <Dialog title="Add Task" onClose={() => setAddingTask(false)}>
          <TaskCreator
            embedded
            view={view}
            users={users}
            mutate={mutate}
            onCreated={() => setAddingTask(false)}
          />
        </Dialog>
      )}
      {view ? (
        <QcEditor
          view={view}
          technicianId={view.job.technician_id}
          mutate={mutate}
        />
      ) : (
        <p className="empty-state">Select a job first.</p>
      )}
    </div>
  );
}

function InventoryMaterialsManager({
  state,
  mutate,
}: {
  state: WorkshopState;
  mutate: Mutate;
}) {
  const [addingItem, setAddingItem] = useState(false);
  const [addingRequest, setAddingRequest] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filtered = state.inventory.filter(
    (item) =>
      !needle ||
      normalizeSearch(
        `${item.sku} ${item.name} ${item.category} ${item.unit}`,
      ).includes(needle),
  );
  const paged = paginate(filtered, page, pageSize);
  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Inventory / Materials</h3>
        <div className="action-row">
          <button
            className="primary-action"
            onClick={() => setAddingItem(true)}
          >
            Add / Edit Inventory Item
          </button>
          <button
            className="primary-action"
            onClick={() => setAddingRequest(true)}
          >
            Add / Edit Material Request
          </button>
        </div>
      </div>
      {addingItem && (
        <Dialog
          title="Inventory Item"
          subtitle="Master, stock-in and adjustment"
          onClose={() => setAddingItem(false)}
        >
          <InventoryEditor embedded state={state} mutate={mutate} />
        </Dialog>
      )}
      {addingRequest && (
        <Dialog
          title="Material Request"
          subtitle="Job-linked material request"
          onClose={() => setAddingRequest(false)}
        >
          <MaterialRequestEditor embedded state={state} mutate={mutate} />
        </Dialog>
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search inventory / materials"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="SKU, name, category or unit"
          />
        </label>
        <ListSearchActions onClear={clearSearch} />
      </div>
      <PaginationToolbar
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Inventory records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      <div className="record-list">
        {paged.items.map((item) => (
          <div className="managed-record" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <span>
                {item.sku} · {item.category} · Stock {item.stock_qty}{" "}
                {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton onClick={clearSearch} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

export function UserManager({
  users,
  mutate,
  actingUser,
  cognitoConfig,
}: {
  users: User[];
  mutate: Mutate;
  actingUser: User;
  cognitoConfig?: CognitoConfig;
}) {
  if (cognitoConfig)
    return (
      <RemoteUserManager
        config={cognitoConfig}
        actorId={actingUser.externalId}
      />
    );
  const empty: User = {
    id: 0,
    name: "",
    email: "",
    role: "service",
    password: "",
  };
  const [draft, setDraft] = useState<User>(empty);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  // sql.js only ever returns active (non-archived) users here (readState filters archived_at is null),
  // so "Active" is the only status this session can observe; the filter is kept for the spec's UI
  // shape and to make the (empty) "Archived" branch explicit rather than silently dropping the control.
  const filtered = users.filter(
    (item) =>
      (!needle ||
        normalizeSearch(
          `${item.name} ${item.email} ${roleLabels[item.role]}`,
        ).includes(needle)) &&
      (roleFilter === "ALL" || item.role === roleFilter) &&
      (statusFilter === "ALL" || statusFilter === "ACTIVE"),
  );
  const paged = paginate(filtered, page, pageSize);
  const userColumns: ExportColumn<User>[] = [
    { header: "Name", value: (item) => item.name },
    { header: "Email", value: (item) => item.email },
    { header: "Role", value: (item) => roleLabels[item.role] },
    { header: "Status", value: () => "Active" },
  ];
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Users</h3>
        <button
          className="primary-action"
          onClick={() => {
            setDraft(empty);
            setEditing(true);
          }}
        >
          Add User
        </button>
      </div>
      {editing && (
        <Dialog
          title={draft.id ? "Edit User" : "Add User"}
          onClose={() => setEditing(false)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (
                mutate((db) =>
                  draft.id
                    ? updateUser(db, draft.id, draft)
                    : createUser(db, draft),
                )
              )
                setEditing(false);
            }}
          >
            <div className="form-grid">
              <label>
                User name
                <input
                  required
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <label>
                User email
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft({ ...draft, email: event.target.value })
                  }
                />
              </label>
              <label>
                User role
                <select
                  value={draft.role}
                  onChange={(event) =>
                    setDraft({ ...draft, role: event.target.value as Role })
                  }
                >
                  {Object.entries(roleLabels).map(([role, label]) => (
                    <option key={role} value={role}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                User password
                <input
                  required
                  minLength={6}
                  type="password"
                  value={draft.password}
                  onChange={(event) =>
                    setDraft({ ...draft, password: event.target.value })
                  }
                />
              </label>
            </div>
            <div className="action-row">
              <button className="primary-action">Save User</button>
              <button type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search users"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email or role"
          />
        </label>
        <label>
          Role
          <select
            aria-label="Filter users by role"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All roles</option>
            {Object.entries(roleLabels).map(([role, label]) => (
              <option key={role} value={role}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            aria-label="Filter users by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setRoleFilter("ALL");
            setStatusFilter("ALL");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Users",
              filters: activeFilterSummary({
                Search: search.trim(),
                Role:
                  roleFilter === "ALL" ? "ALL" : roleLabels[roleFilter as Role],
                Status: statusFilter,
              }),
              columns: userColumns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="User records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount > 0 && (
        <div className="table-wrap management-table">
          <table aria-label="User manager">
            <thead>
              <tr>
                {["Name", "Email", "Role", "Status", "Actions"].map(
                  (header) => (
                    <th key={header}>{header}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{roleLabels[item.role]}</td>
                  <td>Active</td>
                  <td>
                    <div className="grid-actions">
                      <button
                        type="button"
                        className="grid-action"
                        onClick={() => {
                          setDraft(item);
                          setEditing(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="grid-action grid-action-danger"
                        disabled={item.id === actingUser.id}
                        title={
                          item.id === actingUser.id
                            ? "You cannot archive your own signed-in account"
                            : undefined
                        }
                        onClick={() =>
                          mutate((db) =>
                            archiveUser(
                              db,
                              item.id,
                              "Archived by Admin",
                              actingUser.id,
                            ),
                          )
                        }
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton
            onClick={() => {
              setSearch("");
              setRoleFilter("ALL");
              setStatusFilter("ALL");
              setPage(1);
            }}
            label="Clear filters"
          />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

type RemoteDraft = Pick<
  AdminUser,
  "id" | "name" | "email" | "roleIds" | "branchIds" | "version"
>;

function RemoteUserManager({
  config,
  actorId,
}: {
  config: CognitoConfig;
  actorId?: string;
}) {
  const [directory, setDirectory] = useState<AdminDirectory>({
    users: [],
    roles: [],
    branches: [],
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RemoteDraft>({
    id: "",
    name: "",
    email: "",
    roleIds: [],
    branchIds: [],
    version: 0,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filteredUsers = directory.users.filter(
    (item) =>
      !needle ||
      normalizeSearch(
        `${item.name} ${item.email} ${item.roles.map((role) => role.name).join(" ")} ${item.branches.map((branch) => branch.name).join(" ")} ${item.status}`,
      ).includes(needle),
  );
  const pagedUsers = paginate(filteredUsers, page, pageSize);
  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

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
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
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
      if (
        nextError instanceof AdminApiError &&
        nextError.code === "VERSION_CONFLICT"
      )
        await refresh(true);
    } finally {
      setBusy(false);
    }
  };

  const toggle = (kind: "roleIds" | "branchIds", id: string) => {
    const current = draft[kind];
    setDraft({
      ...draft,
      [kind]: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  };

  const startNew = () => {
    setDraft({
      id: "",
      name: "",
      email: "",
      roleIds: directory.roles[0] ? [directory.roles[0].id] : [],
      branchIds: directory.branches[0] ? [directory.branches[0].id] : [],
      version: 0,
    });
    setEditing(true);
    setError("");
  };

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <div>
          <h3>Users</h3>
          <span>
            Accounts are tenant-scoped and invitations are sent by Cognito.
          </span>
        </div>
        <button className="primary-action" onClick={startNew}>
          Add User
        </button>
      </div>
      {error && (
        <div className="api-error" role="alert">
          {error}
          <button onClick={() => void refresh()}>Retry</button>
        </div>
      )}
      {editing && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.id)
              void run(
                () => adminUsersApi.update(config, draft as AdminUser),
                true,
              );
            else
              void run(
                () =>
                  adminUsersApi.create(config, {
                    name: draft.name,
                    email: draft.email,
                    roleIds: draft.roleIds,
                    branchIds: draft.branchIds,
                  }),
                true,
              );
          }}
        >
          <div className="form-grid">
            <label>
              User name
              <input
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              User email
              <input
                required
                type="email"
                disabled={Boolean(draft.id)}
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
              <small>
                {draft.id
                  ? "Email cannot be changed after invitation."
                  : "Cognito will email a temporary password."}
              </small>
            </label>
          </div>
          <fieldset className="assignment-fieldset">
            <legend>Roles</legend>
            {directory.roles.map((role) => (
              <label key={role.id}>
                <input
                  type="checkbox"
                  checked={draft.roleIds.includes(role.id)}
                  onChange={() => toggle("roleIds", role.id)}
                />
                {role.name}
              </label>
            ))}
          </fieldset>
          <fieldset className="assignment-fieldset">
            <legend>Permitted branches</legend>
            {directory.branches.map((branch) => (
              <label key={branch.id}>
                <input
                  type="checkbox"
                  checked={draft.branchIds.includes(branch.id)}
                  onChange={() => toggle("branchIds", branch.id)}
                />
                {branch.name}
              </label>
            ))}
          </fieldset>
          <div className="action-row">
            <button className="primary-action" disabled={busy}>
              {draft.id ? "Save Changes" : "Invite User"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search remote users"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email, role, branch or status"
          />
        </label>
        <ListSearchActions onClear={clearSearch} />
      </div>
      <PaginationToolbar
        from={pagedUsers.from}
        to={pagedUsers.to}
        totalCount={pagedUsers.totalCount}
        page={pagedUsers.page}
        pageCount={pagedUsers.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Remote user records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {loading ? (
        <p className="empty-state">Loading users…</p>
      ) : (
        pagedUsers.totalCount > 0 && (
          <div className="table-wrap management-table">
            <table aria-label="User manager">
              <thead>
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Roles",
                    "Branches",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedUsers.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      {item.roles.map((role) => role.name).join(", ") || "—"}
                    </td>
                    <td>
                      {item.branches.map((branch) => branch.name).join(", ") ||
                        "—"}
                    </td>
                    <td>
                      <b
                        className={`membership-status ${item.status.toLowerCase()}`}
                      >
                        {item.status === "INVITED"
                          ? "Invitation pending"
                          : item.status}
                      </b>
                    </td>
                    <td>
                      <div className="grid-actions">
                        {item.status === "INVITED" && (
                          <button
                            type="button"
                            className="grid-action"
                            disabled={busy}
                            onClick={() =>
                              void run(() =>
                                adminUsersApi.resend(config, item.id),
                              )
                            }
                          >
                            Resend invite
                          </button>
                        )}
                        <button
                          type="button"
                          className="grid-action"
                          disabled={busy}
                          onClick={() => {
                            setDraft({
                              id: item.id,
                              name: item.name,
                              email: item.email,
                              roleIds: item.roleIds,
                              branchIds: item.branchIds,
                              version: item.version,
                            });
                            setEditing(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="grid-action grid-action-danger"
                          disabled={busy || item.id === actorId}
                          title={
                            item.id === actorId
                              ? "You cannot archive your own signed-in account"
                              : undefined
                          }
                          onClick={() => {
                            const reason = window.prompt(
                              "Why is this user being archived?",
                            );
                            if (reason?.trim())
                              void run(() =>
                                adminUsersApi.archive(config, item.id, reason),
                              );
                          }}
                        >
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
      {!loading && pagedUsers.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching users</h3>
          <FilterClearButton onClick={clearSearch} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={pagedUsers.page}
        pageCount={pagedUsers.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

function DuplicateJobSnapshot({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Status status={view.job.main_status} sub={view.job.sub_status} />
      <Info
        label="Customer"
        value={`${view.customer.name} / ${view.customer.mobile}`}
      />
      <Info
        label="Vehicle"
        value={`${view.vehicle.number} / ${view.vehicle.make} ${view.vehicle.model}`}
      />
      <Info
        label="Visit"
        value={`${view.visit.received_at} / ${view.visit.fuel}`}
      />
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
      <Info
        label="QC Checks"
        value={`${view.qc_checks.filter((item) => item.passed).length}/${view.qc_checks.length}`}
      />
      <Info label="Invoice" value={view.invoice?.invoice_no || "None"} />
      <Info
        label="Payments"
        value={money(view.payments.reduce((sum, item) => sum + item.amount, 0))}
      />
      <Info label="Photos" value={view.photos.length} />
      <Info label="Follow-ups" value={view.followups.length} />
      <Info label="Receipt" value={view.receipt?.receipt_no || "None"} />
      <Info label="Gate Pass" value={view.gate_pass?.gate_pass_no || "None"} />
    </div>
  );
}

function CustomerEditor({
  value,
  setValue,
  mutate,
  embedded = false,
  onSaved,
}: {
  value: Customer;
  setValue: (value: Customer) => void;
  mutate: Mutate;
  embedded?: boolean;
  onSaved?: () => void;
}) {
  return (
    <form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        if (
          mutate((db) =>
            value.id
              ? updateCustomer(db, value.id, value)
              : createCustomer(db, value),
          )
        )
          onSaved?.();
      }}
    >
      {!embedded && (
        <PanelTitle
          icon={<UserRound />}
          title="Customer Form"
          subtitle={value.id ? "Edit selected customer" : "Add customer"}
        />
      )}
      <label>
        Customer name
        <input
          aria-label="Customer name"
          required
          value={value.name}
          onChange={(event) => setValue({ ...value, name: event.target.value })}
        />
      </label>
      <label>
        Mobile
        <input
          required
          value={value.mobile}
          onChange={(event) =>
            setValue({ ...value, mobile: event.target.value })
          }
        />
      </label>
      <label>
        Type
        <input
          required
          value={value.type}
          onChange={(event) => setValue({ ...value, type: event.target.value })}
        />
      </label>
      <div className="action-row">
        <button className="primary-action">Save Customer</button>
        <button
          type="button"
          onClick={() =>
            setValue({ id: 0, name: "", mobile: "", type: "Individual" })
          }
        >
          New
        </button>
        {value.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveCustomer(db, value.id, "Archived from customer master"),
              )
            }
          >
            Archive
          </button>
        )}
      </div>
    </form>
  );
}

function VehicleMasterPanel({
  state,
  value,
  setValue,
  mutate,
  embedded = false,
  onSaved,
}: {
  state: WorkshopState;
  value: Vehicle;
  setValue: (value: Vehicle) => void;
  mutate: Mutate;
  embedded?: boolean;
  onSaved?: () => void;
}) {
  const [draft, setDraft] = useState<Vehicle>(value);
  return (
    <form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        if (
          mutate((db) =>
            draft.id
              ? updateVehicle(db, draft.id, draft)
              : createVehicle(db, draft),
          )
        )
          onSaved?.();
      }}
    >
      {!embedded && (
        <PanelTitle
          icon={<Car />}
          title="Vehicle Form"
          subtitle="Vehicle master CRUD"
        />
      )}
      <select
        value={draft.id}
        onChange={(event) => {
          const next = state.vehicles.find(
            (item) => item.id === Number(event.target.value),
          ) ?? {
            id: 0,
            customer_id: state.customers[0]?.id ?? 0,
            number: "",
            make: "",
            model: "",
            color: "",
            km: 0,
          };
          setDraft(next);
          setValue(next);
        }}
      >
        <option value={0}>New vehicle</option>
        {state.vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.number}
          </option>
        ))}
      </select>
      <label>
        Customer
        <select
          value={draft.customer_id}
          onChange={(event) =>
            setDraft({ ...draft, customer_id: Number(event.target.value) })
          }
        >
          {state.customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label>
          Number
          <input
            value={draft.number}
            onChange={(event) =>
              setDraft({ ...draft, number: event.target.value })
            }
          />
        </label>
        <label>
          Make
          <input
            value={draft.make}
            onChange={(event) =>
              setDraft({ ...draft, make: event.target.value })
            }
          />
        </label>
        <label>
          Model
          <input
            value={draft.model}
            onChange={(event) =>
              setDraft({ ...draft, model: event.target.value })
            }
          />
        </label>
        <label>
          Color
          <input
            value={draft.color}
            onChange={(event) =>
              setDraft({ ...draft, color: event.target.value })
            }
          />
        </label>
        <label>
          KM
          <input
            type="number"
            value={draft.km}
            onChange={(event) =>
              setDraft({ ...draft, km: Number(event.target.value) })
            }
          />
        </label>
      </div>
      <div className="action-row">
        <button className="primary-action">Save Vehicle</button>
        {draft.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveVehicle(db, draft.id, "Archived from vehicle master"),
              )
            }
          >
            Archive
          </button>
        )}
      </div>
    </form>
  );
}

function DuplicateVisitEditor({
  view,
  advisors,
  mutate,
}: {
  view: JobView;
  advisors: User[];
  mutate: Mutate;
}) {
  const [draft, setDraft] = useState({
    advisor_id: view.visit.advisor_id,
    fuel: view.visit.fuel,
    keys: view.visit.keys,
    accessories: view.visit.accessories,
    requested_work: view.visit.requested_work,
    photos_note: view.visit.photos_note,
  });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        mutate((db) => updateVisit(db, view.visit.id, draft));
      }}
    >
      <label>
        Advisor
        <select
          value={draft.advisor_id}
          onChange={(event) =>
            setDraft({ ...draft, advisor_id: Number(event.target.value) })
          }
        >
          {advisors.map((advisor) => (
            <option key={advisor.id} value={advisor.id}>
              {advisor.name}
            </option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label>
          Fuel
          <input
            value={draft.fuel}
            onChange={(event) =>
              setDraft({ ...draft, fuel: event.target.value })
            }
          />
        </label>
        <label>
          Keys
          <input
            value={draft.keys}
            onChange={(event) =>
              setDraft({ ...draft, keys: event.target.value })
            }
          />
        </label>
        <label>
          Accessories
          <input
            value={draft.accessories}
            onChange={(event) =>
              setDraft({ ...draft, accessories: event.target.value })
            }
          />
        </label>
        <label>
          Photo Note
          <input
            value={draft.photos_note}
            onChange={(event) =>
              setDraft({ ...draft, photos_note: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        Requested Work
        <input
          value={draft.requested_work}
          onChange={(event) =>
            setDraft({ ...draft, requested_work: event.target.value })
          }
        />
      </label>
      <button className="primary-action">Save Visit</button>
    </form>
  );
}

function JobEditor({
  view,
  users,
  mutate,
  actor,
  embedded = false,
}: {
  view: JobView;
  users: User[];
  mutate: Mutate;
  actor: User;
  embedded?: boolean;
}) {
  const [draft, setDraft] = useState({
    advisor_id: view.job.advisor_id,
    technician_id: view.job.technician_id,
    work_list: view.job.work_list,
    promised_at: view.job.promised_at,
    advisor_notes: view.job.advisor_notes ?? "",
    customer_instructions: view.job.customer_instructions ?? "",
    internal_instructions: view.job.internal_instructions ?? "",
    service_type: view.job.service_type ?? "",
    pickup_drop: view.job.pickup_drop ?? "",
    estimated_delivery: view.job.estimated_delivery ?? "",
    fuel: view.visit.fuel ?? "",
    accessories: view.visit.accessories ?? "",
    engine_no: view.vehicle.engine_no ?? "",
    address: view.customer.address ?? "",
  });
  const [error, setError] = useState("");
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          mutate(
            (db) => saveJobDetailsForActor(db, view.job.id, actor.id, draft),
            setError,
          );
        }}
      >
        <div className="form-grid">
          <label className="locked-assignment-field">
            Service advisor
            <select
              aria-label="Service advisor (locked)"
              value={draft.advisor_id}
              disabled
            >
              {users
                .filter((item) => item.role === "service")
                .map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.name}
                  </option>
                ))}
            </select>
            <small>This assignment is locked and cannot be changed here.</small>
          </label>
          <label>
            Technician
            <select
              value={draft.technician_id}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  technician_id: Number(event.target.value),
                })
              }
            >
              {users
                .filter((item) => item.role === "tech")
                .map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Main Status
            <select
              aria-label="Main Status"
              disabled
              value={view.job.main_status}
            >
              <option>{view.job.main_status}</option>
            </select>
          </label>
          <label>
            Promised
            <input
              value={draft.promised_at}
              onChange={(event) =>
                setDraft({ ...draft, promised_at: event.target.value })
              }
            />
          </label>
        </div>
        <label>
          Work List
          <input
            value={draft.work_list}
            onChange={(event) =>
              setDraft({ ...draft, work_list: event.target.value })
            }
          />
        </label>
        <label>
          Customer Instructions
          <input
            value={draft.customer_instructions}
            onChange={(event) =>
              setDraft({ ...draft, customer_instructions: event.target.value })
            }
          />
        </label>
        <label>
          Internal Instructions
          <input
            value={draft.internal_instructions}
            onChange={(event) =>
              setDraft({ ...draft, internal_instructions: event.target.value })
            }
          />
        </label>
        <label>
          Advisor Notes
          <input
            value={draft.advisor_notes}
            onChange={(event) =>
              setDraft({ ...draft, advisor_notes: event.target.value })
            }
          />
        </label>
        <h4>Job Sheet</h4>
        <div className="form-grid">
          <label>
            Service Type
            <select
              value={draft.service_type}
              onChange={(event) =>
                setDraft({ ...draft, service_type: event.target.value })
              }
            >
              <option value="">—</option>
              {SERVICE_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Pickup / Drop
            <select
              value={draft.pickup_drop}
              onChange={(event) =>
                setDraft({ ...draft, pickup_drop: event.target.value })
              }
            >
              <option value="">—</option>
              {PICKUP_DROP_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Estimated Delivery Date
            <input
              type="date"
              value={draft.estimated_delivery}
              onChange={(event) =>
                setDraft({ ...draft, estimated_delivery: event.target.value })
              }
            />
          </label>
          <label>
            Fuel
            <select
              value={draft.fuel}
              onChange={(event) =>
                setDraft({ ...draft, fuel: event.target.value })
              }
            >
              {[...new Set([draft.fuel, ...FUEL_LEVELS])]
                .filter(Boolean)
                .map((item) => (
                  <option key={item}>{item}</option>
                ))}
            </select>
          </label>
          <label>
            Accessories
            <input
              value={draft.accessories}
              onChange={(event) =>
                setDraft({ ...draft, accessories: event.target.value })
              }
            />
          </label>
          <label>
            Engine Number
            <input
              value={draft.engine_no}
              onChange={(event) =>
                setDraft({ ...draft, engine_no: event.target.value })
              }
            />
          </label>
        </div>
        <label>
          Address
          <input
            value={draft.address}
            onChange={(event) =>
              setDraft({ ...draft, address: event.target.value })
            }
          />
        </label>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        <button className="primary-action">Save Job Details</button>
      </form>
      {embedded && (
        <JobLifecyclePanel
          view={view}
          users={users}
          actor={actor}
          mutate={mutate}
          visible
        />
      )}
      {!embedded && (
        <>
          <JobLifecyclePanel
            view={view}
            users={users}
            actor={actor}
            mutate={mutate}
            visible
          />
          <section
            className="editor-block job-card-documents"
            aria-label="Current job documents"
          >
            <PanelTitle
              icon={<FileText />}
              title="Current Documents"
              subtitle="Only active records are available"
            />
            <JobDocuments view={view} actor={actor} mutate={mutate} />
          </section>
        </>
      )}
    </>
  );
}

function JobLifecyclePanel({
  view,
  users,
  actor,
  mutate,
  visible = false,
}: {
  view: JobView;
  users: User[];
  actor: User;
  mutate: Mutate;
  visible?: boolean;
}) {
  if (!visible) return null;
  const [target, setTarget] = useState<MainStatus>();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const allowed = MAIN_STATUS_TRANSITIONS[view.job.main_status].filter(
    (status) => canTransitionJobStatus(actor, view.job, status),
  );
  const terminal = isTerminalMainStatus(view.job.main_status);
  const canMutate =
    canMutateJobLifecycle(actor, view.job) &&
    !terminal &&
    view.job.main_status !== "HOLD";
  const cycle = [...view.checklist_cycles].sort((a, b) => b.id - a.id)[0];
  const items = view.checklist_items
    .filter((item) => item.checklist_cycle_id === cycle?.id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const firstOpen = items.findIndex((item) => !item.checked_at);
  const remaining = items.filter((item) => !item.checked_at);
  const toggleNotApplicable = (item: ChecklistItem, notApplicable: boolean) => {
    setError("");
    mutate(
      (db) =>
        setChecklistItemNotApplicableForActor(
          db,
          item.id,
          actor.id,
          notApplicable,
        ),
      setError,
    );
  };
  const toggle = (item: ChecklistItem, checked: boolean) => {
    setError("");
    mutate(
      (db) => setChecklistItemCheckedForActor(db, item.id, actor.id, checked),
      setError,
    );
  };
  const confirm = (event: FormEvent) => {
    event.preventDefault();
    if (!note.trim()) {
      setError("A confirmation note is required.");
      return;
    }
    if (
      target &&
      mutate(
        (db) =>
          transitionJobStatusForActor(db, view.job.id, actor.id, target, note),
        setError,
      )
    ) {
      setTarget(undefined);
      setNote("");
      setError("");
    }
  };
  return (
    <section
      className="editor-block lifecycle-panel"
      aria-label="Job lifecycle"
    >
      <div className="job-card-header">
        <span
          className={`status-badge status-${view.job.main_status.toLowerCase()}`}
        >
          {view.job.main_status.replace("_", " ")}
        </span>
        <span className="job-card-header-meta">
          {view.job.job_no} · {view.vehicle.number}
        </span>
      </div>
      {view.material_approval?.status === "Rejected" &&
        actor.role === "service" &&
        actor.id === view.job.advisor_id && (
          <div className="action-row">
            <span className="permission-note">
              Material approval rejected:{" "}
              {view.material_approval.rejection_reason}
            </span>
            <button
              type="button"
              className="primary-action"
              onClick={() =>
                mutate(
                  (db) =>
                    resubmitMaterialApprovalForActor(db, view.job.id, actor.id),
                  setError,
                )
              }
            >
              Resubmit for Approval
            </button>
          </div>
        )}
      {allowed.length > 0 && (
        <div className="action-row">
          {allowed.map((status) => (
            <button
              type="button"
              key={status}
              className={
                status === "CANCELLED" ? "danger-action" : "primary-action"
              }
              disabled={status === "COMPLETED" && !canCompleteWithInvoice(view)}
              title={
                status === "COMPLETED" && !canCompleteWithInvoice(view)
                  ? "Create an Invoice before completing the job."
                  : undefined
              }
              onClick={() => {
                setTarget(status);
                setNote("");
                setError("");
              }}
            >
              {lifecycleActionLabel(view.job.main_status, status)}
            </button>
          ))}
        </div>
      )}
      {error && !target && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <PanelTitle
        icon={<ClipboardList />}
        title="Lifecycle Checklist"
        subtitle={
          cycle
            ? `${cycle.stage} · cycle ${cycle.cycle_number}`
            : "No active cycle"
        }
      />
      <p className="remaining-steps" aria-live="polite">
        {remaining.length
          ? `${remaining.length} remaining: ${remaining.map((item) => item.label).join(" → ")}`
          : "All steps complete. The next lifecycle action is available."}
      </p>
      <ol className="lifecycle-checklist">
        {items.map((item, index) => {
          const laterChecked = items.some(
            (candidate) =>
              candidate.sort_order > item.sort_order && candidate.checked_at,
          );
          const isPayment = item.label === "Payment Received";
          const artifactLocked =
            (item.label === "Create Estimate" && !view.estimate) ||
            ((item.label === "Invoice Ready" || isPayment) && !view.invoice);
          const blockedByEarlier = items.some(
            (candidate) =>
              candidate.sort_order < item.sort_order &&
              candidate.required &&
              !candidate.checked_at,
          );
          const rolePermits = isPayment
            ? canMutateBilling(actor) &&
              !terminal &&
              view.job.main_status !== "HOLD"
            : canMutate;
          const enabled =
            rolePermits &&
            !artifactLocked &&
            (item.checked_at ? !laterChecked && !isPayment : !blockedByEarlier);
          const notApplicable = Boolean(item.na_at);
          const actorName =
            item.checked_by === 0
              ? "System"
              : users.find((user) => user.id === item.checked_by)?.name;
          const detail = notApplicable
            ? `N/A ${formatTimestamp(item.na_at!)}${actorName ? ` by ${users.find((user) => user.id === item.na_by)?.name ?? actorName}` : ""}`
            : item.checked_at
              ? `Completed ${formatTimestamp(item.checked_at)}${actorName ? ` by ${actorName}` : ""}`
              : item.started_at
                ? `Started ${formatTimestamp(item.started_at)}`
                : artifactLocked
                  ? `Available after the ${item.label === "Invoice Ready" || isPayment ? "invoice" : "estimate"} is saved`
                  : "Waiting for the previous step";
          return (
            <li
              key={item.id}
              className={
                item.checked_at
                  ? "complete"
                  : index === firstOpen
                    ? "active"
                    : "locked"
              }
            >
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(item.checked_at)}
                  disabled={!enabled}
                  onChange={(event) => toggle(item, event.target.checked)}
                />
                <span>
                  <strong>
                    {item.label}
                    {!item.required && (
                      <em className="optional-tag"> (optional)</em>
                    )}
                  </strong>
                  <small>{detail}</small>
                </span>
              </label>
              {canMutate &&
                !artifactLocked &&
                (notApplicable || !item.checked_at) &&
                !(
                  !notApplicable &&
                  (MATERIALS_CHECKLIST_LABELS as readonly string[]).includes(
                    item.label,
                  ) &&
                  view.material_requests.length > 0
                ) && (
                  <button
                    type="button"
                    className="link-action"
                    disabled={notApplicable && laterChecked}
                    onClick={() => toggleNotApplicable(item, !notApplicable)}
                  >
                    {notApplicable ? "Undo N/A" : "Mark N/A"}
                  </button>
                )}
            </li>
          );
        })}
      </ol>
      {terminal && (
        <p className="permission-note">
          This job is {view.job.main_status} and read-only.
        </p>
      )}
      {!terminal && !canMutate && allowed.length === 0 && (
        <p className="permission-note">
          Read only. Lifecycle changes are limited to the Owner and the linked
          Service Advisor.
        </p>
      )}
      {target && (
        <Dialog
          title={`${lifecycleActionLabel(view.job.main_status, target)}?`}
          subtitle={`${view.job.job_no}: ${view.job.main_status} → ${target}`}
          onClose={() => {
            setTarget(undefined);
            setError("");
          }}
          footer={
            <button
              className="primary-action"
              type="submit"
              form="lifecycle-confirm-form"
            >
              Confirm status change
            </button>
          }
        >
          <form id="lifecycle-confirm-form" onSubmit={confirm}>
            <label>
              Confirmation note
              <textarea
                data-dialog-initial-focus
                aria-describedby="lifecycle-note-help"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
            <p id="lifecycle-note-help" className="field-help">
              Required. This note is recorded in status history.
            </p>
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
          </form>
        </Dialog>
      )}
    </section>
  );
}

function ApproveEstimateDialog({
  view,
  actor,
  mutate,
  onClose,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [note, setNote] = useState("Customer approved");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (
      mutate(
        (db) => approveEstimateForActor(db, view.job.id, actor.id, note),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      title="Approve Estimate?"
      subtitle={`${view.job.job_no} · Approval records the customer confirmation`}
      onClose={onClose}
      footer={
        <button
          className="primary-action"
          type="submit"
          form="approve-estimate-form"
        >
          Approve Estimate
        </button>
      }
    >
      <form id="approve-estimate-form" onSubmit={submit}>
        <label>
          Approval note
          <textarea
            data-dialog-initial-focus
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
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
  return Number.isNaN(date.valueOf())
    ? value
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function EstimateEditor({
  view,
  mutate,
  actor,
}: {
  view: JobView;
  mutate: Mutate;
  actor: User;
}) {
  const [open, setOpen] = useState(false);
  const canMutate = canMutateJobLifecycle(actor, view.job);
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<ReceiptText />}
        title="Estimate"
        subtitle={
          view.estimate
            ? `${view.estimate.status} · ${view.estimate_items.length} items`
            : "Not created"
        }
      />
      {view.estimate_items.map((existing) => (
        <div className="row" key={existing.id}>
          <strong>{existing.description}</strong>
          <span>
            {existing.kind} ·{" "}
            {existing.gst_type ??
              (existing.gst_rate === 0 ? "No GST" : "CGST+SGST")}{" "}
            {existing.gst_rate ?? view.estimate?.gst_rate ?? 18}%
          </span>
          <span>{money(existing.qty * existing.rate)}</span>
        </div>
      ))}
      {view.estimate && (
        <>
          <Info label="Discount" value={money(view.estimate.discount)} />
          <Info label="Notes" value={view.estimate.approval_note || "—"} />
          <Info
            label="Total"
            value={money(invoiceItemsTotal(view.estimate_items, view.estimate))}
          />
        </>
      )}
      {canMutate ? (
        <button className="primary-action" onClick={() => setOpen(true)}>
          {view.estimate ? "Edit Estimate" : "Create Estimate"}
        </button>
      ) : (
        <p className="permission-note">
          Read only. Estimate changes are limited to the Owner and the linked
          Service Advisor.
        </p>
      )}
      {open && (
        <EstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

type EstimateDraftRow = {
  key: string;
  kind: "Service" | "Material";
  description: string;
  qty: number;
  rate: number;
  gst_type: GstType;
  gst_rate: number;
};
const GST_RATE_OPTIONS = GST_RATES.map((rate) => ({
  value: rate,
  label: `${rate}%`,
}));

function EstimateDialog({
  view,
  actor,
  mutate,
  onClose,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [items, setItems] = useState<EstimateDraftRow[]>(
    view.estimate_items.map((item) => ({
      key: `saved-${item.id}`,
      kind: item.kind,
      description: item.description,
      qty: item.qty,
      rate: item.rate,
      gst_type: item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST"),
      gst_rate: item.gst_rate ?? view.estimate?.gst_rate ?? 18,
    })),
  );
  const [discount, setDiscount] = useState(view.estimate?.discount ?? 0);
  const [notes, setNotes] = useState(view.estimate?.approval_note ?? "");
  const [error, setError] = useState("");
  const totals = invoiceTotals(items, discount);
  const updateItem = (key: string, patch: Partial<EstimateDraftRow>) =>
    setItems((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  const save = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (
      mutate(
        (db) =>
          saveEstimateForActor(db, view.job.id, actor.id, {
            discount,
            gst_rate: view.estimate?.gst_rate ?? 18,
            notes,
            items,
          }),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      wide
      className="dialog-document-editor estimate-dialog"
      title={`${view.estimate ? "Edit" : "Create"} Estimate`}
      subtitle={`${view.job.job_no} · Changes apply only when saved`}
      onClose={onClose}
      footer={
        <button
          className="primary-action"
          type="submit"
          form="estimate-dialog-form"
        >
          Save Estimate
        </button>
      }
    >
      <form
        id="estimate-dialog-form"
        onSubmit={save}
        className="estimate-dialog-form"
      >
        <div className="estimate-items">
          <div className="line-items-header">
            <strong>Estimate items</strong>
            <button
              type="button"
              className="add-line-item"
              onClick={() =>
                setItems((rows) => [
                  ...rows,
                  {
                    key: `new-${Date.now()}-${rows.length}`,
                    kind: "Service",
                    description: "",
                    qty: 1,
                    rate: 0,
                    gst_type: "CGST+SGST",
                    gst_rate: 18,
                  },
                ])
              }
            >
              + Add Item
            </button>
          </div>
          <div className="estimate-item estimate-item-heading">
            <span>Kind</span>
            <span>Description</span>
            <span>Quantity</span>
            <span>Rate</span>
            <span>GST type</span>
            <span>GST rate</span>
            <span>Action</span>
          </div>
          {items.map((item, index) => (
            <div className="estimate-item" key={item.key}>
              <select
                aria-label={`Item ${index + 1} kind`}
                value={item.kind}
                onChange={(event) =>
                  updateItem(item.key, {
                    kind: event.target.value as EstimateDraftRow["kind"],
                  })
                }
              >
                <option>Service</option>
                <option>Material</option>
              </select>
              <input
                data-dialog-initial-focus={index === 0 ? true : undefined}
                aria-label={`Item ${index + 1} description`}
                value={item.description}
                onChange={(event) =>
                  updateItem(item.key, { description: event.target.value })
                }
              />
              <input
                aria-label={`Item ${index + 1} quantity`}
                type="number"
                min="0.01"
                step="0.01"
                value={item.qty}
                onChange={(event) =>
                  updateItem(item.key, { qty: Number(event.target.value) })
                }
              />
              <input
                aria-label={`Item ${index + 1} rate`}
                type="number"
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(event) =>
                  updateItem(item.key, { rate: Number(event.target.value) })
                }
              />
              <select
                aria-label={`Item ${index + 1} GST type`}
                value={item.gst_type}
                onChange={(event) =>
                  updateItem(item.key, {
                    gst_type: event.target.value as GstType,
                    ...(event.target.value === "No GST"
                      ? { gst_rate: 0 }
                      : { gst_rate: item.gst_rate || 18 }),
                  })
                }
              >
                <option>CGST+SGST</option>
                <option>IGST</option>
                <option>No GST</option>
              </select>
              {item.gst_type === "No GST" ? (
                <span className="gst-no-rate">0%</span>
              ) : (
                <SearchSelect
                  label={`Item ${index + 1} GST rate`}
                  options={GST_RATE_OPTIONS}
                  value={item.gst_rate}
                  onChange={(value) =>
                    updateItem(item.key, { gst_rate: Number(value) })
                  }
                  placeholder="GST rate"
                  hideLabel
                />
              )}
              <button
                type="button"
                className="link-action line-remove"
                aria-label={`Remove item ${index + 1}`}
                onClick={() =>
                  setItems((rows) => rows.filter((row) => row.key !== item.key))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="form-grid estimate-form-grid">
          <label className="estimate-discount">
            Discount
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(event) => setDiscount(Number(event.target.value))}
            />
          </label>
        </div>
        <label className="estimate-notes">
          Notes
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
        <div className="estimate-total">
          <span>Subtotal {money(totals.subtotal)}</span>
          <span>GST {money(totals.gst)}</span>
          <strong>Total {money(totals.total)}</strong>
        </div>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
}

function FollowupEditor({ view, mutate }: { view: JobView; mutate: Mutate }) {
  const [draft, setDraft] = useState<Followup>({
    id: 0,
    job_card_id: view.job.id,
    note: "",
    due_at: new Date().toISOString().slice(0, 10),
    done: 0,
    outcome: "",
  });
  return (
    <form
      className="desk-panel"
      onSubmit={(event) => {
        event.preventDefault();
        mutate((db) =>
          draft.id
            ? updateFollowup(db, draft.id, draft)
            : createFollowup(db, draft),
        );
      }}
    >
      <PanelTitle
        icon={<ClipboardCheck />}
        title="Follow-ups"
        subtitle="Due date, outcome and completion"
      />
      {view.followups.map((followup) => (
        <button
          type="button"
          className={draft.id === followup.id ? "row active" : "row"}
          key={followup.id}
          onClick={() => setDraft(followup)}
        >
          <strong>{followup.due_at}</strong>
          <span>{followup.done ? "Done" : "Open"}</span>
          <span>{followup.note}</span>
        </button>
      ))}
      <label>
        Note
        <input
          value={draft.note}
          onChange={(event) => setDraft({ ...draft, note: event.target.value })}
        />
      </label>
      <div className="form-grid">
        <label>
          Due
          <input
            type="date"
            value={draft.due_at}
            onChange={(event) =>
              setDraft({ ...draft, due_at: event.target.value })
            }
          />
        </label>
        <label>
          Outcome
          <input
            value={draft.outcome ?? ""}
            onChange={(event) =>
              setDraft({ ...draft, outcome: event.target.value })
            }
          />
        </label>
      </div>
      <div className="action-row">
        <button className="primary-action">Save Follow-up</button>
        {draft.id > 0 && (
          <button
            type="button"
            onClick={() =>
              mutate((db) =>
                markFollowupDone(db, draft.id, draft.outcome || "Done"),
              )
            }
          >
            Mark Done
          </button>
        )}
        {draft.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveFollowup(db, draft.id, "Archived follow-up"),
              )
            }
          >
            Archive
          </button>
        )}
      </div>
    </form>
  );
}

function JobMediaPanel({
  view,
  actor,
  mutate,
  embedded = false,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  embedded?: boolean;
}) {
  const [category, setCategory] = useState<JobMediaCategory>("Before Work");
  const [label, setLabel] = useState("");
  const [prepared, setPrepared] = useState<PreparedJobMedia>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Photo>();
  const [archiveTarget, setArchiveTarget] = useState<Photo>();
  const [archiveReason, setArchiveReason] = useState("");
  const categoryStatusAllowed =
    category === "Before Work"
      ? view.job.main_status === "NEW"
      : view.job.main_status === "IN_PROGRESS" ||
        view.job.main_status === "COMPLETED";
  const canMutate =
    canMutateJobLifecycle(actor, view.job) && categoryStatusAllowed;
  const mediaLockMessage =
    category === "Before Work"
      ? "Before Photos are locked after the job leaves NEW."
      : view.job.main_status === "HOLD" ||
          view.job.main_status === "CLOSED" ||
          view.job.main_status === "CANCELLED"
        ? "After Photos are locked while this job is on hold, closed, or cancelled."
        : "After Photos can be added or changed only while the job is IN_PROGRESS or COMPLETED.";
  const rows = view.photos.filter(
    (photo) => photo.category === category && photo.src,
  );
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
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not prepare this image.",
      );
    } finally {
      setBusy(false);
    }
  };
  const upload = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!prepared) {
      setError("Choose an image to upload.");
      return;
    }
    if (
      mutate(
        (db) =>
          saveJobPhotoForActor(db, view.job.id, actor.id, {
            label,
            category,
            ...prepared,
          }),
        setError,
      )
    ) {
      setLabel("");
      setPrepared(undefined);
      const input = document.getElementById(
        `job-media-file-${view.job.id}`,
      ) as HTMLInputElement | null;
      if (input) input.value = "";
    }
  };
  return (
    <section
      className={embedded ? "job-media-panel" : "desk-panel job-media-panel"}
      aria-label="Job card photos and media"
    >
      {!embedded && (
        <PanelTitle
          icon={<Camera />}
          title="Photos / Media"
          subtitle="Compressed images stay in this browser session"
        />
      )}
      <div
        className="sub-tabs media-phase-tabs"
        role="tablist"
        aria-label="Photo work phase"
        onKeyDown={handleTabListKeyDown}
      >
        {(["Before Work", "After Work"] as const).map((phase) => {
          const id = phase === "Before Work" ? "before" : "after";
          return (
            <button
              type="button"
              id={`media-tab-${view.job.id}-${id}`}
              role="tab"
              aria-selected={category === phase}
              aria-controls={`media-panel-${view.job.id}-${id}`}
              tabIndex={category === phase ? 0 : -1}
              className={category === phase ? "active" : ""}
              key={phase}
              onClick={() => setCategory(phase)}
            >
              {phase}
            </button>
          );
        })}
      </div>
      <div
        id={`media-panel-${view.job.id}-${category === "Before Work" ? "before" : "after"}`}
        role="tabpanel"
        aria-labelledby={`media-tab-${view.job.id}-${category === "Before Work" ? "before" : "after"}`}
      >
        {canMutate ? (
          <form className="media-upload" onSubmit={upload}>
            <div className="form-grid">
              <label>
                Photo label
                <input
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  placeholder={`${category} photo`}
                />
              </label>
              <label>
                Image file
                <input
                  id={`job-media-file-${view.job.id}`}
                  aria-describedby={`job-media-help-${view.job.id}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => void chooseFile(event.target.files?.[0])}
                />
              </label>
            </div>
            <p className="field-help" id={`job-media-help-${view.job.id}`}>
              JPEG, PNG, or WebP; maximum input 10 MB. Images are compressed
              below 1 MB and are not stored outside this session.
            </p>
            {prepared && (
              <p className="media-ready" aria-live="polite">
                Ready: {prepared.width} × {prepared.height} ·{" "}
                {Math.ceil(prepared.byteSize / 1024)} KB
              </p>
            )}
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
            <button className="primary-action" disabled={busy}>
              {busy ? "Compressing…" : `Upload to ${category}`}
            </button>
          </form>
        ) : (
          <p className="permission-note">
            {canMutateJobLifecycle(actor, view.job)
              ? mediaLockMessage
              : "Read only. Media changes are limited to the Owner and the linked Service Advisor."}
          </p>
        )}
        {rows.length ? (
          <div className="job-media-gallery" data-testid="job-media-gallery">
            {rows.map((photo) => (
              <article className="job-media-card" key={photo.id}>
                <img src={photo.src} alt={photo.label} />
                <div>
                  <strong>{photo.label}</strong>
                  <span>
                    {photo.original_name || photo.mime_type || "Image"}
                    {photo.byte_size
                      ? ` · ${Math.ceil(photo.byte_size / 1024)} KB`
                      : ""}
                  </span>
                </div>
                {canMutate && (
                  <div className="record-actions">
                    <button type="button" onClick={() => setEditing(photo)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-action"
                      onClick={() => {
                        setArchiveTarget(photo);
                        setArchiveReason("");
                      }}
                    >
                      Archive
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No {category.toLocaleLowerCase()} images yet.
          </p>
        )}
        {editing && (
          <MediaMetadataDialog
            photo={editing}
            actor={actor}
            mutate={mutate}
            onClose={() => setEditing(undefined)}
          />
        )}
        {archiveTarget && (
          <Dialog
            title="Archive photo?"
            subtitle={archiveTarget.label}
            onClose={() => setArchiveTarget(undefined)}
            footer={
              <button
                className="danger-action"
                type="submit"
                form="archive-photo-form"
              >
                Archive photo
              </button>
            }
          >
            <form
              id="archive-photo-form"
              onSubmit={(event) => {
                event.preventDefault();
                setError("");
                if (
                  mutate(
                    (db) =>
                      archiveJobPhotoForActor(
                        db,
                        archiveTarget.id,
                        actor.id,
                        archiveReason,
                      ),
                    setError,
                  )
                )
                  setArchiveTarget(undefined);
              }}
            >
              <label>
                Archive reason
                <textarea
                  data-dialog-initial-focus
                  required
                  value={archiveReason}
                  onChange={(event) => setArchiveReason(event.target.value)}
                />
              </label>
              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}
            </form>
          </Dialog>
        )}
      </div>
    </section>
  );
}

function MediaMetadataDialog({
  photo,
  actor,
  mutate,
  onClose,
}: {
  photo: Photo;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(photo.label);
  const [category, setCategory] = useState<JobMediaCategory>(
    photo.category === "After Work" ? "After Work" : "Before Work",
  );
  const [error, setError] = useState("");
  return (
    <Dialog
      title="Edit photo metadata"
      subtitle={photo.original_name || photo.label}
      onClose={onClose}
      footer={
        <button
          className="primary-action"
          type="submit"
          form="media-metadata-form"
        >
          Save metadata
        </button>
      }
    >
      <form
        id="media-metadata-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (
            mutate(
              (db) =>
                updateJobPhotoForActor(db, photo.id, actor.id, {
                  label,
                  category,
                }),
              setError,
            )
          )
            onClose();
        }}
      >
        <label>
          Photo label
          <input
            data-dialog-initial-focus
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </label>
        <label>
          Work phase
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as JobMediaCategory)
            }
          >
            <option>Before Work</option>
            <option>After Work</option>
          </select>
        </label>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
}

function MaterialRequestEditor({
  state,
  mutate,
  embedded = false,
  store = false,
}: {
  state: WorkshopState;
  mutate: Mutate;
  embedded?: boolean;
  store?: boolean;
}) {
  const emptyRequest = (): MaterialRequest => ({
    id: 0,
    job_card_id: store ? 0 : (state.jobs[0]?.job.id ?? 0),
    item_id: state.inventory[0]?.id ?? 0,
    requested_qty: 1,
    issued_qty: 0,
    used_qty: 0,
    returned_qty: 0,
    wasted_qty: 0,
  });
  const emptyPurchase = (): LocalPurchase => ({
    id: 0,
    job_card_id: 0,
    item_description: "",
    quantity: 1,
    unit: "piece",
    unit_cost: 0,
    vendor: "",
    bill_reference: "",
    note: "",
  });
  const [source, setSource] = useState<"inventory" | "local">("inventory");
  const [draft, setDraft] = useState<MaterialRequest>(emptyRequest);
  const [purchase, setPurchase] = useState<LocalPurchase>(emptyPurchase);
  const [period, setPeriod] = useState<JobPeriod>(todayJobPeriod);
  const [error, setError] = useState("");
  const requests = state.jobs.flatMap((view) =>
    view.material_requests.map((request) => ({
      ...request,
      job_card_id: view.job.id,
    })),
  );
  const purchases = state.jobs.flatMap((view) => view.local_purchases);
  const current = source === "inventory" ? draft : purchase;
  const setJob = (id?: number) =>
    source === "inventory"
      ? setDraft({ ...draft, job_card_id: id ?? 0 })
      : setPurchase({ ...purchase, job_card_id: id ?? 0 });
  const setPeriodForJob = (jobId: number) => {
    const received = state.jobs.find((view) => view.job.id === jobId)?.visit
      .received_at;
    if (!received) return;
    setPeriod({ monthYear: received.slice(0, 7) });
  };
  const selectRequest = (id: number) => {
    const next = requests.find((item) => item.id === id);
    setDraft(next ?? emptyRequest());
    if (next) setPeriodForJob(next.job_card_id);
  };
  const selectPurchase = (id: number) => {
    const next = purchases.find((item) => item.id === id);
    setPurchase(next ?? emptyPurchase());
    if (next) setPeriodForJob(next.job_card_id);
  };
  const save = () => {
    setError("");
    if (!current.job_card_id) {
      setError("Choose a matching job before saving.");
      return;
    }
    if (source === "inventory") {
      if (
        mutate(
          (db) =>
            draft.id
              ? updateMaterialRequest(db, draft.id, draft)
              : createMaterialRequest(db, draft),
          setError,
        ) &&
        !draft.id
      )
        setDraft(emptyRequest());
    } else if (
      mutate(
        (db) =>
          purchase.id
            ? updateLocalPurchase(db, purchase.id, purchase)
            : createLocalPurchase(db, purchase),
        setError,
      ) &&
      !purchase.id
    )
      setPurchase(emptyPurchase());
  };
  return (
    <form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      {!embedded && (
        <PanelTitle
          icon={<PackageCheck />}
          title="Request Form"
          subtitle={
            store
              ? "Inventory request or tracking-only local purchase"
              : "Job-linked material request"
          }
        />
      )}
      {store && (
        <fieldset className="source-toggle">
          <legend>Source</legend>
          <label>
            <input
              type="radio"
              checked={source === "inventory"}
              onChange={() => {
                setSource("inventory");
                setError("");
              }}
            />
            Inventory
          </label>
          <label>
            <input
              type="radio"
              checked={source === "local"}
              onChange={() => {
                setSource("local");
                setError("");
              }}
            />
            Local purchase
          </label>
        </fieldset>
      )}
      {source === "inventory" ? (
        <>
          <label>
            Request
            <select
              value={draft.id}
              onChange={(event) => selectRequest(Number(event.target.value))}
            >
              <option value={0}>New request</option>
              {requests.map((request) => (
                <option key={request.id} value={request.id}>
                  Request #{request.id}
                </option>
              ))}
            </select>
          </label>
          {store ? (
            <JobPicker
              jobs={state.jobs}
              selectedJobId={draft.job_card_id || undefined}
              onSelect={setJob}
              label="Material request job"
              period={period}
              onPeriodChange={setPeriod}
            />
          ) : (
            <label>
              Job
              <select
                value={draft.job_card_id}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    job_card_id: Number(event.target.value),
                  })
                }
              >
                {state.jobs.map((job) => (
                  <option key={job.job.id} value={job.job.id}>
                    {job.job.job_no}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Item
            <select
              value={draft.item_id}
              onChange={(event) =>
                setDraft({ ...draft, item_id: Number(event.target.value) })
              }
            >
              {state.inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Requested Qty
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={draft.requested_qty}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  requested_qty: Number(event.target.value),
                })
              }
            />
          </label>
        </>
      ) : (
        <>
          <label>
            Local purchase
            <select
              value={purchase.id}
              onChange={(event) => selectPurchase(Number(event.target.value))}
            >
              <option value={0}>New local purchase</option>
              {purchases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_description} · {item.bill_reference}
                </option>
              ))}
            </select>
          </label>
          <JobPicker
            jobs={state.jobs}
            selectedJobId={purchase.job_card_id || undefined}
            onSelect={setJob}
            label="Local purchase job"
            period={period}
            onPeriodChange={setPeriod}
          />
          <div className="form-grid">
            <label>
              Item description
              <input
                required
                value={purchase.item_description}
                onChange={(event) =>
                  setPurchase({
                    ...purchase,
                    item_description: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Quantity
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={purchase.quantity}
                onChange={(event) =>
                  setPurchase({
                    ...purchase,
                    quantity: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Unit
              <input
                required
                value={purchase.unit}
                onChange={(event) =>
                  setPurchase({ ...purchase, unit: event.target.value })
                }
              />
            </label>
            <label>
              Unit cost
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={purchase.unit_cost}
                onChange={(event) =>
                  setPurchase({
                    ...purchase,
                    unit_cost: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Vendor / shop
              <input
                required
                value={purchase.vendor}
                onChange={(event) =>
                  setPurchase({ ...purchase, vendor: event.target.value })
                }
              />
            </label>
            <label>
              Bill / reference
              <input
                required
                value={purchase.bill_reference}
                onChange={(event) =>
                  setPurchase({
                    ...purchase,
                    bill_reference: event.target.value,
                  })
                }
              />
            </label>
          </div>
          <label>
            Note (optional)
            <textarea
              value={purchase.note ?? ""}
              onChange={(event) =>
                setPurchase({ ...purchase, note: event.target.value })
              }
            />
          </label>
        </>
      )}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <div className="action-row">
        <button className="primary-action">
          {source === "local" ? "Save Local Purchase" : "Save Request"}
        </button>
        {source === "inventory" && draft.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate(
                (db) =>
                  archiveMaterialRequest(
                    db,
                    draft.id,
                    "Archived material request",
                  ),
                setError,
              )
            }
          >
            Archive
          </button>
        )}
        {source === "local" && purchase.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate(
                (db) =>
                  archiveLocalPurchase(
                    db,
                    purchase.id,
                    "Archived local purchase",
                  ),
                setError,
              )
            }
          >
            Archive
          </button>
        )}
      </div>
    </form>
  );
}

function IssueMaterialEditor() {
  return (
    <aside className="desk-panel">
      <PanelTitle
        icon={<Package />}
        title="Governed release"
        subtitle="Only requested rows for active or held jobs appear in this queue."
      />
      <p className="muted">
        Use Release on a row, verify the job, item, requested quantity and
        available stock, then confirm the full audited issue.
      </p>
    </aside>
  );
}

function ReleaseMaterialDialog({
  row,
  actor,
  mutate,
  onClose,
}: {
  row: StoreRequestRow;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const item = row.item;
  const available = item?.stock_qty ?? 0;
  const confirm = () => {
    setError("");
    if (
      mutate(
        (db) => releaseMaterialRowForActor(db, row.request.id, actor.id),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      title="Confirm material release"
      subtitle={`${row.view.job.job_no} · ${row.view.vehicle.number}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-action" onClick={confirm}>
            Confirm release
          </button>
        </>
      }
    >
      <div className="record-view">
        <Info label="Job" value={row.view.job.job_no} />
        <Info
          label="Item"
          value={item?.name ?? `Item ${row.request.item_id}`}
        />
        <Info
          label="Requested quantity"
          value={`${row.request.requested_qty} ${item?.unit ?? ""}`}
        />
        <Info
          label="Available stock"
          value={`${available} ${item?.unit ?? ""}`}
        />
      </div>
      {row.request.requested_qty > available && (
        <p className="error-text" role="alert">
          Insufficient stock: this release needs {row.request.requested_qty}{" "}
          {item?.unit ?? "units"}, but only {available} is available.
        </p>
      )}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </Dialog>
  );
}

function MaterialApprovalSubmitDialog({
  row,
  actor,
  mutate,
  onClose,
}: {
  row: StoreRequestRow;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const submit = () => {
    setError("");
    if (
      mutate(
        (db) => submitMaterialApprovalForActor(db, row.request.id, actor.id),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      title="Send job for material approval"
      subtitle={`${row.view.job.job_no} · all outstanding requested materials`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-action" onClick={submit}>
            Needs Approval
          </button>
        </>
      }
    >
      <p>
        This holds the job and sends one consolidated material request to Admin.
        Store cannot issue or change materials until a decision is made.
      </p>
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </Dialog>
  );
}

function ReconcileEditor({
  row,
  mutate,
  onClose,
}: {
  row: StoreRequestRow;
  mutate: Mutate;
  onClose: () => void;
}) {
  const { view, request, item } = row;
  const [used, setUsed] = useState(String(request.used_qty));
  const [returned, setReturned] = useState(String(request.returned_qty));
  const [wasted, setWasted] = useState(String(request.wasted_qty));
  const [zeroRecordedAcknowledged, setZeroRecordedAcknowledged] =
    useState(false);
  const [error, setError] = useState("");
  const quantities = [used, returned, wasted].map((value) =>
    value.trim() === "" ? Number.NaN : Number(value),
  );
  const quantitiesValid = quantities.every(
    (quantity) => Number.isFinite(quantity) && quantity >= 0,
  );
  const [usedQty, returnedQty, wastedQty] = quantities;
  const total = usedQty + returnedQty + wastedQty;
  const withinIssued = quantitiesValid && total <= request.issued_qty;
  const variance = request.issued_qty - total;
  const state = withinIssued && Math.abs(variance) < 0.001 ? "Matched" : "Open";
  const needsZeroAcknowledgement = returnedQty === 0 && wastedQty === 0;
  const canSave =
    withinIssued && (!needsZeroAcknowledgement || zeroRecordedAcknowledged);
  const changeQuantity =
    (setter: (value: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      setZeroRecordedAcknowledged(false);
      setError("");
    };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!quantitiesValid) {
      setError("Enter finite, non-negative quantities.");
      return;
    }
    if (!withinIssued) {
      setError(
        `Reconciliation total cannot exceed the ${request.issued_qty} issued.`,
      );
      return;
    }
    if (needsZeroAcknowledgement && !zeroRecordedAcknowledged) {
      setError(
        "Confirm that neither returned material nor wastage is being recorded.",
      );
      return;
    }
    if (
      mutate(
        (db) =>
          reconcileMaterialQty(db, request.id, usedQty, returnedQty, wastedQty),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      wide
      title="Reconcile Material"
      subtitle={`${view.job.job_no} · ${view.vehicle.number}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="reconcile-material-form"
            className="primary-action"
            disabled={!canSave}
          >
            Save Reconciliation
          </button>
        </>
      }
    >
      <form
        id="reconcile-material-form"
        className="reconcile-dialog-form"
        onSubmit={submit}
      >
        <dl className="reconciliation-context">
          <div>
            <dt>Job card</dt>
            <dd>{view.job.job_no}</dd>
          </div>
          <div>
            <dt>Vehicle</dt>
            <dd>{view.vehicle.number}</dd>
          </div>
          <div>
            <dt>Customer</dt>
            <dd>{view.customer.name}</dd>
          </div>
          <div>
            <dt>Item</dt>
            <dd>{item?.name ?? "Unknown"}</dd>
          </div>
          <div>
            <dt>SKU</dt>
            <dd>{item?.sku ?? "No SKU"}</dd>
          </div>
          <div>
            <dt>Issued</dt>
            <dd>
              {request.issued_qty} {item?.unit ?? ""}
            </dd>
          </div>
        </dl>
        <div className="form-grid">
          <label>
            Used
            <input
              data-dialog-initial-focus
              aria-label="Used quantity"
              type="number"
              min="0"
              step="any"
              value={used}
              onChange={changeQuantity(setUsed)}
            />
          </label>
          <label>
            Returned
            <input
              aria-label="Returned quantity"
              type="number"
              min="0"
              step="any"
              value={returned}
              onChange={changeQuantity(setReturned)}
            />
          </label>
          <label>
            Wasted
            <input
              aria-label="Wasted quantity"
              type="number"
              min="0"
              step="any"
              value={wasted}
              onChange={changeQuantity(setWasted)}
            />
          </label>
        </div>
        <p className="reconciliation-equation">
          {request.issued_qty} issued ={" "}
          {Number.isFinite(usedQty) ? usedQty : "—"} used +{" "}
          {Number.isFinite(returnedQty) ? returnedQty : "—"} returned +{" "}
          {Number.isFinite(wastedQty) ? wastedQty : "—"} wasted +{" "}
          {Number.isFinite(variance) ? variance : "—"} variance
        </p>
        <p className={`reconciliation-state ${state.toLowerCase()}`}>
          State: {state} · Variance:{" "}
          {Number.isFinite(variance) ? variance : "—"}
        </p>
        {needsZeroAcknowledgement && (
          <label className="checkbox-line">
            <input
              aria-label="Confirm no return or wastage"
              type="checkbox"
              checked={zeroRecordedAcknowledged}
              onChange={(event) => {
                setZeroRecordedAcknowledged(event.target.checked);
                setError("");
              }}
            />{" "}
            I confirm that neither returned material nor wastage is being
            recorded.
          </label>
        )}
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
}

const emptyInventoryItem = (): InventoryItem => ({
  id: 0,
  sku: "",
  category: "",
  name: "",
  unit: "piece",
  stock_qty: 0,
  low_stock_qty: 0,
  selling_price: 0,
});

function QuickAddStock({
  inventory,
  actor,
  purchaseOrders,
  purchaseOrderLines,
  mutate,
  onSaved,
}: {
  inventory: InventoryItem[];
  actor: User;
  purchaseOrders: PurchaseOrder[];
  purchaseOrderLines: PurchaseOrderLine[];
  mutate: Mutate;
  onSaved?: () => void;
}) {
  const [addingNew, setAddingNew] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(inventory[0]?.id ?? 0);
  const [inwardQty, setInwardQty] = useState(1);
  const [purchaseOrderId, setPurchaseOrderId] = useState(0);
  const [purchaseOrderLineId, setPurchaseOrderLineId] = useState(0);
  const [draft, setDraft] = useState<InventoryItem>(emptyInventoryItem);
  const [error, setError] = useState("");
  const selected = inventory.find((item) => item.id === selectedId);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const saved = mutate(
      (db) =>
        addingNew
          ? (() => {
              const id = createInventoryItem(db, { ...draft, stock_qty: 0 });
              if (inwardQty > 0)
                recordStockInwardForActor(db, actor.id, {
                  item_id: id,
                  qty: inwardQty,
                  note: "Initial inward",
                });
            })()
          : recordStockInwardForActor(db, actor.id, {
              item_id: selectedId,
              qty: inwardQty,
              note: "Quick inward",
              purchase_order_line_id: purchaseOrderLineId || undefined,
            }),
      setError,
    );
    if (saved) {
      setInwardQty(1);
      if (addingNew) {
        setAddingNew(false);
        setDraft(emptyInventoryItem());
      } else {
        setPurchaseOrderId(0);
        setPurchaseOrderLineId(0);
      }
      onSaved?.();
    }
  };
  return (
    <form className="quick-add-stock" onSubmit={submit}>
      {!addingNew ? (
        <>
          <SearchSelect
            label="Existing SKU"
            options={inventory.map((item) => ({
              value: item.id,
              label: `${item.sku} · ${item.name}`,
            }))}
            value={selectedId || undefined}
            onChange={(value) => setSelectedId(Number(value))}
            placeholder="Search SKU or material"
            openOnFocus={false}
          />
          {selected && (
            <p className="quick-add-selected">
              {selected.name} · {selected.stock_qty} {selected.unit} on hand
            </p>
          )}
          <label>
            Inward quantity
            <input
              aria-label="Inward quantity"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={inwardQty}
              onChange={(event) => setInwardQty(Number(event.target.value))}
            />
          </label>
          <label>
            Purchase order (optional)
            <select
              aria-label="Purchase order"
              value={purchaseOrderId}
              onChange={(event) => {
                setPurchaseOrderId(Number(event.target.value));
                setPurchaseOrderLineId(0);
              }}
            >
              <option value={0}>Unlinked/manual receipt</option>
              {purchaseOrders
                .filter((order) =>
                  ["Sent", "Partially Received", "Ready to Close"].includes(
                    order.status,
                  ),
                )
                .map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.po_number}
                  </option>
                ))}
            </select>
          </label>
          {purchaseOrderId > 0 && (
            <label>
              Purchase order line
              <select
                aria-label="Purchase order line"
                value={purchaseOrderLineId}
                onChange={(event) =>
                  setPurchaseOrderLineId(Number(event.target.value))
                }
              >
                <option value={0}>Select compatible line</option>
                {purchaseOrderLines
                  .filter(
                    (line) =>
                      line.purchase_order_id === purchaseOrderId &&
                      line.item_id === selectedId,
                  )
                  .map((line) => (
                    <option key={line.id} value={line.id}>
                      {
                        purchaseOrders.find(
                          (order) => order.id === purchaseOrderId,
                        )?.po_number
                      }{" "}
                      ·{" "}
                      {inventory.find((item) => item.id === line.item_id)?.name}{" "}
                      · ordered {line.ordered_qty}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <div className="quick-add-actions">
            <button
              type="button"
              data-dialog-initial-focus
              className="link-action"
              onClick={() => setAddingNew(true)}
            >
              Add new SKU
            </button>
            <button
              className="primary-action"
              disabled={
                !selectedId || (purchaseOrderId > 0 && !purchaseOrderLineId)
              }
            >
              Record Inward
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="form-grid">
            <label>
              SKU
              <input
                aria-label="New SKU"
                required
                value={draft.sku}
                onChange={(event) =>
                  setDraft({ ...draft, sku: event.target.value })
                }
              />
            </label>
            <label>
              Material name
              <input
                aria-label="New material name"
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              Category
              <input
                aria-label="New SKU category"
                required
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
              />
            </label>
            <label>
              Unit
              <input
                aria-label="New SKU unit"
                required
                value={draft.unit}
                onChange={(event) =>
                  setDraft({ ...draft, unit: event.target.value })
                }
              />
            </label>
            <label>
              Low-stock threshold
              <input
                aria-label="New SKU low-stock threshold"
                type="number"
                min="0"
                step="0.01"
                required
                value={draft.low_stock_qty}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    low_stock_qty: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Default selling price (₹)
              <input
                aria-label="New SKU selling price"
                type="number"
                min="0"
                step="0.01"
                required
                value={draft.selling_price}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    selling_price: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Initial inward quantity
              <input
                aria-label="Initial inward quantity"
                type="number"
                min="0"
                step="0.01"
                required
                value={inwardQty}
                onChange={(event) => setInwardQty(Number(event.target.value))}
              />
            </label>
          </div>
          <div className="quick-add-actions">
            <button
              type="button"
              className="link-action"
              onClick={() => setAddingNew(false)}
            >
              Choose existing SKU
            </button>
            <button className="primary-action">
              Create SKU &amp; Record Inward
            </button>
          </div>
        </>
      )}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function EditStockDetailsDialog({
  item,
  mutate,
  onClose,
}: {
  item: InventoryItem;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(item);
  const [confirmingArchive, setConfirmingArchive] = useState(false);
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (mutate((db) => updateInventoryItem(db, item.id, draft))) onClose();
  };
  const archive = () => {
    if (!confirmingArchive) {
      setConfirmingArchive(true);
      return;
    }
    if (
      mutate((db) =>
        archiveInventoryItem(db, item.id, "Archived from stock details"),
      )
    )
      onClose();
  };
  return (
    <Dialog
      title="Edit stock details"
      subtitle={`${item.sku} · ${item.stock_qty} ${item.unit} on hand`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="danger-action" onClick={archive}>
            {confirmingArchive ? "Confirm archive" : "Archive"}
          </button>
          <button
            className="primary-action"
            type="submit"
            form="edit-stock-details"
          >
            Save changes
          </button>
        </>
      }
    >
      <form id="edit-stock-details" className="stock-edit-form" onSubmit={save}>
        <p className="muted">
          Stock quantity is changed only by an inward or stock movement.
        </p>
        <div className="form-grid">
          <label>
            SKU
            <input
              data-dialog-initial-focus
              aria-label="Edit SKU"
              required
              value={draft.sku}
              onChange={(event) =>
                setDraft({ ...draft, sku: event.target.value })
              }
            />
          </label>
          <label>
            Material name
            <input
              aria-label="Edit material name"
              required
              value={draft.name}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
            />
          </label>
          <label>
            Category
            <input
              aria-label="Edit category"
              required
              value={draft.category}
              onChange={(event) =>
                setDraft({ ...draft, category: event.target.value })
              }
            />
          </label>
          <label>
            Unit
            <input
              aria-label="Edit unit"
              required
              value={draft.unit}
              onChange={(event) =>
                setDraft({ ...draft, unit: event.target.value })
              }
            />
          </label>
          <label>
            Low-stock threshold
            <input
              aria-label="Edit low-stock threshold"
              type="number"
              min="0"
              step="0.01"
              required
              value={draft.low_stock_qty}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  low_stock_qty: Number(event.target.value),
                })
              }
            />
          </label>
          <label>
            Default selling price (₹)
            <input
              aria-label="Edit selling price"
              type="number"
              min="0"
              step="0.01"
              required
              value={draft.selling_price}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  selling_price: Number(event.target.value),
                })
              }
            />
          </label>
        </div>
        {confirmingArchive && (
          <p className="error-text" role="alert">
            Archive this SKU? It will no longer be available for new material
            requests.
          </p>
        )}
      </form>
    </Dialog>
  );
}

function InventoryEditor({
  state,
  mutate,
  embedded = false,
}: {
  state: WorkshopState;
  mutate: Mutate;
  embedded?: boolean;
}) {
  const [draft, setDraft] = useState<InventoryItem>(
    state.inventory[0] ?? emptyInventoryItem(),
  );
  const [movementQty, setMovementQty] = useState(1);
  const purchaseHistory = state.inward_purchase_lines
    .filter((line) => line.item_id === draft.id)
    .map((line) => ({
      line,
      purchase: state.inward_purchases.find(
        (purchase) => purchase.id === line.purchase_id,
      ),
    }))
    .filter((row): row is { line: typeof row.line; purchase: InwardPurchase } =>
      Boolean(row.purchase),
    );
  return (
    <form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        mutate((db) =>
          draft.id
            ? updateInventoryItem(db, draft.id, draft)
            : createInventoryItem(db, draft),
        );
      }}
    >
      {!embedded && (
        <PanelTitle
          icon={<Boxes />}
          title="Stock Form"
          subtitle="Master, stock-in and adjustment"
        />
      )}
      <select
        value={draft.id}
        onChange={(event) =>
          setDraft(
            state.inventory.find(
              (item) => item.id === Number(event.target.value),
            ) ?? emptyInventoryItem(),
          )
        }
      >
        <option value={0}>New item</option>
        {state.inventory.map((item) => (
          <option key={item.id} value={item.id}>
            {item.sku}
          </option>
        ))}
      </select>
      <div className="form-grid">
        <label>
          SKU
          <input
            value={draft.sku}
            onChange={(event) =>
              setDraft({ ...draft, sku: event.target.value })
            }
          />
        </label>
        <label>
          Category
          <input
            value={draft.category}
            onChange={(event) =>
              setDraft({ ...draft, category: event.target.value })
            }
          />
        </label>
        <label>
          Name
          <input
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
          />
        </label>
        <label>
          Unit
          <input
            value={draft.unit}
            onChange={(event) =>
              setDraft({ ...draft, unit: event.target.value })
            }
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            value={draft.stock_qty}
            onChange={(event) =>
              setDraft({ ...draft, stock_qty: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Low Stock
          <input
            type="number"
            value={draft.low_stock_qty}
            onChange={(event) =>
              setDraft({ ...draft, low_stock_qty: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Selling Price
          <input
            type="number"
            min="0"
            step="0.01"
            value={draft.selling_price}
            onChange={(event) =>
              setDraft({ ...draft, selling_price: Number(event.target.value) })
            }
          />
        </label>
      </div>
      <label>
        Movement Qty
        <input
          type="number"
          value={movementQty}
          onChange={(event) => setMovementQty(Number(event.target.value))}
        />
      </label>
      <div className="action-row">
        <button className="primary-action">Save Item</button>
        {draft.id > 0 && (
          <button
            type="button"
            onClick={() =>
              mutate((db) =>
                stockIn(db, draft.id, movementQty, "Manual stock-in"),
              )
            }
          >
            Stock In
          </button>
        )}
        {draft.id > 0 && (
          <button
            type="button"
            onClick={() =>
              mutate((db) =>
                adjustStock(db, draft.id, movementQty, "Manual adjustment"),
              )
            }
          >
            Set Stock
          </button>
        )}
        {draft.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveInventoryItem(db, draft.id, "Archived inventory item"),
              )
            }
          >
            Archive
          </button>
        )}
      </div>
      {draft.id > 0 && (
        <section
          className="local-purchase-records"
          aria-label="Item purchase history"
        >
          <h4>Item purchase history</h4>
          {purchaseHistory.length === 0 ? (
            <p className="empty-state">
              No inward purchase receipts for this item.
            </p>
          ) : (
            <ul className="material-rows">
              {purchaseHistory.map(({ line, purchase }) => (
                <li key={line.id} className="material-row">
                  <div className="material-row-main">
                    <strong>
                      {purchase.invoice_date} ·{" "}
                      {state.suppliers.find(
                        (supplier) => supplier.id === purchase.supplier_id,
                      )?.name ?? "Archived supplier"}
                    </strong>
                    <span>
                      {line.received_qty} {draft.unit} · {money(line.unit_cost)}{" "}
                      pre-GST · GST {line.gst_rate}%
                    </span>
                    <small>
                      Invoice {purchase.supplier_invoice_no} ·{" "}
                      {purchase.po_number ? `PO ${purchase.po_number} · ` : ""}
                      {purchase.status}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </form>
  );
}

function TaskCreator({
  view,
  users,
  mutate,
  onCreated,
}: {
  view: JobView;
  users: User[];
  mutate: Mutate;
  embedded?: boolean;
  onCreated?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const technicianId =
    users.find((item) => item.role === "tech")?.id ?? view.job.technician_id;
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (
          mutate((db) =>
            createTask(db, {
              job_card_id: view.job.id,
              technician_id: technicianId,
              title,
              status: "Pending",
              notes,
            }),
          )
        ) {
          setTitle("");
          setNotes("");
          onCreated?.();
        }
      }}
    >
      <label>
        New Task
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label>
        Notes
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>
      <button>Add Task</button>
    </form>
  );
}

function QcEditor({
  view,
  technicianId,
  mutate,
}: {
  view: JobView;
  technicianId: number;
  mutate: Mutate;
}) {
  const [reason, setReason] = useState("Rework required");
  return (
    <div className="qc-box">
      {view.qc_checks.map((check: QcCheck) => (
        <div className="request-line" key={check.id}>
          <strong>{check.label}</strong>
          <span>{check.passed ? "Pass" : check.fail_reason || "Pending"}</span>
          <div className="action-row">
            <button
              onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}
            >
              Pass
            </button>
            <button
              onClick={() =>
                mutate((db) =>
                  failQcWithRework(db, check.id, technicianId, reason),
                )
              }
            >
              Fail + Rework
            </button>
          </div>
        </div>
      ))}
      <label>
        Fail/Rework Reason
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      <div className="action-row">
        <button
          onClick={() => mutate((db) => markWashingNeeded(db, view.job.id))}
        >
          Washing Needed
        </button>
        <button onClick={() => mutate((db) => passQc(db, view.job.id))}>
          Pass All QC
        </button>
      </div>
    </div>
  );
}

function ReadyToInvoiceDraft({
  view,
  actor,
  onCreate,
}: {
  view: JobView;
  actor: User;
  onCreate: () => void;
}) {
  const draft = buildInvoiceDraft(view);
  const totals = invoiceTotals(draft.lines, draft.discount);
  const warning = unissuedWarning(draft.unissuedRows);
  const canCreate =
    canCreateInvoice(actor, view.job) &&
    view.estimate?.status === "Approved" &&
    !view.estimate.archived_at &&
    draft.lines.length > 0;
  return (
    <section className="invoice-draft" aria-label="Invoice draft">
      <div className="invoice-draft-heading">
        <div>
          <strong>{view.customer.name}</strong>
          <span>
            {view.vehicle.number} · Received{" "}
            {view.visit.received_at.slice(0, 10)}
          </span>
        </div>
        {canCreate ? (
          <button type="button" className="primary-action" onClick={onCreate}>
            Create Invoice
          </button>
        ) : (
          <span className="status hold">
            {view.estimate?.status === "Approved"
              ? "No billable items"
              : "Estimate approval required"}
          </span>
        )}
      </div>
      {warning && (
        <p className="permission-note" role="status">
          {warning}
        </p>
      )}
      {draft.lines.length ? (
        <div className="table-wrap">
          <table aria-label="Invoice draft lines">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>GST</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {draft.lines.map((line, index) => (
                <tr key={line.material_row_id ?? `${line.kind}-${index}`}>
                  <td>{line.kind}</td>
                  <td>{line.description}</td>
                  <td>{line.qty}</td>
                  <td>{money(line.rate)}</td>
                  <td>
                    {line.gst_type} · {line.gst_rate}%
                  </td>
                  <td>{money(totals.lines[index].amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">
          There are no service or issued-material lines to invoice.
        </p>
      )}
      <div className="invoice-totals" aria-label="Invoice draft totals">
        <span>
          Subtotal <strong>{money(totals.subtotal)}</strong>
        </span>
        <span>
          Discount <strong>{money(totals.discount)}</strong>
        </span>
        <span>
          GST <strong>{money(totals.gst)}</strong>
        </span>
        <span>
          Total <strong>{money(totals.total)}</strong>
        </span>
      </div>
    </section>
  );
}

function DataFlowWorkspace({
  jobs,
  users,
}: {
  jobs: JobView[];
  users: User[];
}) {
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const months = useMemo(() => dataFlowMonths(jobs), [jobs]);
  const dates = useMemo(() => dataFlowDates(jobs, month), [jobs, month]);
  const options = useMemo(
    () => filterDataFlowJobs(jobs, { query, month, date }),
    [jobs, query, month, date],
  );
  const selected = jobs.find((view) => view.job.id === selectedId);

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  useEffect(() => {
    if (selectedId && !options.some((view) => view.job.id === selectedId))
      setSelectedId(undefined);
    setActiveIndex((index) =>
      Math.max(-1, Math.min(index, options.length - 1)),
    );
  }, [options, selectedId]);

  const choose = (view: JobView) => {
    setSelectedId(view.job.id);
    setQuery(view.job.job_no);
    setOpen(false);
  };
  const clear = () => {
    setMonth("");
    setDate("");
    setQuery("");
    setSelectedId(undefined);
    setOpen(false);
    setActiveIndex(-1);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        event.key === "ArrowDown"
          ? Math.min(index + 1, options.length - 1)
          : index < 0
            ? options.length - 1
            : Math.max(index - 1, 0),
      );
    } else if (event.key === "Enter" && options.length > 0) {
      event.preventDefault();
      choose(options[Math.max(0, activeIndex)]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <section className="workspace single-panel">
      <div className="desk-panel data-flow">
        <PanelTitle
          icon={<ClipboardCheck />}
          title="Data Flow"
          subtitle={selected?.job.job_no ?? "Select a job"}
        />
        <div className="data-flow-filters" ref={rootRef}>
          <label>
            Visit month
            <select
              aria-label="Visit month"
              value={month}
              onChange={(event) => {
                setMonth(event.target.value);
                setDate("");
                setQuery("");
                setSelectedId(undefined);
                setOpen(false);
              }}
            >
              <option value="">All months</option>
              {months.map((value) => (
                <option key={value} value={value}>
                  {new Date(`${value}-01T00:00:00`).toLocaleDateString(
                    "en-IN",
                    { month: "long", year: "numeric" },
                  )}
                </option>
              ))}
            </select>
          </label>
          <label>
            Visit date
            <select
              aria-label="Visit date"
              value={date}
              onChange={(event) => {
                const next = event.target.value;
                setDate(next);
                if (next) setMonth(next.slice(0, 7));
                setQuery("");
                setSelectedId(undefined);
                setOpen(false);
              }}
            >
              <option value="">All dates</option>
              {dates.map((value) => (
                <option key={value} value={value}>
                  {new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </label>
          <div className="data-flow-combobox">
            <label htmlFor="data-flow-job-search">Find a job</label>
            <input
              id="data-flow-job-search"
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="data-flow-job-options"
              aria-activedescendant={
                open && options[activeIndex]
                  ? `data-flow-job-${options[activeIndex].job.id}`
                  : undefined
              }
              autoComplete="off"
              value={query}
              placeholder="Job, vehicle, customer or mobile"
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedId(undefined);
                setOpen(true);
                setActiveIndex(-1);
              }}
              onKeyDown={onKeyDown}
            />
            {open && (
              <div
                id="data-flow-job-options"
                className="data-flow-options"
                role="listbox"
                aria-label="Matching jobs"
              >
                {options.length ? (
                  options.map((view, index) => (
                    <button
                      id={`data-flow-job-${view.job.id}`}
                      type="button"
                      role="option"
                      aria-selected={selectedId === view.job.id}
                      className={index === activeIndex ? "highlighted" : ""}
                      key={view.job.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => choose(view)}
                    >
                      <strong>{view.job.job_no}</strong>
                      <span>
                        {view.vehicle.number} · {view.customer.name}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="data-flow-no-matches" role="status">
                    No matching jobs
                  </p>
                )}
              </div>
            )}
          </div>
          <FilterClearButton onClick={clear} />
        </div>
        {!jobs.length ? (
          <div className="empty-state">No jobs are available.</div>
        ) : selected ? (
          <DataFlow view={selected} users={users} />
        ) : (
          <div className="empty-state">Select a job to view its data flow.</div>
        )}
      </div>
    </section>
  );
}

function DocumentDownloadButton({
  kind,
  view,
  className = "workflow-action action-document document-download",
  label,
  snapshotId,
  showPrint = true,
}: {
  kind: DocumentKind;
  view: JobView;
  className?: string;
  label?: string;
  snapshotId?: string;
  showPrint?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "preparing" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const resolve = (): RenderedDocument => {
    const snapshots = loadDocumentSnapshots();
    const snap = snapshotId
      ? snapshots.find((item) => item.id === snapshotId)
      : undefined;
    return snap
      ? renderSnapshotDocument(snap)
      : renderJobDocument(kind, view, loadAdminDemoState(), snapshots);
  };
  const print = () => {
    setErrorMessage("");
    try {
      const result = printRenderedDocument(resolve());
      if (!result.ok) throw new Error(result.error);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The document could not be printed.",
      );
      setStatus("error");
    }
  };
  const download = async () => {
    setStatus("preparing");
    setErrorMessage("");
    let doc: RenderedDocument;
    try {
      doc = resolve();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Document is not available.",
      );
      setStatus("error");
      return;
    }
    try {
      await new Promise<void>((done) => window.setTimeout(done, 30));
      await renderHtmlToPdf(doc.html, doc.filename);
      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      // PDF generation failed: fall back to the browser print dialog (Save as PDF).
      const result = printRenderedDocument(doc);
      if (result.ok) setStatus("idle");
      else {
        setErrorMessage(result.error ?? "Document generation failed.");
        setStatus("error");
      }
    }
  };
  return (
    <>
      <button
        type="button"
        className={className}
        disabled={status === "preparing"}
        aria-busy={status === "preparing"}
        onClick={download}
      >
        <Download size={15} />
        {status === "preparing"
          ? "Preparing…"
          : status === "done"
            ? "Downloaded ✓"
            : (label ?? "Download PDF")}
      </button>
      {showPrint && (
        <button
          type="button"
          className="workflow-action action-secondary document-print"
          onClick={print}
        >
          <Printer size={15} />
          Print
        </button>
      )}
      {status === "error" && (
        <span className="document-error" role="alert">
          {errorMessage}
        </span>
      )}
    </>
  );
}

function DataFlow({ view, users }: { view: JobView; users: User[] }) {
  return <DataFlowLine view={view} users={users} />;
}

function DataFlowLine({ view, users }: { view: JobView; users: User[] }) {
  const events = buildDataFlowTimeline(view, users);
  const snapshots = loadDocumentSnapshots();
  const ghosts = buildGhostSteps(view, snapshots);
  const pdf = (event: DataFlowEvent) => {
    if (!event.document) return null;
    const snap = event.document.void
      ? snapshots.find(
          (item) =>
            item.jobId === view.job.id &&
            item.kind === event.document!.kind &&
            item.number === event.document!.number &&
            item.state === "void",
        )
      : undefined;
    if (event.document.void && !snap) return null;
    return (
      <DocumentDownloadButton
        kind={event.document.kind}
        view={view}
        snapshotId={snap?.id}
        label="PDF"
        showPrint={false}
        className="workflow-action action-document document-download data-flow-document-action"
      />
    );
  };
  const lifecycle = summarizeJobLifecycle(view);
  const stageRows = buildStageRows(view);
  return (
    <>
      <section className="data-flow-stage" aria-label="Stage summary">
        <div className="data-flow-active">
          <div>
            <small>Active stage</small>
            <strong>
              {lifecycle.stage}
              {lifecycle.cycle ? ` - cycle ${lifecycle.cycle}` : ""}
            </strong>
            <small>Ordered remaining steps</small>
            <strong>
              {lifecycle.remainingSteps.length
                ? lifecycle.remainingSteps.join(" > ")
                : "None"}
            </strong>
          </div>
          <strong className="data-flow-active-step">
            {lifecycle.activeStep}
          </strong>
        </div>
        {stageRows.map((row) => (
          <div
            key={row.id}
            className={`data-flow-stage-row${row.done ? " done" : ""}`}
            data-stage={row.id}
          >
            <span className="stage-check" aria-hidden="true">
              {row.done ? "✓" : "○"}
            </span>
            <span>
              {row.label}: {row.value}
            </span>
            {row.document && row.done && (
              <div className="data-flow-row-actions">
                <DocumentDownloadButton
                  kind={row.document}
                  view={view}
                  className="workflow-action action-document document-download data-flow-document-action"
                />
              </div>
            )}
          </div>
        ))}
      </section>
      <section
        className="data-flow-timeline data-flow-line"
        aria-label="Chronological data flow"
      >
        <div className="data-flow-head">
          <h2>{view.job.job_no}</h2>
          <span>
            {view.vehicle.number} · {view.vehicle.make} {view.vehicle.model} ·{" "}
            {view.customer.name}
          </span>
          <span
            className={`data-flow-pill ${view.job.main_status.toLowerCase()}`}
          >
            {view.job.main_status.replace("_", " ")}
          </span>
          <span className="data-flow-count">
            {events.length} done event{events.length === 1 ? "" : "s"}
          </span>
        </div>
        <ol>
          {events.map((event, index) => (
            <li
              key={event.id}
              className={`timeline-event ${event.state ?? ""}${index === events.length - 1 ? " latest" : ""}`}
              aria-current={index === events.length - 1 ? "step" : undefined}
              data-event-kind={event.kind}
            >
              <time dateTime={event.timestamp}>
                {formatTimestamp(event.timestamp)}
              </time>
              <div>
                <strong>{event.title}</strong>
                <span>{event.detail}</span>
                {event.actor && <small>Actor: {event.actor}</small>}
                {pdf(event)}
              </div>
              {event.state && (
                <span className="timeline-state">{event.state}</span>
              )}
            </li>
          ))}
          <li className="not-yet-divider" role="separator" aria-label="Not yet">
            <span>Not yet</span>
          </li>
          {ghosts.length ? (
            ghosts.map((ghost) => (
              <li
                key={ghost.id}
                className="timeline-event ghost"
                data-ghost-kind={ghost.kind}
              >
                <div>
                  <strong>{ghost.title}</strong>
                  <span>{ghost.reason}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="timeline-event ghost none">
              <div>
                <span>Nothing outstanding.</span>
              </div>
            </li>
          )}
        </ol>
      </section>
    </>
  );
}

type DocumentEditor = "estimate" | "approve-estimate" | "invoice" | undefined;

function JobDocuments({
  view,
  actor,
  mutate,
  editor: controlledEditor,
  setEditor: setControlledEditor,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  editor?: DocumentEditor;
  setEditor?: (editor: DocumentEditor) => void;
}) {
  const [localEditor, setLocalEditor] = useState<DocumentEditor>();
  const editor = setControlledEditor ? controlledEditor : localEditor;
  const setEditor = setControlledEditor ?? setLocalEditor;
  const documents = resolveJobDocuments(view, loadDocumentSnapshots());
  return (
    <>
      <div className="document-center">
        {documents.length ? (
          documents.map((document) => {
            const actions =
              document.state === "void"
                ? ["download" as const]
                : resolveJobDocumentActions(document.kind, view, actor);
            return (
              <div
                className={`document-row ${document.available ? "available" : "missing"}`}
                key={document.snapshotId ?? document.kind}
              >
                <div className="document-summary">
                  <strong>{document.label}</strong>
                  <span>
                    {document.state === "void"
                      ? `${document.number} - void (frozen copy)`
                      : document.available
                        ? `${document.number ?? ""} ${document.state === "frozen" ? "- frozen" : "- ready"}`.trim()
                        : document.message}
                  </span>
                </div>
                <div
                  className="document-actions"
                  role="group"
                  aria-label={`${document.label} actions`}
                >
                  {actions.includes("create-estimate") && (
                    <button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("estimate")}
                    >
                      <Plus size={15} />
                      Create Estimate
                    </button>
                  )}
                  {actions.includes("edit-estimate") && (
                    <button
                      type="button"
                      className="workflow-action action-secondary"
                      onClick={() => setEditor("estimate")}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                  )}
                  {actions.includes("approve-estimate") && (
                    <button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("approve-estimate")}
                    >
                      <Check size={15} />
                      Approve Estimate
                    </button>
                  )}
                  {actions.includes("create-invoice") && (
                    <button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("invoice")}
                    >
                      <Plus size={15} />
                      Create Invoice
                    </button>
                  )}
                  {actions.includes("edit-invoice") && (
                    <button
                      type="button"
                      className="workflow-action action-secondary"
                      onClick={() => setEditor("invoice")}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                  )}
                  {actions.includes("download") && (
                    <DocumentDownloadButton
                      kind={document.kind}
                      view={view}
                      snapshotId={document.snapshotId}
                      className="workflow-action action-document document-download"
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="empty-state">
            No documents are available for this job.
          </p>
        )}
      </div>
      {editor === "estimate" && (
        <EstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
      )}
      {editor === "approve-estimate" && (
        <ApproveEstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
      )}
      {editor === "invoice" && (
        <InvoiceDialog
          fixedJob
          action={view.invoice ? "edit" : "create"}
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
      )}
    </>
  );
}

function AddJobCardDialog({
  state,
  mutate,
  actor,
  onClose,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  onClose: () => void;
}) {
  const advisors = state.users.filter((item) => item.role === "service");
  const [customerId, setCustomerId] = useState<number>(0);
  const [vehicleId, setVehicleId] = useState<number>(0);
  const [advisorId, setAdvisorId] = useState<number>(
    actor.role === "service" ? actor.id : (advisors[0]?.id ?? 0),
  );
  const [form, setForm] = useState({
    requestedWork: "",
    odoReading: "",
    fuelLevelValue: "",
    fuelLevelUnit: "bars" as "bars" | "%" | "litres" | "Other",
    keys: "",
    accessories: "",
  });
  const [quickAdd, setQuickAdd] = useState<
    "customer" | "vehicle" | undefined
  >();
  const [awaiting, setAwaiting] = useState<
    "customer" | "vehicle" | undefined
  >();
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: "",
    mobile: "",
    type: "Individual",
  });
  const [error, setError] = useState("");
  const customer = state.customers.find((item) => item.id === customerId);
  const vehicle = state.vehicles.find((item) => item.id === vehicleId);
  const vehicleOptions = state.vehicles.filter(
    (item) => !customerId || item.customer_id === customerId,
  );
  useEffect(() => {
    if (awaiting === "customer") {
      const latest = state.customers.reduce(
        (max, item) => Math.max(max, item.id),
        0,
      );
      if (latest && latest !== customerId) {
        setCustomerId(latest);
        setVehicleId(0);
        setAwaiting(undefined);
      }
    }
    if (awaiting === "vehicle") {
      const latest = state.vehicles.reduce(
        (max, item) => (item.id > max.id ? item : max),
        state.vehicles[0] ?? ({ id: 0, customer_id: 0 } as Vehicle),
      );
      if (latest.id && latest.id !== vehicleId) {
        setVehicleId(latest.id);
        setCustomerId(latest.customer_id);
        setAwaiting(undefined);
      }
    }
  }, [state.customers, state.vehicles, awaiting]); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!customer || !vehicle) {
      setError("Select a customer and a vehicle.");
      return;
    }
    if (!advisorId) {
      setError("Assign a service advisor.");
      return;
    }
    const odoReading = Number(form.odoReading);
    if (!Number.isFinite(odoReading) || odoReading < 0) {
      setError("Enter the ODO meter reading in km.");
      return;
    }
    if (!form.fuelLevelValue.trim()) {
      setError("Enter the fuel or battery level.");
      return;
    }
    const fuel =
      form.fuelLevelUnit === "Other"
        ? form.fuelLevelValue
        : `${form.fuelLevelValue} ${form.fuelLevelUnit}`;
    if (
      mutate(
        (db) =>
          receiveVehicle(db, {
            customerId: customer.id,
            vehicleId: vehicle.id,
            customerName: customer.name,
            mobile: customer.mobile,
            customerType: customer.type,
            vehicleNo: vehicle.number,
            make: vehicle.make,
            model: vehicle.model,
            color: vehicle.color,
            km: odoReading,
            odoReading,
            fuel,
            fuelLevelValue: form.fuelLevelValue,
            fuelLevelUnit: form.fuelLevelUnit,
            keys: form.keys,
            accessories: form.accessories,
            requestedWork: form.requestedWork,
            advisorId,
            receptionId: actor.id,
          }),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      wide
      title="Add Job Card"
      subtitle="Check in a vehicle with its ODO and fuel or battery level"
      onClose={onClose}
      footer={
        <button form="add-job-card-form" className="primary-action">
          Create Job Card
        </button>
      }
    >
      <form id="add-job-card-form" onSubmit={submit}>
        <div className="form-grid">
          <div className="field-with-action">
            <SearchSelect
              label="Customer"
              options={state.customers.map((item) => ({
                value: item.id,
                label: `${item.name} / ${item.mobile}`,
              }))}
              value={customerId || undefined}
              onChange={(value) => {
                setCustomerId(Number(value));
                setVehicleId(0);
              }}
              placeholder="Search customer or mobile"
            />
            <button
              type="button"
              className="link-action"
              onClick={() => setQuickAdd("customer")}
            >
              + Add new customer
            </button>
          </div>
          <div className="field-with-action">
            <SearchSelect
              label="Vehicle"
              options={vehicleOptions.map((item) => ({
                value: item.id,
                label: `${item.number} / ${item.make} ${item.model}`,
              }))}
              value={vehicleId || undefined}
              onChange={(value) => setVehicleId(Number(value))}
              placeholder="Search registration or model"
            />
            <button
              type="button"
              className="link-action"
              onClick={() => setQuickAdd("vehicle")}
            >
              + Add new vehicle
            </button>
          </div>
          <label>
            Service advisor
            <select
              value={advisorId}
              disabled={actor.role === "service"}
              onChange={(event) => setAdvisorId(Number(event.target.value))}
            >
              {advisors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            ODO Meter Reading (km)
            <input
              required
              min="0"
              type="number"
              inputMode="numeric"
              placeholder={`Current vehicle KM: ${vehicle?.km ?? "—"}`}
              value={form.odoReading}
              onChange={(event) =>
                setForm({ ...form, odoReading: event.target.value })
              }
            />
          </label>
          <label>
            Fuel/Battery Level
            <div className="field-pair">
              <input
                required
                placeholder="Value"
                value={form.fuelLevelValue}
                onChange={(event) =>
                  setForm({ ...form, fuelLevelValue: event.target.value })
                }
              />
              <select
                aria-label="Fuel or battery unit"
                value={form.fuelLevelUnit}
                onChange={(event) =>
                  setForm({
                    ...form,
                    fuelLevelUnit: event.target
                      .value as typeof form.fuelLevelUnit,
                  })
                }
              >
                <option value="bars">bars</option>
                <option value="%">%</option>
                <option value="litres">litres</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </label>
          <label>
            Keys
            <input
              value={form.keys}
              onChange={(event) =>
                setForm({ ...form, keys: event.target.value })
              }
            />
          </label>
          <label>
            Accessories
            <input
              value={form.accessories}
              onChange={(event) =>
                setForm({ ...form, accessories: event.target.value })
              }
            />
          </label>
        </div>
        <label>
          Requested work
          <input
            required
            value={form.requestedWork}
            onChange={(event) =>
              setForm({ ...form, requestedWork: event.target.value })
            }
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </form>
      {quickAdd === "customer" && (
        <Dialog title="Add Customer" onClose={() => setQuickAdd(undefined)}>
          <CustomerEditor
            embedded
            value={newCustomer}
            setValue={setNewCustomer}
            mutate={mutate}
            onSaved={() => {
              setAwaiting("customer");
              setQuickAdd(undefined);
              setNewCustomer({
                id: 0,
                name: "",
                mobile: "",
                type: "Individual",
              });
            }}
          />
        </Dialog>
      )}
      {quickAdd === "vehicle" && (
        <Dialog title="Add Vehicle" onClose={() => setQuickAdd(undefined)}>
          <VehicleMasterPanel
            embedded
            state={state}
            value={{
              id: 0,
              customer_id: customerId || state.customers[0]?.id || 0,
              number: "",
              make: "",
              model: "",
              color: "",
              km: 0,
            }}
            setValue={() => undefined}
            mutate={mutate}
            onSaved={() => {
              setAwaiting("vehicle");
              setQuickAdd(undefined);
            }}
          />
        </Dialog>
      )}
    </Dialog>
  );
}

function JobBodyMarkPanel({
  view,
  actor,
  mutate,
  editable,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  editable: boolean;
}) {
  const [marks, setMarks] = useState(() =>
    parseDamageMarks(view.job.damage_marks),
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(true);
  const save = () => {
    setError("");
    if (
      mutate(
        (db) => setDamageMarksForActor(db, view.job.id, actor.id, marks),
        setError,
      )
    )
      setSaved(true);
  };
  return (
    <section className="editor-block body-mark-tab" aria-label="Body mark">
      <BodyMarkDiagram
        marks={marks}
        onChange={
          editable
            ? (next) => {
                setMarks(next);
                setSaved(false);
              }
            : undefined
        }
        meta={{
          jobNo: view.job.job_no,
          vehicleName: `${view.vehicle.make} ${view.vehicle.model}`.trim(),
          color: view.vehicle.color,
          regNo: view.vehicle.number,
          recordedAt: view.job.damage_marks_recorded_at,
        }}
      />
      {editable && (
        <div className="action-row">
          <button
            type="button"
            className="primary-action"
            disabled={saved}
            onClick={save}
          >
            {saved ? "Marks saved" : "Save Body Marks"}
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </section>
  );
}

function JobRecordDialog({
  view,
  state,
  mutate,
  actor,
  mode,
  onClose,
  onAdminArchive,
  historical = false,
}: {
  view: JobView;
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  mode: "view" | "edit";
  onClose: () => void;
  onAdminArchive?: () => boolean;
  historical?: boolean;
}) {
  const [tab, setTab] = useState<JobCardTabKey>("details");
  const [documentEditor, setDocumentEditor] = useState<DocumentEditor>();
  const archive = () => {
    if (
      !onAdminArchive ||
      !window.confirm(
        `Archive Job ${view.job.job_no}? This will cancel the job card.`,
      )
    )
      return;
    if (onAdminArchive()) onClose();
  };
  const panelId = `job-record-${view.job.id}-${tab}`;
  if (historical)
    return (
      <Dialog
        wide
        className="dialog-job"
        title={`Archived Job ${view.job.job_no}`}
        subtitle={`${view.vehicle.number} · ${view.customer.name}`}
        onClose={onClose}
      >
        <div className="record-view">
          <p className="permission-note">Read-only historical record.</p>
          <Info label="Archived on" value={view.job.archived_at ?? "—"} />
          <Info
            label="Archive reason"
            value={view.job.archived_reason ?? "—"}
          />
          <JobSnapshot view={view} />
          <Info label="Requested work" value={view.visit.requested_work} />
          <Info label="Advisor" value={view.advisor.name} />
          <Info label="Technician" value={view.technician.name} />
        </div>
      </Dialog>
    );
  return (
    <Dialog
      wide
      className="dialog-job"
      title={`${mode === "view" ? "View" : "Edit"} Job ${view.job.job_no}`}
      subtitle={`${view.vehicle.number} · ${view.customer.name}`}
      onClose={onClose}
    >
      {mode === "edit" && (
        <JobLifecyclePanel
          view={view}
          users={state.users}
          actor={actor}
          mutate={mutate}
        />
      )}
      <div
        className="sub-tabs"
        role="tablist"
        aria-label="Job record sections"
        onKeyDown={handleTabListKeyDown}
      >
        {JOB_CARD_TABS.map((item) => (
          <button
            id={`job-record-tab-${view.job.id}-${item.key}`}
            aria-controls={`job-record-${view.job.id}-${item.key}`}
            tabIndex={tab === item.key ? 0 : -1}
            key={item.key}
            role="tab"
            aria-selected={tab === item.key}
            className={tab === item.key ? "active" : ""}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`job-record-tab-${view.job.id}-${tab}`}
      >
        {tab === "task-list" ? (
          <JobTaskListPanel
            view={view}
            catalog={state.service_catalog}
            actor={actor}
            mutate={mutate}
          />
        ) : tab === "documents" ? (
          <section
            className="editor-block job-card-documents"
            aria-label="Current job documents"
          >
            <JobDocuments
              view={view}
              actor={actor}
              mutate={mutate}
              editor={documentEditor}
              setEditor={setDocumentEditor}
            />
          </section>
        ) : tab === "bodymark" ? (
          <JobBodyMarkPanel
            view={view}
            actor={actor}
            mutate={mutate}
            editable={mode === "edit"}
          />
        ) : tab === "media" ? (
          <JobMediaPanel embedded view={view} actor={actor} mutate={mutate} />
        ) : tab === "materials" ? (
          <JobMaterialsPanel
            view={view}
            inventory={state.inventory}
            actor={actor}
            mutate={mutate}
          />
        ) : tab === "payment" ? (
          <JobPaymentPanel view={view} actor={actor} mutate={mutate} />
        ) : tab === "invoice" ? (
          <JobInvoicePanel
            view={view}
            actor={actor}
            mutate={mutate}
            onOpen={() => setDocumentEditor("invoice")}
            onEstimate={() => setDocumentEditor("approve-estimate")}
          />
        ) : isStubTab(tab) ? (
          <p className="empty-state job-card-stub">
            {JOB_CARD_TABS.find((item) => item.key === tab)?.label} is coming
            soon.
          </p>
        ) : mode === "edit" ? (
          <>
            <JobEditor
              embedded
              key={view.job.updated_at}
              view={view}
              users={state.users}
              mutate={mutate}
              actor={actor}
            />
            <JobSheetSection
              key={`sheet-${view.job.updated_at}`}
              view={view}
              actor={actor}
              mutate={mutate}
              editable
            />
            {onAdminArchive && (
              <div className="admin-archive-action">
                <button
                  type="button"
                  className="danger-action"
                  onClick={archive}
                >
                  Archive Job
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="record-view">
            <JobSnapshot view={view} />
            <Info label="Requested work" value={view.visit.requested_work} />
            <Info label="Work completed" value={view.job.work_list || "—"} />
            <Info label="Advisor" value={view.advisor.name} />
            <Info label="Technician" value={view.technician.name} />
            <JobSheetSection view={view} actor={actor} mutate={mutate} />
          </div>
        )}
        {tab === "details" && (
          <section
            className="editor-block job-card-documents job-documents-block"
            aria-label="Current job documents"
          >
            <h4>Current Documents</h4>
            <p className="muted">Only active records are available</p>
            <JobDocuments
              view={view}
              actor={actor}
              mutate={mutate}
              editor={documentEditor}
              setEditor={setDocumentEditor}
            />
          </section>
        )}
      </div>
      {tab !== "documents" &&
        tab !== "details" &&
        documentEditor === "estimate" && (
          <EstimateDialog
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
        )}
      {tab !== "documents" &&
        tab !== "details" &&
        documentEditor === "approve-estimate" && (
          <ApproveEstimateDialog
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
        )}
      {tab !== "documents" &&
        tab !== "details" &&
        documentEditor === "invoice" && (
          <InvoiceDialog
            fixedJob
            action={view.invoice ? "edit" : "create"}
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
        )}
    </Dialog>
  );
}

function JobTaskListPanel({
  view,
  catalog,
  actor,
  mutate,
}: {
  view: JobView;
  catalog: WorkshopState["service_catalog"];
  actor: User;
  mutate: Mutate;
}) {
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState("");
  const [rate, setRate] = useState(0);
  const [error, setError] = useState("");
  const editable =
    (view.job.main_status === "NEW" ||
      view.job.main_status === "IN_PROGRESS") &&
    (actor.role === "admin" ||
      (actor.role === "service" && actor.id === view.job.advisor_id));
  const matches = catalog.filter((item) =>
    normalizeSearch(item.name).includes(normalizeSearch(query)),
  );
  const run = (action: (db: Database) => unknown) => mutate(action, setError);
  return (
    <section className="editor-block" aria-label="Task List">
      <div className="panel-actions">
        <div>
          <h3>Task List</h3>
          <p>Operational checklist items use pre-GST rates.</p>
        </div>
        {editable && view.estimate?.status !== "Approved" && (
          <button
            type="button"
            className="primary-action"
            onClick={() =>
              run((db) =>
                prefillEstimateFromTaskListForActor(db, view.job.id, actor.id),
              )
            }
          >
            Prefill Estimate
          </button>
        )}
      </div>
      {view.estimate?.status === "Approved" && (
        <p className="permission-note">
          Estimate is approved; the checklist can still be updated.
        </p>
      )}
      {editable && (
        <div className="task-list-add">
          <label>
            Search catalog
            <input
              aria-label="Search service catalog"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search service"
            />
          </label>
          {query && (
            <div className="action-row">
              {matches.map((item) => (
                <button
                  type="button"
                  className="secondary-action"
                  key={item.id}
                  onClick={() =>
                    run((db) =>
                      addJobTaskListItemForActor(db, view.job.id, actor.id, {
                        service_catalog_item_id: item.id,
                      }),
                    )
                  }
                >
                  Add {item.name} · {money(item.base_rate)}
                </button>
              ))}
            </div>
          )}
          <label>
            Manual task
            <input
              aria-label="Manual task name"
              value={manual}
              onChange={(event) => setManual(event.target.value)}
            />
          </label>
          <label>
            Pre-GST rate
            <input
              aria-label="Manual task rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            className="secondary-action"
            onClick={() => {
              if (
                run((db) =>
                  addJobTaskListItemForActor(db, view.job.id, actor.id, {
                    name: manual,
                    base_rate: rate,
                  }),
                )
              ) {
                setManual("");
                setRate(0);
              }
            }}
          >
            Add manual task
          </button>
        </div>
      )}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <div className="table-wrap">
        <table aria-label="Job task list">
          <thead>
            <tr>
              <th>Done</th>
              <th>Task</th>
              <th>Pre-GST rate</th>
              {editable && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {view.task_list_items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    aria-label={`${item.name} done`}
                    type="checkbox"
                    checked={Boolean(item.done)}
                    disabled={!editable}
                    onChange={(event) =>
                      run((db) =>
                        updateJobTaskListItemForActor(db, item.id, actor.id, {
                          name: item.name,
                          base_rate: item.base_rate,
                          done: event.target.checked ? 1 : 0,
                        }),
                      )
                    }
                  />
                </td>
                <td>
                  {editable ? (
                    <input
                      aria-label={`${item.name} name`}
                      value={item.name}
                      onChange={(event) =>
                        run((db) =>
                          updateJobTaskListItemForActor(db, item.id, actor.id, {
                            name: event.target.value,
                            base_rate: item.base_rate,
                            done: item.done,
                          }),
                        )
                      }
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {editable ? (
                    <input
                      aria-label={`${item.name} rate`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.base_rate}
                      onChange={(event) =>
                        run((db) =>
                          updateJobTaskListItemForActor(db, item.id, actor.id, {
                            name: item.name,
                            base_rate: Number(event.target.value),
                            done: item.done,
                          }),
                        )
                      }
                    />
                  ) : (
                    money(item.base_rate)
                  )}
                </td>
                {editable && (
                  <td>
                    <button
                      type="button"
                      className="danger-action"
                      onClick={() =>
                        run((db) =>
                          archiveJobTaskListItemForActor(db, item.id, actor.id),
                        )
                      }
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!view.task_list_items.length && (
        <p className="empty-state">No task-list items yet.</p>
      )}
      {!editable && (
        <p className="permission-note">
          Read-only. Only the Owner or linked Service Advisor can edit active
          NEW and IN_PROGRESS jobs.
        </p>
      )}
    </section>
  );
}

function CustomerRecordDialog({
  customer,
  state,
  mutate,
  mode,
  onClose,
}: {
  customer: Customer;
  state: WorkshopState;
  mutate: Mutate;
  mode: "view" | "edit";
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(customer);
  const vehicles = [...state.vehicles, ...state.archived_vehicles].filter(
    (vehicle) => vehicle.customer_id === customer.id,
  );
  const jobs = [...state.jobs, ...state.archived_jobs].filter(
    (view) => view.customer.id === customer.id,
  );
  return (
    <Dialog
      wide
      title={`${mode === "view" ? "View" : "Edit"} Customer`}
      subtitle={`${customer.name} · ${customer.mobile}`}
      onClose={onClose}
    >
      {mode === "edit" ? (
        <CustomerEditor
          embedded
          value={draft}
          setValue={setDraft}
          mutate={mutate}
          onSaved={onClose}
        />
      ) : (
        <div className="record-view">
          {customer.archived_at && (
            <>
              <p className="permission-note">Read-only archived record.</p>
              <Info label="Archived on" value={customer.archived_at} />
              <Info
                label="Archive reason"
                value={customer.archived_reason ?? "—"}
              />
            </>
          )}
          <Info label="Customer type" value={customer.type} />
          <Info label="Vehicles" value={vehicles.length} />
          {vehicles.map((vehicle) => (
            <Info
              key={vehicle.id}
              label={vehicle.number}
              value={`${vehicle.make} ${vehicle.model}`}
            />
          ))}
          <Info label="Jobs" value={jobs.length} />
          {jobs.map((view) => (
            <Info
              key={view.job.id}
              label={view.job.job_no}
              value={`${view.vehicle.number} · ${view.job.main_status}`}
            />
          ))}
        </div>
      )}
    </Dialog>
  );
}

function VehicleRecordDialog({
  vehicle,
  state,
  mutate,
  mode,
  onClose,
}: {
  vehicle: Vehicle;
  state: WorkshopState;
  mutate: Mutate;
  mode: "view" | "edit";
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(vehicle);
  const owner = [...state.customers, ...state.archived_customers].find(
    (customer) => customer.id === vehicle.customer_id,
  );
  const jobs = [...state.jobs, ...state.archived_jobs].filter(
    (view) => view.vehicle.id === vehicle.id,
  );
  return (
    <Dialog
      wide
      title={`${mode === "view" ? "View" : "Edit"} Vehicle`}
      subtitle={`${vehicle.number} · ${vehicle.make} ${vehicle.model}`}
      onClose={onClose}
    >
      {mode === "edit" ? (
        <VehicleMasterPanel
          embedded
          state={state}
          value={draft}
          setValue={setDraft}
          mutate={mutate}
          onSaved={onClose}
        />
      ) : (
        <div className="record-view">
          {vehicle.archived_at && (
            <>
              <p className="permission-note">Read-only archived record.</p>
              <Info label="Archived on" value={vehicle.archived_at} />
              <Info
                label="Archive reason"
                value={vehicle.archived_reason ?? "—"}
              />
            </>
          )}
          <Info label="Registration" value={vehicle.number} />
          <Info
            label="Make / model"
            value={`${vehicle.make} ${vehicle.model}`}
          />
          <Info label="Color" value={vehicle.color} />
          <Info
            label="Odometer"
            value={`${vehicle.km.toLocaleString("en-IN")} km`}
          />
          <Info
            label="Owner"
            value={owner ? `${owner.name} · ${owner.mobile}` : "—"}
          />
          <Info label="Linked jobs" value={jobs.length} />
          {jobs.map((view) => (
            <Info
              key={view.job.id}
              label={view.job.job_no}
              value={`${view.job.main_status} · ${view.visit.received_at.slice(0, 10)}`}
            />
          ))}
        </div>
      )}
    </Dialog>
  );
}

function Timeline({ view, users = [] }: { view: JobView; users?: User[] }) {
  const events = buildDataFlowTimeline(view, users);
  return (
    <section
      className="data-flow-timeline"
      aria-label="Chronological data flow"
    >
      <PanelTitle
        icon={<ClipboardCheck />}
        title="Chronological Data Flow"
        subtitle={`${events.length} event${events.length === 1 ? "" : "s"}`}
      />
      <ol>
        {events.map((event) => (
          <li
            key={event.id}
            className={`timeline-event ${event.state ?? ""}`}
            data-event-kind={event.kind}
          >
            <time dateTime={event.timestamp}>
              {formatTimestamp(event.timestamp)}
            </time>
            <div>
              <strong>{event.title}</strong>
              <span>{event.detail}</span>
              {event.actor && <small>Actor: {event.actor}</small>}
            </div>
            {event.state && (
              <span className="timeline-state">{event.state}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function JobSnapshot({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Info
        label="Customer"
        value={`${view.customer.name} / ${view.customer.mobile}`}
      />
      <Info
        label="Vehicle"
        value={`${view.vehicle.number} / ${view.vehicle.make} ${view.vehicle.model}`}
      />
      <Info label="Job Card" value={view.job.job_no} />
      <Info
        label="Status"
        value={`${view.job.main_status} / ${view.job.sub_status}`}
      />
    </div>
  );
}

function VisitEditor({
  view,
  advisors,
  attendance,
  today,
  mutate,
}: {
  view: JobView;
  advisors: User[];
  attendance: WorkshopState["attendance"];
  today: string;
  mutate: Mutate;
}) {
  const [advisorId, setAdvisorId] = useState(view.job.advisor_id);
  const present = presentAdvisors(advisors, attendance, today);
  const ordered = [
    ...present,
    ...advisors.filter(
      (advisor) => !present.some((item) => item.id === advisor.id),
    ),
  ];
  const assigned = advisors.find(
    (advisor) => advisor.id === view.job.advisor_id,
  );
  const assignedAway =
    assigned && !present.some((advisor) => advisor.id === assigned.id);
  return (
    <div className="editor-block reception-advisor-editor">
      <div className="reception-advisor-action-row">
        <label>
          Advisor
          <select
            value={advisorId}
            onChange={(event) => setAdvisorId(Number(event.target.value))}
          >
            {advisorId === 0 && <option value={0}>Not mapped</option>}
            {ordered.map((advisor) => (
              <option key={advisor.id} value={advisor.id}>
                {advisor.name}
                {present.some((item) => item.id === advisor.id)
                  ? " (Present)"
                  : " (Away)"}
              </option>
            ))}
          </select>
        </label>
        <button
          className="primary-action"
          disabled={!advisorId || advisorId === view.job.advisor_id}
          onClick={() =>
            mutate((db) => assignAdvisor(db, view.job.id, advisorId))
          }
        >
          {view.job.advisor_id ? "Update Advisor" : "Assign Advisor"}
        </button>
      </div>
      {assignedAway && (
        <p className="permission-note">
          {assigned.name} is away today but remains assigned.
        </p>
      )}
    </div>
  );
}

function DuplicateCustomerEditor({
  value,
  setValue,
  mutate,
}: {
  value: Customer;
  setValue: (value: Customer) => void;
  mutate: Mutate;
}) {
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<UserRound />}
        title="Customer Editor"
        subtitle="Update selected customer"
      />
      <label>
        Name
        <input
          value={value.name}
          onChange={(event) => setValue({ ...value, name: event.target.value })}
        />
      </label>
      <label>
        Mobile
        <input
          value={value.mobile}
          onChange={(event) =>
            setValue({ ...value, mobile: event.target.value })
          }
        />
      </label>
      <label>
        Type
        <input
          value={value.type}
          onChange={(event) => setValue({ ...value, type: event.target.value })}
        />
      </label>
      <div className="action-row">
        <button
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              updateCustomer(db, value.id, {
                name: value.name,
                mobile: value.mobile,
                type: value.type,
              }),
            )
          }
        >
          Save Customer
        </button>
        <button
          className="danger-action"
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              archiveCustomer(db, value.id, "Archived from customer desk"),
            )
          }
        >
          Archive
        </button>
      </div>
    </div>
  );
}

function DuplicateVehicleMasterPanel({
  state,
  value,
  setValue,
  mutate,
}: {
  state: WorkshopState;
  value: Vehicle;
  setValue: (value: Vehicle) => void;
  mutate: Mutate;
}) {
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<Car />}
        title="Vehicle Editor"
        subtitle="Update selected vehicle"
      />
      <label>
        Customer
        <select
          value={value.customer_id}
          onChange={(event) =>
            setValue({ ...value, customer_id: Number(event.target.value) })
          }
        >
          {state.customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Number
        <input
          value={value.number}
          onChange={(event) =>
            setValue({ ...value, number: event.target.value })
          }
        />
      </label>
      <label>
        Make
        <input
          value={value.make}
          onChange={(event) => setValue({ ...value, make: event.target.value })}
        />
      </label>
      <label>
        Model
        <input
          value={value.model}
          onChange={(event) =>
            setValue({ ...value, model: event.target.value })
          }
        />
      </label>
      <label>
        Color
        <input
          value={value.color}
          onChange={(event) =>
            setValue({ ...value, color: event.target.value })
          }
        />
      </label>
      <label>
        KM
        <input
          type="number"
          value={value.km}
          onChange={(event) =>
            setValue({ ...value, km: Number(event.target.value) })
          }
        />
      </label>
      <div className="action-row">
        <button
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              updateVehicle(db, value.id, {
                customer_id: value.customer_id,
                number: value.number,
                make: value.make,
                model: value.model,
                color: value.color,
                km: value.km,
              }),
            )
          }
        >
          Save Vehicle
        </button>
        <button
          className="danger-action"
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              archiveVehicle(db, value.id, "Archived from vehicle desk"),
            )
          }
        >
          Archive
        </button>
      </div>
    </div>
  );
}

function DuplicateEstimateEditor({
  view,
  mutate,
}: {
  view: JobView;
  mutate: Mutate;
}) {
  const estimateId = view.estimate?.id;
  const [draft, setDraft] = useState({
    kind: "Service" as EstimateItem["kind"],
    description: "Additional work",
    qty: 1,
    rate: 1000,
  });
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<ReceiptText />}
        title="Estimate Items"
        subtitle="Edit line items"
      />
      {view.estimate_items.map((item) => (
        <div className="request-line" key={item.id}>
          <Info label={item.description} value={money(item.qty * item.rate)} />
          <button
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveEstimateItem(db, item.id, "Removed from estimate"),
              )
            }
          >
            Archive Item
          </button>
        </div>
      ))}
      <label>
        Description
        <input
          value={draft.description}
          onChange={(event) =>
            setDraft({ ...draft, description: event.target.value })
          }
        />
      </label>
      <label>
        Qty
        <input
          type="number"
          value={draft.qty}
          onChange={(event) =>
            setDraft({ ...draft, qty: Number(event.target.value) })
          }
        />
      </label>
      <label>
        Rate
        <input
          type="number"
          value={draft.rate}
          onChange={(event) =>
            setDraft({ ...draft, rate: Number(event.target.value) })
          }
        />
      </label>
      <button
        disabled={!estimateId}
        onClick={() =>
          estimateId &&
          mutate((db) =>
            createEstimateItem(db, { estimate_id: estimateId, ...draft }),
          )
        }
      >
        Add Item
      </button>
    </div>
  );
}

function DuplicateFollowupEditor({
  view,
  mutate,
}: {
  view: JobView;
  mutate: Mutate;
}) {
  const [note, setNote] = useState("Customer update required");
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<ClipboardCheck />}
        title="Follow-ups"
        subtitle="Customer touchpoints"
      />
      {view.followups.map((followup) => (
        <div className="request-line" key={followup.id}>
          <Info label={followup.due_at} value={followup.note} />
          <div className="action-row">
            <button
              onClick={() =>
                mutate((db) =>
                  markFollowupDone(db, followup.id, followup.outcome || "Done"),
                )
              }
            >
              Done
            </button>
            <button
              className="danger-action"
              onClick={() =>
                mutate((db) =>
                  archiveFollowup(db, followup.id, "Removed follow-up"),
                )
              }
            >
              Archive
            </button>
          </div>
        </div>
      ))}
      <label>
        New note
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <button
        onClick={() =>
          mutate((db) =>
            createFollowup(db, {
              job_card_id: view.job.id,
              note,
              due_at: new Date().toISOString().slice(0, 10),
              done: 0,
              outcome: "",
            }),
          )
        }
      >
        Add Follow-up
      </button>
    </div>
  );
}

function DuplicateTimeline({ view }: { view: JobView }) {
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<ClipboardList />}
        title="Timeline"
        subtitle="Current linked records"
      />
      <LinkedRecords view={view} />
    </div>
  );
}

function DuplicateJobEditor({
  view,
  users,
  mutate,
  allowStatus,
}: {
  view: JobView;
  users: User[];
  mutate: Mutate;
  allowStatus: boolean;
}) {
  const [workList, setWorkList] = useState(view.job.work_list);
  const [advisorId, setAdvisorId] = useState(view.job.advisor_id);
  const [technicianId, setTechnicianId] = useState(view.job.technician_id);
  const [mainStatus, setMainStatus] = useState<MainStatus>(
    view.job.main_status,
  );
  const [subStatus, setSubStatus] = useState<SubStatus>(view.job.sub_status);
  return (
    <div className="editor-block">
      <label>
        Work List
        <input
          value={workList}
          onChange={(event) => setWorkList(event.target.value)}
        />
      </label>
      <label>
        Advisor
        <select
          value={advisorId}
          onChange={(event) => setAdvisorId(Number(event.target.value))}
        >
          {users
            .filter((item) => item.role === "service")
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Technician
        <select
          value={technicianId}
          onChange={(event) => setTechnicianId(Number(event.target.value))}
        >
          {users
            .filter((item) => item.role === "tech")
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>
      </label>
      {allowStatus && (
        <label>
          Status
          <select
            value={mainStatus}
            onChange={(event) =>
              setMainStatus(event.target.value as MainStatus)
            }
          >
            <option>NEW</option>
            <option>IN_PROGRESS</option>
            <option>COMPLETED</option>
            <option>CLOSED</option>
          </select>
        </label>
      )}
      {allowStatus && (
        <label>
          Sub Status
          <input
            value={subStatus}
            onChange={(event) => setSubStatus(event.target.value as SubStatus)}
          />
        </label>
      )}
      <button
        onClick={() =>
          mutate((db) =>
            updateJobCard(db, view.job.id, {
              advisor_id: advisorId,
              technician_id: technicianId,
              main_status: mainStatus,
              sub_status: subStatus,
              work_list: workList,
            }),
          )
        }
      >
        Save Job Card
      </button>
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

function DuplicateInventoryEditor({
  state,
  mutate,
}: {
  state: WorkshopState;
  mutate: Mutate;
}) {
  const first = state.inventory[0] ?? {
    ...emptyInventoryItem(),
    sku: "SKU",
    category: "General",
    name: "New Item",
    unit: "unit",
  };
  const [item, setItem] = useState<InventoryItem>(first);
  const [qty, setQty] = useState(1);
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<Boxes />}
        title="Inventory Editor"
        subtitle="Stock in, adjust, edit and archive"
      />
      <label>
        Item
        <select
          value={item.id}
          onChange={(event) =>
            setItem(
              state.inventory.find(
                (next) => next.id === Number(event.target.value),
              ) ?? item,
            )
          }
        >
          {state.inventory.map((next) => (
            <option key={next.id} value={next.id}>
              {next.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Name
        <input
          value={item.name}
          onChange={(event) => setItem({ ...item, name: event.target.value })}
        />
      </label>
      <label>
        Quantity
        <input
          type="number"
          value={qty}
          onChange={(event) => setQty(Number(event.target.value))}
        />
      </label>
      <div className="action-row">
        <button
          onClick={() => mutate((db) => updateInventoryItem(db, item.id, item))}
        >
          Save Item
        </button>
        <button
          onClick={() =>
            mutate((db) => stockIn(db, item.id, qty, "Manual stock-in"))
          }
        >
          Stock In
        </button>
        <button
          onClick={() =>
            mutate((db) => adjustStock(db, item.id, qty, "Manual adjustment"))
          }
        >
          Adjust
        </button>
        <button
          onClick={() =>
            mutate((db) =>
              createInventoryItem(db, {
                sku: `${item.sku}-NEW`,
                category: item.category,
                name: item.name,
                unit: item.unit,
                stock_qty: qty,
                low_stock_qty: item.low_stock_qty,
                selling_price: item.selling_price,
              }),
            )
          }
        >
          Duplicate New
        </button>
        <button
          className="danger-action"
          onClick={() =>
            mutate((db) =>
              archiveInventoryItem(db, item.id, "Archived from stock desk"),
            )
          }
        >
          Archive
        </button>
      </div>
    </div>
  );
}

function DuplicateMaterialRequestEditor({
  state,
  mutate,
}: {
  state: WorkshopState;
  mutate: Mutate;
}) {
  return <MaterialRequestEditor state={state} mutate={mutate} store />;
}

function DuplicateReconcileEditor({
  requests,
  mutate,
}: {
  requests: { request: MaterialRequest; item?: InventoryItem }[];
  mutate: Mutate;
}) {
  const first = requests[0]?.request;
  const [requestId, setRequestId] = useState(first?.id ?? 0);
  const [used, setUsed] = useState(first?.used_qty ?? 0);
  const [returned, setReturned] = useState(first?.returned_qty ?? 0);
  const [wasted, setWasted] = useState(first?.wasted_qty ?? 0);
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<Check />}
        title="Reconcile"
        subtitle="Used, returned and wasted quantity"
      />
      <label>
        Request
        <select
          value={requestId}
          onChange={(event) => setRequestId(Number(event.target.value))}
        >
          {requests.map(({ request, item }) => (
            <option key={request.id} value={request.id}>
              {item?.name ?? request.id}
            </option>
          ))}
        </select>
      </label>
      <label>
        Used
        <input
          type="number"
          value={used}
          onChange={(event) => setUsed(Number(event.target.value))}
        />
      </label>
      <label>
        Returned
        <input
          type="number"
          value={returned}
          onChange={(event) => setReturned(Number(event.target.value))}
        />
      </label>
      <label>
        Wasted
        <input
          type="number"
          value={wasted}
          onChange={(event) => setWasted(Number(event.target.value))}
        />
      </label>
      <button
        onClick={() =>
          mutate((db) =>
            reconcileMaterialQty(db, requestId, used, returned, wasted),
          )
        }
      >
        Save Reconcile
      </button>
    </div>
  );
}

function DuplicateTaskCreator({
  view,
  users,
  mutate,
}: {
  view: JobView;
  users: User[];
  mutate: Mutate;
}) {
  const [title, setTitle] = useState("Workshop task");
  const techId =
    users.find((item) => item.role === "tech")?.id ?? view.job.technician_id;
  return (
    <div className="editor-block">
      <label>
        New Task
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <button
        onClick={() =>
          mutate((db) =>
            createTask(db, {
              job_card_id: view.job.id,
              technician_id: techId,
              title,
              status: "Pending",
              notes: "",
            }),
          )
        }
      >
        Add Task
      </button>
    </div>
  );
}

function DuplicateQcEditor({
  view,
  technicianId,
  mutate,
}: {
  view: JobView;
  technicianId: number;
  mutate: Mutate;
}) {
  const [reason, setReason] = useState("Needs rework");
  return (
    <div className="editor-block">
      {view.qc_checks.map((check: QcCheck) => (
        <div className="request-line" key={check.id}>
          <Info
            label={check.label}
            value={check.passed ? "Pass" : check.fail_reason || "Pending"}
          />
          <div className="action-row">
            <button
              onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}
            >
              Pass
            </button>
            <button
              onClick={() =>
                mutate((db) =>
                  updateQcCheck(
                    db,
                    check.id,
                    false,
                    reason || `Rework: ${technicianId}`,
                  ),
                )
              }
            >
              Fail
            </button>
          </div>
        </div>
      ))}
      <label>
        Fail reason
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      <button onClick={() => mutate((db) => passQc(db, view.job.id))}>
        Pass All QC
      </button>
    </div>
  );
}

function DuplicateInvoiceSummary({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Info
        label="Invoice"
        value={view.invoice?.invoice_no || "Not generated"}
      />
      <Info
        label="Total"
        value={money(
          view.invoice?.total ??
            invoiceItemsTotal(view.estimate_items, view.estimate),
        )}
      />
      <Info label="Payment" value={paymentStatus(view)} />
    </div>
  );
}

function DuplicateDataFlow({ view }: { view: JobView }) {
  const steps = [
    "Visit",
    "Estimate",
    "Job Card",
    "Material",
    "Work",
    "QC",
    "Invoice",
    "Payment",
    "Gate Pass",
  ];
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
type EntityFilters = {
  search: string;
  primary: string;
  secondary: string;
  date: string;
  month: string;
  customer: string;
  vehicle: string;
  advisor: string;
  sort: string;
  archivedOnly: boolean;
};

function EntityList({
  kind,
  state,
  mutate,
  actor,
  initialFilters,
  initialSelectedId,
  onInitialSelectionConsumed,
  externalSearch,
  onExternalSearchChange,
  hideSearch = false,
}: {
  kind: EntityKind;
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  initialFilters?: Partial<EntityFilters>;
  initialSelectedId?: number;
  onInitialSelectionConsumed?: () => void;
  externalSearch?: string;
  onExternalSearchChange?: (value: string) => void;
  hideSearch?: boolean;
}) {
  const { role, id: userId } = actor;
  const emptyFilters: EntityFilters = {
    search: "",
    primary: "ALL",
    secondary: "ALL",
    date: "",
    month: "",
    customer: "ALL",
    vehicle: "ALL",
    advisor: "ALL",
    sort: kind === "jobs" ? "newest" : "alphabetical",
    archivedOnly: false,
  };
  const [filters, setFilters] = useState<EntityFilters>({
    ...emptyFilters,
    ...initialFilters,
  });
  const [page, setPage] = useState(1);
  const {
    search,
    primary: filter,
    secondary: secondaryFilter,
    date: dateFilter,
    month: monthFilter,
    customer: customerFilter,
    vehicle: vehicleFilter,
    advisor: advisorFilter,
    sort,
    archivedOnly,
  } = filters;
  const updateFilters = (patch: Partial<EntityFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters(emptyFilters);
    onExternalSearchChange?.("");
    setPage(1);
  };
  const effectiveSearch = externalSearch ?? search;
  const deferredSearch = useDeferredValue(effectiveSearch);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedId, setSelectedId] = useState<number | undefined>(
    initialSelectedId,
  );
  const [recordMode, setRecordMode] = useState<"view" | "edit">("view");
  useEffect(() => {
    if (initialSelectedId !== undefined) onInitialSelectionConsumed?.();
    // Only meant to consume a one-time hand-off from Search page navigation on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addingJob, setAddingJob] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: "",
    mobile: "",
    type: "Individual",
  });
  const scrollPosition = useRef(0);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  const jobs = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    const source =
      archivedOnly && role === "admin"
        ? state.archived_jobs
        : role === "service"
          ? state.jobs.filter((item) => item.job.advisor_id === userId)
          : state.jobs;
    return source
      .filter((item) => {
        const matchesText =
          !needle ||
          normalizeSearch(
            `${item.job.job_no} ${item.vehicle.number} ${item.vehicle.make} ${item.vehicle.model} ${item.customer.name} ${item.customer.mobile}`,
          ).includes(needle);
        return (
          matchesText &&
          (filter === "ALL" ||
            (filter === "ACTIVE"
              ? !["CLOSED", "CANCELLED"].includes(item.job.main_status)
              : item.job.main_status === filter)) &&
          (secondaryFilter === "ALL" ||
            item.job.sub_status === secondaryFilter) &&
          (!dateFilter || item.job.estimated_delivery === dateFilter) &&
          (dateFilter ||
            !monthFilter ||
            item.job.estimated_delivery?.slice(0, 7) === monthFilter) &&
          (customerFilter === "ALL" ||
            String(item.customer.id) === customerFilter) &&
          (vehicleFilter === "ALL" ||
            String(item.vehicle.id) === vehicleFilter) &&
          (advisorFilter === "ALL" || String(item.advisor.id) === advisorFilter)
        );
      })
      .sort((a, b) => {
        if (sort === "oldest") return a.job.id - b.job.id;
        if (sort === "amount") return jobTotal(b) - jobTotal(a);
        return b.job.id - a.job.id;
      });
  }, [
    deferredSearch,
    filter,
    secondaryFilter,
    dateFilter,
    monthFilter,
    customerFilter,
    vehicleFilter,
    advisorFilter,
    sort,
    archivedOnly,
    state.jobs,
    state.archived_jobs,
    role,
    userId,
  ]);

  const customers = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    const source =
      archivedOnly && role === "admin"
        ? state.archived_customers
        : state.customers;
    return source
      .filter(
        (item) =>
          (!needle ||
            normalizeSearch(`${item.name} ${item.mobile}`).includes(needle)) &&
          (filter === "ALL" || item.type === filter) &&
          (!monthFilter ||
            state.jobs.some(
              (view) =>
                view.customer.id === item.id &&
                view.visit.received_at.slice(0, 7) === monthFilter,
            )),
      )
      .sort((a, b) =>
        sort === "recent" ? b.id - a.id : a.name.localeCompare(b.name),
      );
  }, [
    deferredSearch,
    filter,
    monthFilter,
    sort,
    archivedOnly,
    role,
    state.jobs,
    state.customers,
    state.archived_customers,
  ]);

  const vehicles = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    const source =
      archivedOnly && role === "admin"
        ? state.archived_vehicles
        : state.vehicles;
    const owners =
      archivedOnly && role === "admin"
        ? [...state.customers, ...state.archived_customers]
        : state.customers;
    return source
      .filter((item) => {
        const owner =
          owners.find((customer) => customer.id === item.customer_id)?.name ??
          "";
        return (
          (!needle ||
            normalizeSearch(
              `${item.number} ${item.make} ${item.model} ${owner}`,
            ).includes(needle)) &&
          (!monthFilter ||
            state.jobs.some(
              (view) =>
                view.vehicle.id === item.id &&
                view.visit.received_at.slice(0, 7) === monthFilter,
            ))
        );
      })
      .sort((a, b) =>
        sort === "recent" ? b.id - a.id : a.number.localeCompare(b.number),
      );
  }, [
    deferredSearch,
    monthFilter,
    sort,
    archivedOnly,
    role,
    state.jobs,
    state.vehicles,
    state.archived_vehicles,
    state.customers,
    state.archived_customers,
  ]);

  const mediaJobs = useMemo(() => {
    if (archivedOnly && role === "admin")
      return [...state.jobs, ...state.archived_jobs];
    return role === "service"
      ? state.jobs.filter((job) => job.job.advisor_id === userId)
      : state.jobs;
  }, [archivedOnly, role, state.jobs, state.archived_jobs, userId]);

  const mediaMonths = useMemo(
    () =>
      [
        ...new Set(
          mediaJobs
            .map((job) => job.visit.received_at.slice(0, 7))
            .filter((value) => /^\d{4}-\d{2}$/.test(value)),
        ),
      ]
        .sort()
        .reverse(),
    [mediaJobs],
  );

  const media = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    return mediaJobs
      .flatMap((job) =>
        (archivedOnly
          ? (job.photo_history ?? []).filter((photo) => photo.archived_at)
          : job.photos
        ).map((photo) => ({ photo, job })),
      )
      .filter(({ photo, job }) => {
        const matchesText =
          !needle ||
          normalizeSearch(
            `${photo.label} ${job.job.job_no} ${job.vehicle.number}`,
          ).includes(needle);
        const received = job.visit.received_at.slice(0, 10);
        return (
          matchesText &&
          (filter === "ALL" || String(photo.job_card_id) === filter) &&
          (secondaryFilter === "ALL" ||
            (photo.category || "General") === secondaryFilter) &&
          (!dateFilter || received === dateFilter) && // Exact date intentionally takes precedence over month/year.
          (dateFilter || !monthFilter || received.slice(0, 7) === monthFilter)
        );
      })
      .sort((a, b) => b.photo.id - a.photo.id);
  }, [
    deferredSearch,
    filter,
    secondaryFilter,
    dateFilter,
    monthFilter,
    archivedOnly,
    mediaJobs,
  ]);

  const filtered: unknown[] =
    kind === "jobs"
      ? jobs
      : kind === "customers"
        ? customers
        : kind === "vehicles"
          ? vehicles
          : media;
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => {
    if (paged.page !== page) setPage(paged.page);
  }, [paged.page, page]);

  const changePage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => resultHeading.current?.focus());
  };
  const openRecord = (id: number, mode: "view" | "edit" = "view") => {
    scrollPosition.current = window.scrollY;
    setRecordMode(mode);
    setSelectedId(id);
  };
  const closeRecord = () => {
    setSelectedId(undefined);
    requestAnimationFrame(() => window.scrollTo(0, scrollPosition.current));
  };

  if (selectedId !== undefined && kind === "media") {
    const mediaJobs = archivedOnly
      ? [...state.jobs, ...state.archived_jobs]
      : state.jobs;
    const selectedJob = mediaJobs.find((item) =>
      (archivedOnly ? (item.photo_history ?? []) : item.photos).some(
        (photo) => photo.id === selectedId,
      ),
    );
    const selectedPhoto = (
      archivedOnly ? selectedJob?.photo_history : selectedJob?.photos
    )?.find((photo) => photo.id === selectedId);
    return (
      <section className="record-workspace">
        <button className="back-button" onClick={closeRecord}>
          ← Back to {entityTitle(kind)}
        </button>
        <div className="list-page-heading">
          <div>
            <h2>{entityTitle(kind)} Detail</h2>
            <p>Focused record workspace</p>
          </div>
        </div>
        {selectedJob && selectedPhoto && kind === "media" && (
          <div className="job-detail-layout">
            <aside className="desk-panel">
              <img
                className="media-detail-image"
                src={selectedPhoto.src || "/media-placeholder.svg"}
                alt={selectedPhoto.label}
              />
              <Info label="Vehicle" value={selectedJob.vehicle.number} />
              <Info label="Job" value={selectedJob.job.job_no} />
              {archivedOnly && (
                <>
                  <Info
                    label="Archived on"
                    value={selectedPhoto.archived_at ?? "—"}
                  />
                  <Info
                    label="Archive reason"
                    value={selectedPhoto.archived_reason ?? "—"}
                  />
                </>
              )}
            </aside>
            {archivedOnly ? (
              <div className="desk-panel">
                <p className="permission-note">Read-only archived media.</p>
                <Info label="Label" value={selectedPhoto.label} />
                <Info
                  label="Category"
                  value={selectedPhoto.category || "General"}
                />
              </div>
            ) : (
              <JobMediaPanel
                key={selectedPhoto.updated_at}
                view={selectedJob}
                actor={actor}
                mutate={mutate}
              />
            )}
          </div>
        )}
      </section>
    );
  }

  const title =
    kind === "jobs" && role === "admin" ? "Job Cards" : entityTitle(kind);
  const dialogJob =
    kind === "jobs" && selectedId !== undefined
      ? (archivedOnly ? state.archived_jobs : state.jobs).find(
          (item) => item.job.id === selectedId,
        )
      : undefined;
  const dialogCustomer =
    kind === "customers" && selectedId !== undefined
      ? (archivedOnly ? state.archived_customers : state.customers).find(
          (item) => item.id === selectedId,
        )
      : undefined;
  const dialogVehicle =
    kind === "vehicles" && selectedId !== undefined
      ? (archivedOnly ? state.archived_vehicles : state.vehicles).find(
          (item) => item.id === selectedId,
        )
      : undefined;
  const categories = Array.from(
    new Set(
      mediaJobs.flatMap((job) =>
        (archivedOnly
          ? (job.photo_history ?? []).filter((photo) => photo.archived_at)
          : job.photos
        ).map((photo) => photo.category || "General"),
      ),
    ),
  ).sort();
  const customerTypes = Array.from(
    new Set(state.customers.map((customer) => customer.type)),
  ).sort();
  const servedMonths = Array.from(
    new Set(
      state.jobs
        .map((view) => view.visit.received_at.slice(0, 7))
        .filter((value) => /^\d{4}-\d{2}$/.test(value)),
    ),
  )
    .sort()
    .reverse();
  const jobCustomerOptions = Array.from(
    new Map(
      state.jobs.map((item) => [item.customer.id, item.customer]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const jobVehicleOptions = Array.from(
    new Map(state.jobs.map((item) => [item.vehicle.id, item.vehicle])).values(),
  ).sort((a, b) => a.number.localeCompare(b.number));
  const jobAdvisorOptions = Array.from(
    new Map(state.jobs.map((item) => [item.advisor.id, item.advisor])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const canCreate =
    (kind === "customers" || kind === "vehicles") &&
    (role === "admin" || role === "reception");
  const canAddJob = kind === "jobs" && (role === "admin" || role === "service");
  const createLabel =
    kind === "customers"
      ? "Add Customer"
      : kind === "vehicles"
        ? "Add Vehicle"
        : "Upload Media";
  const exportFilters = activeFilterSummary(
    kind === "jobs"
      ? {
          Search: effectiveSearch.trim(),
          "Show archived only": archivedOnly ? "Yes" : "No",
          "Main status": filter,
          Workflow: secondaryFilter,
          Sort: sort,
          "Estimated Delivery Date": dateFilter,
          "Estimated Delivery Month": dateFilter ? "" : monthFilter,
          Customer:
            customerFilter === "ALL"
              ? "ALL"
              : (jobCustomerOptions.find(
                  (item) => String(item.id) === customerFilter,
                )?.name ?? customerFilter),
          Vehicle:
            vehicleFilter === "ALL"
              ? "ALL"
              : (jobVehicleOptions.find(
                  (item) => String(item.id) === vehicleFilter,
                )?.number ?? vehicleFilter),
          Advisor:
            advisorFilter === "ALL"
              ? "ALL"
              : (jobAdvisorOptions.find(
                  (item) => String(item.id) === advisorFilter,
                )?.name ?? advisorFilter),
        }
      : kind === "customers"
        ? {
            Search: effectiveSearch.trim(),
            "Show archived only": archivedOnly ? "Yes" : "No",
            "Customer type": filter,
            "Served month": monthFilter,
            Sort: sort,
          }
        : kind === "media"
          ? {
              Search: effectiveSearch.trim(),
              "Show archived only": archivedOnly ? "Yes" : "No",
              "Job card":
                filter === "ALL"
                  ? "ALL"
                  : (mediaJobs.find((row) => String(row.job.id) === filter)?.job
                      .job_no ?? filter),
              Category: secondaryFilter,
              "Received date": dateFilter,
              "Month-Year": dateFilter ? "" : monthFilter,
            }
          : {
              Search: effectiveSearch.trim(),
              "Show archived only": archivedOnly ? "Yes" : "No",
              "Served month": monthFilter,
              Sort: sort,
            },
  );
  const exportColumns: ExportColumn<any>[] =
    kind === "jobs"
      ? [
          { header: "Job", value: (row: JobView) => row.job.job_no },
          {
            header: "Vehicle",
            value: (row: JobView) =>
              `${row.vehicle.number} ${row.vehicle.make} ${row.vehicle.model}`,
          },
          { header: "Customer", value: (row: JobView) => row.customer.name },
          { header: "Estimated Delivery Date", value: (row: JobView) => row.job.estimated_delivery || "—" },
          { header: "Status", value: (row: JobView) => row.job.main_status },
          { header: "Workflow", value: (row: JobView) => row.job.sub_status },
          { header: "Total", value: (row: JobView) => jobTotal(row) },
        ]
      : kind === "customers"
        ? [
            { header: "Customer", value: (row: Customer) => row.name },
            { header: "Mobile", value: (row: Customer) => row.mobile },
            { header: "Type", value: (row: Customer) => row.type },
            {
              header: "Vehicles",
              value: (row: Customer) =>
                state.vehicles.filter(
                  (vehicle) => vehicle.customer_id === row.id,
                ).length,
            },
            {
              header: "Open jobs",
              value: (row: Customer) =>
                state.jobs.filter(
                  (job) =>
                    job.customer.id === row.id &&
                    job.job.main_status !== "CLOSED",
                ).length,
            },
          ]
        : kind === "vehicles"
          ? [
              { header: "Registration", value: (row: Vehicle) => row.number },
              {
                header: "Make / Model",
                value: (row: Vehicle) => `${row.make} ${row.model}`,
              },
              { header: "Color", value: (row: Vehicle) => row.color },
              {
                header: "Customer",
                value: (row: Vehicle) =>
                  state.customers.find(
                    (customer) => customer.id === row.customer_id,
                  )?.name ?? "",
              },
              { header: "KM", value: (row: Vehicle) => row.km },
            ]
          : [
              {
                header: "Label",
                value: (row: { photo: Photo }) => row.photo.label,
              },
              {
                header: "Category",
                value: (row: { photo: Photo }) =>
                  row.photo.category ?? "General",
              },
              {
                header: "Vehicle",
                value: (row: { job: JobView }) => row.job.vehicle.number,
              },
              {
                header: "Job",
                value: (row: { job: JobView }) => row.job.job.job_no,
              },
            ];
  return (
    <section className={`entity-list-page kind-${kind}`}>
      {dialogJob && (
        <JobRecordDialog
          view={dialogJob}
          state={state}
          mutate={mutate}
          actor={actor}
          mode={archivedOnly ? "view" : recordMode}
          historical={archivedOnly}
          onClose={closeRecord}
        />
      )}
      {dialogCustomer && (
        <CustomerRecordDialog
          customer={dialogCustomer}
          state={state}
          mutate={mutate}
          mode={recordMode}
          onClose={closeRecord}
        />
      )}
      {dialogVehicle && (
        <VehicleRecordDialog
          vehicle={dialogVehicle}
          state={state}
          mutate={mutate}
          mode={recordMode}
          onClose={closeRecord}
        />
      )}
      <div className="list-page-heading">
        <div>
          <h2 ref={resultHeading} tabIndex={-1}>
            {title}
          </h2>
          <p>
            {kind === "media"
              ? "Before, after and workshop documentation"
              : `Browse and manage ${title.toLocaleLowerCase()}`}
          </p>
        </div>
        {canCreate && (
          <button className="primary-action" onClick={() => setCreating(true)}>
            {createLabel}
          </button>
        )}
        {canAddJob && (
          <button className="primary-action" onClick={() => setAddingJob(true)}>
            Add Job Card
          </button>
        )}
      </div>
      {addingJob && (
        <AddJobCardDialog
          state={state}
          mutate={mutate}
          actor={actor}
          onClose={() => setAddingJob(false)}
        />
      )}
      {creating && (
        <Dialog title={createLabel} onClose={() => setCreating(false)}>
          {kind === "customers" && (
            <CustomerEditor
              embedded
              value={newCustomer}
              setValue={setNewCustomer}
              mutate={mutate}
            />
          )}
          {kind === "vehicles" && (
            <VehicleMasterPanel
              embedded
              state={state}
              value={{
                id: 0,
                customer_id: state.customers[0]?.id ?? 0,
                number: "",
                make: "",
                model: "",
                color: "",
                km: 0,
              }}
              setValue={() => undefined}
              mutate={mutate}
            />
          )}
        </Dialog>
      )}
      <div className="list-filter-bar">
        {!hideSearch && (
          <label className="list-search">
            Search
            <input
              aria-label={`Search ${title.toLocaleLowerCase()}`}
              value={effectiveSearch}
              placeholder={searchPlaceholder(kind)}
              onChange={(event) =>
                onExternalSearchChange
                  ? onExternalSearchChange(event.target.value)
                  : updateFilters({ search: event.target.value })
              }
            />
          </label>
        )}
        <button
          className="mobile-filter-toggle"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((value) => !value)}
        >
          {filtersOpen ? "Hide filters" : "Show filters"}
        </button>
        <div
          className={
            filtersOpen ? "list-filter-fields open" : "list-filter-fields"
          }
        >
          {role === "admin" && (
            <Switch
              label="Show archived only"
              checked={archivedOnly}
              onCheckedChange={(checked) => {
                updateFilters({ archivedOnly: checked });
                setSelectedId(undefined);
              }}
            />
          )}
          {kind === "jobs" && (
            <>
              <label>
                Main status
                <select
                  aria-label="Main status"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
                  <option value="ALL">All statuses</option>
                  {[
                    "NEW",
                    "IN_PROGRESS",
                    "COMPLETED",
                    "CANCELLED",
                    "CLOSED",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Workflow
                <select
                  aria-label="Workflow status"
                  value={filters.secondary}
                  onChange={(event) =>
                    updateFilters({ secondary: event.target.value })
                  }
                >
                  <option value="ALL">All workflows</option>
                  {Array.from(
                    new Set(state.jobs.map((item) => item.job.sub_status)),
                  ).map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Estimated Delivery Date
                <input
                  aria-label="Estimated delivery date"
                  type="date"
                  value={filters.date}
                  onChange={(event) =>
                    updateFilters({ date: event.target.value })
                  }
                />
              </label>
              <label>
                Estimated Delivery Month
                <input
                  aria-label="Estimated delivery month"
                  type="month"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                />
              </label>
              <label>
                Customer
                <select
                  aria-label="Customer filter"
                  value={filters.customer}
                  onChange={(event) =>
                    updateFilters({ customer: event.target.value })
                  }
                >
                  <option value="ALL">All customers</option>
                  {jobCustomerOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Vehicle
                <select
                  aria-label="Vehicle filter"
                  value={filters.vehicle}
                  onChange={(event) =>
                    updateFilters({ vehicle: event.target.value })
                  }
                >
                  <option value="ALL">All vehicles</option>
                  {jobVehicleOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.number}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Service advisor
                <select
                  aria-label="Service advisor filter"
                  value={filters.advisor}
                  onChange={(event) =>
                    updateFilters({ advisor: event.target.value })
                  }
                >
                  <option value="ALL">All advisors</option>
                  {jobAdvisorOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {kind === "customers" && (
            <>
              <label>
                Customer type
                <select
                  aria-label="Customer type"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
                  <option value="ALL">All types</option>
                  {customerTypes.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Served month
                <select
                  aria-label="Customer served month"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                >
                  <option value="">All months</option>
                  {servedMonths.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {kind === "vehicles" && (
            <label>
              Served month
              <select
                aria-label="Vehicle served month"
                value={filters.month}
                onChange={(event) =>
                  updateFilters({ month: event.target.value })
                }
              >
                <option value="">All months</option>
                {servedMonths.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          )}
          {kind === "media" && (
            <>
              <label>
                Job card
                <select
                  aria-label="Job card filter"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
                  <option value="ALL">All job cards</option>
                  {mediaJobs.map((item) => (
                    <option value={item.job.id} key={item.job.id}>
                      {item.job.job_no}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select
                  aria-label="Media category"
                  value={filters.secondary}
                  onChange={(event) =>
                    updateFilters({ secondary: event.target.value })
                  }
                >
                  <option value="ALL">All categories</option>
                  {categories.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Received date
                <input
                  aria-label="Media received date"
                  type="date"
                  value={filters.date}
                  onChange={(event) =>
                    updateFilters({ date: event.target.value })
                  }
                />
              </label>
              <label>
                Month-Year
                <select
                  aria-label="Media month-year"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                >
                  <option value="">All months</option>
                  {mediaMonths.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {kind !== "media" && (
            <label>
              Sort
              <select
                aria-label="Sort results"
                value={filters.sort}
                onChange={(event) =>
                  updateFilters({ sort: event.target.value })
                }
              >
                {kind === "jobs" ? (
                  <>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="amount">Amount</option>
                  </>
                ) : (
                  <>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="recent">Recent</option>
                  </>
                )}
              </select>
            </label>
          )}
          <ListSearchActions onClear={clearFilters} />
        </div>
      </div>
      {kind === "media" && <MediaKpis rows={media} />}
      <PaginationToolbar
        controls={
          <>
            <ListExportControls
              report={{
                title,
                filters: exportFilters,
                columns: exportColumns,
                rows: filtered,
              }}
            />
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </>
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={changePage}
        pageSize={pageSize}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount === 0 ? (
        <div className="list-empty">
          <h3>No matching records</h3>
          <p>Adjust the search or clear the filters.</p>
          <FilterClearButton onClick={clearFilters} label="Clear filters" />
        </div>
      ) : (
        <EntityResults
          kind={kind}
          rows={paged.items}
          state={state}
          viewMode={viewMode}
          role={role}
          actor={actor}
          historical={archivedOnly}
          openRecord={openRecord}
          mutate={mutate}
        />
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={changePage}
      />
    </section>
  );
}

function entityTitle(kind: EntityKind) {
  return {
    jobs: "Jobs",
    customers: "Customers",
    vehicles: "Vehicles",
    media: "Media",
  }[kind];
}
function searchPlaceholder(kind: EntityKind) {
  return {
    jobs: "Job, vehicle or customer",
    customers: "Name or mobile",
    vehicles: "Registration, make, model or customer",
    media: "Label, job or vehicle",
  }[kind];
}
function jobTotal(view: JobView) {
  return (
    view.invoice?.total ?? invoiceItemsTotal(view.estimate_items, view.estimate)
  );
}

function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="view-toggle" role="group" aria-label="View mode">
      <button
        aria-pressed={value === "grid"}
        className={value === "grid" ? "active" : ""}
        onClick={() => onChange("grid")}
      >
        Grid
      </button>
      <button
        aria-pressed={value === "table"}
        className={value === "table" ? "active" : ""}
        onClick={() => onChange("table")}
      >
        Table
      </button>
    </div>
  );
}

function ListExportControls({
  report,
}: {
  report: {
    title: string;
    filters: string[];
    columns: ExportColumn<any>[];
    rows: any[];
  };
}) {
  return <DownloadMenu report={report} />;
}

function MediaKpis({ rows }: { rows: { photo: Photo; job: JobView }[] }) {
  const before = rows.filter(
    ({ photo }) =>
      photo.category === "Before Work" || photo.category === "Before",
  ).length;
  const after = rows.filter(
    ({ photo }) =>
      photo.category === "After Work" || photo.category === "After",
  ).length;
  return (
    <div className="media-kpis">
      <Info label="Total Images" value={rows.length} />
      <Info label="Before Images" value={before} />
      <Info label="After Images" value={after} />
      <Info
        label="Job Cards"
        value={new Set(rows.map(({ job }) => job.job.id)).size}
      />
    </div>
  );
}

function EntityResults({
  kind,
  rows,
  state,
  viewMode,
  role,
  actor,
  historical = false,
  openRecord,
  mutate,
}: {
  kind: EntityKind;
  rows: unknown[];
  state: WorkshopState;
  viewMode: ViewMode;
  role: Role;
  actor: User;
  historical?: boolean;
  openRecord: (id: number, mode?: "view" | "edit") => void;
  mutate: Mutate;
}) {
  const canArchive =
    !historical &&
    (kind === "media"
      ? role === "admin"
      : role === "admin" || role === "reception");
  const canManageJob = (row: JobView) =>
    !historical && canMutateJobLifecycle(actor, row.job);
  const archive = (id: number) => {
    if (
      !window.confirm(
        `Archive this ${kind === "media" ? "media record" : kind.slice(0, -1)}? It remains recoverable in the local database.`,
      )
    )
      return;
    mutate((db) =>
      kind === "jobs"
        ? archiveJobCardForActor(db, id, actor.id, "Archived from list")
        : kind === "customers"
          ? archiveCustomer(db, id, "Archived from list")
          : kind === "vehicles"
            ? archiveVehicle(db, id, "Archived from list")
            : archiveJobPhotoForActor(
                db,
                id,
                actor.id,
                "Archived from media list",
              ),
    );
  };
  const cardFor = (raw: unknown): ReactNode => {
    if (kind === "jobs") {
      const row = raw as JobView;
      const manageable = canManageJob(row);
      return (
        <article
          className={`record-card job-card job-status-${row.job.main_status.toLowerCase()}`}
          key={row.job.id}
        >
          <div className="record-identity">
            <strong>{row.vehicle.number}</strong>
            <span>
              {row.vehicle.make} {row.vehicle.model}
            </span>
          </div>
          <h3>{row.job.job_no}</h3>
          <p>
            {row.customer.name} · {row.customer.mobile}
          </p>
          <Status status={row.job.main_status} sub={row.job.sub_status} />
          <DocumentChips view={row} />
          <Info label="Total" value={money(jobTotal(row))} />
          <Info label="Estimated Delivery Date" value={row.job.estimated_delivery || "—"} />
          <RecordActions
            onView={() => openRecord(row.job.id, "view")}
            onEdit={
              manageable ? () => openRecord(row.job.id, "edit") : undefined
            }
            onArchive={manageable ? () => archive(row.job.id) : undefined}
          />
        </article>
      );
    }
    if (kind === "customers") {
      const row = raw as Customer;
      const vehicles = state.vehicles.filter(
        (item) => item.customer_id === row.id,
      );
      const jobs = state.jobs.filter((item) => item.customer.id === row.id);
      return (
        <article className="record-card" key={row.id}>
          <div className="record-identity">
            <strong>{row.name}</strong>
            <span>{row.mobile}</span>
          </div>
          <span className="category-badge">{row.type}</span>
          <Info label="Vehicles" value={vehicles.length} />
          <Info
            label="Open jobs"
            value={
              jobs.filter((job) => job.job.main_status !== "CLOSED").length
            }
          />
          <Info
            label="Last visit"
            value={jobs[0]?.visit.received_at?.slice(0, 10) || "—"}
          />
          <RecordActions
            onView={() => openRecord(row.id, "view")}
            onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined}
            onArchive={canArchive ? () => archive(row.id) : undefined}
          />
        </article>
      );
    }
    if (kind === "vehicles") {
      const row = raw as Vehicle;
      const customer = state.customers.find(
        (item) => item.id === row.customer_id,
      );
      return (
        <article className="record-card" key={row.id}>
          <div className="record-identity">
            <strong>{row.number}</strong>
            <span>
              {row.make} {row.model}
            </span>
          </div>
          <p>
            <i className="color-swatch" style={{ background: row.color }} />
            {row.color}
          </p>
          <Info label="Customer" value={customer?.name ?? "—"} />
          <Info label="KM" value={row.km.toLocaleString("en-IN")} />
          <RecordActions
            onView={() => openRecord(row.id, "view")}
            onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined}
            onArchive={canArchive ? () => archive(row.id) : undefined}
          />
        </article>
      );
    }
    const { photo, job } = raw as { photo: Photo; job: JobView };
    return (
      <article className="record-card media-card" key={photo.id}>
        <div className="media-preview">
          <img src={photo.src || "/media-placeholder.svg"} alt={photo.label} />
          <span>{photo.category || "General"}</span>
        </div>
        <h3>{job.vehicle.number}</h3>
        <p>
          {job.job.job_no} · {photo.label}
        </p>
        <RecordActions
          onView={() => openRecord(photo.id)}
          onArchive={canArchive ? () => archive(photo.id) : undefined}
        />
      </article>
    );
  };
  const cards = (
    <div className={`record-grid ${kind}`}>{rows.map(cardFor)}</div>
  );
  if (viewMode === "grid") return cards;
  return (
    <>
      <div className="mobile-table-fallback">{cards}</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {tableHeaders(kind).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((raw) => (
              <EntityTableRow
                key={rowId(kind, raw)}
                kind={kind}
                raw={raw}
                state={state}
                canArchive={canArchive}
                canManageJob={kind === "jobs" && canManageJob(raw as JobView)}
                openRecord={openRecord}
                archive={archive}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RecordActions({
  onView,
  onEdit,
  onArchive,
  inGrid = false,
  editLabel = "Edit",
}: {
  onView: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  inGrid?: boolean;
  editLabel?: string;
}) {
  const actionClass = inGrid ? "grid-action" : undefined;
  return (
    <div className={inGrid ? "grid-actions" : "record-actions"}>
      <button
        type="button"
        className={actionClass}
        onClick={(event) => {
          event.stopPropagation();
          onView();
        }}
      >
        View
      </button>
      {onEdit && (
        <button
          type="button"
          className={actionClass}
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          {editLabel}
        </button>
      )}
      {onArchive && (
        <button
          type="button"
          className={
            inGrid ? "grid-action grid-action-danger" : "danger-action"
          }
          onClick={(event) => {
            event.stopPropagation();
            onArchive();
          }}
        >
          Archive
        </button>
      )}
    </div>
  );
}
function CustomerDetail({
  customer,
  mutate,
}: {
  customer: Customer;
  mutate: Mutate;
}) {
  const [draft, setDraft] = useState(customer);
  return <CustomerEditor value={draft} setValue={setDraft} mutate={mutate} />;
}
function tableHeaders(kind: EntityKind) {
  return kind === "jobs"
    ? ["Job", "Vehicle", "Customer", "Estimated Delivery Date", "Status", "Total", "Actions"]
    : kind === "customers"
      ? ["Customer", "Mobile", "Type", "Vehicles", "Open Jobs", "Actions"]
      : kind === "vehicles"
        ? ["Registration", "Make / Model", "Color", "Customer", "KM", "Actions"]
        : ["Preview", "Label", "Category", "Vehicle / Job", "Actions"];
}
function rowId(kind: EntityKind, raw: unknown) {
  return kind === "jobs"
    ? (raw as JobView).job.id
    : kind === "media"
      ? (raw as { photo: Photo }).photo.id
      : (raw as Customer | Vehicle).id;
}
function EntityTableRow({
  kind,
  raw,
  state,
  canArchive,
  canManageJob,
  openRecord,
  archive,
}: {
  kind: EntityKind;
  raw: unknown;
  state: WorkshopState;
  canArchive: boolean;
  canManageJob: boolean;
  openRecord: (id: number, mode?: "view" | "edit") => void;
  archive: (id: number) => void;
}) {
  const id = rowId(kind, raw);
  let cells: ReactNode[];
  if (kind === "jobs") {
    const row = raw as JobView;
    cells = [
      row.job.job_no,
      `${row.vehicle.number} · ${row.vehicle.make} ${row.vehicle.model}`,
      row.customer.name,
      row.job.estimated_delivery || "—",
      <Status status={row.job.main_status} sub={row.job.sub_status} />,
      money(jobTotal(row)),
    ];
  } else if (kind === "customers") {
    const row = raw as Customer;
    cells = [
      row.name,
      row.mobile,
      row.type,
      state.vehicles.filter((item) => item.customer_id === row.id).length,
      state.jobs.filter(
        (item) =>
          item.customer.id === row.id && item.job.main_status !== "CLOSED",
      ).length,
    ];
  } else if (kind === "vehicles") {
    const row = raw as Vehicle;
    cells = [
      row.number,
      `${row.make} ${row.model}`,
      row.color,
      state.customers.find((item) => item.id === row.customer_id)?.name ?? "—",
      row.km.toLocaleString("en-IN"),
    ];
  } else {
    const { photo, job } = raw as { photo: Photo; job: JobView };
    cells = [
      <img
        className="table-thumb"
        src={photo.src || "/media-placeholder.svg"}
        alt=""
      />,
      photo.label,
      photo.category || "General",
      `${job.vehicle.number} · ${job.job.job_no}`,
    ];
  }
  const statusClass =
    kind === "jobs"
      ? `job-status-${(raw as JobView).job.main_status.toLowerCase()}`
      : undefined;
  return (
    <tr className={statusClass}>
      {cells.map((cell, index) => (
        <td key={index}>{cell}</td>
      ))}
      <td>
        <RecordActions
          inGrid
          onView={() => openRecord(id, "view")}
          onEdit={
            kind === "jobs"
              ? canManageJob
                ? () => openRecord(id, "edit")
                : undefined
              : (kind === "customers" || kind === "vehicles") && canArchive
                ? () => openRecord(id, "edit")
                : undefined
          }
          onArchive={
            kind === "jobs"
              ? canManageJob
                ? () => archive(id)
                : undefined
              : canArchive
                ? () => archive(id)
                : undefined
          }
        />
      </td>
    </tr>
  );
}

const CHIP_LABELS: Record<string, string> = {
  estimate: "Est",
  invoice: "Inv",
  "payment-receipt": "Rcpt",
  "gate-pass": "GP",
};

/** Four document chips (Estimate, Invoice, Receipt, Gate Pass): filled when created, hollow when not, struck when void. */
function DocumentChips({ view }: { view: JobView }) {
  const rows = resolveJobDocuments(view, loadDocumentSnapshots());
  return (
    <span className="doc-chips" aria-label="Documents">
      {(
        [
          "estimate",
          "invoice",
          "payment-receipt",
          "gate-pass",
        ] as DocumentKind[]
      ).map((kind) => {
        const current = rows.find(
          (row) => row.kind === kind && row.state !== "void",
        );
        const voided = rows.some(
          (row) => row.kind === kind && row.state === "void",
        );
        const state = current?.available
          ? current.state
          : voided
            ? "void"
            : "missing";
        const text =
          state === "missing"
            ? "not created"
            : state === "void"
              ? "void"
              : "created";
        return (
          <span
            key={kind}
            className={`doc-chip doc-chip-${state}`}
            title={`${DOCUMENT_LABELS[kind]}: ${text}`}
            data-state={state}
          >
            {CHIP_LABELS[kind]}
          </span>
        );
      })}
    </span>
  );
}

function JobRows({
  jobs,
  selectedJobId,
  onSelect,
}: {
  jobs: JobView[];
  selectedJobId?: number;
  onSelect?: (id: number) => void;
}) {
  return (
    <div className="row-list">
      {jobs.map((view) => (
        <button
          className={selectedJobId === view.job.id ? "row active" : "row"}
          key={view.job.id}
          onClick={() => onSelect?.(view.job.id)}
        >
          <strong>{view.job.job_no}</strong>
          <span>{view.vehicle.number}</span>
          <Status
            status={view.job.main_status}
            sub={view.job.sub_status}
            unmapped={
              view.job.advisor_id === 0 && view.job.main_status === "NEW"
            }
          />
          <DocumentChips view={view} />
        </button>
      ))}
    </div>
  );
}

function FilterableJobRows({
  title,
  jobs,
  selectedJobId,
  onSelect,
  showStatusFilter = false,
  readyToInvoiceFilters = false,
}: {
  title: string;
  jobs: JobView[];
  selectedJobId?: number;
  onSelect: (id: number) => void;
  showStatusFilter?: boolean;
  readyToInvoiceFilters?: boolean;
}) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState("ALL");
  const [receivedDate, setReceivedDate] = useState("");
  const [receivedMonth, setReceivedMonth] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(deferredSearch);
  const availableReceivedMonths = useMemo(
    () =>
      [
        ...new Set(
          jobs
            .map((row) => row.visit.received_at.slice(0, 7))
            .filter((month) => /^\d{4}-\d{2}$/.test(month)),
        ),
      ].sort((left, right) => right.localeCompare(left)),
    [jobs],
  );
  const filtered = useMemo(
    () =>
      jobs.filter((row) => {
        const receivedAt = row.visit.received_at;
        return (
          (!needle ||
            normalizeSearch(
              `${row.job.job_no} ${row.vehicle.number} ${row.customer.name}`,
            ).includes(needle)) &&
          (status === "ALL" || row.job.main_status === status) &&
          (!readyToInvoiceFilters ||
            !receivedDate ||
            receivedAt.slice(0, 10) === receivedDate) &&
          (!readyToInvoiceFilters ||
            !receivedMonth ||
            receivedAt.slice(0, 7) === receivedMonth)
        );
      }),
    [jobs, needle, status, readyToInvoiceFilters, receivedDate, receivedMonth],
  );
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => {
    if (paged.page !== page) setPage(paged.page);
  }, [paged.page, page]);
  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setReceivedDate("");
    setReceivedMonth("");
    setPage(1);
  };
  const columns: ExportColumn<JobView>[] = [
    { header: "Job", value: (row) => row.job.job_no },
    { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name },
    { header: "Status", value: (row) => row.job.main_status },
    { header: "Workflow", value: (row) => row.job.sub_status },
  ];
  return (
    <div className="embedded-list">
      <div
        className={
          readyToInvoiceFilters
            ? "store-filter-grid ready-to-invoice-filters"
            : "store-filter-grid"
        }
      >
        <label className="list-search">
          Search
          <input
            aria-label={`Search ${title.toLocaleLowerCase()}`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job, vehicle or customer"
          />
        </label>
        {readyToInvoiceFilters && (
          <>
            <label>
              Received date
              <input
                aria-label="Ready To Invoice received date"
                type="date"
                value={receivedDate}
                onChange={(event) => {
                  setReceivedDate(event.target.value);
                  setReceivedMonth("");
                  setPage(1);
                }}
              />
            </label>
            <label>
              Month-Year
              <select
                aria-label="Ready To Invoice month-year"
                value={receivedMonth}
                onChange={(event) => {
                  setReceivedMonth(event.target.value);
                  setReceivedDate("");
                  setPage(1);
                }}
              >
                <option value="">All months</option>
                {availableReceivedMonths.map((month) => (
                  <option key={month} value={month}>
                    {SEARCH_MONTH_YEAR_FORMATTER.format(
                      new Date(`${month}-01T00:00:00Z`),
                    )}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {showStatusFilter && (
          <label>
            Status
            <select
              aria-label={`${title} status`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All statuses</option>
              {["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        )}
        <ListSearchActions onClear={clearFilters} />
      </div>
      <PaginationToolbar
        controls={
          <ListExportControls
            report={{
              title,
              filters: activeFilterSummary({
                Search: search.trim(),
                Status: status,
                "Received date": readyToInvoiceFilters ? receivedDate : "",
                "Received month": readyToInvoiceFilters ? receivedMonth : "",
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel={`${title} records per page`}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount ? (
        readyToInvoiceFilters ? (
          <ReadyToInvoiceRows
            jobs={paged.items}
            selectedJobId={selectedJobId}
            onSelect={onSelect}
          />
        ) : (
          <JobRows
            jobs={paged.items}
            selectedJobId={selectedJobId}
            onSelect={onSelect}
          />
        )
      ) : (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton onClick={clearFilters} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}

function ReadyToInvoiceRows({
  jobs,
  selectedJobId,
  onSelect,
}: {
  jobs: JobView[];
  selectedJobId?: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="ready-to-invoice-rows" aria-label="Jobs awaiting invoice">
      {jobs.map((view) => {
        const draft = buildInvoiceDraft(view);
        const totals = invoiceTotals(draft.lines, draft.discount);
        const warning = unissuedWarning(draft.unissuedRows);
        const ready =
          view.estimate?.status === "Approved" && draft.lines.length > 0;
        return (
          <button
            type="button"
            key={view.job.id}
            className={`ready-to-invoice-row${selectedJobId === view.job.id ? " active" : ""}`}
            onClick={() => onSelect(view.job.id)}
          >
            <strong>{view.job.job_no}</strong>
            <span>
              {view.customer.name} · {view.vehicle.number}
            </span>
            <span>Received {view.visit.received_at.slice(0, 10)}</span>
            <span>
              {draft.lines.length} billable item
              {draft.lines.length === 1 ? "" : "s"}
            </span>
            <strong>{money(totals.total)}</strong>
            <span
              className={ready && !warning ? "ready-state" : "warning-state"}
            >
              {warning ??
                (ready ? "Ready to invoice" : "Estimate approval required")}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function PanelTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
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

export function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Status({
  status,
  sub,
  unmapped = false,
}: {
  status: string;
  sub: string;
  unmapped?: boolean;
}) {
  if (unmapped)
    return <span className="status hold">{ADVISOR_NOT_MAPPED_LABEL}</span>;
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

function textFields<T extends Record<string, unknown>>(
  form: T,
  setForm: (value: T) => void,
) {
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
    ["address", "Address"],
    ["engineNo", "Engine Number"],
    ["serviceType", "Service Type"],
    ["pickupDrop", "Pickup / Drop"],
    ["estimatedDelivery", "Estimated Delivery"],
  ] as [keyof T, string][];
}

export function money(value: number) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

export type Mutate = (
  action: (database: Database) => void,
  onError?: (message: string) => void,
) => boolean;

export default App;
