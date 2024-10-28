import createToaster from '~/components/Toaster/api'

export function useToast() {
  const toast = createToaster({
    duration: false,
    dismissible: true,
  })

  return { toast }
}
