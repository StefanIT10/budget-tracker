import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import App from "./App";
import { getAllData, addTransaction } from "./services/BudgetService";
import userEvent from "@testing-library/user-event";

afterEach(function () {
  cleanup();
});

vi.mock("./services/BudgetService", () => ({
  getAllData: vi.fn(),
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  saveBudget: vi.fn(),
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  deleteBudget: vi.fn(),
  resetData: vi.fn(),
}));

const initialData = {
  categories: [
    { id: 1, name: "Groceries", color: "#2E7D32" },
    { id: 2, name: "Transport", color: "#1565C0" },
    { id: 3, name: "Salary", color: "#6A1B9A" },
  ],
  transactions: [
    {
      id: 12,
      type: "expense",
      amount: "45.10",
      date: "2026-10-03",
      description: "Weekly shopping",
      category_id: 1,
    },
    {
      id: 13,
      type: "expense",
      amount: "25.00",
      date: "2026-10-05",
      description: "Bus ticket",
      category_id: 2,
    },
    {
      id: 14,
      type: "income",
      amount: "1500.00",
      date: "2026-10-01",
      description: "Salary",
      category_id: 3,
    },
  ],
  budgets: [
    { month: "2026-10", category_id: 1, amount: "200.00" },
    { month: "2026-10", category_id: 2, amount: "80.00" },
  ],
};

describe("Transaction form validation", function () {
  beforeEach(function () {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/");
    getAllData.mockResolvedValue(initialData);
  });

  async function openTransactionForm() {
    render(<App />);

    await screen.findByRole("heading", {
      name: "Budget Tracker",
      level: 1,
    });

    fireEvent.click(screen.getByRole("button", { name: "Add transaction" }));

    await screen.findByText("New transaction");
  }

  async function submitInvalidTransaction(amount, date, category) {
    await openTransactionForm();

    const user = userEvent.setup();

    await user.clear(screen.getByLabelText("Amount"));

    if (amount !== "") {
      await user.type(screen.getByLabelText("Amount"), amount);
    }

    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: date },
    });

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: category },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save transaction" }));
  }

  it("should show an error when amount is empty", async function () {
    await submitInvalidTransaction("", "2026-10-10", "1");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The amount must be greater than 0",
    );

    expect(addTransaction).not.toHaveBeenCalled();
  });

  it("should reject a negative amount", async function () {
    await submitInvalidTransaction("-10", "2026-10-10", "1");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The amount must be greater than 0",
    );

    expect(addTransaction).not.toHaveBeenCalled();
  });

  it("should reject an amount with more than two decimal places", async function () {
    await submitInvalidTransaction("10.999", "2026-10-10", "1");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "maximum of two decimal places",
    );

    expect(addTransaction).not.toHaveBeenCalled();
  });

  it("should reject an invalid date", async function () {
    await submitInvalidTransaction("10", "2026-02-30", "1");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please select a valid transaction date.",
    );

    expect(addTransaction).not.toHaveBeenCalled();
  });

  it("should reject a missing category", async function () {
    await submitInvalidTransaction("10", "2026-10-10", "");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please select a valid category.",
    );

    expect(addTransaction).not.toHaveBeenCalled();
  });

  it("should save a valid transaction", async function () {
    await openTransactionForm();

    fireEvent.change(screen.getByLabelText("Amount"), {
      target: { value: "100.50" },
    });

    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-10-10" },
    });

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New purchase" },
    });

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "1" },
    });

    addTransaction.mockResolvedValue({
      id: 99,
      type: "expense",
      amount: "100.50",
      date: "2026-10-10",
      description: "New purchase",
      category_id: 1,
    });

    fireEvent.click(screen.getByRole("button", { name: "Save transaction" }));

    await waitFor(function () {
      expect(addTransaction).toHaveBeenCalledWith({
        type: "expense",
        amount: "100.50",
        date: "2026-10-10",
        description: "New purchase",
        category_id: 1,
      });
    });
  });
});
