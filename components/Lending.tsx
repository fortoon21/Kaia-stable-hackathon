"use client";

import { useState } from "react";
import WalletConnectorV2 from "@/components/WalletConnectorV2";
import { useWeb3 } from "@/lib/web3Provider";

export default function Lending() {
  const [activeTab, setActiveTab] = useState<"borrow" | "multiply">("multiply");
  const [multiplier, setMultiplier] = useState(1.0);
  const [collateralAmount, setCollateralAmount] = useState("");
  const [bottomTab, setBottomTab] = useState<"pair" | "collateral" | "debt">(
    "pair"
  );
  const { isConnected } = useWeb3();

  return (
    <div
      className="relative w-full bg-[#08131f] min-h-screen flex flex-col"
      data-name="Body"
      data-node-id="1:4"
    >
      <div className="pt-16 flex-1 min-h-[1000px]">
        <div
          className="mx-auto w-[1400px] relative mb-8"
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
                      className="absolute inset-0 rounded-[29px]"
                      data-name="Border"
                      data-node-id="1:9"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute border-[#17e3c2] border-[3px] border-solid inset-0 pointer-events-none rounded-[29px]"
                      />
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
                    <div className="absolute bg-blue-500 rounded-full w-8 h-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white font-bold">
                      U
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="absolute left-[120px] top-0">
                <div className="text-[#728395] text-[16px] font-semibold leading-[20px] mb-2">
                  Euler Yield
                </div>
                <div className="flex items-center text-[#f7f7f8] text-[36px] font-medium leading-[48px]">
                  <span>PT-USDe-25SEP2025</span>
                  <span className="text-[#728395] mx-2">/</span>
                  <span>USDC</span>
                  {/* Warning Icon */}
                  <div
                    className="ml-3 bg-[rgba(236,192,51,0.2)] rounded-md size-7 flex items-center justify-center"
                    data-name="Overlay"
                    data-node-id="1:15"
                  >
                    <div className="text-yellow-400 text-sm">⚠️</div>
                  </div>
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
                  <p className="block leading-[42.67px]">22.84M</p>
                </div>
                <div
                  className="absolute flex flex-col font-semibold h-[17px] justify-center left-0 text-[#728395] text-[14px] top-[88.16px] translate-y-[-50%] w-[95.427px]"
                  data-node-id="1:23"
                >
                  <p className="block leading-[20px]">22.85M USDC</p>
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
                  <p className="block leading-[42.67px]">8.31</p>
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
                  <p className="block leading-[42.67px]">39.41</p>
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
          <div className="absolute left-[900px] top-24 h-[650px] w-[420px]">
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
                    {/* Margin Collateral */}
                    <div className="bg-[#040a10] rounded-lg p-6">
                      <div className="text-[#a1acb8] text-sm mb-3">
                        Margin collateral
                      </div>
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          placeholder="0"
                          value={collateralAmount}
                          onChange={(e) => setCollateralAmount(e.target.value)}
                          className="bg-transparent text-white text-2xl w-full outline-none"
                        />
                        <div className="bg-[#10263e] rounded-full px-4 py-2 flex items-center space-x-2">
                          <div className="w-5 h-5 bg-[#17e3c2] rounded-full"></div>
                          <span className="text-white text-sm font-semibold">
                            PT-USDe-25SEP2025
                          </span>
                        </div>
                      </div>
                      <div className="text-[#a1acb8] text-sm mt-3">
                        ~ $
                        {(parseFloat(collateralAmount) * 0.99 || 0).toFixed(2)}
                      </div>
                    </div>

                    {/* Multiplier Section - Only for Multiply Tab */}
                    {activeTab === "multiply" && (
                      <div className="bg-[#040a10] rounded-lg p-6">
                        <div className="text-white text-sm font-semibold mb-4">
                          Multiplier
                        </div>
                        <div className="bg-[#0c1d2f] rounded p-3 mb-4">
                          <div className="flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">
                              {multiplier.toFixed(2)}x
                            </span>
                          </div>
                        </div>
                        <div className="relative mb-4">
                          <input
                            type="range"
                            min="1"
                            max="8.31"
                            step="0.01"
                            value={multiplier}
                            onChange={(e) =>
                              setMultiplier(parseFloat(e.target.value))
                            }
                            className="w-full h-1.5 bg-[rgba(42,229,185,0.2)] rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-[#728395]">
                          <span>1.00X</span>
                          <span className="text-[#435971]">2.83X</span>
                          <span>4.66X</span>
                          <span className="text-[#435971]">6.48X</span>
                          <span>Max (8.31X)</span>
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
                                {(
                                  parseFloat(collateralAmount) * multiplier || 0
                                ).toFixed(2)}{" "}
                                PT-USDe...
                              </div>
                              <div className="text-[#a1acb8] text-sm">
                                $
                                {(
                                  parseFloat(collateralAmount) *
                                    multiplier *
                                    0.99 || 0
                                ).toFixed(2)}
                              </div>
                            </div>
                            <div className="bg-[#10263e] rounded-full px-4 py-2 flex items-center space-x-2">
                              <div className="w-5 h-5 bg-[#17e3c2] rounded-full"></div>
                              <span className="text-white text-sm">
                                PT-USDe...
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
                                {(
                                  parseFloat(collateralAmount) *
                                    (multiplier - 1) || 0
                                ).toFixed(2)}{" "}
                                USDC
                              </div>
                              <div className="text-[#a1acb8] text-sm">
                                $
                                {(
                                  parseFloat(collateralAmount) *
                                    (multiplier - 1) || 0
                                ).toFixed(2)}
                              </div>
                            </div>
                            <div className="bg-[#10263e] rounded-full px-4 py-2 flex items-center space-x-2">
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                U
                              </div>
                              <span className="text-white text-sm">USDC</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Borrow Amount - Only for Borrow Tab */}
                    {activeTab === "borrow" && (
                      <div className="bg-[#08131f] rounded-lg p-4">
                        <div className="text-[#728395] text-sm mb-2">
                          Borrow Amount
                        </div>
                        <div className="flex items-center justify-between">
                          <input
                            type="number"
                            placeholder="0"
                            className="bg-transparent text-white text-xl w-full outline-none"
                          />
                          <div className="bg-[#10263e] rounded-full px-4 py-2 flex items-center space-x-2">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                              U
                            </div>
                            <span className="text-white text-sm">USDC</span>
                          </div>
                        </div>
                        <div className="text-[#a1acb8] text-sm mt-2">
                          Max:{" "}
                          {(parseFloat(collateralAmount) * 0.88 || 0).toFixed(
                            2
                          )}{" "}
                          USDC
                        </div>
                      </div>
                    )}

                    {/* Trading Details/Stats Section */}
                    <div className="bg-[#10263e] rounded-lg p-6 space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#a1acb8]">ROE</span>
                          <span className="text-white">0.00%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#a1acb8]">Current price</span>
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
                      : "Borrow USDC"}
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
                    <div className="w-5 h-5 bg-[#17e3c2] rounded-full"></div>
                    <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
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
                  <div className="w-5 h-5 bg-[#17e3c2] rounded-full"></div>
                  <span className="font-semibold">
                    Collateral PT-USDe-25SEP2025
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
                  <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold">Debt USDC</span>
                </button>
              </div>
            </div>

            {/* Overview Content */}
            <div className="bg-[#0c1d2f] border border-[#14304e] border-t-0 rounded-b-2xl p-8">
              <h2 className="text-white text-xl font-semibold mb-8">
                Overview
              </h2>

              <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-[#728395] text-sm mb-2">
                    Oracle price
                  </div>
                  <div className="text-white text-lg font-medium">$0.99</div>
                  <div className="text-[#a1acb8] text-sm mt-1 flex items-center">
                    PT-USDe-25SEP2025
                    <span className="ml-2">🔗</span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-6 h-6 bg-[#14304e] rounded-xl"></div>
                    <div className="w-6 h-6 bg-[#14304e] rounded-xl"></div>
                    <div className="w-6 h-6 bg-[#14304e] rounded-xl"></div>
                  </div>
                </div>

                <div>
                  <div className="text-[#728395] text-sm mb-2">Supply APY</div>
                  <div className="text-white text-lg font-medium">13.45%</div>
                </div>

                <div>
                  <div className="text-[#728395] text-sm mb-2">Borrow APY</div>
                  <div className="text-white text-lg font-medium">9.90%</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-[#728395] text-sm mb-2">
                    Correlated assets
                  </div>
                  <div className="text-white text-lg">Yes</div>
                </div>

                <div>
                  <div className="text-[#728395] text-sm mb-2">Max LTV</div>
                  <div className="text-white text-lg font-medium">88.00%</div>
                </div>

                <div>
                  <div className="text-[#728395] text-sm mb-2">LLTV</div>
                  <div className="text-white text-lg font-medium">90.00%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[#14304e] max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-[#2ae5b9] rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">C</span>
              </div>
              <span className="text-white font-semibold text-lg">COZY</span>
            </div>
            <p className="text-[#728395] text-sm mb-4">
              The future of DeFi lending and leveraged trading on Kaia Network.
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                className="text-[#728395] hover:text-[#2ae5b9] transition-colors"
              >
                <span className="sr-only">Twitter</span>🐦
              </button>
              <button
                type="button"
                className="text-[#728395] hover:text-[#2ae5b9] transition-colors"
              >
                <span className="sr-only">Discord</span>💬
              </button>
              <button
                type="button"
                className="text-[#728395] hover:text-[#2ae5b9] transition-colors"
              >
                <span className="sr-only">GitHub</span>📝
              </button>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Lending
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Markets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Security
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Bug Bounty
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[#728395] hover:text-white transition-colors text-sm text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 border-t border-[#14304e] flex flex-col md:flex-row justify-between items-center mb-8">
          <p className="text-[#728395] text-sm">
            © 2024 COZY Finance. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-[#728395] text-sm">Built on</span>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-[#2ae5b9] rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">K</span>
              </div>
              <span className="text-white font-semibold text-sm">
                Kaia Network
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
