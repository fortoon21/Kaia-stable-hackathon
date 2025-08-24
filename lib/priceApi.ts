interface PriceResponse {
  result: Array<{
    tokenAddress: string;
    price: string;
    quoteToken: string;
  }>;
}

// interface TokenPrice {
//   address: string;
//   price: number;
//   symbol?: string;
// }

// Mock price data for TOKEN_ADDRESSES (will be updated with real data)
const CACHED_PRICE_DATA: PriceResponse = {
  result: [
    {
      tokenAddress: "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432", // WKAIA
      price: "0.1400000",
      quoteToken: "USD",
    },
    {
      tokenAddress: "0x608792deb376cce1c9fa4d0e6b7b44f507cffa6a", // USDC
      price: "1.0000000",
      quoteToken: "USD",
    },
    {
      tokenAddress: "0xd077a400968890eacc75cdc901f0356c943e4fdb", // USD₮/USDT
      price: "1.0000000",
      quoteToken: "USD",
    },
    {
      tokenAddress: "0x5c13e303a62fc5dedf5b52d66873f2e59fedadc2", // USDT0
      price: "1.0000000",
      quoteToken: "USD",
    },
  ],
};

/**
 * Fetches token prices from the price API
 * Updates cached data on success, falls back to cache on error
 */
export async function fetchTokenPrices(): Promise<PriceResponse> {
  try {
    const response = await fetch(
      "https://api.hetz-01.eisenfinance.com/v1/chains/8217/v2/prices"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const freshData = await response.json();

    // Update cache with fresh data
    Object.assign(CACHED_PRICE_DATA, freshData);
    return freshData;
  } catch (error) {
    console.warn("Price API failed, using cached data:", error);
    // Fallback to cached data on error (acts as offline cache)
    return CACHED_PRICE_DATA;
  }
}

/**
 * Gets the current cached price data without making a network request
 */
export function getCachedPrices(): PriceResponse {
  return CACHED_PRICE_DATA;
}

/**
 * Gets price for a specific token address
 */
export function getPriceByAddress(
  priceData: PriceResponse,
  tokenAddress: string
): number {
  const tokenPrice = priceData.result.find(
    (item) => item.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
  );

  return tokenPrice ? parseFloat(tokenPrice.price) : 0;
}

/**
 * Creates a price map from token addresses to prices
 */
export function createPriceMap(priceData: PriceResponse): Map<string, number> {
  const priceMap = new Map<string, number>();

  for (const item of priceData.result) {
    priceMap.set(item.tokenAddress.toLowerCase(), parseFloat(item.price));
  }

  return priceMap;
}

/**
 * Gets prices for multiple token addresses
 */
export function getPricesByAddresses(
  priceData: PriceResponse,
  addresses: string[]
): Record<string, number> {
  const prices: Record<string, number> = {};

  for (const address of addresses) {
    prices[address] = getPriceByAddress(priceData, address);
  }

  return prices;
}
