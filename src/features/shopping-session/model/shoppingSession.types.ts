import type { ShoppingSessionId } from "./shoppingSessionSummary.types";

export interface CreateShoppingSessionInput {
  name: string;
}

export interface UpdateItemQuantityInput {
  sessionId: ShoppingSessionId;
  itemId: string;
  quantity: number;
}

export interface CreateShoppingSessionItemInput {
  sessionId: ShoppingSessionId;
  name: string;
  unitPrice: number;
  quantity: number;
  note?: string | null | undefined;
}
