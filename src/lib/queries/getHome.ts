import type { Home } from '@/payload-types'

import { getPayloadClient } from '@/lib/payload'

type Options = { draft?: boolean }

/**
 * Contenido de la home. `depth: 2` resuelve las imágenes de los bloques a
 * documentos de Media en la misma consulta; sin eso llegarían solo los ids.
 */
export const getHome = async ({ draft = false }: Options = {}): Promise<Home> => {
  const payload = await getPayloadClient()

  return payload.findGlobal({
    slug: 'home',
    depth: 2,
    draft,
    // En preview hace falta leer borradores, que no son públicos.
    overrideAccess: draft,
  })
}
