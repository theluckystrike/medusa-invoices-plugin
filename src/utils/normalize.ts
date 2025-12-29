import { BigNumberValue, IBigNumber } from "@medusajs/framework/types";

export function normalizeNumber(v: any): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  if (Array.isArray(v)) return normalizeNumber(v[0]);
  if (v && typeof v.toNumber === "function") {
    try {
      return v.toNumber();
    } catch {}
  }
  if (v && typeof v.numeric === "number") return v.numeric;
  if (v && v.raw && typeof v.raw.value === "string") {
    const n = Number(v.raw_.value);
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
