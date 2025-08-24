import { TOKEN_ADDRESSES } from "@/constants/tokens";

/**
 * Get token contract address by symbol
 * Returns lowercase address for consistent comparison
 */
export const getTokenAddress = (symbol: string): string | undefined => {
  const addressMap = {
    WKAIA: TOKEN_ADDRESSES.WKAIA,
    USDT: TOKEN_ADDRESSES.USDT,
    USDC: TOKEN_ADDRESSES.USDC,
    USDT0: TOKEN_ADDRESSES.USDT0,
  } as const;

  return addressMap[symbol as keyof typeof addressMap]?.toLowerCase();
};
