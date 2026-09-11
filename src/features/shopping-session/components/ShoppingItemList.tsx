import type { ShoppingSessionItem } from "../model/shoppingSessionItem.types";

import { ShoppingItemRow } from "./ShoppingItemRow";
import styles from "./ShoppingItemList.module.css";

interface ShoppingItemListProps {
  items: ShoppingSessionItem[];
}

export function ShoppingItemList({ items }: ShoppingItemListProps) {
  return (
    <section aria-labelledby="session-items-title">
      <h2 className={styles.sectionTitle} id="session-items-title">
        Itens da sessão
      </h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <ShoppingItemRow item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
