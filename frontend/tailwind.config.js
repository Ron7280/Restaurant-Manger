import { colors } from "tailwindcss/colors";
import scrollbarPlugin from "tailwind-scrollbar";

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: { min: "640px", max: "1370px" },
      lg: { min: "1370px" },
    },
    extend: {
      colors: {
        ...colors,
        mainColor: "#10B981",
        mainColor2: "#2E4057",
        lightColor: "#A3B0D9",
        lightColor2: "#22D3EE",
        Secondry: "#D9CAB3",
        Secondry2: "#FF6B35",
        Red: "#FF0000",
        Indigo: "#4338CA",
      },
    },
  },
  plugins: [
    scrollbarPlugin({ nocompatible: true }),
    function ({ addUtilities }) {
      addUtilities({
        ".scroll-left": {
          direction: "rtl",
        },
        ".scroll-left-content": {
          direction: "ltr",
        },
      });
    },
  ],
};

export default config;
