import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore'
import type { Installation } from '../types/installations'
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
