import { useEffect, useState } from "react";
import { calculateMonthlySummary } from "./utils/MonthlySummary";
import { calculateBudgetSummaries } from "./utils/BudgetSummary";
import {
  getAllData,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  saveBudget,
  addCategory,
  updateCategory,
  deleteCategory,
  deleteBudget,
  resetData,
} from "./services/BudgetService";
import {
  getLatestMonth,
  getMonthFromDate,
  changeMonth,
  formatMonth,
} from "./utils/DateUtils";
import { amountToCents, formatCents } from "./utils/MoneyUtils";
import Header from "./components/Header";
import TransactionForm from "./components/TransactionForm";
import CategorySection from "./components/CategorySection";
import SummarySection from "./components/SummarySection";
import BudgetSection from "./components/BudgetSection";
import TransactionSection from "./components/TransactionSection";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [transactionType, setTransactionType] = useState("expense");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#22c55e");
  const [categoryError, setCategoryError] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(function () {
    async function loadBudgetData() {
      try {
        setLoading(true);
        setError("");
        const result = await getAllData();
        setData(result);
        const params = new URLSearchParams(window.location.search);
        const monthFromUrl = params.get("month");
        const typeFromUrl = params.get("type");
        const categoryFromUrl = params.get("category");
        const searchFromUrl = params.get("search");
        const sortFromUrl = params.get("sort");

        if (
          sortFromUrl === "amount-asc" ||
          sortFromUrl === "amount-desc" ||
          sortFromUrl === "newest"
        ) {
          setSortOrder(sortFromUrl);
        }
        if (typeFromUrl === "income" || typeFromUrl === "expense")
          setSelectedType(typeFromUrl);
        const categoryExists = result.categories.some(
          (category) => Number(category.id) === Number(categoryFromUrl),
        );

        if (categoryFromUrl && categoryExists) {
          setSelectedCategory(categoryFromUrl);
        }
        if (searchFromUrl) setSearchText(searchFromUrl);

        if (monthFromUrl && /^\d{4}-(0[1-9]|1[0-2])$/.test(monthFromUrl)) {
          setSelectedMonth(monthFromUrl);
        } else {
          setSelectedMonth(getLatestMonth(result.transactions));
        }
      } catch (error) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    loadBudgetData();
  }, []);

  useEffect(
    function () {
      if (!selectedMonth) return;
      const params = new URLSearchParams(window.location.search);
      params.set("month", selectedMonth);
      if (selectedType !== "all") params.set("type", selectedType);
      else params.delete("type");
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      else params.delete("category");
      if (searchText.trim() !== "") params.set("search", searchText);
      else params.delete("search");
      if (sortOrder !== "newest") params.set("sort", sortOrder);
      else params.delete("sort");
      const queryString = params.toString();
      const newUrl = queryString
        ? window.location.pathname + "?" + queryString
        : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [selectedMonth, selectedType, selectedCategory, searchText, sortOrder],
  );

  function handleMonthChange(difference) {
    setSelectedMonth((currentMonth) => changeMonth(currentMonth, difference));
  }

  async function handleAddTransaction(event) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    const amountText = transactionAmount.trim();
    const amount = Number(amountText);

    if (transactionType !== "income" && transactionType !== "expense") {
      setFieldErrors({
        type: "Please select a valid transaction type.",
      });
      return;
    }
    if (
      amountText === "" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1000000 ||
      !/^\d+(\.\d{1,2})?$/.test(amountText)
    ) {
      setFieldErrors({
        amount:
          "The amount must be greater than 0 and no more than €1,000,000.00, with a maximum of two decimal places.",
      });
      return;
    }
    if (
      !transactionDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(transactionDate) ||
      !Number.isFinite(Date.parse(transactionDate)) ||
      new Date(transactionDate).toISOString().slice(0, 10) !== transactionDate
    ) {
      setFieldErrors({ date: "Please select a valid transaction date." });
      return;
    }
    const categoryExists = data.categories.some(
      (category) => Number(category.id) === Number(transactionCategory),
    );

    if (!transactionCategory || !categoryExists) {
      setFieldErrors({ category: "Please select a valid category." });
      return;
    }
    if (transactionDescription.length > 200) {
      setFieldErrors({
        description: "Description can contain up to 200 characters.",
      });
      return;
    }

    setSaving(true);
    try {
      const transactionData = {
        type: transactionType,
        amount: amount.toFixed(2),
        date: transactionDate,
        description: transactionDescription.trim(),
        category_id: Number(transactionCategory),
      };
      if (editingTransactionId !== null) {
        const updatedTransaction = await updateTransaction(
          editingTransactionId,
          transactionData,
        );
        setData((previousData) => ({
          ...previousData,
          transactions: previousData.transactions.map((transaction) =>
            transaction.id === editingTransactionId
              ? updatedTransaction
              : transaction,
          ),
        }));
      } else {
        const newTransaction = await addTransaction(transactionData);
        setData((previousData) => ({
          ...previousData,
          transactions: [...previousData.transactions, newTransaction],
        }));
      }
      setSelectedMonth(transactionDate.slice(0, 7));
      setTransactionAmount("");
      setTransactionDescription("");
      setTransactionCategory("");
      setEditingTransactionId(null);
      setFormError("");
      setShowForm(false);
    } catch (error) {
      setFormError("Transaction was not saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTransaction(transactionId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );
    if (!confirmed) return;
    try {
      await deleteTransaction(transactionId);
      setData((previousData) => ({
        ...previousData,
        transactions: previousData.transactions.filter(
          (transaction) => transaction.id !== transactionId,
        ),
      }));
    } catch (error) {
      window.alert("Transaction was not deleted. Please try again.");
    }
  }

  function handleEditTransaction(transaction) {
    setEditingTransactionId(transaction.id);
    setTransactionType(transaction.type);
    setTransactionAmount(String(transaction.amount));
    setTransactionDate(transaction.date);
    setTransactionDescription(transaction.description || "");
    setTransactionCategory(String(transaction.category_id));
    setFormError("");
    setShowForm(true);
  }

  async function handleSaveBudget(event) {
    event.preventDefault();
    setBudgetError("");
    const amount = Number(budgetAmount);

    const categoryExists = data.categories.some(
      (category) => Number(category.id) === Number(budgetCategory),
    );

    if (!budgetCategory || !categoryExists) {
      setBudgetError("Please select a valid category.");
      return;
    }

    if (
      budgetAmount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1000000 ||
      !/^\d+(\.\d{1,2})?$/.test(budgetAmount.trim())
    ) {
      setBudgetError(
        "Budget must be greater than 0 and no more than €1,000,000.00, with a maximum of two decimal places.",
      );
      return;
    }
    setSavingBudget(true);
    try {
      await saveBudget(selectedMonth, budgetCategory, amount);
      setData((previousData) => {
        const updatedBudgets = previousData.budgets.filter(
          (budget) =>
            !(
              budget.month === selectedMonth &&
              budget.category_id === Number(budgetCategory)
            ),
        );
        updatedBudgets.push({
          month: selectedMonth,
          category_id: Number(budgetCategory),
          amount: amount.toFixed(2),
        });
        return { ...previousData, budgets: updatedBudgets };
      });
      setBudgetCategory("");
      setBudgetAmount("");
      setBudgetError("");
      setShowBudgetForm(false);
    } catch (error) {
      setBudgetError("Budget was not saved. Please try again.");
    } finally {
      setSavingBudget(false);
    }
  }

  async function handleDeleteBudget(categoryId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?",
    );
    if (!confirmed) return;
    try {
      await deleteBudget(selectedMonth, categoryId);
      setData((previousData) => ({
        ...previousData,
        budgets: previousData.budgets.filter(
          (budget) =>
            !(
              budget.month === selectedMonth &&
              Number(budget.category_id) === Number(categoryId)
            ),
        ),
      }));
    } catch (error) {
      window.alert("Budget was not deleted. Please try again.");
    }
  }

  async function handleAddCategory(event) {
    event.preventDefault();
    setCategoryError("");
    const name = categoryName.trim();
    if (name === "") {
      setCategoryError("Please enter a category name.");
      return;
    }
    if (name.length > 30) {
      setCategoryError("Category name can contain up to 30 characters.");
      return;
    }
    const alreadyExists = data.categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );
    if (alreadyExists) {
      setCategoryError("A category with this name already exists.");
      return;
    }
    setSavingCategory(true);
    try {
      const newCategory = await addCategory({
        name: name,
        color: categoryColor,
      });
      setData((previousData) => ({
        ...previousData,
        categories: [...previousData.categories, newCategory],
      }));
      setCategoryName("");
      setCategoryColor("#22c55e");
      setShowCategoryForm(false);
    } catch (error) {
      setCategoryError("Category was not saved. Please try again.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleUpdateCategory(event) {
    event.preventDefault();
    setCategoryError("");
    const name = categoryName.trim();
    if (name.length < 1 || name.length > 30) {
      setCategoryError("Name must contain between 1 and 30 characters.");
      return;
    }
    const alreadyExists = data.categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== editingCategoryId,
    );
    if (alreadyExists) {
      setCategoryError("A category with this name already exists.");
      return;
    }
    setSavingCategory(true);
    try {
      const updatedCategory = await updateCategory(editingCategoryId, {
        name: name,
        color: categoryColor,
      });
      setData((previousData) => ({
        ...previousData,
        categories: previousData.categories.map((category) =>
          category.id === editingCategoryId ? updatedCategory : category,
        ),
      }));
      setEditingCategoryId(null);
      setCategoryName("");
      setCategoryColor("#22c55e");
      setShowCategoryForm(false);
    } catch (error) {
      setCategoryError("Category was not updated. Please try again.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory(categoryId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category and its budgets?",
    );
    if (!confirmed) return;
    setCategoryError("");
    try {
      await deleteCategory(categoryId);
      setData((previousData) => ({
        ...previousData,
        categories: previousData.categories.filter(
          (category) => category.id !== categoryId,
        ),
        budgets: previousData.budgets.filter(
          (budget) => budget.category_id !== categoryId,
        ),
      }));
      if (editingCategoryId === categoryId) {
        setEditingCategoryId(null);
        setCategoryName("");
        setCategoryColor("#22c55e");
        setShowCategoryForm(false);
      }
    } catch (error) {
      setCategoryError(error.message);
    }
  }

  async function handleResetData() {
    try {
      const reset = await resetData();

      setData(reset);
      setSelectedMonth(getLatestMonth(reset.transactions));
      setSelectedType("all");
      setSelectedCategory("all");
      setSearchText("");
      setSortOrder("newest");

      setFormError("");
      setFieldErrors({});
      setBudgetError("");
      setCategoryError("");
      setError("");

      setShowForm(false);
      setEditingTransactionId(null);
      setTransactionType("expense");
      setTransactionAmount("");
      setTransactionDate("");
      setTransactionDescription("");
      setTransactionCategory("");

      setShowBudgetForm(false);
      setBudgetCategory("");
      setBudgetAmount("");

      setShowCategoryForm(false);
      setEditingCategoryId(null);
      setCategoryName("");
      setCategoryColor("#22c55e");
    } catch (error) {
      setError("Data was not reset. Please try again.");
    }
  }

  if (loading)
    return (
      <p
        style={{ justifyContent: "center", display: "flex", marginTop: "50px" }}
      >
        Loading data...
      </p>
    );
  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  const monthTransactions = data.transactions
    .filter(
      (transaction) => getMonthFromDate(transaction.date) === selectedMonth,
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const monthlySummary = calculateMonthlySummary(monthTransactions);

  const balance = monthlySummary.income - monthlySummary.expense;

  const monthlyBudgets = data.budgets.filter(
    (budget) => budget.month === selectedMonth,
  );

  const budgetSummaries = calculateBudgetSummaries(
    data.categories,
    monthlyBudgets,
    monthTransactions,
    selectedMonth,
  );

  const filteredTransactions = monthTransactions.filter((transaction) => {
    const matchesType =
      selectedType === "all" || transaction.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" ||
      String(transaction.category_id) === selectedCategory;
    const matchesSearch = (transaction.description || "")
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortOrder === "amount-asc")
      return amountToCents(a.amount) - amountToCents(b.amount);
    if (sortOrder === "amount-desc")
      return amountToCents(b.amount) - amountToCents(a.amount);
    return b.date.localeCompare(a.date) || b.id - a.id;
  });

  function handleResetButton() {
    const confirmed = window.confirm(
      "Are you sure you want to reset the application to its initial data? All current changes will be lost.",
    );
    if (confirmed) handleResetData();
  }

  function handleOpenAddCategory() {
    setEditingCategoryId(null);
    setCategoryName("");
    setCategoryColor("#22c55e");
    setCategoryError("");
    setShowCategoryForm(true);
  }

  function handleCategorySubmit(event) {
    if (editingCategoryId !== null) handleUpdateCategory(event);
    else handleAddCategory(event);
  }

  function handleCancelTransaction() {
    setShowForm(false);
    setFormError("");
    setEditingTransactionId(null);
  }

  function handleCancelCategory() {
    setShowCategoryForm(false);
    setCategoryError("");
    setEditingCategoryId(null);
    setCategoryName("");
    setCategoryColor("#22c55e");
  }

  function handleClearFilters() {
    setSearchText("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSortOrder("newest");
  }

  function handleOpenAddTransaction() {
    setEditingTransactionId(null);
    setTransactionType("expense");
    setTransactionAmount("");
    setTransactionDate("");
    setTransactionDescription("");
    setTransactionCategory("");
    setFormError("");
    setFieldErrors({});
    setShowForm(true);
  }

  return (
    <div className="app">
      <Header
        onAddTransaction={handleOpenAddTransaction}
        onResetData={handleResetButton}
        showForm={showForm}
      />

      {showForm && (
        <TransactionForm
          editingTransactionId={editingTransactionId}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          transactionAmount={transactionAmount}
          setTransactionAmount={setTransactionAmount}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          transactionDescription={transactionDescription}
          setTransactionDescription={setTransactionDescription}
          transactionCategory={transactionCategory}
          setTransactionCategory={setTransactionCategory}
          categories={data.categories}
          fieldErrors={fieldErrors}
          formError={formError}
          saving={saving}
          onSubmit={handleAddTransaction}
          onCancel={handleCancelTransaction}
        />
      )}

      <main className="main">
        <CategorySection
          categories={data.categories}
          showCategoryForm={showCategoryForm}
          editingCategoryId={editingCategoryId}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          categoryColor={categoryColor}
          setCategoryColor={setCategoryColor}
          categoryError={categoryError}
          savingCategory={savingCategory}
          onOpenAdd={handleOpenAddCategory}
          onSubmit={handleCategorySubmit}
          onCancel={handleCancelCategory}
          onEdit={(category) => {
            setEditingCategoryId(category.id);
            setCategoryName(category.name);
            setCategoryColor(category.color);
            setCategoryError("");
            setShowCategoryForm(true);
          }}
          onDelete={handleDeleteCategory}
        />

        <SummarySection
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
          formatMonth={formatMonth}
          monthlySummary={monthlySummary}
          balance={balance}
          formatCents={formatCents}
        />

        <BudgetSection
          selectedMonth={selectedMonth}
          formatMonth={formatMonth}
          showBudgetForm={showBudgetForm}
          setShowBudgetForm={setShowBudgetForm}
          onSaveBudget={handleSaveBudget}
          budgetCategory={budgetCategory}
          setBudgetCategory={setBudgetCategory}
          budgetAmount={budgetAmount}
          setBudgetAmount={setBudgetAmount}
          categories={data.categories}
          budgetError={budgetError}
          savingBudget={savingBudget}
          budgetSummaries={budgetSummaries}
          formatCents={formatCents}
          onDeleteBudget={handleDeleteBudget}
        />

        <TransactionSection
          searchText={searchText}
          setSearchText={setSearchText}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={data.categories}
          filteredTransactions={filteredTransactions}
          sortedTransactions={sortedTransactions}
          onClearFilters={handleClearFilters}
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
          formatCents={formatCents}
          amountToCents={amountToCents}
          monthTransactions={monthTransactions}
        />
      </main>
    </div>
  );
}

export default App;
