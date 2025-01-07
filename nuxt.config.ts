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
      csvDatasetId: undefined,
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
      guidesHarvestingUrl: 'https://guides.data.gouv.fr/guide-data.gouv.fr/moissonnage',
      supportUrl: 'https://support.data.gouv.fr/',
      catalogUrl: 'https://guides.data.gouv.fr/autres-ressources-utiles/catalogage-de-donnees-grist',

      feedbackFormUrl: 'https://tally.so/r/mOld5R',
      betaAdminFeedbackUrl: 'https://tally.so/r/nP25OB',
      publishingDatasetFeedbackUrl: 'https://tally.so/r/nGo0yO',
      publishingDataserviceFeedbackUrl: 'https://tally.so/r/w2J7lL',
      publishingReuseFeedbackUrl: 'https://tally.so/r/mV98y6',

      newsletterSubscriptionUrl: 'https://f.info.data.gouv.fr/f/lp/infolettre-data-gouv-fr-landing-page/lk3q01y6',

      resourceFileUploadChunk: 2 * 1000 * 1000,

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

      readOnlyMode: false,

      sentry: {
        dsn: '',
      },

      // URL of your matomo host.
      matomo_host: undefined,

      // Matomo ID of your site. Check the Matomo backend for it
      matomo_site_id: 1,
    },
  },

  app: {
    head: {
      bodyAttrs: {
        class: 'datagouv-components',
      },
      link: [
        // Cannot use `/public/favicon.png` because the reverse proxy is calling udata-front for `/`
        // When the migration is over we can remove this static path.
        // :AfterMigration
        { rel: 'shortcut icon', href: 'https://static.data.gouv.fr/_themes/gouvfr/img/favicon.png' },
      ],
    },
  },

  typescript: {
    typeCheck: false,
  },

  routeRules: {
    '/login': { prerender: true },
    '/register': { prerender: true },
    // Admin dashboard renders only on server-side
    '/beta/admin/**': { ssr: true },
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@sentry/nuxt/module',
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
        language: 'en',
        file: 'en-US.json',
      },
      {
        code: 'es',
        language: 'es',
        file: 'es-ES.json',
      },
      {
        code: 'fr',
        language: 'fr',
        file: 'fr-FR.json',
      },
    ],
    lazy: true,
    defaultLocale: 'en',
    strategy: 'prefix',
    trailingSlash: true,
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
  // TODO: add sentry config for stack traces based on source maps
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/#add-readable-stack-traces-to-errors
})
