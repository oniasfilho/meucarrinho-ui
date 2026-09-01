type Brand<T, Name extends string> = T & {
  readonly __brand: Name;
};

export type ShoppingSessionId = Brand<string, "ShoppingSessionId">;
export type ShoppingSessionStatus = "active" | "completed";

export interface ShoppingSession {
  id: ShoppingSessionId;
  name: string;
  status: ShoppingSessionStatus;
  itemCount: number;
  total: number;
  createdAt: string;
}

export interface CreateShoppingSessionInput {
  name: string;
}

export function toShoppingSessionId(value: string): ShoppingSessionId {
  return value as ShoppingSessionId;
}
