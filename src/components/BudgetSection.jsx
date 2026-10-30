function BudgetSection({
  selectedMonth,
  formatMonth,
  showBudgetForm,
  setShowBudgetForm,
  onSaveBudget,
  budgetCategory,
  setBudgetCategory,
  budgetAmount,
  setBudgetAmount,
  categories,
  budgetError,
  savingBudget,
  budgetSummaries,
  formatCents,
  onDeleteBudget,
}) {
  return (
    <section className="budgets">
      <h2>Budgets for {formatMonth(selectedMonth)}</h2>
      <button
        type="button"
        onClick={() => {
          setShowBudgetForm(!showBudgetForm);
        }}
      >
        Set budget
      </button>

      {showBudgetForm && (
        <form className="transaction-form" onSubmit={onSaveBudget}>
          <h3>Budget for {formatMonth(selectedMonth)}</h3>
          <label>
            Category
            <select
              value={budgetCategory}
              required
              onChange={(event) => setBudgetCategory(event.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Monthly limit
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={budgetAmount}
              onChange={(event) => setBudgetAmount(event.target.value)}
              placeholder="e.g. 15000"
            />
          </label>
          {budgetError && <p role="alert">{budgetError}</p>}
          <button type="submit" disabled={savingBudget}>
            {savingBudget ? "Saving..." : "Save budget"}
          </button>
          <button type="button" onClick={() => setShowBudgetForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {budgetSummaries.length === 0 ? (
        <p>There are no expenses or budgets set for this month.</p>
      ) : (
        <div className="budget-list">
          {budgetSummaries.map((budget) => {
            const exceeded = budget.hasBudget && budget.spent > budget.limit;
            return (
              <article
                className="summary-card budget-card"
                key={budget.month + "-" + budget.category_id}
              >
                <h3>{budget.category.name}</h3>
                <p>Spent: {formatCents(budget.spent)}</p>
                {budget.hasBudget ? (
                  <>
                    <p>Budget: {formatCents(budget.limit)}</p>
                    <p className={exceeded ? "expense" : "income"}>
                      {exceeded
                        ? "Over budget: " +
                          formatCents(budget.spent - budget.limit)
                        : "Remaining: " + formatCents(budget.remaining)}
                    </p>
                    <progress
                      value={Math.min(budget.progress, 100)}
                      max="100"
                      aria-label={"Budget usage: " + budget.category.name}
                    />
                    <p>{budget.progress.toFixed(0)}% of budget used</p>
                    <button
                      type="button"
                      onClick={() => onDeleteBudget(budget.category_id)}
                    >
                      Delete budget
                    </button>
                  </>
                ) : (
                  <p>No budget has been set for this category.</p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BudgetSection;
