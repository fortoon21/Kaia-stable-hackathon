// Mock data types
export interface StablecoinFixedItem {
  symbol: string;
  days: string;
  apy: string;
}

export interface StablecoinNewItem {
  symbol: string;
  days: string;
  volume: string;
}

export interface TrendingItem {
  symbol: string;
  days: string;
  apy: string;
}

export interface MarketTableItem {
  symbol: string;
  description: string;
  color: string;
  liquidity: string;
  liquidityDetail: string;
  volume24h: string;
  ytYield: string;
  ptFixed: string;
  markets?: string;
  totalLiquidity?: string;
  ytPercentage?: string;
  ptPercentage?: string;
}

export interface MockMarketsData {
  stablecoinFixed: StablecoinFixedItem[];
  stablecoinNew: StablecoinNewItem[];
  trending: TrendingItem[];
  marketsTable: MarketTableItem[];
}

// Mock Markets Data
export const mockMarketsData: MockMarketsData = {
  stablecoinFixed: [
    {
      symbol: "emsUSD",
      days: "11 days",
      apy: "22.5%",
    },
    {
      symbol: "sigmaSP",
      days: "35 days",
      apy: "19.46%",
    },
    {
      symbol: "sYUSD",
      days: "6 days",
      apy: "18.42%",
    },
  ],
  stablecoinNew: [
    {
      symbol: "pUSDe",
      days: "37 days",
      volume: "$4,585,133",
    },
    {
      symbol: "eUSDe",
      days: "59 days",
      volume: "$396,475",
    },
    {
      symbol: "ABJUSDC",
      days: "73 days",
      volume: "$304,664",
    },
  ],
  trending: [
    {
      symbol: "eUSDe",
      days: "59 days",
      apy: "8.86%",
    },
    {
      symbol: "pUSDe",
      days: "37 days",
      apy: "14.92%",
    },
    {
      symbol: "eUSDC",
      days: "32 days",
      apy: "11.7%",
    },
  ],
  marketsTable: [
    {
      symbol: "USDe",
      description: "27 Nov 2025 (58 days)",
      color: "#f59e0b",
      liquidity: "$5.53M",
      liquidityDetail: "$14.44M",
      volume24h: "$5.44M",
      ytYield: "33%",
      ptFixed: "10.07%",
      markets: "3",
      totalLiquidity: "Total LTV",
      ytPercentage: "33%",
      ptPercentage: "10.07%",
    },
    {
      symbol: "USDe",
      description: "27 Sep 2025 (36 days)",
      color: "#f59e0b",
      liquidity: "$37.60M",
      liquidityDetail: "",
      volume24h: "",
      ytYield: "33%",
      ptFixed: "13.63%",
    },
    {
      symbol: "USDe",
      description: "3 Markets",
      color: "#10b981",
      liquidity: "$145.90M",
      liquidityDetail: "$230.13M",
      volume24h: "$5.44M",
      ytYield: "-74.85%",
      ptFixed: "13.04%",
      markets: "3",
      totalLiquidity: "Total LTV",
      ytPercentage: "-74.85%",
      ptPercentage: "13.04%",
    },
    {
      symbol: "MYPE",
      description: "2 Markets",
      color: "#8b5cf6",
      liquidity: "$179.00M",
      liquidityDetail: "$546.67M",
      volume24h: "$48.07M",
      ytYield: "-97.84%",
      ptFixed: "18.62%",
      markets: "2",
      totalLiquidity: "Total LTV",
      ytPercentage: "-97.84%",
      ptPercentage: "18.62%",
    },
    {
      symbol: "USDT",
      description: "Open Eden",
      color: "#06b6d4",
      liquidity: "$376.97M",
      liquidityDetail: "$224.33M",
      volume24h: "$6.44M",
      ytYield: "-95.80%",
      ptFixed: "11.7%",
    },
    {
      symbol: "USDe",
      description: "Terminal",
      color: "#f59e0b",
      liquidity: "$94.36M",
      liquidityDetail: "$203.86M",
      volume24h: "$11.61M",
      ytYield: "-100%",
      ptFixed: "14.31%",
    },
    {
      symbol: "USDf",
      description: "Gearbox Finance",
      color: "#ef4444",
      liquidity: "$54.31M",
      liquidityDetail: "$174.37M",
      volume24h: "$13.77M",
      ytYield: "-99.92%",
      ptFixed: "16.81%",
    },
    {
      symbol: "sYnusUSDC",
      description: "2 Markets",
      color: "#f97316",
      liquidity: "$10.14M",
      liquidityDetail: "",
      volume24h: "$320,575",
      ytYield: "-7.01%",
      ptFixed: "9.5%",
      markets: "2",
    },
    {
      symbol: "eUSDe",
      description: "Strata",
      color: "#06b6d4",
      liquidity: "$47.41M",
      liquidityDetail: "$94.70M",
      volume24h: "$4.58M",
      ytYield: "-100%",
      ptFixed: "14.92%",
    },
    {
      symbol: "USR",
      description: "Vector",
      color: "#64748b",
      liquidity: "$69.36M",
      liquidityDetail: "$130.37M",
      volume24h: "$193,452",
      ytYield: "-99.95%",
      ptFixed: "11.05%",
    },
    {
      symbol: "omBTC",
      description: "Bedrock",
      color: "#a855f7",
      liquidity: "$90.21M",
      liquidityDetail: "$99.83M",
      volume24h: "$0",
      ytYield: "-100%",
      ptFixed: "1.21%",
    },
  ],
};

