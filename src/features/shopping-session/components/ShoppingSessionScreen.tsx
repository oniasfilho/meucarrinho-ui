"use client";

import Link from "next/link";

import { ErrorMessage } from "@/shared/components/ErrorMessage/ErrorMessage";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator/LoadingIndicator";

import { useShoppingSessionController } from "../hooks/useShoppingSessionController";
import {
  formatCurrency,
  formatItemCount,
  formatSessionDate,
} from "../model/shoppingSession.formatters";
import { toShoppingSessionId } from "../model/shoppingSessionSummary.types";

import styles from "./ShoppingSessionScreen.module.css";

interface ShoppingSessionScreenProps {
  sessionId: string;
}

export function ShoppingSessionScreen({
  sessionId,
}: ShoppingSessionScreenProps) {
  const { errorMessage, isLoading, isNotFound, retry, session } =
    useShoppingSessionController(toShoppingSessionId(sessionId));

  if (isLoading) {
    return (
      <main className={styles.screen}>
        <LoadingIndicator label="Carregando sessão…" />
      </main>
    );
  }

  if (isNotFound) {
    return (
      <main className={styles.screen}>
        <h1 className={styles.title}>Sessão não encontrada</h1>
        <Link className={styles.backLink} href="/">
          Voltar para o início
        </Link>
      </main>
    );
  }

  if (errorMessage || !session) {
    return (
      <main className={styles.screen}>
        <ErrorMessage
          message={errorMessage ?? "Não foi possível carregar esta sessão."}
          onRetry={retry}
        />
      </main>
    );
  }

  return (
    <main className={styles.screen}>
      <Link className={styles.backLink} href="/">
        Voltar para o início
      </Link>

      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{session.name}</h1>
          <span className={styles.status}>
            {session.status === "active" ? "Ativa" : "Concluída"}
          </span>
        </div>
        <time className={styles.date} dateTime={session.createdAt}>
          {formatSessionDate(session.createdAt)}
        </time>
      </header>

      <dl className={styles.summary} aria-label="Resumo da sessão">
        <div className={styles.summaryItem}>
          <dt>Itens</dt>
          <dd>{formatItemCount(session.itemCount)}</dd>
        </div>
        <div className={styles.summaryItem}>
          <dt>Total</dt>
          <dd>{formatCurrency(session.total)}</dd>
        </div>
      </dl>

      {session.itemCount === 0 ? (
        <section className={styles.emptyItems}>
          <h2 className={styles.sectionTitle}>Itens da sessão</h2>
          <p>Sua sessão ainda não tem itens.</p>
        </section>
      ) : null}
    </main>
  );
}
