# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> admin can open the management hub and create a user
- Location: tests\workshopos.spec.ts:448:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('e2e.manager@example.com')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('e2e.manager@example.com') with timeout 5000ms
  - waiting for getByText('e2e.manager@example.com')

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
  - heading "Management Hub" [level=2]
  - paragraph: Admin master data and workflow controls
  - strong: Large demo dataset
  - text: 120 customers, 132 vehicles, 144 jobs and 288 offline media records.
  - button "Load Large Demo Dataset"
  - tablist "Management areas":
    - tab "Users" [selected]
    - tab "Customers"
    - tab "Vehicles"
    - tab "Suppliers"
    - tab "Job Cards"
    - tab "Estimates"
    - tab "Invoices"
    - tab "Payments"
    - tab "Delivery"
  - tabpanel "Users":
    - tabpanel:
      - heading "Users" [level=3]
      - button "Add User"
      - text: Search
      - textbox "Search users":
        - /placeholder: Name, email or role
      - text: Role
      - combobox "Filter users by role":
        - option "All roles" [selected]
        - option "Owner/Admin"
        - option "Service Advisor"
        - option "Service Department Manager"
        - option "Reception"
        - option "Accounts"
        - option "Store"
        - option "Technician"
      - text: Status
      - combobox "Filter users by status":
        - option "All statuses" [selected]
        - option "Active"
        - option "Archived"
      - group "Search actions":
        - button "Clear"
      - button "Download"
      - text: Showing 1 to 10 of 11 Per page
      - combobox "User records per page":
        - option "10" [selected]
        - option "20"
        - option "50"
      - navigation "Results pagination":
        - button "First page" [disabled]
        - button "Previous page" [disabled]
        - button "Page 1": "1"
        - button "Page 2": "2"
        - button "Next page"
        - button "Last page"
      - table "User manager":
        - rowgroup:
          - row "Name Email Role Status Actions":
            - columnheader "Name"
            - columnheader "Email"
            - columnheader "Role"
            - columnheader "Status"
            - columnheader "Actions"
        - rowgroup:
          - row "Owner/Admin admin@example.com Owner/Admin Active Edit Archive":
            - cell "Owner/Admin"
            - cell "admin@example.com"
            - cell "Owner/Admin"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive" [disabled]
          - row "Service advisor 1 service@example.com Service Advisor Active Edit Archive":
            - cell "Service advisor 1"
            - cell "service@example.com"
            - cell "Service Advisor"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
          - row "Reception Desk reception@example.com Reception Active Edit Archive":
            - cell "Reception Desk"
            - cell "reception@example.com"
            - cell "Reception"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
          - row "Accounts Desk accounts@example.com Accounts Active Edit Archive":
            - cell "Accounts Desk"
            - cell "accounts@example.com"
            - cell "Accounts"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
          - row "Store Counter store@example.com Store Active Edit Archive":
            - cell "Store Counter"
            - cell "store@example.com"
            - cell "Store"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
          - row "Technician Bay tech@example.com Technician Active Edit Archive":
            - cell "Technician Bay"
            - cell "tech@example.com"
            - cell "Technician"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
          - row "Service advisor AA advisor.aa@example.com Service Advisor Active Edit Archive":
            - cell "Service advisor AA"
            - cell "advisor.aa@example.com"
            - cell "Service Advisor"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
          - row "Service advisor BB1 advisor.bb1@example.com Service Advisor Active Edit Archive":
            - cell "Service advisor BB1"
            - cell "advisor.bb1@example.com"
            - cell "Service Advisor"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
          - row "General Service Manager general.service.manager@example.com Service Department Manager Active Edit Archive":
            - cell "General Service Manager"
            - cell "general.service.manager@example.com"
            - cell "Service Department Manager"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
          - row "PPF/Paint Manager ppf.paint.manager@example.com Service Department Manager Active Edit Archive":
            - cell "PPF/Paint Manager"
            - cell "ppf.paint.manager@example.com"
            - cell "Service Department Manager"
            - cell "Active"
            - cell "Edit Archive":
              - button "Edit"
              - button "Archive"
      - navigation "Results pagination":
        - button "First page" [disabled]
        - button "Previous page" [disabled]
        - button "Page 1": "1"
        - button "Page 2": "2"
        - button "Next page"
        - button "Last page"
