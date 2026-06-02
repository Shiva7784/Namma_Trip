/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'w-24': '6rem',
        'w-32': '8rem',
        'w-48': '12rem',
        'w-64': '16rem',
        'w-20': '5rem',
      },
    },
  },
  plugins: [
  ],
};
