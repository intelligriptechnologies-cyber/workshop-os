import { expect, test } from "@playwright/test";

const config = { mode: "cognito", clientId: "test-client", authorizationEndpoint: "https://identity.example.test/login", tokenEndpoint: "https://identity.example.test/token", logoutEndpoint: "https://identity.example.test/logout", callbackUri: "http://127.0.0.1:4173/", logoutUri: "http://127.0.0.1:4173/", scopes: ["openid"] };

test("authenticated Admin records, confirms, and closes a partial delivery through the API", async ({ page }) => {
  let status = "SENT";
  let receiptPayload: any;
  let confirmationPayload: any;
  const order = () => ({ id: 301, branchId: "branch-1", supplierId: 21, poNumber: "PO-301", orderDate: "2026-10-08", status, notes: "", lines: [{ id: 401, itemId: 11, lineNo: 1, orderedQty: 5, unitCost: 100, discount: 0, gstRate: 0, receivedQty: status === "CLOSED" ? 2 : 0, deliveredQty: status === "SENT" ? 0 : 3, acceptedQty: status === "READY_TO_CLOSE" || status === "CLOSED" ? 2 : 0, rejectedQty: status === "READY_TO_CLOSE" || status === "CLOSED" ? 1 : 0 }] });
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "inward-browser-token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request(); const url = new URL(request.url());
    const json = (body: unknown, code = 200) => route.fulfill({ status: code, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/v1/auth/config") return json(config);
    if (url.pathname === "/api/v1/session") return json({ membership: { id: "admin-1", displayName: "Admin", email: "admin@example.test", status: "ACTIVE", roleIds: ["admin-role"], roles: [{ id: "admin-role", name: "Owner/Admin", permissions: ["page.inward-purchases.read", "page.inward-purchases.write"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.inward-purchases.read", "page.inward-purchases.write"], version: 1 }, tenant: { id: "tenant-1", name: "Workshop" } });
    if (url.pathname === "/api/v1/catalogue-items") return json([{ id: 11, branchId: "branch-1", sku: "DISC", category: "", name: "Brake disc", unit: "each", lowStockQty: 1, sellingPrice: 100, onHand: status === "CLOSED" ? 2 : 0, archivedAt: null }]);
    if (url.pathname === "/api/v1/suppliers") return json([{ id: 21, branchId: "branch-1", name: "Parts Co", mobile: "", email: "", address: "", archivedAt: null }]);
    if (url.pathname === "/api/v1/purchase-requests") return json([]);
    if (url.pathname === "/api/v1/purchase-orders" && request.method() === "GET") return json([order()]);
    if (url.pathname === "/api/v1/purchase-orders/301/delivery-receipts") { receiptPayload = request.postDataJSON(); status = "PARTIALLY_RECEIVED"; return json({ id: 1 }, 201); }
    if (url.pathname === "/api/v1/purchase-orders/301/delivery-confirmations") { confirmationPayload = request.postDataJSON(); status = "READY_TO_CLOSE"; return json({ purchaseOrderId: 301 }, 201); }
    if (url.pathname === "/api/v1/purchase-orders/301/commands/close") { status = "CLOSED"; return json(order()); }
    return json({ code: "NOT_FOUND" }, 404);
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Purchase Orders", exact: true }).click();
  const workspace = page.getByRole("region", { name: "Online branch inventory" });
  await workspace.getByRole("button", { name: "Record delivery" }).click();
  const receipt = page.getByRole("dialog", { name: "Record delivery for PO-301" });
  await receipt.getByLabel("Goods receipt note").fill("GRN-301");
  await receipt.getByLabel("Delivered quantity for line 1").fill("3");
  await receipt.getByRole("button", { name: "Save delivery" }).click();
  await expect(workspace.getByRole("button", { name: "Confirm delivery" })).toBeVisible();
  expect(receiptPayload.note).toBe("GRN-301");
  expect(receiptPayload.lines).toEqual([{ lineId: 401, deliveredQty: 3 }]);

  await workspace.getByRole("button", { name: "Confirm delivery" }).click();
  const confirmation = page.getByRole("dialog", { name: "Confirm delivery for PO-301" });
  await confirmation.getByLabel("Accepted quantity for line 1").fill("2");
  await confirmation.getByLabel("Rejected quantity for line 1").fill("1");
  await confirmation.getByLabel("Rejection reason for line 1").fill("Damaged");
  await confirmation.getByRole("button", { name: "Confirm accepted stock" }).click();
  await expect(workspace.getByRole("button", { name: "Close and post stock" })).toBeVisible();
  expect(confirmationPayload.lines).toEqual([{ lineId: 401, acceptedQty: 2, rejectedQty: 1, rejectionReason: "Damaged" }]);
  await workspace.getByRole("button", { name: "Close and post stock" }).click();
  await expect(workspace.getByText("CLOSED", { exact: true })).toBeVisible();
});
