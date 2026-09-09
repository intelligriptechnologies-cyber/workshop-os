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
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import type { Database } from "sql.js";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  addFollowup,
  addPayment,
  addPhoto,
  adjustStock,
  approveEstimate,
  archiveCustomer,
  archiveEstimateItem,
  archiveFollowup,
  archiveInventoryItem,
  archiveMaterialRequest,
  archivePhoto,
  archiveTask,
  archiveVehicle,
  cancelJobCard,
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
  createVehicle,
  failQcWithRework,
  generateInvoice,
  generateReceiptAndGatePass,
  issueMaterial,
  issueMaterialQty,
  invoiceItemsTotal,
  login,
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
  updateVisit,
  updateVehicle,
  voidInvoice,
  voidPayment,
} from "./db";
import type { Customer, EstimateItem, Followup, InventoryItem, JobView, MainStatus, MaterialRequest, Photo, QcCheck, Role, SubStatus, Task, TaskStatus, User, Vehicle, WorkshopState } from "./types";

const roleLabels: Record<Role, string> = {
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
    { label: "Search", icon: <Search size={18} /> },
  ],
  service: [
    { label: "My Queue", icon: <ClipboardList size={18} /> },
    { label: "Job Card", icon: <FileText size={18} /> },
    { label: "Estimate", icon: <ReceiptText size={18} /> },
    { label: "Follow-ups", icon: <ClipboardCheck size={18} /> },
    { label: "Photos", icon: <Camera size={18} /> },
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
    { label: "Masters", icon: <Boxes size={18} /> },
    { label: "Search", icon: <Search size={18} /> },
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

function App() {
  const [db, setDb] = useState<Database>();
  const [state, setState] = useState<WorkshopState>();
  const [user, setUser] = useState<User>();
  const [selectedJobId, setSelectedJobId] = useState<number>();
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [railToggleTop, setRailToggleTop] = useState(118);
  const [railToggleDragged, setRailToggleDragged] = useState(false);
  const [query, setQuery] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    openWorkshopDb().then((database) => {
      setDb(database);
      const next = readState(database);
      setState(next);
      setSelectedJobId(next.jobs[0]?.job.id);
    });
  }, []);

  const jobs = useMemo(() => (state ? searchJobs(state, query) : []), [state, query]);
  const selected = jobs.find((item) => item.job.id === selectedJobId) ?? jobs[0] ?? state?.jobs[0];

  const mutate = (action: (database: Database) => void) => {
    if (!db) return;
    try {
      action(db);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Action failed");
      return;
    }
    persist(db);
    const next = readState(db);
    setState(next);
    if (!selectedJobId && next.jobs[0]) setSelectedJobId(next.jobs[0].job.id);
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
    setUser(undefined);
    setActiveMenuItem("");
  };

  const handleRailTogglePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    setRailToggleDragged(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleRailTogglePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if ((event.buttons & 1) !== 1) return;
    setRailToggleDragged(true);
    const nextTop = Math.min(Math.max(event.clientY - 22, 82), window.innerHeight - 92);
    setRailToggleTop(nextTop);
  };

  const handleRailTogglePointerUp = () => {
    if (railToggleDragged) {
      setRailToggleDragged(false);
      return;
    }
    setSidebarCollapsed((value) => !value);
  };

  if (!state) return <div className="loading">Loading local SQLite workspace...</div>;
  if (!user) return <LoginScreen onLogin={handleLogin} error={loginError} />;

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
          selected={selected}
          selectedJobId={selectedJobId}
          setQuery={setQuery}
          setSelectedJobId={setSelectedJobId}
          state={state}
          user={user}
        />
      </main>
    </div>
  );
}

function LoginScreen({ onLogin, error }: { onLogin: (email: string, password: string) => void; error: string }) {
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
        <form
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
        </form>
        <label className="demo-login-select">
          Emulate User:
          <select value={email} onChange={(event) => setEmail(event.target.value)}>
            {demoLogins.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span>Demo version now - use quick logins only.</span>
        </label>
      </section>
    </main>
  );
}

