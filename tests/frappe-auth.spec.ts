import { expect, test, type Page } from "@playwright/test";

// Exercises the real Task 1 Frappe site (http://localhost:8000, workshop_os.localhost) — no
// route mocking. Requires the bench webserver to be running (see task-2-brief.md) and the six
// throwaway test users below to exist, created via `bench --site workshop_os.localhost console`:
//
//   import frappe
//   for role in ["admin","service","reception","accounts","store","tech"]:
//       email = f"{role}@workshop-os.local"
//       if not frappe.db.exists("User", email):
//           u = frappe.get_doc({"doctype": "User", "email": email, "first_name": role.capitalize(),
//                                "send_welcome_email": 0, "new_password": "TestPass123!"})
//           u.insert(ignore_permissions=True)
//           u.add_roles(role)
//   frappe.db.commit()
//
// and tech@workshop-os.local archived (User.enabled = 0) for the archived-user-rejection test.
//
// Run with: FRAPPE_TEST=1 npx playwright test tests/frappe-auth.spec.ts

const PASSWORD = "TestPass123!";

const roles = [
  ["admin@workshop-os.local", ["Dashboard", "Data Flow", "Jobs", "Customers", "Vehicles", "Media", "Masters", "Manage", "Search", "Admin Console"]],
  ["service@workshop-os.local", ["My Queue", "Job Card", "Estimate", "Follow-ups", "Media", "Search"]],
  ["reception@workshop-os.local", ["Receive Vehicle", "Today Queue", "Customers", "Vehicles", "Search"]],
  ["accounts@workshop-os.local", ["Ready To Invoice", "Invoice", "Payment", "Delivery", "Search"]],
  ["store@workshop-os.local", ["Material Requests", "Issue Material", "Reconcile", "Stock", "Search"]],
] as const;

async function login(page: Page, email: string, password: string) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

test.beforeEach(async ({ page, context }) => {
  // Clear the sid cookie from any prior test in this worker so each test starts logged out.
  await context.clearCookies();
  await page.goto("/");
});

for (const [email, navItems] of roles) {
  test(`${email} logs in and sees its role menu`, async ({ page }) => {
    await login(page, email, PASSWORD);
    const nav = page.locator(".role-nav");
    for (const item of navItems) {
      await expect(nav.getByRole("button", { name: item, exact: true })).toBeVisible();
    }
  });
}

test("session persists across a reload, and logout ends it server-side", async ({ page }) => {
  await login(page, "admin@workshop-os.local", PASSWORD);
  await expect(page.locator(".role-nav").getByRole("button", { name: "Dashboard", exact: true })).toBeVisible();

  // Reload: the sid cookie should be enough to restore the session without re-prompting.
  await page.reload();
  await expect(page.locator(".role-nav").getByRole("button", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveCount(0);

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByLabel("Email")).toBeVisible();

  // Reload after logout must show the login screen again (cookie invalidated server-side, not
  // just cleared client-side — confirmed independently by the backend TestCase).
  await page.reload();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("an archived user is rejected at login with the same generic error as bad credentials", async ({ page }) => {
  await login(page, "tech@workshop-os.local", PASSWORD);
  await expect(page.getByText("Invalid email or password.")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("wrong password and an unknown email show the identical generic error (non-leaking)", async ({ page }) => {
  await login(page, "admin@workshop-os.local", "wrong-password");
  const wrongPasswordError = await page.getByText("Invalid email or password.").textContent();

  await page.reload();
  await login(page, "no-such-user@workshop-os.local", "whatever");
  const unknownEmailError = await page.getByText("Invalid email or password.").textContent();

  expect(wrongPasswordError).toBe(unknownEmailError);
});
