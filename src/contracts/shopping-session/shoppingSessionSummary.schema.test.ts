import { ShoppingSessionSummaryDtoSchema } from "./shoppingSessionSummary.schema";

const validDto = {
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

describe("ShoppingSessionSummaryDtoSchema", () => {
  it("accepts a valid DTO", () => {
    expect(ShoppingSessionSummaryDtoSchema.safeParse(validDto).success).toBe(
      true,
    );
  });

  it("accepts null storeName/budget/remainingBudget/completedAt", () => {
    expect(
      ShoppingSessionSummaryDtoSchema.safeParse({
        ...validDto,
        storeName: null,
        budget: null,
        remainingBudget: null,
        completedAt: null,
      }).success,
    ).toBe(true);
  });

  it.each([
    ["bad status", { ...validDto, status: "PENDING" }],
    ["invalid date", { ...validDto, createdAt: "31/08/2026" }],
    ["negative total", { ...validDto, total: -1 }],
    ["fractional item count", { ...validDto, itemCount: 1.5 }],
    ["extra key", { ...validDto, unexpected: true }],
    ["missing overBudget", { ...validDto, overBudget: undefined }],
  ])("rejects a DTO with %s", (_case, dto) => {
    expect(ShoppingSessionSummaryDtoSchema.safeParse(dto).success).toBe(false);
  });
});
