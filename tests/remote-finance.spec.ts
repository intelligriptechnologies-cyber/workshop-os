import { expect, test } from "@playwright/test";

const config = { mode: "cognito", clientId: "test-client", authorizationEndpoint: "https://identity.example.test/login", tokenEndpoint: "https://identity.example.test/token", logoutEndpoint: "https://identity.example.test/logout", callbackUri: "http://127.0.0.1:4173/", logoutUri: "http://127.0.0.1:4173/", scopes: ["openid"] };

test("authenticated Accounts user issues and corrects immutable invoices through repeat-safe API commands", async ({ page }) => {
  let invoice: any = undefined;
  let issueCalls = 0;
  const commandRequests: Array<{ path: string; authorization: string }> = [];
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "finance-browser-token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request(); const url = new URL(request.url());
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/v1/auth/config") return json(config);
    if (url.pathname === "/api/v1/session") return json({ membership: { id: "accounts-1", displayName: "Accounts", email: "accounts@example.test", status: "ACTIVE", roleIds: ["accounts-role"], roles: [{ id: "accounts-role", name: "Accounts", permissions: ["page.invoice.read", "page.invoice.write", "page.payment.read", "page.payment.write"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.invoice.read", "page.invoice.write", "page.payment.read", "page.payment.write"], version: 1 }, tenant: { id: "tenant-1", name: "Workshop" } });
    if (url.pathname === "/api/v1/jobs") return json([{ id: 51, jobNo: "JC-000051", status: "IN_PROGRESS" }]);
    if (url.pathname === "/api/v1/jobs/51/invoices" && request.method() === "GET") return json(invoice ? [invoice] : []);
    if (url.pathname === "/api/v1/jobs/51/delivery") return json(null);
    if (url.pathname === "/api/v1/jobs/51/invoices" && request.method() === "POST") {
      issueCalls += 1; commandRequests.push({ path: url.pathname, authorization: request.headers().authorization ?? "" });
      invoice ??= { id: 701, jobId: 51, documentId: 801, number: "INV-FY2026-27-00001", fiscalYear: "FY2026-27", subtotalPaise: 100000, discountPaise: 0, taxPaise: 18000, totalPaise: 118000, paidPaise: 0, creditedPaise: 0, balancePaise: 118000, status: "UNPAID", voided: false, issuedAt: "2026-10-06T00:00:00Z", contentPath: "/api/v1/financial-documents/801/content", lines: [] };
      return json(invoice, 201);
    }
    if (url.pathname === "/api/v1/invoices/701/void") {
      commandRequests.push({ path: url.pathname, authorization: request.headers().authorization ?? "" }); invoice = { ...invoice, status: "VOID", voided: true }; return json(invoice);
    }
    return json({ code: "NOT_FOUND" }, 404);
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Invoice", exact: true }).click();
  const workspace = page.getByRole("region", { name: "Online invoices" });
  await expect(workspace).toBeVisible();
  await workspace.getByRole("button", { name: "Issue approved estimate" }).click();
  await expect(workspace).toContainText("INV-FY2026-27-00001");
  await expect(workspace.getByRole("button", { name: "Issue approved estimate" })).toBeDisabled();
  page.once("dialog", (dialog) => dialog.accept("Incorrect rate"));
  await workspace.getByRole("button", { name: "Void" }).click();
  await expect(workspace).toContainText("VOID");
  expect(issueCalls).toBe(1);
  expect(commandRequests).toEqual([
    { path: "/api/v1/jobs/51/invoices", authorization: "Bearer finance-browser-token" },
    { path: "/api/v1/invoices/701/void", authorization: "Bearer finance-browser-token" },
  ]);
});
