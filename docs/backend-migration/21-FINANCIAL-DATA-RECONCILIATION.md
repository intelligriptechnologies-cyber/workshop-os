# 21 - Financial data reconciliation

Stage 2, 2026-10-21. Non-destructive forensic comparison, not an instruction to correct balances or collect additional amounts. **51 of 52 invoices have stored-subtotal versus line-subtotal discrepancies.** Of the 51, 24 are Pending and 27 Cleared. No invoice, item, payment or status was changed.

## FIN-01 - Source and method

Provisional shipped authority: public/workshopos-demo.sqlite, SHA-256 04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae, 60 tables and 3,241 records. The comparison used immutable read-only SQLite access. All 52 invoices and 105 invoice lines were inspected; no archived lines or voided payments were present. Other database copies are not merged or substituted; their provenance remains in [10](10-SQLITE-DATA-AUTHORITY.md) and [16](16-BACKEND-BASELINE-RECONCILIATION.md). Actual browser records remain unknown.

Raw line subtotal is exact decimal SUM(qty * rate) of active invoice-linked lines. A discrepancy is absolute stored-minus-line subtotal greater than 0.01. For the hypothetical tax/total comparison, the existing pure invoiceTotals function was evaluated on copied values, including discount allocation, per-line rates and rounding. Database initialization/openWorkshopDb and writes were not invoked. This is distinct from assuming header GST times an unrounded aggregate.

Payments are joined by invoice_id, excluding voided payments, not merely by job. Header outstanding below is max(stored total - active payments, 0); hypothetical outstanding substitutes the line-calculated total. These are explicit analytical measures, not a new application balance/status rule. Signed balances, line IDs, payment IDs, job IDs/numbers, rates and all 52 records are in the [machine-readable reconciliation](stage2-financial-reconciliation.json.md).

Source behavior matters: src/billing-manager.tsx:117-195 lists/exports stored totals, while its InvoiceDialog at 280-328 derives current line totals using invoiceTotals. src/invoice-math.ts:100-114 billingReconciliation checks linked invoice/payment/receipt/gatepass/delivery presence rather than independently establishing an arithmetic partial-payment ledger. Different surfaces can therefore disagree. This is source evidence, not proof that every affected invoice was opened in a live browser.

## FIN-02 - Stored versus raw line subtotals

Amounts retain two decimal places in the application's currency context. Delta in this table is **stored subtotal minus line subtotal**. All rows require explicit owner review; neither the header nor the lines are declared correct solely from this comparison.

