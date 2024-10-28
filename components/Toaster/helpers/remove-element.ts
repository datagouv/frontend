const removeElement = (el: Element) => {
  if (typeof el.remove !== 'undefined') {
    el.remove()
  }
  else {
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
}

export { removeElement }
