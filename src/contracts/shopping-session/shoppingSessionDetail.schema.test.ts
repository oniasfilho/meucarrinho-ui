import { ShoppingSessionDetailDtoSchema } from "./shoppingSessionDetail.schema";

const validDto = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Compra semanal",
  storeName: null,
  budget: null,
  status: "ACTIVE",
  itemCount: 1,
  total: 25.9,
  remainingBudget: null,
  overBudget: false,
  createdAt: "2026-08-31T12:00:00.000Z",
  completedAt: null,
  items: [
    {
      id: "6c8b1e3a-2c2b-4c2e-9c2e-2c2b4c2e9c2e",
      name: "Arroz",
      unitPrice: 25.9,
      quantity: 1,
      note: null,
      labelPhotoKey: null,
      labelPhotoUrl: null,
      createdAt: "2026-08-31T12:00:00.000Z",
      updatedAt: "2026-08-31T12:00:00.000Z",
    },
  ],
};

describe("ShoppingSessionDetailDtoSchema", () => {
  it("accepts a valid DTO with items", () => {
    expect(ShoppingSessionDetailDtoSchema.safeParse(validDto).success).toBe(
      true,
    );
  });

  it("accepts an empty items array", () => {
    expect(
      ShoppingSessionDetailDtoSchema.safeParse({ ...validDto, items: [] })
        .success,
    ).toBe(true);
  });

  it.each([
    ["missing items", { ...validDto, items: undefined }],
    ["malformed item", { ...validDto, items: [{ id: "not-enough-fields" }] }],
    ["extra key", { ...validDto, unexpected: true }],
  ])("rejects a DTO with %s", (_case, dto) => {
    expect(ShoppingSessionDetailDtoSchema.safeParse(dto).success).toBe(false);
  });
});
