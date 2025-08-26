"use client";

import { useAaveData } from "@/hooks/useAaveData";
import type { LendingProps } from "@/types/lending";

interface LendingOverviewTabProps {
  selectedPair?: LendingProps["selectedPair"];
  collateralPrice: number;
}

export function LendingOverviewTab({
  selectedPair,
  collateralPrice,
}: LendingOverviewTabProps) {
  const { getSupplyAPY, getBorrowAPY, getLTV, getLLTV } = useAaveData();

  return (
    <>
      <h2 className="text-heading text-lg font-heading font-semibold mb-8 text-sage-600">Overview</h2>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div>
          <div className="text-body text-sm mb-2 font-heading text-sage-600">Oracle price</div>
          <div className="text-heading text-lg font-heading font-medium text-sage-400">
            ${collateralPrice.toFixed(4)}
          </div>
          <div className="text-muted text-xs mt-1 flex items-center">
            {selectedPair?.collateralAsset.asset || "PT-USDe-25SEP2025"}
            <svg
              aria-hidden="true"
              focusable="false"
              className="ml-1.5 w-3 h-3 text-muted"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M103 497c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55L424 408c13.3 0 24-10.7 24-24s-10.7-24-24-24L81.9 360l55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L7 367c-9.4 9.4-9.4 24.6 0 33.9l96 96zM441 145c9.4-9.4 9.4-24.6 0-33.9L345 15c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l55 55L24 104c-13.3 0-24 10.7-24 24s10.7 24 24 24l342.1 0-55 55c9.4-9.4 9.4-24.6 0 33.9s24.6 9.4 33.9 0l96-96z"
              />
            </svg>
          </div>
        </div>

        <div>
          <div className="text-body text-sm mb-2 font-heading text-sage-600">Supply APY</div>
          <div className="text-heading text-lg font-heading font-medium text-sage-400">
            {selectedPair?.collateralAsset?.symbol
              ? getSupplyAPY(selectedPair.collateralAsset.symbol) || "13.45%"
              : "13.45%"}
          </div>
        </div>

        <div>
          <div className="text-body text-sm mb-2 font-heading text-sage-600">Borrow APY</div>
          <div className="text-heading text-lg font-heading font-medium text-sage-400">
            {selectedPair?.debtAsset?.symbol
              ? getBorrowAPY(selectedPair.debtAsset.symbol) || "9.90%"
              : "9.90%"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div>
          <div className="text-body text-sm mb-2 font-heading text-sage-600">Correlated assets</div>
          <div className="text-heading text-lg font-heading text-sage-400">
            {selectedPair?.collateralAsset?.symbol === "WKAIA" ||
              selectedPair?.debtAsset?.symbol === "WKAIA"
              ? "No"
              : "Yes"}
          </div>
        </div>

        <div>
          <div className="text-body text-sm mb-2 font-heading text-sage-600">Max LTV</div>
          <div className="text-heading text-lg font-heading font-medium text-sage-400">
            {selectedPair?.collateralAsset?.symbol
              ? getLTV(selectedPair.collateralAsset.symbol) || "88.00%"
              : "88.00%"}
          </div>
        </div>

        <div>
          <div className="text-body text-sm mb-2 font-heading text-sage-600">LLTV</div>
          <div className="text-heading text-lg font-heading font-medium text-sage-400">
            {selectedPair?.collateralAsset?.symbol
              ? getLLTV(selectedPair.collateralAsset.symbol) || "90.00%"
              : "90.00%"}
          </div>
        </div>
      </div>
    </>
  );
}
