import { collection, getDocs, type QueryDocumentSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import type { UserProfile } from '../../hooks/useAuth'

export function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePlaceholder, setShowCreatePlaceholder] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)

      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const mappedUsers = snapshot.docs.map((document: QueryDocumentSnapshot) => {
          const data = document.data() as Partial<UserProfile>

          return {
            uid: document.id,
            email: data.email ?? '-',
            displayName: data.displayName ?? 'Sin nombre',
            role: data.role === 'admin' ? 'admin' : 'client',
            companyName: data.companyName ?? '-',
            active: data.active === true,
          } as UserProfile
        })

        setUsers(mappedUsers)
      } catch (error) {
        console.error('No fue posible cargar el listado de usuarios.', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    void fetchUsers()
  }, [])

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <h2>Administración de usuarios</h2>
        <button type="button" onClick={() => setShowCreatePlaceholder((value) => !value)}>
          Crear usuario
        </button>
      </header>

      {showCreatePlaceholder ? (
        <div className="admin-create-placeholder">
          <p>Formulario base listo (placeholder):</p>
          <input type="text" placeholder="Nombre" disabled />
          <input type="email" placeholder="Email" disabled />
          <select disabled>
            <option>client</option>
            <option>admin</option>
          </select>
        </div>
      ) : null}

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Empresa</th>
                <th>Estado</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
