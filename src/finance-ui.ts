import type { RemoteInvoice } from "./finance-api";

/** The browser only exposes actions that the immutable finance API can accept. */
export function canVoidRemoteInvoice(invoice: Pick<RemoteInvoice, "status" | "voided" | "paidPaise">): boolean {
  return !invoice.voided && invoice.status === "UNPAID" && invoice.paidPaise === 0;
}

/** A replacement must be tied to an existing void; it is never an edit. */
export function canReplaceRemoteInvoice(invoice: Pick<RemoteInvoice, "status" | "voided">, hasActiveInvoice: boolean): boolean {
  return invoice.voided && invoice.status === "VOID" && !hasActiveInvoice;
}

export function remoteDocumentFilename(number: string): string {
  return `${number}.html`;
}
