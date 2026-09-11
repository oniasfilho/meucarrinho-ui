import "server-only";

import type {
  CreateShoppingSessionItemRequestDto,
  CreateShoppingSessionRequestDto,
  UpdateItemQuantityRequestDto,
} from "@/contracts/shopping-session/shoppingSession.requests";
import type { ShoppingSessionDetailDto } from "@/contracts/shopping-session/shoppingSessionDetail.dto";
import type { ShoppingSessionSummaryDto } from "@/contracts/shopping-session/shoppingSessionSummary.dto";
import { apiFetch } from "@/server/http/apiClient";

export function listShoppingSessions(): Promise<ShoppingSessionSummaryDto[]> {
  return apiFetch<ShoppingSessionSummaryDto[]>("/sessions");
}

export function createShoppingSession(
  input: CreateShoppingSessionRequestDto,
): Promise<ShoppingSessionDetailDto> {
  return apiFetch<ShoppingSessionDetailDto>("/sessions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getShoppingSession(
  sessionId: string,
): Promise<ShoppingSessionDetailDto> {
  return apiFetch<ShoppingSessionDetailDto>(`/sessions/${sessionId}`);
}

export function createShoppingSessionItem(
  sessionId: string,
  input: CreateShoppingSessionItemRequestDto,
): Promise<ShoppingSessionDetailDto> {
  return apiFetch<ShoppingSessionDetailDto>(`/sessions/${sessionId}/items`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateShoppingSessionItemQuantity(
  sessionId: string,
  itemId: string,
  input: UpdateItemQuantityRequestDto,
): Promise<ShoppingSessionDetailDto> {
  return apiFetch<ShoppingSessionDetailDto>(
    `/sessions/${sessionId}/items/${itemId}/quantity`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}
