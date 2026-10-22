# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> searchable pickers dismiss outside interactions and still select options
- Location: tests\workshopos.spec.ts:2842:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('dialog', { name: 'Create New Visit' }).getByRole('listbox').getByRole('option', { name: /Rahul Sharma/ })

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e10]:
      - strong [ref=f1e11]: WorkshopOS
      - generic [ref=f1e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f1e13] [cursor=pointer]
    - generic [ref=f1e17]: Reception
    - navigation "Reception menu" [ref=f1e18]:
      - button "Today Queue" [ref=f1e19] [cursor=pointer]
      - button "Advance Bookings" [ref=f1e25] [cursor=pointer]
      - button "Customers" [ref=f1e29] [cursor=pointer]
      - button "Vehicles" [ref=f1e34] [cursor=pointer]
      - button "Search" [ref=f1e40] [cursor=pointer]
    - button "Logout" [ref=f1e45] [cursor=pointer]
  - main [ref=f1e50]:
    - generic [ref=f1e51]:
      - generic [ref=f1e52]:
        - paragraph [ref=f1e53]: Reception
        - heading "Intake desk for visits, customers and new job cards." [level=1] [ref=f1e54]
      - generic [ref=f1e55]: reception@example.com
    - generic [ref=f1e59]:
      - generic [ref=f1e60]:
        - generic [ref=f1e61]:
          - generic [ref=f1e67]:
            - heading "Reception Queue" [level=2] [ref=f1e68]
            - paragraph [ref=f1e69]: 2026-10-20 · all open reception visits
          - button "Create New Visit" [ref=f1e70] [cursor=pointer]
        - generic [ref=f1e72]:
          - generic [ref=f1e73]:
            - strong [ref=f1e74]: "115"
            - text: open visits
          - generic [ref=f1e75]:
            - strong [ref=f1e76]: "0"
            - text: unassigned
        - region "Service advisor availability" [ref=f1e77]:
          - generic [ref=f1e78]:
            - generic [ref=f1e79]:
              - strong [ref=f1e80]: Advisor availability
              - generic [ref=f1e81]: 3 of 3 advisors available today
            - button "All advisors" [ref=f1e83] [cursor=pointer]
          - generic [ref=f1e84]:
            - article [ref=f1e85]:
              - button "Service advisor 1 Present · 36 open" [ref=f1e86] [cursor=pointer]:
                - strong [ref=f1e87]: Service advisor 1
                - generic [ref=f1e88]: Present · 36 open
              - button "Mark Service advisor 1 away" [pressed] [ref=f1e89] [cursor=pointer]: Present
            - article [ref=f1e91]:
              - button "Service advisor AA Present · 40 open" [ref=f1e92] [cursor=pointer]:
                - strong [ref=f1e93]: Service advisor AA
                - generic [ref=f1e94]: Present · 40 open
              - button "Mark Service advisor AA away" [pressed] [ref=f1e95] [cursor=pointer]: Present
            - article [ref=f1e97]:
              - button "Service advisor BB1 Present · 39 open" [ref=f1e98] [cursor=pointer]:
                - strong [ref=f1e99]: Service advisor BB1
                - generic [ref=f1e100]: Present · 39 open
              - button "Mark Service advisor BB1 away" [pressed] [ref=f1e101] [cursor=pointer]: Present
        - generic [ref=f1e103]:
          - generic [ref=f1e104]:
            - generic [ref=f1e105]:
              - text: Search
              - textbox "Search reception queue" [ref=f1e106]:
                - /placeholder: Job, vehicle, customer or requested work
            - generic [ref=f1e107]:
              - text: Status
              - combobox "Reception queue status" [ref=f1e108]:
                - option "All open" [selected]
                - option "New"
                - option "In Progress"
                - option "Completed"
                - option "Unassigned"
            - button "Clear" [disabled] [ref=f1e109]
          - status [ref=f1e110]: 115 of 115 open jobs
          - generic "Reception queue jobs" [ref=f1e111]:
            - button "JC-2026-002081 OD22DM1081 · Demo Customer 081 Service advisor 1 NEW · Gather Requirements Carry-forward 292 days old · 2026-01-01 Ceramic coating" [ref=f1e112] [cursor=pointer]:
              - generic [ref=f1e113]:
                - strong [ref=f1e114]: JC-2026-002081
                - generic [ref=f1e115]: OD22DM1081 · Demo Customer 081
              - generic [ref=f1e116]:
                - generic [ref=f1e117]: Service advisor 1
                - generic [ref=f1e118]: NEW · Gather Requirements
              - generic [ref=f1e119]:
                - strong [ref=f1e120]: Carry-forward
                - generic [ref=f1e121]: 292 days old · 2026-01-01
              - paragraph [ref=f1e122]: Ceramic coating
            - button "JC-2026-002065 OD06DM1065 · Demo Customer 065 Service advisor BB1 NEW · Gather Requirements Carry-forward 291 days old · 2026-01-02 Ceramic coating" [ref=f1e123] [cursor=pointer]:
              - generic [ref=f1e124]:
                - strong [ref=f1e125]: JC-2026-002065
                - generic [ref=f1e126]: OD06DM1065 · Demo Customer 065
              - generic [ref=f1e127]:
                - generic [ref=f1e128]: Service advisor BB1
                - generic [ref=f1e129]: NEW · Gather Requirements
              - generic [ref=f1e130]:
                - strong [ref=f1e131]: Carry-forward
                - generic [ref=f1e132]: 291 days old · 2026-01-02
              - paragraph [ref=f1e133]: Ceramic coating
            - button "JC-2026-002049 OD20DM1049 · Demo Customer 049 Service advisor AA NEW · Gather Requirements Carry-forward 290 days old · 2026-01-03 Ceramic coating" [ref=f1e134] [cursor=pointer]:
              - generic [ref=f1e135]:
                - strong [ref=f1e136]: JC-2026-002049
                - generic [ref=f1e137]: OD20DM1049 · Demo Customer 049
              - generic [ref=f1e138]:
                - generic [ref=f1e139]: Service advisor AA
                - generic [ref=f1e140]: NEW · Gather Requirements
              - generic [ref=f1e141]:
                - strong [ref=f1e142]: Carry-forward
                - generic [ref=f1e143]: 290 days old · 2026-01-03
              - paragraph [ref=f1e144]: Ceramic coating
            - button "JC-2026-002033 OD04DM1033 · Demo Customer 033 Service advisor 1 NEW · Gather Requirements Carry-forward 289 days old · 2026-01-04 Ceramic coating" [ref=f1e145] [cursor=pointer]:
              - generic [ref=f1e146]:
                - strong [ref=f1e147]: JC-2026-002033
                - generic [ref=f1e148]: OD04DM1033 · Demo Customer 033
              - generic [ref=f1e149]:
                - generic [ref=f1e150]: Service advisor 1
                - generic [ref=f1e151]: NEW · Gather Requirements
              - generic [ref=f1e152]:
                - strong [ref=f1e153]: Carry-forward
                - generic [ref=f1e154]: 289 days old · 2026-01-04
              - paragraph [ref=f1e155]: Ceramic coating
            - button "JC-2026-002017 OD18DM1017 · Demo Customer 017 Service advisor BB1 NEW · Gather Requirements Carry-forward 288 days old · 2026-01-05 Ceramic coating" [ref=f1e156] [cursor=pointer]:
              - generic [ref=f1e157]:
                - strong [ref=f1e158]: JC-2026-002017
                - generic [ref=f1e159]: OD18DM1017 · Demo Customer 017
              - generic [ref=f1e160]:
                - generic [ref=f1e161]: Service advisor BB1
                - generic [ref=f1e162]: NEW · Gather Requirements
              - generic [ref=f1e163]:
                - strong [ref=f1e164]: Carry-forward
                - generic [ref=f1e165]: 288 days old · 2026-01-05
              - paragraph [ref=f1e166]: Ceramic coating
            - button "JC-2026-002001 OD02DM1001 · Demo Customer 001 Service advisor AA NEW · Gather Requirements Carry-forward 287 days old · 2026-01-06 Ceramic coating" [ref=f1e167] [cursor=pointer]:
              - generic [ref=f1e168]:
                - strong [ref=f1e169]: JC-2026-002001
                - generic [ref=f1e170]: OD02DM1001 · Demo Customer 001
              - generic [ref=f1e171]:
                - generic [ref=f1e172]: Service advisor AA
                - generic [ref=f1e173]: NEW · Gather Requirements
              - generic [ref=f1e174]:
                - strong [ref=f1e175]: Carry-forward
                - generic [ref=f1e176]: 287 days old · 2026-01-06
              - paragraph [ref=f1e177]: Ceramic coating
            - button "JC-2026-002137 OD06DM1005 · Demo Customer 005 Service advisor BB1 IN PROGRESS · Photos Shared Carry-forward 282 days old · 2026-01-11 Ceramic coating" [ref=f1e178] [cursor=pointer]:
              - generic [ref=f1e179]:
                - strong [ref=f1e180]: JC-2026-002137
                - generic [ref=f1e181]: OD06DM1005 · Demo Customer 005
              - generic [ref=f1e182]:
                - generic [ref=f1e183]: Service advisor BB1
                - generic [ref=f1e184]: IN PROGRESS · Photos Shared
              - generic [ref=f1e185]:
                - strong [ref=f1e186]: Carry-forward
                - generic [ref=f1e187]: 282 days old · 2026-01-11
              - paragraph [ref=f1e188]: Ceramic coating
            - button "JC-2026-002121 OD02DM1121 · Demo Customer 001 Service advisor AA IN PROGRESS · Photos Shared Carry-forward 281 days old · 2026-01-12 Ceramic coating" [ref=f1e189] [cursor=pointer]:
              - generic [ref=f1e190]:
                - strong [ref=f1e191]: JC-2026-002121
                - generic [ref=f1e192]: OD02DM1121 · Demo Customer 001
              - generic [ref=f1e193]:
                - generic [ref=f1e194]: Service advisor AA
                - generic [ref=f1e195]: IN PROGRESS · Photos Shared
              - generic [ref=f1e196]:
                - strong [ref=f1e197]: Carry-forward
                - generic [ref=f1e198]: 281 days old · 2026-01-12
              - paragraph [ref=f1e199]: Ceramic coating
            - button "JC-2026-002105 OD16DM1105 · Demo Customer 105 Service advisor 1 IN PROGRESS · Photos Shared Carry-forward 280 days old · 2026-01-13 Ceramic coating" [ref=f1e200] [cursor=pointer]:
              - generic [ref=f1e201]:
                - strong [ref=f1e202]: JC-2026-002105
                - generic [ref=f1e203]: OD16DM1105 · Demo Customer 105
              - generic [ref=f1e204]:
                - generic [ref=f1e205]: Service advisor 1
                - generic [ref=f1e206]: IN PROGRESS · Photos Shared
              - generic [ref=f1e207]:
                - strong [ref=f1e208]: Carry-forward
                - generic [ref=f1e209]: 280 days old · 2026-01-13
              - paragraph [ref=f1e210]: Ceramic coating
            - button "JC-2026-002089 OD30DM1089 · Demo Customer 089 Service advisor BB1 IN PROGRESS · Photos Shared Carry-forward 279 days old · 2026-01-14 Ceramic coating" [ref=f1e211] [cursor=pointer]:
              - generic [ref=f1e212]:
                - strong [ref=f1e213]: JC-2026-002089
                - generic [ref=f1e214]: OD30DM1089 · Demo Customer 089
              - generic [ref=f1e215]:
                - generic [ref=f1e216]: Service advisor BB1
                - generic [ref=f1e217]: IN PROGRESS · Photos Shared
              - generic [ref=f1e218]:
                - strong [ref=f1e219]: Carry-forward
                - generic [ref=f1e220]: 279 days old · 2026-01-14
              - paragraph [ref=f1e221]: Ceramic coating
            - button "JC-2026-002073 OD14DM1073 · Demo Customer 073 Service advisor AA IN PROGRESS · Photos Shared Carry-forward 278 days old · 2026-01-15 Ceramic coating" [ref=f1e222] [cursor=pointer]:
              - generic [ref=f1e223]:
                - strong [ref=f1e224]: JC-2026-002073
                - generic [ref=f1e225]: OD14DM1073 · Demo Customer 073
              - generic [ref=f1e226]:
                - generic [ref=f1e227]: Service advisor AA
                - generic [ref=f1e228]: IN PROGRESS · Photos Shared
              - generic [ref=f1e229]:
                - strong [ref=f1e230]: Carry-forward
                - generic [ref=f1e231]: 278 days old · 2026-01-15
              - paragraph [ref=f1e232]: Ceramic coating
            - button "JC-2026-002057 OD28DM1057 · Demo Customer 057 Service advisor 1 IN PROGRESS · Photos Shared Carry-forward 277 days old · 2026-01-16 Ceramic coating" [ref=f1e233] [cursor=pointer]:
              - generic [ref=f1e234]:
                - strong [ref=f1e235]: JC-2026-002057
                - generic [ref=f1e236]: OD28DM1057 · Demo Customer 057
              - generic [ref=f1e237]:
                - generic [ref=f1e238]: Service advisor 1
                - generic [ref=f1e239]: IN PROGRESS · Photos Shared
              - generic [ref=f1e240]:
                - strong [ref=f1e241]: Carry-forward
                - generic [ref=f1e242]: 277 days old · 2026-01-16
              - paragraph [ref=f1e243]: Ceramic coating
            - button "JC-2026-002041 OD12DM1041 · Demo Customer 041 Service advisor BB1 IN PROGRESS · Photos Shared Carry-forward 276 days old · 2026-01-17 Ceramic coating" [ref=f1e244] [cursor=pointer]:
              - generic [ref=f1e245]:
                - strong [ref=f1e246]: JC-2026-002041
                - generic [ref=f1e247]: OD12DM1041 · Demo Customer 041
              - generic [ref=f1e248]:
                - generic [ref=f1e249]: Service advisor BB1
                - generic [ref=f1e250]: IN PROGRESS · Photos Shared
              - generic [ref=f1e251]:
                - strong [ref=f1e252]: Carry-forward
                - generic [ref=f1e253]: 276 days old · 2026-01-17
              - paragraph [ref=f1e254]: Ceramic coating
            - button "JC-2026-002025 OD26DM1025 · Demo Customer 025 Service advisor AA IN PROGRESS · Photos Shared Carry-forward 275 days old · 2026-01-18 Ceramic coating" [ref=f1e255] [cursor=pointer]:
              - generic [ref=f1e256]:
                - strong [ref=f1e257]: JC-2026-002025
                - generic [ref=f1e258]: OD26DM1025 · Demo Customer 025
              - generic [ref=f1e259]:
                - generic [ref=f1e260]: Service advisor AA
                - generic [ref=f1e261]: IN PROGRESS · Photos Shared
              - generic [ref=f1e262]:
                - strong [ref=f1e263]: Carry-forward
                - generic [ref=f1e264]: 275 days old · 2026-01-18
              - paragraph [ref=f1e265]: Ceramic coating
            - button "JC-2026-002009 OD10DM1009 · Demo Customer 009 Service advisor 1 IN PROGRESS · Photos Shared Carry-forward 274 days old · 2026-01-19 Ceramic coating" [ref=f1e266] [cursor=pointer]:
              - generic [ref=f1e267]:
                - strong [ref=f1e268]: JC-2026-002009
                - generic [ref=f1e269]: OD10DM1009 · Demo Customer 009
              - generic [ref=f1e270]:
                - generic [ref=f1e271]: Service advisor 1
                - generic [ref=f1e272]: IN PROGRESS · Photos Shared
              - generic [ref=f1e273]:
                - strong [ref=f1e274]: Carry-forward
                - generic [ref=f1e275]: 274 days old · 2026-01-19
              - paragraph [ref=f1e276]: Ceramic coating
            - button "JC-2026-002129 OD10DM1129 · Demo Customer 009 Service advisor 1 NEW · Get Confirmation Carry-forward 268 days old · 2026-01-25 Ceramic coating" [ref=f1e277] [cursor=pointer]:
              - generic [ref=f1e278]:
                - strong [ref=f1e279]: JC-2026-002129
                - generic [ref=f1e280]: OD10DM1129 · Demo Customer 009
              - generic [ref=f1e281]:
                - generic [ref=f1e282]: Service advisor 1
                - generic [ref=f1e283]: NEW · Get Confirmation
              - generic [ref=f1e284]:
                - strong [ref=f1e285]: Carry-forward
                - generic [ref=f1e286]: 268 days old · 2026-01-25
              - paragraph [ref=f1e287]: Ceramic coating
            - button "JC-2026-002113 OD24DM1113 · Demo Customer 113 Service advisor BB1 NEW · Gather Requirements Carry-forward 267 days old · 2026-01-26 Ceramic coating" [ref=f1e288] [cursor=pointer]:
              - generic [ref=f1e289]:
                - strong [ref=f1e290]: JC-2026-002113
                - generic [ref=f1e291]: OD24DM1113 · Demo Customer 113
              - generic [ref=f1e292]:
                - generic [ref=f1e293]: Service advisor BB1
                - generic [ref=f1e294]: NEW · Gather Requirements
              - generic [ref=f1e295]:
                - strong [ref=f1e296]: Carry-forward
                - generic [ref=f1e297]: 267 days old · 2026-01-26
              - paragraph [ref=f1e298]: Ceramic coating
            - button "JC-2026-002097 OD08DM1097 · Demo Customer 097 Service advisor AA NEW · Gather Requirements Carry-forward 266 days old · 2026-01-27 Ceramic coating" [ref=f1e299] [cursor=pointer]:
              - generic [ref=f1e300]:
                - strong [ref=f1e301]: JC-2026-002097
                - generic [ref=f1e302]: OD08DM1097 · Demo Customer 097
              - generic [ref=f1e303]:
                - generic [ref=f1e304]: Service advisor AA
                - generic [ref=f1e305]: NEW · Gather Requirements
              - generic [ref=f1e306]:
                - strong [ref=f1e307]: Carry-forward
                - generic [ref=f1e308]: 266 days old · 2026-01-27
              - paragraph [ref=f1e309]: Ceramic coating
            - button "JC-2026-002130 OD11DM1130 · Demo Customer 010 Service advisor AA NEW · Create Estimate Carry-forward 259 days old · 2026-02-03 Paint correction" [ref=f1e310] [cursor=pointer]:
              - generic [ref=f1e311]:
                - strong [ref=f1e312]: JC-2026-002130
                - generic [ref=f1e313]: OD11DM1130 · Demo Customer 010
              - generic [ref=f1e314]:
                - generic [ref=f1e315]: Service advisor AA
                - generic [ref=f1e316]: NEW · Create Estimate
              - generic [ref=f1e317]:
                - strong [ref=f1e318]: Carry-forward
                - generic [ref=f1e319]: 259 days old · 2026-02-03
              - paragraph [ref=f1e320]: Paint correction
            - button "JC-2026-002114 OD25DM1114 · Demo Customer 114 Service advisor 1 NEW · Create Estimate Carry-forward 258 days old · 2026-02-04 Paint correction" [ref=f1e321] [cursor=pointer]:
              - generic [ref=f1e322]:
                - strong [ref=f1e323]: JC-2026-002114
                - generic [ref=f1e324]: OD25DM1114 · Demo Customer 114
              - generic [ref=f1e325]:
                - generic [ref=f1e326]: Service advisor 1
                - generic [ref=f1e327]: NEW · Create Estimate
              - generic [ref=f1e328]:
                - strong [ref=f1e329]: Carry-forward
                - generic [ref=f1e330]: 258 days old · 2026-02-04
              - paragraph [ref=f1e331]: Paint correction
            - button "JC-2026-002098 OD09DM1098 · Demo Customer 098 Service advisor BB1 NEW · Create Estimate Carry-forward 257 days old · 2026-02-05 Paint correction" [ref=f1e332] [cursor=pointer]:
              - generic [ref=f1e333]:
                - strong [ref=f1e334]: JC-2026-002098
                - generic [ref=f1e335]: OD09DM1098 · Demo Customer 098
              - generic [ref=f1e336]:
                - generic [ref=f1e337]: Service advisor BB1
                - generic [ref=f1e338]: NEW · Create Estimate
              - generic [ref=f1e339]:
                - strong [ref=f1e340]: Carry-forward
                - generic [ref=f1e341]: 257 days old · 2026-02-05
              - paragraph [ref=f1e342]: Paint correction
            - button "JC-2026-002082 OD23DM1082 · Demo Customer 082 Service advisor AA NEW · Create Estimate Carry-forward 256 days old · 2026-02-06 Paint correction" [ref=f1e343] [cursor=pointer]:
              - generic [ref=f1e344]:
                - strong [ref=f1e345]: JC-2026-002082
                - generic [ref=f1e346]: OD23DM1082 · Demo Customer 082
              - generic [ref=f1e347]:
                - generic [ref=f1e348]: Service advisor AA
                - generic [ref=f1e349]: NEW · Create Estimate
              - generic [ref=f1e350]:
                - strong [ref=f1e351]: Carry-forward
                - generic [ref=f1e352]: 256 days old · 2026-02-06
              - paragraph [ref=f1e353]: Paint correction
            - button "JC-2026-002066 OD07DM1066 · Demo Customer 066 Service advisor 1 NEW · Create Estimate Carry-forward 255 days old · 2026-02-07 Paint correction" [ref=f1e354] [cursor=pointer]:
              - generic [ref=f1e355]:
                - strong [ref=f1e356]: JC-2026-002066
                - generic [ref=f1e357]: OD07DM1066 · Demo Customer 066
              - generic [ref=f1e358]:
                - generic [ref=f1e359]: Service advisor 1
                - generic [ref=f1e360]: NEW · Create Estimate
              - generic [ref=f1e361]:
                - strong [ref=f1e362]: Carry-forward
                - generic [ref=f1e363]: 255 days old · 2026-02-07
              - paragraph [ref=f1e364]: Paint correction
            - button "JC-2026-002050 OD21DM1050 · Demo Customer 050 Service advisor BB1 NEW · Create Estimate Carry-forward 254 days old · 2026-02-08 Paint correction" [ref=f1e365] [cursor=pointer]:
              - generic [ref=f1e366]:
                - strong [ref=f1e367]: JC-2026-002050
                - generic [ref=f1e368]: OD21DM1050 · Demo Customer 050
              - generic [ref=f1e369]:
                - generic [ref=f1e370]: Service advisor BB1
                - generic [ref=f1e371]: NEW · Create Estimate
              - generic [ref=f1e372]:
                - strong [ref=f1e373]: Carry-forward
                - generic [ref=f1e374]: 254 days old · 2026-02-08
              - paragraph [ref=f1e375]: Paint correction
            - button "JC-2026-002034 OD05DM1034 · Demo Customer 034 Service advisor AA NEW · Create Estimate Carry-forward 253 days old · 2026-02-09 Paint correction" [ref=f1e376] [cursor=pointer]:
              - generic [ref=f1e377]:
                - strong [ref=f1e378]: JC-2026-002034
                - generic [ref=f1e379]: OD05DM1034 · Demo Customer 034
              - generic [ref=f1e380]:
                - generic [ref=f1e381]: Service advisor AA
                - generic [ref=f1e382]: NEW · Create Estimate
              - generic [ref=f1e383]:
                - strong [ref=f1e384]: Carry-forward
                - generic [ref=f1e385]: 253 days old · 2026-02-09
              - paragraph [ref=f1e386]: Paint correction
            - button "JC-2026-002018 OD19DM1018 · Demo Customer 018 Service advisor 1 NEW · Create Estimate Carry-forward 252 days old · 2026-02-10 Paint correction" [ref=f1e387] [cursor=pointer]:
              - generic [ref=f1e388]:
                - strong [ref=f1e389]: JC-2026-002018
                - generic [ref=f1e390]: OD19DM1018 · Demo Customer 018
              - generic [ref=f1e391]:
                - generic [ref=f1e392]: Service advisor 1
                - generic [ref=f1e393]: NEW · Create Estimate
              - generic [ref=f1e394]:
                - strong [ref=f1e395]: Carry-forward
                - generic [ref=f1e396]: 252 days old · 2026-02-10
              - paragraph [ref=f1e397]: Paint correction
            - button "JC-2026-002002 OD03DM1002 · Demo Customer 002 Service advisor BB1 NEW · Create Estimate Carry-forward 251 days old · 2026-02-11 Paint correction" [ref=f1e398] [cursor=pointer]:
              - generic [ref=f1e399]:
                - strong [ref=f1e400]: JC-2026-002002
                - generic [ref=f1e401]: OD03DM1002 · Demo Customer 002
              - generic [ref=f1e402]:
                - generic [ref=f1e403]: Service advisor BB1
                - generic [ref=f1e404]: NEW · Create Estimate
              - generic [ref=f1e405]:
                - strong [ref=f1e406]: Carry-forward
                - generic [ref=f1e407]: 251 days old · 2026-02-11
              - paragraph [ref=f1e408]: Paint correction
            - button "JC-2026-002138 OD07DM1006 · Demo Customer 006 Service advisor 1 IN PROGRESS · QC Pending Carry-forward 246 days old · 2026-02-16 Paint correction" [ref=f1e409] [cursor=pointer]:
              - generic [ref=f1e410]:
                - strong [ref=f1e411]: JC-2026-002138
                - generic [ref=f1e412]: OD07DM1006 · Demo Customer 006
              - generic [ref=f1e413]:
                - generic [ref=f1e414]: Service advisor 1
                - generic [ref=f1e415]: IN PROGRESS · QC Pending
              - generic [ref=f1e416]:
                - strong [ref=f1e417]: Carry-forward
                - generic [ref=f1e418]: 246 days old · 2026-02-16
              - paragraph [ref=f1e419]: Paint correction
            - button "JC-2026-002122 OD03DM1122 · Demo Customer 002 Service advisor BB1 IN PROGRESS · QC Pending Carry-forward 245 days old · 2026-02-17 Paint correction" [ref=f1e420] [cursor=pointer]:
              - generic [ref=f1e421]:
                - strong [ref=f1e422]: JC-2026-002122
                - generic [ref=f1e423]: OD03DM1122 · Demo Customer 002
              - generic [ref=f1e424]:
                - generic [ref=f1e425]: Service advisor BB1
                - generic [ref=f1e426]: IN PROGRESS · QC Pending
              - generic [ref=f1e427]:
                - strong [ref=f1e428]: Carry-forward
                - generic [ref=f1e429]: 245 days old · 2026-02-17
              - paragraph [ref=f1e430]: Paint correction
            - button "JC-2026-002106 OD17DM1106 · Demo Customer 106 Service advisor AA IN PROGRESS · QC Pending Carry-forward 244 days old · 2026-02-18 Paint correction" [ref=f1e431] [cursor=pointer]:
              - generic [ref=f1e432]:
                - strong [ref=f1e433]: JC-2026-002106
                - generic [ref=f1e434]: OD17DM1106 · Demo Customer 106
              - generic [ref=f1e435]:
                - generic [ref=f1e436]: Service advisor AA
                - generic [ref=f1e437]: IN PROGRESS · QC Pending
              - generic [ref=f1e438]:
                - strong [ref=f1e439]: Carry-forward
                - generic [ref=f1e440]: 244 days old · 2026-02-18
              - paragraph [ref=f1e441]: Paint correction
            - button "JC-2026-002090 OD01DM1090 · Demo Customer 090 Service advisor 1 IN PROGRESS · QC Pending Carry-forward 243 days old · 2026-02-19 Paint correction" [ref=f1e442] [cursor=pointer]:
              - generic [ref=f1e443]:
                - strong [ref=f1e444]: JC-2026-002090
                - generic [ref=f1e445]: OD01DM1090 · Demo Customer 090
              - generic [ref=f1e446]:
                - generic [ref=f1e447]: Service advisor 1
                - generic [ref=f1e448]: IN PROGRESS · QC Pending
              - generic [ref=f1e449]:
                - strong [ref=f1e450]: Carry-forward
                - generic [ref=f1e451]: 243 days old · 2026-02-19
              - paragraph [ref=f1e452]: Paint correction
            - button "JC-2026-002074 OD15DM1074 · Demo Customer 074 Service advisor BB1 IN PROGRESS · QC Pending Carry-forward 242 days old · 2026-02-20 Paint correction" [ref=f1e453] [cursor=pointer]:
              - generic [ref=f1e454]:
                - strong [ref=f1e455]: JC-2026-002074
                - generic [ref=f1e456]: OD15DM1074 · Demo Customer 074
              - generic [ref=f1e457]:
                - generic [ref=f1e458]: Service advisor BB1
                - generic [ref=f1e459]: IN PROGRESS · QC Pending
              - generic [ref=f1e460]:
                - strong [ref=f1e461]: Carry-forward
                - generic [ref=f1e462]: 242 days old · 2026-02-20
              - paragraph [ref=f1e463]: Paint correction
            - button "JC-2026-002058 OD29DM1058 · Demo Customer 058 Service advisor AA IN PROGRESS · QC Pending Carry-forward 241 days old · 2026-02-21 Paint correction" [ref=f1e464] [cursor=pointer]:
              - generic [ref=f1e465]:
                - strong [ref=f1e466]: JC-2026-002058
                - generic [ref=f1e467]: OD29DM1058 · Demo Customer 058
              - generic [ref=f1e468]:
                - generic [ref=f1e469]: Service advisor AA
                - generic [ref=f1e470]: IN PROGRESS · QC Pending
              - generic [ref=f1e471]:
                - strong [ref=f1e472]: Carry-forward
                - generic [ref=f1e473]: 241 days old · 2026-02-21
              - paragraph [ref=f1e474]: Paint correction
            - button "JC-2026-002042 OD13DM1042 · Demo Customer 042 Service advisor 1 IN PROGRESS · QC Pending Carry-forward 240 days old · 2026-02-22 Paint correction" [ref=f1e475] [cursor=pointer]:
              - generic [ref=f1e476]:
                - strong [ref=f1e477]: JC-2026-002042
                - generic [ref=f1e478]: OD13DM1042 · Demo Customer 042
              - generic [ref=f1e479]:
                - generic [ref=f1e480]: Service advisor 1
                - generic [ref=f1e481]: IN PROGRESS · QC Pending
              - generic [ref=f1e482]:
                - strong [ref=f1e483]: Carry-forward
                - generic [ref=f1e484]: 240 days old · 2026-02-22
              - paragraph [ref=f1e485]: Paint correction
            - button "JC-2026-002026 OD27DM1026 · Demo Customer 026 Service advisor BB1 IN PROGRESS · QC Pending Carry-forward 239 days old · 2026-02-23 Paint correction" [ref=f1e486] [cursor=pointer]:
              - generic [ref=f1e487]:
                - strong [ref=f1e488]: JC-2026-002026
                - generic [ref=f1e489]: OD27DM1026 · Demo Customer 026
              - generic [ref=f1e490]:
                - generic [ref=f1e491]: Service advisor BB1
                - generic [ref=f1e492]: IN PROGRESS · QC Pending
              - generic [ref=f1e493]:
                - strong [ref=f1e494]: Carry-forward
                - generic [ref=f1e495]: 239 days old · 2026-02-23
              - paragraph [ref=f1e496]: Paint correction
            - button "JC-2026-002010 OD11DM1010 · Demo Customer 010 Service advisor AA IN PROGRESS · QC Pending Carry-forward 238 days old · 2026-02-24 Paint correction" [ref=f1e497] [cursor=pointer]:
              - generic [ref=f1e498]:
                - strong [ref=f1e499]: JC-2026-002010
                - generic [ref=f1e500]: OD11DM1010 · Demo Customer 010
              - generic [ref=f1e501]:
                - generic [ref=f1e502]: Service advisor AA
                - generic [ref=f1e503]: IN PROGRESS · QC Pending
              - generic [ref=f1e504]:
                - strong [ref=f1e505]: Carry-forward
                - generic [ref=f1e506]: 238 days old · 2026-02-24
              - paragraph [ref=f1e507]: Paint correction
            - button "JC-2026-002027 OD28DM1027 · Demo Customer 027 Service advisor 1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 233 days old · 2026-03-01 Interior detailing" [ref=f1e508] [cursor=pointer]:
              - generic [ref=f1e509]:
                - strong [ref=f1e510]: JC-2026-002027
                - generic [ref=f1e511]: OD28DM1027 · Demo Customer 027
              - generic [ref=f1e512]:
                - generic [ref=f1e513]: Service advisor 1
                - generic [ref=f1e514]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e515]:
                - strong [ref=f1e516]: Carry-forward
                - generic [ref=f1e517]: 233 days old · 2026-03-01
              - paragraph [ref=f1e518]: Interior detailing
            - button "JC-2026-002011 OD12DM1011 · Demo Customer 011 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 232 days old · 2026-03-02 Interior detailing" [ref=f1e519] [cursor=pointer]:
              - generic [ref=f1e520]:
                - strong [ref=f1e521]: JC-2026-002011
                - generic [ref=f1e522]: OD12DM1011 · Demo Customer 011
              - generic [ref=f1e523]:
                - generic [ref=f1e524]: Service advisor BB1
                - generic [ref=f1e525]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e526]:
                - strong [ref=f1e527]: Carry-forward
                - generic [ref=f1e528]: 232 days old · 2026-03-02
              - paragraph [ref=f1e529]: Interior detailing
            - button "JC-2026-002131 OD12DM1131 · Demo Customer 011 Service advisor BB1 NEW · Get Confirmation Carry-forward 226 days old · 2026-03-08 Interior detailing" [ref=f1e530] [cursor=pointer]:
              - generic [ref=f1e531]:
                - strong [ref=f1e532]: JC-2026-002131
                - generic [ref=f1e533]: OD12DM1131 · Demo Customer 011
              - generic [ref=f1e534]:
                - generic [ref=f1e535]: Service advisor BB1
                - generic [ref=f1e536]: NEW · Get Confirmation
              - generic [ref=f1e537]:
                - strong [ref=f1e538]: Carry-forward
                - generic [ref=f1e539]: 226 days old · 2026-03-08
              - paragraph [ref=f1e540]: Interior detailing
            - button "JC-2026-002115 OD26DM1115 · Demo Customer 115 Service advisor AA NEW · Get Confirmation Carry-forward 225 days old · 2026-03-09 Interior detailing" [ref=f1e541] [cursor=pointer]:
              - generic [ref=f1e542]:
                - strong [ref=f1e543]: JC-2026-002115
                - generic [ref=f1e544]: OD26DM1115 · Demo Customer 115
              - generic [ref=f1e545]:
                - generic [ref=f1e546]: Service advisor AA
                - generic [ref=f1e547]: NEW · Get Confirmation
              - generic [ref=f1e548]:
                - strong [ref=f1e549]: Carry-forward
                - generic [ref=f1e550]: 225 days old · 2026-03-09
              - paragraph [ref=f1e551]: Interior detailing
            - button "JC-2026-002099 OD10DM1099 · Demo Customer 099 Service advisor 1 NEW · Get Confirmation Carry-forward 224 days old · 2026-03-10 Interior detailing" [ref=f1e552] [cursor=pointer]:
              - generic [ref=f1e553]:
                - strong [ref=f1e554]: JC-2026-002099
                - generic [ref=f1e555]: OD10DM1099 · Demo Customer 099
              - generic [ref=f1e556]:
                - generic [ref=f1e557]: Service advisor 1
                - generic [ref=f1e558]: NEW · Get Confirmation
              - generic [ref=f1e559]:
                - strong [ref=f1e560]: Carry-forward
                - generic [ref=f1e561]: 224 days old · 2026-03-10
              - paragraph [ref=f1e562]: Interior detailing
            - button "JC-2026-002083 OD24DM1083 · Demo Customer 083 Service advisor BB1 NEW · Get Confirmation Carry-forward 223 days old · 2026-03-11 Interior detailing" [ref=f1e563] [cursor=pointer]:
              - generic [ref=f1e564]:
                - strong [ref=f1e565]: JC-2026-002083
                - generic [ref=f1e566]: OD24DM1083 · Demo Customer 083
              - generic [ref=f1e567]:
                - generic [ref=f1e568]: Service advisor BB1
                - generic [ref=f1e569]: NEW · Get Confirmation
              - generic [ref=f1e570]:
                - strong [ref=f1e571]: Carry-forward
                - generic [ref=f1e572]: 223 days old · 2026-03-11
              - paragraph [ref=f1e573]: Interior detailing
            - button "JC-2026-002067 OD08DM1067 · Demo Customer 067 Service advisor AA NEW · Get Confirmation Carry-forward 222 days old · 2026-03-12 Interior detailing" [ref=f1e574] [cursor=pointer]:
              - generic [ref=f1e575]:
                - strong [ref=f1e576]: JC-2026-002067
                - generic [ref=f1e577]: OD08DM1067 · Demo Customer 067
              - generic [ref=f1e578]:
                - generic [ref=f1e579]: Service advisor AA
                - generic [ref=f1e580]: NEW · Get Confirmation
              - generic [ref=f1e581]:
                - strong [ref=f1e582]: Carry-forward
                - generic [ref=f1e583]: 222 days old · 2026-03-12
              - paragraph [ref=f1e584]: Interior detailing
            - button "JC-2026-002051 OD22DM1051 · Demo Customer 051 Service advisor 1 NEW · Get Confirmation Carry-forward 221 days old · 2026-03-13 Interior detailing" [ref=f1e585] [cursor=pointer]:
              - generic [ref=f1e586]:
                - strong [ref=f1e587]: JC-2026-002051
                - generic [ref=f1e588]: OD22DM1051 · Demo Customer 051
              - generic [ref=f1e589]:
                - generic [ref=f1e590]: Service advisor 1
                - generic [ref=f1e591]: NEW · Get Confirmation
              - generic [ref=f1e592]:
                - strong [ref=f1e593]: Carry-forward
                - generic [ref=f1e594]: 221 days old · 2026-03-13
              - paragraph [ref=f1e595]: Interior detailing
            - button "JC-2026-002035 OD06DM1035 · Demo Customer 035 Service advisor BB1 NEW · Get Confirmation Carry-forward 220 days old · 2026-03-14 Interior detailing" [ref=f1e596] [cursor=pointer]:
              - generic [ref=f1e597]:
                - strong [ref=f1e598]: JC-2026-002035
                - generic [ref=f1e599]: OD06DM1035 · Demo Customer 035
              - generic [ref=f1e600]:
                - generic [ref=f1e601]: Service advisor BB1
                - generic [ref=f1e602]: NEW · Get Confirmation
              - generic [ref=f1e603]:
                - strong [ref=f1e604]: Carry-forward
                - generic [ref=f1e605]: 220 days old · 2026-03-14
              - paragraph [ref=f1e606]: Interior detailing
            - button "JC-2026-002019 OD20DM1019 · Demo Customer 019 Service advisor AA NEW · Get Confirmation Carry-forward 219 days old · 2026-03-15 Interior detailing" [ref=f1e607] [cursor=pointer]:
              - generic [ref=f1e608]:
                - strong [ref=f1e609]: JC-2026-002019
                - generic [ref=f1e610]: OD20DM1019 · Demo Customer 019
              - generic [ref=f1e611]:
                - generic [ref=f1e612]: Service advisor AA
                - generic [ref=f1e613]: NEW · Get Confirmation
              - generic [ref=f1e614]:
                - strong [ref=f1e615]: Carry-forward
                - generic [ref=f1e616]: 219 days old · 2026-03-15
              - paragraph [ref=f1e617]: Interior detailing
            - button "JC-2026-002003 OD04DM1003 · Demo Customer 003 Service advisor 1 NEW · Get Confirmation Carry-forward 218 days old · 2026-03-16 Interior detailing" [ref=f1e618] [cursor=pointer]:
              - generic [ref=f1e619]:
                - strong [ref=f1e620]: JC-2026-002003
                - generic [ref=f1e621]: OD04DM1003 · Demo Customer 003
              - generic [ref=f1e622]:
                - generic [ref=f1e623]: Service advisor 1
                - generic [ref=f1e624]: NEW · Get Confirmation
              - generic [ref=f1e625]:
                - strong [ref=f1e626]: Carry-forward
                - generic [ref=f1e627]: 218 days old · 2026-03-16
              - paragraph [ref=f1e628]: Interior detailing
            - button "JC-2026-002139 OD08DM1007 · Demo Customer 007 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 213 days old · 2026-03-21 Interior detailing" [ref=f1e629] [cursor=pointer]:
              - generic [ref=f1e630]:
                - strong [ref=f1e631]: JC-2026-002139
                - generic [ref=f1e632]: OD08DM1007 · Demo Customer 007
              - generic [ref=f1e633]:
                - generic [ref=f1e634]: Service advisor AA
                - generic [ref=f1e635]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e636]:
                - strong [ref=f1e637]: Carry-forward
                - generic [ref=f1e638]: 213 days old · 2026-03-21
              - paragraph [ref=f1e639]: Interior detailing
            - button "JC-2026-002123 OD04DM1123 · Demo Customer 003 Service advisor 1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 212 days old · 2026-03-22 Interior detailing" [ref=f1e640] [cursor=pointer]:
              - generic [ref=f1e641]:
                - strong [ref=f1e642]: JC-2026-002123
                - generic [ref=f1e643]: OD04DM1123 · Demo Customer 003
              - generic [ref=f1e644]:
                - generic [ref=f1e645]: Service advisor 1
                - generic [ref=f1e646]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e647]:
                - strong [ref=f1e648]: Carry-forward
                - generic [ref=f1e649]: 212 days old · 2026-03-22
              - paragraph [ref=f1e650]: Interior detailing
            - button "JC-2026-002107 OD18DM1107 · Demo Customer 107 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 211 days old · 2026-03-23 Interior detailing" [ref=f1e651] [cursor=pointer]:
              - generic [ref=f1e652]:
                - strong [ref=f1e653]: JC-2026-002107
                - generic [ref=f1e654]: OD18DM1107 · Demo Customer 107
              - generic [ref=f1e655]:
                - generic [ref=f1e656]: Service advisor BB1
                - generic [ref=f1e657]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e658]:
                - strong [ref=f1e659]: Carry-forward
                - generic [ref=f1e660]: 211 days old · 2026-03-23
              - paragraph [ref=f1e661]: Interior detailing
            - button "JC-2026-002091 OD02DM1091 · Demo Customer 091 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 210 days old · 2026-03-24 Interior detailing" [ref=f1e662] [cursor=pointer]:
              - generic [ref=f1e663]:
                - strong [ref=f1e664]: JC-2026-002091
                - generic [ref=f1e665]: OD02DM1091 · Demo Customer 091
              - generic [ref=f1e666]:
                - generic [ref=f1e667]: Service advisor AA
                - generic [ref=f1e668]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e669]:
                - strong [ref=f1e670]: Carry-forward
                - generic [ref=f1e671]: 210 days old · 2026-03-24
              - paragraph [ref=f1e672]: Interior detailing
            - button "JC-2026-002075 OD16DM1075 · Demo Customer 075 Service advisor 1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 209 days old · 2026-03-25 Interior detailing" [ref=f1e673] [cursor=pointer]:
              - generic [ref=f1e674]:
                - strong [ref=f1e675]: JC-2026-002075
                - generic [ref=f1e676]: OD16DM1075 · Demo Customer 075
              - generic [ref=f1e677]:
                - generic [ref=f1e678]: Service advisor 1
                - generic [ref=f1e679]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e680]:
                - strong [ref=f1e681]: Carry-forward
                - generic [ref=f1e682]: 209 days old · 2026-03-25
              - paragraph [ref=f1e683]: Interior detailing
            - button "JC-2026-002059 OD30DM1059 · Demo Customer 059 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 208 days old · 2026-03-26 Interior detailing" [ref=f1e684] [cursor=pointer]:
              - generic [ref=f1e685]:
                - strong [ref=f1e686]: JC-2026-002059
                - generic [ref=f1e687]: OD30DM1059 · Demo Customer 059
              - generic [ref=f1e688]:
                - generic [ref=f1e689]: Service advisor BB1
                - generic [ref=f1e690]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e691]:
                - strong [ref=f1e692]: Carry-forward
                - generic [ref=f1e693]: 208 days old · 2026-03-26
              - paragraph [ref=f1e694]: Interior detailing
            - button "JC-2026-002043 OD14DM1043 · Demo Customer 043 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 207 days old · 2026-03-27 Interior detailing" [ref=f1e695] [cursor=pointer]:
              - generic [ref=f1e696]:
                - strong [ref=f1e697]: JC-2026-002043
                - generic [ref=f1e698]: OD14DM1043 · Demo Customer 043
              - generic [ref=f1e699]:
                - generic [ref=f1e700]: Service advisor AA
                - generic [ref=f1e701]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e702]:
                - strong [ref=f1e703]: Carry-forward
                - generic [ref=f1e704]: 207 days old · 2026-03-27
              - paragraph [ref=f1e705]: Interior detailing
            - button "JC-2026-002092 OD03DM1092 · Demo Customer 092 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 201 days old · 2026-04-02 Full body PPF" [ref=f1e706] [cursor=pointer]:
              - generic [ref=f1e707]:
                - strong [ref=f1e708]: JC-2026-002092
                - generic [ref=f1e709]: OD03DM1092 · Demo Customer 092
              - generic [ref=f1e710]:
                - generic [ref=f1e711]: Service advisor BB1
                - generic [ref=f1e712]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e713]:
                - strong [ref=f1e714]: Carry-forward
                - generic [ref=f1e715]: 201 days old · 2026-04-02
              - paragraph [ref=f1e716]: Full body PPF
            - button "JC-2026-002076 OD17DM1076 · Demo Customer 076 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 200 days old · 2026-04-03 Full body PPF" [ref=f1e717] [cursor=pointer]:
              - generic [ref=f1e718]:
                - strong [ref=f1e719]: JC-2026-002076
                - generic [ref=f1e720]: OD17DM1076 · Demo Customer 076
              - generic [ref=f1e721]:
                - generic [ref=f1e722]: Service advisor AA
                - generic [ref=f1e723]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e724]:
                - strong [ref=f1e725]: Carry-forward
                - generic [ref=f1e726]: 200 days old · 2026-04-03
              - paragraph [ref=f1e727]: Full body PPF
            - button "JC-2026-002044 OD15DM1044 · Demo Customer 044 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 198 days old · 2026-04-05 Full body PPF" [ref=f1e728] [cursor=pointer]:
              - generic [ref=f1e729]:
                - strong [ref=f1e730]: JC-2026-002044
                - generic [ref=f1e731]: OD15DM1044 · Demo Customer 044
              - generic [ref=f1e732]:
                - generic [ref=f1e733]: Service advisor BB1
                - generic [ref=f1e734]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e735]:
                - strong [ref=f1e736]: Carry-forward
                - generic [ref=f1e737]: 198 days old · 2026-04-05
              - paragraph [ref=f1e738]: Full body PPF
            - button "JC-2026-002028 OD29DM1028 · Demo Customer 028 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 197 days old · 2026-04-06 Full body PPF" [ref=f1e739] [cursor=pointer]:
              - generic [ref=f1e740]:
                - strong [ref=f1e741]: JC-2026-002028
                - generic [ref=f1e742]: OD29DM1028 · Demo Customer 028
              - generic [ref=f1e743]:
                - generic [ref=f1e744]: Service advisor AA
                - generic [ref=f1e745]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e746]:
                - strong [ref=f1e747]: Carry-forward
                - generic [ref=f1e748]: 197 days old · 2026-04-06
              - paragraph [ref=f1e749]: Full body PPF
            - button "JC-2026-002132 OD13DM1132 · Demo Customer 012 Service advisor 1 IN PROGRESS · Material Requested Carry-forward 190 days old · 2026-04-13 Full body PPF" [ref=f1e750] [cursor=pointer]:
              - generic [ref=f1e751]:
                - strong [ref=f1e752]: JC-2026-002132
                - generic [ref=f1e753]: OD13DM1132 · Demo Customer 012
              - generic [ref=f1e754]:
                - generic [ref=f1e755]: Service advisor 1
                - generic [ref=f1e756]: IN PROGRESS · Material Requested
              - generic [ref=f1e757]:
                - strong [ref=f1e758]: Carry-forward
                - generic [ref=f1e759]: 190 days old · 2026-04-13
              - paragraph [ref=f1e760]: Full body PPF
            - button "JC-2026-002116 OD27DM1116 · Demo Customer 116 Service advisor BB1 IN PROGRESS · Material Requested Carry-forward 189 days old · 2026-04-14 Full body PPF" [ref=f1e761] [cursor=pointer]:
              - generic [ref=f1e762]:
                - strong [ref=f1e763]: JC-2026-002116
                - generic [ref=f1e764]: OD27DM1116 · Demo Customer 116
              - generic [ref=f1e765]:
                - generic [ref=f1e766]: Service advisor BB1
                - generic [ref=f1e767]: IN PROGRESS · Material Requested
              - generic [ref=f1e768]:
                - strong [ref=f1e769]: Carry-forward
                - generic [ref=f1e770]: 189 days old · 2026-04-14
              - paragraph [ref=f1e771]: Full body PPF
            - button "JC-2026-002100 OD11DM1100 · Demo Customer 100 Service advisor AA IN PROGRESS · Washing Needed Carry-forward 188 days old · 2026-04-15 Full body PPF" [ref=f1e772] [cursor=pointer]:
              - generic [ref=f1e773]:
                - strong [ref=f1e774]: JC-2026-002100
                - generic [ref=f1e775]: OD11DM1100 · Demo Customer 100
              - generic [ref=f1e776]:
                - generic [ref=f1e777]: Service advisor AA
                - generic [ref=f1e778]: IN PROGRESS · Washing Needed
              - generic [ref=f1e779]:
                - strong [ref=f1e780]: Carry-forward
                - generic [ref=f1e781]: 188 days old · 2026-04-15
              - paragraph [ref=f1e782]: Full body PPF
            - button "JC-2026-002084 OD25DM1084 · Demo Customer 084 Service advisor 1 IN PROGRESS · Material Requested Carry-forward 187 days old · 2026-04-16 Full body PPF" [ref=f1e783] [cursor=pointer]:
              - generic [ref=f1e784]:
                - strong [ref=f1e785]: JC-2026-002084
                - generic [ref=f1e786]: OD25DM1084 · Demo Customer 084
              - generic [ref=f1e787]:
                - generic [ref=f1e788]: Service advisor 1
                - generic [ref=f1e789]: IN PROGRESS · Material Requested
              - generic [ref=f1e790]:
                - strong [ref=f1e791]: Carry-forward
                - generic [ref=f1e792]: 187 days old · 2026-04-16
              - paragraph [ref=f1e793]: Full body PPF
            - button "JC-2026-002068 OD09DM1068 · Demo Customer 068 Service advisor BB1 IN PROGRESS · Material Requested Carry-forward 186 days old · 2026-04-17 Full body PPF" [ref=f1e794] [cursor=pointer]:
              - generic [ref=f1e795]:
                - strong [ref=f1e796]: JC-2026-002068
                - generic [ref=f1e797]: OD09DM1068 · Demo Customer 068
              - generic [ref=f1e798]:
                - generic [ref=f1e799]: Service advisor BB1
                - generic [ref=f1e800]: IN PROGRESS · Material Requested
              - generic [ref=f1e801]:
                - strong [ref=f1e802]: Carry-forward
                - generic [ref=f1e803]: 186 days old · 2026-04-17
              - paragraph [ref=f1e804]: Full body PPF
            - button "JC-2026-002052 OD23DM1052 · Demo Customer 052 Service advisor AA IN PROGRESS · Material Requested Carry-forward 185 days old · 2026-04-18 Full body PPF" [ref=f1e805] [cursor=pointer]:
              - generic [ref=f1e806]:
                - strong [ref=f1e807]: JC-2026-002052
                - generic [ref=f1e808]: OD23DM1052 · Demo Customer 052
              - generic [ref=f1e809]:
                - generic [ref=f1e810]: Service advisor AA
                - generic [ref=f1e811]: IN PROGRESS · Material Requested
              - generic [ref=f1e812]:
                - strong [ref=f1e813]: Carry-forward
                - generic [ref=f1e814]: 185 days old · 2026-04-18
              - paragraph [ref=f1e815]: Full body PPF
            - button "JC-2026-002036 OD07DM1036 · Demo Customer 036 Service advisor 1 IN PROGRESS · Material Requested Carry-forward 184 days old · 2026-04-19 Full body PPF" [ref=f1e816] [cursor=pointer]:
              - generic [ref=f1e817]:
                - strong [ref=f1e818]: JC-2026-002036
                - generic [ref=f1e819]: OD07DM1036 · Demo Customer 036
              - generic [ref=f1e820]:
                - generic [ref=f1e821]: Service advisor 1
                - generic [ref=f1e822]: IN PROGRESS · Material Requested
              - generic [ref=f1e823]:
                - strong [ref=f1e824]: Carry-forward
                - generic [ref=f1e825]: 184 days old · 2026-04-19
              - paragraph [ref=f1e826]: Full body PPF
            - button "JC-2026-002020 OD21DM1020 · Demo Customer 020 Service advisor BB1 IN PROGRESS · Material Requested Carry-forward 183 days old · 2026-04-20 Full body PPF" [ref=f1e827] [cursor=pointer]:
              - generic [ref=f1e828]:
                - strong [ref=f1e829]: JC-2026-002020
                - generic [ref=f1e830]: OD21DM1020 · Demo Customer 020
              - generic [ref=f1e831]:
                - generic [ref=f1e832]: Service advisor BB1
                - generic [ref=f1e833]: IN PROGRESS · Material Requested
              - generic [ref=f1e834]:
                - strong [ref=f1e835]: Carry-forward
                - generic [ref=f1e836]: 183 days old · 2026-04-20
              - paragraph [ref=f1e837]: Full body PPF
            - button "JC-2026-002004 OD05DM1004 · Demo Customer 004 Service advisor AA IN PROGRESS · Material Requested Carry-forward 182 days old · 2026-04-21 Full body PPF" [ref=f1e838] [cursor=pointer]:
              - generic [ref=f1e839]:
                - strong [ref=f1e840]: JC-2026-002004
                - generic [ref=f1e841]: OD05DM1004 · Demo Customer 004
              - generic [ref=f1e842]:
                - generic [ref=f1e843]: Service advisor AA
                - generic [ref=f1e844]: IN PROGRESS · Material Requested
              - generic [ref=f1e845]:
                - strong [ref=f1e846]: Carry-forward
                - generic [ref=f1e847]: 182 days old · 2026-04-21
              - paragraph [ref=f1e848]: Full body PPF
            - button "JC-2026-002140 OD09DM1008 · Demo Customer 008 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 177 days old · 2026-04-26 Full body PPF" [ref=f1e849] [cursor=pointer]:
              - generic [ref=f1e850]:
                - strong [ref=f1e851]: JC-2026-002140
                - generic [ref=f1e852]: OD09DM1008 · Demo Customer 008
              - generic [ref=f1e853]:
                - generic [ref=f1e854]: Service advisor BB1
                - generic [ref=f1e855]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e856]:
                - strong [ref=f1e857]: Carry-forward
                - generic [ref=f1e858]: 177 days old · 2026-04-26
              - paragraph [ref=f1e859]: Full body PPF
            - button "JC-2026-002124 OD05DM1124 · Demo Customer 004 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 176 days old · 2026-04-27 Full body PPF" [ref=f1e860] [cursor=pointer]:
              - generic [ref=f1e861]:
                - strong [ref=f1e862]: JC-2026-002124
                - generic [ref=f1e863]: OD05DM1124 · Demo Customer 004
              - generic [ref=f1e864]:
                - generic [ref=f1e865]: Service advisor AA
                - generic [ref=f1e866]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e867]:
                - strong [ref=f1e868]: Carry-forward
                - generic [ref=f1e869]: 176 days old · 2026-04-27
              - paragraph [ref=f1e870]: Full body PPF
            - button "JC-2026-002141 OD10DM1009 · Demo Customer 009 Service advisor 1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 169 days old · 2026-05-04 Ceramic coating" [ref=f1e871] [cursor=pointer]:
              - generic [ref=f1e872]:
                - strong [ref=f1e873]: JC-2026-002141
                - generic [ref=f1e874]: OD10DM1009 · Demo Customer 009
              - generic [ref=f1e875]:
                - generic [ref=f1e876]: Service advisor 1
                - generic [ref=f1e877]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e878]:
                - strong [ref=f1e879]: Carry-forward
                - generic [ref=f1e880]: 169 days old · 2026-05-04
              - paragraph [ref=f1e881]: Ceramic coating
            - button "JC-2026-002125 OD06DM1125 · Demo Customer 005 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 168 days old · 2026-05-05 Ceramic coating" [ref=f1e882] [cursor=pointer]:
              - generic [ref=f1e883]:
                - strong [ref=f1e884]: JC-2026-002125
                - generic [ref=f1e885]: OD06DM1125 · Demo Customer 005
              - generic [ref=f1e886]:
                - generic [ref=f1e887]: Service advisor BB1
                - generic [ref=f1e888]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e889]:
                - strong [ref=f1e890]: Carry-forward
                - generic [ref=f1e891]: 168 days old · 2026-05-05
              - paragraph [ref=f1e892]: Ceramic coating
            - button "JC-2026-002109 OD20DM1109 · Demo Customer 109 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 167 days old · 2026-05-06 Ceramic coating" [ref=f1e893] [cursor=pointer]:
              - generic [ref=f1e894]:
                - strong [ref=f1e895]: JC-2026-002109
                - generic [ref=f1e896]: OD20DM1109 · Demo Customer 109
              - generic [ref=f1e897]:
                - generic [ref=f1e898]: Service advisor AA
                - generic [ref=f1e899]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e900]:
                - strong [ref=f1e901]: Carry-forward
                - generic [ref=f1e902]: 167 days old · 2026-05-06
              - paragraph [ref=f1e903]: Ceramic coating
            - button "JC-2026-002093 OD04DM1093 · Demo Customer 093 Service advisor 1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 166 days old · 2026-05-07 Ceramic coating" [ref=f1e904] [cursor=pointer]:
              - generic [ref=f1e905]:
                - strong [ref=f1e906]: JC-2026-002093
                - generic [ref=f1e907]: OD04DM1093 · Demo Customer 093
              - generic [ref=f1e908]:
                - generic [ref=f1e909]: Service advisor 1
                - generic [ref=f1e910]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e911]:
                - strong [ref=f1e912]: Carry-forward
                - generic [ref=f1e913]: 166 days old · 2026-05-07
              - paragraph [ref=f1e914]: Ceramic coating
            - button "JC-2026-002077 OD18DM1077 · Demo Customer 077 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 165 days old · 2026-05-08 Ceramic coating" [ref=f1e915] [cursor=pointer]:
              - generic [ref=f1e916]:
                - strong [ref=f1e917]: JC-2026-002077
                - generic [ref=f1e918]: OD18DM1077 · Demo Customer 077
              - generic [ref=f1e919]:
                - generic [ref=f1e920]: Service advisor BB1
                - generic [ref=f1e921]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e922]:
                - strong [ref=f1e923]: Carry-forward
                - generic [ref=f1e924]: 165 days old · 2026-05-08
              - paragraph [ref=f1e925]: Ceramic coating
            - button "JC-2026-002061 OD02DM1061 · Demo Customer 061 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 164 days old · 2026-05-09 Ceramic coating" [ref=f1e926] [cursor=pointer]:
              - generic [ref=f1e927]:
                - strong [ref=f1e928]: JC-2026-002061
                - generic [ref=f1e929]: OD02DM1061 · Demo Customer 061
              - generic [ref=f1e930]:
                - generic [ref=f1e931]: Service advisor AA
                - generic [ref=f1e932]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e933]:
                - strong [ref=f1e934]: Carry-forward
                - generic [ref=f1e935]: 164 days old · 2026-05-09
              - paragraph [ref=f1e936]: Ceramic coating
            - button "JC-2026-002045 OD16DM1045 · Demo Customer 045 Service advisor 1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 163 days old · 2026-05-10 Ceramic coating" [ref=f1e937] [cursor=pointer]:
              - generic [ref=f1e938]:
                - strong [ref=f1e939]: JC-2026-002045
                - generic [ref=f1e940]: OD16DM1045 · Demo Customer 045
              - generic [ref=f1e941]:
                - generic [ref=f1e942]: Service advisor 1
                - generic [ref=f1e943]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e944]:
                - strong [ref=f1e945]: Carry-forward
                - generic [ref=f1e946]: 163 days old · 2026-05-10
              - paragraph [ref=f1e947]: Ceramic coating
            - button "JC-2026-002029 OD30DM1029 · Demo Customer 029 Service advisor BB1 COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 162 days old · 2026-05-11 Ceramic coating" [ref=f1e948] [cursor=pointer]:
              - generic [ref=f1e949]:
                - strong [ref=f1e950]: JC-2026-002029
                - generic [ref=f1e951]: OD30DM1029 · Demo Customer 029
              - generic [ref=f1e952]:
                - generic [ref=f1e953]: Service advisor BB1
                - generic [ref=f1e954]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e955]:
                - strong [ref=f1e956]: Carry-forward
                - generic [ref=f1e957]: 162 days old · 2026-05-11
              - paragraph [ref=f1e958]: Ceramic coating
            - button "JC-2026-002013 OD14DM1013 · Demo Customer 013 Service advisor AA COMPLETED · Remind Customer for Sharing Google Review/Feedback Carry-forward 161 days old · 2026-05-12 Ceramic coating" [ref=f1e959] [cursor=pointer]:
              - generic [ref=f1e960]:
                - strong [ref=f1e961]: JC-2026-002013
                - generic [ref=f1e962]: OD14DM1013 · Demo Customer 013
              - generic [ref=f1e963]:
                - generic [ref=f1e964]: Service advisor AA
                - generic [ref=f1e965]: COMPLETED · Remind Customer for Sharing Google Review/Feedback
              - generic [ref=f1e966]:
                - strong [ref=f1e967]: Carry-forward
                - generic [ref=f1e968]: 161 days old · 2026-05-12
              - paragraph [ref=f1e969]: Ceramic coating
            - button "JC-2026-002133 OD02DM1001 · Demo Customer 001 Service advisor AA IN PROGRESS · Material Issued Carry-forward 155 days old · 2026-05-18 Ceramic coating" [ref=f1e970] [cursor=pointer]:
              - generic [ref=f1e971]:
                - strong [ref=f1e972]: JC-2026-002133
                - generic [ref=f1e973]: OD02DM1001 · Demo Customer 001
              - generic [ref=f1e974]:
                - generic [ref=f1e975]: Service advisor AA
                - generic [ref=f1e976]: IN PROGRESS · Material Issued
              - generic [ref=f1e977]:
                - strong [ref=f1e978]: Carry-forward
                - generic [ref=f1e979]: 155 days old · 2026-05-18
              - paragraph [ref=f1e980]: Ceramic coating
            - button "JC-2026-002117 OD28DM1117 · Demo Customer 117 Service advisor 1 IN PROGRESS · Material Issued Carry-forward 154 days old · 2026-05-19 Ceramic coating" [ref=f1e981] [cursor=pointer]:
              - generic [ref=f1e982]:
                - strong [ref=f1e983]: JC-2026-002117
                - generic [ref=f1e984]: OD28DM1117 · Demo Customer 117
              - generic [ref=f1e985]:
                - generic [ref=f1e986]: Service advisor 1
                - generic [ref=f1e987]: IN PROGRESS · Material Issued
              - generic [ref=f1e988]:
                - strong [ref=f1e989]: Carry-forward
                - generic [ref=f1e990]: 154 days old · 2026-05-19
              - paragraph [ref=f1e991]: Ceramic coating
            - button "JC-2026-002101 OD12DM1101 · Demo Customer 101 Service advisor BB1 IN PROGRESS · Material Issued Carry-forward 153 days old · 2026-05-20 Ceramic coating" [ref=f1e992] [cursor=pointer]:
              - generic [ref=f1e993]:
                - strong [ref=f1e994]: JC-2026-002101
                - generic [ref=f1e995]: OD12DM1101 · Demo Customer 101
              - generic [ref=f1e996]:
                - generic [ref=f1e997]: Service advisor BB1
                - generic [ref=f1e998]: IN PROGRESS · Material Issued
              - generic [ref=f1e999]:
                - strong [ref=f1e1000]: Carry-forward
                - generic [ref=f1e1001]: 153 days old · 2026-05-20
              - paragraph [ref=f1e1002]: Ceramic coating
            - button "JC-2026-002085 OD26DM1085 · Demo Customer 085 Service advisor AA IN PROGRESS · Material Issued Carry-forward 152 days old · 2026-05-21 Ceramic coating" [ref=f1e1003] [cursor=pointer]:
              - generic [ref=f1e1004]:
                - strong [ref=f1e1005]: JC-2026-002085
                - generic [ref=f1e1006]: OD26DM1085 · Demo Customer 085
              - generic [ref=f1e1007]:
                - generic [ref=f1e1008]: Service advisor AA
                - generic [ref=f1e1009]: IN PROGRESS · Material Issued
              - generic [ref=f1e1010]:
                - strong [ref=f1e1011]: Carry-forward
                - generic [ref=f1e1012]: 152 days old · 2026-05-21
              - paragraph [ref=f1e1013]: Ceramic coating
            - button "JC-2026-002069 OD10DM1069 · Demo Customer 069 Service advisor 1 IN PROGRESS · Material Issued Carry-forward 151 days old · 2026-05-22 Ceramic coating" [ref=f1e1014] [cursor=pointer]:
              - generic [ref=f1e1015]:
                - strong [ref=f1e1016]: JC-2026-002069
                - generic [ref=f1e1017]: OD10DM1069 · Demo Customer 069
              - generic [ref=f1e1018]:
                - generic [ref=f1e1019]: Service advisor 1
                - generic [ref=f1e1020]: IN PROGRESS · Material Issued
              - generic [ref=f1e1021]:
                - strong [ref=f1e1022]: Carry-forward
                - generic [ref=f1e1023]: 151 days old · 2026-05-22
              - paragraph [ref=f1e1024]: Ceramic coating
            - button "JC-2026-002053 OD24DM1053 · Demo Customer 053 Service advisor BB1 IN PROGRESS · Material Issued Carry-forward 150 days old · 2026-05-23 Ceramic coating" [ref=f1e1025] [cursor=pointer]:
              - generic [ref=f1e1026]:
                - strong [ref=f1e1027]: JC-2026-002053
                - generic [ref=f1e1028]: OD24DM1053 · Demo Customer 053
              - generic [ref=f1e1029]:
                - generic [ref=f1e1030]: Service advisor BB1
                - generic [ref=f1e1031]: IN PROGRESS · Material Issued
              - generic [ref=f1e1032]:
                - strong [ref=f1e1033]: Carry-forward
                - generic [ref=f1e1034]: 150 days old · 2026-05-23
              - paragraph [ref=f1e1035]: Ceramic coating
            - button "JC-2026-002037 OD08DM1037 · Demo Customer 037 Service advisor AA IN PROGRESS · Material Issued Carry-forward 149 days old · 2026-05-24 Ceramic coating" [ref=f1e1036] [cursor=pointer]:
              - generic [ref=f1e1037]:
                - strong [ref=f1e1038]: JC-2026-002037
                - generic [ref=f1e1039]: OD08DM1037 · Demo Customer 037
              - generic [ref=f1e1040]:
                - generic [ref=f1e1041]: Service advisor AA
                - generic [ref=f1e1042]: IN PROGRESS · Material Issued
              - generic [ref=f1e1043]:
                - strong [ref=f1e1044]: Carry-forward
                - generic [ref=f1e1045]: 149 days old · 2026-05-24
              - paragraph [ref=f1e1046]: Ceramic coating
            - button "JC-2026-002021 OD22DM1021 · Demo Customer 021 Service advisor 1 IN PROGRESS · Material Issued Carry-forward 148 days old · 2026-05-25 Ceramic coating" [ref=f1e1047] [cursor=pointer]:
              - generic [ref=f1e1048]:
                - strong [ref=f1e1049]: JC-2026-002021
                - generic [ref=f1e1050]: OD22DM1021 · Demo Customer 021
              - generic [ref=f1e1051]:
                - generic [ref=f1e1052]: Service advisor 1
                - generic [ref=f1e1053]: IN PROGRESS · Material Issued
              - generic [ref=f1e1054]:
                - strong [ref=f1e1055]: Carry-forward
                - generic [ref=f1e1056]: 148 days old · 2026-05-25
              - paragraph [ref=f1e1057]: Ceramic coating
            - button "JC-2026-002005 OD06DM1005 · Demo Customer 005 Service advisor BB1 IN PROGRESS · Material Issued Carry-forward 147 days old · 2026-05-26 Ceramic coating" [ref=f1e1058] [cursor=pointer]:
              - generic [ref=f1e1059]:
                - strong [ref=f1e1060]: JC-2026-002005
                - generic [ref=f1e1061]: OD06DM1005 · Demo Customer 005
              - generic [ref=f1e1062]:
                - generic [ref=f1e1063]: Service advisor BB1
                - generic [ref=f1e1064]: IN PROGRESS · Material Issued
              - generic [ref=f1e1065]:
                - strong [ref=f1e1066]: Carry-forward
                - generic [ref=f1e1067]: 147 days old · 2026-05-26
              - paragraph [ref=f1e1068]: Ceramic coating
            - button "JC-2026-002054 OD25DM1054 · Demo Customer 054 Service advisor 1 IN PROGRESS · Washing Needed Carry-forward 141 days old · 2026-06-01 Paint correction" [ref=f1e1069] [cursor=pointer]:
              - generic [ref=f1e1070]:
                - strong [ref=f1e1071]: JC-2026-002054
                - generic [ref=f1e1072]: OD25DM1054 · Demo Customer 054
              - generic [ref=f1e1073]:
                - generic [ref=f1e1074]: Service advisor 1
                - generic [ref=f1e1075]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1076]:
                - strong [ref=f1e1077]: Carry-forward
                - generic [ref=f1e1078]: 141 days old · 2026-06-01
              - paragraph [ref=f1e1079]: Paint correction
            - button "JC-2026-002038 OD09DM1038 · Demo Customer 038 Service advisor BB1 IN PROGRESS · Washing Needed Carry-forward 140 days old · 2026-06-02 Paint correction" [ref=f1e1080] [cursor=pointer]:
              - generic [ref=f1e1081]:
                - strong [ref=f1e1082]: JC-2026-002038
                - generic [ref=f1e1083]: OD09DM1038 · Demo Customer 038
              - generic [ref=f1e1084]:
                - generic [ref=f1e1085]: Service advisor BB1
                - generic [ref=f1e1086]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1087]:
                - strong [ref=f1e1088]: Carry-forward
                - generic [ref=f1e1089]: 140 days old · 2026-06-02
              - paragraph [ref=f1e1090]: Paint correction
            - button "JC-2026-002022 OD23DM1022 · Demo Customer 022 Service advisor AA IN PROGRESS · Washing Needed Carry-forward 139 days old · 2026-06-03 Paint correction" [ref=f1e1091] [cursor=pointer]:
              - generic [ref=f1e1092]:
                - strong [ref=f1e1093]: JC-2026-002022
                - generic [ref=f1e1094]: OD23DM1022 · Demo Customer 022
              - generic [ref=f1e1095]:
                - generic [ref=f1e1096]: Service advisor AA
                - generic [ref=f1e1097]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1098]:
                - strong [ref=f1e1099]: Carry-forward
                - generic [ref=f1e1100]: 139 days old · 2026-06-03
              - paragraph [ref=f1e1101]: Paint correction
            - button "JC-2026-002006 OD07DM1006 · Demo Customer 006 Service advisor 1 IN PROGRESS · Washing Needed Carry-forward 138 days old · 2026-06-04 Paint correction" [ref=f1e1102] [cursor=pointer]:
              - generic [ref=f1e1103]:
                - strong [ref=f1e1104]: JC-2026-002006
                - generic [ref=f1e1105]: OD07DM1006 · Demo Customer 006
              - generic [ref=f1e1106]:
                - generic [ref=f1e1107]: Service advisor 1
                - generic [ref=f1e1108]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1109]:
                - strong [ref=f1e1110]: Carry-forward
                - generic [ref=f1e1111]: 138 days old · 2026-06-04
              - paragraph [ref=f1e1112]: Paint correction
            - button "JC-2026-002134 OD03DM1002 · Demo Customer 002 Service advisor BB1 IN PROGRESS · Washing Needed Carry-forward 119 days old · 2026-06-23 Paint correction" [ref=f1e1113] [cursor=pointer]:
              - generic [ref=f1e1114]:
                - strong [ref=f1e1115]: JC-2026-002134
                - generic [ref=f1e1116]: OD03DM1002 · Demo Customer 002
              - generic [ref=f1e1117]:
                - generic [ref=f1e1118]: Service advisor BB1
                - generic [ref=f1e1119]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1120]:
                - strong [ref=f1e1121]: Carry-forward
                - generic [ref=f1e1122]: 119 days old · 2026-06-23
              - paragraph [ref=f1e1123]: Paint correction
            - button "JC-2026-002118 OD29DM1118 · Demo Customer 118 Service advisor AA IN PROGRESS · Washing Needed Carry-forward 118 days old · 2026-06-24 Paint correction" [ref=f1e1124] [cursor=pointer]:
              - generic [ref=f1e1125]:
                - strong [ref=f1e1126]: JC-2026-002118
                - generic [ref=f1e1127]: OD29DM1118 · Demo Customer 118
              - generic [ref=f1e1128]:
                - generic [ref=f1e1129]: Service advisor AA
                - generic [ref=f1e1130]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1131]:
                - strong [ref=f1e1132]: Carry-forward
                - generic [ref=f1e1133]: 118 days old · 2026-06-24
              - paragraph [ref=f1e1134]: Paint correction
            - button "JC-2026-002102 OD13DM1102 · Demo Customer 102 Service advisor 1 IN PROGRESS · Washing Needed Carry-forward 117 days old · 2026-06-25 Paint correction" [ref=f1e1135] [cursor=pointer]:
              - generic [ref=f1e1136]:
                - strong [ref=f1e1137]: JC-2026-002102
                - generic [ref=f1e1138]: OD13DM1102 · Demo Customer 102
              - generic [ref=f1e1139]:
                - generic [ref=f1e1140]: Service advisor 1
                - generic [ref=f1e1141]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1142]:
                - strong [ref=f1e1143]: Carry-forward
                - generic [ref=f1e1144]: 117 days old · 2026-06-25
              - paragraph [ref=f1e1145]: Paint correction
            - button "JC-2026-002086 OD27DM1086 · Demo Customer 086 Service advisor BB1 IN PROGRESS · Washing Needed Carry-forward 116 days old · 2026-06-26 Paint correction" [ref=f1e1146] [cursor=pointer]:
              - generic [ref=f1e1147]:
                - strong [ref=f1e1148]: JC-2026-002086
                - generic [ref=f1e1149]: OD27DM1086 · Demo Customer 086
              - generic [ref=f1e1150]:
                - generic [ref=f1e1151]: Service advisor BB1
                - generic [ref=f1e1152]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1153]:
                - strong [ref=f1e1154]: Carry-forward
                - generic [ref=f1e1155]: 116 days old · 2026-06-26
              - paragraph [ref=f1e1156]: Paint correction
            - button "JC-2026-002070 OD11DM1070 · Demo Customer 070 Service advisor AA IN PROGRESS · Washing Needed Carry-forward 115 days old · 2026-06-27 Paint correction" [ref=f1e1157] [cursor=pointer]:
              - generic [ref=f1e1158]:
                - strong [ref=f1e1159]: JC-2026-002070
                - generic [ref=f1e1160]: OD11DM1070 · Demo Customer 070
              - generic [ref=f1e1161]:
                - generic [ref=f1e1162]: Service advisor AA
                - generic [ref=f1e1163]: IN PROGRESS · Washing Needed
              - generic [ref=f1e1164]:
                - strong [ref=f1e1165]: Carry-forward
                - generic [ref=f1e1166]: 115 days old · 2026-06-27
              - paragraph [ref=f1e1167]: Paint correction
            - button "JC-2026-002135 OD04DM1003 · Demo Customer 003 Service advisor 1 IN PROGRESS · Work Started Carry-forward 111 days old · 2026-07-01 Interior detailing" [ref=f1e1168] [cursor=pointer]:
              - generic [ref=f1e1169]:
                - strong [ref=f1e1170]: JC-2026-002135
                - generic [ref=f1e1171]: OD04DM1003 · Demo Customer 003
              - generic [ref=f1e1172]:
                - generic [ref=f1e1173]: Service advisor 1
                - generic [ref=f1e1174]: IN PROGRESS · Work Started
              - generic [ref=f1e1175]:
                - strong [ref=f1e1176]: Carry-forward
                - generic [ref=f1e1177]: 111 days old · 2026-07-01
              - paragraph [ref=f1e1178]: Interior detailing
            - button "JC-2026-002119 OD30DM1119 · Demo Customer 119 Service advisor BB1 IN PROGRESS · Work Started Carry-forward 110 days old · 2026-07-02 Interior detailing" [ref=f1e1179] [cursor=pointer]:
              - generic [ref=f1e1180]:
                - strong [ref=f1e1181]: JC-2026-002119
                - generic [ref=f1e1182]: OD30DM1119 · Demo Customer 119
              - generic [ref=f1e1183]:
                - generic [ref=f1e1184]: Service advisor BB1
                - generic [ref=f1e1185]: IN PROGRESS · Work Started
              - generic [ref=f1e1186]:
                - strong [ref=f1e1187]: Carry-forward
                - generic [ref=f1e1188]: 110 days old · 2026-07-02
              - paragraph [ref=f1e1189]: Interior detailing
            - button "JC-2026-002103 OD14DM1103 · Demo Customer 103 Service advisor AA IN PROGRESS · Work Started Carry-forward 109 days old · 2026-07-03 Interior detailing" [ref=f1e1190] [cursor=pointer]:
              - generic [ref=f1e1191]:
                - strong [ref=f1e1192]: JC-2026-002103
                - generic [ref=f1e1193]: OD14DM1103 · Demo Customer 103
              - generic [ref=f1e1194]:
                - generic [ref=f1e1195]: Service advisor AA
                - generic [ref=f1e1196]: IN PROGRESS · Work Started
              - generic [ref=f1e1197]:
                - strong [ref=f1e1198]: Carry-forward
                - generic [ref=f1e1199]: 109 days old · 2026-07-03
              - paragraph [ref=f1e1200]: Interior detailing
            - button "JC-2026-002087 OD28DM1087 · Demo Customer 087 Service advisor 1 IN PROGRESS · Work Started Carry-forward 108 days old · 2026-07-04 Interior detailing" [ref=f1e1201] [cursor=pointer]:
              - generic [ref=f1e1202]:
                - strong [ref=f1e1203]: JC-2026-002087
                - generic [ref=f1e1204]: OD28DM1087 · Demo Customer 087
              - generic [ref=f1e1205]:
                - generic [ref=f1e1206]: Service advisor 1
                - generic [ref=f1e1207]: IN PROGRESS · Work Started
              - generic [ref=f1e1208]:
                - strong [ref=f1e1209]: Carry-forward
                - generic [ref=f1e1210]: 108 days old · 2026-07-04
              - paragraph [ref=f1e1211]: Interior detailing
            - button "JC-2026-002071 OD12DM1071 · Demo Customer 071 Service advisor BB1 IN PROGRESS · Work Started Carry-forward 107 days old · 2026-07-05 Interior detailing" [ref=f1e1212] [cursor=pointer]:
              - generic [ref=f1e1213]:
                - strong [ref=f1e1214]: JC-2026-002071
                - generic [ref=f1e1215]: OD12DM1071 · Demo Customer 071
              - generic [ref=f1e1216]:
                - generic [ref=f1e1217]: Service advisor BB1
                - generic [ref=f1e1218]: IN PROGRESS · Work Started
              - generic [ref=f1e1219]:
                - strong [ref=f1e1220]: Carry-forward
                - generic [ref=f1e1221]: 107 days old · 2026-07-05
              - paragraph [ref=f1e1222]: Interior detailing
            - button "JC-2026-002055 OD26DM1055 · Demo Customer 055 Service advisor AA IN PROGRESS · Work Started Carry-forward 106 days old · 2026-07-06 Interior detailing" [ref=f1e1223] [cursor=pointer]:
              - generic [ref=f1e1224]:
                - strong [ref=f1e1225]: JC-2026-002055
                - generic [ref=f1e1226]: OD26DM1055 · Demo Customer 055
              - generic [ref=f1e1227]:
                - generic [ref=f1e1228]: Service advisor AA
                - generic [ref=f1e1229]: IN PROGRESS · Work Started
              - generic [ref=f1e1230]:
                - strong [ref=f1e1231]: Carry-forward
                - generic [ref=f1e1232]: 106 days old · 2026-07-06
              - paragraph [ref=f1e1233]: Interior detailing
            - button "JC-2026-002039 OD10DM1039 · Demo Customer 039 Service advisor 1 IN PROGRESS · Work Started Carry-forward 105 days old · 2026-07-07 Interior detailing" [ref=f1e1234] [cursor=pointer]:
              - generic [ref=f1e1235]:
                - strong [ref=f1e1236]: JC-2026-002039
                - generic [ref=f1e1237]: OD10DM1039 · Demo Customer 039
              - generic [ref=f1e1238]:
                - generic [ref=f1e1239]: Service advisor 1
                - generic [ref=f1e1240]: IN PROGRESS · Work Started
              - generic [ref=f1e1241]:
                - strong [ref=f1e1242]: Carry-forward
                - generic [ref=f1e1243]: 105 days old · 2026-07-07
              - paragraph [ref=f1e1244]: Interior detailing
            - button "JC-2026-002023 OD24DM1023 · Demo Customer 023 Service advisor BB1 IN PROGRESS · Work Started Carry-forward 104 days old · 2026-07-08 Interior detailing" [ref=f1e1245] [cursor=pointer]:
              - generic [ref=f1e1246]:
                - strong [ref=f1e1247]: JC-2026-002023
                - generic [ref=f1e1248]: OD24DM1023 · Demo Customer 023
              - generic [ref=f1e1249]:
                - generic [ref=f1e1250]: Service advisor BB1
                - generic [ref=f1e1251]: IN PROGRESS · Work Started
              - generic [ref=f1e1252]:
                - strong [ref=f1e1253]: Carry-forward
                - generic [ref=f1e1254]: 104 days old · 2026-07-08
              - paragraph [ref=f1e1255]: Interior detailing
            - button "JC-2026-002007 OD08DM1007 · Demo Customer 007 Service advisor AA IN PROGRESS · Work Started Carry-forward 103 days old · 2026-07-09 Interior detailing" [ref=f1e1256] [cursor=pointer]:
              - generic [ref=f1e1257]:
                - strong [ref=f1e1258]: JC-2026-002007
                - generic [ref=f1e1259]: OD08DM1007 · Demo Customer 007
              - generic [ref=f1e1260]:
                - generic [ref=f1e1261]: Service advisor AA
                - generic [ref=f1e1262]: IN PROGRESS · Work Started
              - generic [ref=f1e1263]:
                - strong [ref=f1e1264]: Carry-forward
                - generic [ref=f1e1265]: 103 days old · 2026-07-09
              - paragraph [ref=f1e1266]: Interior detailing
            - button "JC-2026-002136 OD05DM1004 · Demo Customer 004 Service advisor AA IN PROGRESS · Follow-up Needed Carry-forward 75 days old · 2026-08-06 Full body PPF" [ref=f1e1267] [cursor=pointer]:
              - generic [ref=f1e1268]:
                - strong [ref=f1e1269]: JC-2026-002136
                - generic [ref=f1e1270]: OD05DM1004 · Demo Customer 004
              - generic [ref=f1e1271]:
                - generic [ref=f1e1272]: Service advisor AA
                - generic [ref=f1e1273]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1274]:
                - strong [ref=f1e1275]: Carry-forward
                - generic [ref=f1e1276]: 75 days old · 2026-08-06
              - paragraph [ref=f1e1277]: Full body PPF
            - button "JC-2026-002120 OD01DM1120 · Demo Customer 120 Service advisor 1 IN PROGRESS · Follow-up Needed Carry-forward 74 days old · 2026-08-07 Full body PPF" [ref=f1e1278] [cursor=pointer]:
              - generic [ref=f1e1279]:
                - strong [ref=f1e1280]: JC-2026-002120
                - generic [ref=f1e1281]: OD01DM1120 · Demo Customer 120
              - generic [ref=f1e1282]:
                - generic [ref=f1e1283]: Service advisor 1
                - generic [ref=f1e1284]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1285]:
                - strong [ref=f1e1286]: Carry-forward
                - generic [ref=f1e1287]: 74 days old · 2026-08-07
              - paragraph [ref=f1e1288]: Full body PPF
            - button "JC-2026-002104 OD15DM1104 · Demo Customer 104 Service advisor BB1 IN PROGRESS · Follow-up Needed Carry-forward 73 days old · 2026-08-08 Full body PPF" [ref=f1e1289] [cursor=pointer]:
              - generic [ref=f1e1290]:
                - strong [ref=f1e1291]: JC-2026-002104
                - generic [ref=f1e1292]: OD15DM1104 · Demo Customer 104
              - generic [ref=f1e1293]:
                - generic [ref=f1e1294]: Service advisor BB1
                - generic [ref=f1e1295]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1296]:
                - strong [ref=f1e1297]: Carry-forward
                - generic [ref=f1e1298]: 73 days old · 2026-08-08
              - paragraph [ref=f1e1299]: Full body PPF
            - button "JC-2026-002088 OD29DM1088 · Demo Customer 088 Service advisor AA IN PROGRESS · Follow-up Needed Carry-forward 72 days old · 2026-08-09 Full body PPF" [ref=f1e1300] [cursor=pointer]:
              - generic [ref=f1e1301]:
                - strong [ref=f1e1302]: JC-2026-002088
                - generic [ref=f1e1303]: OD29DM1088 · Demo Customer 088
              - generic [ref=f1e1304]:
                - generic [ref=f1e1305]: Service advisor AA
                - generic [ref=f1e1306]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1307]:
                - strong [ref=f1e1308]: Carry-forward
                - generic [ref=f1e1309]: 72 days old · 2026-08-09
              - paragraph [ref=f1e1310]: Full body PPF
            - button "JC-2026-002072 OD13DM1072 · Demo Customer 072 Service advisor 1 IN PROGRESS · Follow-up Needed Carry-forward 71 days old · 2026-08-10 Full body PPF" [ref=f1e1311] [cursor=pointer]:
              - generic [ref=f1e1312]:
                - strong [ref=f1e1313]: JC-2026-002072
                - generic [ref=f1e1314]: OD13DM1072 · Demo Customer 072
              - generic [ref=f1e1315]:
                - generic [ref=f1e1316]: Service advisor 1
                - generic [ref=f1e1317]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1318]:
                - strong [ref=f1e1319]: Carry-forward
                - generic [ref=f1e1320]: 71 days old · 2026-08-10
              - paragraph [ref=f1e1321]: Full body PPF
            - button "JC-2026-002056 OD27DM1056 · Demo Customer 056 Service advisor BB1 IN PROGRESS · Follow-up Needed Carry-forward 70 days old · 2026-08-11 Full body PPF" [ref=f1e1322] [cursor=pointer]:
              - generic [ref=f1e1323]:
                - strong [ref=f1e1324]: JC-2026-002056
                - generic [ref=f1e1325]: OD27DM1056 · Demo Customer 056
              - generic [ref=f1e1326]:
                - generic [ref=f1e1327]: Service advisor BB1
                - generic [ref=f1e1328]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1329]:
                - strong [ref=f1e1330]: Carry-forward
                - generic [ref=f1e1331]: 70 days old · 2026-08-11
              - paragraph [ref=f1e1332]: Full body PPF
            - button "JC-2026-002040 OD11DM1040 · Demo Customer 040 Service advisor AA IN PROGRESS · Follow-up Needed Carry-forward 69 days old · 2026-08-12 Full body PPF" [ref=f1e1333] [cursor=pointer]:
              - generic [ref=f1e1334]:
                - strong [ref=f1e1335]: JC-2026-002040
                - generic [ref=f1e1336]: OD11DM1040 · Demo Customer 040
              - generic [ref=f1e1337]:
                - generic [ref=f1e1338]: Service advisor AA
                - generic [ref=f1e1339]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1340]:
                - strong [ref=f1e1341]: Carry-forward
                - generic [ref=f1e1342]: 69 days old · 2026-08-12
              - paragraph [ref=f1e1343]: Full body PPF
            - button "JC-2026-002024 OD25DM1024 · Demo Customer 024 Service advisor 1 IN PROGRESS · Follow-up Needed Carry-forward 68 days old · 2026-08-13 Full body PPF" [ref=f1e1344] [cursor=pointer]:
              - generic [ref=f1e1345]:
                - strong [ref=f1e1346]: JC-2026-002024
                - generic [ref=f1e1347]: OD25DM1024 · Demo Customer 024
              - generic [ref=f1e1348]:
                - generic [ref=f1e1349]: Service advisor 1
                - generic [ref=f1e1350]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1351]:
                - strong [ref=f1e1352]: Carry-forward
                - generic [ref=f1e1353]: 68 days old · 2026-08-13
              - paragraph [ref=f1e1354]: Full body PPF
            - button "JC-2026-002008 OD09DM1008 · Demo Customer 008 Service advisor BB1 IN PROGRESS · Follow-up Needed Carry-forward 67 days old · 2026-08-14 Full body PPF" [ref=f1e1355] [cursor=pointer]:
              - generic [ref=f1e1356]:
                - strong [ref=f1e1357]: JC-2026-002008
                - generic [ref=f1e1358]: OD09DM1008 · Demo Customer 008
              - generic [ref=f1e1359]:
                - generic [ref=f1e1360]: Service advisor BB1
                - generic [ref=f1e1361]: IN PROGRESS · Follow-up Needed
              - generic [ref=f1e1362]:
                - strong [ref=f1e1363]: Carry-forward
                - generic [ref=f1e1364]: 67 days old · 2026-08-14
              - paragraph [ref=f1e1365]: Full body PPF
            - button "JC-2026-001392 OD04DM1003 · Demo Customer 003 Service advisor AA NEW · Create Estimate Carry-forward 18 days old · 2026-10-02 yy" [ref=f1e1366] [cursor=pointer]:
              - generic [ref=f1e1367]:
                - strong [ref=f1e1368]: JC-2026-001392
                - generic [ref=f1e1369]: OD04DM1003 · Demo Customer 003
              - generic [ref=f1e1370]:
                - generic [ref=f1e1371]: Service advisor AA
                - generic [ref=f1e1372]: NEW · Create Estimate
              - generic [ref=f1e1373]:
                - strong [ref=f1e1374]: Carry-forward
                - generic [ref=f1e1375]: 18 days old · 2026-10-02
              - paragraph [ref=f1e1376]: yy
      - generic [ref=f1e1377]:
        - generic [ref=f1e1382]:
          - heading "Job Detail" [level=2] [ref=f1e1383]
          - paragraph [ref=f1e1384]: JC-2026-001392
        - generic [ref=f1e1385]:
          - generic [ref=f1e1386]:
            - generic [ref=f1e1387]: Customer
            - strong [ref=f1e1388]: Demo Customer 003 / 8100000003
          - generic [ref=f1e1389]:
            - generic [ref=f1e1390]: Vehicle
            - strong [ref=f1e1391]: OD04DM1003 / Tata Nexon
          - generic [ref=f1e1392]:
            - generic [ref=f1e1393]: Job Card
            - strong [ref=f1e1394]: JC-2026-001392
          - generic [ref=f1e1395]:
            - generic [ref=f1e1396]: Status
            - strong [ref=f1e1397]: NEW / Create Estimate
        - generic [ref=f1e1399]:
          - generic [ref=f1e1400]:
            - text: Advisor
            - combobox "Advisor" [ref=f1e1401]:
              - option "Service advisor 1 (Present)"
              - option "Service advisor AA (Present)" [selected]
              - option "Service advisor BB1 (Present)"
          - button "Update Advisor" [disabled] [ref=f1e1402]
        - button "Archive Visit/Job" [ref=f1e1404] [cursor=pointer]
      - dialog [ref=f1e1406]:
        - generic [ref=f1e1408]:
          - heading "Create New Visit" [level=2] [ref=f1e1409]
          - paragraph [ref=f1e1410]: Link an existing customer and vehicle, or enter new details
        - generic [ref=f1e1412]:
          - tablist "Create visit sections" [ref=f1e1413]:
            - tab "Details" [selected] [ref=f1e1414] [cursor=pointer]
            - tab "Body Mark" [ref=f1e1415] [cursor=pointer]
          - tabpanel "Details" [ref=f1e1416]:
            - generic [ref=f1e1417]:
              - generic [ref=f1e1418]:
                - generic [ref=f1e1419]:
                  - generic [ref=f1e1420]: Existing customer
                  - combobox "Existing customer" [active] [ref=f1e1421]: Clear customer and vehicle
                - button "Add New Customer" [ref=f1e1422] [cursor=pointer]
              - generic [ref=f1e1423]:
                - generic [ref=f1e1424]:
                  - generic [ref=f1e1425]: Existing vehicle
                  - combobox "Existing vehicle" [ref=f1e1426]: Clear vehicle
                - button "Add New Vehicle" [disabled] [ref=f1e1427]
              - generic [ref=f1e1428]:
                - text: Customer Name
                - textbox "Customer Name" [ref=f1e1429]
              - generic [ref=f1e1430]:
                - text: Mobile
                - textbox "Mobile" [ref=f1e1431]
              - generic [ref=f1e1432]:
                - text: Vehicle Number
                - textbox "Vehicle Number" [ref=f1e1433]
              - generic [ref=f1e1434]:
                - text: Make
                - textbox "Make" [ref=f1e1435]
              - generic [ref=f1e1436]:
                - text: Model
                - textbox "Model" [ref=f1e1437]
              - generic [ref=f1e1438]:
                - text: Color
                - textbox "Color" [ref=f1e1439]
              - generic [ref=f1e1440]:
                - text: ODO meter reading (km)
                - spinbutton "ODO meter reading (km)" [ref=f1e1441]
              - generic [ref=f1e1442]:
                - text: Fuel / battery level
                - generic [ref=f1e1443]:
                  - textbox "Fuel / battery level bars" [ref=f1e1444]
                  - combobox [ref=f1e1445]:
                    - option "bars" [selected]
                    - option "%"
                    - option "litres"
                    - option "Other"
              - generic [ref=f1e1446]:
                - text: Keys
                - textbox "Keys" [ref=f1e1447]
              - generic [ref=f1e1448]:
                - text: Accessories
                - textbox "Accessories" [ref=f1e1449]
              - generic [ref=f1e1450]:
                - text: Advisor
                - combobox "Advisor" [ref=f1e1451]:
                  - option "Assign later" [selected]
                  - option "Service advisor 1 (Present)"
                  - option "Service advisor AA (Present)"
                  - option "Service advisor BB1 (Present)"
            - generic [ref=f1e1452]:
              - text: Requested Work
              - textbox "Requested Work" [ref=f1e1453]
        - generic [ref=f1e1454]:
          - button "Create Visit" [ref=f1e1456] [cursor=pointer]
          - button "Go Back" [ref=f1e1457] [cursor=pointer]
