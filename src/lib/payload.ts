import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

/**
 * Cliente de la Local API. Consulta la base directamente, sin pasar por HTTP:
 * más rápido que hacer fetch a /api y sin problemas de URL absoluta en build.
 *
 * Es el único punto del proyecto que instancia Payload.
 */
export const getPayloadClient = async (): Promise<Payload> => getPayload({ config: configPromise })
