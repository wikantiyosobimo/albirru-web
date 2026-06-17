import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// Design tokens map 1:1 to albirru-design-system.md (§1–§7).
// Color/radius/shadow values live as CSS variables in app/globals.css.
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          700: "var(--navy-700)",
          800: "var(--navy-800)",
          900: "var(--navy-900)",
        },
        brand: {
          100: "var(--blue-100)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          DEFAULT: "var(--blue-500)",
        },
        success: {
          subtle: "var(--success-100)",
          DEFAULT: "var(--success-500)",
          strong: "var(--success-700)",
        },
        ink: {
          DEFAULT: "var(--ink-strong)",
          body: "var(--ink-body)",
          muted: "var(--ink-muted)",
        },
        hair: "var(--border)",
        canvas: "var(--bg-canvas)",
        muted: "var(--bg-muted)",
      },
      borderRadius: {
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(16,24,40,.05)",
        sm: "0 4px 12px rgba(16,24,40,.06)",
        md: "0 12px 28px rgba(16,24,40,.10)",
        lg: "0 24px 60px rgba(11,26,71,.25)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 1.8rem + 3vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" }],
        "h-xl": ["clamp(1.75rem, 1.4rem + 1.6vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "800" }],
        "h-md": ["1.375rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" }],
        "h-sm": ["1.125rem", { lineHeight: "1.3", fontWeight: "700" }],
        stat: ["clamp(2rem, 1.6rem + 1.2vw, 2.5rem)", { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "800" }],
        "body-lg": ["1rem", { lineHeight: "1.6" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        label: ["0.875rem", { lineHeight: "1", fontWeight: "600" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.08em", fontWeight: "700" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [animate],
};

export default config;
