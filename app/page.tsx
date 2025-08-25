"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Lending from "@/components/Lending";
import Markets from "@/components/Markets";
import Navigation from "@/components/Navigation";
import NetworkWarning from "@/components/NetworkWarning";
import Repay from "@/components/Repay";
import { LAYOUT } from "@/constants/layout";

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
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "lending" | "markets" | "repay"
  >("markets");
  const [selectedPair, setSelectedPair] = useState<SelectedPair>({
    collateralAsset: {
      asset: "WKAIA",
      symbol: "WKAIA",
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

  // Initialize client-side state and load saved data
  useEffect(() => {
    setIsClient(true);

    const savedPage = localStorage.getItem("currentPage") as
      | "lending"
      | "markets"
      | "repay"
      | null;
    const savedPair = localStorage.getItem("selectedPair");

    if (
      savedPage &&
      (savedPage === "lending" ||
        savedPage === "markets" ||
        savedPage === "repay")
    ) {
      setCurrentPage(savedPage);
    }

    if (savedPair) {
      try {
        const parsedPair = JSON.parse(savedPair);
        setSelectedPair(parsedPair);
      } catch (_error) {
        // Failed to parse saved pair
      }
    }
  }, []);

  // Save page state to localStorage when it changes
  const handlePageChange = (page: "lending" | "markets" | "repay") => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPage", page);
    }
  };

  const handlePairSelect = (pair: SelectedPair) => {
    setSelectedPair(pair);
    setCurrentPage("lending");
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPage", "lending");
      localStorage.setItem("selectedPair", JSON.stringify(pair));
    }
  };

  // Show loading state on initial render to prevent flash
  if (!isClient) {
    return (
      <div className="text-white min-h-screen flex flex-col">
        {/* Navigation */}
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />

        {/* Network Warning */}
        <NetworkWarning />

        {/* Loading Content */}
        <div
          className={`${LAYOUT.CONTENT_PADDING_TOP_CLASS} flex-grow flex items-center justify-center`}
        >
          <div className="animate-pulse text-[#8B9A6B]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen flex flex-col">
      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />

      {/* Network Warning */}
      <NetworkWarning />

      {/* Main Content */}
      <div
        className={`${LAYOUT.CONTENT_PADDING_TOP_CLASS} flex-grow flex flex-col`}
      >
        <div className="flex-grow">
          {currentPage === "lending" && <Lending selectedPair={selectedPair} />}
          {currentPage === "markets" && (
            <Markets
              onSelectPair={handlePairSelect}
              onPageChange={handlePageChange}
            />
          )}
          {currentPage === "repay" && (
            <Repay onGoBack={() => handlePageChange("markets")} />
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
