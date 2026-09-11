import type { ShoppingSessionItemDto } from "./shoppingSessionItem.dto";
import type { ShoppingSessionSummaryDto } from "./shoppingSessionSummary.dto";

export interface ShoppingSessionDetailDto extends ShoppingSessionSummaryDto {
  items: ShoppingSessionItemDto[];
}
