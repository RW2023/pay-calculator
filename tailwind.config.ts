// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',     // ← use the string, not ['class']
  theme: {
    extend: {
      colors: {
        primary:       'hsl(var(--color-primary)/<alpha-value>)',
        accent:        'hsl(var(--color-accent)/<alpha-value>)',
        olive:         'hsl(var(--color-olive)/<alpha-value>)',
        teal:          'hsl(var(--color-teal)/<alpha-value>)',
        'teal-dark':   'hsl(var(--color-teal-dark)/<alpha-value>)',
        neutral:       'hsl(var(--color-neutral)/<alpha-value>)',
        'neutral-dark':'hsl(var(--color-neutral-dark)/<alpha-value>)',
      },
    },
  },
}

export default config
