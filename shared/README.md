# @datagouv/components

In this document, "the user" is the application using `@datagouv/components` (for example: `front-end` or `udata-front-kit`).

## Usage

### Config

`@datagouv/components` provides a Vue plugin to load the configuration.

```ts
import { datagouv } from '@datagouv/components-next'

app.use(datagouv, {
    name: 'data.gouv.fr', // Name of the site in some texts
    baseUrl: 'https://www.data.gouv.fr', // Used for redirects
    apiBase: 'https://www.data.gouv.fr', // Used for API calls (could default to `baseUrl`?)
    staticUrl: 'https://static.data.gouv.fr', // Used for static files
})
```

### Special functions and components (only for Nuxt)

Nuxt is a special environnement (both server and browser) and require some special functions and components to work.

```ts
import { NuxtLinkLocale, TextClamp } from '#components'
import { datagouv, type UseFetchFunction } from '@datagouv/components-next'

const runtimeConfig = useRuntimeConfig()

app.vueApp.use(datagouv, {
    // These are the same as above…
    name: runtimeConfig.public.title,
    baseUrl: runtimeConfig.public.i18n.baseUrl,
    apiBase: runtimeConfig.public.apiBase,
    devApiKey: runtimeConfig.public.devApiKey,
    staticUrl: runtimeConfig.public.staticUrl,

    // ----------------------------------------
    // --- Special functions and components ---

    // Tell `@datagouv/components` to use `useFetch` from Nuxt instead of custom built-in.
    customUseFetch: useFetch as UseFetchFunction, 

    // Nuxt doesn't like `TextClamp` in the server, provides the client only `TextClamp`
    textClamp: TextClamp,

    // Provide the component to create links inside the application
    // This component will receive the raw link (without i18n prefix)
    // and needs to add it.
    appLink: NuxtLinkLocale,
})
```

### CSS

`@datagouv/components` is using TailwindCSS and some DSFR right now. The user needs to provide the correct version of the DSFR. Concerning TailwindCSS, there is two modes:

1. If the user is using TailwindCSS, it can import a full TailwindCSS config with `@import "@datagouv/components-next/assets/main.css";`, then build the CSS via TailwindCSS CLI or Vite plugin.
2. If the user is not using TailwindCSS, it can import an already built CSS file with `@import '@datagouv/components-next/assets/dist.css';`. Note @dev, this file should be built before publishing the package to NPM with `npm run css`.

### I18n

`@datagouv/components` is using `vue-i18n` to provide internationalisation. As always, there is two modes:

1. If the user is using Nuxt, it can simply add the locales files in the `nuxt.config.ts`

```ts
{
    code: 'fr',
    language: 'fr',
    files: ['fr-FR.json', '../../node_modules/@datagouv/components-next/src/locales/fr.json'],
},
```

Nuxt is responsible for building the JSON file to the correct `vue-i18n` JS format.

2. If the user is not using Nuxt, it should provide the i18n object to the `datagouv` Vue plugin. The plugin will then merge the already built messages's files. Note @dev, the messages's files should be built with `npm run i18n` before publishing the package to NPM.

### `Supense`

To work with Nuxt, some components are doing HTTP requests during the `setup` function (Nuxt can then do SSR for these requests: doing these requests server-side). These components need to be wrapped in a [`<Suspense>`](https://vuejs.org/guide/built-ins/suspense) wrapper (you can even provide a `#fallback`). You can either wrap individual components inside `<Suspense>` or wrap you're entire application/layout in `<Suspense>`

```html
<Suspense>
    <DatasetInformationPanel v-if="dataset" :dataset="dataset" />
</Suspense>
```

## Development

### Config

You can use the config with the composable `useComponentsConfig()`.

```ts
import { useComponentsConfig } from '../main'

const config = useComponentsConfig()
```

### Special functions and components (only for Nuxt)

> [!WARNING]  
> In `@datagouv/components` there is a few functions and components we cannot use directly:
> - `TextClamp` component
> - `useFetch` Nuxt function 

To use these, you need to get them from the config or via special wrappers.

#### `useFetch`

```ts
import { useFetch } from '../functions/api'

const { data: allLicenses } = await useFetch<Array<License>>('/api/1/datasets/licenses/')
```

This wrapper will use the provided `useFetch` function from Nuxt or a custom built-in replacement (should work in most of the case but is a really simplify version of the Nuxt one).

#### `TextClamp`

Use the component from the config (could add a wrapper in the future to simplify this).

```ts
import { useComponentsConfig } from '../main'

const config = useComponentsConfig()
```

```html
<component
    :is="config.textClamp"
    v-if="config && config.textClamp"
    class="fr-mx-1v"
    :auto-resize="true"
    :text="organization.name"
    :max-lines="1"
/>
```

> [!NOTE]  
> Nuxt doesn't even allow to load the `vue3-text-clamp` library in the server so we need to use dynamic import in the plugin config to be sure it's only loaded on non-Nuxt environment.

#### Links

To do links in the application you can use the `<AppLink>` component. No sure why it's required. Maybe we could always use a `<RouterLink>` from `vue-router` since every users is using `vue-router`? I think it's useful to add lang prefix to links but it's not done yet? Need testing.

Maybe this component shouldn't be exposed too, because I don't know why a user should use this instead of his own component (`<RouterLink>` or `NuxtLinkLocale`…)