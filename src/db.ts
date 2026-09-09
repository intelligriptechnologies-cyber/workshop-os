import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import type {
  Customer,
  Estimate,
  EstimateItem,
  Followup,
  GatePass,
  InventoryItem,
  Invoice,
  JobCard,
  JobView,
  MainStatus,
  MaterialMovement,
  MaterialRequest,
  Payment,
  PaymentStatus,
  Photo,
  QcCheck,
  Receipt,
  StatusHistory,
  SubStatus,
  Task,
  TaskStatus,
  User,
  Vehicle,
  Visit,
  WorkshopState,
} from "./types";

const STORAGE_KEY = "workshopos.sqlite.v2";
type DbValue = number | string | Uint8Array | null;

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
  const binary = db.export();
  let encoded = "";
  binary.forEach((byte: number) => {
    encoded += String.fromCharCode(byte);
  });
  localStorage.setItem(STORAGE_KEY, btoa(encoded));
}

export function readState(db: Database): WorkshopState {
  const users = all<User>(db, "select * from users where archived_at is null order by id");
  const customers = all<Customer>(db, "select * from customers where archived_at is null order by id");
  const vehicles = all<Vehicle>(db, "select * from vehicles where archived_at is null order by id");
  const visits = all<Visit>(db, "select * from visits where archived_at is null order by id desc");
  const inventory = all<InventoryItem>(db, "select * from inventory where archived_at is null order by category, name");
  const jobRows = all<JobCard>(db, "select * from job_cards where archived_at is null order by id desc");
  const jobs: JobView[] = jobRows.map((job) => {
    const visit = one<Visit>(db, "select * from visits where id=?", [job.visit_id]);
    const customer = one<Customer>(db, "select * from customers where id=?", [visit.customer_id]);
    const vehicle = one<Vehicle>(db, "select * from vehicles where id=?", [visit.vehicle_id]);
    const advisor = one<User>(db, "select * from users where id=?", [job.advisor_id]);
    const technician = one<User>(db, "select * from users where id=?", [job.technician_id]);
    const estimate = maybe<Estimate>(db, "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1", [job.id]);
    const estimate_items = estimate ? all<EstimateItem>(db, "select * from estimate_items where estimate_id=? and archived_at is null", [estimate.id]) : [];
    const material_requests = all<MaterialRequest>(db, "select * from material_requests where job_card_id=? and archived_at is null", [job.id]);
    const materialInventory = material_requests
      .map((request) => maybe<InventoryItem>(db, "select * from inventory where id=?", [request.item_id]))
      .filter(Boolean) as InventoryItem[];
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
      inventory: materialInventory,
      tasks: all<Task>(db, "select * from tasks where job_card_id=? and archived_at is null", [job.id]),
      invoice: maybe<Invoice>(db, "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1", [job.id]),
      payments: all<Payment>(db, "select * from payments where job_card_id=? and voided_at is null order by id", [job.id]),
      receipt: maybe<Receipt>(db, "select * from receipts where job_card_id=? order by id desc limit 1", [job.id]),
      gate_pass: maybe<GatePass>(db, "select * from gate_passes where job_card_id=? order by id desc limit 1", [job.id]),
      photos: all<Photo>(db, "select * from photos where job_card_id=? and archived_at is null", [job.id]),
      followups: all<Followup>(db, "select * from followups where job_card_id=? and archived_at is null", [job.id]),
      qc_checks: all<QcCheck>(db, "select * from qc_checks where job_card_id=? and archived_at is null", [job.id]),
      status_history: all<StatusHistory>(db, "select * from status_history where job_card_id=? order by id desc", [job.id]),
      material_movements: all<MaterialMovement>(db, "select * from material_movements where job_card_id=? or job_card_id=0 order by id desc", [job.id]),
    };
  });
  return { users, customers, vehicles, visits, jobs, inventory };
}

export function login(state: WorkshopState, email: string, password: string) {
  return state.users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password);
}

