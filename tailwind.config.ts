import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        mares: "rgb(var(--color-mares) / <alpha-value>)",
        blood: "rgb(var(--color-blood) / <alpha-value>)",
        smoke: "rgb(var(--color-smoke) / <alpha-value>)",
        ash: "rgb(var(--color-ash) / <alpha-value>)",
        bone: "rgb(var(--color-bone) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "10xl": "clamp(6rem, 18vw, 22rem)",
        "11xl": "clamp(8rem, 24vw, 30rem)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        grain: "grain 8s steps(10) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-10%)" },
          "30%": { transform: "translate(3%,-15%)" },
          "50%": { transform: "translate(12%,9%)" },
          "70%": { transform: "translate(-7%,3%)" },
          "90%": { transform: "translate(6%,15%)" },
        },
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
