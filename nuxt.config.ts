// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: 'http://dev.local:7000'
    },
  },

  typescript: {
    typeCheck: true,
  },
  // required for nuxt/content
  ssr: true,

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    'nuxt-purgecss',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en-US.json',
      },
      {
        code: 'es',
        file: 'es-ES.json',
      },
      {
        code: 'fr',
        file: 'fr-FR.json',
      },
    ],
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en',
    strategy: 'prefix',
  },
  image: {
    screens: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1248,
    },
  },
})
