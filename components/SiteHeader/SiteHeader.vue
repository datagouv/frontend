<template>
  <header
    role="banner"
    class="fr-header"
  >
    <div class="fr-header__body">
      <div
        class="fr-container"
        :class="{ '!max-w-none': fluid }"
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
                <ModalWithButton
                  :title="$t('Search')"
                  :show-title="false"
                  size="fullscreen"
                >
                  <template #button="{ attrs, listeners }">
                    <button
                      class="flex-none w-10 h-10 text-primary inline-flex items-center justify-center"
                      :title="$t('Search')"
                      v-bind="attrs"
                      v-on="listeners"
                    >
                      <RiSearchLine class="size-6" />
                    </button>
                  </template>
                  <template #default>
                    <div class="w-full fr-container fr-container-lg--fluid">
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
                          class="fr-btn rounded-0 !rounded-r-[0.25rem]"
                          :title="$t('Search')"
                        >
                          {{ $t('Search') }}
                        </button>
                      </div>
                    </div>
                  </template>
                </ModalWithButton>
                <ModalWithButton
                  :title="$t('Menu')"
                  :show-title="false"
                  size="fullscreen"
                  class="fr-header-menu"
                >
                  <template #button="{ attrs, listeners }">
                    <button
                      class="flex-none w-10 h-10 text-primary border-solid border border-gray-300 inline-flex items-center justify-center"
                      :title="$t('Menu')"
                      v-bind="attrs"
                      v-on="listeners"
                    >
                      <RiMenuLine class="size-6" />
                    </button>
                  </template>
                  <template #default>
                    <div class="fr-container">
                      <div class="fr-header__menu-links">
                        <ul
                          v-if="me"
                          class="fr-btns-group fr-btns-group--sm fr-btns-group--icon-left"
                        >
                          <li>
                            <a
                              :href="me.page"
                              class="fr-btn fr-icon-svg fr-icon--sm flex !justify-start !mb-0"
                            >
                              <NuxtImg
                                :src="getUserAvatar(me, 24)"
                                width="24"
                                height="24"
                                loading="lazy"
                                alt=""
                                class="mr-2 rounded-full"
                              />
                              {{ me.first_name }} {{ me.last_name }}
                            </a>
                          </li>
                          <li>
                            <NuxtLinkLocale
                              to="/admin/"
                              :external="true"
                              class="fr-btn !justify-start !text-sm !p-3 !mb-0"
                            >
                              <RiSettings3Line
                                size="1rem"
                                class="fr-mr-1w"
                              />
                              {{ $t("Administration") }}
                            </NuxtLinkLocale>
                          </li>
                          <li>
                            <a
                              :href="`${config.public.apiBase}/logout`"
                              class="fr-btn !justify-start !text-sm !p-3 !mb-0"
                            >
                              <RiLogoutBoxRLine
                                size="1rem"
                                class="fr-mr-1w"
                              />
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
                              class="fr-btn items-center !justify-start !p-3 !mb-0 !text-sm"
                              to="/login"
                            >
                              <RiLockLine class="inline mr-2 size-4" />
                              {{ $t("Log in") }}
                            </NuxtLinkLocale>
                          </li>
                          <li>
                            <NuxtLinkLocale
                              class="fr-btn !justify-start !p-3 !mb-0 !text-sm"
                              to="/register"
                            >
                              <RiAccountCircleLine class="inline mr-2 size-4" />
                              {{ $t("Register") }}
                            </NuxtLinkLocale>
                          </li>
                        </ul>
                      </div>
                      <nav
                        class="fr-nav"
                        role="navigation"
                        :aria-label="$t('Main menu')"
                      >
                        <ul class="fr-nav__list">
                          <li
                            v-for="link in menu"
                            :key="link.link"
                            class="fr-nav__item"
                          >
                            <NuxtLinkLocale
                              v-if="link.link"
                              class="fr-nav__link"
                              :to="link.link"
                              target="_self"
                              :external="link.external"
                            >
                              {{ link.label }}
                            </NuxtLinkLocale>
                            <ClientOnly v-else-if="link.items">
                              <Disclosure>
                                <DisclosureButton
                                  class="fr-nav__btn"
                                >
                                  {{ link.label }}
                                </DisclosureButton>
                                <DisclosurePanel
                                  class="fr-menu"
                                >
                                  <ul class="fr-menu__list">
                                    <li
                                      v-for="item in link.items"
                                      :key="item.label"
                                    >
                                      <DisclosureButton
                                        :as="NuxtLinkLocale"
                                        class="fr-nav__link"
                                        :to="item.link"
                                        :external="true"
                                      >
                                        {{ item.label }}
                                      </DisclosureButton>
                                    </li>
                                  </ul>
                                </DisclosurePanel>
                              </Disclosure>
                            </ClientOnly>
                          </li>
                          <li
                            class="fr-nav__item"
                          >
                            <ClientOnly v-if="!config.public.readOnlyMode">
                              <Disclosure>
                                <DisclosureButton
                                  class="fr-nav__btn justify-start after:!ml-auto"
                                >
                                  <RiAddLine class="size-4 mr-1" />
                                  <span>
                                    {{ $t('Publish on') }}
                                    <SiteLogo />
                                  </span>
                                </DisclosureButton>
                                <DisclosurePanel
                                  class="fr-menu"
                                >
                                  <ul class="fr-menu__list">
                                    <li
                                      v-for="item in filteredPublishMenu"
                                      :key="item.link"
                                    >
                                      <NuxtLinkLocale
                                        class="fr-nav__link flex items-center space-x-1"
                                        :to="item.link"
                                        :external="item.external"
                                      >
                                        <component
                                          :is="item.icon"
                                          class="inline size-4"
                                        />
                                        <span>{{ item.label }}</span>
                                      </NuxtLinkLocale>
                                    </li>
                                  </ul>
                                </DisclosurePanel>
                              </Disclosure>
                            </ClientOnly>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </template>
                </ModalWithButton>
              </div>
            </div>
            <div class="fr-header__service">
              <a
                href="/"
                title="Retourner à l'accueil de data.gouv.fr"
              >
                <SiteLogo class="text-gray-logo text-2xl" />
              </a>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ClientOnly v-if="me">
                <ul
                  class="fr-btns-group"
                >
                  <li>
                    <a
                      :href="me.page"
                      class="fr-btn fr-icon-svg fr-icon--sm fr-grid-row"
                    >
                      <NuxtImg
                        :src="getUserAvatar(me, 24)"
                        width="24"
                        height="24"
                        loading="lazy"
                        alt=""
                        class="mr-2 rounded-full"
                      />
                      {{ me.first_name }} {{ me.last_name }}
                    </a>
                  </li>
                  <li>
                    <NuxtLinkLocale
                      to="/admin/"
                      :external="true"
                      class="fr-btn"
                    >
                      <RiSettings3Line
                        size="1rem"
                        class="fr-mr-1w"
                      />
                      {{ $t("Administration") }}
                    </NuxtLinkLocale>
                  </li>
                  <li>
                    <a
                      :href="`${config.public.apiBase}/logout`"
                      class="fr-btn"
                    >
                      <RiLogoutBoxRLine
                        size="1rem"
                        class="fr-mr-1w"
                      />
                      {{ $t('Logout') }}
                    </a>
                  </li>
                </ul>
              </ClientOnly>
              <ul
                v-else
                class="fr-btns-group"
              >
                <li>
                  <NuxtLinkLocale
                    class="fr-btn items-center"
                    to="/login"
                  >
                    <RiLockLine class="inline mr-2 size-4" />
                    {{ $t("Log in") }}
                  </NuxtLinkLocale>
                </li>
                <li>
                  <NuxtLinkLocale
                    class="fr-btn"
                    to="/register"
                  >
                    <RiAccountCircleLine class="inline mr-2 size-4" />
                    {{ $t("Register") }}
                  </NuxtLinkLocale>
                </li>
              </ul>
            </div>
            <div
              class="fr-header__search"
            >
              <div class="!hidden lg:!block">
                <MenuSearch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fr-header__menu fr-hidden fr-unhidden-lg"
    >
      <div
        class="fr-container"
        :class="{ '!max-w-none !overflow-hidden': fluid }"
      >
        <nav
          class="fr-nav"
          role="navigation"
          :aria-label="$t('Main menu')"
        >
          <ul class="fr-nav__list">
            <li
              v-for="link in menu"
              :key="link.link"
              class="fr-nav__item"
            >
              <NuxtLinkLocale
                v-if="link.link"
                class="fr-nav__link"
                :to="link.link"
                target="_self"
                :external="link.external"
              >
                {{ link.label }}
              </NuxtLinkLocale>
              <ClientOnly v-else-if="link.items">
                <Disclosure>
                  <DisclosureButton
                    class="fr-nav__btn"
                  >
                    {{ link.label }}
                  </DisclosureButton>
                  <DisclosurePanel
                    class="fr-menu"
                  >
                    <ul class="fr-menu__list">
                      <li
                        v-for="item in link.items"
                        :key="item.label"
                      >
                        <NuxtLinkLocale
                          class="fr-nav__link"
                          :to="item.link"
                          :external="true"
                        >
                          {{ item.label }}
                        </NuxtLinkLocale>
                      </li>
                    </ul>
                  </DisclosurePanel>
                </Disclosure>
              </ClientOnly>
            </li>
            <li
              class="fr-nav__item ml-auto sm:!hidden xl:!flex"
            >
              <ClientOnly v-if="!config.public.readOnlyMode">
                <Popover>
                  <PopoverButton
                    class="fr-nav__btn !w-64 inline after:!align-middle"
                  >
                    <RiAddLine class="inline size-4 mr-1" />
                    <span>
                      {{ $t('Publish on') }}
                      <SiteLogo />
                    </span>
                  </PopoverButton>
                  <PopoverPanel
                    v-slot="{ close }"
                    class="fr-menu"
                  >
                    <ul
                      class="fr-menu__list !w-64"
                    >
                      <li
                        v-for="item in filteredPublishMenu"
                        :key="item.link"
                      >
                        <NuxtLinkLocale
                          class="fr-nav__link flex items-center space-x-1"
                          :to="item.link"
                          :external="item.external"
                          @click="close()"
                        >
                          <component
                            :is="item.icon"
                            class="size-4 -mt-1"
                          />
                          <span>{{ item.label }}</span>
                        </NuxtLinkLocale>
                      </li>
                    </ul>
                  </PopoverPanel>
                </Popover>
              </ClientOnly>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RiAccountCircleLine, RiAddLine, RiDatabase2Line, RiGovernmentLine, RiLockLine, RiMenuLine, RiSearchLine, RiRobot2Line, RiLineChartLine, RiServerLine, RiArticleLine, RiSettings3Line, RiLogoutBoxRLine } from '@remixicon/vue'
import { Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { getUserAvatar } from '@datagouv/components'
import { NuxtLinkLocale } from '#components'
import SiteLogo from '~/components/SiteLogo.vue'
import { useMaybeMe } from '~/utils/auth'

defineProps<{
  fluid?: boolean
}>()

const { t } = useI18n()
const config = useRuntimeConfig()
const me = useMaybeMe()

const searchInputId = useId()

const menu = [
  { label: t('Data'), link: '/datasets/', external: true },
  { label: t('API'), link: '/dataservices/', external: true },
  { label: t('Reuses'), link: '/reuses/', external: true },
  { label: t('Organizations'), link: '/organizations/', external: true },
  { label: t('Getting started on {site}', { site: config.public.title }), items: [
    { label: t('What is {site}?', { site: config.public.title }), link: '/pages/about/a-propos_data-gouv/', external: true },
    { label: t('How to publish data?'), link: '/pages/onboarding/producteurs/', external: true },
    { label: t('How to use data?'), link: '/pages/onboarding/reutilisateurs/', external: true },
    { label: t('{site} guides', { site: config.public.title }), link: config.public.guidesUrl, external: true },
  ], external: true },
  { label: t('News'), link: '/posts/' },
  { label: t('Contact us'), link: 'https://support.data.gouv.fr/', external: true },
]

const publishMenu = [
  { label: t('A dataset'), icon: RiDatabase2Line, link: '/beta/admin/datasets/new/' },
  { label: t('A dataservice'), icon: RiRobot2Line, link: '/beta/admin/dataservices/new/' },
  { label: t('A reuse'), icon: RiLineChartLine, link: '/beta/admin/reuses/new/' },
  { label: t('A harverster'), icon: RiServerLine, link: '/beta/admin/harvesters/new/' },
  { label: t('An organization'), icon: RiGovernmentLine, link: '/beta/admin/organizations/new/' },
  { label: t('A post'), icon: RiArticleLine, link: '/beta/admin/posts/new/', show: isAdmin(me.value ?? null) },
]

const filteredPublishMenu = computed(() => publishMenu.filter(item => !('show' in item) || item.show))
</script>
