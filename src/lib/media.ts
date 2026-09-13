import type { Media } from '@/payload-types'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL

/**
 * Los campos `upload` llegan como número (el id) cuando la consulta no resolvió
 * la relación, o como documento completo cuando sí. Esta guarda evita repetir
 * el chequeo —y evita casts con `as`— en cada componente que muestra una imagen.
 */
export const resolveMedia = (value: Media | number | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

/**
 * Payload antepone `serverURL` a las rutas de los medios servidos desde disco.
 * next/image trata esas URLs absolutas como remotas y exige declarar el
 * hostname, aunque sea el mismo origen. Devolverlas relativas evita ese
 * requisito y una resolución de DNS de más.
 *
 * Las URLs de Vercel Blob apuntan a otro host y quedan intactas: para esas
 * está `images.remotePatterns` en next.config.ts.
 */
export const toImageSrc = (url: string): string =>
  serverURL && url.startsWith(serverURL) ? url.slice(serverURL.length) : url
