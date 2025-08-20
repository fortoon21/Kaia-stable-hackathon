"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"page1" | "page2">("page1");

  return (
    <div className="min-h-screen bg-[#08131f] text-white">
      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content */}
      <div className="pt-[59px] min-h-screen">
        {currentPage === "page1" && <Page1 />}
        {currentPage === "page2" && <Page2 />}
      </div>
    </div>
  );
}
