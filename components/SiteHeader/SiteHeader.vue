<template>
  <header
    role="banner"
    class="fr-header"
  >
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  République <br>Française
                </p>
              </div>
              <div class="lg:hidden flex flex-row items-start justify-end p-1 -mr-1 mt-1 order-3 flex-1 self-stretch z-[1000] gap-3">
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
                title="Accueil - [À MODIFIER - Nom du site / service] - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)"
              >
                <p class="fr-header__service-title"> Nom du site / service </p>
              </a>
              <p class="fr-header__service-tagline">
                baseline - précisions sur l‘organisation
              </p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-btns-group">
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
</script>
