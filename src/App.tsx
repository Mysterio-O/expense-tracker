// src/App.tsx
import { useMemo, useState } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { TotalDisplay } from './components/TotalDisplay';
import { TransactionLog } from './components/TransactionLog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePWAInstallPrompt } from './hooks/usePWAInstallPrompt';
import type { Expense, Category } from './types/expense';
import type { Transaction, TransactionKind } from './types/transaction';
import './App.css';

function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    'transactions',
    []
  );
  const [showTransactions, setShowTransactions] = useState(false);
  const { canInstall, promptInstall } = usePWAInstallPrompt();

  const addTransaction = (
    expense: Expense,
    kind: TransactionKind,
    change: number,
    previousAmount: number | null,
    newAmount: number | null
  ) => {
    const tx: Transaction = {
      id: crypto.randomUUID(),
      expenseId: expense.id,
      expenseName: expense.name,
      kind,
      change,
      previousAmount,
      newAmount,
      timestamp: new Date().toISOString(),
    };

    setTransactions((prev) => [tx, ...prev]);
  };

  const handleAddExpense = (name: string, amount: number, category: Category) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      name,
      amount,
      category,
      date: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    // log creation
    addTransaction(newExpense, 'created', amount, 0, amount);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => {
      const exp = prev.find((e) => e.id === id);
      if (exp) {
        addTransaction(exp, 'deleted', -exp.amount, exp.amount, 0);
      }
      return prev.filter((expense) => expense.id !== id);
    });
  };

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const handleUpdateExpense = (
    id: string,
    updates: Partial<Pick<Expense, 'amount' | 'category'>>
  ) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== id) return exp;

        const previousAmount = exp.amount;
        const newAmount = updates.amount ?? exp.amount;
        const delta = newAmount - previousAmount;

        if (delta !== 0) {
          const kind: TransactionKind = delta > 0 ? 'added' : 'subtracted';
          addTransaction(exp, kind, delta, previousAmount, newAmount);
        }

        return { ...exp, ...updates };
      })
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const handleClearTransactions = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all transactions?'
    );
    if (!confirmed) return;
    setTransactions([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track your expenses offline</p>
      </header>

      {canInstall && (
        <div className="install-banner">
          <span>Install this app for a better experience.</span>
          <button type="button" onClick={promptInstall}>
            Install
          </button>
        </div>
      )}

      <main className="app-main">
        <div className="container">
          <TotalDisplay total={total} />

          <section className="add-expense-section">
            <h2>Add New Expense</h2>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </section>

          <section className="expenses-section">
            <h2>Your Expenses</h2>
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              onUpdateExpense={handleUpdateExpense}
            />
          </section>

          <section className="transactions-toggle-section">
            <button
              type="button"
              className="btn-toggle-transactions"
              onClick={() => setShowTransactions((prev) => !prev)}
            >
              {showTransactions ? 'Hide Transaction Log' : 'Show Transaction Log'}
            </button>
          </section>

          {showTransactions && (
            <section className="transactions-section">
              <TransactionLog
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                onClearAll={handleClearTransactions}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
