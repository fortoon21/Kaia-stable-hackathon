// Wallet-related type definitions

export interface WalletProvider {
  isMetaMask?: boolean;
  isRabby?: boolean;
  isCoinbaseWallet?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  enable?: () => Promise<string[]>;
  selectedAddress?: string;
  chainId?: string;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    handler: (...args: unknown[]) => void
  ) => void;
}

export interface KlaytnProvider {
  enable?: () => Promise<string[]>;
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  selectedAddress?: string;
  networkVersion?: string;
}

export interface WindowWithWallets extends Window {
  ethereum?: WalletProvider;
  klaytn?: KlaytnProvider;
  kaia?: KlaytnProvider; // New Kaia property
}

export interface WalletInfo {
  name: string;
  address: string;
  balance: string;
  chainId: string;
  isConnected: boolean;
}

export interface ConnectWalletResponse {
  success: boolean;
  address?: string;
  error?: string;
}

declare global {
  interface Window {
    ethereum?: WalletProvider;
    klaytn?: KlaytnProvider;
    kaia?: KlaytnProvider; // New Kaia property
  }
}
