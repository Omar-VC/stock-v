export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#A91D3A",
        primaryHover: "#C73659",
        dark: "#151515",
        light: "#EEEEEE",
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}