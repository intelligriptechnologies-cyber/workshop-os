export type Role =
  "admin" | "service" | "reception" | "accounts" | "store" | "tech";

export type MainStatus =
  "NEW" | "IN_PROGRESS" | "HOLD" | "COMPLETED" | "CLOSED" | "CANCELLED";

export type ChecklistStage = Exclude<MainStatus, "CANCELLED" | "HOLD">;

export type SubStatus =
  | "Gather Requirements"
  | "Create Estimate"
  | "Get Confirmation"
  | "Material Requested"
  | "Material Issued"
  | "Washing Needed"
  | "Work Started"
  | "Follow-up Needed"
  | "Photos Shared"
  | "QC Pending"
  | "Customer Verification"
  | "Invoice Ready"
  | "Payment Received"
  | "Receipt Generated"
  | "Gate Pass Generated"
  | "Delivered";

export type TaskStatus = "Pending" | "Started" | "Paused" | "Completed";
export type QcStatus = "Pending" | "Pass" | "Fail";
export type PaymentStatus = "Pending" | "Partial" | "Paid";
export type PaymentMode = "UPI" | "Cash" | "Card" | "Bank transfer" | "Other";
export type ViewMode = "grid" | "table";
export type BookingStatus =
  "Booked" | "Confirmed" | "Arrived" | "Rescheduled" | "Cancelled" | "No-show";
export type BookingArrivalWindow = "" | "Morning" | "Afternoon" | "Evening";

export interface ListQuery {
  search: string;
  filters: Record<string, string>;
  sort: string;
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageCount: number;
  page: number;
  from: number;
  to: number;
}

export interface JobListSummary {
  id: number;
  jobNo: string;
  vehicle: string;
  customer: string;
  status: MainStatus;
  workflow: SubStatus;
  total: number;
  createdAt: string;
}

export interface VehicleListSummary {
  id: number;
  registration: string;
  makeModel: string;
  color: string;
  customer: string;
  km: number;
  createdAt: string;
}

export interface CustomerListSummary {
  id: number;
  name: string;
  mobile: string;
  type: string;
  vehicleCount: number;
  openJobCount: number;
  lastVisit: string;
  createdAt: string;
}

export interface MediaListSummary {
  id: number;
  label: string;
  category: string;
  jobNo: string;
  vehicle: string;
  src: string;
  createdAt: string;
}
export type SearchCategory =
  "all" | "job" | "customer" | "vehicle" | "invoice" | "payment";

export interface SearchCriteria {
  query: string;
  category: SearchCategory;
  status: MainStatus | "ALL";
}

export interface SearchMatchMetadata {
  categories: Exclude<SearchCategory, "all">[];
  normalizedQuery: string;
}

