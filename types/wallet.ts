// Wallet-related type definitions

export interface WalletProvider {
  isMetaMask?: boolean;
  isRabby?: boolean;
  isCoinbaseWallet?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  enable?: () => Promise<string[]>;
  selectedAddress?: string;
  chainId?: string;
}

export interface KlaytnProvider {
  enable: () => Promise<string[]>;
  selectedAddress?: string;
  networkVersion?: string;
}

export interface WindowWithWallets extends Window {
  ethereum?: WalletProvider;
  klaytn?: KlaytnProvider;
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
  }
}
