import type { ShoppingSessionDetailDto } from "@/contracts/shopping-session/shoppingSessionDetail.dto";
import type { ShoppingSessionItemDto } from "@/contracts/shopping-session/shoppingSessionItem.dto";
import type { ShoppingSessionSummaryDto } from "@/contracts/shopping-session/shoppingSessionSummary.dto";

import {
  mapShoppingSessionDetailDto,
  mapShoppingSessionItemDto,
  mapShoppingSessionSummaryDto,
} from "./shoppingSession.mapper";

const baseSummaryDto: ShoppingSessionSummaryDto = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Compra semanal",
  storeName: "Mercado Central",
  budget: 200,
  status: "ACTIVE",
  itemCount: 3,
  total: 125.5,
  remainingBudget: 74.5,
  overBudget: false,
  createdAt: "2026-08-31T12:00:00.000Z",
  completedAt: null,
};

describe("mapShoppingSessionSummaryDto", () => {
  it.each([
    ["ACTIVE", "active"],
    ["COMPLETED", "completed"],
  ] as const)("maps %s to %s", (transportStatus, uiStatus) => {
    const result = mapShoppingSessionSummaryDto({
      ...baseSummaryDto,
      status: transportStatus,
    });

    expect(result).toEqual({
      ...baseSummaryDto,
      status: uiStatus,
    });
    expect(result.createdAt).toBe(baseSummaryDto.createdAt);
  });
});

describe("mapShoppingSessionItemDto", () => {
  it("maps an item DTO, dropping the storage key", () => {
    const itemDto: ShoppingSessionItemDto = {
      id: "6c8b1e3a-2c2b-4c2e-9c2e-2c2b4c2e9c2e",
      name: "Arroz",
      unitPrice: 25.9,
      quantity: 2,
      note: "marca preferida",
      labelPhotoKey: "sessions/1/items/item-1.jpg",
      labelPhotoUrl: "https://cdn.example.com/item-1.jpg",
      createdAt: "2026-08-31T12:00:00.000Z",
      updatedAt: "2026-08-31T12:05:00.000Z",
    };

    expect(mapShoppingSessionItemDto(itemDto)).toEqual({
      id: itemDto.id,
      name: itemDto.name,
      unitPrice: itemDto.unitPrice,
      quantity: itemDto.quantity,
      note: itemDto.note,
      labelPhotoUrl: itemDto.labelPhotoUrl,
      createdAt: itemDto.createdAt,
      updatedAt: itemDto.updatedAt,
    });
  });
});

describe("mapShoppingSessionDetailDto", () => {
  it("maps a detail DTO including its items", () => {
    const detailDto: ShoppingSessionDetailDto = {
      ...baseSummaryDto,
      items: [],
    };

    expect(mapShoppingSessionDetailDto(detailDto)).toEqual({
      ...mapShoppingSessionSummaryDto(baseSummaryDto),
      items: [],
    });
  });
});
