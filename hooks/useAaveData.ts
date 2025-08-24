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
 * Provides real-time APY, LLTV, and liquidity data
 */
export function useAaveData() {
  const { aaveParamsV3Index, aaveStatesV3 } = useWeb3();

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

  return {
    getSupplyAPY,
    getBorrowAPY,
    getLLTV,
    getLiquidity,
  };
}
