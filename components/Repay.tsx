"use client";

import { useState } from "react";

export default function Repay() {
  const [activeTab, setActiveTab] = useState<"wallet" | "swap">("swap");
  const [repayPercent, setRepayPercent] = useState(0);

  return (
    <div className="min-h-screen bg-[#08131f] text-white p-6">
      <div className="max-w-7xl mx-auto">
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
            {/* Tab selector */}
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

            {/* Collateral to swap section */}
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#728395] text-sm">
                  Collateral to swap
                </span>
                <div className="flex items-center text-sm text-[#728395]">
                  <span className="mr-2">Market</span>
                  <span>Euler Base</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#2775CA] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">$</span>
                  </div>
                  <div>
                    <div className="font-semibold">USDC</div>
                    <div className="text-[#728395] text-sm">Balance 28.29</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-[#728395] text-sm">~ $0.00</div>
                </div>
              </div>
            </div>

            {/* Debt to repay section */}
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#728395] text-sm">Debt to repay</span>
                <div className="flex items-center text-sm text-[#728395]">
                  <span className="mr-2">Market</span>
                  <span>Euler Base</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">₿</span>
                  </div>
                  <div>
                    <div className="font-semibold">LBTC</div>
                    <div className="text-[#23c09b] text-sm">
                      Max repay 0.000161 Max debt
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-[#728395] text-sm">~ $0.00</div>
                </div>
              </div>
            </div>

            {/* Percent of debt to repay */}
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-semibold">
                  Percent of debt to repay
                </span>
                <span className="text-[#2ae5b9] font-semibold">
                  {repayPercent}%
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={repayPercent}
                  onChange={(e) => setRepayPercent(Number(e.target.value))}
                  className="w-full h-2 bg-[#14304e] rounded-lg appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ae5b9] [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0c1d2f]
                           [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full 
                           [&::-moz-range-thumb]:bg-[#2ae5b9] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 
                           [&::-moz-range-thumb]:border-[#0c1d2f] [&::-moz-range-thumb]:border-none"
                  style={{
                    background: `linear-gradient(to right, #2ae5b9 0%, #2ae5b9 ${repayPercent}%, #14304e ${repayPercent}%, #14304e 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-[#728395] mt-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                className="flex-1 py-3 px-6 bg-[#14304e] border border-[#14304e] text-white font-semibold rounded-lg hover:bg-[#1a3a5c] transition-colors"
              >
                Add to batch
              </button>
              <button
                type="button"
                className="flex-1 py-3 px-6 bg-[#2ae5b9] text-black font-semibold rounded-lg hover:bg-[#2ae5b9]/90 transition-colors"
              >
                Repay
              </button>
            </div>
          </div>

          {/* Right side - Position details */}
          <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-6 h-fit">
            {/* Sell section */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Sell</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-[#2775CA] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">$</span>
                  </div>
                  <span className="font-semibold">USDC</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">0 USDC</div>
                  <div className="text-[#728395] text-sm">$0</div>
                </div>
              </div>
            </div>

            {/* Buy section */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Buy</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">₿</span>
                  </div>
                  <span className="font-semibold">LBTC</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">0 LBTC</div>
                  <div className="text-[#728395] text-sm">$0</div>
                </div>
              </div>
            </div>

            {/* ROE and other details */}
            <div className="space-y-3 border-t border-[#14304e] pt-6">
              <div className="flex justify-between">
                <span className="text-[#728395]">ROE ⚙️</span>
                <span className="text-[#23c09b] font-semibold">11.33%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Current price</span>
                <span>-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Liquidation oracle price</span>
                <div className="text-right">
                  <div className="font-semibold">$0.80 USDC</div>
                  <div className="text-[#728395] text-xs">⇅</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Your LTV (LLTV)</span>
                <div className="text-right">
                  <div className="font-semibold">64.21%</div>
                  <div className="text-[#728395] text-xs">(80.00%)</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Your health</span>
                <span className="font-semibold">1.24</span>
              </div>
            </div>

            {/* Swap details */}
            <div className="space-y-3 border-t border-[#14304e] pt-6 mt-6">
              <div className="flex justify-between">
                <span className="text-[#728395]">Swap</span>
                <span>-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Price impact</span>
                <span>-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Leveraged price impact</span>
                <span>-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Slippage tolerance ⚙️</span>
                <span className="font-semibold">0.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Routed via</span>
                <span>-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728395]">Estimated gas fee</span>
                <div className="text-right">
                  <div className="font-semibold">0 ETH</div>
                  <div className="text-[#728395] text-xs">$0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
