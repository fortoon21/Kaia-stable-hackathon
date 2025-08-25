"use client";

import Image from "next/image";
import { LAYOUT } from "@/constants/layout";
import { getNetworkInfo } from "@/constants/networks";
import { useWeb3 } from "@/lib/web3Provider";
import WalletConnectorV2 from "./WalletConnectorV2";

interface NavigationProps {
  currentPage: "lending" | "markets";
  onPageChange: (page: "lending" | "markets") => void;
}

export default function Navigation({
  currentPage,
  onPageChange,
}: NavigationProps) {
  const { chainId, isConnected } = useWeb3();
  const networkInfo = getNetworkInfo(chainId);

  return (
    <>
      {/* Background overlay to prevent content showing above nav */}
      <div
        className={`fixed left-0 right-0 top-0 h-16 ${LAYOUT.BACKGROUND_CLASS} z-[9998]`}
      ></div>

      <div
        className={`fixed ${LAYOUT.NAVIGATION_HEIGHT_CLASS} left-4 right-4 top-4 mx-auto max-w-7xl min-w-[1024px] bg-surface-1 border border-line-soft rounded-2xl backdrop-blur-md z-[9999] shadow-2 font-heading`}
      >
        <div className="h-full overflow-visible">
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
                  onClick={() => onPageChange("markets")}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors whitespace-nowrap ${
                    currentPage === "markets"
                      ? "text-primary-100 bg-surface-2 border border-line-soft"
                      : "text-body hover:text-heading hover:bg-surface-ghost"
                  }`}
                >
                  Markets
                </button>
                <button
                  type="button"
                  onClick={() => onPageChange("lending")}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors whitespace-nowrap ${
                    currentPage === "lending"
                      ? "text-primary-100 bg-surface-2 border border-line-soft"
                      : "text-body hover:text-heading hover:bg-surface-ghost"
                  }`}
                >
                  Lending
                </button>
              </nav>
            </div>

            {/* Right side - Network and Wallet Container */}
            <div className="flex items-center space-x-3 flex-shrink-0 ml-8">
              {/* Combined Network & Wallet Info */}
              {isConnected ? (
                <div className="flex items-center space-x-3 bg-surface-2 border border-line-soft rounded-pill px-4 py-2 shadow-1">
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
                    <span className="text-heading text-sm font-medium whitespace-nowrap">
                      {networkInfo.name}
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="w-px h-4 bg-line-soft"></div>

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
    </>
  );
}
