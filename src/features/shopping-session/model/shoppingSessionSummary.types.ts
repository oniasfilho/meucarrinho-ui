type Brand<T, Name extends string> = T & {
  readonly __brand: Name;
};

export type ShoppingSessionId = Brand<string, "ShoppingSessionId">;
export type ShoppingSessionStatus = "active" | "completed";

export interface ShoppingSessionSummary {
  id: ShoppingSessionId;
  name: string;
  storeName: string | null;
  budget: number | null;
  status: ShoppingSessionStatus;
  itemCount: number;
  total: number;
  remainingBudget: number | null;
  overBudget: boolean;
  createdAt: string;
  completedAt: string | null;
}

export function toShoppingSessionId(value: string): ShoppingSessionId {
  return value as ShoppingSessionId;
}
