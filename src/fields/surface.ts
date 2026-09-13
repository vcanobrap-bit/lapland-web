import type { Field } from 'payload'

/**
 * Superficie de la sección.
 *
 * El design system define el off-white como fondo por defecto de todas las
 * piezas y reserva el verde noche como recurso de anclaje. Por eso es una
 * decisión editorial —cuál es el momento que pesa— y no algo que el código
 * pueda alternar automáticamente.
 */
export const surface = (): Field => ({
  name: 'surface',
  type: 'select',
  label: 'Fondo',
  defaultValue: 'primary',
  options: [
    { label: 'Claro', value: 'primary' },
    { label: 'Oscuro (anclaje)', value: 'anchor' },
  ],
  admin: {
    position: 'sidebar',
    description:
      'El fondo oscuro es un recurso de énfasis: una o dos secciones en toda la página. Si se usa en todas, deja de destacar ninguna.',
  },
})
