# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> estimate dialog stages item CRUD and persists only on Save
- Location: tests\workshopos.spec.ts:2162:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Edit Estimate' })

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e10]:
      - strong [ref=f1e11]: WorkshopOS
      - generic [ref=f1e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f1e13] [cursor=pointer]
    - generic [ref=f1e17]: Owner/Admin
    - navigation "Owner/Admin menu" [ref=f1e18]:
      - button "Dashboard" [ref=f1e19] [cursor=pointer]
      - button "Advance Bookings" [ref=f1e24] [cursor=pointer]
      - button "Approvals (0)" [ref=f1e28] [cursor=pointer]
      - button "Data Flow" [ref=f1e33] [cursor=pointer]
      - button "Job Cards" [ref=f1e39] [cursor=pointer]
      - button "Media" [ref=f1e44] [cursor=pointer]
      - button "Purchase Orders" [ref=f1e49] [cursor=pointer]
      - button "Manage" [ref=f1e53] [cursor=pointer]
      - button "Search" [ref=f1e58] [cursor=pointer]
      - button "Admin Console" [ref=f1e63] [cursor=pointer]
      - group [ref=f1e68]:
        - generic "Sales CRM" [ref=f1e69] [cursor=pointer]
    - button "Logout" [ref=f1e70] [cursor=pointer]
  - main [ref=f1e75]:
    - generic [ref=f1e76]:
      - generic [ref=f1e77]:
        - paragraph [ref=f1e78]: Owner/Admin
        - heading "Control room for linked workflow, blockers and cash." [level=1] [ref=f1e79]
      - generic [ref=f1e80]: admin@example.com
    - generic [ref=f1e85]:
      - generic [ref=f1e90]:
        - heading "Management Hub" [level=2] [ref=f1e91]
        - paragraph [ref=f1e92]: Admin master data and workflow controls
      - generic [ref=f1e93]:
        - generic [ref=f1e94]:
          - strong [ref=f1e95]: Large demo dataset
          - generic [ref=f1e96]: 120 customers, 132 vehicles, 144 jobs and 288 offline media records.
        - button "Load Large Demo Dataset" [ref=f1e97] [cursor=pointer]
      - tablist "Management areas" [ref=f1e98]:
        - tab "Users" [ref=f1e99] [cursor=pointer]
        - tab "Customers" [ref=f1e100] [cursor=pointer]
        - tab "Vehicles" [ref=f1e101] [cursor=pointer]
        - tab "Suppliers" [ref=f1e102] [cursor=pointer]
        - tab "Job Cards" [ref=f1e103] [cursor=pointer]
        - tab "Estimates" [active] [selected] [ref=f1e104] [cursor=pointer]
        - tab "Invoices" [ref=f1e105] [cursor=pointer]
        - tab "Payments" [ref=f1e106] [cursor=pointer]
        - tab "Delivery" [ref=f1e107] [cursor=pointer]
      - tabpanel "Estimates" [ref=f1e108]:
        - generic [ref=f1e109]:
          - generic [ref=f1e110]:
            - text: Search
            - searchbox "Job for Estimates search" [ref=f1e111]
          - generic [ref=f1e112]:
            - text: Month-Year
            - combobox "Job for Estimates Month-Year filter" [ref=f1e113]:
              - option "All months" [selected]
              - option "October 2026"
              - option "August 2026"
              - option "July 2026"
              - option "June 2026"
              - option "May 2026"
              - option "April 2026"
              - option "March 2026"
              - option "February 2026"
              - option "January 2026"
          - generic [ref=f1e114]:
            - text: Matching jobs
            - combobox "Job results" [ref=f1e115]:
              - option "Choose a job"
              - option "JC-2026-001392 · OD04DM1003 · Demo Customer 003" [selected]
              - option "JC-2026-002016 · OD17DM1016 · Demo Customer 016"
              - option "JC-2026-002032 · OD03DM1032 · Demo Customer 032"
              - option "JC-2026-002048 · OD19DM1048 · Demo Customer 048"
              - option "JC-2026-002064 · OD05DM1064 · Demo Customer 064"
              - option "JC-2026-002080 · OD21DM1080 · Demo Customer 080"
              - option "JC-2026-002096 · OD07DM1096 · Demo Customer 096"
              - option "JC-2026-002112 · OD23DM1112 · Demo Customer 112"
              - option "JC-2026-002128 · OD09DM1128 · Demo Customer 008"
              - option "JC-2026-002144 · OD13DM1012 · Demo Customer 012"
              - option "JC-2026-002008 · OD09DM1008 · Demo Customer 008"
              - option "JC-2026-002024 · OD25DM1024 · Demo Customer 024"
              - option "JC-2026-002040 · OD11DM1040 · Demo Customer 040"
              - option "JC-2026-002056 · OD27DM1056 · Demo Customer 056"
              - option "JC-2026-002072 · OD13DM1072 · Demo Customer 072"
              - option "JC-2026-002088 · OD29DM1088 · Demo Customer 088"
              - option "JC-2026-002104 · OD15DM1104 · Demo Customer 104"
              - option "JC-2026-002120 · OD01DM1120 · Demo Customer 120"
              - option "JC-2026-002136 · OD05DM1004 · Demo Customer 004"
              - option "JC-2026-002015 · OD16DM1015 · Demo Customer 015"
              - option "JC-2026-002031 · OD02DM1031 · Demo Customer 031"
              - option "JC-2026-002047 · OD18DM1047 · Demo Customer 047"
              - option "JC-2026-002063 · OD04DM1063 · Demo Customer 063"
              - option "JC-2026-002079 · OD20DM1079 · Demo Customer 079"
              - option "JC-2026-002095 · OD06DM1095 · Demo Customer 095"
              - option "JC-2026-002111 · OD22DM1111 · Demo Customer 111"
              - option "JC-2026-002127 · OD08DM1127 · Demo Customer 007"
              - option "JC-2026-002143 · OD12DM1011 · Demo Customer 011"
              - option "JC-2026-002007 · OD08DM1007 · Demo Customer 007"
              - option "JC-2026-002023 · OD24DM1023 · Demo Customer 023"
              - option "JC-2026-002039 · OD10DM1039 · Demo Customer 039"
              - option "JC-2026-002055 · OD26DM1055 · Demo Customer 055"
              - option "JC-2026-002071 · OD12DM1071 · Demo Customer 071"
              - option "JC-2026-002087 · OD28DM1087 · Demo Customer 087"
              - option "JC-2026-002103 · OD14DM1103 · Demo Customer 103"
              - option "JC-2026-002119 · OD30DM1119 · Demo Customer 119"
              - option "JC-2026-002135 · OD04DM1003 · Demo Customer 003"
              - option "JC-2026-002070 · OD11DM1070 · Demo Customer 070"
              - option "JC-2026-002086 · OD27DM1086 · Demo Customer 086"
              - option "JC-2026-002102 · OD13DM1102 · Demo Customer 102"
              - option "JC-2026-002118 · OD29DM1118 · Demo Customer 118"
              - option "JC-2026-002134 · OD03DM1002 · Demo Customer 002"
              - option "JC-2026-002014 · OD15DM1014 · Demo Customer 014"
              - option "JC-2026-002030 · OD01DM1030 · Demo Customer 030"
              - option "JC-2026-002046 · OD17DM1046 · Demo Customer 046"
              - option "JC-2026-002062 · OD03DM1062 · Demo Customer 062"
              - option "JC-2026-002078 · OD19DM1078 · Demo Customer 078"
              - option "JC-2026-002094 · OD05DM1094 · Demo Customer 094"
              - option "JC-2026-002110 · OD21DM1110 · Demo Customer 110"
              - option "JC-2026-002126 · OD07DM1126 · Demo Customer 006"
              - option "JC-2026-002142 · OD11DM1010 · Demo Customer 010"
              - option "JC-2026-002006 · OD07DM1006 · Demo Customer 006"
              - option "JC-2026-002022 · OD23DM1022 · Demo Customer 022"
              - option "JC-2026-002038 · OD09DM1038 · Demo Customer 038"
              - option "JC-2026-002054 · OD25DM1054 · Demo Customer 054"
              - option "JC-2026-002005 · OD06DM1005 · Demo Customer 005"
              - option "JC-2026-002021 · OD22DM1021 · Demo Customer 021"
              - option "JC-2026-002037 · OD08DM1037 · Demo Customer 037"
              - option "JC-2026-002053 · OD24DM1053 · Demo Customer 053"
              - option "JC-2026-002069 · OD10DM1069 · Demo Customer 069"
              - option "JC-2026-002085 · OD26DM1085 · Demo Customer 085"
              - option "JC-2026-002101 · OD12DM1101 · Demo Customer 101"
              - option "JC-2026-002117 · OD28DM1117 · Demo Customer 117"
              - option "JC-2026-002133 · OD02DM1001 · Demo Customer 001"
              - option "JC-2026-002013 · OD14DM1013 · Demo Customer 013"
              - option "JC-2026-002029 · OD30DM1029 · Demo Customer 029"
              - option "JC-2026-002045 · OD16DM1045 · Demo Customer 045"
              - option "JC-2026-002061 · OD02DM1061 · Demo Customer 061"
              - option "JC-2026-002077 · OD18DM1077 · Demo Customer 077"
              - option "JC-2026-002093 · OD04DM1093 · Demo Customer 093"
              - option "JC-2026-002109 · OD20DM1109 · Demo Customer 109"
              - option "JC-2026-002125 · OD06DM1125 · Demo Customer 005"
              - option "JC-2026-002141 · OD10DM1009 · Demo Customer 009"
              - option "JC-2026-002124 · OD05DM1124 · Demo Customer 004"
              - option "JC-2026-002140 · OD09DM1008 · Demo Customer 008"
              - option "JC-2026-002004 · OD05DM1004 · Demo Customer 004"
              - option "JC-2026-002020 · OD21DM1020 · Demo Customer 020"
              - option "JC-2026-002036 · OD07DM1036 · Demo Customer 036"
              - option "JC-2026-002052 · OD23DM1052 · Demo Customer 052"
              - option "JC-2026-002068 · OD09DM1068 · Demo Customer 068"
              - option "JC-2026-002084 · OD25DM1084 · Demo Customer 084"
              - option "JC-2026-002100 · OD11DM1100 · Demo Customer 100"
              - option "JC-2026-002116 · OD27DM1116 · Demo Customer 116"
              - option "JC-2026-002132 · OD13DM1132 · Demo Customer 012"
              - option "JC-2026-002012 · OD13DM1012 · Demo Customer 012"
              - option "JC-2026-002028 · OD29DM1028 · Demo Customer 028"
              - option "JC-2026-002044 · OD15DM1044 · Demo Customer 044"
              - option "JC-2026-002060 · OD01DM1060 · Demo Customer 060"
              - option "JC-2026-002076 · OD17DM1076 · Demo Customer 076"
              - option "JC-2026-002092 · OD03DM1092 · Demo Customer 092"
              - option "JC-2026-002108 · OD19DM1108 · Demo Customer 108"
              - option "JC-2026-002043 · OD14DM1043 · Demo Customer 043"
              - option "JC-2026-002059 · OD30DM1059 · Demo Customer 059"
              - option "JC-2026-002075 · OD16DM1075 · Demo Customer 075"
              - option "JC-2026-002091 · OD02DM1091 · Demo Customer 091"
              - option "JC-2026-002107 · OD18DM1107 · Demo Customer 107"
              - option "JC-2026-002123 · OD04DM1123 · Demo Customer 003"
              - option "JC-2026-002139 · OD08DM1007 · Demo Customer 007"
              - option "JC-2026-002003 · OD04DM1003 · Demo Customer 003"
              - option "JC-2026-002019 · OD20DM1019 · Demo Customer 019"
              - option "JC-2026-002035 · OD06DM1035 · Demo Customer 035"
              - option "JC-2026-002051 · OD22DM1051 · Demo Customer 051"
              - option "JC-2026-002067 · OD08DM1067 · Demo Customer 067"
              - option "JC-2026-002083 · OD24DM1083 · Demo Customer 083"
              - option "JC-2026-002099 · OD10DM1099 · Demo Customer 099"
              - option "JC-2026-002115 · OD26DM1115 · Demo Customer 115"
              - option "JC-2026-002131 · OD12DM1131 · Demo Customer 011"
              - option "JC-2026-002011 · OD12DM1011 · Demo Customer 011"
              - option "JC-2026-002027 · OD28DM1027 · Demo Customer 027"
              - option "JC-2026-002010 · OD11DM1010 · Demo Customer 010"
              - option "JC-2026-002026 · OD27DM1026 · Demo Customer 026"
              - option "JC-2026-002042 · OD13DM1042 · Demo Customer 042"
              - option "JC-2026-002058 · OD29DM1058 · Demo Customer 058"
              - option "JC-2026-002074 · OD15DM1074 · Demo Customer 074"
              - option "JC-2026-002090 · OD01DM1090 · Demo Customer 090"
              - option "JC-2026-002106 · OD17DM1106 · Demo Customer 106"
              - option "JC-2026-002122 · OD03DM1122 · Demo Customer 002"
              - option "JC-2026-002138 · OD07DM1006 · Demo Customer 006"
              - option "JC-2026-002002 · OD03DM1002 · Demo Customer 002"
              - option "JC-2026-002018 · OD19DM1018 · Demo Customer 018"
              - option "JC-2026-002034 · OD05DM1034 · Demo Customer 034"
              - option "JC-2026-002050 · OD21DM1050 · Demo Customer 050"
              - option "JC-2026-002066 · OD07DM1066 · Demo Customer 066"
              - option "JC-2026-002082 · OD23DM1082 · Demo Customer 082"
              - option "JC-2026-002098 · OD09DM1098 · Demo Customer 098"
              - option "JC-2026-002114 · OD25DM1114 · Demo Customer 114"
              - option "JC-2026-002130 · OD11DM1130 · Demo Customer 010"
              - option "JC-2026-002097 · OD08DM1097 · Demo Customer 097"
              - option "JC-2026-002113 · OD24DM1113 · Demo Customer 113"
              - option "JC-2026-002129 · OD10DM1129 · Demo Customer 009"
              - option "JC-2026-002009 · OD10DM1009 · Demo Customer 009"
              - option "JC-2026-002025 · OD26DM1025 · Demo Customer 025"
              - option "JC-2026-002041 · OD12DM1041 · Demo Customer 041"
              - option "JC-2026-002057 · OD28DM1057 · Demo Customer 057"
              - option "JC-2026-002073 · OD14DM1073 · Demo Customer 073"
              - option "JC-2026-002089 · OD30DM1089 · Demo Customer 089"
              - option "JC-2026-002105 · OD16DM1105 · Demo Customer 105"
              - option "JC-2026-002121 · OD02DM1121 · Demo Customer 001"
              - option "JC-2026-002137 · OD06DM1005 · Demo Customer 005"
              - option "JC-2026-002001 · OD02DM1001 · Demo Customer 001"
              - option "JC-2026-002017 · OD18DM1017 · Demo Customer 017"
              - option "JC-2026-002033 · OD04DM1033 · Demo Customer 033"
              - option "JC-2026-002049 · OD20DM1049 · Demo Customer 049"
              - option "JC-2026-002065 · OD06DM1065 · Demo Customer 065"
              - option "JC-2026-002081 · OD22DM1081 · Demo Customer 081"
          - button "Clear filters" [ref=f1e116] [cursor=pointer]
        - tabpanel [ref=f1e117]:
          - heading "Estimates" [level=3] [ref=f1e119]
          - generic [ref=f1e120]:
            - generic [ref=f1e124]:
              - heading "Estimate" [level=2] [ref=f1e125]
              - paragraph [ref=f1e126]: Not created
            - button "Create Estimate" [ref=f1e127] [cursor=pointer]
