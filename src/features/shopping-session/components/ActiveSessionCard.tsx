import {
  formatCurrency,
  formatItemCount,
  formatSessionDate,
} from "../model/shoppingSession.formatters";
import type {
  ShoppingSession,
  ShoppingSessionId,
} from "../model/shoppingSession.types";

import styles from "./ActiveSessionCard.module.css";

interface ActiveSessionCardProps {
  session: ShoppingSession;
  onOpen(sessionId: ShoppingSessionId): void;
}

export function ActiveSessionCard({ session, onOpen }: ActiveSessionCardProps) {
  return (
    <button
      className={styles.card}
      type="button"
      aria-label={`Abrir sessão ${session.name}`}
      onClick={() => onOpen(session.id)}
    >
      <span className={styles.heading}>
        <span className={styles.name}>{session.name}</span>
        <span className={styles.status}>Ativa</span>
      </span>
      <time className={styles.date} dateTime={session.createdAt}>
        {formatSessionDate(session.createdAt)}
      </time>
      <span className={styles.summary}>
        <span>{formatItemCount(session.itemCount)}</span>
        <strong>{formatCurrency(session.total)}</strong>
      </span>
    </button>
  );
}
