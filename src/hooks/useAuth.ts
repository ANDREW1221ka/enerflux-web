import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { auth, db, ensureAuthPersistence } from '../services/firebase'

export type UserRole = 'admin' | 'client'

export type UserProfile = {
  uid: string
  email: string
  displayName: string
  role: UserRole
  companyName: string
  active: boolean
}

type AuthContextValue = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function normalizeProfile(uid: string, data: Partial<UserProfile>): UserProfile {
  return {
    uid,
    email: data.email ?? '',
    displayName: data.displayName ?? 'Usuario Enerflux',
    role: data.role === 'admin' ? 'admin' : 'client',
    companyName: data.companyName ?? 'Sin empresa',
    active: data.active === true,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    let unsubscribe = () => undefined

    const setupAuth = async () => {
      try {
        await ensureAuthPersistence()
      } catch (error) {
        console.error('No se pudo configurar la persistencia de sesión.', error)
      }

      unsubscribe = onAuthStateChanged(auth, (nextUser: User | null) => {
        const syncProfile = async () => {
          if (!isMounted) {
            return
          }

          setLoading(true)

          if (!nextUser) {
            setUser(null)
            setProfile(null)
            setLoading(false)
            return
          }

          try {
            const profileRef = doc(db, 'users', nextUser.uid)
            const profileSnapshot = await getDoc(profileRef)

            if (!profileSnapshot.exists()) {
              await signOut(auth)
              return
            }

            const normalizedProfile = normalizeProfile(
              nextUser.uid,
              profileSnapshot.data() as Partial<UserProfile>,
            )

            if (!normalizedProfile.active) {
              await signOut(auth)
              return
            }

            if (!isMounted) {
              return
            }

            setUser(nextUser)
            setProfile(normalizedProfile)
          } catch (error) {
            console.error('No fue posible cargar el perfil del usuario.', error)
            if (isMounted) {
              setUser(null)
              setProfile(null)
            }
            await signOut(auth)
          } finally {
            if (isMounted) {
              setLoading(false)
            }
          }
        }

        void syncProfile()
      })
    }

    void setupAuth()

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
      },
      signOutUser: async () => {
        await signOut(auth)
      },
    }),
    [loading, profile, user],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.')
  }

  return context
}
