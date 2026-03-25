import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import type { UserProfile } from '../hooks/useAuth'
import type { CreateUserPayload } from '../types/adminUsers'
import { getCompanyById } from './companies'
import { db } from './firebase'

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
    clientRole: input.clientRole,
    companyId: input.companyId,
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

async function hasAnotherPlatformAdmin(excludeUid?: string): Promise<boolean> {
  const usersQuery = query(collection(db, 'users'), where('role', '==', 'platform_admin'))
  const snapshot = await getDocs(usersQuery)

  if (!excludeUid) {
    return !snapshot.empty
  }

  return (snapshot.docs as Array<{ id: string }>).some((userDocument) => userDocument.id !== excludeUid)
}

async function ensureValidClientCompany(payload: { role: UserProfile['role']; companyId: string }) {
  if (payload.role !== 'client_user') {
    return null
  }

  if (!payload.companyId.trim()) {
    throw new Error('Los usuarios cliente deben tener una empresa asignada.')
  }

  const company = await getCompanyById(payload.companyId)

  if (!company) {
    throw new Error('La empresa seleccionada no existe en Firestore.')
  }

  return company
}

export async function createAdminUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
  if (payload.role === 'platform_admin' && (await hasAnotherPlatformAdmin())) {
    throw new Error('Solo se permite un administrador global en Enerflux.')
  }

  const company = await ensureValidClientCompany({ role: payload.role, companyId: payload.companyId })
  const normalizedPayload: CreateUserRequest = {
    ...payload,
    companyId: payload.role === 'platform_admin' ? '' : company?.id ?? payload.companyId,
    companyName: payload.role === 'platform_admin' ? '' : company?.name ?? payload.companyName,
  }

  if (CREATE_USER_MODE === 'mock') {
    return mockCreateUser(normalizedPayload)
  }

  const response = await fetch('/admin/create-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(normalizedPayload),
  })

  if (!response.ok) {
    throw new Error('No fue posible crear el usuario.')
  }

  const data = (await response.json()) as Partial<{ uid: string; user: Partial<UserProfile> }>

  if (data.user) {
    return {
      user: {
        uid: data.user.uid ?? data.uid ?? `pending-${Date.now()}`,
        email: data.user.email ?? normalizedPayload.email,
        displayName: data.user.displayName ?? normalizedPayload.displayName,
        role: data.user.role === 'platform_admin' ? 'platform_admin' : normalizedPayload.role,
        clientRole: data.user.clientRole === 'client_admin' ? 'client_admin' : normalizedPayload.clientRole,
        companyId: data.user.companyId ?? normalizedPayload.companyId,
        companyName: data.user.companyName ?? normalizedPayload.companyName,
        active: data.user.active ?? normalizedPayload.active,
      },
      source: 'api',
    }
  }

  return {
    user: toUserProfile(data.uid ?? `pending-${Date.now()}`, normalizedPayload),
    source: 'api',
  }
}

type UpdateAdminUserInput = {
  uid: string
  displayName: string
  role: UserProfile['role']
  clientRole: UserProfile['clientRole']
  companyId: string
  companyName: string
  active: boolean
}

export async function updateAdminUser(input: UpdateAdminUserInput): Promise<void> {
  if (input.role === 'platform_admin' && (await hasAnotherPlatformAdmin(input.uid))) {
    throw new Error('Solo se permite un administrador global en Enerflux.')
  }

  const company = await ensureValidClientCompany({ role: input.role, companyId: input.companyId })
  const reference = doc(db, 'users', input.uid)

  await updateDoc(reference, {
    displayName: input.displayName,
    role: input.role,
    clientRole: input.clientRole,
    companyId: input.role === 'platform_admin' ? '' : company?.id ?? input.companyId,
    companyName: input.role === 'platform_admin' ? '' : company?.name ?? input.companyName,
    active: input.active,
  })
}
