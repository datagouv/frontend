import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    fontFamily: {
      mono: ['"Noto Sans Mono"', ...defaultTheme.fontFamily.sans],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
      },
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1248px',
    },
    extend: {
      aria: {
        'current-page': 'current="page"',
      },
      boxShadow: {
        input: 'inset 0 -2px 0 0 var(--blue-cumulus-sun-368-moon-732)',
      },
      fontFamily: {
        spectral: 'Spectral',
        gothic: 'URW Gothic',
      },
      fontSize: {
        '4.5xl': '2.75rem',
      },
      colors: {
        primary: '#3558a2',
        mentionGrey: '#666', // Copy from --text-mention-grey
        gray: {
          'title': '#161616',
          'medium': '#666666',
          'lower-hover': '#d2d2d2',
          'lower-active': '#c1c1c1',
          'lower': '#eeeeee',
          'lowest': '#e8eaed',
          'default': '#e5e5e5',
          'plain': '#3a3a3a',
          'some': '#f6f6f6',
          'logo': '#373c42',
        },
        defaultWarning: '#b32000',
        blue: {
          light: '#e3e3fd',
          lighter: '#EEF4F8',
          tint: '#c1c1fd',
          outline: '#0a76f6',
        },
        secondary: {
          lightest: '#EEEEEE',
          dark: '#66666',
        },
        datagouv: {
          lightest: '#E6EEFE',
          lighter: '#e3e3fd',
          light: '#c1c1fd',
          hover: '#5982e0',
          defaultLight: '#46699D',
          DEFAULT: '#465F9D',
          dark: '#3558a2',
        },
        danger: {
          lightest: '#FFE9E9',
          dark: '#CE0500',
        },
        warning: {
          lightest: '#FFE9E6',
          dark: '#B34000',
        },
        warning2: {
          lightest: '#FEECC2',
          dark: '#716043',
        },
        success: {
          lightest: '#ECF7F0',
          lighter: '#C3FAD5',
          dark: '#27A658',
          darker: '#1f8d49', // from DSFR to avoid contrast issue
          darkest: '#18753c', // from DSFR to avoid contrast issue
        },
      },
      typography: theme => ({
        neutral: {
          css: {
            '--tw-prose-bullets': theme('colors.neutral[800]'),
          },
        },
      }),
      // This animation are copy/paste from the `pulse` animation of TailwindCSS
      // because the `pulse` animation inherit of a blue background from somewhere
      // (DSFR? Wrong component not-scoped style?)
      animation: {
        'pulse-placeholder': 'pulse-placeholder 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-placeholder': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
