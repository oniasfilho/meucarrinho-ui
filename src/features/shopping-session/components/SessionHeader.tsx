import { formatSessionDate } from "../model/shoppingSession.formatters";
import type { ShoppingSessionStatus } from "../model/shoppingSessionSummary.types";

import styles from "./SessionHeader.module.css";

interface SessionHeaderProps {
  name: string;
  storeName: string | null;
  status: ShoppingSessionStatus;
  createdAt: string;
}

export function SessionHeader({
  name,
  storeName,
  status,
  createdAt,
}: SessionHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{name}</h1>
        <span className={styles.status}>
          {status === "active" ? "Ativa" : "Concluída"}
        </span>
      </div>
      {storeName ? <p className={styles.storeName}>{storeName}</p> : null}
      <time className={styles.date} dateTime={createdAt}>
        {formatSessionDate(createdAt)}
      </time>
    </header>
  );
}
