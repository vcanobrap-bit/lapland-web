import type { Access } from 'payload'

/** Lectura pública: necesario para que el sitio sirva contenido sin autenticar. */
export const anyone: Access = () => true
