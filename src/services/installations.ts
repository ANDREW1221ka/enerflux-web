import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore'
import {
  DEFAULT_INSTALLATION_CAPABILITIES,
  formatInstallationLocation,
  type CreateInstallationPayload,
  type Installation,
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
  subtype: string
  location: Installation['location']
  description: string
  active: boolean
  clientVisible: boolean
  capabilities: Installation['capabilities']
  technical: Installation['technical']
  createdAt: Timestamp
  createdBy: string
}>

function formatCreatedAt(createdAt: Timestamp | null | undefined): string {
  if (!createdAt) {
    return '-'
  }

  return createdAt.toDate().toLocaleString('es-CL')
}

function normalizeInstallation(document: QueryDocumentSnapshot): Installation {
  const data = document.data() as InstallationDocument

  return {
    id: document.id,
    name: data.name ?? 'Sin nombre',
    companyId: data.companyId ?? '',
    companyName: data.companyName ?? 'Sin empresa',
    category: data.category ?? 'custom',
    type: data.type ?? 'custom',
    subtype: data.subtype,
    location: data.location,
    description: data.description,
    active: data.active === true,
    clientVisible: data.clientVisible !== false,
    capabilities: data.capabilities ?? DEFAULT_INSTALLATION_CAPABILITIES,
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
    subtype: normalizedSubtype,
    location: payload.location,
    description: normalizedDescription,
    active: payload.active,
    clientVisible: payload.clientVisible,
    capabilities: payload.capabilities,
    technical: payload.technical,
    createdBy: normalizedCreatedBy,
    createdAt: serverTimestamp(),
  })

  await setRealtimeCurrentBase(reference.id, payload.realtimeCurrent)

  const snapshot = await getDoc(reference)
  const data = snapshot.data() as InstallationDocument | undefined

  return {
    id: reference.id,
    name: data?.name ?? normalizedName,
    companyId: data?.companyId ?? normalizedCompanyId,
    companyName: data?.companyName ?? normalizedCompanyName,
    category: data?.category ?? payload.category,
    type: data?.type ?? payload.type,
    subtype: data?.subtype ?? normalizedSubtype,
    location: data?.location ?? payload.location,
    description: data?.description ?? normalizedDescription,
    active: data?.active ?? payload.active,
    clientVisible: data?.clientVisible ?? payload.clientVisible,
    capabilities: data?.capabilities ?? payload.capabilities,
    technical: data?.technical ?? payload.technical,
    createdAt: formatCreatedAt(data?.createdAt),
    createdBy: data?.createdBy ?? normalizedCreatedBy,
  }
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

export async function setRealtimeCurrentBase(installationId: string, current?: InstallationRealtimeCurrent): Promise<void> {
  await setDoc(doc(db, 'installations', installationId, 'realtime', 'current'), {
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
