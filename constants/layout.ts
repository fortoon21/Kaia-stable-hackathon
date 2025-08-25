// Layout constants for consistent spacing and sizing
export const LAYOUT = {
  NAVIGATION_HEIGHT: 68, // Navigation bar height in pixels
  NAVIGATION_HEIGHT_CLASS: "h-[68px]", // Tailwind class for navigation height
  CONTENT_PADDING_TOP_CLASS: "pt-[96px]", // Padding top for content under navigation (68px + 28px spacing)
  BACKGROUND_COLOR: "#1B2009", // Main background color (Sage-inspired dark green)
  BACKGROUND_CLASS: "bg-bg-main", // Tailwind class for background using semantic naming
  MAX_WIDTH_CONTAINER: "max-w-7xl min-w-[1024px]", // Max width for content containers to match navigation with minimum width
} as const;