function RoleWorkspace({
  activeMenuItem,
  jobs,
  mutate,
  query,
  selected,
  selectedJobId,
  setQuery,
  setSelectedJobId,
  state,
  user,
}: {
  activeMenuItem: string;
  jobs: JobView[];
  mutate: Mutate;
  query: string;
  selected?: JobView;
  selectedJobId?: number;
  setQuery: (value: string) => void;
  setSelectedJobId: (value: number) => void;
  state: WorkshopState;
  user: User;
}) {
  if (activeMenuItem === "Search") {
    return (
      <>
        <SearchPortal jobs={jobs} query={query} selectedJobId={selected?.job.id ?? selectedJobId} setQuery={setQuery} setSelectedJobId={setSelectedJobId} />
        {selected && <SearchSummary view={selected} />}
      </>
    );
  }

  if (user.role === "reception") return <Reception activeMenuItem={activeMenuItem} state={state} mutate={mutate} user={user} selected={selected} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "service") return <ServiceAdvisor activeMenuItem={activeMenuItem} state={state} view={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "store") return <StoreDesk activeMenuItem={activeMenuItem} state={state} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "tech") return <Technician activeMenuItem={activeMenuItem} state={state} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  if (user.role === "accounts") return <Accounts activeMenuItem={activeMenuItem} state={state} view={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
  return <Admin activeMenuItem={activeMenuItem} state={state} selected={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} />;
}

