import { useState } from 'react';
import type { Category } from '../types/expense';
import { CATEGORIES } from '../types/expense';

interface ExpenseFormProps {
  onAddExpense: (name: string, amount: number, category: Category) => void;
}

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('groceries');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid expense name and amount');
      return;
    }

    onAddExpense(name.trim(), parseFloat(amount), category);
    setName('');
    setAmount('');
    setCategory('groceries');
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label htmlFor="name">Expense Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Weekly groceries"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount ($)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary">
        Add Expense
      </button>
    </form>
  );
}
