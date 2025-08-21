// Price and currency formatting utilities
export function formatDollarAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatTokenAmount(
  amount: string | number,
  decimals: number = 2
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toFixed(decimals);
}

export function calculateUSDValue(amount: string, price: number): string {
  return formatDollarAmount(parseFloat(amount) * price);
}

export function getMarketImage(
  marketName: string,
  imageMap: { [key: string]: string }
) {
  return imageMap[marketName] || null;
}
