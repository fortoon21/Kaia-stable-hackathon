"use client";

import Image from "next/image";
import { useState } from "react";
import { LAYOUT } from "@/constants/layout";
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

  // Mock borrow positions for each asset (in practice, this would come from user's wallet/smart contract)
  const borrowPositions = {
    USDC: { amount: "1,234.56", usdValue: "$1,234.56" },
    LBTC: { amount: "0.000161", usdValue: "$15.68" },
    WKAIA: { amount: "523.45", usdValue: "$73.28" },
    KAIA: { amount: "523.45", usdValue: "$73.28" },
    "USD₮": { amount: "0", usdValue: "$0.00" },
    USDT: { amount: "0", usdValue: "$0.00" },
  };

  // Get unique debt assets from all pairs for borrow section
  // biome-ignore lint/suspicious/noExplicitAny: Market data structure is complex
  const getUniqueDebtAssets = (group: any) => {
    const assets = new Map();
    // biome-ignore lint/suspicious/noExplicitAny: Pair structure is complex
    group.tradingPairs.forEach((pair: any) => {
      const symbol = pair.debtAsset.symbol;
      if (!assets.has(symbol)) {
        assets.set(symbol, pair.debtAsset);
      }
    });
    return Array.from(assets.values());
  };

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
    <div className="text-white">
      <div className={`${LAYOUT.MAX_WIDTH_CONTAINER} mx-auto px-6 pt-20`}>
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

                    {/* Borrow Section */}
                    <div className="bg-[#08131f] border-t-2 border-[#14304e]">
                      {/* Borrow Header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-[#0c1d2f] to-[#0a1420]">
                        <h3 className="text-[#f59e0b] font-semibold text-lg flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <title>Borrowed Assets</title>
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M5 12a1 1 0 011 1v1.586l2.293-2.293a1 1 0 011.414 1.414L7.414 16H9a1 1 0 110 2H5a1 1 0 01-1-1v-4a1 1 0 011-1zm10 0a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L17.586 15V13a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Your Borrowed Assets
                        </h3>
                        <p className="text-[#728395] text-sm mt-1">
                          Manage your outstanding debt positions
                        </p>
                      </div>

                      {/* Borrow Assets List */}
                      <div className="px-6 pb-4">
                        {getUniqueDebtAssets(group).map((asset) => {
                          const position = borrowPositions[
                            asset.symbol as keyof typeof borrowPositions
                          ] || { amount: "0", usdValue: "$0.00" };
                          const hasDebt = position.amount !== "0";

                          return (
                            <div
                              key={`borrow-${asset.symbol}`}
                              className="flex items-center justify-between py-3 border-b border-[#14304e]/30 last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                  {asset.imageUrl ? (
                                    <Image
                                      src={asset.imageUrl}
                                      alt={asset.symbol}
                                      width={40}
                                      height={40}
                                      className="object-cover rounded-full"
                                    />
                                  ) : (
                                    <div
                                      className="w-full h-full flex items-center justify-center rounded-full"
                                      style={{ backgroundColor: asset.iconBg }}
                                    >
                                      {asset.icon}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold">
                                    {asset.asset}
                                  </div>
                                  <div className="text-[#728395] text-sm">
                                    {asset.protocol}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div
                                    className={`font-semibold ${hasDebt ? "text-[#f59e0b]" : "text-[#728395]"}`}
                                  >
                                    {position.amount} {asset.symbol}
                                  </div>
                                  <div className="text-[#728395] text-sm">
                                    {position.usdValue}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                    hasDebt
                                      ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#d97706] hover:to-[#b45309] shadow-lg hover:shadow-xl"
                                      : "bg-[#14304e] text-[#728395] cursor-not-allowed"
                                  }`}
                                  disabled={!hasDebt}
                                  onClick={() => {
                                    if (hasDebt) {
                                      window.location.href = `/repay?asset=${asset.symbol}`;
                                    }
                                  }}
                                >
                                  {hasDebt ? "Repay" : "No Debt"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
