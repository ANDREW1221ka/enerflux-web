import type { UserRole } from '../hooks/useAuth'

export type CreateUserPayload = {
  displayName: string
  email: string
  companyName: string
  role: UserRole
  active: boolean
}
