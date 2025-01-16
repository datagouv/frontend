type UploadAvatarResponse = {
  image: string
  success: boolean
}

export async function uploadProfilePicture(file: File) {
  const api = useNuxtApp().$fileApi
  const formData = new FormData()
  formData.append('file', file)
  const resp = await api<UploadAvatarResponse>(`api/1/me/avatar/`, {
    method: 'POST',
    body: formData,
  })
  return resp
}
