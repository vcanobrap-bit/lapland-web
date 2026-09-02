import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { SiteSetting } from '@/payload-types'

import { globalCacheTag } from '@/lib/cache'
import { getPayloadClient } from '@/lib/payload'

type Options = { draft?: boolean }

const SLUG = 'site-settings'

/**
 * Ajustes globales del sitio. `depth: 2` resuelve el logo a documento de Media
 * en la misma consulta; sin eso llegaría solo el id.
 */
const fetchSiteSettings = async ({ draft }: Required<Options>): Promise<SiteSetting> => {
  const payload = await getPayloadClient()

  return payload.findGlobal({
    slug: SLUG,
    depth: 2,
    draft,
    // En preview hace falta leer borradores, que no son públicos.
    overrideAccess: draft,
  })
}

/** Versión publicada, cacheada entre requests e invalidada al publicar. */
const fetchPublishedSiteSettings = unstable_cache(
  () => fetchSiteSettings({ draft: false }),
  [SLUG],
  { tags: [globalCacheTag(SLUG)] },
)

/**
 * `cache` de React deduplica dentro del request: lo consumen el layout
 * (footer) y la página (bloque de contacto).
 */
export const getSiteSettings = cache(
  async ({ draft = false }: Options = {}): Promise<SiteSetting> =>
    draft ? fetchSiteSettings({ draft: true }) : fetchPublishedSiteSettings(),
)
