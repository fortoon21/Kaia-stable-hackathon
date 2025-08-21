// Kaia token contract addresses
export const TOKEN_ADDRESSES = {
  WKAIA: "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432",
  USDC: "0x608792deb376cce1c9fa4d0356c943e4fdb",
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
