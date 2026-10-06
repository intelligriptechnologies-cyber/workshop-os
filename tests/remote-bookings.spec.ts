import { expect, test } from "@playwright/test";

const json = (body: unknown) => ({ contentType: "application/json", body: JSON.stringify(body) });

test("authenticated booking desk creates and checks in through API commands", async ({ page }) => {
  let booking = { id: 41, branchId: "branch-1", customerId: 1, vehicleId: 2, bookingDate: "2026-10-10", serviceType: "Service Work", arrivalWindow: "Morning", requestedWork: "Annual service", status: "BOOKED", visitId: null, jobCardId: null, arrivedAt: null };
  const requests: Array<{ url: string; method: string; authorization: string | undefined }> = [];
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "test-access-token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request(); const url = new URL(request.url());
    requests.push({ url: url.pathname, method: request.method(), authorization: request.headers().authorization });
    if (url.pathname === "/api/v1/auth/config") return route.fulfill(json({ mode: "cognito", clientId: "test-client", authorizationEndpoint: "https://example.test/authorize", tokenEndpoint: "https://example.test/token", logoutEndpoint: "https://example.test/logout", callbackUri: "http://127.0.0.1/callback", logoutUri: "http://127.0.0.1/", scopes: ["openid"] }));
    if (url.pathname === "/api/v1/session") return route.fulfill(json({ membership: { id: "member-1", displayName: "Reception", email: "reception@example.test", status: "ACTIVE", roleIds: ["role-1"], roles: [{ id: "role-1", name: "Reception", permissions: ["page.receive-vehicle.read", "page.receive-vehicle.write"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.receive-vehicle.read", "page.receive-vehicle.write"], version: 1 }, tenant: { id: "tenant-1", name: "Test Workshop" } }));
    if (url.pathname === "/api/v1/bookings" && request.method() === "GET") return route.fulfill(json([booking]));
    if (url.pathname === "/api/v1/customers") return route.fulfill(json([{ id: 1, branchId: "branch-1", name: "Anika", mobile: "9000000001", type: "Individual", address: "", archivedAt: null }]));
    if (url.pathname === "/api/v1/vehicles") return route.fulfill(json([{ id: 2, branchId: "branch-1", customer_id: 1, customerId: 1, number: "KA01AB1234", make: "Honda", model: "City", color: "", km: 1200, engine_no: "", engineNo: "", archivedAt: null }]));
    if (url.pathname === "/api/v1/bookings" && request.method() === "POST") return route.fulfill({ status: 201, ...json(booking) });
    if (url.pathname === "/api/v1/bookings/41/check-in") {
      booking = { ...booking, status: "ARRIVED", visitId: 71, jobCardId: 81, arrivedAt: "2026-10-10T09:00:00Z" };
      return route.fulfill(json({ booking, visit: { id: 71 }, job: { id: 81, jobNo: "JC-000081" } }));
    }
    return route.fulfill({ status: 404, ...json({ code: "NOT_FOUND" }) });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Advance Bookings", exact: true }).click();
  const desk = page.getByRole("region", { name: "API-backed advance bookings" });
  await expect(desk).toBeVisible();
  await desk.getByLabel("Customer").selectOption("1");
  await desk.getByLabel("Vehicle").selectOption("2");
  await desk.getByLabel("Requested work").first().fill("Annual service");
  await desk.getByRole("button", { name: "Create Booking" }).click();
  await desk.getByRole("button", { name: "Check in" }).click();
  await desk.getByLabel("Fuel / battery level").fill("3 bars");
  await desk.getByLabel("ODO meter reading (km)").fill("1250");
  await desk.getByRole("button", { name: "Create Visit and Job Card" }).click();
  await expect(desk.getByRole("cell", { name: "ARRIVED" })).toBeVisible();
  expect(requests.some((entry) => entry.url === "/api/v1/bookings" && entry.method === "POST" && entry.authorization === "Bearer test-access-token")).toBeTruthy();
  expect(requests.some((entry) => entry.url === "/api/v1/bookings/41/check-in" && entry.method === "POST" && entry.authorization === "Bearer test-access-token")).toBeTruthy();
});
