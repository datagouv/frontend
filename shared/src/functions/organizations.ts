import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import { RiBankLine, RiBuilding2Line, RiCommunityLine, RiGovernmentLine, RiUserLine } from '@remixicon/vue'
import type { Organization } from '../types/organizations'

export const CERTIFIED = 'certified'
export const PUBLIC_SERVICE = 'public-service'
export const ASSOCIATION = 'association'
export const COMPANY = 'company'
export const LOCAL_AUTHORITY = 'local-authority'
export const OTHER = 'other'
export const USER = 'user'

export type OrganizationTypes = typeof PUBLIC_SERVICE | typeof ASSOCIATION | typeof COMPANY | typeof LOCAL_AUTHORITY | typeof OTHER

export type UserType = typeof USER

export function isType(organization: Organization, type: OrganizationTypes) {
  return hasBadge(organization, type)
}

export function hasBadge(organization: Organization, kind: string) {
  return organization.badges.some(badge => badge.kind === kind)
}

export function getOrganizationTypes(): Array<{ type: OrganizationTypes | UserType, label: string, icon: Component | null }> {
  const { t } = useI18n()
  return [{
    type: PUBLIC_SERVICE,
    label: t('Public service'),
    icon: RiBankLine,
  },
  {
    type: LOCAL_AUTHORITY,
    label: t('Local authority'),
    icon: RiGovernmentLine,
  },
  {
    type: ASSOCIATION,
    label: t('Association'),
    icon: RiCommunityLine,
  },
  {
    type: COMPANY,
    label: t('Company'),
    icon: RiBuilding2Line,
  },
  {
    type: OTHER,
    label: t('Other'),
    icon: null,
  },
  {
    type: USER,
    label: t('User'),
    icon: RiUserLine,
  }]
}

export function findOrganizationType(searched: OrganizationTypes | UserType) {
  return getOrganizationTypes().find(type => type.type === searched)!
}

export function getOrganizationType(organization: Organization): OrganizationTypes {
  if (isType(organization, LOCAL_AUTHORITY)) {
    return LOCAL_AUTHORITY
  }
  else if (isType(organization, PUBLIC_SERVICE)) {
    return PUBLIC_SERVICE
  }
  else if (isType(organization, ASSOCIATION)) {
    return ASSOCIATION
  }
  else if (isType(organization, COMPANY)) {
    return COMPANY
  }
  else {
    return OTHER
  }
}

export function isOrganizationCertified(organization: Organization | null): boolean {
  if (!organization) return false
  return hasBadge(organization, CERTIFIED) && (isType(organization, PUBLIC_SERVICE) || isType(organization, LOCAL_AUTHORITY))
}
