import { enGB as en, es, fr } from 'date-fns/esm/locale';

export function useDateFnsLocale()
{
    const i18n = useI18n()
    return { en, es, fr }[i18n.locale.value] || null
}