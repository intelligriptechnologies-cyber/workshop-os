import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  addMaterialRowForActor,
  cancelMaterialRowForActor,
  createLocalPurchase,
  createMaterialPurchaseRequestForActor,
  createSchema,
  deleteMaterialRowForActor,
  editIssuedMaterialRowForActor,
  materialStockOnHand,
  releaseMaterialRowForActor,
  migrateSchema,
  readState,
  reconcileArtifactChecklist,
  reRequestMaterialRowForActor,
  requestMaterialRowForActor,
  purchaseStockAndIssueForActor,
  setChecklistItemNotApplicableForActor,
  archiveLocalPurchase,
  updateLocalPurchase,
  updateMaterialRowForActor,
  submitMaterialApprovalForActor,
  decideMaterialApprovalForActor,
  resubmitMaterialApprovalForActor,
  reconcileMaterialQty,
} from "../src/db";
import { canManageMaterialRows, materialRowActions, overStockWarning, triageMaterialDemand } from "../src/materials";

async function database(main = "IN_PROGRESS", sub = "Material Requested") {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'linked@test','Linked','service','x'),(3,'other@test','Other','service','x'),(5,'tech@test','Tech','tech','x'),(6,'store@test','Store','store','x')");
  db.run("insert into inventory(id,sku,category,name,unit,stock_qty,low_stock_qty) values (1,'P-1','PPF','Gloss PPF','metre',10,2),(2,'C-1','Paint','Clear','litre',4,1)");
  db.run("insert into visits(id,advisor_id,requested_work) values(1,2,'Repair')");
  db.run(`insert into job_cards(id,job_no,visit_id,advisor_id,technician_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,2,5,'${main}','${sub}','Pending',0,'')`);
  migrateSchema(db);
  return db;
}

function rows<T>(db: Database, sql: string): T[] {
  const result = db.exec(sql)[0];
  if (!result) return [];
  return result.values.map((values) => Object.fromEntries(result.columns.map((column, index) => [column, values[index]])) as T);
}
const status = (db: Database, id: number) => rows<{ status: string }>(db, `select status from material_requests where id=${id}`)[0]?.status;
const ticked = (db: Database, label: string) => Boolean(rows<{ checked_at: string | null }>(db, `select checked_at from checklist_items where label='${label}' order by id desc`)[0].checked_at);

test("rows go Draft, Requested, Re-requested and Cancel only from requested states", async () => {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 2, 1, 3);
  assert.equal(status(db, id), "Draft");
  assert.throws(() => cancelMaterialRowForActor(db, id, 2), /cannot be cancelled/);
  updateMaterialRowForActor(db, id, 2, 2, 2);
  requestMaterialRowForActor(db, id, 2);
  assert.equal(status(db, id), "Requested");
  assert.throws(() => updateMaterialRowForActor(db, id, 2, 1, 1), /cannot be edited/);
  assert.throws(() => deleteMaterialRowForActor(db, id, 2), /cannot be deleted/);
  reRequestMaterialRowForActor(db, id, 2, 1, 5);
  assert.equal(status(db, id), "Re-requested");
  assert.deepEqual(rows(db, `select item_id,requested_qty from material_requests where id=${id}`), [{ item_id: 1, requested_qty: 5 }]);
  cancelMaterialRowForActor(db, id, 1);
  assert.equal(status(db, id), "Cancelled");
  assert.throws(() => reRequestMaterialRowForActor(db, id, 2, 1, 1), /cannot be re-requested/);
});

test("Draft rows delete freely", async () => {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 1, 1, 1);
  deleteMaterialRowForActor(db, id, 1);
  assert.equal(rows(db, "select * from material_requests").length, 0);
});

