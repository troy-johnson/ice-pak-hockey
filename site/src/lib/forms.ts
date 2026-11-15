// Readers for form input. Each reader returns a safe value for input that is missing or wrong.

export function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** A whole number of zero or more. */
export function count(data: FormData, name: string): number {
  const value = Number.parseInt(text(data, name), 10);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** A dollar amount such as "3,500" or "$255.18", as whole cents. */
export function cents(data: FormData, name: string): number {
  const value = Number.parseFloat(text(data, name).replace(/[$,\s]/g, ""));
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : 0;
}

/** A date as YYYY-MM-DD, or null. */
export function date(data: FormData, name: string): string | null {
  const value = text(data, name);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export function dollars(amount: number): string {
  return (amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}
