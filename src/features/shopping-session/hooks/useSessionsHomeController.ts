"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

import {
  useCreateSessionMutation,
  useGetSessionsQuery,
} from "../api/shoppingSession.api";
import { createDefaultSessionName } from "../model/shoppingSession.formatters";
import type {
  ShoppingSessionId,
  ShoppingSessionSummary,
} from "../model/shoppingSessionSummary.types";

interface SessionsHomeController {
  activeSessions: ShoppingSessionSummary[];
  isLoading: boolean;
  isCreating: boolean;
  loadErrorMessage?: string;
  createErrorMessage?: string;
  retry(): void;
  createSession(): Promise<void>;
  openSession(sessionId: ShoppingSessionId): void;
}

export function useSessionsHomeController(): SessionsHomeController {
  const router = useRouter();
  const {
    data: sessions = [],
    isError: hasLoadError,
    isLoading,
    refetch,
  } = useGetSessionsQuery();
  const [
    createSessionMutation,
    { isError: hasCreateError, isLoading: isCreating },
  ] = useCreateSessionMutation();
  const createLockRef = useRef(false);

  const activeSessions = useMemo(
    () => sessions.filter((session) => session.status === "active"),
    [sessions],
  );

  function retry(): void {
    void refetch();
  }

  async function createSession(): Promise<void> {
    if (createLockRef.current) {
      return;
    }

    createLockRef.current = true;

    try {
      const created = await createSessionMutation({
        name: createDefaultSessionName(new Date()),
      }).unwrap();

      router.push(`/sessions/${created.id}`);
    } catch {
      // RTK Query owns the mutation error rendered through screen state.
    } finally {
      createLockRef.current = false;
    }
  }

  function openSession(sessionId: ShoppingSessionId): void {
    router.push(`/sessions/${sessionId}`);
  }

  return {
    activeSessions,
    isLoading,
    isCreating,
    retry,
    createSession,
    openSession,
    ...(hasLoadError
      ? {
          loadErrorMessage:
            "Não foi possível carregar suas sessões. Tente novamente.",
        }
      : {}),
    ...(hasCreateError
      ? {
          createErrorMessage:
            "Não foi possível criar a sessão. Tente novamente.",
        }
      : {}),
  };
}
