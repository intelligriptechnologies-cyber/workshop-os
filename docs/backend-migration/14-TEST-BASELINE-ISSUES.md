# 14 — Report-template test baseline issues

Audit date: 2026-10-21. **Diagnosis: three outdated default-count expectations. Preserve the eight existing templates.** Client sign-off specifically naming these defaults was not available; intentional source behavior and signed approval are distinct evidence.

## TEST-01 — Reproduction

Executed `node --import tsx --test unit-tests/report-templates.test.ts` using installed dependencies. Exit code 1; the three reported failures again compare actual 8 with expected 6. [Complete output](stage15-template-test-run.md). No tests or application files were changed. The earlier complete suite baseline remains 241 passed / 3 failed of 244; this focused run does not claim a new complete-suite result.

| Failure | Evidence | Diagnosis |
|---|---|---|
| Seed defaults count | `unit-tests/report-templates.test.ts:44` | Expects six total templates; current source defines eight. |
| Hydration count | `unit-tests/report-templates.test.ts:58` | Hydrating missing defaults correctly restores eight; expectation is six. |
| Create-template original/new counts | `unit-tests/report-templates.test.ts:69–73` | Original count expectation six fails first. Later seven-count assertions would also be stale: original eight plus one is nine. |

## TEST-02 — Competing explanations and evidence

`src/report-templates.ts:7` defines six categories: estimate, quotation, invoice, gate-pass, job-card and payment-receipt. `seedReportTemplates:106–130` returns one active standard template per category plus two **inactive quotation variants**: `template-quotation-marron` (Marron Template, `#8b2f3c`) and `template-quotation-yellow` (Yellow Template, `#d97706`). Six categories do not imply six template records.

Git commit `c43caf35a121f3785826e7e593f1b389fbed7137`, 2026-10-06, “Update sales quotation and reporting workflows,” explicitly introduced the variants and increased `DEFAULT_TEMPLATE_VERSION` from 3 to 4. That supports intentional source addition rather than accidental test pollution. The corresponding count assumptions were not updated.

A separate deterministic in-memory probe verified: eight defaults; eight unique IDs; six active templates; exactly one active per category; three quotation templates, two inactive; hydration restores eight; creating a template produces nine while retaining the original eight; duplicate-name and unsupported-placeholder validation reject; activation preserves immutability. The storage stub rejects writes; no real browser storage was used. [Probe evidence](stage15-template-probe.json.md).

| Hypothesis | Finding |
|---|---|
| Tests are outdated | VERIFIED for these count expectations, supported by source history and reproducible probe. |
| Default fixtures differ | VERIFIED: current defaults intentionally contain two additional quotation variants. |
| Runtime accidentally duplicates defaults | Not supported by the probe: eight unique IDs and correct activation invariant. Other browser-specific corrupted state is UNVERIFIED. |
| Existing behavior is incorrect | No default-count implementation defect identified. This does not certify every template/rendering operation. |
| Client intentionally approved exactly eight | Source intent VERIFIED; separate client approval record UNVERIFIED. Preserve existing behavior pending review. |

## Recommended resolution — requires later approval to edit tests

Update tests to assert the eight intended default identities, six active templates, one active per category and inactive Marron/Yellow variants. Express create counts as baseline + 1 while also verifying the added record and original immutability. Preserve validation/hydration assertions. Do not remove templates or force the product back to six to satisfy stale tests. Rerun focused tests and the full existing suite after the approved test-only change.

The diagnosis does not block architecture design. A clean accepted test baseline should precede implementation acceptance; the current failures must remain visible rather than be ignored or represented as passing. No proposed change was implemented.