// Mock API functions for other parts of the app
export const mockApi = {
  // Get pool data for Page 1
  getPoolData: async (_poolId: string) => {
    return {
      liquidity: "$22.84M",
      maxMultiplier: "8.31x",
      maxROE: "39.41%",
      oraclePrice: "$0.99",
      supplyAPY: "13.45%",
      borrowAPY: "9.90%",
      maxLTV: "88.00%",
      LLTV: "90.00%",
      correlatedAssets: true,
    };
  },

  // Get user wallet data
  getUserWalletData: async (_address: string) => {
    return {
      balance: "1,234.56 KAIA",
      usdValue: "$987.65",
      positions: [
        {
          asset: "PT-USDe-25SEP2025",
          amount: "0",
          value: "$0",
        },
        {
          asset: "USDC",
          amount: "0",
          value: "$0",
        },
      ],
    };
  },

  // Get transaction history
  getTransactionHistory: async (_address: string) => {
    return [
      {
        id: "0x123...abc",
        type: "Multiply",
        asset: "PT-USDe-25SEP2025",
        amount: "100",
        timestamp: Date.now() - 3600000, // 1 hour ago
        status: "completed",
      },
      {
        id: "0x456...def",
        type: "Borrow",
        asset: "USDC",
        amount: "50",
        timestamp: Date.now() - 7200000, // 2 hours ago
        status: "completed",
      },
    ];
  },

  // Get gas estimates
  getGasEstimate: async (_txType: string) => {
    return {
      gasPrice: "20 gwei",
      gasLimit: "150,000",
      estimatedCost: "0.003 ETH",
      usdCost: "$7.50",
    };
  },

  // Get market prices
  getMarketPrices: async () => {
    return {
      "PT-USDe-25SEP2025": {
        price: 0.99,
        change24h: 0.12,
        volume24h: "5.44M",
      },
      USDC: {
        price: 1.0,
        change24h: 0.0,
        volume24h: "119.26M",
      },
      KAIA: {
        price: 0.8,
        change24h: 2.5,
        volume24h: "45.2M",
      },
    };
  },
};

// Helper functions for formatting
export const formatCurrency = (
  amount: number,
  decimals: number = 2
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (num: number, decimals: number = 2): string => {
  return `${formatNumber(num, decimals)}%`;
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toString();
};
