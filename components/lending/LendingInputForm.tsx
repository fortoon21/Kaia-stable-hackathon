"use client";

import Slider from "@/components/ui/Slider";
import type { LendingProps, TabType } from "@/types/lending";
import { formatDollarAmount } from "@/utils/formatters";

interface LendingInputFormProps {
  activeTab: TabType;
  selectedPair?: LendingProps["selectedPair"];
  collateralAmount: string;
  onCollateralAmountChange: (value: string) => void;
  collateralBalance: string;
  isLoadingBalance: boolean;
  collateralPrice: number;
  multiplier: number;
  onMultiplierChange: (value: number) => void;
  multiplierInput: string;
  onMultiplierInputChange: (value: string) => void;
  maxMultiplier: number;
  ltvValue: number;
  onLtvChange: (value: number) => void;
  ltvInput: string;
  onLtvInputChange: (value: string) => void;
}

export function LendingInputForm({
  activeTab,
  selectedPair,
  collateralAmount,
  onCollateralAmountChange,
  collateralBalance,
  isLoadingBalance,
  collateralPrice,
  multiplier,
  onMultiplierChange,
  multiplierInput,
  onMultiplierInputChange,
  maxMultiplier,
  ltvValue,
  onLtvChange,
  ltvInput,
  onLtvInputChange,
}: LendingInputFormProps) {
  const handleCollateralAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onCollateralAmountChange(value);
    }
  };

  const handleMaxClick = () => {
    if (collateralBalance && collateralBalance !== "0") {
      onCollateralAmountChange(collateralBalance);
    }
  };

  const handleMultiplierSliderChange = (value: number) => {
    onMultiplierChange(value);
    onMultiplierInputChange(value.toFixed(2));
  };

  const handleMultiplierInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    onMultiplierInputChange(value);
    const numValue = parseFloat(value);
    if (!Number.isNaN(numValue) && numValue >= 1 && numValue <= maxMultiplier) {
      onMultiplierChange(numValue);
    }
  };

  const handleLtvSliderChange = (value: number) => {
    onLtvChange(value);
    onLtvInputChange(value.toFixed(1));
  };

  const handleLtvInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onLtvInputChange(value);
    const numValue = parseFloat(value);
    if (!Number.isNaN(numValue) && numValue >= 0 && numValue <= 80) {
      onLtvChange(numValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Collateral Amount Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-body font-heading">Collateral Amount</label>
          <div className="text-xs text-body">
            Balance:{" "}
            {isLoadingBalance ? "Loading..." : collateralBalance || "0"}{" "}
            {selectedPair?.collateralAsset.symbol}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={collateralAmount}
            onChange={handleCollateralAmountChange}
            placeholder="0.00"
            className="w-full bg-surface-2 text-heading rounded-sm px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-[#2ae5b9]"
          />
          <button
            type="button"
            onClick={handleMaxClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-100/20 text-primary-100 px-3 py-1 rounded-xs text-sm hover:bg-primary-100/30 transition-colors font-heading"
          >
            MAX
          </button>
        </div>
        <div className="text-xs text-body mt-1">
          ≈{" "}
          {formatDollarAmount(
            parseFloat(collateralAmount || "0") * collateralPrice
          )}
        </div>
      </div>

      {/* Multiplier/LTV Controls */}
      {activeTab === "multiply" ? (
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm text-body font-heading">Multiplier</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={multiplierInput}
                onChange={handleMultiplierInputChange}
                className="w-16 bg-surface-2 text-heading rounded-xs px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2ae5b9]"
              />
              <span className="text-body text-sm">x</span>
            </div>
          </div>
          <Slider
            min={1}
            max={maxMultiplier}
            step={0.01}
            value={multiplier}
            onChange={handleMultiplierSliderChange}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-body">
            <span>1.00x</span>
            <span>{maxMultiplier.toFixed(2)}x</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm text-body font-heading">LTV</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={ltvInput}
                onChange={handleLtvInputChange}
                className="w-16 bg-surface-2 text-heading rounded-xs px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2ae5b9]"
              />
              <span className="text-body text-sm">%</span>
            </div>
          </div>
          <Slider
            min={0}
            max={80}
            step={0.1}
            value={ltvValue}
            onChange={handleLtvSliderChange}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-body">
            <span>0%</span>
            <span>80%</span>
          </div>
        </div>
      )}
    </div>
  );
}
