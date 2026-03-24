import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  type Auth,
} from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseApp = initializeApp(firebaseConfig)

export const auth: Auth = getAuth(firebaseApp)
export const db: Firestore = getFirestore(firebaseApp)

let persistenceConfigured = false

export async function ensureAuthPersistence() {
  if (persistenceConfigured) {
    return
  }

  await setPersistence(auth, browserLocalPersistence)
  persistenceConfigured = true
}
