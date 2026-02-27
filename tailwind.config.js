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
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        'surface-alt': 'var(--bg-surface-alt)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        muted: 'var(--text-muted)',
        strong: 'var(--text-strong)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        success: 'var(--success)',
        border: 'var(--border-subtle)',
      },
      borderRadius: {
        impactSm: 'var(--radius-sm)',
        impactMd: 'var(--radius-md)',
        impactLg: 'var(--radius-lg)',
      },
      boxShadow: {
        impact1: 'var(--shadow-1)',
        impact2: 'var(--shadow-2)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        ui: ['var(--font-ui)'],
      },
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
