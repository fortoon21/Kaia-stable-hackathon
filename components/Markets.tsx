"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MarketStatsOverview } from "@/components/markets/MarketStatsOverview";
import { LAYOUT } from "@/constants/layout";
import { MARKET_ASSET_IMAGES, MARKET_GROUPS } from "@/constants/marketData";
import { useAaveData } from "@/hooks/useAaveData";
import { useMarketCalculations } from "@/hooks/useMarketCalculations";
import type { MarketsProps } from "@/types/lending";
import { getMarketImage } from "@/utils/formatters";

export default function Markets({ onSelectPair, onPageChange }: MarketsProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const {
    getSupplyAPY,
    getBorrowAPY,
    getLTV,
    getLLTV,
    getLiquidity,
    getTotalLiquidity,
    getMaxROE,
  } = useAaveData();
  const { calculateBorrowPositions, getPositionData } = useMarketCalculations();

  // Get all unique pairs for calculation
  const allPairs = MARKET_GROUPS.flatMap((group) => group.tradingPairs);

  // Calculate max multipliers for all pairs
  const maxMultipliers = useMemo(() => {
    const multipliers: Record<string, number> = {};

    for (const pair of allPairs) {
      const pairKey = `${pair.collateralAsset.symbol}-${pair.debtAsset.symbol}`;

      try {
        const ltv = getLTV(pair.collateralAsset.symbol);

        if (!ltv) {
          multipliers[pairKey] = 1; // Default fallback
          continue;
        }

        // Simple max multiplier calculation: 1/(1-LTV)
        // Convert LTV percentage to decimal (e.g., "20.00%" -> 0.20)
        const ltvDecimal = parseFloat(ltv.replace("%", "")) / 100;

        // Calculate max multiplier using simple formula
        const maxLeverage = ltvDecimal >= 1 ? 1 : 1 / (1 - ltvDecimal);

        multipliers[pairKey] = maxLeverage;
      } catch (_error) {
        multipliers[pairKey] = 1; // Fallback
      }
    }

    return multipliers;
  }, [allPairs, getLTV]);

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

  // Get borrow positions for all assets
  const borrowPositions = calculateBorrowPositions();

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
        <MarketStatsOverview
          totalPairs={totalPairs}
          totalAssets={totalAssets}
          totalLiquidity={getTotalLiquidity()}
          pairs={allPairs}
        />

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
                        <div
                          className="grid gap-1 text-[#728395] text-xs font-semibold flex-1"
                          style={{
                            gridTemplateColumns:
                              "1fr 1fr 0.8fr 0.8fr 0.6fr 0.8fr 0.5fr 0.8fr 0.8fr 0.6fr",
                          }}
                        >
                          <div>Collateral asset</div>
                          <div>Debt asset</div>
                          <div className="text-right">Supply APY</div>
                          <div className="text-right">Borrow APY</div>
                          <div className="text-right">Max ROE</div>
                          <div className="text-right">Max multiplier</div>
                          <div className="text-right">LLTV</div>
                          <div className="text-right">Liquidity</div>
                          <div className="text-right">Your Debt</div>
                          <div className="text-center">Action</div>
                        </div>
                        <div className="w-4"></div>
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
                          <div
                            className="grid gap-1 flex-1"
                            style={{
                              gridTemplateColumns:
                                "1fr 1fr 0.8fr 0.8fr 0.6fr 0.8fr 0.5fr 0.8fr 0.8fr 0.6fr",
                            }}
                          >
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
                                {getSupplyAPY(pair.collateralAsset.symbol) ??
                                  "-"}
                              </div>
                            </div>

                            {/* Borrow APY */}
                            <div className="text-right">
                              <div className="text-orange-400 font-semibold">
                                {getBorrowAPY(pair.debtAsset.symbol) ?? "-"}
                              </div>
                            </div>

                            {/* Max ROE */}
                            <div className="text-right">
                              <div className="text-[#2ae5b9] font-semibold">
                                {getMaxROE(
                                  pair.collateralAsset.symbol,
                                  pair.debtAsset.symbol
                                ) ?? "-"}
                              </div>
                            </div>

                            {/* Max Multiplier */}
                            <div className="text-right">
                              <div className="font-semibold">
                                {(() => {
                                  const pairKey = `${pair.collateralAsset.symbol}-${pair.debtAsset.symbol}`;
                                  const maxLev = maxMultipliers[pairKey];

                                  // Show loading state while LTV data is not ready
                                  if (!getLTV(pair.collateralAsset.symbol)) {
                                    return "Loading...";
                                  }

                                  return maxLev && maxLev > 1
                                    ? `${maxLev.toFixed(2)}x`
                                    : "-";
                                })()}
                              </div>
                            </div>

                            {/* LLTV */}
                            <div className="text-right">
                              <div className="font-semibold">
                                {getLLTV(pair.collateralAsset.symbol) ?? "-"}
                              </div>
                            </div>

                            {/* Liquidity */}
                            <div className="text-right">
                              {(() => {
                                const { amount, usdValue } = getLiquidity(
                                  pair.debtAsset.symbol
                                );
                                return (
                                  <>
                                    <div className="font-semibold">
                                      {usdValue || "-"}
                                    </div>
                                    <div className="text-[#728395] text-xs">
                                      {amount
                                        ? `${amount} ${pair.debtAsset.symbol}`
                                        : "-"}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>

                            {/* Your Debt */}
                            <div className="text-right">
                              {(() => {
                                const position = getPositionData(
                                  pair.debtAsset.symbol,
                                  borrowPositions
                                );
                                const hasDebt = position.amount !== "0";

                                return (
                                  <div>
                                    <div
                                      className={`font-semibold text-sm ${hasDebt ? "text-[#f59e0b]" : "text-[#728395]"}`}
                                    >
                                      {position.amount}
                                    </div>
                                    <div className="text-[#728395] text-xs">
                                      {position.usdValue}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Action */}
                            <div className="text-center">
                              {(() => {
                                const position = getPositionData(
                                  pair.debtAsset.symbol,
                                  borrowPositions
                                );
                                const hasDebt = position.amount !== "0";

                                return (
                                  <div
                                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 cursor-pointer ${
                                      hasDebt
                                        ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#d97706] hover:to-[#b45309] shadow-lg hover:shadow-xl"
                                        : "bg-[#14304e] text-[#728395] cursor-not-allowed"
                                    }`}
                                    role="button"
                                    tabIndex={hasDebt ? 0 : -1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (hasDebt && onPageChange) {
                                        // Store the asset info for repay page
                                        const repayAssetInfo = {
                                          symbol: pair.debtAsset.symbol,
                                          amount: position.amount,
                                          usdValue: position.usdValue,
                                          asset: pair.debtAsset,
                                          collateralAsset: pair.collateralAsset,
                                        };
                                        localStorage.setItem(
                                          "repayAsset",
                                          JSON.stringify(repayAssetInfo)
                                        );
                                        // Navigate to repay page
                                        onPageChange("repay");
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        (e.key === "Enter" || e.key === " ") &&
                                        hasDebt
                                      ) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (onPageChange) {
                                          const repayAssetInfo = {
                                            symbol: pair.debtAsset.symbol,
                                            amount: position.amount,
                                            usdValue: position.usdValue,
                                            asset: pair.debtAsset,
                                            collateralAsset:
                                              pair.collateralAsset,
                                          };
                                          localStorage.setItem(
                                            "repayAsset",
                                            JSON.stringify(repayAssetInfo)
                                          );
                                          onPageChange("repay");
                                        }
                                      }
                                    }}
                                  >
                                    {hasDebt ? "Repay" : "No Debt"}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Empty space for alignment */}
                          <div className="w-4"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
