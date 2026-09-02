'use client'

import { useActionState } from 'react'

import { cn } from '@/lib/cn'

import { submitContactForm } from './actions'
import { INITIAL_CONTACT_FORM_STATE } from './formState'

const FIELD_CLASSES =
  'border-line focus:border-ink w-full border-b bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-muted/70'

/**
 * Client Component: es el único punto de la sección que necesita cliente, y lo
 * necesita de verdad —estados de envío, éxito y error—. El resto del bloque de
 * contacto sigue renderizándose en el servidor.
 *
 * `useActionState` mantiene el resultado de la Server Action, así que el form
 * funciona sin JavaScript: sin hidratar, el navegador lo envía igual y Next
 * ejecuta la acción.
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    INITIAL_CONTACT_FORM_STATE,
  )

  const { errors, values } = state

  return (
    <div>
      {/* aria-live para que un lector de pantalla anuncie el resultado. */}
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'mb-6 text-sm',
          state.status === 'success' && 'text-ink',
          state.status === 'error' && 'text-red-700',
          !state.message && 'sr-only',
        )}
      >
        {state.message}
      </p>

      <form
        action={formAction}
        // Al enviarse bien, la clave cambia y el formulario se remonta vacío.
        key={state.submittedAt ?? 'contact-form'}
        noValidate
        className="space-y-6"
      >
        <Field
          label="Nombre"
          name="name"
          defaultValue={values?.name}
          error={errors?.name}
          autoComplete="name"
          required
        />

        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={values?.email}
          error={errors?.email}
          autoComplete="email"
          required
        />

        <div>
          <label htmlFor="message" className="text-muted text-xs tracking-wide uppercase">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            defaultValue={values?.message}
            aria-invalid={Boolean(errors?.message)}
            aria-describedby={errors?.message ? 'message-error' : undefined}
            className={cn(FIELD_CLASSES, 'mt-1 resize-y')}
          />
          {errors?.message ? (
            <p id="message-error" className="mt-1 text-xs text-red-700">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* Campo trampa para bots: oculto a la vista y fuera del orden de foco. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">No completar este campo</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-ink inline-flex items-center rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Enviando…' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  )
}

type FieldProps = {
  label: string
  name: string
  error?: string
  defaultValue?: string
  type?: 'text' | 'email'
  autoComplete?: string
  required?: boolean
}

function Field({
  autoComplete,
  defaultValue,
  error,
  label,
  name,
  required,
  type = 'text',
}: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="text-muted text-xs tracking-wide uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(FIELD_CLASSES, 'mt-1')}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
