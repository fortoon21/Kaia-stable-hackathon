import { LendingProps } from "@/types/lending";
import { useAaveData } from "@/hooks/useAaveData";

/**
 * Market statistics overview cards
 * Displays Total Liquidity, Active Pairs, and Best ROE
 */
export function MarketStatsOverview({
  totalPairs,
  totalAssets,
  totalLiquidity,
  pairs,
}: {
  totalPairs: number;
  totalAssets: number;
  totalLiquidity: { totalUSD: string | null; hasData: boolean };
  pairs: LendingProps["pairs"];
}) {
  const { getMaxROE } = useAaveData();

  // Calculate best ROE from all pairs
  const bestROEData = pairs.reduce((best, pair) => {
    const roe = getMaxROE(pair.collateralAsset.symbol, pair.debtAsset.symbol);
    
    if (!roe || roe === "-") return best;
    
    const roeValue = parseFloat(roe.replace("%", ""));
    if (roeValue > best.value) {
      return {
        value: roeValue,
        roe: roe,
        pairName: `${pair.collateralAsset.symbol}/${pair.debtAsset.symbol}`,
      };
    }
    
    return best;
  }, { value: 0, roe: "-", pairName: "-" });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-4">
        <div className="text-[#728395] text-sm mb-1">Total Liquidity</div>
        <div className="text-2xl font-bold">
          {totalLiquidity.totalUSD || "-"}
        </div>
        <div className="text-[#2ae5b9] text-sm">4 Pools</div>
      </div>
      <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-4">
        <div className="text-[#728395] text-sm mb-1">Active Pairs</div>
        <div className="text-2xl font-bold">{totalPairs}</div>
        <div className="text-[#2ae5b9] text-sm">{totalAssets} Assets</div>
      </div>
      <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-4">
        <div className="text-[#728395] text-sm mb-1">Best ROE</div>
        <div className="text-2xl font-bold">{bestROEData.roe}</div>
        <div className="text-orange-400 text-sm">{bestROEData.pairName}</div>
      </div>
    </div>
  );
}
