# TGIF — DeFi Lending and Leverage on Kaia

A Next.js frontend for exploring lending markets and leveraged positions on the Kaia network. It surfaces Aave V3 market data, token prices, and a leverage calculator, with a modern UI and wallet connectivity.

## Tech stack

- **Framework**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: ethers v6
- **Quality**: Biome (lint/format), Vitest

---

## Quick start

### Prerequisites

- Node.js 20+
- Yarn or npm

### Install and run

```bash
# install deps
yarn

# local dev
yarn dev

# production build & start
yarn build && yarn start

# quality
yarn lint        # check
yarn lint:fix    # fix
yarn format      # format only

# tests
yarn test        # run once
yarn test:watch  # watch
```

---

## Project structure

```text
app/                     # Next.js app router entry (layout, page)
components/              # UI and feature components
  lending/               # Lending page subcomponents
  markets/               # Markets page subcomponents
  ui/                    # Reusable UI primitives
constants/               # Config, addresses, design tokens, mock data
contracts/               # Solidity interfaces/mocks (reference/testing)
hooks/                   # React hooks (data, calculations, UX)
lib/                     # Web3 provider, pricing API, leverage logic
public/                  # Static assets
types/                   # Shared TypeScript types
utils/                   # Formatters and helpers
```

---

## Runtime architecture (high level)

- **Pages**

  - `app/layout.tsx`: sets fonts, global styles, wraps app with `Web3Provider`, error boundary, and toasts.
  - `app/page.tsx`: app shell with navigation, network warning, and routed content for Markets, Lending, and Repay. Persists view and selection via `localStorage`.

- **State & data providers**

  - `lib/web3Provider.tsx`:
    - Manages wallet connection (MetaMask/Rabby/Kaia), `provider/signer/address/chainId/balance`.
    - Normalizes and caches Aave V3 pool params and per-asset state in `localStorage` (5 min TTL) and refreshes every 15s.
    - Exposes `useWeb3()` with:
      - `provider`, `signer`, `address`, `chainId`, `balance`, `isConnected`, `isConnecting`, `error`
      - `connectWallet(walletType)`, `disconnectWallet()`, `switchNetwork(chainId)`
      - `getTokenBalance(tokenAddress, decimals)`
      - Aave data: `aaveParamsV3`, `aaveParamsV3Index`, `aaveStatesV3`, `aaveUserBalances`, `refreshAaveData()`
    - Forces/assists network to Kaia Mainnet (8217) when needed.
  - `hooks/useTokenPrices.ts` + `lib/priceApi.ts`:
    - Polls Eisen price API every 15s, falls back to cached data on failure.
    - Maps `TOKEN_ADDRESSES` to symbol prices and exposes `useTokenPrices()` and `usePairPrices()`.

- **Feature flows**
  - Markets: `components/Markets.tsx` shows grouped trading pairs (from `constants/marketData`) with live stats sourced from `useAaveData()` and price hooks. Selecting a pair moves to Lending.
  - Lending: `components/Lending.tsx` renders header, stats, trading panel, and tabs. Calculations are provided by `useLeverageCalculations()`.
  - Repay: `components/Repay.tsx` uses stored selection from Markets and wallet state.

---

## Key modules and exports

### Components (selected)

- `components/Navigation.tsx` — app nav and page switching.
- `components/NetworkWarning.tsx` — displays network prompts for Kaia.
- `components/Markets.tsx` — main markets view with group accordion and pair rows.
- `components/Lending.tsx` — lending workspace with stats and trading panel.
- `components/Repay.tsx` — repay flow entry.
- `components/WalletConnectorV2.tsx` — wallet connect UI.
- UI primitives (`components/ui/*`):
  - `ErrorBoundary` (class component)
  - `Toast` (`ToastContainer`, `showToast`)
  - `StatsCard`, `DataDisplay`, `NumberInput`, `Slider`, `LoadingSpinner`, `Icons`

### Hooks

- `hooks/useAaveData.ts`

  - `getSupplyAPY(collateralSymbol): string | null`
  - `getBorrowAPY(debtSymbol): string | null`
  - `getLTV(collateralSymbol): string | null`
  - `getLLTV(collateralSymbol): string | null`
  - `getLiquidity(debtSymbol): { amount: string | null; usdValue: string | null }`
  - `getTotalLiquidity(): { totalUSD: string | null; hasData: boolean }`
  - `getFlashloanPremium(): string | null` // decimal, e.g. "0.0009"
  - `getMaxROE(collateralSymbol, debtSymbol): string | null`
  - `getTotalSupply(tokenSymbol)`, `getTotalBorrowed(tokenSymbol)`

- `hooks/useLeverageCalculations.ts`

  - `useLeverageCalculations(selectedPair, collateralAmount, multiplier)` →
    `{ maxLeverage, leveragePosition, isReady, collateralPrice, debtPrice }`
    - Internals: `calculateMaxLeverage`, `calculateLeverageParams` from `lib/leverage` and prices from `usePairPrices()`.

- `hooks/useMarketData.ts`

  - `useMarketData()` — mock market table data with search and live-ish updates.
  - `usePoolData(poolId)` — mock single-pool fetcher.
  - `useUserPositions(address)` — mock user positions.

