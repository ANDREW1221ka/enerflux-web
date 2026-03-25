import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanySummaryCard } from '../../components/app/CompanySummaryCard'
import { InstallationsList } from '../../components/app/InstallationsList'
import { useAuth } from '../../hooks/useAuth'
import { listInstallationsByCompanyId } from '../../services/installations'
import type { Installation } from '../../types/installations'

export function DashboardPage() {
  const navigate = useNavigate()
  const { profile, signOutUser } = useAuth()

  const [installations, setInstallations] = useState<Installation[]>([])
  const [loadingInstallations, setLoadingInstallations] = useState(true)
  const [installationsError, setInstallationsError] = useState<string | null>(null)

  const isClientMonitor = profile?.role === 'client_user' && profile.clientRole === 'client_monitor'
  const isClientAdmin = profile?.role === 'client_user' && profile.clientRole === 'client_admin'

  useEffect(() => {
    const fetchInstallations = async () => {
      if (!profile?.companyId) {
        setInstallations([])
        setLoadingInstallations(false)
        return
      }

      setLoadingInstallations(true)
      setInstallationsError(null)

      try {
        const installationsResult = await listInstallationsByCompanyId(profile.companyId)
        setInstallations(installationsResult)
      } catch (error) {
        console.error('No fue posible cargar instalaciones de la empresa.', error)
        setInstallations([])
        setInstallationsError('No fue posible cargar las instalaciones. Intenta nuevamente.')
      } finally {
        setLoadingInstallations(false)
      }
    }

    void fetchInstallations()
  }, [profile?.companyId])

  async function handleSignOut() {
    await signOutUser()
    navigate('/login', { replace: true })
  }

  return (
    <section className="dashboard-page">
      <header className="dashboard-heading">
        <h2>Panel cliente Enerflux</h2>
        <p>Visión base por empresa para monitoreo de instalaciones.</p>
      </header>

      <CompanySummaryCard
        companyName={profile?.companyName ?? 'Sin empresa'}
        companyId={profile?.companyId ?? ''}
        installationsCount={installations.length}
      />

      <section className="dashboard-module" aria-label="Instalaciones de empresa">
        <header className="dashboard-module-header">
          <h3>Instalaciones</h3>
          {isClientAdmin ? <button type="button">Acciones admin (próximo)</button> : null}
        </header>

        {loadingInstallations ? <p className="admin-flow-note">Cargando instalaciones...</p> : null}
        {installationsError ? <p className="login-error">{installationsError}</p> : null}
        {!loadingInstallations && !installationsError ? (
          <InstallationsList installations={installations} />
        ) : null}
      </section>

      {isClientMonitor ? (
        <p className="admin-flow-note">Perfil monitor: acceso de solo lectura. Las acciones de edición están deshabilitadas.</p>
      ) : null}
      {isClientAdmin ? (
        <p className="admin-flow-note">
          Perfil administrador cliente: este perfil verá accesos de gestión por instalación en próximas etapas.
        </p>
      ) : null}

      <button type="button" className="dashboard-signout" onClick={handleSignOut}>
        Cerrar sesión
      </button>
    </section>
  )
}
