import type { Access, PayloadRequest } from 'payload'

/** Solo usuarios logueados en el admin. No hay registro público. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Variante para `access.admin`, que a diferencia de `Access` no admite filtros `Where`. */
export const authenticatedAdmin = ({ req }: { req: PayloadRequest }): boolean => Boolean(req.user)
