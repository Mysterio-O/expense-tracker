interface TotalDisplayProps {
  total: number;
}

export function TotalDisplay({ total }: TotalDisplayProps) {
  return (
    <div className="total-display">
      <span className="total-label">Total Expenses</span>
      <span className="total-amount">${total.toFixed(2)}</span>
    </div>
  );
}
