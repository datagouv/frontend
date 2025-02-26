/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      typography: (theme) => ({
        neutral: {
          css: {
            "--tw-prose-bullets": theme("colors.neutral[800]"),
          },
        },
      }),
    },
  },
};
