"use client";

import { ethers } from "ethers";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
    on: (event: string, handler: (...args: unknown[]) => void) => void;
    removeListener: (
      event: string,
      handler: (...args: unknown[]) => void
    ) => void;
  };
}

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  account: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Kaia Mainnet and Testnet configurations
const KAIA_NETWORKS = {
  mainnet: {
    chainId: 8217,
    name: "Kaia Mainnet",
    rpcUrl: "https://rpc.ankr.com/kaia",
    symbol: "KAIA",
    explorer: "https://kaiascan.io",
  },
  testnet: {
    chainId: 1001,
    name: "Kaia Testnet Baobab",
    rpcUrl: "https://public-en-baobab.klaytn.net",
    symbol: "KAIA",
    explorer: "https://baobab.kaiascan.io",
  },
};

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues by ensuring client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if current network is Kaia
  const isKaiaNetwork = useCallback((chainId: number | null): boolean => {
    return chainId === 8217; // Kaia mainnet only
  }, []);

  const updateBalance = useCallback(
    async (userAddress: string) => {
      if (!provider) return;

      try {
        const balance = await provider.getBalance(userAddress);
        setBalance(ethers.formatEther(balance));
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    },
    [provider]
  );

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setBalance(null);
    setError(null);

    localStorage.removeItem("connectedWallet");
    localStorage.removeItem("walletAddress");
  }, []);

  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) {
      throw new Error("No wallet detected");
    }

    const targetNetwork = Object.values(KAIA_NETWORKS).find(
      (network) => network.chainId === targetChainId
    );

    if (!targetNetwork) {
      throw new Error("Unsupported network");
    }

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (switchError: unknown) {
      // Network doesn't exist, add it
      if ((switchError as { code?: number }).code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: targetNetwork.name,
                nativeCurrency: {
                  name: targetNetwork.symbol,
                  symbol: targetNetwork.symbol,
                  decimals: 18,
                },
                rpcUrls: [targetNetwork.rpcUrl],
                blockExplorerUrls: [targetNetwork.explorer],
              },
            ],
          });
        } catch (_addError) {
          throw new Error("Failed to add network");
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  // Auto switch to Kaia if on different network
  const checkAndSwitchToKaia = useCallback(async () => {
    if (!window.ethereum || !chainId || isKaiaNetwork(chainId)) return;

    try {
      // Try Kaia Mainnet first, fallback to Testnet
      const targetChainId = 8217; // Kaia Mainnet
      await switchNetwork(targetChainId);
    } catch (error) {
      console.error("Failed to switch to Kaia network:", error);
      setError("Please switch to Kaia network to use this application");
    }
  }, [chainId, isKaiaNetwork, switchNetwork]);

  const connectWallet = useCallback(
    async (walletType: string) => {
      setIsConnecting(true);
      setError(null);

      try {
        let ethereum: unknown;

        // Handle different wallet types
        if (
          walletType === "Kaia Wallet" &&
          ((window as WindowWithWallets).kaia ||
            (window as WindowWithWallets).klaytn)
        ) {
          ethereum =
            (window as WindowWithWallets).kaia ||
            (window as WindowWithWallets).klaytn;
        } else if (window.ethereum) {
          ethereum = window.ethereum;
        } else {
          throw new Error(`${walletType} is not installed`);
        }

        // Request account access
        const accounts = await (
          ethereum as {
            request: (params: { method: string }) => Promise<string[]>;
          }
        ).request({
          method: "eth_requestAccounts",
        });

        if (accounts.length === 0) {
          throw new Error("No accounts found");
        }

        // Create provider and signer
        // biome-ignore lint/suspicious/noExplicitAny: Ethereum provider types vary across wallets
        const web3Provider = new ethers.BrowserProvider(ethereum as any);
        const web3Signer = await web3Provider.getSigner();
        const network = await web3Provider.getNetwork();

        setProvider(web3Provider);
        setSigner(web3Signer);
        setAddress(accounts[0]);
        setChainId(Number(network.chainId));

        // Fetch initial balance using local provider
        try {
          const balance = await web3Provider.getBalance(accounts[0]);
          const formattedBalance = ethers.formatEther(balance);
          setBalance(formattedBalance);
        } catch (err) {
          console.error("Failed to fetch balance:", err);
        }

        // Force balance update after a short delay
        setTimeout(() => updateBalance(accounts[0]), 1000);

        // Check if connected to Kaia network, if not, prompt switch
        if (!isKaiaNetwork(Number(network.chainId))) {
          setTimeout(checkAndSwitchToKaia, 500);
        }

        // Store connection info
        localStorage.setItem("connectedWallet", walletType);
        localStorage.setItem("walletAddress", accounts[0]);
      } catch (err: unknown) {
        console.error("Wallet connection failed:", err);
        setError((err as Error).message || "Failed to connect wallet");
      } finally {
        setIsConnecting(false);
      }
    },
    [checkAndSwitchToKaia, isKaiaNetwork, updateBalance]
  );

  // Listen for account and network changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAddress(accounts[0]);
          updateBalance(accounts[0]);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);

        // Check if switched to non-Kaia network and prompt switch back
        if (!isKaiaNetwork(newChainId)) {
          setTimeout(checkAndSwitchToKaia, 1000); // Small delay to let state update
        } else {
          setError(null); // Clear any network errors
        }
      };

      window.ethereum.on?.("accountsChanged", handleAccountsChanged);
      window.ethereum.on?.("chainChanged", handleChainChanged);

      return () => {
        window.ethereum?.removeListener?.(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
      };
    }
  }, [checkAndSwitchToKaia, disconnectWallet, isKaiaNetwork, updateBalance]);

  // Auto-reconnect on mount if previously connected
  useEffect(() => {
    if (!mounted) return;

    const reconnect = async () => {
      // Ensure this only runs on client side after mount
      if (typeof window === "undefined") return;

      const savedWallet = localStorage.getItem("connectedWallet");
      const savedAddress = localStorage.getItem("walletAddress");

      if (savedWallet && savedAddress && window.ethereum) {
        try {
          const accounts = (await window.ethereum.request({
            method: "eth_accounts",
          })) as string[];

          if (accounts.includes(savedAddress)) {
            await connectWallet(savedWallet);
          } else {
            // Clear invalid session
            localStorage.removeItem("connectedWallet");
            localStorage.removeItem("walletAddress");
          }
        } catch (err) {
          console.error("Auto-reconnect failed:", err);
        }
      }
    };

    // Small delay to ensure client-side hydration is complete
    const timeoutId = setTimeout(reconnect, 100);
    return () => clearTimeout(timeoutId);
  }, [mounted, connectWallet]);

  const value: Web3ContextType = {
    provider,
    signer,
    address,
    chainId,
    balance,
    isConnected: !!address,
    account: address,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  // Prevent hydration mismatches by only rendering after client mount
  if (!mounted) {
    return (
      <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
    );
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
}
