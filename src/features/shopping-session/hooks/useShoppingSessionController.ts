"use client";

import { hasHttpStatus } from "@/shared/api/errors";

import {
  useGetSessionQuery,
  useUpdateItemQuantityMutation,
} from "../api/shoppingSession.api";
import type { ShoppingSessionDetail } from "../model/shoppingSessionDetail.types";
import type { ShoppingSessionId } from "../model/shoppingSessionSummary.types";

interface ShoppingSessionController {
  session?: ShoppingSessionDetail;
  isLoading: boolean;
  isNotFound: boolean;
  errorMessage?: string;
  quantityErrorMessage?: string;
  retry(): void;
  changeItemQuantity(itemId: string, quantity: number): void;
}

export function useShoppingSessionController(
  sessionId: ShoppingSessionId,
): ShoppingSessionController {
  const { data, error, isError, isLoading, refetch } =
    useGetSessionQuery(sessionId);
  const [updateItemQuantity, { isError: hasQuantityError }] =
    useUpdateItemQuantityMutation();
  const isNotFound = hasHttpStatus(error, 404);

  function retry(): void {
    void refetch();
  }

  function changeItemQuantity(itemId: string, quantity: number): void {
    void updateItemQuantity({ sessionId, itemId, quantity });
  }

  return {
    isLoading,
    isNotFound,
    retry,
    changeItemQuantity,
    ...(data ? { session: data } : {}),
    ...(isError && !isNotFound
      ? { errorMessage: "Não foi possível carregar esta sessão." }
      : {}),
    ...(hasQuantityError
      ? {
          quantityErrorMessage:
            "Não foi possível atualizar a quantidade. Tente novamente.",
        }
      : {}),
  };
}
