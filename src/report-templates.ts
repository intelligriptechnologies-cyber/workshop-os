import type { WorkshopBusinessSettings } from "./admin-demo-state";
import type { JobView } from "./types";

export type ReportCategory = "invoice" | "gate-pass" | "job-card" | "payment-receipt";

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
  invoice: "Invoice",
  "gate-pass": "Gate Pass",
  "job-card": "Job Card",
  "payment-receipt": "Payment Receipt",
};

const COMMON_PLACEHOLDERS = [
  "company.name", "company.legal_name", "company.address", "company.phone", "company.email", "company.gstin",
  "report.title", "report.number", "report.date",
  "job.number", "job.status", "job.sub_status", "job.work_list",
  "customer.name", "customer.mobile", "customer.type",
  "vehicle.registration", "vehicle.description", "vehicle.make", "vehicle.model", "vehicle.color", "vehicle.km",
  "dates.received", "dates.promised", "dates.delivered",
  "staff.advisor", "staff.technician",
  "blocks.company_logo", "blocks.authorized_signature",
] as const;

const CATEGORY_PLACEHOLDERS: Record<ReportCategory, readonly string[]> = {
  invoice: ["company.bank_account_holder", "company.bank_name", "company.bank_account_number", "company.bank_ifsc", "company.bank_branch", "company.upi_id", "invoice.total", "invoice.paid", "invoice.balance", "blocks.line_items", "blocks.payments", "blocks.payment_details", "blocks.company_stamp"],
  "gate-pass": ["invoice.total", "invoice.paid", "invoice.balance", "blocks.tasks", "blocks.qc_rows", "blocks.company_stamp"],
  "job-card": ["blocks.line_items", "blocks.tasks", "blocks.qc_rows"],
  "payment-receipt": ["receipt.number", "invoice.total", "invoice.paid", "invoice.balance", "blocks.payments", "blocks.company_stamp"],
};

export const REPORT_PLACEHOLDERS: Record<ReportCategory, readonly string[]> = Object.fromEntries(
  (Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => [category, [...COMMON_PLACEHOLDERS, ...CATEGORY_PLACEHOLDERS[category]]]),
) as unknown as Record<ReportCategory, readonly string[]>;

const DEFAULT_TEMPLATE_HTML: Record<ReportCategory, string> = {
  invoice: `<main style="font-family:Arial,sans-serif;color:#17202a;padding:28px"><header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;border-bottom:3px solid #0f766e;padding-bottom:16px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto;max-width:100%"><h1 style="margin:0;font-size:30px">INVOICE</h1><p>{{report.number}}<br>{{report.date}}</p></div></header><section><h2>{{company.name}}</h2><p>{{company.address}} · {{company.phone}} · {{company.email}}<br>GSTIN: {{company.gstin}}</p></section><section style="display:flex;justify-content:space-between"><p><strong>Bill to</strong><br>{{customer.name}}<br>{{customer.mobile}}</p><p><strong>Vehicle</strong><br>{{vehicle.registration}}<br>{{vehicle.description}}</p></section>{{blocks.line_items}}<section style="text-align:right"><p>Total: <strong>{{invoice.total}}</strong><br>Paid: {{invoice.paid}}<br>Balance: {{invoice.balance}}</p></section>{{blocks.payments}}{{blocks.payment_details}}<footer style="display:flex;justify-content:flex-end;gap:28px;margin-top:40px">{{blocks.company_stamp}}{{blocks.authorized_signature}}</footer></main>`,
  "gate-pass": `<main style="font-family:Arial,sans-serif;color:#17202a;padding:28px"><header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;border-bottom:3px solid #2563eb;padding-bottom:14px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto;max-width:100%"><h1 style="margin:0;font-size:30px">GATE PASS</h1><p>{{report.number}}</p></div></header><h2>{{company.name}}</h2><p><strong>Job:</strong> {{job.number}} · <strong>Date:</strong> {{report.date}}</p><p><strong>Customer:</strong> {{customer.name}} · {{customer.mobile}}</p><p><strong>Vehicle:</strong> {{vehicle.registration}} · {{vehicle.description}} · {{vehicle.km}} km</p><h3>Completed work</h3><p>{{job.work_list}}</p><h3>Tasks</h3>{{blocks.tasks}}<h3>Quality checks</h3>{{blocks.qc_rows}}<p><strong>Payment:</strong> {{invoice.paid}} paid · {{invoice.balance}} balance</p><footer style="display:flex;justify-content:space-between;align-items:end;margin-top:42px"><p>Customer acknowledgement<br><br>____________________</p><div>{{blocks.company_stamp}}{{blocks.authorized_signature}}</div></footer></main>`,
  "job-card": `<main style="font-family:Arial,sans-serif;color:#17202a;padding:28px"><header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;border-bottom:3px solid #7c3aed;padding-bottom:14px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto;max-width:100%"><h1 style="margin:0;font-size:30px">JOB CARD</h1><p>{{job.number}}</p></div></header><h2>{{company.name}}</h2><section style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><p><strong>Customer</strong><br>{{customer.name}} · {{customer.mobile}}</p><p><strong>Vehicle</strong><br>{{vehicle.registration}} · {{vehicle.description}}</p><p><strong>Received</strong><br>{{dates.received}}</p><p><strong>Promised</strong><br>{{dates.promised}}</p><p><strong>Advisor</strong><br>{{staff.advisor}}</p><p><strong>Technician</strong><br>{{staff.technician}}</p></section><h3>Requested / approved work</h3><p>{{job.work_list}}</p>{{blocks.line_items}}<h3>Tasks</h3>{{blocks.tasks}}<h3>Quality checks</h3>{{blocks.qc_rows}}<footer style="display:flex;justify-content:flex-end;margin-top:36px">{{blocks.authorized_signature}}</footer></main>`,
  "payment-receipt": `<main style="font-family:Arial,sans-serif;color:#17202a;padding:28px"><header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;border-bottom:3px solid #15803d;padding-bottom:14px">{{blocks.company_logo}}<div style="text-align:right;margin-left:auto;max-width:100%"><h1 style="margin:0;font-size:28px">PAYMENT RECEIPT</h1><p>{{receipt.number}}<br>{{report.date}}</p></div></header><h2>{{company.name}}</h2><p>{{company.address}} · {{company.phone}}</p><p>Received from <strong>{{customer.name}}</strong> for job <strong>{{job.number}}</strong> / vehicle <strong>{{vehicle.registration}}</strong>.</p>{{blocks.payments}}<section style="text-align:right"><p>Invoice total: {{invoice.total}}<br>Total paid: <strong>{{invoice.paid}}</strong><br>Balance: {{invoice.balance}}</p></section><footer style="display:flex;justify-content:flex-end;gap:28px;margin-top:40px">{{blocks.company_stamp}}{{blocks.authorized_signature}}</footer></main>`,
};

