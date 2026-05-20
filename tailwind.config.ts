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
        bg: "#0a0b0f",
        ink: "#f2efe4",
        dim: "rgba(242,239,228,0.5)",
        accent: "#c0c0c8",
      },
      fontFamily: {
        display: ["Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        "marquee-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "marquee-scroll": "marquee-scroll 40s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
