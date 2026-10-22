# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> store reconciliation states use status pills and shared table actions
- Location: tests\workshopos.spec.ts:1620:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table', { name: 'Reconcile results' }).locator('.store-material-status-matched')
Expected: 2
Received: 3
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" getByRole('table', { name: 'Reconcile results' }).locator('.store-material-status-matched') with timeout 5000ms
  - waiting for getByRole('table', { name: 'Reconcile results' }).locator('.store-material-status-matched')
    14 × locator resolved to 3 elements
       - unexpected value "3"

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e10]:
      - strong [ref=f1e11]: WorkshopOS
      - generic [ref=f1e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f1e13] [cursor=pointer]
    - generic [ref=f1e17]: Store
    - navigation "Store menu" [ref=f1e18]:
      - button "Material Requests" [ref=f1e19] [cursor=pointer]
      - button "Issue Material" [ref=f1e26] [cursor=pointer]
      - button "Reconcile" [active] [ref=f1e32] [cursor=pointer]
      - button "Stock" [ref=f1e36] [cursor=pointer]
      - button "Purchase Orders" [ref=f1e48] [cursor=pointer]
      - button "Search" [ref=f1e52] [cursor=pointer]
    - button "Logout" [ref=f1e57] [cursor=pointer]
  - main [ref=f1e62]:
    - generic [ref=f1e63]:
      - generic [ref=f1e64]:
        - paragraph [ref=f1e65]: Store
        - heading "Issue counter for accountable material movement." [level=1] [ref=f1e66]
      - generic [ref=f1e67]: store@example.com
    - generic [ref=f1e72]:
      - generic [ref=f1e77]:
        - heading "Reconcile" [level=2] [ref=f1e78]
        - paragraph [ref=f1e79]: Search, filter and export the current list
      - generic [ref=f1e80]:
        - generic [ref=f1e81]:
          - text: Search
          - textbox "Search reconcile" [ref=f1e82]:
            - /placeholder: Job, vehicle or item
        - generic [ref=f1e83]:
          - text: Reconciliation state
          - combobox "Reconciliation state" [ref=f1e84]:
            - option "All states" [selected]
            - option "Matched"
            - option "Open"
        - generic [ref=f1e85]:
          - text: Job
          - combobox "Reconcile job" [ref=f1e86]:
            - option "All jobs" [selected]
            - option "JC-2026-002144 · OD13DM1012 · Demo Customer 012"
            - option "JC-2026-002143 · OD12DM1011 · Demo Customer 011"
            - option "JC-2026-002142 · OD11DM1010 · Demo Customer 010"
            - option "JC-2026-002141 · OD10DM1009 · Demo Customer 009"
            - option "JC-2026-002140 · OD09DM1008 · Demo Customer 008"
            - option "JC-2026-002139 · OD08DM1007 · Demo Customer 007"
            - option "JC-2026-002138 · OD07DM1006 · Demo Customer 006"
            - option "JC-2026-002137 · OD06DM1005 · Demo Customer 005"
            - option "JC-2026-002136 · OD05DM1004 · Demo Customer 004"
            - option "JC-2026-002135 · OD04DM1003 · Demo Customer 003"
            - option "JC-2026-002134 · OD03DM1002 · Demo Customer 002"
            - option "JC-2026-002133 · OD02DM1001 · Demo Customer 001"
            - option "JC-2026-002128 · OD09DM1128 · Demo Customer 008"
            - option "JC-2026-002127 · OD08DM1127 · Demo Customer 007"
            - option "JC-2026-002126 · OD07DM1126 · Demo Customer 006"
            - option "JC-2026-002125 · OD06DM1125 · Demo Customer 005"
            - option "JC-2026-002124 · OD05DM1124 · Demo Customer 004"
            - option "JC-2026-002123 · OD04DM1123 · Demo Customer 003"
            - option "JC-2026-002122 · OD03DM1122 · Demo Customer 002"
            - option "JC-2026-002121 · OD02DM1121 · Demo Customer 001"
            - option "JC-2026-002120 · OD01DM1120 · Demo Customer 120"
            - option "JC-2026-002119 · OD30DM1119 · Demo Customer 119"
            - option "JC-2026-002118 · OD29DM1118 · Demo Customer 118"
            - option "JC-2026-002117 · OD28DM1117 · Demo Customer 117"
            - option "JC-2026-002112 · OD23DM1112 · Demo Customer 112"
            - option "JC-2026-002111 · OD22DM1111 · Demo Customer 111"
            - option "JC-2026-002110 · OD21DM1110 · Demo Customer 110"
            - option "JC-2026-002109 · OD20DM1109 · Demo Customer 109"
            - option "JC-2026-002108 · OD19DM1108 · Demo Customer 108"
            - option "JC-2026-002107 · OD18DM1107 · Demo Customer 107"
            - option "JC-2026-002106 · OD17DM1106 · Demo Customer 106"
            - option "JC-2026-002105 · OD16DM1105 · Demo Customer 105"
            - option "JC-2026-002104 · OD15DM1104 · Demo Customer 104"
            - option "JC-2026-002103 · OD14DM1103 · Demo Customer 103"
            - option "JC-2026-002102 · OD13DM1102 · Demo Customer 102"
            - option "JC-2026-002101 · OD12DM1101 · Demo Customer 101"
            - option "JC-2026-002100 · OD11DM1100 · Demo Customer 100"
            - option "JC-2026-002096 · OD07DM1096 · Demo Customer 096"
            - option "JC-2026-002095 · OD06DM1095 · Demo Customer 095"
            - option "JC-2026-002094 · OD05DM1094 · Demo Customer 094"
            - option "JC-2026-002093 · OD04DM1093 · Demo Customer 093"
            - option "JC-2026-002092 · OD03DM1092 · Demo Customer 092"
            - option "JC-2026-002091 · OD02DM1091 · Demo Customer 091"
            - option "JC-2026-002090 · OD01DM1090 · Demo Customer 090"
            - option "JC-2026-002089 · OD30DM1089 · Demo Customer 089"
            - option "JC-2026-002088 · OD29DM1088 · Demo Customer 088"
            - option "JC-2026-002087 · OD28DM1087 · Demo Customer 087"
            - option "JC-2026-002086 · OD27DM1086 · Demo Customer 086"
            - option "JC-2026-002085 · OD26DM1085 · Demo Customer 085"
            - option "JC-2026-002080 · OD21DM1080 · Demo Customer 080"
            - option "JC-2026-002079 · OD20DM1079 · Demo Customer 079"
            - option "JC-2026-002078 · OD19DM1078 · Demo Customer 078"
            - option "JC-2026-002077 · OD18DM1077 · Demo Customer 077"
            - option "JC-2026-002076 · OD17DM1076 · Demo Customer 076"
            - option "JC-2026-002075 · OD16DM1075 · Demo Customer 075"
            - option "JC-2026-002074 · OD15DM1074 · Demo Customer 074"
            - option "JC-2026-002073 · OD14DM1073 · Demo Customer 073"
            - option "JC-2026-002072 · OD13DM1072 · Demo Customer 072"
            - option "JC-2026-002071 · OD12DM1071 · Demo Customer 071"
            - option "JC-2026-002070 · OD11DM1070 · Demo Customer 070"
            - option "JC-2026-002069 · OD10DM1069 · Demo Customer 069"
            - option "JC-2026-002064 · OD05DM1064 · Demo Customer 064"
            - option "JC-2026-002063 · OD04DM1063 · Demo Customer 063"
            - option "JC-2026-002062 · OD03DM1062 · Demo Customer 062"
            - option "JC-2026-002061 · OD02DM1061 · Demo Customer 061"
            - option "JC-2026-002060 · OD01DM1060 · Demo Customer 060"
            - option "JC-2026-002059 · OD30DM1059 · Demo Customer 059"
            - option "JC-2026-002058 · OD29DM1058 · Demo Customer 058"
            - option "JC-2026-002057 · OD28DM1057 · Demo Customer 057"
            - option "JC-2026-002056 · OD27DM1056 · Demo Customer 056"
            - option "JC-2026-002055 · OD26DM1055 · Demo Customer 055"
            - option "JC-2026-002054 · OD25DM1054 · Demo Customer 054"
            - option "JC-2026-002053 · OD24DM1053 · Demo Customer 053"
            - option "JC-2026-002048 · OD19DM1048 · Demo Customer 048"
            - option "JC-2026-002047 · OD18DM1047 · Demo Customer 047"
            - option "JC-2026-002046 · OD17DM1046 · Demo Customer 046"
            - option "JC-2026-002045 · OD16DM1045 · Demo Customer 045"
            - option "JC-2026-002044 · OD15DM1044 · Demo Customer 044"
            - option "JC-2026-002043 · OD14DM1043 · Demo Customer 043"
            - option "JC-2026-002042 · OD13DM1042 · Demo Customer 042"
            - option "JC-2026-002041 · OD12DM1041 · Demo Customer 041"
            - option "JC-2026-002040 · OD11DM1040 · Demo Customer 040"
            - option "JC-2026-002039 · OD10DM1039 · Demo Customer 039"
            - option "JC-2026-002038 · OD09DM1038 · Demo Customer 038"
            - option "JC-2026-002037 · OD08DM1037 · Demo Customer 037"
            - option "JC-2026-002032 · OD03DM1032 · Demo Customer 032"
            - option "JC-2026-002031 · OD02DM1031 · Demo Customer 031"
            - option "JC-2026-002030 · OD01DM1030 · Demo Customer 030"
            - option "JC-2026-002029 · OD30DM1029 · Demo Customer 029"
            - option "JC-2026-002028 · OD29DM1028 · Demo Customer 028"
            - option "JC-2026-002027 · OD28DM1027 · Demo Customer 027"
            - option "JC-2026-002026 · OD27DM1026 · Demo Customer 026"
            - option "JC-2026-002025 · OD26DM1025 · Demo Customer 025"
            - option "JC-2026-002024 · OD25DM1024 · Demo Customer 024"
            - option "JC-2026-002023 · OD24DM1023 · Demo Customer 023"
            - option "JC-2026-002022 · OD23DM1022 · Demo Customer 022"
            - option "JC-2026-002021 · OD22DM1021 · Demo Customer 021"
            - option "JC-2026-002016 · OD17DM1016 · Demo Customer 016"
            - option "JC-2026-002015 · OD16DM1015 · Demo Customer 015"
            - option "JC-2026-002014 · OD15DM1014 · Demo Customer 014"
            - option "JC-2026-002013 · OD14DM1013 · Demo Customer 013"
            - option "JC-2026-002012 · OD13DM1012 · Demo Customer 012"
            - option "JC-2026-002011 · OD12DM1011 · Demo Customer 011"
            - option "JC-2026-002010 · OD11DM1010 · Demo Customer 010"
            - option "JC-2026-002009 · OD10DM1009 · Demo Customer 009"
            - option "JC-2026-002008 · OD09DM1008 · Demo Customer 008"
            - option "JC-2026-002007 · OD08DM1007 · Demo Customer 007"
            - option "JC-2026-002006 · OD07DM1006 · Demo Customer 006"
            - option "JC-2026-002005 · OD06DM1005 · Demo Customer 005"
        - generic [ref=f1e87]:
          - text: Item
          - combobox "Reconcile item" [ref=f1e88]:
            - option "All items" [selected]
            - option "leather seat cover1"
            - option "Ceramic coating"
            - option "Gloss PPF roll"
            - option "Clear coat"
        - group "Search actions" [ref=f1e89]:
          - button "Clear" [ref=f1e90] [cursor=pointer]
      - generic [ref=f1e91]:
        - button "Download" [ref=f1e94] [cursor=pointer]
        - generic [ref=f1e98]: Showing 1 to 10 of 109
        - generic [ref=f1e99]:
          - generic [ref=f1e100]:
            - text: Per page
            - combobox "Reconcile records per page" [ref=f1e101]:
              - option "10" [selected]
              - option "20"
              - option "50"
          - navigation "Results pagination" [ref=f1e102]:
            - button "First page" [disabled] [ref=f1e103]
            - button "Previous page" [disabled] [ref=f1e106]
            - generic [ref=f1e109]:
              - button "Page 1" [ref=f1e110] [cursor=pointer]: "1"
              - button "Page 2" [ref=f1e111] [cursor=pointer]: "2"
              - button "Page 3" [ref=f1e112] [cursor=pointer]: "3"
              - button "Page 4" [ref=f1e113] [cursor=pointer]: "4"
              - button "Page 5" [ref=f1e114] [cursor=pointer]: "5"
              - generic [aria-hidden] [ref=f1e115]: …
              - button "Page 11" [ref=f1e116] [cursor=pointer]: "11"
            - button "Next page" [ref=f1e117] [cursor=pointer]
            - button "Last page" [ref=f1e120] [cursor=pointer]
      - table "Reconcile results" [ref=f1e124]:
        - rowgroup [ref=f1e125]:
          - row [ref=f1e126]:
            - columnheader "Job Card" [ref=f1e127]
            - columnheader "Vehicle" [ref=f1e128]
            - columnheader "Item / SKU" [ref=f1e129]
            - columnheader "Requested" [ref=f1e130]
            - columnheader "Issued" [ref=f1e131]
            - columnheader "Used" [ref=f1e132]
            - columnheader "Returned" [ref=f1e133]
            - columnheader "Wasted" [ref=f1e134]
            - columnheader "Variance" [ref=f1e135]
            - columnheader "State" [ref=f1e136]
            - columnheader "Action" [ref=f1e137]
        - rowgroup [ref=f1e138]:
          - row [ref=f1e139] [cursor=pointer]:
            - cell [ref=f1e140]:
              - button "JC-2026-002144" [ref=f1e141]
            - cell "OD13DM1012" [ref=f1e142]
            - cell "Gloss PPF roll · PPF-ROLL" [ref=f1e143]
            - cell "2" [ref=f1e144]
            - cell "2" [ref=f1e145]
            - cell "1.8" [ref=f1e146]
            - cell "0.1" [ref=f1e147]
            - cell "0.1" [ref=f1e148]
            - cell "-5.551115123125783e-17" [ref=f1e149]
            - cell "Matched" [ref=f1e150]
            - cell [ref=f1e152]:
              - button "Edit Reconciliation" [ref=f1e154]
          - row [ref=f1e155] [cursor=pointer]:
            - cell [ref=f1e156]:
              - button "JC-2026-002143" [ref=f1e157]
            - cell "OD12DM1011" [ref=f1e158]
            - cell "Clear coat · PAINT-CLEAR" [ref=f1e159]
            - cell "2" [ref=f1e160]
            - cell "2" [ref=f1e161]
            - cell "1.8" [ref=f1e162]
            - cell "0.1" [ref=f1e163]
            - cell "0.1" [ref=f1e164]
            - cell "-5.551115123125783e-17" [ref=f1e165]
            - cell "Matched" [ref=f1e166]
            - cell [ref=f1e168]:
              - button "Edit Reconciliation" [ref=f1e170]
          - row [ref=f1e171] [cursor=pointer]:
            - cell [ref=f1e172]:
              - button "JC-2026-002142" [ref=f1e173]
            - cell "OD11DM1010" [ref=f1e174]
            - cell "Ceramic coating · CERAMIC-1L" [ref=f1e175]
            - cell "2" [ref=f1e176]
            - cell "2" [ref=f1e177]
            - cell "1.8" [ref=f1e178]
            - cell "0.1" [ref=f1e179]
            - cell "0.1" [ref=f1e180]
            - cell "-5.551115123125783e-17" [ref=f1e181]
            - cell "Matched" [ref=f1e182]
            - cell [ref=f1e184]:
              - button "Edit Reconciliation" [ref=f1e186]
          - row [ref=f1e187] [cursor=pointer]:
            - cell [ref=f1e188]:
              - button "JC-2026-002141" [ref=f1e189]
            - cell "OD10DM1009" [ref=f1e190]
            - cell "Gloss PPF roll · PPF-ROLL" [ref=f1e191]
            - cell "2" [ref=f1e192]
            - cell "2" [ref=f1e193]
            - cell "1.8" [ref=f1e194]
            - cell "0" [ref=f1e195]
            - cell "0" [ref=f1e196]
            - cell "0.19999999999999996" [ref=f1e197]
            - cell "Open" [ref=f1e198]
            - cell [ref=f1e200]:
              - button "Reconcile" [ref=f1e202]
          - row [ref=f1e203] [cursor=pointer]:
            - cell [ref=f1e204]:
              - button "JC-2026-002140" [ref=f1e205]
            - cell "OD09DM1008" [ref=f1e206]
            - cell "Clear coat · PAINT-CLEAR" [ref=f1e207]
            - cell "2" [ref=f1e208]
            - cell "2" [ref=f1e209]
            - cell "1.8" [ref=f1e210]
            - cell "0" [ref=f1e211]
            - cell "0" [ref=f1e212]
            - cell "0.19999999999999996" [ref=f1e213]
            - cell "Open" [ref=f1e214]
            - cell [ref=f1e216]:
              - button "Reconcile" [ref=f1e218]
          - row [ref=f1e219] [cursor=pointer]:
            - cell [ref=f1e220]:
              - button "JC-2026-002139" [ref=f1e221]
            - cell "OD08DM1007" [ref=f1e222]
            - cell "Ceramic coating · CERAMIC-1L" [ref=f1e223]
            - cell "2" [ref=f1e224]
            - cell "2" [ref=f1e225]
            - cell "1.8" [ref=f1e226]
            - cell "0" [ref=f1e227]
            - cell "0" [ref=f1e228]
            - cell "0.19999999999999996" [ref=f1e229]
            - cell "Open" [ref=f1e230]
            - cell [ref=f1e232]:
              - button "Reconcile" [ref=f1e234]
          - row [ref=f1e235] [cursor=pointer]:
            - cell [ref=f1e236]:
              - button "JC-2026-002138" [ref=f1e237]
            - cell "OD07DM1006" [ref=f1e238]
            - cell "Gloss PPF roll · PPF-ROLL" [ref=f1e239]
            - cell "2" [ref=f1e240]
            - cell "2" [ref=f1e241]
            - cell "1.8" [ref=f1e242]
            - cell "0" [ref=f1e243]
            - cell "0" [ref=f1e244]
            - cell "0.19999999999999996" [ref=f1e245]
            - cell "Open" [ref=f1e246]
            - cell [ref=f1e248]:
              - button "Reconcile" [ref=f1e250]
          - row [ref=f1e251] [cursor=pointer]:
            - cell [ref=f1e252]:
              - button "JC-2026-002137" [ref=f1e253]
            - cell "OD06DM1005" [ref=f1e254]
            - cell "Clear coat · PAINT-CLEAR" [ref=f1e255]
            - cell "2" [ref=f1e256]
            - cell "2" [ref=f1e257]
            - cell "1.8" [ref=f1e258]
            - cell "0" [ref=f1e259]
            - cell "0" [ref=f1e260]
            - cell "0.19999999999999996" [ref=f1e261]
            - cell "Open" [ref=f1e262]
            - cell [ref=f1e264]:
              - button "Reconcile" [ref=f1e266]
          - row [ref=f1e267] [cursor=pointer]:
            - cell [ref=f1e268]:
              - button "JC-2026-002136" [ref=f1e269]
            - cell "OD05DM1004" [ref=f1e270]
            - cell "Ceramic coating · CERAMIC-1L" [ref=f1e271]
            - cell "2" [ref=f1e272]
            - cell "2" [ref=f1e273]
            - cell "1.8" [ref=f1e274]
            - cell "0" [ref=f1e275]
            - cell "0" [ref=f1e276]
            - cell "0.19999999999999996" [ref=f1e277]
            - cell "Open" [ref=f1e278]
            - cell [ref=f1e280]:
              - button "Reconcile" [ref=f1e282]
          - row [ref=f1e283] [cursor=pointer]:
            - cell [ref=f1e284]:
              - button "JC-2026-002135" [ref=f1e285]
            - cell "OD04DM1003" [ref=f1e286]
            - cell "Gloss PPF roll · PPF-ROLL" [ref=f1e287]
            - cell "2" [ref=f1e288]
            - cell "2" [ref=f1e289]
            - cell "1.8" [ref=f1e290]
            - cell "0" [ref=f1e291]
            - cell "0" [ref=f1e292]
            - cell "0.19999999999999996" [ref=f1e293]
            - cell "Open" [ref=f1e294]
            - cell [ref=f1e296]:
              - button "Reconcile" [ref=f1e298]
      - navigation "Results pagination" [ref=f1e299]:
        - button "First page" [disabled] [ref=f1e300]
        - button "Previous page" [disabled] [ref=f1e303]
        - generic [ref=f1e306]:
          - button "Page 1" [ref=f1e307] [cursor=pointer]: "1"
          - button "Page 2" [ref=f1e308] [cursor=pointer]: "2"
          - button "Page 3" [ref=f1e309] [cursor=pointer]: "3"
          - button "Page 4" [ref=f1e310] [cursor=pointer]: "4"
          - button "Page 5" [ref=f1e311] [cursor=pointer]: "5"
          - generic [aria-hidden] [ref=f1e312]: …
          - button "Page 11" [ref=f1e313] [cursor=pointer]: "11"
        - button "Next page" [ref=f1e314] [cursor=pointer]
        - button "Last page" [ref=f1e317] [cursor=pointer]
