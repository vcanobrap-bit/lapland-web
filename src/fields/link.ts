import type { Field } from 'payload'

type LinkOptions = {
  name?: string
  label?: string
  required?: boolean
}

/**
 * Par texto + destino para botones. Existe como factory para que cualquier
 * bloque que necesite un botón use exactamente los mismos campos y etiquetas.
 */
export const link = ({
  name = 'cta',
  label = 'Botón',
  required = false,
}: LinkOptions = {}): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Texto del botón',
      required,
    },
    {
      name: 'href',
      type: 'text',
      label: 'Destino',
      required,
      admin: {
        description: 'Ancla o ruta interna (#contacto, /servicios) o URL completa (https://…).',
      },
    },
  ],
})
