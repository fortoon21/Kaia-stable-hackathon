import Big from "big.js";

// Set a higher precision for big.js to avoid rounding errors.
Big.DP = 40;

const EXP18 = new Big(10).pow(18);

/**
 * @description The parameters for calculating the maximum leverage.
 * All amount and price inputs should be provided as decimal strings (e.g., "10.5", "0.8").
 */
export interface CalculateMaxLeverageParams {
  /** @description The number of decimals for the collateral token. */
  collateralDecimals: number;
  /** @description The number of decimals for the debt token. */
  debtDecimals: number;
  /** @description The initial amount of collateral in the position. */
  initialCollateralAmount: string;
  /** @description The initial amount of debt in the position. */
  initialDebtAmount: string;
  /** @description The additional collateral being deposited. */
  additionalCollateralAmount: string;
  /** @description The price of the collateral token in a quote currency (e.g., USD). */
  priceOfCollateral: string;
  /** @description The price of the debt token in a quote currency (e.g., USD). */
  priceOfDebt: string;
  /** @description The flashloan premium as a decimal (e.g., "0.0009" for 9 bps). */
  flashloanPremium: string;
  /** @description The maximum Loan-to-Value ratio as a decimal (e.g., "0.80" for 80%). */
  maxLTV: string;
}

/**
 * Calculates the maximum possible leverage for a given position and market conditions.
 * Direct port from leverage_ui.html lines 578-594
 * @param params The parameters for the calculation.
 * @returns The maximum leverage multiplier, capped at 25 for safety. Returns 1 if leverage is not possible or calculation is invalid.
 */
export function calculateMaxLeverage({
  collateralDecimals,
  debtDecimals,
  initialCollateralAmount,
  initialDebtAmount,
  additionalCollateralAmount,
  priceOfCollateral,
  priceOfDebt,
  flashloanPremium,
  maxLTV,
}: CalculateMaxLeverageParams): number {
  try {
    // Convert inputs to Big numbers and scale to native decimals
    const collDecBI = new Big(10).pow(collateralDecimals);
    const debtDecBI = new Big(10).pow(debtDecimals);

    const initialCollateral = new Big(initialCollateralAmount).times(collDecBI);
    const additionalCollateral = new Big(additionalCollateralAmount).times(
      collDecBI
    );
    const initialDebt = new Big(initialDebtAmount).times(debtDecBI);
    const totColl = initialCollateral.plus(additionalCollateral);

    // Scale prices and parameters to 1e18
    const pc = new Big(priceOfCollateral).times(EXP18);
    const pd = new Big(priceOfDebt).times(EXP18);
    const fl = new Big(flashloanPremium).times(EXP18);
    const maxLTV_bi = new Big(maxLTV).times(EXP18);

    // Direct port from HTML lines 584-586
    // const num1 = pc * (EXP18 + fl) * totColl * debtDecBI;
    const num1 = pc.times(EXP18.plus(fl)).times(totColl).times(debtDecBI);
    // const num2 = pd * initialDebtAmount * EXP18 * collDecBI;
    const num2 = pd.times(initialDebt).times(EXP18).times(collDecBI);
    const numerator = num1.minus(num2);

    // const denominator = pc * totColl * (EXP18 + fl - maxLTV) * debtDecBI;
    const denominator = pc
      .times(totColl)
      .times(EXP18.plus(fl).minus(maxLTV_bi))
      .times(debtDecBI);

    if (denominator.eq(0)) return 1;

    // const maxLevBI = (numerator * EXP18) / denominator;
    const maxLevBI = numerator.times(EXP18).div(denominator);
    const maxLev = maxLevBI.div(EXP18).toNumber();

    if (!Number.isFinite(maxLev) || maxLev <= 1) return 1;

    // Cap for UI sanity
    return Math.min(maxLev, 25);
  } catch (_error) {
    return 1;
  }
}

