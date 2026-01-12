import { MathBN } from "@medusajs/framework/utils";
import { BigNumberInput } from "@medusajs/framework/types";

/**
 * Formats a currency amount with proper locale and currency settings
 * @param value - The value to format (can be a number, string, or BigNumber)
 * @returns Formatted value string
 */

export function formatNumber(value: number | string | BigNumberInput) {
  // Convert to number if it's a BigNumber or string
  let numericValue;

  if (typeof value === "number") {
    numericValue = value;
  } else {
    numericValue = MathBN.convert(value).toNumber();
  }

  return numericValue;
}

/**
 * Formats a currency amount with proper locale and currency settings
 * @param amount - The amount to format (can be a number, string, or BigNumber)
 * @param currencyCode - The ISO currency code (e.g., 'USD', 'EUR')
 * @param locale - Optional locale string (e.g., 'en-US', 'de-DE'). Defaults to user's locale
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(123456, 'USD') // "$1,234.56"
 * formatCurrency(123456, 'EUR', 'de-DE') // "1.234,56 €"
 */

export function formatCurrency(
  amount: number | string | BigNumberInput,
  currencyCode: string,
  locale?: string,
): string {
  return formatNumber(amount).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: currencyCode,
  });
}

/**
 * Gets the appropriate locale from various sources
 * Priority: store settings > region settings > browser default
 *
 * @param storeLocale - Locale from store settings
 * @param regionLocale - Locale from region/order settings
 * @returns The locale string to use
 */
export function getInvoiceLocale(
  storeLocale?: string,
  regionLocale?: string,
): string | undefined {
  return storeLocale || regionLocale || undefined;
}
