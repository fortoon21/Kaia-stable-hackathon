"use client";

import { ethers } from "ethers";
import Image from "next/image";
import { useState } from "react";
import { LAYOUT } from "@/constants/layout";
import { MARKET_ASSET_IMAGES, MARKET_GROUPS } from "@/constants/marketData";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from "@/constants/tokens";
import { getCachedPrices, getPriceByAddress } from "@/lib/priceApi";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useWeb3 } from "@/lib/web3Provider";
import type { MarketsProps } from "@/types/lending";
import { getMarketImage } from "@/utils/formatters";

export default function Markets({ onSelectPair, onPageChange }: MarketsProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { getPriceBySymbol } = useTokenPrices();
  const { aaveParamsV3Index, aaveStatesV3 } = useWeb3();

  // Utility functions for converting blockchain data
  const toPercentFromRay = (value: unknown) => {
    try {
      if (value === undefined || value === null) return null;
      const bn = typeof value === "string" ? BigInt(value) : (value as bigint);
      const pct = parseFloat(ethers.formatUnits(bn, 27)) * 100;
      if (!Number.isFinite(pct)) return null;
      
      
      return `${pct.toFixed(2)}%`;
    } catch {
      return null;
    }
  };

  const toPercentFromBps = (value: unknown) => {
    try {
      if (value === undefined || value === null) return null;
      const num = typeof value === "bigint" ? Number(value) : Number(value as number);
      if (!Number.isFinite(num)) return null;
      return `${(num / 100).toFixed(2)}%`;
    } catch {
      return null;
    }
  };

  const formatLiquidity = (value: unknown, symbol: string) => {
    try {
      if (value === undefined || value === null) return null;
      const decimals = TOKEN_DECIMALS[symbol] || 18;
      const amt = parseFloat(ethers.formatUnits(value as bigint, decimals));
      if (!Number.isFinite(amt)) return null;
      return amt.toLocaleString(undefined, { maximumFractionDigits: 2 });
    } catch {
      return null;
    }
  };

  const formatUsdValue = (amount: string | number, tokenAddress: string) => {
    const priceData = getCachedPrices();
    const price = getPriceByAddress(priceData, tokenAddress);
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (!price || !Number.isFinite(numAmount)) return null;
    const usdValue = numAmount * price;
    if (usdValue >= 1000000) {
      return `$${(usdValue / 1000000).toFixed(2)}M`;
    } else if (usdValue >= 1000) {
      return `$${(usdValue / 1000).toFixed(1)}K`;
    } else {
      return `$${usdValue.toFixed(2)}`;
    }
  };

  const getTokenAddress = (symbol: string) => {
    const addressMap = {
      WKAIA: TOKEN_ADDRESSES.WKAIA,
      USDT: TOKEN_ADDRESSES.USDT,
      USDC: TOKEN_ADDRESSES.USDC,
      USDT0: TOKEN_ADDRESSES.USDT0,
    } as const;
    return addressMap[symbol as keyof typeof addressMap]?.toLowerCase();
  };

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

  // Mock borrow amounts with real-time price calculation
  const borrowAmounts = {
    USDC: "1,234.56",
    LBTC: "0.000161",
    WKAIA: "523.45",
    KAIA: "523.45",
    "USD₮": "0",
    USDT: "0",
  };

  // Calculate USD values using real prices
  const calculateUsdValue = (symbol: string, amount: string): string => {
    const price = getPriceBySymbol(symbol);
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    const usdValue = price * numAmount;
    return `$${usdValue.toFixed(2)}`;
  };

  // Dynamic borrow positions with real price calculation
  const borrowPositions = Object.fromEntries(
    Object.entries(borrowAmounts).map(([symbol, amount]) => [
      symbol,
      {
        amount,
        usdValue: calculateUsdValue(symbol, amount),
      },
    ])
  );

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
                        <div
                          className="grid gap-1 text-[#728395] text-xs font-semibold flex-1"
                          style={{
                            gridTemplateColumns:
                              "1fr 1fr 0.8fr 0.8fr 0.6fr 0.8fr 0.5fr 0.8fr 0.8fr 0.6fr",
                          }}
                        >
                          <div>Collateral asset ↑↓</div>
                          <div>Debt asset ↑↓</div>
                          <div className="text-right">Supply APY ↑↓</div>
                          <div className="text-right">Borrow APY ↑↓</div>
                          <div className="text-right">Max ROE ↓</div>
                          <div className="text-right">Max multiplier ↑↓</div>
                          <div className="text-right">LLTV ↑↓</div>
                          <div className="text-right">Liquidity ↑↓</div>
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
                              {(() => {
                                const addr = getTokenAddress(pair.collateralAsset.symbol);
                                const st = addr ? (aaveStatesV3 as Record<string, { liquidityRate?: bigint }>)[addr] : null;
                                const dynamicAPY = st ? toPercentFromRay(st.liquidityRate) : null;
                                return (
                                  <div className="text-[#23c09b] font-semibold">
                                    {dynamicAPY ?? pair.supplyAPY}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Borrow APY */}
                            <div className="text-right">
                              {(() => {
                                const addr = getTokenAddress(pair.debtAsset.symbol);
                                const st = addr ? (aaveStatesV3 as Record<string, { variableBorrowRate?: bigint }>)[addr] : null;
                                const dynamicAPY = st ? toPercentFromRay(st.variableBorrowRate) : null;
                                return (
                                  <div className="text-orange-400 font-semibold">
                                    {dynamicAPY ?? pair.borrowAPY}
                                  </div>
                                );
                              })()}
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
                              {(() => {
                                const addr = getTokenAddress(pair.collateralAsset.symbol);
                                const params = addr ? (aaveParamsV3Index as Record<string, { reserveLiquidationThreshold?: number | bigint }>)[addr] : null;
                                const dynamicLLTV = params ? toPercentFromBps(params.reserveLiquidationThreshold) : null;
                                return (
                                  <div className="font-semibold">
                                    {dynamicLLTV ?? pair.lltv}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Liquidity */}
                            <div className="text-right">
                              {(() => {
                                const addr = getTokenAddress(pair.debtAsset.symbol);
                                const st = addr ? (aaveStatesV3 as Record<string, { availableLiquidity?: bigint }>)[addr] : null;
                                const dynamicLiquidity = st ? formatLiquidity(st.availableLiquidity, pair.debtAsset.symbol) : null;
                                const usdValue = dynamicLiquidity && addr ? formatUsdValue(dynamicLiquidity, addr) : null;
                                
                                
                                return (
                                  <>
                                    <div className="font-semibold">
                                      {usdValue || pair.liquidity}
                                    </div>
                                    <div className="text-[#728395] text-xs">
                                      {dynamicLiquidity ? `${dynamicLiquidity} ${pair.debtAsset.symbol}` : `${pair.liquidityAmount} ${pair.liquidityToken}`}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>

                            {/* Your Debt */}
                            <div className="text-right">
                              {(() => {
                                const debtAsset = pair.debtAsset.symbol;
                                const position = borrowPositions[
                                  debtAsset as keyof typeof borrowPositions
                                ] || { amount: "0", usdValue: "$0.00" };
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
                                const debtAsset = pair.debtAsset.symbol;
                                const position = borrowPositions[
                                  debtAsset as keyof typeof borrowPositions
                                ] || { amount: "0", usdValue: "$0.00" };
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
                                          symbol: debtAsset,
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
                                            symbol: debtAsset,
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
