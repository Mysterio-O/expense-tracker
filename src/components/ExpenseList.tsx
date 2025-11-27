import type { Expense, Category } from '../types/expense';
import { CATEGORIES } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (
    id: string,
    updates: Partial<Pick<Expense, 'amount' | 'category'>>
  ) => void;
}

export function ExpenseList({
  expenses,
  onDeleteExpense,
  onUpdateExpense,
}: ExpenseListProps) {
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<Category, Expense[]>);

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses yet. Add your first expense above!</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this expense?'
    );
    if (confirmed) {
      onDeleteExpense(id);
    }
  };

  const handleAddAmount = (expense: Expense) => {
    const input = window.prompt(
      `Enter amount to add (current: ${expense.amount.toFixed(2)}):`,
      '0'
    );
    if (input === null) return; // cancelled

    const value = parseFloat(input);
    if (Number.isNaN(value) || value <= 0) {
      window.alert('Please enter a valid positive number to add.');
      return;
    }

    const newAmount = expense.amount + value;
    onUpdateExpense(expense.id, { amount: newAmount });
  };

  const handleSubtractAmount = (expense: Expense) => {
    const input = window.prompt(
      `Enter amount to subtract (current: ${expense.amount.toFixed(2)}):`,
      '0'
    );
    if (input === null) return; // cancelled

    const value = parseFloat(input);
    if (Number.isNaN(value) || value <= 0) {
      window.alert('Please enter a valid positive number to subtract.');
      return;
    }

    if (value > expense.amount) {
      window.alert('You cannot subtract more than the current amount.');
      return;
    }

    const newAmount = expense.amount - value;
    onUpdateExpense(expense.id, { amount: newAmount });
  };

  return (
    <div className="expense-list">
      {CATEGORIES.map((category) => {
        const categoryExpenses = groupedExpenses[category.value] || [];
        if (categoryExpenses.length === 0) return null;

        const categoryTotal = categoryExpenses.reduce(
          (sum, exp) => sum + exp.amount,
          0
        );

        return (
          <div key={category.value} className="category-section">
            <div className="category-header">
              <h3>{category.label}</h3>
              <span className="category-total">
                ${categoryTotal.toFixed(2)}
              </span>
            </div>
            <div className="expense-items">
              {categoryExpenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <span className="expense-name">{expense.name}</span>
                    <span className="expense-date">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="expense-actions">
                    <span className="expense-amount">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddAmount(expense)}
                      className="btn-add"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubtractAmount(expense)}
                      className="btn-subtract"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(expense.id)}
                      className="btn-delete"
                      aria-label="Delete expense"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