/**
 * @description The parameters for calculating leverage position details.
 */
export interface CalculateLeverageParams {
  /** @description The number of decimals for the collateral token. */
  collateralDecimals: number;
  /** @description The number of decimals for the debt token. */
  debtDecimals: number;
  /** @description The initial amount of collateral in the position. */
  initialCollateralAmount: string;
  /** @description The initial amount of debt in the position. */
  initialDebtAmount: string;
  /** @description The additional collateral being deposited. */
  additionalCollateralAmount: string;
  /** @description The target leverage multiplier (e.g., "2.5" for 2.5x). */
  targetLeverage: string;
  /** @description The price of the collateral token in a quote currency (e.g., USD). */
  priceOfCollateral: string;
  /** @description The price of the debt token in a quote currency (e.g., USD). */
  priceOfDebt: string;
  /** @description The flashloan premium as a decimal (e.g., "0.0009" for 9 bps). */
  flashloanPremium: string;
}

/**
 * @description The result of leverage calculation.
 */
export interface LeverageResult {
  /** @description The amount that needs to be borrowed via flashloan. */
  flashloanAmount: string;
  /** @description The loan-to-value ratio as a decimal. */
  ltv: string;
  /** @description The final collateral amount after leverage. */
  collateralAmount: string;
  /** @description The final debt amount after leverage. */
  debtAmount: string;
}

/**
 * Calculates the leverage position details based on target leverage multiplier.
 * Direct port of calcLeverageParams from leverage_ui.html lines 691-738
 * @param params The parameters for the calculation.
 * @returns The leverage calculation results.
 */
export function calculateLeverageParams({
  collateralDecimals,
  debtDecimals,
  initialCollateralAmount,
  initialDebtAmount,
  additionalCollateralAmount,
  targetLeverage,
  priceOfCollateral,
  priceOfDebt,
  flashloanPremium,
}: CalculateLeverageParams): LeverageResult {
  try {
    // Convert inputs to Big numbers with native decimals
    const collDecBI = new Big(10).pow(collateralDecimals);
    const debtDecBI = new Big(10).pow(debtDecimals);

    const initialCollateral = new Big(initialCollateralAmount).times(collDecBI);
    const additionalCollateral = new Big(additionalCollateralAmount).times(
      collDecBI
    );
    const initialDebt = new Big(initialDebtAmount).times(debtDecBI);
    const totColl = initialCollateral.plus(additionalCollateral);

    // Scale prices and parameters to 1e18
    const pc = new Big(priceOfCollateral).times(EXP18);
    const pd = new Big(priceOfDebt).times(EXP18);
    const _fl = new Big(flashloanPremium).times(EXP18);
    const tL = new Big(targetLeverage).times(EXP18);

    // Direct port from HTML lines 696-703
    // const flashloanDebtValueNeeded = ((tL - EXP18) * (collateralAmount + initialCollateralAmount) * pc * debtDecBI) / pd / EXP18 / collDecBI;
    const flashloanDebtValueNeeded = tL
      .minus(EXP18)
      .times(totColl)
      .times(pc)
      .times(debtDecBI)
      .div(pd.eq(0) ? new Big(1) : pd)
      .div(EXP18)
      .div(collDecBI.eq(0) ? new Big(1) : collDecBI);

    if (flashloanDebtValueNeeded.lt(0)) {
      throw new Error(
        "Calculated flashloan debt value is negative. Target leverage is too low or initial debt too high for a leverage operation."
      );
    }

    // Calculate flashloan collateral amount (line 711-712)
    const calculatedFlashloanCollateralAmount = flashloanDebtValueNeeded
      .times(pd)
      .times(collDecBI)
      .div(pc)
      .div(debtDecBI);

    // Adjust for premium (line 715-716) - not used in final flashloan amount
    // const flashloanAmountWithPremium = flashloanDebtValueNeeded.times(EXP18.plus(fl)).div(EXP18);

    // Calculate post-leverage amounts (line 722-726)
    const postColl = initialCollateral
      .plus(additionalCollateral)
      .plus(calculatedFlashloanCollateralAmount);
    const postDebt = initialDebt.plus(flashloanDebtValueNeeded);

    // Calculate LTV (line 729-731)
    const finalTotalCollateralValue = postColl.times(pc).div(collDecBI);
    const finalTotalDebtValue = postDebt.times(pd).div(debtDecBI);
    const ltv = finalTotalDebtValue
      .times(EXP18)
      .div(
        finalTotalCollateralValue.eq(0) ? new Big(1) : finalTotalCollateralValue
      );

    return {
      flashloanAmount: flashloanDebtValueNeeded.div(debtDecBI).toFixed(6),
      ltv: ltv.div(EXP18).toFixed(6),
      collateralAmount: postColl.div(collDecBI).toFixed(6),
      debtAmount: postDebt.div(debtDecBI).toFixed(6),
    };
  } catch (_error) {
    return {
      flashloanAmount: "0",
      ltv: "0",
      collateralAmount: additionalCollateralAmount,
      debtAmount: "0",
    };
  }
}

