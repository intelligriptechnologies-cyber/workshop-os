import { execFileSync } from "node:child_process";
import { expect, test, type Page } from "@playwright/test";

// Exercises FrappeUserManager (Task 3's Frappe-backed admin console UI) against the real Task 1
// Frappe site (http://localhost:8000, workshop_os.localhost) — no route mocking, mirroring
// tests/frappe-auth.spec.ts's pattern exactly. Requires the bench webserver to be running and
// admin@workshop-os.local / TestPass123! to exist (see tests/frappe-auth.spec.ts's setup snippet).
//
// This spec creates and deletes its own throwaway user (a unique, timestamped email) so it never
// touches the seven shared login fixtures other specs rely on staying in their current state.
//
// The create/update/archive ASSERTIONS all go through the real UI. Two backend-only steps use the
// bench console instead of the UI, because no sanctioned frontend path exists for them:
//   - setting a known password on the throwaway user (create_user assigns a server-generated
//     default password that is never returned to the caller — see admin-users-api.ts / the "A
//     default WorkshopOS password is set" copy in FrappeUserManager's form)
//   - deleting the throwaway user afterwards (archiving via the UI is a soft-disable, not a
//     delete, and is exercised by the test itself; a hard delete for teardown has no whitelisted
//     API for a non-Administrator caller)
// Both go through `bench --site workshop_os.localhost execute` via the same WSL/Docker Compose
// bench this environment already uses to start/restart the webserver.
//
// Run with: FRAPPE_TEST=1 npx playwright test tests/frappe-admin-users.spec.ts

const PASSWORD = "TestPass123!";
const ADMIN_EMAIL = "admin@workshop-os.local";
const TECH_EMAIL = "tech-active@workshop-os.local";

const SITE = "workshop_os.localhost";
const COMPOSE_DIR = "~/hyperflow-forge/frappe_docker";
const BENCH_DIR = "/workspace/development/frappe-bench";

function benchExecute(method: string, argsLiteral: string, kwargsLiteral?: string): void {
  const kwargsPart = kwargsLiteral ? ` --kwargs "${kwargsLiteral}"` : "";
  const remote = `cd ${COMPOSE_DIR} && docker compose -f docker-compose.dev.yml exec -T -w ${BENCH_DIR} frappe bench --site ${SITE} execute ${method} --args '${argsLiteral}'${kwargsPart}`;
  execFileSync("wsl", ["-d", "Ubuntu", "--", "bash", "-lc", remote], { stdio: "pipe" });
}

function setKnownPassword(email: string) {
  benchExecute("frappe.utils.password.update_password", `["${email}", "${PASSWORD}"]`);
}

function deleteFrappeUser(email: string) {
  try {
    benchExecute("frappe.delete_doc", `["User", "${email}"]`, "{'force':1,'ignore_permissions':1,'ignore_missing':1}");
  } catch {
    // Best-effort teardown: leaving a throwaway archived test user behind is harmless and must
    // never fail the run.
  }
}

async function login(page: Page, email: string, password: string) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

async function openAdminUsers(page: Page) {
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Users" })).toBeVisible();
}

test.describe.configure({ mode: "serial" });

test.describe("Frappe admin user management (real backend)", () => {
  const stamp = Date.now();
  const newUserEmail = `frappe-admin-test-${stamp}@workshop-os.local`;
  const initialName = `Admin Test User ${stamp}`;
  const updatedName = `Admin Test User ${stamp} Updated`;

  test.beforeEach(async ({ page, context }) => {
    // Clear the sid cookie from any prior test in this worker so each test starts logged out.
    await context.clearCookies();
    await page.goto("/");
  });

  test.afterAll(() => {
    deleteFrappeUser(newUserEmail);
  });

  test("admin creates a new user with a role, and it appears in the list", async ({ page }) => {
    await login(page, ADMIN_EMAIL, PASSWORD);
    await openAdminUsers(page);

    await page.getByRole("button", { name: "Add User" }).click();
    await page.getByLabel("User name").fill(initialName);
    await page.getByLabel("User email").fill(newUserEmail);

    const rolesGroup = page.getByRole("group", { name: "Roles" });
    const checkedRoles = rolesGroup.locator("input[type=checkbox]:checked");
    while (await checkedRoles.count() > 0) {
      await checkedRoles.first().uncheck();
    }
    await rolesGroup.getByRole("checkbox", { name: "Reception" }).check();

    await page.getByRole("button", { name: "Create User" }).click();

    const record = page.locator(".managed-record", { hasText: newUserEmail });
    await expect(record).toBeVisible();
    await expect(record.getByText(initialName)).toBeVisible();
    await expect(record.getByText("Reception")).toBeVisible();
    await expect(record.getByText("ACTIVE")).toBeVisible();
  });

  test("admin updates the user's name and role", async ({ page }) => {
    await login(page, ADMIN_EMAIL, PASSWORD);
    await openAdminUsers(page);

    const record = page.locator(".managed-record", { hasText: newUserEmail });
    await record.getByRole("button", { name: "Edit" }).click();

    await page.getByLabel("User name").fill(updatedName);
    const rolesGroup = page.getByRole("group", { name: "Roles" });
    await rolesGroup.getByRole("checkbox", { name: "Accounts" }).check();
    await page.getByRole("button", { name: "Save Changes" }).click();

    const updatedRecord = page.locator(".managed-record", { hasText: newUserEmail });
    await expect(updatedRecord.getByText(updatedName)).toBeVisible();
    await expect(updatedRecord.getByText("Accounts")).toBeVisible();
  });

  test("admin archives the user, and the archived user can no longer log in", async ({ page }) => {
    // Backend-only setup: give the throwaway user a password we know, so the login attempt below
    // fails because the account is archived, not because the credentials are unknown.
    setKnownPassword(newUserEmail);

    await login(page, ADMIN_EMAIL, PASSWORD);
    await openAdminUsers(page);

    const record = page.locator(".managed-record", { hasText: newUserEmail });
    page.once("dialog", (dialog) => void dialog.accept("End-of-test cleanup archive."));
    await record.getByRole("button", { name: "Archive" }).click();
    await expect(record.getByText("ARCHIVED")).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page.getByLabel("Email")).toBeVisible();

    await login(page, newUserEmail, PASSWORD);
    await expect(page.getByText("Invalid email or password.")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("a non-admin role does not see the admin user management UI", async ({ page }) => {
    await login(page, TECH_EMAIL, PASSWORD);
    await expect(page.locator(".role-nav").getByRole("button", { name: "My Tasks", exact: true })).toBeVisible();
    await expect(page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true })).toHaveCount(0);
  });
});
