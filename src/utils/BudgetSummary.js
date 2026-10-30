import { amountToCents } from "./MoneyUtils";

export function calculateBudgetSummaries(
  categories,
  monthlyBudgets,
  monthTransactions,
  selectedMonth,
) {
  return categories
    .map((category) => {
      const budget = monthlyBudgets.find(
        (item) => Number(item.category_id) === Number(category.id),
      );

      const spent = monthTransactions.reduce((total, transaction) => {
        if (
          transaction.type === "expense" &&
          Number(transaction.category_id) === Number(category.id)
        ) {
          return total + amountToCents(transaction.amount);
        }

        return total;
      }, 0);

      const hasBudget = Boolean(budget);
      const limit = hasBudget ? amountToCents(budget.amount) : null;

      return {
        category: category,
        category_id: category.id,
        month: selectedMonth,
        hasBudget: hasBudget,
        spent: spent,
        limit: limit,
        remaining: hasBudget ? limit - spent : null,
        progress: hasBudget && limit > 0 ? (spent / limit) * 100 : 0,
      };
    })
    .filter((item) => item.spent > 0 || item.hasBudget)
    .sort((a, b) => b.spent - a.spent);
}
