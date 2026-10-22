# Internal validators, persistence helpers and schema migration evidence


## checklistStageForSubStatus

src/db.ts:143

```ts
function checklistStageForSubStatus(subStatus: SubStatus): ChecklistStage {
  return (
    (
      Object.entries(LIFECYCLE_CHECKLIST) as [
        ChecklistStage,
        readonly SubStatus[],
      ][]
    ).find(([, labels]) => labels.includes(subStatus))?.[0] ?? "NEW"
  );
}
```

## isPreloadedServiceManager

src/db.ts:765

```ts
function isPreloadedServiceManager(user: Pick<User, "email">) {
  return user.email === "general.service.manager@example.com" || user.email === "ppf.paint.manager@example.com";
}
```

## validateLargeDemoDataset

src/db.ts:1085

```ts
function validateLargeDemoDataset(db: Database) {
  const expected: [string, number][] = [
    ["customers", 120],
    ["vehicles", 132],
    ["job_cards", 144],
    ["photos", 288],
  ];
  expected.forEach(([table, count]) => {
    if (scalar<number>(db, `select count(*) from ${table}`) !== count)
      throw new Error(`Large demo validation failed for ${table}.`);
  });
  const uniquenessChecks = [
    "select count(*)-count(distinct mobile) from customers",
    "select count(*)-count(distinct number) from vehicles",
    "select count(*)-count(distinct job_no) from job_cards",
    "select count(*)-count(distinct invoice_no) from invoices",
  ];
  if (uniquenessChecks.some((sql) => scalar<number>(db, sql) !== 0))
    throw new Error("Large demo identifiers are not unique.");
  const orphanCount = scalar<number>(
    db,
    `select
    (select count(*) from vehicles v left join customers c on c.id=v.customer_id where c.id is null) +
    (select count(*) from visits v left join customers c on c.id=v.customer_id left join vehicles x on x.id=v.vehicle_id where c.id is null or x.id is null) +
    (select count(*) from job_cards j left join visits v on v.id=j.visit_id where v.id is null) +
    (select count(*) from photos p left join job_cards j on j.id=p.job_card_id where j.id is null)`,
  );
  if (orphanCount !== 0)
    throw new Error("Large demo contains invalid relationships.");
  const incompleteClosures = scalar<number>(
    db,
    `select count(*) from job_cards j where j.main_status='CLOSED' and (
    j.closed_at='' or not exists(select 1 from invoices i where i.job_card_id=j.id and i.voided_at is null) or
    not exists(select 1 from payments p join invoices i on i.id=p.invoice_id where p.job_card_id=j.id and p.voided_at is null and i.job_card_id=j.id and i.voided_at is null) or
    not exists(select 1 from receipts r join invoices i on i.id=r.invoice_id where r.job_card_id=j.id and i.job_card_id=j.id and i.voided_at is null) or
    not exists(select 1 from gate_passes g join invoices i on i.id=g.invoice_id where g.job_card_id=j.id and i.job_card_id=j.id and i.voided_at is null) or
    trim(coalesce(j.delivery_by,''))='' or trim(coalesce(j.acknowledgement,''))='')`,
  );
  if (
    incompleteClosures !== 0 ||
    scalar<number>(db, "select count(distinct main_status) from job_cards") !==
      5 ||
    scalar<number>(db, "select count(distinct sub_status) from job_cards") !==
      16
  ) {
    throw new Error("Large demo lifecycle records are incomplete.");
  }
}
```

## validateUser

src/db.ts:1217

```ts
function validateUser(
  db: Database,
  payload: Pick<User, "email" | "name" | "role" | "password">,
  existingId = 0,
) {
  if (!payload.name.trim()) throw new Error("User name is required.");
  if (!/^\S+@\S+\.\S+$/.test(payload.email.trim()))
    throw new Error("Enter a valid user email.");
  if (!roles.includes(payload.role))
    throw new Error("Select a valid user role.");
  if (!payload.password || payload.password.length < 6)
    throw new Error("User password must contain at least 6 characters.");
  const duplicate = maybe<{ id: number }>(
    db,
    "select id from users where lower(email)=lower(?) and archived_at is null and id<>?",
    [payload.email.trim(), existingId],
  );
  if (duplicate) throw new Error("A user with this email already exists.");
}
```

## assertBookingCapacity

src/db.ts:1440

```ts
function assertBookingCapacity(
  db: Database,
  actorId: number,
  bookingDate: string,
  serviceType: BookingServiceType,
  overrideReason: string | undefined,
  excludingBookingId?: number,
) {
  const configured = all<BookingCapacityLimit>(db, "select * from booking_capacity_limits where booking_date=?", [bookingDate])[0];
  const capacity = serviceType === "Service Work"
    ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY
    : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;
  const count = scalar<number>(
    db,
    `select count(*) from bookings where booking_date=? and service_type=? and status in ('Booked','Confirmed','Rescheduled')${excludingBookingId ? " and id<>?" : ""}`,
    excludingBookingId ? [bookingDate, serviceType, excludingBookingId] : [bookingDate, serviceType],
  );
  if (count < capacity) return false;
  const actor = one<User>(db, "select * from users where id=?", [actorId]);
  if (actor.role !== "admin")
    throw new Error(`${serviceType} is fully booked (${capacity} advance bookings).`);
  if (!overrideReason?.trim())
    throw new Error("An Admin override reason is required for a full booking service type.");
  return true;
}
```

## recordBookingCapacityOverride

src/db.ts:1466

```ts
function recordBookingCapacityOverride(
  db: Database,
  bookingId: number,
  bookingDate: string,
  actorId: number,
  reason: string,
  timestamp: string,
) {
  insert(
    db,
    "insert into booking_capacity_overrides(booking_id,booking_date,reason,approved_by,approved_at) values(?,?,?,?,?)",
    [bookingId, bookingDate, reason.trim(), actorId, timestamp],
  );
}
```

## assertBookingInput

src/db.ts:1481