```

# Test source

```ts
  359 |   const bodyMark = dialog.getByRole("tab", { name: "Body Mark", exact: true });
  360 |   await expect(details).toHaveAttribute("aria-selected", "true");
  361 |   await expect(dialog.getByRole("tabpanel", { name: "Details" })).toBeVisible();
  362 |   await expect(dialog.getByTestId("damage-diagram")).toHaveCount(0);
  363 |   const customerPicker = dialog.getByRole("combobox", {
  364 |     name: "Existing customer",
  365 |   });
  366 |   const vehiclePicker = dialog.getByRole("combobox", {
  367 |     name: "Existing vehicle",
  368 |   });
  369 |   const rahulVehicle = "OD02AB1234 · Hyundai Creta · Rahul Sharma · 9876543210";
  370 | 
  371 |   await customerPicker.fill("9876543210");
  372 |   await dialog
  373 |     .getByRole("option", { name: "Rahul Sharma · 9876543210" })
  374 |     .click();
  375 |   await expect(dialog.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  376 |   await expect(dialog.getByLabel("Mobile")).toHaveValue("9876543210");
  377 |   await expect(dialog.getByLabel("Vehicle Number")).toHaveValue("OD02AB1234");
  378 |   await expect(dialog.getByLabel("Make")).toHaveValue("Hyundai");
  379 |   await expect(dialog.getByLabel("Model")).toHaveValue("Creta");
  380 | 
  381 |   await customerPicker.click();
  382 |   await dialog
  383 |     .getByRole("option", { name: "Clear customer and vehicle" })
  384 |     .click();
  385 |   await expect(dialog.getByLabel("Customer Name")).toHaveValue("");
  386 |   await expect(dialog.getByLabel("Vehicle Number")).toHaveValue("");
  387 | 
  388 |   await vehiclePicker.fill("Rahul Sharma");
  389 |   await dialog.getByRole("option", { name: rahulVehicle }).click();
  390 |   await expect(dialog.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  391 |   await expect(dialog.getByLabel("Mobile")).toHaveValue("9876543210");
  392 |   await expect(dialog.getByLabel("Vehicle Number")).toHaveValue("OD02AB1234");
  393 | 
  394 |   await vehiclePicker.click();
  395 |   await dialog.getByRole("option", { name: "Clear vehicle" }).click();
  396 |   await expect(dialog.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  397 |   await expect(dialog.getByLabel("Vehicle Number")).toHaveValue("");
  398 | 
  399 |   await vehiclePicker.fill("OD02AB1234");
  400 |   await expect(dialog.getByRole("option", { name: rahulVehicle })).toBeVisible();
  401 |   await vehiclePicker.fill("Creta");
  402 |   await dialog.getByRole("option", { name: rahulVehicle }).click();
  403 |   await expect(dialog.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  404 |   await expect(dialog.getByLabel("Model")).toHaveValue("Creta");
  405 | 
  406 |   await customerPicker.click();
  407 |   await dialog
  408 |     .getByRole("option", { name: "Clear customer and vehicle" })
  409 |     .click();
  410 |   await dialog.getByLabel("Customer Name").fill("E2E Customer");
  411 |   await dialog.getByLabel("Mobile").fill("9000099999");
  412 |   await dialog.getByLabel("Vehicle Number").fill("OD02E2E9999");
  413 |   await dialog.getByLabel("Make").fill("Kia");
  414 |   await dialog.getByLabel("Model").fill("Seltos");
  415 |   await dialog.getByLabel("ODO meter reading (km)").fill("12000");
  416 |   await dialog.locator("#create-visit-form .field-pair input").fill("3");
  417 |   const requestedWork = dialog.getByLabel("Requested Work");
  418 |   await expect(requestedWork).toHaveAttribute("rows", "3");
  419 |   await requestedWork.fill("E2E coating inspection");
  420 | 
  421 |   await bodyMark.click();
  422 |   const bodyMarkPanel = dialog.getByRole("tabpanel", { name: "Body Mark" });
  423 |   const diagram = bodyMarkPanel.getByTestId("damage-diagram");
  424 |   await expect(diagram).toBeVisible();
  425 |   const panelBox = await bodyMarkPanel.boundingBox();
  426 |   const diagramBox = await diagram.boundingBox();
  427 |   expect(panelBox).not.toBeNull();
  428 |   expect(diagramBox).not.toBeNull();
  429 |   expect(Math.abs((diagramBox!.x + diagramBox!.width / 2) - (panelBox!.x + panelBox!.width / 2))).toBeLessThanOrEqual(2);
  430 |   await diagram.locator(".body-mark-canvas").click({ position: { x: 60, y: 60 } });
  431 |   await expect(diagram.getByTestId("damage-mark")).toHaveCount(1);
  432 | 
  433 |   await details.click();
  434 |   await expect(requestedWork).toHaveValue("E2E coating inspection");
  435 |   await bodyMark.click();
  436 |   await expect(diagram.getByTestId("damage-mark")).toHaveCount(1);
  437 |   await details.click();
  438 |   await dialog.getByRole("button", { name: "Create Visit" }).click();
  439 |   await page.reload();
  440 |   await loginAs(page, "reception@example.com");
  441 |   await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  442 |   await page.getByLabel("Search records").fill("OD02E2E9999");
  443 |   await page.getByLabel("Search category").selectOption("vehicle");
  444 |   await expect(page.getByText("OD02E2E9999").first()).toBeVisible();
  445 |   await expect(page.getByText("E2E Customer").first()).toBeVisible();
  446 | });
  447 | 
  448 | test("admin can open the management hub and create a user", async ({ page }) => {
  449 |   await loginAs(page, "admin@example.com");
  450 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  451 |   await expect(page.getByRole("heading", { name: "Management Hub" })).toBeVisible();
  452 |   await page.getByRole("tab", { name: "Users" }).click();
  453 |   await page.getByRole("button", { name: "Add User" }).click();
  454 |   await page.getByLabel("User name").fill("E2E Manager");
  455 |   await page.getByLabel("User email").fill("e2e.manager@example.com");
  456 |   await page.getByLabel("User role").selectOption("service");
  457 |   await page.getByLabel("User password").fill("secure123");
  458 |   await page.getByRole("button", { name: "Save User" }).click();
> 459 |   await expect(page.getByText("e2e.manager@example.com")).toBeVisible();
      |                                                           ^ Error: expect(locator).toBeVisible() failed
  460 | });
  461 | 
  462 | test("list filters expose Clear but no Search submit action", async ({ page }) => {
  463 |   await loginAs(page, "admin@example.com");
  464 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  465 |   await page.getByRole("tab", { name: "Customers", exact: true }).click();
  466 |   await expect(page.getByRole("tabpanel").getByRole("button", { name: "Clear", exact: true })).toBeVisible();
  467 |   await expect(page.getByRole("tabpanel").getByRole("button", { name: "Search", exact: true })).toHaveCount(0);
  468 | 
  469 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  470 |   await expect(page.locator(".entity-list-page").getByRole("button", { name: "Search", exact: true })).toHaveCount(0);
  471 | });
  472 | 
  473 | test("Management Hub filters use compact Month-Year toolbars and remain keyboard and mobile safe", async ({ page }) => {
  474 |   await page.setViewportSize({ width: 1440, height: 900 });
  475 |   await loginAs(page, "admin@example.com");
  476 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  477 |   const hub = page.locator(".management-hub");
  478 | 
  479 |   await page.getByRole("tab", { name: "Users", exact: true }).click();
  480 |   await expect(hub.getByLabel("Search users")).toBeVisible();
  481 |   await expectManagementToolbarHasOneRow(hub, ".compact-management-toolbar");
  482 | 
  483 |   await page.getByRole("tab", { name: "Invoices", exact: true }).click();
  484 |   const invoices = hub.locator('[data-billing-manager="Invoices"]');
  485 |   await expect(invoices.getByLabel("Search invoices")).toBeVisible();
  486 |   await expect(invoices.getByLabel("Invoices Month-Year filter")).toBeVisible();
  487 |   await expect(invoices.getByLabel("Invoices status filter")).toBeVisible();
  488 |   await expect(invoices.locator('input[type="date"]')).toHaveCount(0);
  489 |   await expect(invoices.locator(".job-selector")).toHaveCount(0);
  490 |   await expect(invoices.getByRole("button", { name: "Search", exact: true })).toHaveCount(0);
  491 |   await expectManagementToolbarHasOneRow(invoices, ".billing-panel-filter-grid");
  492 | 
  493 |   await page.getByRole("tab", { name: "Payments", exact: true }).click();
  494 |   const payments = hub.locator('[data-billing-manager="Payments"]');
  495 |   await expect(payments.getByLabel("Search payments")).toBeVisible();
  496 |   await expect(payments.getByLabel("Payments Month-Year filter")).toBeVisible();
  497 |   await expect(payments.getByLabel("Payment mode filter")).toBeVisible();
  498 |   await expect(payments.getByLabel("Payments status filter")).toHaveCount(0);
  499 |   await expect(payments.locator('input[type="date"]')).toHaveCount(0);
  500 |   await expectManagementToolbarHasOneRow(payments, ".billing-panel-filter-grid");
  501 | 
  502 |   await page.getByRole("tab", { name: "Delivery", exact: true }).click();
  503 |   await expect(hub.getByLabel("Search delivery")).toBeVisible();
  504 |   await expect(hub.getByRole("button", { name: "Search", exact: true })).toHaveCount(0);
  505 |   await expectNoPageOverflow(page);
  506 | 
  507 |   await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  508 |   await expect(hub.getByLabel("Job for Estimates search")).toBeVisible();
  509 |   await expect(hub.getByLabel("Job for Estimates Month-Year filter")).toBeVisible();
  510 |   await expect(hub.getByLabel("Job for Estimates received date")).toHaveCount(0);
  511 |   await expect(hub.getByLabel("Job for Estimates month", { exact: true })).toHaveCount(0);
  512 |   await expect(hub.getByLabel("Job for Estimates year", { exact: true })).toHaveCount(0);
  513 |   await expectManagementToolbarHasOneRow(hub, ".job-selector");
  514 | 
  515 |   await page.setViewportSize({ width: 390, height: 844 });
  516 |   await page.getByRole("tab", { name: "Users", exact: true }).click();
  517 |   await expectManagementToolbarStacks(hub, ".compact-management-toolbar");
  518 |   await expectNoPageOverflow(page);
  519 |   await page.getByRole("tab", { name: "Job Cards", exact: true }).click();
  520 |   await expect(hub.getByLabel("Search job cards")).toBeVisible();
  521 |   await expectNoPageOverflow(page);
  522 |   await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  523 |   await expectManagementToolbarStacks(hub, ".job-selector");
  524 |   await expectNoPageOverflow(page);
  525 | });
  526 | 
  527 | test("admin service task subtabs and role filters stay compact on desktop and stack on mobile", async ({ page }) => {
  528 |   await page.setViewportSize({ width: 1440, height: 900 });
  529 |   await loginAs(page, "admin@example.com");
  530 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  531 | 
  532 |   await page.getByRole("tab", { name: "Service Task", exact: true }).click();
  533 |   const serviceTasks = page.getByRole("tabpanel", { name: "Service Tasks" });
  534 |   await expect(serviceTasks.getByLabel("Search catalog services")).toBeVisible();
  535 |   await expectManagementToolbarHasOneRow(serviceTasks, ".compact-management-toolbar");
  536 |   await expectMinimumVerticalGap(
  537 |     serviceTasks.locator(".compact-management-toolbar"),
  538 |     serviceTasks.getByRole("table", { name: "Service task catalog" }),
  539 |   );
  540 |   await page.getByRole("tab", { name: "Catalogs", exact: true }).click();
  541 |   const catalogs = page.getByRole("tabpanel", { name: "Catalogs" });
  542 |   const brandNames = catalogs.locator(".team-section").filter({ has: page.getByRole("heading", { name: "Brand names" }) });
  543 |   await expect(catalogs.getByRole("table", { name: "Brand names" })).toBeVisible();
  544 |   await expect(catalogs.getByRole("table", { name: "Car segments" })).toBeVisible();
  545 |   for (const title of ["Brand names", "Car segments"]) {
  546 |     const catalog = catalogs.locator(".team-section").filter({ has: page.getByRole("heading", { name: title }) });
  547 |     await expectMinimumVerticalGap(
  548 |       catalog.locator(".panel-actions"),
  549 |       catalog.getByRole("table", { name: title }),
  550 |     );
  551 |   }
  552 |   await brandNames.getByRole("button", { name: "Add", exact: true }).click();
  553 |   const addBrand = page.getByRole("dialog", { name: "Add Brand name" });
  554 |   await addBrand.getByLabel("Add Brand name name").fill("E2E Brand");
  555 |   await addBrand.getByRole("button", { name: "Save", exact: true }).click();
  556 |   const brandRow = catalogs.getByRole("table", { name: "Brand names" }).getByRole("row", { name: /E2E Brand/ });
  557 |   await brandRow.getByRole("button", { name: "Rename", exact: true }).click();
  558 |   const renameBrand = page.getByRole("dialog", { name: "Rename Brand name" });
  559 |   await renameBrand.getByLabel("Rename Brand name name").fill("E2E Renamed Brand");
```