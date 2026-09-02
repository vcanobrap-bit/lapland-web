import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

/**
 * Datos transversales al sitio. Viven acá y no dentro de una página porque
 * se reutilizan en cualquier sección: el cliente actualiza su teléfono en un
 * solo lugar y se refleja en el footer y en la sección de contacto.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ajustes del sitio',
  admin: { group: 'Configuración' },
  access: {
    read: anyone,
    update: authenticated,
  },
  versions: { drafts: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contacto',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Datos de contacto',
              fields: [
                { name: 'email', type: 'email', label: 'Email', required: true },
                { name: 'phone', type: 'text', label: 'Teléfono' },
                { name: 'address', type: 'textarea', label: 'Dirección' },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footer',
              type: 'group',
              label: 'Pie de página',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo',
                },
                {
                  name: 'copyright',
                  type: 'text',
                  label: 'Texto de copyright',
                  admin: { description: 'El año se agrega automáticamente al renderizar.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Redes',
          fields: [
            {
              name: 'socials',
              type: 'array',
              label: 'Redes sociales',
              labels: { singular: 'Red', plural: 'Redes' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Plataforma',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'X', value: 'x' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Enlace',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
