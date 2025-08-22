"use client";

import Image from "next/image";
import { getNetworkInfo } from "@/constants/networks";
import { useWeb3 } from "@/lib/web3Provider";
import WalletConnectorV2 from "./WalletConnectorV2";

interface NavigationProps {
  currentPage: "lending" | "markets" | "repay";
  onPageChange: (page: "lending" | "markets" | "repay") => void;
}

export default function Navigation({
  currentPage,
  onPageChange,
}: NavigationProps) {
  const { chainId, isConnected } = useWeb3();
  const networkInfo = getNetworkInfo(chainId);

  return (
    <div className="fixed h-[68px] left-0 top-0 w-full bg-[#08131f] border-b border-[#10263e] z-50">
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
              <button
                type="button"
                onClick={() => onPageChange("repay")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
                  currentPage === "repay"
                    ? "text-[#ddfbf4] bg-[#14304e]"
                    : "text-[#728395] hover:text-[#ddfbf4] hover:bg-[#10263e]"
                }`}
              >
                Repay
              </button>
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
