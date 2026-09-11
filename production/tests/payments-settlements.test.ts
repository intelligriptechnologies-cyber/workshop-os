import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { cashfreeTestSignature, createLocalPaymentsApi } from "../src/payments-settlements.js";

const now = "2026-09-11T09:00:00.000Z";
const memberships = {
  cashier: { identityId: "identity-cashier", membershipId: "membership-cashier", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["payment.post", "payment.read", "payment.link", "payment.webhook", "credit.manage", "payment.correct.request", "settlement.reconcile"] },
  checker: { identityId: "identity-checker", membershipId: "membership-checker", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["payment.correct.approve", "credit.exception.approve"] , recentReauthenticatedAt: now },
  other: { identityId: "identity-other", membershipId: "membership-other", tenantId: "tenant-b", branchIds: ["branch-b"], permissions: ["payment.post", "payment.read"] },
};

const invoices = [{ tenantId: "tenant-a", branchId: "branch-a", invoiceId: "invoice-20", customerId: "customer-1", visitId: "visit-1", jobId: "job-20", payerId: "payer-1", currency: "INR", payableMinor: "118000" }];
const api = () => createLocalPaymentsApi({ memberships, invoices, cashfreeWebhookSecret: "test-secret" });

test("RED/GREEN: an advance is one exact immutable liability allocation and duplicate references cannot create another receipt", async () => {
  const payments = api();
  const client = payments.signIn("cashier");
  const request = { branchId: "branch-a", customerId: "customer-1", visitId: "visit-1", jobId: "job-20", invoiceId: "invoice-20", amountMinor: "25000", currency: "INR", mode: "UPI", externalReference: "upi-advance-1", evidenceRef: "private/tenant-a/payments/advance-1.jpg" };
  const posted = await client.post("/api/v1/advances", request, { idempotencyKey: "advance-1", now });
  assert.equal(posted.status, 201);
  assert.equal(posted.body.advance.kind, "ADVANCE_RECEIPT");
  assert.equal(posted.body.advance.liabilityMinor, "25000");
  assert.equal(posted.body.advance.invoiceId, "invoice-20");
  assert.deepEqual(await client.post("/api/v1/advances", request, { idempotencyKey: "advance-1", now }), posted);
  assert.equal((await client.post("/api/v1/advances", { ...request, amountMinor: "26000" }, { idempotencyKey: "advance-1", now })).body.code, "IDEMPOTENCY_KEY_REUSED");
  assert.equal((await client.post("/api/v1/advances", request, { idempotencyKey: "advance-2", now })).body.code, "PAYMENT_REFERENCE_ALREADY_USED");
  assert.equal((await client.post("/api/v1/advances", { ...request, amountMinor: "100000", externalReference: "advance-over" }, { idempotencyKey: "advance-over", now })).body.code, "ADVANCE_EXCEEDS_ALLOCATION");
  assert.equal(payments.inspect().financialEvents.length, 1);
});

test("RED/GREEN: partial split payments support workshop rails while exact allocation blocks duplicates and overpayment", async () => {
  const payments = api(); const client = payments.signIn("cashier");
  const cash = await client.post("/api/v1/invoices/invoice-20/payments", { branchId: "branch-a", amountMinor: "18000", currency: "INR", mode: "CASH", externalReference: "cash-1", evidenceRef: "private/tenant-a/payments/cash-1.jpg" }, { idempotencyKey: "cash-1", now });
  const upi = await client.post("/api/v1/invoices/invoice-20/payments", { branchId: "branch-a", amountMinor: "100000", currency: "INR", mode: "UPI", externalReference: "upi-1", evidenceRef: "private/tenant-a/payments/upi-1.jpg" }, { idempotencyKey: "upi-1", now });
  assert.equal(cash.status, 201); assert.equal(upi.status, 201);
  assert.equal(upi.body.invoicePayment.paidMinor, "118000");
  assert.equal(upi.body.invoicePayment.outstandingMinor, "0");
  assert.equal((await client.post("/api/v1/invoices/invoice-20/payments", { branchId: "branch-a", amountMinor: "1", currency: "INR", mode: "CARD", externalReference: "card-1", evidenceRef: "private/tenant-a/payments/card-1.jpg" }, { idempotencyKey: "card-1", now })).body.code, "PAYMENT_EXCEEDS_OUTSTANDING");
  assert.equal((await client.post("/api/v1/invoices/invoice-20/payments", { branchId: "branch-a", amountMinor: "1", currency: "INR", mode: "BANK", externalReference: "cash-1", evidenceRef: "private/tenant-a/payments/bank-1.jpg" }, { idempotencyKey: "bank-1", now })).body.code, "PAYMENT_REFERENCE_ALREADY_USED");
});

