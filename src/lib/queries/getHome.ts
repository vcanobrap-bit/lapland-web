import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { Home } from '@/payload-types'

import { globalCacheTag } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'

type Options = { draft?: boolean }

const SLUG = 'home'

/**
 * Contenido de la home. `depth: 2` resuelve las imágenes de los bloques a
 * documentos de Media en la misma consulta; sin eso llegarían solo los ids.
 */
const fetchHome = async ({ draft }: Required<Options>): Promise<Home> => {
  const payload = await getPayloadClient()

  return payload.findGlobal({
    slug: SLUG,
    depth: 2,
    draft,
    // En preview hace falta leer borradores, que no son públicos.
    overrideAccess: draft,
  })
}

/**
 * Versión publicada, cacheada entre requests. El hook `revalidateGlobal`
 * invalida esta misma etiqueta al publicar, y es lo que hace que el cambio
 * aparezca en el sitio sin redeploy.
 */
const fetchPublishedHome = unstable_cache(() => fetchHome({ draft: false }), [SLUG], {
  tags: [globalCacheTag(SLUG)],
})

/** `cache` de React deduplica las llamadas dentro de un mismo request. */
export const getHome = cache(async ({ draft = false }: Options = {}): Promise<Home> => {
  // Los borradores no se cachean: el preview tiene que mostrar el estado actual.
  return draft ? fetchHome({ draft: true }) : fetchPublishedHome()
})
