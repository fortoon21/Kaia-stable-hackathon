"use client";

import type { TabType } from "@/types/lending";

interface LendingTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function LendingTabs({ activeTab, onTabChange }: LendingTabsProps) {
  return (
    <div
      className="h-full overflow-visible relative"
      data-name="Tablist"
      data-node-id="1:34"
    >
      <button
        type="button"
        onClick={() => onTabChange("borrow")}
        className="absolute h-[53px] left-0 w-1/2 rounded top-0 cursor-pointer hover:bg-[#14304e] transition-colors"
        data-name="Tab"
        data-node-id="1:35"
      >
        <div
          aria-hidden="true"
          className="absolute border-[#14304e] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded"
        />
        <div
          className={`absolute flex flex-col font-normal h-5 justify-center leading-[0] not-italic text-[16px] text-center translate-x-[-50%] translate-y-[-50%] w-[54.205px] ${
            activeTab === "borrow"
              ? "text-[#ddfbf4]"
              : "text-[#728395]"
          }`}
          data-node-id="1:36"
          style={{
            top: "calc(50% - 0.5px)",
            left: "calc(50% + 0.183px)",
          }}
        >
          <p className="block leading-[20px]">Borrow</p>
        </div>
        {activeTab === "borrow" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ae5b9]"></div>
        )}
      </button>
      <button
        type="button"
        onClick={() => onTabChange("multiply")}
        className="absolute h-[53px] right-0 w-1/2 rounded top-0 cursor-pointer hover:bg-[#14304e] transition-colors"
        data-name="Tab"
        data-node-id="1:37"
      >
        <div
          aria-hidden="true"
          className="absolute border-[#14304e] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded"
        />
        <div
          className={`absolute flex flex-col font-normal h-5 justify-center leading-[0] not-italic text-[16px] text-center translate-x-[-50%] translate-y-[-50%] w-[59.773px] ${
            activeTab === "multiply"
              ? "text-[#ddfbf4]"
              : "text-[#728395]"
          }`}
          data-node-id="1:38"
          style={{
            top: "calc(50% - 0.5px)",
            left: "calc(50% + 0.186px)",
          }}
        >
          <p className="block leading-[20px]">Multiply</p>
        </div>
        {activeTab === "multiply" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ae5b9]"></div>
        )}
      </button>
    </div>
  );
}