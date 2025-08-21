import { describe, expect, it } from "vitest";
import {
  calculateCurrentLTV,
  calculateLeverageParams,
  calculateMaxLeverage,
} from "../lib/leverage";

// 1e18 constant used in the reference implementation (same as leverage_ui.html)
const EXP18 = 10n ** 18n;

function parseFixedDecimalToBigInt(str, decimals = 18) {
  const s = String(str).trim();
  if (!s) return 0n;
  const neg = s.startsWith("-");
  const val = neg ? s.slice(1) : s;
  const [intPart, fracPartRaw = ""] = val.split(".");
  if (!/^\d+$/.test(intPart || "0") || !/^\d*$/.test(fracPartRaw)) return 0n;
  const fracPart = (fracPartRaw + "0".repeat(decimals)).slice(0, decimals);
  const scaleFactor = BigInt(`1${"0".repeat(decimals)}`);
  const bi = BigInt(intPart || "0") * scaleFactor + BigInt(fracPart || "0");
  return neg ? -bi : bi;
}

function calculateMaxLeverageReference({
  collateralDecimals,
  debtDecimals,
  initialCollateralAmount,
  initialDebtAmount,
  additionalCollateralAmount,
  priceOfCollateral,
  priceOfDebt,
  flashloanPremium,
  maxLTV,
}) {
  // Token amounts scaled to their token decimals
  const initialCollateralAmount_bi = parseFixedDecimalToBigInt(
    initialCollateralAmount,
    Number(collateralDecimals)
  );
  const additionalCollateralAmount_bi = parseFixedDecimalToBigInt(
    additionalCollateralAmount,
    Number(collateralDecimals)
  );
  const initialDebtAmount_bi = parseFixedDecimalToBigInt(
    initialDebtAmount,
    Number(debtDecimals)
  );

  // Prices and ratios scaled to 1e18
  const pc = parseFixedDecimalToBigInt(priceOfCollateral, 18);
  const pd = parseFixedDecimalToBigInt(priceOfDebt, 18);
  const fl = parseFixedDecimalToBigInt(flashloanPremium, 18);
  const mLTV = parseFixedDecimalToBigInt(maxLTV, 18);

  const totColl = initialCollateralAmount_bi + additionalCollateralAmount_bi;
  if (totColl === 0n) return 1;

  // Reference formula from leverage_ui.html (price branch)
  const term1 = pc * pc * (EXP18 + fl);
  const term2 = (pd * pd * initialDebtAmount_bi * EXP18) / totColl;
  const numerator = term1 - term2;
  const denominator = pc * pc * (EXP18 + fl - mLTV);
  if (denominator === 0n) return 1;
  const maxLevBI = (numerator * EXP18) / denominator;
  const maxLev = Number(maxLevBI) / 1e18;

  if (!Number.isFinite(maxLev) || maxLev <= 1) return 1;
  return Math.min(maxLev, 25);
}

function calculateCurrentLTVReference({
  collateralDecimals,
  debtDecimals,
  collateralAmount,
  debtAmount,
  priceOfCollateral,
  priceOfDebt,
}) {
  const coll = parseFixedDecimalToBigInt(
    collateralAmount,
    Number(collateralDecimals)
  );
  const debt = parseFixedDecimalToBigInt(debtAmount, Number(debtDecimals));
  const pc = parseFixedDecimalToBigInt(priceOfCollateral, 18);
  const pd = parseFixedDecimalToBigInt(priceOfDebt, 18);

  if (coll === 0n || pc === 0n) return 0;

  // Value normalization to 1e18 scale: amount_in_units * price(1e18) / 10^tokenDecimals
  const collValue = (coll * pc) / 10n ** BigInt(collateralDecimals);
  const debtValue = (debt * pd) / 10n ** BigInt(debtDecimals);
  if (collValue === 0n) return 0;
  const ltvBI = (debtValue * EXP18) / collValue; // 1e18-scaled ratio
  return Number(ltvBI) / 1e18;
}

