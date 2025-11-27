export type TransactionKind = 'created' | 'added' | 'subtracted' | 'deleted';

export interface Transaction {
    id: string;
    expenseId: string;
    expenseName: string;
    kind: TransactionKind;
    change: number;          // positive = added, negative = removed
    previousAmount: number | null;
    newAmount: number | null;
    timestamp: string;       // ISO string
}
