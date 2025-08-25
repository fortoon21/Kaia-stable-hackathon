"use client";

import Image from "next/image";
import type { LendingProps } from "@/types/lending";

interface LendingHeaderProps {
  selectedPair?: LendingProps["selectedPair"];
}

export function LendingHeader({ selectedPair }: LendingHeaderProps) {
  return (
    <>
      {/* Token Icons */}
      <div className="absolute left-0 top-[20px] flex -space-x-3">
        <div
          className="relative rounded-[30px] size-[60px]"
          data-name="Border"
          data-node-id="1:6"
        >
          <div
            aria-hidden="true"
            className="absolute border border-[#14304e] border-solid inset-0 pointer-events-none rounded-[30px]"
          />
          <div
            className="absolute bg-[#14304e] left-px overflow-clip rounded-[29px] size-[58px] top-px"
            data-name="Background"
            data-node-id="1:7"
          >
            <div
              className="absolute inset-0 rounded-[29px] flex items-center justify-center"
              data-name="Border"
              data-node-id="1:9"
            >
              {selectedPair?.collateralAsset.imageUrl ? (
                <Image
                  src={selectedPair.collateralAsset.imageUrl}
                  alt={selectedPair.collateralAsset.symbol}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover z-10"
                />
              ) : (
                <div className="w-14 h-14 bg-[#17e3c2] rounded-full flex items-center justify-center text-white font-bold z-10">
                  {selectedPair?.collateralAsset.symbol?.[0] || "K"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="relative rounded-[30px] size-[60px] z-10"
          data-name="Border"
          data-node-id="1:10"
        >
          <div
            aria-hidden="true"
            className="absolute border border-[#14304e] border-solid inset-0 pointer-events-none rounded-[30px]"
          />
          <div
            className="absolute bg-[#14304e] left-px overflow-clip rounded-[29px] size-[58px] top-px"
            data-name="Background"
            data-node-id="1:11"
          >
            <div className="absolute inset-0 rounded-[29px] flex items-center justify-center">
              {selectedPair?.debtAsset.imageUrl ? (
                <Image
                  src={selectedPair.debtAsset.imageUrl}
                  alt={selectedPair.debtAsset.symbol}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="bg-blue-500 rounded-full w-14 h-14 flex items-center justify-center text-white font-bold">
                  {selectedPair?.debtAsset.symbol?.[0] || "U"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="absolute left-[120px] top-0">
        <div className="text-[#728395] text-[16px] font-semibold leading-[20px] mb-2">
          {selectedPair?.collateralAsset.protocol || "TGIF Yield"}
        </div>
        <div className="flex items-center text-[#f7f7f8] text-[36px] font-medium leading-[48px]">
          <span>{selectedPair?.collateralAsset.asset || "Error"}</span>
          <span className="text-[#728395] mx-2">/</span>
          <span>{selectedPair?.debtAsset.symbol || "USDC"}</span>
        </div>
      </div>
    </>
  );
}
