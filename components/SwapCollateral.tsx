"use client";

import Image from "next/image";
import { useState } from "react";
import NumberInput from "@/components/ui/NumberInput";
import { LAYOUT } from "@/constants/layout";

// Mock available collateral tokens
const AVAILABLE_TOKENS = [
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "1,234.56",
    icon: "$",
    iconBg: "#2775CA",
    imageUrl:
      "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdc.png",
  },
  {
    symbol: "WKAIA",
    name: "Wrapped KAIA",
    balance: "8,923.45",
    icon: "K",
    iconBg: "#2ae5b9",
    imageUrl:
      "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png",
  },
  {
    symbol: "LBTC",
    name: "Lombard Staked BTC",
    balance: "0.0512",
    icon: "₿",
    iconBg: "#f59e0b",
    imageUrl:
      "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/lbtc.png",
  },
  {
    symbol: "USD₮",
    name: "Tether USD",
    balance: "567.89",
    icon: "$",
    iconBg: "#23c09b",
    imageUrl:
      "https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/usdt.png",
  },
];

const TokenSelector = ({
  token,
  onSelect,
  isOpen,
  setIsOpen,
  excludeToken,
}: {
  token: (typeof AVAILABLE_TOKENS)[0];
  onSelect: (token: (typeof AVAILABLE_TOKENS)[0]) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  excludeToken?: (typeof AVAILABLE_TOKENS)[0];
}) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-[#14304e] hover:bg-[#1a3a5c] px-4 py-3 rounded-lg border border-[#14304e] transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
          {token.imageUrl ? (
            <Image
              src={token.imageUrl}
              alt={token.symbol}
              width={32}
              height={32}
              className="object-cover rounded-full"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: token.iconBg }}
            >
              {token.icon}
            </div>
          )}
        </div>
        <div className="text-left">
          <div className="font-semibold text-white">{token.symbol}</div>
          <div className="text-[#728395] text-sm">{token.name}</div>
        </div>
        <svg
          className="w-4 h-4 text-[#728395]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <title>Select Token</title>
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1d2f] border border-[#14304e] rounded-lg shadow-xl z-50">
          {AVAILABLE_TOKENS.filter(
            (t) => t.symbol !== excludeToken?.symbol
          ).map((availableToken) => (
            <button
              key={availableToken.symbol}
              type="button"
              onClick={() => {
                onSelect(availableToken);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-[#14304e] transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                {availableToken.imageUrl ? (
                  <Image
                    src={availableToken.imageUrl}
                    alt={availableToken.symbol}
                    width={32}
                    height={32}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: availableToken.iconBg }}
                  >
                    {availableToken.icon}
                  </div>
                )}
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-white">
                  {availableToken.symbol}
                </div>
                <div className="text-[#728395] text-sm">
                  {availableToken.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {availableToken.balance}
                </div>
                <div className="text-[#728395] text-xs">Balance</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function SwapCollateral() {
  const [fromToken, setFromToken] = useState(AVAILABLE_TOKENS[0]);
  const [toToken, setToToken] = useState(AVAILABLE_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="text-white p-6">
      <div className={`${LAYOUT.MAX_WIDTH_CONTAINER} mx-auto`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Swap Collateral</h1>
          <p className="text-[#728395]">
            Swap between your available collateral tokens
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Swap Interface */}
          <div className="bg-gradient-to-br from-[#0c1d2f] to-[#0a1420] border border-[#14304e] rounded-2xl p-6">
            {/* From Token */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#728395] text-sm font-medium">From</span>
                <span className="text-[#728395] text-sm">
                  Balance: {fromToken.balance} {fromToken.symbol}
                </span>
              </div>
              <div className="bg-[#08131f] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <TokenSelector
                    token={fromToken}
                    onSelect={setFromToken}
                    isOpen={showFromDropdown}
                    setIsOpen={setShowFromDropdown}
                    excludeToken={toToken}
                  />
                  <div className="text-right">
                    <NumberInput
                      value={fromAmount}
                      onChange={setFromAmount}
                      placeholder="0.00"
                      className="text-2xl font-bold text-right max-w-[140px] bg-transparent border-none text-white"
                    />
                    <div className="text-[#728395] text-sm mt-1">~ $0.00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-4">
              <button
                type="button"
                onClick={handleSwapTokens}
                className="bg-[#14304e] hover:bg-[#1a3a5c] rounded-full p-3 transition-all duration-200 transform hover:scale-110"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <title>Swap</title>
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L8.414 8H15a1 1 0 110 2H8.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4zm8 2a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L15.586 14H9a1 1 0 110-2h6.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* To Token */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#728395] text-sm font-medium">To</span>
                <span className="text-[#728395] text-sm">
                  Balance: {toToken.balance} {toToken.symbol}
                </span>
              </div>
              <div className="bg-[#08131f] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <TokenSelector
                    token={toToken}
                    onSelect={setToToken}
                    isOpen={showToDropdown}
                    setIsOpen={setShowToDropdown}
                    excludeToken={fromToken}
                  />
                  <div className="text-right">
                    <NumberInput
                      value={toAmount}
                      onChange={setToAmount}
                      placeholder="0.00"
                      className="text-2xl font-bold text-right max-w-[140px] bg-transparent border-none text-white"
                    />
                    <div className="text-[#728395] text-sm mt-1">~ $0.00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-[#08131f] rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#728395] text-sm">Exchange Rate</span>
                  <span className="font-semibold text-white">
                    1 {fromToken.symbol} = 0.99 {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#728395] text-sm">Price Impact</span>
                  <span className="text-[#2ae5b9] font-semibold">
                    &lt; 0.01%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#728395] text-sm">Network Fee</span>
                  <div className="text-right">
                    <div className="font-semibold text-white">~0.002 ETH</div>
                    <div className="text-[#728395] text-xs">$6.84</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#728395] text-sm">
                    Slippage Tolerance
                  </span>
                  <span className="font-semibold text-white">0.5%</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              className="w-full py-4 px-6 bg-gradient-to-r from-[#2ae5b9] to-[#22c09b] text-black font-semibold rounded-lg hover:from-[#22c09b] hover:to-[#1ea87a] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Swap Collateral
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
