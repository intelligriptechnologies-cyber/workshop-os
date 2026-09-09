# WorkshopOS Rebuild Checklist

## 1. Goal, checklist, and handoff workflow
- Status: Done
- Verification: Checklist recreated and maintained as the implementation tracker. Handoff docs written to the OS temp directory.

## 2. SQLite persistence foundation
- Status: Done
- Verification: Added `sql.js`, bundled wasm via Vite, created `src/db.ts`, created all required tables, seeded demo data, and persisted the exported SQLite database to `localStorage`.

## 3. Demo login and auth shell
- Status: Done
- Verification: Playwright validated all demo logins: `admin@example.com`, `service@example.com`, `reception@example.com`, `accounts@example.com`, `store@example.com`, `tech@example.com`; password is `admin123`.

## 4. Common search portal
- Status: Done
- Verification: Global search filters by linked job/customer/vehicle/invoice data and shows customer, vehicle, visit/job card, invoice, advisor, work list, payment status, and photo count.

## 5. Reception workspace
- Status: Done
- Verification: Reception can create/update customer and vehicle records, create a visit with KM/fuel/keys/accessories/requested work/photo placeholder/advisor assignment, and automatically create a linked `NEW` job card.

## 6. Service advisor workspace
- Status: Done
- Verification: Advisor can create estimates, record customer confirmation, move jobs to `IN_PROGRESS`, add follow-ups, and add photo placeholders while data remains linked to the same job.

## 7. Store workspace
- Status: Done
- Verification: Store view shows material requests, issues material only against job cards, updates inventory, and displays the `Issued = Used + Returned + Wasted` reconciliation rule plus low-stock PPF/Paint items.

## 8. Technician workspace
- Status: Done
- Verification: Technician can start/pause/complete tasks, mark washing needed, add photo placeholders, and move work to QC/completion.

## 9. Accounts workspace
- Status: Done
- Verification: Accounts can generate invoices only after `COMPLETED`, capture manual Tally invoice number, record payments, generate receipt/gate pass, and close jobs when blockers clear.

## 10. Owner/Admin workspace
- Status: Done
- Verification: Admin dashboard shows KPIs, lifecycle funnel, blockers, revenue/payment snapshots, inventory alerts, jobs, and a data-flow view from Visit through Gate Pass.

## 11. Visual redesign
- Status: Done
- Verification: Role-specific layouts implemented for intake desk, advisor command queue, store issue counter, technician board, accounts closure desk, and owner control room. Desktop and mobile screenshots captured.

## 12. PWA and offline shell
- Status: Done
- Verification: Manifest, icon, and service worker kept. Service worker now runtime-caches fetched GET assets including the bundled SQLite wasm; SQLite/localStorage data survives refresh.

## 13. Verification
- Status: Done
- Verification: `npm run build` passes. Playwright validated all demo logins, a new reception record, persistence after refresh, and a full linked workflow in the earlier end-to-end pass. Screenshots captured for login, reception, advisor, store, technician, accounts, and admin on desktop and mobile.
