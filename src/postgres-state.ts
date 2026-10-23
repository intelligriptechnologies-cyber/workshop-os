// Direct FastAPI projection adapter. Ordering, filters and joins mirror readState.
import schema from './postgres-projection-defaults.json';
import type {
  ChecklistCycle,
  ChecklistItem,
  ChecklistStage,
  Customer,
  Estimate,
  EstimateItem,
  ServiceCatalogItem,
  JobTaskListItem,
  Followup,
  GatePass,
  InventoryItem,
  InwardPurchase,
  InwardPurchaseAttachment,
  InwardPurchaseLine,
  InwardPurchaseRevision,
  PurchaseOrder,
  PurchaseOrderLine,
  PurchaseOrderQuotation,
  PurchaseOrderReceipt,
  PurchaseOrderReceiptLine,
  PurchaseOrderConfirmation,
  StockInward,
  Invoice,
  InvoiceItem,
  JobCard,
  JobView,
  LocalPurchase,
  MaterialPurchaseRequest,
  MainStatus,
  MaterialEvent,
  InvoiceEvent,
  MaterialMovement,
  MaterialRequest,
  MaterialApproval,
  MaterialApprovalEvent,
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
  Supplier,
  SupplierStatus,
  Task,
  TaskStatus,
  User,
  Vehicle,
  Visit,
  WorkshopState,
  AdvisorAttendance,
  Booking,
  BookingArrivalWindow,
  BookingServiceType,
  BookingCallLog,
  BookingEvent,
  BookingCapacityLimit,
  BookingCapacityOverride,
  BookingStatus,
  SalesLead,
  SalesQuotation,
  SalesQuotationLine,
  LeadStage,
  LeadTemperature,
  QuotationStatus,
  ServiceDepartment,
  ServiceCatalogMaster,
} from "./types";
type Projection=Record<string,Array<Record<string,unknown>>>;
const UNASSIGNED_ADVISOR: User = {
  id: 0,
  email: "",
  name: "Not mapped",
  role: "service",
  password: "",
};
export function readPostgresState(projection: Projection): WorkshopState {
  // Source-shaped rows only: defaults are a static contract, never a stored dataset.
  const data: Record<string, Record<string, any>[]> = {};
  for (const [table, defaults] of Object.entries(schema)) {
    if (table === 'approvals') continue;
    if (!Array.isArray(projection[table])) throw new Error('PostgreSQL projection missing '+table);
    data[table] = [...projection[table]].sort((a,b)=>Number(a.id??0)-Number(b.id??0)).map(row => Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, key in row ? (typeof row[key] === 'boolean' ? Number(row[key]) : row[key]) : fallback])));
  }
  const compare = (a:any,b:any) => a===b?0:a==null?-1:b==null?1:a<b?-1:1;
  const select = (table:string, predicate?: (r:Record<string,any>)=>boolean, order:string[]=[], columns?:string[]) => {
    const rows=[...(data[table] ?? (()=>{throw new Error('Unsupported PostgreSQL table '+table)})())].filter(predicate ?? (()=>true));
    rows.sort((a,b)=>{for(const key of order){const [field,direction]=key.split(' ');const fields=field.split('|');const value=(r:Record<string,any>)=>fields.map(f=>r[f]).find(v=>v!=null)??null;const cmp=compare(value(a),value(b));if(cmp)return direction==='desc'?-cmp:cmp;}return 0;});
    return columns?rows.map(r=>Object.fromEntries(columns.map(k=>[k,r[k]]))):rows;
  };
  const inventoryRows = () => select('inventory',r=>r.archived_at==null,['category','name']).map(r=>({...r,stock_qty:r.stock_qty-data.stock_ledger.filter(l=>l.item_id===r.id).reduce((sum,l)=>sum+l.qty,0)}));
  const catalogRows = () => select('service_catalog_items',r=>r.archived_at==null,['name','id']).map(r=>({...r,department_name:data.service_departments.find(d=>d.id===r.service_department_id)?.name??null,brand_name:data.service_brands.find(b=>b.id===r.brand_id)?.name??null,car_segment_name:data.car_segments.find(s=>s.id===r.car_segment_id)?.name??null}));

  const users = (select("users", r => r.archived_at == null, ["id"]) as unknown as User[]);
  const customers = (select("customers", r => r.archived_at == null, ["id"]) as unknown as Customer[]);
  const vehicles = (select("vehicles", r => r.archived_at == null, ["id"]) as unknown as Vehicle[]);
  const visits = (select("visits", r => r.archived_at == null, ["id desc"]) as unknown as Visit[]);
  const bookings = (select("bookings", undefined, ["booking_date","id desc"]) as unknown as Booking[]);
  const booking_call_logs = (select("booking_call_logs", undefined, ["called_at desc","id desc"]) as unknown as BookingCallLog[]);
  const booking_events = (select("booking_events", undefined, ["at desc","id desc"]) as unknown as BookingEvent[]);
  const booking_capacity_limits = (select("booking_capacity_limits", undefined, ["booking_date"]) as unknown as BookingCapacityLimit[]);
  const booking_capacity_overrides = (select("booking_capacity_overrides", undefined, ["approved_at desc","id desc"]) as unknown as BookingCapacityOverride[]);
  const inventory = (inventoryRows() as unknown as InventoryItem[]);
  const service_catalog = (catalogRows() as unknown as ServiceCatalogItem[]);
  // Keep archived suppliers in the read model so historical receipts never lose their supplier identity.
  const suppliers = (select("suppliers", undefined, ["name"]) as unknown as Supplier[]);
  const inward_purchases = (select("inward_purchases", undefined, ["submitted_at|created_at desc","id desc"]) as unknown as InwardPurchase[]);
  const inward_purchase_lines = (select("inward_purchase_lines", undefined, ["id"]) as unknown as InwardPurchaseLine[]);
  const inward_purchase_attachments = (select("inward_purchase_attachments", undefined, ["id"]) as unknown as InwardPurchaseAttachment[]);
  const inward_purchase_revisions = (select("inward_purchase_revisions", undefined, ["purchase_id","revision_no"]) as unknown as InwardPurchaseRevision[]);
  const purchase_orders = (select("purchase_orders", undefined, ["order_date desc","id desc"]) as unknown as PurchaseOrder[]);
  const purchase_order_lines = (select("purchase_order_lines", undefined, ["id"]) as unknown as PurchaseOrderLine[]);
  const purchase_order_quotations = (select("purchase_order_quotations", undefined, ["purchase_order_line_id","quote_date desc","id desc"]) as unknown as PurchaseOrderQuotation[]);
  const purchase_order_receipts = (select("purchase_order_receipts", undefined, ["received_at","id"]) as unknown as PurchaseOrderReceipt[]);
  const purchase_order_receipt_lines = (select("purchase_order_receipt_lines", undefined, ["id"]) as unknown as PurchaseOrderReceiptLine[]);
  const purchase_order_confirmations = (select("purchase_order_confirmations", undefined, ["purchase_order_line_id"]) as unknown as PurchaseOrderConfirmation[]);
  const stock_inwards = (select("stock_inwards", undefined, ["received_at desc","id desc"]) as unknown as StockInward[]);
  const jobRows = (select("job_cards", r => r.archived_at == null, ["id desc"]) as unknown as JobCard[]);
  const archivedJobRows = (select("job_cards", r => r.archived_at != null, ["id desc"]) as unknown as JobCard[]);
  const archived_customers = (select("customers", r => r.archived_at != null, ["id"]) as unknown as Customer[]);
  const archived_vehicles = (select("vehicles", r => r.archived_at != null, ["id"]) as unknown as Vehicle[]);
  const byId = <T extends { id: number }>(rows: T[]) =>
    new Map(rows.map((row) => [row.id, row]));
  const groupBy = <T>(rows: T[], key: (row: T) => number) => {
    const grouped = new Map<number, T[]>();
    rows.forEach((row) =>
      grouped.set(key(row), [...(grouped.get(key(row)) ?? []), row]),
    );
    return grouped;
  };
  const allUsers = byId((select("users", undefined, []) as unknown as User[]));
  const allCustomers = byId((select("customers", undefined, []) as unknown as Customer[]));
  const allVehicles = byId((select("vehicles", undefined, []) as unknown as Vehicle[]));
  const allVisits = byId((select("visits", undefined, []) as unknown as Visit[]));
  const allInventory = byId((select("inventory", undefined, []) as unknown as InventoryItem[]));
  const allEstimates = (select("estimates", undefined, ["id"]) as unknown as Estimate[]);
  const estimates = allEstimates.filter((row) => !row.archived_at);
  const estimatesByJob = groupBy(estimates, (row) => row.job_card_id);
  const estimateItemsByEstimate = groupBy(
    (select("estimate_items", r => r.archived_at == null, []) as unknown as EstimateItem[]),
    (row) => row.estimate_id,
  );
  const taskListByJob = groupBy(
    (select("job_task_list_items", r => r.archived_at == null, ["id"]) as unknown as JobTaskListItem[]),
    (row) => row.job_card_id,
  );
  const materialByJob = groupBy(
    (select("material_requests", r => r.archived_at == null, []) as unknown as MaterialRequest[]),
    (row) => row.job_card_id,
  );
  const approvalsByJob = byId(
    (select("material_approvals", undefined, ["id"]) as unknown as MaterialApproval[]),
  );
  const approvalEventsByJob = groupBy(
    (select("material_approval_events", undefined, ["id"]) as unknown as MaterialApprovalEvent[]),
    (row) => row.job_card_id,
  );
  const localPurchasesByJob = groupBy(
    (select("local_purchases", r => r.archived_at == null, ["id desc"]) as unknown as LocalPurchase[]),
    (row) => row.job_card_id,
  );
  const purchaseRequestsByJob = groupBy(
    (select("material_purchase_requests", undefined, ["id desc"]) as unknown as MaterialPurchaseRequest[]),
    (row) => row.job_card_id,
  );
  const tasksByJob = groupBy(
    (select("tasks", r => r.archived_at == null, []) as unknown as Task[]),
    (row) => row.job_card_id,
  );
  const allInvoices = (select("invoices", undefined, ["id"]) as unknown as Invoice[]);
  const invoicesByJob = groupBy(
    allInvoices.filter((row) => !row.voided_at),
    (row) => row.job_card_id,
  );
  const invoiceItemsByInvoice = groupBy(
    (select("invoice_items", r => r.archived_at == null, ["id"]) as unknown as InvoiceItem[]),
    (row) => row.invoice_id,
  );
  const allPayments = (select("payments", undefined, ["id"]) as unknown as Payment[]);
  const allReceipts = (select("receipts", undefined, ["id"]) as unknown as Receipt[]);
  const allPasses = (select("gate_passes", undefined, ["id"]) as unknown as GatePass[]);
  const allPhotos = (select("photos", undefined, ["id"]) as unknown as Photo[]);
  const paymentsByJob = groupBy(
    allPayments.filter((row) => !row.voided_at),
    (row) => row.job_card_id,
  );
  const receiptsByJob = groupBy(
    allReceipts.filter((row) => !row.voided_at),
    (row) => row.job_card_id,
  );
  const passesByJob = groupBy(
    allPasses.filter((row) => !row.voided_at),
    (row) => row.job_card_id,
  );
  const photosByJob = groupBy(
    allPhotos.filter((row) => !row.archived_at),
    (row) => row.job_card_id,
  );
  const estimateHistoryByJob = groupBy(allEstimates, (row) => row.job_card_id);
  const invoiceHistoryByJob = groupBy(allInvoices, (row) => row.job_card_id);
  const paymentHistoryByJob = groupBy(allPayments, (row) => row.job_card_id);
  const receiptHistoryByJob = groupBy(allReceipts, (row) => row.job_card_id);
  const passHistoryByJob = groupBy(allPasses, (row) => row.job_card_id);
  const photoHistoryByJob = groupBy(allPhotos, (row) => row.job_card_id);
  const followupsByJob = groupBy(
    (select("followups", r => r.archived_at == null, []) as unknown as Followup[]),
    (row) => row.job_card_id,
  );
  const qcByJob = groupBy(
    (select("qc_checks", r => r.archived_at == null, []) as unknown as QcCheck[]),
    (row) => row.job_card_id,
  );
  const historyByJob = groupBy(
    (select("status_history", undefined, ["id desc"]) as unknown as StatusHistory[]),
    (row) => row.job_card_id,
  );
  const cyclesByJob = groupBy(
    (select("checklist_cycles", undefined, ["cycle_number","id"]) as unknown as ChecklistCycle[]),
    (row) => row.job_card_id,
  );
  const checklistByJob = groupBy(
    (select("checklist_items", undefined, ["cycle_number","sort_order","id"]) as unknown as ChecklistItem[]),
    (row) => row.job_card_id,
  );
  const invoiceEventsByJob = groupBy(
    (select("invoice_events", undefined, ["id"]) as unknown as InvoiceEvent[]),
    (row) => row.job_card_id,
  );
  const materialEventsByJob = groupBy(
    (select("material_events", undefined, ["id"]) as unknown as MaterialEvent[]),
    (row) => row.job_card_id,
  );
  const movements = (select("material_movements", undefined, ["id desc"]) as unknown as MaterialMovement[]);
  const movementsByJob = groupBy(movements, (row) => row.job_card_id);
  const globalMovements = movementsByJob.get(0) ?? [];
  const jobViews = (rows: JobCard[]): JobView[] =>
    rows.map((job) => {
      const visit = allVisits.get(job.visit_id)!;
      const customer = allCustomers.get(visit.customer_id)!;
      const vehicle = allVehicles.get(visit.vehicle_id)!;
      const advisor = allUsers.get(job.advisor_id) ?? UNASSIGNED_ADVISOR;
      const technician = allUsers.get(job.technician_id)!;
      const jobEstimates = estimatesByJob.get(job.id) ?? [];
      const estimate = jobEstimates.at(-1);
      const estimate_items = estimate
        ? (estimateItemsByEstimate.get(estimate.id) ?? [])
        : [];
      const material_requests = materialByJob.get(job.id) ?? [];
      const jobMaterialEvents = materialEventsByJob.get(job.id) ?? [];
      const materialItemIds = new Set([
        ...material_requests.map((request) => request.item_id),
        ...jobMaterialEvents.flatMap((event) => [
          event.old_item_id,
          event.new_item_id,
        ]),
      ]);
      const materialInventory = [...materialItemIds]
        .map((id) => allInventory.get(id as number))
        .filter(Boolean) as InventoryItem[];
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
        task_list_items: taskListByJob.get(job.id) ?? [],
        material_requests,
        local_purchases: localPurchasesByJob.get(job.id) ?? [],
        material_purchase_requests: purchaseRequestsByJob.get(job.id) ?? [],
        material_approval: [...approvalsByJob.values()].find(
          (approval) => approval.job_card_id === job.id,
        ),
        material_approval_history: approvalEventsByJob.get(job.id) ?? [],
        material_events: jobMaterialEvents,
        invoice_events: invoiceEventsByJob.get(job.id) ?? [],
        inventory: materialInventory,
        tasks: tasksByJob.get(job.id) ?? [],
        invoice,
        invoice_items: invoice
          ? (invoiceItemsByInvoice.get(invoice.id) ?? [])
          : [],
        payments: paymentsByJob.get(job.id) ?? [],
        receipt: (receiptsByJob.get(job.id) ?? []).at(-1),
        gate_pass: (passesByJob.get(job.id) ?? []).at(-1),
        photos: photosByJob.get(job.id) ?? [],
        followups: followupsByJob.get(job.id) ?? [],
        qc_checks: qcByJob.get(job.id) ?? [],
        status_history: historyByJob.get(job.id) ?? [],
        checklist_cycles: cyclesByJob.get(job.id) ?? [],
        checklist_items: checklistByJob.get(job.id) ?? [],
        material_movements: [
          ...(movementsByJob.get(job.id) ?? []),
          ...globalMovements,
        ],
        estimate_history: estimateHistoryByJob.get(job.id) ?? [],
        invoice_history: invoiceHistoryByJob.get(job.id) ?? [],
        payment_history: paymentHistoryByJob.get(job.id) ?? [],
        receipt_history: receiptHistoryByJob.get(job.id) ?? [],
        gate_pass_history: passHistoryByJob.get(job.id) ?? [],
        photo_history: photoHistoryByJob.get(job.id) ?? [],
      };
    });
  const jobs = jobViews(jobRows);
  // Historical jobs intentionally resolve through the all-record maps above: their visit,
  // customer and vehicle may themselves have been archived.
  const archived_jobs = jobViews(archivedJobRows);
  const attendance = (select("advisor_attendance", undefined, ["date","user_id"], ["user_id","date","present"]) as unknown as AdvisorAttendance[]);
  const sales_leads = (select("sales_leads", undefined, ["created_at desc","id desc"]) as unknown as SalesLead[]);
  const salesLines = (select("sales_quotation_lines", undefined, ["quotation_id","line_no"]) as unknown as SalesQuotationLine[]);
  const sales_quotations = (select("sales_quotations", undefined, ["created_at desc","id desc"]) as unknown as Omit<SalesQuotation, "lines">[]).map((quotation) => ({ ...quotation, lines: salesLines.filter((line) => line.quotation_id === quotation.id) }));
  const service_departments = (select("service_departments", undefined, ["status","name"]) as unknown as Omit<ServiceDepartment, "manager_ids" | "advisor_team_ids" | "advisor_teams">[]).map((department) => {
    const advisor_teams = (select("service_advisor_teams", r => r.department_id === department.id, ["manager_id","advisor_id"], ["manager_id","advisor_id"]) as unknown as { manager_id: number; advisor_id: number }[]);
    return {
      ...department,
      manager_ids: (select("service_department_managers", r => r.department_id === department.id, ["manager_id"], ["manager_id"]) as unknown as { manager_id: number }[]).map((row) => row.manager_id),
      advisor_team_ids: advisor_teams.map((row) => row.advisor_id),
      advisor_teams,
    };
  });
  const service_brands = (select("service_brands", undefined, ["status","name"]) as unknown as ServiceCatalogMaster[]);
  const car_segments = (select("car_segments", undefined, ["status","name"]) as unknown as ServiceCatalogMaster[]);
  return {
    users,
    customers,
    vehicles,
    visits,
    bookings,
    booking_call_logs,
    booking_events,
    booking_capacity_limits,
    booking_capacity_overrides,
    jobs,
    archived_customers,
    archived_vehicles,
    archived_jobs,
    inventory,
    service_catalog,
    attendance,
    suppliers,
    inward_purchases,
    inward_purchase_lines,
    inward_purchase_attachments,
    inward_purchase_revisions,
    purchase_orders,
    purchase_order_lines,
    purchase_order_quotations,
    purchase_order_receipts,
    purchase_order_receipt_lines,
    purchase_order_confirmations,
    stock_inwards,
    sales_leads,
    sales_quotations,
    service_departments,
    service_brands,
    car_segments,
  };
}
