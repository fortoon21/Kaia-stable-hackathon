import { useTokenPrices } from "@/hooks/useTokenPrices";

/**
 * Custom hook for market-related calculations
 * Handles debt positions and pricing calculations
 */
export function useMarketCalculations() {
  const { getPriceBySymbol } = useTokenPrices();

  /**
   * Calculate borrow positions for all assets
   * Returns a map of asset symbols to position data
   */
  const calculateBorrowPositions = () => {
    // Mock borrow amounts with real-time price calculation
    const borrowAmounts = {
      USDC: "1,234.56",
      LBTC: "0.000161",
      WKAIA: "523.45",
      KAIA: "523.45",
      "USD₮": "0",
      USDT: "0",
      USDT0: "0",
    };

    // Calculate USD values using real prices
    const calculateUsdValue = (symbol: string, amount: string): string => {
      const price = getPriceBySymbol(symbol);
      const numAmount = parseFloat(amount.replace(/,/g, ""));
      const usdValue = price * numAmount;
      return `$${usdValue.toFixed(2)}`;
    };

    // Convert to position format
    const borrowPositions: Record<
      string,
      { amount: string; usdValue: string }
    > = {};
    Object.entries(borrowAmounts).forEach(([symbol, amount]) => {
      borrowPositions[symbol] = {
        amount,
        usdValue: calculateUsdValue(symbol, amount),
      };
    });

    return borrowPositions;
  };

  /**
   * Check if user has debt for a specific asset
   */
  const hasDebtPosition = (
    debtAsset: string,
    borrowPositions: Record<string, { amount: string; usdValue: string }>
  ): boolean => {
    const position = borrowPositions[debtAsset];
    return position?.amount !== "0" && position?.amount !== undefined;
  };

  /**
   * Get position data for a specific asset
   */
  const getPositionData = (
    debtAsset: string,
    borrowPositions: Record<string, { amount: string; usdValue: string }>
  ) => {
    return borrowPositions[debtAsset] || { amount: "0", usdValue: "$0.00" };
  };

  return {
    calculateBorrowPositions,
    hasDebtPosition,
    getPositionData,
    getPriceBySymbol,
  };
}