```

# Test source

```ts
  2754 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2755 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  2756 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2757 |   await editor.getByRole("tab", { name: "Materials" }).click();
  2758 |   const itemPicker = editor.getByRole("combobox", { name: "Item", exact: true });
  2759 |   const itemOptions = editor.getByRole("listbox", { name: "Item options" });
  2760 |   await itemPicker.fill("Tack");
  2761 |   await itemOptions.getByRole("option", { name: /Tack Cloth/ }).click();
  2762 |   await editor.getByLabel("Qty", { exact: true }).fill("999999");
  2763 |   await editor.getByRole("button", { name: "Add Row" }).click();
  2764 |   const row = editor.getByRole("table", { name: "Material rows" }).locator("tbody tr").filter({ hasText: "Tack Cloth" });
  2765 |   await expect(row).toContainText(/more than the \d+(?:\.\d+)? in stock/);
  2766 |   await expect(row.getByRole("button", { name: "Delete" })).toBeVisible();
  2767 |   await row.getByRole("button", { name: "Request Item", exact: true }).click();
  2768 |   const requested = editor.getByRole("table", { name: "Material rows" }).locator("tbody tr").filter({ hasText: "Tack Cloth" });
  2769 |   await expect(requested).toContainText("Requested");
  2770 |   await expect(requested.getByRole("button", { name: "Delete" })).toHaveCount(0);
  2771 |   await requested.getByRole("button", { name: "Cancel Request" }).click();
  2772 |   await expect(requested).toContainText("Cancelled");
  2773 | });
  2774 | 
  2775 | test("Store releases a requested row, then Admin edits it as Issued with a note", async ({ page }) => {
  2776 |   await loginAs(page, "admin@example.com");
  2777 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2778 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  2779 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2780 |   await editor.getByRole("tab", { name: "Materials" }).click();
  2781 |   const itemPicker = editor.getByRole("combobox", { name: "Item", exact: true });
  2782 |   const itemOptions = editor.getByRole("listbox", { name: "Item options" });
  2783 |   await itemPicker.fill("Tack");
  2784 |   await itemOptions.getByRole("option", { name: /Tack Cloth/ }).click();
  2785 |   await editor.getByLabel("Qty", { exact: true }).fill("2");
  2786 |   await editor.getByRole("button", { name: "Add Row" }).click();
  2787 |   const row = editor.getByRole("table", { name: "Material rows" }).locator("tbody tr").filter({ hasText: "Tack Cloth" });
  2788 |   await row.getByRole("button", { name: "Request Item", exact: true }).click();
  2789 |   await editor.getByRole("button", { name: "Go Back" }).click();
  2790 |   await page.getByRole("button", { name: "Logout" }).click();
  2791 |   await loginAs(page, "store@example.com");
  2792 |   await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  2793 |   await page.getByLabel("Item", { exact: true }).fill("Tack");
  2794 |   await page.getByRole("option", { name: /Tack Cloth/ }).click();
  2795 |   await page.getByRole("table", { name: "Issue Material results" }).getByRole("button", { name: "Issue Material", exact: true }).click();
  2796 |   await page.getByRole("dialog", { name: "Confirm material release" }).getByRole("button", { name: "Confirm release", exact: true }).click();
  2797 |   await page.getByRole("button", { name: "Logout" }).click();
  2798 |   await loginAs(page, "admin@example.com");
  2799 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2800 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  2801 |   const issuedEditor = page.getByRole("dialog", { name: /Edit Job/ });
  2802 |   await issuedEditor.getByRole("tab", { name: "Materials" }).click();
  2803 |   const issuedRow = issuedEditor.getByRole("table", { name: "Material rows" }).locator("tbody tr").filter({ hasText: "Tack Cloth" });
  2804 |   await expect(issuedRow).toContainText("Issued");
  2805 |   await issuedRow.getByRole("button", { name: "Edit Request" }).click();
  2806 |   const issuedEditorRow = issuedEditor.getByRole("row", { name: /Tack Cloth.*Issued/ });
  2807 |   await issuedEditorRow.getByRole("spinbutton", { name: "Qty", exact: true }).fill("3");
  2808 |   await issuedEditorRow.getByRole("button", { name: "Save" }).click();
  2809 |   await expect(issuedEditorRow.getByRole("alert")).toContainText("note is required");
  2810 |   await issuedEditorRow.getByLabel("Edit request note").fill("Customer wanted more");
  2811 |   await issuedEditorRow.getByRole("button", { name: "Save" }).click();
  2812 |   await expect(issuedEditorRow).toContainText("Issued");
  2813 | });
  2814 | 
  2815 | test("estimate approval and invoice creation enable Completed with per-line GST totals", async ({ page }) => {
  2816 |   await loginAs(page, "admin@example.com");
  2817 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2818 |   await page.getByLabel("Main status").selectOption("IN_PROGRESS");
  2819 |   await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  2820 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2821 |   await editor.getByRole("tab", { name: "Invoice" }).click();
  2822 |   await expect(editor.getByText("No invoice yet.")).toBeVisible();
  2823 |   await expect(editor.getByRole("button", { name: "Complete Work" })).toBeDisabled();
  2824 |   const approve = editor.getByRole("button", { name: "Approve Estimate" });
  2825 |   if (await approve.count()) {
  2826 |     await approve.first().click();
  2827 |     await page.getByRole("dialog", { name: "Approve Estimate?" }).getByRole("button", { name: "Approve Estimate" }).click();
  2828 |   }
  2829 |   await editor.getByRole("button", { name: "Create Invoice" }).first().click();
  2830 |   const create = page.getByRole("dialog", { name: "Create Invoice" });
  2831 |   await create.getByLabel("Invoice item 1 rate").fill("1000");
  2832 |   await create.getByLabel("Invoice item 1 quantity").fill("1");
  2833 |   await expect(create.getByLabel("Invoice item 1 GST type")).toHaveValue("CGST+SGST");
  2834 |   await expect(create.getByLabel("Invoice item 1 GST rate")).toHaveValue("18%");
  2835 |   await create.getByLabel("Invoice discount").fill("100");
  2836 |   await expect(create.getByLabel("Invoice totals")).toContainText("Discount");
  2837 |   await create.getByRole("button", { name: "Save Invoice" }).click();
  2838 |   await expect(create).toBeHidden();
  2839 |   await expect(editor.getByRole("table", { name: "Invoice lines" })).toBeVisible();
  2840 |   await expect(editor.getByRole("button", { name: "Complete Work" })).toBeEnabled();
  2841 | });
  2842 | test("searchable pickers dismiss outside interactions and still select options", async ({ page }) => {
  2843 |   await loginAs(page, "reception@example.com");
  2844 |   await page.getByRole("button", { name: "Create New Visit" }).click();
  2845 |   const visit = page.getByRole("dialog", { name: "Create New Visit" });
  2846 |   const customerPicker = visit.getByRole("combobox", { name: "Existing customer" });
  2847 |   const customerOptions = visit.getByRole("listbox");
  2848 |   await customerPicker.fill("Rahul");
  2849 |   await expect(customerOptions).toBeVisible();
  2850 |   await visit.getByLabel("Customer Name").click();
  2851 |   await expect(customerOptions).toBeHidden();
  2852 |   await expect(customerPicker).toHaveAttribute("aria-expanded", "false");
  2853 |   await customerPicker.fill("Rahul");
> 2854 |   await customerOptions.getByRole("option", { name: /Rahul Sharma/ }).click();
       |                                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  2855 |   await expect(visit.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  2856 |   await visit.getByRole("button", { name: "Go Back" }).click();
  2857 |   await page.getByRole("button", { name: "Logout" }).click();
  2858 | 
  2859 |   await loginAs(page, "admin@example.com");
  2860 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2861 |   await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  2862 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2863 |   await editor.getByRole("tab", { name: "Materials" }).click();
  2864 |   const inventoryPicker = editor.getByRole("combobox", { name: "Item", exact: true });
  2865 |   const inventoryOptions = editor.getByRole("listbox", { name: "Item options" });
  2866 |   await inventoryPicker.fill("Tack");
  2867 |   await expect(inventoryOptions).toBeVisible();
  2868 |   await editor.getByLabel("Qty").click();
  2869 |   await expect(inventoryOptions).toBeHidden();
  2870 |   await expect(inventoryPicker).toHaveAttribute("aria-expanded", "false");
  2871 |   await inventoryPicker.fill("Tack");
  2872 |   await inventoryOptions.getByRole("option").first().click();
  2873 |   await expect(inventoryPicker).toHaveValue(/Tack/);
  2874 |   await editor.getByRole("button", { name: "Go Back" }).click();
  2875 | 
  2876 |   await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  2877 |   const jobPicker = page.getByRole("combobox", { name: "Find a job" });
  2878 |   const jobOptions = page.getByRole("listbox", { name: "Matching jobs" });
  2879 |   await jobPicker.fill("OD02");
  2880 |   await expect(jobOptions).toBeVisible();
  2881 |   await page.getByLabel("Visit month").click();
  2882 |   await expect(jobOptions).toBeHidden();
  2883 |   await expect(jobPicker).toHaveAttribute("aria-expanded", "false");
  2884 |   await jobPicker.fill("OD02");
  2885 |   await jobOptions.getByRole("option").first().click();
  2886 |   await expect(page.getByRole("region", { name: "Chronological data flow" })).toBeVisible();
  2887 | });
  2888 | 
```