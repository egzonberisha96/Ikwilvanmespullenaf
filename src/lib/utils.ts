import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(value);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(date)
  );
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Genereert een leesbaar, uniek aanvraagnummer, bv. IWMA-2026-000123 */
export function generateRequestNumber(sequence: number) {
  const year = new Date().getFullYear();
  return `IWMA-${year}-${String(sequence).padStart(6, "0")}`;
}

/** Valideert een Nederlandse postcode, bv. "1234 AB" of "1234AB" */
export function isValidDutchPostcode(postcode: string) {
  return /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/.test(postcode.trim());
}

export function normalizePostcode(postcode: string) {
  return postcode.replace(/\s+/g, "").toUpperCase();
}

export const REQUEST_TYPE_LABELS: Record<string, string> = {
  LOSSE_SPULLEN: "Losse spullen",
  COMPLETE_INBOEDEL: "Complete inboedel",
  WONINGONTRUIMING: "Woningontruiming",
  BEDRIJFSINVENTARIS: "Bedrijfsinventaris",
  BEDRIJFSONTRUIMING: "Bedrijfsontruiming",
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  NIEUW: "Nieuw",
  IN_BEHANDELING: "In behandeling",
  BIEDINGEN_ONTVANGEN: "Biedingen ontvangen",
  GEGUND: "Gegund",
  AFGEROND: "Afgerond",
  GEANNULEERD: "Geannuleerd",
};

export const PARTNER_TYPE_LABELS: Record<string, string> = {
  OPKOPER: "Opkoper",
  ONTRUIMINGSBEDRIJF: "Ontruimingsbedrijf",
  KRINGLOOPWINKEL: "Kringloopwinkel",
  TRANSPORTBEDRIJF: "Transportbedrijf",
};
