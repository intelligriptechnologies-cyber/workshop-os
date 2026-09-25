import { WORKBOOK_INVENTORY_SEED } from "./inventory-seed";
import { serializeDamageMarks, type DamageMark } from "./job-sheet";
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import { canEditIssuedMaterialRows, canReleaseMaterialRows, canManageMaterialRows, materialRowActions, materialRowStatus, MATERIALS_CHECKLIST_LABELS, materialRowActionsFor, overStockWarning, type MaterialRowAction } from "./materials";
import type {
  ChecklistCycle,
  ChecklistItem,
  ChecklistStage,
  Customer,
  Estimate,
  EstimateItem,
  Followup,
  GatePass,
  InventoryItem,
  Invoice,
  InvoiceItem,
  JobCard,
  JobView,
  MainStatus,
  MaterialEvent,
  MaterialMovement,
  MaterialRequest,
  Payment,
  PaymentMode,
  PaymentStatus,
  Photo,
  QcCheck,
  Receipt,
  Role,
  SearchCriteria,
  SearchResult,
  StatusHistory,
  SubStatus,
  Task,
  TaskStatus,
  User,
  Vehicle,
  Visit,
  WorkshopState,
} from "./types";
import { validateMediaDataUrl, type JobMediaCategory } from "./job-media";

const STORAGE_KEY = "workshopos.sqlite.v2";
const wasmUrl = new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url).href;
type DbValue = number | string | Uint8Array | null;

export const LIFECYCLE_CHECKLIST: Record<ChecklistStage, readonly SubStatus[]> = {
  NEW: ["Gather Requirements", "Create Estimate", "Get Confirmation"],
  IN_PROGRESS: ["Material Requested", "Material Issued", "Washing Needed", "Work Started", "Follow-up Needed", "Photos Shared", "QC Pending"],
  COMPLETED: ["Customer Verification", "Invoice Ready", "Payment Received"],
  CLOSED: ["Receipt Generated", "Gate Pass Generated", "Delivered"],
};

export function deriveChecklistSubStatus(items: readonly Pick<ChecklistItem, "label" | "sort_order" | "checked_at">[]): SubStatus {
  const ordered = [...items].sort((left, right) => left.sort_order - right.sort_order);
  if (ordered.length === 0) return "Gather Requirements";
  return (ordered.find((item) => !item.checked_at) ?? ordered.at(-1)!).label;
}

function checklistStageForSubStatus(subStatus: SubStatus): ChecklistStage {
  return (Object.entries(LIFECYCLE_CHECKLIST) as [ChecklistStage, readonly SubStatus[]][])
    .find(([, labels]) => labels.includes(subStatus))?.[0] ?? "NEW";
}

let SQL: SqlJsStatic | undefined;

export async function openWorkshopDb() {
  SQL ??= await initSqlJs({ locateFile: () => wasmUrl });
  const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("workshopos.sqlite.v1");
  const db = saved ? new SQL.Database(Uint8Array.from(atob(saved), (char) => char.charCodeAt(0))) : new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  if (scalar<number>(db, "select count(*) from users") === 0) seed(db);
  persist(db);
  return db;
}

export function persist(db: Database) {
  if (!SQL) throw new Error("SQL.js is not initialized.");
  const binary = exportPersistableDatabase(db, (bytes) => new SQL!.Database(bytes));
  let encoded = "";
  binary.forEach((byte: number) => {
    encoded += String.fromCharCode(byte);
  });
  localStorage.setItem(STORAGE_KEY, btoa(encoded));
}

export function exportPersistableDatabase(db: Database, cloneDatabase: (bytes: Uint8Array) => Database) {
  const clone = cloneDatabase(db.export());
  try {
    // Image payloads deliberately live only in the active SQL.js session database.
    clone.run("delete from photos where trim(coalesce(mime_type,''))<>'' or src like 'data:image/%'");
    resetMissingPhotoEvidence(clone);
    clone.run("vacuum");
    return clone.export();
  } finally {
    clone.close();
  }
}

export function readState(db: Database): WorkshopState {
  const users = all<User>(db, "select * from users where archived_at is null order by id");
  const customers = all<Customer>(db, "select * from customers where archived_at is null order by id");
  const vehicles = all<Vehicle>(db, "select * from vehicles where archived_at is null order by id");
  const visits = all<Visit>(db, "select * from visits where archived_at is null order by id desc");
  const inventory = all<InventoryItem>(db, "select i.*, i.stock_qty - coalesce((select sum(l.qty) from stock_ledger l where l.item_id=i.id),0) as stock_qty from inventory i where i.archived_at is null order by i.category, i.name");
  const jobRows = all<JobCard>(db, "select * from job_cards where archived_at is null order by id desc");
  const byId = <T extends { id: number }>(rows: T[]) => new Map(rows.map((row) => [row.id, row]));
  const groupBy = <T>(rows: T[], key: (row: T) => number) => {
    const grouped = new Map<number, T[]>();
    rows.forEach((row) => grouped.set(key(row), [...(grouped.get(key(row)) ?? []), row]));
    return grouped;
  };
  const allUsers = byId(all<User>(db, "select * from users"));
  const allCustomers = byId(all<Customer>(db, "select * from customers"));
  const allVehicles = byId(all<Vehicle>(db, "select * from vehicles"));
  const allVisits = byId(all<Visit>(db, "select * from visits"));
  const allInventory = byId(all<InventoryItem>(db, "select * from inventory"));
  const allEstimates = all<Estimate>(db, "select * from estimates order by id");
  const estimates = allEstimates.filter((row) => !row.archived_at);
  const estimatesByJob = groupBy(estimates, (row) => row.job_card_id);
  const estimateItemsByEstimate = groupBy(all<EstimateItem>(db, "select * from estimate_items where archived_at is null"), (row) => row.estimate_id);
  const materialByJob = groupBy(all<MaterialRequest>(db, "select * from material_requests where archived_at is null"), (row) => row.job_card_id);
  const tasksByJob = groupBy(all<Task>(db, "select * from tasks where archived_at is null"), (row) => row.job_card_id);
  const allInvoices = all<Invoice>(db, "select * from invoices order by id");
  const invoicesByJob = groupBy(allInvoices.filter((row) => !row.voided_at), (row) => row.job_card_id);
  const invoiceItemsByInvoice = groupBy(all<InvoiceItem>(db, "select * from invoice_items where archived_at is null order by id"), (row) => row.invoice_id);
  const allPayments = all<Payment>(db, "select * from payments order by id");
  const allReceipts = all<Receipt>(db, "select * from receipts order by id");
  const allPasses = all<GatePass>(db, "select * from gate_passes order by id");
  const allPhotos = all<Photo>(db, "select * from photos order by id");
  const paymentsByJob = groupBy(allPayments.filter((row) => !row.voided_at), (row) => row.job_card_id);
  const receiptsByJob = groupBy(allReceipts.filter((row) => !row.voided_at), (row) => row.job_card_id);
  const passesByJob = groupBy(allPasses.filter((row) => !row.voided_at), (row) => row.job_card_id);
  const photosByJob = groupBy(allPhotos.filter((row) => !row.archived_at), (row) => row.job_card_id);
  const estimateHistoryByJob = groupBy(allEstimates, (row) => row.job_card_id);
  const invoiceHistoryByJob = groupBy(allInvoices, (row) => row.job_card_id);
  const paymentHistoryByJob = groupBy(allPayments, (row) => row.job_card_id);
  const receiptHistoryByJob = groupBy(allReceipts, (row) => row.job_card_id);
  const passHistoryByJob = groupBy(allPasses, (row) => row.job_card_id);
  const photoHistoryByJob = groupBy(allPhotos, (row) => row.job_card_id);
  const followupsByJob = groupBy(all<Followup>(db, "select * from followups where archived_at is null"), (row) => row.job_card_id);
  const qcByJob = groupBy(all<QcCheck>(db, "select * from qc_checks where archived_at is null"), (row) => row.job_card_id);
  const historyByJob = groupBy(all<StatusHistory>(db, "select * from status_history order by id desc"), (row) => row.job_card_id);
  const cyclesByJob = groupBy(all<ChecklistCycle>(db, "select * from checklist_cycles order by cycle_number, id"), (row) => row.job_card_id);
  const checklistByJob = groupBy(all<ChecklistItem>(db, "select * from checklist_items order by cycle_number, sort_order, id"), (row) => row.job_card_id);
  const materialEventsByJob = groupBy(all<MaterialEvent>(db, "select * from material_events order by id"), (row) => row.job_card_id);
  const movements = all<MaterialMovement>(db, "select * from material_movements order by id desc");
  const movementsByJob = groupBy(movements, (row) => row.job_card_id);
  const globalMovements = movementsByJob.get(0) ?? [];
  const jobs: JobView[] = jobRows.map((job) => {
    const visit = allVisits.get(job.visit_id)!;
    const customer = allCustomers.get(visit.customer_id)!;
    const vehicle = allVehicles.get(visit.vehicle_id)!;
    const advisor = allUsers.get(job.advisor_id)!;
    const technician = allUsers.get(job.technician_id)!;
    const jobEstimates = estimatesByJob.get(job.id) ?? [];
    const estimate = jobEstimates.at(-1);
    const estimate_items = estimate ? estimateItemsByEstimate.get(estimate.id) ?? [] : [];
    const material_requests = materialByJob.get(job.id) ?? [];
    const jobMaterialEvents = materialEventsByJob.get(job.id) ?? [];
    const materialItemIds = new Set([...material_requests.map((request) => request.item_id), ...jobMaterialEvents.flatMap((event) => [event.old_item_id, event.new_item_id])]);
    const materialInventory = [...materialItemIds].map((id) => allInventory.get(id as number)).filter(Boolean) as InventoryItem[];
    const invoice = (invoicesByJob.get(job.id) ?? []).at(-1);
    return {
      job,
      visit,
      customer,
      vehicle,
      advisor,
      technician,
      estimate,
      estimate_items,
      material_requests,
      material_events: jobMaterialEvents,
      inventory: materialInventory,
      tasks: tasksByJob.get(job.id) ?? [],
      invoice,
      invoice_items: invoice ? invoiceItemsByInvoice.get(invoice.id) ?? [] : [],
      payments: paymentsByJob.get(job.id) ?? [],
      receipt: (receiptsByJob.get(job.id) ?? []).at(-1),
      gate_pass: (passesByJob.get(job.id) ?? []).at(-1),
      photos: photosByJob.get(job.id) ?? [],
      followups: followupsByJob.get(job.id) ?? [],
      qc_checks: qcByJob.get(job.id) ?? [],
      status_history: historyByJob.get(job.id) ?? [],
      checklist_cycles: cyclesByJob.get(job.id) ?? [],
      checklist_items: checklistByJob.get(job.id) ?? [],
      material_movements: [...(movementsByJob.get(job.id) ?? []), ...globalMovements],
      estimate_history: estimateHistoryByJob.get(job.id) ?? [],
      invoice_history: invoiceHistoryByJob.get(job.id) ?? [],
      payment_history: paymentHistoryByJob.get(job.id) ?? [],
      receipt_history: receiptHistoryByJob.get(job.id) ?? [],
      gate_pass_history: passHistoryByJob.get(job.id) ?? [],
      photo_history: photoHistoryByJob.get(job.id) ?? [],
    };
  });
  return { users, customers, vehicles, visits, jobs, inventory };
}

