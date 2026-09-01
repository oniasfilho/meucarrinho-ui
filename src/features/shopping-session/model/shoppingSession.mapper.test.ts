import type { ShoppingSessionDto } from "@/contracts/shopping-session/shoppingSession.dto";

import { mapShoppingSessionDto } from "./shoppingSession.mapper";

const baseDto: ShoppingSessionDto = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Compra semanal",
  status: "ACTIVE",
  itemCount: 3,
  total: 125.5,
  createdAt: "2026-08-31T12:00:00.000Z",
};

describe("mapShoppingSessionDto", () => {
  it.each([
    ["ACTIVE", "active"],
    ["COMPLETED", "completed"],
  ] as const)("maps %s to %s", (transportStatus, uiStatus) => {
    const result = mapShoppingSessionDto({
      ...baseDto,
      status: transportStatus,
    });

    expect(result).toEqual({
      ...baseDto,
      status: uiStatus,
      createdAt: new Date(baseDto.createdAt),
    });
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
