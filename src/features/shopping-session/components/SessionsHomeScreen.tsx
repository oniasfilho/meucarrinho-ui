"use client";

import { ErrorMessage } from "@/shared/components/ErrorMessage/ErrorMessage";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator/LoadingIndicator";

import { useSessionsHomeController } from "../hooks/useSessionsHomeController";
import { ActiveSessionCard } from "./ActiveSessionCard";
import { CreateSessionButton } from "./CreateSessionButton";
import { EmptySessionsState } from "./EmptySessionsState";
import { SessionsHomeHeader } from "./SessionsHomeHeader";

import styles from "./SessionsHomeScreen.module.css";

export function SessionsHomeScreen() {
  const {
    activeSessions,
    createErrorMessage,
    createSession,
    isCreating,
    isLoading,
    loadErrorMessage,
    openSession,
    retry,
  } = useSessionsHomeController();

  let dataState: React.ReactNode;

  if (isLoading) {
    dataState = <LoadingIndicator label="Carregando sessões…" />;
  } else if (loadErrorMessage) {
    dataState = <ErrorMessage message={loadErrorMessage} onRetry={retry} />;
  } else if (activeSessions.length === 0) {
    dataState = <EmptySessionsState />;
  } else {
    dataState = (
      <section aria-labelledby="active-sessions-title">
        <h2 className={styles.sectionTitle} id="active-sessions-title">
          Sessões ativas
        </h2>
        <ul className={styles.sessionList}>
          {activeSessions.map((session) => (
            <li key={session.id}>
              <ActiveSessionCard session={session} onOpen={openSession} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <main className={styles.screen}>
      <SessionsHomeHeader />
      <div className={styles.createAction}>
        <CreateSessionButton
          isCreating={isCreating}
          onCreate={() => void createSession()}
        />
        {createErrorMessage ? (
          <p className={styles.createError} role="alert">
            {createErrorMessage}
          </p>
        ) : null}
      </div>
      {dataState}
    </main>
  );
}
