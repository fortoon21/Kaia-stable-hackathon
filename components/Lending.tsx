"use client";

import { ethers } from "ethers";
import Image from "next/image";
import { useCallback, useState } from "react";
import Slider from "@/components/ui/Slider";
import WalletConnectorV2 from "@/components/WalletConnectorV2";
import { LendingBottomTabs } from "@/components/lending/LendingBottomTabs";
import { LendingHeader } from "@/components/lending/LendingHeader";
import { LendingOverviewTab } from "@/components/lending/LendingOverviewTab";
import { LendingStatisticsTab } from "@/components/lending/LendingStatisticsTab";
import { LendingStatsSection } from "@/components/lending/LendingStatsSection";
import {
  DRAGON_SWAP_POOLS,
  LOOP_CONFIG,
  TOKEN_DECIMALS,
  AAVE_CONFIG,
} from "@/constants/tokens";
import { useAaveData } from "@/hooks/useAaveData";
import { useLeverageCalculations } from "@/hooks/useLeverageCalculations";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { encodeBorrowToCollateralSwap } from "@/lib/eisen";
import { calculateLeverageParams, calculateMaxLeverage } from "@/lib/leverage";
import { useWeb3 } from "@/lib/web3Provider";
import type { BottomTabType, LendingProps, TabType } from "@/types/lending";
import { calculateUSDValue } from "@/utils/formatters";
import { getTokenAddress } from "@/utils/tokenHelpers";

