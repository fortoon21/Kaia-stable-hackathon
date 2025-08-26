import { useAaveData } from "@/hooks/useAaveData";
import { LendingProps } from "@/types/lending";

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
  pairs: Array<{ collateralAsset: { symbol: string }; debtAsset: { symbol: string } }>;
}) {
  const { getMaxROE } = useAaveData();

  // Calculate best ROE from all pairs
  const bestROEData = pairs.reduce(
    (best, pair) => {
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
    },
    { value: 0, roe: "-", pairName: "-" }
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-surface-3 border border-line-soft rounded-lg p-4 shadow-1">
        <div className="text-body text-sm mb-1 font-heading text-sage-600">Total Liquidity</div>
        <div className="text-2xl font-bold font-heading text-heading text-sage-200">
          {totalLiquidity.totalUSD || "-"}
        </div>
        <div className="text-muted text-sm text-sage-400">4 Pools</div>
      </div>
      <div className="bg-surface-3 border border-line-soft rounded-lg p-4 shadow-1">
        <div className="text-body text-sm mb-1 font-heading text-sage-600">Active Pairs</div>
        <div className="text-2xl font-bold font-heading text-heading text-sage-200">{totalPairs}</div>
        <div className="text-muted text-sm text-sage-400">{totalAssets} Assets</div>
      </div>
      <div className="bg-surface-3 border border-line-soft rounded-lg p-4 shadow-1">
        <div className="text-body text-sm mb-1 font-heading text-sage-600">Best ROE</div>
        <div className="text-2xl font-bold font-heading text-heading text-primary-100">{bestROEData.roe}</div>
        <div className="text-sage-400 text-sm font-heading">{bestROEData.pairName}</div>
      </div>
    </div>
  );
}
