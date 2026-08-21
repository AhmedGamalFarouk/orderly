export function formatCurrency(number) {
  const value = Number(number);
  const formatter = new Intl.NumberFormat("ar", {
    currency: "EGP",
    minimumFractionDigits: 2,
    style:"currency"
  });
  return formatter.format(Number.isFinite(value) ? value : 0);
}
