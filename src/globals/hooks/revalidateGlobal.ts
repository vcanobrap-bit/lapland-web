import { revalidateTag } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'

import { globalCacheTag } from '@/lib/cache'

/**
 * Invalida el cache de Next cuando el cliente publica.
 *
 * Sin esto el sitio queda servido desde el cache y los cambios recién aparecen
 * en el próximo deploy, que es justamente lo contrario de un CMS
 * autogestionable.
 *
 * Solo se revalida en publicaciones: guardar un borrador no cambia lo que ve
 * el visitante. La despublicación sí entra, porque el contenido publicado que
 * había deja de estar.
 */
export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc, previousDoc, req }) => {
    // Los seeds y las migraciones corren sin contexto de request de Next.
    if (req.context?.disableRevalidate) return doc

    const isPublished = doc?._status === 'published'
    const wasPublished = previousDoc?._status === 'published'

    if (isPublished || wasPublished) {
      try {
        revalidateTag(globalCacheTag(slug))
        req.payload.logger.info(`Cache invalidado para el global "${slug}".`)
      } catch {
        // revalidateTag solo existe dentro de una request de Next. Un script
        // que escriba por la Local API —seed, migración, tarea programada—
        // no tiene ese contexto, y ahí no hay cache que invalidar: el
        // contenido se sirve fresco en el próximo arranque.
        req.payload.logger.info(`Sin contexto de Next: se omite la invalidación de "${slug}".`)
      }
    }

    return doc
  }
