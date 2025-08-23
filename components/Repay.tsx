"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import NumberInput from "@/components/ui/NumberInput";
import Slider from "@/components/ui/Slider";
import { LAYOUT } from "@/constants/layout";

export default function Repay() {
  const [activeTab, setActiveTab] = useState<"wallet" | "swap">("swap");
  const [repayPercent, setRepayPercent] = useState(0);
  const [collateralAmount, setCollateralAmount] = useState("");
  const [debtAmount, setDebtAmount] = useState("");
  const [repayAsset, setRepayAsset] = useState<any>(null);

  // Load repay asset info from localStorage
  useEffect(() => {
    const storedAsset = localStorage.getItem("repayAsset");
    if (storedAsset) {
      try {
        const assetInfo = JSON.parse(storedAsset);
        setRepayAsset(assetInfo);
      } catch (error) {
        console.error("Failed to parse repay asset info:", error);
        // Fallback to default LBTC
        setRepayAsset({
          symbol: "LBTC",
          amount: "0.000161",
          usdValue: "$15.68",
          asset: {
            symbol: "LBTC",
            asset: "LBTC",
            icon: "₿",
            iconBg: "from-orange-500 to-orange-600",
            imageUrl: null,
          },
        });
      }
    } else {
      // Default fallback
      setRepayAsset({
        symbol: "LBTC",
        amount: "0.000161",
        usdValue: "$15.68",
        asset: {
          symbol: "LBTC",
          asset: "LBTC",
          icon: "₿",
          iconBg: "from-orange-500 to-orange-600",
          imageUrl: null,
        },
      });
    }
  }, []);

  return (
    <div className="text-white p-6">
      <div className={`${LAYOUT.MAX_WIDTH_CONTAINER} mx-auto`}>
        {/* Back to position button */}
        <button
          type="button"
          className="flex items-center text-[#728395] hover:text-white transition-colors mb-6"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Back</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to position
        </button>

        {/* Page title */}
        <h1 className="text-3xl font-bold mb-8">Repay</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Main repay interface */}
          <div className="lg:col-span-2">
            {/* Tab selector - matching Lending page style */}
            <div className="flex bg-[#0a1420] rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("wallet")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === "wallet"
                    ? "bg-[#14304e] text-white"
                    : "text-[#728395] hover:text-white"
                }`}
              >
                From wallet
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("swap")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === "swap"
                    ? "bg-[#14304e] text-white"
                    : "text-[#728395] hover:text-white"
                }`}
              >
                Swap collateral
              </button>
            </div>

            {/* Collateral to swap section - Updated design */}
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-medium">
                  {activeTab === "wallet"
                    ? "From Wallet"
                    : "Collateral to Swap"}
                </span>
                <div className="flex items-center text-sm text-[#728395]">
                  <span className="mr-2">Balance:</span>
                  <span className="text-white font-medium">28.29 USDC</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2775CA] to-[#1e5f9a] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">$</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">USDC</div>
                    <div className="text-[#728395] text-sm">USD Coin</div>
                  </div>
                </div>
                <div className="text-right">
                  <NumberInput
                    value={collateralAmount}
                    onChange={setCollateralAmount}
                    placeholder="0.00"
                    className="text-2xl font-bold text-right max-w-[140px] bg-transparent border-none text-white"
                  />
                  <div className="text-[#728395] text-sm mt-1">~ $0.00</div>
                </div>
              </div>
            </div>

            {/* Debt to repay section - Updated design */}
            {repayAsset && (
              <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">Debt to Repay</span>
                  <div className="flex items-center text-sm text-[#728395]">
                    <span className="mr-2">Owed:</span>
                    <span className="text-[#f59e0b] font-medium">
                      {repayAsset.amount} {repayAsset.symbol}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      {repayAsset.asset?.imageUrl ? (
                        <Image
                          src={repayAsset.asset.imageUrl}
                          alt={repayAsset.symbol}
                          width={48}
                          height={48}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br ${repayAsset.asset?.iconBg || "from-orange-500 to-orange-600"}`}
                        >
                          <span className="text-white font-bold text-sm">
                            {repayAsset.asset?.icon || repayAsset.symbol[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {repayAsset.symbol}
                      </div>
                      <div className="text-[#728395] text-sm">
                        {repayAsset.asset?.asset || repayAsset.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <NumberInput
                      value={debtAmount}
                      onChange={setDebtAmount}
                      placeholder="0.00"
                      className="text-2xl font-bold text-right max-w-[140px] bg-transparent border-none text-white"
                    />
                    <div className="text-[#728395] text-sm mt-1">
                      {repayAsset.usdValue}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Repay percentage slider - Enhanced design */}
            <div className="bg-gradient-to-br from-[#0c1d2f] to-[#0a1420] border border-[#14304e] rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-white font-semibold text-lg">
                    Repay Amount
                  </div>
                  <div className="text-[#728395] text-sm mt-1">
                    Select percentage of debt to repay
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#2ae5b9] font-bold text-2xl">
                    {repayPercent}%
                  </span>
                  <div className="text-[#728395] text-sm mt-1">
                    of total debt
                  </div>
                </div>
              </div>

              <div className="relative">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={repayPercent}
                  onChange={setRepayPercent}
                  fillColor="rgba(42,229,185,0.8)"
                  trackColor="rgba(42,229,185,0.15)"
                  className="h-1.5"
                />
                <div className="flex justify-between text-xs text-[#728395] mt-3">
                  <span className="bg-[#0a1420] px-2 py-1 rounded">0%</span>
                  <span className="bg-[#0a1420] px-2 py-1 rounded">25%</span>
                  <span className="bg-[#0a1420] px-2 py-1 rounded">50%</span>
                  <span className="bg-[#0a1420] px-2 py-1 rounded">75%</span>
                  <span className="bg-[#0a1420] px-2 py-1 rounded">100%</span>
                </div>
              </div>
            </div>

            {/* Action buttons - Enhanced design */}
            <div className="flex space-x-4">
              <button
                type="button"
                className="flex-1 py-4 px-6 bg-gradient-to-r from-[#14304e] to-[#1a3a5c] border border-[#14304e] text-white font-semibold rounded-lg hover:from-[#1a3a5c] hover:to-[#1e4062] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add to Batch
              </button>
              <button
                type="button"
                className="flex-1 py-4 px-6 bg-gradient-to-r from-[#2ae5b9] to-[#22c09b] text-black font-semibold rounded-lg hover:from-[#22c09b] hover:to-[#1ea87a] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Repay Debt
              </button>
            </div>
          </div>

          {/* Right side - Position summary */}
          <div className="bg-gradient-to-br from-[#0c1d2f] to-[#0a1420] border border-[#14304e] rounded-lg p-6 h-fit">
            {/* Current Position */}
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Position Summary
              </h3>

              {/* Collateral */}
              <div className="bg-[#08131f] rounded-lg p-4 mb-3">
                <div className="text-[#728395] text-sm mb-2">Collateral</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[#2775CA] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">$</span>
                    </div>
                    <span className="font-semibold">USDC</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">28.29</div>
                    <div className="text-[#728395] text-xs">$28.29</div>
                  </div>
                </div>
              </div>

              {/* Debt */}
              {repayAsset && (
                <div className="bg-[#08131f] rounded-lg p-4">
                  <div className="text-[#728395] text-sm mb-2">Debt</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                        {repayAsset.asset?.imageUrl ? (
                          <Image
                            src={repayAsset.asset.imageUrl}
                            alt={repayAsset.symbol}
                            width={24}
                            height={24}
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br ${repayAsset.asset?.iconBg || "from-orange-500 to-orange-600"}`}
                          >
                            <span className="text-white font-bold text-xs">
                              {repayAsset.asset?.icon || repayAsset.symbol[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-semibold">{repayAsset.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#f59e0b]">
                        {repayAsset.amount}
                      </div>
                      <div className="text-[#728395] text-xs">
                        {repayAsset.usdValue}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Position metrics */}
            <div className="space-y-3 border-t border-[#14304e] pt-6">
              <div className="flex justify-between items-center">
                <span className="text-[#728395] text-sm">Health Factor</span>
                <div className="text-right">
                  <span className="text-[#2ae5b9] font-bold text-lg">1.24</span>
                  <div className="text-[#728395] text-xs">Safe</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395] text-sm">Current LTV</span>
                <div className="text-right">
                  <div className="font-semibold">64.21%</div>
                  <div className="text-[#728395] text-xs">Max: 80.00%</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395] text-sm">
                  Liquidation Price
                </span>
                <div className="text-right">
                  <div className="font-semibold">$97,340</div>
                  <div className="text-[#728395] text-xs">per LBTC</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395] text-sm">APY</span>
                <span className="text-[#f59e0b] font-semibold">-4.2%</span>
              </div>
            </div>

            {/* Transaction details */}
            <div className="space-y-3 border-t border-[#14304e] pt-6 mt-6">
              <div className="flex justify-between">
                <span className="text-[#728395] text-sm">Repay Method</span>
                <span className="font-semibold text-white">
                  {activeTab === "wallet" ? "From Wallet" : "Swap & Repay"}
                </span>
              </div>
              {activeTab === "swap" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#728395] text-sm">Price Impact</span>
                    <span className="text-[#2ae5b9] font-semibold">
                      &lt; 0.01%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#728395] text-sm">
                      Slippage Tolerance
                    </span>
                    <span className="font-semibold text-white">0.5%</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-[#728395] text-sm">Network Fee</span>
                <div className="text-right">
                  <div className="font-semibold text-white">~0.002 ETH</div>
                  <div className="text-[#728395] text-xs">$6.84</div>
                </div>
              </div>
              <div className="bg-[#08131f] rounded-lg p-3 mt-4">
                <div className="text-[#728395] text-xs mb-1">After Repay</div>
                <div className="flex justify-between text-sm">
                  <span className="text-white">New Health Factor:</span>
                  <span className="text-[#2ae5b9] font-semibold">2.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