test("RED/GREEN: scoped expiring Cashfree links never trust redirects and only a valid raw signed webhook posts once under reordering", async () => {
  const payments = api(); const client = payments.signIn("cashier");
  const linked = await client.post("/api/v1/cashfree/payment-links", { branchId: "branch-a", invoiceId: "invoice-20", customerId: "customer-1", amountMinor: "118000", currency: "INR", expiresAt: "2026-09-11T09:15:00.000Z" }, { idempotencyKey: "link-1", now });
  assert.equal(linked.status, 201); assert.equal(linked.body.link.providerCalled, false);
  const redirect = await client.post(`/api/v1/cashfree/payment-links/${linked.body.link.id}/redirects`, { branchId: "branch-a", providerStatus: "SUCCESS" }, { idempotencyKey: "redirect-1", now });
  assert.equal(redirect.body.paymentPosted, false);
  const rawBody = JSON.stringify({ eventId: "cf-event-1", linkId: linked.body.link.id, providerPaymentId: "cf-pay-1", status: "SUCCESS", amountMinor: "118000", currency: "INR", occurredAt: now });
  assert.equal((await client.post("/api/v1/cashfree/webhooks", { branchId: "branch-a" }, { idempotencyKey: "webhook-bad", rawBody, signature: "bad", now })).body.code, "INVALID_WEBHOOK_SIGNATURE");
  const signature = cashfreeTestSignature("test-secret", rawBody);
  const posted = await client.post("/api/v1/cashfree/webhooks", { branchId: "branch-a" }, { idempotencyKey: "webhook-1", rawBody, signature, now });
  assert.equal(posted.status, 200); assert.equal(posted.body.payment.kind, "PAYMENT_RECEIPT");
  assert.equal(posted.body.rawBodySha256.length, 64);
  const changedRawBody = rawBody.replace("cf-event-1", "cf-event-2");
  assert.equal((await client.post("/api/v1/cashfree/webhooks", { branchId: "branch-a" }, { idempotencyKey: "webhook-1", rawBody: changedRawBody, signature: cashfreeTestSignature("test-secret", changedRawBody), now })).body.code, "IDEMPOTENCY_KEY_REUSED");
  assert.equal((await client.post(`/api/v1/cashfree/payment-links/${linked.body.link.id}/redirects`, { branchId: "branch-a", providerStatus: "SUCCESS" }, { idempotencyKey: "redirect-after", now })).body.paymentPosted, false);
  assert.equal((await client.post("/api/v1/cashfree/webhooks", { branchId: "branch-a" }, { idempotencyKey: "webhook-duplicate", rawBody, signature, now })).body.code, "WEBHOOK_EVENT_ALREADY_PROCESSED");
});

