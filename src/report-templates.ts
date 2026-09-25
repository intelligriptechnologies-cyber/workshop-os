import DOMPurify from "dompurify";
import type { WorkshopBusinessSettings } from "./admin-demo-state";
import type { JobView } from "./types";
import { DAMAGE_SLOT } from "./job-sheet";

export type ReportCategory = "estimate" | "invoice" | "gate-pass" | "job-card" | "payment-receipt";

export interface ReportTemplate {
  id: string;
  category: ReportCategory;
  name: string;
  html: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyAssets {
  logo: string | null;
  stamp: string | null;
  authorizedSignature: string | null;
}

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  estimate: "Estimate",
  invoice: "Invoice",
  "gate-pass": "Gate Pass",
  "job-card": "Job Card",
  "payment-receipt": "Receipt",
};

const COMMON_PLACEHOLDERS = [
  "company.name", "company.legal_name", "company.address", "company.phone", "company.email", "company.gstin", "company.footer",
  "report.title", "report.number", "report.date",
  "job.number", "job.status", "job.sub_status", "job.work_list",
  "customer.name", "customer.mobile", "customer.type",
  "vehicle.registration", "vehicle.description", "vehicle.make", "vehicle.model", "vehicle.color", "vehicle.km",
  "dates.received", "dates.promised", "dates.delivered",
  "staff.advisor", "staff.technician",
  "blocks.company_logo", "blocks.authorized_signature",
  "company.logo", "company.signature",
] as const;

/** Keys available inside a {{#lines}}...{{/lines}} loop. */
export const LINE_PLACEHOLDERS = ["line.kind", "line.description", "line.qty", "line.rate", "line.amount"] as const;
export type ReportLine = Record<"kind" | "description" | "qty" | "rate" | "amount", string>;

const CATEGORY_PLACEHOLDERS: Record<ReportCategory, readonly string[]> = {
  estimate: ["estimate.total", "blocks.line_items", "blocks.company_stamp", "company.stamp"],
  invoice: ["company.bank_account_holder", "company.bank_name", "company.bank_account_number", "company.bank_ifsc", "company.bank_branch", "company.upi_id", "invoice.total", "invoice.paid", "invoice.balance", "blocks.line_items", "blocks.payments", "blocks.payment_details", "blocks.company_stamp", "company.stamp"],
  "gate-pass": ["invoice.status", "blocks.tasks", "blocks.qc_rows", "blocks.company_stamp"],
  "job-card": ["blocks.line_items", "blocks.tasks", "blocks.qc_rows", "blocks.damage_diagram"],
  "payment-receipt": ["receipt.number", "invoice.total", "invoice.paid", "invoice.balance", "blocks.payments", "blocks.company_stamp"],
};

export const REPORT_PLACEHOLDERS: Record<ReportCategory, readonly string[]> = Object.fromEntries(
  (Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => [category, [...COMMON_PLACEHOLDERS, ...CATEGORY_PLACEHOLDERS[category]]]),
) as unknown as Record<ReportCategory, readonly string[]>;

