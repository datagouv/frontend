import { render, h } from 'vue'
import type { Component, VNode } from 'vue'

const createElement = () =>
  typeof document !== 'undefined' ? document.createElement('div') : null

function mount(component: Component, { props }: { props?: object } = {}) {
  let el: Element | null = createElement()

  let vNode: VNode | null = h(component, props)

  if (el) {
    render(vNode, el)
  }

  const destroy = () => {
    if (el) {
      render(null, el)
    }
    el = null
    vNode = null
  }

  return { vNode, destroy, el }
}

export default mount
