/**
 * Tipos y estado inicial del formulario de contacto.
 *
 * Viven en su propio archivo porque un módulo con `'use server'` solo puede
 * exportar funciones async: exportar el estado inicial desde `actions.ts` hace
 * fallar la Server Action en tiempo de ejecución.
 */
export type ContactFieldName = 'name' | 'email' | 'message'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  /** Mensaje general, para el aviso de éxito o de fallo del servidor. */
  message?: string
  errors?: Partial<Record<ContactFieldName, string>>
  /** Se devuelven para no obligar a reescribir todo cuando hay un error. */
  values?: Record<ContactFieldName, string>
  /** Cambia en cada envío exitoso; el formulario lo usa para limpiarse. */
  submittedAt?: number
}

export const INITIAL_CONTACT_FORM_STATE: ContactFormState = { status: 'idle' }
