/**
 * Etiquetas del Data Cache de Next, una por global.
 *
 * Se define acá y no en cada archivo para que la etiqueta que escribe el hook
 * de Payload y la que lee la query no puedan divergir: si divergen, el sitio
 * deja de actualizarse al publicar y no falla nada de forma visible.
 */
export const globalCacheTag = (slug: string): string => `global_${slug}`
