import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

/**
 * Activa el modo borrador para ver en el sitio lo que todavía no se publicó.
 *
 * Pide dos cosas: el secreto del enlace y una sesión válida de Payload. Con el
 * secreto solo, un enlace filtrado dejaría los borradores del cliente a la
 * vista de cualquiera.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const path = searchParams.get('path') ?? '/'

  const expectedSecret = process.env.PREVIEW_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return new Response('Enlace de preview inválido.', { status: 401 })
  }

  // Solo rutas internas: sin esto el endpoint sirve como redirector abierto.
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Ruta de preview inválida.', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return new Response('Hay que iniciar sesión en el panel para ver borradores.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
