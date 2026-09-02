import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { draftMode } from 'next/headers'

import { Footer } from '@/components/layout/Footer'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { getSiteSettings } from '@/lib/queries/getSiteSettings'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Lapland',
  description: 'Landing autogestionable con Payload CMS.',
}

/**
 * Los ajustes del sitio se consultan una sola vez acá y bajan por props.
 * Ningún componente de sección consulta Payload por su cuenta.
 */
export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()
  const settings = await getSiteSettings({ draft })

  return (
    <html lang="es" className={inter.variable}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        {draft ? <PreviewBanner /> : null}
        <div className="flex-1">{children}</div>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
