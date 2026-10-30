import { describe, it, expect } from "vitest";
import { calculateBudgetSummaries } from "../BudgetSummary";

describe("calculateBudgetSummaries", function () {
  const categories = [
    { id: 1, name: "Food" },
    { id: 2, name: "Transport" },
    { id: 3, name: "Entertainment" },
  ];

  const monthlyBudgets = [
    { category_id: 1, month: "2026-10", amount: "500.00" },
    { category_id: 2, month: "2026-10", amount: "200.00" },
  ];

  it("should calculate spending and remaining budget", function () {
    const transactions = [
      { type: "expense", category_id: 1, amount: "150.00" },
      { type: "expense", category_id: 1, amount: "50.00" },
      { type: "expense", category_id: 2, amount: "75.00" },
    ];

    const result = calculateBudgetSummaries(
      categories,
      monthlyBudgets,
      transactions,
      "2026-10",
    );

    expect(result[0].spent).toBe(20000);
    expect(result[0].limit).toBe(50000);
    expect(result[0].remaining).toBe(30000);
    expect(result[0].progress).toBe(40);
  });

  it("should identify when a budget is exceeded", function () {
    const transactions = [
      { type: "expense", category_id: 1, amount: "600.00" },
    ];

    const result = calculateBudgetSummaries(
      categories,
      monthlyBudgets,
      transactions,
      "2026-10",
    );

    expect(result[0].remaining).toBe(-10000);
    expect(result[0].progress).toBe(120);
  });

  it("should return zero spending for a budget without transactions", function () {
    const result = calculateBudgetSummaries(
      categories,
      monthlyBudgets,
      [],
      "2026-10",
    );

    expect(result[0].spent).toBe(0);
    expect(result[0].progress).toBe(0);
    expect(result[0].remaining).toBe(50000);
  });

  it("should ignore income transactions when calculating spending", function () {
    const transactions = [{ type: "income", category_id: 1, amount: "300.00" }];

    const result = calculateBudgetSummaries(
      categories,
      monthlyBudgets,
      transactions,
      "2026-10",
    );

    expect(result[0].spent).toBe(0);
  });

  it("should sort categories by spending from highest to lowest", function () {
    const transactions = [
      { type: "expense", category_id: 1, amount: "100.00" },
      { type: "expense", category_id: 2, amount: "150.00" },
    ];

    const result = calculateBudgetSummaries(
      categories,
      monthlyBudgets,
      transactions,
      "2026-10",
    );

    expect(result[0].category.name).toBe("Transport");
    expect(result[1].category.name).toBe("Food");
  });
});