export function loadLargeDemoDataset(db: Database) {
  const subStatuses: SubStatus[] = ["Gather Requirements", "Create Estimate", "Get Confirmation", "Material Requested", "Material Issued", "Washing Needed", "Work Started", "Follow-up Needed", "Photos Shared", "QC Pending", "Customer Verification", "Invoice Ready", "Payment Received", "Receipt Generated", "Gate Pass Generated", "Delivered"];
  const makes = [["Hyundai", "Creta"], ["Mahindra", "Thar"], ["Tata", "Nexon"], ["Maruti", "Brezza"], ["Honda", "City"], ["Toyota", "Fortuner"], ["Kia", "Seltos"], ["BMW", "X1"]];
  const colors = ["White", "Black", "Silver", "Blue", "Red", "Grey"];
  const categories = ["Before", "After", "Inspection", "Progress", "Job Sheet"];
  const tables = ["approvals", "material_movements", "material_requests", "inventory", "gate_passes", "receipts", "payments", "invoices", "qc_checks", "tasks", "estimate_items", "estimates", "status_history", "checklist_items", "checklist_cycles", "photos", "followups", "job_cards", "visits", "vehicles", "customers"];
  db.run("begin transaction");
  try {
    tables.forEach((table) => db.run(`delete from ${table}`));
    [
      ["PPF-ROLL", "PPF", "Gloss PPF roll", "metre", 500, 40],
      ["CERAMIC-1L", "Detailing", "Ceramic coating", "litre", 80, 10],
      ["PAINT-CLEAR", "Paint", "Clear coat", "litre", 60, 8],
    ].forEach((row) => db.run("insert into inventory(sku,category,name,unit,stock_qty,low_stock_qty,created_at,updated_at) values(?,?,?,?,?,?,?,?)", [...row, "2026-01-01T08:00:00.000Z", "2026-01-01T08:00:00.000Z"]));
    for (let i = 1; i <= 120; i += 1) {
      const stamp = `2026-${String(((i - 1) % 8) + 1).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}T09:00:00.000Z`;
      db.run("insert into customers(name,mobile,type,created_at,updated_at) values(?,?,?,?,?)", [`Demo Customer ${String(i).padStart(3, "0")}`, `8${String(100000000 + i).padStart(9, "0")}`, i % 5 === 0 ? "Dealer" : "Individual", stamp, stamp]);
    }
    for (let i = 1; i <= 132; i += 1) {
      const [make, model] = makes[(i - 1) % makes.length];
      const customerId = ((i - 1) % 120) + 1;
      const stamp = `2026-${String(((i - 1) % 8) + 1).padStart(2, "0")}-15T10:00:00.000Z`;
      db.run("insert into vehicles(customer_id,number,make,model,color,km,created_at,updated_at) values(?,?,?,?,?,?,?,?)", [customerId, `OD${String((i % 30) + 1).padStart(2, "0")}DM${String(1000 + i)}`, make, model, colors[(i - 1) % colors.length], 5000 + i * 317, stamp, stamp]);
    }
    for (let i = 1; i <= 144; i += 1) {
      const vehicleId = ((i - 1) % 132) + 1;
      const customerId = ((vehicleId - 1) % 120) + 1;
      const subIndex = (i - 1) % subStatuses.length;
      const sub = subStatuses[subIndex];
      let main: MainStatus = subIndex <= 2 ? "NEW" : subIndex <= 9 ? "IN_PROGRESS" : subIndex <= 12 ? "COMPLETED" : "CLOSED";
      // Fixed overrides keep cancellation coverage deterministic without adding a sixth lifecycle status.
      if (i % 48 === 12) main = "CANCELLED";
      const date = `2026-${String(((i - 1) % 8) + 1).padStart(2, "0")}-${String(((i * 5) % 27) + 1).padStart(2, "0")}T${String(8 + (i % 9)).padStart(2, "0")}:00:00.000Z`;
      const work = ["Full body PPF", "Ceramic coating", "Paint correction", "Interior detailing"][i % 4];
      const visitId = insert(db, "insert into visits(customer_id,vehicle_id,advisor_id,received_by,received_at,fuel,keys,accessories,requested_work,photos_note,created_at,updated_at) values(?,?,?,?,?,'Half','2 keys','Mats',?,'Offline demo media',?,?)", [customerId, vehicleId, 2, 3, date, work, date, date]);
      const jobId = insert(db, "insert into job_cards(job_no,visit_id,advisor_id,technician_id,main_status,sub_status,work_list,promised_at,qc_status,washing_needed,closed_at,advisor_notes,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [`JC-2026-${String(2000 + i).padStart(6, "0")}`, visitId, 2, 6, main, sub, work, "Next business day", main === "NEW" || main === "IN_PROGRESS" ? "Pending" : "Pass", i % 3 === 0 ? 1 : 0, main === "CLOSED" ? date : "", "Deterministic large demo", date, date]);
      ensureLifecycleChecklist(db, jobId, main, sub, date);
      const estimateId = insert(db, "insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values(?,?,?,?,?,?,?)", [jobId, subIndex < 2 ? "Draft" : "Approved", i % 4 === 0 ? 500 : 0, 18, subIndex < 2 ? "Awaiting approval" : "Approved for demo", date, date]);
      const rate = 3500 + (i % 12) * 750;
      insert(db, "insert into estimate_items(estimate_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,?,?)", [estimateId, work, rate, date, date]);
      if (subIndex >= 3) insert(db, "insert into material_requests(job_card_id,item_id,requested_qty,issued_qty,used_qty,returned_qty,wasted_qty,created_at,updated_at) values(?,?,2,?,?,?,?,?,?)", [jobId, (i % 3) + 1, subIndex >= 4 ? 2 : 0, subIndex >= 6 ? 1.8 : 0, main === "CLOSED" ? 0.1 : 0, main === "CLOSED" ? 0.1 : 0, date, date]);
      insert(db, "insert into tasks(job_card_id,technician_id,title,status,notes,created_at,updated_at,started_at,completed_at) values(?,?,?,?,?,?,?,?,?)", [jobId, 6, work, main === "NEW" ? "Pending" : main === "IN_PROGRESS" ? "Started" : "Completed", "Generated demo task", date, date, main === "NEW" ? null : date, main === "COMPLETED" || main === "CLOSED" ? date : null]);
      ["Edges checked", "Surface cleaned", "Customer items verified"].forEach((label) => insert(db, "insert into qc_checks(job_card_id,label,passed) values(?,?,?)", [jobId, label, main === "COMPLETED" || main === "CLOSED" ? 1 : 0]));
      if (main !== "NEW") insert(db, "insert into followups(job_card_id,note,due_at,done,outcome,created_at,updated_at) values(?,?,?,?,?,?,?)", [jobId, "Customer progress update", date.slice(0, 10), main === "CLOSED" ? 1 : 0, main === "CLOSED" ? "Delivered" : "", date, date]);
      let invoiceId = 0;
      if (main === "COMPLETED" || main === "CLOSED") {
        const invoiceDiscount = i % 4 === 0 ? 500 : 0;
        const taxable = Math.max(0, rate - invoiceDiscount);
        const gstAmount = Math.round(taxable * 18) / 100;
        const demoTotal = Math.round((taxable + gstAmount) * 100) / 100;
        invoiceId = insert(db, "insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [jobId, `INV-2026-${String(i).padStart(5, "0")}`, `TLY-${String(5000 + i)}`, invoiceDiscount, 18, rate, gstAmount, demoTotal, main === "CLOSED" ? "Cleared" : "Open", "Generated demo invoice", 1, date, date]);
        insert(db, "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,?,?)", [invoiceId, work, rate, date, date]);
      }
      if (main === "CLOSED") {
        const demoTotal = one<Invoice>(db, "select * from invoices where id=?", [invoiceId]).total;
        insert(db, "insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,?,?,?,?,?,?)", [jobId, invoiceId, demoTotal, "UPI", "", `PAY-${String(i).padStart(5, "0")}`, "Generated demo payment", date, date]);
        insert(db, "insert into receipts(job_card_id,invoice_id,receipt_no,created_at) values(?,?,?,?)", [jobId, invoiceId, `REC-2026-${String(i).padStart(5, "0")}`, date]);
        insert(db, "insert into gate_passes(job_card_id,invoice_id,gate_pass_no,created_at) values(?,?,?,?)", [jobId, invoiceId, `GP-2026-${String(i).padStart(5, "0")}`, date]);
      }
      const photoCount = 2;
      for (let p = 0; p < photoCount; p += 1) insert(db, "insert into photos(job_card_id,label,src,category,created_at,updated_at) values(?,?,?,?,?,?)", [jobId, `${categories[(i + p) % categories.length]} documentation`, "/media-placeholder.svg", categories[(i + p) % categories.length], date, date]);
      insert(db, "insert into status_history(job_card_id,main_status,sub_status,note,created_at) values(?,?,?,?,?)", [jobId, main, sub, "Generated coherent demo lifecycle", date]);
    }
    validateLargeDemoDataset(db);
    db.run("commit");
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}

function validateLargeDemoDataset(db: Database) {
  const expected: [string, number][] = [["customers", 120], ["vehicles", 132], ["job_cards", 144], ["photos", 288]];
  expected.forEach(([table, count]) => {
    if (scalar<number>(db, `select count(*) from ${table}`) !== count) throw new Error(`Large demo validation failed for ${table}.`);
  });
  const uniquenessChecks = [
    "select count(*)-count(distinct mobile) from customers",
    "select count(*)-count(distinct number) from vehicles",
    "select count(*)-count(distinct job_no) from job_cards",
    "select count(*)-count(distinct invoice_no) from invoices",
  ];
  if (uniquenessChecks.some((sql) => scalar<number>(db, sql) !== 0)) throw new Error("Large demo identifiers are not unique.");
  const orphanCount = scalar<number>(db, `select
    (select count(*) from vehicles v left join customers c on c.id=v.customer_id where c.id is null) +
    (select count(*) from visits v left join customers c on c.id=v.customer_id left join vehicles x on x.id=v.vehicle_id where c.id is null or x.id is null) +
    (select count(*) from job_cards j left join visits v on v.id=j.visit_id where v.id is null) +
    (select count(*) from photos p left join job_cards j on j.id=p.job_card_id where j.id is null)`);
  if (orphanCount !== 0) throw new Error("Large demo contains invalid relationships.");
  const incompleteClosures = scalar<number>(db, `select count(*) from job_cards j where j.main_status='CLOSED' and (
    j.closed_at='' or not exists(select 1 from invoices i where i.job_card_id=j.id and i.voided_at is null) or
    not exists(select 1 from payments p where p.job_card_id=j.id and p.voided_at is null) or
    not exists(select 1 from receipts r where r.job_card_id=j.id) or
    not exists(select 1 from gate_passes g where g.job_card_id=j.id))`);
  if (incompleteClosures !== 0 || scalar<number>(db, "select count(distinct main_status) from job_cards") !== 5 || scalar<number>(db, "select count(distinct sub_status) from job_cards") !== 16) {
    throw new Error("Large demo lifecycle records are incomplete.");
  }
}

export function login(state: WorkshopState, email: string, password: string) {
  return state.users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password);
}

const roles: Role[] = ["admin", "service", "reception", "accounts", "store", "tech"];

export function createUser(db: Database, payload: Pick<User, "email" | "name" | "role" | "password">) {
  validateUser(db, payload);
  return insert(db, "insert into users(email, name, role, password, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))", [
    payload.email.trim().toLowerCase(),
    payload.name.trim(),
    payload.role,
    payload.password,
  ]);
}

export function updateUser(db: Database, id: number, payload: Pick<User, "email" | "name" | "role" | "password">) {
  one<User>(db, "select * from users where id=? and archived_at is null", [id]);
  validateUser(db, payload, id);
  db.run("update users set email=?, name=?, role=?, password=?, updated_at=datetime('now') where id=?", [
    payload.email.trim().toLowerCase(),
    payload.name.trim(),
    payload.role,
    payload.password,
    id,
  ]);
}

export function archiveUser(db: Database, id: number, reason: string, actingUserId: number) {
  const target = one<User>(db, "select * from users where id=? and archived_at is null", [id]);
  if (id === actingUserId) throw new Error("You cannot archive your own signed-in account.");
  if (!reason.trim()) throw new Error("An archive reason is required.");
  if (target.role === "admin" && scalar<number>(db, "select count(*) from users where role='admin' and archived_at is null") <= 1) {
    throw new Error("The final active Admin cannot be archived.");
  }
  archive(db, "users", id, reason.trim());
}

function validateUser(db: Database, payload: Pick<User, "email" | "name" | "role" | "password">, existingId = 0) {
  if (!payload.name.trim()) throw new Error("User name is required.");
  if (!/^\S+@\S+\.\S+$/.test(payload.email.trim())) throw new Error("Enter a valid user email.");
  if (!roles.includes(payload.role)) throw new Error("Select a valid user role.");
  if (!payload.password || payload.password.length < 6) throw new Error("User password must contain at least 6 characters.");
  const duplicate = maybe<{ id: number }>(db, "select id from users where lower(email)=lower(?) and archived_at is null and id<>?", [payload.email.trim(), existingId]);
  if (duplicate) throw new Error("A user with this email already exists.");
}

export function createCustomer(db: Database, payload: Pick<Customer, "name" | "mobile" | "type"> & { address?: string }) {
  validateCustomer(db, payload);
  return insert(db, "insert into customers(name, mobile, type, address, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))", [
    payload.name.trim(),
    payload.mobile.trim(),
    payload.type.trim(),
    (payload.address ?? "").trim(),
  ]);
}

export function updateCustomer(db: Database, id: number, payload: Pick<Customer, "name" | "mobile" | "type"> & { address?: string }) {
  validateCustomer(db, payload, id);
  db.run("update customers set name=?, mobile=?, type=?, address=coalesce(?, address), updated_at=datetime('now') where id=?", [payload.name.trim(), payload.mobile.trim(), payload.type.trim(), payload.address == null ? null : payload.address.trim(), id]);
}

export function archiveCustomer(db: Database, id: number, reason: string) {
  archive(db, "customers", id, reason);
}

export function createVehicle(db: Database, payload: Omit<Vehicle, "id">) {
  validateVehicle(db, payload);
  return insert(
    db,
    "insert into vehicles(customer_id, number, make, model, color, km, engine_no, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [payload.customer_id, payload.number.trim().toUpperCase(), payload.make.trim(), payload.model.trim(), payload.color.trim(), payload.km, (payload.engine_no ?? "").trim()],
  );
}

export function updateVehicle(db: Database, id: number, payload: Omit<Vehicle, "id">) {
  validateVehicle(db, payload, id);
  db.run("update vehicles set customer_id=?, number=?, make=?, model=?, color=?, km=?, engine_no=coalesce(?, engine_no), updated_at=datetime('now') where id=?", [
    payload.customer_id,
    payload.number.trim().toUpperCase(),
    payload.make.trim(),
    payload.model.trim(),
    payload.color.trim(),
    payload.km,
    payload.engine_no == null ? null : payload.engine_no.trim(),
    id,
  ]);
}

export function archiveVehicle(db: Database, id: number, reason: string) {
  archive(db, "vehicles", id, reason);
}

export function updateVisit(db: Database, id: number, payload: Partial<Pick<Visit, "advisor_id" | "fuel" | "keys" | "accessories" | "requested_work" | "photos_note">>) {
  const visit = one<Visit>(db, "select * from visits where id=?", [id]);
  db.run("update visits set advisor_id=?, fuel=?, keys=?, accessories=?, requested_work=?, photos_note=?, updated_at=datetime('now') where id=?", [
    payload.advisor_id ?? visit.advisor_id,
    payload.fuel ?? visit.fuel,
    payload.keys ?? visit.keys,
    payload.accessories ?? visit.accessories,
    payload.requested_work ?? visit.requested_work,
    payload.photos_note ?? visit.photos_note,
    id,
  ]);
}

export function receiveVehicle(
  db: Database,
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
    keys: string;
    accessories: string;
    requestedWork: string;
    advisorId: number;
    receptionId: number;
    address?: string;
    engineNo?: string;
    serviceType?: string;
    pickupDrop?: string;
    estimatedDelivery?: string;
  },
) {
  if (!payload.customerName.trim()) throw new Error("Customer name is required.");
  if (!payload.mobile.trim()) throw new Error("Customer mobile is required.");
  if (!payload.vehicleNo.trim()) throw new Error("Vehicle number is required.");
  if (!payload.make.trim() || !payload.model.trim()) throw new Error("Vehicle make and model are required.");
  if (!payload.requestedWork.trim()) throw new Error("Requested work is required.");
  if (!payload.advisorId || !payload.receptionId) throw new Error("Advisor and receiving user are required.");
  db.run("savepoint reception_intake");
  try {
  const customerId =
    payload.customerId ||
    maybe<{ id: number }>(db, "select id from customers where mobile=? and archived_at is null", [payload.mobile])?.id ||
    createCustomer(db, { name: payload.customerName, mobile: payload.mobile, type: payload.customerType || "Individual", address: payload.address });
  const vehicleId =
    payload.vehicleId ||
    maybe<{ id: number }>(db, "select id from vehicles where number=? and archived_at is null", [payload.vehicleNo.toUpperCase()])?.id ||
    createVehicle(db, {
      customer_id: customerId,
      number: payload.vehicleNo,
      make: payload.make,
      model: payload.model,
      color: payload.color,
      km: payload.km,
      engine_no: payload.engineNo,
    });
  updateCustomer(db, customerId, { name: payload.customerName, mobile: payload.mobile, type: payload.customerType || "Individual", address: payload.address });
  updateVehicle(db, vehicleId, { customer_id: customerId, number: payload.vehicleNo, make: payload.make, model: payload.model, color: payload.color, km: payload.km, engine_no: payload.engineNo });
  const visitId = insert(
    db,
    "insert into visits(customer_id, vehicle_id, advisor_id, received_by, received_at, fuel, keys, accessories, requested_work, photos_note, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [customerId, vehicleId, payload.advisorId, payload.receptionId, payload.fuel, payload.keys, payload.accessories, payload.requestedWork, "Reception intake"],
  );
  const jobId = insert(
    db,
    "insert into job_cards(job_no, visit_id, advisor_id, technician_id, main_status, sub_status, work_list, promised_at, qc_status, washing_needed, closed_at, advisor_notes, customer_instructions, internal_instructions, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [`JC-${new Date().getFullYear()}-${String(1247 + visitId).padStart(6, "0")}`, visitId, payload.advisorId, 6, "NEW", "Gather Requirements", payload.requestedWork, "Tomorrow 6:00 PM", "Pending", 0, "", "", payload.requestedWork, ""],
  );
  db.run("update job_cards set service_type=?, pickup_drop=?, estimated_delivery=?, damage_marks='[]' where id=?", [payload.serviceType ?? "", payload.pickupDrop ?? "", payload.estimatedDelivery ?? "", jobId]);
  ensureLifecycleChecklist(db, jobId, "NEW", "Gather Requirements");
  insert(db, "insert into tasks(job_card_id, technician_id, title, status, notes, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))", [
    jobId,
    6,
    payload.requestedWork.split(",")[0] || "Workshop inspection",
    "Pending",
    "Created at reception check-in.",
  ]);
  ["Edges checked", "Surface cleaned", "Customer items verified"].forEach((label) => insert(db, "insert into qc_checks(job_card_id, label, passed) values (?, ?, 0)", [jobId, label]));
  createPhoto(db, { job_card_id: jobId, label: "Reception intake", category: "Reception", src: "" });
  history(db, jobId, "NEW", "Gather Requirements", "Visit received and job card opened");
  db.run("release savepoint reception_intake");
  return jobId;
  } catch (error) {
    db.run("rollback to savepoint reception_intake");
    db.run("release savepoint reception_intake");
    throw error;
  }
}

// Job status lifecycle (workshop feedback v3.1-v3.3, issue #33):
//   NEW -> IN_PROGRESS | CANCELLED
//   IN_PROGRESS -> COMPLETED | HOLD | CANCELLED
//   HOLD -> IN_PROGRESS | CANCELLED
//   COMPLETED -> IN_PROGRESS (rework) | CLOSED
// CLOSED and CANCELLED are terminal. Any transition not listed here is rejected.
export const MAIN_STATUS_TRANSITIONS: Record<MainStatus, MainStatus[]> = {
  NEW: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "HOLD", "CANCELLED"],
  HOLD: ["IN_PROGRESS", "CANCELLED"],
  COMPLETED: ["IN_PROGRESS", "CLOSED"],
  CANCELLED: [],
  CLOSED: [],
};

