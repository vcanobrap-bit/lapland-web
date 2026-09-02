'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

import { submitContactForm } from './actions'
import { INITIAL_CONTACT_FORM_STATE } from './formState'

/**
 * Client Component: es el único punto de la sección que necesita cliente, y lo
 * necesita de verdad —estados de envío, éxito y error—.
 *
 * `useActionState` mantiene el resultado de la Server Action, así que el form
 * funciona sin JavaScript: sin hidratar, el navegador lo envía igual y Next
 * ejecuta la acción.
 *
 * El design system no define componentes de formulario, así que los campos se
 * derivan de sus tokens: regla inferior en niebla, foco en verde noche,
 * etiquetas en el rol caption.
 */
export function ContactForm({ onAnchor = false }: { onAnchor?: boolean }) {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    INITIAL_CONTACT_FORM_STATE,
  )

  const { errors, values } = state

  const fieldClass = cn(
    'text-body w-full border-b bg-transparent py-2.5 outline-none transition-colors',
    onAnchor
      ? 'border-on-anchor/30 focus:border-on-anchor placeholder:text-on-anchor/55'
      : 'border-fog focus:border-ink placeholder:text-ink/55',
  )
  const labelClass = cn('text-caption uppercase', onAnchor ? 'text-on-anchor/70' : 'text-ink/70')
  const errorClass = cn('text-caption mt-1.5', onAnchor ? 'text-support' : 'text-tension')

  return (
    <div>
      {/* aria-live para que un lector de pantalla anuncie el resultado. */}
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'text-body-sm mb-8',
          state.status === 'error' && (onAnchor ? 'text-support' : 'text-tension'),
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
        className="space-y-8"
      >
        <div>
          <label htmlFor="name" className={labelClass}>
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={values?.name}
            aria-invalid={Boolean(errors?.name)}
            aria-describedby={errors?.name ? 'name-error' : undefined}
            className={cn(fieldClass, 'mt-1.5')}
          />
          {errors?.name ? (
            <p id="name-error" className={errorClass}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={values?.email}
            aria-invalid={Boolean(errors?.email)}
            aria-describedby={errors?.email ? 'email-error' : undefined}
            className={cn(fieldClass, 'mt-1.5')}
          />
          {errors?.email ? (
            <p id="email-error" className={errorClass}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
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
            className={cn(fieldClass, 'mt-1.5 resize-y')}
          />
          {errors?.message ? (
            <p id="message-error" className={errorClass}>
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* Campo trampa para bots: oculto a la vista y fuera del orden de foco. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">No completar este campo</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Button type="submit" variant={onAnchor ? 'secondary' : 'primary'} className="mt-2">
          {isPending ? 'Enviando…' : 'Enviar mensaje'}
        </Button>
      </form>
    </div>
  )
}