```

# Test source

```ts
  2067 |   await editor.getByRole("tab", { name: "Materials" }).click();
  2068 |   await expect(editor.getByRole("region", { name: "Job materials" })).toBeVisible();
  2069 |   await editor.getByRole("tab", { name: "Documents" }).click();
  2070 |   await expect(editor.getByRole("region", { name: "Current job documents" })).toBeVisible();
  2071 |   await expect(editor.getByRole("region", { name: "Current job documents" }).getByText("Job Card", { exact: true })).toBeVisible();
  2072 |   await expect(editor.getByText(/remaining:|All steps complete/)).toBeVisible();
  2073 |   await expect(editor.getByRole("button", { name: "Start Rework" })).toBeVisible();
  2074 |   await editor.getByRole("button", { name: "Start Rework" }).click();
  2075 |   const confirmation = page.getByRole("dialog", { name: "Start Rework?" });
  2076 |   const note = confirmation.getByLabel("Confirmation note");
  2077 |   await expect(note).toBeFocused();
  2078 |   await confirmation.getByRole("button", { name: "Confirm status change" }).click();
  2079 |   await expect(confirmation.getByRole("alert")).toHaveText("A confirmation note is required.");
  2080 |   await note.fill("Customer requested cancellation");
  2081 |   await confirmation.getByRole("button", { name: "Go Back", exact: true }).click();
  2082 |   await expect(confirmation).toBeHidden();
  2083 | });
  2084 | 
  2085 | test("lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment", async ({ page }) => {
  2086 |   test.setTimeout(60_000);
  2087 |   await page.setViewportSize({ width: 390, height: 844 });
  2088 |   await loginAs(page, "admin@example.com");
  2089 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2090 |   await page.getByRole("button", { name: "Show filters", exact: true }).click();
  2091 |   await page.getByLabel("Search job cards").fill("JC-2026-001247");
  2092 |   const editCard = page.locator(".record-card").filter({ hasText: "JC-2026-001247" });
  2093 |   const editTrigger = editCard.getByRole("button", { name: "Edit", exact: true });
  2094 |   await editTrigger.click();
  2095 |   const jobDialog = page.getByRole("dialog", { name: /Edit Job/ });
  2096 |   await expect(jobDialog).toBeVisible();
  2097 |   await expect(jobDialog.getByRole("tab", { name: "Details" })).toHaveAttribute("tabindex", "0");
  2098 |   await jobDialog.getByRole("tab", { name: "Details" }).focus();
  2099 |   await page.keyboard.press("ArrowRight");
  2100 |   await page.keyboard.press("ArrowRight");
  2101 |   await page.keyboard.press("ArrowRight");
  2102 |   await expect(jobDialog.getByRole("tab", { name: "Materials" })).toHaveAttribute("aria-selected", "true");
  2103 |   await page.keyboard.press("ArrowRight");
  2104 |   await page.keyboard.press("ArrowRight");
  2105 |   await expect(jobDialog.getByRole("tab", { name: "Photos / Media" })).toHaveAttribute("aria-selected", "true");
  2106 |   await expect(jobDialog.getByRole("tabpanel", { name: "Photos / Media" })).toBeVisible();
  2107 |   const before = jobDialog.getByRole("tab", { name: "Before Work" });
  2108 |   await before.focus();
  2109 |   await page.keyboard.press("ArrowRight");
  2110 |   await expect(jobDialog.getByRole("tab", { name: "After Work" })).toHaveAttribute("aria-selected", "true");
  2111 |   await jobDialog.getByRole("tab", { name: "Details" }).click();
  2112 | 
  2113 |   const lifecycle = jobDialog.getByRole("region", { name: "Job lifecycle" });
  2114 |   const action = lifecycle.getByRole("button", { name: /Cancel Job|Start Work|Complete Work|Start Rework|Close Job|Reopen Job/ }).first();
  2115 |   await action.click();
  2116 |   const confirmation = page.getByRole("dialog", { name: /\?$/ });
  2117 |   await expect(page.getByRole("dialog")).toHaveCount(2);
  2118 |   const note = confirmation.getByLabel("Confirmation note");
  2119 |   await expect(note).toBeFocused();
  2120 |   await page.keyboard.press("Shift+Tab");
  2121 |   await expect(confirmation.getByRole("button", { name: "Go Back" })).toBeFocused();
  2122 |   await page.keyboard.press("Escape");
  2123 |   await expect(confirmation).toBeHidden();
  2124 |   await expect(jobDialog).toBeVisible();
  2125 |   await expect(action).toBeFocused();
  2126 |   expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  2127 |   await expectNoPageOverflow(page);
  2128 |   await page.keyboard.press("Escape");
  2129 |   await expect(jobDialog).toBeHidden();
  2130 |   await expect(editTrigger).toBeFocused();
  2131 | 
  2132 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  2133 |   const managementTabs = page.getByRole("tablist", { name: "Management areas" });
  2134 |   await managementTabs.getByRole("tab", { name: "Users", exact: true }).focus();
  2135 |   await page.keyboard.press("End");
  2136 |   await expect(managementTabs.getByRole("tab", { name: "Delivery", exact: true })).toHaveAttribute("aria-selected", "true");
  2137 |   await page.keyboard.press("Home");
  2138 |   await expect(managementTabs.getByRole("tab", { name: "Users", exact: true })).toHaveAttribute("aria-selected", "true");
  2139 |   await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  2140 |   await page.getByLabel("Job results").selectOption({ index: 1 });
  2141 |   const estimateTrigger = page.getByRole("button", { name: /Edit Estimate|Create Estimate/ });
  2142 |   await estimateTrigger.click();
  2143 |   const estimate = page.getByRole("dialog", { name: /Estimate$/ });
  2144 |   await expect(estimate).toHaveClass(/dialog-document-editor/);
  2145 |   await expect(estimate.getByLabel("Discount")).toBeVisible();
  2146 |   await expect(estimate.getByLabel("Item 1 GST type")).toHaveValue("CGST+SGST");
  2147 |   await expect(estimate.getByLabel("Item 1 GST rate")).toHaveValue("18%");
  2148 |   await expectNoPageOverflow(page);
  2149 |   await page.keyboard.press("Escape");
  2150 |   await expect(estimateTrigger).toBeFocused();
  2151 | 
  2152 |   await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  2153 |   const combobox = page.getByRole("combobox", { name: "Find a job" });
  2154 |   await combobox.focus();
  2155 |   await page.keyboard.press("ArrowDown");
  2156 |   await expect(combobox).toHaveAttribute("aria-activedescendant", /data-flow-job-/);
  2157 |   await page.keyboard.press("Enter");
  2158 |   await expect(page.getByRole("region", { name: "Chronological data flow" })).toBeVisible();
  2159 |   await expectNoPageOverflow(page);
  2160 | });
  2161 | 
  2162 | test("estimate dialog stages item CRUD and persists only on Save", async ({ page }) => {
  2163 |   await loginAs(page, "admin@example.com");
  2164 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  2165 |   await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  2166 |   await page.getByLabel("Job results").selectOption({ index: 1 });
> 2167 |   await page.getByRole("button", { name: "Edit Estimate" }).click();
       |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  2168 |   let dialog = page.getByRole("dialog", { name: "Edit Estimate" });
  2169 |   const savedDescription = await dialog.getByLabel("Item 1 description").inputValue();
  2170 |   await dialog.getByLabel("Item 1 description").fill("Unsaved change");
  2171 |   await dialog.getByRole("button", { name: "Go Back", exact: true }).click();
  2172 |   await page.getByRole("button", { name: "Edit Estimate" }).click();
  2173 |   dialog = page.getByRole("dialog", { name: "Edit Estimate" });
  2174 |   await expect(dialog.getByLabel("Item 1 description")).toHaveValue(savedDescription);
  2175 |   await dialog.getByRole("button", { name: "Add Item" }).click();
  2176 |   await dialog.getByLabel("Item 2 kind").selectOption("Material");
  2177 |   await dialog.getByLabel("Item 2 description").fill("E2E polish");
  2178 |   await dialog.getByLabel("Item 2 quantity").fill("2");
  2179 |   await dialog.getByLabel("Item 2 rate").fill("250");
  2180 |   await dialog.getByLabel("Item 2 GST type").selectOption("IGST");
  2181 |   await dialog.getByLabel("Item 2 GST rate").click();
  2182 |   await dialog.getByRole("option", { name: "12%" }).click();
  2183 |   await dialog.getByLabel("Discount").fill("50");
  2184 |   await dialog.getByLabel("Notes").fill("E2E estimate note");
  2185 |   await dialog.getByRole("button", { name: "Save Estimate" }).click();
  2186 |   await expect(dialog).toBeHidden();
  2187 |   await expect(page.getByText("E2E polish")).toBeVisible();
  2188 |   await expect(page.getByText("E2E estimate note")).toBeVisible();
  2189 | });
  2190 | 
  2191 | test("service advisor Job Card defaults to the current delivery month", async ({ page }) => {
  2192 |   await page.clock.install({ time: new Date("2040-01-15T12:00:00") });
  2193 |   await loginAs(page, "service@example.com");
  2194 |   await page.locator(".role-nav").getByRole("button", { name: "My Queue", exact: true }).click();
  2195 |   const queue = page.locator(".embedded-list");
  2196 |   await expect(queue.locator("tbody tr").first()).toBeVisible();
  2197 | 
  2198 |   await page.locator(".role-nav").getByRole("button", { name: "Job Card", exact: true }).click();
  2199 |   const jobCards = page.locator(".service-advisor-list");
  2200 |   await expect(jobCards.getByRole("heading", { name: "Job Cards", exact: true })).toBeVisible();
  2201 |   await expect(jobCards.getByLabel("Estimated delivery date")).toHaveValue("");
  2202 |   await expect(jobCards.getByLabel("Estimated delivery month-year")).toHaveValue("2040-01");
  2203 |   for (const label of ["Main status", "Workflow status", "Sort results"])
  2204 |     await expect(jobCards.getByLabel(label)).toBeVisible();
  2205 |   await expect(jobCards.getByLabel("Vehicle filter")).toHaveCount(0);
  2206 |   await expect(jobCards.locator("tbody tr")).toHaveCount(0);
  2207 |   await jobCards.getByRole("button", { name: "Clear", exact: true }).click();
  2208 |   await expect(jobCards.getByLabel("Estimated delivery month-year")).toHaveValue("");
  2209 |   await expect(jobCards.locator("tbody tr").first()).toBeVisible();
  2210 |   await expect(jobCards.getByRole("columnheader", { name: "Service Advisor", exact: true })).toBeVisible();
  2211 |   await expect(jobCards.getByRole("columnheader", { name: "Follow-up Status", exact: true })).toHaveCount(0);
  2212 |   const assignedJob = jobCards.locator("tbody tr").first();
  2213 |   await expect(assignedJob.getByRole("button", { name: "View", exact: true })).toBeVisible();
  2214 |   await expect(assignedJob.getByRole("button", { name: "Edit", exact: true })).toBeVisible();
  2215 | });
  2216 | 
  2217 | test("service follow-ups show all assigned jobs and resolve the earlier open contact", async ({ page }) => {
  2218 |   await loginAs(page, "service@example.com");
  2219 |   await page.locator(".role-nav").getByRole("button", { name: "Follow-ups", exact: true }).click();
  2220 | 
  2221 |   const followups = page.locator(".service-advisor-list");
  2222 |   await expect(followups.getByLabel("Follow-ups received date")).toHaveValue("");
  2223 |   await expect(followups).toContainText("JC-2026-001247");
  2224 |   await expect(followups.locator("tbody tr")).toHaveCount(1);
  2225 |   await followups.getByLabel("Search follow-ups").fill("JC-2026-001247");
  2226 |   await expect(followups.locator("tbody tr")).toHaveCount(1);
  2227 |   await followups.getByRole("button", { name: "Clear", exact: true }).click();
  2228 |   await expect(followups.getByLabel("Search follow-ups")).toHaveValue("");
  2229 | 
  2230 |   const row = followups.locator("tbody tr").filter({ hasText: "JC-2026-001247" });
  2231 |   await expect(row.getByRole("button", { name: "Add Follow-up", exact: true })).toBeVisible();
  2232 |   await row.getByRole("button", { name: "Add Follow-up", exact: true }).click();
  2233 |   let dialog = page.getByRole("dialog", { name: "Follow-ups" });
  2234 |   await dialog.getByLabel("Note").fill("Initial unanswered call");
  2235 |   await dialog.getByRole("button", { name: "Save Follow-up", exact: true }).click();
  2236 |   await expect(row.getByRole("status")).toHaveText("Pending (0/1)");
  2237 | 
  2238 |   await row.getByRole("button", { name: "Add Follow-up", exact: true }).click();
  2239 |   dialog = page.getByRole("dialog", { name: "Follow-ups" });
  2240 |   await dialog.getByLabel("Note").fill("Customer confirmed the update");
  2241 |   await dialog.getByRole("checkbox", { name: "Mark this follow-up done" }).click();
  2242 |   await dialog.getByRole("button", { name: "Save Follow-up", exact: true }).click();
  2243 |   await expect(row.getByRole("status")).toHaveText("Done(2)");
  2244 | 
  2245 |   await row.getByRole("button", { name: "Add Follow-up", exact: true }).click();
  2246 |   dialog = page.getByRole("dialog", { name: "Follow-ups" });
  2247 |   await expect(dialog.getByRole("region", { name: "Follow-up history" })).toContainText("Initial unanswered call");
  2248 |   await expect(dialog.getByRole("region", { name: "Follow-up history" })).toContainText("Customer confirmed the update");
  2249 |   await dialog.getByLabel("Note").fill("Follow-up requested after the call");
  2250 |   await dialog.getByRole("button", { name: "Save Follow-up", exact: true }).click();
  2251 |   await expect(row.getByRole("status")).toHaveText("Pending (2/3)");
  2252 | });
  2253 | 
  2254 | test("job card media validates, compresses, edits, archives, stays session-only, and responds on mobile", async ({ page }) => {
  2255 |   const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
  2256 |   await loginAs(page, "admin@example.com");
  2257 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2258 |   await page.locator(".job-card-filter-grid--admin").getByRole("button", { name: "Clear", exact: true }).click();
  2259 |   await page.getByLabel("Search job cards").fill("JC-2026-002141");
  2260 |   await page.locator(".record-card").filter({ hasText: "JC-2026-002141" }).getByRole("button", { name: "Edit", exact: true }).click();
  2261 |   const job = page.getByRole("dialog", { name: /Edit Job/ });
  2262 |   await job.getByRole("tab", { name: "Photos / Media" }).click();
  2263 |   const media = job.getByRole("region", { name: "Job card photos and media" });
  2264 |   await expect(media.getByRole("tab", { name: "All Photos" })).toHaveAttribute("aria-selected", "true");
  2265 |   await expect(media.getByLabel("Upload phase")).toHaveValue("After Work");
  2266 |   await expect(media.getByRole("tab", { name: "Before Work" })).toBeVisible();
  2267 |   await expect(media.getByRole("tab", { name: "After Work" })).toBeVisible();
```