export default function Lending({ selectedPair }: LendingProps) {
  const [activeTab, setActiveTab] = useState<TabType>("multiply");
  const [multiplier, setMultiplier] = useState(1.0);
  const [collateralAmount, setCollateralAmount] = useState("");
  const [bottomTab, setBottomTab] = useState<BottomTabType>("pair");
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
  const { getLTV } = useAaveData();

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
        // eslint-disable-next-line no-console
        console.log(
          "Prompting wallet: ERC20.approve for collateral allowance",
          {
            asset: collateralUnderlying,
            spender: loopAddress,
            currentAllowance: currentAllowance.toString(),
            requiredAllowance: collAmtWei.toString(),
          }
        );
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
      console.log("variable debt asset", variableDebtAsset);
      console.log("loop address", loopAddress);
      console.log("current borrow allowance", currentBorrowAllowance);
      console.log("required borrow allowance", requiredBorrowAllowance);
      if (currentBorrowAllowance < requiredBorrowAllowance) {
        // eslint-disable-next-line no-console
        console.log(
          "Prompting wallet: approveDelegation for variable debt delegation",
          {
            debtToken: variableDebtAsset,
            delegatee: loopAddress,
            currentBorrowAllowance: currentBorrowAllowance.toString(),
            requiredBorrowAllowance: requiredBorrowAllowance.toString(),
          }
        );
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
          // eslint-disable-next-line no-console
          console.log(
            "Prompting wallet: setUserUseReserveAsCollateral to enable collateral",
            {
              pool,
              asset: collateralUnderlying,
              useAsCollateral: true,
            }
          );
          const txEnable = await poolContract.setUserUseReserveAsCollateral(
            collateralUnderlying,
            true
          );
          await txEnable.wait();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          "Skipping collateral enable because read check failed",
          err
        );
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
        string
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
      className="relative w-full flex flex-col"
      data-name="Body"
      data-node-id="1:4"
    >
      <div className="pt-20 flex-1">
        <div
          className="mx-auto w-[1400px] relative mb-8 min-h-[900px]"
          data-name="Container"
          data-node-id="1:5"
        >
          {/* Combined Header and Stats Wrapper */}
          <div className="absolute left-[80px] top-12 w-[780px] h-[280px] bg-[#0a1a14]/5 rounded-lg p-4">
            {/* Header Section - Component */}
            <div className="absolute left-0 top-0 w-[740px] h-[120px]">
              <LendingHeader selectedPair={selectedPair} />
            </div>

            {/* Stats Section - Using Component */}
            <LendingStatsSection
              selectedPair={selectedPair}
              realMaxMultiplier={realMaxMultiplier}
            />
          </div>
          <div className="absolute left-[900px] top-24 w-[420px] h-[650px]">
            <div
              className="bg-[#0c1d2f] h-full pointer-events-auto rounded-2xl flex flex-col"
              data-name="Background+Border"
              data-node-id="1:32"
            >
              <div
                aria-hidden="true"
                className="absolute border border-[#14304e] border-solid inset-0 pointer-events-none rounded-2xl"
              />
              <div
                className="bg-[#08131f] h-[53px] rounded-tl-[16px] rounded-tr-[16px] flex-shrink-0"
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
                    className="absolute h-[53px] left-0 w-1/2 rounded top-0 cursor-pointer hover:bg-[#14304e] transition-colors relative"
                    data-name="Tab"
                    data-node-id="1:35"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute border-[#14304e] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded"
                    />
                    <div
                      className={`absolute flex flex-col font-normal h-5 justify-center leading-[0] not-italic text-[16px] text-center translate-x-[-50%] translate-y-[-50%] w-[54.205px] ${
                        activeTab === "borrow"
                          ? "text-[#ddfbf4]"
                          : "text-[#728395]"
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
                      <span className="text-xs text-[#2ae5b9] font-medium bg-[#0c1d2f] px-1.5 py-0.5 rounded">
                        Coming Soon
                      </span>
                    </div>
                    {activeTab === "borrow" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ae5b9]"></div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("multiply")}
                    className="absolute h-[53px] right-0 w-1/2 rounded top-0 cursor-pointer hover:bg-[#14304e] transition-colors"
                    data-name="Tab"
                    data-node-id="1:37"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute border-[#14304e] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded"
                    />
                    <div
                      className={`absolute flex flex-col font-normal h-5 justify-center leading-[0] not-italic text-[16px] text-center translate-x-[-50%] translate-y-[-50%] w-[59.773px] ${
                        activeTab === "multiply"
                          ? "text-[#ddfbf4]"
                          : "text-[#728395]"
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
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ae5b9]"></div>
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
                      <div className="bg-[#040a10] rounded-lg p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[#a1acb8] text-sm">
                            Margin collateral
                          </div>
                          {isConnected && (
                            <div className="flex items-center space-x-2">
                              <div className="text-[#728395] text-xs">
                                <span>Balance: </span>
                                <span className="tabular-nums font-mono">
                                  {isLoadingBalance ? "..." : collateralBalance}
                                </span>
                                <span>
                                  {" "}
                                  {selectedPair?.collateralAsset.symbol ||
                                    "WKAIA"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setCollateralAmount(collateralBalance || "0")
                                }
                                className="bg-[#14304e] hover:bg-[#1a3d5c] text-[#2ae5b9] text-xs px-2 py-1 rounded transition-colors"
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
                            onChange={(e) =>
                              setCollateralAmount(e.target.value)
                            }
                            className="bg-transparent text-white text-2xl w-full outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          />
                          <div className="bg-[#10263e] rounded-full px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                            {selectedPair?.collateralAsset.imageUrl ? (
                              <Image
                                src={selectedPair.collateralAsset.imageUrl}
                                alt={selectedPair.collateralAsset.symbol}
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full"
                              />
                            ) : (
                              <div className="w-5 h-5 bg-[#17e3c2] rounded-full"></div>
                            )}
                            <span className="text-white text-sm font-semibold">
                              {selectedPair?.collateralAsset.symbol ||
                                "PT-USDe"}
                            </span>
                          </div>
                        </div>
                        <div className="text-[#a1acb8] text-sm mt-3">
                          ~{" "}
                          {calculateUSDValue(
                            collateralAmount || "0",
                            collateralPrice
                          )}
                        </div>
                      </div>
                    )}

                    {/* Multiplier Section - Only for Multiply Tab */}
                    {activeTab === "multiply" && (
                      <div className="bg-[#040a10] rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-white text-sm font-semibold">
                            Multiplier
                          </div>
                          <div className="bg-[#0c1d2f] rounded px-3 py-1 flex items-center">
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
                              className="text-white text-sm font-semibold bg-transparent w-12 text-right outline-none"
                            />
                            <span className="text-white text-sm font-semibold ml-0.5">
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
                        <div className="flex justify-between text-xs text-[#728395]">
                          <span>1.00X</span>
                          <span className="text-[#435971]">
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
                          <span className="text-[#435971]">
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
                        <div className="bg-[#08131f] rounded-lg p-4">
                          <div className="text-[#728395] text-sm mb-2">
                            Long
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white">
                                {/* Long = collateralAmount * multiplier */}
                                {(
                                  parseFloat(collateralAmount || "0") *
                                  multiplier
                                ).toFixed(2)}{" "}
                                {selectedPair?.collateralAsset.symbol ||
                                  "PT-USDe"}
                              </div>
                              <div className="text-[#a1acb8] text-sm">
                                {calculateUSDValue(
                                  (
                                    parseFloat(collateralAmount || "0") *
                                    multiplier
                                  ).toString(),
                                  collateralPrice
                                )}
                              </div>
                            </div>
                            <div className="bg-[#10263e] rounded-full px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                              {selectedPair?.collateralAsset.imageUrl ? (
                                <Image
                                  src={selectedPair.collateralAsset.imageUrl}
                                  alt={selectedPair.collateralAsset.symbol}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 rounded-full"
                                />
                              ) : (
                                <div className="w-5 h-5 bg-[#17e3c2] rounded-full"></div>
                              )}
                              <span className="text-white text-sm">
                                {selectedPair?.collateralAsset.symbol ||
                                  "PT-USDe"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Short Position */}
                        <div className="bg-[#08131f] rounded-lg p-4">
                          <div className="text-[#728395] text-sm mb-2">
                            Short
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white">
                                {/* Short = flashloan amount (borrowed debt) */}
                                {parseFloat(
                                  leveragePosition.flashloanAmount || "0"
                                ).toFixed(2)}{" "}
                                {selectedPair?.debtAsset.symbol || "USDC"}
                              </div>
                              <div className="text-[#a1acb8] text-sm">
                                {calculateUSDValue(
                                  leveragePosition.flashloanAmount || "0",
                                  debtPrice
                                )}
                              </div>
                            </div>
                            <div className="bg-[#10263e] rounded-full px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                              {selectedPair?.debtAsset.imageUrl ? (
                                <Image
                                  src={selectedPair.debtAsset.imageUrl}
                                  alt={selectedPair.debtAsset.symbol}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 rounded-full"
                                />
                              ) : (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                  {selectedPair?.debtAsset.symbol?.[0] || "U"}
                                </div>
                              )}
                              <span className="text-white text-sm">
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
                        <div className="bg-[#040a10] rounded-lg p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[#a1acb8] text-sm">
                              Supply{" "}
                              {selectedPair?.collateralAsset.symbol || "USDC"}
                            </div>
                            <div className="text-xs text-[#728395]">
                              <span className="mr-2">Market</span>
                              <span>Euler Base</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              placeholder="0"
                              className="bg-transparent text-white text-2xl w-full outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                            />
                            <div className="bg-[#10263e] rounded-full px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                              {selectedPair?.collateralAsset.imageUrl ? (
                                <Image
                                  src={selectedPair.collateralAsset.imageUrl}
                                  alt={selectedPair.collateralAsset.symbol}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 rounded-full"
                                />
                              ) : (
                                <div className="w-5 h-5 bg-[#17e3c2] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {selectedPair?.collateralAsset.symbol?.[0] ||
                                    "K"}
                                </div>
                              )}
                              <span className="text-white text-sm font-semibold">
                                {selectedPair?.collateralAsset.symbol || "USDC"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-3">
                            <div className="text-[#a1acb8]">~ $0.00</div>
                            <div className="flex items-center space-x-2">
                              <div className="text-[#728395]">
                                <span>Balance: </span>
                                <span className="tabular-nums font-mono">
                                  {isLoadingBalance ? "..." : collateralBalance}
                                </span>
                                <span>
                                  {" "}
                                  {selectedPair?.collateralAsset.symbol ||
                                    "USDC"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setCollateralAmount(collateralBalance || "0")
                                }
                                className="px-2 py-1 bg-[#14304e] text-[#2ae5b9] text-xs font-semibold rounded hover:bg-[#1a3a5c] transition-colors"
                              >
                                MAX
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Borrow Section */}
                        <div className="bg-[#040a10] rounded-lg p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[#a1acb8] text-sm">
                              Borrow {selectedPair?.debtAsset.symbol || "USDS"}
                            </div>
                            <div className="text-xs text-[#728395]">
                              <span className="mr-2">Market</span>
                              <span>Euler Base</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              placeholder="0"
                              className="bg-transparent text-white text-2xl w-full outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                            />
                            <div className="bg-[#10263e] rounded-full px-3 py-1.5 flex items-center space-x-2 flex-shrink-0">
                              {selectedPair?.debtAsset.imageUrl ? (
                                <Image
                                  src={selectedPair.debtAsset.imageUrl}
                                  alt={selectedPair.debtAsset.symbol}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 rounded-full"
                                />
                              ) : (
                                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {selectedPair?.debtAsset.symbol?.[0] || "U"}
                                </div>
                              )}
                              <span className="text-white text-sm font-semibold">
                                {selectedPair?.debtAsset.symbol || "USDS"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-3">
                            <div className="text-[#a1acb8]">~ $0.00</div>
                            <div className="text-[#728395]">Max borrow 0</div>
                          </div>
                        </div>

                        {/* LTV Section */}
                        <div className="bg-[#040a10] rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-white text-sm font-semibold">
                              LTV
                            </div>
                            <div className="bg-[#0c1d2f] rounded px-3 py-1 flex items-center">
                              <input
                                type="text"
                                value={ltvInput}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    /^\d*\.?\d*$/.test(value)
                                  ) {
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
                                className="text-white text-sm font-semibold bg-transparent w-10 text-right outline-none"
                              />
                              <span className="text-white text-sm font-semibold ml-0.5">
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
                          <div className="flex justify-between text-xs text-[#728395]">
                            <span>0.00%</span>
                            <span>23.00%</span>
                            <span>47.00%</span>
                            <span>70.00%</span>
                            <span>93.00%</span>
                          </div>
                        </div>

                        {/* Details Section */}
                        <div className="bg-[#040a10] rounded-lg p-6 space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">Net APY ⚙️</span>
                            <span className="text-white">0.00%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Current oracle price
                            </span>
                            <span className="text-white">
                              $1.00{" "}
                              <span className="text-[#a1acb8]">USDC ⇄</span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Liquidation oracle price
                            </span>
                            <span className="text-white">-</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Your LTV (LLTV)
                            </span>
                            <span className="text-white">∞ (∞)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">Your health</span>
                            <span className="text-white">-</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Estimated gas fee
                            </span>
                            <div className="text-right">
                              <div className="text-white">
                                {"<0.000001 ETH"}
                              </div>
                              <div className="text-[#a1acb8] text-xs">
                                {"<$0.01"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Trading Details/Stats Section - Only for Multiply Tab */}
                    {activeTab === "multiply" && (
                      <div className="bg-[#10263e] rounded-lg p-6 space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">ROE</span>
                            <span className="text-white">0.00%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Current price
                            </span>
                            <span className="text-white">-</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Liquidation oracle price
                            </span>
                            <span className="text-white">-</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Your LTV (LLTV)
                            </span>
                            <span className="text-white">
                              ∞ <span className="text-[#a1acb8]">(∞)</span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">Your health</span>
                            <span className="text-white">-</span>
                          </div>
                        </div>

                        <hr className="border-[#14304e]" />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">Swap</span>
                            <span className="text-white">-</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">Price impact</span>
                            <span className="text-white">-</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Leveraged price impact
                            </span>
                            <span className="text-white">-</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Slippage tolerance
                            </span>
                            <span className="text-white">0.1%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">Routed via</span>
                            <span className="text-white">-</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a1acb8]">
                              Estimated gas fee
                            </span>
                            <span className="text-white">
                              0 ETH <span className="text-[#a1acb8]">$0</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Action Button */}
              <div className={`flex-shrink-0 bg-[#08131f] rounded-b-2xl border-t border-[#14304e] p-4 ${activeTab === "borrow" ? "blur-sm opacity-50 pointer-events-none" : ""}`}>
                {!isConnected ? (
                  <WalletConnectorV2 />
                ) : (
                  <button
                    type="button"
                    className="w-full bg-[#2ae5b9] text-black py-4 rounded-full font-semibold hover:bg-[#17e3c2] transition-colors"
                    onClick={
                      activeTab === "multiply" ? handleOpenMultiply : undefined
                    }
                  >
                    {activeTab === "multiply"
                      ? "Open Multiply Position"
                      : `Borrow ${selectedPair?.debtAsset.symbol || "USDC"}`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Tabs and Overview */}
          <div className="absolute left-[80px] w-[780px] top-[332px]">
            {/* Tabs */}
            <div className="h-auto bg-[#0c1d2f] border border-[#14304e] rounded-t-2xl">
              <LendingBottomTabs 
                activeTab={bottomTab} 
                onTabChange={setBottomTab}
                selectedPair={selectedPair}
              />
            </div>

            {/* Content based on selected tab */}
            <div className="bg-[#0c1d2f] border border-[#14304e] border-t-0 rounded-b-2xl p-8">
              {bottomTab === "pair" ? (
                <LendingOverviewTab
                  selectedPair={selectedPair}
                  collateralPrice={collateralPrice}
                />
              ) : (
                <LendingStatisticsTab
                  selectedPair={selectedPair}
                  bottomTab={bottomTab}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
