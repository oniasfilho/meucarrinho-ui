import { CreateShoppingSessionRequestDtoSchema } from "./shoppingSession.requests";

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

  it("accepts an optional storeName and budget", () => {
    expect(
      CreateShoppingSessionRequestDtoSchema.parse({
        name: "Compra semanal",
        storeName: "Mercado Central",
        budget: 200,
      }),
    ).toEqual({
      name: "Compra semanal",
      storeName: "Mercado Central",
      budget: 200,
    });
  });
});
