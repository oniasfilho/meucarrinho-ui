import {
  createDefaultSessionName,
  formatCurrency,
  formatItemCount,
  formatSessionDate,
} from "./shoppingSession.formatters";

describe("shopping session formatters", () => {
  it("formats currency as BRL", () => {
    const expected = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(1234.56);

    expect(formatCurrency(1234.56)).toBe(expected);
  });

  it("formats session dates in Brazilian format", () => {
    expect(formatSessionDate(new Date(2026, 7, 31, 12))).toBe("31/08/2026");
  });

  it.each([
    [0, "0 itens"],
    [1, "1 item"],
    [12, "12 itens"],
  ])("formats an item count of %i", (value, expected) => {
    expect(formatItemCount(value)).toBe(expected);
  });

  it("creates a deterministic default name from the supplied date", () => {
    const now = new Date(2026, 7, 31, 12);

    expect(createDefaultSessionName(now)).toBe("Compra 31/08/2026");
  });
});
