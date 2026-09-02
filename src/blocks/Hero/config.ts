import type { Block } from 'payload'

import { link } from '@/fields/link'

export const HeroBlock: Block = {
  slug: 'hero',
  // Hace que Payload genere una interfaz `HeroBlock` con nombre propio en vez de
  // un tipo anónimo dentro de Home. Los componentes tipan sus props con ella.
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heros' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
    },
    link({ label: 'Botón principal' }),
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: {
        description:
          'Sin slides el hero muestra solo el texto. Con uno o más, aparece el carrusel.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          required: true,
        },
        { name: 'title', type: 'text', label: 'Título (opcional)' },
        { name: 'text', type: 'textarea', label: 'Texto (opcional)' },
      ],
    },
  ],
}
