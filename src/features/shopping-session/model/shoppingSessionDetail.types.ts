import type { ShoppingSessionItem } from "./shoppingSessionItem.types";
import type { ShoppingSessionSummary } from "./shoppingSessionSummary.types";

export interface ShoppingSessionDetail extends ShoppingSessionSummary {
  items: ShoppingSessionItem[];
}