test("rows change only while IN_PROGRESS and only for Owner or the linked Advisor", async () => {
  const db = await database();
  assert.throws(() => addMaterialRowForActor(db, 1, 3, 1, 1), /linked Service Advisor/);
  assert.throws(() => addMaterialRowForActor(db, 1, 5, 1, 1), /linked Service Advisor/);
  assert.throws(() => addMaterialRowForActor(db, 1, 2, 1, 0), /greater than zero/);
  const id = addMaterialRowForActor(db, 1, 2, 1, 1);
  db.run("update job_cards set main_status='HOLD' where id=1");
  assert.throws(() => requestMaterialRowForActor(db, id, 2), /IN_PROGRESS/);
  assert.throws(() => addMaterialRowForActor(db, 1, 1, 1, 1), /IN_PROGRESS/);
  assert.equal(canManageMaterialRows({ id: 5, role: "tech" }, { advisor_id: 2, main_status: "IN_PROGRESS" }), false);
});

test("requesting over stock warns but succeeds; stock is seed minus ledger", async () => {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 2, 2, 9);
  const result = requestMaterialRowForActor(db, id, 2);
  assert.equal(result.onHand, 4);
  assert.match(result.warning ?? "", /more than the 4 in stock/);
  assert.equal(status(db, id), "Requested");
  db.run("insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at) values(1,1,2,3,'issue',1,'2026-01-01')");
  assert.equal(readState(db).inventory.find((item) => item.id === 2)?.stock_qty, 1);
  assert.equal(overStockWarning(1, 1), undefined);
});

test("material demand triage sends shortages to procurement and leaves available SKUs issuable", () => {
  assert.equal(triageMaterialDemand({ requested_qty: 3, issued_qty: 1 }, { stock_qty: 2 }), "issuable");
  assert.equal(triageMaterialDemand({ requested_qty: 3, issued_qty: 1 }, { stock_qty: 1 }), "procurement");
  assert.equal(triageMaterialDemand({ requested_qty: 1, issued_qty: 0 }, undefined), "procurement");
});

test("Materials Requested auto-ticks on the first Requested row and stays ticked when cancelled", async () => {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 2, 1, 2);
  assert.equal(ticked(db, "Material Requested"), false, "a Draft row does not tick");
  requestMaterialRowForActor(db, id, 2);
  assert.equal(ticked(db, "Material Requested"), true);
  cancelMaterialRowForActor(db, id, 2);
  assert.equal(ticked(db, "Material Requested"), true);
});

test("Materials Issued unticks when a new request is made", async () => {
  const db = await database();
  const first = addMaterialRowForActor(db, 1, 2, 1, 2);
  requestMaterialRowForActor(db, first, 2);
  db.run("update material_requests set status='Issued', issued_qty=2 where id=?", [first]);
  reconcileArtifactChecklist(db, 1);
  assert.equal(ticked(db, "Material Issued"), true);
  requestMaterialRowForActor(db, addMaterialRowForActor(db, 1, 2, 2, 1), 2);
  assert.equal(ticked(db, "Material Issued"), false);
});

test("N/A on the materials items is refused once rows exist", async () => {
  const db = await database();
  const itemId = rows<{ id: number }>(db, "select id from checklist_items where label='Material Requested'")[0].id;
  addMaterialRowForActor(db, 1, 2, 1, 1);
  assert.throws(() => setChecklistItemNotApplicableForActor(db, itemId, 2, true), /no material rows/);
  db.run("delete from material_requests");
  setChecklistItemNotApplicableForActor(db, itemId, 2, true);
  assert.equal(ticked(db, "Material Requested"), true);
});

test("permitted actions per row state", () => {
  assert.deepEqual(materialRowActions({ status: "Draft" }), ["edit", "request", "delete"]);
  assert.deepEqual(materialRowActions({ status: "Requested" }), ["re-request", "cancel"]);
  assert.deepEqual(materialRowActions({ status: "Issued" }), []);
  assert.deepEqual(materialRowActions({ status: "Requested", invoiced_in: 4 }), []);
});

async function requested(qty: number, itemId = 1) {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 2, itemId, qty);
  requestMaterialRowForActor(db, id, 2);
  return { db, id };
}
const ledgerRows = (db: Database) => rows<{ qty: number; type: string; by_user: number }>(db, "select qty,type,by_user from stock_ledger order by id");

