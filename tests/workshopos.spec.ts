import { expect, test } from "@playwright/test";

const roles = [
  ["reception@example.com", ["Receive Vehicle", "Today Queue", "Customers", "Search"]],
  ["service@example.com", ["My Queue", "Job Card", "Estimate", "Follow-ups", "Photos", "Search"]],
  ["store@example.com", ["Material Requests", "Issue Material", "Reconcile", "Stock", "Search"]],
  ["tech@example.com", ["My Tasks", "Work Update", "QC Prep", "Search"]],
  ["accounts@example.com", ["Ready To Invoice", "Invoice", "Payment", "Delivery", "Search"]],
  ["admin@example.com", ["Dashboard", "Data Flow", "Jobs", "Masters", "Search"]],
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

for (const [email, navItems] of roles) {
  test(`${email} can open every role screen`, async ({ page }) => {
    await loginAs(page, email);
    for (const item of navItems) {
      await page.locator(".role-nav").getByRole("button", { name: item, exact: true }).click();
      await expect(page.getByText(item).first()).toBeVisible();
    }
  });
}

test("reception creates a linked customer vehicle visit and job searchable after reload", async ({ page }) => {
  await loginAs(page, "reception@example.com");
  await page.getByLabel("Customer Name").fill("E2E Customer");
  await page.getByLabel("Mobile").fill("9000099999");
  await page.getByLabel("Vehicle Number").fill("OD02E2E9999");
  await page.getByLabel("Requested Work").fill("E2E coating inspection");
  await page.getByRole("button", { name: "Create Visit" }).click();
  await page.reload();
  await loginAs(page, "reception@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.locator(".search-box input").fill("OD02E2E9999");
  await expect(page.getByText("OD02E2E9999").first()).toBeVisible();
  await expect(page.getByText("E2E Customer").first()).toBeVisible();
});

async function loginAs(page: import("@playwright/test").Page, email: string) {
  await page.getByLabel("Emulate User:").selectOption(email);
  await page.getByRole("button", { name: "Login" }).click();
}