function approxEqual(a, b, eps = 1e-9) {
  return Math.abs(a - b) <= eps;
}

describe("leverage utils parity", () => {
  it("calculateMaxLeverage matches reference across scenarios", () => {
    const scenarios = [
      {
        collateralDecimals: 18,
        debtDecimals: 18,
        initialCollateralAmount: "10",
        initialDebtAmount: "5",
        additionalCollateralAmount: "1",
        priceOfCollateral: "1",
        priceOfDebt: "1",
        flashloanPremium: "0.0008",
        maxLTV: "0.8",
      },
      {
        collateralDecimals: 6,
        debtDecimals: 18,
        initialCollateralAmount: "1234.56789",
        initialDebtAmount: "321.000001",
        additionalCollateralAmount: "100.25",
        priceOfCollateral: "0.9",
        priceOfDebt: "1.1",
        flashloanPremium: "0.0009",
        maxLTV: "0.75",
      },
      {
        collateralDecimals: 8,
        debtDecimals: 6,
        initialCollateralAmount: "0",
        initialDebtAmount: "0",
        additionalCollateralAmount: "5",
        priceOfCollateral: "2.5",
        priceOfDebt: "1.2",
        flashloanPremium: "0.0005",
        maxLTV: "0.6",
      },
      {
        collateralDecimals: 18,
        debtDecimals: 18,
        initialCollateralAmount: "1",
        initialDebtAmount: "3",
        additionalCollateralAmount: "0",
        priceOfCollateral: "1",
        priceOfDebt: "1",
        flashloanPremium: "0.0008",
        maxLTV: "0.8",
      },
    ];

    for (const s of scenarios) {
      const ref = calculateMaxLeverageReference(s);
      const impl = calculateMaxLeverage({
        collateralDecimals: s.collateralDecimals,
        debtDecimals: s.debtDecimals,
        initialCollateralAmount: s.initialCollateralAmount,
        initialDebtAmount: s.initialDebtAmount,
        additionalCollateralAmount: s.additionalCollateralAmount,
        priceOfCollateral: s.priceOfCollateral,
        priceOfDebt: s.priceOfDebt,
        flashloanPremium: s.flashloanPremium,
        maxLTV: s.maxLTV,
      });
      expect(approxEqual(impl, ref, 1e-6)).toBe(true);
    }
  });

  it("calculateCurrentLTV matches reference across scenarios", () => {
    const scenarios = [
      {
        collateralDecimals: 18,
        debtDecimals: 18,
        collateralAmount: "10",
        debtAmount: "5",
        priceOfCollateral: "1",
        priceOfDebt: "1",
      },
      {
        collateralDecimals: 6,
        debtDecimals: 18,
        collateralAmount: "1234.56789",
        debtAmount: "321.000001",
        priceOfCollateral: "0.9",
        priceOfDebt: "1.1",
      },
      {
        collateralDecimals: 8,
        debtDecimals: 6,
        collateralAmount: "5",
        debtAmount: "0",
        priceOfCollateral: "2.5",
        priceOfDebt: "1.2",
      },
    ];

    for (const s of scenarios) {
      const ref = calculateCurrentLTVReference(s);
      const impl = calculateCurrentLTV({
        collateralAmount: s.collateralAmount,
        debtAmount: s.debtAmount,
        priceOfCollateral: s.priceOfCollateral,
        priceOfDebt: s.priceOfDebt,
      });
      expect(approxEqual(impl, ref, 1e-9)).toBe(true);
    }
  });

  it("calculateMaxLeverage caps at 25 when reference exceeds 25", () => {
    const s = {
      collateralDecimals: 18,
      debtDecimals: 18,
      initialCollateralAmount: "1000",
      initialDebtAmount: "0",
      additionalCollateralAmount: "0",
      priceOfCollateral: "10",
      priceOfDebt: "1",
      flashloanPremium: "0.0001",
      maxLTV: "0.99",
    };
    const ref = calculateMaxLeverageReference(s);
    const impl = calculateMaxLeverage({
      collateralDecimals: s.collateralDecimals,
      debtDecimals: s.debtDecimals,
      initialCollateralAmount: s.initialCollateralAmount,
      initialDebtAmount: s.initialDebtAmount,
      additionalCollateralAmount: s.additionalCollateralAmount,
      priceOfCollateral: s.priceOfCollateral,
      priceOfDebt: s.priceOfDebt,
      flashloanPremium: s.flashloanPremium,
      maxLTV: s.maxLTV,
    });
    expect(impl <= 25).toBe(true);
    expect(approxEqual(impl, Math.min(ref, 25), 1e-6)).toBe(true);
  });

  it("calculateMaxLeverage returns 1 when total collateral is zero", () => {
    const s = {
      collateralDecimals: 18,
      debtDecimals: 18,
      initialCollateralAmount: "0",
      initialDebtAmount: "10",
      additionalCollateralAmount: "0",
      priceOfCollateral: "1",
      priceOfDebt: "1",
      flashloanPremium: "0.0008",
      maxLTV: "0.8",
    };
    const impl = calculateMaxLeverage(s);
    expect(impl).toBe(1);
  });

  it("calculateMaxLeverage returns 1 when denominator is zero (pc = 0)", () => {
    const s = {
      collateralDecimals: 18,
      debtDecimals: 18,
      initialCollateralAmount: "10",
      initialDebtAmount: "1",
      additionalCollateralAmount: "0",
      priceOfCollateral: "0",
      priceOfDebt: "1",
      flashloanPremium: "0.0008",
      maxLTV: "0.8",
    };
    const impl = calculateMaxLeverage(s);
    expect(impl).toBe(1);
  });

  it("calculateMaxLeverage returns 1 when numerator is negative (very high debt)", () => {
    const s = {
      collateralDecimals: 18,
      debtDecimals: 18,
      initialCollateralAmount: "1",
      initialDebtAmount: "1000000", // huge debt
      additionalCollateralAmount: "0",
      priceOfCollateral: "1",
      priceOfDebt: "1",
      flashloanPremium: "0.0008",
      maxLTV: "0.8",
    };
    const impl = calculateMaxLeverage(s);
    expect(impl).toBe(1);
  });

  it("calculateMaxLeverage is monotonic in maxLTV (higher maxLTV => higher or equal leverage)", () => {
    const base = {
      collateralDecimals: 18,
      debtDecimals: 18,
      initialCollateralAmount: "50",
      initialDebtAmount: "10",
      additionalCollateralAmount: "5",
      priceOfCollateral: "1.25",
      priceOfDebt: "0.95",
      flashloanPremium: "0.0008",
    };
    const ltvValues = ["0.5", "0.6", "0.7", "0.8", "0.9"];
    const results = ltvValues.map((m) =>
      calculateMaxLeverage({ ...base, maxLTV: m })
    );
    for (let i = 1; i < results.length; i++) {
      expect(results[i] >= results[i - 1]).toBe(true);
    }
  });

  it("calculateMaxLeverage decreases as flashloanPremium increases (other things equal)", () => {
    const base = {
      collateralDecimals: 18,
      debtDecimals: 18,
      initialCollateralAmount: "50",
      initialDebtAmount: "10",
      additionalCollateralAmount: "5",
      priceOfCollateral: "1.25",
      priceOfDebt: "0.95",
      maxLTV: "0.8",
    };
    const premiums = ["0.0001", "0.0005", "0.0010", "0.0050"];
    const results = premiums.map((p) =>
      calculateMaxLeverage({ ...base, flashloanPremium: p })
    );
    for (let i = 1; i < results.length; i++) {
      expect(results[i] <= results[i - 1]).toBe(true);
    }
  });

  it("calculateCurrentLTV price-scale invariance (scale both prices => same LTV)", () => {
    const s = {
      collateralDecimals: 18,
      debtDecimals: 18,
      collateralAmount: "100.5",
      debtAmount: "40.25",
      priceOfCollateral: "1.2",
      priceOfDebt: "0.75",
    };
    const base = calculateCurrentLTV(s);
    const factor = Math.PI; // arbitrary positive scale
    const scaled = calculateCurrentLTV({
      collateralAmount: s.collateralAmount,
      debtAmount: s.debtAmount,
      priceOfCollateral: String(Number(s.priceOfCollateral) * factor),
      priceOfDebt: String(Number(s.priceOfDebt) * factor),
    });
    expect(approxEqual(base, scaled, 1e-12)).toBe(true);
  });

  it("calculateCurrentLTV handles zero collateral => 0", () => {
    const out = calculateCurrentLTV({
      collateralAmount: "0",
      debtAmount: "100",
      priceOfCollateral: "1",
      priceOfDebt: "1",
    });
    expect(out).toBe(0);
  });

  it("calculateLeverageParams returns correct leverage positions", () => {
    // Test basic 2x leverage
    const result1 = calculateLeverageParams({
      collateralDecimals: 18,
      debtDecimals: 6,
      initialCollateralAmount: "0",
      initialDebtAmount: "0",
      additionalCollateralAmount: "100",
      targetLeverage: "2",
      priceOfCollateral: "0.99",
      priceOfDebt: "1.0",
      flashloanPremium: "0.0009",
    });

    // Long should be 100 * 2 = 200
    expect(Math.abs(parseFloat(result1.collateralAmount) - 200)).toBeLessThan(
      1
    );
    // Short should be approximately 100 * 1 * 0.99 = 99
    expect(Math.abs(parseFloat(result1.debtAmount) - 99)).toBeLessThan(5);

    // Test 1.81x leverage
    const result2 = calculateLeverageParams({
      collateralDecimals: 18,
      debtDecimals: 6,
      initialCollateralAmount: "0",
      initialDebtAmount: "0",
      additionalCollateralAmount: "112",
      targetLeverage: "1.81",
      priceOfCollateral: "0.99",
      priceOfDebt: "1.0",
      flashloanPremium: "0.0009",
    });

    // Long should be 112 * 1.81 = 202.72
    expect(
      Math.abs(parseFloat(result2.collateralAmount) - 202.72)
    ).toBeLessThan(1);
    // Short should be approximately 112 * 0.81 * 0.99 = 89.81
    expect(Math.abs(parseFloat(result2.debtAmount) - 89.81)).toBeLessThan(5);
  });

  it("fuzz parity: random scenarios (prices branch)", () => {
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }
    const trials = 50; // keep runtime fast
    for (let t = 0; t < trials; t++) {
      const collateralDecimals = [6, 8, 18][Math.floor(Math.random() * 3)];
      const debtDecimals = [6, 8, 18][Math.floor(Math.random() * 3)];
      const initialCollateralAmount = rand(0, 200).toFixed(6);
      const initialDebtAmount = rand(0, 200).toFixed(6);
      const additionalCollateralAmount = rand(0, 100).toFixed(6);
      const priceOfCollateral = rand(0.0001, 5).toFixed(6);
      const priceOfDebt = rand(0.0001, 5).toFixed(6);
      const flashloanPremium = rand(0, 0.01).toFixed(6);
      const maxLTV = rand(0.1, 0.95).toFixed(6);

      const s = {
        collateralDecimals,
        debtDecimals,
        initialCollateralAmount,
        initialDebtAmount,
        additionalCollateralAmount,
        priceOfCollateral,
        priceOfDebt,
        flashloanPremium,
        maxLTV,
      };
      const ref = calculateMaxLeverageReference(s);
      const impl = calculateMaxLeverage(s);
      // Allow slightly looser epsilon for fuzz
      expect(approxEqual(impl, ref, 1e-5)).toBe(true);
    }
  });
});
