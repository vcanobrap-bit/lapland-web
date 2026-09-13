import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateGlobal } from '@/globals/hooks/revalidateGlobal'
import { previewUrl } from '@/lib/preview'

/**
 * Datos transversales al sitio: marca, navegación, contacto, footer, redes y
 * SEO. Viven acá y no dentro de una página porque se reutilizan en cualquier
 * sección; el cliente actualiza su teléfono en un solo lugar y se refleja en el
 * footer y en la sección de contacto.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ajustes del sitio',
  admin: {
    group: 'Configuración',
    preview: () => previewUrl('/'),
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateGlobal('site-settings')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Marca',
          fields: [
            {
              name: 'brand',
              type: 'group',
              label: 'Marca',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Nombre',
                  required: true,
                  admin: { description: 'Se usa como texto alternativo y en el título del sitio.' },
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo',
                  admin: { description: 'Se usa en el encabezado y en el pie. Idealmente SVG.' },
                },
                {
                  name: 'tagline',
                  type: 'text',
                  label: 'Bajada',
                  admin: { description: 'Frase corta que acompaña la marca en el pie.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Navegación',
          fields: [
            {
              name: 'nav',
              type: 'array',
              label: 'Menú',
              labels: { singular: 'Enlace', plural: 'Enlaces' },
              admin: {
                description:
                  'El destino es el ancla de una sección (#servicios) o una URL completa. El ancla de cada sección se define en el bloque correspondiente.',
              },
              fields: [
                { name: 'label', type: 'text', label: 'Texto', required: true },
                { name: 'href', type: 'text', label: 'Destino', required: true },
                {
                  name: 'highlight',
                  type: 'checkbox',
                  label: 'Mostrar como botón',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
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
                { name: 'url', type: 'text', label: 'Enlace', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description:
            'Es lo que se ve cuando alguien comparte el enlace por WhatsApp, LinkedIn o en un buscador.',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'SEO',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Título',
                  admin: {
                    description:
                      'Hasta unos 60 caracteres. Si se deja vacío, usa el nombre de la marca.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Descripción',
                  maxLength: 200,
                  admin: {
                    description: 'Entre 120 y 160 caracteres es lo que muestran los buscadores.',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagen para compartir',
                  admin: { description: 'Proporción 1200 × 630 px.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
