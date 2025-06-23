/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        body:    ['var(--font-sans)',    'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      colors: {
        olive:          'var(--color-olive)',
        teal:           'var(--color-teal)',
        'teal-dark':    'var(--color-teal-dark)',
        neutral:        'var(--color-neutral)',
        'neutral-dark': 'var(--color-neutral-dark)',
        background:     'var(--background)',
        foreground:     'var(--foreground)',
        'card-bg':      'var(--card-bg)',
        border:         'var(--border)',
      },
    },
  },
  // DaisyUI is loaded via the PostCSS @plugin "daisyui" directive in globals.css
  plugins: [],
}

export default config
