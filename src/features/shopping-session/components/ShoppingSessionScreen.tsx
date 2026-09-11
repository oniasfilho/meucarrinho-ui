"use client";

import Link from "next/link";

import { ErrorMessage } from "@/shared/components/ErrorMessage/ErrorMessage";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator/LoadingIndicator";

import { useShoppingSessionController } from "../hooks/useShoppingSessionController";
import { toShoppingSessionId } from "../model/shoppingSessionSummary.types";
import { EmptyItemsState } from "./EmptyItemsState";
import { SessionHeader } from "./SessionHeader";
import { SessionSummary } from "./SessionSummary";
import { ShoppingItemList } from "./ShoppingItemList";

import styles from "./ShoppingSessionScreen.module.css";

interface ShoppingSessionScreenProps {
  sessionId: string;
}

export function ShoppingSessionScreen({
  sessionId,
}: ShoppingSessionScreenProps) {
  const {
    changeItemQuantity,
    errorMessage,
    isLoading,
    isNotFound,
    quantityErrorMessage,
    retry,
    session,
  } = useShoppingSessionController(toShoppingSessionId(sessionId));

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

      <SessionHeader
        name={session.name}
        storeName={session.storeName}
        status={session.status}
        createdAt={session.createdAt}
      />

      <SessionSummary
        itemCount={session.itemCount}
        total={session.total}
        budget={session.budget}
        remainingBudget={session.remainingBudget}
        overBudget={session.overBudget}
      />

      {quantityErrorMessage ? (
        <p className={styles.quantityError} role="alert">
          {quantityErrorMessage}
        </p>
      ) : null}

      {session.items.length === 0 ? (
        <EmptyItemsState />
      ) : (
        <ShoppingItemList
          items={session.items}
          onQuantityChange={changeItemQuantity}
        />
      )}
    </main>
  );
}
