import tailwindcss from '@tailwindcss/vite'

// const swrDuration = process.env.NUXT_TEMPLATE_CACHE_DURATION ? parseInt(process.env.NUXT_TEMPLATE_CACHE_DURATION) : 60
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@sentry/nuxt/module',
  ],
  devtools: { enabled: true, componentInspector: false },

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
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      i18n: {
        baseUrl: 'https://www.data.gouv.fr/', // NUXT_PUBLIC_I18N_BASE_URL
      },

      apiBase: 'http://dev.local:7000',
      devApiKey: undefined,

      qualityDescriptionLength: 100,
      searchAutocompleteDebounce: 200,
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

      forumUrl: 'https://forum.data.gouv.fr/',
      feedbackFormUrl: 'https://tally.so/r/mOld5R',
      betaAdminFeedbackUrl: 'https://tally.so/r/nP25OB',
      publishingDatasetFeedbackUrl: 'https://tally.so/r/nGo0yO',
      publishingDataserviceFeedbackUrl: 'https://tally.so/r/w2J7lL',
      publishingReuseFeedbackUrl: 'https://tally.so/r/mV98y6',
      publishingHarvesterFeedbackUrl: 'https://tally.so/r/3NMLOQ',
      harvesterRequestValidationUrl: 'https://support.data.gouv.fr/help/datagouv/moissonnage#support-tree',
      harvesterPreviewMaxItems: 20, // SHould be the same as `HARVEST_PREVIEW_MAX_ITEMS` in udata

      newsletterSubscriptionUrl: 'https://qvo970cr.sibpages.com/',

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
      matomoHost: undefined,

      // Matomo ID of your site. Check the Matomo backend for it
      matomoSiteId: 1,
    },
  },

  routeRules: {
    '/*/organizations/': { ssr: true },
    '/*/posts/': { ssr: true },
    '/*/posts/**': { ssr: true },
    // Admin dashboard renders only on server-side
    '/*/beta/admin/**': { ssr: true },
  },

  sourcemap: { client: 'hidden' },

  devServer: {
    port: 3000,
    host: 'dev.local',
  },

  features: {
    inlineStyles: false,
  },
  compatibilityDate: '2024-04-03',

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['dev.local'],
    },
  },

  typescript: {
    typeCheck: false,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    baseUrl: '',
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

  sentry: {
    sourceMapsUploadOptions: {
      // disable sourcemaps upload from build, it's done later during the release with sentry-cli
      enabled: false,
    },
  },
  // TODO: add sentry config for stack traces based on source maps
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/#add-readable-stack-traces-to-errors
})
