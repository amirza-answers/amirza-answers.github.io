/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  // رنگ تگ‌ها فقط داخل JS ساخته می‌شوند؛ بدون safelist ممکن است در CSS نهایی نباشند
  safelist: [
    "bg-sky-100",
    "text-sky-950",
    "bg-pink-100",
    "text-pink-950",
    "bg-emerald-100",
    "text-emerald-950",
    "bg-violet-100",
    "text-violet-950",
    "bg-cyan-100",
    "text-cyan-950",
    "bg-amber-100",
    "text-amber-950",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Vazirmatn",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
