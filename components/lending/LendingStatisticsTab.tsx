"use client";

import { useAaveData } from "@/hooks/useAaveData";
import type { BottomTabType, LendingProps } from "@/types/lending";

interface LendingStatisticsTabProps {
  selectedPair?: LendingProps["selectedPair"];
  bottomTab: BottomTabType;
}

export function LendingStatisticsTab({
  selectedPair,
  bottomTab,
}: LendingStatisticsTabProps) {
  const {
    getTotalSupply,
    getTotalBorrowed,
    getLiquidity,
    getSupplyAPY,
    getBorrowAPY,
  } = useAaveData();

  return (
    <>
      <h2 className="text-heading text-xl font-semibold mb-8">Statistics</h2>

      <div className="space-y-8">
        {/* First row - Total supply, Total borrowed, Available liquidity */}
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-body text-sm mb-2">Total supply</div>
            <div className="text-heading text-lg font-medium">
              {bottomTab === "collateral"
                ? selectedPair?.collateralAsset?.symbol
                  ? getTotalSupply(selectedPair.collateralAsset.symbol)
                      ?.usdValue || "$2.85M"
                  : "$2.85M"
                : selectedPair?.debtAsset?.symbol
                  ? getTotalSupply(selectedPair.debtAsset.symbol)?.usdValue ||
                    "$1.24M"
                  : "$1.24M"}
            </div>
            <div className="text-muted text-xs mt-1">
              {bottomTab === "collateral"
                ? selectedPair?.collateralAsset?.symbol
                  ? `${
                      getTotalSupply(selectedPair.collateralAsset.symbol)
                        ?.amount || "20,357,142"
                    } ${selectedPair.collateralAsset.symbol}`
                  : `20,357,142 ${
                      selectedPair?.collateralAsset?.symbol || "WKAIA"
                    }`
                : selectedPair?.debtAsset?.symbol
                  ? `${
                      getTotalSupply(selectedPair.debtAsset.symbol)?.amount ||
                      "1,240,000"
                    } ${selectedPair.debtAsset.symbol}`
                  : `1,240,000 ${selectedPair?.debtAsset?.symbol || "USDT"}`}
            </div>
          </div>

          <div>
            <div className="text-body text-sm mb-2">Total borrowed</div>
            <div className="text-heading text-lg font-medium">
              {bottomTab === "collateral"
                ? selectedPair?.collateralAsset?.symbol
                  ? getTotalBorrowed(selectedPair.collateralAsset.symbol)
                      ?.usdValue || "$2.34M"
                  : "$2.34M"
                : selectedPair?.debtAsset?.symbol
                  ? getTotalBorrowed(selectedPair.debtAsset.symbol)?.usdValue ||
                    "$896K"
                  : "$896K"}
            </div>
            <div className="text-muted text-xs mt-1">
              {bottomTab === "collateral"
                ? selectedPair?.collateralAsset?.symbol
                  ? `${
                      getTotalBorrowed(selectedPair.collateralAsset.symbol)
                        ?.amount || "16,714,285"
                    } ${selectedPair.collateralAsset.symbol}`
                  : `16,714,285 ${
                      selectedPair?.collateralAsset?.symbol || "WKAIA"
                    }`
                : selectedPair?.debtAsset?.symbol
                  ? `${
                      getTotalBorrowed(selectedPair.debtAsset.symbol)?.amount ||
                      "896,000"
                    } ${selectedPair.debtAsset.symbol}`
                  : `896,000 ${selectedPair?.debtAsset?.symbol || "USDT"}`}
            </div>
          </div>

          <div>
            <div className="text-body text-sm mb-2">Available liquidity</div>
            <div className="text-heading text-lg font-medium">
              {bottomTab === "collateral"
                ? selectedPair?.collateralAsset?.symbol
                  ? getLiquidity(selectedPair.collateralAsset.symbol)
                      ?.usdValue || "$506.7K"
                  : "$506.7K"
                : selectedPair?.debtAsset?.symbol
                  ? getLiquidity(selectedPair.debtAsset.symbol)?.usdValue ||
                    "$506.7K"
                  : "$506.7K"}
            </div>
            <div className="text-muted text-xs mt-1">
              {bottomTab === "collateral"
                ? selectedPair?.collateralAsset?.symbol
                  ? `${
                      getLiquidity(selectedPair.collateralAsset.symbol)
                        ?.amount || "506.7K"
                    } ${selectedPair.collateralAsset.symbol}`
                  : `${selectedPair?.liquidityAmount || "506.7K"} ${
                      selectedPair?.liquidityToken || "WKAIA"
                    }`
                : selectedPair?.debtAsset?.symbol
                  ? `${
                      getLiquidity(selectedPair.debtAsset.symbol)?.amount ||
                      "506.7K"
                    } ${selectedPair.debtAsset.symbol}`
                  : `${selectedPair?.liquidityAmount || "506.7K"} ${
                      selectedPair?.liquidityToken || "USDT"
                    }`}
            </div>
          </div>
        </div>

        {/* Second row - Supply APY, Borrow APY, Empty */}
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-body text-sm mb-2">Supply APY</div>
            <div className="text-primary-100 text-lg font-medium">
              {bottomTab === "collateral"
                ? selectedPair?.collateralAsset?.symbol
                  ? getSupplyAPY(selectedPair.collateralAsset.symbol) || "8.83%"
                  : "8.83%"
                : selectedPair?.debtAsset?.symbol
                  ? getSupplyAPY(selectedPair.debtAsset.symbol) || "8.83%"
                  : "8.83%"}
            </div>
          </div>

          <div>
            <div className="text-body text-sm mb-2">Borrow APY</div>
            <div className="text-orange-400 text-lg font-medium">
              {bottomTab === "collateral"
                ? selectedPair?.collateralAsset?.symbol
                  ? getBorrowAPY(selectedPair.collateralAsset.symbol) || "5.40%"
                  : "5.40%"
                : selectedPair?.debtAsset?.symbol
                  ? getBorrowAPY(selectedPair.debtAsset.symbol) || "5.40%"
                  : "5.40%"}
            </div>
          </div>

          <div>{/* Empty space for alignment */}</div>
        </div>
      </div>
    </>
  );
}
