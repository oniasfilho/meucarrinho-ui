import type { ShoppingSessionDetailDto } from "@/contracts/shopping-session/shoppingSessionDetail.dto";
import type { ShoppingSessionItemDto } from "@/contracts/shopping-session/shoppingSessionItem.dto";
import type { ShoppingSessionSummaryDto } from "@/contracts/shopping-session/shoppingSessionSummary.dto";

import type { ShoppingSessionDetail } from "./shoppingSessionDetail.types";
import type { ShoppingSessionItem } from "./shoppingSessionItem.types";
import {
  type ShoppingSessionSummary,
  toShoppingSessionId,
} from "./shoppingSessionSummary.types";

export function mapShoppingSessionSummaryDto(
  dto: ShoppingSessionSummaryDto,
): ShoppingSessionSummary {
  return {
    ...dto,
    id: toShoppingSessionId(dto.id),
    status: dto.status === "ACTIVE" ? "active" : "completed",
  };
}

export function mapShoppingSessionItemDto(
  dto: ShoppingSessionItemDto,
): ShoppingSessionItem {
  return {
    id: dto.id,
    name: dto.name,
    unitPrice: dto.unitPrice,
    quantity: dto.quantity,
    note: dto.note,
    labelPhotoUrl: dto.labelPhotoUrl,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapShoppingSessionDetailDto(
  dto: ShoppingSessionDetailDto,
): ShoppingSessionDetail {
  return {
    ...mapShoppingSessionSummaryDto(dto),
    items: dto.items.map(mapShoppingSessionItemDto),
  };
}
