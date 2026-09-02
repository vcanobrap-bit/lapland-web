import type { Block } from 'payload'

import { anchor } from '@/fields/anchor'
import { richTextContent } from '@/fields/richTextContent'

export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: { singular: 'Quiénes Somos', plural: 'Quiénes Somos' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    richTextContent({ required: true }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen',
      admin: { description: 'Sin imagen, el texto ocupa el ancho completo.' },
    },
    anchor('quienes-somos'),
  ],
}
