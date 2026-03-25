import type { UserProfile } from '../../hooks/useAuth'

type UsersTableProps = {
  users: UserProfile[]
  onEditUser: (user: UserProfile) => void
}

export function UsersTable({ users, onEditUser }: UsersTableProps) {
  return (
    <div className="admin-table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Empresa</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.companyName}</td>
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
