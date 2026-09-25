import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F5F6F3", // page background - cool paper, not warm cream
          surface: "#FFFFFF", // cards, grid, panels
        },
        ink: {
          DEFAULT: "#1C2321", // primary text - green-tinted charcoal, not flat black
          muted: "#5B6660", // secondary text
          faint: "#8B958F", // placeholders, disabled
        },
        line: "#DCDFD9", // ledger rule / border color
        accent: {
          DEFAULT: "#2F6F4E", // forest green - completion, primary actions
          hover: "#255A3F",
          tint: "#E4EEE7",
        },
        today: {
          DEFAULT: "#D98E04", // amber - "today" marker, streak highlight
          tint: "#FBEEC8",
        },
        danger: {
          DEFAULT: "#B3432B", // muted brick - delete, errors
          hover: "#943823",
          tint: "#F6E1DB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(28, 35, 33, 0.06)",
        modal: "0 12px 32px rgba(28, 35, 33, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