export function isTerminalMainStatus(status: MainStatus) {
  return MAIN_STATUS_TRANSITIONS[status].length === 0;
}

export function canMutateJobLifecycle(actor: Pick<User, "id" | "role">, job: Pick<JobCard, "advisor_id">) {
  return actor.role === "admin" || (actor.role === "service" && actor.id === job.advisor_id);
}

// Per-transition permission: Owner/Admin may do everything; the linked Service Advisor may do
// everything except Close; Accounts may only Close a COMPLETED card. Cancel is therefore limited
// to Owner/Admin and the linked Advisor.
export function canTransitionJobStatus(actor: Pick<User, "id" | "role">, job: Pick<JobCard, "advisor_id" | "main_status">, to: MainStatus) {
  if (!MAIN_STATUS_TRANSITIONS[job.main_status].includes(to)) return false;
  if (actor.role === "admin") return true;
  if (to === "CLOSED") return actor.role === "accounts";
  return actor.role === "service" && actor.id === job.advisor_id;
}

export function assertJobLifecycleMutationAccess(db: Database, jobId: number, actorId: number) {
  const actor = one<User>(db, "select * from users where id=? and archived_at is null", [actorId]);
  const job = one<JobCard>(db, "select * from job_cards where id=? and archived_at is null", [jobId]);
  if (isTerminalMainStatus(job.main_status)) throw new Error(`A ${job.main_status} job card is read-only.`);
  if (!canMutateJobLifecycle(actor, job)) {
    throw new Error("Only the Owner or the linked Service Advisor can change this job lifecycle or estimate.");
  }
}

export function transitionJobStatusForActor(db: Database, jobId: number, actorId: number, to: MainStatus, note: string, timestamp = new Date().toISOString()) {
  const actor = one<User>(db, "select * from users where id=? and archived_at is null", [actorId]);
  const job = one<JobCard>(db, "select * from job_cards where id=? and archived_at is null", [jobId]);
  if (!MAIN_STATUS_TRANSITIONS[job.main_status].includes(to)) throw new Error(`Cannot move a job card from ${job.main_status} to ${to}.`);
  if (!canTransitionJobStatus(actor, job, to)) {
    throw new Error(to === "CANCELLED" ? "Only the Owner or the linked Service Advisor can cancel a job card." : to === "CLOSED" ? "Only the Owner or Accounts can close a job card." : "Only the Owner or the linked Service Advisor can change this job lifecycle.");
  }
  transitionJobStatus(db, jobId, to, note, timestamp);
}

export interface EstimateDraftInput {
  discount: number;
  gst_rate: number;
  notes: string;
  items: Array<Pick<EstimateItem, "kind" | "description" | "qty" | "rate">>;
}

export function saveEstimateForActor(db: Database, jobId: number, actorId: number, draft: EstimateDraftInput) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  if (!Number.isFinite(draft.discount) || draft.discount < 0) throw new Error("Discount must be zero or greater.");
  if (!Number.isFinite(draft.gst_rate) || draft.gst_rate < 0) throw new Error("GST must be zero or greater.");
  if (draft.items.length === 0) throw new Error("Add at least one estimate item.");
  draft.items.forEach((item) => {
    if (!item.description.trim()) throw new Error("Every estimate item needs a description.");
    if (!Number.isFinite(item.qty) || item.qty <= 0) throw new Error("Item quantity must be greater than zero.");
    if (!Number.isFinite(item.rate) || item.rate < 0) throw new Error("Item rate must be zero or greater.");
  });
  db.run("savepoint save_estimate");
  try {
    const existing = maybe<Estimate>(db, "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1", [jobId]);
    const estimateId = existing?.id ?? insert(db, "insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values (?,'Draft',?,?,?,datetime('now'),datetime('now'))", [jobId, draft.discount, draft.gst_rate, draft.notes.trim()]);
    if (existing) {
      db.run("update estimates set discount=?,gst_rate=?,approval_note=?,updated_at=datetime('now') where id=?", [draft.discount, draft.gst_rate, draft.notes.trim(), estimateId]);
      db.run("update estimate_items set archived_at=datetime('now'),archived_reason='Replaced by estimate edit',updated_at=datetime('now') where estimate_id=? and archived_at is null", [estimateId]);
    }
    draft.items.forEach((item) => createEstimateItem(db, { estimate_id: estimateId, kind: item.kind, description: item.description.trim(), qty: item.qty, rate: item.rate }));
    reconcileArtifactChecklist(db, jobId, actorId);
    db.run("release savepoint save_estimate");
    return estimateId;
  } catch (error) {
    db.run("rollback to savepoint save_estimate");
    db.run("release savepoint save_estimate");
    throw error;
  }
}

function assertValidMainStatusTransition(from: MainStatus, to: MainStatus) {
  if (from === to) return;
  if (!MAIN_STATUS_TRANSITIONS[from].includes(to)) {
    throw new Error(`Cannot move a job card from ${from} to ${to}.`);
  }
}

export function updateJobCard(
  db: Database,
  jobId: number,
  payload: Partial<Pick<JobCard, "advisor_id" | "technician_id" | "main_status" | "sub_status" | "work_list" | "promised_at" | "advisor_notes" | "customer_instructions" | "internal_instructions">>,
  note?: string,
) {
  let job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  if (payload.main_status && payload.main_status !== job.main_status) {
    transitionJobStatus(db, jobId, payload.main_status, note ?? "");
    job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  }
  const sub = checklistSubStatus(db, jobId, job.sub_status);
  db.run(
    "update job_cards set advisor_id=?, technician_id=?, sub_status=?, work_list=?, promised_at=?, advisor_notes=?, customer_instructions=?, internal_instructions=?, updated_at=datetime('now') where id=?",
    [
      payload.advisor_id ?? job.advisor_id,
      payload.technician_id ?? job.technician_id,
      sub,
      payload.work_list ?? job.work_list,
      payload.promised_at ?? job.promised_at,
      payload.advisor_notes ?? job.advisor_notes ?? "",
      payload.customer_instructions ?? job.customer_instructions ?? "",
      payload.internal_instructions ?? job.internal_instructions ?? "",
      jobId,
    ],
  );
  if (sub !== job.sub_status) history(db, jobId, job.main_status, sub, note?.trim() || "Job card updated");
}

export function updateJobCardForActor(
  db: Database,
  jobId: number,
  actorId: number,
  payload: Partial<Pick<JobCard, "advisor_id" | "technician_id" | "work_list" | "promised_at" | "advisor_notes" | "customer_instructions" | "internal_instructions">>,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  updateJobCard(db, jobId, payload);
}

export interface JobSheetInput {
  service_type?: string;
  pickup_drop?: string;
  estimated_delivery?: string;
  fuel?: string;
  accessories?: string;
  engine_no?: string;
  address?: string;
}

/** Saves the paper job-sheet intake fields across the Job Card, its Visit, Vehicle and Customer. */
export function updateJobSheetForActor(db: Database, jobId: number, actorId: number, input: JobSheetInput) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  const visit = one<Visit>(db, "select * from visits where id=?", [job.visit_id]);
  db.run("update job_cards set service_type=?, pickup_drop=?, estimated_delivery=?, updated_at=datetime('now') where id=?", [
    input.service_type ?? job.service_type ?? "",
    input.pickup_drop ?? job.pickup_drop ?? "",
    input.estimated_delivery ?? job.estimated_delivery ?? "",
    jobId,
  ]);
  db.run("update visits set fuel=?, accessories=?, updated_at=datetime('now') where id=?", [input.fuel ?? visit.fuel, input.accessories ?? visit.accessories, visit.id]);
  if (input.engine_no !== undefined) db.run("update vehicles set engine_no=?, updated_at=datetime('now') where id=?", [input.engine_no.trim(), visit.vehicle_id]);
  if (input.address !== undefined) db.run("update customers set address=?, updated_at=datetime('now') where id=?", [input.address.trim(), visit.customer_id]);
}

/** Persists the tap-to-mark damage diagram with the Job Card. */
export function setDamageMarksForActor(db: Database, jobId: number, actorId: number, marks: DamageMark[]) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  db.run("update job_cards set damage_marks=?, updated_at=datetime('now') where id=?", [serializeDamageMarks(marks), jobId]);
}

// True archive / soft-delete: removes the job from active views. Used by admin "Archive" actions
// throughout the app. Distinct from the CANCELLED main-status transition below, which keeps the
// job visible and reopenable (UI_BRD_v1.3.md §3 item 2).
export function cancelJobCard(db: Database, jobId: number, reason: string) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  archive(db, "job_cards", jobId, reason || "Cancelled");
  archive(db, "visits", job.visit_id, reason || "Cancelled");
  history(db, jobId, job.main_status, job.sub_status, `Cancelled: ${reason || "No reason"}`);
}

export function archiveJobCardForActor(db: Database, jobId: number, actorId: number, reason: string) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  if (!reason.trim()) throw new Error("An archive reason is required.");
  cancelJobCard(db, jobId, reason.trim());
}

// Status-based lifecycle transitions (UI_BRD_v1.3.md §4). Each requires a free-text note and is
// captured in job history by the central transition service so it is visible in the History tab and in
// other roles' equivalent queues.

export function cancelJobCardStatus(db: Database, jobId: number, note: string) {
  transitionJobStatus(db, jobId, "CANCELLED", note);
}

export function createEstimate(db: Database, jobId: number) {
  const existing = maybe<Estimate>(db, "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1", [jobId]);
  const estimateId =
    existing?.id ??
    insert(db, "insert into estimates(job_card_id, status, discount, gst_rate, approval_note, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))", [
      jobId,
      "Draft",
      0,
      18,
      "Awaiting customer confirmation",
    ]);
  if (scalar<number>(db, "select count(*) from estimate_items where estimate_id=? and archived_at is null", [estimateId]) === 0) {
    createEstimateItem(db, { estimate_id: estimateId, kind: "Service", description: "Workshop labour", qty: 1, rate: 5000 });
  }
  reconcileArtifactChecklist(db, jobId);
  return estimateId;
}

export function updateEstimate(db: Database, id: number, payload: Partial<Pick<Estimate, "status" | "discount" | "gst_rate" | "approval_note">>) {
  const estimate = one<Estimate>(db, "select * from estimates where id=?", [id]);
  db.run("update estimates set status=?, discount=?, gst_rate=?, approval_note=?, updated_at=datetime('now') where id=?", [
    payload.status ?? estimate.status,
    payload.discount ?? estimate.discount,
    payload.gst_rate ?? estimate.gst_rate,
    payload.approval_note ?? estimate.approval_note,
    id,
  ]);
  reconcileArtifactChecklist(db, estimate.job_card_id);
}

export function createEstimateItem(db: Database, payload: Omit<EstimateItem, "id">) {
  return insert(db, "insert into estimate_items(estimate_id, kind, description, qty, rate, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))", [
    payload.estimate_id,
    payload.kind,
    payload.description,
    payload.qty,
    payload.rate,
  ]);
}

export function updateEstimateItem(db: Database, id: number, payload: Omit<EstimateItem, "id">) {
  db.run("update estimate_items set kind=?, description=?, qty=?, rate=?, updated_at=datetime('now') where id=?", [payload.kind, payload.description, payload.qty, payload.rate, id]);
}

export function archiveEstimateItem(db: Database, id: number, reason: string) {
  archive(db, "estimate_items", id, reason);
}

export function approveEstimate(db: Database, jobId: number, note = "Customer approved") {
  const estimateId = createEstimate(db, jobId);
  updateEstimate(db, estimateId, { status: "Approved", approval_note: note });
  if (scalar<number>(db, "select count(*) from material_requests where job_card_id=? and archived_at is null", [jobId]) === 0) {
    createMaterialRequest(db, { job_card_id: jobId, item_id: 1, requested_qty: 6, issued_qty: 0, used_qty: 0, returned_qty: 0, wasted_qty: 0 });
  }
  reconcileArtifactChecklist(db, jobId);
}

export function createMaterialRequest(db: Database, payload: Omit<MaterialRequest, "id">) {
  const id = insert(
    db,
    "insert into material_requests(job_card_id, item_id, requested_qty, issued_qty, used_qty, returned_qty, wasted_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [payload.job_card_id, payload.item_id, payload.requested_qty, payload.issued_qty, payload.used_qty, payload.returned_qty, payload.wasted_qty],
  );
  reconcileArtifactChecklist(db, payload.job_card_id);
  return id;
}

export function updateMaterialRequest(db: Database, id: number, payload: Omit<MaterialRequest, "id">) {
  db.run("update material_requests set item_id=?, requested_qty=?, issued_qty=?, used_qty=?, returned_qty=?, wasted_qty=?, updated_at=datetime('now') where id=?", [
    payload.item_id,
    payload.requested_qty,
    payload.issued_qty,
    payload.used_qty,
    payload.returned_qty,
    payload.wasted_qty,
    id,
  ]);
}

export function archiveMaterialRequest(db: Database, id: number, reason: string) {
  archive(db, "material_requests", id, reason);
}

export function issueMaterialQty(db: Database, requestId: number, qty: number) {
  const request = one<MaterialRequest>(db, "select * from material_requests where id=?", [requestId]);
  const onHand = materialStockOnHand(db, request.item_id);
  if (qty <= 0 || qty > onHand) throw new Error(`Cannot issue ${qty}; stock available is ${onHand}`);
  db.run("update material_requests set issued_qty=issued_qty + ?, status=case when issued_qty + ? >= requested_qty then 'Issued' else status end, updated_at=datetime('now') where id=?", [qty, qty, requestId]);
  ledger(db, request.job_card_id, requestId, request.item_id, qty, "issue", 0, "Issued to job");
  movement(db, request.job_card_id, request.item_id, "ISSUE", qty, "Issued to job");
  reconcileArtifactChecklist(db, request.job_card_id);
}

export function issueMaterial(db: Database, requestId: number) {
  const request = one<MaterialRequest>(db, "select * from material_requests where id=?", [requestId]);
  issueMaterialQty(db, requestId, Math.max(0, request.requested_qty - request.issued_qty));
}

export function reconcileMaterialQty(db: Database, requestId: number, used: number, returned: number, wasted: number) {
  const request = one<MaterialRequest>(db, "select * from material_requests where id=?", [requestId]);
  db.run("update material_requests set used_qty=?, returned_qty=?, wasted_qty=?, updated_at=datetime('now') where id=?", [used, returned, wasted, requestId]);
  const returnDelta = returned - request.returned_qty;
  if (returnDelta > 0) {
    db.run("update inventory set stock_qty=stock_qty + ?, updated_at=datetime('now') where id=?", [returnDelta, request.item_id]);
    movement(db, request.job_card_id, request.item_id, "RETURN", returnDelta, "Returned after job reconciliation");
  }
  const wasteDelta = wasted - request.wasted_qty;
  if (wasteDelta > 0) movement(db, request.job_card_id, request.item_id, "WASTAGE", wasteDelta, "Recorded wastage");
  auditEvidence(db, request.job_card_id, "Material reconciled");
}