```ts
function assertBookingInput(input: BookingInput, earliestDate?: string) {
  if (
    ![
      input.customerName,
      input.mobile,
      input.vehicleNo,
      input.make,
      input.model,
      input.requestedWork,
    ].every((value) => value.trim())
  ) {
    throw new Error(
      "Customer, vehicle, and requested work are required for a booking.",
    );
  }
  const parsedDate = new Date(`${input.bookingDate}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.bookingDate) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== input.bookingDate
  ) {
    throw new Error("Enter a valid booking date.");
  }
  if (earliestDate && input.bookingDate < earliestDate)
    throw new Error("A booking date cannot be in the past.");
  if (!BOOKING_WINDOWS.includes(input.arrivalWindow ?? ""))
    throw new Error("Choose a valid arrival window.");
  if (!["Service Work", "General Checkup / Follow-up"].includes(input.serviceType))
    throw new Error("Choose a valid booking service type.");
}
```

## bookingEvent

src/db.ts:1512

```ts
function bookingEvent(
  db: Database,
  booking: Booking,
  kind: BookingStatus,
  actorId: number,
  timestamp: string,
  note = "",
  previousBookingDate?: string,
) {
  insert(
    db,
    "insert into booking_events(booking_id,kind,actor_id,at,note,previous_booking_date,booking_date) values(?,?,?,?,?,?,?)",
    [
      booking.id,
      kind,
      actorId,
      timestamp,
      note,
      previousBookingDate ?? null,
      booking.booking_date,
    ],
  );
}
```

## operationalBooking

src/db.ts:1536

```ts
function operationalBooking(db: Database, bookingId: number) {
  const booking = one<Booking>(db, "select * from bookings where id=?", [
    bookingId,
  ]);
  if (TERMINAL_BOOKING_STATUSES.includes(booking.status))
    throw new Error(`A ${booking.status} booking cannot be changed.`);
  return booking;
}
```

## assertAdminAccess

src/db.ts:2102

```ts
function assertAdminAccess(db: Database, actorId: number) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (actor.role !== "admin")
    throw new Error("Only Owner/Admin may manage the Service Task Catalog.");
}
```

## assertTaskListMutationAccess

src/db.ts:2112

```ts
function assertTaskListMutationAccess(
  db: Database,
  jobId: number,
  actorId: number,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  if (job.main_status !== "NEW" && job.main_status !== "IN_PROGRESS")
    throw new Error(
      "Task List can only be changed while a job is NEW or IN_PROGRESS.",
    );
}
```

## assertCatalogAssignments

src/db.ts:2192

```ts
function assertCatalogAssignments(db: Database, input: Pick<ServiceCatalogItem, "service_department_id" | "brand_id" | "car_segment_id">) {
  if (!input.service_department_id) throw new Error("Service department is required.");
  if (!scalar<number>(db, "select count(*) from service_departments where id=? and status='ACTIVE'", [input.service_department_id])) throw new Error("Choose an active service department.");
  if (input.brand_id != null && !scalar<number>(db, "select count(*) from service_brands where id=? and status='ACTIVE'", [input.brand_id])) throw new Error("Choose an active brand name.");
  if (input.car_segment_id != null && !scalar<number>(db, "select count(*) from car_segments where id=? and status='ACTIVE'", [input.car_segment_id])) throw new Error("Choose an active car segment.");
}
```

## normalizeAndValidateGst

src/db.ts:2403

```ts
function normalizeAndValidateGst(
  gst_type: GstType | null | undefined,
  gst_rate: number | null | undefined,
  fallbackRate: number,
) {
  if (
    gst_type !== undefined &&
    gst_type !== null &&
    !GST_TYPES.includes(gst_type)
  )
    throw new Error("GST type must be CGST+SGST, IGST, or No GST.");
  const normalized = normalizeGstLine(gst_type, gst_rate, fallbackRate);
  if (
    normalized.gst_type !== "No GST" &&
    !GST_RATES.includes(normalized.gst_rate as (typeof GST_RATES)[number])
  )
    throw new Error("GST rate must be 5%, 9%, 12%, 18%, or 28%.");
  return normalized;
}
```

## assertValidMainStatusTransition

src/db.ts:2494

```ts
function assertValidMainStatusTransition(from: MainStatus, to: MainStatus) {
  if (from === to) return;
  if (!MAIN_STATUS_TRANSITIONS[from].includes(to)) {
    throw new Error(`Cannot move a job card from ${from} to ${to}.`);
  }
}
```

## assertLocalPurchaseInput

src/db.ts:2961

```ts
function assertLocalPurchaseInput(db: Database, payload: LocalPurchaseInput) {
  if (!Number.isInteger(payload.job_card_id) || payload.job_card_id <= 0)
    throw new Error("A selected job is required.");
  one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [payload.job_card_id],
  );
  if (!payload.item_description.trim())
    throw new Error("A local purchase item description is required.");
  if (!payload.unit.trim())
    throw new Error("A local purchase unit is required.");
  if (!payload.vendor.trim()) throw new Error("A vendor or shop is required.");
  if (!payload.bill_reference.trim())
    throw new Error("A bill or reference is required.");
  if (!Number.isFinite(payload.quantity) || payload.quantity <= 0)
    throw new Error("Local purchase quantity must be greater than zero.");
  if (!Number.isFinite(payload.unit_cost) || payload.unit_cost < 0)
    throw new Error("Local purchase unit cost cannot be negative.");
}
```

## assertPurchaseActor

src/db.ts:3119

```ts
function assertPurchaseActor(db: Database, actorId: number, adminOnly = false) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (
    adminOnly
      ? actor.role !== "admin"
      : actor.role !== "admin" && actor.role !== "store"
  ) {
    throw new Error(
      adminOnly
        ? "Only Admin can manage suppliers or revise submitted purchases."
        : "Only Store or Admin can manage inward purchases.",
    );
  }
  return actor;
}
```

## assertSupplierInput

src/db.ts:3139

```ts
function assertSupplierInput(input: SupplierInput) {
  if (!input.name?.trim()) throw new Error("Supplier name is required.");
  if (input.status && !["Active", "On hold", "Archived"].includes(input.status))
    throw new Error("Invalid supplier status.");
}
```

## totalsForPurchaseLine

src/db.ts:3202

```ts
function totalsForPurchaseLine(line: InwardPurchaseLineInput) {
  const qty = Number(line.received_qty),
    unitCost = Number(line.unit_cost),
    discount = Number(line.discount ?? 0),
    gstRate = Number(line.gst_rate ?? 0);
  const subtotal = qty * unitCost - discount;
  return {
    qty,
    unitCost,
    discount,
    gstRate,
    subtotal,
    gstAmount: (subtotal * gstRate) / 100,
    total: subtotal * (1 + gstRate / 100),
  };
}
```

## assertPurchaseLine

src/db.ts:3219

```ts
function assertPurchaseLine(db: Database, line: InwardPurchaseLineInput) {
  one<InventoryItem>(
    db,
    "select * from inventory where id=? and archived_at is null",
    [line.item_id],
  );
  const total = totalsForPurchaseLine(line);
  if (!Number.isFinite(total.qty) || total.qty <= 0)
    throw new Error("Received quantity must be greater than zero.");
  if (!Number.isFinite(total.unitCost) || total.unitCost < 0)
    throw new Error("Unit cost before GST cannot be negative.");
  if (
    !Number.isFinite(total.discount) ||
    total.discount < 0 ||
    total.discount > total.qty * total.unitCost
  )
    throw new Error("Discount must be between zero and the line value.");
  if (
    !Number.isFinite(total.gstRate) ||
    total.gstRate < 0 ||
    total.gstRate > 100
  )
    throw new Error("GST must be between 0 and 100.");
  return total;
}
```

## assertAttachment

src/db.ts:3245

```ts
function assertAttachment(attachment: InwardPurchaseAttachmentInput) {
  if (!attachment.original_name?.trim() || !attachment.document_url)
    throw new Error("An invoice scan is required.");
  if (!["application/pdf", "image/jpeg"].includes(attachment.mime_type))
    throw new Error("Invoice scans must be PDF or JPG files.");
  if (
    !Number.isFinite(attachment.byte_size) ||
    attachment.byte_size <= 0 ||
    attachment.byte_size > 10 * 1024 * 1024
  )
    throw new Error("Invoice scans must be no more than 10 MB.");
}
```

## replacePurchaseLines

src/db.ts:3258

```ts
function replacePurchaseLines(
  db: Database,
  purchaseId: number,
  lines: readonly InwardPurchaseLineInput[],
) {
  db.run("delete from inward_purchase_lines where purchase_id=?", [purchaseId]);
  let subtotal = 0,
    discountTotal = 0,
    gstTotal = 0,
    total = 0;
  for (const line of lines) {
    const values = assertPurchaseLine(db, line);
    insert(
      db,
      "insert into inward_purchase_lines(purchase_id,item_id,received_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)",
      [
        purchaseId,
        line.item_id,
        values.qty,
        values.unitCost,
        values.discount,
        values.gstRate,
        values.subtotal,
        values.gstAmount,
        values.total,
      ],
    );
    subtotal += values.qty * values.unitCost;
    discountTotal += values.discount;
    gstTotal += values.gstAmount;
    total += values.total;
  }
  db.run(
    "update inward_purchases set subtotal=?,discount_total=?,gst_total=?,total=?,updated_at=datetime('now') where id=?",
    [subtotal, discountTotal, gstTotal, total, purchaseId],
  );
}
```

## addPurchaseAttachments

src/db.ts:3296

```ts
function addPurchaseAttachments(
  db: Database,
  purchaseId: number,
  actorId: number,
  attachments: readonly InwardPurchaseAttachmentInput[],
) {
  for (const attachment of attachments) {
    assertAttachment(attachment);
    insert(
      db,
      "insert into inward_purchase_attachments(purchase_id,original_name,mime_type,byte_size,storage_key,document_url,uploaded_by,uploaded_at) values(?,?,?,?,?,?,?,datetime('now'))",
      [
        purchaseId,
        attachment.original_name.trim(),
        attachment.mime_type,
        attachment.byte_size,
        `private/inward/${purchaseId}/${Date.now()}-${attachment.original_name.trim()}`,
        attachment.document_url,
        actorId,
      ],
    );
  }
}
```

## submitPurchaseValidation

src/db.ts:3380

```ts
function submitPurchaseValidation(db: Database, purchase: InwardPurchase) {
  if (!purchase.supplier_id)
    throw new Error("Supplier is required before submission.");
  const supplier = one<Supplier>(db, "select * from suppliers where id=?", [
    purchase.supplier_id,
  ]);
  if (supplier.status !== "Active")
    throw new Error("Select an active supplier before submission.");
  if (!purchase.supplier_invoice_no.trim())
    throw new Error("Supplier invoice number is required before submission.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(purchase.invoice_date))
    throw new Error("A valid invoice date is required before submission.");
  const duplicate = maybe<InwardPurchase>(
    db,
    "select * from inward_purchases where supplier_id=? and supplier_invoice_no=? and status in ('Submitted','Received') and id<>?",
    [purchase.supplier_id, purchase.supplier_invoice_no.trim(), purchase.id],
  );
  if (duplicate)
    throw new Error("This supplier invoice number has already been submitted.");
  const lines = all<InwardPurchaseLine>(
    db,
    "select * from inward_purchase_lines where purchase_id=?",
    [purchase.id],
  );
  if (!lines.length)
    throw new Error(
      "At least one inventory line is required before submission.",
    );
  lines.forEach((line) => assertPurchaseLine(db, line));
  const attachments = all<InwardPurchaseAttachment>(
    db,
    "select * from inward_purchase_attachments where purchase_id=?",
    [purchase.id],
  );
  if (!attachments.length)
    throw new Error(
      "At least one PDF or JPG invoice scan is required before submission.",
    );
  attachments.forEach((attachment) => assertAttachment(attachment));
  return lines;
}
```

## poSubmissionValidation

src/db.ts:3423

```ts
function poSubmissionValidation(db: Database, purchase: InwardPurchase) {
  if (!purchase.supplier_id)
    throw new Error("Supplier is required before sending for PO approval.");
  const supplier = one<Supplier>(db, "select * from suppliers where id=?", [
    purchase.supplier_id,
  ]);
  if (supplier.status !== "Active")
    throw new Error(
      "Select an active supplier before sending for PO approval.",
    );
  const lines = all<InwardPurchaseLine>(
    db,
    "select * from inward_purchase_lines where purchase_id=?",
    [purchase.id],
  );
  if (!lines.length)
    throw new Error(
      "At least one inventory line is required before sending for PO approval.",
    );
  lines.forEach((line) => assertPurchaseLine(db, line));
  return lines;
}
```

## nextPurchaseRequestNumber

src/db.ts:3937

```ts
function nextPurchaseRequestNumber(db: Database) {
  return nextPurchaseRequestNumberForOrders(
    all<Pick<PurchaseOrder, "po_number">>(
      db,
      "select po_number from purchase_orders where po_number like 'PO-WOS-%'",
    ),
  );
}
```

## assertPurchaseRequestInput

src/db.ts:3946

```ts
function assertPurchaseRequestInput(db: Database, input: PurchaseRequestInput) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.order_date))
    throw new Error("A valid order date is required.");
  if (!input.lines?.length)
    throw new Error("A Purchase Request needs at least one item line.");
  for (const line of input.lines) {
    if (!Number.isFinite(line.ordered_qty) || line.ordered_qty <= 0)
      throw new Error("Requested quantity must be greater than zero.");
    if ("item_id" in line) {
      if (!Number.isInteger(line.item_id) || line.item_id <= 0)
        throw new Error("An existing inventory SKU is required.");
      one<InventoryItem>(db, "select * from inventory where id=?", [line.item_id]);
    } else if (!line.item_name.trim() || !line.unit.trim()) {
      throw new Error("A new item request needs an item name.");
    }
  }
}
```

## replacePurchaseRequestLines

src/db.ts:3964

```ts
function replacePurchaseRequestLines(
  db: Database,
  purchaseOrderId: number,
  lines: readonly PurchaseRequestLineInput[],
) {
  db.run("delete from purchase_order_lines where purchase_order_id=?", [
    purchaseOrderId,
  ]);
  for (const line of lines) {
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,0,0,0,0,0,0)",
      [
        purchaseOrderId,
        "item_id" in line ? line.item_id : 0,
        "item_name" in line ? line.item_name.trim() : "",
        "unit" in line ? line.unit.trim() : "",
        line.ordered_qty,
      ],
    );
  }
  db.run(
    "update purchase_orders set subtotal=0,discount_total=0,gst_total=0,total=0,updated_at=datetime('now') where id=?",
    [purchaseOrderId],
  );
}
```

## assertMutablePurchaseRequestAccess

src/db.ts:3991

```ts
function assertMutablePurchaseRequestAccess(
  db: Database,
  id: number,
  actorId: number,
) {
  const actor = assertPurchaseActor(db, actorId);
  const order = one<PurchaseOrder>(
    db,
    "select * from purchase_orders where id=?",
    [id],
  );
  if (order.status !== "PO Request")
    throw new Error("Only unreviewed Purchase Requests can be changed.");
  if (actor.role !== "store" || order.created_by !== actor.id)
    throw new Error("Only the requesting Store user can change this Purchase Request.");
}
```

## assertPurchaseOrderLine

src/db.ts:4372

```ts
function assertPurchaseOrderLine(db: Database, line: PurchaseOrderLineInput) {
  return assertPurchaseLine(db, { ...line, received_qty: line.ordered_qty });
}
```

## replacePurchaseOrderLines

src/db.ts:4375

```ts
function replacePurchaseOrderLines(
  db: Database,
  purchaseOrderId: number,
  lines: readonly PurchaseOrderLineInput[],
) {
  if (!lines.length)
    throw new Error("A purchase order needs at least one item line.");
  db.run("delete from purchase_order_lines where purchase_order_id=?", [
    purchaseOrderId,
  ]);
  let subtotal = 0,
    discountTotal = 0,
    gstTotal = 0,
    total = 0;
  for (const line of lines) {
    const values = assertPurchaseOrderLine(db, line);
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)",
      [
        purchaseOrderId,
        line.item_id,
        values.qty,
        values.unitCost,
        values.discount,
        values.gstRate,
        values.subtotal,
        values.gstAmount,
        values.total,
      ],
    );
    subtotal += values.qty * values.unitCost;
    discountTotal += values.discount;
    gstTotal += values.gstAmount;
    total += values.total;
  }
  db.run(
    "update purchase_orders set subtotal=?,discount_total=?,gst_total=?,total=?,updated_at=datetime('now') where id=?",
    [subtotal, discountTotal, gstTotal, total, purchaseOrderId],
  );
}
```

## assertPurchaseOrderInput

src/db.ts:4416

```ts
function assertPurchaseOrderInput(db: Database, input: PurchaseOrderInput) {
  const supplier = one<Supplier>(db, "select * from suppliers where id=?", [
    input.supplier_id,
  ]);
  if (supplier.status !== "Active")
    throw new Error("Select an active supplier.");
  if (!input.po_number?.trim()) throw new Error("PO number is required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.order_date))
    throw new Error("A valid order date is required.");
  if (!input.lines?.length)
    throw new Error("A purchase order needs at least one item line.");
}
```

## reconcilePurchaseOrder

src/db.ts:4513

```ts
function reconcilePurchaseOrder(db: Database, purchaseOrderId: number) {
  const order = one<PurchaseOrder>(
    db,
    "select * from purchase_orders where id=?",
    [purchaseOrderId],
  );
  if (["Draft", "Cancelled", "Closed"].includes(order.status)) return;
  const lines = all<PurchaseOrderLine>(
    db,
    "select * from purchase_order_lines where purchase_order_id=?",
    [purchaseOrderId],
  );
  const fullyReceived = lines.every(
    (line) =>
      scalar<number>(
        db,
        "select coalesce(sum(qty),0) from stock_inwards where purchase_order_line_id=?",
        [line.id],
      ) >= line.ordered_qty,
  );
  const receivedAny = lines.some(
    (line) =>
      scalar<number>(
        db,
        "select coalesce(sum(qty),0) from stock_inwards where purchase_order_line_id=?",
        [line.id],
      ) > 0,
  );
  db.run(
    "update purchase_orders set status=?,updated_at=datetime('now') where id=?",
    [
      fullyReceived
        ? "Ready to Close"
        : receivedAny
          ? "Partially Received"
          : "Sent",
      purchaseOrderId,
    ],
  );
}
```

## materialApprovalForJob

src/db.ts:4875

```ts
function materialApprovalForJob(db: Database, jobId: number) {
  return maybe<MaterialApproval>(
    db,
    "select * from material_approvals where job_card_id=?",
    [jobId],
  );
}
```

## outstandingMaterialRows

src/db.ts:4890

```ts
function outstandingMaterialRows(db: Database, jobId: number) {
  return all<MaterialRequest>(
    db,
    "select * from material_requests where job_card_id=? and archived_at is null and invoiced_in is null and status in ('Requested','Re-requested')",
    [jobId],
  );
}
```

## approvalEvent

src/db.ts:4898

```ts
function approvalEvent(
  db: Database,
  approval: MaterialApproval,
  action: MaterialApprovalEvent["action"],
  actorId: number,
  note: string,
) {
  insert(
    db,
    "insert into material_approval_events(approval_id,job_card_id,action,actor_id,at,note,revision) values(?,?,?,?,?,?,?)",
    [
      approval.id,
      approval.job_card_id,
      action,
      actorId,
      new Date().toISOString(),
      note,
      approval.revision,
    ],
  );
}
```

## assertMaterialManager

src/db.ts:5096

```ts
function assertMaterialManager(db: Database, jobId: number, actorId: number) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  const approval = materialApprovalForJob(db, jobId);
  const rejectedAdvisorCorrection =
    approval?.status === "Rejected" &&
    job.main_status === "HOLD" &&
    actor.role === "service" &&
    actor.id === job.advisor_id;
  if (approval?.status === "Pending")
    throw new Error("Material activity is frozen while approval is pending.");
  if (!canManageMaterialRows(actor, job) && !rejectedAdvisorCorrection) {
    throw new Error(
      job.main_status === "IN_PROGRESS"
        ? "Only the Owner or the linked Service Advisor can change material rows."
        : "Material rows can only change while the job card is IN_PROGRESS.",
    );
  }
}
```

## materialRowFor

src/db.ts:5124

```ts
function materialRowFor(
  db: Database,
  rowId: number,
  actorId: number,
  action: MaterialRowAction,
) {
  const row = one<MaterialRequest>(
    db,
    "select * from material_requests where id=? and archived_at is null",
    [rowId],
  );
  assertMaterialManager(db, row.job_card_id, actorId);
  if (!materialRowActions(row).includes(action))
    throw new Error(
      `A ${materialRowStatus(row)} material row cannot be ${MATERIAL_ACTION_VERB[action]}.`,
    );
  return row;
}
```

## assertMaterialInput

src/db.ts:5143

```ts
function assertMaterialInput(db: Database, itemId: number, qty: number) {
  if (!(qty > 0))
    throw new Error("Material quantity must be greater than zero.");
  one<InventoryItem>(
    db,
    "select * from inventory where id=? and archived_at is null",
    [itemId],
  );
}
```

## untickMaterialsIssued

src/db.ts:5202

```ts
function untickMaterialsIssued(db: Database, jobId: number) {
  const item = maybe<ChecklistItem>(
    db,
    "select ci.* from checklist_items ci where ci.job_card_id=? and ci.label='Material Issued' and ci.checked_at is not null and ci.na_at is null and ci.checklist_cycle_id=(select id from checklist_cycles where job_card_id=? order by id desc limit 1)",
    [jobId, jobId],
  );
  if (!item) return;
  db.run(
    "update checklist_items set checked_by=null, checked_at=null, completed_at=null where id=?",
    [item.id],
  );
  db.run("update checklist_cycles set completed_at=null where id=?", [
    item.checklist_cycle_id,
  ]);
  syncSubStatusFromChecklist(db, jobId);
}
```

## afterMaterialRequest

src/db.ts:5219

```ts
function afterMaterialRequest(
  db: Database,
  row: MaterialRequest,
  actorId: number,
) {
  const onHand = materialStockOnHand(db, row.item_id);
  untickMaterialsIssued(db, row.job_card_id);
  reconcileArtifactChecklist(db, row.job_card_id, actorId);
  return { onHand, warning: overStockWarning(row.requested_qty, onHand) };
}
```

## ledger

src/db.ts:5267

```ts
function ledger(
  db: Database,
  jobId: number,
  rowId: number,
  itemId: number,
  qty: number,
  type: "issue" | "adjustment",
  actorId: number,
  note: string,
) {
  db.run(
    "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(?,?,?,?,?,?,?,?)",
    [jobId, rowId, itemId, qty, type, actorId, new Date().toISOString(), note],
  );
}
```

## actorAndJob

src/db.ts:5283

```ts
function actorAndJob(db: Database, rowId: number, actorId: number) {
  const row = one<MaterialRequest>(
    db,
    "select * from material_requests where id=? and archived_at is null",
    [rowId],
  );
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [row.job_card_id],
  );
  return { row, actor, job };
}
```

## assertBillingMutationAccess

src/db.ts:5681

```ts
function assertBillingMutationAccess(db: Database, actorId: number) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (!canMutateBilling(actor))
    throw new Error(
      "Only Owner/Admin and Accounts may change billing or delivery records.",
    );
}
```

## assertAdminBillingAccess

src/db.ts:5693

```ts
function assertAdminBillingAccess(db: Database, actorId: number) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (actor.role !== "admin")
    throw new Error(
      "Only Owner/Admin may void or manually edit delivery records.",
    );
}
```

## assertInvoiceFinancialsEditable

src/db.ts:5705

```ts
function assertInvoiceFinancialsEditable(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  if (invoice.status !== "Pending")
    throw new Error("Only a Pending invoice can be edited.");
  if (
    scalar<number>(
      db,
      "select count(*) from payments where invoice_id=? and voided_at is null",
      [invoiceId],
    ) > 0
  ) {
    throw new Error(
      "Invoice financial fields are locked after the first active payment.",
    );
  }
}
```

## validateInvoiceItem

src/db.ts:5726

```ts
function validateInvoiceItem(input: InvoiceItemInput) {
  if (!input.description.trim())
    throw new Error("Invoice item description is required.");
  if (!Number.isFinite(input.qty) || input.qty <= 0)
    throw new Error("Invoice item quantity must be greater than zero.");
  if (!Number.isFinite(input.rate) || input.rate < 0)
    throw new Error("Invoice item rate cannot be negative.");
  normalizeAndValidateGst(
    input.gst_type,
    input.gst_rate,
    DEFAULT_GST_BY_KIND[input.kind],
  );
}
```

## activeInvoiceItems

src/db.ts:5740

```ts
function activeInvoiceItems(db: Database, invoiceId: number) {
  return all<InvoiceItem>(
    db,
    "select * from invoice_items where invoice_id=? and archived_at is null order by id",
    [invoiceId],
  );
}
```

## recalculateInvoice

src/db.ts:5748

```ts
function recalculateInvoice(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  const totals = invoiceTotals(
    activeInvoiceItems(db, invoiceId).map((item) => ({
      qty: item.qty,
      rate: item.rate,
      ...normalizeGstLine(item.gst_type, item.gst_rate, invoice.gst_rate),
    })),
    invoice.discount,
  );
  db.run(
    "update invoices set subtotal=?,gst_amount=?,total=?,updated_at=datetime('now') where id=?",
    [totals.subtotal, totals.gst, totals.total, invoiceId],
  );
}
```

## invoiceEvent

src/db.ts:5768

```ts
function invoiceEvent(
  db: Database,
  invoice: Pick<Invoice, "id" | "job_card_id">,
  kind: "create" | "edit" | "void",
  actorId: number,
  note: string,
  oldTotal: number | null,
  newTotal: number | null,
  detail: string,
) {
  db.run(
    "insert into invoice_events(job_card_id,invoice_id,kind,by_user,at,note,old_total,new_total,detail) values(?,?,?,?,?,?,?,?,?)",
    [
      invoice.job_card_id,
      invoice.id,
      kind,
      actorId,
      new Date().toISOString(),
      note,
      oldTotal,
      newTotal,
      detail,
    ],
  );
}
```

## pickUpMaterialRow

src/db.ts:5795

```ts
function pickUpMaterialRow(
  db: Database,
  jobId: number,
  rowId: number,
  invoiceId: number,
) {
  const row = maybe<MaterialRequest>(
    db,
    "select * from material_requests where id=? and job_card_id=? and archived_at is null",
    [rowId, jobId],
  );
  if (!row) throw new Error("Material row does not belong to this job card.");
  if (materialRowStatus(row) !== "Issued")
    throw new Error("Only Issued material rows can be invoiced.");
  if (row.invoiced_in && row.invoiced_in !== invoiceId)
    throw new Error("This material row is already on another invoice.");
  db.run(
    "update material_requests set invoiced_in=?,updated_at=datetime('now') where id=?",
    [invoiceId, rowId],
  );
}
```

## changeSummary

src/db.ts:6127

```ts
function changeSummary(
  old: InvoiceItem[],
  next: Array<InvoiceItemInput & { id?: number }>,
  oldDiscount: number,
  newDiscount: number,
  fallbackGst: number,
) {
  const parts: string[] = [];
  const oldById = new Map(old.map((item) => [item.id, item]));
  for (const item of next) {
    const saved = item.id ? oldById.get(item.id) : undefined;
    if (!saved)
      parts.push(
        `added ${item.description.trim()} x ${item.qty}${item.material_row_id ? " (late material)" : ""}`,
      );
    else if (
      saved.qty !== item.qty ||
      saved.rate !== item.rate ||
      (item.gst_rate ?? saved.gst_rate ?? fallbackGst) !==
        (saved.gst_rate ?? fallbackGst) ||
      (item.gst_type ?? "CGST+SGST") !== (saved.gst_type ?? "CGST+SGST") ||
      saved.description !== item.description.trim() ||
      saved.kind !== item.kind
    )
      parts.push(
        `changed ${saved.description}: ${saved.qty} x ${saved.rate} @${saved.gst_type ?? "CGST+SGST"} ${saved.gst_rate ?? fallbackGst}% -> ${item.qty} x ${item.rate} @${item.gst_type ?? saved.gst_type ?? "CGST+SGST"} ${item.gst_rate ?? saved.gst_rate ?? fallbackGst}%`,
      );
  }
  const kept = new Set(next.flatMap((item) => (item.id ? [item.id] : [])));
  for (const item of old)
    if (!kept.has(item.id)) parts.push(`removed ${item.description}`);
  if (oldDiscount !== newDiscount)
    parts.push(`discount ${oldDiscount} -> ${newDiscount}`);
  return parts.join("; ");
}
```

## validatePaymentInput

src/db.ts:6318

```ts
function validatePaymentInput(input: PaymentInput) {
  if (!PAYMENT_MODES.includes(input.mode))
    throw new Error(
      "Payment mode must be UPI, Cash, Card, Bank transfer, or Other.",
    );
  if (input.mode === "Other" && !input.otherDetail.trim())
    throw new Error("Other payment detail is required.");
}
```

## activePaidAmount

src/db.ts:6327

```ts
function activePaidAmount(
  db: Database,
  invoiceId: number,
  excludingPaymentId = 0,
) {
  return scalar<number>(
    db,
    "select coalesce(sum(amount),0) from payments where invoice_id=? and voided_at is null and id<>?",
    [invoiceId, excludingPaymentId],
  );
}
```

## syncInvoicePaymentStatus

src/db.ts:6339

```ts
function syncInvoicePaymentStatus(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  const paid = activePaidAmount(db, invoiceId);
  const status =
    paid <= 0
      ? "Pending"
      : paid + 0.001 < invoice.total
        ? "Partial"
        : "Cleared";
  db.run("update invoices set status=?,updated_at=datetime('now') where id=?", [
    status,
    invoiceId,
  ]);
  reconcileArtifactChecklist(db, invoice.job_card_id);
}
```

## nextDocumentNumber

src/db.ts:6360

```ts
function nextDocumentNumber(
  db: Database,
  table: string,
  column: string,
  prefix: string,
  preferred: number,
  width: number,
) {
  const format = (n: number) => `${prefix}${String(n).padStart(width, "0")}`;
  if (
    scalar<number>(db, `select count(*) from ${table} where ${column}=?`, [
      format(preferred),
    ]) === 0
  )
    return format(preferred);
  const highest = all<{ v: string }>(
    db,
    `select ${column} as v from ${table} where ${column} like ?`,
    [`${prefix}%`],
  ).reduce(
    (max, row) =>
      Math.max(max, Number(String(row.v).slice(prefix.length)) || 0),
    preferred,
  );
  return format(highest + 1);
}
```

## ensureGatePassOnClose

src/db.ts:6587

```ts
function ensureGatePassOnClose(db: Database, jobId: number) {
  const invoice = maybe<Invoice>(
    db,
    "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1",
    [jobId],
  );
  if (
    !invoice ||
    maybe<GatePass>(
      db,
      "select * from gate_passes where invoice_id=? and voided_at is null",
      [invoice.id],
    )
  )
    return;
  insert(
    db,
    "insert into gate_passes(job_card_id,invoice_id,gate_pass_no,created_at) values (?,?,?,datetime('now'))",
    [
      jobId,
      invoice.id,
      nextDocumentNumber(
        db,
        "gate_passes",
        "gate_pass_no",
        "GP-",
        3100 + invoice.id,
        5,
      ),
    ],
  );
}
```

## assertJobMediaMutationAccess

src/db.ts:6836

```ts
function assertJobMediaMutationAccess(
  db: Database,
  jobId: number,
  actorId: number,
  category: JobMediaCategory,
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  if (!canMutateJobLifecycle(actor, job))
    throw new Error(
      "Only the Owner or the linked Service Advisor can change job media.",
    );
  const allowed =
    category === "Before Work"
      ? job.main_status === "NEW"
      : job.main_status === "IN_PROGRESS" || job.main_status === "COMPLETED";
  if (!allowed) {
    const phase =
      category === "Before Work"
        ? "Before photos can only be changed while the job is NEW."
        : "After photos can only be changed while the job is IN_PROGRESS or COMPLETED.";
    throw new Error(phase);
  }
}
```

## validatePhotoMetadata

src/db.ts:6869

```ts
function validatePhotoMetadata(label: string, category: string) {
  const cleanLabel = label.trim();
  if (!cleanLabel) throw new Error("Photo label is required.");
  if (category !== "Before Work" && category !== "After Work")
    throw new Error("Choose Before Work or After Work.");
  return { label: cleanLabel, category: category as JobMediaCategory };
}
```

## validateCustomer

src/db.ts:7032

```ts
function validateCustomer(
  db: Database,
  payload: Pick<Customer, "name" | "mobile" | "type">,
  existingId = 0,
) {
  if (!payload.name.trim()) throw new Error("Customer name is required.");
  if (!payload.mobile.trim()) throw new Error("Customer mobile is required.");
  if (!payload.type.trim()) throw new Error("Customer type is required.");
  if (
    maybe<{ id: number }>(
      db,
      "select id from customers where mobile=? and archived_at is null and id<>?",
      [payload.mobile.trim(), existingId],
    )
  ) {
    throw new Error("A customer with this mobile already exists.");
  }
}
```

## validateVehicle

src/db.ts:7051

```ts
function validateVehicle(
  db: Database,
  payload: Omit<Vehicle, "id">,
  existingId = 0,
) {
  if (!payload.customer_id) throw new Error("Vehicle customer is required.");
  if (!payload.number.trim()) throw new Error("Vehicle number is required.");
  if (!payload.make.trim() || !payload.model.trim())
    throw new Error("Vehicle make and model are required.");
  if (
    maybe<{ id: number }>(
      db,
      "select id from vehicles where upper(number)=upper(?) and archived_at is null and id<>?",
      [payload.number.trim(), existingId],
    )
  ) {
    throw new Error("A vehicle with this number already exists.");
  }
}
```

## backfillGoogleReviewReminder

src/db.ts:7523

```ts
function backfillGoogleReviewReminder(db: Database) {
  const reminder = "Remind Customer for Sharing Google Review/Feedback";
  const cycles = all<{ id: number; job_card_id: number; cycle_number: number }>(
    db,
    `select c.id,c.job_card_id,c.cycle_number
       from checklist_cycles c join job_cards j on j.id=c.job_card_id
      where c.stage='COMPLETED' and j.main_status='COMPLETED'
        and not exists(select 1 from checklist_items i where i.checklist_cycle_id=c.id and i.label=?)`,
    [reminder],
  );
  for (const cycle of cycles) {
    const payment = maybe<ChecklistItem>(
      db,
      "select * from checklist_items where checklist_cycle_id=? and label='Payment Received'",
      [cycle.id],
    );
    if (!payment) continue;
    db.run(
      "update checklist_items set sort_order=sort_order+1 where checklist_cycle_id=? and sort_order>=?",
      [cycle.id, payment.sort_order],
    );
    db.run(
      "update checklist_items set item_key=? where id=?",
      [`completed.${payment.sort_order + 1}`, payment.id],
    );
    insert(
      db,
      "insert into checklist_items(checklist_cycle_id,job_card_id,stage,cycle_number,item_key,label,sort_order,checked_by,checked_at,started_at,completed_at,required) values(?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        cycle.id,
        cycle.job_card_id,
        "COMPLETED",
        cycle.cycle_number,
        `completed.${payment.sort_order}`,
        reminder,
        payment.sort_order,
        null,
        null,
        payment.checked_at ? payment.checked_at : null,
        null,
        1,
      ],
    );
    db.run("update checklist_cycles set completed_at=null where id=?", [cycle.id]);
    syncSubStatusFromChecklist(db, cycle.job_card_id);
  }
}
```

## createLifecycleCycle

src/db.ts:7600

```ts
function createLifecycleCycle(
  db: Database,
  jobId: number,
  stage: ChecklistStage,
  timestamp: string,
  through?: SubStatus,
  completeThrough = false,
) {
  const cycleNumber =
    (scalar<number>(
      db,
      "select coalesce(max(cycle_number), 0) from checklist_cycles where job_card_id=? and stage=?",
      [jobId, stage],
    ) ?? 0) + 1;
  const labels = LIFECYCLE_CHECKLIST[stage];
  const throughIndex =
    through && labels.includes(through) ? labels.indexOf(through) : -1;
  const cycleId = insert(
    db,
    "insert into checklist_cycles(job_card_id,stage,cycle_number,started_at,completed_at) values(?,?,?,?,?)",
    [jobId, stage, cycleNumber, timestamp, completeThrough ? timestamp : null],
  );
  labels.forEach((label, index) => {
    const checked =
      index < throughIndex || (completeThrough && index === throughIndex);
    const started = index === 0 || index <= throughIndex;
    insert(
      db,
      "insert into checklist_items(checklist_cycle_id,job_card_id,stage,cycle_number,item_key,label,sort_order,checked_by,checked_at,started_at,completed_at,required) values(?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        cycleId,
        jobId,
        stage,
        cycleNumber,
        `${stage.toLowerCase()}.${index + 1}`,
        label,
        index + 1,
        null,
        checked ? timestamp : null,
        started ? timestamp : null,
        checked ? timestamp : null,
        OPTIONAL_CHECKLIST_ITEMS.includes(label) ? 0 : 1,
      ],
    );
  });
  return cycleId;
}
```

## writeChecklistItemState

src/db.ts:7777

```ts
function writeChecklistItemState(
  db: Database,
  item: ChecklistItem,
  actorId: number,
  resolved: boolean,
  notApplicable: boolean,
  timestamp: string,
) {
  db.run(
    "update checklist_items set checked_by=?, checked_at=?, started_at=coalesce(started_at, ?), completed_at=?, na_at=?, na_by=? where id=?",
    [
      resolved && !notApplicable ? actorId : null,
      resolved ? timestamp : null,
      timestamp,
      resolved ? timestamp : null,
      notApplicable ? timestamp : null,
      notApplicable ? actorId : null,
      item.id,
    ],
  );
  const remaining = scalar<number>(
    db,
    "select count(*) from checklist_items where checklist_cycle_id=? and required=1 and checked_at is null",
    [item.checklist_cycle_id],
  );
  db.run("update checklist_cycles set completed_at=? where id=?", [
    remaining === 0 ? timestamp : null,
    item.checklist_cycle_id,
  ]);
  if (resolved)
    db.run(
      "update checklist_items set started_at=coalesce(started_at, ?) where checklist_cycle_id=? and sort_order=?",
      [timestamp, item.checklist_cycle_id, item.sort_order + 1],
    );
  syncSubStatusFromChecklist(db, item.job_card_id);
}
```

## assertChecklistItemEditable

src/db.ts:7814

```ts
function assertChecklistItemEditable(
  db: Database,
  item: ChecklistItem,
  resolving: boolean,
) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [
    item.job_card_id,
  ]);
  const latest = maybe<{ id: number }>(
    db,
    "select id from checklist_cycles where job_card_id=? order by id desc limit 1",
    [item.job_card_id],
  );
  if (
    job.main_status !== item.stage ||
    latest?.id !== item.checklist_cycle_id
  ) {
    throw new Error(
      `The ${item.stage} checklist is read-only while the job card is ${job.main_status}.`,
    );
  }
  const gate = DOCUMENT_GATED_ITEMS[item.label];
  if (
    resolving &&
    gate &&
    scalar<number>(
      db,
      `select count(*) from ${gate.table} where job_card_id=? and ${gate.live}`,
      [item.job_card_id],
    ) === 0
  ) {
    throw new Error(`Save the ${gate.noun} before completing "${item.label}".`);
  }
}
```

## setPaymentReceivedForActor

src/db.ts:7850

```ts
function setPaymentReceivedForActor(
  db: Database,
  item: ChecklistItem,
  actorId: number,
  checked: boolean,
  timestamp: string,
  payment?: PaymentInput,
) {
  assertBillingMutationAccess(db, actorId);
  assertChecklistItemEditable(db, item, checked);
  const invoice = maybe<Invoice>(
    db,
    "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1",
    [item.job_card_id],
  );
  const paid = invoice ? activePaidAmount(db, invoice.id) > 0 : false;
  if (!checked) {
    if (paid)
      throw new Error(
        "Void the payment (with a reason) to untick Payment Received.",
      );
    return setChecklistItemChecked(db, item.id, actorId, false, timestamp);
  }
  if (!invoice) throw new Error("Create an Invoice before recording payment.");
  db.run("savepoint tick_payment_received");
  try {
    if (!paid)
      recordPayment(
        db,
        invoice.id,
        payment ?? {
          mode: "Cash",
          otherDetail: "",
          reference: "",
          notes: "Recorded by ticking Payment Received",
        },
        actorId,
      );
    const current = one<ChecklistItem>(
      db,
      "select * from checklist_items where id=?",
      [item.id],
    );
    if (!current.checked_at)
      setChecklistItemChecked(db, item.id, actorId, true, timestamp);
    db.run("release savepoint tick_payment_received");
  } catch (error) {
    db.run("rollback to savepoint tick_payment_received");
    db.run("release savepoint tick_payment_received");
    throw error;
  }
}
```

## ensureColumn

src/db.ts:7951

```ts
function ensureColumn(
  db: Database,
  table: string,
  column: string,
  definition: string,
) {
  const exists = all<{ name: string }>(db, `pragma table_info(${table})`).some(
    (item) => item.name === column,
  );
  if (!exists)
    db.run(`alter table ${table} add column ${column} ${definition}`);
}
```

## seed

src/db.ts:7964

```ts
function seed(db: Database) {
  [
    ["admin@example.com", "Owner/Admin", "admin"],
    ["service@example.com", "Service Advisor", "service"],
    ["reception@example.com", "Reception Desk", "reception"],
    ["accounts@example.com", "Accounts Desk", "accounts"],
    ["store@example.com", "Store Counter", "store"],
    ["tech@example.com", "Technician Bay", "tech"],
  ].forEach(([email, name, role]) =>
    db.run(
      "insert into users(email, name, role, password, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))",
      [email, name, role, "admin123"],
    ),
  );

  db.run(
    "insert into customers(name, mobile, type, created_at, updated_at) values ('Rahul Sharma','9876543210','Individual',datetime('now'),datetime('now')),('Datya Motors','9777711022','Dealer',datetime('now'),datetime('now')),('Anita Patra','9123488990','Individual',datetime('now'),datetime('now'))",
  );
  db.run(
    "insert into vehicles(customer_id, number, make, model, color, km, created_at, updated_at) values (1,'OD02AB1234','Hyundai','Creta','White',18420,datetime('now'),datetime('now')),(2,'OD02CD5678','Mahindra','Thar','Black',9200,datetime('now'),datetime('now')),(3,'OD05EF9001','BMW','X1','Blue',31100,datetime('now'),datetime('now'))",
  );
  WORKBOOK_INVENTORY_SEED.forEach((row) =>
    db.run(
      "insert into inventory(sku, category, name, unit, stock_qty, low_stock_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
      [...row],
    ),
  );
  seedProcurementHistoryDemo(db);

  makeSeedJob(
    db,
    1,
    1,
    "JC-2026-001245",
    "IN_PROGRESS",
    "Work Started",
    "Full body PPF, paint correction, interior detailing",
    94400,
    30000,
  );
  makeSeedJob(
    db,
    2,
    2,
    "JC-2026-001246",
    "IN_PROGRESS",
    "Material Requested",
    "Bonnet PPF, ceramic coating",
    42480,
    0,
  );
  makeSeedJob(
    db,
    3,
    3,
    "JC-2026-001247",
    "COMPLETED",
    "Invoice Ready",
    "Paint correction",
    12000,
    0,
  );
}
```

## seedProcurementHistoryDemo

src/db.ts:8029

```ts
function seedProcurementHistoryDemo(db: Database) {
  const supplierIds = [
    ["Apex Protection Films", "Karan Mehta"],
    ["Detail Supply Co.", "Riya Shah"],
    ["Prime Auto Materials", "Arjun Nair"],
  ].map(([name, contact]) =>
    insert(
      db,
      "insert into suppliers(name,contact_name,phone,email,gstin,status,created_by,created_at,updated_at) values(?,?,?,?,?,'Active',1,datetime('now'),datetime('now'))",
      [name, contact, "9000000000", `${name.toLowerCase().replaceAll(/[^a-z]+/g, ".")}@example.test`, ""],
    ),
  );
  const items = new Map(
    all<Pick<InventoryItem, "id" | "sku" | "name" | "unit">>(
      db,
      "select id,sku,name,unit from inventory where sku in ('PPF-001','PPF-002','PPF-003')",
    ).map((item) => [item.sku, item]),
  );
  const item = (sku: string) => {
    const found = items.get(sku);
    if (!found) throw new Error(`Missing seeded inventory item: ${sku}`);
    return found;
  };
  const addClosedOrder = (
    poNumber: string,
    supplierId: number,
    orderDate: string,
    sku: string,
    quantity: number,
    unitCost: number,
  ) => {
    const inventory = item(sku);
    const subtotal = quantity * unitCost;
    const orderId = insert(
      db,
      "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at) values(?,?,?,?, 'Closed',?,0,0,?,1,datetime('now'),datetime('now'))",
      [supplierId, poNumber, orderDate, "Seeded completed purchase for price comparison.", subtotal, subtotal],
    );
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,0,0,?,0,?)",
      [orderId, inventory.id, inventory.name, inventory.unit, quantity, unitCost, subtotal, subtotal],
    );
  };

  addClosedOrder("DEMO-HIST-001", supplierIds[0], "2026-04-12", "PPF-001", 4, 15800);
  addClosedOrder("DEMO-HIST-002", supplierIds[1], "2026-06-24", "PPF-001", 6, 15150);
  addClosedOrder("DEMO-HIST-003", supplierIds[2], "2026-09-08", "PPF-001", 3, 16200);
  addClosedOrder("DEMO-HIST-004", supplierIds[1], "2026-05-17", "PPF-002", 5, 14400);
  addClosedOrder("DEMO-HIST-005", supplierIds[0], "2026-08-29", "PPF-002", 2, 14750);

  const requestId = insert(
    db,
    "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at) values(0,'DEMO-PR-0001','2026-10-01','Demo request: compare recent supplier prices before approval.','PO Request',0,0,0,0,5,datetime('now'),datetime('now'))",
    [],
  );
  const requestLines: Array<[string, number]> = [
    ["PPF-001", 2],
    ["PPF-002", 3],
    ["PPF-003", 1],
  ];
  requestLines.forEach(([sku, quantity]) => {
    const inventory = item(sku);
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,0,0,0,0,0,0)",
      [requestId, inventory.id, inventory.name, inventory.unit, quantity],
    );
  });
}
```

## makeSeedJob

src/db.ts:8100

```ts
function makeSeedJob(
  db: Database,
  customerId: number,
  vehicleId: number,
  jobNo: string,
  main: MainStatus,
  sub: SubStatus,
  work: string,
  total: number,
  paid: number,
) {
  const visitId = insert(
    db,
    "insert into visits(customer_id, vehicle_id, advisor_id, received_by, received_at, fuel, keys, accessories, requested_work, photos_note, created_at, updated_at) values (?, ?, 2, 3, datetime('now'), 'Half', '2 keys', 'Mats, charger', ?, 'Sample document placeholder', datetime('now'), datetime('now'))",
    [customerId, vehicleId, work],
  );
  const jobId = insert(
    db,
    "insert into job_cards(job_no, visit_id, advisor_id, technician_id, main_status, sub_status, work_list, promised_at, qc_status, washing_needed, closed_at, advisor_notes, customer_instructions, internal_instructions, created_at, updated_at) values (?, ?, 2, 6, ?, ?, ?, 'Today 6:00 PM', ?, 0, '', 'Seed advisor note', ?, '', datetime('now'), datetime('now'))",
    [
      jobNo,
      visitId,
      main,
      sub,
      work,
      main === "COMPLETED" ? "Pass" : "Pending",
      work,
    ],
  );
  ensureLifecycleChecklist(db, jobId, main, sub, "2026-01-01T08:00:00.000Z");
  const estimateId = insert(
    db,
    "insert into estimates(job_card_id, status, discount, gst_rate, approval_note, created_at, updated_at) values (?, 'Approved', 1000, 18, 'Seed approval', datetime('now'), datetime('now'))",
    [jobId],
  );
  insert(
    db,
    "insert into estimate_items(estimate_id, kind, description, qty, rate, created_at, updated_at) values (?, 'Service', ?, 1, ?, datetime('now'), datetime('now'))",
    [estimateId, work, Math.round(total / 1.18)],
  );
  const itemId = jobNo.endsWith("1246") ? 16 : 1;
  const issued = jobNo.endsWith("1246") ? 0 : 6;
  createMaterialRequest(db, {
    job_card_id: jobId,
    item_id: itemId,
    requested_qty: 6,
    issued_qty: issued,
    used_qty: jobNo.endsWith("1246") ? 0 : 5,
    returned_qty: jobNo.endsWith("1246") ? 0 : 0.8,
    wasted_qty: jobNo.endsWith("1246") ? 0 : 0.2,
  });
  if (issued > 0) movement(db, jobId, itemId, "ISSUE", issued, "Seed issue");
  createTask(db, {
    job_card_id: jobId,
    technician_id: 6,
    title: work.split(",")[0],
    status: main === "COMPLETED" ? "Completed" : "Started",
    notes: "Seed task from workbook flow.",
  });
  ["Edges checked", "Surface cleaned", "Customer items verified"].forEach(
    (label) =>
      insert(
        db,
        "insert into qc_checks(job_card_id, label, passed) values (?, ?, ?)",
        [jobId, label, main === "COMPLETED" ? 1 : 0],
      ),
  );
  let invoiceId = 0;
  if (main === "COMPLETED") {
    const seedRate = Math.round(total / 1.18);
    const taxable = Math.max(0, seedRate - 1000);
    const gstAmount = Math.round(taxable * 18) / 100;
    const invoiceTotal = Math.round((taxable + gstAmount) * 100) / 100;
    invoiceId = insert(
      db,
      "insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,created_at,updated_at) values(?,'INV-08947','TLY-4451',1000,18,?,?,?,'Pending','Seed invoice',1,datetime('now'),datetime('now'))",
      [jobId, seedRate, gstAmount, invoiceTotal],
    );
    insert(
      db,
      "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,datetime('now'),datetime('now'))",
      [invoiceId, work, seedRate],
    );
  }
  if (paid > 0 && invoiceId) {
    insert(
      db,
      "insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,'UPI','','ADV-SEED','Seed advance',datetime('now'),datetime('now'))",
      [jobId, invoiceId, paid],
    );
    syncInvoicePaymentStatus(db, invoiceId);
  }
  createPhoto(db, {
    job_card_id: jobId,
    label: "Job sheet placeholder",
    src: "",
    category: "Job Sheet",
  });
  history(db, jobId, main, sub, "Seeded demo workflow");
}
```

## transitionJobStatusInternal

src/db.ts:8211

```ts
function transitionJobStatusInternal(
  db: Database,
  jobId: number,
  to: MainStatus,
  note: string,
  timestamp = new Date().toISOString(),
  closingViaPayment = false,
) {
  const confirmation = note.trim();
  if (!confirmation)
    throw new Error(
      "A confirmation note is required for every status transition.",
    );
  if (to === "CLOSED" && !closingViaPayment)
    throw new Error(
      "A completed job can only close when a valid payment is recorded.",
    );
  db.run("savepoint job_status_transition");
  try {
    const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
    if (job.main_status === to) throw new Error(`Job card is already ${to}.`);
    if (!closingViaPayment)
      assertValidMainStatusTransition(job.main_status, to);

    const gated =
      to !== "CANCELLED" && to !== "HOLD" && job.main_status !== "HOLD";
    if (gated) {
      const active = maybe<ChecklistCycle>(
        db,
        "select * from checklist_cycles where job_card_id=? order by id desc limit 1",
        [jobId],
      );
      if (!active || active.stage !== job.main_status || !active.completed_at) {
        const remaining = active
          ? all<{ label: SubStatus }>(
              db,
              "select label from checklist_items where checklist_cycle_id=? and required=1 and checked_at is null order by sort_order",
              [active.id],
            ).map((item) => item.label)
          : [];
        throw new Error(
          `Complete the ${job.main_status} checklist before moving to ${to}${remaining.length ? `: ${remaining.join(", ")}` : "."}`,
        );
      }
    }

    const keepsChecklist = to === "CANCELLED" || to === "HOLD";
    const resumesCycle = job.main_status === "HOLD" && to === "IN_PROGRESS";
    const nextSub =
      keepsChecklist || resumesCycle
        ? checklistSubStatus(db, jobId, job.sub_status)
        : LIFECYCLE_CHECKLIST[to][0];
    db.run(
      "update job_cards set main_status=?, sub_status=?, closed_at=case when ?='CLOSED' then coalesce(closed_at, ?) else closed_at end, updated_at=? where id=?",
      [to, nextSub, to, timestamp, timestamp, jobId],
    );
    if (!keepsChecklist && !resumesCycle)
      createLifecycleCycle(db, jobId, to, timestamp);
    history(db, jobId, to, nextSub, confirmation, timestamp);
    if (to === "CLOSED") ensureGatePassOnClose(db, jobId);
    if (!keepsChecklist) reconcileArtifactChecklist(db, jobId, 0, timestamp);
    db.run("release savepoint job_status_transition");
  } catch (error) {
    db.run("rollback to savepoint job_status_transition");
    db.run("release savepoint job_status_transition");
    throw error;
  }
}
```

## resetMissingPhotoEvidence

src/db.ts:8307

```ts
function resetMissingPhotoEvidence(db: Database, onlyJobId?: number) {
  const jobs = all<{ id: number }>(
    db,
    `select j.id from job_cards j
    where j.main_status='IN_PROGRESS' ${onlyJobId === undefined ? "" : "and j.id=?"}
    and not exists(select 1 from photos p where p.job_card_id=j.id and p.archived_at is null and trim(coalesce(p.src,''))<>'')`,
    onlyJobId === undefined ? [] : [onlyJobId],
  );
  for (const job of jobs) {
    const cycle = maybe<ChecklistCycle>(
      db,
      "select * from checklist_cycles where job_card_id=? and stage='IN_PROGRESS' order by cycle_number desc,id desc limit 1",
      [job.id],
    );
    if (!cycle) continue;
    const photoItem = maybe<ChecklistItem>(
      db,
      "select * from checklist_items where checklist_cycle_id=? and label='Photos Shared'",
      [cycle.id],
    );
    if (!photoItem?.checked_at) continue;
    db.run(
      "update checklist_items set checked_by=null,checked_at=null,completed_at=null where checklist_cycle_id=? and sort_order>=?",
      [cycle.id, photoItem.sort_order],
    );
    syncSubStatusFromChecklist(db, job.id);
  }
}
```

## artifactExistsForChecklistItem

src/db.ts:8336

```ts
function artifactExistsForChecklistItem(
  db: Database,
  jobId: number,
  label: SubStatus,
) {
  switch (label) {
    case "Gather Requirements":
      return (
        scalar<number>(
          db,
          "select count(*) from job_cards j join visits v on v.id=j.visit_id where j.id=? and trim(coalesce(v.requested_work,''))<>''",
          [jobId],
        ) > 0
      );
    case "Create Estimate":
      return (
        scalar<number>(
          db,
          "select count(*) from estimates where job_card_id=? and archived_at is null",
          [jobId],
        ) > 0
      );
    case "Get Confirmation":
      return (
        scalar<number>(
          db,
          "select count(*) from estimates where job_card_id=? and status='Approved' and archived_at is null",
          [jobId],
        ) > 0
      );
    case "Material Requested":
      return (
        scalar<number>(
          db,
          "select count(*) from material_requests where job_card_id=? and archived_at is null and status<>'Draft'",
          [jobId],
        ) > 0
      );
    case "Material Issued":
      return (
        scalar<number>(
          db,
          "select count(*) from material_requests where job_card_id=? and archived_at is null and status='Issued'",
          [jobId],
        ) > 0 &&
        scalar<number>(
          db,
          "select count(*) from material_requests where job_card_id=? and archived_at is null and status not in ('Issued','Cancelled')",
          [jobId],
        ) === 0
      );
    case "Washing Needed":
      return (
        scalar<number>(
          db,
          "select count(*) from job_cards where id=? and washing_needed=1",
          [jobId],
        ) > 0
      );
    case "Work Started":
      return (
        scalar<number>(
          db,
          "select count(*) from tasks where job_card_id=? and status in ('Started','Paused','Completed') and archived_at is null",
          [jobId],
        ) > 0
      );
    case "Follow-up Needed":
      return (
        scalar<number>(
          db,
          "select count(*) from followups where job_card_id=? and archived_at is null",
          [jobId],
        ) > 0
      );
    case "Photos Shared":
      return (
        scalar<number>(
          db,
          "select count(*) from photos where job_card_id=? and archived_at is null and trim(coalesce(src,''))<>''",
          [jobId],
        ) > 0
      );
    case "QC Pending":
      return (
        scalar<number>(
          db,
          "select count(*) from tasks where job_card_id=? and status<>'Completed' and archived_at is null",
          [jobId],
        ) === 0
      );
    case "Customer Verification":
      return (
        scalar<number>(
          db,
          "select count(*) from job_cards where id=? and qc_status='Pass'",
          [jobId],
        ) > 0
      );
    case "Invoice Ready":
      return (
        scalar<number>(
          db,
          "select count(*) from invoices where job_card_id=? and voided_at is null",
          [jobId],
        ) > 0
      );
    case "Payment Received": {
      const invoice = maybe<Invoice>(
        db,
        "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1",
        [jobId],
      );
      return Boolean(
        invoice &&
        invoice.total > 0 &&
        scalar<number>(
          db,
          "select coalesce(sum(amount),0) from payments where invoice_id=? and voided_at is null",
          [invoice.id],
        ) >= invoice.total,
      );
    }
    case "Receipt Generated":
      return (
        scalar<number>(
          db,
          "select count(*) from receipts where job_card_id=? and voided_at is null",
          [jobId],
        ) > 0
      );
    case "Gate Pass Generated":
      return (
        scalar<number>(
          db,
          "select count(*) from gate_passes where job_card_id=? and voided_at is null",
          [jobId],
        ) > 0
      );
    case "Delivered":
      return false;
  }
}
```

## checklistSubStatus

src/db.ts:8480

```ts
function checklistSubStatus(db: Database, jobId: number, fallback: SubStatus) {
  const cycle = maybe<ChecklistCycle>(
    db,
    "select * from checklist_cycles where job_card_id=? order by id desc limit 1",
    [jobId],
  );
  if (!cycle) return fallback;
  const items = all<ChecklistItem>(
    db,
    "select * from checklist_items where checklist_cycle_id=? order by sort_order",
    [cycle.id],
  );
  return items.length ? deriveChecklistSubStatus(items) : fallback;
}
```

## history

src/db.ts:8495

```ts
function history(
  db: Database,
  jobId: number,
  main: MainStatus,
  sub: SubStatus,
  note: string,
  timestamp?: string,
) {
  db.run(
    "insert into status_history(job_card_id, main_status, sub_status, note, created_at) values (?, ?, ?, ?, coalesce(?, datetime('now')))",
    [jobId, main, sub, note, timestamp ?? null],
  );
}
```

## auditEvidence

src/db.ts:8509

```ts
function auditEvidence(db: Database, jobId: number, note: string) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  history(
    db,
    jobId,
    job.main_status,
    checklistSubStatus(db, jobId, job.sub_status),
    note,
  );
}
```

## movement

src/db.ts:8520

```ts
function movement(
  db: Database,
  jobId: number,
  itemId: number,
  direction: string,
  qty: number,
  note: string,
) {
  db.run(
    "insert into material_movements(job_card_id, item_id, direction, qty, note, created_at) values (?, ?, ?, ?, ?, datetime('now'))",
    [jobId, itemId, direction, qty, note],
  );
}
```

## archive

src/db.ts:8534

```ts
function archive(db: Database, table: string, id: number, reason: string) {
  db.run(
    `update ${table} set archived_at=datetime('now'), archived_reason=?, updated_at=datetime('now') where id=?`,
    [reason || "Archived", id],
  );
}
```

## invoiceTotal

src/db.ts:8541

```ts
function invoiceTotal(db: Database, jobId: number) {
  const estimate = maybe<Estimate>(
    db,
    "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
    [jobId],
  );
  const items = estimate
    ? all<EstimateItem>(
        db,
        "select * from estimate_items where estimate_id=? and archived_at is null",
        [estimate.id],
      )
    : [];
  return invoiceItemsTotal(items, estimate);
}
```

## insert

src/db.ts:8674

```ts
function insert(db: Database, sql: string, params: DbValue[]) {
  db.run(sql, params);
  return scalar<number>(db, "select last_insert_rowid()");
}
```

## scalar

src/db.ts:8679

```ts
function scalar<T>(db: Database, sql: string, params: DbValue[] = []) {
  return db.exec(sql, params)[0]?.values[0]?.[0] as T;
}
```

## all

src/db.ts:8683

```ts
function all<T>(db: Database, sql: string, params: DbValue[] = []) {
  const result = db.exec(sql, params)[0];
  if (!result) return [] as T[];
  return result.values.map((row) =>
    Object.fromEntries(
      result.columns.map((column, index) => [column, row[index]]),
    ),
  ) as T[];
}
```

## one

src/db.ts:8693

```ts
function one<T>(db: Database, sql: string, params: DbValue[] = []) {
  const row = maybe<T>(db, sql, params);
  if (!row) throw new Error(`Expected row for query: ${sql}`);
  return row;
}
```

## maybe

src/db.ts:8699

```ts
function maybe<T>(db: Database, sql: string, params: DbValue[] = []) {
  return all<T>(db, sql, params)[0];
}
```