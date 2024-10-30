// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  features: {
    inlineStyles: false,
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://dev.local:7000',
      qualityDescriptionLength: 100,
      searchSirenUrl: 'https://recherche-entreprises.api.gouv.fr/search',

      title: 'data.gouv.fr',
      demoServer: {
        url: 'https://demo.data.gouv.fr',
        name: 'demo.data.gouv.fr',
      },
      schemaPublishingUrl: 'https://publier.etalab.studio/fr',
      apiDocExternalLink: 'https://guides.data.gouv.fr/publier-des-donnees/guide-data.gouv.fr/api/reference',
      guidesHarvestingUrl: '',
      supportUrl: 'https://support.data.gouv.fr/',
      catalogUrl: 'https://catalogue.data.gouv.fr/',

      changeEmailPage: 'change-email',
      changePasswordPage: 'change',
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