export function createCustomer(db: Database, payload: Pick<Customer, "name" | "mobile" | "type">) {
  return insert(db, "insert into customers(name, mobile, type, created_at, updated_at) values (?, ?, ?, datetime('now'), datetime('now'))", [
    payload.name,
    payload.mobile,
    payload.type,
  ]);
}

export function updateCustomer(db: Database, id: number, payload: Pick<Customer, "name" | "mobile" | "type">) {
  db.run("update customers set name=?, mobile=?, type=?, updated_at=datetime('now') where id=?", [payload.name, payload.mobile, payload.type, id]);
}

export function archiveCustomer(db: Database, id: number, reason: string) {
  archive(db, "customers", id, reason);
}

export function createVehicle(db: Database, payload: Omit<Vehicle, "id">) {
  return insert(
    db,
    "insert into vehicles(customer_id, number, make, model, color, km, created_at, updated_at) values (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [payload.customer_id, payload.number.toUpperCase(), payload.make, payload.model, payload.color, payload.km],
  );
}

export function updateVehicle(db: Database, id: number, payload: Omit<Vehicle, "id">) {
  db.run("update vehicles set customer_id=?, number=?, make=?, model=?, color=?, km=?, updated_at=datetime('now') where id=?", [
    payload.customer_id,
    payload.number.toUpperCase(),
    payload.make,
    payload.model,
    payload.color,
    payload.km,
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
  },
) {
  const customerId =
    payload.customerId ||
    maybe<{ id: number }>(db, "select id from customers where mobile=? and archived_at is null", [payload.mobile])?.id ||
    createCustomer(db, { name: payload.customerName, mobile: payload.mobile, type: payload.customerType || "Individual" });
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
    });
  updateCustomer(db, customerId, { name: payload.customerName, mobile: payload.mobile, type: payload.customerType || "Individual" });
  updateVehicle(db, vehicleId, { customer_id: customerId, number: payload.vehicleNo, make: payload.make, model: payload.model, color: payload.color, km: payload.km });
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
  return jobId;
}

export function updateJobCard(
  db: Database,
  jobId: number,
  payload: Partial<Pick<JobCard, "advisor_id" | "technician_id" | "main_status" | "sub_status" | "work_list" | "promised_at" | "advisor_notes" | "customer_instructions" | "internal_instructions">>,
) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  const main = payload.main_status ?? job.main_status;
  const sub = payload.sub_status ?? job.sub_status;
  db.run(
    "update job_cards set advisor_id=?, technician_id=?, main_status=?, sub_status=?, work_list=?, promised_at=?, advisor_notes=?, customer_instructions=?, internal_instructions=?, updated_at=datetime('now') where id=?",
    [
      payload.advisor_id ?? job.advisor_id,
      payload.technician_id ?? job.technician_id,
      main,
      sub,
      payload.work_list ?? job.work_list,
      payload.promised_at ?? job.promised_at,
      payload.advisor_notes ?? job.advisor_notes ?? "",
      payload.customer_instructions ?? job.customer_instructions ?? "",
      payload.internal_instructions ?? job.internal_instructions ?? "",
      jobId,
    ],
  );
  if (main !== job.main_status || sub !== job.sub_status) history(db, jobId, main, sub, "Job card updated");
}

export function cancelJobCard(db: Database, jobId: number, reason: string) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  archive(db, "job_cards", jobId, reason || "Cancelled");
  archive(db, "visits", job.visit_id, reason || "Cancelled");
  history(db, jobId, job.main_status, job.sub_status, `Cancelled: ${reason || "No reason"}`);
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
  setJobStatus(db, jobId, "NEW", "Create Estimate", "Estimate drafted");
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
  history(db, estimate.job_card_id, payload.status === "Approved" ? "IN_PROGRESS" : "NEW", payload.status === "Approved" ? "Get Confirmation" : "Create Estimate", `Estimate ${payload.status ?? "updated"}`);
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
  setJobStatus(db, jobId, "IN_PROGRESS", "Material Requested", "Estimate approved; material requested");
}