export function reconcileMaterial(db: Database, requestId: number, used: number, returned: number, wasted: number) {
  reconcileMaterialQty(db, requestId, used, returned, wasted);
}

const MATERIAL_ACTION_VERB: Record<MaterialRowAction, string> = { release: "released", "edit-issued": "edited", request: "requested", edit: "edited", "re-request": "re-requested", cancel: "cancelled", delete: "deleted" };

function assertMaterialManager(db: Database, jobId: number, actorId: number) {
  const actor = one<User>(db, "select * from users where id=? and archived_at is null", [actorId]);
  const job = one<JobCard>(db, "select * from job_cards where id=? and archived_at is null", [jobId]);
  if (!canManageMaterialRows(actor, job)) {
    throw new Error(job.main_status === "IN_PROGRESS" ? "Only the Owner or the linked Service Advisor can change material rows." : "Material rows can only change while the job card is IN_PROGRESS.");
  }
}

function materialRowFor(db: Database, rowId: number, actorId: number, action: MaterialRowAction) {
  const row = one<MaterialRequest>(db, "select * from material_requests where id=? and archived_at is null", [rowId]);
  assertMaterialManager(db, row.job_card_id, actorId);
  if (!materialRowActions(row).includes(action)) throw new Error(`A ${materialRowStatus(row)} material row cannot be ${MATERIAL_ACTION_VERB[action]}.`);
  return row;
}

function assertMaterialInput(db: Database, itemId: number, qty: number) {
  if (!(qty > 0)) throw new Error("Material quantity must be greater than zero.");
  one<InventoryItem>(db, "select * from inventory where id=? and archived_at is null", [itemId]);
}

/** Stock on hand = seeded stock minus the sum of the signed stock-outward ledger. */
export function materialStockOnHand(db: Database, itemId: number) {
  return scalar<number>(db, "select stock_qty - coalesce((select sum(qty) from stock_ledger where item_id=inventory.id),0) from inventory where id=?", [itemId]);
}

export function addMaterialRowForActor(db: Database, jobId: number, actorId: number, itemId: number, qty: number) {
  assertMaterialManager(db, jobId, actorId);
  assertMaterialInput(db, itemId, qty);
  return insert(db, "insert into material_requests(job_card_id,item_id,requested_qty,issued_qty,used_qty,returned_qty,wasted_qty,status,created_at,updated_at) values(?,?,?,0,0,0,0,'Draft',datetime('now'),datetime('now'))", [jobId, itemId, qty]);
}

export function updateMaterialRowForActor(db: Database, rowId: number, actorId: number, itemId: number, qty: number) {
  materialRowFor(db, rowId, actorId, "edit");
  assertMaterialInput(db, itemId, qty);
  db.run("update material_requests set item_id=?, requested_qty=?, updated_at=datetime('now') where id=?", [itemId, qty, rowId]);
}

export function deleteMaterialRowForActor(db: Database, rowId: number, actorId: number) {
  materialRowFor(db, rowId, actorId, "delete");
  db.run("delete from material_requests where id=?", [rowId]);
}

function untickMaterialsIssued(db: Database, jobId: number) {
  const item = maybe<ChecklistItem>(db, "select ci.* from checklist_items ci where ci.job_card_id=? and ci.label='Material Issued' and ci.checked_at is not null and ci.na_at is null and ci.checklist_cycle_id=(select id from checklist_cycles where job_card_id=? order by id desc limit 1)", [jobId, jobId]);
  if (!item) return;
  db.run("update checklist_items set checked_by=null, checked_at=null, completed_at=null where id=?", [item.id]);
  db.run("update checklist_cycles set completed_at=null where id=?", [item.checklist_cycle_id]);
  syncSubStatusFromChecklist(db, jobId);
}

function afterMaterialRequest(db: Database, row: MaterialRequest, actorId: number) {
  const onHand = materialStockOnHand(db, row.item_id);
  untickMaterialsIssued(db, row.job_card_id);
  reconcileArtifactChecklist(db, row.job_card_id, actorId);
  return { onHand, warning: overStockWarning(row.requested_qty, onHand) };
}

/** Draft -> Requested (locks the row). Over-stock quantities are allowed but reported as a warning. */
export function requestMaterialRowForActor(db: Database, rowId: number, actorId: number) {
  const row = materialRowFor(db, rowId, actorId, "request");
  db.run("update material_requests set status='Requested', updated_at=datetime('now') where id=?", [rowId]);
  return afterMaterialRequest(db, row, actorId);
}

/** Edit a Requested/Re-requested row and send it back to Store as Re-requested. */
export function reRequestMaterialRowForActor(db: Database, rowId: number, actorId: number, itemId: number, qty: number) {
  materialRowFor(db, rowId, actorId, "re-request");
  assertMaterialInput(db, itemId, qty);
  db.run("update material_requests set item_id=?, requested_qty=?, status='Re-requested', updated_at=datetime('now') where id=?", [itemId, qty, rowId]);
  return afterMaterialRequest(db, one<MaterialRequest>(db, "select * from material_requests where id=?", [rowId]), actorId);
}

function ledger(db: Database, jobId: number, rowId: number, itemId: number, qty: number, type: "issue" | "adjustment", actorId: number, note: string) {
  db.run("insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(?,?,?,?,?,?,?,?)", [jobId, rowId, itemId, qty, type, actorId, new Date().toISOString(), note]);
}

function actorAndJob(db: Database, rowId: number, actorId: number) {
  const row = one<MaterialRequest>(db, "select * from material_requests where id=? and archived_at is null", [rowId]);
  const actor = one<User>(db, "select * from users where id=? and archived_at is null", [actorId]);
  const job = one<JobCard>(db, "select * from job_cards where id=? and archived_at is null", [row.job_card_id]);
  return { row, actor, job };
}

/** Store/Owner release a Requested or Re-requested row: writes a signed stock-outward ledger record. Blocked over stock. Allowed on HOLD. */
export function releaseMaterialRowForActor(db: Database, rowId: number, actorId: number) {
  const { row, actor, job } = actorAndJob(db, rowId, actorId);
  if (!canReleaseMaterialRows(actor, job)) throw new Error("Only Store or the Owner can release material, while the job card is IN_PROGRESS or HOLD.");
  if (!materialRowActionsFor(actor, job, row).includes("release")) throw new Error(`A ${materialRowStatus(row)} material row cannot be released.`);
  const onHand = materialStockOnHand(db, row.item_id);
  if (row.requested_qty > onHand) throw new Error(`Cannot release ${row.requested_qty}; only ${onHand} in stock.`);
  db.run("update material_requests set status='Issued', issued_qty=requested_qty, updated_at=datetime('now') where id=?", [rowId]);
  ledger(db, job.id, rowId, row.item_id, row.requested_qty, "issue", actorId, "Released to job");
  db.run("insert into material_events(job_card_id,material_row_id,kind,by_user,at,note,old_item_id,old_qty,new_item_id,new_qty) values(?,?,?,?,?,?,?,?,?,?)", [job.id, rowId, "release", actorId, new Date().toISOString(), "Released to job", null, null, row.item_id, row.requested_qty]);
  reconcileArtifactChecklist(db, job.id, actorId);
}

/** Edit an Issued row in place (ADR 0001): note required, old/new logged, stock difference applied at once. */
export function editIssuedMaterialRowForActor(db: Database, rowId: number, actorId: number, itemId: number, qty: number, note: string) {
  const { row, actor, job } = actorAndJob(db, rowId, actorId);
  if (!canEditIssuedMaterialRows(actor, job)) throw new Error("Only Store, the Owner or the linked Service Advisor can edit an Issued row.");
  if (!materialRowActionsFor(actor, job, row).includes("edit-issued")) throw new Error(`A ${materialRowStatus(row)} material row cannot be edited this way.`);
  if (!note.trim()) throw new Error("A note is required to edit an Issued row.");
  assertMaterialInput(db, itemId, qty);
  const oldItem = row.item_id, oldQty = row.issued_qty || row.requested_qty;
  if (itemId === oldItem && qty === oldQty) throw new Error("Nothing changed.");
  const needed = itemId === oldItem ? qty - oldQty : qty;
  if (needed > 0 && needed > materialStockOnHand(db, itemId)) throw new Error(`Cannot issue ${needed} more; only ${materialStockOnHand(db, itemId)} in stock.`);
  const reason = note.trim();
  if (itemId === oldItem) ledger(db, job.id, rowId, itemId, qty - oldQty, "adjustment", actorId, reason);
  else { ledger(db, job.id, rowId, oldItem, -oldQty, "adjustment", actorId, reason); ledger(db, job.id, rowId, itemId, qty, "adjustment", actorId, reason); }
  db.run("update material_requests set item_id=?, requested_qty=?, issued_qty=?, updated_at=datetime('now') where id=?", [itemId, qty, qty, rowId]);
  db.run("insert into material_events(job_card_id,material_row_id,kind,by_user,at,note,old_item_id,old_qty,new_item_id,new_qty) values(?,?,?,?,?,?,?,?,?,?)", [job.id, rowId, "issued-edit", actorId, new Date().toISOString(), reason, oldItem, oldQty, itemId, qty]);
}

/** Only Requested/Re-requested rows can be cancelled; Materials Requested stays ticked. */
export function cancelMaterialRowForActor(db: Database, rowId: number, actorId: number) {
  const row = materialRowFor(db, rowId, actorId, "cancel");
  db.run("update material_requests set status='Cancelled', updated_at=datetime('now') where id=?", [rowId]);
  reconcileArtifactChecklist(db, row.job_card_id, actorId);
}

export function createInventoryItem(db: Database, payload: Omit<InventoryItem, "id">) {
  return insert(db, "insert into inventory(sku, category, name, unit, stock_qty, low_stock_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))", [
    payload.sku,
    payload.category,
    payload.name,
    payload.unit,
    payload.stock_qty,
    payload.low_stock_qty,
  ]);
}

export function updateInventoryItem(db: Database, id: number, payload: Omit<InventoryItem, "id">) {
  db.run("update inventory set sku=?, category=?, name=?, unit=?, stock_qty=?, low_stock_qty=?, updated_at=datetime('now') where id=?", [
    payload.sku,
    payload.category,
    payload.name,
    payload.unit,
    payload.stock_qty,
    payload.low_stock_qty,
    id,
  ]);
}

export function archiveInventoryItem(db: Database, id: number, reason: string) {
  archive(db, "inventory", id, reason);
}

export function stockIn(db: Database, itemId: number, qty: number, note: string) {
  db.run("update inventory set stock_qty=stock_qty + ?, updated_at=datetime('now') where id=?", [qty, itemId]);
  movement(db, 0, itemId, "STOCK_IN", qty, note || "Stock-in");
}

export function adjustStock(db: Database, itemId: number, qty: number, note: string) {
  db.run("update inventory set stock_qty=?, updated_at=datetime('now') where id=?", [qty, itemId]);
  movement(db, 0, itemId, "ADJUSTMENT", qty, note || "Stock adjustment");
}

export function createTask(db: Database, payload: Omit<Task, "id">) {
  return insert(db, "insert into tasks(job_card_id, technician_id, title, status, notes, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))", [
    payload.job_card_id,
    payload.technician_id,
    payload.title,
    payload.status,
    payload.notes,
  ]);
}

export function updateTask(db: Database, taskId: number, status: TaskStatus, notes: string) {
  const task = one<Task>(db, "select * from tasks where id=?", [taskId]);
  const timeColumn = status === "Started" ? "started_at" : status === "Paused" ? "paused_at" : status === "Completed" ? "completed_at" : "";
  db.run(`update tasks set status=?, notes=?, updated_at=datetime('now')${timeColumn ? `, ${timeColumn}=coalesce(${timeColumn}, datetime('now'))` : ""} where id=?`, [status, notes, taskId]);
  if (status === "Paused") auditEvidence(db, task.job_card_id, "Task paused");
  reconcileArtifactChecklist(db, task.job_card_id);
}

export function archiveTask(db: Database, id: number, reason: string) {
  archive(db, "tasks", id, reason);
}

export function markWashingNeeded(db: Database, jobId: number) {
  db.run("update job_cards set washing_needed=1, updated_at=datetime('now') where id=?", [jobId]);
  reconcileArtifactChecklist(db, jobId);
}

export function updateQcCheck(db: Database, id: number, passed: boolean, failReason = "") {
  const check = one<QcCheck>(db, "select * from qc_checks where id=?", [id]);
  db.run("update qc_checks set passed=?, fail_reason=? where id=?", [passed ? 1 : 0, failReason, id]);
  db.run("update job_cards set qc_status=? where id=?", [passed ? "Pass" : "Fail", check.job_card_id]);
  auditEvidence(db, check.job_card_id, passed ? `QC passed: ${check.label}` : `QC failed: ${failReason || check.label}`);
  reconcileArtifactChecklist(db, check.job_card_id);
}

export function failQcWithRework(db: Database, checkId: number, technicianId: number, reason: string) {
  const check = one<QcCheck>(db, "select * from qc_checks where id=?", [checkId]);
  updateQcCheck(db, checkId, false, reason);
  createTask(db, { job_card_id: check.job_card_id, technician_id: technicianId, title: `Rework: ${check.label}`, status: "Pending", notes: reason });
}

export function passQc(db: Database, jobId: number) {
  db.run("update qc_checks set passed=1 where job_card_id=? and archived_at is null", [jobId]);
  db.run("update job_cards set qc_status='Pass', updated_at=datetime('now') where id=?", [jobId]);
  reconcileArtifactChecklist(db, jobId);
}

export function generateInvoice(db: Database, jobId: number, tally: string) {
  const estimate = one<Estimate>(db, "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1", [jobId]);
  const items = all<EstimateItem>(db, "select * from estimate_items where estimate_id=? and archived_at is null order by id", [estimate.id]);
  createInvoiceFromEstimate(db, jobId, { tallyInvoiceNo: tally, discount: estimate.discount, gstRate: estimate.gst_rate, items, notes: "", documentAvailable: true });
  reconcileArtifactChecklist(db, jobId);
}

export interface InvoiceItemInput { kind: "Service" | "Material"; description: string; qty: number; rate: number }
export interface CreateInvoiceInput { tallyInvoiceNo: string; discount?: number; gstRate?: number; items?: InvoiceItemInput[]; notes: string; documentAvailable: boolean }
export interface InvoiceFieldsInput { tallyInvoiceNo: string; discount: number; gstRate: number; notes: string; documentAvailable: boolean }

export function canMutateBilling(actor: Pick<User, "role">) {
  return actor.role === "admin" || actor.role === "accounts";
}

function assertBillingMutationAccess(db: Database, actorId: number) {
  const actor = one<User>(db, "select * from users where id=? and archived_at is null", [actorId]);
  if (!canMutateBilling(actor)) throw new Error("Only Owner/Admin and Accounts may change billing or delivery records.");
}

function assertInvoiceFinancialsEditable(db: Database, invoiceId: number) {
  if (scalar<number>(db, "select count(*) from payments where invoice_id=? and voided_at is null", [invoiceId]) > 0) {
    throw new Error("Invoice financial fields are locked after the first active payment.");
  }
}

function validateInvoiceItem(input: InvoiceItemInput) {
  if (!input.description.trim()) throw new Error("Invoice item description is required.");
  if (!Number.isFinite(input.qty) || input.qty <= 0) throw new Error("Invoice item quantity must be greater than zero.");
  if (!Number.isFinite(input.rate) || input.rate < 0) throw new Error("Invoice item rate cannot be negative.");
}