test("Store release writes a signed ledger record, decrements stock and ticks Materials Issued", async () => {
  const { db, id } = await requested(3);
  assert.throws(() => releaseMaterialRowForActor(db, id, 2), /Only Store or the Owner/);
  releaseMaterialRowForActor(db, id, 6);
  assert.equal(status(db, id), "Issued");
  assert.deepEqual(ledgerRows(db), [{ qty: 3, type: "issue", by_user: 6 }]);
  assert.equal(materialStockOnHand(db, 1), 7);
  assert.equal(ticked(db, "Material Issued"), true);
  assert.throws(() => releaseMaterialRowForActor(db, id, 6), /cannot be released/);
  assert.equal(readState(db).jobs[0].material_events?.[0].kind, "release");
});

test("reconciliation corrections keep on-hand stock, movement history, and audit history aligned", async () => {
  const { db, id } = await requested(10);
  releaseMaterialRowForActor(db, id, 6);

  reconcileMaterialQty(db, id, 6, 3, 1);
  assert.equal(materialStockOnHand(db, 1), 3, "initial return is restored to stock");
  assert.deepEqual(rows(db, "select used_qty,returned_qty,wasted_qty from material_requests where id=" + id), [{ used_qty: 6, returned_qty: 3, wasted_qty: 1 }]);

  reconcileMaterialQty(db, id, 5, 4, 1);
  assert.equal(materialStockOnHand(db, 1), 4, "increasing a return restores one more unit");

  reconcileMaterialQty(db, id, 7, 1, 2);
  assert.equal(materialStockOnHand(db, 1), 1, "reducing a return creates a compensating stock debit");
  assert.deepEqual(rows<{ qty: number; direction: string }>(db, "select qty,direction from material_movements order by id"), [
    { qty: 3, direction: "RETURN" }, { qty: 1, direction: "WASTAGE" },
    { qty: 1, direction: "RETURN" }, { qty: -3, direction: "RETURN" }, { qty: 1, direction: "WASTAGE" },
  ]);
  assert.deepEqual(rows<{ qty: number; type: string }>(db, "select qty,type from stock_ledger order by id"), [
    { qty: 10, type: "issue" }, { qty: -3, type: "return-adjustment" }, { qty: -1, type: "return-adjustment" }, { qty: 3, type: "return-adjustment" },
  ]);
  assert.equal(rows(db, "select note from status_history where job_card_id=1 and note='Material reconciled'").length, 3);
  assert.throws(() => reconcileMaterialQty(db, id, -1, 0, 0), /non-negative/);
  assert.throws(() => reconcileMaterialQty(db, id, 9, 2, 0), /cannot exceed/);
});

test("release over stock is blocked and writes nothing", async () => {
  const { db, id } = await requested(11);
  assert.throws(() => releaseMaterialRowForActor(db, id, 6), /only 10 in stock/);
  assert.equal(status(db, id), "Requested");
  assert.equal(ledgerRows(db).length, 0);
});

test("release requires IN_PROGRESS and is unavailable on ordinary HOLD or COMPLETED", async () => {
  const { db, id } = await requested(2);
  db.run("update job_cards set main_status='HOLD' where id=1");
  assert.throws(() => releaseMaterialRowForActor(db, id, 1), /IN_PROGRESS/);
  const second = await requested(2);
  second.db.run("update job_cards set main_status='COMPLETED' where id=1");
  assert.throws(() => releaseMaterialRowForActor(second.db, second.id, 6), /IN_PROGRESS/);
});

test("Store material approval holds a job, freezes it, then approval restores retained issue eligibility", async () => {
  const { db, id } = await requested(2);
  const approvalId = submitMaterialApprovalForActor(db, id, 6);
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "HOLD");
  assert.equal(rows<{ status: string }>(db, "select status from material_approvals")[0].status, "Pending");
  assert.equal(submitMaterialApprovalForActor(db, id, 6), approvalId, "the same pending record is focused");
  assert.throws(() => releaseMaterialRowForActor(db, id, 6), /approval is pending/);
  assert.throws(() => updateMaterialRowForActor(db, id, 2, 1, 3), /frozen/);
  assert.throws(() => decideMaterialApprovalForActor(db, 1, 2, "Approved"), /Only Admin/);
  decideMaterialApprovalForActor(db, 1, 1, "Approved");
  assert.deepEqual(rows(db, "select main_status from job_cards"), [{ main_status: "IN_PROGRESS" }]);
  assert.equal(status(db, id), "Requested", "approval does not duplicate or replace the row");
  releaseMaterialRowForActor(db, id, 6);
  assert.equal(status(db, id), "Issued");
});

