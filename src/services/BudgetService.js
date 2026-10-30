import initialData from "../../budget-data.json";

const STORAGE_KEY = "budget-tracker-data";

function delay() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 500);
  });
}

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData !== null) {
    return JSON.parse(savedData);
  }

  return JSON.parse(JSON.stringify(initialData));
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getTransactions() {
  await delay();

  if (window.location.search.includes("fail=1")) {
    throw new Error("Failed to load transactions.");
  }

  const data = loadData();
  return data.transactions;
}

export async function getCategories() {
  await delay();

  if (window.location.search.includes("fail=1")) {
    throw new Error("Failed to load categories.");
  }

  const data = loadData();
  return data.categories;
}

export async function getBudgets() {
  await delay();

  if (window.location.search.includes("fail=1")) {
    throw new Error("Failed to load budgets.");
  }

  const data = loadData();
  return data.budgets;
}

export async function getAllData() {
  await delay();

  if (window.location.search.includes("fail=1")) {
    throw new Error("Failed to load budget data.");
  }

  return loadData();
}

export async function resetData() {
  await delay();
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(initialData));
}

export async function addTransaction(transaction) {
  await delay();

  const data = loadData();

  const newTransaction = {
    ...transaction,
    id: Date.now(),
  };

  data.transactions.push(newTransaction);

  saveData(data);

  return newTransaction;
}

export async function deleteTransaction(transactionId) {
  await delay();

  const data = loadData();

  const transactionExists = data.transactions.some(function (transaction) {
    return transaction.id === transactionId;
  });

  if (!transactionExists) {
    throw new Error("Transaction not found.");
  }

  data.transactions = data.transactions.filter(function (transaction) {
    return transaction.id !== transactionId;
  });

  saveData(data);
}

export async function updateTransaction(transactionId, updatedFields) {
  await delay();

  const data = loadData();

  const transactionIndex = data.transactions.findIndex(function (transaction) {
    return transaction.id === transactionId;
  });

  if (transactionIndex === -1) {
    throw new Error("Transaction not found.");
  }

  data.transactions[transactionIndex] = {
    ...data.transactions[transactionIndex],
    ...updatedFields,
    id: transactionId,
  };

  saveData(data);

  return data.transactions[transactionIndex];
}

export async function saveBudget(month, categoryId, amount) {
  await delay();

  const data = loadData();

  const existingBudget = data.budgets.find(function (budget) {
    return budget.month === month && budget.category_id === Number(categoryId);
  });

  if (existingBudget) {
    existingBudget.amount = Number(amount).toFixed(2);
  } else {
    data.budgets.push({
      month: month,
      category_id: Number(categoryId),
      amount: Number(amount).toFixed(2),
    });
  }

  saveData(data);

  return data.budgets.find(function (budget) {
    return budget.month === month && budget.category_id === Number(categoryId);
  });
}

export async function addCategory(category) {
  await delay();

  const data = loadData();

  const newCategory = {
    ...category,
    id: Date.now(),
  };

  data.categories.push(newCategory);

  saveData(data);

  return newCategory;
}

export async function updateCategory(categoryId, updatedFields) {
  await delay();

  const data = loadData();

  const categoryIndex = data.categories.findIndex(function (category) {
    return category.id === categoryId;
  });

  if (categoryIndex === -1) {
    throw new Error("Category not found.");
  }

  data.categories[categoryIndex] = {
    ...data.categories[categoryIndex],
    ...updatedFields,
    id: categoryId,
  };

  saveData(data);

  return data.categories[categoryIndex];
}

export async function deleteCategory(categoryId) {
  await delay();

  const data = loadData();

  const categoryExists = data.categories.some(function (category) {
    return category.id === categoryId;
  });

  if (!categoryExists) {
    throw new Error("Category not found.");
  }

  const categoryInUse = data.transactions.some(function (transaction) {
    return transaction.category_id === categoryId;
  });

  if (categoryInUse) {
    throw new Error(
      "This category can't be deleted because it has related transactions.",
    );
  }

  data.categories = data.categories.filter(function (category) {
    return category.id !== categoryId;
  });

  data.budgets = data.budgets.filter(function (budget) {
    return budget.category_id !== categoryId;
  });

  saveData(data);
}

export async function deleteBudget(month, categoryId) {
  await delay();

  const data = loadData();

  const budgetExists = data.budgets.some(function (budget) {
    return (
      budget.month === month &&
      Number(budget.category_id) === Number(categoryId)
    );
  });

  if (!budgetExists) {
    throw new Error("Budget not found.");
  }

  data.budgets = data.budgets.filter(function (budget) {
    return !(
      budget.month === month &&
      Number(budget.category_id) === Number(categoryId)
    );
  });

  saveData(data);
}
