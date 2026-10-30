function SummarySection({ selectedMonth, onMonthChange, formatMonth, monthlySummary, balance, formatCents }) {
  return (
    <section className="summary">
      <div className="month-navigation">
        <button type="button" onClick={() => onMonthChange(-1)}>Previous month</button>
        <h2>{formatMonth(selectedMonth)}</h2>
        <button type="button" onClick={() => onMonthChange(1)}>Next month</button>
      </div>
      <div className="summary-cards">
        <article className="summary-card">
          <h3>Income</h3>
          <p className="income">{formatCents(monthlySummary.income)}</p>
        </article>
        <article className="summary-card">
          <h3>Expenses</h3>
          <p className="expense">{formatCents(monthlySummary.expense)}</p>
        </article>
        <article className="summary-card">
          <h3>Balance</h3>
          <p className={balance >= 0 ? "income" : "expense"}>{formatCents(balance)}</p>
        </article>
      </div>
    </section>
  );
}

export default SummarySection;
