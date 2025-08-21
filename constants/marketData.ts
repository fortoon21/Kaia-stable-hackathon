// Market data constants for the Markets component
import type { MarketGroup } from "@/types/lending";

export const MARKET_GROUPS: MarketGroup[] = [
  {
    name: "WKAIA Markets",
    tradingPairs: [
      {
        collateralAsset: {
          asset: "WKAIA",
          symbol: "WKAIA",
          icon: "W",
          iconBg: "#00D4FF",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
        },
        debtAsset: {
          asset: "USDT",
          symbol: "USDT",
          icon: "₮",
          iconBg: "#26A17B",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
        },
        supplyAPY: "8.83%",
        borrowAPY: "5.40%",
        maxROE: "39.65%",
        maxMultiplier: "9.98x",
        lltv: "91.00%",
        liquidity: "$506,685.97",
        liquidityAmount: "506,685.97",
        liquidityToken: "USDT",
      },
      {
        collateralAsset: {
          asset: "WKAIA",
          symbol: "WKAIA",
          icon: "W",
          iconBg: "#00D4FF",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
        },
        debtAsset: {
          asset: "USDC",
          symbol: "USDC",
          icon: "$",
          iconBg: "#2775CA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
        },
        supplyAPY: "7.25%",
        borrowAPY: "4.80%",
        maxROE: "35.20%",
        maxMultiplier: "8.50x",
        lltv: "89.00%",
        liquidity: "$423,542.18",
        liquidityAmount: "423,542.18",
        liquidityToken: "USDC",
      },
      {
        collateralAsset: {
          asset: "WKAIA",
          symbol: "WKAIA",
          icon: "W",
          iconBg: "#00D4FF",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
        },
        debtAsset: {
          asset: "USDT0",
          symbol: "USDT0",
          icon: "₮",
          iconBg: "#627EEA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
        },
        supplyAPY: "6.95%",
        borrowAPY: "4.20%",
        maxROE: "28.40%",
        maxMultiplier: "7.80x",
        lltv: "87.20%",
        liquidity: "$298,765.43",
        liquidityAmount: "298,765.43",
        liquidityToken: "USDT0",
      },
    ],
  },
  {
    name: "USDT Markets",
    tradingPairs: [
      {
        collateralAsset: {
          asset: "USDT",
          symbol: "USDT",
          icon: "₮",
          iconBg: "#26A17B",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
        },
        debtAsset: {
          asset: "WKAIA",
          symbol: "WKAIA",
          icon: "W",
          iconBg: "#00D4FF",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
        },
        supplyAPY: "9.79%",
        borrowAPY: "5.86%",
        maxROE: "31.98%",
        maxMultiplier: "6.65x",
        lltv: "87.50%",
        liquidity: "$18,316.52",
        liquidityAmount: "18,316.52",
        liquidityToken: "KAIA",
      },
      {
        collateralAsset: {
          asset: "USDT",
          symbol: "USDT",
          icon: "₮",
          iconBg: "#26A17B",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
        },
        debtAsset: {
          asset: "USDC",
          symbol: "USDC",
          icon: "$",
          iconBg: "#2775CA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
        },
        supplyAPY: "5.22%",
        borrowAPY: "0.07%",
        maxROE: "23.37%",
        maxMultiplier: "4.53x",
        lltv: "80.00%",
        liquidity: "$762,336.45",
        liquidityAmount: "762,336.45",
        liquidityToken: "USDC",
      },
      {
        collateralAsset: {
          asset: "USDT",
          symbol: "USDT",
          icon: "₮",
          iconBg: "#26A17B",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
        },
        debtAsset: {
          asset: "USDT0",
          symbol: "USDT0",
          icon: "₮",
          iconBg: "#627EEA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
        },
        supplyAPY: "4.61%",
        borrowAPY: "1.65%",
        maxROE: "21.33%",
        maxMultiplier: "6.65x",
        lltv: "90.00%",
        liquidity: "$1.09M",
        liquidityAmount: "252.55",
        liquidityToken: "USDT0",
      },
    ],
  },
  {
    name: "USDC Markets",
    tradingPairs: [
      {
        collateralAsset: {
          asset: "USDC",
          symbol: "USDC",
          icon: "$",
          iconBg: "#2775CA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
        },
        debtAsset: {
          asset: "WKAIA",
          symbol: "WKAIA",
          icon: "W",
          iconBg: "#00D4FF",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
        },
        supplyAPY: "9.79%",
        borrowAPY: "5.84%",
        maxROE: "28.32%",
        maxMultiplier: "5.69x",
        lltv: "87.50%",
        liquidity: "$5,491.33",
        liquidityAmount: "5,491.88",
        liquidityToken: "KAIA",
      },
      {
        collateralAsset: {
          asset: "USDC",
          symbol: "USDC",
          icon: "$",
          iconBg: "#2775CA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
        },
        debtAsset: {
          asset: "USDT",
          symbol: "USDT",
          icon: "₮",
          iconBg: "#26A17B",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
        },
        supplyAPY: "5.22%",
        borrowAPY: "0.15%",
        maxROE: "23.11%",
        maxMultiplier: "4.53x",
        lltv: "80.00%",
        liquidity: "$1.03M",
        liquidityAmount: "9,076.238",
        liquidityToken: "USDT",
      },
      {
        collateralAsset: {
          asset: "USDC",
          symbol: "USDC",
          icon: "$",
          iconBg: "#2775CA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
        },
        debtAsset: {
          asset: "USDT0",
          symbol: "USDT0",
          icon: "₮",
          iconBg: "#627EEA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
        },
        supplyAPY: "4.14%",
        borrowAPY: "0.07%",
        maxROE: "18.48%",
        maxMultiplier: "4.53x",
        lltv: "80.00%",
        liquidity: "$762,336.45",
        liquidityAmount: "6.691823",
        liquidityToken: "USDT0",
      },
    ],
  },
  {
    name: "USDT0 Markets",
    tradingPairs: [
      {
        collateralAsset: {
          asset: "USDT (Portal)",
          symbol: "USDT0",
          icon: "₮",
          iconBg: "#627EEA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
        },
        debtAsset: {
          asset: "WKAIA",
          symbol: "WKAIA",
          icon: "W",
          iconBg: "#00D4FF",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
        },
        supplyAPY: "7.83%",
        borrowAPY: "4.25%",
        maxROE: "26.65%",
        maxMultiplier: "7.20x",
        lltv: "86.10%",
        liquidity: "$145,623.21",
        liquidityAmount: "145,623.21",
        liquidityToken: "KAIA",
      },
      {
        collateralAsset: {
          asset: "USDT (Portal)",
          symbol: "USDT0",
          icon: "₮",
          iconBg: "#627EEA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
        },
        debtAsset: {
          asset: "USDT",
          symbol: "USDT",
          icon: "₮",
          iconBg: "#26A17B",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
        },
        supplyAPY: "6.42%",
        borrowAPY: "2.15%",
        maxROE: "22.85%",
        maxMultiplier: "5.80x",
        lltv: "82.70%",
        liquidity: "$89,743.56",
        liquidityAmount: "89,743.56",
        liquidityToken: "USDT",
      },
      {
        collateralAsset: {
          asset: "USDT (Portal)",
          symbol: "USDT0",
          icon: "₮",
          iconBg: "#627EEA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
        },
        debtAsset: {
          asset: "USDC",
          symbol: "USDC",
          icon: "$",
          iconBg: "#2775CA",
          protocol: "Avalon Finance",
          imageUrl:
            "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
        },
        supplyAPY: "5.95%",
        borrowAPY: "1.85%",
        maxROE: "20.12%",
        maxMultiplier: "5.25x",
        lltv: "81.00%",
        liquidity: "$124,892.33",
        liquidityAmount: "124,892.33",
        liquidityToken: "USDC",
      },
    ],
  },
];

// Asset image mapping for market headers
export const MARKET_ASSET_IMAGES: { [key: string]: string } = {
  "WKAIA Markets":
    "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
  "KAIA Markets":
    "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
  "USDT Markets":
    "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
  "USDC Markets":
    "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
  "USDT0 Markets":
    "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt0.png",
};
