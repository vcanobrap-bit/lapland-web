import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { blocks } from '@/blocks'
import { labelBlocks } from '@/globals/hooks/labelBlocks'
import { revalidateGlobal } from '@/globals/hooks/revalidateGlobal'
import { previewUrl } from '@/lib/preview'

/**
 * La home no tiene secciones fijas: tiene una lista de bloques que el cliente
 * arma y ordena. Agregar una sección nueva al sistema es registrar un bloque,
 * no modificar este global.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  admin: {
    group: 'Contenido',
    preview: () => previewUrl('/'),
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  versions: { drafts: true },
  hooks: {
    beforeChange: [labelBlocks],
    afterChange: [revalidateGlobal('home')],
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      label: 'Secciones',
      labels: { singular: 'Sección', plural: 'Secciones' },
      blocks,
      admin: { initCollapsed: true },
    },
  ],
}
