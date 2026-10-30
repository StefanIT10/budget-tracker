function TransactionForm({
  editingTransactionId,
  transactionType,
  setTransactionType,
  transactionAmount,
  setTransactionAmount,
  transactionDate,
  setTransactionDate,
  transactionDescription,
  setTransactionDescription,
  transactionCategory,
  setTransactionCategory,
  categories,
  fieldErrors,
  formError,
  saving,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="transaction-form" onSubmit={onSubmit}>
      <h2>
        {editingTransactionId !== null ? "Edit transaction" : "New transaction"}
      </h2>

      <label>
        Transaction type
        <select
          value={transactionType}
          onChange={(event) => setTransactionType(event.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>

      {fieldErrors.type && (
        <p role="alert" className="field-error">
          {fieldErrors.type}
        </p>
      )}

      <label>
        Amount
        <input
          /*type="number"
          min="0.01"
          step="0.01"*/
          type="text"
          value={transactionAmount}
          onChange={(event) => setTransactionAmount(event.target.value)}
          placeholder="e.g. 1500.00"
        />
      </label>
      {fieldErrors.amount && (
        <p role="alert" className="field-error">
          {fieldErrors.amount}
        </p>
      )}

      <label>
        Date
        <input
          type="date"
          value={transactionDate}
          onChange={(event) => setTransactionDate(event.target.value)}
        />
      </label>
      {fieldErrors.date && (
        <p role="alert" className="field-error">
          {fieldErrors.date}
        </p>
      )}

      <label>
        Description
        <input
          type="text"
          value={transactionDescription}
          onChange={(event) => setTransactionDescription(event.target.value)}
          placeholder="e.g. Grocery shopping"
        />
      </label>
      {fieldErrors.description && (
        <p role="alert" className="field-error">
          {fieldErrors.description}
        </p>
      )}

      <label>
        Category
        <select
          value={transactionCategory}
          onChange={(event) => setTransactionCategory(event.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      {fieldErrors.category && (
        <p role="alert" className="field-error">
          {fieldErrors.category}
        </p>
      )}
      {formError && <p role="alert">{formError}</p>}

      <button type="submit" disabled={saving}>
        {saving
          ? "Saving..."
          : editingTransactionId !== null
            ? "Save changes"
            : "Save transaction"}
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default TransactionForm;
