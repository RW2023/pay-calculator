/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

const config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-sans)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace']
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark']
  }
}

export default config;
