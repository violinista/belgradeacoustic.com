module.exports = {
  content: ["./src/**/*.{html,njk,md,js}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        heading: ["Fira Sans Condensed", "sans-serif"],
        sans: ["Overpass", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
