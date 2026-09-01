const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const sessionDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatSessionDate(value: string): string {
  return sessionDateFormatter.format(new Date(value));
}

export function formatItemCount(value: number): string {
  return `${value} ${value === 1 ? "item" : "itens"}`;
}

export function createDefaultSessionName(now: Date): string {
  return `Compra ${formatSessionDate(now.toISOString())}`;
}
