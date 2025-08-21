// Mock prices and market data
export const MOCK_PRICES = {
  COLLATERAL_PRICE: 0.99,
  DEBT_PRICE: 1.0,
  FLASHLOAN_PREMIUM: 0.0009, // 9 bps
  MAX_LTV: 0.8, // 80%
} as const;

// Default display values
export const DEFAULT_VALUES = {
  ORACLE_PRICE: "$0.99",
  MAX_LTV_DISPLAY: "88.00%",
  SLIPPAGE_TOLERANCE: "0.1%",
  GAS_FEE: "0 ETH",
  GAS_FEE_USD: "$0",
} as const;
