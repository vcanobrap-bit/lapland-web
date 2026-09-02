import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

/**
 * Mensajes recibidos por el formulario de contacto.
 *
 * `create` está cerrado a propósito, incluso para el admin: el único camino de
 * escritura es la Server Action, que usa la Local API con `overrideAccess`. Así
 * el endpoint público /api/submissions no acepta creaciones y el formulario no
 * abre una vía de escritura a la base.
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: 'Mensaje', plural: 'Mensajes' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    description: 'Mensajes enviados desde el formulario de contacto del sitio.',
  },
  access: {
    create: () => false,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Nuevo', value: 'new' },
        { label: 'Leído', value: 'read' },
        { label: 'Respondido', value: 'replied' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true,
      // Lo escribió quien envió el mensaje: es un registro recibido, no
      // contenido editable.
      admin: { readOnly: true },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mensaje',
      required: true,
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}