test("RED/GREEN: an authoritative Cashfree webhook cannot over-allocate an invoice after a reordered manual payment", async () => {
  const payments = api(); const client = payments.signIn("cashier");
  const linked = await client.post("/api/v1/cashfree/payment-links", { branchId: "branch-a", invoiceId: "invoice-20", customerId: "customer-1", amountMinor: "118000", currency: "INR", expiresAt: "2026-09-11T09:15:00.000Z" }, { idempotencyKey: "link-before-manual", now });
  await client.post("/api/v1/invoices/invoice-20/payments", { branchId: "branch-a", amountMinor: "1", currency: "INR", mode: "CASH", externalReference: "cash-after-link", evidenceRef: "private/tenant-a/payments/cash-after-link.jpg" }, { idempotencyKey: "cash-after-link", now });
  const rawBody = JSON.stringify({ eventId: "cf-event-overpay", linkId: linked.body.link.id, providerPaymentId: "cf-pay-overpay", status: "SUCCESS", amountMinor: "118000", currency: "INR", occurredAt: now });
  const response = await client.post("/api/v1/cashfree/webhooks", { branchId: "branch-a" }, { idempotencyKey: "webhook-overpay", rawBody, signature: cashfreeTestSignature("test-secret", rawBody), now });
  assert.equal(response.status, 422);
  assert.equal(response.body.code, "PAYMENT_EXCEEDS_OUTSTANDING");
  assert.equal(payments.inspect().financialEvents.length, 1);
  assert.equal(payments.inspect().webhookEvidence.length, 0);
});

test("RED/GREEN: formal credit exposes limit, terms, approver, outstanding exposure, exception approval, and delivery eligibility", async () => {
  const payments = api(); const maker = payments.signIn("cashier"); const checker = payments.signIn("checker");
  const credit = await maker.post("/api/v1/customers/customer-1/credit", { branchId: "branch-a", limitMinor: "50000", outstandingExposureMinor: "10000", currency: "INR", termsDays: 30, approvedByMembershipId: "membership-checker" }, { idempotencyKey: "credit-1", now });
  assert.equal(credit.status, 201); assert.equal(credit.body.credit.deliveryEligible, false);
  const requested = await maker.post("/api/v1/invoices/invoice-20/credit-exceptions", { branchId: "branch-a", amountMinor: "78000", reason: "Approved fleet account extension" }, { idempotencyKey: "credit-ex-1", now });
  assert.equal(requested.body.exception.status, "APPROVAL_PENDING");
  assert.equal((await maker.post(`/api/v1/credit-exceptions/${requested.body.exception.id}/approve`, { branchId: "branch-a" }, { idempotencyKey: "credit-self", ifMatch: 1, now })).body.code, "FORBIDDEN");
  const approved = await checker.post(`/api/v1/credit-exceptions/${requested.body.exception.id}/approve`, { branchId: "branch-a" }, { idempotencyKey: "credit-approve", ifMatch: 1, now });
  assert.equal(approved.status, 200); assert.equal(approved.body.credit.deliveryEligible, true);
  assert.equal(approved.body.credit.approvedExceptionMinor, "78000");
});

test("RED/GREEN: advance corrections, refunds, reversals, disputes, and chargebacks require maker-checker append-only compensation", async () => {
  const payments = api(); const maker = payments.signIn("cashier"); const checker = payments.signIn("checker");
  const advance = await maker.post("/api/v1/advances", { branchId: "branch-a", customerId: "customer-1", visitId: "visit-1", jobId: "job-20", invoiceId: "invoice-20", amountMinor: "25000", currency: "INR", mode: "UPI", externalReference: "advance-to-reverse", evidenceRef: "private/tenant-a/payments/advance.jpg" }, { idempotencyKey: "advance-reverse-source", now });
  const request = await maker.post(`/api/v1/financial-events/${advance.body.advance.id}/corrections`, { branchId: "branch-a", type: "ADVANCE_REVERSAL", amountMinor: "25000", reason: "Advance entered against wrong visit", evidenceRef: "private/tenant-a/payments/reversal.jpg" }, { idempotencyKey: "correction-request", now });
  assert.equal(request.body.correction.status, "APPROVAL_PENDING");
  const approved = await checker.post(`/api/v1/payment-corrections/${request.body.correction.id}/approve`, { branchId: "branch-a" }, { idempotencyKey: "correction-approve", ifMatch: 1, now });
  assert.equal(approved.status, 200); assert.equal(approved.body.compensatingEvent.kind, "ADVANCE_REVERSAL");
  assert.equal(approved.body.compensatingEvent.originalFinancialEventId, advance.body.advance.id);
  assert.equal(payments.inspect().financialEvents[0].kind, "ADVANCE_RECEIPT");
  assert.equal(payments.inspect().financialEvents.length, 2);
});

