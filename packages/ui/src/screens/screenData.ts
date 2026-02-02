// Shared demo data for screens - single source of truth

export interface StatData {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

export interface TransactionData {
  id: string;
  icon: string;
  title: string;
  category: string;
  amount: number;
  date?: string;
}

export interface CategoryData {
  name: string;
  percentage: number;
  spent: number;
  budget: number;
  color: string;
}

export interface AccountData {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  institution: string;
  balance: number;
  color: string;
}

// Demo data
export const statsData: StatData[] = [
  { label: 'Saving', value: '$565', change: '+10%', changeType: 'positive' },
  { label: 'Debts', value: '$597', change: '-0.2%', changeType: 'negative' },
];

export const transactionsData: TransactionData[] = [
  { id: '1', icon: '🥬', title: 'Fruits & Vegetables', category: 'Groceries', amount: -100, date: 'Today' },
  { id: '2', icon: '💰', title: 'From Bank to Cash', category: 'Transfer', amount: 700, date: 'Today' },
  { id: '3', icon: '🍔', title: 'Burger', category: 'Groceries', amount: -5.45, date: 'Yesterday' },
  { id: '4', icon: '💰', title: 'From Bank to Cash', category: 'Transfer', amount: 1200, date: 'Yesterday' },
  { id: '5', icon: '🛒', title: 'Weekly Shopping', category: 'Groceries', amount: -85.50, date: 'Jan 28' },
  { id: '6', icon: '⛽', title: 'Gas Station', category: 'Transportation', amount: -45.00, date: 'Jan 27' },
  { id: '7', icon: '🎬', title: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'Jan 26' },
  { id: '8', icon: '💡', title: 'Electric Bill', category: 'Utilities', amount: -120.00, date: 'Jan 25' },
];

export const categoriesData: CategoryData[] = [
  { name: 'Groceries', percentage: 20, spent: 583, budget: 610, color: '#6366f1' },
  { name: 'Transportation', percentage: 18, spent: 216, budget: 430, color: '#f59e0b' },
  { name: 'Housing', percentage: 16, spent: 362, budget: 750, color: '#10b981' },
  { name: 'Personal', percentage: 14, spent: 280, budget: 400, color: '#ec4899' },
];

export const accountsData: AccountData[] = [
  { id: '1', name: 'Main Checking', type: 'checking', institution: 'Chase Bank', balance: 4520.50, color: '#6366f1' },
  { id: '2', name: 'Savings Account', type: 'savings', institution: 'Chase Bank', balance: 12350.00, color: '#10b981' },
  { id: '3', name: 'Credit Card', type: 'credit', institution: 'American Express', balance: -1250.75, color: '#f59e0b' },
  { id: '4', name: 'Cash', type: 'cash', institution: 'Cash on hand', balance: 350.00, color: '#ec4899' },
];

export const transactionCategories = [
  { id: 'groceries', emoji: '🛒', label: 'Groceries' },
  { id: 'transport', emoji: '🚗', label: 'Transportation' },
  { id: 'entertainment', emoji: '🎬', label: 'Entertainment' },
  { id: 'utilities', emoji: '💡', label: 'Utilities' },
  { id: 'food', emoji: '🍔', label: 'Food & Dining' },
  { id: 'health', emoji: '💊', label: 'Health' },
  { id: 'shopping', emoji: '🛍️', label: 'Shopping' },
  { id: 'other', emoji: '📦', label: 'Other' },
];

// Helper functions
export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (amount < 0) {
    return `-$${formatted}`;
  }
  return `$${formatted}`;
}

export function formatTransactionAmount(amount: number): string {
  if (amount > 0) {
    return `+${formatCurrency(amount)}`;
  }
  return formatCurrency(amount);
}
