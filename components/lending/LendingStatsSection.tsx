"use client";

import { useAaveData } from "@/hooks/useAaveData";
import type { LendingProps } from "@/types/lending";

interface LendingStatsSectionProps {
  selectedPair?: LendingProps["selectedPair"];
  realMaxMultiplier: number;
}

export function LendingStatsSection({
  selectedPair,
  realMaxMultiplier,
}: LendingStatsSectionProps) {
  const { getLiquidity, getMaxROE } = useAaveData();

  return (
    <div
      className="absolute h-[98.66px] left-0 right-4 top-[140px] bg-[#0a1a14]/10 rounded-lg p-2"
      data-name="List"
      data-node-id="1:18"
    >
      {/* Liquidity */}
      <div
        className="absolute leading-[0] left-0 not-italic right-[582px] top-0 bottom-0 bg-[#08131f]/30 rounded-lg"
        data-name="Item"
        data-node-id="1:19"
      >
        <div
          className="absolute flex flex-col font-semibold h-5 justify-center left-0 text-[#728395] text-[16px] top-2.5 translate-y-[-50%] w-[66.993px]"
          data-node-id="1:20"
        >
          <p className="block leading-[20px]">Liquidity</p>
        </div>
        <div
          className="absolute flex flex-col font-medium h-[39px] justify-center left-0 text-[#728395] text-[32px] top-[48.5px] translate-y-[-50%] w-[20.912px]"
          data-node-id="1:21"
        >
          <p className="block leading-[42.67px]">$</p>
        </div>
        <div
          className="absolute flex flex-col font-medium h-[39px] justify-center left-[26.59px] text-[#f7f7f8] text-[32px] top-[48.5px] translate-y-[-50%] w-[117.772px]"
          data-node-id="1:22"
        >
          <p className="block leading-[42.67px]">
            {selectedPair?.debtAsset?.symbol
              ? getLiquidity(selectedPair.debtAsset.symbol)?.usdValue?.replace(
                  "$",
                  ""
                ) || "22.84M"
              : "22.84M"}
          </p>
        </div>
        <div
          className="absolute flex flex-col font-semibold h-[17px] justify-center left-0 text-[#728395] text-[14px] top-[88.16px] translate-y-[-50%] w-[95.427px]"
          data-node-id="1:23"
        >
          <p className="block leading-[20px]">
            {selectedPair?.debtAsset?.symbol
              ? getLiquidity(selectedPair.debtAsset.symbol)?.amount || "22.85M"
              : "22.85M"}{" "}
            {selectedPair?.debtAsset.symbol || "USDC"}
          </p>
        </div>
      </div>

      {/* Max multiplier */}
      <div
        className="absolute leading-[0] left-[275px] not-italic right-[307px] top-0 bottom-0 bg-[#08131f]/30 rounded-lg"
        data-name="Item"
        data-node-id="1:24"
      >
        <div
          className="absolute flex flex-col font-semibold h-5 justify-center left-0 text-[#728395] text-[16px] top-2.5 translate-y-[-50%] w-[109.729px]"
          data-node-id="1:25"
        >
          <p className="block leading-[20px]">Max multiplier</p>
        </div>
        <div
          className="absolute flex flex-col font-medium h-[39px] justify-center left-0 text-[#f7f7f8] text-[32px] top-[48.5px] translate-y-[-50%] w-[63.875px]"
          data-node-id="1:26"
        >
          <p className="block leading-[42.67px]">
            {realMaxMultiplier > 1 ? realMaxMultiplier.toFixed(2) : "--"}
          </p>
        </div>
        <div
          className="absolute flex flex-col font-medium h-[39px] justify-center left-[69.48px] text-[#728395] text-[32px] top-[48.5px] translate-y-[-50%] w-[17.944px]"
          data-node-id="1:27"
        >
          <p className="block leading-[42.67px]">x</p>
        </div>
      </div>

      {/* Max ROE */}
      <div
        className="absolute leading-[0] left-[550px] not-italic right-8 top-0 bottom-0 bg-[#08131f]/30 rounded-lg"
        data-name="Item"
        data-node-id="1:28"
      >
        <div
          className="absolute flex flex-col font-semibold h-5 justify-center left-0 text-[#728395] text-[16px] top-2.5 translate-y-[-50%] w-[90px]"
          data-node-id="1:29"
        >
          <p className="block leading-[20px] whitespace-nowrap">Max ROE</p>
        </div>
        <div
          className="absolute flex flex-col font-medium h-[39px] justify-center left-0 text-[#23c09b] text-[32px] top-[48.5px] translate-y-[-50%] w-[85.221px]"
          data-node-id="1:30"
        >
          <p className="block leading-[42.67px]">
            {selectedPair?.collateralAsset?.symbol &&
            selectedPair?.debtAsset?.symbol
              ? getMaxROE(
                  selectedPair.collateralAsset.symbol,
                  selectedPair.debtAsset.symbol
                )?.replace("%", "") || "39.41"
              : "39.41"}
          </p>
        </div>
        <div
          className="absolute flex flex-col font-medium h-[39px] justify-center left-[91px] text-[#728395] text-[32px] top-[48.5px] translate-y-[-50%] w-[20px]"
          data-node-id="1:31"
        >
          <p className="block leading-[42.67px]">%</p>
        </div>
      </div>
    </div>
  );
}
