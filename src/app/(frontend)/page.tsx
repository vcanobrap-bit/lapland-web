import { RenderBlocks } from '@/blocks/RenderBlocks'
import { getHome } from '@/lib/queries/getHome'
import { getSiteSettings } from '@/lib/queries/getSiteSettings'

/**
 * Server Component. Trae el contenido desde la capa de queries y delega todo el
 * render en los bloques: esta página no sabe qué secciones existen.
 */
export default async function HomePage() {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()])

  return (
    <main>
      <RenderBlocks blocks={home.layout} settings={settings} />
    </main>
  )
}
