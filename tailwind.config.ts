import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Primary Colors
        primary: {
          100: '#D4FB44',
          200: '#7F9236',
          300: '#5B6927',
          400: '#374016',
          500: '#333A1A',
        },
        
        // Secondary & Warning
        secondary: '#8795FF',
        warning: '#E5484D',
        
        // Background & Shadow
        'bg-main': '#1B2009',
        'shadow-base': 'rgba(10, 12, 4, 0.6)',
        
        // Surface Tokens (Layered Opacity)
        surface: {
          1: 'rgba(27, 32, 9, 0.92)',  // 1차 카드
          2: 'rgba(27, 32, 9, 0.88)',  // 서브 카드/패널
          3: 'rgba(27, 32, 9, 0.84)',  // 모달, 오버레이 내부
          ghost: 'rgba(27, 32, 9, 0.75)', // hover/pressed 피드백
        },
        
        // Border/Divider
        line: {
          soft: 'rgba(255, 255, 255, 0.06)',
          strong: 'rgba(255, 255, 255, 0.12)',
        },
        
        // Text Contrast
        text: {
          heading: 'rgba(255, 255, 255, 0.92)',
          body: 'rgba(255, 255, 255, 0.82)',
          muted: 'rgba(255, 255, 255, 0.64)',
        },
      },
      
      // Border Radius (Aggressive Roundness)
      borderRadius: {
        'xs': '8px',    // pill 버튼 라벨, 태그
        'sm': '12px',   // 인풋, 작은 카드
        'md': '16px',   // 기본 카드, 드롭다운
        'lg': '20px',   // 모달, 대형 카드
        'xl': '24px',   // 히어로 CTA, 통계 블록
        '2xl': '28px',  // 상단 고정 네비, 대면적 섹션
        'pill': '9999px', // 칩/배지/필터
      },
      
      // Box Shadow (Wide, Soft)
      boxShadow: {
        '1': '0 12px 28px rgba(0, 0, 0, 0.28), 0 2px 6px rgba(0, 0, 0, 0.18)',
        '2': '0 18px 44px rgba(0, 0, 0, 0.30), 0 4px 10px rgba(0, 0, 0, 0.20)',
        '3': '0 28px 68px rgba(0, 0, 0, 0.34), 0 8px 18px rgba(0, 0, 0, 0.22)',
      },
      
      // Typography
      fontFamily: {
        'heading': ['var(--font-space-grotesk)', 'sans-serif'], // Headers / Accent
        'body': ['var(--font-inter)', 'sans-serif'],            // Body / Main
      },
      
      // Letter Spacing (숫자/금액용)
      letterSpacing: {
        'tight-1': '-0.01em', // -1%
        'tight-2': '-0.02em', // -2%
      },
      
      // Focus Ring (Accessibility)
      outline: {
        secondary: ['2px solid #8795FF', '2px'],
      },
    },
  },
  plugins: [],
};
export default config;