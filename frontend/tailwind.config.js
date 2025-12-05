// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        heartRun: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },

      },
      animation: {
        "slide-x": "slideX 50s linear infinite",
        "heart-run": "heartRun 50s linear infinite", // <-- Add this line
      },
      fontFamily: {
        momo: ['"Momo Trust Display"', 'sans-serif'],
        dancing: ['"Style Script"', 'cursive'],
        music: ['"Playfair Display"', 'serif'],
        zen:['"Cinzel"', 'serif'],// ✅ your new font
      },


    },
  },
  plugins: [],
};
