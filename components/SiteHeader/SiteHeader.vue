<template>
  <header
    role="banner"
    class="fr-header"
  >
    <div class="fr-header__body">
      <div
        class="fr-container"
        :class="{ 'max-w-none overflow-hidden': fluid }"
      >
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  République <br>Française
                </p>
              </div>
              <div class="lg:!hidden flex flex-row items-start justify-end p-1 -mr-1 mt-1 order-3 flex-1 self-stretch z-[1000] gap-3">
                <button
                  :id="searchButtonId"
                  class="flex-none inline-block w-10 h-10 text-primary"
                  :aria-controls="searchModalId"
                  :title="$t('Search')"
                  type="button"
                  @click="openSearchModal"
                >
                  <Icon
                    class="text-2xl align-middle"
                    name="ri:search-line"
                  />
                </button>
                <button
                  :id="menuButtonId"
                  class="flex-none inline-block w-10 h-10 text-primary border-solid border border-gray-300"
                  :aria-controls="menuModalId"
                  :title="$t('Menu')"
                  type="button"
                  @click="openMenuModal"
                >
                  <Icon
                    name="ri:menu-line"
                    class="text-2xl align-middle"
                  />
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <a
                href="/"
                title="Retourner à l'accueil de data.gouv.fr"
              >
                <SiteLogo class="h-6" />
              </a>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul
                v-if="me"
                class="fr-btns-group"
              >
                <li>
                  <a
                    :href="me.page"
                    class="fr-btn fr-icon-svg fr-icon--sm fr-grid-row"
                  >
                    <!-- <img src="/api/1/avatars/65cb36cd69808422020f9b04/24" width="24" height="24" loading="lazy" alt="" class="fr-mr-1w rounded-circle"> -->
                    {{ me.first_name }} {{ me.last_name }}
                  </a>
                </li>
                <li>
                  <a
                    href="/en/newadmin/"
                    class="fr-btn fr-icon-svg fr-icon--sm"
                  >
                    <span class="fr-mr-1w fr-grid-row">
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.67015 8.49991C1.45879 8.1344 1.29448 7.74364 1.18115 7.33691C1.68409 7.08111 2.00093 6.56472 2.00114 6.00047C2.00135 5.43622 1.6849 4.91959 1.18215 4.66341C1.40817 3.84615 1.83852 3.09989 2.43265 2.49491C2.90581 2.80253 3.51158 2.81853 4.00032 2.53633C4.48905 2.25412 4.77803 1.72148 4.74815 1.15791C5.56921 0.945723 6.43077 0.946067 7.25165 1.15891C7.22204 1.72247 7.51124 2.25496 8.00007 2.53694C8.4889 2.81893 9.09463 2.80269 9.56765 2.49491C9.85715 2.78991 10.1142 3.12541 10.3302 3.49991C10.5467 3.87441 10.7087 4.26491 10.8192 4.66291C10.3162 4.91871 9.99938 5.43511 9.99917 5.99935C9.99896 6.5636 10.3154 7.08024 10.8182 7.33641C10.5921 8.15367 10.1618 8.89994 9.56765 9.50491C9.0945 9.1973 8.48873 9.18129 7.99999 9.4635C7.51125 9.7457 7.22227 10.2783 7.25215 10.8419C6.4311 11.0541 5.56954 11.0538 4.74865 10.8409C4.77827 10.2774 4.48907 9.74487 4.00024 9.46288C3.51141 9.1809 2.90567 9.19714 2.43265 9.50491C2.13715 9.20338 1.88095 8.86571 1.67015 8.49991ZM4.50004 8.59792C5.03285 8.90524 5.43346 9.39843 5.62504 9.98292C5.87454 10.0064 6.12504 10.0069 6.37454 9.98342C6.56624 9.39885 6.96703 8.90564 7.50004 8.59842C8.03264 8.29027 8.6603 8.18966 9.26254 8.31592C9.40754 8.11192 9.53253 7.89442 9.63653 7.66692C9.22625 7.20864 8.99959 6.61503 9.00004 5.99992C9.00004 5.36992 9.23503 4.78142 9.63653 4.33292C9.5318 4.1055 9.40627 3.88824 9.26153 3.68392C8.65968 3.81008 8.03243 3.70966 7.50004 3.40192C6.96722 3.09461 6.56661 2.60141 6.37504 2.01692C6.12554 1.99342 5.87504 1.99292 5.62554 2.01642C5.43383 2.601 5.03304 3.0942 4.50004 3.40142C3.96743 3.70958 3.33977 3.81018 2.73754 3.68392C2.59282 3.88807 2.4676 4.10535 2.36354 4.33292C2.77382 4.7912 3.00048 5.38482 3.00004 5.99992C3.00004 6.62992 2.76504 7.21842 2.36354 7.66692C2.46827 7.89435 2.5938 8.11161 2.73854 8.31592C3.34039 8.18977 3.96764 8.29018 4.50004 8.59792ZM6.00006 7.49995C5.17163 7.49995 4.50006 6.82837 4.50006 5.99995C4.50006 5.17152 5.17163 4.49995 6.00006 4.49995C6.82849 4.49995 7.50006 5.17152 7.50006 5.99995C7.50006 6.82837 6.82849 7.49995 6.00006 7.49995ZM6.00006 6.49994C6.2762 6.49994 6.50006 6.27609 6.50006 5.99994C6.50006 5.7238 6.2762 5.49994 6.00006 5.49994C5.72392 5.49994 5.50006 5.7238 5.50006 5.99994C5.50006 6.27609 5.72392 6.49994 6.00006 6.49994Z"
                            fill="#3558A2"
                          />
                        </g>
                      </svg>
                    </span>
                    Administration
                  </a>
                </li>
                <li>
                  <a
                    :href="`${config.public.apiBase}/en/logout`"
                    class="fr-btn fr-icon-logout-box-r-line"
                  >
                    {{ $t('Logout') }}
                  </a>
                </li>
              </ul>
              <ul
                v-else
                class="fr-btns-group"
              >
                <li>
                  <NuxtLinkLocale
                    class="fr-btn items-center"
                    to="/login"
                  >
                    <Icon
                      class="mr-2"
                      name="ri:lock-line"
                    />
                    {{ $t("Log in") }}
                  </NuxtLinkLocale>
                </li>
                <li>
                  <NuxtLinkLocale
                    class="fr-btn"
                    to="/register"
                  >
                    <Icon
                      class="mr-2"
                      name="ri:account-circle-line"
                    />
                    {{ $t("Register") }}
                  </NuxtLinkLocale>
                </li>
              </ul>
            </div>
            <div
              class="fr-header__search"
            >
              <div class="fr-container hidden lg:block fr-container-lg--fluid">
                <div
                  class="fr-search-bar"
                  role="search"
                >
                  <label
                    class="fr-label"
                    :for="searchInputId"
                  > {{ $t('Search') }} </label> <input
                    :id="searchInputId"
                    class="fr-input"
                    :placeholder="$t('Search')"
                    type="search"
                  > <button
                    class="fr-btn"
                    :title="$t('Search')"
                  >
                    {{ $t('Search') }}
                  </button>
                </div>
              </div>
            </div>
            <Modal
              :modal-id="searchModalId"
              class="fr-header__search"
              :title="$t('Search')"
              :show-title="false"
              :opened="searchOpened"
              size="fullscreen"
              @close="closeSearchModal"
            >
              <div class="fr-container fr-container-lg--fluid">
                <div
                  class="fr-search-bar"
                  role="search"
                >
                  <label
                    class="fr-label"
                    :for="searchInputId"
                  > {{ $t('Search') }} </label> <input
                    :id="searchInputId"
                    class="fr-input"
                    :placeholder="$t('Search')"
                    type="search"
                  > <button
                    class="fr-btn"
                    :title="$t('Search')"
                  >
                    {{ $t('Search') }}
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fr-header__menu hidden lg:block"
    >
      <div
        class="fr-container"
        :class="{ 'max-w-none overflow-hidden': fluid }"
      >
        <nav
          class="fr-nav"
          role="navigation"
          aria-label="Menu principal"
        >
          <ul class="fr-nav__list">
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                href="#"
                target="_self"
              >
                accès direct
              </a>
            </li>
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                href="#"
                target="_self"
              >accès direct</a>
            </li>
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                href="#"
                target="_self"
              >accès direct</a>
            </li>
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                href="#"
                target="_self"
              >accès direct</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <Modal
      :modal-id="menuModalId"
      :title="$t('Menu')"
      :show-title="false"
      :opened="menuOpened"
      size="fullscreen"
      class="fr-header-menu"
      @close="closeMenuModal"
    >
      <div class="fr-container">
        <nav
          class="fr-nav"
          role="navigation"
          aria-label="Menu principal"
        >
          <ul class="fr-nav__list">
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                href="#"
                target="_self"
              >
                accès direct
              </a>
            </li>
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                href="#"
                target="_self"
              >accès direct</a>
            </li>
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                href="#"
                target="_self"
              >accès direct</a>
            </li>
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                href="#"
                target="_self"
              >accès direct</a>
            </li>
          </ul>
        </nav>
      </div>
    </Modal>
  </header>
</template>

<script setup lang="ts">
import SiteLogo from '../SiteLogo.vue'
import { useMaybeMe } from '~/utils/auth'

defineProps<{
  fluid?: boolean
}>()

const config = useRuntimeConfig()

const menuModalId = useId()
const menuButtonId = useId()
const searchModalId = useId()
const searchButtonId = useId()
const searchInputId = useId()

const searchOpened = ref(false)
const menuOpened = ref(false)

function openSearchModal() {
  searchOpened.value = true
}

function closeSearchModal() {
  searchOpened.value = false
}

function openMenuModal() {
  menuOpened.value = true
}

function closeMenuModal() {
  menuOpened.value = false
}

const me = useMaybeMe()
</script>
