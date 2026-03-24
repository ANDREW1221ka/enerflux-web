import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { user, signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname ?? '/app'

  if (user) {
    return <Navigate to="/app" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await signIn(email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch {
      setErrorMessage('No fue posible iniciar sesión. Revisa tus credenciales.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <h2>Ingreso clientes</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />

        {errorMessage ? <p role="alert">{errorMessage}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </section>
  )
}
