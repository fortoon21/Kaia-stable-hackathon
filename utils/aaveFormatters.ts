import { ethers } from "ethers";
import { TOKEN_DECIMALS } from "@/constants/tokens";
import { getCachedPrices, getPriceByAddress } from "@/lib/priceApi";

/**
 * Convert Ray format (27 decimals) to percentage
 * Used for APY rates in Aave V3
 */
export const toPercentFromRay = (value: unknown): string | null => {
  try {
    if (value === undefined || value === null) return null;
    const bn = typeof value === "string" ? BigInt(value) : (value as bigint);
    const pct = parseFloat(ethers.formatUnits(bn, 27)) * 100;
    if (!Number.isFinite(pct)) return null;
    return `${pct.toFixed(2)}%`;
  } catch {
    return null;
  }
};

/**
 * Convert basis points to percentage
 * Used for LLTV (Liquidation Loan-to-Value) in Aave V3
 */
export const toPercentFromBps = (value: unknown): string | null => {
  try {
    if (value === undefined || value === null) return null;
    const num = typeof value === "bigint" ? Number(value) : Number(value as number);
    if (!Number.isFinite(num)) return null;
    return `${(num / 100).toFixed(2)}%`;
  } catch {
    return null;
  }
};

/**
 * Format liquidity amount with proper decimals
 * Handles different token decimal places
 */
export const formatLiquidity = (value: unknown, symbol: string): string | null => {
  try {
    if (value === undefined || value === null) return null;
    const decimals = TOKEN_DECIMALS[symbol] || 18;
    const amt = parseFloat(ethers.formatUnits(value as bigint, decimals));
    if (!Number.isFinite(amt)) return null;
    return amt.toLocaleString(undefined, { maximumFractionDigits: 2 });
  } catch {
    return null;
  }
};

/**
 * Format token amount to USD value using price API
 * Returns formatted string with proper units (K, M, etc.)
 */
export const formatUsdValue = (amount: string | number, tokenAddress: string): string | null => {
  const priceData = getCachedPrices();
  const price = getPriceByAddress(priceData, tokenAddress);
  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  
  if (!price || !Number.isFinite(numAmount)) return null;
  
  const usdValue = numAmount * price;
  if (usdValue >= 1000000) {
    return `$${(usdValue / 1000000).toFixed(2)}M`;
  } else if (usdValue >= 1000) {
    return `$${(usdValue / 1000).toFixed(1)}K`;
  } else {
    return `$${usdValue.toFixed(2)}`;
  }
};