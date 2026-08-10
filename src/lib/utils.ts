import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function averageRating(ratings: number[]): number {
  if (!ratings.length) return 0;
  return Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function generateReferralCode(name: string): string {
  const base = name.replace(/\s+/g, "").slice(0, 4).toUpperCase();
  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Platform commission: Launch Rate 10% for first 2 months, then 15% */
export const LAUNCH_COMMISSION_RATE = 0.1;
export const STANDARD_COMMISSION_RATE = 0.15;
export const LAUNCH_ENDS_AT = new Date("2026-10-09T00:00:00");

export function getCommissionRate(asOf: Date = new Date()): number {
  return asOf < LAUNCH_ENDS_AT ? LAUNCH_COMMISSION_RATE : STANDARD_COMMISSION_RATE;
}

export function calculateCommission(saleAmount: number, asOf?: Date): number {
  return Math.round(saleAmount * getCommissionRate(asOf));
}

export function sellerPayout(saleAmount: number, asOf?: Date): number {
  return saleAmount - calculateCommission(saleAmount, asOf);
}

export const PROMO_CODES: Record<string, { type: "percent" | "fixed"; value: number; label: string }> = {
  WELCOME10: { type: "percent", value: 10, label: "Welcome 10% off" },
  HANDMADE5: { type: "fixed", value: 500, label: "Rs. 500 off" },
  LAUNCH15: { type: "percent", value: 15, label: "Launch Collection 15% off" },
  REFER50: { type: "fixed", value: 500, label: "Referral friend discount" },
};

export type PromoResult = { discount: number; label: string } | null;

export function resolvePromo(
  code: string,
  subtotal: number,
  referralLookup?: (code: string) => number | null
): PromoResult {
  const upper = code.trim().toUpperCase();
  if (!upper) return null;

  const promo = PROMO_CODES[upper];
  if (promo) {
    const discount =
      promo.type === "percent"
        ? Math.round(subtotal * (promo.value / 100))
        : Math.min(promo.value, subtotal);
    return { discount, label: promo.label };
  }

  const referralAmount = referralLookup?.(upper) ?? null;
  if (referralAmount != null && referralAmount > 0) {
    return {
      discount: Math.min(referralAmount, subtotal),
      label: "Friend referral — Rs. 500 off",
    };
  }

  return null;
}

export function applyPromo(
  code: string,
  subtotal: number,
  referralLookup?: (code: string) => number | null
): number {
  return resolvePromo(code, subtotal, referralLookup)?.discount ?? 0;
}
