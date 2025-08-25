import { ethers } from "ethers";
import { EISEN_CONFIG } from "@/constants/tokens";

export interface EncodeSwapParams {
  fromToken: string;
  toToken: string;
  amountIn?: string; // wei string of input token
  amountOut?: string; // wei string of output token
  slippageBps?: number; // default 50 (0.50%)
  endpoint?: string; // optional legacy encode endpoint override
  // Eisen public quote API style (recommended)
  fromAddress?: string;
  toAddress?: string;
  chainId?: number; // same-chain swaps: fromChain == toChain
  publicBase?: string; // override public base, defaults to hiker public
}

export interface EncodeSwapResult {
  encoded: string; // 0x bytes for Eisen router path/tx data
}

// Attempts multiple common response shapes used by Eisen encode endpoints
export async function encodeBorrowToCollateralSwap(
  params: EncodeSwapParams
): Promise<EncodeSwapResult> {
  const {
    fromToken,
    toToken,
    amountIn,
    slippageBps = 50,
    fromAddress,
    toAddress,
    chainId,
  } = params;

  const from = ethers.getAddress(fromToken);
  const to = ethers.getAddress(toToken);

  // Preferred: Eisen public quote API (aligns with hh/utils/eisenMockApi.ts)
  const baseUrl = "https://hiker.hetz-01.eisenfinance.com/public";
  const url = new URL(`${baseUrl}/v1/quote`);

  const sender =
    fromAddress && ethers.isAddress(fromAddress)
      ? fromAddress
      : "0x0000000000000000000000000000000000000001";
  const recipient =
    toAddress && ethers.isAddress(toAddress) ? toAddress : sender;
  const cid = Number.isFinite(chainId as number) ? (chainId as number) : 8217; // default Kaia

  // Map fields as EisenQuoteRequest
  url.searchParams.set("fromAddress", sender);
  url.searchParams.set("fromChain", String(cid));
  url.searchParams.set("toChain", String(cid));
  url.searchParams.set("fromToken", from);
  url.searchParams.set("toToken", to);
  if (amountIn) url.searchParams.set("fromAmount", amountIn);
  // If amountOut specified, Eisen API still expects fromAmount; we do not set exactOut here.
  url.searchParams.set("toAddress", recipient);
  // order/integrator/fee optional; set slippage as decimal (e.g., 0.005)
  const slipDec = (slippageBps / 10000).toString();
  url.searchParams.set("slippage", slipDec);
  url.searchParams.set("order", "CHEAPEST");
  url.searchParams.set("integrator", "tgif-leverage-loop");

  const resp = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-EISEN-KEY": EISEN_CONFIG.EISEN_API_KEY,
    },
  });
  if (!resp.ok) throw new Error(`quote ${resp.status}`);
  const q = (await resp.json()) as {
    result?: {
      transactionRequest?: { data?: string };
    };
  };
  const bytes = q?.result?.transactionRequest?.data as string | undefined;
  if (typeof bytes === "string" && bytes.startsWith("0x")) {
    return { encoded: bytes };
    // If structure unexpected, fall through to legacy encode
  }

  throw new Error("Unexpected response structure");
}
