import styles from "./SessionsHomeHeader.module.css";

export function SessionsHomeHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>MeuCarrinho</h1>
      <p className={styles.description}>
        Organize suas compras e acompanhe cada sessão em um só lugar.
      </p>
    </header>
  );
}