/**
 * Calculates current LTV as a plain price-weighted ratio using unit amounts.
 * Matches the HTML tester/reference behavior: decimals cancel out when
 * amounts are interpreted as human-readable units.
 */
export function calculateCurrentLTV({
  collateralAmount,
  debtAmount,
  priceOfCollateral,
  priceOfDebt,
}: {
  collateralAmount: string;
  debtAmount: string;
  priceOfCollateral: string;
  priceOfDebt: string;
}): number {
  try {
    const coll = new Big(collateralAmount || "0");
    const debt = new Big(debtAmount || "0");
    const pc = new Big(priceOfCollateral || "0");
    const pd = new Big(priceOfDebt || "0");
    if (coll.lte(0) || pc.lte(0)) return 0;
    const ltv = debt.times(pd).div(coll.times(pc));
    const out = Number(ltv.toString());
    return Number.isFinite(out) ? out : 0;
  } catch (_) {
    return 0;
  }
}

/**
 * Computes the maximum Return on Equity (ROE) at max LTV using supply/borrow APYs.
 * Inputs are decimals (e.g., 0.065 for 6.5%).
 * Formula (multiplied position): ROE_max = (supplyAPY − maxLTV × borrowAPY_eff) × maxMultiplier
 * where borrowAPY_eff = borrowAPY × (1 + flashloanPremium) and
 * maxMultiplier defaults to 1 / (1 − maxLTV) if not provided.
 * If leveraged ROE is not better than unlevered, returns supplyAPY.
 */
export function computeMaxROE({
  supplyAPY,
  borrowAPY,
  flashloanPremium,
  maxLTV,
  maxMultiplier,
}: {
  supplyAPY: number;
  borrowAPY: number;
  flashloanPremium: number; // e.g. 0.0009 for 9 bps
  maxLTV: number; // e.g. 0.9
  maxMultiplier?: number; // defaults to 1 / (1 - maxLTV)
}): number {
  try {
    const s = Number(supplyAPY) || 0;
    const b = Number(borrowAPY) || 0;
    const fl = Math.max(0, Number(flashloanPremium) || 0);
    const Lraw = Number(maxLTV) || 0;
    const L = Math.min(Math.max(Lraw, 0), 0.999999); // clamp and avoid div-by-zero
    const M = Number.isFinite(maxMultiplier as number)
      ? (maxMultiplier as number)
      : 1 / (1 - L);

    const bEff = b * (1 + fl);
    const spreadAtMax = s - L * bEff;
    const leveraged = spreadAtMax * M;
    const out = Math.max(s, leveraged);
    return Number.isFinite(out) ? out : s;
  } catch (_) {
    return supplyAPY;
  }
}
