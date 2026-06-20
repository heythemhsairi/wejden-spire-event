import type { Config } from "tailwindcss";

/**
 * WejdenSpire — Workforce Wellbeing Intelligence.
 * A palette rooted in psychology: trustworthy, calming, intelligent.
 * Light, soft, organic, human-centered. NOT a dark terminal.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ws: {
          primary: "#4AAA83", // Spire Green — trust, growth, wellbeing
          "primary-dark": "#357C5F", // pressed / depth green
          "primary-light": "#6FC09E",
          blue: "#7FAEDB", // Insight Blue — data, clarity, intelligence
          "blue-dark": "#5B8FC4",
          purple: "#9A8BD6", // Calm Purple — psychology, empathy, depth
          "purple-dark": "#7E6FC2",
          // Risk scale (still reads as danger on light surfaces)
          green: "#4AAA83",
          amber: "#E0A23C",
          red: "#E06A5C",
          // Neutrals
          ink: "#1F2A2E", // Deep Ink — primary text
          sage: "#6B7A7F", // Muted Sage — secondary text
          cloud: "#F6F8F7", // Soft Cloud — section background
          border: "#E2E6E4", // Light Border
          "text-hi": "#1F2A2E",
          "text-lo": "#6B7A7F",
          "text-dim": "#9AA6A8",
          surface: "#FFFFFF",
          "surface-2": "#F6F8F7",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        ar: ["var(--font-cairo)", "var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "12px",
        DEFAULT: "16px",
        lg: "22px",
        xl: "28px",
        "2xl": "34px",
      },
      boxShadow: {
        "ws-soft": "0 8px 30px -12px rgba(31,42,46,0.10)",
        "ws-card": "0 4px 24px -8px rgba(31,42,46,0.08)",
        "ws-glow": "0 18px 50px -20px rgba(74,170,131,0.40)",
        "ws-lift": "0 16px 40px -16px rgba(31,42,46,0.14)",
      },
      backgroundImage: {
        "ws-canvas": "linear-gradient(180deg, #FFFFFF 0%, #F6F8F7 100%)",
        "ws-hero": "radial-gradient(110% 80% at 80% -10%, rgba(127,174,219,0.14), transparent 55%), radial-gradient(90% 70% at 0% 10%, rgba(154,139,214,0.12), transparent 50%), linear-gradient(180deg, #FFFFFF, #F6F8F7)",
        "ws-primary": "linear-gradient(135deg, #4AAA83, #357C5F)",
        "ws-soft-green": "linear-gradient(135deg, rgba(74,170,131,0.12), rgba(74,170,131,0.04))",
        "ws-soft-blue": "linear-gradient(135deg, rgba(127,174,219,0.14), rgba(127,174,219,0.04))",
        "ws-soft-purple": "linear-gradient(135deg, rgba(154,139,214,0.14), rgba(154,139,214,0.04))",
      },
      keyframes: {
        "ws-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        "ws-rise": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "ws-marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "ws-float": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: {
        "ws-pulse": "ws-pulse 2s ease-in-out infinite",
        "ws-rise": "ws-rise 0.4s ease-out both",
        "ws-marquee": "ws-marquee 30s linear infinite",
        "ws-float": "ws-float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
