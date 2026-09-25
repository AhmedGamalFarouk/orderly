// Currencies a host can pick when creating a space. Spaces created before the
// picker existed have no `currency` field and fall back to DEFAULT_CURRENCY.
export const CURRENCIES = [
  { code: "EGP", label: "Egyptian Pound (EGP)", locale: "ar" },
  { code: "USD", label: "US Dollar (USD)", locale: "en-US" },
  { code: "EUR", label: "Euro (EUR)", locale: "en-IE" },
  { code: "GBP", label: "British Pound (GBP)", locale: "en-GB" },
  { code: "SAR", label: "Saudi Riyal (SAR)", locale: "ar-SA" },
  { code: "AED", label: "UAE Dirham (AED)", locale: "ar-AE" },
];

export const DEFAULT_CURRENCY = "EGP";

const formatters = new Map();

function getFormatter(currency) {
  const option =
    CURRENCIES.find((item) => item.code === currency) ||
    CURRENCIES.find((item) => item.code === DEFAULT_CURRENCY);
  if (!formatters.has(option.code)) {
    formatters.set(
      option.code,
      new Intl.NumberFormat(option.locale, {
        style: "currency",
        currency: option.code,
        minimumFractionDigits: 2,
      })
    );
  }
  return formatters.get(option.code);
}

export function formatCurrency(number, currency = DEFAULT_CURRENCY) {
  const value = Number(number);
  return getFormatter(currency).format(Number.isFinite(value) ? value : 0);
}
