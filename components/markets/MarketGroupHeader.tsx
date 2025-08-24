import Image from "next/image";
import { getMarketImage } from "@/utils/formatters";
import { MARKET_ASSET_IMAGES } from "@/constants/marketData";

interface MarketGroupHeaderProps {
  groupName: string;
  pairCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Market group header with expand/collapse functionality
 */
export function MarketGroupHeader({
  groupName,
  pairCount,
  isExpanded,
  onToggle,
}: MarketGroupHeaderProps) {
  const assetImage = getMarketImage(groupName, MARKET_ASSET_IMAGES);

  return (
    <div
      className="sticky top-0 px-6 py-3 bg-[#0a1625] border-b border-[#14304e] flex items-center justify-between cursor-pointer hover:bg-[#14304e]/20 transition-colors z-10"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="flex items-center space-x-3">
        {assetImage && (
          <Image
            src={assetImage}
            alt={groupName}
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span className="font-semibold text-lg">
          {groupName}
        </span>
        <span className="text-[#728395] text-sm">
          ({pairCount} {pairCount === 1 ? "pair" : "pairs"})
        </span>
      </div>
      <div className="text-[#728395]">
        {isExpanded ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>
    </div>
  );
}