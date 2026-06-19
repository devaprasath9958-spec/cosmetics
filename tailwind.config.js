/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "var(--color-obsidian)",
          light: "var(--color-obsidian-light)",
          soft: "var(--color-obsidian-soft)",
          border: "var(--color-obsidian-border)",
        },
        ivory: "var(--color-ivory)",
        smoke: "var(--color-smoke)",
        gold: {
          DEFAULT: "var(--color-gold)",
          light: "var(--color-gold-light)",
          dark: "var(--color-gold-dark)",
        },
        rose: {
          DEFAULT: "#D98C9B",
          deep: "#8B3A4B",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      boxShadow: {
        glow: "0 0 80px rgba(201,167,105,0.25)",
        card: "0 20px 60px -20px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 50%, rgba(201,167,105,0.18), transparent 70%)",
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.8s ease forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
