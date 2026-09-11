import { formatCurrency } from "../model/shoppingSession.formatters";
import type { ShoppingSessionItem } from "../model/shoppingSessionItem.types";

import styles from "./ShoppingItemRow.module.css";

interface ShoppingItemRowProps {
  item: ShoppingSessionItem;
}

export function ShoppingItemRow({ item }: ShoppingItemRowProps) {
  const subtotal = item.unitPrice * item.quantity;

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.quantity}>
          {item.quantity} × {formatCurrency(item.unitPrice)}
        </span>
      </div>
      {item.note ? <p className={styles.note}>{item.note}</p> : null}
      <strong className={styles.subtotal}>{formatCurrency(subtotal)}</strong>
    </div>
  );
}