test("RED/GREEN: settlement reconciliation exactly reports gross, fees, tax, refunds, chargebacks, net bank, unmatched and duplicate entries", async () => {
  const payments = api(); const client = payments.signIn("cashier");
  await client.post("/api/v1/invoices/invoice-20/payments", { branchId: "branch-a", amountMinor: "118000", currency: "INR", mode: "BANK", externalReference: "provider-pay-1", evidenceRef: "private/tenant-a/payments/bank.jpg" }, { idempotencyKey: "settlement-payment", now });
  const matched = await client.post("/api/v1/payment-settlements", { branchId: "branch-a", provider: "CASHFREE", settlementReference: "settlement-1", currency: "INR", entries: [
    { providerEntryId: "entry-payment", type: "PAYMENT", financialReference: "provider-pay-1", amountMinor: "118000" },
    { providerEntryId: "entry-fee", type: "FEE", amountMinor: "2000" },
    { providerEntryId: "entry-tax", type: "TAX", amountMinor: "360" },
    { providerEntryId: "entry-bank", type: "BANK_CREDIT", amountMinor: "115640" },
  ] }, { idempotencyKey: "settlement-1", now });
  assert.equal(matched.status, 201); assert.equal(matched.body.reconciliation.status, "MATCHED");
  assert.deepEqual(matched.body.reconciliation.totals, { grossMinor: "118000", feesMinor: "2000", taxMinor: "360", refundsMinor: "0", chargebacksMinor: "0", expectedNetMinor: "115640", bankNetMinor: "115640" });
  const unresolved = await client.post("/api/v1/payment-settlements", { branchId: "branch-a", provider: "CASHFREE", settlementReference: "settlement-2", currency: "INR", entries: [
    { providerEntryId: "duplicate-entry", type: "PAYMENT", financialReference: "missing-payment", amountMinor: "1000" },
    { providerEntryId: "duplicate-entry", type: "REFUND", financialReference: "missing-refund", amountMinor: "100" },
    { providerEntryId: "chargeback-entry", type: "CHARGEBACK", financialReference: "missing-chargeback", amountMinor: "50" },
    { providerEntryId: "bank-entry", type: "BANK_CREDIT", amountMinor: "850" },
  ] }, { idempotencyKey: "settlement-2", now });
  assert.equal(unresolved.body.reconciliation.status, "UNRESOLVED");
  assert.deepEqual(unresolved.body.reconciliation.issues.map((issue: any) => issue.kind).sort(), ["DUPLICATE_ENTRY", "UNMATCHED_ENTRY", "UNMATCHED_ENTRY", "UNMATCHED_ENTRY"].sort());
});

test("RED/GREEN: payment storage contracts force tenant/branch RLS, exact append-only ledgers, unique effects, concurrency and durable workers", async () => {
  const payments = api();
  assert.equal((await payments.signIn("other").post("/api/v1/advances", { branchId: "branch-a", customerId: "customer-1", visitId: "visit-1", jobId: "job-20", invoiceId: "invoice-20", amountMinor: "1", currency: "INR", mode: "CASH", externalReference: "cross", evidenceRef: "private/tenant-b/payments/x.jpg" }, { idempotencyKey: "cross", now })).status, 403);
  const sql = await readFile(new URL("../db/migrations/020_payments_settlements.sql", import.meta.url), "utf8");
  for (const table of ["financial_event", "cashfree_payment_link", "cashfree_webhook_evidence", "customer_credit_policy", "credit_exception", "payment_correction", "payment_settlement", "payment_command_receipt", "payment_worker_effect"]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(sql, /amount_minor bigint/i); assert.match(sql, /reject_payment_append_only_mutation/i);
  assert.match(sql, /UNIQUE \(tenant_id, external_reference\)/i); assert.match(sql, /payload_fingerprint char\(64\)/i);
  assert.match(sql, /FOR UPDATE/i); assert.match(sql, /SKIP LOCKED/i); assert.match(sql, /UNIQUE \(tenant_id, effect_key\)/i);
});
