import { createHash } from "node:crypto";

export type BillingArtifact = { content: Buffer; mimeType: "application/pdf"; filename: string; checksum: string };

const escapePdf = (value: string) => value.replace(/[\\()]/g, "\\$&").replace(/[^\x20-\x7e]/g, "?");

export function createBillingPdf(kind: "INVOICE" | "RECEIPT" | "GATE_PASS", reference: string, lines: string[]): BillingArtifact {
  const text = ["WorkshopOS", kind.replace("_", " "), reference, ...lines].map(escapePdf);
  const stream = text.map((line, index) => `BT /F1 ${index === 0 ? 18 : 11} Tf 48 ${790-index*24} Td (${line}) Tj ET`).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let body = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(body)); body += `${index+1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(offset=>`${String(offset).padStart(10,"0")} 00000 n `).join("\n")}\ntrailer << /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  const content = Buffer.from(body);
  return { content, mimeType: "application/pdf", filename: `${kind.toLowerCase().replace("_","-")}-${reference.replace(/[^a-z0-9-]/gi,"-")}.pdf`, checksum: createHash("sha256").update(content).digest("hex") };
}

export function validateMoney(value: string) {
  return /^\d+$/.test(value) && BigInt(value) > 0n;
}

export function validateDeliveryEvidence(input: { finalOdometerKm: number; deliveredToName: string; identityType: string; identityLast4: string; acknowledgement: string }) {
  return Number.isSafeInteger(input.finalOdometerKm) && input.finalOdometerKm >= 0 && Boolean(input.deliveredToName.trim()) && Boolean(input.identityType.trim()) && /^.{4}$/.test(input.identityLast4) && Boolean(input.acknowledgement.trim());
}
