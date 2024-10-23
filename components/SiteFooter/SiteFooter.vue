<template>
  <!-- <footer role="contentinfo">
    <div class="fr-follow">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-8 flex">
            <div class="fr-col-auto fr-mr-5v">
              <img
                src="/img/newsletter.svg"
                loading="lazy"
                width="71"
                height="55"
              >
            </div>
            <div class="fr-follow__newsletter fr-col">
              <div>
                <p class="fr-h4">
                  {{ $t("Subscribe to our newsletter") }}
                </p>
                <p class="fr-text--lg fr-text--alt f-italic">
                  {{
                    $t("To stay up to date about {site} and open data news, subscribe to our newsletter and follow our events.", 
                       { site: title })
                  }}
                </p>
              </div>
              <div>
                <a
                  class="fr-btn fr-mr-2w fr-my-1w"
                  :title="$t('Subscribe to our newsletter')"
                  href="{{ config.NEWSLETTER_SUBSCRIPTION_URL }}"
                >
                  {{ $t("Subscribe") }}
                </a>
                <a
                  class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
                  :title="$t('Subscribe to our newsletter')"
                  href="{{ url_for('gouvfr.show_page', slug='webinaires') }}"
                >
                  {{ $t("See our next events") }}
                </a>
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
                    <span
                      class="fr-icon-twitter-line fr-mr-1w"
                      aria-hidden="true"
                    /> Twitter
                  </a>
                </li>
                <li>
                  <a
                    class="fr-link"
                    :title="$t('Linkedin - new tab')"
                    href="https://www.linkedin.com/company/data-gouv-fr/"
                    target="_blank"
                  >
                    <span
                      class="fr-icon-linkedin-box-line fr-mr-1w"
                      aria-hidden="true"
                    />
                    Linkedin
                  </a>
                </li>
                <li>
                  <a
                    class="fr-link"
                    :title="$t('Mastodon - new tab')"
                    href="https://social.numerique.gouv.fr/@datagouvfr"
                    target="_blank"
                  >
                    <span
                      class="fr-icon-mastodon-line fr-mr-1w"
                      aria-hidden="true"
                    />
                    Mastodon
                  </a>
                </li>
                <li>
                  <a
                    class="fr-link"
                    :title="$t('Github - new tab')"
                    href="https://github.com/etalab/data.gouv.fr"
                    target="_blank"
                  >
                    <span
                      class="fr-icon-github-line fr-mr-1w"
                      aria-hidden="true"
                    /> Github
                  </a>
                </li>
                <li>
                  <a
                    class="fr-link"
                    :title="$t('RSS - new tab')"
                    href="{{ url_for('datasets.recent_feed') }}"
                    target="_blank"
                  >
                    <span
                      class="fr-icon-rss-line fr-mr-1w"
                      aria-hidden="true"
                    /> RSS
                  </a>
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
                {% for item in nav.gouvfr_opendata %}
                <li>
                  <a
                    class="fr-footer__top-link"
                    :href="item.url"
                  >{{ item.label }}</a>
                </li>
                {% endfor %}
              </ul>
            </div>
            <div class="fr-col-12 fr-col-sm-3">
              <h3 class="fr-footer__top-cat">
                {{ $t('Platform') }}
              </h3>
              <ul class="fr-footer__top-list">
                {% for item in nav.gouvfr_platform %}
                <li>
                  <a
                    class="fr-footer__top-link"
                    :href="item.url"
                  >{{ item.label }}</a>
                </li>
                {% endfor %}
              </ul>
            </div>
            <div class="fr-col-12 fr-col-sm-3">
              <h3 class="fr-footer__top-cat">
                {{ $t('Resources') }}
              </h3>
              <ul class="fr-footer__top-list">
                {% for item in nav.gouvfr_resources %}
                <li>
                  <a
                    class="fr-footer__top-link"
                    :href="item.url"
                  >{{ item.label }}</a>
                </li>
                {% endfor %}
              </ul>
            </div>
            <div class="fr-col-12 fr-col-sm-3">
              <h3 class="fr-footer__top-cat">
                {{ $t('Development') }}
              </h3>
              <ul class="fr-footer__top-list">
                <li>
                  <a
                    :href="config.API_DOC_EXTERNAL_LINK"
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
                    {{ $t('Open-source engine: udata ({version})', { version: package_version('udata') })}}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/datagouv/udata-front/"
                    title="{{ _('data.gouv.fr extension: udata-front') }}"
                    class="fr-footer__top-link"
                  >
                    {{ $t('udata theme extension: udata-front ({version})', { version: package_version('udata-front') }) }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {% endcache %}
      <div class="fr-container">
        <div class="fr-footer__body">
          {% cache cache_duration, 'footer-brand-and-links',
          g.lang_code|default(config.DEFAULT_LANGUAGE)|string %}
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
              {% include theme('svg/logotype.svg') %}
            </a>
          </div>
          <div class="fr-footer__content">
            <p class="fr-footer__content-desc">
              {{ $t("A product of the Direction Interministérielle du Numérique(DINUM).") }}
            </p>
            <ul class="fr-footer__content-list">
              {% for item in nav.gouvfr_network %}
              <li class="fr-footer__content-item">
                <a
                  class="fr-footer__content-link"
                  target="_blank"
                  :href="item.url"
                >{{ item.label
                }}</a>
              </li>
              {% endfor %}
            </ul>
          </div>
          {% endcache %}
          <div class="fr-col-auto fr-ml-auto self-end">
            <nav
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
            </nav>
          </div>
        </div>
        <div class="fr-footer__bottom">
          <ul class="fr-footer__bottom-list">
            {% for item in nav.gouvfr_footer %}
            <li class="fr-footer__bottom-item">
              <a
                :href="'' if item.items else item.url"
                class="fr-footer__bottom-link"
              >
                {{ item.label }}
              </a>
            </li>
            {% endfor %}
          </ul>
          <div class="fr-footer__bottom-copy">
            <p>
              {{ $t("Unless otherwise stated, all content of this site is availabe under <a href='{lo_url}'>Open Licence 2.0 </a>", {
                lo_url: "https://github.com/etalab/licence-ouverte/blob/master/LO.md#licence-ouverte-20open-licence-20",
              }) }}
            </p>
          </div>
        </div>
        {% endcache %}
      </div>
    </div>
  </footer> -->
</template>

<script setup lang="ts">

</script>
