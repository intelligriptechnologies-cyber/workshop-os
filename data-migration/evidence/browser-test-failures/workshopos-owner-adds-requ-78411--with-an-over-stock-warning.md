# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> owner adds, requests and cancels a material row with an over-stock warning
- Location: tests\workshopos.spec.ts:2752:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.record-card').filter({ hasText: 'JC-2026-001246' }).getByRole('button', { name: 'Edit', exact: true })

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e10]:
      - strong [ref=f1e11]: WorkshopOS
      - generic [ref=f1e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f1e13] [cursor=pointer]
    - generic [ref=f1e17]: Owner/Admin
    - navigation "Owner/Admin menu" [ref=f1e18]:
      - button "Dashboard" [ref=f1e19] [cursor=pointer]
      - button "Advance Bookings" [ref=f1e24] [cursor=pointer]
      - button "Approvals (0)" [ref=f1e28] [cursor=pointer]
      - button "Data Flow" [ref=f1e33] [cursor=pointer]
      - button "Job Cards" [active] [ref=f1e39] [cursor=pointer]
      - button "Media" [ref=f1e44] [cursor=pointer]
      - button "Purchase Orders" [ref=f1e49] [cursor=pointer]
      - button "Manage" [ref=f1e53] [cursor=pointer]
      - button "Search" [ref=f1e58] [cursor=pointer]
      - button "Admin Console" [ref=f1e63] [cursor=pointer]
      - group [ref=f1e68]:
        - generic "Sales CRM" [ref=f1e69] [cursor=pointer]
    - button "Logout" [ref=f1e70] [cursor=pointer]
  - main [ref=f1e75]:
    - generic [ref=f1e76]:
      - generic [ref=f1e77]:
        - paragraph [ref=f1e78]: Owner/Admin
        - heading "Control room for linked workflow, blockers and cash." [level=1] [ref=f1e79]
      - generic [ref=f1e80]: admin@example.com
    - generic [ref=f1e84]:
      - generic [ref=f1e85]:
        - generic [ref=f1e86]:
          - heading "Job Cards" [level=2] [ref=f1e87]
          - paragraph [ref=f1e88]: Browse and manage job cards
        - button "Add Job Card" [ref=f1e89] [cursor=pointer]
      - generic [ref=f1e92]:
        - generic [ref=f1e93]:
          - generic [ref=f1e94]:
            - text: Search
            - textbox "Search job cards" [ref=f1e95]:
              - /placeholder: Job, vehicle, customer or mobile
          - generic [ref=f1e96]:
            - text: Main status
            - combobox "Main status" [ref=f1e97]:
              - option "All statuses" [selected]
              - option "NEW"
              - option "IN_PROGRESS"
              - option "COMPLETED"
              - option "CANCELLED"
              - option "CLOSED"
          - generic [ref=f1e98]:
            - text: Workflow
            - combobox "Workflow status" [ref=f1e99]:
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
          - generic [ref=f1e100]:
            - text: Estimated Delivery Date
            - textbox "Estimated delivery date" [ref=f1e101]
          - generic [ref=f1e102]:
            - text: Estimated Delivery Month-Year
            - combobox "Estimated delivery month-year" [ref=f1e103]:
              - option "All months"
              - option "October 2026" [selected]
        - generic [ref=f1e104]:
          - generic [ref=f1e105]:
            - text: Service advisor
            - combobox "Service advisor filter" [ref=f1e106]:
              - option "All advisors" [selected]
              - option "Service advisor 1"
              - option "Service advisor AA"
              - option "Service advisor BB1"
          - generic [ref=f1e107]:
            - text: Sort
            - combobox "Sort results" [ref=f1e108]:
              - option "Newest" [selected]
              - option "Oldest"
              - option "Estimated delivery (soonest)"
              - option "Estimated delivery (latest)"
              - option "Amount (high to low)"
              - option "Amount (low to high)"
          - generic [ref=f1e109]:
            - generic [ref=f1e110]: Show archived only
            - switch "Show archived only" [ref=f1e111] [cursor=pointer]
          - group "Search actions" [ref=f1e114]:
            - button "Clear" [ref=f1e115] [cursor=pointer]
      - generic [ref=f1e116]:
        - generic [ref=f1e117]:
          - button "Download" [ref=f1e119] [cursor=pointer]
          - group "View mode" [ref=f1e123]:
            - button "Grid" [pressed] [ref=f1e124] [cursor=pointer]
            - button "Table" [ref=f1e125] [cursor=pointer]
        - generic [ref=f1e126]: Showing 1 to 10 of 91
        - generic [ref=f1e127]:
          - generic [ref=f1e128]:
            - text: Per page
            - combobox "Records per page" [ref=f1e129]:
              - option "10" [selected]
              - option "20"
              - option "50"
          - navigation "Results pagination" [ref=f1e130]:
            - button "First page" [disabled] [ref=f1e131]
            - button "Previous page" [disabled] [ref=f1e134]
            - generic [ref=f1e137]:
              - button "Page 1" [ref=f1e138] [cursor=pointer]: "1"
              - button "Page 2" [ref=f1e139] [cursor=pointer]: "2"
              - button "Page 3" [ref=f1e140] [cursor=pointer]: "3"
              - button "Page 4" [ref=f1e141] [cursor=pointer]: "4"
              - button "Page 5" [ref=f1e142] [cursor=pointer]: "5"
              - generic [aria-hidden] [ref=f1e143]: …
              - button "Page 10" [ref=f1e144] [cursor=pointer]: "10"
            - button "Next page" [ref=f1e145] [cursor=pointer]
            - button "Last page" [ref=f1e148] [cursor=pointer]
      - generic [ref=f1e151]:
        - article [ref=f1e152]:
          - generic [ref=f1e153]:
            - strong [ref=f1e154]: OD04DM1003
            - generic [ref=f1e155]: Tata Nexon
          - heading "JC-2026-001392" [level=3] [ref=f1e156]
          - paragraph [ref=f1e157]: Demo Customer 003 · 8100000003
          - generic [ref=f1e158]: NEW · Create Estimate
          - generic "Documents" [ref=f1e159]:
            - 'generic "Estimate: not created" [ref=f1e160]': Est
            - 'generic "Invoice: not created" [ref=f1e161]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e162]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e163]': GP
          - generic [ref=f1e164]:
            - generic [ref=f1e165]: Total
            - strong [ref=f1e166]: Rs 0
          - generic [ref=f1e167]:
            - generic [ref=f1e168]: Estimated Delivery Date
            - strong [ref=f1e169]: 2026-10-09
          - generic [ref=f1e170]:
            - button "View" [ref=f1e171] [cursor=pointer]
            - button "Edit" [ref=f1e172] [cursor=pointer]
            - button "Archive" [ref=f1e173] [cursor=pointer]
        - article [ref=f1e174]:
          - generic [ref=f1e175]:
            - strong [ref=f1e176]: OD07DM1006
            - generic [ref=f1e177]: Toyota Fortuner
          - heading "JC-2026-002138" [level=3] [ref=f1e178]
          - paragraph [ref=f1e179]: Demo Customer 006 · 8100000006
          - generic [ref=f1e180]: IN PROGRESS · QC Pending
          - generic "Documents" [ref=f1e181]:
            - 'generic "Estimate: created" [ref=f1e182]': Est
            - 'generic "Invoice: created" [ref=f1e183]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e184]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e185]': GP
          - generic [ref=f1e186]:
            - generic [ref=f1e187]: Total
            - strong [ref=f1e188]: Rs 9,440
          - generic [ref=f1e189]:
            - generic [ref=f1e190]: Estimated Delivery Date
            - strong [ref=f1e191]: 2026-10-09
          - generic [ref=f1e192]:
            - button "View" [ref=f1e193] [cursor=pointer]
            - button "Edit" [ref=f1e194] [cursor=pointer]
            - button "Archive" [ref=f1e195] [cursor=pointer]
        - article [ref=f1e196]:
          - generic [ref=f1e197]:
            - strong [ref=f1e198]: OD06DM1005
            - generic [ref=f1e199]: Honda City
          - heading "JC-2026-002137" [level=3] [ref=f1e200]
          - paragraph [ref=f1e201]: Demo Customer 005 · 8100000005
          - generic [ref=f1e202]: IN PROGRESS · Photos Shared
          - generic "Documents" [ref=f1e203]:
            - 'generic "Estimate: created" [ref=f1e204]': Est
            - 'generic "Invoice: not created" [ref=f1e205]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e206]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e207]': GP
          - generic [ref=f1e208]:
            - generic [ref=f1e209]: Total
            - strong [ref=f1e210]: Rs 8,555
          - generic [ref=f1e211]:
            - generic [ref=f1e212]: Estimated Delivery Date
            - strong [ref=f1e213]: 2026-10-31
          - generic [ref=f1e214]:
            - button "View" [ref=f1e215] [cursor=pointer]
            - button "Edit" [ref=f1e216] [cursor=pointer]
            - button "Archive" [ref=f1e217] [cursor=pointer]
        - article [ref=f1e218]:
          - generic [ref=f1e219]:
            - strong [ref=f1e220]: OD05DM1004
            - generic [ref=f1e221]: Maruti Brezza
          - heading "JC-2026-002136" [level=3] [ref=f1e222]
          - paragraph [ref=f1e223]: Demo Customer 004 · 8100000004
          - generic [ref=f1e224]: IN PROGRESS · Follow-up Needed
          - generic "Documents" [ref=f1e225]:
            - 'generic "Estimate: created" [ref=f1e226]': Est
            - 'generic "Invoice: not created" [ref=f1e227]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e228]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e229]': GP
          - generic [ref=f1e230]:
            - generic [ref=f1e231]: Total
            - strong [ref=f1e232]: Rs 7,080
          - generic [ref=f1e233]:
            - generic [ref=f1e234]: Estimated Delivery Date
            - strong [ref=f1e235]: 2026-10-13
          - generic [ref=f1e236]:
            - button "View" [ref=f1e237] [cursor=pointer]
            - button "Edit" [ref=f1e238] [cursor=pointer]
            - button "Archive" [ref=f1e239] [cursor=pointer]
        - article [ref=f1e240]:
          - generic [ref=f1e241]:
            - strong [ref=f1e242]: OD04DM1003
            - generic [ref=f1e243]: Tata Nexon
          - heading "JC-2026-002135" [level=3] [ref=f1e244]
          - paragraph [ref=f1e245]: Demo Customer 003 · 8100000003
          - generic [ref=f1e246]: IN PROGRESS · Work Started
          - generic "Documents" [ref=f1e247]:
            - 'generic "Estimate: created" [ref=f1e248]': Est
            - 'generic "Invoice: not created" [ref=f1e249]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e250]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e251]': GP
          - generic [ref=f1e252]:
            - generic [ref=f1e253]: Total
            - strong [ref=f1e254]: Rs 6,785
          - generic [ref=f1e255]:
            - generic [ref=f1e256]: Estimated Delivery Date
            - strong [ref=f1e257]: 2026-10-11
          - generic [ref=f1e258]:
            - button "View" [ref=f1e259] [cursor=pointer]
            - button "Edit" [ref=f1e260] [cursor=pointer]
            - button "Archive" [ref=f1e261] [cursor=pointer]
        - article [ref=f1e262]:
          - generic [ref=f1e263]:
            - strong [ref=f1e264]: OD03DM1002
            - generic [ref=f1e265]: Mahindra Thar
          - heading "JC-2026-002134" [level=3] [ref=f1e266]
          - paragraph [ref=f1e267]: Demo Customer 002 · 8100000002
          - generic [ref=f1e268]: IN PROGRESS · Washing Needed
          - generic "Documents" [ref=f1e269]:
            - 'generic "Estimate: created" [ref=f1e270]': Est
            - 'generic "Invoice: not created" [ref=f1e271]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e272]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e273]': GP
          - generic [ref=f1e274]:
            - generic [ref=f1e275]: Total
            - strong [ref=f1e276]: Rs 5,900
          - generic [ref=f1e277]:
            - generic [ref=f1e278]: Estimated Delivery Date
            - strong [ref=f1e279]: 2026-10-30
          - generic [ref=f1e280]:
            - button "View" [ref=f1e281] [cursor=pointer]
            - button "Edit" [ref=f1e282] [cursor=pointer]
            - button "Archive" [ref=f1e283] [cursor=pointer]
        - article [ref=f1e284]:
          - generic [ref=f1e285]:
            - strong [ref=f1e286]: OD02DM1001
            - generic [ref=f1e287]: Hyundai Creta
          - heading "JC-2026-002133" [level=3] [ref=f1e288]
          - paragraph [ref=f1e289]: Demo Customer 001 · 8100000001
          - generic [ref=f1e290]: IN PROGRESS · Material Issued
          - generic "Documents" [ref=f1e291]:
            - 'generic "Estimate: created" [ref=f1e292]': Est
            - 'generic "Invoice: not created" [ref=f1e293]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e294]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e295]': GP
          - generic [ref=f1e296]:
            - generic [ref=f1e297]: Total
            - strong [ref=f1e298]: Rs 5,015
          - generic [ref=f1e299]:
            - generic [ref=f1e300]: Estimated Delivery Date
            - strong [ref=f1e301]: 2026-10-12
          - generic [ref=f1e302]:
            - button "View" [ref=f1e303] [cursor=pointer]
            - button "Edit" [ref=f1e304] [cursor=pointer]
            - button "Archive" [ref=f1e305] [cursor=pointer]
        - article [ref=f1e306]:
          - generic [ref=f1e307]:
            - strong [ref=f1e308]: OD13DM1132
            - generic [ref=f1e309]: Maruti Brezza
          - heading "JC-2026-002132" [level=3] [ref=f1e310]
          - paragraph [ref=f1e311]: Demo Customer 012 · 8100000012
          - generic [ref=f1e312]: IN PROGRESS · Material Requested
          - generic "Documents" [ref=f1e313]:
            - 'generic "Estimate: created" [ref=f1e314]': Est
            - 'generic "Invoice: not created" [ref=f1e315]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e316]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e317]': GP
          - generic [ref=f1e318]:
            - generic [ref=f1e319]: Total
            - strong [ref=f1e320]: Rs 3,540
          - generic [ref=f1e321]:
            - generic [ref=f1e322]: Estimated Delivery Date
            - strong [ref=f1e323]: 2026-10-10
          - generic [ref=f1e324]:
            - button "View" [ref=f1e325] [cursor=pointer]
            - button "Edit" [ref=f1e326] [cursor=pointer]
            - button "Archive" [ref=f1e327] [cursor=pointer]
        - article [ref=f1e328]:
          - generic [ref=f1e329]:
            - strong [ref=f1e330]: OD12DM1131
            - generic [ref=f1e331]: Tata Nexon
          - heading "JC-2026-002131" [level=3] [ref=f1e332]
          - paragraph [ref=f1e333]: Demo Customer 011 · 8100000011
          - generic [ref=f1e334]: NEW · Get Confirmation
          - generic "Documents" [ref=f1e335]:
            - 'generic "Estimate: created" [ref=f1e336]': Est
            - 'generic "Invoice: not created" [ref=f1e337]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e338]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e339]': GP
          - generic [ref=f1e340]:
            - generic [ref=f1e341]: Total
            - strong [ref=f1e342]: Rs 13,865
          - generic [ref=f1e343]:
            - generic [ref=f1e344]: Estimated Delivery Date
            - strong [ref=f1e345]: 2026-10-29
          - generic [ref=f1e346]:
            - button "View" [ref=f1e347] [cursor=pointer]
            - button "Edit" [ref=f1e348] [cursor=pointer]
            - button "Archive" [ref=f1e349] [cursor=pointer]
        - article [ref=f1e350]:
          - generic [ref=f1e351]:
            - strong [ref=f1e352]: OD11DM1130
            - generic [ref=f1e353]: Mahindra Thar
          - heading "JC-2026-002130" [level=3] [ref=f1e354]
          - paragraph [ref=f1e355]: Demo Customer 010 · 8100000010
          - generic [ref=f1e356]: NEW · Create Estimate
          - generic "Documents" [ref=f1e357]:
            - 'generic "Estimate: created" [ref=f1e358]': Est
            - 'generic "Invoice: not created" [ref=f1e359]': Inv
            - 'generic "Payment Receipt: not created" [ref=f1e360]': Rcpt
            - 'generic "Gate Pass: not created" [ref=f1e361]': GP
          - generic [ref=f1e362]:
            - generic [ref=f1e363]: Total
            - strong [ref=f1e364]: Rs 12,980
          - generic [ref=f1e365]:
            - generic [ref=f1e366]: Estimated Delivery Date
            - strong [ref=f1e367]: 2026-10-18
          - generic [ref=f1e368]:
            - button "View" [ref=f1e369] [cursor=pointer]
            - button "Edit" [ref=f1e370] [cursor=pointer]
            - button "Archive" [ref=f1e371] [cursor=pointer]
      - navigation "Results pagination" [ref=f1e372]:
        - button "First page" [disabled] [ref=f1e373]
        - button "Previous page" [disabled] [ref=f1e376]
        - generic [ref=f1e379]:
          - button "Page 1" [ref=f1e380] [cursor=pointer]: "1"
          - button "Page 2" [ref=f1e381] [cursor=pointer]: "2"
          - button "Page 3" [ref=f1e382] [cursor=pointer]: "3"
          - button "Page 4" [ref=f1e383] [cursor=pointer]: "4"
          - button "Page 5" [ref=f1e384] [cursor=pointer]: "5"
          - generic [aria-hidden] [ref=f1e385]: …
          - button "Page 10" [ref=f1e386] [cursor=pointer]: "10"
        - button "Next page" [ref=f1e387] [cursor=pointer]
        - button "Last page" [ref=f1e390] [cursor=pointer]
```

# Test source

```ts
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
  2747 |   await expect(view.getByText("2026-10-15", { exact: true })).toBeVisible();
  2748 |   await page.getByRole("tab", { name: "Body Mark" }).click();
  2749 |   await expect(page.getByRole("region", { name: "Body mark" }).getByTestId("damage-mark")).toHaveCount(1);
  2750 | });
  2751 | 
  2752 | test("owner adds, requests and cancels a material row with an over-stock warning", async ({ page }) => {
  2753 |   await loginAs(page, "admin@example.com");
  2754 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
> 2755 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
       |                                                                                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  2848 |   await customerPicker.fill("Rahul");
  2849 |   await expect(customerOptions).toBeVisible();
  2850 |   await visit.getByLabel("Customer Name").click();
  2851 |   await expect(customerOptions).toBeHidden();
  2852 |   await expect(customerPicker).toHaveAttribute("aria-expanded", "false");
  2853 |   await customerPicker.fill("Rahul");
  2854 |   await customerOptions.getByRole("option", { name: /Rahul Sharma/ }).click();
  2855 |   await expect(visit.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
```