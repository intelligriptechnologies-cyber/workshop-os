import { strict as assert } from "node:assert";
import test from "node:test";
import { canReplaceRemoteInvoice, canVoidRemoteInvoice, isActiveRemoteInvoice, remoteDocumentFilename, requiresInvoiceReplacement } from "../src/finance-ui";

test("online finance exposes a void only for an unpaid immutable invoice", () => {
  assert.equal(canVoidRemoteInvoice({ status: "UNPAID", voided: false, paidPaise: 0 }), true);
  assert.equal(canVoidRemoteInvoice({ status: "PARTIAL", voided: false, paidPaise: 1 }), false);
  assert.equal(canVoidRemoteInvoice({ status: "VOID", voided: true, paidPaise: 0 }), false);
});

test("replacement is a new document only after a void and without an active invoice", () => {
  assert.equal(canReplaceRemoteInvoice({ status: "VOID", voided: true }, false), true);
  assert.equal(canReplaceRemoteInvoice({ status: "VOID", voided: true }, true), false);
  assert.equal(canReplaceRemoteInvoice({ status: "CREDITED", voided: false }, false), true);
  assert.equal(isActiveRemoteInvoice({ status: "CREDITED", voided: false }), false);
  assert.equal(requiresInvoiceReplacement([{ status: "CREDITED", voided: false }]), true);
  assert.equal(remoteDocumentFilename("INV-FY2026-27-00001"), "INV-FY2026-27-00001.html");
});
