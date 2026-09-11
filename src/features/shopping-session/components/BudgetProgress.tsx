import { formatCurrency } from "../model/shoppingSession.formatters";

import styles from "./BudgetProgress.module.css";

interface BudgetProgressProps {
  budget: number;
  total: number;
  remainingBudget: number | null;
  overBudget: boolean;
}

export function BudgetProgress({
  budget,
  total,
  remainingBudget,
  overBudget,
}: BudgetProgressProps) {
  const usedPercentage = budget > 0 ? Math.min(100, (total / budget) * 100) : 0;

  return (
    <div className={styles.progress}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Orçamento utilizado"
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={Math.min(total, budget)}
      >
        <div
          className={overBudget ? styles.fillOverBudget : styles.fill}
          style={{ width: `${usedPercentage}%` }}
        />
      </div>
      <p className={overBudget ? styles.overBudgetText : styles.text}>
        {overBudget
          ? `Orçamento estourado em ${formatCurrency(Math.abs(remainingBudget ?? 0))}`
          : `Restam ${formatCurrency(remainingBudget ?? 0)} de ${formatCurrency(budget)}`}
      </p>
    </div>
  );
}
