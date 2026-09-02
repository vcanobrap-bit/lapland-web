import type { SiteSetting } from '@/payload-types'

import { getPayloadClient } from '@/lib/payload'

type Options = { draft?: boolean }

/**
 * Ajustes globales del sitio. `depth: 2` resuelve el logo a documento de Media
 * en la misma consulta; sin eso llegaría solo el id.
 */
export const getSiteSettings = async ({ draft = false }: Options = {}): Promise<SiteSetting> => {
  const payload = await getPayloadClient()

  return payload.findGlobal({
    slug: 'site-settings',
    depth: 2,
    draft,
    // En preview hace falta leer borradores, que no son públicos.
    overrideAccess: draft,
  })
}
