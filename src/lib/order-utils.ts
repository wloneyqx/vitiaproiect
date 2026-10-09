import { randomBytes } from "node:crypto";

export function formatMoney(value: number) {
  return `${new Intl.NumberFormat("ro-MD", { maximumFractionDigits: 0 }).format(value)} lei`;
}

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

export function makeOrderNumber(id: number) {
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `SV-${new Date().getFullYear()}-${String(id).padStart(5, "0")}-${suffix}`;
}
