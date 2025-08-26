"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MarketStatsOverview } from "@/components/markets/MarketStatsOverview";
import { LAYOUT } from "@/constants/layout";
import { MARKET_ASSET_IMAGES, MARKET_GROUPS } from "@/constants/marketData";
import { useAaveData } from "@/hooks/useAaveData";
import { useMarketCalculations } from "@/hooks/useMarketCalculations";
import { useWeb3 } from "@/lib/web3Provider";
import type { MarketsProps } from "@/types/lending";
import { getMarketImage } from "@/utils/formatters";

export default function Markets({ onSelectPair, onPageChange }: MarketsProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { isConnected } = useWeb3();
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
      <div className="w-full h-full flex items-center justify-center bg-primary-100 rounded-pill text-black font-heading font-bold">
        {marketName[0]}
      </div>
    );
  };

  return (
    <div className="text-heading">
      <div className={`${LAYOUT.MAX_WIDTH_CONTAINER} mx-auto px-6 pt-20`}>
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2 mt-16 text-sage-200">TGIF Lending Markets</h1>
          <p className="text-body text-sage-400">
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
        <div className="bg-surface-1 border border-line-soft rounded-lg overflow-hidden shadow-1">
          {/* Market Groups */}
          <div>
            {MARKET_GROUPS.map((group) => (
              <div key={group.name}>
                {/* Group Header */}
                <button
                  type="button"
                  className="w-full bg-surface-2 px-5 py-5 border-b border-line-soft cursor-pointer hover:bg-surface-ghost transition-colors text-left"
                  onClick={() => toggleExpand(group.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 shadow-2 rounded-full overflow-hidden flex items-center justify-center">
                        {getMarketImageComponent(group.name)}
                      </div>
                      <div>
                        <div className="font-heading font-semibold text-lg text-heading">
                          {group.name}
                        </div>
                        <div className="text-xs text-body text-sage-400">
                          {group.tradingPairs.length} trading pairs available
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className={`w-5 h-5 text-body transition-transform duration-200 ${expandedGroup === group.name
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
                  <div className="bg-surface-2">
                    {/* Accordion Header */}
                    <div className="bg-surface-2 px-6 py-4 border-b border-line-soft">
                      <div className="flex items-center">
                        <div
                          className="grid gap-1 text-body text-xs font-heading font-semibold flex-1 text-sage-600"
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
                        className="w-full px-6 py-4 border-b border-line-soft last:border-b-0 hover:bg-surface-ghost transition-colors cursor-pointer text-left bg-surface-4"
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
                              <div className="w-6 h-6 rounded-pill flex items-center justify-center text-heading font-heading font-bold text-sm overflow-hidden">
                                {pair.collateralAsset.imageUrl ? (
                                  <Image
                                    src={pair.collateralAsset.imageUrl}
                                    alt={pair.collateralAsset.symbol}
                                    width={32}
                                    height={32}
                                    className="object-cover rounded-pill"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center rounded-pill"
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
                                <div className="font-heading font-medium text-sm text-heading">
                                  {pair.collateralAsset.asset}
                                </div>
                                <div className="text-body text-xs text-sage-400">
                                  {pair.collateralAsset.protocol}
                                </div>
                              </div>
                            </div>

                            {/* Debt Asset */}
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-pill flex items-center justify-center text-heading font-heading font-bold text-sm overflow-hidden">
                                {pair.debtAsset.imageUrl ? (
                                  <Image
                                    src={pair.debtAsset.imageUrl}
                                    alt={pair.debtAsset.symbol}
                                    width={32}
                                    height={32}
                                    className="object-cover rounded-pill"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center rounded-pill"
                                    style={{
                                      backgroundColor: pair.debtAsset.iconBg,
                                    }}
                                  >
                                    {pair.debtAsset.icon}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-heading font-medium text-sm text-heading">
                                  {pair.debtAsset.asset}
                                </div>
                                <div className="text-body text-xs text-sage-400">
                                  {pair.debtAsset.protocol}
                                </div>
                              </div>
                            </div>

                            {/* Supply APY */}
                            <div className="text-right">
                              <div className="text-green font-semibold">
                                {getSupplyAPY(pair.collateralAsset.symbol) ??
                                  "-"}
                              </div>
                            </div>

                            {/* Borrow APY */}
                            <div className="text-right">
                              <div className="text-warning font-semibold">
                                {getBorrowAPY(pair.debtAsset.symbol) ?? "-"}
                              </div>
                            </div>

                            {/* Max ROE */}
                            <div className="text-right">
                              <div className="text-primary-100 font-heading font-semibold">
                                {getMaxROE(
                                  pair.collateralAsset.symbol,
                                  pair.debtAsset.symbol
                                ) ?? "-"}
                              </div>
                            </div>

                            {/* Max Multiplier */}
                            <div className="text-right">
                              <div className="font-heading text-sage-100">
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
                              <div className="font-heading text-sage-100">
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
                                    <div className="font-heading text-sage-100">
                                      {usdValue || "-"}
                                    </div>
                                    <div className="text-body text-xs text-sage-400">
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
                                      className={`font-heading font-semibold text-sm ${hasDebt ? "text-warning" : "text-body"}`}
                                    >
                                      {position.amount}
                                    </div>
                                    <div className="text-body text-xs text-sage-400">
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
                                const canRepay = hasDebt && isConnected;

                                return (
                                  <div
                                    className={`px-3 py-1.5 rounded-sm border border-primary-100/20 bg-primary-100/10 ml-2 text-primary-100 font-heading font-semibold text-xs transition-all duration-200 cursor-pointer ${canRepay
                                      ? "bg-warning hover:bg-warning/80 text-heading shadow-lg hover:shadow-xl"
                                      : "bg-surface-2 text-muted cursor-not-allowed"
                                      }`}
                                    role="button"
                                    tabIndex={canRepay ? 0 : -1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (canRepay && onPageChange) {
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
                                        canRepay
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
                                    Repay
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
