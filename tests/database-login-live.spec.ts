import { expect, test } from "@playwright/test";

test("real PostgreSQL login restores sessions and logs out", async ({ page, browser }) => {
  test.skip(process.env.WORKSHOPOS_LIVE_LOGIN !== "1", "Opt in against the local database API");
  await page.goto("/");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("admin123");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.locator(".role-nav")).toBeVisible();
  await page.reload();
  await expect(page.locator(".role-nav")).toBeVisible();
  const second = await browser.newContext();
  try {
    const other = await second.newPage();
    await other.goto(page.url().replace(/\/app\/.*$/, "/"));
    await expect(other.getByLabel("Email", { exact: true })).toBeVisible();
    await other.getByLabel("Email", { exact: true }).fill("admin@example.com");
    await other.getByLabel("Password", { exact: true }).fill("admin123");
    await other.getByRole("button", { name: "Login", exact: true }).click();
    await expect(other.locator(".role-nav")).toBeVisible();
    await page.locator(".rail .logout").click();
    await page.reload();
    await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
    await other.reload();
    await expect(other.locator(".role-nav")).toBeVisible();
    await other.locator(".rail .logout").click();
  } finally {
    await second.close();
  }
});
