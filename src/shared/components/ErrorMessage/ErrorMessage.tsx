import { Button } from "@/shared/components/Button/Button";

import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message,
  retryLabel,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <p className={styles.message}>{message}</p>
      {onRetry ? (
        <Button onClick={onRetry}>{retryLabel ?? "Tentar novamente"}</Button>
      ) : null}
    </div>
  );
}
