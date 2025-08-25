// UI Color Theme
export const COLORS = {
  // Primary colors
  primary: "#2ae5b9",
  primaryHover: "#17e3c2",
  primaryDark: "#23c09b",

  // Background colors
  bgPrimary: "#08131f",
  bgSecondary: "#0c1d2f",
  bgTertiary: "#0a1420",
  bgCard: "#14304e",
  bgCardHover: "#14304e/20",
  bgDanger: "#ff6b6b",

  // Text colors
  textPrimary: "#ffffff",
  textSecondary: "#728395",
  textMuted: "#a1acb8",
  textSuccess: "#2ae5b9",
  textWarning: "#f59e0b",
  textDanger: "#ff6b6b",
  textOrange: "#fb923c",

  // Border colors
  borderPrimary: "#14304e",
  borderSecondary: "#1e3a5f",

  // Status colors
  positive: "#23c09b",
  negative: "#ff6b6b",
  warning: "#f59e0b",
  info: "#3b82f6",
} as const;

// Common spacing values
export const SPACING = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  xxl: "3rem", // 48px
} as const;

// Border radius values
export const RADIUS = {
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  full: "9999px",
} as const;

// Common transitions
export const TRANSITIONS = {
  default: "transition-colors",
  all: "transition-all duration-200",
  slow: "transition-all duration-300",
  fast: "transition-all duration-100",
} as const;

// Typography
export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    xs: "text-xs", // 12px
    sm: "text-sm", // 14px
    base: "text-base", // 16px
    lg: "text-lg", // 18px
    xl: "text-xl", // 20px
    "2xl": "text-2xl", // 24px
    "3xl": "text-3xl", // 30px
  },
  // Font weights
  fontWeight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },
} as const;

// Common button styles
export const BUTTON_STYLES = {
  primary: `bg-[${COLORS.primary}] text-black hover:bg-[${COLORS.primaryHover}] ${TRANSITIONS.default}`,
  secondary: `bg-[${COLORS.bgCard}] text-[${COLORS.textSecondary}] hover:bg-[${COLORS.bgCardHover}] ${TRANSITIONS.default}`,
  danger: `bg-[${COLORS.bgDanger}] text-white hover:opacity-90 ${TRANSITIONS.default}`,
  disabled: `bg-[${COLORS.bgCard}] text-[${COLORS.textSecondary}] cursor-not-allowed opacity-50`,
} as const;

// Layout constants
export const LAYOUT_CONSTANTS = {
  maxWidthContainer: "max-w-[1200px]",
  sidebarWidth: "w-[280px]",
  headerHeight: "h-[64px]",
  cardPadding: "p-6",
  sectionSpacing: "mb-8",
} as const;

// Animation durations
export const ANIMATION = {
  fast: "100ms",
  normal: "200ms",
  slow: "300ms",
  verySlow: "500ms",
} as const;

// Z-index layers
export const Z_INDEX = {
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Common shadows
export const SHADOWS = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  none: "shadow-none",
} as const;
