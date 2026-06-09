export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFD586",
        primaryHover: "#FFC96A",

        secondary: "#FFE99A",

        accent: "#FF9898",
        accentLight: "#FFAAAA",

        dark: "#2F2F2F",
        light: "#FFFDF7",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
