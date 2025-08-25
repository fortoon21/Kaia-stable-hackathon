"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getNetworkColor, getNetworkName } from "@/constants/networks";
import { validations } from "@/lib/validations";
import { useWeb3 } from "@/lib/web3Provider";
import LoadingSpinner from "./ui/LoadingSpinner";
import { showToast } from "./ui/Toast";

interface WindowWithWallets extends Window {
  kaia?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  };
  klaytn?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  };
  ethereum?: {
    isMetaMask?: boolean;
    isRabby?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  };
}

interface Wallet {
  name: string;
  icon: string;
  detected: boolean;
  description: string;
  recommended?: boolean;
}

export default function WalletConnectorV2() {
  const {
    address,
    balance,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWeb3();

  const [showModal, setShowModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  // Enhanced wallet detection with priority for Kaia
  useEffect(() => {
    const detectWallets = () => {
      const wallets: Wallet[] = [
        {
          name: "Kaia Wallet",
          icon: "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/wallets/kaiawallet.png",
          detected:
            typeof window !== "undefined" &&
            (!!(window as WindowWithWallets).kaia ||
              !!(window as WindowWithWallets).klaytn),
          description: "Official Kaia blockchain wallet",
          recommended: true,
        },
        {
          name: "MetaMask",
          icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
          detected:
            typeof window !== "undefined" &&
            !!(window as WindowWithWallets).ethereum?.isMetaMask,
          description: "Most popular Web3 wallet",
        },
        {
          name: "Rabby",
          icon: "https://rabby.io/assets/images/logo-128.png",
          detected:
            typeof window !== "undefined" &&
            !!(window as WindowWithWallets).ethereum?.isRabby,
          description: "Multi-chain wallet with better UX",
        },
      ];

      // Sort by: recommended first, then detected, then others
      wallets.sort((a, b) => {
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        if (a.detected && !b.detected) return -1;
        if (!a.detected && b.detected) return 1;
        return 0;
      });

      setAvailableWallets(wallets);
    };

    detectWallets();

    // Re-detect when window focuses (user might have installed wallet)
    if (typeof window !== "undefined") {
      window.addEventListener("focus", detectWallets);
      return () => window.removeEventListener("focus", detectWallets);
    }
  }, []);

  const handleConnect = async (wallet: Wallet) => {
    try {
      await connectWallet(wallet.name);
      // Only show success toast and close modal if connection actually succeeded
      setShowModal(false);
      showToast({
        type: "success",
        title: "Wallet Connected",
        description: `Successfully connected to ${wallet.name}`,
      });
    } catch (err: unknown) {
      // Don't show error toast for user cancellation
      const error = err as { code?: number; message?: string };
      if (
        error.code === 4001 ||
        error.message?.includes("User rejected") ||
        error.message?.includes("User cancelled")
      ) {
        // User cancelled - just keep modal open, don't show error
        return;
      }

      showToast({
        type: "error",
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowAccountModal(false);
    showToast({
      type: "info",
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      showToast({
        type: "success",
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleNetworkSwitch = async (targetChainId: number) => {
    try {
      await switchNetwork(targetChainId);
      showToast({
        type: "success",
        title: "Network Switched",
        description: `Switched to ${targetChainId === 8217 ? "Kaia Mainnet" : "Kaia Testnet"}`,
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      showToast({
        type: "error",
        title: "Network Switch Failed",
        description: error.message || "Failed to switch network",
      });
    }
  };

  // Format display values
  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatBalance = (bal: string) => {
    const num = parseFloat(bal);
    return num > 0.0001 ? num.toFixed(4) : "<0.0001";
  };

  if (address) {
    return (
      <>
        {/* Account Button - Minimalist for navbar integration */}
        <button
          type="button"
          onClick={() => setShowAccountModal(true)}
          className="flex items-center space-x-2 text-[#ddfbf4] hover:text-white transition-all duration-200"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold whitespace-nowrap">
            {formatAddress(address)}
          </span>
          {balance && (
            <span className="text-xs text-[#728395] whitespace-nowrap">
              {formatBalance(balance)} KAIA
            </span>
          )}
        </button>

        {/* Account Modal */}
        {showAccountModal && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] animate-fade-in">
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl p-6 w-96 max-w-[90vw] animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Account Details
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="text-[#728395] hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Address Section */}
                <div className="bg-[#08131f] rounded-lg p-4">
                  <div className="text-[#728395] text-sm mb-2">
                    Connected Address
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-white font-mono text-sm">
                      {formatAddress(address)}
                    </code>
                    <button
                      type="button"
                      onClick={copyAddress}
                      className="text-[#2ae5b9] hover:text-[#17e3c2] transition-colors"
                    >
                      {copySuccess ? "✓ Copied" : "📋 Copy"}
                    </button>
                  </div>
                </div>

                {/* Balance Section */}
                <div className="bg-[#08131f] rounded-lg p-4">
                  <div className="text-[#728395] text-sm mb-2">Balance</div>
                  <div className="text-white font-semibold text-lg">
                    {balance
                      ? `${formatBalance(balance)} KAIA`
                      : "Loading balance..."}
                  </div>
                  {balance && (
                    <div className="text-[#728395] text-sm mt-1">
                      ≈ {validations.formatUSD(parseFloat(balance) * 0.8)}
                    </div>
                  )}
                </div>

                {/* Network Section */}
                <div className="bg-[#08131f] rounded-lg p-4">
                  <div className="text-[#728395] text-sm mb-2">Network</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getNetworkColor(chainId)}`}
                      ></div>
                      <span className="text-white">
                        {getNetworkName(chainId)}
                      </span>
                    </div>
                    {chainId !== 8217 && (
                      <button
                        type="button"
                        onClick={() => handleNetworkSwitch(8217)}
                        className="text-xs text-[#2ae5b9] hover:underline"
                      >
                        Switch to Mainnet
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://kaiascan.io/account/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#14304e] hover:bg-[#1a3a5c] text-white font-medium py-2 rounded-lg text-center transition-colors"
                  >
                    View on Explorer
                  </a>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium py-2 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        className="bg-gradient-to-r from-[#2ae5b9] to-[#17e3c2] text-black font-semibold px-6 py-2 rounded-full hover:shadow-lg hover:shadow-[#2ae5b9]/25 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" color="white" />
            <span>Connecting...</span>
          </div>
        ) : (
          "Connect Wallet"
        )}
      </button>

      {/* Wallet Selection Modal */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] animate-fade-in p-4">
          <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl p-6 w-96 max-w-full max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Connect Wallet
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#728395] hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {availableWallets.map((wallet) => (
                <button
                  type="button"
                  key={wallet.name}
                  onClick={() => handleConnect(wallet)}
                  disabled={!wallet.detected || isConnecting}
                  className={`w-full flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                    wallet.detected
                      ? "border-[#14304e] bg-[#08131f] hover:border-[#2ae5b9] hover:bg-[#0a1a14] hover:scale-[1.02]"
                      : "border-[#14304e] bg-[#08131f] opacity-50 cursor-not-allowed"
                  } ${wallet.recommended ? "ring-2 ring-[#2ae5b9]/30" : ""}`}
                >
                  <div className="w-8 h-8">
                    <Image
                      src={wallet.icon}
                      alt={wallet.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDNjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtM3MxLjM0LTMgMy0zem0wIDEyYy0yLjUgMC00LjcxLTEuMjgtNi0zLjIyQzYuMjggMTMuNjUgOC45IDEyIDEyIDEyczUuNzIgMS42NSA2IDIuNzhjLTEuMjkgMS45NC0zLjUgMy4yMi02IDMuMjJ6IiBmaWxsPSJ3aWl0ZSIvPgo8L3N2Zz4KPC9zdmc+";
                      }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold flex items-center space-x-2">
                      <span>{wallet.name}</span>
                      {wallet.recommended && (
                        <span className="text-xs bg-[#2ae5b9] text-black px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                      {wallet.detected && !wallet.recommended && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                          Detected
                        </span>
                      )}
                      {!wallet.detected && wallet.name !== "WalletConnect" && (
                        <span className="text-xs bg-[#728395] text-white px-2 py-0.5 rounded">
                          Not Installed
                        </span>
                      )}
                    </div>
                    <div className="text-[#728395] text-sm">
                      {wallet.description}
                    </div>
                  </div>
                  <div className="text-[#728395]">→</div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#14304e]">
              <div className="text-center">
                <p className="text-[#728395] text-sm mb-2">
                  New to Web3 wallets?
                </p>
                <a
                  href="https://docs.kaia.io/build/wallets/overview/kaia-wallet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2ae5b9] hover:underline text-sm"
                >
                  Learn about Kaia Wallet →
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
