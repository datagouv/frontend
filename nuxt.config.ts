// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true, componentInspector: false },

  features: {
    inlineStyles: false,
  },

  devServer: {
    port: 3000,
    host: 'dev.local',
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
      schemasSite: {
        url: 'https://schema.data.gouv.fr/',
        name: 'schema.data.gouv.fr',
      },
      apiDocExternalLink: 'https://guides.data.gouv.fr/publier-des-donnees/guide-data.gouv.fr/api/reference',
      guidesUrl: 'https://guides.data.gouv.fr/',
      guidesHarvestingUrl: '',
      supportUrl: 'https://support.data.gouv.fr/',
      catalogUrl: 'https://catalogue.data.gouv.fr/',

      feedbackUrl: 'https://tally.so/r/wdNk1y',

      licenses: {
        'Autorités administratives': [
          { value: 'lov2', recommended: true, code: 'etalab-2.0' },
          { value: 'odc-odbl', description: 'License avec obligation de partage à l’identique', code: 'ODbL-1.0' },
          { value: 'notspecified', description: 'Le Code des relations entre le public et l’administration ne s’applique pas' },
        ],
        'Tous producteurs': [
          { value: 'lov2', recommended: true },
          { value: 'cc-by', code: 'CC-BY' },
          { value: 'cc-by-sa', code: 'CC-BY-SA' },
          { value: 'cc-zero', code: 'CC0-1.0' },
          { value: 'fr-lo', code: 'etalab-2.0' },
          { value: 'odc-by', code: 'ODC-By-1.0' },
          { value: 'odc-odbl', code: 'ODbL-1.0' },
          { value: 'odc-pddl', code: 'PDDL-1.0' },
          { value: 'other-at' },
          { value: 'other-open' },
          { value: 'other-pd' },
          { value: 'notspecified' },
        ],
      },

      changeEmailPage: 'change-email',
      changePasswordPage: 'change',
    },
  },

  app: {
    head: {
      bodyAttrs: {
        class: 'datagouv-components',
      },
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
