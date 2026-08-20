import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // JLAB TECH — Ivory & Deep Green premium palette
        pine: {
          950: "#08251C",
          900: "#0D3B2E",
          800: "#11493A",
          700: "#145C44",
          600: "#1B7256",
          500: "#2A8A6B",
          100: "#DCE9E2",
          50: "#EEF5F1",
        },
        ivory: {
          50: "#FDFCF8",
          100: "#F8F5EC",
          200: "#F1EDE0",
          300: "#EDEAE0",
          400: "#E3DFCF",
        },
        sand: {
          600: "#A8853F",
          500: "#C6A76A",
          400: "#D4BC8B",
          100: "#F3EBDA",
        },
        sage: {
          600: "#7C8E7B",
          500: "#A9B7A8",
          200: "#D6DED5",
          100: "#E8EDE7",
        },
        line: "#E6E1D3",
        inkbody: "#33403A",
        inkmuted: "#6B7A72",
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
        card: "0 1px 2px rgba(13, 59, 46, 0.04), 0 2px 8px rgba(13, 59, 46, 0.05)",
        "card-hover":
          "0 2px 6px rgba(13, 59, 46, 0.07), 0 10px 24px rgba(13, 59, 46, 0.10)",
        sidebar: "2px 0 16px rgba(8, 37, 28, 0.18)",
      },
      borderRadius: {
        xl2: "1.125rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
