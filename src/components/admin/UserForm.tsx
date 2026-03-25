import { useState, type FormEvent } from 'react'
import type { CreateUserPayload } from '../../types/adminUsers'

export type UserFormValues = CreateUserPayload

type UserFormProps = {
  defaultValues?: Partial<UserFormValues>
  submitting?: boolean
  serverError?: string | null
  submitLabel?: string
  emailDisabled?: boolean
  onCancel: () => void
  onSubmit: (values: UserFormValues) => Promise<void>
}

type UserFormErrors = Partial<Record<keyof UserFormValues, string>>

const INITIAL_VALUES: UserFormValues = {
  displayName: '',
  email: '',
  companyName: '',
  role: 'client',
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

  if (!values.companyName.trim()) {
    errors.companyName = 'La empresa es obligatoria.'
  }

  return errors
}

export function UserForm({
  defaultValues,
  submitting = false,
  serverError = null,
  submitLabel = 'Crear usuario',
  emailDisabled = false,
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
      companyName: values.companyName.trim(),
      role: values.role,
      active: values.active,
    })
  }

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
        Empresa
        <input
          type="text"
          value={values.companyName}
          onChange={(event) => setValues((current) => ({ ...current, companyName: event.target.value }))}
          placeholder="Nombre de empresa"
        />
        {errors.companyName ? <span className="form-error">{errors.companyName}</span> : null}
      </label>

      <label>
        Rol
        <select
          value={values.role}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              role: event.target.value === 'admin' ? 'admin' : 'client',
            }))
          }
        >
          <option value="client">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
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
