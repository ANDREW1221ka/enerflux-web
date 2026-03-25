import { collection, getDocs, type QueryDocumentSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { AdminModal } from '../../components/admin/AdminModal'
import { UserForm, type UserFormValues } from '../../components/admin/UserForm'
import { UsersTable } from '../../components/admin/UsersTable'
import type { UserProfile } from '../../hooks/useAuth'
import { createAdminUser, updateAdminUser } from '../../services/adminUsers'
import { db } from '../../services/firebase'

function normalizeUser(document: QueryDocumentSnapshot): UserProfile {
  const data = document.data() as Partial<UserProfile>

  return {
    uid: document.id,
    email: data.email ?? '-',
    displayName: data.displayName ?? 'Sin nombre',
    role: data.role === 'platform_admin' ? 'platform_admin' : 'client_user',
    clientRole: data.clientRole === 'client_admin' ? 'client_admin' : 'client_monitor',
    companyId: data.companyId ?? '-',
    companyName: data.companyName ?? '-',
    active: data.active === true,
  }
}

export function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [createSource, setCreateSource] = useState<'api' | 'mock' | null>(null)
  const platformAdmin = users.find((user) => user.role === 'platform_admin') ?? null

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)

      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const mappedUsers = snapshot.docs.map(normalizeUser)
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
      setCreateError('No fue posible completar el alta visual. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditUser = async (values: UserFormValues) => {
    if (!selectedUser) {
      return
    }

    setSubmitting(true)
    setEditError(null)

    try {
      await updateAdminUser({
        uid: selectedUser.uid,
        displayName: values.displayName,
        role: values.role,
        clientRole: values.clientRole,
        companyId: values.companyId,
        companyName: values.companyName,
        active: values.active,
      })

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.uid === selectedUser.uid
            ? {
                ...user,
                displayName: values.displayName,
                role: values.role,
                clientRole: values.clientRole,
                companyId: values.companyId,
                companyName: values.companyName,
                active: values.active,
              }
            : user,
        ),
      )

      setIsEditModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('No fue posible actualizar el usuario.', error)
      setEditError('No fue posible guardar cambios. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (user: UserProfile) => {
    setSelectedUser(user)
    setEditError(null)
    setIsEditModalOpen(true)
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

      {platformAdmin ? (
        <p className="admin-flow-note">
          Administrador global único: <strong>{platformAdmin.displayName}</strong> ({platformAdmin.email}).
        </p>
      ) : null}

      {createSource ? (
        <p className="admin-flow-note">
          Alta visual completada en modo <strong>{createSource}</strong>. Firebase Auth se conectará en backend futuro.
        </p>
      ) : null}

      {isCreateModalOpen ? (
        <AdminModal
          title="Crear usuario"
          description="Crea usuarios cliente por empresa y define sus permisos internos."
          ariaLabel="Crear usuario"
          onClose={() => setIsCreateModalOpen(false)}
        >
          <UserForm
            platformAdminExists={platformAdmin !== null}
            submitting={submitting}
            serverError={createError}
            onCancel={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateUser}
          />
        </AdminModal>
      ) : null}

      {isEditModalOpen && selectedUser ? (
        <AdminModal
          title="Editar usuario"
          description="Actualiza datos del perfil almacenado en Firestore."
          ariaLabel="Editar usuario"
          onClose={() => setIsEditModalOpen(false)}
        >
          <UserForm
            defaultValues={selectedUser}
            platformAdminExists={platformAdmin !== null}
            emailDisabled
            roleDisabled={selectedUser.role === 'platform_admin'}
            submitting={submitting}
            serverError={editError}
            submitLabel="Guardar cambios"
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditUser}
          />
        </AdminModal>
      ) : null}

      {loading ? <p>Cargando usuarios...</p> : <UsersTable users={users} onEditUser={openEditModal} />}
    </section>
  )
}
