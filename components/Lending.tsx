"use client";

import { useState } from "react";
import { LendingBottomTabs } from "@/components/lending/LendingBottomTabs";
import { LendingHeader } from "@/components/lending/LendingHeader";
import { LendingOverviewTab } from "@/components/lending/LendingOverviewTab";
import { LendingStatisticsTab } from "@/components/lending/LendingStatisticsTab";
import { LendingStatsSection } from "@/components/lending/LendingStatsSection";
import { LendingTradingPanel } from "@/components/lending/LendingTradingPanel";
import { useAaveData } from "@/hooks/useAaveData";
import { useLeverageCalculations } from "@/hooks/useLeverageCalculations";
import type { BottomTabType, LendingProps } from "@/types/lending";

export default function Lending({ selectedPair }: LendingProps) {
  const [bottomTab, setBottomTab] = useState<BottomTabType>("pair");
  const { maxLeverage, collateralPrice } = useLeverageCalculations(
    selectedPair,
    "",
    1.0
  );
  const { getLTV } = useAaveData();

  // Calculate real max multiplier from Markets logic
  const realMaxMultiplier = selectedPair?.collateralAsset?.symbol
    ? (() => {
        const ltv = getLTV(selectedPair.collateralAsset.symbol);
        if (!ltv) return maxLeverage; // fallback to leverage calculation
        const ltvDecimal = parseFloat(ltv.replace("%", "")) / 100;
        return ltvDecimal >= 1 ? 1 : 1 / (1 - ltvDecimal);
      })()
    : maxLeverage;

  return (
    <div
      className="relative w-full flex flex-col"
      data-name="Body"
      data-node-id="1:4"
    >
      <div className="pt-20 flex-1">
        <div
          className="mx-auto w-[1400px] relative mb-8 min-h-[900px]"
          data-name="Container"
          data-node-id="1:5"
        >
          {/* Combined Header and Stats Wrapper */}
          <div className="absolute left-[80px] top-12 w-[780px] h-[280px] rounded-md p-4">
            {/* Header Section - Component */}
            <div className="absolute left-0 top-0 w-[740px] h-[100px]">
              <LendingHeader selectedPair={selectedPair} />
            </div>

            {/* Stats Section - Using Component */}
            <LendingStatsSection
              selectedPair={selectedPair}
              realMaxMultiplier={realMaxMultiplier}
            />
          </div>
          <div className="absolute left-[900px] top-24 w-[420px] h-[650px]">
            <LendingTradingPanel selectedPair={selectedPair} />
          </div>

          {/* Bottom Tabs and Overview */}
          <div className="absolute left-[80px] w-[780px] top-[332px]">
            {/* Tabs */}
            <div className="h-auto bg-surface-1 border border-line-soft rounded-t-lg shadow-1">
              <LendingBottomTabs
                activeTab={bottomTab}
                onTabChange={setBottomTab}
                selectedPair={selectedPair}
              />
            </div>

            {/* Content based on selected tab */}
            <div className="bg-surface-1 border border-line-soft border-t-0 rounded-b-lg p-8 shadow-1">
              {bottomTab === "pair" ? (
                <LendingOverviewTab
                  selectedPair={selectedPair}
                  collateralPrice={collateralPrice}
                />
              ) : (
                <LendingStatisticsTab
                  selectedPair={selectedPair}
                  bottomTab={bottomTab}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
