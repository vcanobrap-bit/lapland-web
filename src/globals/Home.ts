import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { blocks } from '@/blocks'

/**
 * La home no tiene secciones fijas: tiene una lista de bloques que el cliente
 * arma y ordena. Agregar una sección nueva al sistema es registrar un bloque,
 * no modificar este global.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  admin: { group: 'Contenido' },
  access: {
    read: anyone,
    update: authenticated,
  },
  versions: { drafts: true },
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
