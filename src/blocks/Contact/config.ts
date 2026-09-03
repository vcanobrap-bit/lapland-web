import type { Block } from 'payload'

import { anchor } from '@/fields/anchor'
import { surface } from '@/fields/surface'
import { richTextContent } from '@/fields/richTextContent'

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Contacto', plural: 'Contacto' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
      admin: {
        description:
          'El email, el teléfono y la dirección se editan en Ajustes del sitio, no acá: así se actualizan en un solo lugar.',
      },
    },
    richTextContent({ name: 'text', label: 'Texto' }),
    {
      name: 'showForm',
      type: 'checkbox',
      label: 'Mostrar formulario de contacto',
      defaultValue: true,
      admin: {
        description: 'Los mensajes recibidos aparecen en Contenido → Mensajes.',
      },
    },
    anchor('contacto'),
    surface(),
  ],
}
