import { expect, test } from "@playwright/test";

const config = { mode: "cognito", clientId: "test-client", authorizationEndpoint: "https://identity.example.test/login", tokenEndpoint: "https://identity.example.test/token", logoutEndpoint: "https://identity.example.test/logout", callbackUri: "http://127.0.0.1:4173/", logoutUri: "http://127.0.0.1:4173/", scopes: ["openid"] };

test("authenticated Admin carries a multi-line Purchase Request with a New Item through quoted approval and issue", async ({ page }) => {
  const authorizations: string[] = [];
  const quotes = new Map<number, Array<{ supplierId: number; supplierName: string; unitCost: number; note: string }>>();
  let request: any;
  let approved = false;
  let issued = false;
  let createPayload: any;
  let approvalPayload: any;
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "procurement-browser-token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/**", async (route) => {
    const browserRequest = route.request(); const url = new URL(browserRequest.url());
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    authorizations.push(browserRequest.headers().authorization ?? "");
    if (url.pathname === "/api/v1/auth/config") return json(config);
    if (url.pathname === "/api/v1/session") return json({ membership: { id: "admin-1", displayName: "Admin", email: "admin@example.test", status: "ACTIVE", roleIds: ["admin-role"], roles: [{ id: "admin-role", name: "Owner/Admin", permissions: ["page.inward-purchases.read", "page.inward-purchases.write"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.inward-purchases.read", "page.inward-purchases.write"], version: 1 }, tenant: { id: "tenant-1", name: "Workshop" } });
    if (url.pathname === "/api/v1/catalogue-items") return json([{ id: 11, branchId: "branch-1", sku: "OIL", category: "Lubricants", name: "Engine oil", unit: "L", lowStockQty: 1, sellingPrice: 100, onHand: 0, archivedAt: null }]);
    if (url.pathname === "/api/v1/suppliers") return json([{ id: 21, branchId: "branch-1", name: "Apex Supplies", mobile: "9000000000", email: "apex@example.test", address: "", archivedAt: null }, { id: 22, branchId: "branch-1", name: "Better Parts", mobile: "9000000001", email: "better@example.test", address: "", archivedAt: null }]);
    if (url.pathname === "/api/v1/purchase-orders") return json([]);
    if (url.pathname === "/api/v1/purchase-requests" && browserRequest.method() === "GET") return json(request ? [{ ...request, status: issued ? "ISSUED" : approved ? "APPROVED" : "REQUESTED", purchaseOrders: issued ? [{ id: 301, branchId: "branch-1", supplierId: 21, poNumber: "PR-100-21", orderDate: "2026-10-06", status: "SENT", notes: "", lines: [] }] : [] }] : []);
    if (url.pathname === "/api/v1/purchase-requests" && browserRequest.method() === "POST") {
      createPayload = browserRequest.postDataJSON();
      request = { id: 101, requestNumber: createPayload.requestNumber, sourceReference: createPayload.sourceReference, notes: createPayload.notes ?? "", status: "REQUESTED", lines: createPayload.lines.map((line: any, index: number) => ({ id: index + 201, itemId: line.itemId ?? null, newItemName: line.newItemName ?? null, unit: line.unit ?? (line.itemId ? "L" : ""), orderedQty: line.orderedQty, lineNo: index + 1 })), purchaseOrders: [], events: [] };
      return json(request, 201);
    }
    if (url.pathname === "/api/v1/purchase-requests/101/supplier-comparison") return json({ requestId: 101, lines: request.lines.map((line: any) => ({ ...line, quotes: quotes.get(line.id) ?? [] })) });
    if (url.pathname === "/api/v1/purchase-requests/101/supplier-quotes") {
      const body = browserRequest.postDataJSON(); const supplier = body.supplierId === 21 ? "Apex Supplies" : "Better Parts";
      quotes.set(body.lineId, [...(quotes.get(body.lineId) ?? []).filter((quote) => quote.supplierId !== body.supplierId), { supplierId: body.supplierId, supplierName: supplier, unitCost: body.unitCost, note: body.note ?? "" }]);
      return json({ id: body.lineId, ...body }, 201);
    }
    if (url.pathname === "/api/v1/purchase-requests/101/approve") { approvalPayload = browserRequest.postDataJSON(); approved = true; return json({ ...request, status: "APPROVED", purchaseOrders: [] }); }
    if (url.pathname === "/api/v1/purchase-requests/101/commands/issue") { issued = true; return json({ ...request, status: "ISSUED", purchaseOrders: [{ id: 301, branchId: "branch-1", supplierId: 21, poNumber: "PR-100-21", orderDate: "2026-10-06", status: "SENT", notes: "", lines: [] }] }); }
    return json({ code: "NOT_FOUND" }, 404);
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Purchase Orders", exact: true }).click();
  const workspace = page.getByRole("region", { name: "Online branch inventory" });
  await workspace.getByLabel("Purchase Request number").fill("PR-100");
  await workspace.getByLabel("Purchase Request item type for line 1").selectOption("existing");
  await workspace.getByLabel("Purchase Request catalogue item for line 1").selectOption("11");
  await workspace.getByRole("button", { name: "Add Purchase Request line" }).click();
  await workspace.getByLabel("Purchase Request item type for line 2").selectOption("new");
  await workspace.getByLabel("Purchase Request New Item name for line 2").fill("Ceramic applicator");
  await workspace.getByLabel("Purchase Request unit for line 2").fill("piece");
  await workspace.getByLabel("Purchase Request quantity for line 2").fill("4");
  await expect(workspace.getByRole("button", { name: "Create Purchase Request" })).toBeEnabled();
  const invalidControls = await workspace.getByRole("button", { name: "Create Purchase Request" }).evaluate((button) => Array.from(button.closest("form")?.elements ?? []).filter((control): control is HTMLInputElement | HTMLSelectElement => control instanceof HTMLInputElement || control instanceof HTMLSelectElement).filter((control) => !control.validity.valid).map((control) => ({ label: control.getAttribute("aria-label"), value: control.value, message: control.validationMessage })));
  expect(invalidControls).toEqual([]);
  const createRequest = page.waitForRequest((candidate) => candidate.method() === "POST" && new URL(candidate.url()).pathname === "/api/v1/purchase-requests");
  await workspace.getByRole("button", { name: "Create Purchase Request" }).click();
  await createRequest;
  await expect(workspace.getByRole("row", { name: /PR-100.*REQUESTED/ })).toBeVisible();
  expect(createPayload.lines).toEqual([{ itemId: 11, orderedQty: 1 }, { newItemName: "Ceramic applicator", unit: "piece", orderedQty: 4 }]);

  await workspace.getByRole("button", { name: "Review supplier quotes for PR-100" }).click();
  const review = page.getByRole("dialog", { name: "Review PR-100" });
  await review.getByLabel("Quote supplier for line 1").selectOption("21");
  await review.getByLabel("Quote price for line 1").fill("120");
  await review.getByRole("button", { name: "Save quote for line 1" }).click();
  await expect(review).toContainText("Apex Supplies");
  await review.getByLabel("Quote supplier for line 2").selectOption("22");
  await review.getByLabel("Quote price for line 2").fill("15");
  await review.getByRole("button", { name: "Save quote for line 2" }).click();
  await expect(review).toContainText("Better Parts");
  await review.getByRole("button", { name: "Approve Purchase Request" }).click();
  const approval = page.getByRole("dialog", { name: "Approve PR-100" });
  await approval.getByLabel("Selected quote for line 1").selectOption("21:120");
  await approval.getByLabel("Selected quote for line 2").selectOption("22:15");
  await approval.getByLabel("SKU for line 2").fill("CER-APP");
  await approval.getByLabel("Category for line 2").fill("Detailing");
  await approval.getByLabel("Catalogue name for line 2").fill("Ceramic applicator");
  await approval.getByLabel("Catalogue unit for line 2").fill("piece");
  await approval.getByRole("button", { name: "Confirm approval" }).click();
  expect(approvalPayload.lines).toEqual([{ lineId: 201, supplierId: 21, unitCost: 120 }, { lineId: 202, supplierId: 22, unitCost: 15, inventoryItem: { sku: "CER-APP", category: "Detailing", name: "Ceramic applicator", unit: "piece", lowStockQty: 0, sellingPrice: 0 } }]);
  await workspace.getByRole("button", { name: "Issue Purchase Order for PR-100" }).click();
  await expect(workspace.getByRole("row", { name: /PR-100.*ISSUED/ })).toBeVisible();
  expect(authorizations.filter(Boolean).every((authorization) => authorization === "Bearer procurement-browser-token")).toBe(true);
});
