# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> job sheet intake fields and damage marks persist through the Job Card edit dialog
- Location: tests\workshopos.spec.ts:2707:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('region', { name: 'Job sheet' }).getByText('2026-10-15', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('region', { name: 'Job sheet' }).getByText('2026-10-15', { exact: true }) with timeout 5000ms
  - waiting for getByRole('region', { name: 'Job sheet' }).getByText('2026-10-15', { exact: true })

```

```yaml
- complementary:
  - strong: WorkshopOS
  - text: Workshop Management. Simplified.
  - button "Hide left menu"
  - text: Owner/Admin
  - navigation "Owner/Admin menu":
    - button "Dashboard"
    - button "Advance Bookings"
    - button "Approvals (0)"
    - button "Data Flow"
    - button "Job Cards"
    - button "Media"
    - button "Purchase Orders"
    - button "Manage"
    - button "Search"
    - button "Admin Console"
    - group: Sales CRM
  - button "Logout"
- main:
  - paragraph: Owner/Admin
  - heading "Control room for linked workflow, blockers and cash." [level=1]
  - text: admin@example.com
  - dialog "View Job JC-2026-001392":
    - heading "View Job JC-2026-001392" [level=2]
    - paragraph: OD04DM1003 · Demo Customer 003
    - tablist "Job record sections":
      - tab "Details" [selected]
      - tab "Task List"
      - tab "Body Mark"
      - tab "Materials"
      - tab "Documents"
      - tab "Photos / Media"
      - tab "Invoice"
      - tab "Payment"
    - tabpanel "Details":
      - text: Customer
      - strong: Demo Customer 003 / 8100000003
      - text: Vehicle
      - strong: OD04DM1003 / Tata Nexon
      - text: Job Card
      - strong: JC-2026-001392
      - text: Status
      - strong: NEW / Create Estimate
      - text: Requested work
      - strong: yy
      - text: Work completed
      - strong: yy
      - text: Advisor
      - strong: Service advisor AA
      - text: Technician
      - strong: Technician Bay
      - region "Job sheet":
        - heading "Job sheet" [level=4]
        - text: Service type
        - strong: PPF
        - text: Pickup / Drop
        - strong: —
        - text: Estimated Delivery Date
        - textbox "Estimated Delivery Date": 2026-10-15
        - button "Save"
        - text: Fuel
        - strong: 8 bars
        - text: Accessories
        - strong: —
        - text: Engine number
        - strong: ENG-E2E-1
        - text: Address
        - strong: 12 MG Road
      - region "Current job documents":
        - heading "Current Documents" [level=4]
        - paragraph: Only active records are available
        - strong: Job Card
        - text: JC-2026-001392 - ready
        - group "Job Card actions":
          - button "Download PDF"
          - button "Print"
        - strong: Estimate
        - text: Estimate not created
        - group "Estimate actions":
          - button "Create Estimate"
        - strong: Invoice
        - text: Invoice not created - approve an estimate first
        - group "Invoice actions"
        - strong: Payment Receipt
        - text: Payment Receipt not created - created when a payment is recorded
        - group "Payment Receipt actions"
        - strong: Gate Pass
        - text: Gate Pass not created - created when the job is closed
        - group "Gate Pass actions"
    - button "Go Back"
  - heading "Job Cards" [level=2]
  - paragraph: Browse and manage job cards
  - button "Add Job Card"
  - text: Search
  - textbox "Search job cards":
    - /placeholder: Job, vehicle, customer or mobile
  - text: Main status
  - combobox "Main status":
    - option "All statuses" [selected]
    - option "NEW"
    - option "IN_PROGRESS"
    - option "COMPLETED"
    - option "CANCELLED"
    - option "CLOSED"
  - text: Workflow
  - combobox "Workflow status":
    - option "All workflows" [selected]
    - option "Create Estimate"
    - option "Delivered"
    - option "Follow-up Needed"
    - option "Gather Requirements"
    - option "Get Confirmation"
    - option "Invoice Ready"
    - option "Material Issued"
    - option "Material Requested"
    - option "Photos Shared"
    - option "QC Pending"
    - option "Remind Customer for Sharing Google Review/Feedback"
    - option "Washing Needed"
    - option "Work Started"
  - text: Estimated Delivery Date
  - textbox "Estimated delivery date"
  - text: Estimated Delivery Month-Year
  - combobox "Estimated delivery month-year":
    - option "All months"
    - option "October 2026" [selected]
  - text: Service advisor
  - combobox "Service advisor filter":
    - option "All advisors" [selected]
    - option "Service advisor 1"
    - option "Service advisor AA"
    - option "Service advisor BB1"
  - text: Sort
  - combobox "Sort results":
    - option "Newest" [selected]
    - option "Oldest"
    - option "Estimated delivery (soonest)"
    - option "Estimated delivery (latest)"
    - option "Amount (high to low)"
    - option "Amount (low to high)"
  - text: Show archived only
  - switch "Show archived only"
  - group "Search actions":
    - button "Clear"
  - button "Download"
  - group "View mode":
    - button "Grid" [pressed]
    - button "Table"
  - text: Showing 1 to 10 of 91 Per page
  - combobox "Records per page":
    - option "10" [selected]
    - option "20"
    - option "50"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Page 1": "1"
    - button "Page 2": "2"
    - button "Page 3": "3"
    - button "Page 4": "4"
    - button "Page 5": "5"
    - button "Page 10": "10"
    - button "Next page"
    - button "Last page"
  - article:
    - strong: OD04DM1003
    - text: Tata Nexon
    - heading "JC-2026-001392" [level=3]
    - paragraph: Demo Customer 003 · 8100000003
    - text: NEW · Create Estimate Est Inv Rcpt GP Total
    - strong: Rs 0
    - text: Estimated Delivery Date
    - strong: 2026-10-15
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD07DM1006
    - text: Toyota Fortuner
    - heading "JC-2026-002138" [level=3]
    - paragraph: Demo Customer 006 · 8100000006
    - text: IN PROGRESS · QC Pending Est Inv Rcpt GP Total
    - strong: Rs 9,440
    - text: Estimated Delivery Date
    - strong: 2026-10-09
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD06DM1005
    - text: Honda City
    - heading "JC-2026-002137" [level=3]
    - paragraph: Demo Customer 005 · 8100000005
    - text: IN PROGRESS · Photos Shared Est Inv Rcpt GP Total
    - strong: Rs 8,555
    - text: Estimated Delivery Date
    - strong: 2026-10-31
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD05DM1004
    - text: Maruti Brezza
    - heading "JC-2026-002136" [level=3]
    - paragraph: Demo Customer 004 · 8100000004
    - text: IN PROGRESS · Follow-up Needed Est Inv Rcpt GP Total
    - strong: Rs 7,080
    - text: Estimated Delivery Date
    - strong: 2026-10-13
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD04DM1003
    - text: Tata Nexon
    - heading "JC-2026-002135" [level=3]
    - paragraph: Demo Customer 003 · 8100000003
    - text: IN PROGRESS · Work Started Est Inv Rcpt GP Total
    - strong: Rs 6,785
    - text: Estimated Delivery Date
    - strong: 2026-10-11
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD03DM1002
    - text: Mahindra Thar
    - heading "JC-2026-002134" [level=3]
    - paragraph: Demo Customer 002 · 8100000002
    - text: IN PROGRESS · Washing Needed Est Inv Rcpt GP Total
    - strong: Rs 5,900
    - text: Estimated Delivery Date
    - strong: 2026-10-30
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD02DM1001
    - text: Hyundai Creta
    - heading "JC-2026-002133" [level=3]
    - paragraph: Demo Customer 001 · 8100000001
    - text: IN PROGRESS · Material Issued Est Inv Rcpt GP Total
    - strong: Rs 5,015
    - text: Estimated Delivery Date
    - strong: 2026-10-12
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD13DM1132
    - text: Maruti Brezza
    - heading "JC-2026-002132" [level=3]
    - paragraph: Demo Customer 012 · 8100000012
    - text: IN PROGRESS · Material Requested Est Inv Rcpt GP Total
    - strong: Rs 3,540
    - text: Estimated Delivery Date
    - strong: 2026-10-10
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD12DM1131
    - text: Tata Nexon
    - heading "JC-2026-002131" [level=3]
    - paragraph: Demo Customer 011 · 8100000011
    - text: NEW · Get Confirmation Est Inv Rcpt GP Total
    - strong: Rs 13,865
    - text: Estimated Delivery Date
    - strong: 2026-10-29
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD11DM1130
    - text: Mahindra Thar
    - heading "JC-2026-002130" [level=3]
    - paragraph: Demo Customer 010 · 8100000010
    - text: NEW · Create Estimate Est Inv Rcpt GP Total
    - strong: Rs 12,980
    - text: Estimated Delivery Date
    - strong: 2026-10-18
    - button "View"
    - button "Edit"
    - button "Archive"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Page 1": "1"
    - button "Page 2": "2"
    - button "Page 3": "3"
    - button "Page 4": "4"
    - button "Page 5": "5"
    - button "Page 10": "10"
    - button "Next page"
    - button "Last page"
```

# Test source

```ts
  2647 | }
  2648 | 
  2649 | async function expectJobCardToolbarHasOneRow(page: import("@playwright/test").Page) {
  2650 |   const rows = await page.locator(".job-card-filter-grid > label, .job-card-filter-grid > .list-search-actions").evaluateAll((controls) => {
  2651 |     const positions = controls.map((control) => Math.round(control.getBoundingClientRect().bottom));
  2652 |     return [...new Set(positions)].sort((left, right) => left - right);
  2653 |   });
  2654 |   expect(rows).toHaveLength(1);
  2655 | }
  2656 | 
  2657 | async function expectManagementToolbarHasOneRow(scope: import("@playwright/test").Locator, selector: string) {
  2658 |   const rows = await scope.locator(`${selector} > label, ${selector} > .list-search-actions, ${selector} > .filter-clear-action`).evaluateAll((controls) => {
  2659 |     const positions = controls.map((control) => Math.round(control.getBoundingClientRect().bottom));
  2660 |     return [...new Set(positions)].sort((left, right) => left - right);
  2661 |   });
  2662 |   expect(rows).toHaveLength(1);
  2663 | }
  2664 | 
  2665 | async function expectManagementToolbarStacks(scope: import("@playwright/test").Locator, selector: string) {
  2666 |   const rows = await scope.locator(`${selector} > label, ${selector} > .list-search-actions, ${selector} > .filter-clear-action`).evaluateAll((controls) => new Set(controls.map((control) => Math.round(control.getBoundingClientRect().bottom))).size);
  2667 |   expect(rows).toBeGreaterThan(1);
  2668 | }
  2669 | 
  2670 | async function expectMinimumVerticalGap(upper: import("@playwright/test").Locator, lower: import("@playwright/test").Locator, minimum = 14) {
  2671 |   const [upperBox, lowerBox] = await Promise.all([upper.boundingBox(), lower.boundingBox()]);
  2672 |   if (!upperBox || !lowerBox) throw new Error("Expected both layout elements to have bounding boxes.");
  2673 |   expect(lowerBox.y - (upperBox.y + upperBox.height)).toBeGreaterThanOrEqual(minimum - 0.5);
  2674 | }
  2675 | 
  2676 | async function readWorksheet(download: import("@playwright/test").Download) {
  2677 |   const filePath = await download.path();
  2678 |   if (!filePath) throw new Error("Downloaded workbook was not saved");
  2679 |   const workbook = XLSX.readFile(filePath);
  2680 |   return XLSX.utils.sheet_to_json<(string | number)[]>(workbook.Sheets.Report, { header: 1, defval: "" });
  2681 | }
  2682 | 
  2683 | async function pngPixels(page: import("@playwright/test").Page, download: import("@playwright/test").Download) {
  2684 |   const filePath = await download.path();
  2685 |   if (!filePath) throw new Error("Downloaded image was not saved");
  2686 |   const png = readFileSync(filePath).toString("base64");
  2687 |   return page.evaluate(async (encoded) => {
  2688 |     const image = new Image();
  2689 |     await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("PNG could not be decoded")); image.src = `data:image/png;base64,${encoded}`; });
  2690 |     const canvas = document.createElement("canvas");
  2691 |     canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
  2692 |     const context = canvas.getContext("2d");
  2693 |     if (!context) throw new Error("Canvas is not available");
  2694 |     context.drawImage(image, 0, 0);
  2695 |     const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  2696 |     let nonWhite = 0;
  2697 |     let markerRed = 0;
  2698 |     for (let index = 0; index < pixels.length; index += 4) {
  2699 |       const [red, green, blue, alpha] = pixels.subarray(index, index + 4);
  2700 |       if (alpha > 0 && (red < 245 || green < 245 || blue < 245)) nonWhite += 1;
  2701 |       if (red > 180 && green < 110 && blue < 110) markerRed += 1;
  2702 |     }
  2703 |     return { width: canvas.width, height: canvas.height, nonWhite, markerRed };
  2704 |   }, png);
  2705 | }
  2706 | 
  2707 | test("job sheet intake fields and damage marks persist through the Job Card edit dialog", async ({ page }) => {
  2708 |   await loginAs(page, "admin@example.com");
  2709 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2710 |   await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  2711 |   const sheet = page.getByRole("region", { name: "Job sheet" });
  2712 |   await sheet.getByLabel("Service Type").selectOption("PPF");
  2713 |   await sheet.getByLabel("Estimated Delivery Date").fill("2026-10-15");
  2714 |   await sheet.getByLabel("Engine Number").fill("ENG-E2E-1");
  2715 |   await sheet.getByLabel("Address").fill("12 MG Road");
  2716 |   await sheet.getByRole("button", { name: "Save Job Sheet" }).click();
  2717 |   await page.getByRole("tab", { name: "Body Mark" }).click();
  2718 |   const body = page.getByRole("region", { name: "Body mark" });
  2719 |   const diagram = body.getByTestId("damage-diagram");
  2720 |   await expect(diagram.getByRole("img", { name: "Vehicle body illustration" })).toHaveAttribute("src", "/car-damage-diagram.png");
  2721 |   const blankDownload = page.waitForEvent("download");
  2722 |   await body.getByRole("button", { name: "Download image" }).click();
  2723 |   const blankPixels = await pngPixels(page, await blankDownload);
  2724 |   const canvas = diagram.locator(".body-mark-canvas");
  2725 |   const box = await canvas.boundingBox();
  2726 |   expect(box).not.toBeNull();
  2727 |   expect(box!.height / box!.width).toBeCloseTo(682 / 511, 1);
  2728 |   await canvas.click({ position: { x: box!.width / 2, y: box!.height / 2 } });
  2729 |   await canvas.click({ position: { x: box!.width * .25, y: box!.height * .25 } });
  2730 |   await expect(body.getByTestId("damage-mark")).toHaveCount(2);
  2731 |   await body.getByTestId("damage-mark").first().click();
  2732 |   await expect(body.getByTestId("damage-mark")).toHaveCount(1);
  2733 |   const markedDownload = page.waitForEvent("download");
  2734 |   await body.getByRole("button", { name: "Download image" }).click();
  2735 |   const markedPixels = await pngPixels(page, await markedDownload);
  2736 |   expect(markedPixels.width).toBeGreaterThan(0);
  2737 |   expect(markedPixels.height).toBeGreaterThan(0);
  2738 |   expect(markedPixels.nonWhite).toBeGreaterThan(10_000);
  2739 |   expect(markedPixels.markerRed).toBeGreaterThan(blankPixels.markerRed + 100);
  2740 |   await body.getByRole("button", { name: "Save Body Marks" }).click();
  2741 |   await page.getByRole("button", { name: "Go Back" }).click();
  2742 |   await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  2743 |   const view = page.getByRole("region", { name: "Job sheet" });
  2744 |   await expect(view.getByText("ENG-E2E-1")).toBeVisible();
  2745 |   await expect(view.getByText("12 MG Road")).toBeVisible();
  2746 |   await expect(view.getByText("PPF", { exact: true })).toBeVisible();
> 2747 |   await expect(view.getByText("2026-10-15", { exact: true })).toBeVisible();
       |                                                               ^ Error: expect(locator).toBeVisible() failed
  2748 |   await page.getByRole("tab", { name: "Body Mark" }).click();
  2749 |   await expect(page.getByRole("region", { name: "Body mark" }).getByTestId("damage-mark")).toHaveCount(1);
  2750 | });
  2751 | 
  2752 | test("owner adds, requests and cancels a material row with an over-stock warning", async ({ page }) => {
  2753 |   await loginAs(page, "admin@example.com");
  2754 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2755 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  2756 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2757 |   await editor.getByRole("tab", { name: "Materials" }).click();
  2758 |   const itemPicker = editor.getByRole("combobox", { name: "Item", exact: true });
  2759 |   const itemOptions = editor.getByRole("listbox", { name: "Item options" });
  2760 |   await itemPicker.fill("Tack");
  2761 |   await itemOptions.getByRole("option", { name: /Tack Cloth/ }).click();
  2762 |   await editor.getByLabel("Qty", { exact: true }).fill("999999");
  2763 |   await editor.getByRole("button", { name: "Add Row" }).click();
  2764 |   const row = editor.getByRole("table", { name: "Material rows" }).locator("tbody tr").filter({ hasText: "Tack Cloth" });
  2765 |   await expect(row).toContainText(/more than the \d+(?:\.\d+)? in stock/);
  2766 |   await expect(row.getByRole("button", { name: "Delete" })).toBeVisible();
  2767 |   await row.getByRole("button", { name: "Request Item", exact: true }).click();
  2768 |   const requested = editor.getByRole("table", { name: "Material rows" }).locator("tbody tr").filter({ hasText: "Tack Cloth" });
  2769 |   await expect(requested).toContainText("Requested");
  2770 |   await expect(requested.getByRole("button", { name: "Delete" })).toHaveCount(0);
  2771 |   await requested.getByRole("button", { name: "Cancel Request" }).click();
  2772 |   await expect(requested).toContainText("Cancelled");
  2773 | });
  2774 | 
  2775 | test("Store releases a requested row, then Admin edits it as Issued with a note", async ({ page }) => {
  2776 |   await loginAs(page, "admin@example.com");
  2777 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2778 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  2779 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2780 |   await editor.getByRole("tab", { name: "Materials" }).click();
  2781 |   const itemPicker = editor.getByRole("combobox", { name: "Item", exact: true });
  2782 |   const itemOptions = editor.getByRole("listbox", { name: "Item options" });
  2783 |   await itemPicker.fill("Tack");
  2784 |   await itemOptions.getByRole("option", { name: /Tack Cloth/ }).click();
  2785 |   await editor.getByLabel("Qty", { exact: true }).fill("2");
  2786 |   await editor.getByRole("button", { name: "Add Row" }).click();
  2787 |   const row = editor.getByRole("table", { name: "Material rows" }).locator("tbody tr").filter({ hasText: "Tack Cloth" });
  2788 |   await row.getByRole("button", { name: "Request Item", exact: true }).click();
  2789 |   await editor.getByRole("button", { name: "Go Back" }).click();
  2790 |   await page.getByRole("button", { name: "Logout" }).click();
  2791 |   await loginAs(page, "store@example.com");
  2792 |   await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  2793 |   await page.getByLabel("Item", { exact: true }).fill("Tack");
  2794 |   await page.getByRole("option", { name: /Tack Cloth/ }).click();
  2795 |   await page.getByRole("table", { name: "Issue Material results" }).getByRole("button", { name: "Issue Material", exact: true }).click();
  2796 |   await page.getByRole("dialog", { name: "Confirm material release" }).getByRole("button", { name: "Confirm release", exact: true }).click();
  2797 |   await page.getByRole("button", { name: "Logout" }).click();
  2798 |   await loginAs(page, "admin@example.com");
  2799 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2800 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  2801 |   const issuedEditor = page.getByRole("dialog", { name: /Edit Job/ });
  2802 |   await issuedEditor.getByRole("tab", { name: "Materials" }).click();
  2803 |   const issuedRow = issuedEditor.getByRole("table", { name: "Material rows" }).locator("tbody tr").filter({ hasText: "Tack Cloth" });
  2804 |   await expect(issuedRow).toContainText("Issued");
  2805 |   await issuedRow.getByRole("button", { name: "Edit Request" }).click();
  2806 |   const issuedEditorRow = issuedEditor.getByRole("row", { name: /Tack Cloth.*Issued/ });
  2807 |   await issuedEditorRow.getByRole("spinbutton", { name: "Qty", exact: true }).fill("3");
  2808 |   await issuedEditorRow.getByRole("button", { name: "Save" }).click();
  2809 |   await expect(issuedEditorRow.getByRole("alert")).toContainText("note is required");
  2810 |   await issuedEditorRow.getByLabel("Edit request note").fill("Customer wanted more");
  2811 |   await issuedEditorRow.getByRole("button", { name: "Save" }).click();
  2812 |   await expect(issuedEditorRow).toContainText("Issued");
  2813 | });
  2814 | 
  2815 | test("estimate approval and invoice creation enable Completed with per-line GST totals", async ({ page }) => {
  2816 |   await loginAs(page, "admin@example.com");
  2817 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2818 |   await page.getByLabel("Main status").selectOption("IN_PROGRESS");
  2819 |   await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  2820 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2821 |   await editor.getByRole("tab", { name: "Invoice" }).click();
  2822 |   await expect(editor.getByText("No invoice yet.")).toBeVisible();
  2823 |   await expect(editor.getByRole("button", { name: "Complete Work" })).toBeDisabled();
  2824 |   const approve = editor.getByRole("button", { name: "Approve Estimate" });
  2825 |   if (await approve.count()) {
  2826 |     await approve.first().click();
  2827 |     await page.getByRole("dialog", { name: "Approve Estimate?" }).getByRole("button", { name: "Approve Estimate" }).click();
  2828 |   }
  2829 |   await editor.getByRole("button", { name: "Create Invoice" }).first().click();
  2830 |   const create = page.getByRole("dialog", { name: "Create Invoice" });
  2831 |   await create.getByLabel("Invoice item 1 rate").fill("1000");
  2832 |   await create.getByLabel("Invoice item 1 quantity").fill("1");
  2833 |   await expect(create.getByLabel("Invoice item 1 GST type")).toHaveValue("CGST+SGST");
  2834 |   await expect(create.getByLabel("Invoice item 1 GST rate")).toHaveValue("18%");
  2835 |   await create.getByLabel("Invoice discount").fill("100");
  2836 |   await expect(create.getByLabel("Invoice totals")).toContainText("Discount");
  2837 |   await create.getByRole("button", { name: "Save Invoice" }).click();
  2838 |   await expect(create).toBeHidden();
  2839 |   await expect(editor.getByRole("table", { name: "Invoice lines" })).toBeVisible();
  2840 |   await expect(editor.getByRole("button", { name: "Complete Work" })).toBeEnabled();
  2841 | });
  2842 | test("searchable pickers dismiss outside interactions and still select options", async ({ page }) => {
  2843 |   await loginAs(page, "reception@example.com");
  2844 |   await page.getByRole("button", { name: "Create New Visit" }).click();
  2845 |   const visit = page.getByRole("dialog", { name: "Create New Visit" });
  2846 |   const customerPicker = visit.getByRole("combobox", { name: "Existing customer" });
  2847 |   const customerOptions = visit.getByRole("listbox");
```