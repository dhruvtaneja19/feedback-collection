/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f6ff",
          100: "#deeaff",
          200: "#c5d7ff",
          300: "#9cb8ff",
          400: "#7891ff",
          500: "#5a6bff",
          600: "#3b4ff0",
          700: "#2a3cd8",
          800: "#2633af",
          900: "#252e8c",
        },
        secondary: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d8d9dd",
          300: "#b6b8c2",
          400: "#8f92a1",
          500: "#6e7185",
          600: "#585a6d",
          700: "#474859",
          800: "#3c3d4a",
          900: "#33343f",
        },
      },
    },
  },
  plugins: [],
};
