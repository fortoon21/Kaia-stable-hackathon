"use client";

import { useState } from "react";
import Lending from "@/components/Lending";
import Markets from "@/components/Markets";
import Navigation from "@/components/Navigation";
import NetworkWarning from "@/components/NetworkWarning";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"lending" | "markets">(
    "lending"
  );

  return (
    <div className="min-h-screen bg-[#08131f] text-white">
      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Network Warning */}
      <NetworkWarning />

      {/* Main Content */}
      <div className="pt-[59px] min-h-screen">
        {currentPage === "lending" && <Lending />}
        {currentPage === "markets" && <Markets />}
      </div>
    </div>
  );
}
