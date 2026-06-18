/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0E0B10",
          light: "#171219",
          soft: "#1F1922",
          border: "#2A222F",
        },
        ivory: "#F3ECE2",
        smoke: "#A99CAE",
        gold: {
          DEFAULT: "#C9A769",
          light: "#E2C893",
          dark: "#9C7F4C",
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
