"use client";

import Image from "next/image";
import type { LendingProps } from "@/types/lending";

interface LendingHeaderProps {
  selectedPair?: LendingProps["selectedPair"];
}

export function LendingHeader({ selectedPair }: LendingHeaderProps) {
  if (!selectedPair) return null;

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left side - Asset pair info */}
      <div className="flex items-center space-x-4">
        {/* Asset icons */}
        <div className="flex items-center -space-x-2">
          {/* Collateral Asset Icon */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden relative z-10">
            {selectedPair.collateralAsset.imageUrl ? (
              <Image
                src={selectedPair.collateralAsset.imageUrl}
                alt={selectedPair.collateralAsset.symbol}
                width={48}
                height={48}
                className="object-cover rounded-full"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: selectedPair.collateralAsset.iconBg,
                }}
              >
                {selectedPair.collateralAsset.icon}
              </div>
            )}
          </div>
          
          {/* Debt Asset Icon */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
            {selectedPair.debtAsset.imageUrl ? (
              <Image
                src={selectedPair.debtAsset.imageUrl}
                alt={selectedPair.debtAsset.symbol}
                width={48}
                height={48}
                className="object-cover rounded-full"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: selectedPair.debtAsset.iconBg,
                }}
              >
                {selectedPair.debtAsset.icon}
              </div>
            )}
          </div>
        </div>

        {/* Asset names */}
        <div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-white">
              {selectedPair.collateralAsset.asset}
            </span>
            <span className="text-[#728395]">/</span>
            <span className="font-semibold text-white">
              {selectedPair.debtAsset.asset}
            </span>
          </div>
          <div className="text-xs text-[#728395]">
            Collateral / Debt Asset
          </div>
        </div>
      </div>

      {/* Right side - Protocol info */}
      <div className="text-right">
        <div className="text-sm text-[#728395]">Protocol</div>
        <div className="text-white font-medium">
          {selectedPair.collateralAsset.protocol}
        </div>
      </div>
    </div>
  );
}