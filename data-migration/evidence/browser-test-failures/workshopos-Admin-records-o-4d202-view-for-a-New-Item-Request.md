# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request
- Location: tests\workshopos.spec.ts:2489:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('dialog', { name: 'PO-WOS-A-00001' }).getByRole('button', { name: 'Go Back' })

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e10]:
      - strong [ref=f1e11]: WorkshopOS
      - generic [ref=f1e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f1e13] [cursor=pointer]
    - generic [ref=f1e17]: Store
    - navigation "Store menu" [ref=f1e18]:
      - button "Material Requests" [ref=f1e19] [cursor=pointer]
      - button "Issue Material" [ref=f1e26] [cursor=pointer]
      - button "Reconcile" [ref=f1e32] [cursor=pointer]
      - button "Stock" [ref=f1e36] [cursor=pointer]
      - button "Purchase Orders" [ref=f1e48] [cursor=pointer]
      - button "Search" [ref=f1e52] [cursor=pointer]
    - button "Logout" [ref=f1e57] [cursor=pointer]
  - main [ref=f1e62]:
    - generic [ref=f1e63]:
      - generic [ref=f1e64]:
        - paragraph [ref=f1e65]: Store
        - heading "Issue counter for accountable material movement." [level=1] [ref=f1e66]
      - generic [ref=f1e67]: store@example.com
    - generic [ref=f1e71]:
      - generic [ref=f1e72]:
        - generic [ref=f1e73]:
          - generic [ref=f1e77]:
            - heading "Purchase Orders" [level=2] [ref=f1e78]
            - paragraph [ref=f1e79]: Ordering commitments; stock is recorded only through Stock Inward.
          - button "New Purchase Request" [ref=f1e80] [cursor=pointer]
        - generic [ref=f1e82]:
          - generic [ref=f1e83]:
            - text: Search
            - textbox "Search purchase orders" [ref=f1e84]:
              - /placeholder: PO number or supplier
          - generic [ref=f1e85]:
            - text: Status
            - combobox "Purchase order status" [ref=f1e86]:
              - option "All statuses" [selected]
              - option "PO Request"
              - option "PO Request Approved"
              - option "PO Issued"
              - option "PO Received"
              - option "PO Confirmation"
              - option "Draft"
              - option "Sent"
              - option "Partially Received"
              - option "Ready to Close"
              - option "Closed"
              - option "Cancelled"
          - group "Search actions" [ref=f1e87]:
            - button "Clear" [ref=f1e88] [cursor=pointer]
        - table "Purchase order register" [ref=f1e90]:
          - rowgroup [ref=f1e91]:
            - row [ref=f1e92]:
              - columnheader "PO" [ref=f1e93]
              - columnheader "Date" [ref=f1e94]
              - columnheader "Supplier" [ref=f1e95]
              - columnheader "Ordered" [ref=f1e96]
              - columnheader "Received" [ref=f1e97]
              - columnheader "Total" [ref=f1e98]
              - columnheader "Status" [ref=f1e99]
              - columnheader "Actions" [ref=f1e100]
          - rowgroup [ref=f1e101]:
            - row [ref=f1e102] [cursor=pointer]:
              - cell "PO-WOS-A-00003" [ref=f1e103]
              - cell "2026-10-20" [ref=f1e104]
              - cell "Supplier pending" [ref=f1e105]
              - cell "1" [ref=f1e106]
              - cell "0" [ref=f1e107]
              - cell "Rs 0" [ref=f1e108]
              - cell "PO Request" [ref=f1e109]
              - cell [ref=f1e111]:
                - generic [ref=f1e112]:
                  - button "Edit" [ref=f1e113]
                  - button "Process" [ref=f1e117]
            - row [ref=f1e122] [cursor=pointer]:
              - cell "PO-WOS-A-00002" [ref=f1e123]
              - cell "2026-10-02" [ref=f1e124]
              - cell "Supplier 1" [ref=f1e125]
              - cell "45" [ref=f1e126]
              - cell "1" [ref=f1e127]
              - cell "Rs 3,015" [ref=f1e128]
              - cell "Closed" [ref=f1e129]
              - cell [ref=f1e131]:
                - button "Process" [ref=f1e133]
            - row [ref=f1e138] [cursor=pointer]:
              - cell "PO-WOS-A-00001" [ref=f1e139]
              - cell "2026-10-01" [ref=f1e140]
              - cell "Supplier 1" [ref=f1e141]
              - cell "3" [ref=f1e142]
              - cell "3" [ref=f1e143]
              - cell "Rs 1,572" [ref=f1e144]
              - cell "Closed" [ref=f1e145]
              - cell [ref=f1e147]:
                - button "Process" [ref=f1e149]
      - dialog [ref=f1e155]:
        - generic [ref=f1e157]:
          - heading "PO-WOS-A-00003" [level=2] [ref=f1e158]
          - paragraph [ref=f1e159]: Supplier pending · PO Request
        - generic [ref=f1e161]:
          - region "Purchase Order lifecycle" [ref=f1e162]:
            - generic [ref=f1e163]: Lifecycle
            - list [ref=f1e164]:
              - listitem [ref=f1e165]: PO Request
              - listitem [ref=f1e166]: PO Request Approved
              - listitem [ref=f1e167]: PO Issued
              - listitem [ref=f1e168]: PO Received
              - listitem [ref=f1e169]: PO Confirmation
              - listitem [ref=f1e170]: PO Closed
          - paragraph [ref=f1e171]:
            - strong [ref=f1e172]: "Order vs received:"
            - text: 1 ordered · 0 received · 1 remaining · Rs 0 received value
          - paragraph [ref=f1e173]: Delivery does not update inventory. Admin confirms every delivered unit as accepted, returned, damaged, or wasted before the PO can close.
          - table "Purchase order reconciliation" [ref=f1e175]:
            - rowgroup [ref=f1e176]:
              - row [ref=f1e177]:
                - columnheader "Item" [ref=f1e178]
                - columnheader "Ordered" [ref=f1e179]
                - columnheader "Delivered" [ref=f1e180]
                - columnheader "Outstanding" [ref=f1e181]
                - columnheader "Accepted" [ref=f1e182]
                - columnheader "Exceptions" [ref=f1e183]
            - rowgroup [ref=f1e184]:
              - row [ref=f1e185]:
                - cell "·" [ref=f1e186]
                - cell "1" [ref=f1e187]
                - cell "0" [ref=f1e188]
                - cell "1" [ref=f1e189]
                - cell "—" [ref=f1e190]
                - cell "—" [ref=f1e191]
          - heading "Linked stock inward history" [level=4] [ref=f1e192]
          - paragraph [ref=f1e193]: No linked receipts yet.
        - generic [ref=f1e194]:
          - generic [ref=f1e195]:
            - button "Edit request" [active] [ref=f1e196] [cursor=pointer]
            - button "Cancel request" [ref=f1e197] [cursor=pointer]
          - button "Go Back" [ref=f1e198] [cursor=pointer]
