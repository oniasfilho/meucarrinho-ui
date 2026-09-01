"use client";

import { hasHttpStatus } from "@/shared/api/errors";

import { useGetSessionQuery } from "../api/shoppingSession.api";
import type {
  ShoppingSession,
  ShoppingSessionId,
} from "../model/shoppingSession.types";

interface ShoppingSessionController {
  session?: ShoppingSession;
  isLoading: boolean;
  isNotFound: boolean;
  errorMessage?: string;
  retry(): void;
}

export function useShoppingSessionController(
  sessionId: ShoppingSessionId,
): ShoppingSessionController {
  const { data, error, isError, isLoading, refetch } =
    useGetSessionQuery(sessionId);
  const isNotFound = hasHttpStatus(error, 404);

  function retry(): void {
    void refetch();
  }

  return {
    isLoading,
    isNotFound,
    retry,
    ...(data ? { session: data } : {}),
    ...(isError && !isNotFound
      ? { errorMessage: "Não foi possível carregar esta sessão." }
      : {}),
  };
}
