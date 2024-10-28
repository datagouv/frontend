<template>
  <transition
    ref="el"
    :enter-active-class="transition.enter"
    :leave-active-class="transition.leave"
  >
    <component
      :is="tag"
      v-show="isActive"
      class="grid items-center duration-150 mx-2 my-0 rounded-lg pointer-events-auto text-white min-h-12 cursor-pointer px-2 py-8 break-words"
      :class="[`c-toast--${type}`, `c-toast--${position}`]"
      role="alert"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
      @click="click"
    >
      {{ message }}
    </component>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import Positions, { definePosition } from '~/components/Toaster/defaults/positions'
import type { Position } from '~/components/Toaster/defaults/positions'
import emitter from '~/components/Toaster/helpers/event-bus'
import { removeElement } from '~/components/Toaster/helpers/remove-element'
import Timer from '~/components/Toaster/helpers/timer'

export interface Props {
  message: string
  type?: string
  position?: Position
  maxToasts?: number | false
  duration?: number | false
  dismissible?: boolean
  queue?: boolean
  props?: boolean
  useDefaultCss?: boolean
  onClose?: () => void
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  position: Positions.BOTTOM_RIGHT,
  maxToasts: false,
  duration: 4000,
  dismissible: true,
  queue: false,
  props: true,
  useDefaultCss: true,
  onClose: () => { },
  onClick: () => { },
})
let parentTop: Element | null = null
let parentBottom: Element | null = null
let timer: Timer | null = null
let queueTimer: number | undefined
const el = ref<HTMLElement | null>(null)
const isActive = ref(false)

onBeforeMount(() => {
  createParents()
  setupContainer()
})

onMounted(() => {
  showNotice()
  emitter.on('toast-clear', close)
})

function createParents() {
  parentTop = document.querySelector('.c-toast-container--top')
  parentBottom = document.querySelector('.c-toast-container--bottom')
  if (parentTop && parentBottom) return

  if (!parentTop) {
    parentTop = document.createElement('div')
    parentTop.className = 'c-toast-container c-toast-container--top'
  }

  if (!parentBottom) {
    parentBottom = document.createElement('div')
    parentBottom.className = 'c-toast-container c-toast-container--bottom'
  }
}

function setupContainer() {
  const container = document.body
  if (parentTop) {
    container.appendChild(parentTop)
  }
  if (parentBottom) {
    container.appendChild(parentBottom)
  }
}

function shouldQueue() {
  if (!props.queue && props.maxToasts === false) {
    return false
  }
  let parentTopChildElementCount = 0
  if (parentTop) {
    parentTopChildElementCount = parentTop.childElementCount
  }
  let parentBottomChildElementCount = 0
  if (parentBottom) {
    parentBottomChildElementCount = parentBottom.childElementCount
  }
  if (props.maxToasts !== false) {
    return (
      props.maxToasts
      <= parentTopChildElementCount + parentBottomChildElementCount
    )
  }
  return (
    parentTopChildElementCount > 0
    || parentBottomChildElementCount > 0
  )
}

function showNotice() {
  if (shouldQueue()) {
    queueTimer = window.setTimeout(showNotice, 250)
    return
  }
  const parent = correctParent()
  if (parent && el.value) {
    parent.insertAdjacentElement('afterbegin', el.value)
    isActive.value = true
    timer = props.duration !== false ? new Timer(close, props.duration) : null
  }
}

function click() {
  props.onClick()
  if (props.dismissible) {
    close()
  }
}

function toggleTimer(newVal: boolean) {
  if (timer) {
    if (newVal) {
      timer.pause()
    }
    else {
      timer.resume()
    }
  }
}

function stopTimer() {
  if (timer) {
    timer.stop()
  }
  clearTimeout(queueTimer)
}

function close() {
  stopTimer()
  isActive.value = false
  setTimeout(() => {
    props.onClose()
    if (el.value) {
      removeElement(el.value)
    }
  }, 150)
}

function correctParent() {
  if (!parentTop || !parentBottom) {
    return null
  }
  return definePosition(props.position, parentTop, parentBottom)
}

const transition = computed<{ enter: string, leave: string }>(() => {
  return definePosition(
    props.position,
    {
      enter: 'fadeInDown',
      leave: 'fadeOut',
    },
    {
      enter: 'fadeInUp',
      leave: 'fadeOut',
    },
  )
})

const tag = computed(() => props.dismissible ? 'button' : 'div')

onBeforeUnmount(() => {
  emitter.off('toast-clear', close)
})
</script>

<style scoped>
.c-toast--success {
  background-color: var(--background-flat-success);
}

.c-toast--info {
  background-color: var(--background-flat-info);
}

.c-toast--warning {
  background-color: var(--background-flat-warning);
}

.c-toast--error {
  background-color: var(--background-flat-error);
}

.c-toast--default {
  background-color: #343a40;
}

.c-toast--top, .c-toast--bottom {
  align-self: center;
}

.c-toast--top-right, .c-toast--bottom-right {
  align-self: flex-end;
}

.c-toast--top-left, .c-toast--bottom-left {
  align-self: flex-start;
}

.c-toast-container {
  position: fixed;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2em;
  overflow: hidden;
  z-index: 9999;
  pointer-events: none;
}

.c-toast-container--top {
  flex-direction: column;
}
.c-toast-container--bottom {
  flex-direction: column-reverse;
}

@media screen and (max-width: 768px) {
  .c-toast-container {
    padding: 0;
    position: fixed !important;
  }
}

/*
Animations are taken from animate.css
https://daneden.github.io/animate.css
*/

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
.fadeOut {
  animation-name: fadeOut;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
.fadeInDown {
  animation-name: fadeInDown;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
.fadeInUp {
  animation-name: fadeInUp;
}

/* VUE */

.fade-enter-active {
  transition: opacity 300ms ease-in;
}
.fade-leave-active {
  transition: opacity 150ms ease-out
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
