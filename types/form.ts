export type DSFRFormDefaultState = 'default'

export type DSFRFormFunctionalState = 'error' | 'success'

export type DSFRFormState = DSFRFormDefaultState | DSFRFormFunctionalState

export type FormFunctionalState = DSFRFormFunctionalState | 'warning'

export type AccordionFunctionalState = FormFunctionalState | 'disabled'

export type DSFRInfoState = 'info'

export type PublishingFormAccordionState = AccordionFunctionalState | DSFRInfoState

export type AccordionState = DSFRFormDefaultState | AccordionFunctionalState | DSFRInfoState
