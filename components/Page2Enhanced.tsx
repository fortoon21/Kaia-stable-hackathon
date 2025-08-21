"use client";

import Image from "next/image";
import { useState } from "react";

interface TradingPair {
  collateralAsset: {
    asset: string;
    symbol: string;
    icon: string;
    iconBg: string;
    protocol: string;
    imageUrl?: string;
  };
  debtAsset: {
    asset: string;
    symbol: string;
    icon: string;
    iconBg: string;
    protocol: string;
    imageUrl?: string;
  };
  supplyAPY: string;
  borrowAPY: string;
  maxROE: string;
  maxMultiplier: string;
  lltv: string;
  liquidity: string;
  liquidityAmount: string;
  liquidityToken: string;
}

interface MarketGroup {
  name: string;
  tradingPairs: TradingPair[];
}

export default function Page2Enhanced() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const marketGroups: MarketGroup[] = [
    {
      name: "KAIA Markets",
      tradingPairs: [
        {
          collateralAsset: {
            asset: "KAIA",
            symbol: "KAIA",
            icon: "K",
            iconBg: "#00D4FF",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
          },
          debtAsset: {
            asset: "USDT",
            symbol: "USDT",
            icon: "₮",
            iconBg: "#26A17B",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
          },
          supplyAPY: "8.83%",
          borrowAPY: "5.40%",
          maxROE: "39.65%",
          maxMultiplier: "9.98x",
          lltv: "91.00%",
          liquidity: "$506,685.97",
          liquidityAmount: "506,685.97",
          liquidityToken: "USDT",
        },
        {
          collateralAsset: {
            asset: "KAIA",
            symbol: "KAIA",
            icon: "K",
            iconBg: "#00D4FF",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
          },
          debtAsset: {
            asset: "USDC",
            symbol: "USDC",
            icon: "$",
            iconBg: "#2775CA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
          },
          supplyAPY: "7.25%",
          borrowAPY: "4.80%",
          maxROE: "35.20%",
          maxMultiplier: "8.50x",
          lltv: "89.00%",
          liquidity: "$423,542.18",
          liquidityAmount: "423,542.18",
          liquidityToken: "USDC",
        },
        {
          collateralAsset: {
            asset: "KAIA",
            symbol: "KAIA",
            icon: "K",
            iconBg: "#00D4FF",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
          },
          debtAsset: {
            asset: "USDT0",
            symbol: "USDT0",
            icon: "₮",
            iconBg: "#627EEA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
          },
          supplyAPY: "6.95%",
          borrowAPY: "4.20%",
          maxROE: "28.40%",
          maxMultiplier: "7.80x",
          lltv: "87.20%",
          liquidity: "$298,765.43",
          liquidityAmount: "298,765.43",
          liquidityToken: "USDT0",
        },
      ],
    },
    {
      name: "USDT Markets",
      tradingPairs: [
        {
          collateralAsset: {
            asset: "USDT",
            symbol: "USDT",
            icon: "₮",
            iconBg: "#26A17B",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
          },
          debtAsset: {
            asset: "KAIA",
            symbol: "KAIA",
            icon: "K",
            iconBg: "#00D4FF",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
          },
          supplyAPY: "9.79%",
          borrowAPY: "5.86%",
          maxROE: "31.98%",
          maxMultiplier: "6.65x",
          lltv: "87.50%",
          liquidity: "$18,316.52",
          liquidityAmount: "18,316.52",
          liquidityToken: "KAIA",
        },
        {
          collateralAsset: {
            asset: "USDT",
            symbol: "USDT",
            icon: "₮",
            iconBg: "#26A17B",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
          },
          debtAsset: {
            asset: "USDC",
            symbol: "USDC",
            icon: "$",
            iconBg: "#2775CA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
          },
          supplyAPY: "5.22%",
          borrowAPY: "0.07%",
          maxROE: "23.37%",
          maxMultiplier: "4.53x",
          lltv: "80.00%",
          liquidity: "$762,336.45",
          liquidityAmount: "762,336.45",
          liquidityToken: "USDC",
        },
        {
          collateralAsset: {
            asset: "USDT",
            symbol: "USDT",
            icon: "₮",
            iconBg: "#26A17B",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
          },
          debtAsset: {
            asset: "USDT0",
            symbol: "USDT0",
            icon: "₮",
            iconBg: "#627EEA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
          },
          supplyAPY: "4.61%",
          borrowAPY: "1.65%",
          maxROE: "21.33%",
          maxMultiplier: "6.65x",
          lltv: "90.00%",
          liquidity: "$1.09M",
          liquidityAmount: "252.55",
          liquidityToken: "USDT0",
        },
      ],
    },
    {
      name: "USDC Markets",
      tradingPairs: [
        {
          collateralAsset: {
            asset: "USDC",
            symbol: "USDC",
            icon: "$",
            iconBg: "#2775CA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
          },
          debtAsset: {
            asset: "KAIA",
            symbol: "KAIA",
            icon: "K",
            iconBg: "#00D4FF",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
          },
          supplyAPY: "9.79%",
          borrowAPY: "5.84%",
          maxROE: "28.32%",
          maxMultiplier: "5.69x",
          lltv: "87.50%",
          liquidity: "$5,491.33",
          liquidityAmount: "5,491.88",
          liquidityToken: "KAIA",
        },
        {
          collateralAsset: {
            asset: "USDC",
            symbol: "USDC",
            icon: "$",
            iconBg: "#2775CA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
          },
          debtAsset: {
            asset: "USDT",
            symbol: "USDT",
            icon: "₮",
            iconBg: "#26A17B",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
          },
          supplyAPY: "5.22%",
          borrowAPY: "0.15%",
          maxROE: "23.11%",
          maxMultiplier: "4.53x",
          lltv: "80.00%",
          liquidity: "$1.03M",
          liquidityAmount: "9,076.238",
          liquidityToken: "USDT",
        },
        {
          collateralAsset: {
            asset: "USDC",
            symbol: "USDC",
            icon: "$",
            iconBg: "#2775CA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
          },
          debtAsset: {
            asset: "USDT0",
            symbol: "USDT0",
            icon: "₮",
            iconBg: "#627EEA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
          },
          supplyAPY: "4.14%",
          borrowAPY: "0.07%",
          maxROE: "18.48%",
          maxMultiplier: "4.53x",
          lltv: "80.00%",
          liquidity: "$762,336.45",
          liquidityAmount: "6.691823",
          liquidityToken: "USDT0",
        },
      ],
    },
    {
      name: "USDT0 Markets",
      tradingPairs: [
        {
          collateralAsset: {
            asset: "USDT (Portal)",
            symbol: "USDT0",
            icon: "₮",
            iconBg: "#627EEA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
          },
          debtAsset: {
            asset: "KAIA",
            symbol: "KAIA",
            icon: "K",
            iconBg: "#00D4FF",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
          },
          supplyAPY: "7.83%",
          borrowAPY: "4.25%",
          maxROE: "26.65%",
          maxMultiplier: "7.20x",
          lltv: "86.10%",
          liquidity: "$145,623.21",
          liquidityAmount: "145,623.21",
          liquidityToken: "KAIA",
        },
        {
          collateralAsset: {
            asset: "USDT (Portal)",
            symbol: "USDT0",
            icon: "₮",
            iconBg: "#627EEA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
          },
          debtAsset: {
            asset: "USDT",
            symbol: "USDT",
            icon: "₮",
            iconBg: "#26A17B",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
          },
          supplyAPY: "6.42%",
          borrowAPY: "2.15%",
          maxROE: "22.85%",
          maxMultiplier: "5.80x",
          lltv: "82.70%",
          liquidity: "$89,743.56",
          liquidityAmount: "89,743.56",
          liquidityToken: "USDT",
        },
        {
          collateralAsset: {
            asset: "USDT (Portal)",
            symbol: "USDT0",
            icon: "₮",
            iconBg: "#627EEA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
          },
          debtAsset: {
            asset: "USDC",
            symbol: "USDC",
            icon: "$",
            iconBg: "#2775CA",
            protocol: "Avalon Finance",
            imageUrl:
              "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
          },
          supplyAPY: "5.95%",
          borrowAPY: "1.85%",
          maxROE: "20.12%",
          maxMultiplier: "5.25x",
          lltv: "81.00%",
          liquidity: "$124,892.33",
          liquidityAmount: "124,892.33",
          liquidityToken: "USDC",
        },
      ],
    },
  ];

  const toggleExpand = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  const getMarketImage = (marketName: string) => {
    const assetMap: { [key: string]: string } = {
      "KAIA Markets":
        "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
      "USDT Markets":
        "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
      "USDC Markets":
        "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
      "USDT0 Markets":
        "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
    };

    const imageUrl = assetMap[marketName];
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
    <div className="min-h-screen bg-[#08131f] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cozy Lending Markets</h1>
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
            <div className="text-2xl font-bold">10</div>
            <div className="text-[#2ae5b9] text-sm">4 Assets</div>
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
            {marketGroups.map((group) => (
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
                        {getMarketImage(group.name)}
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
                      <div
                        key={`${pair.collateralAsset.symbol}-${pair.debtAsset.symbol}`}
                        className="px-6 py-4 border-b border-[#14304e]/20 last:border-b-0 hover:bg-[#14304e]/10 transition-colors"
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
                      </div>
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
