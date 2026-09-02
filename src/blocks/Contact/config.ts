import type { Block } from 'payload'

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
  ],
}
