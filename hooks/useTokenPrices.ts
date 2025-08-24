import { useCallback, useEffect, useRef, useState } from "react";
import { TOKEN_ADDRESSES } from "@/constants/tokens";
import {
  createPriceMap,
  fetchTokenPrices,
  getPriceByAddress,
} from "@/lib/priceApi";

interface TokenPrices {
  [symbol: string]: number;
}

interface UseTokenPricesReturn {
  prices: TokenPrices;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getPriceBySymbol: (symbol: string) => number;
  getPriceByTokenAddress: (address: string) => number;
}

/**
 * Hook to fetch and manage token prices from the price API
 * Maps TOKEN_ADDRESSES to their current prices
 */
export function useTokenPrices(): UseTokenPricesReturn {
  const [prices, setPrices] = useState<TokenPrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceMap, setPriceMap] = useState<Map<string, number>>(new Map());
  const isFetchingRef = useRef(false);

  const fetchPrices = useCallback(async () => {
    // Prevent concurrent calls using ref
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      const priceData = await fetchTokenPrices();
      const newPriceMap = createPriceMap(priceData);
      setPriceMap(newPriceMap);

      // Map token symbols to prices using TOKEN_ADDRESSES
      const symbolPrices: TokenPrices = {};

      for (const [symbol, address] of Object.entries(TOKEN_ADDRESSES)) {
        const price = getPriceByAddress(priceData, address);
        symbolPrices[symbol] = price;
      }

      setPrices(symbolPrices);
    } catch (err) {
      setError("Failed to fetch token prices");
      // Set fallback prices if API fails
      setPrices({
        WKAIA: 0.14,
        USDC: 1.0,
        "USD₮": 1.0,
        USDT0: 1.0,
        USDT: 1.0,
      });
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial fetch and setup 15-second interval
  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Set up interval for subsequent fetches
    const interval = setInterval(fetchPrices, 15000); // 15 seconds
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const getPriceBySymbol = useCallback(
    (symbol: string): number => {
      return prices[symbol] || 0;
    },
    [prices]
  );

  const getPriceByTokenAddress = useCallback(
    (address: string): number => {
      return priceMap.get(address.toLowerCase()) || 0;
    },
    [priceMap]
  );

  return {
    prices,
    loading,
    error,
    refetch: fetchPrices,
    getPriceBySymbol,
    getPriceByTokenAddress,
  };
}

/**
 * Hook to get prices for a specific trading pair
 */
export function usePairPrices(collateralSymbol: string, debtSymbol: string) {
  const { prices, loading, error, getPriceBySymbol } = useTokenPrices();

  const collateralPrice = getPriceBySymbol(collateralSymbol);
  const debtPrice = getPriceBySymbol(debtSymbol);

  return {
    collateralPrice,
    debtPrice,
    loading,
    error,
    isReady: !loading && collateralPrice > 0 && debtPrice > 0,
  };
}
