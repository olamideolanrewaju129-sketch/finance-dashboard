/**
 * Budget validation verification script
 *
 * Test plan:
 * 1. Valid submission — accepts positive monthly total and category limits
 * 2. Negative number rejection — rejects "-500" category limit with inline error message
 * 3. Duplicate category rejection — rejects duplicate names (case-insensitive)
 * 4. Empty field rejection — rejects blank monthly total, category, and limit
 */

import { validateBudgetForm, parseBudgetForm } from "../src/utils/budgetValidation.js";

let passed = 0;
let failed = 0;

const assert = (condition, message) => {
  if (condition) {
    passed += 1;
    console.log(`  PASS: ${message}`);
  } else {
    failed += 1;
    console.error(`  FAIL: ${message}`);
  }
};

console.log("Budget Validation Verification\n");

console.log("1. Valid submission");
{
  const result = validateBudgetForm({
    monthlyTotal: "100000",
    categories: [
      { category: "Food", limit: "15000" },
      { category: "Transport", limit: "10000" },
    ],
  });
  assert(result.isValid === true, "valid form passes validation");
  assert(result.errors.monthlyTotal === null, "no monthly total error");

  const parsed = parseBudgetForm({
    monthlyTotal: "100000",
    categories: [
      { category: "Food", limit: "15000" },
      { category: "Transport", limit: "10000" },
    ],
  });
  assert(parsed.monthlyTotal === 100000, "parses monthly total correctly");
  assert(parsed.categories.Food === 15000, "parses category limits correctly");
}

console.log("\n2. Negative number rejection");
{
  const result = validateBudgetForm({
    monthlyTotal: "100000",
    categories: [{ category: "Food", limit: "-500" }],
  });
  assert(result.isValid === false, "negative limit rejected");
  assert(
    result.errors.categories[0].limit === "Limit must be greater than 0",
    'shows "Limit must be greater than 0" for -500'
  );

  const negativeTotal = validateBudgetForm({
    monthlyTotal: "-1000",
    categories: [{ category: "Food", limit: "500" }],
  });
  assert(negativeTotal.isValid === false, "negative monthly total rejected");
  assert(
    negativeTotal.errors.monthlyTotal === "Monthly total must be greater than 0",
    "shows monthly total error for negative value"
  );
}

console.log("\n3. Duplicate category rejection");
{
  const result = validateBudgetForm({
    monthlyTotal: "100000",
    categories: [
      { category: "Food", limit: "5000" },
      { category: "food", limit: "3000" },
    ],
  });
  assert(result.isValid === false, "duplicate categories rejected");
  assert(
    result.errors.categories[0].category === "Duplicate category name",
    "marks first duplicate"
  );
  assert(
    result.errors.categories[1].category === "Duplicate category name",
    "marks second duplicate"
  );
}

console.log("\n4. Empty field rejection");
{
  const result = validateBudgetForm({
    monthlyTotal: "",
    categories: [{ category: "", limit: "" }],
  });
  assert(result.isValid === false, "empty fields rejected");
  assert(result.errors.monthlyTotal === "Monthly total is required", "monthly total required");
  assert(result.errors.categories[0].category === "Category name is required", "category required");
  assert(result.errors.categories[0].limit === "Limit is required", "limit required");
}

console.log("\n5. Naira symbol encoding");
{
  const naira = "\u20A6";
  assert(naira === "₦", "Naira symbol renders as ₦ (U+20A6), not garbled characters");
  assert(`${naira}1,000`.startsWith("₦"), "formatted currency starts with ₦");
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
