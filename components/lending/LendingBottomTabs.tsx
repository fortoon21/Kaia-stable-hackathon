"use client";

import type { BottomTabType } from "@/types/lending";

interface LendingBottomTabsProps {
  activeTab: BottomTabType;
  onTabChange: (tab: BottomTabType) => void;
}

export function LendingBottomTabs({ 
  activeTab, 
  onTabChange 
}: LendingBottomTabsProps) {
  const tabs: { value: BottomTabType; label: string }[] = [
    { value: "pair", label: "Pair Overview" },
    { value: "collateral", label: "Collateral Asset" },
    { value: "debt", label: "Debt Asset" },
  ];

  return (
    <div className="flex w-full">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
            activeTab === tab.value
              ? "bg-[#14304e] text-[#2ae5b9] border-t-2 border-[#2ae5b9]"
              : "bg-[#0a1420] text-[#728395] border-t border-[#14304e] hover:bg-[#14304e]/50"
          }`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}