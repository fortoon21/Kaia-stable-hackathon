"use client";

import { DataRow } from "@/components/ui/DataDisplay";
import type { LendingProps, TabType } from "@/types/lending";
import { formatDollarAmount, formatPercentage } from "@/utils/formatters";

interface LendingPositionInfoProps {
  activeTab: TabType;
  selectedPair?: LendingProps["selectedPair"];
  multiplier: number;
  collateralAmount: string;
  leveragePosition: {
    totalCollateral: number;
    totalDebt: number;
    netAPY: number;
    currentLTV: number;
    liquidationPrice: number;
    healthFactor: number;
  };
  collateralPrice: number;
  debtPrice: number;
  isReady: boolean;
}

export function LendingPositionInfo({
  activeTab,
  selectedPair,
  multiplier,
  collateralAmount,
  leveragePosition,
  collateralPrice,
  debtPrice,
  isReady,
}: LendingPositionInfoProps) {
  if (activeTab !== "multiply") {
    return (
      <div className="space-y-3">
        <DataRow
          label="Collateral Deposited"
          value={`${collateralAmount || "0"} ${selectedPair?.collateralAsset.symbol || ""}`}
          subValue={formatDollarAmount(parseFloat(collateralAmount || "0") * collateralPrice)}
        />
        <DataRow
          label="Amount to Borrow"
          value={`0 ${selectedPair?.debtAsset.symbol || ""}`}
          subValue="$0.00"
        />
        <DataRow
          label="Borrow APY"
          value="5.40%"
          valueClassName="text-orange-400"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DataRow
        label="Total Collateral"
        value={
          isReady
            ? `${leveragePosition.totalCollateral.toFixed(2)} ${selectedPair?.collateralAsset.symbol || ""}`
            : `${(parseFloat(collateralAmount || "0") * multiplier).toFixed(2)} ${selectedPair?.collateralAsset.symbol || ""}`
        }
        subValue={
          isReady
            ? formatDollarAmount(leveragePosition.totalCollateral * collateralPrice)
            : formatDollarAmount(parseFloat(collateralAmount || "0") * multiplier * collateralPrice)
        }
      />
      
      <DataRow
        label="Total Debt"
        value={
          isReady
            ? `${leveragePosition.totalDebt.toFixed(2)} ${selectedPair?.debtAsset.symbol || ""}`
            : `${((parseFloat(collateralAmount || "0") * multiplier - parseFloat(collateralAmount || "0")) * collateralPrice / debtPrice).toFixed(2)} ${selectedPair?.debtAsset.symbol || ""}`
        }
        subValue={
          isReady
            ? formatDollarAmount(leveragePosition.totalDebt * debtPrice)
            : formatDollarAmount((parseFloat(collateralAmount || "0") * multiplier - parseFloat(collateralAmount || "0")) * collateralPrice)
        }
      />
      
      <DataRow
        label="Net APY"
        value={
          isReady
            ? formatPercentage(leveragePosition.netAPY)
            : formatPercentage(8.5 * multiplier - 5.4 * (multiplier - 1))
        }
        valueClassName="text-[#2ae5b9]"
      />
      
      <DataRow
        label="Current LTV"
        value={
          isReady
            ? formatPercentage(leveragePosition.currentLTV * 100)
            : formatPercentage(((multiplier - 1) / multiplier) * 100)
        }
      />
      
      <DataRow
        label="Liquidation Price"
        value={
          isReady
            ? formatDollarAmount(leveragePosition.liquidationPrice)
            : formatDollarAmount(collateralPrice * 0.8)
        }
        valueClassName="text-orange-400"
      />
      
      <DataRow
        label="Health Factor"
        value={
          isReady
            ? leveragePosition.healthFactor.toFixed(2)
            : "2.50"
        }
        valueClassName={
          isReady && leveragePosition.healthFactor < 1.5
            ? "text-orange-400"
            : "text-[#2ae5b9]"
        }
      />
    </div>
  );
}