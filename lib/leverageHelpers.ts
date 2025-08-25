import { ethers } from "ethers";
import { DRAGON_SWAP_POOLS } from "@/constants/tokens";
import { calculateLeverageParams, calculateMaxLeverage } from "@/lib/leverage";

interface LeverageApprovalParams {
  signer: ethers.Signer;
  address: string;
  collateralUnderlying: string;
  loopAddress: string;
  collAmtWei: bigint;
}

export async function ensureCollateralApproval({
  signer,
  address,
  collateralUnderlying,
  loopAddress,
  collAmtWei,
}: LeverageApprovalParams): Promise<void> {
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
    console.log("Prompting wallet: ERC20.approve for collateral allowance", {
      asset: collateralUnderlying,
      spender: loopAddress,
      currentAllowance: currentAllowance.toString(),
      requiredAllowance: collAmtWei.toString(),
    });

    const txApprove = await collateralErc20.approve(
      loopAddress,
      ethers.MaxUint256
    );
    await txApprove.wait();
  }
}

interface BorrowDelegationParams {
  signer: ethers.Signer;
  address: string;
  variableDebtAsset: string;
  loopAddress: string;
  flashloanAmtWei: bigint;
  flBps: number;
}

export async function ensureBorrowDelegation({
  signer,
  address,
  variableDebtAsset,
  loopAddress,
  flashloanAmtWei,
  flBps,
}: BorrowDelegationParams): Promise<void> {
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

  // Calculate required allowance with premium
  const bpsNumber = Number.isFinite(flBps)
    ? Math.max(0, Math.floor(Number(flBps)))
    : 0;
  const ONE_WAD = BigInt("1000000000000000000");
  const premiumWad = (BigInt(bpsNumber) * ONE_WAD) / BigInt("10000");
  const premiumWei =
    (flashloanAmtWei * premiumWad + (ONE_WAD - BigInt("1"))) / ONE_WAD;
  const requiredBorrowAllowance = flashloanAmtWei + premiumWei;

  if (currentBorrowAllowance < requiredBorrowAllowance) {
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
}

interface CollateralEnableParams {
  signer: ethers.Signer;
  address: string;
  poolAddress: string;
  collateralUnderlying: string;
  reserveId: number;
}

export async function ensureCollateralEnabled({
  signer,
  address,
  poolAddress,
  collateralUnderlying,
  reserveId,
}: CollateralEnableParams): Promise<void> {
  try {
    const userConfAbi: ethers.InterfaceAbi = [
      "function getUserConfiguration(address user) view returns (uint256)",
    ];

    const poolView = new ethers.Contract(poolAddress, userConfAbi, signer);
    const confData: bigint = await poolView.getUserConfiguration(address);

    const collateralBitPos = BigInt(reserveId * 2 + 1);
    const isUsingCollateral =
      ((confData >> collateralBitPos) & BigInt(1)) === BigInt(1);

    if (!isUsingCollateral) {
      const aavePoolAbi: ethers.InterfaceAbi = [
        "function setUserUseReserveAsCollateral(address asset, bool useAsCollateral)",
      ];

      const poolContract = new ethers.Contract(
        poolAddress,
        aavePoolAbi,
        signer
      );

      console.log(
        "Prompting wallet: setUserUseReserveAsCollateral to enable collateral",
        {
          pool: poolAddress,
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
    console.warn("Skipping collateral enable because read check failed", err);
  }
}

export interface LeverageCalculationParams {
  collateralDecimals: number;
  debtDecimals: number;
  collateralAmount: string;
  multiplier: number;
  collateralPrice: number;
  debtPrice: number;
  flashloanPremiumBps: number;
  maxLtvBps: number;
  initialCollateralHuman: string;
  initialDebtHuman: string;
}

export function calculateLeverageAmounts(params: LeverageCalculationParams) {
  const {
    collateralDecimals,
    debtDecimals,
    collateralAmount,
    multiplier,
    collateralPrice,
    debtPrice,
    flashloanPremiumBps,
    maxLtvBps,
    initialCollateralHuman,
    initialDebtHuman,
  } = params;

  // Convert basis points to decimals
  const flashloanPremiumDec = Number.isFinite(flashloanPremiumBps)
    ? (flashloanPremiumBps / 10000).toString()
    : "0.0009";
  const maxLtvDec = (maxLtvBps / 10000).toString();

  // Calculate max leverage
  const targetLev = Math.max(1, Math.min(multiplier, 25));
  const maxLev = calculateMaxLeverage({
    collateralDecimals,
    debtDecimals,
    initialCollateralAmount: initialCollateralHuman,
    initialDebtAmount: initialDebtHuman,
    additionalCollateralAmount: collateralAmount || "0",
    priceOfCollateral: collateralPrice.toString(),
    priceOfDebt: debtPrice.toString(),
    flashloanPremium: flashloanPremiumDec,
    maxLTV: maxLtvDec,
  });

  const clampedTarget = Math.min(targetLev, maxLev);

  // Calculate leverage parameters
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

  return {
    flashloanAmount: leverageCalc.flashloanAmount,
    ltv: leverageCalc.ltv,
    collateralAmount: leverageCalc.collateralAmount,
    debtAmount: leverageCalc.debtAmount,
    clampedMultiplier: clampedTarget,
  };
}

export function resolvePoolAddress(addressesProvider: string): string {
  // This would normally probe the addresses provider
  // For now, return the direct pool address
  return addressesProvider;
}

export function getDragonSwapPool(debtAssetSymbol: string): string {
  return (
    DRAGON_SWAP_POOLS[debtAssetSymbol as keyof typeof DRAGON_SWAP_POOLS] || ""
  );
}
