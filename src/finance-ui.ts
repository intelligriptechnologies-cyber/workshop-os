import type { RemoteInvoice } from "./finance-api";

/** The browser only exposes actions that the immutable finance API can accept. */
export function canVoidRemoteInvoice(invoice: Pick<RemoteInvoice, "status" | "voided" | "paidPaise">): boolean {
  return !invoice.voided && invoice.status === "UNPAID" && invoice.paidPaise === 0;
}

/** A fully credited invoice has no outstanding commercial claim. */
export function isActiveRemoteInvoice(invoice: Pick<RemoteInvoice, "status" | "voided">): boolean {
  return !invoice.voided && invoice.status !== "CREDITED";
}

export function requiresInvoiceReplacement(invoices: readonly Pick<RemoteInvoice, "status" | "voided">[]): boolean {
  return invoices.length > 0 && !invoices.some(isActiveRemoteInvoice);
}

/** A replacement must be tied to an existing void; it is never an edit. */
export function canReplaceRemoteInvoice(invoice: Pick<RemoteInvoice, "status" | "voided">, hasActiveInvoice: boolean): boolean {
  return (invoice.voided && invoice.status === "VOID" || invoice.status === "CREDITED") && !hasActiveInvoice;
}

export function remoteDocumentFilename(number: string): string {
  return `${number}.html`;
}
