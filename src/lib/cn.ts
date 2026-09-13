/**
 * Une clases ignorando valores falsy. Suficiente para este proyecto:
 * no hay merge de clases en conflicto que justifique traer tailwind-merge.
 */
export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ')
