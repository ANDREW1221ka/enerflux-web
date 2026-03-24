import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { auth, ensureAuthPersistence } from '../services/firebase'

type AuthContextValue = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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
        if (!isMounted) {
          return
        }

        setUser(nextUser)
        setLoading(false)
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
      loading,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
      },
      signOutUser: async () => {
        await signOut(auth)
      },
    }),
    [loading, user],
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
