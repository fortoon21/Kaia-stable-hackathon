import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const fetchingRef = useRef(false);

  // Memoize token info to prevent unnecessary re-renders
  const tokenInfo = useMemo(() => {
    if (!selectedPair) return null;
    const symbol = selectedPair.collateralAsset.symbol;
    const tokenAddress = TOKEN_ADDRESSES[symbol as keyof typeof TOKEN_ADDRESSES];
    const decimals = TOKEN_DECIMALS[symbol as keyof typeof TOKEN_DECIMALS] || 18;
    return { symbol, tokenAddress, decimals };
  }, [selectedPair]);

  // Fetch token balance function - stable reference
  const fetchBalance = useCallback(async () => {
    if (!isConnected || !tokenInfo || fetchingRef.current) return;

    fetchingRef.current = true;
    setIsLoadingBalance(true);
    
    try {
      const { tokenAddress, decimals } = tokenInfo;

      if (tokenAddress && /^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
        const tokenBalance = await getTokenBalance(tokenAddress, decimals);
        setCollateralBalance(tokenBalance);
      } else {
        setCollateralBalance("0");
      }
    } catch (_error) {
      setCollateralBalance("-");
    } finally {
      setIsLoadingBalance(false);
      fetchingRef.current = false;
    }
  }, [isConnected, tokenInfo, getTokenBalance]);

  // Fetch token balance when deps change - but less frequently
  useEffect(() => {
    if (!isConnected || !tokenInfo) {
      setCollateralBalance("-");
      return;
    }
    
    fetchBalance();
  }, [isConnected, tokenInfo?.symbol, tokenInfo?.tokenAddress]);

  // Return both balance and refresh function
  return { collateralBalance, isLoadingBalance, refreshBalance: fetchBalance };
}
