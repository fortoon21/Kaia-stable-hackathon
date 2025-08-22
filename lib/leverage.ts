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
 * The calculation is based on the logic from the provided UI tester, using big.js for precision.
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
    // Convert string inputs to Big numbers
    const pc = new Big(priceOfCollateral);
    const pd = new Big(priceOfDebt);
    const fl = new Big(flashloanPremium);
    const maxLTV_dec = new Big(maxLTV);
    const initialCollateral = new Big(initialCollateralAmount);
    const additionalCollateral = new Big(additionalCollateralAmount);
    const initialDebt = new Big(initialDebtAmount);

    // To faithfully replicate the BigInt math from the example, we scale the decimal
    // inputs to their fixed-point integer representations.
    const pc_bi = pc.times(EXP18);
    const pd_bi = pd.times(EXP18);
    const fl_bi = fl.times(EXP18);
    const maxLTV_bi = maxLTV_dec.times(EXP18);

    const collDecBI = new Big(10).pow(collateralDecimals);
    const debtDecBI = new Big(10).pow(debtDecimals);

    const initialCollateralAmount_bi = initialCollateral.times(collDecBI);
    const additionalCollateralAmount_bi = additionalCollateral.times(collDecBI);
    const initialDebtAmount_bi = initialDebt.times(debtDecBI);

    const totColl_bi = initialCollateralAmount_bi.plus(
      additionalCollateralAmount_bi
    );

    if (totColl_bi.eq(0)) {
      return 1;
    }

    // This formula is a direct translation of the BigInt logic from the UI tester's source.
    // numerator = pc^2 * (1e18 + fl) - (pd^2 * initialDebtAmount * 1e18) / totColl
    const term1_num = pc_bi.times(pc_bi).times(EXP18.plus(fl_bi));
    const term2_num = pd_bi
      .times(pd_bi)
      .times(initialDebtAmount_bi)
      .times(EXP18)
      .div(totColl_bi);
    const numerator = term1_num.minus(term2_num);

    // denominator = pc^2 * (1e18 + fl - maxLTV)
    const denominator = pc_bi
      .times(pc_bi)
      .times(EXP18.plus(fl_bi).minus(maxLTV_bi));

    if (denominator.eq(0)) {
      return 1;
    }

    // maxLevBI = (numerator * 1e18) / denominator
    const maxLevBI = numerator.times(EXP18).div(denominator);

    // Convert back to a standard number for consumption
    const maxLev = maxLevBI.div(EXP18).toNumber();

    if (!Number.isFinite(maxLev) || maxLev <= 1) {
      return 1;
    }

    // Cap for UI sanity, same as in original code
    return Math.min(maxLev, 25);
  } catch (_error) {
    // Error in calculateMaxLeverage
    return 1; // Return a safe default value in case of input parsing errors
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
 * Direct port of calcLeverageParams from leverage_ui.html
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
    // Parse inputs to Big numbers with token decimals (exactly like HTML)
    const collDecBI = new Big(10).pow(collateralDecimals);
    const debtDecBI = new Big(10).pow(debtDecimals);

    const initialCollateralAmount_bi = new Big(initialCollateralAmount).times(
      collDecBI
    );
    const initialDebtAmount_bi = new Big(initialDebtAmount).times(debtDecBI);
    const collateralAmount_bi = new Big(additionalCollateralAmount).times(
      collDecBI
    );

    // Scale prices and parameters to 1e18 (exactly like HTML)
    const pc = new Big(priceOfCollateral).times(EXP18);
    const pd = new Big(priceOfDebt).times(EXP18);
    const fl = new Big(flashloanPremium).times(EXP18);
    const tL = new Big(targetLeverage).times(EXP18);

    const totColl = initialCollateralAmount_bi.plus(collateralAmount_bi);

    // HTML formula works for all cases including initial 0,0
    // Direct port from lines 700-712
    // nom1 = (pc - (pd * tL) / EXP18) * initialDebtAmount * totColl
    const nom1 = pc
      .minus(pd.times(tL).div(EXP18))
      .times(initialDebtAmount_bi)
      .times(totColl);

    // nom2 = ((((pc * pc * totColl) / pd) * totColl * (tL - EXP18)) / EXP18) * (EXP18 + fl) * debtDecBI / EXP18 / collDecBI
    const nom2 = pc
      .times(pc)
      .times(totColl)
      .div(pd.eq(0) ? new Big(1) : pd)
      .times(totColl)
      .times(tL.minus(EXP18))
      .div(EXP18)
      .times(EXP18.plus(fl))
      .times(debtDecBI)
      .div(EXP18)
      .div(collDecBI.eq(0) ? new Big(1) : collDecBI);

    // denom = pc * ((totColl * (EXP18 + fl)) / EXP18) * debtDecBI - pd * initialDebtAmount * collDecBI
    const denom = pc
      .times(totColl.times(EXP18.plus(fl)).div(EXP18))
      .times(debtDecBI)
      .minus(pd.times(initialDebtAmount_bi).times(collDecBI));

    if (denom.eq(0)) {
      return {
        flashloanAmount: "0",
        ltv: "0",
        collateralAmount: totColl.div(collDecBI).toFixed(6),
        debtAmount: initialDebtAmount_bi.div(debtDecBI).toFixed(6),
      };
    }

    const flashloanAmount = nom1.plus(nom2).div(denom);

    // Calculate LTV from line 721-725
    const ltvNumerator = pd
      .times(initialDebtAmount_bi)
      .times(collDecBI)
      .plus(
        pc
          .times(totColl)
          .times(tL.minus(EXP18))
          .times(EXP18.plus(fl))
          .times(debtDecBI)
      );
    const ltvDenominator = pc.times(totColl).times(tL).times(debtDecBI);
    const ltv = ltvNumerator.div(ltvDenominator);

    // For new positions, simplified calculation
    // Long = initial collateral * leverage
    // Short = flashloan amount (what we borrow)
    const longPosition = new Big(additionalCollateralAmount).times(
      new Big(targetLeverage)
    );
    const shortPosition = flashloanAmount;

    return {
      flashloanAmount: flashloanAmount.toFixed(6),
      ltv: ltv.toFixed(6),
      collateralAmount: longPosition.toFixed(6), // Leveraged collateral
      debtAmount: shortPosition.toFixed(6), // Debt amount
    };
  } catch (_error) {
    // Error in calculateLeverageParams
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
