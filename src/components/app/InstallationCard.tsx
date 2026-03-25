import type { Installation } from '../../types/installations'

type InstallationCardProps = {
  installation: Installation
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
          <dd>{installation.location}</dd>
        </div>
      </dl>
    </article>
  )
}
