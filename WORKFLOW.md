# WORKFLOW.md

Comparison of two approaches to building the same feature: a Budget Settings form for the finance dashboard, built once with a vague prompt (round1-vague-prompt branch) and once with a precise, constraint-driven prompt (round2-precise-prompt branch).

## Round 1: Vague Prompt

Prompt used: "Build a budget settings form for my finance app." No file references, no constraints, no verification step.

Result: Cursor touched 4 files (~297 lines) and produced a working form with monthly and per-category budget limits, persisted to localStorage, styled to roughly match the existing dashboard. Validation was limited to native HTML attributes (required, min="1") with no custom error messages and no duplicate-category prevention. There was no dedicated validation logic; checks were inline in the component.

One concrete AI mistake caught: the Naira symbol (₦) rendered as garbled characters (â‚¦) throughout the component, a text-encoding bug I only noticed by reading the generated code closely. Nothing in the vague-prompt output flagged or tested for this.

Total time including my review: ~20 minutes.

## Round 2: Precise Prompt

Prompt used: referenced specific files (AppContext.jsx, mockData.js, Dashboard.jsx, Insights.jsx), specified validation rules (positive numbers, no duplicate categories, inline error messages), specified accessibility requirements (aria-live, associated labels), explicitly required correct ₦ encoding, and required a verification step: writing and running tests before reporting completion.

Result: Cursor touched 7 files (~630 lines), including a separate src/utils/budgetValidation.js module with per-field error objects and case-insensitive duplicate detection, and a dedicated verification script (scripts/verify-budget-validation.mjs). It ran 17 automated test cases, all passing, including a specific test confirming the ₦ symbol encodes correctly (U+20A6) — directly catching the exact bug Round 1 introduced silently.

Total time including my review: ~45 minutes.

## Comparison

Correctness: Round 2 caught and prevented the encoding bug that shipped silently in Round 1. Round 2's validation also correctly rejects duplicate category names and negative limits with specific inline messages; Round 1 relied on generic browser validation popups only.

Accessibility: Round 2 was explicitly asked for aria-live error announcements and label associations; Round 1 had none of this since it wasn't requested.

Edge cases: Round 2 handles duplicate categories, empty fields, and negative numbers with dedicated logic and tests. Round 1 handles none of these beyond what native HTML5 validation covers for free.

Review effort and time: contrary to the general pattern I expected, Round 2 took longer overall for me (45 min vs 20 min), not less. Reading through the separate validation module and test file, and confirming the test results, took real time. However, that time bought confidence — I did not need to manually re-test edge cases myself, since the automated tests already covered them. Round 1's speed was misleading: its bugs (the encoding issue, missing duplicate check) were invisible until I looked closely, meaning the "cheap" 20 minutes hid unverified risk that would surface later, likely costing more time to catch in review or in production.

## Key Takeaway

A vague prompt produces something that looks done. A precise prompt with a verification step produces something that is actually checked. The time difference wasn't in generation, it was in trust: Round 2's extra 25 minutes replaced manual QA I would have otherwise had to do myself, later, under less controlled conditions.
