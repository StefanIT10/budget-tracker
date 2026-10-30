import { describe, it, expect } from "vitest";
import { calculateMonthlySummary } from "../MonthlySummary";

describe("calculateMonthlySummary", function () {
  it("should calculate total income and expenses", function () {
    const transactions = [
      { type: "income", amount: "1500.00" },
      { type: "expense", amount: "200.50" },
      { type: "expense", amount: "100.25" },
      { type: "income", amount: "500.00" },
    ];

    const result = calculateMonthlySummary(transactions);

    expect(result.income).toBe(200000);
    expect(result.expense).toBe(30075);
  });

  it("should return zero when there are no transactions", function () {
    const result = calculateMonthlySummary([]);

    expect(result).toEqual({
      income: 0,
      expense: 0,
    });
  });

  it("should calculate amounts correctly using cents", function () {
    const transactions = [
      { type: "income", amount: "10.99" },
      { type: "expense", amount: "0.50" },
    ];

    const result = calculateMonthlySummary(transactions);

    expect(result.income).toBe(1099);
    expect(result.expense).toBe(50);
  });
});
