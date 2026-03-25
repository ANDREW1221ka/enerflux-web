export type Installation = {
  id: string
  name: string
  companyId: string
  companyName: string
  type: string
  location: string
  active: boolean
  createdAt: string
}

export type CreateInstallationPayload = {
  name: string
  companyId: string
  companyName: string
  type: string
  location: string
  active: boolean
}

export type UpdateInstallationPayload = CreateInstallationPayload & {
  id: string
}
