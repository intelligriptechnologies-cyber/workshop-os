# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> estimate approval and invoice creation enable Completed with per-line GST totals
- Location: tests\workshopos.spec.ts:2815:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: /Edit Job/ }).getByText('No invoice yet.')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog', { name: /Edit Job/ }).getByText('No invoice yet.') with timeout 5000ms
  - waiting for getByRole('dialog', { name: /Edit Job/ }).getByText('No invoice yet.')

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
  - dialog "Edit Job JC-2026-002138":
    - heading "Edit Job JC-2026-002138" [level=2]
    - paragraph: OD07DM1006 · Demo Customer 006
    - region "Job lifecycle":
      - text: IN PROGRESS JC-2026-002138 · OD07DM1006
      - button "Complete Work"
      - button "Put On Hold"
      - button "Cancel Job"
      - heading "Lifecycle Checklist" [level=2]
      - paragraph: IN_PROGRESS · cycle 1
      - paragraph: "1 remaining: QC Pending"
      - list:
        - listitem:
          - checkbox "Material Requested Completed 16 Feb 2026, 4:30 pm" [checked] [disabled]
          - strong: Material Requested
          - text: Completed 16 Feb 2026, 4:30 pm
        - listitem:
          - checkbox "Material Issued Completed 16 Feb 2026, 4:30 pm" [checked] [disabled]
          - strong: Material Issued
          - text: Completed 16 Feb 2026, 4:30 pm
        - listitem:
          - checkbox "Washing Needed (optional) Completed 16 Feb 2026, 4:30 pm" [checked] [disabled]
          - strong:
            - text: Washing Needed
            - emphasis: (optional)
          - text: Completed 16 Feb 2026, 4:30 pm
        - listitem:
          - checkbox "Work Started Completed 16 Feb 2026, 4:30 pm" [checked] [disabled]
          - strong: Work Started
          - text: Completed 16 Feb 2026, 4:30 pm
        - listitem:
          - checkbox "Follow-up Needed (optional) Completed 16 Feb 2026, 4:30 pm" [checked] [disabled]
          - strong:
            - text: Follow-up Needed
            - emphasis: (optional)
          - text: Completed 16 Feb 2026, 4:30 pm
        - listitem:
          - checkbox "Photos Shared Completed 16 Feb 2026, 4:30 pm" [checked]
          - strong: Photos Shared
          - text: Completed 16 Feb 2026, 4:30 pm
        - listitem:
          - checkbox "QC Pending Started 16 Feb 2026, 4:30 pm"
          - strong: QC Pending
          - text: Started 16 Feb 2026, 4:30 pm
          - button "Mark N/A"
    - tablist "Job record sections":
      - tab "Details"
      - tab "Task List"
      - tab "Body Mark"
      - tab "Materials"
      - tab "Documents"
      - tab "Photos / Media"
      - tab "Invoice" [selected]
      - tab "Payment"
    - tabpanel "Invoice":
      - region "Job invoice":
        - heading "INV-09038" [level=3]
        - paragraph: Pending
        - button "Edit Invoice"
        - button "Void Invoice"
        - table "Invoice lines":
          - rowgroup:
            - row "Type Description Qty Rate GST type GST % Amount":
              - columnheader "Type"
              - columnheader "Description"
              - columnheader "Qty"
              - columnheader "Rate"
              - columnheader "GST type"
              - columnheader "GST %"
              - columnheader "Amount"
          - rowgroup:
            - row "Service Paint correction 1 ₹8,000 CGST+SGST 18% ₹8,000":
              - cell "Service"
              - cell "Paint correction"
              - cell "1"
              - cell "₹8,000"
              - cell "CGST+SGST"
              - cell "18%"
              - cell "₹8,000"
            - row "Material Gloss PPF roll 2 ₹0 CGST+SGST 18% ₹0":
              - cell "Material"
              - cell "Gloss PPF roll"
              - cell "2"
              - cell "₹0"
              - cell "CGST+SGST"
              - cell "18%"
              - cell "₹0"
        - text: Subtotal
        - strong: ₹8,000
        - text: Discount
        - strong: ₹0
        - text: GST
        - strong: ₹1,440
        - text: Total
        - strong: ₹9,440
    - button "Go Back"
  - heading "Job Cards" [level=2]
  - paragraph: Browse and manage job cards
  - button "Add Job Card"
  - text: Search
  - textbox "Search job cards":
    - /placeholder: Job, vehicle, customer or mobile
  - text: Main status
  - combobox "Main status":
    - option "All statuses"
    - option "NEW"
    - option "IN_PROGRESS" [selected]
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
  - text: Showing 1 to 10 of 63 Per page
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
    - button "Page 6": "6"
    - button "Page 7": "7"
    - button "Next page"
    - button "Last page"
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
    - strong: OD03DM1122
    - text: Mahindra Thar
    - heading "JC-2026-002122" [level=3]
    - paragraph: Demo Customer 002 · 8100000002
    - text: IN PROGRESS · QC Pending Est Inv Rcpt GP Total
    - strong: Rs 5,900
    - text: Estimated Delivery Date
    - strong: 2026-10-28
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD02DM1121
    - text: Hyundai Creta
    - heading "JC-2026-002121" [level=3]
    - paragraph: Demo Customer 001 · 8100000001
    - text: IN PROGRESS · Photos Shared Est Inv Rcpt GP Total
    - strong: Rs 5,015
    - text: Estimated Delivery Date
    - strong: 2026-10-17
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD01DM1120
    - text: BMW X1
    - heading "JC-2026-002120" [level=3]
    - paragraph: Demo Customer 120 · 8100000120
    - text: IN PROGRESS · Follow-up Needed Est Inv Rcpt GP Total
    - strong: Rs 3,540
    - text: Estimated Delivery Date
    - strong: 2026-10-11
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
    - button "Page 6": "6"
    - button "Page 7": "7"
    - button "Next page"
    - button "Last page"
