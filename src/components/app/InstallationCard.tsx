import type { Installation } from '../../types/installations'
import { formatInstallationLocation } from '../../types/installations'

type InstallationCardProps = {
  installation: Installation
}

function formatLocation(installation: Installation): string {
  const location = installation.location

  if (!location) {
    return 'Sin ubicación'
  }

  const parts = [location.address, location.area, location.plant, location.comuna, location.region].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : 'Sin ubicación'
}

export function InstallationCard({ installation }: InstallationCardProps) {
  return (
    <article className="installation-card">
      <header>
        <h4>{installation.name}</h4>
        <span className={installation.active ? 'status-badge status-active' : 'status-badge status-inactive'}>
          {installation.active ? 'Activa' : 'Inactiva'}
        </span>
      </header>
      <dl>
        <div>
          <dt>Tipo</dt>
          <dd>{installation.type}</dd>
        </div>
        <div>
          <dt>Ubicación</dt>
          <dd>{formatInstallationLocation(installation.location)}</dd>
        </div>
      </dl>
    </article>
  )
}