| Invoice ID / number | Status | Stored subtotal | Line subtotal | Delta | Discount | Stored tax | Stored total |
|---|---|---:|---:|---:|---:|---:|---:|
| 1 / INV-2026-00011 | Pending | 11750.00 | 33669.00 | -21919.00 | 0.00 | 2115.00 | 13865.00 |
| 2 / INV-2026-00013 | Pending | 4250.00 | 8500.00 | -4250.00 | 0.00 | 765.00 | 5015.00 |
| 3 / INV-2026-00014 | Cleared | 5000.00 | 10000.00 | -5000.00 | 0.00 | 900.00 | 5900.00 |
| 4 / INV-2026-00015 | Cleared | 5750.00 | 11500.00 | -5750.00 | 0.00 | 1035.00 | 6785.00 |
| 5 / INV-2026-00016 | Cleared | 6500.00 | 13000.00 | -6500.00 | 500.00 | 1080.00 | 7080.00 |
| 6 / INV-2026-00027 | Pending | 5750.00 | 11500.00 | -5750.00 | 0.00 | 1035.00 | 6785.00 |
| 7 / INV-2026-00028 | Pending | 6500.00 | 13000.00 | -6500.00 | 500.00 | 1080.00 | 7080.00 |
| 8 / INV-2026-00029 | Pending | 7250.00 | 14500.00 | -7250.00 | 0.00 | 1305.00 | 8555.00 |
| 9 / INV-2026-00030 | Cleared | 8000.00 | 16000.00 | -8000.00 | 0.00 | 1440.00 | 9440.00 |
| 10 / INV-2026-00031 | Cleared | 8750.00 | 17500.00 | -8750.00 | 0.00 | 1575.00 | 10325.00 |
| 11 / INV-2026-00032 | Cleared | 9500.00 | 19000.00 | -9500.00 | 500.00 | 1620.00 | 10620.00 |
| 12 / INV-2026-00043 | Pending | 8750.00 | 17500.00 | -8750.00 | 0.00 | 1575.00 | 10325.00 |
| 13 / INV-2026-00044 | Pending | 9500.00 | 19000.00 | -9500.00 | 500.00 | 1620.00 | 10620.00 |
| 14 / INV-2026-00045 | Pending | 10250.00 | 20500.00 | -10250.00 | 0.00 | 1845.00 | 12095.00 |
| 15 / INV-2026-00046 | Cleared | 11000.00 | 22000.00 | -11000.00 | 0.00 | 1980.00 | 12980.00 |
| 16 / INV-2026-00047 | Cleared | 11750.00 | 23500.00 | -11750.00 | 0.00 | 2115.00 | 13865.00 |
| 17 / INV-2026-00048 | Cleared | 3500.00 | 7000.00 | -3500.00 | 500.00 | 540.00 | 3540.00 |
| 18 / INV-2026-00059 | Pending | 11750.00 | 23500.00 | -11750.00 | 0.00 | 2115.00 | 13865.00 |
| 19 / INV-2026-00061 | Pending | 4250.00 | 8500.00 | -4250.00 | 0.00 | 765.00 | 5015.00 |
| 20 / INV-2026-00062 | Cleared | 5000.00 | 10000.00 | -5000.00 | 0.00 | 900.00 | 5900.00 |
| 21 / INV-2026-00063 | Cleared | 5750.00 | 11500.00 | -5750.00 | 0.00 | 1035.00 | 6785.00 |
| 22 / INV-2026-00064 | Cleared | 6500.00 | 13000.00 | -6500.00 | 500.00 | 1080.00 | 7080.00 |
| 23 / INV-2026-00075 | Pending | 5750.00 | 11500.00 | -5750.00 | 0.00 | 1035.00 | 6785.00 |
| 24 / INV-2026-00076 | Pending | 6500.00 | 13000.00 | -6500.00 | 500.00 | 1080.00 | 7080.00 |
| 25 / INV-2026-00077 | Pending | 7250.00 | 14500.00 | -7250.00 | 0.00 | 1305.00 | 8555.00 |
| 26 / INV-2026-00078 | Cleared | 8000.00 | 16000.00 | -8000.00 | 0.00 | 1440.00 | 9440.00 |
| 27 / INV-2026-00079 | Cleared | 8750.00 | 17500.00 | -8750.00 | 0.00 | 1575.00 | 10325.00 |
| 28 / INV-2026-00080 | Cleared | 9500.00 | 19000.00 | -9500.00 | 500.00 | 1620.00 | 10620.00 |
| 29 / INV-2026-00091 | Pending | 8750.00 | 17500.00 | -8750.00 | 0.00 | 1575.00 | 10325.00 |
| 30 / INV-2026-00092 | Pending | 9500.00 | 19000.00 | -9500.00 | 500.00 | 1620.00 | 10620.00 |
| 31 / INV-2026-00093 | Pending | 10250.00 | 20500.00 | -10250.00 | 0.00 | 1845.00 | 12095.00 |
| 32 / INV-2026-00094 | Cleared | 11000.00 | 22000.00 | -11000.00 | 0.00 | 1980.00 | 12980.00 |
| 33 / INV-2026-00095 | Cleared | 11750.00 | 23500.00 | -11750.00 | 0.00 | 2115.00 | 13865.00 |
| 34 / INV-2026-00096 | Cleared | 3500.00 | 7000.00 | -3500.00 | 500.00 | 540.00 | 3540.00 |
| 35 / INV-2026-00107 | Pending | 11750.00 | 23500.00 | -11750.00 | 0.00 | 2115.00 | 13865.00 |
| 36 / INV-2026-00109 | Pending | 4250.00 | 8500.00 | -4250.00 | 0.00 | 765.00 | 5015.00 |
| 37 / INV-2026-00110 | Cleared | 5000.00 | 10000.00 | -5000.00 | 0.00 | 900.00 | 5900.00 |
| 38 / INV-2026-00111 | Cleared | 5750.00 | 11500.00 | -5750.00 | 0.00 | 1035.00 | 6785.00 |
| 39 / INV-2026-00112 | Cleared | 6500.00 | 13000.00 | -6500.00 | 500.00 | 1080.00 | 7080.00 |
| 40 / INV-2026-00123 | Pending | 5750.00 | 11500.00 | -5750.00 | 0.00 | 1035.00 | 6785.00 |
| 41 / INV-2026-00124 | Pending | 6500.00 | 13000.00 | -6500.00 | 500.00 | 1080.00 | 7080.00 |
| 42 / INV-2026-00125 | Pending | 7250.00 | 14500.00 | -7250.00 | 0.00 | 1305.00 | 8555.00 |
| 43 / INV-2026-00126 | Cleared | 8000.00 | 16000.00 | -8000.00 | 0.00 | 1440.00 | 9440.00 |
| 44 / INV-2026-00127 | Cleared | 8750.00 | 17500.00 | -8750.00 | 0.00 | 1575.00 | 10325.00 |
| 45 / INV-2026-00128 | Cleared | 9500.00 | 19000.00 | -9500.00 | 500.00 | 1620.00 | 10620.00 |
| 46 / INV-2026-00139 | Pending | 8750.00 | 17500.00 | -8750.00 | 0.00 | 1575.00 | 10325.00 |
| 47 / INV-2026-00140 | Pending | 9500.00 | 19000.00 | -9500.00 | 500.00 | 1620.00 | 10620.00 |
| 48 / INV-2026-00141 | Pending | 10250.00 | 20500.00 | -10250.00 | 0.00 | 1845.00 | 12095.00 |
| 49 / INV-2026-00142 | Cleared | 11000.00 | 22000.00 | -11000.00 | 0.00 | 1980.00 | 12980.00 |
| 50 / INV-2026-00143 | Cleared | 11750.00 | 23500.00 | -11750.00 | 0.00 | 2115.00 | 13865.00 |
| 51 / INV-2026-00144 | Cleared | 3500.00 | 7000.00 | -3500.00 | 500.00 | 540.00 | 3540.00 |

