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
  type CreateInstallationPayload,
  type Installation,
  type InstallationCapabilities,
  type InstallationCategory,
  type InstallationLocation,
  type InstallationTechnicalData,
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
  subtype: string
  location: InstallationLocation
  description: string
  active: boolean
  clientVisible: boolean
  capabilities: InstallationCapabilities
  technical: InstallationTechnicalData
  createdAt: Timestamp
  createdBy: string
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
    subtype: data.subtype,
    location: data.location,
    description: data.description,
    active: data.active === true,
    clientVisible: data.clientVisible !== false,
    capabilities: normalizeCapabilities(data.capabilities),
    technical: data.technical,
    createdAt: formatCreatedAt(data.createdAt),
    createdBy: data.createdBy,
  }
}

function assertValidPayload(payload: { companyId: string; companyName: string }) {
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

export async function createInstallation(payload: CreateInstallationPayload): Promise<Installation> {
  assertValidPayload(payload)

  const normalizedPayload = {
    ...payload,
    name: payload.name.trim(),
    companyId: payload.companyId.trim(),
    companyName: payload.companyName.trim(),
    subtype: payload.subtype?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    createdBy: payload.createdBy?.trim() || undefined,
    capabilities: payload.capabilities ?? DEFAULT_INSTALLATION_CAPABILITIES,
  }

  const reference = await addDoc(collection(db, 'installations'), {
    ...normalizedPayload,
    createdAt: serverTimestamp(),
  })

  await setInstallationRealtimeBase(reference.id)

  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    return {
      id: reference.id,
      ...normalizedPayload,
      createdAt: undefined,
    }
  }

  return normalizeInstallation(snapshot as QueryDocumentSnapshot)
}

export async function updateInstallation(payload: UpdateInstallationPayload): Promise<void> {
  assertValidPayload(payload)

  const reference = doc(db, 'installations', payload.id)

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
    capabilities: payload.capabilities,
    technical: payload.technical ?? null,
    createdBy: payload.createdBy?.trim() || null,
  })
}

export async function setInstallationRealtimeBase(installationId: string): Promise<void> {
  const currentRef = doc(db, 'installations', installationId, 'realtime', 'current')

  await setDoc(
    currentRef,
    {
      connectivity: 'offline',
      updatedAt: serverTimestamp(),
      values: {},
      alarms: [],
    },
    { merge: true },
  )
}
