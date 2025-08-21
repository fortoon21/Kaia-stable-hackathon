import { useMemo } from "react";
import { MOCK_PRICES } from "@/constants/mockData";
import { TOKEN_DECIMALS } from "@/constants/tokens";
import { calculateLeverageParams, calculateMaxLeverage } from "@/lib/leverage";
import type { LendingProps } from "@/types/lending";

export function useLeverageCalculations(
  selectedPair: LendingProps["selectedPair"],
  collateralAmount: string,
  multiplier: number
) {
  // Calculate max leverage using the leverage library
  const maxLeverage = useMemo(() => {
    if (!selectedPair) return 1;

    // If no collateral amount, assume 1 token to show max possible leverage
    const amount =
      !collateralAmount || parseFloat(collateralAmount) === 0
        ? "1"
        : collateralAmount;

    // Get token decimals from selectedPair or fallback to TOKEN_DECIMALS
    const collateralDecimals =
      TOKEN_DECIMALS[selectedPair.collateralAsset.symbol] || 18;
    const debtDecimals = TOKEN_DECIMALS[selectedPair.debtAsset.symbol] || 6;

    return calculateMaxLeverage({
      collateralDecimals,
      debtDecimals,
      initialCollateralAmount: "0", // No existing position
      initialDebtAmount: "0", // No existing debt
      additionalCollateralAmount: amount,
      priceOfCollateral: MOCK_PRICES.COLLATERAL_PRICE.toString(),
      priceOfDebt: MOCK_PRICES.DEBT_PRICE.toString(),
      flashloanPremium: MOCK_PRICES.FLASHLOAN_PREMIUM.toString(),
      maxLTV: MOCK_PRICES.MAX_LTV.toString(),
    });
  }, [collateralAmount, selectedPair]);

  // Calculate actual leverage position details using HTML tester logic
  const leveragePosition = useMemo(() => {
    if (
      !collateralAmount ||
      parseFloat(collateralAmount) === 0 ||
      !selectedPair
    ) {
      return {
        flashloanAmount: "0",
        ltv: "0",
        collateralAmount: collateralAmount || "0",
        debtAmount: "0",
      };
    }

    // Get token decimals dynamically
    const collateralDecimals =
      TOKEN_DECIMALS[selectedPair.collateralAsset.symbol] || 18;
    const debtDecimals = TOKEN_DECIMALS[selectedPair.debtAsset.symbol] || 6;

    const result = calculateLeverageParams({
      collateralDecimals,
      debtDecimals,
      initialCollateralAmount: "0", // No existing position
      initialDebtAmount: "0", // No existing debt
      additionalCollateralAmount: collateralAmount,
      targetLeverage: multiplier.toString(),
      priceOfCollateral: MOCK_PRICES.COLLATERAL_PRICE.toString(),
      priceOfDebt: MOCK_PRICES.DEBT_PRICE.toString(),
      flashloanPremium: MOCK_PRICES.FLASHLOAN_PREMIUM.toString(),
    });

    return result;
  }, [collateralAmount, multiplier, selectedPair]);

  return { maxLeverage, leveragePosition };
}
