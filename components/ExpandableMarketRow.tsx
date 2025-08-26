"use client";

import { useState } from "react";

interface MarketData {
  symbol: string;
  description: string;
  color: string;
  liquidity: string;
  liquidityDetail?: string;
  volume24h: string;
  ytYield?: string;
  ptFixed?: string;
  markets?: number;
  totalLiquidity?: string;
  ytPercentage?: string;
  ptPercentage?: string;
  longYieldApy?: string;
  fixedApy?: string;
  subMarkets?: Array<{
    name: string;
    maturity: string;
    liquidity: string;
    volume24h: string;
    ytApy: string;
    ptApy: string;
    longYieldApy: string;
    fixedApy: string;
    underlyingApy?: string;
    impliedApy?: string;
    utilization?: string;
  }>;
}

export default function ExpandableMarketRow({
  market,
}: {
  market: MarketData;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-line-soft last:border-b-0">
      <button
        type="button"
        className="grid w-full grid-cols-6 gap-4 items-center py-4 cursor-pointer text-left hover:bg-surface-ghost transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-pill flex items-center justify-center text-heading font-bold"
            style={{ backgroundColor: market.color }}
          >
            {market.symbol[0]}
          </div>
          <div>
            <div className="font-heading font-semibold">{market.symbol}</div>
            <div className="text-muted text-sm">{market.description}</div>
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading font-semibold">{market.liquidity}</div>
          {market.liquidityDetail && (
            <div className="text-muted text-sm">{market.liquidityDetail}</div>
          )}
        </div>
        <div className="text-center font-heading font-semibold">
          {market.volume24h}
        </div>
        <div className="text-center">
          {market.ytYield ? (
            <>
              <div className="bg-surface-2 px-3 py-1 rounded-sm text-sm inline-block">
                YT
              </div>
              <div className="text-muted text-sm mt-1">{market.ytYield}</div>
            </>
          ) : (
            <div className="text-[#23c09b] font-semibold">
              {market.longYieldApy || "-100%"}
            </div>
          )}
        </div>
        <div className="text-center">
          {market.ptFixed ? (
            <>
              <div className="bg-surface-2 px-3 py-1 rounded-sm text-sm inline-block">
                PT
              </div>
              <div className="text-[#23c09b] text-sm mt-1">
                {market.ptFixed}
              </div>
            </>
          ) : (
            <div className="text-[#23c09b] font-semibold">
              {market.fixedApy || "13.45%"}
            </div>
          )}
        </div>
        <div className="text-center">
          <button
            type="button"
            className="text-primary-100 transform transition-transform duration-200"
            style={{
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ↗
          </button>
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && market.subMarkets && (
        <div className="bg-surface-2 px-6 py-4 shadow-1">
          <div className="space-y-3">
            {market.subMarkets.map((subMarket, index) => (
              <div key={`${market.symbol}-sub-${index}`} className="pl-12">
                <div className="grid grid-cols-8 gap-4 items-center py-3 border-b border-line-soft last:border-b-0">
                  <div className="col-span-2">
                    <div className="text-sm font-medium">{subMarket.name}</div>
                    <div className="text-xs text-muted">
                      Maturity: {subMarket.maturity}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm">{subMarket.liquidity}</div>
                    <div className="text-xs text-muted">Liquidity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm">{subMarket.volume24h}</div>
                    <div className="text-xs text-muted">24h Vol</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-[#23c09b]">
                      {subMarket.longYieldApy}
                    </div>
                    <div className="text-xs text-muted">Long Yield</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-[#23c09b]">
                      {subMarket.fixedApy}
                    </div>
                    <div className="text-xs text-muted">Fixed APY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-[#ffa500]">
                      {subMarket.underlyingApy || "5.2%"}
                    </div>
                    <div className="text-xs text-muted">Underlying</div>
                  </div>
                  <div className="text-center">
                    <button type="button" className="text-primary-100 text-sm">
                      Trade →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy expandable content for markets with the old format */}
      {isExpanded && market.markets && !market.subMarkets && (
        <div className="pl-16 pb-4 bg-surface-2 shadow-1">
          <div className="text-primary-100 text-sm mb-2">
            {market.markets} Markets
          </div>
          <div className="grid grid-cols-6 gap-4 text-sm">
            <div></div>
            <div className="text-center text-muted">
              <div>{market.totalLiquidity}</div>
              <div>Total TVL</div>
            </div>
            <div className="text-center">
              <div className="bg-surface-2 px-2 py-1 rounded-sm text-xs inline-block">
                YT
              </div>
              <div className="text-muted mt-1">{market.ytPercentage}</div>
            </div>
            <div className="text-center">
              <div className="bg-surface-2 px-2 py-1 rounded-sm text-xs inline-block">
                PT
              </div>
              <div className="text-[#23c09b] mt-1">{market.ptPercentage}</div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
}