function recalculateInvoice(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(db, "select * from invoices where id=? and voided_at is null", [invoiceId]);
  const subtotal = scalar<number>(db, "select coalesce(sum(qty*rate),0) from invoice_items where invoice_id=? and archived_at is null", [invoiceId]);
  const taxable = Math.max(0, subtotal - invoice.discount);
  const gstAmount = Math.round(taxable * invoice.gst_rate) / 100;
  const total = Math.round((taxable + gstAmount) * 100) / 100;
  db.run("update invoices set subtotal=?,gst_amount=?,total=?,updated_at=datetime('now') where id=?", [subtotal, gstAmount, total, invoiceId]);
}

export function updateInvoiceFields(db: Database, invoiceId: number, input: InvoiceFieldsInput) {
  const current = one<Invoice>(db, "select * from invoices where id=? and voided_at is null", [invoiceId]);
  const changesFinancials = input.discount !== current.discount || input.gstRate !== current.gst_rate;
  if (changesFinancials) assertInvoiceFinancialsEditable(db, invoiceId);
  if (!Number.isFinite(input.discount) || input.discount < 0) throw new Error("Invoice discount cannot be negative.");
  if (!Number.isFinite(input.gstRate) || input.gstRate < 0 || input.gstRate > 100) throw new Error("Invoice GST must be between 0 and 100.");
  db.run("savepoint update_invoice_fields");
  try {
    db.run("update invoices set tally_invoice_no=?,discount=?,gst_rate=?,notes=?,document_available=?,document_generated_at=case when ?=1 then coalesce(document_generated_at,datetime('now')) else document_generated_at end,updated_at=datetime('now') where id=? and voided_at is null", [input.tallyInvoiceNo.trim(), input.discount, input.gstRate, input.notes.trim(), input.documentAvailable ? 1 : 0, input.documentAvailable ? 1 : 0, invoiceId]);
    recalculateInvoice(db, invoiceId);
    reconcileArtifactChecklist(db, current.job_card_id);
    db.run("release savepoint update_invoice_fields");
  } catch (error) {
    db.run("rollback to savepoint update_invoice_fields");
    db.run("release savepoint update_invoice_fields");
    throw error;
  }
}

export function createInvoiceItem(db: Database, invoiceId: number, input: InvoiceItemInput) {
  assertInvoiceFinancialsEditable(db, invoiceId);
  validateInvoiceItem(input);
  const id = insert(db, "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,?,?,?,?,datetime('now'),datetime('now'))", [invoiceId, input.kind, input.description.trim(), input.qty, input.rate]);
  recalculateInvoice(db, invoiceId);
  return id;
}

export function updateInvoiceItem(db: Database, itemId: number, input: InvoiceItemInput) {
  const item = one<InvoiceItem>(db, "select * from invoice_items where id=? and archived_at is null", [itemId]);
  assertInvoiceFinancialsEditable(db, item.invoice_id);
  validateInvoiceItem(input);
  db.run("update invoice_items set kind=?,description=?,qty=?,rate=?,updated_at=datetime('now') where id=?", [input.kind, input.description.trim(), input.qty, input.rate, itemId]);
  recalculateInvoice(db, item.invoice_id);
}

export function archiveInvoiceItem(db: Database, itemId: number, reason: string) {
  const item = one<InvoiceItem>(db, "select * from invoice_items where id=? and archived_at is null", [itemId]);
  assertInvoiceFinancialsEditable(db, item.invoice_id);
  if (!reason.trim()) throw new Error("An invoice item archive reason is required.");
  db.run("savepoint archive_invoice_item");
  try {
    archive(db, "invoice_items", itemId, reason.trim());
    recalculateInvoice(db, item.invoice_id);
    db.run("release savepoint archive_invoice_item");
  } catch (error) {
    db.run("rollback to savepoint archive_invoice_item");
    db.run("release savepoint archive_invoice_item");
    throw error;
  }
}

export function createInvoiceFromEstimate(db: Database, jobId: number, input: CreateInvoiceInput) {
  const existing = maybe<Invoice>(db, "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1", [jobId]);
  if (existing) return existing.id;
  const estimate = one<Estimate>(db, "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1", [jobId]);
  const estimateItems = all<EstimateItem>(db, "select * from estimate_items where estimate_id=? and archived_at is null order by id", [estimate.id]);
  const items = input.items ?? estimateItems;
  const discount = input.discount ?? estimate.discount;
  const gstRate = input.gstRate ?? estimate.gst_rate;
  if (items.length === 0) throw new Error("An invoice requires at least one item.");
  if (!Number.isFinite(discount) || discount < 0) throw new Error("Invoice discount cannot be negative.");
  if (!Number.isFinite(gstRate) || gstRate < 0 || gstRate > 100) throw new Error("Invoice GST must be between 0 and 100.");
  items.forEach(validateInvoiceItem);
  db.run("savepoint create_invoice");
  try {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const taxable = Math.max(0, subtotal - discount);
    const gstAmount = Math.round(taxable * gstRate) / 100;
    const total = Math.round((taxable + gstAmount) * 100) / 100;
    const id = insert(db, "insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,document_generated_at,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,case when ?=1 then datetime('now') end,datetime('now'),datetime('now'))", [jobId, `INV-${String(8900 + jobId).padStart(5, "0")}`, input.tallyInvoiceNo.trim(), discount, gstRate, subtotal, gstAmount, total, "Open", input.notes.trim(), input.documentAvailable ? 1 : 0, input.documentAvailable ? 1 : 0]);
    for (const item of items) insert(db, "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,?,?,?,?,datetime('now'),datetime('now'))", [id, item.kind, item.description.trim(), item.qty, item.rate]);
    reconcileArtifactChecklist(db, jobId);
    db.run("release savepoint create_invoice");
    return id;
  } catch (error) {
    db.run("rollback to savepoint create_invoice");
    db.run("release savepoint create_invoice");
    throw error;
  }
}

export function createInvoiceForActor(db: Database, jobId: number, actorId: number, input: CreateInvoiceInput) {
  assertBillingMutationAccess(db, actorId);
  const job = one<JobCard>(db, "select * from job_cards where id=? and archived_at is null", [jobId]);
  if (job.main_status !== "COMPLETED") throw new Error("An invoice can only be created for a completed job.");
  return createInvoiceFromEstimate(db, jobId, input);
}

export function updateInvoiceForActor(db: Database, invoiceId: number, actorId: number, input: InvoiceFieldsInput) {
  assertBillingMutationAccess(db, actorId);
  updateInvoiceFields(db, invoiceId, input);
}

export interface InvoiceEditorInput extends InvoiceFieldsInput { items: Array<InvoiceItemInput & { id?: number }> }

export function saveInvoiceForActor(db: Database, invoiceId: number, actorId: number, input: InvoiceEditorInput) {
  assertBillingMutationAccess(db, actorId);
  if (input.items.length === 0) throw new Error("An invoice requires at least one item.");
  const existing = all<InvoiceItem>(db, "select * from invoice_items where invoice_id=? and archived_at is null order by id", [invoiceId]);
  const existingIds = new Set(existing.map((item) => item.id));
  if (input.items.some((item) => item.id && !existingIds.has(item.id))) throw new Error("Invoice item does not belong to this invoice.");
  input.items.forEach(validateInvoiceItem);
  const financialsLocked = scalar<number>(db, "select count(*) from payments where invoice_id=? and voided_at is null", [invoiceId]) > 0;
  const itemsChanged = input.items.length !== existing.length || input.items.some((item, index) => {
    const saved = existing[index];
    return !saved || item.id !== saved.id || item.kind !== saved.kind || item.description.trim() !== saved.description || item.qty !== saved.qty || item.rate !== saved.rate;
  });
  if (financialsLocked && itemsChanged) throw new Error("Invoice financial fields are locked after the first active payment.");
  db.run("savepoint save_invoice_editor");
  try {
    updateInvoiceFields(db, invoiceId, input);
    if (!financialsLocked) {
      for (const item of input.items) {
        if (item.id) updateInvoiceItem(db, item.id, item);
        else createInvoiceItem(db, invoiceId, item);
      }
      const retained = new Set(input.items.flatMap((item) => item.id ? [item.id] : []));
      for (const item of existing) if (!retained.has(item.id)) archiveInvoiceItem(db, item.id, "Removed in invoice editor");
    }
    db.run("release savepoint save_invoice_editor");
  } catch (error) {
    db.run("rollback to savepoint save_invoice_editor");
    db.run("release savepoint save_invoice_editor");
    throw error;
  }
}

export function voidInvoice(db: Database, invoiceId: number, reason: string) {
  if (!reason.trim()) throw new Error("An invoice void reason is required.");
  if (scalar<number>(db, "select count(*) from payments where invoice_id=? and voided_at is null", [invoiceId]) > 0) throw new Error("An invoice with active payments cannot be voided.");
  db.run("update invoices set voided_at=datetime('now'), void_reason=?, updated_at=datetime('now') where id=?", [reason, invoiceId]);
}

export function voidInvoiceForActor(db: Database, invoiceId: number, actorId: number, reason: string) {
  assertBillingMutationAccess(db, actorId);
  voidInvoice(db, invoiceId, reason);
}

export interface PaymentInput { amount: number; mode: PaymentMode; otherDetail: string; reference: string; notes: string }
const PAYMENT_MODES: readonly PaymentMode[] = ["UPI", "Cash", "Card", "Other"];

function validatePaymentInput(input: PaymentInput) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("Payment amount must be greater than zero.");
  if (!PAYMENT_MODES.includes(input.mode)) throw new Error("Payment mode must be UPI, Cash, Card, or Other.");
  if (input.mode === "Other" && !input.otherDetail.trim()) throw new Error("Other payment detail is required.");
}

function activePaidAmount(db: Database, invoiceId: number, excludingPaymentId = 0) {
  return scalar<number>(db, "select coalesce(sum(amount),0) from payments where invoice_id=? and voided_at is null and id<>?", [invoiceId, excludingPaymentId]);
}

function syncInvoicePaymentStatus(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(db, "select * from invoices where id=? and voided_at is null", [invoiceId]);
  const paid = activePaidAmount(db, invoiceId);
  const status = paid <= 0 ? "Open" : paid + 0.001 < invoice.total ? "Partial" : "Cleared";
  db.run("update invoices set status=?,updated_at=datetime('now') where id=?", [status, invoiceId]);
  reconcileArtifactChecklist(db, invoice.job_card_id);
}

function transitionJobStatusForBillingCorrection(db: Database, jobId: number, note: string, timestamp = new Date().toISOString()) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  if (job.main_status !== "CLOSED") throw new Error("A billing correction system transition requires a CLOSED job.");
  db.run("update job_cards set main_status='COMPLETED',sub_status='Customer Verification',closed_at=null,updated_at=? where id=?", [timestamp, jobId]);
  createLifecycleCycle(db, jobId, "COMPLETED", timestamp);
  history(db, jobId, "COMPLETED", "Customer Verification", note, timestamp);
  reconcileArtifactChecklist(db, jobId, 0, timestamp);
}

function reopenClearedInvoiceIfUnderpaid(db: Database, invoiceId: number, wasCleared: boolean) {
  if (!wasCleared) return;
  const invoice = one<Invoice>(db, "select * from invoices where id=? and voided_at is null", [invoiceId]);
  const job = one<JobCard>(db, "select * from job_cards where id=?", [invoice.job_card_id]);
  if (invoice.status === "Cleared" || job.main_status !== "CLOSED") return;
  const reason = "Billing correction: cleared invoice became underpaid";
  db.run("update receipts set voided_at=datetime('now'),void_reason=? where invoice_id=? and voided_at is null", [reason, invoiceId]);
  db.run("update gate_passes set voided_at=datetime('now'),void_reason=? where invoice_id=? and voided_at is null", [reason, invoiceId]);
  transitionJobStatusForBillingCorrection(db, invoice.job_card_id, "System billing correction: cleared invoice became underpaid; stale receipt and gate pass voided");
}

function closeJobForClearedInvoice(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(db, "select * from invoices where id=? and voided_at is null", [invoiceId]);
  if (invoice.status !== "Cleared") return;
  const job = one<JobCard>(db, "select * from job_cards where id=?", [invoice.job_card_id]);
  if (job.main_status !== "COMPLETED") return;
  generateReceiptAndGatePass(db, invoice.job_card_id);
  transitionJobStatus(db, invoice.job_card_id, "CLOSED", "System: invoice cleared by cumulative active payments");
}

export function recordPayment(db: Database, invoiceId: number, input: PaymentInput) {
  validatePaymentInput(input);
  const invoice = one<Invoice>(db, "select * from invoices where id=? and voided_at is null", [invoiceId]);
  if (activePaidAmount(db, invoiceId) + input.amount > invoice.total + 0.001) throw new Error("Payment would create an overpayment.");
  db.run("savepoint record_payment");
  try {
    const id = insert(db, "insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,?,?,?,?,datetime('now'),datetime('now'))", [invoice.job_card_id, invoiceId, input.amount, input.mode, input.otherDetail.trim(), input.reference.trim(), input.notes.trim()]);
    syncInvoicePaymentStatus(db, invoiceId);
    closeJobForClearedInvoice(db, invoiceId);
    db.run("release savepoint record_payment");
    return id;
  } catch (error) {
    db.run("rollback to savepoint record_payment");
    db.run("release savepoint record_payment");
    throw error;
  }
}

export function recordPaymentForActor(db: Database, invoiceId: number, actorId: number, input: PaymentInput) {
  assertBillingMutationAccess(db, actorId);
  return recordPayment(db, invoiceId, input);
}

export function editPayment(db: Database, id: number, input: PaymentInput) {
  validatePaymentInput(input);
  const payment = one<Payment>(db, "select * from payments where id=? and voided_at is null", [id]);
  const invoice = one<Invoice>(db, "select * from invoices where id=? and voided_at is null", [payment.invoice_id]);
  if (activePaidAmount(db, payment.invoice_id, id) + input.amount > invoice.total + 0.001) throw new Error("Payment would create an overpayment.");
  db.run("savepoint edit_payment");
  try {
    db.run("update payments set amount=?,mode=?,other_detail=?,reference=?,notes=?,updated_at=datetime('now') where id=?", [input.amount, input.mode, input.otherDetail.trim(), input.reference.trim(), input.notes.trim(), id]);
    syncInvoicePaymentStatus(db, payment.invoice_id);
    reopenClearedInvoiceIfUnderpaid(db, payment.invoice_id, invoice.status === "Cleared");
    closeJobForClearedInvoice(db, payment.invoice_id);
    db.run("release savepoint edit_payment");
  } catch (error) {
    db.run("rollback to savepoint edit_payment");
    db.run("release savepoint edit_payment");
    throw error;
  }
}

export function editPaymentForActor(db: Database, id: number, actorId: number, input: PaymentInput) {
  assertBillingMutationAccess(db, actorId);
  editPayment(db, id, input);
}

export function voidPayment(db: Database, id: number, reason: string) {
  if (!reason.trim()) throw new Error("A payment void reason is required.");
  const payment = one<Payment>(db, "select * from payments where id=? and voided_at is null", [id]);
  const invoice = one<Invoice>(db, "select * from invoices where id=? and voided_at is null", [payment.invoice_id]);
  db.run("savepoint void_payment");
  try {
    db.run("update payments set voided_at=datetime('now'),void_reason=?,updated_at=datetime('now') where id=?", [reason.trim(), id]);
    syncInvoicePaymentStatus(db, payment.invoice_id);
    reopenClearedInvoiceIfUnderpaid(db, payment.invoice_id, invoice.status === "Cleared");
    db.run("release savepoint void_payment");
  } catch (error) {
    db.run("rollback to savepoint void_payment");
    db.run("release savepoint void_payment");
    throw error;
  }
}

export function voidPaymentForActor(db: Database, id: number, actorId: number, reason: string) {
  assertBillingMutationAccess(db, actorId);
  voidPayment(db, id, reason);
}

