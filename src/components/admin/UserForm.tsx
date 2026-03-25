import { useState, type FormEvent } from 'react'
import type { CreateUserPayload } from '../../types/adminUsers'

export type UserFormValues = CreateUserPayload

type UserFormProps = {
  defaultValues?: Partial<UserFormValues>
  platformAdminExists?: boolean
  submitting?: boolean
  serverError?: string | null
  submitLabel?: string
  emailDisabled?: boolean
  roleDisabled?: boolean
  onCancel: () => void
  onSubmit: (values: UserFormValues) => Promise<void>
}

type UserFormErrors = Partial<Record<keyof UserFormValues, string>>

const INITIAL_VALUES: UserFormValues = {
  displayName: '',
  email: '',
  role: 'client_user',
  clientRole: 'client_monitor',
  companyId: '',
  companyName: '',
  active: true,
}

function normalizeValues(defaultValues?: Partial<UserFormValues>): UserFormValues {
  return {
    ...INITIAL_VALUES,
    ...defaultValues,
  }
}

function validate(values: UserFormValues): UserFormErrors {
  const errors: UserFormErrors = {}

  if (!values.displayName.trim()) {
    errors.displayName = 'El nombre es obligatorio.'
  }

  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio.'
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(values.email.trim())) {
      errors.email = 'Ingresa un email válido.'
    }
  }

  if (values.role === 'client_user') {
    if (!values.companyId.trim()) {
      errors.companyId = 'El ID de empresa es obligatorio.'
    }

    if (!values.companyName.trim()) {
      errors.companyName = 'La empresa es obligatoria.'
    }
  }

  return errors
}

export function UserForm({
  defaultValues,
  platformAdminExists = false,
  submitting = false,
  serverError = null,
  submitLabel = 'Crear usuario',
  emailDisabled = false,
  roleDisabled = false,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>(normalizeValues(defaultValues))
  const [errors, setErrors] = useState<UserFormErrors>({})

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    await onSubmit({
      displayName: values.displayName.trim(),
      email: values.email.trim().toLowerCase(),
      role: values.role,
      clientRole: values.role === 'platform_admin' ? 'client_monitor' : values.clientRole,
      companyId: values.role === 'platform_admin' ? '' : values.companyId.trim(),
      companyName: values.role === 'platform_admin' ? '' : values.companyName.trim(),
      active: values.active,
    })
  }

  const allowPlatformAdminOption = values.role === 'platform_admin' || !platformAdminExists
  const isClientUser = values.role === 'client_user'

  return (
    <form className="user-form" onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Nombre
        <input
          type="text"
          value={values.displayName}
          onChange={(event) => setValues((current) => ({ ...current, displayName: event.target.value }))}
          placeholder="Nombre completo"
        />
        {errors.displayName ? <span className="form-error">{errors.displayName}</span> : null}
      </label>

      <label>
        Email
        <input
          type="email"
          value={values.email}
          disabled={emailDisabled}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          placeholder="usuario@empresa.cl"
        />
        {errors.email ? <span className="form-error">{errors.email}</span> : null}
      </label>

      <label>
        Rol de plataforma
        <select
          value={values.role}
          disabled={roleDisabled}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              role: event.target.value === 'platform_admin' ? 'platform_admin' : 'client_user',
            }))
          }
        >
          <option value="client_user">Cliente</option>
          {allowPlatformAdminOption ? <option value="platform_admin">Administrador de plataforma</option> : null}
        </select>
      </label>

      <label>
        Rol cliente
        <select
          value={values.clientRole}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              clientRole: event.target.value === 'client_admin' ? 'client_admin' : 'client_monitor',
            }))
          }
          disabled={values.role === 'platform_admin'}
        >
          <option value="client_admin">Administrador cliente</option>
          <option value="client_monitor">Monitor cliente</option>
        </select>
      </label>

      <label>
        Empresa (ID)
        <input
          type="text"
          value={values.companyId}
          disabled={!isClientUser}
          onChange={(event) => setValues((current) => ({ ...current, companyId: event.target.value }))}
          placeholder="empresa-001"
        />
        {errors.companyId ? <span className="form-error">{errors.companyId}</span> : null}
      </label>

      <label>
        Empresa (Nombre)
        <input
          type="text"
          value={values.companyName}
          disabled={!isClientUser}
          onChange={(event) => setValues((current) => ({ ...current, companyName: event.target.value }))}
          placeholder="Nombre de empresa"
        />
        {errors.companyName ? <span className="form-error">{errors.companyName}</span> : null}
      </label>

      <label className="user-form-checkbox">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(event) => setValues((current) => ({ ...current, active: event.target.checked }))}
        />
        Activo
      </label>

      {serverError ? <p className="form-error">{serverError}</p> : null}

      <footer className="user-form-actions">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>
          Cancelar
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </footer>
    </form>
  )
}