## FIN-03 - Tax, total and balance sensitivity

Every row below would change its positive outstanding measure if its total were replaced by the current line-derived calculation. **No such replacement is approved.** Review code SETTLED means FIN-REVIEW-SETTLED-HISTORY; OPEN means FIN-REVIEW-OPEN-BALANCE. All 27 cleared invoices have active payments and zero header outstanding; recalculation would reopen them. All 24 pending invoices already have positive header outstanding, whose amount would change.

| Invoice ID | Calculated tax | Calculated total | Active payments | Header outstanding | Hypothetical outstanding | Review |
|---|---:|---:|---:|---:|---:|---|
| 1 | 6060.42 | 39729.42 | 0.00 | 13865.00 | 39729.42 | OPEN |
| 2 | 1530.00 | 10030.00 | 0.00 | 5015.00 | 10030.00 | OPEN |
| 3 | 1800.00 | 11800.00 | 5900.00 | 0.00 | 5900.00 | SETTLED |
| 4 | 2070.00 | 13570.00 | 6785.00 | 0.00 | 6785.00 | SETTLED |
| 5 | 2250.00 | 14750.00 | 7080.00 | 0.00 | 7670.00 | SETTLED |
| 6 | 2070.00 | 13570.00 | 0.00 | 6785.00 | 13570.00 | OPEN |
| 7 | 2250.00 | 14750.00 | 0.00 | 7080.00 | 14750.00 | OPEN |
| 8 | 2610.00 | 17110.00 | 0.00 | 8555.00 | 17110.00 | OPEN |
| 9 | 2880.00 | 18880.00 | 9440.00 | 0.00 | 9440.00 | SETTLED |
| 10 | 3150.00 | 20650.00 | 10325.00 | 0.00 | 10325.00 | SETTLED |
| 11 | 3330.00 | 21830.00 | 10620.00 | 0.00 | 11210.00 | SETTLED |
| 12 | 3150.00 | 20650.00 | 0.00 | 10325.00 | 20650.00 | OPEN |
| 13 | 3330.00 | 21830.00 | 0.00 | 10620.00 | 21830.00 | OPEN |
| 14 | 3690.00 | 24190.00 | 0.00 | 12095.00 | 24190.00 | OPEN |
| 15 | 3960.00 | 25960.00 | 12980.00 | 0.00 | 12980.00 | SETTLED |
| 16 | 4230.00 | 27730.00 | 13865.00 | 0.00 | 13865.00 | SETTLED |
| 17 | 1170.00 | 7670.00 | 3540.00 | 0.00 | 4130.00 | SETTLED |
| 18 | 4230.00 | 27730.00 | 0.00 | 13865.00 | 27730.00 | OPEN |
| 19 | 1530.00 | 10030.00 | 0.00 | 5015.00 | 10030.00 | OPEN |
| 20 | 1800.00 | 11800.00 | 5900.00 | 0.00 | 5900.00 | SETTLED |
| 21 | 2070.00 | 13570.00 | 6785.00 | 0.00 | 6785.00 | SETTLED |
| 22 | 2250.00 | 14750.00 | 7080.00 | 0.00 | 7670.00 | SETTLED |
| 23 | 2070.00 | 13570.00 | 0.00 | 6785.00 | 13570.00 | OPEN |
| 24 | 2250.00 | 14750.00 | 0.00 | 7080.00 | 14750.00 | OPEN |
| 25 | 2610.00 | 17110.00 | 0.00 | 8555.00 | 17110.00 | OPEN |
| 26 | 2880.00 | 18880.00 | 9440.00 | 0.00 | 9440.00 | SETTLED |
| 27 | 3150.00 | 20650.00 | 10325.00 | 0.00 | 10325.00 | SETTLED |
| 28 | 3330.00 | 21830.00 | 10620.00 | 0.00 | 11210.00 | SETTLED |
| 29 | 3150.00 | 20650.00 | 0.00 | 10325.00 | 20650.00 | OPEN |
| 30 | 3330.00 | 21830.00 | 0.00 | 10620.00 | 21830.00 | OPEN |
| 31 | 3690.00 | 24190.00 | 0.00 | 12095.00 | 24190.00 | OPEN |
| 32 | 3960.00 | 25960.00 | 12980.00 | 0.00 | 12980.00 | SETTLED |
| 33 | 4230.00 | 27730.00 | 13865.00 | 0.00 | 13865.00 | SETTLED |
| 34 | 1170.00 | 7670.00 | 3540.00 | 0.00 | 4130.00 | SETTLED |
| 35 | 4230.00 | 27730.00 | 0.00 | 13865.00 | 27730.00 | OPEN |
| 36 | 1530.00 | 10030.00 | 0.00 | 5015.00 | 10030.00 | OPEN |
| 37 | 1800.00 | 11800.00 | 5900.00 | 0.00 | 5900.00 | SETTLED |
| 38 | 2070.00 | 13570.00 | 6785.00 | 0.00 | 6785.00 | SETTLED |
| 39 | 2250.00 | 14750.00 | 7080.00 | 0.00 | 7670.00 | SETTLED |
| 40 | 2070.00 | 13570.00 | 0.00 | 6785.00 | 13570.00 | OPEN |
| 41 | 2250.00 | 14750.00 | 0.00 | 7080.00 | 14750.00 | OPEN |
| 42 | 2610.00 | 17110.00 | 0.00 | 8555.00 | 17110.00 | OPEN |
| 43 | 2880.00 | 18880.00 | 9440.00 | 0.00 | 9440.00 | SETTLED |
| 44 | 3150.00 | 20650.00 | 10325.00 | 0.00 | 10325.00 | SETTLED |
| 45 | 3330.00 | 21830.00 | 10620.00 | 0.00 | 11210.00 | SETTLED |
| 46 | 3150.00 | 20650.00 | 0.00 | 10325.00 | 20650.00 | OPEN |
| 47 | 3330.00 | 21830.00 | 0.00 | 10620.00 | 21830.00 | OPEN |
| 48 | 3690.00 | 24190.00 | 0.00 | 12095.00 | 24190.00 | OPEN |
| 49 | 3960.00 | 25960.00 | 12980.00 | 0.00 | 12980.00 | SETTLED |
| 50 | 4230.00 | 27730.00 | 13865.00 | 0.00 | 13865.00 | SETTLED |
| 51 | 1170.00 | 7670.00 | 3540.00 | 0.00 | 4130.00 | SETTLED |

