import styles from "./EmptySessionsState.module.css";

export function EmptySessionsState() {
  return (
    <section className={styles.emptyState}>
      <h2 className={styles.title}>Nenhuma sessão por aqui</h2>
      <p className={styles.description}>
        Crie uma sessão para começar a registrar os itens e acompanhar o total
        da sua próxima compra.
      </p>
    </section>
  );
}
