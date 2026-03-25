import type { Installation } from '../../types/installations'
import { formatInstallationLocation } from '../../types/installations'

type InstallationsTableProps = {
  installations: Installation[]
  onEditInstallation: (installation: Installation) => void
}

function formatLocation(installation: Installation): string {
  const location = installation.location

  if (!location) {
    return 'Sin ubicación'
  }

  const parts = [location.address, location.area, location.plant, location.comuna, location.region].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : 'Sin ubicación'
}

export function InstallationsTable({ installations, onEditInstallation }: InstallationsTableProps) {
  if (installations.length === 0) {
    return <p className="admin-flow-note">Aún no hay instalaciones registradas.</p>
  }

  return (
    <div className="admin-table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Empresa</th>
            <th>Tipo</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {installations.map((installation) => (
            <tr key={installation.id}>
              <td>{installation.name}</td>
              <td>{installation.companyName}</td>
              <td>{installation.type}</td>
              <td>{formatInstallationLocation(installation.location)}</td>
              <td>{installation.active ? 'Activa' : 'Inactiva'}</td>
              <td>
                <button type="button" className="secondary-button" onClick={() => onEditInstallation(installation)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