const DEFAULT_TEMPLATE_HTML: Record<ReportCategory, string> = {
  estimate: `<main style="font-family:Arial,sans-serif;color:#17202a"><header style="background:#0f766e;color:#fff;padding:22px 28px;display:flex;justify-content:space-between;align-items:center;gap:16px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto"><h1 style="margin:0;font-size:28px">ESTIMATE</h1><p style="margin:4px 0 0">{{report.number}} · {{report.date}}</p></div></header><div style="padding:24px 28px"><section><h2 style="margin:0">{{company.name}}</h2><p>{{company.address}} · {{company.phone}} · {{company.email}}<br>GSTIN: {{company.gstin}}</p></section><section style="display:flex;justify-content:space-between"><p><strong>Prepared for</strong><br>{{customer.name}}<br>{{customer.mobile}}</p><p><strong>Vehicle</strong><br>{{vehicle.registration}}<br>{{vehicle.description}}</p></section><table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr><th style="background:#0f766e;color:#fff;padding:7px;text-align:left">Description</th><th style="background:#0f766e;color:#fff;padding:7px;text-align:right">Qty</th><th style="background:#0f766e;color:#fff;padding:7px;text-align:right">Rate</th><th style="background:#0f766e;color:#fff;padding:7px;text-align:right">Amount</th></tr></thead><tbody>{{#lines}}<tr><td style="border-bottom:1px solid #cbd5e1;padding:7px">{{line.description}}</td><td style="border-bottom:1px solid #cbd5e1;padding:7px;text-align:right">{{line.qty}}</td><td style="border-bottom:1px solid #cbd5e1;padding:7px;text-align:right">{{line.rate}}</td><td style="border-bottom:1px solid #cbd5e1;padding:7px;text-align:right">{{line.amount}}</td></tr>{{/lines}}</tbody></table><p style="text-align:right">Estimated total (incl. GST): <strong>{{estimate.total}}</strong></p><p>Valid for 7 days from the date above.</p><footer style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px">{{blocks.company_stamp}}{{blocks.authorized_signature}}</footer><p style="border-top:1px solid #cbd5e1;margin-top:16px;padding-top:8px;font-size:12px;color:#475569">{{company.footer}}</p></div></main>`,
  invoice: `<main style="font-family:Arial,sans-serif;color:#17202a;padding:28px"><header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;border-bottom:3px solid #0f766e;padding-bottom:16px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto;max-width:100%"><h1 style="margin:0;font-size:30px">INVOICE</h1><p>{{report.number}}<br>{{report.date}}</p></div></header><section><h2>{{company.name}}</h2><p>{{company.address}} · {{company.phone}} · {{company.email}}<br>GSTIN: {{company.gstin}}</p></section><section style="display:flex;justify-content:space-between"><p><strong>Bill to</strong><br>{{customer.name}}<br>{{customer.mobile}}</p><p><strong>Vehicle</strong><br>{{vehicle.registration}}<br>{{vehicle.description}}</p></section>{{blocks.line_items}}<section style="text-align:right"><p>Total: <strong>{{invoice.total}}</strong><br>Paid: {{invoice.paid}}<br>Balance: {{invoice.balance}}</p></section>{{blocks.payments}}{{blocks.payment_details}}<footer style="display:flex;justify-content:flex-end;gap:28px;margin-top:40px">{{blocks.company_stamp}}{{blocks.authorized_signature}}</footer><p style="border-top:1px solid #cbd5e1;margin-top:16px;padding-top:8px;font-size:12px;color:#475569">{{company.footer}}</p></main>`,
  "gate-pass": `<main style="font-family:Arial,sans-serif;color:#17202a;padding:28px"><header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;border-bottom:3px solid #2563eb;padding-bottom:14px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto;max-width:100%"><h1 style="margin:0;font-size:30px">GATE PASS</h1><p>{{report.number}}</p></div></header><h2>{{company.name}}</h2><p><strong>Job:</strong> {{job.number}} · <strong>Date:</strong> {{report.date}}</p><p><strong>Customer:</strong> {{customer.name}} · {{customer.mobile}}</p><p><strong>Vehicle:</strong> {{vehicle.registration}} · {{vehicle.description}} · {{vehicle.km}} km</p><h3>Completed work</h3><p>{{job.work_list}}</p><h3>Tasks</h3>{{blocks.tasks}}<h3>Quality checks</h3>{{blocks.qc_rows}}<p><strong>Payment:</strong> {{invoice.status}}</p><footer style="display:flex;justify-content:space-between;align-items:end;margin-top:42px"><p>Customer acknowledgement<br><br>____________________</p><div>{{blocks.company_stamp}}{{blocks.authorized_signature}}</div></footer><p style="border-top:1px solid #cbd5e1;margin-top:16px;padding-top:8px;font-size:12px;color:#475569">{{company.footer}}</p></main>`,
  "job-card": `<main style="font-family:Arial,sans-serif;color:#17202a;padding:28px"><header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;border-bottom:3px solid #7c3aed;padding-bottom:14px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto;max-width:100%"><h1 style="margin:0;font-size:30px">JOB CARD</h1><p>{{job.number}}</p></div></header><h2>{{company.name}}</h2><section style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><p><strong>Customer</strong><br>{{customer.name}} · {{customer.mobile}}</p><p><strong>Vehicle</strong><br>{{vehicle.registration}} · {{vehicle.description}}</p><p><strong>Received</strong><br>{{dates.received}}</p><p><strong>Promised</strong><br>{{dates.promised}}</p><p><strong>Advisor</strong><br>{{staff.advisor}}</p><p><strong>Technician</strong><br>{{staff.technician}}</p></section><h3>Requested / approved work</h3><p>{{job.work_list}}</p>{{blocks.line_items}}<h3>Vehicle damage</h3>{{blocks.damage_diagram}}<h3>Tasks</h3>{{blocks.tasks}}<h3>Quality checks</h3>{{blocks.qc_rows}}<footer style="display:flex;justify-content:flex-end;margin-top:36px">{{blocks.authorized_signature}}</footer><p style="border-top:1px solid #cbd5e1;margin-top:16px;padding-top:8px;font-size:12px;color:#475569">{{company.footer}}</p></main>`,
  "payment-receipt": `<main style="font-family:Arial,sans-serif;color:#17202a;padding:28px"><header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;border-bottom:3px solid #15803d;padding-bottom:14px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto;max-width:100%"><h1 style="margin:0;font-size:28px">PAYMENT RECEIPT</h1><p>{{receipt.number}}<br>{{report.date}}</p></div></header><h2>{{company.name}}</h2><p>{{company.address}} · {{company.phone}}</p><p>Received from <strong>{{customer.name}}</strong> for job <strong>{{job.number}}</strong> / vehicle <strong>{{vehicle.registration}}</strong>.</p>{{blocks.payments}}<section style="text-align:right"><p>Invoice total: {{invoice.total}}<br>Total paid: <strong>{{invoice.paid}}</strong><br>Balance: {{invoice.balance}}</p></section><footer style="display:flex;justify-content:flex-end;gap:28px;margin-top:40px">{{blocks.company_stamp}}{{blocks.authorized_signature}}</footer><p style="border-top:1px solid #cbd5e1;margin-top:16px;padding-top:8px;font-size:12px;color:#475569">{{company.footer}}</p></main>`,
};

