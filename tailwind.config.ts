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
        primary:     "hsl(var(--color-primary)/<alpha-value>)",
        accent:      "hsl(var(--color-accent)/<alpha-value>)",
        olive:       "#7A9E00",
        teal:        "#008C85",
        "teal-dark": "#005F5A",
        neutral:     "#F2F2F2",
        "neutral-dark": "#333333",
      }
    }
  }
};

export default config;
