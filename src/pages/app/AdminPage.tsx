import { collection, getDocs, type QueryDocumentSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { AdminModal } from '../../components/admin/AdminModal'
import { CompanyForm } from '../../components/admin/CompanyForm'
import { UserForm, type UserFormValues } from '../../components/admin/UserForm'
import { UsersTable } from '../../components/admin/UsersTable'
import type { UserProfile } from '../../hooks/useAuth'
import { createAdminUser, updateAdminUser } from '../../services/adminUsers'
import { createCompany, listCompanies } from '../../services/companies'
import { db } from '../../services/firebase'
import type { Company, CreateCompanyPayload } from '../../types/companies'

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
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [companyError, setCompanyError] = useState<string | null>(null)
  const [createSource, setCreateSource] = useState<'api' | 'mock' | null>(null)
  const platformAdmin = users.find((user) => user.role === 'platform_admin') ?? null

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const [usersSnapshot, companiesResult] = await Promise.all([
          getDocs(collection(db, 'users')),
          listCompanies(),
        ])

        setUsers(usersSnapshot.docs.map(normalizeUser))
        setCompanies(companiesResult)
      } catch (error) {
        console.error('No fue posible cargar datos administrativos.', error)
        setUsers([])
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  const handleCreateCompany = async (values: CreateCompanyPayload) => {
    const created = await createCompany(values)
    setCompanies((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name, 'es-CL')))
    return created
  }

  const handleCreateCompanyFromSection = async (values: CreateCompanyPayload) => {
    setSubmitting(true)
    setCompanyError(null)

    try {
      await handleCreateCompany(values)
      setIsCompanyModalOpen(false)
    } catch (error) {
      console.error('No fue posible crear la empresa.', error)
      setCompanyError('No fue posible crear la empresa. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

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
        <h2>Administración de usuarios y empresas</h2>
        <div className="admin-page-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setIsCompanyModalOpen(true)
              setCompanyError(null)
            }}
          >
            Nueva empresa
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreateModalOpen(true)
              setCreateError(null)
            }}
          >
            Crear usuario
          </button>
        </div>
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

      <section className="admin-companies-module">
        <h3>Empresas registradas</h3>
        {companies.length === 0 ? (
          <p className="admin-flow-note">Aún no hay compañías registradas.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Creada</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.name}</td>
                    <td>{company.id}</td>
                    <td>{company.active ? 'Activa' : 'Inactiva'}</td>
                    <td>{company.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isCompanyModalOpen ? (
        <AdminModal
          title="Nueva empresa"
          description="Registra una empresa en la colección companies para usarla en usuarios cliente."
          ariaLabel="Crear empresa"
          onClose={() => setIsCompanyModalOpen(false)}
        >
          <CompanyForm
            submitting={submitting}
            serverError={companyError}
            onCancel={() => setIsCompanyModalOpen(false)}
            onSubmit={handleCreateCompanyFromSection}
          />
        </AdminModal>
      ) : null}

      {isCreateModalOpen ? (
        <AdminModal
          title="Crear usuario"
          description="Crea usuarios cliente asociados a una empresa existente."
          ariaLabel="Crear usuario"
          onClose={() => setIsCreateModalOpen(false)}
        >
          <UserForm
            companies={companies}
            platformAdminExists={platformAdmin !== null}
            submitting={submitting}
            serverError={createError}
            onCancel={() => setIsCreateModalOpen(false)}
            onCreateCompany={handleCreateCompany}
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
            companies={companies}
            defaultValues={selectedUser}
            platformAdminExists={platformAdmin !== null}
            emailDisabled
            roleDisabled={selectedUser.role === 'platform_admin'}
            submitting={submitting}
            serverError={editError}
            submitLabel="Guardar cambios"
            onCancel={() => setIsEditModalOpen(false)}
            onCreateCompany={handleCreateCompany}
            onSubmit={handleEditUser}
          />
        </AdminModal>
      ) : null}

      {loading ? <p>Cargando usuarios...</p> : <UsersTable users={users} onEditUser={openEditModal} />}
    </section>
  )
}
