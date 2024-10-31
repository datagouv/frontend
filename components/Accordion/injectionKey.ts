export type AccordionRegister = () => {
  expanded: ComputedRef<boolean>
  toggle: () => void
  unregister: () => void
}
export const key = Symbol() as InjectionKey<AccordionRegister>
