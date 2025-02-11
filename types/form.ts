import type { Organization } from '@datagouv/components'

export type DSFRFormDefaultState = 'default'

export type DSFRFormFunctionalState = 'error' | 'success'

export type DSFRFormState = DSFRFormDefaultState | DSFRFormFunctionalState

export type FormFunctionalState = DSFRFormFunctionalState | 'warning'

export type AccordionFunctionalState = FormFunctionalState | 'disabled'

export type DSFRInfoState = 'info'

export type PublishingFormAccordionState = AccordionFunctionalState | DSFRInfoState

export type AccordionState = DSFRFormDefaultState | AccordionFunctionalState | DSFRInfoState

export type OrganizationSuggest = { id: string, image_url: string, name: string }

export type OrganizationOrSuggest = Organization | OrganizationSuggest

export type DatasetSearchParams = {
  q?: string
  sort?: string
  organization?: string
  page?: string
  type?: string
  tag?: string
  format?: string
  license?: string
  schema?: string
  spatial_coverage?: string
  spatial_granularity?: string
  page_size?: string
}