export function createMaterialRequest(db: Database, payload: Omit<MaterialRequest, "id">) {
  return insert(
    db,
    "insert into material_requests(job_card_id, item_id, requested_qty, issued_qty, used_qty, returned_qty, wasted_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [payload.job_card_id, payload.item_id, payload.requested_qty, payload.issued_qty, payload.used_qty, payload.returned_qty, payload.wasted_qty],
  );
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
  const item = one<InventoryItem>(db, "select * from inventory where id=?", [request.item_id]);
  if (qty <= 0 || qty > item.stock_qty) throw new Error(`Cannot issue ${qty}; stock available is ${item.stock_qty}`);
  db.run("update material_requests set issued_qty=issued_qty + ?, updated_at=datetime('now') where id=?", [qty, requestId]);
  db.run("update inventory set stock_qty=stock_qty - ?, updated_at=datetime('now') where id=?", [qty, request.item_id]);
  movement(db, request.job_card_id, request.item_id, "ISSUE", qty, "Issued to job");
  setJobStatus(db, request.job_card_id, "IN_PROGRESS", "Material Issued", "Material issued from store");
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
  history(db, request.job_card_id, "IN_PROGRESS", "Material Issued", "Material reconciled");
}

export function reconcileMaterial(db: Database, requestId: number, used: number, returned: number, wasted: number) {
  reconcileMaterialQty(db, requestId, used, returned, wasted);
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
  if (status === "Started") setJobStatus(db, task.job_card_id, "IN_PROGRESS", "Work Started", "Task started");
  if (status === "Paused") history(db, task.job_card_id, "IN_PROGRESS", "Work Started", "Task paused");
  if (status === "Completed" && scalar<number>(db, "select count(*) from tasks where job_card_id=? and id<>? and status<>'Completed' and archived_at is null", [task.job_card_id, taskId]) === 0) {
    setJobStatus(db, task.job_card_id, "IN_PROGRESS", "QC Pending", "All tasks completed; QC pending");
  }
}

export function archiveTask(db: Database, id: number, reason: string) {
  archive(db, "tasks", id, reason);
}

export function markWashingNeeded(db: Database, jobId: number) {
  db.run("update job_cards set washing_needed=1, updated_at=datetime('now') where id=?", [jobId]);
  setJobStatus(db, jobId, "IN_PROGRESS", "Washing Needed", "Washing required before delivery");
}

export function updateQcCheck(db: Database, id: number, passed: boolean, failReason = "") {
  const check = one<QcCheck>(db, "select * from qc_checks where id=?", [id]);
  db.run("update qc_checks set passed=?, fail_reason=? where id=?", [passed ? 1 : 0, failReason, id]);
  db.run("update job_cards set qc_status=? where id=?", [passed ? "Pass" : "Fail", check.job_card_id]);
  history(db, check.job_card_id, "IN_PROGRESS", passed ? "QC Pending" : "Work Started", passed ? `QC passed: ${check.label}` : `QC failed: ${failReason || check.label}`);
}

export function failQcWithRework(db: Database, checkId: number, technicianId: number, reason: string) {
  const check = one<QcCheck>(db, "select * from qc_checks where id=?", [checkId]);
  updateQcCheck(db, checkId, false, reason);
  createTask(db, { job_card_id: check.job_card_id, technician_id: technicianId, title: `Rework: ${check.label}`, status: "Pending", notes: reason });
}

export function passQc(db: Database, jobId: number) {
  db.run("update qc_checks set passed=1 where job_card_id=? and archived_at is null", [jobId]);
  db.run("update job_cards set qc_status='Pass', updated_at=datetime('now') where id=?", [jobId]);
  setJobStatus(db, jobId, "COMPLETED", "Customer Verification", "QC passed; ready for customer verification");
}

export function generateInvoice(db: Database, jobId: number, tally: string) {
  const total = invoiceTotal(db, jobId);
  const existing = maybe<Invoice>(db, "select * from invoices where job_card_id=? and voided_at is null", [jobId]);
  if (existing) {
    db.run("update invoices set tally_invoice_no=?, total=?, status=?, updated_at=datetime('now') where id=?", [tally, total, "Generated", existing.id]);
  } else {
    insert(db, "insert into invoices(job_card_id, invoice_no, tally_invoice_no, total, status, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))", [
      jobId,
      `INV-${String(8900 + jobId).padStart(5, "0")}`,
      tally,
      total,
      "Generated",
    ]);
  }
  setJobStatus(db, jobId, "COMPLETED", "Invoice Ready", "Invoice generated");
}