- `hooks/useTokenPrices.ts`

  - `useTokenPrices()` — price polling with symbol map and helpers.
  - `usePairPrices(collateralSymbol, debtSymbol)` — per-pair prices and ready flag.

- `hooks/useTokenBalance.ts` — wallet token balance by address via `ethers`.
- `hooks/useResponsive.ts` — responsive flags and media query hook.
- `hooks/useDebounce.ts` — debounces a changing value.

### Library

- `lib/web3Provider.tsx`

  - `Web3Provider({ children })` — context provider (see architecture above).
  - `useWeb3()` — context hook.

- `lib/leverage.ts`

  - `calculateMaxLeverage(params): number` — max multiplier cap (≤ 25).
  - `calculateLeverageParams(params): { flashloanAmount, ltv, collateralAmount, debtAmount }`
  - `calculateCurrentLTV({ collateralAmount, debtAmount, priceOfCollateral, priceOfDebt }): number`
  - `computeMaxROE({ supplyAPY, borrowAPY, flashloanPremium, maxLTV, maxMultiplier? }): number`

- `lib/leverageHelpers.ts`

  - `ensureCollateralApproval({ signer, address, collateralUnderlying, loopAddress, collAmtWei })`
  - `ensureBorrowDelegation({ signer, address, variableDebtAsset, loopAddress, flashloanAmtWei, flBps })`
  - `ensureCollateralEnabled({ signer, address, poolAddress, collateralUnderlying, reserveId })`
  - `calculateLeverageAmounts(params)` — convenience wrapper combining max and target calculations.
  - `resolvePoolAddress(addressesProvider): string`
  - `getDragonSwapPool(symbol): string`

- `lib/eisen.ts`

  - `encodeBorrowToCollateralSwap(params): Promise<{ encoded: string }>` — fetches Eisen router-encoded tx data (quote API).

- `lib/priceApi.ts`

  - `fetchTokenPrices(): Promise<PriceResponse>` — polls remote, falls back to cache.
  - `getCachedPrices()`
  - `getPriceByAddress(priceData, address): number`
  - `createPriceMap(priceData): Map<string, number>`
  - `getPricesByAddresses(priceData, addresses): Record<string, number>`

- `lib/validations.ts`
  - `validations` object and helpers `validateField`, `validateForm`, plus schemas like `tradingFormSchema`, `walletFormSchema`.

### Constants

- `constants/tokens.ts`

  - `TOKEN_ADDRESSES`, `TOKEN_DECIMALS`
  - Aave config: `AAVE_CONFIG.FACET_ADDRESS`, `AAVE_CONFIG.LENDING_POOL_V3`
  - Loop contract: `LOOP_CONFIG.LEVERAGE_LOOP_ADDRESS`
  - Eisen: `EISEN_CONFIG.EISEN_API_KEY` (presently in-source; move to server or env for production)
  - Aave asset lists: `AAVE_ASSETS`, `ATOKEN_ASSETS`, `DEBT_TOKEN_ASSETS`
  - `DRAGON_SWAP_POOLS`

- `constants/layout.ts` — sizing and background constants used throughout the UI.
- `constants/marketData.ts` — `MARKET_GROUPS` and asset images map used by Markets view.
- `constants/uiConstants.ts` — design tokens (colors, spacing, z-index, etc.).
- `constants/networks.ts` — chain metadata and helpers.

### Utilities

- `utils/formatters.ts` — number/fiat/token formatting helpers (e.g., `formatDollarAmount`, `formatPercentage`, `formatAPY`, `formatMultiplier`).
- `utils/aaveFormatters.ts` — Aave-specific conversions (e.g., `toPercentFromRay`, `toPercentFromBps`, `formatLiquidity`, `formatUsdValue`).
- `utils/tokenHelpers.ts` — `getTokenAddress(symbol)` for configured tokens.

### Types

- `types/lending.ts` — lending UI types (`LendingProps`, `TradingPair`, `MarketGroup`, etc.).
- `types/wallet.ts` — wallet-related types.

### Contracts (reference)

- `contracts/` includes interfaces and mock contracts used for integration and reference. The frontend does not compile these; they exist for clarity/testing.

---

## Configuration and environment

- Network: Kaia Mainnet (chainId 8217) is the primary target. The app gently assists switching via wallet RPC methods.
- External services:
  - Eisen public price API: used by `lib/priceApi.ts`.
  - Eisen quote API: used by `lib/eisen.ts` to retrieve encoded router calldata.
- API keys: `EISEN_API_KEY` is currently hardcoded in `constants/tokens.ts` for convenience. For production, move this to a secure backend or runtime env var and proxy requests server-side.

---

## Development notes

- Data freshness: Aave params/state are cached for 5 minutes and refreshed every 15 seconds in the background for a responsive UI with limited RPC load.
- Persistence: The selected page and lending pair are stored in `localStorage` to provide a smoother UX across reloads.
- Accessibility: Buttons and interactive rows have keyboard handling where relevant; UI primitives should be extended for full accessibility coverage in production.

---

## License

MIT
