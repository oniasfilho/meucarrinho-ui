import { formatCurrency } from "../model/shoppingSession.formatters";
import type { ShoppingSessionItem } from "../model/shoppingSessionItem.types";

import styles from "./ShoppingItemRow.module.css";

interface ShoppingItemRowProps {
  item: ShoppingSessionItem;
  onQuantityChange(itemId: string, quantity: number): void;
}

export function ShoppingItemRow({ item, onQuantityChange }: ShoppingItemRowProps) {
  const subtotal = item.unitPrice * item.quantity;

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <span className={styles.name}>{item.name}</span>
        <div className={styles.stepper}>
          <button
            className={styles.stepperButton}
            type="button"
            aria-label={`Diminuir quantidade de ${item.name}`}
            disabled={item.quantity <= 1}
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            −
          </button>
          <span className={styles.quantity}>
            {item.quantity} × {formatCurrency(item.unitPrice)}
          </span>
          <button
            className={styles.stepperButton}
            type="button"
            aria-label={`Aumentar quantidade de ${item.name}`}
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      {item.note ? <p className={styles.note}>{item.note}</p> : null}
      <strong className={styles.subtotal}>{formatCurrency(subtotal)}</strong>
    </div>
  );
}
