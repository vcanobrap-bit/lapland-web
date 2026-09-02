import type { Block } from 'payload'

import { anchor } from '@/fields/anchor'
import { richTextContent } from '@/fields/richTextContent'

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Datos', plural: 'Datos' },
  fields: [
    { name: 'title', type: 'text', label: 'Título' },
    richTextContent({ name: 'intro', label: 'Texto introductorio' }),
    {
      name: 'items',
      type: 'array',
      label: 'Cifras',
      labels: { singular: 'Cifra', plural: 'Cifras' },
      minRows: 1,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Cifra',
          required: true,
          admin: { description: 'Corta y contundente: «1 de cada 8», «US$ 1 billón», «40–50 %».' },
        },
        {
          name: 'label',
          type: 'textarea',
          label: 'Qué significa',
          required: true,
          admin: { description: 'Una frase que complete la cifra.' },
        },
        { name: 'source', type: 'text', label: 'Fuente (opcional)' },
      ],
    },
    anchor('datos'),
  ],
}
