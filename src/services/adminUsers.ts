import type { UserProfile } from '../hooks/useAuth'
import type { CreateUserPayload } from '../types/adminUsers'

type CreateUserRequest = CreateUserPayload

type CreateUserResponse = {
  user: UserProfile
  source: 'api' | 'mock'
}

const CREATE_USER_MODE = import.meta.env.VITE_ADMIN_CREATE_USER_MODE ?? 'mock'

function toUserProfile(uid: string, input: CreateUserRequest): UserProfile {
  return {
    uid,
    email: input.email,
    displayName: input.displayName,
    role: input.role,
    companyName: input.companyName,
    active: input.active,
  }
}

async function mockCreateUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  return {
    user: toUserProfile(`mock-${Date.now()}`, payload),
    source: 'mock',
  }
}

export async function createAdminUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
  if (CREATE_USER_MODE === 'mock') {
    return mockCreateUser(payload)
  }

  const response = await fetch('/admin/create-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('No fue posible crear el usuario.')
  }

  const data = (await response.json()) as Partial<{ uid: string; user: Partial<UserProfile> }>

  if (data.user) {
    return {
      user: {
        uid: data.user.uid ?? data.uid ?? `pending-${Date.now()}`,
        email: data.user.email ?? payload.email,
        displayName: data.user.displayName ?? payload.displayName,
        role: data.user.role === 'admin' ? 'admin' : payload.role,
        companyName: data.user.companyName ?? payload.companyName,
        active: data.user.active === true,
      },
      source: 'api',
    }
  }

  return {
    user: toUserProfile(data.uid ?? `pending-${Date.now()}`, payload),
    source: 'api',
  }
}
