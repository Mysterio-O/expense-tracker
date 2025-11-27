// src/components/TransactionLog.tsx
import type { Transaction } from '../types/transaction';

interface TransactionLogProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: string) => void;
    onClearAll: () => void;
}

export function TransactionLog({
    transactions,
    onDeleteTransaction,
    onClearAll,
}: TransactionLogProps) {
    if (transactions.length === 0) {
        return (
            <div className="transaction-log empty-state">
                <h2>Transaction Log</h2>
                <p>No transactions yet.</p>
            </div>
        );
    }

    return (
        <div className="transaction-log">
            <div className="transaction-log-header">
                <h2>Transaction Log</h2>
                <button
                    type="button"
                    className="btn-clear-transactions"
                    onClick={onClearAll}
                >
                    Clear All
                </button>
            </div>

            <ul className="transaction-list">
                {transactions.map((tx) => (
                    <li key={tx.id} className="transaction-item">
                        <div className="transaction-main">
                            <span className="transaction-kind">
                                {tx.kind.charAt(0).toUpperCase() + tx.kind.slice(1)}
                            </span>
                            <span className="transaction-expense">
                                {tx.expenseName}
                            </span>
                        </div>
                        <div className="transaction-details">
                            <span
                                className={`transaction-change ${tx.change >= 0 ? 'positive' : 'negative'
                                    }`}
                            >
                                {tx.change >= 0 ? '+' : ''}
                                {tx.change.toFixed(2)}
                            </span>
                            <span className="transaction-amounts">
                                {tx.previousAmount !== null && tx.newAmount !== null && (
                                    <> {tx.previousAmount.toFixed(2)} → {tx.newAmount.toFixed(2)} </>
                                )}
                            </span>
                            <span className="transaction-time">
                                {new Date(tx.timestamp).toLocaleString()}
                            </span>
                            <button
                                type="button"
                                className="btn-delete-transaction"
                                onClick={() => onDeleteTransaction(tx.id)}
                                aria-label="Delete transaction"
                            >
                                ×
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
