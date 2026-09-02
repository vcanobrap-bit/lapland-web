import type { Block } from 'payload'

import { anchor } from '@/fields/anchor'
import { richTextContent } from '@/fields/richTextContent'

export const WhatWeDoBlock: Block = {
  slug: 'whatWeDo',
  interfaceName: 'WhatWeDoBlock',
  labels: { singular: 'Qué Hacemos', plural: 'Qué Hacemos' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    richTextContent({ required: true }),
    anchor('que-hacemos'),
  ],
}