export function addPayment(db: Database, jobId: number, amount: number, mode: string, reference: string) {
  const invoice = one<Invoice>(db, "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1", [jobId]);
  const normalizedMode: PaymentMode = PAYMENT_MODES.includes(mode as PaymentMode) ? mode as PaymentMode : mode.toLowerCase().startsWith("upi") ? "UPI" : "Other";
  return recordPayment(db, invoice.id, { amount, mode: normalizedMode, otherDetail: normalizedMode === "Other" ? mode : "", reference, notes: "" });
}

export function updatePayment(db: Database, id: number, amount: number, mode: string, reference: string) {
  const normalizedMode: PaymentMode = PAYMENT_MODES.includes(mode as PaymentMode) ? mode as PaymentMode : "Other";
  editPayment(db, id, { amount, mode: normalizedMode, otherDetail: normalizedMode === "Other" ? mode : "", reference, notes: "" });
}

export function generateReceiptAndGatePass(db: Database, jobId: number) {
  const invoice = one<Invoice>(db, "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1", [jobId]);
  if (invoice.status !== "Cleared") throw new Error("Receipt and gate pass require a cleared invoice.");
  if (!maybe<Receipt>(db, "select * from receipts where invoice_id=? and voided_at is null", [invoice.id])) {
    insert(db, "insert into receipts(job_card_id,invoice_id,receipt_no,created_at) values (?,?,?,datetime('now'))", [jobId, invoice.id, `RCT-${String(4500 + invoice.id).padStart(5, "0")}`]);
  }
  if (!maybe<GatePass>(db, "select * from gate_passes where invoice_id=? and voided_at is null", [invoice.id])) {
    insert(db, "insert into gate_passes(job_card_id,invoice_id,gate_pass_no,created_at) values (?,?,?,datetime('now'))", [jobId, invoice.id, `GP-${String(3100 + invoice.id).padStart(5, "0")}`]);
  }
  reconcileArtifactChecklist(db, jobId);
}

export function updateDeliveryDetails(db: Database, jobId: number, deliveredBy: string, finalKm: number, acknowledgement: string) {
  db.run("update job_cards set delivery_by=?, final_km=?, acknowledgement=?, updated_at=datetime('now') where id=?", [deliveredBy, finalKm, acknowledgement, jobId]);
}

export function updateDeliveryForActor(db: Database, jobId: number, actorId: number, deliveredBy: string, finalKm: number, acknowledgement: string) {
  assertBillingMutationAccess(db, actorId);
  if (!deliveredBy.trim()) throw new Error("Delivered by is required.");
  if (!Number.isFinite(finalKm) || finalKm < 0) throw new Error("Final KM cannot be negative.");
  updateDeliveryDetails(db, jobId, deliveredBy.trim(), finalKm, acknowledgement.trim());
}

export function markJobDeliveredForActor(db: Database, jobId: number, actorId: number, deliveredBy: string, finalKm: number, acknowledgement: string, timestamp = new Date().toISOString()) {
  assertBillingMutationAccess(db, actorId);
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  if (job.main_status !== "CLOSED") throw new Error("Only a closed job can be marked Delivered.");
  if (!maybe<GatePass>(db, "select * from gate_passes where job_card_id=? and voided_at is null", [jobId])) throw new Error("A current gate pass is required before delivery.");
  const item = one<ChecklistItem>(db, "select * from checklist_items where job_card_id=? and stage='CLOSED' and label='Delivered' order by cycle_number desc,id desc limit 1", [jobId]);
  if (item.checked_at) throw new Error("This job is already marked Delivered.");
  db.run("savepoint mark_delivered");
  try {
    updateDeliveryForActor(db, jobId, actorId, deliveredBy, finalKm, acknowledgement);
    setChecklistItemChecked(db, item.id, actorId, true, timestamp);
    db.run("update job_cards set closed_at=coalesce(nullif(closed_at,''),?),updated_at=? where id=?", [timestamp, timestamp, jobId]);
    db.run("release savepoint mark_delivered");
  } catch (error) {
    db.run("rollback to savepoint mark_delivered");
    db.run("release savepoint mark_delivered");
    throw error;
  }
}

export function closeJob(db: Database, jobId: number) {
  if (closureBlockers(readState(db).jobs.find((job) => job.job.id === jobId) ?? undefined).length > 0) return false;
  transitionJobStatus(db, jobId, "CLOSED", "Vehicle delivered and job closed");
  db.run("update job_cards set closed_at=datetime('now'), updated_at=datetime('now') where id=?", [jobId]);
  reconcileArtifactChecklist(db, jobId);
  return true;
}

export function createFollowup(db: Database, payload: Omit<Followup, "id">) {
  const id = insert(db, "insert into followups(job_card_id, note, due_at, done, outcome, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))", [
    payload.job_card_id,
    payload.note,
    payload.due_at,
    payload.done,
    payload.outcome ?? "",
  ]);
  reconcileArtifactChecklist(db, payload.job_card_id);
  return id;
}

export function updateFollowup(db: Database, id: number, payload: Omit<Followup, "id">) {
  db.run("update followups set note=?, due_at=?, done=?, outcome=?, updated_at=datetime('now') where id=?", [payload.note, payload.due_at, payload.done, payload.outcome ?? "", id]);
}

export function archiveFollowup(db: Database, id: number, reason: string) {
  archive(db, "followups", id, reason);
}

export function markFollowupDone(db: Database, id: number, outcome: string) {
  db.run("update followups set done=1, outcome=?, updated_at=datetime('now') where id=?", [outcome, id]);
}

export function addFollowup(db: Database, jobId: number, note: string) {
  createFollowup(db, { job_card_id: jobId, note, due_at: new Date(Date.now() + 86400000).toISOString().slice(0, 10), done: 0, outcome: "" });
}

export function createPhoto(db: Database, payload: Omit<Photo, "id">) {
  const id = insert(db, "insert into photos(job_card_id, label, src, category, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))", [
    payload.job_card_id,
    payload.label,
    payload.src,
    payload.category ?? "General",
  ]);
  reconcileArtifactChecklist(db, payload.job_card_id);
  return id;
}

export function updatePhoto(db: Database, id: number, payload: Omit<Photo, "id">) {
  db.run("update photos set label=?, src=?, category=?, updated_at=datetime('now') where id=?", [payload.label, payload.src, payload.category ?? "General", id]);
}

export function archivePhoto(db: Database, id: number, reason: string) {
  const photo = one<Photo>(db, "select * from photos where id=?", [id]);
  archive(db, "photos", id, reason);
  resetMissingPhotoEvidence(db, photo.job_card_id);
}

export interface JobPhotoInput {
  label: string;
  category: JobMediaCategory;
  src: string;
  originalName: string;
  width: number;
  height: number;
}

function assertJobMediaMutationAccess(db: Database, jobId: number, actorId: number) {
  const actor = one<User>(db, "select * from users where id=? and archived_at is null", [actorId]);
  const job = one<JobCard>(db, "select * from job_cards where id=? and archived_at is null", [jobId]);
  if (!canMutateJobLifecycle(actor, job)) throw new Error("Only the Owner or the linked Service Advisor can change job media.");
}

function validatePhotoMetadata(label: string, category: string) {
  const cleanLabel = label.trim();
  if (!cleanLabel) throw new Error("Photo label is required.");
  if (category !== "Before Work" && category !== "After Work") throw new Error("Choose Before Work or After Work.");
  return { label: cleanLabel, category: category as JobMediaCategory };
}

export function saveJobPhotoForActor(db: Database, jobId: number, actorId: number, input: JobPhotoInput) {
  assertJobMediaMutationAccess(db, jobId, actorId);
  const metadata = validatePhotoMetadata(input.label, input.category);
  const image = validateMediaDataUrl(input.src);
  if (!Number.isFinite(input.width) || input.width < 1 || !Number.isFinite(input.height) || input.height < 1) throw new Error("Image dimensions are invalid.");
  const id = insert(db, "insert into photos(job_card_id,label,src,category,mime_type,byte_size,original_name,width,height,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))", [
    jobId, metadata.label, input.src, metadata.category, image.mimeType, image.byteSize, input.originalName.trim(), Math.round(input.width), Math.round(input.height),
  ]);
  reconcileArtifactChecklist(db, jobId, actorId);
  return id;
}

export function updateJobPhotoForActor(db: Database, id: number, actorId: number, input: Pick<JobPhotoInput, "label" | "category">) {
  const photo = one<Photo>(db, "select * from photos where id=? and archived_at is null", [id]);
  assertJobMediaMutationAccess(db, photo.job_card_id, actorId);
  const metadata = validatePhotoMetadata(input.label, input.category);
  db.run("update photos set label=?,category=?,updated_at=datetime('now') where id=?", [metadata.label, metadata.category, id]);
}

export function archiveJobPhotoForActor(db: Database, id: number, actorId: number, reason: string) {
  const photo = one<Photo>(db, "select * from photos where id=? and archived_at is null", [id]);
  assertJobMediaMutationAccess(db, photo.job_card_id, actorId);
  if (!reason.trim()) throw new Error("An archive reason is required.");
  archivePhoto(db, id, reason.trim());
}

export function addPhoto(db: Database, jobId: number, label: string) {
  createPhoto(db, { job_card_id: jobId, label, src: "", category: "General" });
}

export function searchJobs(state: WorkshopState, criteria: SearchCriteria): SearchResult[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();
  return state.jobs.flatMap((view) => {
    if (criteria.status !== "ALL" && view.job.main_status !== criteria.status) return [];
    const searchable: Record<Exclude<SearchCriteria["category"], "all">, string[]> = {
      job: [view.job.job_no, view.advisor.name, view.job.work_list, ...view.estimate_items.map((item) => item.description), ...view.photos.map((photo) => `${photo.label} ${photo.category}`), ...view.material_movements.map((movement) => `${movement.direction} ${movement.note}`)],
      customer: [view.customer.name, view.customer.mobile],
      vehicle: [view.vehicle.number, view.vehicle.make, view.vehicle.model, view.vehicle.color],
      invoice: [view.invoice?.invoice_no ?? "", view.invoice?.tally_invoice_no ?? "", ...view.payments.map((payment) => `${payment.mode} ${payment.reference}`)],
    };
    const categories = (Object.keys(searchable) as Exclude<SearchCriteria["category"], "all">[]).filter((category) =>
      searchable[category].join(" ").toLowerCase().includes(normalizedQuery),
    );
    const permitted = criteria.category === "all" ? categories : categories.filter((category) => category === criteria.category);
    if (normalizedQuery && permitted.length === 0) return [];
    return [{ view, match: { categories: normalizedQuery ? permitted : [], normalizedQuery } }];
  });
}

function validateCustomer(db: Database, payload: Pick<Customer, "name" | "mobile" | "type">, existingId = 0) {
  if (!payload.name.trim()) throw new Error("Customer name is required.");
  if (!payload.mobile.trim()) throw new Error("Customer mobile is required.");
  if (!payload.type.trim()) throw new Error("Customer type is required.");
  if (maybe<{ id: number }>(db, "select id from customers where mobile=? and archived_at is null and id<>?", [payload.mobile.trim(), existingId])) {
    throw new Error("A customer with this mobile already exists.");
  }
}

function validateVehicle(db: Database, payload: Omit<Vehicle, "id">, existingId = 0) {
  if (!payload.customer_id) throw new Error("Vehicle customer is required.");
  if (!payload.number.trim()) throw new Error("Vehicle number is required.");
  if (!payload.make.trim() || !payload.model.trim()) throw new Error("Vehicle make and model are required.");
  if (maybe<{ id: number }>(db, "select id from vehicles where upper(number)=upper(?) and archived_at is null and id<>?", [payload.number.trim(), existingId])) {
    throw new Error("A vehicle with this number already exists.");
  }
}

export function closureBlockers(view?: JobView) {
  if (!view) return ["Select a job"];
  const blockers: string[] = [];
  if (view.job.qc_status !== "Pass") blockers.push("QC pass required");
  if (view.material_requests.some((request) => Math.abs(request.issued_qty - request.used_qty - request.returned_qty - request.wasted_qty) > 0.001)) blockers.push("Material reconciliation required");
  if (!view.invoice || !view.invoice.document_available || !view.invoice.tally_invoice_no) blockers.push("Available Tally invoice required");
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (!view.invoice || paid < view.invoice.total) blockers.push("Full payment required");
  if (!view.receipt) blockers.push("Receipt required");
  if (!view.gate_pass) blockers.push("Gate pass required");
  return blockers;
}

export function paymentStatus(view: JobView): PaymentStatus {
  const total = view.invoice?.total ?? invoiceItemsTotal(view.estimate_items, view.estimate);
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (paid <= 0) return "Pending";
  if (paid < total) return "Partial";
  return "Paid";
}

export function invoiceItemsTotal(items: EstimateItem[], estimate?: Estimate) {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const discount = estimate?.discount ?? 0;
  const gst = estimate?.gst_rate ?? 18;
  return Math.round(Math.max(0, subtotal - discount) * (1 + gst / 100));
}

export function createSchema(db: Database) {
  db.run(`
    create table if not exists users(id integer primary key, email text unique, name text, role text, password text);
    create table if not exists customers(id integer primary key, name text, mobile text unique, type text, address text);
    create table if not exists vehicles(id integer primary key, customer_id integer, number text unique, make text, model text, color text, km integer, engine_no text);
    create table if not exists visits(id integer primary key, customer_id integer, vehicle_id integer, advisor_id integer, received_by integer, received_at text, fuel text, keys text, accessories text, requested_work text, photos_note text);
    create table if not exists job_cards(id integer primary key, job_no text unique, visit_id integer, advisor_id integer, technician_id integer, main_status text, sub_status text, work_list text, promised_at text, qc_status text, washing_needed integer, closed_at text, service_type text, pickup_drop text, estimated_delivery text, damage_marks text);
    create table if not exists status_history(id integer primary key, job_card_id integer, main_status text, sub_status text, note text, created_at text);
    create table if not exists checklist_cycles(id integer primary key, job_card_id integer not null, stage text not null, cycle_number integer not null, started_at text not null, completed_at text, unique(job_card_id, stage, cycle_number));
    create table if not exists checklist_items(id integer primary key, checklist_cycle_id integer not null, job_card_id integer not null, stage text not null, cycle_number integer not null, item_key text not null, label text not null, sort_order integer not null, checked_by integer, checked_at text, started_at text, completed_at text, unique(checklist_cycle_id, item_key));
    create table if not exists estimates(id integer primary key, job_card_id integer, status text, discount real, gst_rate real, approval_note text);
    create table if not exists estimate_items(id integer primary key, estimate_id integer, kind text, description text, qty real, rate real);
    create table if not exists approvals(id integer primary key, job_card_id integer, approved_by text, note text, created_at text);
    create table if not exists tasks(id integer primary key, job_card_id integer, technician_id integer, title text, status text, notes text);
    create table if not exists qc_checks(id integer primary key, job_card_id integer, label text, passed integer);
    create table if not exists invoices(id integer primary key, job_card_id integer, invoice_no text, tally_invoice_no text, discount real default 0, gst_rate real default 18, subtotal real default 0, gst_amount real default 0, total real, status text, notes text default '', document_available integer default 1, document_generated_at text);
    create table if not exists invoice_items(id integer primary key, invoice_id integer, kind text, description text, qty real, rate real);
    create table if not exists payments(id integer primary key, job_card_id integer, invoice_id integer, amount real, mode text, other_detail text default '', reference text, notes text default '');
    create table if not exists receipts(id integer primary key, job_card_id integer, invoice_id integer, receipt_no text, voided_at text, void_reason text, created_at text);
    create table if not exists gate_passes(id integer primary key, job_card_id integer, invoice_id integer, gate_pass_no text, voided_at text, void_reason text, created_at text);
    create table if not exists inventory(id integer primary key, sku text, category text, name text, unit text, stock_qty real, low_stock_qty real);
    create table if not exists material_requests(id integer primary key, job_card_id integer, item_id integer, requested_qty real, issued_qty real, used_qty real, returned_qty real, wasted_qty real);
    create table if not exists material_movements(id integer primary key, job_card_id integer, item_id integer, direction text, qty real, note text, created_at text);
    create table if not exists photos(id integer primary key, job_card_id integer, label text, src text);
    create table if not exists followups(id integer primary key, job_card_id integer, note text, due_at text, done integer);
  `);
}

