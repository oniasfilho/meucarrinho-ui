import {
  CreateShoppingSessionRequestDtoSchema,
  ShoppingSessionDtoSchema,
} from "./shoppingSession.schema";

const validDto = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Compra semanal",
  status: "ACTIVE",
  itemCount: 3,
  total: 125.5,
  createdAt: "2026-08-31T12:00:00.000Z",
};

describe("ShoppingSessionDtoSchema", () => {
  it("accepts a valid DTO", () => {
    expect(ShoppingSessionDtoSchema.safeParse(validDto).success).toBe(true);
  });

  it.each([
    ["bad status", { ...validDto, status: "PENDING" }],
    ["invalid date", { ...validDto, createdAt: "31/08/2026" }],
    ["negative total", { ...validDto, total: -1 }],
    ["fractional item count", { ...validDto, itemCount: 1.5 }],
    ["extra key", { ...validDto, unexpected: true }],
  ])("rejects a DTO with %s", (_case, dto) => {
    expect(ShoppingSessionDtoSchema.safeParse(dto).success).toBe(false);
  });
});

describe("CreateShoppingSessionRequestDtoSchema", () => {
  it.each([
    ["empty name", { name: "" }],
    ["whitespace-only name", { name: "   " }],
    ["name longer than 120 characters", { name: "a".repeat(121) }],
    ["extra key", { name: "Compra semanal", unexpected: true }],
  ])("rejects a request with %s", (_case, request) => {
    expect(
      CreateShoppingSessionRequestDtoSchema.safeParse(request).success,
    ).toBe(false);
  });

  it("trims a valid name at the request boundary", () => {
    expect(
      CreateShoppingSessionRequestDtoSchema.parse({
        name: "  Compra semanal  ",
      }),
    ).toEqual({ name: "Compra semanal" });
  });
});
