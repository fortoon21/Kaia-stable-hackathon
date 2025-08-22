"use client";

import Image from "next/image";
import { useState } from "react";
import { MARKET_ASSET_IMAGES, MARKET_GROUPS } from "@/constants/marketData";
import type { MarketsProps } from "@/types/lending";
import { getMarketImage } from "@/utils/formatters";

export default function Markets({ onSelectPair }: MarketsProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Calculate total pairs and assets
  const totalPairs = MARKET_GROUPS.reduce(
    (sum, group) => sum + group.tradingPairs.length,
    0
  );
  const totalAssets = new Set(
    MARKET_GROUPS.flatMap((group) =>
      group.tradingPairs.flatMap((pair) => [
        pair.collateralAsset.symbol,
        pair.debtAsset.symbol,
      ])
    )
  ).size;

  const toggleExpand = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  const getMarketImageComponent = (marketName: string) => {
    const imageUrl = getMarketImage(marketName, MARKET_ASSET_IMAGES);
    if (imageUrl) {
      return (
        <Image
          src={imageUrl}
          alt={marketName}
          width={48}
          height={48}
          className="object-cover rounded-full"
        />
      );
    }

    // Fallback to first letter if no image
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#2ae5b9] rounded-full text-black font-bold">
        {marketName[0]}
      </div>
    );
  };

  return (
    <div className="bg-[#08131f] text-white">
      <div className="max-w-[1400px] mx-auto px-6 pt-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">TGIF Lending Markets</h1>
          <p className="text-[#728395]">
            Leverage your positions with collateral and debt assets
          </p>
        </div>

        {/* Market Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-4">
            <div className="text-[#728395] text-sm mb-1">Total Liquidity</div>
            <div className="text-2xl font-bold">$2.8M</div>
            <div className="text-[#23c09b] text-sm">+15.2% (24h)</div>
          </div>
          <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-4">
            <div className="text-[#728395] text-sm mb-1">Active Pairs</div>
            <div className="text-2xl font-bold">{totalPairs}</div>
            <div className="text-[#2ae5b9] text-sm">{totalAssets} Assets</div>
          </div>
          <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-4">
            <div className="text-[#728395] text-sm mb-1">Best ROE</div>
            <div className="text-2xl font-bold">39.65%</div>
            <div className="text-orange-400 text-sm">KAIA/USDT</div>
          </div>
        </div>

        {/* Markets Table */}
        <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl overflow-hidden">
          {/* Market Groups */}
          <div>
            {MARKET_GROUPS.map((group) => (
              <div key={group.name}>
                {/* Group Header */}
                <button
                  type="button"
                  className="w-full bg-[#0a1420] px-6 py-6 border-b border-[#14304e] cursor-pointer hover:bg-[#0a1420]/80 transition-colors text-left"
                  onClick={() => toggleExpand(group.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                        {getMarketImageComponent(group.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#2ae5b9] text-lg">
                          {group.name}
                        </div>
                        <div className="text-xs text-[#728395]">
                          {group.tradingPairs.length} trading pairs available
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className={`w-5 h-5 text-[#728395] transition-transform duration-200 ${
                          expandedGroup === group.name
                            ? "rotate-90"
                            : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Toggle details</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Trading Pairs */}
                {expandedGroup === group.name && (
                  <div className="bg-[#0a1420]">
                    {/* Accordion Header */}
                    <div className="bg-[#0a1420] px-6 py-4 border-b border-[#14304e]">
                      <div className="flex items-center">
                        <div className="grid grid-cols-8 gap-3 text-[#728395] text-sm font-semibold flex-1">
                          <div>Collateral asset ↑↓</div>
                          <div>Debt asset ↑↓</div>
                          <div className="text-right">Supply APY ↑↓</div>
                          <div className="text-right">Borrow APY ↑↓</div>
                          <div className="text-right">Max ROE ↓</div>
                          <div className="text-right">Max multiplier ↑↓</div>
                          <div className="text-right">LLTV ↑↓</div>
                          <div className="text-right">Liquidity ↑↓</div>
                        </div>
                        <div className="w-8"></div>
                      </div>
                    </div>
                    {group.tradingPairs.map((pair) => (
                      <button
                        type="button"
                        key={`${pair.collateralAsset.symbol}-${pair.debtAsset.symbol}`}
                        className="w-full px-6 py-4 border-b border-[#14304e]/20 last:border-b-0 hover:bg-[#14304e]/10 transition-colors cursor-pointer text-left"
                        onClick={() => onSelectPair?.(pair)}
                      >
                        <div className="flex items-center">
                          <div className="grid grid-cols-8 gap-3 flex-1">
                            {/* Collateral Asset */}
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                {pair.collateralAsset.imageUrl ? (
                                  <Image
                                    src={pair.collateralAsset.imageUrl}
                                    alt={pair.collateralAsset.symbol}
                                    width={32}
                                    height={32}
                                    className="object-cover rounded-full"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center rounded-full"
                                    style={{
                                      backgroundColor:
                                        pair.collateralAsset.iconBg,
                                    }}
                                  >
                                    {pair.collateralAsset.icon}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {pair.collateralAsset.asset}
                                </div>
                                <div className="text-[#728395] text-xs">
                                  {pair.collateralAsset.protocol}
                                </div>
                              </div>
                            </div>

                            {/* Debt Asset */}
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                {pair.debtAsset.imageUrl ? (
                                  <Image
                                    src={pair.debtAsset.imageUrl}
                                    alt={pair.debtAsset.symbol}
                                    width={32}
                                    height={32}
                                    className="object-cover rounded-full"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center rounded-full"
                                    style={{
                                      backgroundColor: pair.debtAsset.iconBg,
                                    }}
                                  >
                                    {pair.debtAsset.icon}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {pair.debtAsset.asset}
                                </div>
                                <div className="text-[#728395] text-xs">
                                  {pair.debtAsset.protocol}
                                </div>
                              </div>
                            </div>

                            {/* Supply APY */}
                            <div className="text-right">
                              <div className="text-[#23c09b] font-semibold">
                                {pair.supplyAPY}
                              </div>
                            </div>

                            {/* Borrow APY */}
                            <div className="text-right">
                              <div className="text-orange-400 font-semibold">
                                {pair.borrowAPY}
                              </div>
                            </div>

                            {/* Max ROE */}
                            <div className="text-right">
                              <div className="text-[#2ae5b9] font-semibold">
                                {pair.maxROE}
                              </div>
                            </div>

                            {/* Max Multiplier */}
                            <div className="text-right">
                              <div className="font-semibold">
                                {pair.maxMultiplier}
                              </div>
                            </div>

                            {/* LLTV */}
                            <div className="text-right">
                              <div className="font-semibold">{pair.lltv}</div>
                            </div>

                            {/* Liquidity */}
                            <div className="text-right">
                              <div className="font-semibold">
                                {pair.liquidity}
                              </div>
                              <div className="text-[#728395] text-xs">
                                {pair.liquidityAmount} {pair.liquidityToken}
                              </div>
                            </div>
                          </div>

                          {/* Empty space for alignment */}
                          <div className="w-8"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            type="button"
            className="px-6 py-3 bg-[#2ae5b9] text-black font-semibold rounded-lg hover:bg-[#2ae5b9]/90 transition-colors"
          >
            Start Trading
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-[#0c1d2f] border border-[#14304e] text-white font-semibold rounded-lg hover:bg-[#14304e]/30 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
