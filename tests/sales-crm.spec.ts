import { expect, test } from "@playwright/test";

test("remote quotation actions use the persisted API lifecycle", async ({ page }) => {
  let quotationStatus = "DRAFT";
  const statusCommands: string[] = [];
  const quotation = () => [{
    id: 42, branchId: "branch-1", leadId: 7, quotationNo: "QT-000042", status: quotationStatus,
    validUntil: null, customerNotes: "", discount: 0, subtotal: 1000, gstAmount: 180, total: 1180,
    templateId: "quotation-default", createdAt: "2026-10-20T10:00:00Z", updatedAt: "2026-10-20T10:00:00Z",
    lines: [{ id: 1, kind: "Service", description: "Alignment", quantity: 1, rate: 1000, gstRate: 18 }],
  }];

  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "browser-test-token", expiresAt: Date.now() + 60 * 60 * 1000 })));
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const json = (body: unknown) => route.fulfill({ contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/v1/auth/config") return json({ mode: "cognito", clientId: "test", authorizationEndpoint: "https://example.test/login", tokenEndpoint: "https://example.test/token", logoutEndpoint: "https://example.test/logout", callbackUri: "http://127.0.0.1:4173", logoutUri: "http://127.0.0.1:4173", scopes: [] });
    if (url.pathname === "/api/v1/session") return json({ membership: { id: "member-1", displayName: "Sales Owner", email: "owner@example.test", status: "ACTIVE", roleIds: ["role-1"], roles: [{ id: "role-1", name: "Owner/Admin", permissions: [] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: [], version: 1 }, tenant: { id: "tenant-1", name: "Workshop" } });
    if (url.pathname === "/api/v1/sales/leads") return json([{ id: 7, branchId: "branch-1", displayName: "Asha", phone: "9000000000", company: "", companyNotEntered: false, email: "", emailNotEntered: false, address: "", serviceInterest: "", notes: "", stage: "QUOTATION_SENT", temperature: "WARM", followUpDue: null, siteVisitCompleted: false, siteVisitDate: null, createdAt: "2026-10-20T10:00:00Z", updatedAt: "2026-10-20T10:00:00Z" }]);
    if (url.pathname === "/api/v1/sales/quotations" && request.method() === "GET") return json(quotation());
    if (url.pathname === "/api/v1/sales/quotations/42/status" && request.method() === "POST") { quotationStatus = request.postDataJSON().status; statusCommands.push(quotationStatus); return json(quotation()[0]); }
    return json([]);
  });

  await page.goto("/");
  await page.locator("summary", { hasText: "Sales CRM" }).click();
  await page.getByRole("button", { name: "Quotations" }).click();
  await expect(page.getByRole("row", { name: /QT-000042/ })).toContainText("DRAFT");
  await page.getByRole("button", { name: "Mark sent" }).click();
  await expect(page.getByRole("row", { name: /QT-000042/ })).toContainText("SENT");
  await page.getByRole("button", { name: "Reject" }).click();
  await expect(page.getByRole("row", { name: /QT-000042/ })).toContainText("REJECTED");
  expect(statusCommands).toEqual(["SENT", "REJECTED"]);
});