export function seedReportTemplates(now: Date | string = new Date()): ReportTemplate[] {
  const timestamp = new Date(now).toISOString();
  return (Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => ({
    id: `template-${category}-default`, category, name: `Standard ${REPORT_CATEGORY_LABELS[category]}`,
    html: DEFAULT_TEMPLATE_HTML[category], active: true, createdAt: timestamp, updatedAt: timestamp,
  }));
}

const LOOP_PATTERN = /{{\s*#lines\s*}}([\s\S]*?){{\s*\/lines\s*}}/g;
const namesIn = (html: string) => [...html.matchAll(/{{\s*([^{}]+?)\s*}}/g)].map((match) => match[1].trim());

/** Returns every merge key that is not allow-listed. Line keys are valid only inside a {{#lines}} loop; the loop cannot nest. */
export function findUnsupportedPlaceholders(html: string, category: ReportCategory): string[] {
  const allowed = new Set<string>(REPORT_PLACEHOLDERS[category]);
  const inLoop = new Set<string>([...allowed, ...LINE_PLACEHOLDERS]);
  const loops = [...html.matchAll(LOOP_PATTERN)].map((match) => match[1]);
  const outside = html.replace(LOOP_PATTERN, "");
  const found = [...namesIn(outside).filter((name) => !allowed.has(name)), ...loops.flatMap((body) => namesIn(body).filter((name) => !inLoop.has(name)))];
  return [...new Set(found)].sort();
}

const escapeHtml = (value: unknown) => String(value ?? "—").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const value = (input: string | number | null | undefined) => input === null || input === undefined || String(input).trim() === "" ? "—" : String(input);
const money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
const date = (input?: string) => {
  if (!input?.trim()) return "—";
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? input : parsed.toLocaleDateString("en-IN");
};
const IMAGE_SRC = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/;
const imageBlock = (src: string | null, alt: string) => src && IMAGE_SRC.test(src) ? `<img src="${src}" alt="${escapeHtml(alt)}" style="display:block;max-width:150px;max-height:78px;object-fit:contain">` : "";

function table(headers: string[], rows: Array<Array<string | number>>) {
  if (!rows.length) return "<p>—</p>";
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr>${headers.map((header) => `<th style="border:1px solid #cbd5e1;background:#f1f5f9;padding:7px;text-align:left">${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #cbd5e1;padding:7px">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function paymentDetailsBlock(settings: WorkshopBusinessSettings) {
  const rows = [
    ["GSTIN", settings.billing.gstin],
    ["Account holder", settings.billing.bankAccountHolder],
    ["Bank", settings.billing.bankName],
    ["Account number", settings.billing.bankAccountNumber],
    ["IFSC", settings.billing.bankIfsc],
    ["Branch", settings.billing.bankBranch],
    ["UPI ID", settings.billing.upiId],
  ].filter((row) => row[1].trim());
  if (!rows.length) return "";
  return `<section style="margin-top:20px"><h3>Tax &amp; Payment Details</h3>${table(["Detail", "Value"], rows)}</section>`;
}

export function reportAvailable(category: ReportCategory, view: JobView) {
  if (category === "estimate") return Boolean(view.estimate);
  if (category === "invoice") return Boolean(view.invoice && !view.invoice.voided_at && view.invoice.document_available !== 0);
  if (category === "gate-pass") return Boolean(view.invoice && view.gate_pass && !view.gate_pass.voided_at && view.gate_pass.invoice_id === view.invoice.id);
  if (category === "payment-receipt") return Boolean(view.invoice && view.receipt && !view.receipt.voided_at && view.receipt.invoice_id === view.invoice.id && view.payments.some((payment) => payment.invoice_id === view.invoice!.id));
  return Boolean(view.job);
}

export function buildReportValues(category: ReportCategory, view: JobView, settings: WorkshopBusinessSettings, assets: CompanyAssets): Record<string, string> {
  const reportItems = category === "invoice" || category === "payment-receipt" ? view.invoice_items ?? view.estimate_items : view.estimate_items;
  const subtotal = reportItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const discount = category === "invoice" || category === "payment-receipt" ? view.invoice?.discount ?? 0 : view.estimate?.discount ?? 0;
  const gst = Math.max(0, subtotal - discount) * (category === "invoice" || category === "payment-receipt" ? view.invoice?.gst_rate ?? settings.billing.defaultGstPercent : view.estimate?.gst_rate ?? settings.billing.defaultGstPercent) / 100;
  const invoiceTotal = view.invoice?.total ?? subtotal - discount + gst;
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const reportNumber = category === "invoice" ? view.invoice?.invoice_no : category === "estimate" ? `EST-${view.job.job_no}` : category === "gate-pass" ? view.gate_pass?.gate_pass_no : category === "payment-receipt" ? view.receipt?.receipt_no : view.job.job_no;
  return {
    "company.name": value(settings.profile.businessName), "company.legal_name": value(settings.profile.legalName), "company.address": value(settings.profile.address),
    "company.phone": value(settings.profile.phone), "company.email": value(settings.profile.email), "company.gstin": value(settings.billing.gstin), "company.footer": value(settings.profile.footer),
    "company.bank_account_holder": value(settings.billing.bankAccountHolder), "company.bank_name": value(settings.billing.bankName), "company.bank_account_number": value(settings.billing.bankAccountNumber),
    "company.bank_ifsc": value(settings.billing.bankIfsc), "company.bank_branch": value(settings.billing.bankBranch), "company.upi_id": value(settings.billing.upiId),
    "report.title": REPORT_CATEGORY_LABELS[category], "report.number": value(reportNumber), "report.date": date(view.invoice?.created_at ?? view.visit.received_at),
    "job.number": value(view.job.job_no), "job.status": value(view.job.main_status), "job.sub_status": value(view.job.sub_status), "job.work_list": value(view.job.work_list || view.visit.requested_work),
    "customer.name": value(view.customer.name), "customer.mobile": value(view.customer.mobile), "customer.type": value(view.customer.type),
    "vehicle.registration": value(view.vehicle.number), "vehicle.description": value(`${view.vehicle.make} ${view.vehicle.model}`.trim()), "vehicle.make": value(view.vehicle.make), "vehicle.model": value(view.vehicle.model), "vehicle.color": value(view.vehicle.color), "vehicle.km": value(view.job.final_km ?? view.vehicle.km),
    "dates.received": date(view.visit.received_at), "dates.promised": date(view.job.promised_at), "dates.delivered": date(view.job.closed_at || view.job.delivery_by),
    "staff.advisor": value(view.advisor.name), "staff.technician": value(view.technician.name),
    "invoice.status": value(view.invoice?.status), "blocks.damage_diagram": DAMAGE_SLOT, "invoice.total": money(invoiceTotal), "invoice.paid": money(paid), "invoice.balance": money(Math.max(0, invoiceTotal - paid)), "receipt.number": value(view.receipt?.receipt_no),
    "blocks.company_logo": imageBlock(assets.logo, "Company logo"), "blocks.company_stamp": imageBlock(assets.stamp, "Company stamp"), "blocks.authorized_signature": imageBlock(assets.authorizedSignature, "Authorized signature"),
    "company.logo": imageBlock(assets.logo, "Company logo"), "company.stamp": imageBlock(assets.stamp, "Company stamp"), "company.signature": imageBlock(assets.authorizedSignature, "Authorized signature"),
    "estimate.total": money(subtotal - discount + gst),
    "blocks.line_items": table(["Type", "Description", "Qty", "Rate", "Amount"], reportItems.map((item) => [item.kind, item.description, item.qty, money(item.rate), money(item.qty * item.rate)])),
    "blocks.payment_details": category === "invoice" ? paymentDetailsBlock(settings) : "",
    "blocks.payments": table(["Date", "Mode", "Reference", "Amount"], view.payments.map((payment) => [date(payment.created_at), payment.mode, value(payment.reference), money(payment.amount)])),
    "blocks.tasks": table(["Task", "Status", "Notes"], view.tasks.map((task) => [task.title, task.status, value(task.notes)])),
    "blocks.qc_rows": table(["Check", "Result"], view.qc_checks.map((check) => [check.label, check.passed ? "Pass" : value(check.fail_reason || "Pending")])),
  };
}

/** Rows for the {{#lines}} loop, from the same items the report tables use. */
export function buildReportLines(category: ReportCategory, view: JobView): ReportLine[] {
  const items = category === "invoice" || category === "payment-receipt" ? view.invoice_items ?? view.estimate_items : view.estimate_items;
  return items.map((item) => ({ kind: value(item.kind), description: value(item.description), qty: String(item.qty), rate: money(item.rate), amount: money(item.qty * item.rate) }));
}

export function sampleReportLines(): ReportLine[] {
  return [
    { kind: "Service", description: "Ceramic coating", qty: "1", rate: "₹8,000.00", amount: "₹8,000.00" },
    { kind: "Service", description: "Interior detailing", qty: "1", rate: "₹2,000.00", amount: "₹2,000.00" },
  ];
}

export function sampleReportValues(category: ReportCategory): Record<string, string> {
  const scalar: Record<string, string> = Object.fromEntries(REPORT_PLACEHOLDERS[category].map((name) => [name, `Sample ${name.split(".").at(-1)?.replaceAll("_", " ")}`]));
  return {
    ...scalar,
    "company.name": "WorkshopOS Demo Studio", "company.legal_name": "WorkshopOS Automotive Services", "company.address": "Bhubaneswar, Odisha", "company.phone": "+91 98765 43210", "company.email": "hello@workshopos.demo", "company.gstin": "21ABCDE1234F1Z5", "company.footer": "Thank you for your business.", "estimate.total": "₹11,800.00",
    "company.logo": `<div style="font-weight:bold;font-size:20px;color:#0f766e">WorkshopOS</div>`, "company.stamp": `<div style="border:2px solid #15803d;border-radius:50%;padding:15px;color:#15803d">STAMP</div>`, "company.signature": `<div style="min-width:140px;text-align:center"><em>Authorized signature</em><hr></div>`,
    "company.bank_account_holder": "WorkshopOS Automotive Services", "company.bank_name": "State Bank of India", "company.bank_account_number": "001234567890", "company.bank_ifsc": "SBIN0001234", "company.bank_branch": "Bhubaneswar Main Branch", "company.upi_id": "workshopos@sbi",
    "report.title": REPORT_CATEGORY_LABELS[category], "report.number": category === "invoice" ? "INV-2026-0042" : category === "gate-pass" ? "GP-2026-0042" : category === "payment-receipt" ? "REC-2026-0042" : "JC-2026-0042", "report.date": "24/09/2026",
    "job.number": "JC-2026-0042", "job.status": "COMPLETED", "job.sub_status": "Invoice Ready", "job.work_list": "Ceramic coating and interior detailing",
    "customer.name": "Aarav Sharma", "customer.mobile": "98765 00042", "customer.type": "Individual", "vehicle.registration": "OD02AB0042", "vehicle.description": "Honda City", "vehicle.make": "Honda", "vehicle.model": "City", "vehicle.color": "White", "vehicle.km": "42,125",
    "dates.received": "22/09/2026", "dates.promised": "24/09/2026", "dates.delivered": "24/09/2026", "staff.advisor": "Meera Das", "staff.technician": "Rohan Singh",
    "invoice.status": "Cleared", "blocks.damage_diagram": DAMAGE_SLOT, "invoice.total": "₹11,800.00", "invoice.paid": "₹8,000.00", "invoice.balance": "₹3,800.00", "receipt.number": "REC-2026-0042",
    "blocks.company_logo": `<div style="font-weight:bold;font-size:20px;color:#0f766e">WorkshopOS</div>`, "blocks.company_stamp": `<div style="border:2px solid #15803d;border-radius:50%;padding:15px;color:#15803d">STAMP</div>`, "blocks.authorized_signature": `<div style="min-width:140px;text-align:center"><em>Authorized signature</em><hr></div>`,
    "blocks.line_items": table(["Type", "Description", "Qty", "Rate", "Amount"], [["Service", "Ceramic coating", 1, "₹8,000.00", "₹8,000.00"], ["Service", "Interior detailing", 1, "₹2,000.00", "₹2,000.00"]]),
    "blocks.payments": table(["Date", "Mode", "Reference", "Amount"], [["24/09/2026", "UPI", "UPI-0042", "₹8,000.00"]]),
    "blocks.payment_details": `<section><h3>Tax &amp; Payment Details</h3>${table(["Detail", "Value"], [["GSTIN", "21ABCDE1234F1Z5"], ["Bank", "State Bank of India"], ["UPI ID", "workshopos@sbi"]])}</section>`,
    "blocks.tasks": table(["Task", "Status", "Notes"], [["Ceramic coating", "Completed", "Final coat cured"], ["Interior detailing", "Completed", "Quality checked"]]),
    "blocks.qc_rows": table(["Check", "Result"], [["Surface finish", "Pass"], ["Customer items", "Pass"]]),
  };
}

const SAFE_ELEMENTS = new Set(["A", "ARTICLE", "ASIDE", "B", "BLOCKQUOTE", "BR", "CAPTION", "CODE", "COL", "COLGROUP", "DIV", "EM", "FIGCAPTION", "FIGURE", "FOOTER", "H1", "H2", "H3", "H4", "HEADER", "HR", "I", "IMG", "LI", "MAIN", "OL", "P", "SECTION", "SMALL", "SPAN", "STRONG", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "U", "UL"]);
const DROP_WITH_CONTENT = new Set(["SCRIPT", "IFRAME", "FRAME", "FRAMESET", "FORM", "INPUT", "BUTTON", "TEXTAREA", "SELECT", "OPTION", "OBJECT", "EMBED", "META", "LINK", "BASE", "SVG", "MATH", "STYLE"]);

export function sanitizeReportHtml(input: string): string {
  const html = DOMPurify.isSupported
    ? DOMPurify.sanitize(input, { ALLOWED_TAGS: [...SAFE_ELEMENTS].map((tag) => tag.toLowerCase()), ALLOWED_ATTR: ["class", "title", "alt", "colspan", "rowspan", "width", "height", "style", "href", "src"], ALLOW_DATA_ATTR: false })
    : input;
  if (typeof DOMParser === "undefined") return html;
  const document = new DOMParser().parseFromString(html, "text/html");
  for (const element of [...document.body.querySelectorAll("*")]) {
    if (DROP_WITH_CONTENT.has(element.tagName)) { element.remove(); continue; }
    if (!SAFE_ELEMENTS.has(element.tagName)) { element.replaceWith(...element.childNodes); continue; }
    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase();
      const raw = attribute.value.trim();
      const allowed = ["class", "title", "alt", "colspan", "rowspan", "width", "height", "style"].includes(name)
        || (element.tagName === "A" && name === "href") || (element.tagName === "IMG" && name === "src");
      if (!allowed || name.startsWith("on")) { element.removeAttribute(attribute.name); continue; }
      if (name === "style" && /url\s*\(|expression\s*\(|@import|javascript:/i.test(raw)) element.removeAttribute(attribute.name);
      if (name === "href" && !/^(#|mailto:|tel:)/i.test(raw)) element.removeAttribute(attribute.name);
      if (name === "src" && !/^data:image\/(png|jpeg);base64,/i.test(raw)) element.removeAttribute(attribute.name);
    }
    if (element.tagName === "A") element.setAttribute("rel", "noopener noreferrer");
  }
  return document.body.innerHTML;
}

/** Merge: expand {{#lines}} rows, substitute allow-listed keys (scalars escaped, generated blocks trusted), then sanitise. */
export function renderReportTemplate(template: Pick<ReportTemplate, "html" | "category">, values: Record<string, string>, lines: readonly ReportLine[] = []): string {
  const unsupported = findUnsupportedPlaceholders(template.html, template.category);
  if (unsupported.length) throw new Error(`Unsupported placeholders: ${unsupported.join(", ")}`);
  const blockNames = new Set(Object.keys(values).filter((name) => name.startsWith("blocks.") || name === "company.logo" || name === "company.stamp" || name === "company.signature"));
  const scalar = (text: string) => text.replace(/{{\s*([^{}]+?)\s*}}/g, (_match, rawName: string) => {
    const name = rawName.trim();
    const replacement = values[name] ?? "—";
    return blockNames.has(name) ? replacement : escapeHtml(replacement);
  });
  const expanded = template.html.replace(LOOP_PATTERN, (_match, body: string) => lines
    .map((line) => scalar(body.replace(/{{\s*line\.(kind|description|qty|rate|amount)\s*}}/g, (_m, key: keyof ReportLine) => escapeHtml(line[key]))))
    .join(""));
  return sanitizeReportHtml(scalar(expanded));
}

export const PRINT_CSP = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; frame-src 'none'; connect-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'";

export function buildPrintDocument(title: string, bodyHtml: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${PRINT_CSP}"><title>${escapeHtml(title)}</title><style>@page{size:A4;margin:12mm}html,body{margin:0;background:white}body{font-family:Arial,sans-serif}img{max-width:100%;height:auto}table{page-break-inside:auto}tr{page-break-inside:avoid}@media print{button{display:none}}</style></head><body>${bodyHtml}</body></html>`;
}
