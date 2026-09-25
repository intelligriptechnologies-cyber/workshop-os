export type Role = "admin" | "service" | "reception" | "accounts" | "store" | "tech";

export type MainStatus = "NEW" | "IN_PROGRESS" | "HOLD" | "COMPLETED" | "CLOSED" | "CANCELLED";

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
export type PaymentMode = "UPI" | "Cash" | "Card" | "Other";
export type ViewMode = "grid" | "table";

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
export type SearchCategory = "all" | "job" | "customer" | "vehicle" | "invoice";

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
  keys: string;
  accessories: string;
  requested_work: string;
  photos_note: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
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
  archived_at?: string;
  archived_reason?: string;
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
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: number;
  sku: string;
  category: string;
  name: string;
  unit: string;
  stock_qty: number;
  low_stock_qty: number;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
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
  status: "Open" | "Partial" | "Cleared";
  notes: string;
  document_available: number;
  document_generated_at?: string;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
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
  material_requests: MaterialRequest[];
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
  jobs: JobView[];
  inventory: InventoryItem[];
}
