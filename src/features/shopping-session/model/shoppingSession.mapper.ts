import type { ShoppingSessionDto } from "@/contracts/shopping-session/shoppingSession.dto";

import {
  type ShoppingSession,
  toShoppingSessionId,
} from "./shoppingSession.types";

export function mapShoppingSessionDto(
  dto: ShoppingSessionDto,
): ShoppingSession {
  return {
    ...dto,
    id: toShoppingSessionId(dto.id),
    status: dto.status === "ACTIVE" ? "active" : "completed",
    createdAt: new Date(dto.createdAt),
  };
}
