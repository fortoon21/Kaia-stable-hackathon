import { useMemo } from "react";
import { MOCK_PRICES } from "@/constants/mockData";
import { TOKEN_DECIMALS } from "@/constants/tokens";
import { usePairPrices } from "@/hooks/useTokenPrices";
import { calculateLeverageParams, calculateMaxLeverage } from "@/lib/leverage";
import type { LendingProps } from "@/types/lending";

export function useLeverageCalculations(
  selectedPair: LendingProps["selectedPair"],
  collateralAmount: string,
  multiplier: number
) {
  // Get real-time prices for the selected pair
  const { collateralPrice, debtPrice, isReady } = usePairPrices(
    selectedPair?.collateralAsset.symbol || "",
    selectedPair?.debtAsset.symbol || ""
  );
  // Calculate max leverage using the leverage library
  const maxLeverage = useMemo(() => {
    if (!selectedPair || !isReady) return 1;

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
      priceOfCollateral: collateralPrice.toString(),
      priceOfDebt: debtPrice.toString(),
      flashloanPremium: MOCK_PRICES.FLASHLOAN_PREMIUM.toString(),
      maxLTV: MOCK_PRICES.MAX_LTV.toString(),
    });
  }, [collateralAmount, selectedPair, isReady, collateralPrice, debtPrice]);

  // Calculate actual leverage position details using HTML tester logic
  const leveragePosition = useMemo(() => {
    if (
      !collateralAmount ||
      parseFloat(collateralAmount) === 0 ||
      !selectedPair ||
      !isReady
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
      priceOfCollateral: collateralPrice.toString(),
      priceOfDebt: debtPrice.toString(),
      flashloanPremium: MOCK_PRICES.FLASHLOAN_PREMIUM.toString(),
    });

    return result;
  }, [
    collateralAmount,
    multiplier,
    selectedPair,
    isReady,
    collateralPrice,
    debtPrice,
  ]);

  return {
    maxLeverage,
    leveragePosition,
    isReady,
    collateralPrice,
    debtPrice,
  };
}
