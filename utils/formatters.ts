// Price and currency formatting utilities
export function formatDollarAmount(amount: number): string {
  if (!Number.isFinite(amount)) return "$0.00";

  // Handle large numbers with K, M, B suffixes
  if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(2)}B`;
  }
  if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(2)}M`;
  }
  if (amount >= 1e3) {
    return `$${(amount / 1e3).toFixed(2)}K`;
  }

  return `$${amount.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  if (!Number.isFinite(value)) return "0.00%";
  return `${value.toFixed(2)}%`;
}

export function formatTokenAmount(
  amount: string | number,
  decimals: number = 2
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(num)) return "0";

  // Handle large numbers
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(decimals)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(decimals)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(decimals)}K`;
  }

  return num.toFixed(decimals);
}

export function calculateUSDValue(amount: string, price: number): string {
  const numAmount = parseFloat(amount.replace(/,/g, ""));
  if (!Number.isFinite(numAmount) || !Number.isFinite(price)) return "$0.00";
  return formatDollarAmount(numAmount * price);
}

export function getMarketImage(
  marketName: string,
  imageMap: { [key: string]: string }
) {
  return imageMap[marketName] || null;
}

// Additional formatting utilities
export function formatNumber(
  value: number | string,
  decimals: number = 2
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";

  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

export function parseFormattedNumber(value: string): number {
  // Remove commas, dollar signs, and percentage signs
  const cleaned = value.replace(/[$,%]/g, "").replace(/,/g, "");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

export function formatAPY(value: number): string {
  if (!Number.isFinite(value)) return "0.00%";

  // Color code APY based on value
  const formatted = `${value.toFixed(2)}%`;
  return formatted;
}

export function formatMultiplier(value: number): string {
  if (!Number.isFinite(value) || value <= 1) return "1.00x";
  return `${value.toFixed(2)}x`;
}

export function formatHealthFactor(value: number): string {
  if (!Number.isFinite(value)) return "∞";
  if (value >= 1000) return "∞";
  return value.toFixed(2);
}
