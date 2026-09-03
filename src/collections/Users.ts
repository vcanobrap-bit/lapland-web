import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedAdmin } from '@/access/authenticated'

/**
 * Usuarios del panel de administración. No son usuarios finales del sitio:
 * son las personas del cliente que editan el contenido.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  auth: true,
  admin: {
    group: 'Sistema',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    admin: authenticatedAdmin,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true,
    },
  ],
}
