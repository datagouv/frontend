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
      colors: {
        primary: '#3558a2',
        mentionGrey: '#666', // Copy from --text-mention-grey
        defaultWarning: '#b32000',
        blue: {
          light: '#e3e3fd',
          tint: '#c1c1fd',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
