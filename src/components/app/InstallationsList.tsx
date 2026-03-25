import type { Installation } from '../../types/installations'
import { InstallationCard } from './InstallationCard'

type InstallationsListProps = {
  installations: Installation[]
}

export function InstallationsList({ installations }: InstallationsListProps) {
  if (installations.length === 0) {
    return <p className="admin-flow-note">No hay instalaciones registradas para esta empresa.</p>
  }

  return (
    <section className="installations-grid" aria-label="Listado de instalaciones">
      {installations.map((installation) => (
        <InstallationCard key={installation.id} installation={installation} />
      ))}
    </section>
  )
}
