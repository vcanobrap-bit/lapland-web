'use server'

import type { ContactFieldName, ContactFormState } from './formState'

import { getPayloadClient } from '@/lib/payload'

type FieldName = ContactFieldName

const MAX_LENGTH: Record<FieldName, number> = {
  name: 120,
  email: 200,
  message: 4000,
}

// Deliberadamente laxa: validar direcciones de verdad requiere mandar un mail.
// Acá solo se descartan errores de tipeo evidentes.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const readField = (formData: FormData, name: string): string => {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

const validate = (values: Record<FieldName, string>): Partial<Record<FieldName, string>> => {
  const errors: Partial<Record<FieldName, string>> = {}

  if (!values.name) errors.name = 'Escribí tu nombre.'
  else if (values.name.length > MAX_LENGTH.name) errors.name = 'El nombre es demasiado largo.'

  if (!values.email) errors.email = 'Escribí tu email.'
  else if (values.email.length > MAX_LENGTH.email) errors.email = 'El email es demasiado largo.'
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'Revisá el formato del email.'

  if (!values.message) errors.message = 'Contanos brevemente en qué podemos ayudar.'
  else if (values.message.length > MAX_LENGTH.message)
    errors.message = 'El mensaje es demasiado largo.'

  return errors
}

/**
 * Recibe el formulario de contacto y guarda el mensaje en Payload.
 *
 * Se valida acá y no solo en el navegador: la validación del cliente es
 * comodidad, no seguridad, y este endpoint es público.
 */
export async function submitContactForm(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values: Record<FieldName, string> = {
    name: readField(formData, 'name'),
    email: readField(formData, 'email'),
    message: readField(formData, 'message'),
  }

  // Campo trampa: está oculto, así que solo lo completa un bot. Se responde
  // como si hubiera funcionado para no darle pistas sobre qué lo delató.
  if (readField(formData, 'website')) {
    return { status: 'success', message: '¡Gracias! Te vamos a responder pronto.' }
  }

  const errors = validate(values)

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, values }
  }

  try {
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'submissions',
      // La colección tiene `create` cerrado para todos: esta acción es la única
      // vía de escritura, y por eso necesita saltear el control de acceso.
      overrideAccess: true,
      data: { ...values, status: 'new' },
    })
  } catch (error) {
    console.error('[contacto] No se pudo guardar el mensaje', error)

    return {
      status: 'error',
      message: 'No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.',
      values,
    }
  }

  return {
    status: 'success',
    message: '¡Gracias! Recibimos tu mensaje y te vamos a responder pronto.',
    submittedAt: Date.now(),
  }
}