export function seedReportTemplates(now: Date | string = new Date()): ReportTemplate[] {
  const timestamp = new Date(now).toISOString();
  return (Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => ({
    id: `template-${category}-default`, category, name: `Standard ${REPORT_CATEGORY_LABELS[category]}`,
    html: DEFAULT_TEMPLATE_HTML[category], active: true, createdAt: timestamp, updatedAt: timestamp,
  }));
}

export function findUnsupportedPlaceholders(html: string, category: ReportCategory): string[] {
  const found = [...html.matchAll(/{{\s*([^{}]+?)\s*}}/g)].map((match) => match[1].trim());
  const allowed = new Set(REPORT_PLACEHOLDERS[category]);
  return [...new Set(found.filter((name) => !allowed.has(name)))].sort();
}

const escapeHtml = (value: unknown) => String(value ?? "—").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const value = (input: string | number | null | undefined) => input === null || input === undefined || String(input).trim() === "" ? "—" : String(input);
const money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
const date = (input?: string) => {
  if (!input?.trim()) return "—";
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? input : parsed.toLocaleDateString("en-IN");
};
const imageBlock = (src: string | null, alt: string) => src ? `<img src="${src}" alt="${escapeHtml(alt)}" style="display:block;max-width:150px;max-height:78px;object-fit:contain">` : "";

