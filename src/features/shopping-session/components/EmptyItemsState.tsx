import styles from "./EmptyItemsState.module.css";

export function EmptyItemsState() {
  return (
    <section className={styles.emptyItems}>
      <h2 className={styles.sectionTitle}>Itens da sessão</h2>
      <p>Sua sessão ainda não tem itens.</p>
    </section>
  );
}