export function voidInvoice(db: Database, invoiceId: number, reason: string) {
  db.run("update invoices set voided_at=datetime('now'), void_reason=?, updated_at=datetime('now') where id=?", [reason, invoiceId]);
}

export function addPayment(db: Database, jobId: number, amount: number, mode: string, reference: string) {
  insert(db, "insert into payments(job_card_id, amount, mode, reference, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))", [jobId, amount, mode, reference]);
  const total = maybe<Invoice>(db, "select * from invoices where job_card_id=? and voided_at is null", [jobId])?.total ?? 0;
  const paid = scalar<number>(db, "select coalesce(sum(amount),0) from payments where job_card_id=? and voided_at is null", [jobId]);
  if (paid >= total && total > 0) setJobStatus(db, jobId, "CLOSED", "Payment Received", "Payment received");
}

export function updatePayment(db: Database, id: number, amount: number, mode: string, reference: string) {
  db.run("update payments set amount=?, mode=?, reference=?, updated_at=datetime('now') where id=?", [amount, mode, reference, id]);
}

export function voidPayment(db: Database, id: number, reason: string) {
  db.run("update payments set voided_at=datetime('now'), void_reason=?, updated_at=datetime('now') where id=?", [reason, id]);
}

export function generateReceiptAndGatePass(db: Database, jobId: number) {
  if (!maybe<Receipt>(db, "select * from receipts where job_card_id=?", [jobId])) {
    insert(db, "insert into receipts(job_card_id, receipt_no) values (?, ?)", [jobId, `RCT-${String(4500 + jobId).padStart(5, "0")}`]);
  }
  if (!maybe<GatePass>(db, "select * from gate_passes where job_card_id=?", [jobId])) {
    insert(db, "insert into gate_passes(job_card_id, gate_pass_no) values (?, ?)", [jobId, `GP-${String(3100 + jobId).padStart(5, "0")}`]);
  }
  setJobStatus(db, jobId, "CLOSED", "Gate Pass Generated", "Receipt and gate pass generated");
}

export function updateDeliveryDetails(db: Database, jobId: number, deliveredBy: string, finalKm: number, acknowledgement: string) {
  db.run("update job_cards set delivery_by=?, final_km=?, acknowledgement=?, updated_at=datetime('now') where id=?", [deliveredBy, finalKm, acknowledgement, jobId]);
}

export function closeJob(db: Database, jobId: number) {
  if (closureBlockers(readState(db).jobs.find((job) => job.job.id === jobId) ?? undefined).length > 0) return false;
  setJobStatus(db, jobId, "CLOSED", "Delivered", "Vehicle delivered and job closed");
  db.run("update job_cards set closed_at=datetime('now'), updated_at=datetime('now') where id=?", [jobId]);
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
  setJobStatus(db, payload.job_card_id, "IN_PROGRESS", "Follow-up Needed", "Follow-up added");
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
  setJobStatus(db, payload.job_card_id, "IN_PROGRESS", "Photos Shared", "Photo added");
  return id;
}

export function updatePhoto(db: Database, id: number, payload: Omit<Photo, "id">) {
  db.run("update photos set label=?, src=?, category=?, updated_at=datetime('now') where id=?", [payload.label, payload.src, payload.category ?? "General", id]);
}

export function archivePhoto(db: Database, id: number, reason: string) {
  archive(db, "photos", id, reason);
}

export function addPhoto(db: Database, jobId: number, label: string) {
  createPhoto(db, { job_card_id: jobId, label, src: "", category: "General" });
}

