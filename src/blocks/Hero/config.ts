import type { Block } from 'payload'

import { anchor } from '@/fields/anchor'
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
      // Área de texto para que el cliente decida dónde corta el titular: cada
      // salto de línea es una línea que entra por separado.
      type: 'textarea',
      label: 'Título',
      required: true,
      admin: {
        rows: 2,
        description: 'Cada salto de línea es un corte del titular. Dos líneas es lo ideal.',
      },
    },
    {
      name: 'highlight',
      type: 'text',
      label: 'Palabra destacada',
      admin: {
        description:
          'Tiene que aparecer tal cual en el título. Se muestra en cursiva con un trazo de aurora debajo.',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
    },
    link({ label: 'Botón principal' }),
    link({ name: 'secondaryCta', label: 'Enlace secundario' }),
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de fondo',
      admin: {
        description:
          'Paisaje horizontal con cielo arriba y la parte oscura abajo, donde va el texto. El punto de enfoque de la imagen decide el encuadre.',
      },
    },
    {
      name: 'foreground',
      type: 'upload',
      relationTo: 'media',
      label: 'Primer plano recortado (opcional)',
      admin: {
        description:
          'La misma imagen de fondo, del mismo tamaño, con el cielo transparente (PNG o WebP). Con ella la aurora pasa por detrás de las montañas.',
      },
    },
    {
      name: 'aurora',
      type: 'checkbox',
      label: 'Aurora animada',
      defaultValue: true,
      admin: {
        description:
          'Cortinas de luz en los colores de la marca, que se mueven lento sobre el cielo.',
      },
    },
    anchor('inicio'),
  ],
}