export function migrateSchema(db: Database) {
  db.run("create table if not exists material_events(id integer primary key, job_card_id integer, material_row_id integer, kind text, by_user integer, at text, note text, old_item_id integer, old_qty real, new_item_id integer, new_qty real)");
  db.run("create table if not exists stock_ledger(id integer primary key, job_card_id integer, material_row_id integer, item_id integer, qty real, type text, by_user integer, at text, note text)");
  ensureColumn(db, "material_requests", "status", "text not null default 'Requested'");
  ensureColumn(db, "material_requests", "invoiced_in", "integer");
  ensureColumn(db, "material_requests", "note", "text");
  db.run("update material_requests set status='Issued' where status='Requested' and issued_qty>0 and issued_qty>=requested_qty");
  ["users", "customers", "vehicles", "visits", "job_cards", "estimates", "estimate_items", "invoice_items", "tasks", "inventory", "material_requests", "photos", "followups"].forEach((table) => {
    ensureColumn(db, table, "archived_at", "text");
    ensureColumn(db, table, "archived_reason", "text");
    ensureColumn(db, table, "created_at", "text");
    ensureColumn(db, table, "updated_at", "text");
  });
  ["invoices", "payments"].forEach((table) => {
    ensureColumn(db, table, "voided_at", "text");
    ensureColumn(db, table, "void_reason", "text");
    ensureColumn(db, table, "created_at", "text");
    ensureColumn(db, table, "updated_at", "text");
  });
  ensureColumn(db, "invoices", "discount", "real default 0");
  ensureColumn(db, "invoices", "gst_rate", "real default 18");
  ensureColumn(db, "invoices", "subtotal", "real default 0");
  ensureColumn(db, "invoices", "gst_amount", "real default 0");
  ensureColumn(db, "invoices", "notes", "text default ''");
  ensureColumn(db, "invoices", "document_available", "integer default 1");
  ensureColumn(db, "invoices", "document_generated_at", "text");
  db.run("update invoices set document_generated_at=created_at where document_generated_at is null and document_available=1 and created_at is not null");
  ensureColumn(db, "payments", "invoice_id", "integer");
  ensureColumn(db, "payments", "other_detail", "text default ''");
  ensureColumn(db, "payments", "notes", "text default ''");
  for (const table of ["receipts", "gate_passes"]) {
    ensureColumn(db, table, "invoice_id", "integer");
    ensureColumn(db, table, "voided_at", "text");
    ensureColumn(db, table, "void_reason", "text");
    ensureColumn(db, table, "created_at", "text");
  }
  db.run("update invoices set status=case when status in ('Draft','Generated') then 'Open' else status end");
  db.run("update payments set invoice_id=(select id from invoices where invoices.job_card_id=payments.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null");
  db.run("update receipts set invoice_id=(select id from invoices where invoices.job_card_id=receipts.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null");
  db.run("update gate_passes set invoice_id=(select id from invoices where invoices.job_card_id=gate_passes.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null");
  for (const invoice of all<Invoice>(db, "select * from invoices where voided_at is null order by id")) {
    if (scalar<number>(db, "select count(*) from invoice_items where invoice_id=?", [invoice.id]) === 0) {
      const estimate = maybe<Estimate>(db, "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1", [invoice.job_card_id]);
      if (estimate) {
        for (const item of all<EstimateItem>(db, "select * from estimate_items where estimate_id=? and archived_at is null order by id", [estimate.id])) {
          insert(db, "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,?,?,?,?,datetime('now'),datetime('now'))", [invoice.id, item.kind, item.description, item.qty, item.rate]);
        }
        db.run("update invoices set discount=?,gst_rate=? where id=?", [estimate.discount, estimate.gst_rate, invoice.id]);
        if (scalar<number>(db, "select count(*) from invoice_items where invoice_id=?", [invoice.id]) > 0) recalculateInvoice(db, invoice.id);
      }
    }
    syncInvoicePaymentStatus(db, invoice.id);
  }
  ensureColumn(db, "job_cards", "advisor_notes", "text");
  ensureColumn(db, "job_cards", "customer_instructions", "text");
  ensureColumn(db, "job_cards", "internal_instructions", "text");
  ensureColumn(db, "job_cards", "delivery_by", "text");
  ensureColumn(db, "job_cards", "final_km", "real");
  ensureColumn(db, "job_cards", "acknowledgement", "text");
  ensureColumn(db, "job_cards", "service_type", "text");
  ensureColumn(db, "job_cards", "pickup_drop", "text");
  ensureColumn(db, "job_cards", "estimated_delivery", "text");
  ensureColumn(db, "job_cards", "damage_marks", "text");
  ensureColumn(db, "vehicles", "engine_no", "text");
  ensureColumn(db, "customers", "address", "text");
  ensureColumn(db, "tasks", "started_at", "text");
  ensureColumn(db, "tasks", "paused_at", "text");
  ensureColumn(db, "tasks", "completed_at", "text");
  ensureColumn(db, "qc_checks", "fail_reason", "text");
  ensureColumn(db, "qc_checks", "archived_at", "text");
  ensureColumn(db, "photos", "category", "text");
  ensureColumn(db, "photos", "mime_type", "text");
  ensureColumn(db, "photos", "byte_size", "integer");
  ensureColumn(db, "photos", "original_name", "text");
  ensureColumn(db, "photos", "width", "integer");
  ensureColumn(db, "photos", "height", "integer");
  ensureColumn(db, "followups", "outcome", "text");
  migrateLifecycleStorage(db);
}

export function migrateLifecycleStorage(db: Database) {
  db.run(`
    create table if not exists checklist_cycles(id integer primary key, job_card_id integer not null, stage text not null, cycle_number integer not null, started_at text not null, completed_at text, unique(job_card_id, stage, cycle_number));
    create table if not exists checklist_items(id integer primary key, checklist_cycle_id integer not null, job_card_id integer not null, stage text not null, cycle_number integer not null, item_key text not null, label text not null, sort_order integer not null, checked_by integer, checked_at text, started_at text, completed_at text, unique(checklist_cycle_id, item_key));
  `);
  ensureColumn(db, "checklist_items", "required", "integer not null default 1");
  ensureColumn(db, "checklist_items", "na_at", "text");
  ensureColumn(db, "checklist_items", "na_by", "integer");
  db.run(`update checklist_items set required=case when label in (${OPTIONAL_CHECKLIST_ITEMS.map((label) => `'${label}'`).join(",")}) then 0 else 1 end`);
  all<{ id: number; main_status: MainStatus; sub_status: SubStatus; created_at: string | null }>(db, "select id, main_status, sub_status, created_at from job_cards").forEach((job) => {
    ensureLifecycleChecklist(db, job.id, job.main_status, job.sub_status, job.created_at ?? undefined);
    syncSubStatusFromChecklist(db, job.id);
  });
}

export function ensureLifecycleChecklist(
  db: Database,
  jobId: number,
  mainStatus: MainStatus,
  currentSubStatus: SubStatus,
  timestamp?: string,
) {
  const existing = maybe<{ id: number }>(db, "select id from checklist_cycles where job_card_id=? limit 1", [jobId]);
  if (existing) return existing.id;
  const stage = checklistStageForSubStatus(currentSubStatus);
  const stamp = timestamp || new Date().toISOString();
  const cycleComplete = mainStatus === "CLOSED" && stage === "CLOSED" && currentSubStatus === "Delivered";
  return createLifecycleCycle(db, jobId, stage, stamp, currentSubStatus, cycleComplete);
}

function createLifecycleCycle(db: Database, jobId: number, stage: ChecklistStage, timestamp: string, through?: SubStatus, completeThrough = false) {
  const cycleNumber = (scalar<number>(db, "select coalesce(max(cycle_number), 0) from checklist_cycles where job_card_id=? and stage=?", [jobId, stage]) ?? 0) + 1;
  const labels = LIFECYCLE_CHECKLIST[stage];
  const throughIndex = through && labels.includes(through) ? labels.indexOf(through) : -1;
  const cycleId = insert(db, "insert into checklist_cycles(job_card_id,stage,cycle_number,started_at,completed_at) values(?,?,?,?,?)", [jobId, stage, cycleNumber, timestamp, completeThrough ? timestamp : null]);
  labels.forEach((label, index) => {
    const checked = index < throughIndex || (completeThrough && index === throughIndex);
    const started = index === 0 || index <= throughIndex;
    insert(db, "insert into checklist_items(checklist_cycle_id,job_card_id,stage,cycle_number,item_key,label,sort_order,checked_by,checked_at,started_at,completed_at,required) values(?,?,?,?,?,?,?,?,?,?,?,?)", [
      cycleId, jobId, stage, cycleNumber, `${stage.toLowerCase()}.${index + 1}`, label, index + 1, null, checked ? timestamp : null, started ? timestamp : null, checked ? timestamp : null, OPTIONAL_CHECKLIST_ITEMS.includes(label) ? 0 : 1,
    ]);
  });
  return cycleId;
}

export function syncSubStatusFromChecklist(db: Database, jobId: number) {
  const cycle = maybe<ChecklistCycle>(db, "select * from checklist_cycles where job_card_id=? order by id desc limit 1", [jobId]);
  if (!cycle) return;
  const items = all<ChecklistItem>(db, "select * from checklist_items where checklist_cycle_id=? order by sort_order", [cycle.id]);
  if (items.length === 0) return;
  db.run("update job_cards set sub_status=? where id=?", [deriveChecklistSubStatus(items), jobId]);
}

export const OPTIONAL_CHECKLIST_ITEMS: readonly SubStatus[] = ["Washing Needed", "Follow-up Needed"];
// Items that may only be ticked (or marked N/A) once the saved document behind them exists.
const DOCUMENT_GATED_ITEMS: Partial<Record<SubStatus, { table: string; noun: string; live: string }>> = {
  "Create Estimate": { table: "estimates", noun: "estimate", live: "archived_at is null" },
  "Invoice Ready": { table: "invoices", noun: "invoice", live: "voided_at is null" },
};

export function setChecklistItemChecked(db: Database, itemId: number, actorId: number, checked: boolean, timestamp = new Date().toISOString()) {
  const item = one<ChecklistItem>(db, "select * from checklist_items where id=?", [itemId]);
  if (checked && scalar<number>(db, "select count(*) from checklist_items where checklist_cycle_id=? and sort_order<? and required=1 and checked_at is null", [item.checklist_cycle_id, item.sort_order]) > 0) {
    throw new Error("Checklist items must be completed in order.");
  }
  if (!checked && scalar<number>(db, "select count(*) from checklist_items where checklist_cycle_id=? and sort_order>? and required=1 and checked_at is not null", [item.checklist_cycle_id, item.sort_order]) > 0) {
    throw new Error("Later checklist items must be reopened first.");
  }
  writeChecklistItemState(db, item, actorId, checked, false, timestamp);
}

// N/A resolves an item (it counts toward completion) but keeps its own timestamp and actor.
export function setChecklistItemNotApplicable(db: Database, itemId: number, actorId: number, notApplicable: boolean, timestamp = new Date().toISOString()) {
  const item = one<ChecklistItem>(db, "select * from checklist_items where id=?", [itemId]);
  if (notApplicable) {
    if ((MATERIALS_CHECKLIST_LABELS as readonly string[]).includes(item.label) && scalar<number>(db, "select count(*) from material_requests where job_card_id=? and archived_at is null", [item.job_card_id]) > 0) {
      throw new Error("N/A is only available while the job card has no material rows.");
    }
    if (item.checked_at && !item.na_at) throw new Error("Untick the item before marking it N/A.");
  } else if (!item.na_at) {
    throw new Error("This item is not marked N/A.");
  }
  if (!notApplicable && scalar<number>(db, "select count(*) from checklist_items where checklist_cycle_id=? and sort_order>? and required=1 and checked_at is not null", [item.checklist_cycle_id, item.sort_order]) > 0) {
    throw new Error("Later checklist items must be reopened first.");
  }
  writeChecklistItemState(db, item, actorId, notApplicable, notApplicable, timestamp);
}

function writeChecklistItemState(db: Database, item: ChecklistItem, actorId: number, resolved: boolean, notApplicable: boolean, timestamp: string) {
  db.run("update checklist_items set checked_by=?, checked_at=?, started_at=coalesce(started_at, ?), completed_at=?, na_at=?, na_by=? where id=?", [
    resolved && !notApplicable ? actorId : null, resolved ? timestamp : null, timestamp, resolved ? timestamp : null,
    notApplicable ? timestamp : null, notApplicable ? actorId : null, item.id,
  ]);
  const remaining = scalar<number>(db, "select count(*) from checklist_items where checklist_cycle_id=? and required=1 and checked_at is null", [item.checklist_cycle_id]);
  db.run("update checklist_cycles set completed_at=? where id=?", [remaining === 0 ? timestamp : null, item.checklist_cycle_id]);
  if (resolved) db.run("update checklist_items set started_at=coalesce(started_at, ?) where checklist_cycle_id=? and sort_order=?", [timestamp, item.checklist_cycle_id, item.sort_order + 1]);
  syncSubStatusFromChecklist(db, item.job_card_id);
}

function assertChecklistItemEditable(db: Database, item: ChecklistItem, resolving: boolean) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [item.job_card_id]);
  const latest = maybe<{ id: number }>(db, "select id from checklist_cycles where job_card_id=? order by id desc limit 1", [item.job_card_id]);
  if (job.main_status !== item.stage || latest?.id !== item.checklist_cycle_id) {
    throw new Error(`The ${item.stage} checklist is read-only while the job card is ${job.main_status}.`);
  }
  const gate = DOCUMENT_GATED_ITEMS[item.label];
  if (resolving && gate && scalar<number>(db, `select count(*) from ${gate.table} where job_card_id=? and ${gate.live}`, [item.job_card_id]) === 0) {
    throw new Error(`Save the ${gate.noun} before completing "${item.label}".`);
  }
}

export function setChecklistItemCheckedForActor(db: Database, itemId: number, actorId: number, checked: boolean, timestamp = new Date().toISOString()) {
  const item = one<ChecklistItem>(db, "select * from checklist_items where id=?", [itemId]);
  assertJobLifecycleMutationAccess(db, item.job_card_id, actorId);
  assertChecklistItemEditable(db, item, checked);
  setChecklistItemChecked(db, itemId, actorId, checked, timestamp);
}

export function setChecklistItemNotApplicableForActor(db: Database, itemId: number, actorId: number, notApplicable: boolean, timestamp = new Date().toISOString()) {
  const item = one<ChecklistItem>(db, "select * from checklist_items where id=?", [itemId]);
  assertJobLifecycleMutationAccess(db, item.job_card_id, actorId);
  assertChecklistItemEditable(db, item, notApplicable);
  setChecklistItemNotApplicable(db, itemId, actorId, notApplicable, timestamp);
}

function ensureColumn(db: Database, table: string, column: string, definition: string) {
  const exists = all<{ name: string }>(db, `pragma table_info(${table})`).some((item) => item.name === column);
  if (!exists) db.run(`alter table ${table} add column ${column} ${definition}`);
}

