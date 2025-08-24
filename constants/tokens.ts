// Kaia token contract addresses
export const TOKEN_ADDRESSES = {
  WKAIA: "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432",
  USDC: "0x608792deb376cce1c9fa4d0e6b7b44f507cffa6a", // Actual Kaia USDC address
  "USD₮": "0xd077a400968890eacc75cdc901f0356c943e4fdb",
  USDT0: "0x5c13e303a62fc5dedf5b52d66873f2e59fedadc2",
  USDT: "0xd077a400968890eacc75cdc901f0356c943e4fdb",
} as const;

export const TOKEN_DECIMALS: { [key: string]: number } = {
  WKAIA: 18,
  USDC: 6,
  "USD₮": 6,
  USDT0: 6,
  USDT: 6,
};

// Aave V3 configuration
export const AAVE_CONFIG = {
  FACET_ADDRESS: "0xE661BE01F9e42Dc3Ed93909aA3c559A36187300d",
  LENDING_POOL_V3: "0xcf1af042f2a071df60a64ed4bdc9c7dee40780be",
} as const;

// Generate Aave assets list from TOKEN_ADDRESSES
export const AAVE_ASSETS = [
  TOKEN_ADDRESSES.WKAIA,
  TOKEN_ADDRESSES.USDT0,
  TOKEN_ADDRESSES.USDC,
  TOKEN_ADDRESSES.USDT,
] as const;
