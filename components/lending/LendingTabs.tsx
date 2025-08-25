"use client";

import type { TabType } from "@/types/lending";

interface LendingTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function LendingTabs({ activeTab, onTabChange }: LendingTabsProps) {
  return (
    <div className="flex w-full mb-6">
      <button
        type="button"
        className={`flex-1 py-3 px-4 font-medium transition-colors ${
          activeTab === "multiply"
            ? "text-[#2ae5b9] border-b-2 border-[#2ae5b9]"
            : "text-[#728395] border-b border-[#14304e]"
        }`}
        onClick={() => onTabChange("multiply")}
      >
        Multiply
      </button>
      <button
        type="button"
        className={`flex-1 py-3 px-4 font-medium transition-colors ${
          activeTab === "borrow"
            ? "text-[#2ae5b9] border-b-2 border-[#2ae5b9]"
            : "text-[#728395] border-b border-[#14304e]"
        }`}
        onClick={() => onTabChange("borrow")}
      >
        Borrow
      </button>
    </div>
  );
}