function SearchPortal({
  jobs,
  query,
  selectedJobId,
  setQuery,
  setSelectedJobId,
}: {
  jobs: JobView[];
  query: string;
  selectedJobId?: number;
  setQuery: (value: string) => void;
  setSelectedJobId: (value: number) => void;
}) {
  return (
    <section className="portal">
      <label className="search-box">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search vehicle, mobile, customer, job card, invoice" />
      </label>
      <div className="job-strip">
        {jobs.map((job) => (
          <button key={job.job.id} className={selectedJobId === job.job.id ? "active" : ""} onClick={() => setSelectedJobId(job.job.id)}>
            <strong>{job.vehicle.number}</strong>
            <span>{job.customer.name}</span>
            <Status status={job.job.main_status} sub={job.job.sub_status} />
          </button>
        ))}
      </div>
    </section>
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

function SearchSummary({ view }: { view: JobView }) {
  return (
    <section className="search-summary">
      <div>
        <h2>{view.vehicle.number}</h2>
        <p>
          {view.customer.name} · {view.customer.mobile} · {view.vehicle.make} {view.vehicle.model}
        </p>
      </div>
      <Info label="Job Card" value={view.job.job_no} />
      <Info label="Advisor" value={view.advisor.name} />
      <Info label="Work" value={view.job.work_list} />
      <Info label="Invoice" value={view.invoice?.invoice_no || "Not generated"} />
      <Info label="Payment" value={paymentStatus(view)} />
      <Info label="Photos" value={`${view.photos.length} placeholder(s)`} />
    </section>
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
    mutate((db) => receiveVehicle(db, { ...form, receptionId: user.id }));
  };
  if (activeMenuItem === "Today Queue") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<Car />} title="Today Queue" subtitle={`${state.visits.length} visits recorded`} />
          <JobRows jobs={state.jobs.filter((item) => item.job.main_status !== "CLOSED")} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} />
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
  return (
    <section className="workspace single-panel">
      <form className="desk-panel intake-panel" onSubmit={submit}>
        <PanelTitle icon={<DoorOpen />} title="Receive Vehicle" subtitle="Customer, vehicle, visit and linked NEW job card" />
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
    </section>
  );
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
  const requests = state.jobs.flatMap((view) => view.material_requests.map((request, index) => ({ view, request, item: view.inventory[index] })));
  if (activeMenuItem === "Stock") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel stock-grid">
          <PanelTitle icon={<Boxes />} title="Stock" subtitle="PPF and paint inventory from demo workbook" />
          {state.inventory.map((item) => (
            <div key={item.id} className={item.stock_qty < item.low_stock_qty ? "stock-item low" : "stock-item"}>
              <strong>{item.name}</strong>
              <span>
                {item.stock_qty} {item.unit} · min {item.low_stock_qty}
              </span>
            </div>
          ))}
        </div>
        <InventoryEditor state={state} mutate={mutate} />
      </section>
    );
  }
  if (activeMenuItem === "Material Requests") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel issue-counter">
          <PanelTitle icon={<PackageCheck />} title="Material Requests" subtitle="Create, edit and archive job-linked requests" />
          {requests.map(({ view, request, item }) => (
            <button className="request-line" key={request.id} onClick={() => setSelectedJobId(view.job.id)}>
              <strong>{view.job.job_no}</strong>
              <span>{item?.name}</span>
              <Info label="Requested" value={`${request.requested_qty} ${item?.unit ?? ""}`} />
            </button>
          ))}
        </div>
        <MaterialRequestEditor state={state} mutate={mutate} />
      </section>
    );
  }
  return (
    <section className="workspace two-panel">
      <div className="desk-panel issue-counter">
        <PanelTitle icon={<PackageCheck />} title={activeMenuItem} subtitle="Issue only against a job card and reconcile movement" />
        {requests.map(({ view, request, item }) => {
          const diff = request.issued_qty - request.used_qty - request.returned_qty - request.wasted_qty;
          return (
            <div className="request-line" key={request.id}>
              <strong>{view.job.job_no}</strong>
              <span>{item?.name}</span>
              <Info label="Requested" value={`${request.requested_qty} ${item?.unit ?? ""}`} />
              <Info label="Issued = Used + Returned + Wasted" value={diff === 0 ? "Matched" : `Diff ${diff}`} />
              <div className="action-row">
                <button onClick={() => mutate((db) => issueMaterial(db, request.id))}>Issue</button>
                <button onClick={() => mutate((db) => reconcileMaterial(db, request.id, request.issued_qty, 0, 0))}>Reconcile</button>
              </div>
            </div>
          );
        })}
      </div>
      {activeMenuItem === "Issue Material" ? <IssueMaterialEditor requests={requests} mutate={mutate} /> : <ReconcileEditor requests={requests} mutate={mutate} />}
    </section>
  );
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
  const [delivery, setDelivery] = useState({ by: "Accounts Desk", finalKm: view?.vehicle.km ?? 0, acknowledgement: "Customer acknowledged delivery" });
  if (activeMenuItem === "Ready To Invoice") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle icon={<ClipboardList />} title="Ready To Invoice" subtitle="Completed jobs waiting for billing" />
          <JobRows jobs={state.jobs.filter((item) => item.job.main_status === "COMPLETED")} selectedJobId={view?.job.id} onSelect={setSelectedJobId} />
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
    return (
      <section className="workspace single-panel">
        <div className="desk-panel">
          <PanelTitle icon={<Banknote />} title="Payment" subtitle="Full or split collection" />
          <Info label="Invoice Total" value={money(view.invoice?.total ?? 0)} />
          <Info label="Paid" value={money(view.payments.reduce((sum, payment) => sum + payment.amount, 0))} />
          {view.payments.map((payment) => (
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

function Admin({ activeMenuItem, state, selected, mutate, setSelectedJobId }: { activeMenuItem: string; state: WorkshopState; selected?: JobView; mutate: Mutate; setSelectedJobId: (id: number) => void }) {
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

function CustomerEditor({ value, setValue, mutate }: { value: Customer; setValue: (value: Customer) => void; mutate: Mutate }) {
  return (
    <form className="desk-panel" onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (value.id ? updateCustomer(db, value.id, value) : createCustomer(db, value)));
    }}>
      <PanelTitle icon={<UserRound />} title="Customer Form" subtitle={value.id ? "Edit selected customer" : "Add customer"} />
      <label>Name<input value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} /></label>
      <label>Mobile<input value={value.mobile} onChange={(event) => setValue({ ...value, mobile: event.target.value })} /></label>
      <label>Type<input value={value.type} onChange={(event) => setValue({ ...value, type: event.target.value })} /></label>
      <div className="action-row">
        <button className="primary-action">Save Customer</button>
        <button type="button" onClick={() => setValue({ id: 0, name: "", mobile: "", type: "Individual" })}>New</button>
        {value.id > 0 && <button type="button" className="danger-action" onClick={() => mutate((db) => archiveCustomer(db, value.id, "Archived from customer master"))}>Archive</button>}
      </div>
    </form>
  );
}

function VehicleMasterPanel({ state, value, setValue, mutate }: { state: WorkshopState; value: Vehicle; setValue: (value: Vehicle) => void; mutate: Mutate }) {
  const [draft, setDraft] = useState<Vehicle>(value);
  return (
    <form className="desk-panel" onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (draft.id ? updateVehicle(db, draft.id, draft) : createVehicle(db, draft)));
    }}>
      <PanelTitle icon={<Car />} title="Vehicle Form" subtitle="Vehicle master CRUD" />
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
  const statuses: MainStatus[] = ["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"];
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
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => updateJobCard(db, view.job.id, draft));
    }}>
      <div className="form-grid">
        <label>Advisor<select value={draft.advisor_id} onChange={(event) => setDraft({ ...draft, advisor_id: Number(event.target.value) })}>{users.filter((item) => item.role === "service").map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}</select></label>
        <label>Technician<select value={draft.technician_id} onChange={(event) => setDraft({ ...draft, technician_id: Number(event.target.value) })}>{users.filter((item) => item.role === "tech").map((tech) => <option key={tech.id} value={tech.id}>{tech.name}</option>)}</select></label>
        {allowStatus && <label>Status<select value={draft.main_status} onChange={(event) => setDraft({ ...draft, main_status: event.target.value as MainStatus })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>}
        {allowStatus && <label>Sub Status<select value={draft.sub_status} onChange={(event) => setDraft({ ...draft, sub_status: event.target.value as SubStatus })}>{subStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>}
        <label>Promised<input value={draft.promised_at} onChange={(event) => setDraft({ ...draft, promised_at: event.target.value })} /></label>
      </div>
      <label>Work List<input value={draft.work_list} onChange={(event) => setDraft({ ...draft, work_list: event.target.value })} /></label>
      <label>Customer Instructions<input value={draft.customer_instructions} onChange={(event) => setDraft({ ...draft, customer_instructions: event.target.value })} /></label>
      <label>Internal Instructions<input value={draft.internal_instructions} onChange={(event) => setDraft({ ...draft, internal_instructions: event.target.value })} /></label>
      <label>Advisor Notes<input value={draft.advisor_notes} onChange={(event) => setDraft({ ...draft, advisor_notes: event.target.value })} /></label>
      <button className="primary-action">Save Job Card</button>
    </form>
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

function PhotoEditor({ view, mutate }: { view: JobView; mutate: Mutate }) {
  const [draft, setDraft] = useState<Photo>({ id: 0, job_card_id: view.job.id, label: "", category: "Progress", src: "" });
  return (
    <form className="desk-panel" onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (draft.id ? updatePhoto(db, draft.id, draft) : createPhoto(db, draft)));
    }}>
      <PanelTitle icon={<Camera />} title="Photos" subtitle="Label, category and image link" />
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

function MaterialRequestEditor({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const [draft, setDraft] = useState<MaterialRequest>({ id: 0, job_card_id: state.jobs[0]?.job.id ?? 0, item_id: state.inventory[0]?.id ?? 0, requested_qty: 1, issued_qty: 0, used_qty: 0, returned_qty: 0, wasted_qty: 0 });
  const requests = state.jobs.flatMap((view) => view.material_requests.map((request) => ({ ...request, job_card_id: view.job.id })));
  return (
    <form className="desk-panel" onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (draft.id ? updateMaterialRequest(db, draft.id, draft) : createMaterialRequest(db, draft)));
    }}>
      <PanelTitle icon={<PackageCheck />} title="Request Form" subtitle="Job-linked material request" />
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

function InventoryEditor({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const [draft, setDraft] = useState<InventoryItem>(state.inventory[0] ?? { id: 0, sku: "", category: "", name: "", unit: "", stock_qty: 0, low_stock_qty: 0 });
  const [movementQty, setMovementQty] = useState(1);
  return (
    <form className="desk-panel" onSubmit={(event) => {
      event.preventDefault();
      mutate((db) => (draft.id ? updateInventoryItem(db, draft.id, draft) : createInventoryItem(db, draft)));
    }}>
      <PanelTitle icon={<Boxes />} title="Stock Form" subtitle="Master, stock-in and adjustment" />
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

function TaskCreator({ view, users, mutate }: { view: JobView; users: User[]; mutate: Mutate }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const technicianId = users.find((item) => item.role === "tech")?.id ?? view.job.technician_id;
  return <form onSubmit={(event) => { event.preventDefault(); mutate((db) => createTask(db, { job_card_id: view.job.id, technician_id: technicianId, title, status: "Pending", notes })); setTitle(""); setNotes(""); }}><label>New Task<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Notes<input value={notes} onChange={(event) => setNotes(event.target.value)} /></label><button>Add Task</button></form>;
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

function PanelTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
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

function Info({ label, value }: { label: string; value: string | number }) {
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

function money(value: number) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

type Mutate = (action: (database: Database) => void) => void;

export default App;
