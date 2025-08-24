"use client";

import Image from "next/image";
import { useState } from "react";
import Slider from "@/components/ui/Slider";
import WalletConnectorV2 from "@/components/WalletConnectorV2";
import { useAaveData } from "@/hooks/useAaveData";
import { useLeverageCalculations } from "@/hooks/useLeverageCalculations";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useWeb3 } from "@/lib/web3Provider";
import type { BottomTabType, LendingProps, TabType } from "@/types/lending";
import { calculateUSDValue } from "@/utils/formatters";

export default function Lending({ selectedPair }: LendingProps) {
  const [activeTab, setActiveTab] = useState<TabType>("multiply");
  const [multiplier, setMultiplier] = useState(1.0);
  const [collateralAmount, setCollateralAmount] = useState("");
  const [bottomTab, setBottomTab] = useState<BottomTabType>("pair");
  const [ltvValue, setLtvValue] = useState(0);
  const [ltvInput, setLtvInput] = useState("0.0");
  const [multiplierInput, setMultiplierInput] = useState("1.00");
  const { isConnected } = useWeb3();
  const { collateralBalance, isLoadingBalance } = useTokenBalance(selectedPair);
  const { maxLeverage, leveragePosition, collateralPrice, debtPrice } =
    useLeverageCalculations(selectedPair, collateralAmount, multiplier);
  const {
    getSupplyAPY,
    getBorrowAPY,
    getLTV,
    getLLTV,
    getLiquidity,
    getMaxROE,
  } = useAaveData();

  // Calculate real max multiplier from Markets logic
  const realMaxMultiplier = selectedPair?.collateralAsset?.symbol
    ? (() => {
        const ltv = getLTV(selectedPair.collateralAsset.symbol);
        if (!ltv) return maxLeverage; // fallback to leverage calculation
        const ltvDecimal = parseFloat(ltv.replace("%", "")) / 100;
        return ltvDecimal >= 1 ? 1 : 1 / (1 - ltvDecimal);
      })()
    : maxLeverage;

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
            {/* Header Section - Grouped */}
            <div className="absolute left-0 top-0 w-[740px] h-[120px]">
              {/* Token Icons */}
              <div className="absolute left-0 top-[20px] flex -space-x-3">
                <div
                  className="relative rounded-[30px] size-[60px]"
                  data-name="Border"
                  data-node-id="1:6"
                >
                  <div
                    aria-hidden="true"
                    className="absolute border border-[#14304e] border-solid inset-0 pointer-events-none rounded-[30px]"
                  />
                  <div
                    className="absolute bg-[#14304e] left-px overflow-clip rounded-[29px] size-[58px] top-px"
                    data-name="Background"
                    data-node-id="1:7"
                  >
                    <div
                      className="absolute inset-0 rounded-[29px] flex items-center justify-center"
                      data-name="Border"
                      data-node-id="1:9"
                    >
                      {selectedPair?.collateralAsset.imageUrl ? (
                        <Image
                          src={selectedPair.collateralAsset.imageUrl}
                          alt={selectedPair.collateralAsset.symbol}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover z-10"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-[#17e3c2] rounded-full flex items-center justify-center text-white font-bold z-10">
                          {selectedPair?.collateralAsset.symbol?.[0] || "K"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="relative rounded-[30px] size-[60px] z-10"
                  data-name="Border"
                  data-node-id="1:10"
                >
                  <div
                    aria-hidden="true"
                    className="absolute border border-[#14304e] border-solid inset-0 pointer-events-none rounded-[30px]"
                  />
                  <div
                    className="absolute bg-[#14304e] left-px overflow-clip rounded-[29px] size-[58px] top-px"
                    data-name="Background"
                    data-node-id="1:11"
                  >
                    <div className="absolute inset-0 rounded-[29px] flex items-center justify-center">
                      {selectedPair?.debtAsset.imageUrl ? (
                        <Image
                          src={selectedPair.debtAsset.imageUrl}
                          alt={selectedPair.debtAsset.symbol}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-blue-500 rounded-full w-14 h-14 flex items-center justify-center text-white font-bold">
                          {selectedPair?.debtAsset.symbol?.[0] || "U"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="absolute left-[120px] top-0">
                <div className="text-[#728395] text-[16px] font-semibold leading-[20px] mb-2">
                  {selectedPair?.collateralAsset.protocol || "TGIF Yield"}
                </div>
                <div className="flex items-center text-[#f7f7f8] text-[36px] font-medium leading-[48px]">
                  <span>{selectedPair?.collateralAsset.asset || "Error"}</span>
                  <span className="text-[#728395] mx-2">/</span>
                  <span>{selectedPair?.debtAsset.symbol || "USDC"}</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div
              className="absolute h-[98.66px] left-0 right-4 top-[140px] bg-[#0a1a14]/10 rounded-lg p-2"
              data-name="List"
              data-node-id="1:18"
            >
              <div
                className="absolute leading-[0] left-0 not-italic right-[582px] top-0 bottom-0 bg-[#08131f]/30 rounded-lg"
                data-name="Item"
                data-node-id="1:19"
              >
                <div
                  className="absolute flex flex-col font-semibold h-5 justify-center left-0 text-[#728395] text-[16px] top-2.5 translate-y-[-50%] w-[66.993px]"
                  data-node-id="1:20"
                >
                  <p className="block leading-[20px]">Liquidity</p>
                </div>
                <div
                  className="absolute flex flex-col font-medium h-[39px] justify-center left-0 text-[#728395] text-[32px] top-[48.5px] translate-y-[-50%] w-[20.912px]"
                  data-node-id="1:21"
                >
                  <p className="block leading-[42.67px]">$</p>
                </div>
                <div
                  className="absolute flex flex-col font-medium h-[39px] justify-center left-[26.59px] text-[#f7f7f8] text-[32px] top-[48.5px] translate-y-[-50%] w-[117.772px]"
                  data-node-id="1:22"
                >
                  <p className="block leading-[42.67px]">
                    {selectedPair?.debtAsset?.symbol
                      ? getLiquidity(selectedPair.debtAsset.symbol)?.usdValue?.replace("$", "") || "22.84M"
                      : "22.84M"}
                  </p>
                </div>
                <div
                  className="absolute flex flex-col font-semibold h-[17px] justify-center left-0 text-[#728395] text-[14px] top-[88.16px] translate-y-[-50%] w-[95.427px]"
                  data-node-id="1:23"
                >
                  <p className="block leading-[20px]">
                    {selectedPair?.debtAsset?.symbol
                      ? getLiquidity(selectedPair.debtAsset.symbol)?.amount || "22.85M"
                      : "22.85M"}{" "}
                    {selectedPair?.debtAsset.symbol || "USDC"}
                  </p>
                </div>
              </div>
              <div
                className="absolute leading-[0] left-[275px] not-italic right-[307px] top-0 bottom-0 bg-[#08131f]/30 rounded-lg"
                data-name="Item"
                data-node-id="1:24"
              >
                <div
                  className="absolute flex flex-col font-semibold h-5 justify-center left-0 text-[#728395] text-[16px] top-2.5 translate-y-[-50%] w-[109.729px]"
                  data-node-id="1:25"
                >
                  <p className="block leading-[20px]">Max multiplier</p>
                </div>
                <div
                  className="absolute flex flex-col font-medium h-[39px] justify-center left-0 text-[#f7f7f8] text-[32px] top-[48.5px] translate-y-[-50%] w-[63.875px]"
                  data-node-id="1:26"
                >
                  <p className="block leading-[42.67px]">
                    {realMaxMultiplier > 1 ? realMaxMultiplier.toFixed(2) : "--"}
                  </p>
                </div>
                <div
                  className="absolute flex flex-col font-medium h-[39px] justify-center left-[69.48px] text-[#728395] text-[32px] top-[48.5px] translate-y-[-50%] w-[17.944px]"
                  data-node-id="1:27"
                >
                  <p className="block leading-[42.67px]">x</p>
                </div>
              </div>
              <div
                className="absolute leading-[0] left-[550px] not-italic right-8 top-0 bottom-0 bg-[#08131f]/30 rounded-lg"
                data-name="Item"
                data-node-id="1:28"
              >
                <div
                  className="absolute flex flex-col font-semibold h-5 justify-center left-0 text-[#728395] text-[16px] top-2.5 translate-y-[-50%] w-[90px]"
                  data-node-id="1:29"
                >
                  <p className="block leading-[20px] whitespace-nowrap">
                    Max ROE
                  </p>
                </div>
                <div
                  className="absolute flex flex-col font-medium h-[39px] justify-center left-0 text-[#23c09b] text-[32px] top-[48.5px] translate-y-[-50%] w-[85.221px]"
                  data-node-id="1:30"
                >
                  <p className="block leading-[42.67px]">
                    {selectedPair?.collateralAsset?.symbol && selectedPair?.debtAsset?.symbol
                      ? getMaxROE(selectedPair.collateralAsset.symbol, selectedPair.debtAsset.symbol)?.replace("%", "") || "39.41"
                      : "39.41"}
                  </p>
                </div>
                <div
                  className="absolute flex flex-col font-medium h-[39px] justify-center left-[90.89px] text-[#728395] text-[32px] top-[48.5px] translate-y-[-50%] w-[26.88px]"
                  data-node-id="1:31"
                >
                  <p className="block leading-[42.67px]">%</p>
                </div>
              </div>
            </div>
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
                    className="absolute h-[53px] left-0 w-1/2 rounded top-0 cursor-pointer hover:bg-[#14304e] transition-colors"
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
                            Max ({realMaxMultiplier > 1 ? realMaxMultiplier.toFixed(2) : "-.-"}X)
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

                    {/* Borrow Interface - Only for Borrow Tab */}
                    {activeTab === "borrow" && (
                      <div className="space-y-4">
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
              <div className="flex-shrink-0 bg-[#08131f] rounded-b-2xl border-t border-[#14304e] p-4">
                {!isConnected ? (
                  <WalletConnectorV2 />
                ) : (
                  <button
                    type="button"
                    className="w-full bg-[#2ae5b9] text-black py-4 rounded-full font-semibold hover:bg-[#17e3c2] transition-colors"
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
              <div className="flex w-full">
                <button
                  type="button"
                  onClick={() => setBottomTab("pair")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-5 py-4 border-b-2 ${
                    bottomTab === "pair"
                      ? "border-[#2ae5b9] text-[#ddfbf4]"
                      : "border-transparent text-[#728395] hover:text-white"
                  } transition-colors cursor-pointer`}
                >
                  <div className="flex space-x-1">
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
                    {selectedPair?.debtAsset.imageUrl ? (
                      <Image
                        src={selectedPair.debtAsset.imageUrl}
                        alt={selectedPair.debtAsset.symbol}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="font-semibold">Pair details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("collateral")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-5 py-4 border-b-2 ${
                    bottomTab === "collateral"
                      ? "border-[#2ae5b9] text-[#ddfbf4]"
                      : "border-transparent text-[#728395] hover:text-white"
                  } transition-colors cursor-pointer`}
                >
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
                  <span className="font-semibold">
                    Collateral {selectedPair?.collateralAsset.symbol || "WKAIA"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("debt")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-5 py-4 border-b-2 ${
                    bottomTab === "debt"
                      ? "border-[#2ae5b9] text-[#ddfbf4]"
                      : "border-transparent text-[#728395] hover:text-white"
                  } transition-colors cursor-pointer`}
                >
                  {selectedPair?.debtAsset.imageUrl ? (
                    <Image
                      src={selectedPair.debtAsset.imageUrl}
                      alt={selectedPair.debtAsset.symbol}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                  )}
                  <span className="font-semibold">
                    Debt {selectedPair?.debtAsset.symbol || "USDT0"}
                  </span>
                </button>
              </div>
            </div>

            {/* Content based on selected tab */}
            <div className="bg-[#0c1d2f] border border-[#14304e] border-t-0 rounded-b-2xl p-8">
              {bottomTab === "pair" ? (
                <>
                  <h2 className="text-white text-xl font-semibold mb-8">
                    Overview
                  </h2>

                  <div className="grid grid-cols-3 gap-8 mb-8">
                    <div>
                      <div className="text-[#728395] text-sm mb-2">
                        Oracle price
                      </div>
                      <div className="text-white text-lg font-medium">
                        ${collateralPrice.toFixed(4)}
                      </div>
                      <div className="text-[#a1acb8] text-xs mt-1 flex items-center">
                        {selectedPair?.collateralAsset.asset ||
                          "PT-USDe-25SEP2025"}
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          className="ml-1.5 w-3 h-3 text-[#a1acb8]"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path
                            fill="currentColor"
                            d="M103 497c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55L424 408c13.3 0 24-10.7 24-24s-10.7-24-24-24L81.9 360l55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L7 367c-9.4 9.4-9.4 24.6 0 33.9l96 96zM441 145c9.4-9.4 9.4-24.6 0-33.9L345 15c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l55 55L24 104c-13.3 0-24 10.7-24 24s10.7 24 24 24l342.1 0-55 55c9.4-9.4 9.4-24.6 0 33.9s24.6 9.4 33.9 0l96-96z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <div className="text-[#728395] text-sm mb-2">
                        Supply APY
                      </div>
                      <div className="text-white text-lg font-medium">
                        {bottomTab === "collateral" 
                          ? (selectedPair?.collateralAsset?.symbol
                              ? getSupplyAPY(selectedPair.collateralAsset.symbol) || "13.45%"
                              : "13.45%")
                          : (selectedPair?.debtAsset?.symbol
                              ? getSupplyAPY(selectedPair.debtAsset.symbol) || "13.45%"
                              : "13.45%")
                        }
                      </div>
                    </div>

                    <div>
                      <div className="text-[#728395] text-sm mb-2">
                        Borrow APY
                      </div>
                      <div className="text-white text-lg font-medium">
                        {bottomTab === "collateral" 
                          ? (selectedPair?.collateralAsset?.symbol
                              ? getBorrowAPY(selectedPair.collateralAsset.symbol) || "9.90%"
                              : "9.90%")
                          : (selectedPair?.debtAsset?.symbol
                              ? getBorrowAPY(selectedPair.debtAsset.symbol) || "9.90%"
                              : "9.90%")
                        }
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-[#728395] text-sm mb-2">
                        Correlated assets
                      </div>
                      <div className="text-white text-lg">
                        {selectedPair?.collateralAsset?.symbol === "WKAIA" || 
                         selectedPair?.debtAsset?.symbol === "WKAIA" ? "No" : "Yes"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[#728395] text-sm mb-2">Max LTV</div>
                      <div className="text-white text-lg font-medium">
                        {selectedPair?.collateralAsset?.symbol
                          ? getLTV(selectedPair.collateralAsset.symbol) || "88.00%"
                          : "88.00%"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[#728395] text-sm mb-2">LLTV</div>
                      <div className="text-white text-lg font-medium">
                        {selectedPair?.collateralAsset?.symbol
                          ? getLLTV(selectedPair.collateralAsset.symbol) || "90.00%"
                          : "90.00%"}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-white text-xl font-semibold mb-8">
                    Statistics
                  </h2>

                  <div className="space-y-8">
                    {/* First row - Total supply, Total borrowed, Available liquidity */}
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <div className="text-[#728395] text-sm mb-2">
                          Total supply
                        </div>
                        <div className="text-white text-lg font-medium">
                          ${bottomTab === "collateral" ? "2.85M" : "1.24M"}
                        </div>
                        <div className="text-[#a1acb8] text-xs mt-1">
                          {bottomTab === "collateral"
                            ? `${(2850000 / collateralPrice).toLocaleString()} ${selectedPair?.collateralAsset.symbol || "WKAIA"}`
                            : `${(1240000 / debtPrice).toLocaleString()} ${selectedPair?.debtAsset.symbol || "USDT0"}`}
                        </div>
                      </div>

                      <div>
                        <div className="text-[#728395] text-sm mb-2">
                          Total borrowed
                        </div>
                        <div className="text-white text-lg font-medium">
                          ${bottomTab === "collateral" ? "2.34M" : "896K"}
                        </div>
                        <div className="text-[#a1acb8] text-xs mt-1">
                          {bottomTab === "collateral"
                            ? `${(2340000 / collateralPrice).toLocaleString()} ${selectedPair?.collateralAsset.symbol || "WKAIA"}`
                            : `${(896000 / debtPrice).toLocaleString()} ${selectedPair?.debtAsset.symbol || "USDT0"}`}
                        </div>
                      </div>

                      <div>
                        <div className="text-[#728395] text-sm mb-2">
                          Available liquidity
                        </div>
                        <div className="text-white text-lg font-medium">
                          {selectedPair?.debtAsset?.symbol
                            ? getLiquidity(selectedPair.debtAsset.symbol)?.usdValue || "$506.7K"
                            : "$506.7K"}
                        </div>
                        <div className="text-[#a1acb8] text-xs mt-1">
                          {selectedPair?.debtAsset?.symbol
                            ? getLiquidity(selectedPair.debtAsset.symbol)?.amount
                            : selectedPair?.liquidityAmount}{" "}
                          {selectedPair?.debtAsset?.symbol || selectedPair?.liquidityToken}
                        </div>
                      </div>
                    </div>

                    {/* Second row - Supply APY, Borrow APY, Empty */}
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <div className="text-[#728395] text-sm mb-2">
                          Supply APY
                        </div>
                        <div className="text-[#2ae5b9] text-lg font-medium">
                          {bottomTab === "pair"
                            ? (selectedPair?.collateralAsset?.symbol
                                ? getSupplyAPY(selectedPair.collateralAsset.symbol) || "8.83%"
                                : "8.83%")
                            : bottomTab === "collateral" 
                              ? (selectedPair?.collateralAsset?.symbol
                                  ? getSupplyAPY(selectedPair.collateralAsset.symbol) || "8.83%"
                                  : "8.83%")
                              : (selectedPair?.debtAsset?.symbol
                                  ? getSupplyAPY(selectedPair.debtAsset.symbol) || "8.83%"
                                  : "8.83%")
                          }
                        </div>
                      </div>

                      <div>
                        <div className="text-[#728395] text-sm mb-2">
                          Borrow APY
                        </div>
                        <div className="text-orange-400 text-lg font-medium">
                          {bottomTab === "pair"
                            ? (selectedPair?.debtAsset?.symbol
                                ? getBorrowAPY(selectedPair.debtAsset.symbol) || "5.40%"
                                : "5.40%")
                            : bottomTab === "collateral" 
                              ? (selectedPair?.collateralAsset?.symbol
                                  ? getBorrowAPY(selectedPair.collateralAsset.symbol) || "5.40%"
                                  : "5.40%")
                              : (selectedPair?.debtAsset?.symbol
                                  ? getBorrowAPY(selectedPair.debtAsset.symbol) || "5.40%"
                                  : "5.40%")
                          }
                        </div>
                      </div>

                      <div>
                        {/* Empty space for alignment */}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
