"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
  apy: number;
  borrowApy: number;
  utilizationRate: number;
}

interface UseMarketDataReturn {
  data: MarketData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: MarketData[];
}

// Simulated real-time data fetching with WebSocket-like updates
export function useMarketData(): UseMarketDataReturn {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Simulate fetching market data
  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock market data with realistic values
      const mockData: MarketData[] = [
        {
          symbol: "PT-USDe-25SEP2025",
          price: 0.99,
          change24h: 2.5,
          volume24h: 5440000,
          liquidity: 22840000,
          apy: 13.45,
          borrowApy: 9.9,
          utilizationRate: 73.5,
        },
        {
          symbol: "USDC",
          price: 1.0,
          change24h: 0.02,
          volume24h: 119260000,
          liquidity: 102500000,
          apy: 8.65,
          borrowApy: 6.2,
          utilizationRate: 68.3,
        },
        {
          symbol: "KAIA",
          price: 0.8,
          change24h: -1.23,
          volume24h: 45200000,
          liquidity: 89300000,
          apy: 15.2,
          borrowApy: 11.5,
          utilizationRate: 81.2,
        },
        {
          symbol: "wETH",
          price: 3200.5,
          change24h: 3.15,
          volume24h: 78900000,
          liquidity: 156700000,
          apy: 5.8,
          borrowApy: 4.2,
          utilizationRate: 62.1,
        },
        {
          symbol: "wBTC",
          price: 65432.1,
          change24h: 1.87,
          volume24h: 92300000,
          liquidity: 203400000,
          apy: 4.5,
          borrowApy: 3.1,
          utilizationRate: 58.9,
        },
      ];

      setData(mockData);
    } catch (err) {
      setError("Failed to fetch market data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Simulate real-time price updates
  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.002), // ±0.1% price change
          change24h: item.change24h + (Math.random() - 0.5) * 0.1,
          volume24h: item.volume24h * (1 + (Math.random() - 0.5) * 0.01),
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [data.length]);

  // Filter data based on search term
  const filteredData = debouncedSearchTerm
    ? data.filter((item) =>
        item.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : data;

  return {
    data,
    loading,
    error,
    refetch: fetchMarketData,
    searchTerm,
    setSearchTerm,
    filteredData,
  };
}

// Hook for fetching specific pool data
export function usePoolData(poolId: string) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoolData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock pool-specific data
        const poolData = {
          id: poolId,
          name: "PT-USDe-25SEP2025 / USDC",
          totalValueLocked: 22840000,
          volume24h: 5440000,
          fees24h: 16320,
          apy: 13.45,
          utilizationRate: 73.5,
          availableLiquidity: 6138000,
          totalBorrowed: 16702000,
          reserveFactor: 10,
          collateralFactor: 88,
          liquidationThreshold: 90,
          liquidationPenalty: 5,
          priceOracle: "0x1234...5678",
          lastUpdated: Date.now(),
        };

        setData(poolData);
      } catch (err) {
        setError("Failed to fetch pool data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (poolId) {
      fetchPoolData();
    }
  }, [poolId]);

  return { data, loading, error };
}

// Hook for user positions
export function useUserPositions(address: string | null) {
  const [positions, setPositions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!address) {
        setPositions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Mock user positions
        const userPositions = [
          {
            id: "pos-1",
            asset: "PT-USDe-25SEP2025",
            type: "supply",
            amount: 1000,
            value: 990,
            apy: 13.45,
            earned: 12.34,
          },
          {
            id: "pos-2",
            asset: "USDC",
            type: "borrow",
            amount: 500,
            value: 500,
            apy: 9.9,
            accrued: 4.95,
          },
        ];

        setPositions(userPositions);
      } catch (err) {
        setError("Failed to fetch positions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [address]);

  return { positions, loading, error };
}
