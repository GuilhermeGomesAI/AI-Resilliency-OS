/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        paper: "#f7f8fa",
        line: "#d7dde6",
        signal: "#0f766e",
        ember: "#b45309"
      },
      boxShadow: {
        panel: "0 10px 30px rgba(20, 33, 61, 0.08)"
      }
    }
  },
  plugins: []
};
