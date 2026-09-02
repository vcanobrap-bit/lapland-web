import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Los errores de tipos rompen el build a propósito: `npm run typecheck` en CI.
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      // Vercel Blob sirve los medios desde su propio dominio en producción.
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
