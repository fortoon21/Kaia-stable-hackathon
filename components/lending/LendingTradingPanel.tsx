"use client";

import { ethers } from "ethers";
import Image from "next/image";
import { useCallback, useState } from "react";
import Slider from "@/components/ui/Slider";
import WalletConnectorV2 from "@/components/WalletConnectorV2";
import {
  AAVE_CONFIG,
  DRAGON_SWAP_POOLS,
  LOOP_CONFIG,
  TOKEN_DECIMALS,
} from "@/constants/tokens";
import { useAaveData } from "@/hooks/useAaveData";
import { useLeverageCalculations } from "@/hooks/useLeverageCalculations";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { encodeBorrowToCollateralSwap } from "@/lib/eisen";
import { calculateLeverageParams, calculateMaxLeverage } from "@/lib/leverage";
import { useWeb3 } from "@/lib/web3Provider";
import type { LendingProps, TabType } from "@/types/lending";
import { calculateUSDValue } from "@/utils/formatters";
import { getTokenAddress } from "@/utils/tokenHelpers";

interface LendingTradingPanelProps {
  selectedPair?: LendingProps["selectedPair"];
}

export function LendingTradingPanel({
  selectedPair,
}: LendingTradingPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("multiply");
  const [multiplier, setMultiplier] = useState(1.0);
  const [collateralAmount, setCollateralAmount] = useState("");
  const [ltvValue, setLtvValue] = useState(0);
  const [ltvInput, setLtvInput] = useState("0.0");
  const [multiplierInput, setMultiplierInput] = useState("1.00");
  const {
    isConnected,
    signer,
    address,
    chainId,
    aaveParamsV3Index,
    aaveParamsV3,
    aaveUserBalances,
  } = useWeb3();
  const { collateralBalance, isLoadingBalance } = useTokenBalance(selectedPair);
  const { maxLeverage, leveragePosition, collateralPrice, debtPrice } =
    useLeverageCalculations(selectedPair, collateralAmount, multiplier);
  const { getLTV, getSupplyAPY, getBorrowAPY } = useAaveData();

  // Calculate real max multiplier from Markets logic
  const realMaxMultiplier = selectedPair?.collateralAsset?.symbol
    ? (() => {
        const ltv = getLTV(selectedPair.collateralAsset.symbol);
        if (!ltv) return maxLeverage; // fallback to leverage calculation
        const ltvDecimal = parseFloat(ltv.replace("%", "")) / 100;
        return ltvDecimal >= 1 ? 1 : 1 / (1 - ltvDecimal);
      })()
    : maxLeverage;

  const handleOpenMultiply = useCallback(async () => {
    try {
      if (!signer || !address) throw new Error("Connect wallet first");
      if (!selectedPair) throw new Error("No pair selected");

      // Resolve addresses
      const collateralUnderlying = getTokenAddress(
        selectedPair.collateralAsset.symbol
      );
      const borrowUnderlying = getTokenAddress(selectedPair.debtAsset.symbol);
      if (!collateralUnderlying || !borrowUnderlying) {
        throw new Error("Unsupported asset addresses");
      }

      const paramsIndex = aaveParamsV3Index as Record<
        string,
        {
          aTokenAddress?: string;
          variableDebtTokenAddress?: string;
        }
      >;
      const paramsCollateral = paramsIndex[collateralUnderlying];
      if (!paramsCollateral?.aTokenAddress) {
        throw new Error("Missing Aave asset params for collateral");
      }
      const paramsBorrow = paramsIndex[borrowUnderlying];
      if (!paramsBorrow?.variableDebtTokenAddress) {
        throw new Error("Missing Aave asset params for borrow");
      }

      const aToken = paramsCollateral.aTokenAddress;
      const variableDebtAsset = paramsBorrow.variableDebtTokenAddress;
      const collateralDecimals =
        TOKEN_DECIMALS[selectedPair.collateralAsset.symbol] ?? 18;

      // Amounts from UI (wei)
      const collAmtWei = ethers.parseUnits(
        (collateralAmount || "0").replace(/,/g, ""),
        collateralDecimals
      );
      if (collAmtWei === (0 as unknown as bigint)) {
        throw new Error("Collateral amount must be greater than 0");
      }

      // Compute multiplier extra via calculateMaxLeverage using cached Aave values
      const debtDecimals = TOKEN_DECIMALS[selectedPair.debtAsset.symbol] ?? 18;
      const poolRoot = aaveParamsV3 as unknown as {
        response?: { flashloanPremium?: unknown };
      };
      const root = poolRoot?.response ?? poolRoot;
      const flBps = Number(
        (root as { flashloanPremium?: unknown })?.flashloanPremium ?? 0
      );
      const flashloanPremiumDec = Number.isFinite(flBps)
        ? (flBps / 10000).toString()
        : "0.0009";
      const idxParams = (
        aaveParamsV3Index as Record<
          string,
          { baseLTVasCollateral?: number | bigint }
        >
      )[collateralUnderlying];
      const Lbps = idxParams?.baseLTVasCollateral;
      const maxLtvDec =
        Lbps !== undefined
          ? (
              (typeof Lbps === "bigint" ? Number(Lbps) : Number(Lbps)) / 10000
            ).toString()
          : "0.93";

      // Initial balances (human units) from cache: aToken for collateral; variable debt for debt asset
      const balances = aaveUserBalances as Record<
        string,
        { aTokenBalance?: string; variableDebtBalance?: string }
      >;
      const initialCollateralHuman =
        balances[collateralUnderlying]?.aTokenBalance || "0";
      const initialDebtHuman =
        balances[borrowUnderlying]?.variableDebtBalance || "0";

      const targetLev = Math.max(1, Math.min(multiplier, 25));
      const maxLev = calculateMaxLeverage({
        collateralDecimals,
        debtDecimals,
        // Pass human-readable units; helper scales to 1e18 internally
        initialCollateralAmount: initialCollateralHuman,
        initialDebtAmount: initialDebtHuman,
        additionalCollateralAmount: collateralAmount || "0",
        priceOfCollateral: collateralPrice.toString(),
        priceOfDebt: debtPrice.toString(),
        // flashloanPremium and maxLTV are decimals; helper scales to 1e18 internally
        flashloanPremium: flashloanPremiumDec,
        maxLTV: maxLtvDec,
      });

      const clampedTarget = Math.min(targetLev, maxLev);
      const leverageCalc = calculateLeverageParams({
        collateralDecimals,
        debtDecimals,
        initialCollateralAmount: initialCollateralHuman,
        initialDebtAmount: initialDebtHuman,
        additionalCollateralAmount: collateralAmount || "0",
        targetLeverage: clampedTarget.toString(),
        priceOfCollateral: collateralPrice.toString(),
        priceOfDebt: debtPrice.toString(),
        flashloanPremium: flashloanPremiumDec,
      });
      const flashloanAmtWei = ethers.parseUnits(
        leverageCalc.flashloanAmount || "0",
        debtDecimals
      );

      // 1) Approval: collateral underlying -> LeverageLoop contract
      const loopAddress = LOOP_CONFIG.LEVERAGE_LOOP_ADDRESS;
      if (!ethers.isAddress(loopAddress)) {
        throw new Error("Missing NEXT_PUBLIC_LEVERAGE_LOOP_ADDRESS");
      }
      const erc20Abi: ethers.InterfaceAbi = [
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
      ];
      const collateralErc20 = new ethers.Contract(
        collateralUnderlying,
        erc20Abi,
        signer
      );
      const currentAllowance: bigint = await collateralErc20.allowance(
        address,
        loopAddress
      );
      if (currentAllowance < collAmtWei) {
        const txApprove = await collateralErc20.approve(
          loopAddress,
          ethers.MaxUint256
        );
        await txApprove.wait();
      }

      // 1b) Borrow delegation: variableDebtToken -> allow loop contract to incur debt on user's behalf
      const debtTokenAbi: ethers.InterfaceAbi = [
        "function borrowAllowance(address fromUser, address toUser) view returns (uint256)",
        "function approveDelegation(address delegatee, uint256 amount)",
      ];
      const variableDebtToken = new ethers.Contract(
        variableDebtAsset,
        debtTokenAbi,
        signer
      );
      const currentBorrowAllowance: bigint =
        await variableDebtToken.borrowAllowance(address, loopAddress);
      // Include flashloan premium in required delegation allowance (rounding up)
      const bpsNumber = Number.isFinite(flBps)
        ? Math.max(0, Math.floor(Number(flBps)))
        : 0;
      // Scale flashloan premium from bps to 1e18 (WAD) and compute premium in wei
      const ONE_WAD = BigInt("1000000000000000000");
      const premiumWad = (BigInt(bpsNumber) * ONE_WAD) / BigInt("10000");
      const premiumWei =
        (flashloanAmtWei * premiumWad + (ONE_WAD - BigInt("1"))) / ONE_WAD;
      const requiredBorrowAllowance = flashloanAmtWei + premiumWei;
      if (currentBorrowAllowance < requiredBorrowAllowance) {
        const txApproveDelegation = await variableDebtToken.approveDelegation(
          loopAddress,
          ethers.MaxUint256
        );
        await txApproveDelegation.wait();
      }

      // 1c) Ensure the supplied collateral is flagged as usable as collateral in Aave for the user
      // Resolve pool address (handle AddressesProvider case)
      const pool = AAVE_CONFIG.LENDING_POOL_V3 as unknown as string;

      // Check if already using reserve as collateral; skip tx if true
      try {
        const userConfAbi: ethers.InterfaceAbi = [
          "function getUserConfiguration(address user) view returns (uint256)",
        ];
        const poolView = new ethers.Contract(pool, userConfAbi, signer);
        const confData: bigint = await poolView.getUserConfiguration(address);
        const reserveMeta = paramsIndex[collateralUnderlying] as unknown as {
          id?: number | string | bigint;
        };
        const reserveId = Number(reserveMeta?.id ?? 0);
        const collateralBitPos = BigInt(reserveId * 2 + 1);
        const isUsingCollateral =
          ((confData >> collateralBitPos) & BigInt(1)) === BigInt(1);
        if (!isUsingCollateral) {
          const aavePoolAbi: ethers.InterfaceAbi = [
            "function setUserUseReserveAsCollateral(address asset, bool useAsCollateral)",
          ];
          const poolContract = new ethers.Contract(pool, aavePoolAbi, signer);
          const txEnable = await poolContract.setUserUseReserveAsCollateral(
            collateralUnderlying,
            true
          );
          await txEnable.wait();
        }
      } catch {
        // Ignore errors when enabling collateral
      }

      // 2) Get encoded swap path from Eisen router API (borrow -> collateral)
      const { encoded: swapPathData } = await encodeBorrowToCollateralSwap({
        fromToken: borrowUnderlying,
        toToken: collateralUnderlying,
        amountIn: flashloanAmtWei.toString(),
        slippageBps: 50,
        fromAddress: loopAddress,
        toAddress: loopAddress,
        chainId: chainId ?? 8217,
      });

      // 3) Call LeverageLoop.openMultiply with LeverageParams
      const leverageLoopAbi: ethers.InterfaceAbi = [
        "function executeLeverageLoop((address,address,address,address,address,uint256,uint256,bytes)) payable",
      ];

      const dragonSwapPool =
        DRAGON_SWAP_POOLS[
          selectedPair?.debtAsset.symbol as keyof typeof DRAGON_SWAP_POOLS
        ];
      const loop = new ethers.Contract(loopAddress, leverageLoopAbi, signer);
      const paramsTuple: [
        string,
        string,
        string,
        string,
        string,
        bigint,
        bigint,
        string,
      ] = [
        aToken,
        variableDebtAsset,
        collateralUnderlying,
        borrowUnderlying,
        dragonSwapPool,
        collAmtWei,
        flashloanAmtWei,
        swapPathData,
      ];
      const tx = await loop.executeLeverageLoop(paramsTuple);
      await tx.wait();
      // Optionally refresh state here
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Open multiply failed:", e);
      alert((e as Error).message || "Open multiply failed");
    }
  }, [
    signer,
    address,
    selectedPair,
    aaveParamsV3Index,
    aaveParamsV3,
    aaveUserBalances,
    chainId,
    collateralAmount,
    multiplier,
    collateralPrice,
    debtPrice,
  ]);

  return (
    <div
      className="bg-surface-1 h-full pointer-events-auto rounded-lg shadow-1 flex flex-col font-heading"
      data-name="Background+Border"
      data-node-id="1:32"
    >
      <div
        aria-hidden="true"
        className="absolute border border-line-soft border-solid inset-0 pointer-events-none rounded-lg"
      />
      <div
        className="bg-surface-2 h-[53px] rounded-tl-md rounded-tr-md flex-shrink-0"
        data-name="Background"
        data-node-id="1:33"
      >
        <div
          className="h-full overflow-visible relative"
          data-name="Tablist"
          data-node-id="1:34"
        >
          <button
            type="button"
            onClick={() => setActiveTab("borrow")}
            className="absolute h-[53px] left-0 w-1/2 rounded-tl-md top-0 cursor-pointer hover:bg-surface-ghost transition-colors relative"
            data-name="Tab"
            data-node-id="1:35"
          >
            <div
              aria-hidden="true"
              className="absolute border-line-soft border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded"
            />
            <div
              className={`absolute flex flex-col font-normal h-5 justify-center leading-[0] not-italic text-[16px] text-center translate-x-[-50%] translate-y-[-50%] w-[54.205px] ${
                activeTab === "borrow" ? "text-heading" : "text-body"
              }`}
              data-node-id="1:36"
              style={{
                top: "calc(50% - 0.5px)",
                left: "calc(50% + 0.183px)",
              }}
            >
              <p className="block leading-[20px]">Borrow</p>
            </div>
            <div className="absolute top-1 right-1">
              <span className="text-xs text-heading font-medium bg-primary-500 px-1.5 py-0.5 rounded">
                Coming Soon
              </span>
            </div>
            {activeTab === "borrow" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-100"></div>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("multiply")}
            className="absolute h-[53px] right-0 w-1/2 rounded-tr-md top-0 cursor-pointer hover:bg-surface-ghost transition-colors"
            data-name="Tab"
            data-node-id="1:37"
          >
            <div
              aria-hidden="true"
              className="absolute border-line-soft border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded"
            />
            <div
              className={`absolute flex flex-col font-normal h-5 justify-center leading-[0] not-italic text-[16px] text-center translate-x-[-50%] translate-y-[-50%] w-[59.773px] ${
                activeTab === "multiply" ? "text-heading" : "text-body"
              }`}
              data-node-id="1:38"
              style={{
                top: "calc(50% - 0.5px)",
                left: "calc(50% + 0.186px)",
              }}
            >
              <p className="block leading-[20px]">Multiply</p>
            </div>
            {activeTab === "multiply" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-100"></div>
            )}
          </button>
        </div>
      </div>

      {/* Trading Interface Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-3">
          {/* Trading Form Container */}
          <div className="space-y-4">
            {/* Margin Collateral - Only for Multiply Tab */}
            {activeTab === "multiply" && (
              <div className="bg-surface-2 rounded-md shadow-1 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-body text-sm">
                    Margin collateral
                  </div>
                  {isConnected && (
                    <div className="flex items-center space-x-2">
                      <div className="text-body text-xs">
                        <span>Balance: </span>
                        <span className="tabular-nums font-mono">
                          {isLoadingBalance ? "..." : collateralBalance}
                        </span>
                        <span>
                          {" "}
                          {selectedPair?.collateralAsset.symbol || "WKAIA"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCollateralAmount(collateralBalance || "0")
                        }
                        className="bg-primary-400 hover:bg-primary-200 text-heading text-xs px-2 py-1 rounded transition-colors"
                        disabled={
                          isLoadingBalance ||
                          !collateralBalance ||
                          collateralBalance === "-"
                        }
                      >
                        MAX
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    placeholder="0"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    className="bg-transparent text-heading text-2xl w-full outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                  <div className="bg-surface-2 rounded-pill shadow-1 px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                    {selectedPair?.collateralAsset.imageUrl ? (
                      <Image
                        src={selectedPair.collateralAsset.imageUrl}
                        alt={selectedPair.collateralAsset.symbol}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 bg-primary-100 rounded-full"></div>
                    )}
                    <span className="text-heading text-sm font-semibold">
                      {selectedPair?.collateralAsset.symbol || "PT-USDe"}
                    </span>
                  </div>
                </div>
                <div className="text-body text-sm mt-3">
                  ~{" "}
                  {calculateUSDValue(collateralAmount || "0", collateralPrice)}
                </div>
              </div>
            )}

            {/* Multiplier Section - Only for Multiply Tab */}
            {activeTab === "multiply" && (
              <div className="bg-surface-2 rounded-md shadow-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-heading text-sm font-semibold">
                    Multiplier
                  </div>
                  <div className="bg-primary-500 rounded px-3 py-1 flex items-center">
                    <input
                      type="text"
                      value={multiplierInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setMultiplierInput(value);
                          if (value !== "") {
                            const numValue = parseFloat(value);
                            if (!Number.isNaN(numValue)) {
                              const clampedValue = Math.max(
                                1,
                                Math.min(realMaxMultiplier, numValue)
                              );
                              setMultiplier(clampedValue);
                            }
                          } else {
                            setMultiplier(1);
                          }
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => {
                        if (multiplierInput === "") {
                          setMultiplierInput("1.00");
                          setMultiplier(1);
                        } else {
                          const numValue = parseFloat(multiplierInput);
                          if (!Number.isNaN(numValue)) {
                            const clampedValue = Math.max(
                              1,
                              Math.min(realMaxMultiplier, numValue)
                            );
                            setMultiplier(clampedValue);
                            setMultiplierInput(clampedValue.toFixed(2));
                          }
                        }
                      }}
                      className="text-heading text-sm font-semibold bg-transparent w-12 text-right outline-none"
                    />
                    <span className="text-heading text-sm font-semibold ml-0.5">
                      x
                    </span>
                  </div>
                </div>
                <div className="relative mb-4">
                  <Slider
                    min={1}
                    max={realMaxMultiplier}
                    step={0.01}
                    value={multiplier}
                    onChange={(value) => {
                      setMultiplier(value);
                      setMultiplierInput(value.toFixed(2));
                    }}
                    fillColor="rgba(42,229,185,0.6)"
                    trackColor="rgba(42,229,185,0.2)"
                  />
                </div>
                <div className="flex justify-between text-xs text-body">
                  <span>1.00X</span>
                  <span className="text-body">
                    {realMaxMultiplier > 1
                      ? ((realMaxMultiplier - 1) * 0.25 + 1).toFixed(2)
                      : "-.-"}
                    X
                  </span>
                  <span>
                    {realMaxMultiplier > 1
                      ? ((realMaxMultiplier - 1) * 0.5 + 1).toFixed(2)
                      : "-.-"}
                    X
                  </span>
                  <span className="text-body">
                    {realMaxMultiplier > 1
                      ? ((realMaxMultiplier - 1) * 0.75 + 1).toFixed(2)
                      : "-.-"}
                    X
                  </span>
                  <span>
                    Max (
                    {realMaxMultiplier > 1
                      ? realMaxMultiplier.toFixed(2)
                      : "-.-"}
                    X)
                  </span>
                </div>
              </div>
            )}
            {/* Position Details - Only for Multiply Tab */}
            {activeTab === "multiply" && (
              <div className="space-y-4">
                {/* Long Position */}
                <div className="bg-surface-1 border border-[#23c09b]/20 rounded-lg p-4">
                  <div className="text-body text-sm mb-2">Long</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-heading">
                        {/* Long = collateralAmount * multiplier */}
                        {(
                          parseFloat(collateralAmount || "0") * multiplier
                        ).toFixed(2)}{" "}
                        {selectedPair?.collateralAsset.symbol || "PT-USDe"}
                      </div>
                      <div className="text-body text-sm">
                        {calculateUSDValue(
                          (
                            parseFloat(collateralAmount || "0") * multiplier
                          ).toString(),
                          collateralPrice
                        )}
                      </div>
                    </div>
                    <div className="bg-surface-2 rounded-pill shadow-1 px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                      {selectedPair?.collateralAsset.imageUrl ? (
                        <Image
                          src={selectedPair.collateralAsset.imageUrl}
                          alt={selectedPair.collateralAsset.symbol}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-primary-100 rounded-full"></div>
                      )}
                      <span className="text-heading text-sm">
                        {selectedPair?.collateralAsset.symbol || "PT-USDe"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Short Position */}
                <div className="bg-surface-1 border border-warning/20 rounded-lg p-4">
                  <div className="text-body text-sm mb-2">Short</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-heading">
                        {/* Short = flashloan amount (borrowed debt) */}
                        {parseFloat(
                          leveragePosition.flashloanAmount || "0"
                        ).toFixed(2)}{" "}
                        {selectedPair?.debtAsset.symbol || "USDC"}
                      </div>
                      <div className="text-body text-sm">
                        {calculateUSDValue(
                          leveragePosition.flashloanAmount || "0",
                          debtPrice
                        )}
                      </div>
                    </div>
                    <div className="bg-surface-2 rounded-pill shadow-1 px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                      {selectedPair?.debtAsset.imageUrl ? (
                        <Image
                          src={selectedPair.debtAsset.imageUrl}
                          alt={selectedPair.debtAsset.symbol}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-heading text-xs">
                          {selectedPair?.debtAsset.symbol?.[0] || "U"}
                        </div>
                      )}
                      <span className="text-heading text-sm">
                        {selectedPair?.debtAsset.symbol || "USDC"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "borrow" && (
              <div className="space-y-4 blur-sm opacity-50 pointer-events-none">
                {/* Supply Section */}
                <div className="bg-surface-2 rounded-md shadow-1 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-body text-sm">
                      Supply {selectedPair?.collateralAsset.symbol || "USDC"}
                    </div>
                    <div className="text-xs text-body">
                      <span className="mr-2">Market</span>
                      <span>Euler Base</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      placeholder="0"
                      className="bg-transparent text-heading text-2xl w-full outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    />
                    <div className="bg-surface-2 rounded-pill shadow-1 px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                      {selectedPair?.collateralAsset.imageUrl ? (
                        <Image
                          src={selectedPair.collateralAsset.imageUrl}
                          alt={selectedPair.collateralAsset.symbol}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center text-heading text-xs font-bold">
                          {selectedPair?.collateralAsset.symbol?.[0] || "K"}
                        </div>
                      )}
                      <span className="text-heading text-sm font-semibold">
                        {selectedPair?.collateralAsset.symbol || "USDC"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-3">
                    <div className="text-body">~ $0.00</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-body">
                        <span>Balance: </span>
                        <span className="tabular-nums font-mono">
                          {isLoadingBalance ? "..." : collateralBalance}
                        </span>
                        <span>
                          {" "}
                          {selectedPair?.collateralAsset.symbol || "USDC"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCollateralAmount(collateralBalance || "0")
                        }
                        className="px-2 py-1 bg-primary-400 text-heading text-xs font-semibold rounded hover:bg-primary-300 transition-colors"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>

                {/* Borrow Section */}
                <div className="bg-surface-2 rounded-md shadow-1 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-body text-sm">
                      Borrow {selectedPair?.debtAsset.symbol || "USDS"}
                    </div>
                    <div className="text-xs text-body">
                      <span className="mr-2">Market</span>
                      <span>Euler Base</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      placeholder="0"
                      className="bg-transparent text-heading text-2xl w-full outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    />
                    <div className="bg-surface-2 rounded-pill shadow-1 px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                      {selectedPair?.debtAsset.imageUrl ? (
                        <Image
                          src={selectedPair.debtAsset.imageUrl}
                          alt={selectedPair.debtAsset.symbol}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-heading text-xs font-bold">
                          {selectedPair?.debtAsset.symbol?.[0] || "U"}
                        </div>
                      )}
                      <span className="text-heading text-sm font-semibold">
                        {selectedPair?.debtAsset.symbol || "USDS"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-3">
                    <div className="text-body">~ $0.00</div>
                    <div className="text-body">Max borrow 0</div>
                  </div>
                </div>

                {/* LTV Section */}
                <div className="bg-surface-2 rounded-md shadow-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-heading text-sm font-semibold">LTV</div>
                    <div className="bg-primary-500 rounded px-3 py-1 flex items-center">
                      <input
                        type="text"
                        value={ltvInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d*\.?\d*$/.test(value)) {
                            setLtvInput(value);
                            if (value !== "") {
                              const numValue = parseFloat(value);
                              if (!Number.isNaN(numValue)) {
                                const clampedValue = Math.max(
                                  0,
                                  Math.min(93, numValue)
                                );
                                setLtvValue(clampedValue);
                              }
                            } else {
                              setLtvValue(0);
                            }
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                        onBlur={() => {
                          if (ltvInput === "") {
                            setLtvInput("0.0");
                            setLtvValue(0);
                          } else {
                            const numValue = parseFloat(ltvInput);
                            if (!Number.isNaN(numValue)) {
                              const clampedValue = Math.max(
                                0,
                                Math.min(93, numValue)
                              );
                              setLtvValue(clampedValue);
                              setLtvInput(clampedValue.toFixed(1));
                            }
                          }
                        }}
                        className="text-heading text-sm font-semibold bg-transparent w-10 text-right outline-none"
                      />
                      <span className="text-heading text-sm font-semibold ml-0.5">
                        %
                      </span>
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <Slider
                      min={0}
                      max={93}
                      step={0.1}
                      value={ltvValue}
                      onChange={(value) => {
                        setLtvValue(value);
                        setLtvInput(value.toFixed(1));
                      }}
                      fillColor="rgba(42,229,185,0.6)"
                      trackColor="rgba(42,229,185,0.2)"
                      className="h-1.5"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-body">
                    <span>0.00%</span>
                    <span>23.00%</span>
                    <span>47.00%</span>
                    <span>70.00%</span>
                    <span>93.00%</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="bg-surface-2 rounded-md shadow-1 p-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-body">Net APY ⚙️</span>
                    <span className="text-heading">0.00%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">Current oracle price</span>
                    <span className="text-heading">
                      $1.00 <span className="text-body">USDC ⇄</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">
                      Liquidation oracle price
                    </span>
                    <span className="text-heading">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">Your LTV</span>
                    <span className="text-heading">∞</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">Your health</span>
                    <span className="text-heading">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">Estimated gas fee</span>
                    <div className="text-right">
                      <div className="text-heading">{"<0.000001 ETH"}</div>
                      <div className="text-body text-xs">{"<$0.01"}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trading Details/Stats Section - Only for Multiply Tab */}
            {activeTab === "multiply" && (
              <div className="bg-surface-2 rounded-md p-6 space-y-4 mt-4 border border-line-soft shadow-1">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-body">ROE</span>
                    <span className="text-heading">
                      {(() => {
                        if (
                          !selectedPair?.collateralAsset?.symbol ||
                          !selectedPair?.debtAsset?.symbol
                        ) {
                          return "0.00%";
                        }

                        const collateralSupplyAPY = parseFloat(
                          getSupplyAPY(
                            selectedPair.collateralAsset.symbol
                          )?.replace("%", "") || "0"
                        );
                        const debtBorrowAPY = parseFloat(
                          getBorrowAPY(selectedPair.debtAsset.symbol)?.replace(
                            "%",
                            ""
                          ) || "0"
                        );

                        const longValue =
                          parseFloat(collateralAmount || "0") *
                          multiplier *
                          collateralPrice;
                        const shortValue =
                          parseFloat(leveragePosition.flashloanAmount || "0") *
                          debtPrice;
                        const yourLTV =
                          longValue === 0 ? 0 : shortValue / longValue;

                        const roe =
                          (collateralSupplyAPY - yourLTV * debtBorrowAPY) *
                          multiplier;

                        return `${roe.toFixed(2)}%`;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">Your LTV</span>
                    <span className="text-heading">
                      {(() => {
                        const longValue =
                          parseFloat(collateralAmount || "0") *
                          multiplier *
                          collateralPrice;
                        const shortValue =
                          parseFloat(leveragePosition.flashloanAmount || "0") *
                          debtPrice;

                        if (longValue === 0) return "0.00%";

                        const ltv = (shortValue / longValue) * 100;
                        return `${ltv.toFixed(2)}%`;
                      })()}
                    </span>
                  </div>
                </div>

                <hr className="border-line-soft" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-body">Swap</span>
                    <span className="text-heading">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">Slippage tolerance</span>
                    <span className="text-heading">0.05%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">Routed via</span>
                    <span className="text-heading flex items-center">
                      <Image
                        src="https://raw.githubusercontent.com/EisenFinance/assets/main/assets/eisen/symbol/eisen-favicon.svg"
                        alt="Eisen"
                        width={16}
                        height={16}
                        className="w-4 h-4 mr-1"
                      />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Button */}
      <div
        className={`flex-shrink-0 bg-bg-main rounded-b-2xl border-t border-line-soft p-4 ${activeTab === "borrow" ? "blur-sm opacity-50 pointer-events-none" : ""}`}
      >
        {!isConnected ? (
          <WalletConnectorV2 />
        ) : (
          <button
            type="button"
            className="w-full bg-primary-100 text-black py-4 rounded-full font-semibold hover:bg-primary-100 transition-colors"
            onClick={activeTab === "multiply" ? handleOpenMultiply : undefined}
          >
            {activeTab === "multiply"
              ? "Open Multiply Position"
              : `Borrow ${selectedPair?.debtAsset.symbol || "USDC"}`}
          </button>
        )}
      </div>
    </div>
  );
}
