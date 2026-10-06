import { expect, test } from "@playwright/test";

test("authenticated material requests retain retry identity and show authoritative availability", async ({ page }) => {
  const requestKeys: string[] = [];
  const config = { mode: "cognito", clientId: "test-client", authorizationEndpoint: "https://identity.example.test/login", tokenEndpoint: "https://identity.example.test/token", logoutEndpoint: "https://identity.example.test/logout", callbackUri: "http://127.0.0.1:4173/", logoutUri: "http://127.0.0.1:4173/", scopes: ["openid"] };
  const reservation = { id: 71, jobId: 51, itemId: 11, branchId: "branch-1", reservedQty: 3, availableToReserve: 2, status: "RESERVED", note: "Service", issuedQty: 0, returnedQty: 0, wastedQty: 0, releasedQty: 0, reversedQty: 0, availableToIssue: 3, onJobQty: 0, createdAt: "2026-10-06T00:00:00Z", updatedAt: "2026-10-06T00:00:00Z" };
  let attempts = 0;
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "materials-token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request(); const url = new URL(request.url());
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/v1/auth/config") return json(config);
    if (url.pathname === "/api/v1/session") return json({ membership: { id: "member-1", displayName: "Store", email: "store@example.test", status: "ACTIVE", roleIds: ["role-1"], roles: [{ id: "role-1", name: "Store", permissions: ["page.material-requests.read", "page.material-requests.write"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.material-requests.read", "page.material-requests.write"], version: 1 }, tenant: { id: "tenant-1", name: "Workshop" } });
    if (url.pathname === "/api/v1/material-reservations" && request.method() === "GET") return json(attempts > 1 ? [reservation] : []);
    if (url.pathname === "/api/v1/material-ledger") return json([]);
    if (url.pathname === "/api/v1/jobs") return json([{ id: 51, jobNo: "JC-000051", status: "IN_PROGRESS" }]);
    if (url.pathname === "/api/v1/catalogue-items") return json([{ id: 11, sku: "OIL", name: "Engine oil", unit: "L", onHand: 5, lowStockQty: 0, sellingPrice: 0 }]);
    if (url.pathname === "/api/v1/material-reservations" && request.method() === "POST") {
      requestKeys.push(request.headers()["idempotency-key"] ?? ""); attempts += 1;
      return attempts === 1 ? json({ code: "INSUFFICIENT_AVAILABLE_STOCK_TO_RESERVE" }, 409) : json(reservation, 201);
    }
    return json({ code: "NOT_FOUND" }, 404);
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Material Requests", exact: true }).click();
  const workspace = page.getByRole("region", { name: "Online job material ledger" });
  await workspace.getByLabel("Approved job").selectOption("51");
  await workspace.getByLabel("Branch item").selectOption("11");
  await workspace.getByLabel("Reserve qty").fill("3");
  await expect(workspace.getByLabel("Approved job")).toHaveValue("51");
  await expect(workspace.getByLabel("Branch item")).toHaveValue("11");
  await page.waitForTimeout(0);
  const firstReservation = page.waitForRequest((request) => request.method() === "POST" && new URL(request.url()).pathname === "/api/v1/material-reservations");
  await workspace.getByRole("button", { name: "Reserve stock" }).click();
  await firstReservation;
  await expect(workspace.getByRole("alert")).toContainText("INSUFFICIENT_AVAILABLE_STOCK_TO_RESERVE");
  const retryReservation = page.waitForRequest((request) => request.method() === "POST" && new URL(request.url()).pathname === "/api/v1/material-reservations");
  await workspace.getByRole("button", { name: "Reserve stock" }).click();
  await retryReservation;
  await expect(workspace.getByRole("cell", { name: "2", exact: true })).toBeVisible();
  expect(requestKeys).toHaveLength(2);
  expect(requestKeys[0]).toBeTruthy();
  expect(requestKeys[1]).toBe(requestKeys[0]);
});