```

# Test source

```ts
  1525 |   await expect(page.getByText("Showing 1 to 10 of 127")).toBeVisible();
  1526 | 
  1527 |   await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  1528 |   await page.getByLabel("Status").selectOption("Pending");
  1529 |   await expect(page.getByRole("table", { name: "Material Requests results" }).locator("tbody tr")).toHaveCount(1);
  1530 |   await page.getByLabel("Item").fill("nano");
  1531 |   await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
  1532 |   await expect(page.getByRole("table", { name: "Material Requests results" }).getByRole("cell", { name: "JC-2026-001246" })).toBeVisible();
  1533 | });
  1534 | 
  1535 | test("stock filter toolbars use no more than two rows above mobile", async ({ page }) => {
  1536 |   await loginAs(page, "store@example.com");
  1537 |   await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  1538 | 
  1539 |   for (const viewport of [{ width: 1440, height: 900 }, { width: 900, height: 900 }]) {
  1540 |     await page.setViewportSize(viewport);
  1541 |     for (const tab of ["Inventory List", "Low Stock", "Stock Movements"]) {
  1542 |       await page.getByRole("tab", { name: tab, exact: true }).click();
  1543 |       await expectStockToolbarHasAtMostTwoRows(page);
  1544 |     }
  1545 |   }
  1546 | 
  1547 |   await page.setViewportSize({ width: 390, height: 844 });
  1548 |   await page.getByRole("tab", { name: "Inventory List", exact: true }).click();
  1549 |   await expectNoPageOverflow(page);
  1550 |   await page.getByRole("tab", { name: "Low Stock", exact: true }).click();
  1551 |   await expectNoPageOverflow(page);
  1552 |   await page.getByRole("tab", { name: "Stock Movements", exact: true }).click();
  1553 |   await expectNoPageOverflow(page);
  1554 | });
  1555 | 
  1556 | test("Store cannot bypass the Purchase Order workflow with direct Stock Inward", async ({ page }) => {
  1557 |   await loginAs(page, "store@example.com");
  1558 |   await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  1559 |   const stockTable = page.getByRole("table", { name: "Stock results" });
  1560 |   await expect(stockTable.getByRole("columnheader", { name: "Unit", exact: true })).toHaveCount(0);
  1561 |   await expect(stockTable.locator("tbody tr").first().locator("td").nth(3)).toHaveText(/\S+\s+\S+/);
  1562 |   await expect(page.locator(".stock-main-grid")).toHaveCount(0);
  1563 |   await expect(page.getByRole("button", { name: "Quick Add Stock", exact: true })).toHaveCount(0);
  1564 |   await expect(page.getByRole("dialog", { name: "Quick Add Stock" })).toHaveCount(0);
  1565 | });
  1566 | 
  1567 | test("Materials Requests triage issueable, shortage, and New Item demand into Purchase Requests", async ({ page }) => {
  1568 |   await loginAs(page, "store@example.com");
  1569 |   await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  1570 |   const triage = page.getByRole("region", { name: "Material procurement triage" });
  1571 |   await expect(triage.getByRole("heading", { name: "Available to issue" })).toBeVisible();
  1572 |   await expect(triage.getByRole("heading", { name: "Existing-SKU procurement" })).toBeVisible();
  1573 |   await expect(triage.getByRole("heading", { name: "New Item Requests" })).toBeVisible();
  1574 |   await expect(triage.getByRole("button", { name: "Create Purchase Request" })).toBeDisabled();
  1575 |   await triage.getByRole("button", { name: "Create New Item Request" }).click();
  1576 |   await expect(page.getByRole("heading", { name: "Purchase Orders", exact: true })).toBeVisible();
  1577 |   const purchaseRequest = page.getByRole("dialog", { name: "New Purchase Request" });
  1578 |   await expect(purchaseRequest).toBeVisible();
  1579 |   await expect(purchaseRequest.getByLabel("Item type")).toHaveValue("new");
  1580 | });
  1581 | 
  1582 | test("issue and reconcile lists filter by item and reconciliation state", async ({ page }) => {
  1583 |   await loginAs(page, "store@example.com");
  1584 |   await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  1585 |   await page.getByLabel("Item").fill("nano");
  1586 |   await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
  1587 |   await expect(page.getByRole("table", { name: "Issue Material results" }).locator("tbody tr")).toHaveCount(1);
  1588 | 
  1589 |   await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  1590 |   await page.getByLabel("Reconciliation state").selectOption("Matched");
  1591 |   await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(2);
  1592 |   await page.getByLabel("Reconciliation state").selectOption("Open");
  1593 |   await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(0);
  1594 |   await expect(page.getByText("No matching records")).toBeVisible();
  1595 | });
  1596 | 
  1597 | test("material record queues use compact rows and issue actions do not open their row", async ({ page }) => {
  1598 |   await loginAs(page, "store@example.com");
  1599 | 
  1600 |   for (const pageName of ["Material Requests", "Issue Material"] as const) {
  1601 |     await page.locator(".role-nav").getByRole("button", { name: pageName, exact: true }).click();
  1602 |     const table = page.getByRole("table", { name: `${pageName} results` });
  1603 |     await expect(table).toHaveClass(/store-material-record-table/);
  1604 |     await expect(table.locator("tbody tr").first().locator("td").first()).toHaveCSS("padding-top", "7px");
  1605 |     await expect(table.locator(".store-material-status").first()).toHaveCSS("min-height", "24px");
  1606 |   }
  1607 | 
  1608 |   const issueTable = page.getByRole("table", { name: "Issue Material results" });
  1609 |   const issueAction = issueTable.getByRole("button", { name: "Issue Material", exact: true }).first();
  1610 |   const approvalAction = issueTable.getByRole("button", { name: "Needs Approval", exact: true }).first();
  1611 |   await expect(issueAction).toHaveClass(/action-primary/);
  1612 |   await expect(approvalAction).toHaveClass(/action-secondary/);
  1613 |   await expect(issueAction).toHaveCSS("min-height", "30px");
  1614 |   await expect(approvalAction).toHaveCSS("min-height", "30px");
  1615 | 
  1616 |   await approvalAction.click();
  1617 |   await expect(page.getByRole("heading", { name: "Job Card", exact: true })).toHaveCount(0);
  1618 | });
  1619 | 
  1620 | test("store reconciliation states use status pills and shared table actions", async ({ page }) => {
  1621 |   await loginAs(page, "store@example.com");
  1622 |   await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  1623 | 
  1624 |   const results = page.getByRole("table", { name: "Reconcile results" });
> 1625 |   await expect(results.locator(".store-material-status-matched")).toHaveCount(2);
       |                                                                   ^ Error: expect(locator).toHaveCount(expected) failed
  1626 |   await expect(results.getByRole("button", { name: "Edit Reconciliation" }).first()).toHaveClass(/store-material-action/);
  1627 | });
  1628 | 
  1629 | test("reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation", async ({ page }) => {
  1630 |   await loginAs(page, "store@example.com");
  1631 |   await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  1632 |   await page.getByRole("table", { name: "Issue Material results" }).getByRole("button", { name: "Issue Material", exact: true }).first().click();
  1633 |   await page.getByRole("dialog", { name: "Confirm material release" }).getByRole("button", { name: "Confirm release", exact: true }).click();
  1634 |   await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  1635 | 
  1636 |   const results = page.getByRole("table", { name: "Reconcile results" });
  1637 |   const action = results.getByRole("button", { name: "Reconcile", exact: true }).first();
  1638 |   await action.click();
  1639 |   const dialog = page.getByRole("dialog", { name: "Reconcile Material" });
  1640 |   await expect(dialog).toBeVisible();
  1641 |   await expect(page.getByLabel("Used quantity")).toBeFocused();
  1642 |   await page.getByLabel("Used quantity").fill("1");
  1643 |   await page.getByLabel("Returned quantity").fill("0");
  1644 |   await page.getByLabel("Wasted quantity").fill("0");
  1645 |   await expect(dialog.getByRole("button", { name: "Save Reconciliation" })).toBeDisabled();
  1646 |   await page.getByLabel("Confirm no return or wastage").check();
  1647 |   await expect(dialog.getByRole("button", { name: "Save Reconciliation" })).toBeEnabled();
  1648 |   await page.keyboard.press("Escape");
  1649 |   await expect(dialog).toBeHidden();
  1650 |   await expect(action).toBeFocused();
  1651 | 
  1652 |   await action.click();
  1653 |   await page.getByLabel("Used quantity").fill("1");
  1654 |   await page.getByLabel("Returned quantity").fill("0");
  1655 |   await page.getByLabel("Wasted quantity").fill("0");
  1656 |   await page.getByLabel("Confirm no return or wastage").check();
  1657 |   await page.getByRole("dialog", { name: "Reconcile Material" }).getByRole("button", { name: "Save Reconciliation" }).click();
  1658 |   await expect(page.getByRole("dialog", { name: "Reconcile Material" })).toBeHidden();
  1659 |   await expect(results.locator(".store-material-status-open")).toHaveCount(1);
  1660 | 
  1661 |   await results.getByRole("button", { name: "Edit Reconciliation" }).first().click();
  1662 |   await page.getByLabel("Used quantity").fill("0");
  1663 |   await page.getByLabel("Returned quantity").fill("0");
  1664 |   await page.getByLabel("Wasted quantity").fill("0");
  1665 |   await page.getByLabel("Confirm no return or wastage").check();
  1666 |   await page.getByRole("dialog", { name: "Reconcile Material" }).getByRole("button", { name: "Save Reconciliation" }).click();
  1667 |   await expect(results.locator(".store-material-status-open")).toHaveCount(2);
  1668 | });
  1669 | 
  1670 | test("store material queues default to today and keep record filters, exports and workflows in sync", async ({ page }) => {
  1671 |   await loginAs(page, "store@example.com");
  1672 |   const today = await page.evaluate(() => {
  1673 |     const now = new Date();
  1674 |     const offset = now.getTimezoneOffset() * 60_000;
  1675 |     return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  1676 |   });
  1677 | 
  1678 |   for (const pageName of ["Material Requests", "Issue Material"] as const) {
  1679 |     await page.locator(".role-nav").getByRole("button", { name: pageName, exact: true }).click();
  1680 |     const date = page.getByLabel(`${pageName} record date`);
  1681 |     const month = page.getByLabel(`${pageName} record month`);
  1682 |     const disclosure = page.locator(".workspace:visible .workflow-disclosure");
  1683 |     await expect(date).toHaveValue(today);
  1684 |     if (pageName === "Material Requests")
  1685 |       await expect(page.getByRole("region", { name: "Material procurement triage" })).toBeVisible();
  1686 |     else {
  1687 |       if (await disclosure.getAttribute("open") === null)
  1688 |         await disclosure.locator("summary").getByText("Issue workflow", { exact: true }).click();
  1689 |       await expect(disclosure).toHaveAttribute("open", "");
  1690 |     }
  1691 | 
  1692 |     const availableMonth = month.locator("option").nth(1);
  1693 |     if (await availableMonth.count()) {
  1694 |       await month.selectOption(await availableMonth.getAttribute("value") ?? "");
  1695 |       await expect(date).toHaveValue("");
  1696 |       await date.fill(today);
  1697 |       await expect(month).toHaveValue("");
  1698 |     }
  1699 | 
  1700 |     // Remove the time scope only while proving the searchable selector against
  1701 |     // the full fixture set.
  1702 |     await date.fill("");
  1703 | 
  1704 |     await page.getByLabel("Item").fill("nano");
  1705 |     await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
  1706 | 
  1707 |     await page.getByRole("button", { name: "Clear", exact: true }).click();
  1708 |     await expect(date).toHaveValue("");
  1709 |     await expect(month).toHaveValue("");
  1710 |     await expect(page.getByLabel("Status")).toHaveValue("ALL");
  1711 |     await expect(page.getByLabel("Item")).toHaveValue("All items");
  1712 |     const toolbarControls = page.locator(".material-record-filter-grid > label, .material-record-filter-grid > .list-search-actions");
  1713 |     await expect(toolbarControls).toHaveCount(5);
  1714 |     await expect(toolbarControls).toHaveText([/^Date/, /^Month-Year/, /^Status/, /^Item/, /^Clear$/]);
  1715 | 
  1716 |     await page.getByRole("button", { name: "Download", exact: true }).click();
  1717 |     const downloadPromise = page.waitForEvent("download");
  1718 |     await page.getByRole("menuitem", { name: "Excel" }).click();
  1719 |     const worksheet = await readWorksheet(await downloadPromise);
  1720 |     expect(String(worksheet[2]?.[1])).not.toContain("Record date:");
  1721 | 
  1722 |     for (const viewport of [{ width: 1440, height: 900 }, { width: 900, height: 900 }]) {
  1723 |       await page.setViewportSize(viewport);
  1724 |       await expectMaterialRecordToolbarHasOneRow(page);
  1725 |       await expectNoPageOverflow(page);
```