export function searchJobs(state: WorkshopState, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return state.jobs;
  return state.jobs.filter(({ job, customer, vehicle, invoice, advisor, estimate_items, payments, photos, material_movements }) =>
    [
      job.job_no,
      customer.name,
      customer.mobile,
      vehicle.number,
      invoice?.invoice_no,
      invoice?.tally_invoice_no,
      advisor.name,
      estimate_items.map((item) => item.description).join(" "),
      payments.map((payment) => `${payment.mode} ${payment.reference}`).join(" "),
      photos.map((photo) => `${photo.label} ${photo.category}`).join(" "),
      material_movements.map((movement) => `${movement.direction} ${movement.note}`).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function closureBlockers(view?: JobView) {
  if (!view) return ["Select a job"];
  const blockers: string[] = [];
  if (view.job.qc_status !== "Pass") blockers.push("QC pass required");
  if (view.material_requests.some((request) => Math.abs(request.issued_qty - request.used_qty - request.returned_qty - request.wasted_qty) > 0.001)) blockers.push("Material reconciliation required");
  if (!view.invoice || view.invoice.status !== "Generated" || !view.invoice.tally_invoice_no) blockers.push("Generated Tally invoice required");
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

function createSchema(db: Database) {
  db.run(`
    create table if not exists users(id integer primary key, email text unique, name text, role text, password text);
    create table if not exists customers(id integer primary key, name text, mobile text unique, type text);
    create table if not exists vehicles(id integer primary key, customer_id integer, number text unique, make text, model text, color text, km integer);
    create table if not exists visits(id integer primary key, customer_id integer, vehicle_id integer, advisor_id integer, received_by integer, received_at text, fuel text, keys text, accessories text, requested_work text, photos_note text);
    create table if not exists job_cards(id integer primary key, job_no text unique, visit_id integer, advisor_id integer, technician_id integer, main_status text, sub_status text, work_list text, promised_at text, qc_status text, washing_needed integer, closed_at text);
    create table if not exists status_history(id integer primary key, job_card_id integer, main_status text, sub_status text, note text, created_at text);
    create table if not exists estimates(id integer primary key, job_card_id integer, status text, discount real, gst_rate real, approval_note text);
    create table if not exists estimate_items(id integer primary key, estimate_id integer, kind text, description text, qty real, rate real);
    create table if not exists approvals(id integer primary key, job_card_id integer, approved_by text, note text, created_at text);
    create table if not exists tasks(id integer primary key, job_card_id integer, technician_id integer, title text, status text, notes text);
    create table if not exists qc_checks(id integer primary key, job_card_id integer, label text, passed integer);
    create table if not exists invoices(id integer primary key, job_card_id integer, invoice_no text, tally_invoice_no text, total real, status text);
    create table if not exists payments(id integer primary key, job_card_id integer, amount real, mode text, reference text);
    create table if not exists receipts(id integer primary key, job_card_id integer, receipt_no text);
    create table if not exists gate_passes(id integer primary key, job_card_id integer, gate_pass_no text);
    create table if not exists inventory(id integer primary key, sku text, category text, name text, unit text, stock_qty real, low_stock_qty real);
    create table if not exists material_requests(id integer primary key, job_card_id integer, item_id integer, requested_qty real, issued_qty real, used_qty real, returned_qty real, wasted_qty real);
    create table if not exists material_movements(id integer primary key, job_card_id integer, item_id integer, direction text, qty real, note text, created_at text);
    create table if not exists photos(id integer primary key, job_card_id integer, label text, src text);
    create table if not exists followups(id integer primary key, job_card_id integer, note text, due_at text, done integer);
  `);
}

function migrateSchema(db: Database) {
  ["users", "customers", "vehicles", "visits", "job_cards", "estimates", "estimate_items", "tasks", "inventory", "material_requests", "photos", "followups"].forEach((table) => {
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
  ensureColumn(db, "job_cards", "advisor_notes", "text");
  ensureColumn(db, "job_cards", "customer_instructions", "text");
  ensureColumn(db, "job_cards", "internal_instructions", "text");
  ensureColumn(db, "job_cards", "delivery_by", "text");
  ensureColumn(db, "job_cards", "final_km", "real");
  ensureColumn(db, "job_cards", "acknowledgement", "text");
  ensureColumn(db, "tasks", "started_at", "text");
  ensureColumn(db, "tasks", "paused_at", "text");
  ensureColumn(db, "tasks", "completed_at", "text");
  ensureColumn(db, "qc_checks", "fail_reason", "text");
  ensureColumn(db, "qc_checks", "archived_at", "text");
  ensureColumn(db, "photos", "category", "text");
  ensureColumn(db, "followups", "outcome", "text");
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
  db.run(`insert into inventory(sku, category, name, unit, stock_qty, low_stock_qty, created_at, updated_at) values
    ('PPF-UG-5Y','PPF','TPU Gloss PPF 5yrs warranty 1.5mx15m','metre',54,18,datetime('now'),datetime('now')),
    ('PPF-SMAX-7Y','PPF','Super MAX 7yrs warranty PPF Roll','metre',21,12,datetime('now'),datetime('now')),
    ('FILM-NANO-70','PPF','70% VLT Nano Ceramic Film','metre',7,10,datetime('now'),datetime('now')),
    ('3M-TACK-50401','Paint','Teflon Tack Cloth #50401','piece',14,20,datetime('now'),datetime('now')),
    ('DX90-PUTTY','Paint','Putty 1Kg DX90','kg',8,5,datetime('now'),datetime('now')),
    ('CRX-3050S','Paint','Clear 3050S','litre',20,6,datetime('now'),datetime('now'))`);

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
  const estimateId = insert(db, "insert into estimates(job_card_id, status, discount, gst_rate, approval_note, created_at, updated_at) values (?, 'Approved', 1000, 18, 'Seed approval', datetime('now'), datetime('now'))", [jobId]);
  insert(db, "insert into estimate_items(estimate_id, kind, description, qty, rate, created_at, updated_at) values (?, 'Service', ?, 1, ?, datetime('now'), datetime('now'))", [estimateId, work, Math.round(total / 1.18)]);
  const itemId = jobNo.endsWith("1246") ? 3 : 1;
  const issued = jobNo.endsWith("1246") ? 0 : 6;
  createMaterialRequest(db, { job_card_id: jobId, item_id: itemId, requested_qty: 6, issued_qty: issued, used_qty: jobNo.endsWith("1246") ? 0 : 5, returned_qty: jobNo.endsWith("1246") ? 0 : 0.8, wasted_qty: jobNo.endsWith("1246") ? 0 : 0.2 });
  if (issued > 0) movement(db, jobId, itemId, "ISSUE", issued, "Seed issue");
  createTask(db, { job_card_id: jobId, technician_id: 6, title: work.split(",")[0], status: main === "COMPLETED" ? "Completed" : "Started", notes: "Seed task from workbook flow." });
  ["Edges checked", "Surface cleaned", "Customer items verified"].forEach((label) => insert(db, "insert into qc_checks(job_card_id, label, passed) values (?, ?, ?)", [jobId, label, main === "COMPLETED" ? 1 : 0]));
  if (main === "COMPLETED") insert(db, "insert into invoices(job_card_id, invoice_no, tally_invoice_no, total, status, created_at, updated_at) values (?, 'INV-08947', 'TLY-4451', ?, 'Generated', datetime('now'), datetime('now'))", [jobId, total]);
  if (paid > 0) insert(db, "insert into payments(job_card_id, amount, mode, reference, created_at, updated_at) values (?, ?, 'UPI advance', 'ADV-SEED', datetime('now'), datetime('now'))", [jobId, paid]);
  createPhoto(db, { job_card_id: jobId, label: "Job sheet placeholder", src: "", category: "Job Sheet" });
  history(db, jobId, main, sub, "Seeded demo workflow");
}

function setJobStatus(db: Database, jobId: number, main: MainStatus, sub: SubStatus, note: string) {
  db.run("update job_cards set main_status=?, sub_status=?, updated_at=datetime('now') where id=?", [main, sub, jobId]);
  history(db, jobId, main, sub, note);
}

function history(db: Database, jobId: number, main: MainStatus, sub: SubStatus, note: string) {
  db.run("insert into status_history(job_card_id, main_status, sub_status, note, created_at) values (?, ?, ?, ?, datetime('now'))", [jobId, main, sub, note]);
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