function table(headers: string[], rows: Array<Array<string | number>>) {
  if (!rows.length) return "<p>—</p>";
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr>${headers.map((header) => `<th style="border:1px solid #cbd5e1;padding:7px;text-align:left">${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #cbd5e1;padding:7px">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
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
  const reportNumber = category === "invoice" ? view.invoice?.invoice_no : category === "gate-pass" ? view.gate_pass?.gate_pass_no : category === "payment-receipt" ? view.receipt?.receipt_no : view.job.job_no;
  return {
    "company.name": value(settings.profile.businessName), "company.legal_name": value(settings.profile.legalName), "company.address": value(settings.profile.address),
    "company.phone": value(settings.profile.phone), "company.email": value(settings.profile.email), "company.gstin": value(settings.billing.gstin),
    "company.bank_account_holder": value(settings.billing.bankAccountHolder), "company.bank_name": value(settings.billing.bankName), "company.bank_account_number": value(settings.billing.bankAccountNumber),
    "company.bank_ifsc": value(settings.billing.bankIfsc), "company.bank_branch": value(settings.billing.bankBranch), "company.upi_id": value(settings.billing.upiId),
    "report.title": REPORT_CATEGORY_LABELS[category], "report.number": value(reportNumber), "report.date": date(view.invoice?.created_at ?? view.visit.received_at),
    "job.number": value(view.job.job_no), "job.status": value(view.job.main_status), "job.sub_status": value(view.job.sub_status), "job.work_list": value(view.job.work_list || view.visit.requested_work),
    "customer.name": value(view.customer.name), "customer.mobile": value(view.customer.mobile), "customer.type": value(view.customer.type),
    "vehicle.registration": value(view.vehicle.number), "vehicle.description": value(`${view.vehicle.make} ${view.vehicle.model}`.trim()), "vehicle.make": value(view.vehicle.make), "vehicle.model": value(view.vehicle.model), "vehicle.color": value(view.vehicle.color), "vehicle.km": value(view.job.final_km ?? view.vehicle.km),
    "dates.received": date(view.visit.received_at), "dates.promised": date(view.job.promised_at), "dates.delivered": date(view.job.closed_at || view.job.delivery_by),
    "staff.advisor": value(view.advisor.name), "staff.technician": value(view.technician.name),
    "invoice.total": money(invoiceTotal), "invoice.paid": money(paid), "invoice.balance": money(Math.max(0, invoiceTotal - paid)), "receipt.number": value(view.receipt?.receipt_no),
    "blocks.company_logo": imageBlock(assets.logo, "Company logo"), "blocks.company_stamp": imageBlock(assets.stamp, "Company stamp"), "blocks.authorized_signature": imageBlock(assets.authorizedSignature, "Authorized signature"),
    "blocks.line_items": table(["Type", "Description", "Qty", "Rate", "Amount"], reportItems.map((item) => [item.kind, item.description, item.qty, money(item.rate), money(item.qty * item.rate)])),
    "blocks.payment_details": category === "invoice" ? paymentDetailsBlock(settings) : "",
    "blocks.payments": table(["Date", "Mode", "Reference", "Amount"], view.payments.map((payment) => [date(payment.created_at), payment.mode, value(payment.reference), money(payment.amount)])),
    "blocks.tasks": table(["Task", "Status", "Notes"], view.tasks.map((task) => [task.title, task.status, value(task.notes)])),
    "blocks.qc_rows": table(["Check", "Result"], view.qc_checks.map((check) => [check.label, check.passed ? "Pass" : value(check.fail_reason || "Pending")])),
  };
}

export function sampleReportValues(category: ReportCategory): Record<string, string> {
  const scalar: Record<string, string> = Object.fromEntries(REPORT_PLACEHOLDERS[category].map((name) => [name, `Sample ${name.split(".").at(-1)?.replaceAll("_", " ")}`]));
  return {
    ...scalar,
    "company.name": "WorkshopOS Demo Studio", "company.legal_name": "WorkshopOS Automotive Services", "company.address": "Bhubaneswar, Odisha", "company.phone": "+91 98765 43210", "company.email": "hello@workshopos.demo", "company.gstin": "21ABCDE1234F1Z5",
    "company.bank_account_holder": "WorkshopOS Automotive Services", "company.bank_name": "State Bank of India", "company.bank_account_number": "001234567890", "company.bank_ifsc": "SBIN0001234", "company.bank_branch": "Bhubaneswar Main Branch", "company.upi_id": "workshopos@sbi",
    "report.title": REPORT_CATEGORY_LABELS[category], "report.number": category === "invoice" ? "INV-2026-0042" : category === "gate-pass" ? "GP-2026-0042" : category === "payment-receipt" ? "REC-2026-0042" : "JC-2026-0042", "report.date": "24/09/2026",
    "job.number": "JC-2026-0042", "job.status": "COMPLETED", "job.sub_status": "Invoice Ready", "job.work_list": "Ceramic coating and interior detailing",
    "customer.name": "Aarav Sharma", "customer.mobile": "98765 00042", "customer.type": "Individual", "vehicle.registration": "OD02AB0042", "vehicle.description": "Honda City", "vehicle.make": "Honda", "vehicle.model": "City", "vehicle.color": "White", "vehicle.km": "42,125",
    "dates.received": "22/09/2026", "dates.promised": "24/09/2026", "dates.delivered": "24/09/2026", "staff.advisor": "Meera Das", "staff.technician": "Rohan Singh",
    "invoice.total": "₹11,800.00", "invoice.paid": "₹8,000.00", "invoice.balance": "₹3,800.00", "receipt.number": "REC-2026-0042",
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

export function sanitizeReportHtml(html: string): string {
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
      if (name === "src" && !/^data:image\/(png|jpeg|webp);base64,/i.test(raw)) element.removeAttribute(attribute.name);
    }
    if (element.tagName === "A") element.setAttribute("rel", "noopener noreferrer");
  }
  return document.body.innerHTML;
}

export function renderReportTemplate(template: Pick<ReportTemplate, "html" | "category">, values: Record<string, string>): string {
  const unsupported = findUnsupportedPlaceholders(template.html, template.category);
  if (unsupported.length) throw new Error(`Unsupported placeholders: ${unsupported.join(", ")}`);
  const blockNames = new Set(Object.keys(values).filter((name) => name.startsWith("blocks.")));
  const substituted = template.html.replace(/{{\s*([^{}]+?)\s*}}/g, (_match, rawName: string) => {
    const name = rawName.trim();
    const replacement = values[name] ?? "—";
    return blockNames.has(name) ? replacement : escapeHtml(replacement);
  });
  return sanitizeReportHtml(substituted);
}

export const PRINT_CSP = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; frame-src 'none'; connect-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'";

export function buildPrintDocument(title: string, bodyHtml: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${PRINT_CSP}"><title>${escapeHtml(title)}</title><style>@page{size:A4;margin:12mm}html,body{margin:0;background:white}body{font-family:Arial,sans-serif}img{max-width:100%;height:auto}table{page-break-inside:auto}tr{page-break-inside:avoid}@media print{button{display:none}}</style></head><body>${bodyHtml}</body></html>`;
}
