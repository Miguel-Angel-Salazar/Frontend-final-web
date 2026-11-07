const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Prisma serializa Decimal como string, por eso se acepta ambos tipos. */
export function formatPrice(value: number | string): string {
  return priceFormatter.format(Number(value));
}

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
