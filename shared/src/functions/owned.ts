import type { Owned } from '../types/owned'

export function getOwnerName(owned: Owned): string {
  if (owned.organization) {
    return owned.organization.name
  }
  else {
    return `${owned.owner.first_name} ${owned.owner.last_name}`
  }
}
