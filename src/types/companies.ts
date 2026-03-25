export type Company = {
  id: string
  name: string
  active: boolean
  createdAt: string
}

export type CreateCompanyPayload = {
  name: string
  active: boolean
}
