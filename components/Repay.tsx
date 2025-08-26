"use client";

import { ethers } from "ethers";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import NumberInput from "@/components/ui/NumberInput";
import Slider from "@/components/ui/Slider";
import { showToast } from "@/components/ui/Toast";
import { LAYOUT } from "@/constants/layout";
import {
  AAVE_CONFIG,
  TOKEN_ADDRESSES,
  TOKEN_DECIMALS,
} from "@/constants/tokens";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useWeb3 } from "@/lib/web3Provider";
import { getTokenAddress } from "@/utils/tokenHelpers";

interface RepayProps {
  onGoBack?: () => void;
}

type AssetInfo = {
  symbol: string;
  asset: string;
  icon: string;
  iconBg: string;
  imageUrl: string | null;
};

type RepayAsset = {
  symbol: string;
  amount: string;
  usdValue: string;
  asset: AssetInfo;
  collateralAsset: AssetInfo;
} | null;

export default function Repay({ onGoBack }: RepayProps = {}) {
  const { 
    signer, 
    address, 
    refreshAaveData, 
    getTokenBalance, 
    isConnected, 
    aaveUserBalances 
  } = useWeb3();
  const { loading: pricesLoading, getPriceBySymbol } = useTokenPrices();
  const [activeTab, setActiveTab] = useState<"wallet" | "swap">("wallet");
  const [repayPercent, setRepayPercent] = useState(0);
  const [collateralAmount, setCollateralAmount] = useState("");
  const [debtAmount, setDebtAmount] = useState("");
  const [repayAsset, setRepayAsset] = useState<RepayAsset>(null);
  const [isRepaying, setIsRepaying] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Load repay asset info from localStorage
  useEffect(() => {
    const storedAsset = localStorage.getItem("repayAsset");
    if (storedAsset) {
      try {
        const assetInfo = JSON.parse(storedAsset) as NonNullable<RepayAsset>;
        setRepayAsset(assetInfo);
      } catch (error) {
        console.error("Failed to parse repay asset info:", error);
        // Fallback to default LBTC
        setRepayAsset({
          symbol: "LBTC",
          amount: "0.000161",
          usdValue: "$15.68",
          asset: {
            symbol: "LBTC",
            asset: "LBTC",
            icon: "₿",
            iconBg: "bg-primary-200",
            imageUrl: null,
          },
          collateralAsset: {
            symbol: "USDC",
            asset: "USDC",
            icon: "$",
            iconBg: "bg-secondary",
            imageUrl: null,
          },
        });
      }
    } else {
      // Default fallback
      setRepayAsset({
        symbol: "LBTC",
        amount: "0.000161",
        usdValue: "$15.68",
        asset: {
          symbol: "LBTC",
          asset: "LBTC",
          icon: "₿",
          iconBg: "from-orange-500 to-orange-600",
          imageUrl: null,
        },
        collateralAsset: {
          symbol: "USDC",
          asset: "USDC",
          icon: "$",
          iconBg: "from-blue-600 to-blue-700",
          imageUrl: null,
        },
      });
    }
  }, []);

  // Fetch actual token balance - stable version
  useEffect(() => {
    let isCancelled = false;

    const fetchBalance = async () => {
      if (!isConnected || !repayAsset?.symbol) {
        setTokenBalance("0");
        return;
      }

      setBalanceLoading(true);
      try {
        const symbol = repayAsset.symbol as keyof typeof TOKEN_ADDRESSES;
        const tokenAddress = TOKEN_ADDRESSES[symbol];
        const decimals = TOKEN_DECIMALS[symbol] ?? 18;

        if (tokenAddress && getTokenBalance) {
          const balance = await getTokenBalance(tokenAddress, decimals);
          if (!isCancelled) {
            setTokenBalance(balance);
          }
        } else if (!isCancelled) {
          setTokenBalance("0");
        }
      } catch (error) {
        console.error("Failed to fetch token balance:", error);
        if (!isCancelled) {
          setTokenBalance("0");
        }
      } finally {
        if (!isCancelled) {
          setBalanceLoading(false);
        }
      }
    };

    fetchBalance();

    return () => {
      isCancelled = true;
    };
  }, [isConnected, repayAsset?.symbol, getTokenBalance]);

  // Get current debt from Aave data
  const getCurrentDebt = useCallback(() => {
    if (!repayAsset?.symbol || !aaveUserBalances) return repayAsset?.amount || "0";
    
    const tokenAddress = getTokenAddress(repayAsset.symbol);
    if (!tokenAddress) return repayAsset?.amount || "0";
    
    const balanceData = aaveUserBalances[tokenAddress];
    return balanceData?.variableDebtBalance || repayAsset?.amount || "0";
  }, [repayAsset?.symbol, aaveUserBalances, repayAsset?.amount]);

  const handleRepay = useCallback(async () => {
    try {
      if (!signer || !address) throw new Error("Connect wallet first");
      if (!repayAsset) throw new Error("No repay asset selected");

      const symbol = repayAsset.symbol as keyof typeof TOKEN_ADDRESSES;
      const tokenAddress = TOKEN_ADDRESSES[symbol];
      const decimals = TOKEN_DECIMALS[symbol] ?? 18;
      if (!tokenAddress) throw new Error("Unsupported token");

      // Determine amount to repay (use collateral amount from input)
      const rawAmount =
        collateralAmount && collateralAmount.trim().length > 0
          ? collateralAmount
          : repayAsset.amount || "0";
      const cleanedAmount = rawAmount.replace(/,/g, "");
      const amountWei = ethers.parseUnits(cleanedAmount || "0", decimals);
      if (amountWei === (0 as unknown as bigint)) {
        throw new Error("Amount must be greater than 0");
      }

      setIsRepaying(true);

      // Resolve pool address (handles AddressesProvider)
      const pool: string = AAVE_CONFIG.LENDING_POOL_V3 as unknown as string;

      // 1) Check allowance to Aave V3 pool, approve max if insufficient
      const erc20Abi: ethers.InterfaceAbi = [
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
      ];
      const erc20 = new ethers.Contract(tokenAddress, erc20Abi, signer);
      const currentAllowance: bigint = await erc20.allowance(address, pool);
      if (currentAllowance < amountWei) {
        const txApprove = await erc20.approve(pool, ethers.MaxUint256);
        await txApprove.wait();
      }

      // 2) Call Aave Pool repay(asset, amount, rateMode=2, onBehalfOf)
      const aavePoolAbi: ethers.InterfaceAbi = [
        "function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) returns (uint256)",
      ];
      const poolContract = new ethers.Contract(pool, aavePoolAbi, signer);
      const rateMode = 2; // variable debt
      const tx = await poolContract.repay(
        tokenAddress,
        amountWei,
        rateMode,
        address
      );
      await tx.wait();

      // Show success toast
      showToast({
        type: "success",
        title: "Debt Repayment Successful",
        description: `Successfully repaid ${cleanedAmount} ${repayAsset.symbol}`,
        duration: 5000,
      });

      // Refresh on-chain data and token balances
      await refreshAaveData?.();

      // Reset form state
      setDebtAmount("");
      setCollateralAmount("");
      setRepayPercent(0);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Repay failed:", e);
      
      // Show error toast instead of alert
      showToast({
        type: "error",
        title: "Repayment Failed",
        description: (e as Error).message || "Repay failed",
        duration: 8000,
      });
    } finally {
      setIsRepaying(false);
    }
  }, [signer, address, repayAsset, collateralAmount, refreshAaveData]);

  // Calculate USD values using live prices - don't show loading for price updates
  const calculateUSDValue = useCallback(
    (amount: string, symbol: string): string => {
      if (!amount || amount === "0") return "$0.00";

      const numAmount = parseFloat(amount.replace(/,/g, ""));
      if (Number.isNaN(numAmount)) return "$0.00";

      const price = getPriceBySymbol(symbol);
      if (price === 0 && pricesLoading) {
        // Only show loading if we don't have any price data yet
        return "Loading...";
      }

      const usdValue = numAmount * price;
      return `$${usdValue.toFixed(2)}`;
    },
    [getPriceBySymbol, pricesLoading]
  );

  // Handle percentage slider changes - calculate based on debt amount, not token balance
  const handleSliderChange = useCallback(
    (newPercent: number) => {
      setRepayPercent(newPercent);

      if (newPercent === 0 || !repayAsset?.amount) {
        setCollateralAmount("");
        return;
      }

      // Calculate based on current debt amount (what needs to be repaid)
      const currentDebt = getCurrentDebt();
      const debtAmount = parseFloat(currentDebt.replace(/,/g, ""));
      if (!Number.isNaN(debtAmount)) {
        const calculatedAmount = (debtAmount * newPercent) / 100;
        setCollateralAmount(calculatedAmount.toFixed(6));
      }
    },
    [repayAsset?.amount, getCurrentDebt]
  );

  // Handle input amount changes - calculate percentage based on debt amount
  const handleAmountChange = useCallback(
    (newAmount: string) => {
      setCollateralAmount(newAmount);

      if (!newAmount || !repayAsset?.amount) {
        setRepayPercent(0);
        return;
      }

      const amount = parseFloat(newAmount.replace(/,/g, ""));
      const currentDebt = getCurrentDebt();
      const debtAmount = parseFloat(currentDebt.replace(/,/g, ""));

      if (!Number.isNaN(amount) && !Number.isNaN(debtAmount) && debtAmount > 0) {
        const percentage = Math.min(100, Math.max(0, (amount / debtAmount) * 100));
        setRepayPercent(Math.round(percentage));
      }
    },
    [repayAsset?.amount, getCurrentDebt]
  );

  // Check if repay amount is valid
  const isValidRepayAmount = useCallback(() => {
    if (!collateralAmount || !repayAsset) return false;

    const amount = parseFloat(collateralAmount.replace(/,/g, ""));
    if (Number.isNaN(amount) || amount <= 0) return false;

    const debtAmount = parseFloat(repayAsset.amount.replace(/,/g, ""));
    if (Number.isNaN(debtAmount)) return false;

    return amount <= debtAmount;
  }, [collateralAmount, repayAsset]);

  return (
    <div className="text-heading">
      <div
        className={`${LAYOUT.MAX_WIDTH_CONTAINER} mx-auto px-6 ${LAYOUT.CONTENT_PADDING_TOP_CLASS} pt-24`}
      >
        {/* Back to markets button */}
        <button
          type="button"
          onClick={() => onGoBack?.()}
          className="flex items-center text-body hover:text-heading transition-colors mb-6"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Back</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Markets
        </button>

        {/* Page title */}
        <h1 className="text-3xl font-bold mb-8 text-heading font-heading">Repay</h1>

        <div className="max-w-4xl mx-auto">
          {/* Main repay interface */}
          <div>
            {/* Tab selector - matching Lending page style */}
            <div className="flex bg-surface-2 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("wallet")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-colors font-heading ${
                  activeTab === "wallet"
                    ? "bg-surface-3 text-heading border border-line-soft"
                    : "text-body hover:text-heading hover:bg-surface-ghost"
                }`}
              >
                From wallet
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("swap")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-colors relative font-heading ${
                  activeTab === "swap"
                    ? "bg-surface-3 text-heading border border-line-soft"
                    : "text-body hover:text-heading hover:bg-surface-ghost"
                }`}
              >
                Swap collateral
                <div className="absolute top-1 right-1">
                  <span className="text-xs text-black font-medium bg-primary-100 px-1.5 py-0.5 rounded-xs font-heading">
                    Coming Soon
                  </span>
                </div>
              </button>
            </div>

            {/* From wallet / Collateral to swap section - Updated design */}
            {repayAsset && (
              <div
                className={`bg-surface-1 border border-line-soft rounded-lg p-6 mb-6 shadow-1 ${activeTab === "swap" ? "blur-sm opacity-50 pointer-events-none" : ""}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-heading font-medium font-heading">
                    {activeTab === "wallet"
                      ? "From Wallet"
                      : "Collateral to Swap"}
                  </span>
                  <div className="flex items-center text-sm text-body">
                    <span className="mr-2">Balance:</span>
                    <span className="text-heading font-medium font-heading">
                      {balanceLoading && tokenBalance === "0"
                        ? "Loading balance..."
                        : activeTab === "wallet"
                          ? `${tokenBalance} ${repayAsset.symbol}`
                          : `28.29 ${repayAsset.collateralAsset?.symbol}`}
                    </span>
                  </div>
                </div>

                {/* Owed debt info - smaller display */}
                {activeTab === "wallet" && repayAsset && (
                  <div className="mb-4 text-xs text-right">
                    <span className="text-body">Owed Debt: </span>
                    <span className="text-warning font-medium font-heading">
                      {getCurrentDebt()} {repayAsset.symbol} (
                      {calculateUSDValue(getCurrentDebt(), repayAsset.symbol)})
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      {activeTab === "wallet" ? (
                        // Show debt asset for wallet tab
                        repayAsset.asset?.imageUrl ? (
                          <Image
                            src={repayAsset.asset.imageUrl}
                            alt={repayAsset.symbol}
                            width={48}
                            height={48}
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center rounded-full ${
                              repayAsset.asset?.iconBg ||
                              "bg-primary-200"
                            }`}
                          >
                            <span className="text-heading font-bold text-lg">
                              {repayAsset.asset?.icon || repayAsset.symbol[0]}
                            </span>
                          </div>
                        )
                      ) : // Show collateral asset for swap tab
                      repayAsset.collateralAsset?.imageUrl ? (
                        <Image
                          src={repayAsset.collateralAsset.imageUrl}
                          alt={repayAsset.collateralAsset.symbol}
                          width={48}
                          height={48}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center rounded-full ${
                            repayAsset.collateralAsset?.iconBg ||
                            "bg-secondary"
                          }`}
                        >
                          <span className="text-heading font-bold text-lg">
                            {repayAsset.collateralAsset?.icon ||
                              repayAsset.collateralAsset?.symbol?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-heading font-heading">
                        {activeTab === "wallet"
                          ? repayAsset.symbol
                          : repayAsset.collateralAsset?.symbol}
                      </div>
                      <div className="text-body text-sm">
                        {activeTab === "wallet"
                          ? repayAsset.asset?.asset || repayAsset.symbol
                          : repayAsset.collateralAsset?.asset}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <NumberInput
                      value={collateralAmount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className="text-2xl font-bold text-right max-w-[140px] bg-transparent border-none text-heading font-heading"
                    />
                    <div className="text-muted text-sm mt-1">
                      {calculateUSDValue(
                        collateralAmount,
                        activeTab === "wallet"
                          ? repayAsset.symbol
                          : repayAsset.collateralAsset?.symbol || ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Debt to repay section - Only show for swap tab */}
            {activeTab === "swap" && repayAsset && (
              <div className="bg-surface-1 border border-line-soft rounded-lg p-6 mb-6 blur-sm opacity-50 pointer-events-none shadow-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-heading font-medium font-heading">Debt to Repay</span>
                  <div className="flex items-center text-sm text-body">
                    <span className="mr-2">Owed:</span>
                    <span className="text-warning font-medium font-heading">
                      {repayAsset.amount} {repayAsset.symbol}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      {repayAsset.asset?.imageUrl ? (
                        <Image
                          src={repayAsset.asset.imageUrl}
                          alt={repayAsset.symbol}
                          width={48}
                          height={48}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center rounded-full ${
                            repayAsset.asset?.iconBg ||
                            "bg-primary-200"
                          }`}
                        >
                          <span className="text-heading font-bold text-sm">
                            {repayAsset.asset?.icon || repayAsset.symbol[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-heading font-heading">
                        {repayAsset.symbol}
                      </div>
                      <div className="text-body text-sm">
                        {repayAsset.asset?.asset || repayAsset.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <NumberInput
                      value={debtAmount}
                      onChange={setDebtAmount}
                      placeholder="0.00"
                      className="text-2xl font-bold text-right max-w-[140px] bg-transparent border-none text-heading font-heading"
                    />
                    <div className="text-muted text-sm mt-1">
                      {calculateUSDValue(
                        debtAmount || repayAsset.amount,
                        repayAsset.symbol
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Repay percentage slider - Enhanced design */}
            <div
              className={`bg-surface-1 border border-line-soft rounded-lg p-6 mb-6 shadow-1 ${activeTab === "swap" ? "blur-sm opacity-50 pointer-events-none" : ""}`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-heading font-semibold text-lg font-heading">
                    Repay Amount
                  </div>
                  <div className="text-body text-sm mt-1">
                    Select percentage of debt to repay
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-primary-100 font-bold text-2xl font-heading">
                    {repayPercent}%
                  </span>
                  <div className="text-body text-sm mt-1">
                    of total debt
                  </div>
                </div>
              </div>

              <div className="relative">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={repayPercent}
                  onChange={handleSliderChange}
                  fillColor="rgba(42,229,185,0.8)"
                  trackColor="rgba(42,229,185,0.15)"
                  className="h-1.5"
                />
                <div className="flex justify-between text-xs text-body mt-3">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Action buttons - Enhanced design */}
            <div
              className={`${activeTab === "swap" ? "blur-sm opacity-50 pointer-events-none" : ""}`}
            >
              <button
                type="button"
                className={`w-full py-4 px-6 font-semibold rounded-lg transition-all duration-200 font-heading ${
                  isRepaying || !repayAsset || !isValidRepayAmount()
                    ? "bg-surface-3 text-muted cursor-not-allowed border border-line-soft"
                    : "bg-primary-100 text-black hover:bg-primary-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
                disabled={isRepaying || !repayAsset || !isValidRepayAmount()}
                onClick={handleRepay}
              >
                {isRepaying ? "Repaying..." : "Repay Debt"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
