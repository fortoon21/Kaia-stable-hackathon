import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useWeb3 } from "@/lib/web3Provider";
import { getTokenAddress } from "@/utils/tokenHelpers";

/**
 * Custom hook for market-related calculations
 * Handles debt positions and pricing calculations
 */
export function useMarketCalculations() {
  const { getPriceBySymbol } = useTokenPrices();
  const { aaveUserBalances, isConnected } = useWeb3();

  /**
   * Calculate borrow positions for all assets
   * Returns a map of asset symbols to position data
   */
  const calculateBorrowPositions = () => {
    // If wallet not connected, return empty debt positions
    if (!isConnected) {
      const emptyPositions: Record<
        string,
        { amount: string; usdValue: string }
      > = {};

      // Return dash for all known tokens when disconnected
      const knownTokens = [
        "USDC",
        "LBTC",
        "WKAIA",
        "KAIA",
        "USD₮",
        "USDT",
        "USDT0",
      ];
      knownTokens.forEach((token) => {
        emptyPositions[token] = { amount: "-", usdValue: "-" };
      });

      return emptyPositions;
    }

    // Calculate USD values using real prices
    const calculateUsdValue = (symbol: string, amount: string): string => {
      if (amount === "0" || amount === "-") return "$0.00";
      const price = getPriceBySymbol(symbol);
      const numAmount = parseFloat(amount.replace(/,/g, ""));
      const usdValue = price * numAmount;
      return `$${usdValue.toFixed(2)}`;
    };

    // Get real debt balances from wallet
    const borrowPositions: Record<
      string,
      { amount: string; usdValue: string }
    > = {};

    // Process each token's debt balance from aaveUserBalances
    Object.entries(aaveUserBalances).forEach(([tokenAddress, balanceData]) => {
      // Find the token symbol from the address by checking all known tokens
      const tokenSymbol = ["WKAIA", "USDT", "USDC", "USDT0", "USD₮"].find(
        (symbol) =>
          getTokenAddress(symbol)?.toLowerCase() === tokenAddress.toLowerCase()
      );

      if (tokenSymbol && balanceData.variableDebtBalance) {
        const debtAmount = parseFloat(balanceData.variableDebtBalance);
        const formattedAmount =
          debtAmount > 0 ? debtAmount.toLocaleString() : "0";

        borrowPositions[tokenSymbol] = {
          amount: formattedAmount,
          usdValue: calculateUsdValue(tokenSymbol, formattedAmount),
        };
      }
    });

    // Ensure all known tokens have entries
    const knownTokens = [
      "USDC",
      "LBTC",
      "WKAIA",
      "KAIA",
      "USD₮",
      "USDT",
      "USDT0",
    ];
    knownTokens.forEach((token) => {
      if (!borrowPositions[token]) {
        borrowPositions[token] = { amount: "0", usdValue: "$0.00" };
      }
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
    return (
      position?.amount !== "0" &&
      position?.amount !== "-" &&
      position?.amount !== undefined
    );
  };

  /**
   * Get position data for a specific asset
   */
  const getPositionData = (
    debtAsset: string,
    borrowPositions: Record<string, { amount: string; usdValue: string }>
  ) => {
    if (!isConnected) {
      return { amount: "-", usdValue: "-" };
    }
    return borrowPositions[debtAsset] || { amount: "0", usdValue: "$0.00" };
  };

  return {
    calculateBorrowPositions,
    hasDebtPosition,
    getPositionData,
    getPriceBySymbol,
  };
}
