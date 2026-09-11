import type { ShoppingSessionId } from "./shoppingSessionSummary.types";

export interface CreateShoppingSessionInput {
  name: string;
}

export interface UpdateItemQuantityInput {
  sessionId: ShoppingSessionId;
  itemId: string;
  quantity: number;
}
