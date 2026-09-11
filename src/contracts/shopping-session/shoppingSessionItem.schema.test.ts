import { ShoppingSessionItemDtoSchema } from "./shoppingSessionItem.schema";

const validDto = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Arroz",
  unitPrice: 25.9,
  quantity: 2,
  note: null,
  labelPhotoKey: null,
  labelPhotoUrl: null,
  createdAt: "2026-08-31T12:00:00.000Z",
  updatedAt: "2026-08-31T12:05:00.000Z",
};

describe("ShoppingSessionItemDtoSchema", () => {
  it("accepts a valid DTO", () => {
    expect(ShoppingSessionItemDtoSchema.safeParse(validDto).success).toBe(
      true,
    );
  });

  it("accepts a non-RFC-4122 UUID-shaped id, as used by seed data", () => {
    expect(
      ShoppingSessionItemDtoSchema.safeParse({
        ...validDto,
        id: "20000000-0000-0000-0000-000000000004",
      }).success,
    ).toBe(true);
  });

  it.each([
    ["zero quantity", { ...validDto, quantity: 0 }],
    ["negative unit price", { ...validDto, unitPrice: -1 }],
    ["extra key", { ...validDto, unexpected: true }],
  ])("rejects a DTO with %s", (_case, dto) => {
    expect(ShoppingSessionItemDtoSchema.safeParse(dto).success).toBe(false);
  });
});
