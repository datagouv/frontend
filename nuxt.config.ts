// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },


  // Inline SSR styles doesn't work with TailwindCSS classes containing `!` in SSR build (Docker for exemple)
  // See https://github.com/nuxt-modules/tailwindcss/issues/695
  // :TailwindCSS!Problem
  // But we cannot disabled it with the following configs… Don't know why…
  // features: {
  //   inlineStyles: false,
  // },

  // experimental: {
  //   inlineSSRStyles: false,
  // },

  runtimeConfig: {
    public: {
      apiBase: 'http://dev.local:7000',
      qualityDescriptionLength: 100,
      searchSirenUrl: 'https://recherche-entreprises.api.gouv.fr/search',
      title: 'datagouv/frontend',
    },
  },

  typescript: {
    typeCheck: false,
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
