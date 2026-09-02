import type { Block } from 'payload'

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
  ],
}
