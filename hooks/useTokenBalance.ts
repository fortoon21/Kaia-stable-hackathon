import { useEffect, useState } from "react";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from "@/constants/tokens";
import { useWeb3 } from "@/lib/web3Provider";

interface SelectedPair {
  collateralAsset: {
    symbol: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export function useTokenBalance(selectedPair?: SelectedPair) {
  const [collateralBalance, setCollateralBalance] = useState<string>("-");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const { isConnected, getTokenBalance } = useWeb3();

  // Fetch token balance when wallet is connected
  // biome-ignore lint/correctness/useExhaustiveDependencies: getTokenBalance causes flickering
  useEffect(() => {
    const fetchBalance = async () => {
      if (!isConnected || !selectedPair) return;

      setIsLoadingBalance(true);
      try {
        const symbol = selectedPair.collateralAsset.symbol;
        const tokenAddress =
          TOKEN_ADDRESSES[symbol as keyof typeof TOKEN_ADDRESSES];
        const decimals =
          TOKEN_DECIMALS[symbol as keyof typeof TOKEN_DECIMALS] || 18;

        if (tokenAddress) {
          // Only fetch if the token address is valid
          if (/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
            const tokenBalance = await getTokenBalance(tokenAddress, decimals);
            setCollateralBalance(tokenBalance);
          } else {
            console.warn(`Invalid token address for ${symbol}:`, tokenAddress);
            setCollateralBalance("0");
          }
        } else {
          console.warn(`No token address found for symbol: ${symbol}`);
          setCollateralBalance("0");
        }
      } catch (error) {
        console.error("Failed to fetch token balance:", error);
        setCollateralBalance("-");
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [isConnected, selectedPair]);

  return { collateralBalance, isLoadingBalance };
}
