import type { Block } from 'payload'

import { richTextContent } from '@/fields/richTextContent'

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: { singular: 'Servicios', plural: 'Servicios' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Servicios',
      labels: { singular: 'Servicio', plural: 'Servicios' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icono',
          admin: { description: 'Idealmente un SVG o PNG cuadrado, con fondo transparente.' },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Título',
          required: true,
        },
        richTextContent({ name: 'description', label: 'Descripción', required: true }),
      ],
    },
  ],
}
