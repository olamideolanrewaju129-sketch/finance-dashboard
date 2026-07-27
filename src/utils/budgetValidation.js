const emptyCategoryErrors = () => ({ category: null, limit: null });

export const validateBudgetForm = ({ monthlyTotal, categories }) => {
  const errors = {
    monthlyTotal: null,
    categories: categories.map(() => emptyCategoryErrors()),
    form: null,
  };

  let isValid = true;

  const totalTrimmed = String(monthlyTotal ?? "").trim();
  if (!totalTrimmed) {
    errors.monthlyTotal = "Monthly total is required";
    isValid = false;
  } else {
    const total = Number(totalTrimmed);
    if (Number.isNaN(total) || total <= 0) {
      errors.monthlyTotal = "Monthly total must be greater than 0";
      isValid = false;
    }
  }

  if (categories.length === 0) {
    errors.form = "At least one category budget is required";
    isValid = false;
  }

  const seenCategories = new Map();

  categories.forEach((row, index) => {
    const categoryTrimmed = String(row.category ?? "").trim();
    const limitTrimmed = String(row.limit ?? "").trim();

    if (!categoryTrimmed) {
      errors.categories[index].category = "Category name is required";
      isValid = false;
    } else {
      const normalized = categoryTrimmed.toLowerCase();
      if (seenCategories.has(normalized)) {
        const firstIndex = seenCategories.get(normalized);
        errors.categories[index].category = "Duplicate category name";
        errors.categories[firstIndex].category = "Duplicate category name";
        isValid = false;
      } else {
        seenCategories.set(normalized, index);
      }
    }

    if (!limitTrimmed) {
      errors.categories[index].limit = "Limit is required";
      isValid = false;
    } else {
      const limit = Number(limitTrimmed);
      if (Number.isNaN(limit) || limit <= 0) {
        errors.categories[index].limit = "Limit must be greater than 0";
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

export const parseBudgetForm = ({ monthlyTotal, categories }) => {
  const parsedCategories = {};
  categories.forEach((row) => {
    const category = String(row.category).trim();
    const limit = Number(String(row.limit).trim());
    if (category && !Number.isNaN(limit) && limit > 0) {
      parsedCategories[category] = limit;
    }
  });

  return {
    monthlyTotal: Number(String(monthlyTotal).trim()),
    categories: parsedCategories,
  };
};
