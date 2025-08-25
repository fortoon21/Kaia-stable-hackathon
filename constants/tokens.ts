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

export const LOOP_CONFIG = {
  LEVERAGE_LOOP_ADDRESS: "0xB44c7C7c5254Ce9e16ff2bCe45dC83d6114355DC",
} as const;

export const EISEN_CONFIG = {
  EISEN_API_KEY: "ZWlzZW5fYmE3MGU5N2ItMDAxMy00NDE5LWJjN2MtZmU2NWIwMjFjMGVm",
} as const;

// aToken and debtToken addresses
export const ATOKEN_ADDRESSES = {
  WKAIA: "0x75879754040101f831ccbf13b3d5a785612051cb", // aKLAYWKLAY
  USDT: "0x03d111e76c70e5003f0e30dc732aa1bab1ea119d", // aKLAYUSD₮
  USDT0: "0xf79305376841810112d1a37ba4d1f6fe5fd610ec", // aKLAYUSDT
  USDC: "0x9503482f84b07b487b6001433d2f2f685769e8b9", // aKLAYUSDC
} as const;

export const DEBT_TOKEN_ADDRESSES = {
  WKAIA: "0xada27a9e7fc5e5256adf1225bc94e30973fac274", // variableDebtKLAYWKLAY
  USDT: "0x3a5724329f807eef8f2a069e66c9aa34982afbec", // variableDebtKLAYUSD₮
  USDT0: "0xa9f23143c38fbfb2fa299b604a2402bab1e541fc", // variableDebtKLAYUSDT
  USDC: "0x4880c4b5a3d83965c78faed3373154610b39046b", // variableDebtKLAYUSDC
} as const;

export const DRAGON_SWAP_POOLS = {
  WKAIA: "0xb64ba987ed3bd9808dbcc19ee3c2a3c79a977e66",
  USDT: "0xe6face64967c6cdd53651d6ac97a04bc9ef305d6",
  USDT0: "0xa53048153de2b74f92a8636bce1349192c58d1a1",
  USDC: "0x2d30da704c03f11de0255543476acc9e1322a1f5",
} as const;

// Generate Aave assets list from TOKEN_ADDRESSES (original tokens only)
export const AAVE_ASSETS = [
  TOKEN_ADDRESSES.WKAIA,
  TOKEN_ADDRESSES.USDT0,
  TOKEN_ADDRESSES.USDC,
  TOKEN_ADDRESSES.USDT,
] as const;

// Separate arrays for aTokens and debtTokens that need totalSupply() calls
export const ATOKEN_ASSETS = [
  ATOKEN_ADDRESSES.WKAIA,
  ATOKEN_ADDRESSES.USDT,
  ATOKEN_ADDRESSES.USDT0,
  ATOKEN_ADDRESSES.USDC,
] as const;

export const DEBT_TOKEN_ASSETS = [
  DEBT_TOKEN_ADDRESSES.WKAIA,
  DEBT_TOKEN_ADDRESSES.USDT,
  DEBT_TOKEN_ADDRESSES.USDT0,
  DEBT_TOKEN_ADDRESSES.USDC,
] as const;