test("rejection requires a reason and only the linked advisor can correct and resubmit", async () => {
  const { db, id } = await requested(2);
  submitMaterialApprovalForActor(db, id, 6);
  assert.throws(() => decideMaterialApprovalForActor(db, 1, 1, "Rejected"), /reason is required/);
  decideMaterialApprovalForActor(db, 1, 1, "Rejected", "Confirm item specification");
  assert.equal(rows<{ status: string }>(db, "select status from material_approvals")[0].status, "Rejected");
  assert.throws(() => releaseMaterialRowForActor(db, id, 6), /approval is rejected/);
  assert.throws(() => resubmitMaterialApprovalForActor(db, 1, 3), /linked Service Advisor/);
  reRequestMaterialRowForActor(db, id, 2, 2, 3);
  resubmitMaterialApprovalForActor(db, 1, 2);
  assert.deepEqual(rows(db, "select status,revision,rejection_reason from material_approvals"), [{ status: "Pending", revision: 2, rejection_reason: null }]);
  assert.equal(rows(db, "select action from material_approval_events order by id").length, 3);
});

test("Materials Issued needs every non-cancelled row Issued and unticks on a new request", async () => {
  const { db, id } = await requested(1);
  const other = addMaterialRowForActor(db, 1, 2, 2, 1);
  requestMaterialRowForActor(db, other, 2);
  releaseMaterialRowForActor(db, id, 6);
  assert.equal(ticked(db, "Material Issued"), false);
  cancelMaterialRowForActor(db, other, 2);
  reconcileArtifactChecklist(db, 1);
  assert.equal(ticked(db, "Material Issued"), true);
  requestMaterialRowForActor(db, addMaterialRowForActor(db, 1, 2, 1, 1), 2);
  assert.equal(ticked(db, "Material Issued"), false);
});

test("Issued edit needs a note, stays Issued, adjusts stock by the difference and logs old/new", async () => {
  const { db, id } = await requested(3);
  releaseMaterialRowForActor(db, id, 6);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 6, 1, 5, "  "), /note is required/);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 5, 1, 5, "x"), /Only Store/);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 3, 1, 5, "x"), /Only Store/);
  editIssuedMaterialRowForActor(db, id, 2, 1, 5, "Customer wants more");
  assert.equal(status(db, id), "Issued");
  assert.equal(materialStockOnHand(db, 1), 5);
  assert.deepEqual(ledgerRows(db).at(-1), { qty: 2, type: "adjustment", by_user: 2 });
  assert.equal(ticked(db, "Material Issued"), true);
  const event = readState(db).jobs[0].material_events!.at(-1)!;
  assert.deepEqual([event.kind, event.old_qty, event.new_qty, event.note], ["issued-edit", 3, 5, "Customer wants more"]);
  editIssuedMaterialRowForActor(db, id, 6, 1, 1, "Returned surplus to shelf");
  assert.equal(materialStockOnHand(db, 1), 9);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 6, 1, 99, "too many"), /only 9 in stock|more; only/);
});

test("Issued edit can switch item and is blocked once invoiced", async () => {
  const { db, id } = await requested(3);
  releaseMaterialRowForActor(db, id, 6);
  editIssuedMaterialRowForActor(db, id, 6, 2, 2, "Wrong item picked");
  assert.equal(materialStockOnHand(db, 1), 10);
  assert.equal(materialStockOnHand(db, 2), 2);
  db.run("update material_requests set invoiced_in=9 where id=?", [id]);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 6, 2, 1, "late"), /cannot be edited/);
});

