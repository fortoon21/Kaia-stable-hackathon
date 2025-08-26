"use client";

import Image from "next/image";
import type { LendingProps } from "@/types/lending";

interface LendingHeaderProps {
  selectedPair?: LendingProps["selectedPair"];
}

export function LendingHeader({ selectedPair }: LendingHeaderProps) {
  return (
    <>
      <div className="absolute left-0 top-0 flex items-end gap-4">
        {/* Token Icons */}
        <div className="flex -space-x-3 mt-[20px]">
          <div
            className="relative rounded-[24px] size-[48px]"
            data-name="Border"
            data-node-id="1:6"
          >
            <div
              aria-hidden="true"
              className="absolute border border-primary-400 border-solid inset-0 pointer-events-none rounded-[24px]"
            />
            <div
              className="absolute bg-primary-400 left-px overflow-clip rounded-[23px] size-[46px] top-px"
              data-name="Background"
              data-node-id="1:7"
            >
              <div
                className="absolute inset-0 rounded-[23px] flex items-center justify-center"
                data-name="Border"
                data-node-id="1:9"
              >
                {selectedPair?.collateralAsset.imageUrl ? (
                  <Image
                    src={selectedPair.collateralAsset.imageUrl}
                    alt={selectedPair.collateralAsset.symbol}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover z-10"
                  />
                ) : (
                  <div className="w-11 h-11 bg-primary-200 rounded-full flex items-center justify-center text-heading font-bold z-10 font-heading">
                    {selectedPair?.collateralAsset.symbol?.[0] || "K"}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="relative rounded-[24px] size-[48px] z-10"
            data-name="Border"
            data-node-id="1:10"
          >
            <div
              aria-hidden="true"
              className="absolute border border-primary-400 border-solid inset-0 pointer-events-none rounded-[24px]"
            />
            <div
              className="absolute bg-primary-400 left-px overflow-clip rounded-[23px] size-[46px] top-px"
              data-name="Background"
              data-node-id="1:11"
            >
              <div className="absolute inset-0 rounded-[23px] flex items-center justify-center">
                {selectedPair?.debtAsset.imageUrl ? (
                  <Image
                    src={selectedPair.debtAsset.imageUrl}
                    alt={selectedPair.debtAsset.symbol}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-secondary rounded-full w-11 h-11 flex items-center justify-center text-heading font-bold font-heading">
                    {selectedPair?.debtAsset.symbol?.[0] || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div>
          <div className="text-body text-[16px] font-semibold leading-[20px] mb-2 font-heading text-sage-400">
            {selectedPair?.collateralAsset.protocol || "TGIF Yield"}
          </div>
          <div className="flex items-center text-heading text-[32px] font-medium leading-[32px] font-heading">
            <span>{selectedPair?.collateralAsset.asset || "Error"}</span>
            <span className="text-body mx-2">/</span>
            <span>{selectedPair?.debtAsset.symbol || "USDC"}</span>
          </div>
        </div>
      </div>
    </>
  );
}
