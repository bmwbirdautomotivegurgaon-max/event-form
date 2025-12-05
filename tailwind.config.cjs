/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        gold: {
          500: "#C5A059",
          600: "#B08D45",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "draw-check": "draw 0.6s ease-out 0.2s forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        draw: {
          "0%": { strokeDashoffset: 20 },
          "100%": { strokeDashoffset: 0 },
        },
      },
    },
  },
  plugins: [],
};
