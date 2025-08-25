"use client";

import { useWeb3 } from "@/lib/web3Provider";

export default function NetworkWarning() {
  const { chainId, switchNetwork, error } = useWeb3();

  // Check if current network is Kaia
  const isKaiaNetwork = chainId === 8217;

  // Don't show warning if not connected or on Kaia network
  if (!chainId || isKaiaNetwork) return null;

  const handleSwitchToKaia = async () => {
    try {
      await switchNetwork(8217); // Switch to Kaia Mainnet
    } catch (_error) {
      // Failed to switch network
    }
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 5:
        return "Goerli";
      case 56:
        return "BSC";
      case 137:
        return "Polygon";
      default:
        return `Network (${chainId})`;
    }
  };

  return (
    <div className="fixed top-20 left-0 right-0 z-50 mx-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-warning border border-yellow-600 rounded-md p-4 shadow-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-600 rounded-pill flex items-center justify-center">
                <span className="text-heading text-lg">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-black font-heading font-semibold text-sm">
                Wrong Network Detected
              </h3>
              <p className="text-black text-sm mt-1">
                You're connected to {getNetworkName(chainId)}. This application
                only works on Kaia Network.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleSwitchToKaia}
                className="bg-black text-heading px-4 py-2 rounded-sm font-heading font-semibold hover:bg-gray-800 transition-colors text-sm"
              >
                Switch to Kaia
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-sm text-red-700 text-xs">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
