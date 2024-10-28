import type { Position } from '~/components/Toaster/defaults/positions'
import mount from '~/components/Toaster/helpers/mount-component'
import emitter from '~/components/Toaster/helpers/event-bus'
import Toaster from '~/components/Toaster/Toaster.client.vue'

export type Type = 'default' | 'success' | 'info' | 'warning' | 'error'

export type Options = {
  message?: string
  type?: Type
  position?: Position
  duration?: number | false
  dismissible?: boolean
  onClick?: CallableFunction
  onClose?: CallableFunction
  queue?: boolean
  maxToasts?: number | false
  pauseOnHover?: boolean
  useDefaultCss?: boolean
}

function api(globalOptions: Options = {}) {
  return {
    show(message: string, options: Options = {}) {
      const localOptions = { message, ...options }
      const c = mount(Toaster, {
        props: { ...globalOptions, ...localOptions },
      })
      return c
    },
    clear() {
      emitter.emit('toast-clear')
    },
    success(message: string, options: Options = {}) {
      options.type = 'success'
      return this.show(message, options)
    },
    error(message: string, options: Options = {}) {
      options.type = 'error'
      return this.show(message, options)
    },
    info(message: string, options: Options = {}) {
      options.type = 'info'
      return this.show(message, options)
    },
    warning(message: string, options: Options = {}) {
      options.type = 'warning'
      return this.show(message, options)
    },
  }
}

export default api