```

# Test source

```ts
  2398 |   await results.getByRole("button", { name: "View" }).first().click();
  2399 |   job = page.getByRole("dialog", { name: /View Job/ });
  2400 |   await job.getByRole("tab", { name: "Photos / Media" }).click();
  2401 |   await expect(job.getByText(/Read only.*Owner.*linked Service Advisor/)).toBeVisible();
  2402 |   await expect(job.getByLabel("Image file")).toHaveCount(0);
  2403 | });
  2404 | 
  2405 | async function loginAs(page: import("@playwright/test").Page, email: string) {
  2406 |   await page.getByLabel("Emulate User:").selectOption(email);
  2407 |   await page.getByRole("button", { name: "Login" }).click();
  2408 | }
  2409 | 
  2410 | test("fresh demo data provides a multi-supplier price review before PO approval", async ({ page }) => {
  2411 |   await loginAs(page, "admin@example.com");
  2412 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2413 |   await page.getByLabel("Search purchase orders").fill("DEMO-PR-0001");
  2414 |   const row = page.getByRole("table", { name: "Purchase order register" }).getByRole("row", { name: /DEMO-PR-0001/ });
  2415 |   await expect(row).toContainText("PO Request");
  2416 |   await row.getByRole("button", { name: "Process", exact: true }).click();
  2417 | 
  2418 |   const request = page.getByRole("dialog", { name: "DEMO-PR-0001" });
  2419 |   const review = request.getByRole("region", { name: "Previous Price Review" });
  2420 |   await expect(review).toContainText("Apex Protection Films");
  2421 |   await expect(review).toContainText("Detail Supply Co.");
  2422 |   await expect(review).toContainText("Prime Auto Materials");
  2423 |   await expect(review.getByRole("table", { name: /Previous purchases for TPU Gloss PPF/ }).locator("tbody tr")).toHaveCount(3);
  2424 |   await expect(review).toContainText("No completed purchase history.");
  2425 | 
  2426 |   await request.getByRole("button", { name: "Review & approve request", exact: true }).click();
  2427 |   await expect(page.getByRole("dialog", { name: "Approve DEMO-PR-0001" })).toBeVisible();
  2428 | });
  2429 | 
  2430 | test("Store creates a Purchase Request without supplier access or later-stage actions", async ({ page }) => {
  2431 |   await page.setViewportSize({ width: 1024, height: 900 });
  2432 |   await loginAs(page, "store@example.com");
  2433 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2434 |   await page.getByRole("button", { name: "New Purchase Request", exact: true }).click();
  2435 | 
  2436 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2437 |   await expect(request.getByLabel("PO number")).toHaveValue("PO-WOS-A-00001");
  2438 |   await expect(request.getByLabel("PO supplier")).toBeDisabled();
  2439 |   await expect(request.getByText(/supplier and pricing are completed by Admin/i)).toBeVisible();
  2440 |   await request.getByRole("button", { name: "Add line", exact: true }).click();
  2441 |   await request.getByLabel("Item type").nth(1).selectOption("new");
  2442 |   await request.getByLabel("PO line 2 new item name").fill("Workshop label");
  2443 |   await expect(request.getByRole("button", { name: "Create request" })).toBeDisabled();
  2444 |   await request.getByLabel("PO line 2 unit").fill("piece");
  2445 |   await request.getByLabel("PO line 2 quantity").fill("2");
  2446 |   await expect(request.locator(".purchase-request-line-row")).toHaveCount(2);
  2447 |   expect(await request.locator(".purchase-request-line-row").evaluateAll((rows) =>
  2448 |     rows.every((row) => row.scrollWidth <= row.clientWidth),
  2449 |   )).toBe(true);
  2450 | 
  2451 |   await page.setViewportSize({ width: 390, height: 844 });
  2452 |   expect(await request.evaluate((dialog) => dialog.getBoundingClientRect().width)).toBe(390);
  2453 |   await page.setViewportSize({ width: 1024, height: 900 });
  2454 |   await request.getByRole("button", { name: "Create request" }).click();
  2455 | 
  2456 |   const process = page.getByRole("dialog", { name: "PO-WOS-A-00001" });
  2457 |   await expect(process.getByRole("button", { name: /Send saved PO|Close PO|Cancel PO/ })).toHaveCount(0);
  2458 |   await expect(process.getByRole("button", { name: "Edit request" })).toBeVisible();
  2459 | });
  2460 | 
  2461 | test("Admin can create a Purchase Request", async ({ page }) => {
  2462 |   await loginAs(page, "admin@example.com");
  2463 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2464 |   await page.getByRole("button", { name: "New Purchase Request", exact: true }).click();
  2465 | 
  2466 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2467 |   await expect(request.getByLabel("PO number")).toHaveValue("PO-WOS-A-00001");
  2468 |   await expect(request.getByRole("button", { name: "Create request", exact: true })).toBeEnabled();
  2469 |   await request.getByRole("button", { name: "Create request", exact: true }).click();
  2470 | 
  2471 |   await expect(page.getByRole("dialog", { name: "PO-WOS-A-00001" })).toBeVisible();
  2472 | });
  2473 | 
  2474 | test("Store Materials Requests keeps inward unavailable and hands a New Item Request to the controlled PO form", async ({ page }) => {
  2475 |   await loginAs(page, "store@example.com");
  2476 |   await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  2477 |   const triage = page.getByRole("region", { name: "Material procurement triage" });
  2478 |   await expect(triage.getByText("Available to issue")).toBeVisible();
  2479 |   await expect(triage.getByText("Existing-SKU procurement")).toBeVisible();
  2480 |   await expect(triage.getByRole("heading", { name: "New Item Requests" })).toBeVisible();
  2481 |   await expect(page.getByRole("button", { name: /Quick Add Stock|Record Inward|Purchase, Stock & Issue/ })).toHaveCount(0);
  2482 |   await triage.getByRole("button", { name: "Create New Item Request" }).click();
  2483 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2484 |   await expect(request.getByLabel("Item type")).toHaveValue("new");
  2485 |   await expect(request.getByLabel("PO supplier")).toBeDisabled();
  2486 |   await expect(request.getByLabel("PO notes")).toHaveValue("From New Item Request");
  2487 | });
  2488 | 
  2489 | test("Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request", async ({ page }) => {
  2490 |   await loginAs(page, "store@example.com");
  2491 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2492 |   await page.getByRole("button", { name: "New Purchase Request", exact: true }).click();
  2493 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2494 |   await request.getByLabel("Item type").selectOption("new");
  2495 |   await request.getByLabel("PO line 1 new item name").fill("Uncatalogued tool");
  2496 |   await request.getByLabel("PO line 1 unit").fill("piece");
  2497 |   await request.getByRole("button", { name: "Create request" }).click();
> 2498 |   await page.getByRole("dialog", { name: "PO-WOS-A-00001" }).getByRole("button", { name: "Go Back" }).click();
       |                                                                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  2499 |   await page.getByRole("button", { name: "Logout" }).click();
  2500 | 
  2501 |   await loginAs(page, "admin@example.com");
  2502 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2503 |   await page.getByRole("button", { name: "Process", exact: true }).click();
  2504 |   const process = page.getByRole("dialog", { name: "PO-WOS-A-00001" });
  2505 |   const review = process.getByRole("region", { name: "Previous Price Review" });
  2506 |   await expect(review).toContainText("Uncatalogued tool");
  2507 |   await expect(review).toContainText(/N\/A.*New Item Request/i);
  2508 |   await expect(review).toContainText("No quotations recorded. This is optional.");
  2509 |   await review.getByRole("button", { name: "Add quotation" }).click();
  2510 |   await review.getByLabel(/Quotation supplier/).fill("Quote supplier");
  2511 |   await review.getByLabel(/Quotation price/).fill("42");
  2512 |   await review.getByRole("button", { name: "Save quotation" }).click();
  2513 |   await expect(review).toContainText("Quote supplier");
  2514 |   await expect(review).toContainText(/Rs\s*42(?:\.00)? pre-GST/);
  2515 | });
  2516 | 
  2517 | test("Admin approves a New Item Request with a supplier, price, and zero-stock SKU", async ({ page }) => {
  2518 |   await loginAs(page, "store@example.com");
  2519 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2520 |   await page.getByRole("button", { name: "New Purchase Request", exact: true }).click();
  2521 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2522 |   await request.getByLabel("Item type").selectOption("new");
  2523 |   await request.getByLabel("PO line 1 new item name").fill("Approval-only sealant");
  2524 |   await request.getByLabel("PO line 1 unit").fill("tube");
  2525 |   await request.getByRole("button", { name: "Create request" }).click();
  2526 |   await page.getByRole("dialog", { name: "PO-WOS-A-00001" }).getByRole("button", { name: "Go Back" }).click();
  2527 |   await page.getByRole("button", { name: "Logout" }).click();
  2528 | 
  2529 |   await loginAs(page, "admin@example.com");
  2530 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  2531 |   await page.getByRole("tab", { name: "Suppliers", exact: true }).click();
  2532 |   await page.getByRole("button", { name: "Add new supplier", exact: true }).click();
  2533 |   await page.getByRole("dialog", { name: "Add supplier" }).getByLabel("Name", { exact: true }).fill("Approval Supplier");
  2534 |   await page.getByRole("button", { name: "Save supplier", exact: true }).click();
  2535 | 
  2536 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2537 |   await page.getByRole("button", { name: "Process", exact: true }).click();
  2538 |   await page.getByRole("button", { name: "Review & approve request", exact: true }).click();
  2539 |   const approval = page.getByRole("dialog", { name: "Approve PO-WOS-A-00001" });
  2540 |   await approval.getByLabel("Supplier for PO line 1").selectOption({ label: "Approval Supplier" });
  2541 |   await approval.getByLabel("Pre-GST price for PO line 1").fill("320");
  2542 |   await approval.getByLabel("SKU for PO line 1").fill("SEAL-001");
  2543 |   await approval.getByLabel("Category for PO line 1").fill("Detailing");
  2544 |   await approval.getByLabel("Catalogue name for PO line 1").fill("Approval-only sealant");
  2545 |   await approval.getByLabel("Catalogue unit for PO line 1").fill("tube");
  2546 |   await approval.getByRole("button", { name: "Approve Purchase Request", exact: true }).click();
  2547 |   await expect(page.getByRole("dialog", { name: "PO-WOS-A-00001" })).toContainText("PO Request Approved");
  2548 | });
  2549 | 
  2550 | test("Admin issues an approved Purchase Order and both roles can see its Supplier Basket context", async ({ page }) => {
  2551 |   await loginAs(page, "store@example.com");
  2552 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2553 |   await page.getByRole("button", { name: "New Purchase Request", exact: true }).click();
  2554 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2555 |   await request.getByLabel("PO line 1 quantity").fill("3");
  2556 |   await request.getByRole("button", { name: "Create request" }).click();
  2557 |   await page.getByRole("dialog", { name: "PO-WOS-A-00001" }).getByRole("button", { name: "Go Back" }).click();
  2558 |   await page.getByRole("button", { name: "Logout" }).click();
  2559 | 
  2560 |   await loginAs(page, "admin@example.com");
  2561 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  2562 |   await page.getByRole("tab", { name: "Suppliers", exact: true }).click();
  2563 |   await page.getByRole("button", { name: "Add new supplier", exact: true }).click();
  2564 |   const supplier = page.getByRole("dialog", { name: "Add supplier" });
  2565 |   await supplier.getByLabel("Name", { exact: true }).fill("Issued Order Supplies");
  2566 |   await supplier.getByLabel("Contact name").fill("Nina Buyer");
  2567 |   await supplier.getByLabel("Phone").fill("9000000000");
  2568 |   await supplier.getByLabel("Email").fill("nina@example.com");
  2569 |   await supplier.getByRole("button", { name: "Save supplier", exact: true }).click();
  2570 | 
  2571 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2572 |   await page.getByRole("button", { name: "Process", exact: true }).click();
  2573 |   await page.getByRole("button", { name: "Review & approve request", exact: true }).click();
  2574 |   const approval = page.getByRole("dialog", { name: "Approve PO-WOS-A-00001" });
  2575 |   await approval.getByLabel("Supplier for PO line 1").selectOption({ label: "Issued Order Supplies" });
  2576 |   await approval.getByLabel("Pre-GST price for PO line 1").fill("320");
  2577 |   await approval.getByRole("button", { name: "Approve Purchase Request", exact: true }).click();
  2578 | 
  2579 |   const issued = page.getByRole("dialog", { name: "PO-WOS-A-00001" });
  2580 |   await expect(issued.getByText("This Purchase Order is fully approved.")).toBeVisible();
  2581 |   await issued.getByRole("button", { name: "Issue Purchase Order", exact: true }).click();
  2582 |   await expect(issued).toContainText("PO Issued");
  2583 |   const basket = issued.getByRole("region", { name: "Supplier Basket" });
  2584 |   await expect(basket).toContainText("Issued Order Supplies");
  2585 |   await expect(basket).toContainText("Nina Buyer");
  2586 |   await expect(basket).toContainText("9000000000");
  2587 |   await expect(basket).toContainText("nina@example.com");
  2588 |   await expect(basket).toContainText("3 ordered units across 1 item");
  2589 |   await issued.getByRole("button", { name: "Record delivery", exact: true }).click();
  2590 |   const firstDelivery = page.getByRole("dialog", { name: /Record delivery/ });
  2591 |   await firstDelivery.getByLabel("Delivered quantity for PO line 1").fill("1");
  2592 |   await firstDelivery.getByRole("button", { name: "Save delivery", exact: true }).click();
  2593 |   await expect(issued).toContainText("PO Received");
  2594 |   await issued.getByRole("button", { name: "Record delivery", exact: true }).click();
  2595 |   const secondDelivery = page.getByRole("dialog", { name: /Record delivery/ });
  2596 |   await secondDelivery.getByLabel("Delivered quantity for PO line 1").fill("2");
  2597 |   await secondDelivery.getByRole("button", { name: "Save delivery", exact: true }).click();
  2598 |   await expect(issued).toContainText("3 received");
```