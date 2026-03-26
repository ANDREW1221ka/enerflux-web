import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore'
import {
  DEFAULT_INSTALLATION_CAPABILITIES,
  DEFAULT_INSTALLATION_CATEGORY,
  DEFAULT_INSTALLATION_TYPE,
  formatInstallationLocation,
  type CreateInstallationPayload,
  type Installation,
  type InstallationCapabilities,
  type InstallationCategory,
  type InstallationRealtimeCurrent,
  type InstallationType,
  type UpdateInstallationPayload,
} from '../types/installations'
import { db } from './firebase'

type InstallationDocument = Partial<{
  name: string
  companyId: string
  companyName: string
  category: InstallationCategory
  type: InstallationType
  subtype: string | null
  location: Installation['location'] | null
  description: string | null
  active: boolean
  clientVisible: boolean
  capabilities: InstallationCapabilities
  technical: Installation['technical'] | null
  createdAt: Timestamp
  createdBy: string | null
}>

function formatCreatedAt(createdAt: Timestamp | null | undefined): string | undefined {
  if (!createdAt) {
    return undefined
  }

  return createdAt.toDate().toLocaleString('es-CL')
}

function normalizeCapabilities(
  capabilities: InstallationCapabilities | null | undefined,
): InstallationCapabilities {
  return {
    telemetry: capabilities?.telemetry === true,
    alarms: capabilities?.alarms === true,
    remoteControl: capabilities?.remoteControl === true,
    trends: capabilities?.trends === true,
    notifications: capabilities?.notifications === true,
  }
}

function normalizeInstallation(document: QueryDocumentSnapshot): Installation {
  const data = document.data() as InstallationDocument

  return {
    id: document.id,
    name: data.name ?? 'Sin nombre',
    companyId: data.companyId ?? '',
    companyName: data.companyName ?? 'Sin empresa',
    category: data.category ?? DEFAULT_INSTALLATION_CATEGORY,
    type: data.type ?? DEFAULT_INSTALLATION_TYPE,
    subtype: data.subtype ?? undefined,
    location: data.location ?? undefined,
    description: data.description ?? undefined,
    active: data.active === true,
    clientVisible: data.clientVisible !== false,
    capabilities: normalizeCapabilities(data.capabilities ?? DEFAULT_INSTALLATION_CAPABILITIES),
    technical: data.technical ?? undefined,
    createdAt: formatCreatedAt(data.createdAt),
    createdBy: data.createdBy ?? undefined,
  }
}

function assertValidPayload(payload: {
  name?: string
  companyId: string
  companyName: string
}) {
  if (!payload.name?.trim()) {
    throw new Error('El nombre de la instalación es obligatorio.')
  }

  if (!payload.companyId.trim()) {
    throw new Error('La instalación debe estar asociada a una empresa.')
  }

  if (!payload.companyName.trim()) {
    throw new Error('No fue posible resolver el nombre de la empresa seleccionada.')
  }
}

export async function listInstallations(): Promise<Installation[]> {
  const installationsQuery = query(collection(db, 'installations'), orderBy('name', 'asc'))
  const snapshot = await getDocs(installationsQuery)

  return snapshot.docs.map(normalizeInstallation)
}

export async function listInstallationsByCompanyId(companyId: string): Promise<Installation[]> {
  const normalizedCompanyId = companyId.trim()

  if (!normalizedCompanyId) {
    return []
  }

  const installationsQuery = query(
    collection(db, 'installations'),
    where('companyId', '==', normalizedCompanyId),
    orderBy('name', 'asc'),
  )
  const snapshot = await getDocs(installationsQuery)

  return snapshot.docs.map(normalizeInstallation)
}

export async function createInstallation(
  payload: CreateInstallationPayload,
): Promise<Installation> {
  assertValidPayload(payload)

  const normalizedName = payload.name.trim()
  const normalizedCompanyId = payload.companyId.trim()
  const normalizedCompanyName = payload.companyName.trim()
  const normalizedSubtype = payload.subtype?.trim() || undefined
  const normalizedDescription = payload.description?.trim() || undefined
  const normalizedCreatedBy = payload.createdBy?.trim() || 'platform_admin'

  const reference = await addDoc(collection(db, 'installations'), {
    name: normalizedName,
    companyId: normalizedCompanyId,
    companyName: normalizedCompanyName,
    category: payload.category,
    type: payload.type,
    subtype: normalizedSubtype ?? null,
    location: payload.location ?? null,
    description: normalizedDescription ?? null,
    active: payload.active,
    clientVisible: payload.clientVisible,
    capabilities: normalizeCapabilities(
      payload.capabilities ?? DEFAULT_INSTALLATION_CAPABILITIES,
    ),
    technical: payload.technical ?? null,
    createdBy: normalizedCreatedBy,
    createdAt: serverTimestamp(),
  })

  await setRealtimeCurrentBase(reference.id, payload.realtimeCurrent)

  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    throw new Error('No fue posible recuperar la instalación recién creada.')
  }

  return normalizeInstallation(snapshot as QueryDocumentSnapshot)
}

export async function updateInstallation(payload: UpdateInstallationPayload): Promise<void> {
  assertValidPayload(payload)

  if (typeof payload.id !== 'string' || !payload.id.trim()) {
    throw new Error('El id de la instalación es obligatorio para actualizar.')
  }

  const installationId = payload.id.trim()
  const reference = doc(db, 'installations', installationId)

  await updateDoc(reference, {
    name: payload.name.trim(),
    companyId: payload.companyId.trim(),
    companyName: payload.companyName.trim(),
    category: payload.category,
    type: payload.type,
    subtype: payload.subtype?.trim() || null,
    location: payload.location ?? null,
    description: payload.description?.trim() || null,
    active: payload.active,
    clientVisible: payload.clientVisible,
    capabilities: normalizeCapabilities(
      payload.capabilities ?? DEFAULT_INSTALLATION_CAPABILITIES,
    ),
    technical: payload.technical ?? null,
    createdBy: payload.createdBy?.trim() || null,
  })
}

export async function setRealtimeCurrentBase(
  installationId: string,
  current?: InstallationRealtimeCurrent,
): Promise<void> {
  const normalizedInstallationId = installationId.trim()

  if (!normalizedInstallationId) {
    throw new Error('El id de la instalación es obligatorio para crear el estado realtime.')
  }

  await setDoc(doc(db, 'installations', normalizedInstallationId, 'realtime', 'current'), {
    connected: current?.connected ?? false,
    lastTelemetryAt: current?.lastTelemetryAt ?? null,
    activeAlarms: current?.activeAlarms ?? 0,
    status: current?.status ?? 'idle',
    updatedAt: serverTimestamp(),
  })
}

export function getInstallationLocationLabel(installation: Installation): string {
  return formatInstallationLocation(installation.location)
}
