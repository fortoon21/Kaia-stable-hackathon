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
import {
  AAVE_ASSETS,
  AAVE_CONFIG,
  ATOKEN_ASSETS,
  DEBT_TOKEN_ASSETS,
} from "@/constants/tokens";
import AaveFacet from "@/lib/abi/AaveFacet.json";

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
  getTokenBalance: (tokenAddress: string, decimals?: number) => Promise<string>;
  aaveParamsV3: unknown | null;
  aaveParamsV3Index: Record<string, unknown>;
  aaveStatesV3: Record<string, unknown>;
  aaveUserBalances: Record<
    string,
    {
      aTokenAddress: string;
      variableDebtTokenAddress: string;
      aTokenBalance: string;
      variableDebtBalance: string;
    }
  >;
  refreshAaveData: () => Promise<void>;
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
  const [aaveParamsV3, setAaveParamsV3] = useState<unknown | null>(null);
  const [aaveParamsV3Index, setAaveParamsV3Index] = useState<
    Record<string, unknown>
  >({});
  const [aaveStatesV3, setAaveStatesV3] = useState<Record<string, unknown>>({});
  const [aaveUserBalances, setAaveUserBalances] = useState<
    Record<
      string,
      {
        aTokenAddress: string;
        variableDebtTokenAddress: string;
        aTokenBalance: string;
        variableDebtBalance: string;
      }
    >
  >({});

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
      } catch (_err) {
        // Failed to fetch balance
      }
    },
    [provider]
  );

  const getTokenBalance = useCallback(
    async (tokenAddress: string, decimals: number = 18): Promise<string> => {
      if (!provider || !address) {
        throw new Error("Wallet not connected");
      }

      try {
        // Validate tokenAddress is a valid hex address to prevent ENS resolution
        if (!ethers.isAddress(tokenAddress)) {
          throw new Error("Invalid token address");
        }

        // ERC-20 ABI for balanceOf function
        const erc20Abi = [
          "function balanceOf(address owner) view returns (uint256)",
          "function decimals() view returns (uint8)",
        ];

        const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
        const balance = await contract.balanceOf(address);

        return ethers.formatUnits(balance, decimals);
      } catch (err) {
        const error = err as Error;
        // Don't log ENS errors for Kaia network
        if (!error.message.includes("does not support ENS")) {
          // Failed to fetch token balance
        }
        return "0";
      }
    },
    [provider, address]
  );

  // ---------------- Aave helpers (ABI + caching) ----------------
  const AAVE_DEBUG = false;

  // Normalize Aave V3 state tuple (ethers Result) into a plain object
  const coerceAaveStateV3 = useCallback((raw: unknown) => {
    let r: unknown = raw;
    if (
      typeof raw === "object" &&
      raw !== null &&
      "response" in (raw as Record<string, unknown>)
    ) {
      r = (raw as Record<string, unknown>).response as unknown;
    }
    if (
      typeof r === "object" &&
      r !== null &&
      !Array.isArray(r) &&
      "underlyingAsset" in (r as Record<string, unknown>)
    ) {
      return r as Record<string, unknown>;
    }
    if (Array.isArray(r) && r.length >= 14) {
      return {
        underlyingAsset: (r as unknown[])[0],
        stableDebtLastUpdateTimestamp: (r as unknown[])[1],
        liquidityIndex: (r as unknown[])[2],
        variableBorrowIndex: (r as unknown[])[3],
        liquidityRate: (r as unknown[])[4],
        variableBorrowRate: (r as unknown[])[5],
        stableBorrowRate: (r as unknown[])[6],
        lastUpdateTimestamp: (r as unknown[])[7],
        availableLiquidity: (r as unknown[])[8],
        priceInMarketReferenceCurrency: (r as unknown[])[9],
        principalStableDebt: (r as unknown[])[10],
        totalPrincipalStableDebt: (r as unknown[])[11],
        averageStableRate: (r as unknown[])[12],
        totalScaledVariableDebt: (r as unknown[])[13],
      } as Record<string, unknown>;
    }
    return r;
  }, []);

  const getAaveContract = useCallback(() => {
    if (!AAVE_CONFIG.FACET_ADDRESS) return null;
    try {
      const readonly = new ethers.JsonRpcProvider(KAIA_NETWORKS.mainnet.rpcUrl);
      const read = signer ?? provider ?? readonly;
      return new ethers.Contract(
        AAVE_CONFIG.FACET_ADDRESS,
        (AaveFacet as { abi: ethers.InterfaceAbi }).abi,
        read
      );
    } catch {
      return null;
    }
  }, [provider, signer]);

  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  const cacheGet = useCallback((key: string) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { ts: number; data: unknown };
      if (
        typeof parsed.ts === "number" &&
        Date.now() - parsed.ts > CACHE_TTL_MS
      ) {
        return null;
      }
      return parsed.data ?? null;
    } catch {
      return null;
    }
  }, []);

  const cacheSet = useCallback((key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch {}
  }, []);

  const fetchAaveParamsAndStates = useCallback(async () => {
    if (!AAVE_CONFIG.FACET_ADDRESS || !AAVE_CONFIG.LENDING_POOL_V3) return;

    const contract = getAaveContract();
    if (!contract) return;

    // Execute all three operations in parallel
    const [resolvedPool, paramsResult, statesResult] = await Promise.all([
      AAVE_CONFIG.LENDING_POOL_V3,
      (async () => {
        const effectiveChainId = chainId ?? 8217;
        const tempCachePrefix = `aave:v3:${effectiveChainId}:${AAVE_CONFIG.LENDING_POOL_V3}`;
        const paramsKey = `${tempCachePrefix}:params`;
        let params = cacheGet(paramsKey);
        if (!params) {
          try {
            const p = await contract.aavePoolParamsV3(
              AAVE_CONFIG.LENDING_POOL_V3
            );
            let normalized: unknown = p as unknown;
            if (
              typeof p === "object" &&
              p !== null &&
              "response" in (p as Record<string, unknown>)
            ) {
              normalized = (p as Record<string, unknown>).response as unknown;
            }
            params = (normalized as {}) ?? {};
            cacheSet(paramsKey, params);
          } catch (_e) {
            // ignore
          }
        }
        return params;
      })(),
      (async () => {
        // States V3 for provided assets - batch processing
        const assets = AAVE_ASSETS;
        const nextStates: Record<string, unknown> = {};
        const effectiveChainId = chainId ?? 8217;
        const tempCachePrefix = `aave:v3:${effectiveChainId}:${AAVE_CONFIG.LENDING_POOL_V3}`;

        try {
          const iface = new ethers.Interface(
            (AaveFacet as { abi: ethers.InterfaceAbi }).abi
          );
          const rp =
            signer?.provider ??
            provider ??
            new ethers.JsonRpcProvider(KAIA_NETWORKS.mainnet.rpcUrl);

          // Prepare batch calls for all assets
          const batchCalls: Array<{
            asset: string;
            data: string;
            stateKey: string;
          }> = [];

          for (const asset of assets) {
            const assetLc = asset.toLowerCase();
            const stateKey = `${tempCachePrefix}:state:${assetLc}`;
            const state = AAVE_DEBUG ? null : cacheGet(stateKey);

            if (!state) {
              const data = iface.encodeFunctionData("aavePoolStateV3", [
                AAVE_CONFIG.LENDING_POOL_V3,
                asset,
              ]);
              batchCalls.push({ asset, data, stateKey });
            } else {
              nextStates[assetLc] = state;
            }
          }

          // Execute batch calls if any needed
          if (batchCalls.length > 0) {
            const batchPromises = batchCalls.map(
              async ({ asset, data, stateKey }) => {
                try {
                  const rawHex = await rp.call({
                    to: AAVE_CONFIG.FACET_ADDRESS,
                    data,
                  });
                  const decoded = iface.decodeFunctionResult(
                    "aavePoolStateV3",
                    rawHex
                  );
                  const tuple =
                    Array.isArray(decoded) && decoded.length
                      ? decoded[0]
                      : decoded;
                  const normalized = coerceAaveStateV3(tuple);
                  const state = (normalized as {}) ?? {};

                  cacheSet(stateKey, state);
                  return { asset: asset.toLowerCase(), state };
                } catch (error) {
                  console.warn(
                    `Failed to fetch state for asset ${asset}:`,
                    error
                  );
                  return null;
                }
              }
            );

            // Execute all calls in parallel
            const results = await Promise.all(batchPromises);

            // Process results
            results.forEach((result) => {
              if (result?.state) {
                nextStates[result.asset] = result.state;
              }
            });
          }
        } catch (error) {
          console.warn("Failed to batch fetch Aave states:", error);
        }

        return nextStates;
      })(),
    ]);

    const effectiveChainId = chainId ?? 8217;
    const _cachePrefix = `aave:v3:${effectiveChainId}:${resolvedPool}`;

    // Use the params result from parallel execution
    const params = paramsResult;
    if (params) {
      setAaveParamsV3(params);
      // Build index by underlyingAsset (lowercased), handling tuple/array return shapes
      try {
        let root: unknown = params as unknown;
        if (
          typeof params === "object" &&
          params !== null &&
          "response" in (params as Record<string, unknown>)
        ) {
          root = (params as Record<string, unknown>).response as unknown;
        }
        let assetParams: unknown[] = [];
        if (
          typeof root === "object" &&
          root !== null &&
          "assetParams" in (root as Record<string, unknown>) &&
          Array.isArray((root as Record<string, unknown>).assetParams)
        ) {
          assetParams = (root as { assetParams: unknown[] }).assetParams;
        } else if (Array.isArray(root)) {
          const arr = root as unknown[];
          if (Array.isArray(arr[1])) assetParams = arr[1] as unknown[];
        }
        const idx: Record<string, unknown> = {};
        const getUnderlying = (p: unknown): string | undefined => {
          if (
            typeof p === "object" &&
            p !== null &&
            "underlyingAsset" in (p as Record<string, unknown>)
          ) {
            const v = (p as Record<string, unknown>).underlyingAsset;
            return typeof v === "string" ? v : undefined;
          }
          if (Array.isArray(p) && typeof (p as unknown[])[0] === "string") {
            return (p as unknown[])[0] as string;
          }
          return undefined;
        };
        for (const p of assetParams) {
          const addr = getUnderlying(p);
          if (addr) idx[addr.toLowerCase()] = p as Record<string, unknown>;
        }
        if (Object.keys(idx).length) setAaveParamsV3Index(idx);
      } catch {
        // ignore index build errors
      }
    }

    // Use the states result from parallel execution and add aToken/debtToken totalSupply data
    if (Object.keys(statesResult).length) {
      const combinedStates = { ...statesResult };

      // Fetch totalSupply for aTokens and debtTokens
      try {
        const rp =
          signer?.provider ??
          provider ??
          new ethers.JsonRpcProvider(KAIA_NETWORKS.mainnet.rpcUrl);
        const erc20Abi = ["function totalSupply() view returns (uint256)"];

        const aTokenPromises = ATOKEN_ASSETS.map(async (aTokenAddress) => {
          try {
            const aToken = new ethers.Contract(aTokenAddress, erc20Abi, rp);
            const totalSupply = await aToken.totalSupply();
            return { address: aTokenAddress.toLowerCase(), totalSupply };
          } catch (_error) {
            return { address: aTokenAddress.toLowerCase(), totalSupply: null };
          }
        });

        const debtTokenPromises = DEBT_TOKEN_ASSETS.map(
          async (debtTokenAddress) => {
            try {
              const debtToken = new ethers.Contract(
                debtTokenAddress,
                erc20Abi,
                rp
              );
              const totalSupply = await debtToken.totalSupply();
              return { address: debtTokenAddress.toLowerCase(), totalSupply };
            } catch (_error) {
              return {
                address: debtTokenAddress.toLowerCase(),
                totalSupply: null,
              };
            }
          }
        );

        const [aTokenResults, debtTokenResults] = await Promise.all([
          Promise.all(aTokenPromises),
          Promise.all(debtTokenPromises),
        ]);

        // Add totalSupply data to combinedStates
        [...aTokenResults, ...debtTokenResults].forEach(
          ({ address, totalSupply }) => {
            if (totalSupply !== null) {
              combinedStates[address] = { totalSupply };
            }
          }
        );
      } catch (_error) {
        // Silent error handling
      }

      setAaveStatesV3(combinedStates);
    }
  }, [
    cacheGet,
    cacheSet,
    chainId,
    getAaveContract,
    provider,
    // resolveAavePoolAddress,
    coerceAaveStateV3,
    signer?.provider,
  ]);

  const refreshAaveData = useCallback(async () => {
    await fetchAaveParamsAndStates();
  }, [fetchAaveParamsAndStates]);

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
    } catch (_error) {
      // Failed to switch to Kaia network
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
        } catch (_err) {
          // Failed to fetch balance
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
        // Wallet connection failed
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
      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAddress(accounts[0]);
          updateBalance(accounts[0]);
        }
      };

      const handleChainChanged = (...args: unknown[]) => {
        const chainIdHex = args[0] as string;
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

  // Fetch user's aToken and variableDebt balances for configured assets
  useEffect(() => {
    const run = async () => {
      if (!address) return;
      const assets = AAVE_ASSETS;

      const erc20Abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function totalSupply() view returns (uint256)",
      ];
      const results: Record<
        string,
        {
          aTokenAddress: string;
          variableDebtTokenAddress: string;
          aTokenBalance: string;
          variableDebtBalance: string;
        }
      > = {};

      await Promise.all(
        assets.map(async (asset) => {
          const key = asset.toLowerCase();
          const params = (
            aaveParamsV3Index as Record<
              string,
              {
                aTokenAddress: string;
                variableDebtTokenAddress: string;
                decimals?: number;
              }
            >
          )[key];
          if (!params) return;
          const aTokenAddress: string = params.aTokenAddress;
          const variableDebtTokenAddress: string =
            params.variableDebtTokenAddress;
          const decimalsNum: number = Number(params.decimals ?? 18);
          if (
            !ethers.isAddress(aTokenAddress) ||
            !ethers.isAddress(variableDebtTokenAddress)
          )
            return;
          try {
            const rp =
              signer ??
              provider ??
              new ethers.JsonRpcProvider(KAIA_NETWORKS.mainnet.rpcUrl);
            const aToken = new ethers.Contract(aTokenAddress, erc20Abi, rp);
            const vDebt = new ethers.Contract(
              variableDebtTokenAddress,
              erc20Abi,
              rp
            );
            const [aBal, vBal] = await Promise.all([
              aToken.balanceOf(address),
              vDebt.balanceOf(address),
            ]);
            results[key] = {
              aTokenAddress,
              variableDebtTokenAddress,
              aTokenBalance: ethers.formatUnits(aBal, decimalsNum),
              variableDebtBalance: ethers.formatUnits(vBal, decimalsNum),
            };
          } catch {
            // ignore per-asset errors
          }
        })
      );

      if (Object.keys(results).length) setAaveUserBalances(results);
    };
    run();
  }, [aaveParamsV3Index, address, provider, signer]);

  // Fetch Aave V3 params/state once per page load and set up 15-second interval
  useEffect(() => {
    if (!mounted) return;

    // Initial fetch
    fetchAaveParamsAndStates();

    // Set up 15-second interval for automatic refresh
    const interval = setInterval(async () => {
      if (!AAVE_CONFIG.FACET_ADDRESS || !AAVE_CONFIG.LENDING_POOL_V3) return;
      try {
        sessionStorage.removeItem("lastAaveFetch");
        await fetchAaveParamsAndStates();
      } catch (_error) {
        console.warn("Failed to refresh Aave data:", _error);
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [mounted, fetchAaveParamsAndStates]);

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
        } catch (_err) {
          // Auto-reconnect failed
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
    getTokenBalance,
    aaveParamsV3,
    aaveParamsV3Index,
    aaveStatesV3,
    aaveUserBalances,
    refreshAaveData,
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
