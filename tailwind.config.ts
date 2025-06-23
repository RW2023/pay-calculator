import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  darkMode: "class",           // we’ll toggle via <html class="dark">
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins","sans-serif"],
        body:    ["Karla","sans-serif"]
      },
      colors: {
        olive:       'var(--color-olive)',
        teal:        'var(--color-teal)',
        'teal-dark': 'var(--color-teal-dark)',
        neutral:     'var(--color-neutral)',
        'neutral-dark': 'var(--color-neutral-dark)',
      }
    }
  }
};

export default config;
