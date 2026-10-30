import { amountToCents } from "./MoneyUtils";

export function calculateMonthlySummary(transactions) {
  return transactions.reduce(
    (summary, transaction) => {
      const cents = amountToCents(transaction.amount);

      if (transaction.type === "income") {
        summary.income += cents;
      } else if (transaction.type === "expense") {
        summary.expense += cents;
      }

      return summary;
    },
    { income: 0, expense: 0 },
  );
}