test("local purchases persist with a job, can be edited and archived, and never affect stock or material rows", async () => {
  const db = await database();
  const beforeStock = materialStockOnHand(db, 1);
  const beforeMovements = rows(db, "select * from material_movements").length;
  const id = createLocalPurchase(db, {
    job_card_id: 1, item_description: "Door handle", quantity: 2, unit: "piece", unit_cost: 450,
    vendor: "City Parts", bill_reference: "BILL-42", note: "Bought locally",
  });
  assert.equal(materialStockOnHand(db, 1), beforeStock);
  assert.equal(rows(db, "select * from material_requests").length, 0);
  assert.equal(rows(db, "select * from material_movements").length, beforeMovements);
  assert.deepEqual(readState(db).jobs[0].local_purchases.map((item) => [item.id, item.item_description, item.bill_reference]), [[id, "Door handle", "BILL-42"]]);

  updateLocalPurchase(db, id, {
    job_card_id: 1, item_description: "Door handle assembly", quantity: 1, unit: "piece", unit_cost: 700,
    vendor: "City Parts", bill_reference: "BILL-43", note: "Corrected bill",
  });
  assert.deepEqual(rows(db, "select item_description,quantity,unit_cost,bill_reference from local_purchases where id=" + id), [{ item_description: "Door handle assembly", quantity: 1, unit_cost: 700, bill_reference: "BILL-43" }]);
  assert.equal(materialStockOnHand(db, 1), beforeStock);

  archiveLocalPurchase(db, id, "Duplicate bill");
  assert.equal(readState(db).jobs[0].local_purchases.length, 0);
  assert.deepEqual(rows(db, "select archived_reason from local_purchases where id=" + id), [{ archived_reason: "Duplicate bill" }]);
});

test("local purchases require a selected job and vendor/bill details", async () => {
  const db = await database();
  assert.throws(() => createLocalPurchase(db, { job_card_id: 1, item_description: "Clip", quantity: 1, unit: "piece", unit_cost: 5, vendor: "", bill_reference: "BILL-1" }), /vendor or shop/);
  assert.throws(() => createLocalPurchase(db, { job_card_id: 1, item_description: "Clip", quantity: 1, unit: "piece", unit_cost: 5, vendor: "Parts", bill_reference: "" }), /bill or reference/);
  assert.throws(() => createLocalPurchase(db, { job_card_id: 0, item_description: "Clip", quantity: 1, unit: "piece", unit_cost: 5, vendor: "Parts", bill_reference: "BILL-1" }), /selected job/);
});

test("a new-item purchase request is separate until Store purchases, stocks and issues it", async () => {
  const db = await database();
  const requestId = createMaterialPurchaseRequestForActor(db, 1, 2, { item_name: "Door trim clip", quantity: 6, unit: "piece" });
  assert.deepEqual(rows(db, "select status,mapped_inventory_item_id,material_request_id from material_purchase_requests"), [{ status: "Pending", mapped_inventory_item_id: null, material_request_id: null }]);
  const result = purchaseStockAndIssueForActor(db, requestId, 6, { sku: "CLIP-6", category: "Trim", unit_cost: 12, vendor: "City Parts", bill_reference: "BILL-9" });
  assert.equal(materialStockOnHand(db, result.itemId), 0, "the purchased quantity is immediately issued to the job");
  assert.deepEqual(rows(db, `select status,mapped_inventory_item_id,material_request_id,local_purchase_id from material_purchase_requests where id=${requestId}`), [{ status: "Completed", mapped_inventory_item_id: result.itemId, material_request_id: result.materialRowId, local_purchase_id: result.purchaseId }]);
  assert.deepEqual(rows(db, `select status,requested_qty,issued_qty from material_requests where id=${result.materialRowId}`), [{ status: "Issued", requested_qty: 6, issued_qty: 6 }]);
  assert.equal(readState(db).jobs[0].material_purchase_requests[0].status, "Completed");
  assert.throws(() => purchaseStockAndIssueForActor(db, requestId, 6, { unit_cost: 0, vendor: "City Parts", bill_reference: "BILL-10" }), /pending/);
});
