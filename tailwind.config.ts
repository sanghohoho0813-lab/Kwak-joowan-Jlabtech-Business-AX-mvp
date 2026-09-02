import type { Config } from "tailwindcss";

/**
 * 색상은 모두 CSS 변수를 가리킨다 (globals.css 의 [data-theme] 블록).
 * 덕분에 컴포넌트의 className 을 건드리지 않고 테마 6종을 교체할 수 있다.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pine: {
          950: "var(--pine-950)",
          900: "var(--pine-900)",
          800: "var(--pine-800)",
          700: "var(--pine-700)",
          600: "var(--pine-600)",
          500: "var(--pine-500)",
          100: "var(--pine-100)",
          50: "var(--pine-50)",
        },
        ivory: {
          50: "var(--ivory-50)",
          100: "var(--ivory-100)",
          200: "var(--ivory-200)",
          300: "var(--ivory-300)",
          400: "var(--ivory-400)",
        },
        sand: {
          600: "var(--sand-600)",
          500: "var(--sand-500)",
          400: "var(--sand-400)",
          100: "var(--sand-100)",
        },
        sage: {
          600: "var(--sage-600)",
          500: "var(--sage-500)",
          200: "var(--sage-200)",
          100: "var(--sage-100)",
        },
        /* 보조 강조색 — 딥그린·골드와 부딪히지 않는 따뜻한 톤 */
        clay: {
          600: "var(--clay-600)",
          500: "var(--clay-500)",
          400: "var(--clay-400)",
          100: "var(--clay-100)",
        },
        /* 보조 강조색 — 차가운 쪽을 하나 잡아 정보성 요소에 쓴다 */
        mist: {
          600: "var(--mist-600)",
          500: "var(--mist-500)",
          200: "var(--mist-200)",
          100: "var(--mist-100)",
        },
        line: "var(--line)",
        inkbody: "var(--ink-body)",
        inkmuted: "var(--ink-muted)",
        /* 고객 화면 — 제목·본문을 또렷하게 */
        inkstrong: "var(--ink-strong)",
        /* 고객 화면 캔버스 — 베이지가 아니라 차가운 밝은 회색 */
        cloud: "var(--cloud)",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          '"Helvetica Neue"',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 30, 25, 0.04), 0 2px 8px rgba(15, 30, 25, 0.05)",
        "card-hover":
          "0 2px 6px rgba(15, 30, 25, 0.07), 0 10px 24px rgba(15, 30, 25, 0.10)",
        sidebar: "2px 0 16px rgba(10, 25, 20, 0.18)",
      },
      borderRadius: {
        xl2: "1.125rem",
      },
      transitionDuration: {
        // 기본 반응은 빠르게 — Hover/Button 160~180ms
        fast: "160ms",
        base: "180ms",
        panel: "200ms",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
