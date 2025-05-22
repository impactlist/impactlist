/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: '1.5em',
              fontWeight: '700',
              marginTop: '1.333em',
              marginBottom: '0.666em',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
