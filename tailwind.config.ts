import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0B0D",
          900: "#111318",
          850: "#15171E",
          800: "#1B1E26",
          700: "#262A35",
        },
        mist: {
          400: "#8A93A6",
          300: "#AEB5C4",
        },
        paper: {
          100: "#EDEFF3",
          50: "#F7F8FA",
        },
        signal: {
          600: "#3E63D6",
          500: "#5B8CFF",
          400: "#7FA4FF",
          300: "#AAC0FF",
        },
        insight: {
          500: "#F2A93B",
          400: "#F5BE66",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(237,239,243,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,239,243,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
