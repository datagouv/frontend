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
      fontFamily: {
        spectral: 'Spectral',
        gothic: 'URW Gothic',
      },
      colors: {
        primary: '#3558a2',
        mentionGrey: '#666', // Copy from --text-mention-grey
        gray: {
          title: '#161616',
          medium: '#666666',
          lower: '#eeeeee',
          default: '#e5e5e5',
          plain: '#3a3a3a',
          some: '#f6f6f6',
          logo: '#373c42',
        },
        defaultWarning: '#b32000',
        blue: {
          light: '#e3e3fd',
          tint: '#c1c1fd',
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
          dark: '#27A658',
        },
      },
      typography: theme => ({
        neutral: {
          css: {
            '--tw-prose-bullets': theme('colors.neutral[800]'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
