"use client";

import { hasHttpStatus } from "@/shared/api/errors";

import {
  useCreateItemMutation,
  useGetSessionQuery,
  useUpdateItemQuantityMutation,
} from "../api/shoppingSession.api";
import type { ShoppingSessionDetail } from "../model/shoppingSessionDetail.types";
import type { ShoppingSessionId } from "../model/shoppingSessionSummary.types";

interface AddItemInput {
  name: string;
  unitPrice: number;
  quantity: number;
  note?: string | null | undefined;
}

interface ShoppingSessionController {
  session?: ShoppingSessionDetail;
  isLoading: boolean;
  isNotFound: boolean;
  isCreatingItem: boolean;
  errorMessage?: string;
  quantityErrorMessage?: string;
  createItemErrorMessage?: string;
  retry(): void;
  changeItemQuantity(itemId: string, quantity: number): void;
  createItem(input: AddItemInput): Promise<boolean>;
}

export function useShoppingSessionController(
  sessionId: ShoppingSessionId,
): ShoppingSessionController {
  const { data, error, isError, isLoading, refetch } =
    useGetSessionQuery(sessionId);
  const [updateItemQuantity, { isError: hasQuantityError }] =
    useUpdateItemQuantityMutation();
  const [createItemMutation, { isLoading: isCreatingItem, isError: hasCreateItemError }] =
    useCreateItemMutation();
  const isNotFound = hasHttpStatus(error, 404);

  function retry(): void {
    void refetch();
  }

  function changeItemQuantity(itemId: string, quantity: number): void {
    void updateItemQuantity({ sessionId, itemId, quantity });
  }

  async function createItem(input: AddItemInput): Promise<boolean> {
    try {
      await createItemMutation({ sessionId, ...input }).unwrap();

      return true;
    } catch {
      return false;
    }
  }

  return {
    isLoading,
    isNotFound,
    isCreatingItem,
    retry,
    changeItemQuantity,
    createItem,
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
    ...(hasCreateItemError
      ? {
          createItemErrorMessage:
            "Não foi possível adicionar o item. Tente novamente.",
        }
      : {}),
  };
}
