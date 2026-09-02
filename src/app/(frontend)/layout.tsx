import type { Metadata } from 'next'
import { DM_Sans, Fraunces, Inter } from 'next/font/google'
import { draftMode } from 'next/headers'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { SkipLink } from '@/components/layout/SkipLink'
import { toImageSrc } from '@/lib/media'
import { getSiteSettings } from '@/lib/queries/getSiteSettings'

import './globals.css'

/*
 * Las tres familias del design system, con sus roles:
 * Fraunces para titulares editoriales, DM Sans para UI, Inter para cuerpo.
 * Variables las tres, así que cada una es un solo archivo para todos los pesos.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  // Solo el eje de peso. Fraunces trae además SOFT, WONK y opsz; declararlos
  // sumaba 70 KB al archivo y el sistema no varía ninguno de los tres.
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * El título, la descripción y la imagen para compartir salen del CMS: es lo
 * primero que ve alguien cuando le comparten el enlace, y el cliente tiene que
 * poder cambiarlo sin pedir un deploy.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { brand, seo } = await getSiteSettings()
  const title = seo?.title || brand?.name || 'Lapland'
  const shareImage = seo?.image && typeof seo.image === 'object' ? seo.image : null

  return {
    metadataBase: process.env.NEXT_PUBLIC_SERVER_URL
      ? new URL(process.env.NEXT_PUBLIC_SERVER_URL)
      : undefined,
    title,
    description: seo?.description ?? undefined,
    openGraph: {
      type: 'website',
      locale: 'es_CL',
      siteName: brand?.name ?? title,
      title,
      description: seo?.description ?? undefined,
      images: shareImage?.url
        ? [{ url: toImageSrc(shareImage.url), alt: shareImage.alt }]
        : undefined,
    },
    twitter: { card: shareImage ? 'summary_large_image' : 'summary' },
  }
}

/**
 * Los ajustes del sitio se consultan una sola vez acá y bajan por props.
 * Ningún componente de sección consulta Payload por su cuenta.
 */
export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()
  const settings = await getSiteSettings({ draft })

  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable} ${inter.variable}`}>
      <body className="bg-surface text-ink flex min-h-dvh flex-col antialiased">
        <SkipLink />
        {draft ? <PreviewBanner /> : null}
        <Header settings={settings} />
        <div className="flex-1">{children}</div>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
