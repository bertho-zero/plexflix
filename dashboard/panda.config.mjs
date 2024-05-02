import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: 'styled-system',

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          red1: { value: '#E61E25' },
          red2: { value: '#B12025' },
        },
      },
      breakpoints: {
        xs: '576px',
      },
      keyframes: {
        expand: {
          '0%': {
            letterSpacing: '-1ch',
            opacity: 0,
          },
          '40%': {
            opacity: 0.6,
          },
          '100%': {
            opacity: 1,
          },
        },
        show: {
          '0%': {
            right: 0,
          },
          '100%': {
            right: '-400%',
          },
        },
        appearAnimation: {
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      },
    },
  },

  globalCss: {
    html: {
      // h: 'full',
      '& :has(iframe)': {
        overflow: 'hidden',
      },
    },
    body: {
      h: 'unset',
      minH: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgColor: 'black',
    },
    'a, button': {
      cursor: 'url(\'/fuck.cur\'), pointer',
      _active: {
        cursor: 'url(\'/fuck-grab.cur\'), pointer',
      },
    },
  },
});
