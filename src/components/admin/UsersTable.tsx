import type { UserProfile } from '../../hooks/useAuth'

type UsersTableProps = {
  users: UserProfile[]
  onEditUser: (user: UserProfile) => void
}

const ROLE_LABELS: Record<UserProfile['role'], string> = {
  platform_admin: 'Platform Admin',
  client_user: 'Cliente',
}

const CLIENT_ROLE_LABELS: Record<UserProfile['clientRole'], string> = {
  client_admin: 'Client Admin',
  client_monitor: 'Client Monitor',
}

export function UsersTable({ users, onEditUser }: UsersTableProps) {
  return (
    <div className="admin-table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol plataforma</th>
            <th>Rol cliente</th>
            <th>Empresa</th>
            <th>ID empresa</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>{ROLE_LABELS[user.role]}</td>
              <td>{CLIENT_ROLE_LABELS[user.clientRole]}</td>
              <td>{user.companyName}</td>
              <td>{user.companyId}</td>
              <td>{user.active ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button type="button" className="secondary-button" onClick={() => onEditUser(user)}>
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
