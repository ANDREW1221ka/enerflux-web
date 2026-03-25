import type { ClientRole, UserRole } from '../hooks/useAuth'

export type CreateUserPayload = {
  displayName: string
  email: string
  role: UserRole
  clientRole: ClientRole
  companyId: string
  companyName: string
  active: boolean
}
