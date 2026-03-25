import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore'
import type { Company, CreateCompanyPayload } from '../types/companies'
import { db } from './firebase'

function formatCreatedAt(createdAt: Timestamp | null | undefined): string {
  if (!createdAt) {
    return '-'
  }

  return createdAt.toDate().toLocaleString('es-CL')
}

function normalizeCompany(document: QueryDocumentSnapshot): Company {
  const data = document.data() as Partial<{ name: string; active: boolean; createdAt: Timestamp }>

  return {
    id: document.id,
    name: data.name ?? 'Sin nombre',
    active: data.active === true,
    createdAt: formatCreatedAt(data.createdAt),
  }
}

export async function listCompanies(): Promise<Company[]> {
  const companiesQuery = query(collection(db, 'companies'), orderBy('name', 'asc'))
  const snapshot = await getDocs(companiesQuery)

  return snapshot.docs.map(normalizeCompany)
}

export async function createCompany(payload: CreateCompanyPayload): Promise<Company> {
  const reference = await addDoc(collection(db, 'companies'), {
    name: payload.name.trim(),
    active: payload.active,
    createdAt: serverTimestamp(),
  })

  const snapshot = await getDoc(reference)
  const data = snapshot.data() as Partial<{ name: string; active: boolean; createdAt: Timestamp }> | undefined

  return {
    id: reference.id,
    name: data?.name ?? payload.name.trim(),
    active: data?.active ?? payload.active,
    createdAt: formatCreatedAt(data?.createdAt),
  }
}

export async function getCompanyById(companyId: string): Promise<Company | null> {
  const reference = doc(db, 'companies', companyId)
  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    return null
  }

  const data = snapshot.data() as Partial<{ name: string; active: boolean; createdAt: Timestamp }>

  return {
    id: snapshot.id,
    name: data.name ?? 'Sin nombre',
    active: data.active === true,
    createdAt: formatCreatedAt(data.createdAt),
  }
}
