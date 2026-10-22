# Focused template test reproduction

Command: `node --import tsx --test unit-tests/report-templates.test.ts`

```text
✔ print documents preserve template background colors (1.7131ms)
✔ active invoices remain report-available despite a legacy unavailable flag (0.6876ms)
✖ defaults seed exactly one active template for every report category (3.8239ms)
✖ older session JSON hydrates new defaults and repairs active-template invariants (1.6729ms)
✖ template creation validates names/placeholders and active transfer is immutable (1.5921ms)
✔ company identity saves name and assets atomically (0.7644ms)
✔ placeholder validation and rendering escape scalar values while preserving generated blocks (2.852ms)
✔ report availability and values aggregate every payment and balance (50.2618ms)
✔ invoice values expose saved billing placeholders and sanitize the configured payment block (1.2941ms)
✔ invoice payment block omits blank rows and disappears when nothing is configured (1.5909ms)
✔ estimate is a seeded category with a default that uses the lines loop (0.3074ms)
✔ {{#lines}} loops merge one row per line with escaped values; line keys only work inside the loop (1.8956ms)
✔ company settings singleton saves contact details, GSTIN and footer atomically and exposes them as merge keys (1.081ms)
✔ images merge only when they are PNG/JPEG data URLs (0.8862ms)
✔ a template can be deleted unless it is the active one (0.3848ms)
ℹ tests 15
ℹ suites 0
ℹ pass 12
ℹ fail 3
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 285.8499

✖ failing tests:

test at unit-tests\report-templates.test.ts:1:2814
✖ defaults seed exactly one active template for every report category (3.8239ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  8 !== 6
  
      at TestContext.<anonymous> (C:\Users\PREMDEEP\Desktop\AI Engg - Coding All Stuff\WorkshopOS\unit-tests\report-templates.test.ts:44:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:787:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 8,
    expected: 6,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at unit-tests\report-templates.test.ts:1:3447
✖ older session JSON hydrates new defaults and repairs active-template invariants (1.6729ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  8 !== 6
  
      at TestContext.<anonymous> (C:\Users\PREMDEEP\Desktop\AI Engg - Coding All Stuff\WorkshopOS\unit-tests\report-templates.test.ts:58:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:787:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 8,
    expected: 6,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at unit-tests\report-templates.test.ts:1:4103
✖ template creation validates names/placeholders and active transfer is immutable (1.5921ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  8 !== 6
  
      at TestContext.<anonymous> (C:\Users\PREMDEEP\Desktop\AI Engg - Coding All Stuff\WorkshopOS\unit-tests\report-templates.test.ts:69:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:787:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 8,
    expected: 6,
    operator: 'strictEqual',
    diff: 'simple'
  }

```

Exit: 1
