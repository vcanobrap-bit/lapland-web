import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Biblioteca de medios. Toda imagen del sitio se elige desde acá:
 * ningún campo del CMS acepta URLs externas.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Medio', plural: 'Medios' },
  admin: {
    group: 'Sistema',
    useAsTitle: 'alt',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  upload: {
    // En local los archivos van al disco. En producción el plugin de Vercel Blob
    // intercepta la subida y este directorio queda sin usar.
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Tres tamaños cubren todos los usos del sitio: miniatura de admin,
    // imagen de tarjeta y ancho completo del hero.
    imageSizes: [
      { name: 'thumbnail', width: 400, withoutEnlargement: true },
      { name: 'card', width: 768, withoutEnlargement: true },
      { name: 'hero', width: 1920, withoutEnlargement: true },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      required: true,
      admin: {
        description:
          'Describe la imagen en una frase. Lo leen los lectores de pantalla y los buscadores.',
      },
    },
  ],
}
