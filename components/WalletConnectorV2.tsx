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
          className="flex items-center space-x-2 text-primary-100 hover:text-heading transition-all duration-200"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold whitespace-nowrap">
            {formatAddress(address)}
          </span>
          {balance && (
            <span className="text-xs text-primary-200 whitespace-nowrap">
              {formatBalance(balance)} KAIA
            </span>
          )}
        </button>

        {/* Account Modal */}
        {showAccountModal &&
          typeof document !== "undefined" &&
          createPortal(
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[10000] animate-fade-in">
              <div className="bg-surface-3 border border-line-strong rounded-lg p-6 w-96 max-w-[90vw] animate-scale-in shadow-3" style={{ boxShadow: '0 32px 80px rgba(0, 0, 0, 0.5), 0 12px 24px rgba(0, 0, 0, 0.3)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-heading font-heading">
                    Account Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(false)}
                    className="text-body hover:text-heading transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Address Section */}
                  <div className="bg-surface-1 border border-line-soft rounded-md p-4 shadow-1">
                    <div className="text-body text-sm mb-2 font-heading">
                      Connected Address
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-heading font-mono text-sm">
                        {formatAddress(address)}
                      </code>
                      <button
                        type="button"
                        onClick={copyAddress}
                        className="text-primary-100 hover:text-primary-200 transition-colors"
                      >
                        {copySuccess ? "✓ Copied" : "📋 Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Balance Section */}
                  <div className="bg-surface-1 border border-line-soft rounded-md p-4 shadow-1">
                    <div className="text-body text-sm mb-2 font-heading">Balance</div>
                    <div className="text-heading font-semibold text-lg font-heading">
                      {balance
                        ? `${formatBalance(balance)} KAIA`
                        : "Loading balance..."}
                    </div>
                    {balance && (
                      <div className="text-muted text-sm mt-1">
                        ≈ {validations.formatUSD(parseFloat(balance) * 0.8)}
                      </div>
                    )}
                  </div>

                  {/* Network Section */}
                  <div className="bg-surface-1 border border-line-soft rounded-md p-4 shadow-1">
                    <div className="text-body text-sm mb-2 font-heading">Network</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getNetworkColor(chainId)}`}
                        ></div>
                        <span className="text-heading">
                          {getNetworkName(chainId)}
                        </span>
                      </div>
                      {chainId !== 8217 && (
                        <button
                          type="button"
                          onClick={() => handleNetworkSwitch(8217)}
                          className="text-xs text-primary-100 hover:underline"
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
                      className="bg-primary-400 hover:bg-primary-300 text-heading font-medium py-2 rounded-md text-center transition-colors font-heading"
                    >
                      View on Explorer
                    </a>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="bg-warning/20 hover:bg-warning/30 text-warning font-medium py-2 rounded-md transition-colors font-heading"
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
        className="bg-primary-100 text-black font-semibold px-6 py-2 rounded-pill hover:shadow-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-heading"
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
      {showModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[10000] animate-fade-in p-4">
            <div className="bg-surface-3 border border-line-strong rounded-lg p-6 w-96 max-w-full max-h-[80vh] overflow-y-auto animate-scale-in shadow-3" style={{ boxShadow: '0 32px 80px rgba(0, 0, 0, 0.5), 0 12px 24px rgba(0, 0, 0, 0.3)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-heading font-heading">
                  Connect Wallet
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-body hover:text-heading transition-colors p-1"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="bg-warning/10 border border-warning/30 rounded-md p-3 mb-4">
                  <p className="text-warning text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                {availableWallets.map((wallet) => (
                  <button
                    type="button"
                    key={wallet.name}
                    onClick={() => handleConnect(wallet)}
                    disabled={!wallet.detected || isConnecting}
                    className={`w-full flex items-center space-x-4 p-4 rounded-md border transition-all duration-200 ${
                      wallet.detected
                        ? "border-line-soft bg-surface-2 hover:border-primary-100 hover:bg-surface-ghost hover:scale-[1.02]"
                        : "border-line-soft bg-surface-2 opacity-50 cursor-not-allowed"
                    }`}
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
                      <div className="text-heading font-semibold flex items-center space-x-2 font-heading">
                        <span>{wallet.name}</span>
                        {wallet.recommended && (
                          <span className="text-xs bg-primary-100 text-black px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                        {wallet.detected && !wallet.recommended && (
                          <span className="text-xs bg-[#23c09b] text-heading px-2 py-0.5 rounded-xs">
                            Detected
                          </span>
                        )}
                        {!wallet.detected &&
                          wallet.name !== "WalletConnect" && (
                            <span className="text-xs bg-surface-3 text-muted px-2 py-0.5 rounded-xs">
                              Not Installed
                            </span>
                          )}
                      </div>
                      <div className="text-body text-sm">
                        {wallet.description}
                      </div>
                    </div>
                    <div className="text-body">→</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-line-soft">
                <div className="text-center">
                  <p className="text-body text-sm mb-2">
                    New to Web3 wallets?
                  </p>
                  <a
                    href="https://docs.kaia.io/build/wallets/overview/kaia-wallet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-100 hover:underline text-sm"
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
