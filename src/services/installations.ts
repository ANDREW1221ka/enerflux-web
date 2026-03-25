import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore'
import type { CreateInstallationPayload, Installation, UpdateInstallationPayload } from '../types/installations'
import { db } from './firebase'

type InstallationDocument = Partial<{
  name: string
  companyId: string
  companyName: string
  type: string
  location: string
  active: boolean
  createdAt: Timestamp
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
    type: data.type ?? 'Sin tipo',
    location: data.location ?? 'Sin ubicación',
    active: data.active === true,
    createdAt: formatCreatedAt(data.createdAt),
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

  const reference = await addDoc(collection(db, 'installations'), {
    name: payload.name.trim(),
    companyId: payload.companyId.trim(),
    companyName: payload.companyName.trim(),
    type: payload.type.trim(),
    location: payload.location.trim(),
    active: payload.active,
    createdAt: serverTimestamp(),
  })

  const snapshot = await getDoc(reference)
  const data = snapshot.data() as InstallationDocument | undefined

  return {
    id: reference.id,
    name: data?.name ?? payload.name.trim(),
    companyId: data?.companyId ?? payload.companyId.trim(),
    companyName: data?.companyName ?? payload.companyName.trim(),
    type: data?.type ?? payload.type.trim(),
    location: data?.location ?? payload.location.trim(),
    active: data?.active ?? payload.active,
    createdAt: formatCreatedAt(data?.createdAt),
  }
}

export async function updateInstallation(payload: UpdateInstallationPayload): Promise<void> {
  assertValidPayload(payload)

  const reference = doc(db, 'installations', payload.id)

  await updateDoc(reference, {
    name: payload.name.trim(),
    companyId: payload.companyId.trim(),
    companyName: payload.companyName.trim(),
    type: payload.type.trim(),
    location: payload.location.trim(),
    active: payload.active,
  })
}
