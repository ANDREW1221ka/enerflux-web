import { collection, getDocs, type QueryDocumentSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { AdminModal } from '../../components/admin/AdminModal'
import { CompanyForm } from '../../components/admin/CompanyForm'
import { InstallationForm, type InstallationFormValues } from '../../components/admin/InstallationForm'
import { InstallationsTable } from '../../components/admin/InstallationsTable'
import { UserForm, type UserFormValues } from '../../components/admin/UserForm'
import { UsersTable } from '../../components/admin/UsersTable'
import type { UserProfile } from '../../hooks/useAuth'
import { createAdminUser, updateAdminUser } from '../../services/adminUsers'
import { createCompany, listCompanies } from '../../services/companies'
import { createInstallation, listInstallations, updateInstallation } from '../../services/installations'
import { db } from '../../services/firebase'
import type { Company, CreateCompanyPayload } from '../../types/companies'
import type { Installation } from '../../types/installations'

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
  const [installations, setInstallations] = useState<Installation[]>([])
  const [loading, setLoading] = useState(true)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [isInstallationCreateModalOpen, setIsInstallationCreateModalOpen] = useState(false)
  const [isInstallationEditModalOpen, setIsInstallationEditModalOpen] = useState(false)

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [companyError, setCompanyError] = useState<string | null>(null)
  const [installationCreateError, setInstallationCreateError] = useState<string | null>(null)
  const [installationEditError, setInstallationEditError] = useState<string | null>(null)

  const [createSource, setCreateSource] = useState<'api' | 'mock' | null>(null)
  const platformAdmin = users.find((user) => user.role === 'platform_admin') ?? null

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const [usersSnapshot, companiesResult, installationsResult] = await Promise.all([
          getDocs(collection(db, 'users')),
          listCompanies(),
          listInstallations(),
        ])

        setUsers(usersSnapshot.docs.map(normalizeUser))
        setCompanies(companiesResult)
        setInstallations(installationsResult)
      } catch (error) {
        console.error('No fue posible cargar datos administrativos.', error)
        setUsers([])
        setCompanies([])
        setInstallations([])
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

  const handleCreateInstallation = async (values: InstallationFormValues) => {
    setSubmitting(true)
    setInstallationCreateError(null)

    try {
      const createdInstallation = await createInstallation(values)

      setInstallations((currentInstallations) =>
        [...currentInstallations, createdInstallation].sort((a, b) => a.name.localeCompare(b.name, 'es-CL')),
      )
      setIsInstallationCreateModalOpen(false)
    } catch (error) {
      console.error('No fue posible crear la instalación.', error)
      setInstallationCreateError('No fue posible crear la instalación. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditInstallation = async (values: InstallationFormValues) => {
    if (!selectedInstallation) {
      return
    }

    setSubmitting(true)
    setInstallationEditError(null)

    try {
      await updateInstallation({
        id: selectedInstallation.id,
        ...values,
      })

      setInstallations((currentInstallations) =>
        currentInstallations
          .map((installation) =>
            installation.id === selectedInstallation.id ? { ...installation, ...values } : installation,
          )
          .sort((a, b) => a.name.localeCompare(b.name, 'es-CL')),
      )

      setIsInstallationEditModalOpen(false)
      setSelectedInstallation(null)
    } catch (error) {
      console.error('No fue posible editar la instalación.', error)
      setInstallationEditError('No fue posible guardar cambios en la instalación. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (user: UserProfile) => {
    setSelectedUser(user)
    setEditError(null)
    setIsEditModalOpen(true)
  }

  const openEditInstallationModal = (installation: Installation) => {
    setSelectedInstallation(installation)
    setInstallationEditError(null)
    setIsInstallationEditModalOpen(true)
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

      <section className="admin-installations-module">
        <header className="admin-module-header">
          <h3>Instalaciones</h3>
          <button
            type="button"
            onClick={() => {
              setIsInstallationCreateModalOpen(true)
              setInstallationCreateError(null)
            }}
          >
            Crear instalación
          </button>
        </header>
        <InstallationsTable installations={installations} onEditInstallation={openEditInstallationModal} />
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

      {isInstallationCreateModalOpen ? (
        <AdminModal
          title="Crear instalación"
          description="Registra una instalación y asóciala a una empresa para habilitar el monitoreo."
          ariaLabel="Crear instalación"
          onClose={() => setIsInstallationCreateModalOpen(false)}
        >
          <InstallationForm
            companies={companies}
            submitting={submitting}
            serverError={installationCreateError}
            onCancel={() => setIsInstallationCreateModalOpen(false)}
            onSubmit={handleCreateInstallation}
          />
        </AdminModal>
      ) : null}

      {isInstallationEditModalOpen && selectedInstallation ? (
        <AdminModal
          title="Editar instalación"
          description="Actualiza los datos base de la instalación en Firestore."
          ariaLabel="Editar instalación"
          onClose={() => setIsInstallationEditModalOpen(false)}
        >
          <InstallationForm
            companies={companies}
            defaultValues={selectedInstallation}
            submitting={submitting}
            serverError={installationEditError}
            submitLabel="Guardar cambios"
            onCancel={() => setIsInstallationEditModalOpen(false)}
            onSubmit={handleEditInstallation}
          />
        </AdminModal>
      ) : null}

      {loading ? <p>Cargando usuarios e instalaciones...</p> : <UsersTable users={users} onEditUser={openEditModal} />}
    </section>
  )
}
