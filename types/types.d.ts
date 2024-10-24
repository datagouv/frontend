export type SortDirection = 'asc' | 'desc';

export type DSFRFormDefaultState = "default";

export type DSFRFormFunctionalState = "error" | "success";

export type DSFRFormState = DSFRFormDefaultState | DSFRFormFunctionalState;

export type FormFunctionalState = DSFRFormFunctionalState | "warning";

export type AccordionFunctionalState = FormFunctionalState | "disabled";

export type DSFRInfoState = "info";

export type PublishingFormAccordionState = AccordionFunctionalState | DSFRInfoState;

export type AccordionState = DSFRFormDefaultState | AccordionFunctionalState | DSFRInfoState;

export type AdminBadgeState = DSFRFormDefaultState | FormFunctionalState | DSFRInfoState;

export type PaginatedArray<T> = {
    data: Array<T>;
    next_page: string | null;
    page: number;
    page_size: number;
    previous_page: string | null;
    total: number;
};