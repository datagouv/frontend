import type { User } from '../types/users'
import { useComponentsConfig } from '../main'

export function getUserAvatar(user: User, size: number) {
  const config = useComponentsConfig()
  return user.avatar_thumbnail || `${config.apiBase}/api/1/avatars/${user.id}/${size}`
}
