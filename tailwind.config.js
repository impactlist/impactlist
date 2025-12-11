/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '500px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
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
