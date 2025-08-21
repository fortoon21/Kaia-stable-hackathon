// Input validation utilities

export const validations = {
  // Validate Ethereum/Kaia address
  isValidAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  // Validate positive number
  isPositiveNumber: (value: string): boolean => {
    const num = parseFloat(value);
    return !Number.isNaN(num) && num > 0;
  },

  // Validate decimal places
  hasValidDecimals: (
    value: string | unknown,
    maxDecimals: number = 18
  ): boolean => {
    const strValue = String(value);
    const parts = strValue.split(".");
    if (parts.length > 2) return false;
    if (parts.length === 2 && parts[1].length > maxDecimals) return false;
    return true;
  },

  // Validate slippage percentage
  isValidSlippage: (value: string): boolean => {
    const num = parseFloat(value);
    return !Number.isNaN(num) && num >= 0.01 && num <= 50;
  },

  // Validate multiplier
  isValidMultiplier: (value: number, max: number): boolean => {
    return value >= 1 && value <= max;
  },

  // Format number with commas
  formatNumber: (value: string | number): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(num)) return "0";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  },

  // Format USD value
  formatUSD: (value: string | number): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  },

  // Format percentage
  formatPercentage: (value: string | number): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(num)) return "0%";
    return `${num.toFixed(2)}%`;
  },

  // Sanitize input to prevent XSS
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim();
  },

  // Validate transaction hash
  isValidTxHash: (hash: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  },

  // Calculate price impact warning level
  getPriceImpactLevel: (
    impact: number
  ): "low" | "medium" | "high" | "severe" => {
    if (impact < 0.1) return "low";
    if (impact < 1) return "medium";
    if (impact < 3) return "high";
    return "severe";
  },

  // Validate minimum amount
  isAboveMinimum: (value: string, minimum: number = 0.000001): boolean => {
    const num = parseFloat(value);
    return !Number.isNaN(num) && num >= minimum;
  },

  // Calculate estimated gas in USD
  calculateGasInUSD: (
    gasPrice: string,
    gasLimit: string,
    ethPrice: number
  ): string => {
    const gasPriceWei = parseFloat(gasPrice);
    const limit = parseFloat(gasLimit);
    const gasInEth = (gasPriceWei * limit) / 1e18;
    const gasInUSD = gasInEth * ethPrice;
    return gasInUSD.toFixed(2);
  },
};

// Form validation schemas
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export function validateField(
  value: unknown,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    if (rule.required && !value) {
      return rule.message;
    }

    if (rule.min !== undefined && parseFloat(String(value)) < rule.min) {
      return rule.message;
    }

    if (rule.max !== undefined && parseFloat(String(value)) > rule.max) {
      return rule.message;
    }

    if (rule.pattern && !rule.pattern.test(String(value))) {
      return rule.message;
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }

  return null;
}

export function validateForm(
  data: Record<string, unknown>,
  schema: ValidationSchema
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// Specific validation schemas for different forms
export const tradingFormSchema: ValidationSchema = {
  collateralAmount: [
    { required: true, message: "Collateral amount is required" },
    { min: 0.000001, message: "Amount must be greater than 0" },
    {
      custom: (v) => validations.hasValidDecimals(v, 18),
      message: "Too many decimal places",
    },
  ],
  multiplier: [
    { required: true, message: "Multiplier is required" },
    { min: 1, message: "Multiplier must be at least 1x" },
    { max: 10, message: "Multiplier cannot exceed 10x" },
  ],
  slippage: [
    { min: 0.01, message: "Slippage must be at least 0.01%" },
    { max: 50, message: "Slippage cannot exceed 50%" },
  ],
};

export const walletFormSchema: ValidationSchema = {
  recipientAddress: [
    { required: true, message: "Recipient address is required" },
    { pattern: /^0x[a-fA-F0-9]{40}$/, message: "Invalid address format" },
  ],
  amount: [
    { required: true, message: "Amount is required" },
    { min: 0.000001, message: "Amount must be greater than 0" },
    {
      custom: (v) => validations.hasValidDecimals(v, 18),
      message: "Too many decimal places",
    },
  ],
};
