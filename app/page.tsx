"use client";

import { useState } from "react";
import Lending from "@/components/Lending";
import Markets from "@/components/Markets";
import Navigation from "@/components/Navigation";
import NetworkWarning from "@/components/NetworkWarning";

interface SelectedPair {
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
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"lending" | "markets">(
    "lending"
  );
  const [selectedPair, setSelectedPair] = useState<SelectedPair>({
    collateralAsset: {
      asset: "KAIA",
      symbol: "KAIA",
      protocol: "Avalon Finance",
      imageUrl:
        "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
    },
    debtAsset: {
      asset: "USDT",
      symbol: "USDT",
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
  });

  return (
    <div className="min-h-screen bg-[#08131f] text-white">
      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Network Warning */}
      <NetworkWarning />

      {/* Main Content */}
      <div className="pt-[59px] min-h-screen">
        {currentPage === "lending" && <Lending selectedPair={selectedPair} />}
        {currentPage === "markets" && (
          <Markets
            onSelectPair={(pair) => {
              setSelectedPair(pair);
              setCurrentPage("lending");
            }}
          />
        )}
      </div>
    </div>
  );
}
