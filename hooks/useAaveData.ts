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
   * Get Max ROE for a trading pair using supply/borrow APY, LTV, and flashloan premium
   */
  const getMaxROE = (
    collateralSymbol: string,
    debtSymbol: string
  ): string | null => {
    try {
      // Get supply and borrow APY
      const supplyAPY = getSupplyAPY(collateralSymbol);
      const borrowAPY = getBorrowAPY(debtSymbol);
      if (!supplyAPY || !borrowAPY) return null;

      // Get LTV
      const ltv = getLTV(collateralSymbol);
      if (!ltv) return null;

      // Get flashloan premium
      const flashloanPremium = getFlashloanPremium();
      if (!flashloanPremium) return null;

      // Convert percentage strings to decimals
      const supplyDecimal = parseFloat(supplyAPY.replace("%", "")) / 100;
      const borrowDecimal = parseFloat(borrowAPY.replace("%", "")) / 100;
      const ltvDecimal = parseFloat(ltv.replace("%", "")) / 100;
      const flashPremiumDecimal = parseFloat(flashloanPremium);

      // Calculate Max ROE using the formula
      const maxMultiplier = 1 / (1 - ltvDecimal);
      const borrowEffective = borrowDecimal * (1 + flashPremiumDecimal);
      const spreadAtMax = supplyDecimal - ltvDecimal * borrowEffective;
      const leveragedROE = spreadAtMax * maxMultiplier;

      // Return the better of leveraged vs unleveraged
      const maxROE = Math.max(supplyDecimal, leveragedROE);

      // Return "-" if ROE is negative
      if (maxROE < 0) {
        return "-";
      }

      return `${(maxROE * 100).toFixed(2)}%`;
    } catch (_error) {
      return null;
    }
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
      const premium =
        typeof params.flashloanPremium === "bigint"
          ? Number(params.flashloanPremium)
          : Number(params.flashloanPremium);

      // Convert from basis points and format to 4 decimal places (e.g., 9 bps = 0.0009)
      const decimalValue = premium / 10000;
      return decimalValue.toFixed(4);
    } catch (_error) {
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
  const getTotalLiquidity = (): {
    totalUSD: string | null;
    hasData: boolean;
  } => {
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
        hasData: true,
      };
    } else if (totalValue >= 1000) {
      return {
        totalUSD: `$${(totalValue / 1000).toFixed(1)}K`,
        hasData: true,
      };
    } else {
      return {
        totalUSD: `$${totalValue.toFixed(2)}`,
        hasData: true,
      };
    }
  };

  // Helper function to parse USD values back to numbers
  const parseUsdValue = (usdString: string): number => {
    const cleaned = usdString.replace("$", "");
    if (cleaned.endsWith("M")) {
      return parseFloat(cleaned.replace("M", "")) * 1000000;
    } else if (cleaned.endsWith("K")) {
      return parseFloat(cleaned.replace("K", "")) * 1000;
    } else {
      return parseFloat(cleaned) || 0;
    }
  };

  /**
   * Get Total Supply for a token (Total Borrowed + Available Liquidity)
   */
  const getTotalSupply = (
    tokenSymbol: string
  ): {
    amount: string | null;
    usdValue: string | null;
  } => {
    const totalBorrowed = getTotalBorrowed(tokenSymbol);
    const availableLiquidity = getLiquidity(tokenSymbol);

    if (!totalBorrowed.amount || !availableLiquidity.amount) {
      return { amount: null, usdValue: null };
    }

    try {
      // Parse amounts (remove commas and convert to numbers)
      const borrowedAmount = parseFloat(totalBorrowed.amount.replace(/,/g, ""));
      const liquidityAmount = parseFloat(
        availableLiquidity.amount.replace(/,/g, "")
      );

      // Calculate total supply
      const totalSupplyAmount = borrowedAmount + liquidityAmount;
      const formattedAmount = totalSupplyAmount.toLocaleString();

      // Calculate USD value
      const borrowedUsd = totalBorrowed.usdValue
        ? parseFloat(totalBorrowed.usdValue.replace(/[$,KM]/g, ""))
        : 0;
      const liquidityUsd = availableLiquidity.usdValue
        ? parseFloat(availableLiquidity.usdValue.replace(/[$,KM]/g, ""))
        : 0;

      // Handle K/M suffixes
      const borrowedMultiplier = totalBorrowed.usdValue?.includes("M")
        ? 1000000
        : totalBorrowed.usdValue?.includes("K")
          ? 1000
          : 1;
      const liquidityMultiplier = availableLiquidity.usdValue?.includes("M")
        ? 1000000
        : availableLiquidity.usdValue?.includes("K")
          ? 1000
          : 1;

      const totalUsdValue =
        borrowedUsd * borrowedMultiplier + liquidityUsd * liquidityMultiplier;
      const formattedUsdValue =
        totalUsdValue >= 1000000
          ? `$${(totalUsdValue / 1000000).toFixed(2)}M`
          : totalUsdValue >= 1000
            ? `$${(totalUsdValue / 1000).toFixed(1)}K`
            : `$${totalUsdValue.toFixed(2)}`;

      return { amount: formattedAmount, usdValue: formattedUsdValue };
    } catch (error) {
      console.error(
        `Error calculating total supply for ${tokenSymbol}:`,
        error
      );
      return { amount: null, usdValue: null };
    }
  };

  /**
   * Get Total Borrowed for a token from debtToken totalSupply in aaveStatesV3
   */
  const getTotalBorrowed = (
    tokenSymbol: string
  ): {
    amount: string | null;
    usdValue: string | null;
  } => {
    // variableDebtToken addresses for each token
    const debtTokenAddresses: Record<string, string> = {
      WKAIA: "0xada27a9e7fc5e5256adf1225bc94e30973fac274",
      USDT: "0x3a5724329f807eef8f2a069e66c9aa34982afbec",
      USDT0: "0xa9f23143c38fbfb2fa299b604a2402bab1e541fc",
      USDC: "0x4880c4b5a3d83965c78faed3373154610b39046b",
    };

    const debtTokenAddress = debtTokenAddresses[tokenSymbol];
    if (!debtTokenAddress) {
      return { amount: null, usdValue: null };
    }

    const state = aaveStatesV3 as Record<string, { totalSupply?: bigint }>;
    const st = state[debtTokenAddress.toLowerCase()];
    const totalBorrowedBigInt = st?.totalSupply;
    if (!totalBorrowedBigInt) {
      return { amount: null, usdValue: null };
    }

    // Format the amount using correct decimals
    const amount = formatLiquidity(totalBorrowedBigInt, tokenSymbol);
    const originalTokenAddr = getTokenAddress(tokenSymbol);
    const usdValue =
      amount && originalTokenAddr
        ? formatUsdValue(amount, originalTokenAddr)
        : null;

    return { amount, usdValue };
  };

  return {
    getSupplyAPY,
    getBorrowAPY,
    getLTV,
    getLLTV,
    getLiquidity,
    getTotalLiquidity,
    getFlashloanPremium,
    getMaxROE,
    getTotalSupply,
    getTotalBorrowed,
  };
}
