export interface LendingProps {
  selectedPair?: {
    collateralAsset: {
      asset: string;
      symbol: string;
      icon?: string;
      iconBg?: string;
      protocol?: string;
      imageUrl?: string;
    };
    debtAsset: {
      asset: string;
      symbol: string;
      icon?: string;
      iconBg?: string;
      protocol?: string;
      imageUrl?: string;
    };
    supplyAPY?: string;
    borrowAPY?: string;
    maxROE?: string;
    maxMultiplier?: string;
    lltv?: string;
    liquidity?: string;
  };
}

export type TabType = "borrow" | "multiply";
export type BottomTabType = "pair" | "collateral" | "debt";