For the 51 affected invoices, stored totals sum to 464,625.00; hypothetical line-derived totals sum to 950,099.42. Header outstanding sums to 223,020.00; hypothetical outstanding sums to 708,494.42. The 485,474.42 difference is sensitivity analysis, **not approved additional receivables**. Invoice ID 52 (INV-09038) does not meet the raw-subtotal discrepancy criterion; that does not certify all of its financial semantics.

## FIN-04 - Required decision and protection

Preserve original header totals, lines, payments, statuses and relationships without silent normalization. Retain provenance and a separately identifiable discrepancy report. Obtain explicit financial-owner approval for whether historical rendering/calculations remain as-is, are represented with frozen historical values, or undergo a separately authorized adjustment process. The migration must not reinterpret Cleared as unpaid, recreate payments or regenerate historical documents using changed arithmetic without that decision.

Acceptance must compare all 52 invoice headers, 105 lines and all linked payments before/after migration, including status, void/archive fields and stored precision. For these 51 IDs, assert no automatic total rewrite or balance/status reopening during import, read, save of unrelated fields, document rendering, payment retry or startup. Test newly created invoices separately against approved PAR-02/04 examples; historical discrepancies do not justify making new arithmetic inconsistent.

This uncertainty does not block recording a preservation-oriented architecture, but blocks final financial mapping and financial integration acceptance until treatment is approved. Source/UI baseline capture may continue with the discrepancy recorded; financially meaningful screenshots must identify whether they display stored or derived totals. No silent correction is permitted.
