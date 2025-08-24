import { useWeb3 } from "@/lib/web3Provider";
import {
  formatLiquidity,
  formatUsdValue,
  toPercentFromBps,
  toPercentFromRay,
} from "@/utils/aaveFormatters";
import { getTokenAddress } from "@/utils/tokenHelpers";

/**
 * Custom hook for fetching and formatting Aave V3 data
 * Provides real-time APY, LLTV, liquidity data, and flashloan premium
 */
export function useAaveData() {
  const { aaveParamsV3Index, aaveStatesV3, aaveParamsV3 } = useWeb3();

  /**
   * Get Supply APY for a collateral asset
   */
  const getSupplyAPY = (collateralSymbol: string): string | null => {
    const addr = getTokenAddress(collateralSymbol);
    if (!addr) return null;

    const state = aaveStatesV3 as Record<string, { liquidityRate?: bigint }>;
    const st = state[addr];
    if (!st?.liquidityRate) return null;

    return toPercentFromRay(st.liquidityRate);
  };

  /**
   * Get Borrow APY for a debt asset
   */
  const getBorrowAPY = (debtSymbol: string): string | null => {
    const addr = getTokenAddress(debtSymbol);
    if (!addr) return null;

    const state = aaveStatesV3 as Record<
      string,
      { variableBorrowRate?: bigint }
    >;
    const st = state[addr];
    if (!st?.variableBorrowRate) return null;

    return toPercentFromRay(st.variableBorrowRate);
  };

  /**
   * Get LTV (Loan-to-Value) for a collateral asset
   */
  const getLTV = (collateralSymbol: string): string | null => {
    const addr = getTokenAddress(collateralSymbol);
    if (!addr) return null;

    const params = aaveParamsV3Index as Record<string, unknown[]>;
    const param = params[addr];
    if (!param?.[8]) return null;

    return toPercentFromBps(param[8]);
  };

  /**
   * Get flashloan premium from Aave V3 protocol
   * Returns as decimal string (e.g., "0.0009" for 9 bps)
   */
  const getFlashloanPremium = (): string | null => {
    if (!aaveParamsV3) return null;

    try {
      let root: unknown = aaveParamsV3;
      
      // Handle nested response structure
      if (
        typeof aaveParamsV3 === "object" &&
        aaveParamsV3 !== null &&
        "response" in (aaveParamsV3 as Record<string, unknown>)
      ) {
        root = (aaveParamsV3 as Record<string, unknown>).response;
      }

      const params = root as { flashloanPremium?: bigint | number | string };
      if (!params?.flashloanPremium) return null;

      // Convert from basis points to decimal with proper precision
      const premium = typeof params.flashloanPremium === "bigint" 
        ? Number(params.flashloanPremium) 
        : Number(params.flashloanPremium);
      
      
      // Convert from basis points and format to 4 decimal places (e.g., 9 bps = 0.0009)
      const decimalValue = premium / 10000;
      return decimalValue.toFixed(4);
    } catch (error) {
      return null;
    }
  };

  /**
   * Get LLTV (Liquidation Loan-to-Value) for a collateral asset
   */
  const getLLTV = (collateralSymbol: string): string | null => {
    const addr = getTokenAddress(collateralSymbol);
    if (!addr) return null;

    const params = aaveParamsV3Index as Record<
      string,
      { reserveLiquidationThreshold?: number | bigint }
    >;
    const param = params[addr];
    if (!param?.reserveLiquidationThreshold) return null;

    return toPercentFromBps(param.reserveLiquidationThreshold);
  };

  /**
   * Get liquidity data for a debt asset
   * Returns both formatted amount and USD value
   */
  const getLiquidity = (
    debtSymbol: string
  ): { amount: string | null; usdValue: string | null } => {
    const addr = getTokenAddress(debtSymbol);
    if (!addr) {
      return { amount: null, usdValue: null };
    }

    const state = aaveStatesV3 as Record<
      string,
      { availableLiquidity?: bigint }
    >;
    const st = state[addr];
    if (!st?.availableLiquidity) {
      return { amount: null, usdValue: null };
    }

    const amount = formatLiquidity(st.availableLiquidity, debtSymbol);
    const usdValue = amount ? formatUsdValue(amount, addr) : null;

    return { amount, usdValue };
  };

  /**
   * Calculate total liquidity across all 4 assets (WKAIA, USDT, USDC, USDT0)
   */
  const getTotalLiquidity = (): { totalUSD: string | null; hasData: boolean } => {
    const assets = ["WKAIA", "USDT", "USDC", "USDT0"];
    let totalValue = 0;
    let hasValidData = false;

    for (const symbol of assets) {
      const { usdValue } = getLiquidity(symbol);
      if (usdValue) {
        // Extract numeric value from usdValue (e.g., "$37.4K" -> 37400)
        const numericValue = parseUsdValue(usdValue);
        if (numericValue > 0) {
          totalValue += numericValue;
          hasValidData = true;
        }
      }
    }

    if (!hasValidData) {
      return { totalUSD: null, hasData: false };
    }

    // Format total value
    if (totalValue >= 1000000) {
      return { 
        totalUSD: `$${(totalValue / 1000000).toFixed(2)}M`, 
        hasData: true 
      };
    } else if (totalValue >= 1000) {
      return { 
        totalUSD: `$${(totalValue / 1000).toFixed(1)}K`, 
        hasData: true 
      };
    } else {
      return { 
        totalUSD: `$${totalValue.toFixed(2)}`, 
        hasData: true 
      };
    }
  };

  // Helper function to parse USD values back to numbers
  const parseUsdValue = (usdString: string): number => {
    const cleaned = usdString.replace('$', '');
    if (cleaned.endsWith('M')) {
      return parseFloat(cleaned.replace('M', '')) * 1000000;
    } else if (cleaned.endsWith('K')) {
      return parseFloat(cleaned.replace('K', '')) * 1000;
    } else {
      return parseFloat(cleaned) || 0;
    }
  };

  return {
    getSupplyAPY,
    getBorrowAPY,
    getLTV,
    getLLTV,
    getLiquidity,
    getTotalLiquidity,
    getFlashloanPremium,
  };
}
