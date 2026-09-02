import type { Media } from '@/payload-types'

/**
 * Los campos `upload` llegan como número (el id) cuando la consulta no resolvió
 * la relación, o como documento completo cuando sí. Esta guarda evita repetir
 * el chequeo —y evita casts con `as`— en cada componente que muestra una imagen.
 */
export const resolveMedia = (value: Media | number | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null
