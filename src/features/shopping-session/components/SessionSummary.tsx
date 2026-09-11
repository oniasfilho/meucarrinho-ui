import { formatCurrency, formatItemCount } from "../model/shoppingSession.formatters";

import { BudgetProgress } from "./BudgetProgress";
import styles from "./SessionSummary.module.css";

interface SessionSummaryProps {
  itemCount: number;
  total: number;
  budget: number | null;
  remainingBudget: number | null;
  overBudget: boolean;
}

export function SessionSummary({
  itemCount,
  total,
  budget,
  remainingBudget,
  overBudget,
}: SessionSummaryProps) {
  return (
    <div className={styles.container}>
      <dl className={styles.summary} aria-label="Resumo da sessão">
        <div className={styles.summaryItem}>
          <dt>Itens</dt>
          <dd>{formatItemCount(itemCount)}</dd>
        </div>
        <div className={styles.summaryItem}>
          <dt>Total</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
      </dl>
      {budget !== null ? (
        <BudgetProgress
          budget={budget}
          total={total}
          remainingBudget={remainingBudget}
          overBudget={overBudget}
        />
      ) : null}
    </div>
  );
}
