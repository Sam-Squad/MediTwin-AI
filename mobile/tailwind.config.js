/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#2563EB',
          600: '#1D4ED8',
        },
        medical: {
          500: '#10B981',
        },
        cyan: {
          500: '#06B6D4',
        },
        accent: {
          500: '#7C3AED',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        }
      },
    },
  },
  plugins: [],
}
