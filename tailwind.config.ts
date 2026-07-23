import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#EEF2F0",
        surface: "#FFFFFF",
        "surface-2": "#F5F7F5",
        ink: "#1B211F",
        "ink-soft": "#5B6864",
        "ink-faint": "#8B9793",
        border: "#DCE3DE",
        primary: "#28353B",
        "primary-2": "#3B4E56",
        accent: "#E4A03B",
        "accent-ink": "#26190A",
        teal: "#3F7C6E",
        "teal-bg": "#E1EFEA",
        amber: "#C4791E",
        "amber-bg": "#FBECD3",
        slate: "#4C6C8A",
        "slate-bg": "#E4EBF3",
        rust: "#B33F35",
        "rust-bg": "#F7E2DF",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,26,24,0.06), 0 4px 14px rgba(20,26,24,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
