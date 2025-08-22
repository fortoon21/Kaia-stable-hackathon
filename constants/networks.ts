// Network configuration constants

export interface NetworkInfo {
  name: string;
  logo: string;
  symbol: string;
  bgColor: string;
}

export const NETWORK_CONFIG: { [chainId: number]: NetworkInfo } = {
  8217: {
    // Kaia Mainnet
    name: "Kaia",
    logo: "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
    symbol: "K",
    bgColor: "bg-[#2ae5b9]",
  },
};

export function getNetworkInfo(chainId: number | null): NetworkInfo {
  if (chainId && NETWORK_CONFIG[chainId]) {
    return NETWORK_CONFIG[chainId];
  }
  // Default to Kaia if unknown
  return NETWORK_CONFIG[8217];
}

export function getNetworkName(chainId: number | null): string {
  const networkInfo = getNetworkInfo(chainId);
  return networkInfo.name;
}

export function getNetworkColor(chainId: number | null): string {
  if (chainId && NETWORK_CONFIG[chainId]) {
    return NETWORK_CONFIG[chainId].bgColor;
  }
  // Handle specific cases and defaults
  switch (chainId) {
    case 8217:
    case 1001:
      return "bg-[#2ae5b9]";
    case 1:
      return "bg-blue-500";
    case 137:
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}
