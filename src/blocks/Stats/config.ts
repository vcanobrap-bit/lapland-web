import type { Block } from 'payload'

import { anchor } from '@/fields/anchor'

import { ONE_TRILLION } from './constants'

/**
 * Cifras en tarjetas, justo después del hero. Siempre sobre blanco: el diseño
 * de las tarjetas (gris claro) no tiene variante oscura.
 */
export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Datos', plural: 'Datos' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Antetítulo',
      admin: {
        description: 'Línea corta sobre el título, en mayúsculas: «Salud mental y trabajo».',
      },
    },
    { name: 'title', type: 'text', label: 'Título' },
    {
      name: 'source',
      type: 'text',
      label: 'Fuente',
      admin: { description: 'Se muestra junto al título: «Fuente: OMS y OIT, 2022».' },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Tarjetas',
      labels: { singular: 'Tarjeta', plural: 'Tarjetas' },
      minRows: 1,
      maxRows: 4,
      admin: {
        description:
          'Cada tarjeta se lee como una frase: lo que va antes, la cifra y lo que significa.',
      },
      fields: [
        {
          name: 'lead',
          type: 'text',
          label: 'Antes de la cifra',
          admin: { description: 'Lo que abre la frase: «En el mundo», «Más de».' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Cifra',
              required: true,
              admin: { description: 'Corta y contundente: «1 de cada 8», «US$ 1 billón».' },
            },
            {
              name: 'highlight',
              type: 'text',
              label: 'Parte en color',
              admin: { description: 'La parte de la cifra que se destaca: «1», «1 billón».' },
            },
            {
              name: 'accent',
              type: 'select',
              label: 'Color',
              defaultValue: 'boreas',
              options: [
                { label: 'Boreas', value: 'boreas' },
                { label: 'Verde', value: 'verde' },
                { label: 'Teal', value: 'teal' },
              ],
            },
          ],
        },
        {
          name: 'label',
          type: 'textarea',
          label: 'Qué significa',
          required: true,
          admin: {
            description:
              'Continúa la frase después de la cifra, en minúscula: «personas vive con…».',
          },
        },
        {
          name: 'visual',
          type: 'select',
          label: 'Gráfico',
          defaultValue: 'none',
          options: [
            { label: 'Sin gráfico', value: 'none' },
            { label: 'Pictograma: 1 de cada 8 personas', value: 'people' },
            { label: 'Costo acumulado del año', value: 'yearCost' },
          ],
        },
        {
          name: 'annualAmount',
          type: 'number',
          label: 'Monto anual (US$)',
          defaultValue: ONE_TRILLION,
          min: 1,
          admin: {
            condition: (_, siblingData) => siblingData?.visual === 'yearCost',
            description:
              'El contador reparte este monto en el año y muestra lo acumulado hasta hoy. Un billón es 1000000000000.',
          },
        },
      ],
    },
    anchor('datos'),
  ],
}
