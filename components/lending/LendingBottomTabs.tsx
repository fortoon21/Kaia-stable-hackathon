"use client";

import Image from "next/image";
import type { BottomTabType, LendingProps } from "@/types/lending";

interface LendingBottomTabsProps {
  activeTab: BottomTabType;
  onTabChange: (tab: BottomTabType) => void;
  selectedPair?: LendingProps["selectedPair"];
}

export function LendingBottomTabs({
  activeTab,
  onTabChange,
  selectedPair,
}: LendingBottomTabsProps) {
  return (
    <div className="flex w-full">
      <button
        type="button"
        onClick={() => onTabChange("pair")}
        className={`flex-1 flex items-center justify-center space-x-2 px-5 py-4 border-b-2 ${
          activeTab === "pair"
            ? "border-[#2ae5b9] text-[#ddfbf4]"
            : "border-transparent text-[#728395] hover:text-white"
        } transition-colors cursor-pointer`}
      >
        <div className="flex space-x-1">
          {selectedPair?.collateralAsset.imageUrl ? (
            <Image
              src={selectedPair.collateralAsset.imageUrl}
              alt={selectedPair.collateralAsset.symbol}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full"
            />
          ) : (
            <div className="w-5 h-5 bg-[#17e3c2] rounded-full"></div>
          )}
          {selectedPair?.debtAsset.imageUrl ? (
            <Image
              src={selectedPair.debtAsset.imageUrl}
              alt={selectedPair.debtAsset.symbol}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full"
            />
          ) : (
            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
          )}
        </div>
        <span className="font-semibold">Pair details</span>
      </button>
      <button
        type="button"
        onClick={() => onTabChange("collateral")}
        className={`flex-1 flex items-center justify-center space-x-2 px-5 py-4 border-b-2 ${
          activeTab === "collateral"
            ? "border-[#2ae5b9] text-[#ddfbf4]"
            : "border-transparent text-[#728395] hover:text-white"
        } transition-colors cursor-pointer`}
      >
        {selectedPair?.collateralAsset.imageUrl ? (
          <Image
            src={selectedPair.collateralAsset.imageUrl}
            alt={selectedPair.collateralAsset.symbol}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
          />
        ) : (
          <div className="w-5 h-5 bg-[#17e3c2] rounded-full"></div>
        )}
        <span className="font-semibold">
          Collateral {selectedPair?.collateralAsset.symbol || "WKAIA"}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onTabChange("debt")}
        className={`flex-1 flex items-center justify-center space-x-2 px-5 py-4 border-b-2 ${
          activeTab === "debt"
            ? "border-[#2ae5b9] text-[#ddfbf4]"
            : "border-transparent text-[#728395] hover:text-white"
        } transition-colors cursor-pointer`}
      >
        {selectedPair?.debtAsset.imageUrl ? (
          <Image
            src={selectedPair.debtAsset.imageUrl}
            alt={selectedPair.debtAsset.symbol}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
          />
        ) : (
          <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
        )}
        <span className="font-semibold">
          Debt {selectedPair?.debtAsset.symbol || "USDT0"}
        </span>
      </button>
    </div>
  );
}
