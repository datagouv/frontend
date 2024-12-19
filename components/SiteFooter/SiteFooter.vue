<template>
  <footer role="contentinfo">
    <div class="fr-follow">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-8 flex">
            <div class="fr-col-auto fr-mr-5v">
              <NuxtImg
                src="/img/newsletter.svg"
                loading="lazy"
                width="71"
                height="55"
              />
            </div>
            <div class="fr-follow__newsletter fr-col">
              <div>
                <p class="fr-h4">
                  {{ $t("Subscribe to our newsletter") }}
                </p>
                <p class="fr-text--lg fr-text--alt f-italic">
                  {{
                    $t("To stay up to date about {site} and open data news, subscribe to our newsletter and follow our events.",
                       { site: config.public.title })
                  }}
                </p>
              </div>
              <div>
                <NuxtLinkLocale
                  class="fr-btn fr-mr-2w fr-my-1w"
                  :title="$t('Subscribe to our newsletter')"
                  :to="config.public.newsletterSubscriptionUrl"
                  :external="true"
                >
                  {{ $t("Subscribe") }}
                </NuxtLinkLocale>
                <NuxtLinkLocale
                  class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
                  :title="$t('Subscribe to our newsletter')"
                  to="/pages/webinaires/"
                  :external="true"
                >
                  {{ $t("See our next events") }}
                </NuxtLinkLocale>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <div class="fr-follow__social">
              <p class="fr-h5">
                {{ $t("Follow us") }}
                <br> {{ $t("on social media") }}
              </p>
              <ul class="fr-links-group">
                <li>
                  <a
                    class="fr-link"
                    :title="$t('Twitter - new tab')"
                    href="https://twitter.com/datagouvfr"
                    target="_blank"
                  >
                    <RiTwitterXLine />
                  </a>
                </li>
                <li>
                  <a
                    class="fr-link"
                    :title="$t('Linkedin - new tab')"
                    href="https://www.linkedin.com/company/data-gouv-fr/"
                    target="_blank"
                  >
                    <RiLinkedinLine />
                  </a>
                </li>
                <li>
                  <a
                    class="fr-link"
                    :title="$t('Mastodon - new tab')"
                    href="https://social.numerique.gouv.fr/@datagouvfr"
                    target="_blank"
                  >
                    <RiMastodonLine />
                  </a>
                </li>
                <li>
                  <a
                    class="fr-link"
                    :title="$t('Github - new tab')"
                    href="https://github.com/datagouv/data.gouv.fr"
                    target="_blank"
                  >
                    <RiGithubLine />
                  </a>
                </li>
                <li>
                  <NuxtLinkLocale
                    class="fr-link"
                    :title="$t('RSS - new tab')"
                    to="datasets/recent.atom"
                    :external="true"
                    target="_blank"
                  >
                    <RiRssLine />
                  </NuxtLinkLocale>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      id="footer"
      class="fr-footer"
    >
      <div class="fr-footer__top">
        <div class="fr-container">
          <div class="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
            <div class="fr-col-12 fr-col-sm-3">
              <h3 class="fr-footer__top-cat">
                {{ $t('Open Data') }}
              </h3>
              <ul class="fr-footer__top-list">
                <li
                  v-for="item in openDataLinks"
                  :key="item.label"
                >
                  <a
                    class="fr-footer__top-link"
                    :href="item.link"
                  >{{ item.label }}</a>
                </li>
              </ul>
            </div>
            <div class="fr-col-12 fr-col-sm-3">
              <h3 class="fr-footer__top-cat">
                {{ $t('Platform') }}
              </h3>
              <ul class="fr-footer__top-list">
                <li
                  v-for="item in platformLinks"
                  :key="item.label"
                >
                  <a
                    class="fr-footer__top-link"
                    :href="item.link"
                  >{{ item.label }}</a>
                </li>
              </ul>
            </div>
            <div class="fr-col-12 fr-col-sm-3">
              <h3 class="fr-footer__top-cat">
                {{ $t('Resources') }}
              </h3>
              <ul class="fr-footer__top-list">
                <li
                  v-for="item in resourcesLinks"
                  :key="item.label"
                >
                  <a
                    class="fr-footer__top-link"
                    :href="item.link"
                  >{{ item.label }}</a>
                </li>
              </ul>
            </div>
            <div class="fr-col-12 fr-col-sm-3">
              <h3 class="fr-footer__top-cat">
                {{ $t('Development') }}
              </h3>
              <ul class="fr-footer__top-list">
                <li>
                  <a
                    :href="config.public.apiDocExternalLink"
                    class="fr-footer__top-link"
                  >
                    {{ $t("Portal's API") }}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/opendatateam/udata/"
                    class="fr-footer__top-link"
                  >
                    {{ $t('Open-source engine: udata') }}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/datagouv/front-end/"
                    :title="$t('data.gouv.fr extension: front-end')"
                    class="fr-footer__top-link"
                  >
                    {{ $t('data.gouv.fr front-end') }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-container">
        <div class="fr-footer__body">
          <div class="fr-footer__brand fr-enlarge-link">
            <p
              class="fr-logo"
              title="république française"
            >
              république
              <br>française
            </p>
            <a
              class="fr-footer__brand-link"
              href="/"
              :title="$t('Go back to website home - data.gouv.fr - République Française')"
            >
              <SiteLogo />
            </a>
          </div>
          <div class="fr-footer__content">
            <p class="fr-footer__content-desc">
              {{ $t("A product of the Direction Interministérielle du Numérique(DINUM).") }}
            </p>
            <ul class="fr-footer__content-list">
              <li
                v-for="item in networkLinks"
                :key="item.label"
                class="fr-footer__content-item"
              >
                <a
                  class="fr-footer__content-link"
                  target="_blank"
                  :href="item.link"
                >{{ item.label }}</a>
              </li>
            </ul>
          </div>
          <div class="fr-col-auto fr-ml-auto self-end">
            <!-- <nav
              role="navigation"
              class="fr-translate fr-nav"
            >
              <div class="fr-nav__item">
                <button
                  class="fr-translate__btn fr-btn fr-btn--tertiary"
                  aria-controls="translate-in-footer"
                  aria-expanded="false"
                  :title="$t('Select a Language')"
                >
                  {{ g.lang_code | upper }} - {{ current_language_name() }}
                </button>
                <div
                  id="translate-in-footer"
                  class="fr-collapse fr-translate__menu fr-menu"
                >
                  <ul class="fr-menu__list">
                    {% for code, name in config['LANGUAGES'].items() %}
                    <li>
                      <a
                        class="fr-translate__language fr-nav__link"
                        :hreflang="code"
                        :lang="code"
                        :href="language_url(code)"
                        {% if g.lang_code==code
                         %}aria-current="true" {% endif %}
                        >
                        {{ code | upper }} - {{ name }}
                      </a>
                    </li>
                    {% endfor %}
                  </ul>
                </div>
              </div>
            </nav> -->
          </div>
        </div>
        <div class="fr-footer__bottom">
          <ul class="fr-footer__bottom-list">
            <li
              v-for="item in footerLinks"
              :key="item.label"
              class="fr-footer__bottom-item"
            >
              <NuxtLinkLocale
                :to="item.link"
                :external="true"
                class="fr-footer__bottom-link"
              >
                {{ item.label }}
              </NuxtLinkLocale>
            </li>
          </ul>
          <div class="fr-footer__bottom-copy">
            <p>
              {{ $t("Unless otherwise stated, all content of this site is availabe under") }}
              <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md#licence-ouverte-20open-licence-20">Open Licence 2.0</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RiGithubLine, RiLinkedinLine, RiMastodonLine, RiRssLine, RiTwitterXLine } from '@remixicon/vue'

const config = useRuntimeConfig()

const { t } = useI18n()

type Link = {
  label: string
  link: string
}

const openDataLinks: Array<Link> = [
  { label: t('Topics'), link: '/pages/thematiques-a-la-une' },
  { label: t('Reference Data'), link: 'pages/spd/reference' },
]

if (config.public.csvDatasetId) {
  openDataLinks.push({ label: t('Data catalog'), link: `/datasets/${config.public.csvDatasetId}` })
}

openDataLinks.push({ label: t('Follow data opening'), link: 'https://ouverture.data.gouv.fr' })
openDataLinks.push({ label: t('Portal for European data'), link: 'https://data.europa.eu' })

const platformLinks: Array<Link> = [
  { label: t('Guides'), link: config.public.guidesUrl },
  { label: t('Roadmap and news'), link: '/pages/roadmap' },
  { label: t('Contact us'), link: config.public.supportUrl },
  { label: t('Give us your feedback'), link: config.public.feedbackFormUrl },
  { label: t('Statistics'), link: '/dashboard' },
]

const resourcesLinks: Array<Link> = [
  { label: 'api.gouv.fr', link: 'https://api.gouv.fr' },
  { label: config.public.schemasSite.name, link: config.public.schemasSite.url },
  { label: 'meteo.data.gouv.fr', link: 'https://meteo.data.gouv.fr' },
  { label: 'transport.data.gouv.fr', link: 'https://transport.data.gouv.fr' },
  { label: 'defis.data.gouv.fr', link: 'https://defis.data.gouv.fr' },
]

const footerLinks: Array<Link> = [
  { label: t('Licences'), link: '/pages/legal/licences' },
  { label: t('Terms of use'), link: '/pages/legal/cgu' },
  { label: t('Tracking and privacy'), link: '/pages/gouvfr.suivi' },
  { label: t('Legal notice'), link: '/pages/legal/legal-notice' },
  { label: t('Accessibility: partially compliant'), link: '/pagelegal/accessibility' },
]

const networkLinks: Array<Link> = [
  { label: 'legifrance.gouv.fr', link: 'https://legifrance.gouv.fr' },
  { label: 'info.gouv.fr', link: 'https://www.info.gouv.fr' },
  { label: 'service-public.fr', link: 'https://www.service-public.fr' },
]
</script>