function seed(db: Database) {
  [
    ["admin@example.com", "Owner/Admin", "admin"],
    ["service@example.com", "Service Advisor", "service"],
    ["reception@example.com", "Reception Desk", "reception"],
    ["accounts@example.com", "Accounts Desk", "accounts"],
    ["store@example.com", "Store Counter", "store"],
    ["tech@example.com", "Technician Bay", "tech"],
  ].forEach(([email, name, role]) => db.run("insert into users(email, name, role, password, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))", [email, name, role, "admin123"]));

  db.run("insert into customers(name, mobile, type, created_at, updated_at) values ('Rahul Sharma','9876543210','Individual',datetime('now'),datetime('now')),('Datya Motors','9777711022','Dealer',datetime('now'),datetime('now')),('Anita Patra','9123488990','Individual',datetime('now'),datetime('now'))");
  db.run("insert into vehicles(customer_id, number, make, model, color, km, created_at, updated_at) values (1,'OD02AB1234','Hyundai','Creta','White',18420,datetime('now'),datetime('now')),(2,'OD02CD5678','Mahindra','Thar','Black',9200,datetime('now'),datetime('now')),(3,'OD05EF9001','BMW','X1','Blue',31100,datetime('now'),datetime('now'))");
  WORKBOOK_INVENTORY_SEED.forEach((row) => db.run("insert into inventory(sku, category, name, unit, stock_qty, low_stock_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))", [...row]));

  makeSeedJob(db, 1, 1, "JC-2026-001245", "IN_PROGRESS", "Work Started", "Full body PPF, paint correction, interior detailing", 94400, 30000);
  makeSeedJob(db, 2, 2, "JC-2026-001246", "IN_PROGRESS", "Material Requested", "Bonnet PPF, ceramic coating", 42480, 0);
  makeSeedJob(db, 3, 3, "JC-2026-001247", "COMPLETED", "Invoice Ready", "Paint correction", 12000, 0);
}

function makeSeedJob(db: Database, customerId: number, vehicleId: number, jobNo: string, main: MainStatus, sub: SubStatus, work: string, total: number, paid: number) {
  const visitId = insert(
    db,
    "insert into visits(customer_id, vehicle_id, advisor_id, received_by, received_at, fuel, keys, accessories, requested_work, photos_note, created_at, updated_at) values (?, ?, 2, 3, datetime('now'), 'Half', '2 keys', 'Mats, charger', ?, 'Sample document placeholder', datetime('now'), datetime('now'))",
    [customerId, vehicleId, work],
  );
  const jobId = insert(
    db,
    "insert into job_cards(job_no, visit_id, advisor_id, technician_id, main_status, sub_status, work_list, promised_at, qc_status, washing_needed, closed_at, advisor_notes, customer_instructions, internal_instructions, created_at, updated_at) values (?, ?, 2, 6, ?, ?, ?, 'Today 6:00 PM', ?, 0, '', 'Seed advisor note', ?, '', datetime('now'), datetime('now'))",
    [jobNo, visitId, main, sub, work, main === "COMPLETED" ? "Pass" : "Pending", work],
  );
  ensureLifecycleChecklist(db, jobId, main, sub, "2026-01-01T08:00:00.000Z");
  const estimateId = insert(db, "insert into estimates(job_card_id, status, discount, gst_rate, approval_note, created_at, updated_at) values (?, 'Approved', 1000, 18, 'Seed approval', datetime('now'), datetime('now'))", [jobId]);
  insert(db, "insert into estimate_items(estimate_id, kind, description, qty, rate, created_at, updated_at) values (?, 'Service', ?, 1, ?, datetime('now'), datetime('now'))", [estimateId, work, Math.round(total / 1.18)]);
  const itemId = jobNo.endsWith("1246") ? 16 : 1;
  const issued = jobNo.endsWith("1246") ? 0 : 6;
  createMaterialRequest(db, { job_card_id: jobId, item_id: itemId, requested_qty: 6, issued_qty: issued, used_qty: jobNo.endsWith("1246") ? 0 : 5, returned_qty: jobNo.endsWith("1246") ? 0 : 0.8, wasted_qty: jobNo.endsWith("1246") ? 0 : 0.2 });
  if (issued > 0) movement(db, jobId, itemId, "ISSUE", issued, "Seed issue");
  createTask(db, { job_card_id: jobId, technician_id: 6, title: work.split(",")[0], status: main === "COMPLETED" ? "Completed" : "Started", notes: "Seed task from workbook flow." });
  ["Edges checked", "Surface cleaned", "Customer items verified"].forEach((label) => insert(db, "insert into qc_checks(job_card_id, label, passed) values (?, ?, ?)", [jobId, label, main === "COMPLETED" ? 1 : 0]));
  let invoiceId = 0;
  if (main === "COMPLETED") {
    const seedRate = Math.round(total / 1.18);
    const taxable = Math.max(0, seedRate - 1000);
    const gstAmount = Math.round(taxable * 18) / 100;
    const invoiceTotal = Math.round((taxable + gstAmount) * 100) / 100;
    invoiceId = insert(db, "insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,created_at,updated_at) values(?,'INV-08947','TLY-4451',1000,18,?,?,?,'Open','Seed invoice',1,datetime('now'),datetime('now'))", [jobId, seedRate, gstAmount, invoiceTotal]);
    insert(db, "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,datetime('now'),datetime('now'))", [invoiceId, work, seedRate]);
  }
  if (paid > 0 && invoiceId) {
    insert(db, "insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,'UPI','','ADV-SEED','Seed advance',datetime('now'),datetime('now'))", [jobId, invoiceId, paid]);
    syncInvoicePaymentStatus(db, invoiceId);
  }
  createPhoto(db, { job_card_id: jobId, label: "Job sheet placeholder", src: "", category: "Job Sheet" });
  history(db, jobId, main, sub, "Seeded demo workflow");
}

export function transitionJobStatus(db: Database, jobId: number, to: MainStatus, note: string, timestamp = new Date().toISOString()) {
  const confirmation = note.trim();
  if (!confirmation) throw new Error("A confirmation note is required for every status transition.");
  db.run("savepoint job_status_transition");
  try {
    const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
    if (job.main_status === to) throw new Error(`Job card is already ${to}.`);
    assertValidMainStatusTransition(job.main_status, to);

    const gated = to !== "CANCELLED" && to !== "HOLD" && job.main_status !== "HOLD";
    if (gated) {
      const active = maybe<ChecklistCycle>(db, "select * from checklist_cycles where job_card_id=? order by id desc limit 1", [jobId]);
      if ((!active || active.stage !== job.main_status || !active.completed_at)) {
        const remaining = active
          ? all<{ label: SubStatus }>(db, "select label from checklist_items where checklist_cycle_id=? and required=1 and checked_at is null order by sort_order", [active.id]).map((item) => item.label)
          : [];
        throw new Error(`Complete the ${job.main_status} checklist before moving to ${to}${remaining.length ? `: ${remaining.join(", ")}` : "."}`);
      }
    }

    const keepsChecklist = to === "CANCELLED" || to === "HOLD";
    const resumesCycle = job.main_status === "HOLD" && to === "IN_PROGRESS";
    const nextSub = keepsChecklist || resumesCycle ? checklistSubStatus(db, jobId, job.sub_status) : LIFECYCLE_CHECKLIST[to][0];
    db.run("update job_cards set main_status=?, sub_status=?, closed_at=case when ?='CLOSED' then coalesce(closed_at, ?) else closed_at end, updated_at=? where id=?", [to, nextSub, to, timestamp, timestamp, jobId]);
    if (!keepsChecklist && !resumesCycle) createLifecycleCycle(db, jobId, to, timestamp);
    history(db, jobId, to, nextSub, confirmation, timestamp);
    if (!keepsChecklist) reconcileArtifactChecklist(db, jobId, 0, timestamp);
    if (to === "COMPLETED") {
      const cleared = maybe<Invoice>(db, "select * from invoices where job_card_id=? and status='Cleared' and voided_at is null order by id desc limit 1", [jobId]);
      if (cleared) closeJobForClearedInvoice(db, cleared.id);
    }
    db.run("release savepoint job_status_transition");
  } catch (error) {
    db.run("rollback to savepoint job_status_transition");
    db.run("release savepoint job_status_transition");
    throw error;
  }
}

export function reconcileArtifactChecklist(db: Database, jobId: number, actorId = 0, timestamp = new Date().toISOString()) {
  const cycle = maybe<ChecklistCycle>(db, "select * from checklist_cycles where job_card_id=? order by id desc limit 1", [jobId]);
  if (!cycle) return;
  const items = all<ChecklistItem>(db, "select * from checklist_items where checklist_cycle_id=? order by sort_order", [cycle.id]);
  for (const item of items) {
    if (item.checked_at) continue;
    if (!artifactExistsForChecklistItem(db, jobId, item.label)) { if (item.required === 0) continue; break; }
    setChecklistItemChecked(db, item.id, actorId, true, timestamp);
  }
}

function resetMissingPhotoEvidence(db: Database, onlyJobId?: number) {
  const jobs = all<{ id: number }>(db, `select j.id from job_cards j
    where j.main_status='IN_PROGRESS' ${onlyJobId === undefined ? "" : "and j.id=?"}
    and not exists(select 1 from photos p where p.job_card_id=j.id and p.archived_at is null and trim(coalesce(p.src,''))<>'')`, onlyJobId === undefined ? [] : [onlyJobId]);
  for (const job of jobs) {
    const cycle = maybe<ChecklistCycle>(db, "select * from checklist_cycles where job_card_id=? and stage='IN_PROGRESS' order by cycle_number desc,id desc limit 1", [job.id]);
    if (!cycle) continue;
    const photoItem = maybe<ChecklistItem>(db, "select * from checklist_items where checklist_cycle_id=? and label='Photos Shared'", [cycle.id]);
    if (!photoItem?.checked_at) continue;
    db.run("update checklist_items set checked_by=null,checked_at=null,completed_at=null where checklist_cycle_id=? and sort_order>=?", [cycle.id, photoItem.sort_order]);
    syncSubStatusFromChecklist(db, job.id);
  }
}

function artifactExistsForChecklistItem(db: Database, jobId: number, label: SubStatus) {
  switch (label) {
    case "Gather Requirements": return scalar<number>(db, "select count(*) from job_cards j join visits v on v.id=j.visit_id where j.id=? and trim(coalesce(v.requested_work,''))<>''", [jobId]) > 0;
    case "Create Estimate": return scalar<number>(db, "select count(*) from estimates where job_card_id=? and archived_at is null", [jobId]) > 0;
    case "Get Confirmation": return scalar<number>(db, "select count(*) from estimates where job_card_id=? and status='Approved' and archived_at is null", [jobId]) > 0;
    case "Material Requested": return scalar<number>(db, "select count(*) from material_requests where job_card_id=? and archived_at is null and status<>'Draft'", [jobId]) > 0;
    case "Material Issued": return scalar<number>(db, "select count(*) from material_requests where job_card_id=? and archived_at is null and status='Issued'", [jobId]) > 0
      && scalar<number>(db, "select count(*) from material_requests where job_card_id=? and archived_at is null and status not in ('Issued','Cancelled')", [jobId]) === 0;
    case "Washing Needed": return scalar<number>(db, "select count(*) from job_cards where id=? and washing_needed=1", [jobId]) > 0;
    case "Work Started": return scalar<number>(db, "select count(*) from tasks where job_card_id=? and status in ('Started','Paused','Completed') and archived_at is null", [jobId]) > 0;
    case "Follow-up Needed": return scalar<number>(db, "select count(*) from followups where job_card_id=? and archived_at is null", [jobId]) > 0;
    case "Photos Shared": return scalar<number>(db, "select count(*) from photos where job_card_id=? and archived_at is null and trim(coalesce(src,''))<>''", [jobId]) > 0;
    case "QC Pending": return scalar<number>(db, "select count(*) from tasks where job_card_id=? and status<>'Completed' and archived_at is null", [jobId]) === 0;
    case "Customer Verification": return scalar<number>(db, "select count(*) from job_cards where id=? and qc_status='Pass'", [jobId]) > 0;
    case "Invoice Ready": return scalar<number>(db, "select count(*) from invoices where job_card_id=? and document_available=1 and trim(coalesce(tally_invoice_no,''))<>'' and voided_at is null", [jobId]) > 0;
    case "Payment Received": {
      const invoice = maybe<Invoice>(db, "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1", [jobId]);
      return Boolean(invoice && invoice.total > 0 && scalar<number>(db, "select coalesce(sum(amount),0) from payments where invoice_id=? and voided_at is null", [invoice.id]) >= invoice.total);
    }
    case "Receipt Generated": return scalar<number>(db, "select count(*) from receipts where job_card_id=? and voided_at is null", [jobId]) > 0;
    case "Gate Pass Generated": return scalar<number>(db, "select count(*) from gate_passes where job_card_id=? and voided_at is null", [jobId]) > 0;
    case "Delivered": return false;
  }
}

function checklistSubStatus(db: Database, jobId: number, fallback: SubStatus) {
  const cycle = maybe<ChecklistCycle>(db, "select * from checklist_cycles where job_card_id=? order by id desc limit 1", [jobId]);
  if (!cycle) return fallback;
  const items = all<ChecklistItem>(db, "select * from checklist_items where checklist_cycle_id=? order by sort_order", [cycle.id]);
  return items.length ? deriveChecklistSubStatus(items) : fallback;
}

function history(db: Database, jobId: number, main: MainStatus, sub: SubStatus, note: string, timestamp?: string) {
  db.run("insert into status_history(job_card_id, main_status, sub_status, note, created_at) values (?, ?, ?, ?, coalesce(?, datetime('now')))", [jobId, main, sub, note, timestamp ?? null]);
}

function auditEvidence(db: Database, jobId: number, note: string) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  history(db, jobId, job.main_status, checklistSubStatus(db, jobId, job.sub_status), note);
}

function movement(db: Database, jobId: number, itemId: number, direction: string, qty: number, note: string) {
  db.run("insert into material_movements(job_card_id, item_id, direction, qty, note, created_at) values (?, ?, ?, ?, ?, datetime('now'))", [jobId, itemId, direction, qty, note]);
}

function archive(db: Database, table: string, id: number, reason: string) {
  db.run(`update ${table} set archived_at=datetime('now'), archived_reason=?, updated_at=datetime('now') where id=?`, [reason || "Archived", id]);
}

function invoiceTotal(db: Database, jobId: number) {
  const estimate = maybe<Estimate>(db, "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1", [jobId]);
  const items = estimate ? all<EstimateItem>(db, "select * from estimate_items where estimate_id=? and archived_at is null", [estimate.id]) : [];
  return invoiceItemsTotal(items, estimate);
}

function insert(db: Database, sql: string, params: DbValue[]) {
  db.run(sql, params);
  return scalar<number>(db, "select last_insert_rowid()");
}

function scalar<T>(db: Database, sql: string, params: DbValue[] = []) {
  return db.exec(sql, params)[0]?.values[0]?.[0] as T;
}

function all<T>(db: Database, sql: string, params: DbValue[] = []) {
  const result = db.exec(sql, params)[0];
  if (!result) return [] as T[];
  return result.values.map((row) => Object.fromEntries(result.columns.map((column, index) => [column, row[index]]))) as T[];
}

function one<T>(db: Database, sql: string, params: DbValue[] = []) {
  const row = maybe<T>(db, sql, params);
  if (!row) throw new Error(`Expected row for query: ${sql}`);
  return row;
}

function maybe<T>(db: Database, sql: string, params: DbValue[] = []) {
  return all<T>(db, sql, params)[0];
}
