/**
 * Market statistics overview cards
 * Displays Total Liquidity, Active Pairs, and Best ROE
 */
export function MarketStatsOverview({
  totalPairs,
  totalAssets,
}: {
  totalPairs: number;
  totalAssets: number;
}) {
  return (
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
  );
}