"use client";

import { useEffect, useState } from "react";

interface WalletConnectorProps {
  isConnected: boolean;
  connectedWallet: string | null;
  onConnect: (walletName: string) => void;
  onDisconnect: () => void;
}

interface Wallet {
  name: string;
  icon: string;
  detected: boolean;
  description: string;
}

export default function WalletConnector({
  isConnected,
  connectedWallet,
  onConnect,
  onDisconnect,
}: WalletConnectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Mock wallet detection - checks for wallet extensions
  useEffect(() => {
    const detectWallets = () => {
      const wallets: Wallet[] = [
        {
          name: "Kaia Wallet",
          icon: "🦊", // Using emoji for now, can be replaced with actual icons
          detected: typeof window !== "undefined" && !!(window as any).klaytn,
          description: "Kaia's official wallet for the Kaia blockchain",
        },
        {
          name: "MetaMask",
          icon: "🦊",
          detected:
            typeof window !== "undefined" &&
            !!(window as any).ethereum?.isMetaMask,
          description: "Most popular Ethereum wallet",
        },
        {
          name: "Rabby",
          icon: "🐰",
          detected:
            typeof window !== "undefined" &&
            !!(window as any).ethereum?.isRabby,
          description: "Multi-chain wallet with better UX",
        },
        {
          name: "Coinbase Wallet",
          icon: "🔵",
          detected:
            typeof window !== "undefined" &&
            !!(window as any).ethereum?.isCoinbaseWallet,
          description: "Coinbase's self-custody wallet",
        },
        {
          name: "WalletConnect",
          icon: "🔗",
          detected: true, // WalletConnect is always available
          description: "Connect with 200+ wallets",
        },
      ];

      // Add fallback "Injected Wallet" if any ethereum provider is detected
      if (
        typeof window !== "undefined" &&
        (window as any).ethereum &&
        !wallets.some((w) => w.detected)
      ) {
        wallets.push({
          name: "Injected Wallet",
          icon: "💳",
          detected: true,
          description: "Browser extension wallet",
        });
      }

      setAvailableWallets(wallets);
    };

    detectWallets();
  }, []);

  const handleWalletConnect = async (wallet: Wallet) => {
    setIsConnecting(true);

    try {
      // Mock connection logic - in real app, this would use actual wallet SDKs
      if (wallet.name === "Kaia Wallet") {
        // Mock Kaia wallet connection
        if ((window as any).klaytn) {
          await (window as any).klaytn.enable();
        }
      } else if (wallet.name === "MetaMask") {
        // Mock MetaMask connection
        if ((window as any).ethereum?.isMetaMask) {
          await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });
        }
      } else if (wallet.name === "Rabby") {
        // Mock Rabby connection
        if ((window as any).ethereum?.isRabby) {
          await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });
        }
      } else {
        // Mock other wallet connections
        console.log(`Connecting to ${wallet.name}...`);
      }

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onConnect(wallet.name);
      setShowModal(false);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert(`Failed to connect to ${wallet.name}. Please try again.`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Mock connected address for demo
  const mockAddress = "0x1234...5678";

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-[#10263e] border border-[#14304e] rounded-full px-4 py-2 text-[#ddfbf4] hover:bg-[#14304e] transition-colors"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm font-semibold">
            {formatAddress(mockAddress)}
          </span>
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl p-6 w-96">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Wallet Info
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#728395] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#08131f] rounded-lg p-4">
                  <div className="text-[#728395] text-sm mb-1">
                    Connected Wallet
                  </div>
                  <div className="text-white font-semibold">
                    {connectedWallet}
                  </div>
                </div>

                <div className="bg-[#08131f] rounded-lg p-4">
                  <div className="text-[#728395] text-sm mb-1">Address</div>
                  <div className="text-white font-mono">{mockAddress}</div>
                </div>

                <div className="bg-[#08131f] rounded-lg p-4">
                  <div className="text-[#728395] text-sm mb-1">Balance</div>
                  <div className="text-white font-semibold">1,234.56 KAIA</div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-[#10263e] border border-[#14304e] text-[#ddfbf4] font-semibold px-6 py-2 rounded-full hover:bg-[#14304e] transition-colors"
      >
        Connect
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Connect Wallet
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#728395] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleWalletConnect(wallet)}
                  disabled={!wallet.detected || isConnecting}
                  className={`w-full flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                    wallet.detected
                      ? "border-[#14304e] bg-[#08131f] hover:border-[#2ae5b9] hover:bg-[#0a1a14]"
                      : "border-[#14304e] bg-[#08131f] opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold flex items-center space-x-2">
                      <span>{wallet.name}</span>
                      {wallet.detected && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                          Detected
                        </span>
                      )}
                      {!wallet.detected && (
                        <span className="text-xs bg-[#728395] text-white px-2 py-0.5 rounded">
                          Not Installed
                        </span>
                      )}
                    </div>
                    <div className="text-[#728395] text-sm">
                      {wallet.description}
                    </div>
                  </div>
                  {isConnecting && (
                    <div className="w-5 h-5 border-2 border-[#2ae5b9] border-t-transparent rounded-full animate-spin"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <div className="text-[#728395] text-sm">
                New to wallets?{" "}
                <a href="#" className="text-[#2ae5b9] hover:underline">
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
