function TransactionSection({
  searchText,
  setSearchText,
  selectedType,
  setSelectedType,
  sortOrder,
  setSortOrder,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredTransactions,
  sortedTransactions,
  onClearFilters,
  onDelete,
  onEdit,
  formatCents,
  amountToCents,
  monthTransactions,
}) {
  return (
    <section className="transactions">
      <h2>Transactions</h2>
      <div className="transaction-filters">
        <input
          type="text"
          placeholder="Search description..."
          aria-label="Search transactions by description"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <select
          aria-label="Filter by type"
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
        <select
          aria-label="Sort transactions"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="amount-asc">Amount: lowest first</option>
          <option value="amount-desc">Amount: highest first</option>
        </select>
        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <p>
          {monthTransactions.length === 0
            ? "No transactions for this month."
            : "No transactions match the selected filters."}
        </p>
      ) : (
        sortedTransactions.map((transaction) => {
          const category = categories.find(
            (item) => Number(item.id) === Number(transaction.category_id),
          );
          return (
            <article
              key={transaction.id}
              className="summary-card transaction-card"
            >
              <p>{transaction.date}</p>
              <h3>{transaction.description || "No description"}</h3>
              <p className="transaction-category">
                <span
                  className="category-dot"
                  style={{
                    backgroundColor: category ? category.color : "#9ca3af",
                  }}
                />
                {category ? category.name : "Unknown category"}
              </p>
              <p
                className={`transaction-amount ${transaction.type === "income" ? "income" : "expense"}`}
              >
                {transaction.type === "income" ? "+" : "−"}
                {formatCents(amountToCents(transaction.amount))}
              </p>
              <div className="transaction-actions">
                <button
                  type="button"
                  className="transaction-delete-button"
                  onClick={() => onDelete(transaction.id)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="transaction-edit-button"
                  onClick={() => onEdit(transaction)}
                >
                  Edit
                </button>
              </div>
            </article>
          );
        })
      )}
    </section>
  );
}

export default TransactionSection;
