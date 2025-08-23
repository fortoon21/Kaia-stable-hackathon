"use client";

import Image from "next/image";
import { LAYOUT } from "@/constants/layout";
import { getNetworkInfo } from "@/constants/networks";
import { useWeb3 } from "@/lib/web3Provider";
import WalletConnectorV2 from "./WalletConnectorV2";

interface NavigationProps {
  currentPage: "lending" | "markets" | "swap";
  onPageChange: (page: "lending" | "markets" | "swap") => void;
}

export default function Navigation({
  currentPage,
  onPageChange,
}: NavigationProps) {
  const { chainId, isConnected } = useWeb3();
  const networkInfo = getNetworkInfo(chainId);

  return (
    <div
      className={`fixed ${LAYOUT.NAVIGATION_HEIGHT_CLASS} left-4 right-4 top-4 mx-auto max-w-7xl min-w-[1024px] ${LAYOUT.BACKGROUND_CLASS} border border-[#10263e] rounded-2xl backdrop-blur-sm bg-opacity-95 z-50 shadow-lg`}
    >
      <div className="h-full overflow-hidden">
        <div className="min-w-max px-6 h-full flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8 flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center ml-2">
              <Image
                src="/tgif-wordmark.svg"
                alt="TGIF"
                width={150}
                height={48}
                className="h-10 w-auto"
                priority
              />
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6 flex-shrink-0">
              <button
                type="button"
                onClick={() => onPageChange("lending")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
                  currentPage === "lending"
                    ? "text-[#ddfbf4] bg-[#14304e]"
                    : "text-[#728395] hover:text-[#ddfbf4] hover:bg-[#10263e]"
                }`}
              >
                Lending
              </button>
              <button
                type="button"
                onClick={() => onPageChange("markets")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
                  currentPage === "markets"
                    ? "text-[#ddfbf4] bg-[#14304e]"
                    : "text-[#728395] hover:text-[#ddfbf4] hover:bg-[#10263e]"
                }`}
              >
                Markets
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => onPageChange("swap")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap flex items-center space-x-2 ${
                    currentPage === "swap"
                      ? "text-[#ddfbf4] bg-[#14304e]"
                      : "text-[#728395] hover:text-[#ddfbf4] hover:bg-[#10263e]"
                  }`}
                >
                  <span>Swap Collateral</span>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <title>Swap</title>
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.707.293l2.828 2.829a1 1 0 11-1.414 1.414L13 5.414V9a1 1 0 11-2 0V5.414L9.879 6.536a1 1 0 01-1.414-1.414l2.828-2.829A1 1 0 0112 2zm0 10a1 1 0 01.707.293l2.828 2.829a1 1 0 11-1.414 1.414L13 15.414V19a1 1 0 11-2 0v-3.586l-1.121 1.122a1 1 0 01-1.414-1.414l2.828-2.829A1 1 0 0112 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </nav>
          </div>

          {/* Right side - Network and Wallet Container */}
          <div className="flex items-center space-x-3 flex-shrink-0 ml-8">
            {/* Combined Network & Wallet Info */}
            {isConnected ? (
              <div className="flex items-center space-x-3 bg-[#14304e] border border-[#10263e] rounded-full px-4 py-2">
                {/* Network Info */}
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 ${networkInfo.bgColor} rounded-full flex items-center justify-center`}
                  >
                    {networkInfo.logo ? (
                      <Image
                        src={networkInfo.logo}
                        alt={networkInfo.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const nextSibling =
                            target.nextElementSibling as HTMLElement;
                          if (nextSibling) {
                            nextSibling.style.display = "block";
                          }
                        }}
                      />
                    ) : null}
                    <span
                      className="text-black text-xs font-bold"
                      style={{ display: networkInfo.logo ? "none" : "block" }}
                    >
                      {networkInfo.symbol}
                    </span>
                  </div>
                  <span className="text-[#ddfbf4] text-sm font-medium whitespace-nowrap">
                    {networkInfo.name}
                  </span>
                </div>

                {/* Separator */}
                <div className="w-px h-4 bg-[#10263e]"></div>

                {/* Wallet Info */}
                <WalletConnectorV2 />
              </div>
            ) : (
              /* Connect Wallet Button */
              <WalletConnectorV2 />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
