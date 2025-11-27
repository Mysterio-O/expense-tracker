export type Category = 'groceries' | 'debts' | 'utilities' | 'transportation' | 'entertainment' | 'healthcare' | 'other';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: Category;
  date: string;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'groceries', label: 'Groceries' },
  { value: 'debts', label: 'Debts' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'other', label: 'Other' },
];
