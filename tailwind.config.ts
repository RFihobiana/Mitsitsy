import type { Config } from "tailwindcss";

const color = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: color("background"),
        foreground: color("foreground"),
        card: color("card"),
        border: color("border"),
        input: color("input"),
        ring: color("ring"),
        muted: {
          DEFAULT: color("muted"),
          foreground: color("muted-foreground"),
        },
        primary: {
          DEFAULT: color("primary"),
          foreground: color("primary-foreground"),
        },
        destructive: color("destructive"),
        amber: color("want"),
      },
      borderRadius: { lg: "0.75rem", md: "0.5rem", sm: "0.35rem" },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        grow: {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
        pop: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        progress: { from: { width: "0%" }, to: { width: "100%" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        grow: "grow 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        pop: "pop 0.25s ease-out both",
        progress: "progress var(--slide-ms, 9000ms) linear both",
      },
    },
  },
  plugins: [],
};
export default config;
