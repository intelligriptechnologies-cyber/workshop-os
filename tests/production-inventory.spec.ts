import { expect, test } from "@playwright/test";

const branchId="00000000-0000-4000-8000-000000000011";
test.beforeEach(async({page})=>{await page.route("**/api/v1/auth/config",r=>r.fulfill({json:{mode:"local",allowDemo:true}}));await page.route("**/api/v1/session",r=>r.fulfill({json:{membership:{branches:[{id:branchId,name:"Delhi"}],permissions:["inventory.page","inventory.read","inventory.operate","inventory.export","inventory.import"]}}}));await page.route("**/api/v1/list-preferences/inventory",async r=>r.fulfill({json:{preference:{viewMode:r.request().method()==="PUT"?r.request().postDataJSON().viewMode:"table",version:1}}}));});

test("inventory shows analytics, posts a reasoned receipt, and separates dry-run from explicit commit",async({page})=>{let quantity="4";await page.route("**/api/v1/inventory**",async route=>{const url=new URL(route.request().url());if(url.pathname==="/api/v1/inventory"){await route.fulfill({json:{inventory:[{id:"item-1",branchId,warehouseId:"warehouse-1",warehouseName:"MAIN",sku:"OIL-5W30",baseUom:"EA",quantity,valueMinor:"400",reorderPoint:"5",reorder:true,ageDays:3}],analytics:{skuCount:1,totalQuantity:quantity,totalValueMinor:"400",reorderCount:1},page:{page:1,pageSize:25,totalCount:1,pageCount:1}}});return;}if(url.pathname.endsWith("/receipts")){quantity="6";await route.fulfill({status:201,json:{receipt:{ledgerBatchId:"batch-1"}}});return;}if(url.pathname.endsWith("/imports")){await route.fulfill({status:201,json:{import:{id:"import-1",branchId,filename:"stock.csv",status:"STAGED",version:1,summary:{totalRows:1,validRows:1,invalidRows:0,quantity:"2",valueMinor:"100"}}}});return;}if(url.pathname.endsWith("/commit")){await route.fulfill({json:{import:{id:"import-1",branchId,filename:"stock.csv",status:"COMMITTED",version:2,summary:{totalRows:1,validRows:1,invalidRows:0,quantity:"2",valueMinor:"100"},reconciliation:{ledgerBatches:1,quantity:"2",valueMinor:"100"}},reconciliation:{ledgerBatches:1,quantity:"2",valueMinor:"100"}}});return;}await route.fulfill({status:404,json:{code:"NOT_FOUND"}});});
  await page.goto("/production/inventory");await expect(page.getByText("OIL-5W30")).toBeVisible();await expect(page.getByText("Reorder",{exact:true})).toBeVisible();await page.getByLabel("Sort").selectOption("summary.asc");await expect(page).toHaveURL(/sort=summary.asc/);await page.getByLabel("Rows",{exact:true}).selectOption("50");await expect(page).toHaveURL(/pageSize=50/);await page.getByRole("button",{name:"Receive",exact:true}).click();await page.getByLabel("Quantity").fill("2");await page.getByLabel("Value in minor units").fill("100");await page.getByLabel("Reason").fill("Opening delivery");await page.getByRole("button",{name:"Post receipt"}).click();await expect(page.getByRole("status")).toContainText("append-only ledger");await page.getByRole("button",{name:"Grid"}).click();await expect(page.getByRole("button",{name:"Receive OIL-5W30"})).toBeVisible();
  await page.getByRole("button",{name:"Stage import"}).click();await page.getByLabel("Filename").fill("stock.csv");await page.getByLabel("CSV rows").fill("sku,warehouseCode,quantity,valueMinor\nOIL-5W30,MAIN,2,100");await page.getByRole("button",{name:"Validate dry run"}).click();await expect(page.getByRole("status")).toContainText("No stock changed");await page.getByRole("button",{name:"Commit validated import"}).click();await expect(page.getByRole("status")).toContainText("1 ledger batches reconciled");
});

test("inventory receipt persists through HTTP and PostgreSQL after reload",async({page})=>{
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL,"requires the production Docker stack");
  await page.goto("/production/inventory");
  const row=page.getByRole("row").filter({hasText:"OIL-5W30"});
  const before=await row.textContent();
  await row.getByRole("button",{name:"Receive",exact:true}).click();
  await page.getByLabel("Quantity").fill("0.001");
  await page.getByLabel("Value in minor units").fill("1");
  await page.getByLabel("Reason").fill("Browser persistence verification");
  await page.getByRole("button",{name:"Post receipt"}).click();
  await expect(page.getByRole("status")).toContainText("append-only ledger");
  await page.reload();
  await expect(page.getByRole("row").filter({hasText:"OIL-5W30"})).not.toHaveText(before??"");
});
