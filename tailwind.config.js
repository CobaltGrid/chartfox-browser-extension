/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.html",
  ],
  theme: {
    extend: {
      "colors": {
        "cf-orange": {
          DEFAULT: "#e5731f",
          "dark": "#894310"
        },
      }
    },
  },
  plugins: [],
}

