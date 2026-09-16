const vndFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
});

/** Vietnamese number formatting: formatMoney("67000") → "67.000 VNĐ". */
export function formatMoney(amount: string | number, currency = "VND"): string {
  const isVnd = currency === "VND";
  const formatter = isVnd ? vndFormatter : decimalFormatter;
  return `${formatter.format(Number(amount))} ${isVnd ? "VNĐ" : currency}`;
}