export interface SearchResult {
  view: JobView;
  match: SearchMatchMetadata;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  password: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
  externalAuth?: boolean;
  externalId?: string;
}

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  type: string;
  address?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vehicle {
  id: number;
  customer_id: number;
  number: string;
  make: string;
  model: string;
  color: string;
  km: number;
  engine_no?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Visit {
  id: number;
  customer_id: number;
  vehicle_id: number;
  advisor_id: number;
  received_by: number;
  received_at: string;
  fuel: string;
  /** Immutable odometer snapshot captured at check-in. */
  odo_reading?: number;
  /** Structured fuel/battery reading retained alongside the legacy `fuel` display value. */
  fuel_level_value?: string;
  fuel_level_unit?: "bars" | "%" | "litres" | "Other";
  keys: string;
  accessories: string;
  requested_work: string;
  photos_note: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

/** A future reception reservation. It deliberately has no Visit or Job Card until check-in. */
export interface Booking {
  id: number;
  customer_id?: number | null;
  vehicle_id?: number | null;
  customer_name: string;
  mobile: string;
  customer_type: string;
  vehicle_no: string;
  make: string;
  model: string;
  color: string;
  requested_work: string;
  booking_date: string;
  arrival_window: BookingArrivalWindow;
  status: BookingStatus;
  created_by: number;
  confirmed_at?: string | null;
  arrived_at?: string | null;
  rescheduled_at?: string | null;
  cancelled_at?: string | null;
  no_show_at?: string | null;
  reschedule_reason?: string | null;
  cancellation_reason?: string | null;
  no_show_reason?: string | null;
  /** Set once this future reservation is received at reception. */
  visit_id?: number | null;
  /** Set once this future reservation is received at reception. */
  job_card_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface BookingCallLog {
  id: number;
  booking_id: number;
  note: string;
  called_by: number;
  called_at: string;
}

export interface BookingEvent {
  id: number;
  booking_id: number;
  kind: BookingStatus;
  actor_id: number;
  at: string;
  note: string;
  previous_booking_date?: string | null;
  booking_date: string;
}

/** A per-day advance-booking ceiling. Missing rows use the workshop default. */
export interface BookingCapacityLimit {
  booking_date: string;
  capacity: number;
  set_by: number;
  updated_at: string;
}

/** Records the exceptional Admin approval that admitted a booking over capacity. */
export interface BookingCapacityOverride {
  id: number;
  booking_id: number;
  booking_date: string;
  reason: string;
  approved_by: number;
  approved_at: string;
}

export interface JobCard {
  id: number;
  job_no: string;
  visit_id: number;
  advisor_id: number;
  technician_id: number;
  main_status: MainStatus;
  sub_status: SubStatus;
  work_list: string;
  promised_at: string;
  qc_status: QcStatus;
  washing_needed: number;
  closed_at: string;
  advisor_notes?: string;
  customer_instructions?: string;
  internal_instructions?: string;
  delivery_by?: string;
  final_km?: number;
  acknowledgement?: string;
  service_type?: string;
  pickup_drop?: string;
  estimated_delivery?: string;
  /** JSON array of DamageMark; see job-sheet.ts. */
  damage_marks?: string;
  /** Timestamp of the most recent explicit body-mark save. */
  damage_marks_recorded_at?: string | null;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Estimate {
  id: number;
  job_card_id: number;
  status: "Draft" | "Approved";
  discount: number;
  gst_rate: number;
  approval_note: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EstimateItem {
  id: number;
  estimate_id: number;
  kind: "Service" | "Material";
  description: string;
  qty: number;
  rate: number;
  gst_type?: "CGST+SGST" | "IGST" | "No GST" | null;
  gst_rate?: number | null;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
  task_list_item_id?: number | null;
}

export interface ServiceCatalogItem {
  id: number;
  name: string;
  base_rate: number;
  gst_rate: number;
  archived_at?: string | null;
  archived_reason?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface JobTaskListItem {
  id: number;
  job_card_id: number;
  service_catalog_item_id?: number | null;
  name: string;
  base_rate: number;
  gst_rate: number;
  done: number;
  archived_at?: string | null;
  archived_reason?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialRequest {
  id: number;
  job_card_id: number;
  item_id: number;
  requested_qty: number;
  issued_qty: number;
  used_qty: number;
  returned_qty: number;
  wasted_qty: number;
  status?: "Draft" | "Requested" | "Re-requested" | "Issued" | "Cancelled";
  invoiced_in?: number | null;
  note?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export type MaterialApprovalStatus = "Pending" | "Approved" | "Rejected";

/** The current, job-level Store material approval. Its event trail is immutable. */
export interface MaterialApproval {
  id: number;
  job_card_id: number;
  status: MaterialApprovalStatus;
  submitted_by: number;
  submitted_at: string;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  revision: number;
}

export interface MaterialApprovalEvent {
  id: number;
  approval_id: number;
  job_card_id: number;
  action: "Submitted" | "Approved" | "Rejected" | "Resubmitted";
  actor_id: number;
  at: string;
  note: string;
  revision: number;
}

/** A job-specific purchase made outside inventory. This is cost tracking only. */
export interface LocalPurchase {
  id: number;
  job_card_id: number;
  item_description: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  vendor: string;
  bill_reference: string;
  note?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

/** An advisor's free-text request, resolved by Store into stock and an issued job row. */
export interface MaterialPurchaseRequest {
  id: number;
  job_card_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  status: "Pending" | "Completed" | "Cancelled";
  mapped_inventory_item_id?: number | null;
  material_request_id?: number | null;
  local_purchase_id?: number | null;
  completed_by?: number | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialEvent {
  id: number;
  job_card_id: number;
  material_row_id: number;
  kind: "release" | "issued-edit";
  by_user: number;
  at: string;
  note: string;
  old_item_id: number | null;
  old_qty: number | null;
  new_item_id: number;
  new_qty: number;
}

export interface InventoryItem {
  id: number;
  sku: string;
  category: string;
  name: string;
  unit: string;
  stock_qty: number;
  low_stock_qty: number;
  /** Default customer-facing rate (INR) for material invoice lines. */
  selling_price: number;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export type SupplierStatus = "Active" | "On hold" | "Archived";

/** A supplier is managed by an administrator and can be selected only while Active. */
export interface Supplier {
  id: number;
  name: string;
  contact_name: string;
  phone: string;
  email: string;
  gstin: string;
  status: SupplierStatus;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export type InwardPurchaseStatus =
  "Draft" | "Awaiting PO Approval" | "Approved" | "Received" | "Submitted";

export interface InwardPurchase {
  id: number;
  supplier_id: number;
  supplier_invoice_no: string;
  invoice_date: string;
  po_number: string;
  status: InwardPurchaseStatus;
  subtotal: number;
  discount_total: number;
  gst_total: number;
  total: number;
  created_by: number;
  submitted_by: number | null;
  submitted_at: string | null;
  purchase_order_id: number | null;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InwardPurchaseLine {
  id: number;
  purchase_id: number;
  item_id: number;
  received_qty: number;
  unit_cost: number;
  discount: number;
  gst_rate: number;
  subtotal: number;
  gst_amount: number;
  total: number;
  purchase_order_line_id: number | null;
}

/** Demo persistence stores a data URL; production adapters should expose an authorized URL only. */
export interface InwardPurchaseAttachment {
  id: number;
  purchase_id: number;
  original_name: string;
  mime_type: string;
  byte_size: number;
  storage_key: string;
  document_url: string;
  uploaded_by: number;
  uploaded_at: string;
}

export interface InwardPurchaseRevision {
  id: number;
  purchase_id: number;
  revision_no: number;
  reason: string;
  revised_by: number;
  revised_at: string;
}

export type PurchaseOrderStatus =
  | "PO Request"
  | "PO Request Approved"
  | "Draft"
  | "Sent"
  | "Partially Received"
  | "Ready to Close"
  | "Closed"
  | "Cancelled";

/** A new purchasing commitment. Legacy inward_purchases remain receipt history. */
export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  po_number: string;
  order_date: string;
  notes: string;
  status: PurchaseOrderStatus;
  subtotal: number;
  discount_total: number;
  gst_total: number;
  total: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  /** Child orders created when Admin splits a Purchase Request by supplier. */
  source_purchase_order_id?: number | null;
}

export interface PurchaseOrderLine {
  id: number;
  purchase_order_id: number;
  item_id: number;
  /** Populated for a New Item Request before Admin creates its SKU. */
  item_name: string;
  unit: string;
  ordered_qty: number;
  unit_cost: number;
  discount: number;
  gst_rate: number;
  subtotal: number;
  gst_amount: number;
  total: number;
  /** The requested line copied into a supplier-specific child Purchase Order. */
  source_purchase_order_line_id?: number | null;
}

/** A manually captured supplier quote used only during Admin price review. */
export interface PurchaseOrderQuotation {
  id: number;
  purchase_order_id: number;
  purchase_order_line_id: number;
  supplier_name: string;
  quote_date: string;
  quoted_qty: number;
  unit_cost: number;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

/** A physical receipt. Its linked ledger row is the sole inventory movement. */
export interface StockInward {
  id: number;
  item_id: number;
  qty: number;
  note: string;
  purchase_order_id: number | null;
  purchase_order_line_id: number | null;
  ledger_id: number | null;
  received_by: number;
  received_at: string;
}

export interface Task {
  id: number;
  job_card_id: number;
  technician_id: number;
  title: string;
  status: TaskStatus;
  notes: string;
  started_at?: string;
  paused_at?: string;
  completed_at?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: number;
  job_card_id: number;
  invoice_no: string;
  tally_invoice_no: string;
  discount: number;
  gst_rate: number;
  subtotal: number;
  gst_amount: number;
  total: number;
  /** Partial is retained only for imported/audit history; new invoices are Pending or Cleared. */
  status: "Pending" | "Partial" | "Cleared";
  notes: string;
  document_available: number;
  document_generated_at?: string;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceEvent {
  id: number;
  job_card_id: number;
  invoice_id: number;
  kind: "create" | "edit" | "void";
  by_user: number;
  at: string;
  note: string;
  old_total: number | null;
  new_total: number | null;
  detail: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  gst_rate?: number | null;
  gst_type?: "CGST+SGST" | "IGST" | "No GST" | null;
  material_row_id?: number | null;
  kind: "Service" | "Material";
  description: string;
  qty: number;
  rate: number;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: number;
  job_card_id: number;
  invoice_id: number;
  amount: number;
  mode: PaymentMode;
  reference: string;
  notes: string;
  other_detail: string;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Receipt {
  id: number;
  job_card_id: number;
  receipt_no: string;
  invoice_id: number;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
}

export interface GatePass {
  id: number;
  job_card_id: number;
  gate_pass_no: string;
  invoice_id: number;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
}

export interface Photo {
  id: number;
  job_card_id: number;
  label: string;
  src: string;
  category?: string;
  mime_type?: string;
  byte_size?: number;
  original_name?: string;
  width?: number;
  height?: number;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Followup {
  id: number;
  job_card_id: number;
  note: string;
  due_at: string;
  done: number;
  outcome?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QcCheck {
  id: number;
  job_card_id: number;
  label: string;
  passed: number;
  fail_reason?: string;
  archived_at?: string;
}

export interface StatusHistory {
  id: number;
  job_card_id: number;
  main_status: MainStatus;
  sub_status: SubStatus;
  note: string;
  created_at: string;
}

export interface ChecklistCycle {
  id: number;
  job_card_id: number;
  stage: ChecklistStage;
  cycle_number: number;
  started_at: string;
  completed_at: string | null;
}

export interface ChecklistItem {
  id: number;
  checklist_cycle_id: number;
  job_card_id: number;
  stage: ChecklistStage;
  cycle_number: number;
  item_key: string;
  label: SubStatus;
  sort_order: number;
  checked_by: number | null;
  checked_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  required: 0 | 1;
  na_at: string | null;
  na_by: number | null;
}

export interface MaterialMovement {
  id: number;
  job_card_id: number;
  item_id: number;
  direction: string;
  qty: number;
  note: string;
  created_at: string;
}

export interface JobView {
  job: JobCard;
  visit: Visit;
  customer: Customer;
  vehicle: Vehicle;
  advisor: User;
  technician: User;
  estimate?: Estimate;
  estimate_items: EstimateItem[];
  task_list_items: JobTaskListItem[];
  material_requests: MaterialRequest[];
  local_purchases: LocalPurchase[];
  material_purchase_requests: MaterialPurchaseRequest[];
  material_approval?: MaterialApproval;
  material_approval_history?: MaterialApprovalEvent[];
  material_events?: MaterialEvent[];
  invoice_events?: InvoiceEvent[];
  inventory: InventoryItem[];
  tasks: Task[];
  invoice?: Invoice;
  invoice_items: InvoiceItem[];
  payments: Payment[];
  receipt?: Receipt;
  gate_pass?: GatePass;
  photos: Photo[];
  followups: Followup[];
  qc_checks: QcCheck[];
  status_history: StatusHistory[];
  checklist_cycles: ChecklistCycle[];
  checklist_items: ChecklistItem[];
  material_movements: MaterialMovement[];
  /** All records, including superseded/voided rows, for the read-only Data Flow audit trail. */
  estimate_history?: Estimate[];
  invoice_history?: Invoice[];
  payment_history?: Payment[];
  receipt_history?: Receipt[];
  gate_pass_history?: GatePass[];
  photo_history?: Photo[];
}

export interface WorkshopState {
  users: User[];
  customers: Customer[];
  vehicles: Vehicle[];
  visits: Visit[];
  bookings: Booking[];
  booking_call_logs: BookingCallLog[];
  booking_events: BookingEvent[];
  booking_capacity_limits: BookingCapacityLimit[];
  booking_capacity_overrides: BookingCapacityOverride[];
  jobs: JobView[];
  /** Historical records are deliberately separate so operational screens stay active-only. */
  archived_customers: Customer[];
  archived_vehicles: Vehicle[];
  archived_jobs: JobView[];
  inventory: InventoryItem[];
  service_catalog: ServiceCatalogItem[];
  attendance: AdvisorAttendance[];
  suppliers: Supplier[];
  inward_purchases: InwardPurchase[];
  inward_purchase_lines: InwardPurchaseLine[];
  inward_purchase_attachments: InwardPurchaseAttachment[];
  inward_purchase_revisions: InwardPurchaseRevision[];
  purchase_orders: PurchaseOrder[];
  purchase_order_lines: PurchaseOrderLine[];
  purchase_order_quotations: PurchaseOrderQuotation[];
  stock_inwards: StockInward[];
}

export interface AdvisorAttendance {
  user_id: number;
  date: string;
  present: number;
}