```

# Test source

```ts
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
> 2822 |   await expect(editor.getByText("No invoice yet.")).toBeVisible();
       |                                                     ^ Error: expect(locator).toBeVisible() failed
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
  2856 |   await visit.getByRole("button", { name: "Go Back" }).click();
  2857 |   await page.getByRole("button", { name: "Logout" }).click();
  2858 | 
  2859 |   await loginAs(page, "admin@example.com");
  2860 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2861 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  2862 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2863 |   await editor.getByRole("tab", { name: "Materials" }).click();
  2864 |   const inventoryPicker = editor.getByRole("combobox", { name: "Item", exact: true });
  2865 |   const inventoryOptions = editor.getByRole("listbox", { name: "Item options" });
  2866 |   await inventoryPicker.fill("Tack");
  2867 |   await expect(inventoryOptions).toBeVisible();
  2868 |   await editor.getByLabel("Qty").click();
  2869 |   await expect(inventoryOptions).toBeHidden();
  2870 |   await expect(inventoryPicker).toHaveAttribute("aria-expanded", "false");
  2871 |   await inventoryPicker.fill("Tack");
  2872 |   await inventoryOptions.getByRole("option").first().click();
  2873 |   await expect(inventoryPicker).toHaveValue(/Tack/);
  2874 |   await editor.getByRole("button", { name: "Go Back" }).click();
  2875 | 
  2876 |   await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  2877 |   const jobPicker = page.getByRole("combobox", { name: "Find a job" });
  2878 |   const jobOptions = page.getByRole("listbox", { name: "Matching jobs" });
  2879 |   await jobPicker.fill("OD02");
  2880 |   await expect(jobOptions).toBeVisible();
  2881 |   await page.getByLabel("Visit month").click();
  2882 |   await expect(jobOptions).toBeHidden();
  2883 |   await expect(jobPicker).toHaveAttribute("aria-expanded", "false");
  2884 |   await jobPicker.fill("OD02");
  2885 |   await jobOptions.getByRole("option").first().click();
  2886 |   await expect(page.getByRole("region", { name: "Chronological data flow" })).toBeVisible();
  2887 | });
  2888 | 
```