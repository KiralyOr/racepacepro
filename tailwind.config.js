/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // The static shell and the page generator both emit Tailwind classes, and
    // classes Tailwind cannot find literally are not shipped.
    "./public/index.html",
    "./scripts/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}