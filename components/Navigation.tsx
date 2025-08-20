"use client";

import { useState } from "react";
import WalletConnector from "./WalletConnector";

interface NavigationProps {
  currentPage: "page1" | "page2";
  onPageChange: (page: "page1" | "page2") => void;
}

export default function Navigation({
  currentPage,
  onPageChange,
}: NavigationProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const handleWalletConnect = (walletName: string) => {
    setIsWalletConnected(true);
    setConnectedWallet(walletName);
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setConnectedWallet(null);
  };

  return (
    <div className="absolute h-[59px] left-0 top-0 w-full bg-[#08131f] border-b border-[#10263e] z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#2ae5b9] rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">K</span>
            </div>
            <span className="text-white font-semibold text-lg">Kaia</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onPageChange("page1")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                currentPage === "page1"
                  ? "text-[#ddfbf4] bg-[#14304e]"
                  : "text-[#728395] hover:text-[#ddfbf4] hover:bg-[#10263e]"
              }`}
            >
              Lend/Multiply
            </button>
            <button
              onClick={() => onPageChange("page2")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                currentPage === "page2"
                  ? "text-[#ddfbf4] bg-[#14304e]"
                  : "text-[#728395] hover:text-[#ddfbf4] hover:bg-[#10263e]"
              }`}
            >
              Markets
            </button>
            <button className="text-[#728395] hover:text-[#ddfbf4] px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
              Strategies
            </button>
            <button className="text-[#728395] hover:text-[#ddfbf4] px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
              Pools
            </button>
            <button className="text-[#728395] hover:text-[#ddfbf4] px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
              Points
            </button>
          </nav>
        </div>

        {/* Right side - Network and Wallet */}
        <div className="flex items-center space-x-3">
          {/* Network Selector */}
          <div className="flex items-center space-x-2 bg-[#14304e] border border-[#10263e] rounded-full px-3 py-2">
            <div className="w-5 h-5 bg-[#2ae5b9] rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">K</span>
            </div>
            <span className="text-[#ddfbf4] text-sm font-medium">Kaia</span>
          </div>

          {/* Wallet Connector */}
          <WalletConnector
            isConnected={isWalletConnected}
            connectedWallet={connectedWallet}
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
        </div>
      </div>
    </div>
  );
}
