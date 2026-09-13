import type { Block } from 'payload'

import { anchor } from '@/fields/anchor'
import { surface } from '@/fields/surface'
import { richTextContent } from '@/fields/richTextContent'

export const ListBlock: Block = {
  slug: 'list',
  interfaceName: 'ListBlock',
  labels: { singular: 'Lista', plural: 'Listas' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
      admin: {
        description:
          'Para enumeraciones cortas. Si cada ítem necesita una descripción, el bloque adecuado es Servicios.',
      },
    },
    richTextContent({ name: 'intro', label: 'Texto introductorio' }),
    {
      name: 'items',
      type: 'array',
      label: 'Ítems',
      labels: { singular: 'Ítem', plural: 'Ítems' },
      minRows: 1,
      fields: [{ name: 'label', type: 'text', label: 'Texto', required: true }],
    },
    anchor('recursos'),
    surface(),
  ],
}
