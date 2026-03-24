import { collection, getDocs, type QueryDocumentSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { UserForm, type UserFormValues } from '../../components/admin/UserForm'
import type { UserProfile } from '../../hooks/useAuth'
import { createAdminUser } from '../../services/adminUsers'
import { db } from '../../services/firebase'

export function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSource, setCreateSource] = useState<'api' | 'mock' | null>(null)

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

  const handleCreateUser = async (values: UserFormValues) => {
    setSubmitting(true)
    setCreateError(null)

    try {
      const created = await createAdminUser(values)

      setUsers((currentUsers) => [created.user, ...currentUsers])
      setCreateSource(created.source)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('No fue posible crear el usuario.', error)
      setCreateError('No fue posible crear el usuario. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <h2>Administración de usuarios</h2>
        <button
          type="button"
          onClick={() => {
            setIsCreateModalOpen(true)
            setCreateError(null)
          }}
        >
          Crear usuario
        </button>
      </header>

      {createSource ? (
        <p className="admin-flow-note">
          Usuario creado usando modo <strong>{createSource}</strong>.
        </p>
      ) : null}

      {isCreateModalOpen ? (
        <div className="admin-modal-overlay" role="presentation" onClick={() => setIsCreateModalOpen(false)}>
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Crear usuario"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h3>Crear usuario cliente</h3>
              <p>Este flujo prepara el alta vía endpoint seguro ({`POST /admin/create-user`}).</p>
            </header>
            <UserForm
              submitting={submitting}
              serverError={createError}
              onCancel={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateUser}
            />
          </section>
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
